import random

from . import db
from .config import settings
from .errors import BusinessRuleError, NotFoundError


def simulate_gateway(payment_mode):
    return "Failed" if random.random() < settings.payment_failure_rate else "Success"


def get_order(order_id):
    return db.fetch_one("SELECT * FROM Orders WHERE order_id = %s", (order_id,))


def checkout(customer_id):
    with db.transaction() as cur:
        db.require(cur, "SELECT customer_id FROM Customer WHERE customer_id = %s",
                   (customer_id,), "Customer")
        cur.execute(
            "SELECT cart_id, serial_no FROM Order_Cart "
            "WHERE customer_id = %s AND order_id IS NULL ORDER BY serial_no FOR UPDATE",
            (customer_id,),
        )
        lines = cur.fetchall()
        if not lines:
            raise BusinessRuleError("The cart is empty")
        cart_id = lines[0]["cart_id"]

        cur.execute(
            "SELECT p.product_name, SUM(oc.quantity) AS wanted, p.stock_quantity AS available "
            "FROM Order_Cart oc JOIN Product p ON p.product_id = oc.product_id "
            "WHERE oc.cart_id = %s AND oc.order_id IS NULL "
            "GROUP BY p.product_id, p.product_name, p.stock_quantity "
            "HAVING SUM(oc.quantity) > p.stock_quantity",
            (cart_id,),
        )
        short = cur.fetchall()
        if short:
            detail = ", ".join(
                f"{r['product_name']} (wanted {r['wanted']}, available {r['available']})"
                for r in short
            )
            raise BusinessRuleError(f"Not enough stock for: {detail}")

        cur.execute("INSERT INTO Orders (customer_id) VALUES (%s)", (customer_id,))
        order_id = cur.lastrowid
        cur.execute("UPDATE Order_Cart SET order_id = %s WHERE cart_id = %s AND order_id IS NULL",
                    (order_id, cart_id))
        cur.execute("SELECT * FROM Orders WHERE order_id = %s", (order_id,))
        order = cur.fetchone()
        order["cart_id"] = cart_id
        return order


def generate_invoice(order_id):
    with db.transaction() as cur:
        db.require(cur, "SELECT order_id FROM Orders WHERE order_id = %s FOR UPDATE",
                   (order_id,), "Order")
        cur.execute("SELECT invoice_id FROM Invoice_Bill WHERE order_id = %s", (order_id,))
        if cur.fetchone():
            raise BusinessRuleError("This order already has an invoice")
        cur.execute("INSERT INTO Invoice_Bill (order_id) VALUES (%s)", (order_id,))
        cur.execute("SELECT * FROM Invoice_Bill WHERE invoice_id = %s", (cur.lastrowid,))
        return cur.fetchone()


def record_payment(invoice_id, payment_mode, outcome=None):
    outcome = outcome or simulate_gateway(payment_mode)
    if outcome not in ("Success", "Failed"):
        raise BusinessRuleError("Outcome must be 'Success' or 'Failed'")
    with db.transaction() as cur:
        invoice = db.require(
            cur, "SELECT payment_status FROM Invoice_Bill WHERE invoice_id = %s FOR UPDATE",
            (invoice_id,), "Invoice")
        if invoice["payment_status"] == "Paid":
            raise BusinessRuleError("This invoice has already been paid")

        cur.execute("SELECT payment_id, payment_status FROM Payment WHERE invoice_id = %s FOR UPDATE",
                    (invoice_id,))
        existing = cur.fetchone()
        if existing is None:
            cur.execute("INSERT INTO Payment (invoice_id, payment_mode) VALUES (%s, %s)",
                        (invoice_id, payment_mode))
            payment_id = cur.lastrowid
        elif existing["payment_status"] == "Failed":
            payment_id = existing["payment_id"]
            cur.execute(
                "UPDATE Payment SET payment_mode = %s, payment_date = CURRENT_TIMESTAMP, "
                "payment_status = 'Pending' WHERE payment_id = %s",
                (payment_mode, payment_id),
            )
        else:
            raise BusinessRuleError("A payment for this invoice is already in progress")

        cur.execute("UPDATE Payment SET payment_status = %s WHERE payment_id = %s",
                    (outcome, payment_id))
        cur.execute("SELECT * FROM Payment WHERE payment_id = %s", (payment_id,))
        return cur.fetchone()
