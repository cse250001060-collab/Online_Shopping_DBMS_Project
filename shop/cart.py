from decimal import Decimal

from . import db
from .errors import BusinessRuleError, NotFoundError

MAX_ATTEMPTS = 3
RACE_MESSAGES = {"That record already exists", "This cart belongs to a different customer"}


def _open_cart_id(cur, customer_id):
    cur.execute(
        "SELECT DISTINCT cart_id FROM Order_Cart WHERE customer_id = %s AND order_id IS NULL",
        (customer_id,),
    )
    row = cur.fetchone()
    return row["cart_id"] if row else None


def _owned_open_line(cur, customer_id, cart_id, serial_no):
    cur.execute(
        "SELECT * FROM Order_Cart WHERE cart_id = %s AND serial_no = %s FOR UPDATE",
        (cart_id, serial_no),
    )
    line = cur.fetchone()
    if line is None:
        raise NotFoundError("Cart item not found")
    if line["customer_id"] != customer_id:
        raise BusinessRuleError("That item belongs to a different customer's cart")
    if line["order_id"] is not None:
        raise BusinessRuleError("That item is already part of a placed order")
    return line


def add_to_cart(customer_id, product_id, quantity):
    if quantity < 1:
        raise BusinessRuleError("Quantity must be at least 1")
    for attempt in range(MAX_ATTEMPTS):
        try:
            with db.transaction() as cur:
                db.require(cur, "SELECT customer_id FROM Customer WHERE customer_id = %s",
                           (customer_id,), "Customer")
                cart_id = _open_cart_id(cur, customer_id)
                if cart_id is None:
                    cur.execute("SELECT COALESCE(MAX(cart_id), 0) + 1 AS next_id FROM Order_Cart")
                    cart_id = cur.fetchone()["next_id"]
                cur.execute(
                    "INSERT INTO Order_Cart (cart_id, customer_id, product_id, quantity) "
                    "VALUES (%s, %s, %s, %s)",
                    (cart_id, customer_id, product_id, quantity),
                )
                cur.execute(
                    "SELECT * FROM Order_Cart WHERE cart_id = %s AND customer_id = %s "
                    "ORDER BY serial_no DESC LIMIT 1",
                    (cart_id, customer_id),
                )
                return cur.fetchone()
        except BusinessRuleError as exc:
            if attempt < MAX_ATTEMPTS - 1 and str(exc) in RACE_MESSAGES:
                continue
            raise


def update_cart_item(customer_id, cart_id, serial_no, quantity):
    if quantity < 0:
        raise BusinessRuleError("Quantity cannot be negative")
    with db.transaction() as cur:
        _owned_open_line(cur, customer_id, cart_id, serial_no)
        if quantity == 0:
            cur.execute("DELETE FROM Order_Cart WHERE cart_id = %s AND serial_no = %s",
                        (cart_id, serial_no))
            return None
        cur.execute("UPDATE Order_Cart SET quantity = %s WHERE cart_id = %s AND serial_no = %s",
                    (quantity, cart_id, serial_no))
        cur.execute("SELECT * FROM Order_Cart WHERE cart_id = %s AND serial_no = %s",
                    (cart_id, serial_no))
        return cur.fetchone()


def remove_cart_item(customer_id, cart_id, serial_no):
    with db.transaction() as cur:
        _owned_open_line(cur, customer_id, cart_id, serial_no)
        cur.execute("DELETE FROM Order_Cart WHERE cart_id = %s AND serial_no = %s",
                    (cart_id, serial_no))


def view_cart(customer_id):
    items = db.fetch_all(
        "SELECT oc.cart_id, oc.serial_no, oc.product_id, p.product_name, oc.quantity, "
        "oc.unit_price, oc.quantity * oc.unit_price AS subtotal, p.stock_quantity AS available "
        "FROM Order_Cart oc JOIN Product p ON p.product_id = oc.product_id "
        "WHERE oc.customer_id = %s AND oc.order_id IS NULL ORDER BY oc.serial_no",
        (customer_id,),
    )
    total = sum((row["subtotal"] for row in items), Decimal("0.00"))
    return {
        "cart_id": items[0]["cart_id"] if items else None,
        "items": items,
        "total": total,
    }
