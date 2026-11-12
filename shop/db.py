import contextlib

import mysql.connector

from .config import settings
from .errors import BusinessRuleError, NotFoundError, ShopError

SIGNAL_ERRNO = 1644
CHECK_ERRNOS = {4025, 3819}


def connect(autocommit=False, use_database=True):
    params = {
        "host": settings.host,
        "port": settings.port,
        "user": settings.user,
        "password": settings.password,
        "autocommit": autocommit,
    }
    if use_database:
        params["database"] = settings.database
    return mysql.connector.connect(**params)


def translate(exc):
    errno = getattr(exc, "errno", None)
    if errno == SIGNAL_ERRNO:
        return BusinessRuleError(exc.msg)
    if errno in CHECK_ERRNOS:
        return BusinessRuleError(f"A value breaks a table constraint ({exc.msg})")
    if errno == 1062:
        return BusinessRuleError("That record already exists")
    if errno == 1452:
        return BusinessRuleError("A referenced record does not exist")
    if errno == 1451:
        return BusinessRuleError("The record is still referenced by other data")
    return ShopError(str(exc))


def _rollback(conn):
    try:
        conn.rollback()
    except mysql.connector.Error:
        pass


@contextlib.contextmanager
def transaction(isolation="READ COMMITTED"):
    conn = connect()
    try:
        conn.start_transaction(isolation_level=isolation)
        cur = conn.cursor(dictionary=True)
        yield cur
        conn.commit()
    except mysql.connector.Error as exc:
        _rollback(conn)
        raise translate(exc) from exc
    except BaseException:
        _rollback(conn)
        raise
    finally:
        conn.close()


def fetch_all(sql, params=None):
    conn = connect(autocommit=True)
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params or ())
        return cur.fetchall()
    except mysql.connector.Error as exc:
        raise translate(exc) from exc
    finally:
        conn.close()


def fetch_one(sql, params=None):
    rows = fetch_all(sql, params)
    return rows[0] if rows else None


def require(cur, sql, params, what):
    cur.execute(sql, params)
    row = cur.fetchone()
    if row is None:
        raise NotFoundError(f"{what} not found")
    return row
