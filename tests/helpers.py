from shop import cart, db, delivery, orders


def raw_read(sql, params=()):
    return db.fetch_all(sql, params)


def raw_write(sql, params=()):
    with db.transaction() as cur:
        cur.execute(sql, params)


def paid_order(customer_id=1, items=((1, 2),)):
    for product_id, quantity in items:
        cart.add_to_cart(customer_id, product_id, quantity)
    order = orders.checkout(customer_id)
    invoice = orders.generate_invoice(order["order_id"])
    orders.record_payment(invoice["invoice_id"], "UPI", outcome="Success")
    return order, invoice


def delivered_order(customer_id=1, items=((1, 2),)):
    order, invoice = paid_order(customer_id, items)
    delivery.assign_delivery_person(order["order_id"], 1)
    for step in ("Picked Up", "Out for Delivery", "Delivered"):
        delivery.update_delivery_status(order["order_id"], step)
    return order, invoice


def stock_matches_inventory():
    rows = raw_read(
        "SELECT p.product_id, p.stock_quantity, COALESCE(SUM(pi.stock_level), 0) AS summed "
        "FROM Product p LEFT JOIN Product_Inventory pi ON pi.product_id = p.product_id "
        "GROUP BY p.product_id, p.stock_quantity"
    )
    return all(r["stock_quantity"] == r["summed"] for r in rows)
