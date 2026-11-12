from decimal import Decimal

import pytest

from helpers import paid_order, raw_read, raw_write, stock_matches_inventory
from shop import BusinessRuleError, NotFoundError, cart, db, orders


def test_checkout_links_existing_rows_and_allocates_stock():
    cart.add_to_cart(1, 1, 35)
    cart.add_to_cart(1, 4, 1)
    rows_before = raw_read("SELECT COUNT(*) AS n FROM Order_Cart")[0]["n"]
    order = orders.checkout(1)
    assert raw_read("SELECT COUNT(*) AS n FROM Order_Cart")[0]["n"] == rows_before
    linked = raw_read("SELECT order_id FROM Order_Cart WHERE cart_id = %s", (order["cart_id"],))
    assert {r["order_id"] for r in linked} == {order["order_id"]}
    assert order["total_amount"] == Decimal("18715.00") and order["order_status"] == "Placed"
    levels = {r["location_id"]: r["stock_level"] for r in raw_read(
        "SELECT location_id, stock_level FROM Product_Inventory WHERE product_id = 1")}
    assert levels == {1: 0, 2: 15}
    assert stock_matches_inventory()
    assert cart.view_cart(1)["items"] == []


def test_checkout_rejects_empty_cart():
    with pytest.raises(BusinessRuleError, match="empty"):
        orders.checkout(1)
    with pytest.raises(NotFoundError):
        orders.checkout(999)


def test_checkout_reports_shortage_and_changes_nothing():
    cart.add_to_cart(1, 3, 4)
    cart.add_to_cart(2, 3, 2)
    orders.checkout(1)
    with pytest.raises(BusinessRuleError, match="Mechanical Keyboard"):
        orders.checkout(2)
    assert raw_read("SELECT COUNT(*) AS n FROM Orders WHERE customer_id = 2")[0]["n"] == 0
    assert len(cart.view_cart(2)["items"]) == 1
    assert stock_matches_inventory()


def test_triggers_roll_back_a_partial_checkout_even_without_the_python_check():
    cart.add_to_cart(1, 3, 4)
    cart.add_to_cart(2, 2, 1)
    cart.add_to_cart(2, 3, 2)
    orders.checkout(1)
    with pytest.raises(BusinessRuleError, match="Insufficient stock"):
        with db.transaction() as cur:
            cur.execute("INSERT INTO Orders (customer_id) VALUES (2)")
            cur.execute("UPDATE Order_Cart SET order_id = %s WHERE customer_id = 2 AND order_id IS NULL",
                        (cur.lastrowid,))
    assert raw_read("SELECT stock_quantity FROM Product WHERE product_id = 2")[0]["stock_quantity"] == 100
    assert raw_read("SELECT COUNT(*) AS n FROM Order_Cart WHERE customer_id = 2 AND order_id IS NULL")[0]["n"] == 2
    assert stock_matches_inventory()


def test_invoice_has_tax_and_is_one_per_order():
    order, _ = None, None
    cart.add_to_cart(1, 1, 2)
    order = orders.checkout(1)
    invoice = orders.generate_invoice(order["order_id"])
    assert invoice["total_amount"] == Decimal("998.00")
    assert invoice["tax_amount"] == Decimal("179.64")
    assert invoice["payment_status"] == "Unpaid"
    with pytest.raises(BusinessRuleError, match="already has an invoice"):
        orders.generate_invoice(order["order_id"])
    with pytest.raises(NotFoundError):
        orders.generate_invoice(999)


def test_empty_order_cannot_be_invoiced():
    raw_write("INSERT INTO Orders (customer_id) VALUES (1)")
    with pytest.raises(BusinessRuleError, match="no items"):
        orders.generate_invoice(1)


def test_successful_payment_marks_invoice_paid():
    order, invoice = paid_order()
    payment = raw_read("SELECT * FROM Payment WHERE invoice_id = %s", (invoice["invoice_id"],))[0]
    assert payment["payment_status"] == "Success"
    assert payment["amount"] == Decimal("1177.64")
    assert raw_read("SELECT payment_status FROM Invoice_Bill")[0]["payment_status"] == "Paid"
    with pytest.raises(BusinessRuleError, match="already been paid"):
        orders.record_payment(invoice["invoice_id"], "Card", outcome="Success")


def test_failed_payment_can_be_retried():
    cart.add_to_cart(1, 1, 1)
    invoice = orders.generate_invoice(orders.checkout(1)["order_id"])
    failed = orders.record_payment(invoice["invoice_id"], "Card", outcome="Failed")
    assert failed["payment_status"] == "Failed"
    assert raw_read("SELECT payment_status FROM Invoice_Bill")[0]["payment_status"] == "Unpaid"
    retry = orders.record_payment(invoice["invoice_id"], "UPI", outcome="Success")
    assert retry["payment_id"] == failed["payment_id"]
    assert (retry["payment_mode"], retry["payment_status"]) == ("UPI", "Success")
    assert raw_read("SELECT payment_status FROM Invoice_Bill")[0]["payment_status"] == "Paid"


def test_payment_input_is_validated():
    with pytest.raises(NotFoundError):
        orders.record_payment(999, "UPI", outcome="Success")
    cart.add_to_cart(1, 1, 1)
    invoice = orders.generate_invoice(orders.checkout(1)["order_id"])
    with pytest.raises(BusinessRuleError):
        orders.record_payment(invoice["invoice_id"], "UPI", outcome="Maybe")
    with pytest.raises(BusinessRuleError):
        orders.record_payment(invoice["invoice_id"], "Cheque", outcome="Success")
    assert orders.simulate_gateway("UPI") in ("Success", "Failed")


def test_money_fields_cannot_be_tampered_with():
    _, invoice = paid_order()
    with pytest.raises(BusinessRuleError, match="cannot be changed"):
        raw_write("UPDATE Invoice_Bill SET total_amount = 1 WHERE invoice_id = %s", (invoice["invoice_id"],))
    with pytest.raises(BusinessRuleError, match="cannot be modified"):
        raw_write("UPDATE Payment SET payment_mode = 'COD' WHERE invoice_id = %s", (invoice["invoice_id"],))
