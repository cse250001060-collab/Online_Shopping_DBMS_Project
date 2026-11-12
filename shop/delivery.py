from datetime import date, timedelta

from . import db
from .errors import BusinessRuleError

DELIVERY_STEPS = ["Assigned", "Picked Up", "Out for Delivery", "Delivered"]


def assign_delivery_person(order_id, delivery_person_id, delivery_date=None):
    delivery_date = delivery_date or date.today() + timedelta(days=3)
    with db.transaction() as cur:
        db.require(cur, "SELECT order_id FROM Orders WHERE order_id = %s FOR UPDATE",
                   (order_id,), "Order")
        db.require(cur, "SELECT delivery_person_id FROM Delivery_Person WHERE delivery_person_id = %s",
                   (delivery_person_id,), "Delivery person")
        cur.execute(
            "UPDATE Orders SET delivery_person_id = %s, delivery_date = %s, "
            "delivery_status = 'Assigned' WHERE order_id = %s",
            (delivery_person_id, delivery_date, order_id),
        )
        cur.execute("SELECT * FROM Orders WHERE order_id = %s", (order_id,))
        return cur.fetchone()


def update_delivery_status(order_id, new_status):
    if new_status not in DELIVERY_STEPS:
        raise BusinessRuleError(f"Status must be one of: {', '.join(DELIVERY_STEPS)}")
    with db.transaction() as cur:
        db.require(cur, "SELECT order_id FROM Orders WHERE order_id = %s FOR UPDATE",
                   (order_id,), "Order")
        cur.execute("UPDATE Orders SET delivery_status = %s WHERE order_id = %s",
                    (new_status, order_id))
        cur.execute("SELECT * FROM Orders WHERE order_id = %s", (order_id,))
        return cur.fetchone()
