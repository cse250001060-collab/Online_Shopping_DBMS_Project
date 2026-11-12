import pytest

from helpers import delivered_order, raw_read, raw_write, stock_matches_inventory
from shop import BusinessRuleError, NotFoundError, catalog, inventory


def test_categories_are_unique_and_editable():
    created = inventory.add_category("Toys", "Games and toys")
    assert created["category_name"] == "Toys"
    with pytest.raises(BusinessRuleError, match="already exists"):
        inventory.add_category("Toys")
    assert inventory.update_category(created["category_id"], description="Fun")["description"] == "Fun"
    with pytest.raises(BusinessRuleError, match="cannot be edited"):
        inventory.update_category(created["category_id"], bogus_field=99)
    with pytest.raises(NotFoundError):
        inventory.update_category(999, description="x")


def test_new_product_takes_its_stock_from_a_location():
    product = inventory.add_product(1, "Webcam", 2499, brand="Logitech", initial_stock=7, location_id=2)
    assert catalog.get_product(product["product_id"])["stock_quantity"] == 7
    assert inventory.get_product_stock(product["product_id"])[0]["stock_level"] == 7
    with pytest.raises(BusinessRuleError, match="location"):
        inventory.add_product(1, "Monitor", 9999, initial_stock=3)
    with pytest.raises(NotFoundError):
        inventory.add_product(99, "Ghost", 10)
    with pytest.raises(BusinessRuleError):
        inventory.add_product(1, "Negative", -5)


def test_product_updates_cannot_touch_stock_directly():
    updated = inventory.update_product(1, price=549, brand="Logi")
    assert str(updated["price"]) == "549.00" and updated["brand"] == "Logi"
    with pytest.raises(BusinessRuleError, match="cannot be edited"):
        inventory.update_product(1, stock_quantity=500)
    with pytest.raises(BusinessRuleError, match="Product_Inventory"):
        raw_write("UPDATE Product SET stock_quantity = 500 WHERE product_id = 1")
    with pytest.raises(BusinessRuleError, match="Nothing to update"):
        inventory.update_product(1)


def test_stock_levels_keep_the_product_total_in_step():
    result = inventory.set_stock_level(3, 2, 10)
    assert result["product_total"] == 15
    assert inventory.set_stock_level(3, 1, 0)["product_total"] == 10
    assert stock_matches_inventory()
    with pytest.raises(NotFoundError):
        inventory.set_stock_level(999, 1, 1)
    with pytest.raises(NotFoundError):
        inventory.set_stock_level(1, 999, 1)
    with pytest.raises(BusinessRuleError):
        inventory.set_stock_level(1, 1, -4)


def test_location_capacity_is_enforced_both_ways():
    small = inventory.add_location("Mini Depot", "1 Lane", "Ujjain", "MP", "456001", 20)
    inventory.set_stock_level(1, small["location_id"], 15)
    with pytest.raises(BusinessRuleError, match="remaining capacity"):
        inventory.set_stock_level(2, small["location_id"], 6)
    with pytest.raises(BusinessRuleError, match="remaining capacity"):
        inventory.set_stock_level(1, small["location_id"], 25)
    with pytest.raises(BusinessRuleError, match="below the stock"):
        inventory.update_location(small["location_id"], capacity=10)
    assert inventory.update_location(small["location_id"], city="Dewas")["city"] == "Dewas"
    assert [r["product_id"] for r in inventory.get_location_stock(small["location_id"])] == [1]


def test_stock_stays_consistent_through_a_full_lifecycle():
    delivered_order(1, items=((1, 35), (5, 3)))
    assert stock_matches_inventory()
    assert raw_read("SELECT stock_quantity FROM Product WHERE product_id = 1")[0]["stock_quantity"] == 15
