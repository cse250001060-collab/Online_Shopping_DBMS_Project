"""FastAPI adapter for the online shopping DBMS operations."""

from datetime import date
from decimal import Decimal
from enum import Enum
import os
from typing import Literal

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from starlette.responses import JSONResponse

from shop import BusinessRuleError, NotFoundError, ShopError
from shop import cart, catalog, db, delivery, feedback, inventory, orders, returns


class APIModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class PaymentMode(str, Enum):
    card = "Card"
    upi = "UPI"
    cod = "COD"
    wallet = "Wallet"


class AddCartItem(APIModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1)


class UpdateCartItem(APIModel):
    quantity: int = Field(ge=0, description="Use 0 to remove the item")


class PaymentRequest(APIModel):
    payment_mode: PaymentMode


class DeliveryAssignment(APIModel):
    delivery_person_id: int = Field(gt=0)
    delivery_date: date | None = None


class DeliveryStatusRequest(APIModel):
    delivery_status: str


class FeedbackRequest(APIModel):
    rating: int = Field(ge=1, le=5)
    comments: str | None = None


class ReturnRequest(APIModel):
    reason: str = Field(min_length=1, max_length=255)


class ReviewReturnRequest(APIModel):
    approve: bool


class ReturnDeliveryAssignment(APIModel):
    delivery_person_id: int = Field(gt=0)


class CompleteReturnRequest(APIModel):
    delivery_person_id: int = Field(gt=0)
    refund_amount: Decimal | None = Field(default=None, ge=0)


class CategoryCreate(APIModel):
    category_name: str = Field(min_length=1, max_length=100)
    description: str | None = None


class CategoryUpdate(APIModel):
    category_name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None


class ProductCreate(APIModel):
    category_id: int = Field(gt=0)
    product_name: str = Field(min_length=1, max_length=150)
    price: Decimal = Field(ge=0)
    description: str | None = None
    brand: str | None = Field(default=None, max_length=50)
    initial_stock: int = Field(default=0, ge=0)
    location_id: int | None = Field(default=None, gt=0)


class ProductUpdate(APIModel):
    product_name: str | None = Field(default=None, min_length=1, max_length=150)
    price: Decimal | None = Field(default=None, ge=0)
    description: str | None = None
    brand: str | None = Field(default=None, max_length=50)
    category_id: int | None = Field(default=None, gt=0)


class LocationCreate(APIModel):
    warehouse_name: str = Field(min_length=1, max_length=100)
    street: str = Field(min_length=1, max_length=100)
    city: str = Field(min_length=1, max_length=50)
    state: str = Field(min_length=1, max_length=50)
    pincode: str = Field(min_length=1, max_length=10)
    capacity: int = Field(gt=0)


class LocationUpdate(APIModel):
    warehouse_name: str | None = Field(default=None, min_length=1, max_length=100)
    street: str | None = Field(default=None, min_length=1, max_length=100)
    city: str | None = Field(default=None, min_length=1, max_length=50)
    state: str | None = Field(default=None, min_length=1, max_length=50)
    pincode: str | None = Field(default=None, min_length=1, max_length=10)
    capacity: int | None = Field(default=None, gt=0)


class StockLevelRequest(APIModel):
    stock_level: int = Field(ge=0)


