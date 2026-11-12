USE shopping_dbms;

INSERT INTO Customer (first_name, last_name, email, password_hash, street, city, state, pincode, dob) VALUES
('Raunak', 'Singh', 'raunak@example.com', 'hash1', '12 MG Road', 'Indore', 'MP', '452001', '2004-05-14'),
('Mayank', 'Khoria', 'mayank@example.com', 'hash2', '8 Vijay Nagar', 'Indore', 'MP', '452010', '2004-08-02'),
('Sarthak', 'Pandey', 'sarthak@example.com', 'hash3', '3 Palasia', 'Indore', 'MP', '452001', '2003-11-21');

INSERT INTO Customer_Phone (customer_id, phone_no) VALUES (1, '9000000001'), (2, '9000000002');

INSERT INTO Product_Category (category_name, description) VALUES
('Electronics', 'Phones, laptops and accessories'),
('Books', 'Textbooks and novels'),
('Home', 'Kitchen and home essentials');

INSERT INTO Product (category_id, product_name, price, description, brand) VALUES
(1, 'Wireless Mouse', 499.00, 'Ergonomic 2.4GHz mouse', 'Logitech'),
(1, 'USB-C Cable', 299.00, '1 metre braided cable', 'Anker'),
(1, 'Mechanical Keyboard', 3499.00, 'Hot-swappable keyboard', 'Keychron'),
(2, 'Database System Concepts', 1250.00, 'Silberschatz, 7th edition', 'McGraw Hill'),
(3, 'Steel Water Bottle', 649.00, '1 litre insulated bottle', 'Milton'),
(3, 'Desk Lamp', 899.00, 'LED lamp with dimmer', 'Philips');

INSERT INTO Inventory_Location (warehouse_name, street, city, state, pincode, capacity) VALUES
('Indore Central', '5 Industrial Area', 'Indore', 'MP', '452010', 1000),
('Pithampur Hub', '22 Sector 3', 'Pithampur', 'MP', '454775', 500);

INSERT INTO Product_Inventory (product_id, location_id, stock_level) VALUES
(1, 1, 30), (1, 2, 20),
(2, 1, 100),
(3, 1, 5),
(4, 2, 12),
(5, 1, 40), (5, 2, 10),
(6, 2, 8);

INSERT INTO Delivery_Person (name, phone_no, vehicle_no, area_assigned) VALUES
('Vikram Yadav', '9998887771', 'MP09AB1234', 'Indore Central'),
('Anita Verma', '9998887772', 'MP09CD5678', 'Pithampur');
