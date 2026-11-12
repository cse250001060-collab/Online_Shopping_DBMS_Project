CREATE DATABASE IF NOT EXISTS shopping_dbms;
USE shopping_dbms;

CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    dob DATE NOT NULL
);

CREATE TABLE Customer_Phone (
    customer_id INT NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    PRIMARY KEY (customer_id, phone_no),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

CREATE TABLE Delivery_Person (
    delivery_person_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15) NOT NULL UNIQUE,
    vehicle_no VARCHAR(20),
    area_assigned VARCHAR(100)
);

CREATE TABLE Product_Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    description TEXT,
    brand VARCHAR(50),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    FOREIGN KEY (category_id) REFERENCES Product_Category(category_id)
);

CREATE TABLE Product_Image (
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_id, image_url),
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

CREATE TABLE Inventory_Location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0)
);

CREATE TABLE Product_Inventory (
    product_id INT NOT NULL,
    location_id INT NOT NULL,
    stock_level INT NOT NULL DEFAULT 0 CHECK (stock_level >= 0),
    PRIMARY KEY (product_id, location_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (location_id) REFERENCES Inventory_Location(location_id)
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    delivery_person_id INT,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(20) NOT NULL DEFAULT 'Placed'
        CHECK (order_status IN ('Placed','Shipped','Delivered','Cancelled')),
    delivery_date DATE,
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (delivery_status IN ('Pending','Assigned','Picked Up','Out for Delivery','Delivered')),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (delivery_person_id) REFERENCES Delivery_Person(delivery_person_id)
);

CREATE TABLE Order_Cart (
    cart_id INT NOT NULL,
    serial_no INT NOT NULL DEFAULT 0,
    order_id INT,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    PRIMARY KEY (cart_id, serial_no),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE Invoice_Bill (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    invoice_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'Unpaid'
        CHECK (payment_status IN ('Unpaid','Paid','Refunded')),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL UNIQUE,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_mode VARCHAR(20) NOT NULL CHECK (payment_mode IN ('Card','UPI','COD','Wallet')),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (payment_status IN ('Pending','Success','Failed')),
    FOREIGN KEY (invoice_id) REFERENCES Invoice_Bill(invoice_id)
);

CREATE TABLE Feedback (
    order_id INT NOT NULL,
    feedback_id INT NOT NULL DEFAULT 0,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    feedback_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id, feedback_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

CREATE TABLE Return_Cart (
    cart_id INT NOT NULL,
    serial_no INT NOT NULL,
    return_cart_id INT NOT NULL DEFAULT 0,
    delivery_person_id INT,
    return_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(255) NOT NULL,
    return_status VARCHAR(20) NOT NULL DEFAULT 'Requested'
        CHECK (return_status IN ('Requested','Approved','Rejected','Refunded')),
    refund_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (refund_amount >= 0),
    PRIMARY KEY (cart_id, serial_no, return_cart_id),
    FOREIGN KEY (cart_id, serial_no) REFERENCES Order_Cart(cart_id, serial_no) ON DELETE CASCADE,
    FOREIGN KEY (delivery_person_id) REFERENCES Delivery_Person(delivery_person_id)
);
