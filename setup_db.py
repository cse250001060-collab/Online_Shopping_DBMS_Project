import sys
from pathlib import Path

from shop import db
from shop.config import settings

SQL_DIR = Path(__file__).parent / "sql"
SQL_FILES = ["01_schema.sql", "02_triggers.sql", "03_seed.sql"]


def split_statements(script):
    delimiter = ";"
    buffer = []
    for line in script.splitlines():
        stripped = line.strip()
        if stripped.upper().startswith("DELIMITER "):
            delimiter = stripped.split(None, 1)[1]
            continue
        buffer.append(line)
        if stripped.endswith(delimiter):
            statement = "\n".join(buffer).strip()
            statement = statement[: -len(delimiter)].strip()
            if statement:
                yield statement
            buffer = []
    leftover = "\n".join(buffer).strip()
    if leftover:
        yield leftover


def rebuild(with_seed=True):
    conn = db.connect(autocommit=True, use_database=False)
    try:
        cur = conn.cursor()
        cur.execute(f"DROP DATABASE IF EXISTS `{settings.database}`")
        for name in SQL_FILES[: 3 if with_seed else 2]:
            script = (SQL_DIR / name).read_text().replace("shopping_dbms", settings.database)
            for statement in split_statements(script):
                cur.execute(statement)
    finally:
        conn.close()


if __name__ == "__main__":
    rebuild(with_seed="--no-seed" not in sys.argv)
    print(f"Database '{settings.database}' is ready.")
