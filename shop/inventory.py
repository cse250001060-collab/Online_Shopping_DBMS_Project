from . import db
from .errors import BusinessRuleError

PRODUCT_FIELDS = {"product_name", "price", "description", "brand", "category_id"}
CATEGORY_FIELDS = {"category_name", "description"}
LOCATION_FIELDS = {"warehouse_name", "street", "city", "state", "pincode", "capacity"}


def _update(cur, table, key_column, key_value, allowed, fields):
    unknown = set(fields) - allowed
    if unknown:
        raise BusinessRuleError(f"These fields cannot be edited here: {', '.join(sorted(unknown))}")
    if not fields:
        raise BusinessRuleError("Nothing to update")
    assignments = ", ".join(f"{column} = %s" for column in fields)
    cur.execute(f"UPDATE {table} SET {assignments} WHERE {key_column} = %s",
                [*fields.values(), key_value])
    cur.execute(f"SELECT * FROM {table} WHERE {key_column} = %s", (key_value,))
    return cur.fetchone()


def add_category(category_name, description=None):
    with db.transaction() as cur:
        cur.execute("INSERT INTO Product_Category (category_name, description) VALUES (%s, %s)",
                    (category_name, description))
        cur.execute("SELECT * FROM Product_Category WHERE category_id = %s", (cur.lastrowid,))
        return cur.fetchone()


def update_category(category_id, **fields):
    with db.transaction() as cur:
        db.require(cur, "SELECT category_id FROM Product_Category WHERE category_id = %s FOR UPDATE",
                   (category_id,), "Category")
        return _update(cur, "Product_Category", "category_id", category_id, CATEGORY_FIELDS, fields)


def add_product(category_id, product_name, price, description=None, brand=None,
                initial_stock=0, location_id=None):
    with db.transaction() as cur:
        db.require(cur, "SELECT category_id FROM Product_Category WHERE category_id = %s",
                   (category_id,), "Category")
        cur.execute(
            "INSERT INTO Product (category_id, product_name, price, description, brand) "
            "VALUES (%s, %s, %s, %s, %s)",
            (category_id, product_name, price, description, brand),
        )
        product_id = cur.lastrowid
        if initial_stock:
            if location_id is None:
                raise BusinessRuleError("Choose a location to hold the initial stock")
            cur.execute(
                "INSERT INTO Product_Inventory (product_id, location_id, stock_level) "
                "VALUES (%s, %s, %s)",
                (product_id, location_id, initial_stock),
            )
        cur.execute("SELECT * FROM Product WHERE product_id = %s", (product_id,))
        return cur.fetchone()


def update_product(product_id, **fields):
    with db.transaction() as cur:
        db.require(cur, "SELECT product_id FROM Product WHERE product_id = %s FOR UPDATE",
                   (product_id,), "Product")
        return _update(cur, "Product", "product_id", product_id, PRODUCT_FIELDS, fields)


def add_location(warehouse_name, street, city, state, pincode, capacity):
    with db.transaction() as cur:
        cur.execute(
            "INSERT INTO Inventory_Location (warehouse_name, street, city, state, pincode, capacity) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (warehouse_name, street, city, state, pincode, capacity),
        )
        cur.execute("SELECT * FROM Inventory_Location WHERE location_id = %s", (cur.lastrowid,))
        return cur.fetchone()


def update_location(location_id, **fields):
    with db.transaction() as cur:
        db.require(cur, "SELECT location_id FROM Inventory_Location WHERE location_id = %s FOR UPDATE",
                   (location_id,), "Location")
        return _update(cur, "Inventory_Location", "location_id", location_id, LOCATION_FIELDS, fields)


def set_stock_level(product_id, location_id, stock_level):
    with db.transaction() as cur:
        db.require(cur, "SELECT product_id FROM Product WHERE product_id = %s FOR UPDATE",
                   (product_id,), "Product")
        db.require(cur, "SELECT location_id FROM Inventory_Location WHERE location_id = %s",
                   (location_id,), "Location")
        cur.execute(
            "SELECT stock_level FROM Product_Inventory WHERE product_id = %s AND location_id = %s FOR UPDATE",
            (product_id, location_id),
        )
        if cur.fetchone():
            cur.execute(
                "UPDATE Product_Inventory SET stock_level = %s WHERE product_id = %s AND location_id = %s",
                (stock_level, product_id, location_id),
            )
        else:
            cur.execute(
                "INSERT INTO Product_Inventory (product_id, location_id, stock_level) VALUES (%s, %s, %s)",
                (product_id, location_id, stock_level),
            )
        cur.execute("SELECT stock_quantity FROM Product WHERE product_id = %s", (product_id,))
        total = cur.fetchone()["stock_quantity"]
        return {"product_id": product_id, "location_id": location_id,
                "stock_level": stock_level, "product_total": total}


def get_product_stock(product_id):
    return db.fetch_all(
        "SELECT l.location_id, l.warehouse_name, pi.stock_level FROM Product_Inventory pi "
        "JOIN Inventory_Location l ON l.location_id = pi.location_id "
        "WHERE pi.product_id = %s ORDER BY l.location_id",
        (product_id,),
    )


def get_location_stock(location_id):
    return db.fetch_all(
        "SELECT p.product_id, p.product_name, pi.stock_level FROM Product_Inventory pi "
        "JOIN Product p ON p.product_id = pi.product_id "
        "WHERE pi.location_id = %s ORDER BY p.product_id",
        (location_id,),
    )
