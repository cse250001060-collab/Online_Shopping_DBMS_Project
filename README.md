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

## FastAPI backend

Install dependencies, make sure the project `.env` has the database connection settings, and start the API from the project root:

    python -m pip install -r requirements.txt
    python -m uvicorn main:app --reload

The API docs are available at `http://127.0.0.1:8000/docs`. The default CORS origins cover `localhost` and `127.0.0.1` on ports 3000, 3001, and 5173; set `SHOP_CORS_ORIGINS` to a comma-separated list to change them. This API currently has no authentication, so keep it local until authentication and authorization are added.

The admin return queue is available at `GET /returns?return_status=Requested`. Omit `return_status` to list all return records, or filter by `Approved`, `Rejected`, or `Refunded`. Each result includes the composite return IDs needed by the review route.
Customers can see their own return history with `GET /customers/{customer_id}/returns`; the frontend shows those records in **My Orders & Returns → My Return Cart**.
The manager view loads all orders from `GET /orders`. Managers choose a delivery person before assigning an order, then advance its delivery status one step at a time. Customers can only view tracking and refresh it. For approved returns, managers choose a delivery person with `PATCH /returns/{cart_id}/{serial_no}/{return_cart_id}/delivery-assignment`, then issue the refund as a separate action. The manager queue uses `GET /manager/returns` so it can show assigned couriers while the compact `GET /returns` list keeps its five fields.
Customer order history, including order lines, invoice payment status, and payment details, is available from `GET /customers/{customer_id}/orders`.

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

Python never computes these, so nobody can get them wrong from the application side: `serial_no`, `unit_price` (kept in sync with the product price until checkout), `subtotal`, `Orders.total_amount`, invoice total and 18% tax, the payment amount, `feedback_id`, `return_cart_id`, and the product's `stock_quantity` (always the sum of its warehouse rows).

They also refuse anything out of order: editing a placed item, paying twice, assigning delivery before payment, skipping a delivery step, feedback before delivery, returns outside the 10 day window or with an unlisted reason, refunds above the item's value, and warehouses filled past capacity.

## Changing a rule

Most numbers live in `sql/02_triggers.sql`: the tax rate (`0.18` in `trg_invoice_bi`), the return window (`10` in `trg_return_bi`) and the accepted return reasons (same trigger). Edit, then rerun `python setup_db.py`.

## [Demo Link](https://drive.google.com/file/d/1JhHmT_0S-VsPTJitkRzaBsgnB3tpTW5f/view?usp=sharing)
