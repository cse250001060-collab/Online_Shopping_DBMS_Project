from . import db
from .errors import BusinessRuleError


def submit_feedback(customer_id, order_id, rating, comments=None):
    with db.transaction() as cur:
        order = db.require(cur, "SELECT customer_id FROM Orders WHERE order_id = %s FOR UPDATE",
                           (order_id,), "Order")
        if order["customer_id"] != customer_id:
            raise BusinessRuleError("That order belongs to a different customer")
        cur.execute("INSERT INTO Feedback (order_id, rating, comments) VALUES (%s, %s, %s)",
                    (order_id, rating, comments))
        cur.execute("SELECT * FROM Feedback WHERE order_id = %s ORDER BY feedback_id DESC LIMIT 1",
                    (order_id,))
        return cur.fetchone()