app = FastAPI(
    title="Online Shopping DBMS API",
    version="1.0.0",
    description="REST API for the project's catalog, cart, order, delivery, return, and inventory operations.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "SHOP_CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000,"
            "http://localhost:3001,http://127.0.0.1:3001,"
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(NotFoundError)
async def not_found_handler(_request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(BusinessRuleError)
async def business_rule_handler(_request, exc: BusinessRuleError):
    return JSONResponse(status_code=409, content={"detail": str(exc)})


@app.exception_handler(ShopError)
async def shop_error_handler(_request, exc: ShopError):
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# Catalog
@app.get("/products")
def search_products(
    name: str | None = None,
    category_id: int | None = Query(default=None, gt=0),
    category_name: str | None = None,
    min_price: Decimal | None = Query(default=None, ge=0),
    max_price: Decimal | None = Query(default=None, ge=0),
    in_stock_only: bool = False,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=422, detail="min_price cannot exceed max_price")
    return catalog.search_products(
        name, category_id, category_name, min_price, max_price,
        in_stock_only, limit, offset,
    )


@app.get("/categories")
def list_categories():
    return db.fetch_all("SELECT category_id, category_name, description FROM Product_Category ORDER BY category_name")


@app.get("/delivery-people")
def list_delivery_people():
    return db.fetch_all(
        "SELECT delivery_person_id, name, phone_no, vehicle_no, area_assigned "
        "FROM Delivery_Person ORDER BY name"
    )


@app.get("/locations")
def list_locations():
    return db.fetch_all(
        "SELECT location_id, warehouse_name, street, city, state, pincode, capacity "
        "FROM Inventory_Location ORDER BY location_id"
    )


@app.get("/products/{product_id}")
def get_product(product_id: int):
    product = catalog.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# Cart and checkout
@app.get("/customers/{customer_id}/cart")
def view_cart(customer_id: int):
    return cart.view_cart(customer_id)


@app.post("/customers/{customer_id}/cart/items", status_code=status.HTTP_201_CREATED)
def add_cart_item(customer_id: int, body: AddCartItem):
    return cart.add_to_cart(customer_id, body.product_id, body.quantity)


@app.patch("/customers/{customer_id}/cart/items/{cart_id}/{serial_no}")
def update_cart_item(customer_id: int, cart_id: int, serial_no: int, body: UpdateCartItem):
    return cart.update_cart_item(customer_id, cart_id, serial_no, body.quantity)


@app.delete("/customers/{customer_id}/cart/items/{cart_id}/{serial_no}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(customer_id: int, cart_id: int, serial_no: int):
    cart.remove_cart_item(customer_id, cart_id, serial_no)


@app.post("/customers/{customer_id}/checkout", status_code=status.HTTP_201_CREATED)
def checkout(customer_id: int):
    return orders.checkout(customer_id)


# Orders, invoices, payments
@app.get("/orders")
def list_orders():
    return orders.list_orders()


@app.get("/customers/{customer_id}/orders")
def list_customer_orders(customer_id: int):
    return orders.list_customer_order_details(customer_id)


@app.get("/orders/{order_id}")
def get_order(order_id: int):
    order = orders.get_order(order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.post("/orders/{order_id}/invoice", status_code=status.HTTP_201_CREATED)
def generate_invoice(order_id: int):
    return orders.generate_invoice(order_id)


@app.post("/invoices/{invoice_id}/payments", status_code=status.HTTP_201_CREATED)
def record_payment(invoice_id: int, body: PaymentRequest):
    # Payment outcome is simulated by the existing backend gateway function.
    return orders.record_payment(invoice_id, body.payment_mode.value)


# Delivery and feedback
@app.post("/orders/{order_id}/delivery-assignment")
def assign_delivery_person(order_id: int, body: DeliveryAssignment):
    return delivery.assign_delivery_person(order_id, body.delivery_person_id, body.delivery_date)


@app.patch("/orders/{order_id}/delivery-status")
def update_delivery_status(order_id: int, body: DeliveryStatusRequest):
    return delivery.update_delivery_status(order_id, body.delivery_status)


@app.post("/orders/{order_id}/feedback", status_code=status.HTTP_201_CREATED)
def submit_feedback(order_id: int, body: FeedbackRequest, customer_id: int = Query(gt=0)):
    return feedback.submit_feedback(customer_id, order_id, body.rating, body.comments)


# Returns
@app.get("/customers/{customer_id}/returns")
def list_customer_returns(customer_id: int):
    return returns.list_customer_returns(customer_id)


@app.get("/returns")
def list_returns(return_status: Literal["Requested", "Approved", "Rejected", "Refunded"] | None = None):
    """List return records, optionally filtered by status (for example, Requested)."""
    return returns.list_returns(return_status)


@app.get("/manager/returns")
def list_manager_returns():
    return returns.list_manager_returns()


@app.post("/customers/{customer_id}/cart/items/{cart_id}/{serial_no}/returns", status_code=status.HTTP_201_CREATED)
def request_return(customer_id: int, cart_id: int, serial_no: int, body: ReturnRequest):
    return returns.request_return(customer_id, cart_id, serial_no, body.reason)


@app.patch("/returns/{cart_id}/{serial_no}/{return_cart_id}/review")
def review_return(cart_id: int, serial_no: int, return_cart_id: int, body: ReviewReturnRequest):
    return returns.review_return(cart_id, serial_no, return_cart_id, body.approve)


@app.patch("/returns/{cart_id}/{serial_no}/{return_cart_id}/delivery-assignment")
def assign_return_delivery_person(
    cart_id: int, serial_no: int, return_cart_id: int, body: ReturnDeliveryAssignment
):
    return returns.assign_return_delivery_person(
        cart_id, serial_no, return_cart_id, body.delivery_person_id
    )


@app.post("/returns/{cart_id}/{serial_no}/{return_cart_id}/pickup-and-refund")
def arrange_return_pickup_and_refund(
    cart_id: int, serial_no: int, return_cart_id: int, body: CompleteReturnRequest
):
    return returns.arrange_pickup_and_refund(
        cart_id, serial_no, return_cart_id, body.delivery_person_id, body.refund_amount
    )


# Product/category administration
@app.post("/categories", status_code=status.HTTP_201_CREATED)
def add_category(body: CategoryCreate):
    return inventory.add_category(body.category_name, body.description)


@app.patch("/categories/{category_id}")
def update_category(category_id: int, body: CategoryUpdate):
    return inventory.update_category(category_id, **body.model_dump(exclude_unset=True))


@app.post("/products", status_code=status.HTTP_201_CREATED)
def add_product(body: ProductCreate):
    return inventory.add_product(**body.model_dump())


@app.patch("/products/{product_id}")
def update_product(product_id: int, body: ProductUpdate):
    return inventory.update_product(product_id, **body.model_dump(exclude_unset=True))


# Warehouses and stock
@app.post("/locations", status_code=status.HTTP_201_CREATED)
def add_location(body: LocationCreate):
    return inventory.add_location(**body.model_dump())


@app.patch("/locations/{location_id}")
def update_location(location_id: int, body: LocationUpdate):
    return inventory.update_location(location_id, **body.model_dump(exclude_unset=True))


@app.put("/products/{product_id}/stock/{location_id}")
def set_stock_level(product_id: int, location_id: int, body: StockLevelRequest):
    return inventory.set_stock_level(product_id, location_id, body.stock_level)


@app.get("/products/{product_id}/stock")
def get_product_stock(product_id: int):
    return inventory.get_product_stock(product_id)


@app.get("/locations/{location_id}/stock")
def get_location_stock(location_id: int):
    return inventory.get_location_stock(location_id)
