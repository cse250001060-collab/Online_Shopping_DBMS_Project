from . import db
from .errors import BusinessRuleError


def _fetch_return(cur, cart_id, serial_no, return_cart_id, lock=False):
    sql = ("SELECT * FROM Return_Cart WHERE cart_id = %s AND serial_no = %s "
           "AND return_cart_id = %s")
    if lock:
        sql += " FOR UPDATE"
    return db.require(cur, sql, (cart_id, serial_no, return_cart_id), "Return")


def request_return(customer_id, cart_id, serial_no, reason):
    with db.transaction() as cur:
        line = db.require(
            cur, "SELECT customer_id FROM Order_Cart WHERE cart_id = %s AND serial_no = %s FOR UPDATE",
            (cart_id, serial_no), "Order item")
        if line["customer_id"] != customer_id:
            raise BusinessRuleError("That item belongs to a different customer")
        cur.execute("INSERT INTO Return_Cart (cart_id, serial_no, reason) VALUES (%s, %s, %s)",
                    (cart_id, serial_no, reason))
        cur.execute(
            "SELECT * FROM Return_Cart WHERE cart_id = %s AND serial_no = %s "
            "ORDER BY return_cart_id DESC LIMIT 1",
            (cart_id, serial_no),
        )
        return cur.fetchone()


def review_return(cart_id, serial_no, return_cart_id, approve):
    with db.transaction() as cur:
        current = _fetch_return(cur, cart_id, serial_no, return_cart_id, lock=True)
        if current["return_status"] != "Requested":
            raise BusinessRuleError(
                f"Only a requested return can be reviewed (this one is {current['return_status']})")
        cur.execute(
            "UPDATE Return_Cart SET return_status = %s "
            "WHERE cart_id = %s AND serial_no = %s AND return_cart_id = %s",
            ("Approved" if approve else "Rejected", cart_id, serial_no, return_cart_id),
        )
        return _fetch_return(cur, cart_id, serial_no, return_cart_id)


def arrange_pickup_and_refund(cart_id, serial_no, return_cart_id, delivery_person_id,
                              refund_amount=None):
    with db.transaction() as cur:
        current = _fetch_return(cur, cart_id, serial_no, return_cart_id, lock=True)
        if current["return_status"] != "Approved":
            raise BusinessRuleError(
                f"Only an approved return can be picked up and refunded (this one is {current['return_status']})")
        db.require(cur, "SELECT delivery_person_id FROM Delivery_Person WHERE delivery_person_id = %s",
                   (delivery_person_id,), "Delivery person")
        line = db.require(
            cur, "SELECT product_id, quantity, subtotal FROM Order_Cart WHERE cart_id = %s AND serial_no = %s",
            (cart_id, serial_no), "Order item")
        refund = line["subtotal"] if refund_amount is None else refund_amount

        cur.execute(
            "UPDATE Return_Cart SET delivery_person_id = %s "
            "WHERE cart_id = %s AND serial_no = %s AND return_cart_id = %s",
            (delivery_person_id, cart_id, serial_no, return_cart_id),
        )
        cur.execute(
            "UPDATE Return_Cart SET return_status = 'Refunded', refund_amount = %s "
            "WHERE cart_id = %s AND serial_no = %s AND return_cart_id = %s",
            (refund, cart_id, serial_no, return_cart_id),
        )

        cur.execute("SELECT location_id, capacity FROM Inventory_Location ORDER BY location_id FOR UPDATE")
        locations = cur.fetchall()
        remaining = line["quantity"]
        for location in locations:
            location_id = location["location_id"]
            cur.execute(
                "SELECT product_id, stock_level FROM Product_Inventory WHERE location_id = %s FOR UPDATE",
                (location_id,),
            )
            stock = {row["product_id"]: row["stock_level"] for row in cur.fetchall()}
            quantity = min(remaining, location["capacity"] - sum(stock.values()))
            if quantity <= 0:
                continue

            product_id = line["product_id"]
            if product_id in stock:
                cur.execute(
                    "UPDATE Product_Inventory SET stock_level = stock_level + %s "
                    "WHERE product_id = %s AND location_id = %s",
                    (quantity, product_id, location_id),
                )
            else:
                cur.execute(
                    "INSERT INTO Product_Inventory (product_id, location_id, stock_level) VALUES (%s, %s, %s)",
                    (product_id, location_id, quantity),
                )
            remaining -= quantity
            if remaining == 0:
                break
        if remaining > 0:
            raise BusinessRuleError("Not enough warehouse space for the returned items")
        return _fetch_return(cur, cart_id, serial_no, return_cart_id)
