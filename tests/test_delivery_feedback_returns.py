from decimal import Decimal
from datetime import date

import pytest

from helpers import delivered_order, paid_order, raw_read, raw_write
from shop import BusinessRuleError, NotFoundError, cart, delivery, feedback, orders, returns


def test_assignment_needs_payment_then_sets_status_and_date():
    cart.add_to_cart(1, 1, 1)
    order = orders.checkout(1)
    invoice = orders.generate_invoice(order["order_id"])
    with pytest.raises(BusinessRuleError, match="must be paid"):
        delivery.assign_delivery_person(order["order_id"], 1)
    orders.record_payment(invoice["invoice_id"], "UPI", outcome="Success")
    assigned = delivery.assign_delivery_person(order["order_id"], 1, date(2030, 1, 5))
    assert assigned["delivery_status"] == "Assigned"
    assert assigned["delivery_person_id"] == 1 and assigned["delivery_date"] == date(2030, 1, 5)
    with pytest.raises(BusinessRuleError, match="already assigned"):
        delivery.assign_delivery_person(order["order_id"], 2)
    with pytest.raises(NotFoundError):
        delivery.assign_delivery_person(999, 1)
    with pytest.raises(NotFoundError):
        delivery.assign_delivery_person(order["order_id"], 999)


def test_delivery_status_moves_forward_one_step_at_a_time():
    order, _ = paid_order()
    oid = order["order_id"]
    with pytest.raises(BusinessRuleError, match="No delivery person"):
        delivery.update_delivery_status(oid, "Assigned")
    delivery.assign_delivery_person(oid, 1)
    with pytest.raises(BusinessRuleError, match="one step at a time"):
        delivery.update_delivery_status(oid, "Delivered")
    shipped = delivery.update_delivery_status(oid, "Picked Up")
    assert shipped["order_status"] == "Shipped"
    with pytest.raises(BusinessRuleError, match="one step at a time"):
        delivery.update_delivery_status(oid, "Assigned")
    delivery.update_delivery_status(oid, "Out for Delivery")
    done = delivery.update_delivery_status(oid, "Delivered")
    assert done["order_status"] == "Delivered" and done["delivery_date"] == date.today()
    with pytest.raises(BusinessRuleError):
        delivery.update_delivery_status(oid, "Teleported")


def test_feedback_allows_several_rows_but_only_after_delivery():
    order, _ = paid_order()
    with pytest.raises(BusinessRuleError, match="has been delivered"):
        feedback.submit_feedback(1, order["order_id"], 5)
    delivered, _ = delivered_order(2, items=((2, 1),))
    first = feedback.submit_feedback(2, delivered["order_id"], 4, "Quick delivery")
    second = feedback.submit_feedback(2, delivered["order_id"], 2, "Box was crushed")
    assert (first["feedback_id"], second["feedback_id"]) == (1, 2)
    with pytest.raises(BusinessRuleError, match="different customer"):
        feedback.submit_feedback(1, delivered["order_id"], 3)
    with pytest.raises(BusinessRuleError):
        feedback.submit_feedback(2, delivered["order_id"], 6)
    with pytest.raises(NotFoundError):
        feedback.submit_feedback(2, 999, 3)


def test_return_request_rules():
    order, _ = delivered_order(1, items=((1, 2), (4, 1)))
    cid = order["cart_id"]
    ret = returns.request_return(1, cid, 1, "Damaged item")
    assert (ret["return_cart_id"], ret["return_status"]) == (1, "Requested")
    with pytest.raises(BusinessRuleError, match="active return"):
        returns.request_return(1, cid, 1, "Defective item")
    with pytest.raises(BusinessRuleError, match="Reason must be one of"):
        returns.request_return(1, cid, 2, "Changed my mind")
    with pytest.raises(BusinessRuleError, match="different customer"):
        returns.request_return(2, cid, 2, "Damaged item")
    with pytest.raises(NotFoundError):
        returns.request_return(1, 99, 1, "Damaged item")


def test_return_needs_a_delivered_order_inside_the_window():
    order, _ = paid_order()
    with pytest.raises(BusinessRuleError, match="Only delivered orders"):
        returns.request_return(1, order["cart_id"], 1, "Damaged item")
    cart.add_to_cart(2, 2, 1)
    with pytest.raises(BusinessRuleError, match="placed order"):
        returns.request_return(2, 2, 1, "Damaged item")
    late, _ = delivered_order(3, items=((2, 1),))
    raw_write("UPDATE Orders SET order_date = NOW() - INTERVAL 11 DAY WHERE order_id = %s",
              (late["order_id"],))
    with pytest.raises(BusinessRuleError, match="window"):
        returns.request_return(3, late["cart_id"], 1, "Damaged item")


def test_review_then_pickup_and_full_refund():
    order, _ = delivered_order(1, items=((1, 2),))
    cid = order["cart_id"]
    ret = returns.request_return(1, cid, 1, "Defective item")
    with pytest.raises(BusinessRuleError, match="Only an approved return"):
        returns.arrange_pickup_and_refund(cid, 1, ret["return_cart_id"], 2)
    assert returns.review_return(cid, 1, ret["return_cart_id"], True)["return_status"] == "Approved"
    with pytest.raises(BusinessRuleError, match="Only a requested return"):
        returns.review_return(cid, 1, ret["return_cart_id"], False)
    with pytest.raises(BusinessRuleError, match="at most the value"):
        returns.arrange_pickup_and_refund(cid, 1, ret["return_cart_id"], 2, refund_amount=5000)
    done = returns.arrange_pickup_and_refund(cid, 1, ret["return_cart_id"], 2)
    assert done["return_status"] == "Refunded" and done["delivery_person_id"] == 2
    assert done["refund_amount"] == Decimal("998.00")
    with pytest.raises(BusinessRuleError, match="closed"):
        raw_write("UPDATE Return_Cart SET reason = 'Damaged item' WHERE cart_id = %s", (cid,))


def test_rejected_return_can_be_filed_again():
    order, _ = delivered_order(1, items=((1, 1),))
    cid = order["cart_id"]
    first = returns.request_return(1, cid, 1, "Damaged item")
    assert returns.review_return(cid, 1, first["return_cart_id"], False)["return_status"] == "Rejected"
    again = returns.request_return(1, cid, 1, "Missing parts")
    assert again["return_cart_id"] == 2
    assert raw_read("SELECT COUNT(*) AS n FROM Return_Cart")[0]["n"] == 2


def test_return_status_cannot_skip_steps():
    order, _ = delivered_order(1, items=((1, 1),))
    ret = returns.request_return(1, order["cart_id"], 1, "Damaged item")
    with pytest.raises(BusinessRuleError, match="approved or rejected"):
        raw_write("UPDATE Return_Cart SET return_status = 'Refunded', refund_amount = 10 "
                  "WHERE cart_id = %s", (order["cart_id"],))
    with pytest.raises(BusinessRuleError, match="approved return"):
        raw_write("UPDATE Return_Cart SET delivery_person_id = 1 WHERE cart_id = %s", (order["cart_id"],))
    assert ret["refund_amount"] == Decimal("0.00")
