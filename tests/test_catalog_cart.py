from decimal import Decimal

import pytest

from helpers import raw_read, raw_write
from shop import BusinessRuleError, NotFoundError, cart, catalog, inventory, orders


def test_search_filters_and_availability():
    assert [p["product_name"] for p in catalog.search_products(name="mouse")] == ["Wireless Mouse"]
    electronics = catalog.search_products(category_name="Electronics")
    assert {p["category_name"] for p in electronics} == {"Electronics"}
    assert len(electronics) == 3
    cheap = catalog.search_products(min_price=300, max_price=700)
    assert {p["product_name"] for p in cheap} == {"Wireless Mouse", "Steel Water Bottle"}
    inventory.set_stock_level(3, 1, 0)
    in_stock = {p["product_name"] for p in catalog.search_products(in_stock_only=True)}
    assert "Mechanical Keyboard" not in in_stock
    assert catalog.search_products(name="mouse")[0]["available"] == 50
    assert len(catalog.search_products(limit=2)) == 2


def test_add_to_cart_sets_serial_price_and_subtotal():
    first = cart.add_to_cart(1, 1, 2)
    second = cart.add_to_cart(1, 2, 3)
    assert (first["cart_id"], first["serial_no"]) == (1, 1)
    assert (second["cart_id"], second["serial_no"]) == (1, 2)
    assert first["order_id"] is None
    assert first["unit_price"] == Decimal("499.00")
    assert first["subtotal"] == Decimal("998.00")
    other = cart.add_to_cart(2, 1, 1)
    assert other["cart_id"] == 2 and other["serial_no"] == 1


def test_unit_price_is_a_snapshot():
    cart.add_to_cart(1, 1, 1)
    inventory.update_product(1, price=999)
    assert cart.view_cart(1)["items"][0]["unit_price"] == Decimal("499.00")


def test_add_rejects_more_than_available_stock():
    with pytest.raises(BusinessRuleError, match="available"):
        cart.add_to_cart(1, 3, 6)
    cart.add_to_cart(1, 3, 3)
    with pytest.raises(BusinessRuleError, match="available"):
        cart.add_to_cart(1, 3, 3)
    with pytest.raises(BusinessRuleError):
        cart.add_to_cart(1, 1, 0)
    with pytest.raises(BusinessRuleError, match="does not exist"):
        cart.add_to_cart(1, 999, 1)
    with pytest.raises(NotFoundError):
        cart.add_to_cart(999, 1, 1)


def test_update_quantity_recomputes_subtotal_and_checks_stock():
    line = cart.add_to_cart(1, 3, 2)
    updated = cart.update_cart_item(1, line["cart_id"], line["serial_no"], 4)
    assert updated["quantity"] == 4 and updated["subtotal"] == Decimal("13996.00")
    with pytest.raises(BusinessRuleError, match="available"):
        cart.update_cart_item(1, line["cart_id"], line["serial_no"], 6)
    lowered = cart.update_cart_item(1, line["cart_id"], line["serial_no"], 1)
    assert lowered["subtotal"] == Decimal("3499.00")


def test_update_to_zero_removes_the_row():
    line = cart.add_to_cart(1, 1, 2)
    assert cart.update_cart_item(1, line["cart_id"], line["serial_no"], 0) is None
    assert cart.view_cart(1)["items"] == []


def test_cart_items_are_protected():
    line = cart.add_to_cart(1, 1, 2)
    with pytest.raises(BusinessRuleError, match="different customer"):
        cart.update_cart_item(2, line["cart_id"], line["serial_no"], 1)
    with pytest.raises(BusinessRuleError, match="different customer"):
        cart.remove_cart_item(2, line["cart_id"], line["serial_no"])
    with pytest.raises(NotFoundError):
        cart.remove_cart_item(1, 99, 99)
    cart.remove_cart_item(1, line["cart_id"], line["serial_no"])
    assert cart.view_cart(1)["items"] == []


def test_view_cart_totals():
    empty = cart.view_cart(1)
    assert empty == {"cart_id": None, "items": [], "total": Decimal("0.00")}
    cart.add_to_cart(1, 1, 2)
    cart.add_to_cart(1, 4, 1)
    view = cart.view_cart(1)
    assert [i["subtotal"] for i in view["items"]] == [Decimal("998.00"), Decimal("1250.00")]
    assert view["total"] == Decimal("2248.00")


def test_placed_items_cannot_be_edited_or_removed():
    line = cart.add_to_cart(1, 1, 2)
    orders.checkout(1)
    with pytest.raises(BusinessRuleError, match="placed order"):
        cart.update_cart_item(1, line["cart_id"], line["serial_no"], 1)
    with pytest.raises(BusinessRuleError, match="placed order"):
        raw_write("DELETE FROM Order_Cart WHERE cart_id = %s AND serial_no = %s",
                  (line["cart_id"], line["serial_no"]))
    with pytest.raises(BusinessRuleError, match="cannot be changed"):
        raw_write("UPDATE Order_Cart SET quantity = 9 WHERE cart_id = %s", (line["cart_id"],))


def test_one_open_cart_per_customer_and_cart_ownership():
    cart.add_to_cart(1, 1, 1)
    with pytest.raises(BusinessRuleError, match="different customer"):
        raw_write("INSERT INTO Order_Cart (cart_id, customer_id, product_id, quantity) "
                  "VALUES (1, 2, 1, 1)")
    with pytest.raises(BusinessRuleError, match="different open cart"):
        raw_write("INSERT INTO Order_Cart (cart_id, customer_id, product_id, quantity) "
                  "VALUES (50, 1, 1, 1)")
    orders.checkout(1)
    again = cart.add_to_cart(1, 1, 1)
    assert again["cart_id"] == 2 and again["serial_no"] == 1
    assert raw_read("SELECT COUNT(*) AS n FROM Order_Cart")[0]["n"] == 2
