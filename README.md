# Online Shopping DBMS: Python backend

The database does the policing and Python does the choreography. Triggers keep the data honest (serial numbers, price snapshots, stock, totals, status rules), and each Python function wraps one business transaction so it either fully happens or doesn't happen at all.

## Running it

You need MySQL 8 (or MariaDB 10.5+) running locally.

    pip install -r requirements.txt
    set SHOP_DB_USER=root
    set SHOP_DB_PASSWORD=yourpassword
    python setup_db.py
    python demo.py
    python -m pytest

On macOS or Linux use `export` instead of `set`. `setup_db.py` drops and recreates the database, so don't point it at anything you care about. The tests use their own database, `shopping_dbms_test`, and never touch `shopping_dbms`.

## Where the 15 transactions live

| # | Transaction | Function |
|---|---|---|
| 1 | Browse or search | `catalog.search_products` |
| 2 | Add to cart | `cart.add_to_cart` |
| 3 | Update or remove item | `cart.update_cart_item`, `cart.remove_cart_item` |
| 4 | View cart and total | `cart.view_cart` |
| 5 | Checkout | `orders.checkout` |
| 6 | Generate invoice | `orders.generate_invoice` |
| 7 | Record payment | `orders.record_payment` |
| 8 | Assign delivery person | `delivery.assign_delivery_person` |
| 9 | Update delivery status | `delivery.update_delivery_status` |
| 10 | Submit feedback | `feedback.submit_feedback` |
| 11 | Request a return | `returns.request_return` |
| 12 | Approve or reject a return | `returns.review_return` |
| 13 | Return pickup and refund | `returns.arrange_pickup_and_refund` |
| 14 | Manage products and categories | `inventory.add_product`, `update_product`, `add_category`, `update_category` |
| 15 | Manage inventory locations | `inventory.add_location`, `update_location`, `set_stock_level` |

## What the triggers decide

Python never computes these, so nobody can get them wrong from the application side: `serial_no`, `unit_price` (copied from the product at the moment it's added), `subtotal`, `Orders.total_amount`, invoice total and 18% tax, the payment amount, `feedback_id`, `return_cart_id`, and the product's `stock_quantity` (always the sum of its warehouse rows).

They also refuse anything out of order: editing a placed item, paying twice, assigning delivery before payment, skipping a delivery step, feedback before delivery, returns outside the 10 day window or with an unlisted reason, refunds above the item's value, and warehouses filled past capacity.

## Changing a rule

Most numbers live in `sql/02_triggers.sql`: the tax rate (`0.18` in `trg_invoice_bi`), the return window (`10` in `trg_return_bi`) and the accepted return reasons (same trigger). Edit, then rerun `python setup_db.py`.
