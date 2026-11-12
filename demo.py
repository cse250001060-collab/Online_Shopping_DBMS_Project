import setup_db
from shop import cart, catalog, delivery, feedback, inventory, orders, returns


def show(title, value):
    print(f"\n== {title}")
    print(value)


setup_db.rebuild()

show("1. Search: electronics under 1000", [
    (p["product_name"], p["price"], p["available"])
    for p in catalog.search_products(category_name="Electronics", max_price=1000)])

show("2. Add to cart", cart.add_to_cart(1, 1, 2))
cart.add_to_cart(1, 4, 1)
line = cart.add_to_cart(1, 5, 1)

show("3. Change quantity, then remove an item", cart.update_cart_item(1, line["cart_id"], line["serial_no"], 3))
cart.remove_cart_item(1, line["cart_id"], line["serial_no"])

view = cart.view_cart(1)
show("4. Cart total", view["total"])

order = orders.checkout(1)
show("5. Checkout", {k: order[k] for k in ("order_id", "total_amount", "order_status")})

invoice = orders.generate_invoice(order["order_id"])
show("6. Invoice", {k: invoice[k] for k in ("invoice_id", "total_amount", "tax_amount", "payment_status")})

payment = orders.record_payment(invoice["invoice_id"], "UPI", outcome="Success")
show("7. Payment", {k: payment[k] for k in ("payment_id", "amount", "payment_status")})

assigned = delivery.assign_delivery_person(order["order_id"], 1)
show("8. Assigned", assigned["delivery_status"])

for step in ("Picked Up", "Out for Delivery", "Delivered"):
    result = delivery.update_delivery_status(order["order_id"], step)
    show(f"9. {step}", (result["delivery_status"], result["order_status"]))

show("10. Feedback", feedback.submit_feedback(1, order["order_id"], 4, "Quick delivery"))
feedback.submit_feedback(1, order["order_id"], 3, "Packaging could be better")

ret = returns.request_return(1, order["cart_id"], 1, "Damaged item")
show("11. Return requested", ret["return_status"])
show("12. Return reviewed", returns.review_return(order["cart_id"], 1, ret["return_cart_id"], True)["return_status"])
refund = returns.arrange_pickup_and_refund(order["cart_id"], 1, ret["return_cart_id"], 2)
show("13. Pickup and refund", (refund["return_status"], refund["refund_amount"]))

new_product = inventory.add_product(1, "Webcam", 2499, brand="Logitech", initial_stock=10, location_id=1)
show("14. New product", (new_product["product_name"], catalog.get_product(new_product["product_id"])["stock_quantity"]))
show("15. Stock moved to another warehouse", inventory.set_stock_level(new_product["product_id"], 2, 4))
