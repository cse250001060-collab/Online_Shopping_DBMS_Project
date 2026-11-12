USE shopping_dbms;

DELIMITER $$

CREATE PROCEDURE sp_allocate_stock(IN p_product_id INT, IN p_qty INT)
BEGIN
    DECLARE v_remaining INT DEFAULT p_qty;
    DECLARE v_location INT;
    DECLARE v_level INT;
    DECLARE v_take INT;
    DECLARE v_done INT DEFAULT 0;
    DECLARE v_msg VARCHAR(200);
    DECLARE alloc_cur CURSOR FOR
        SELECT location_id, stock_level
        FROM Product_Inventory
        WHERE product_id = p_product_id AND stock_level > 0
        ORDER BY stock_level DESC, location_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = 1;

    OPEN alloc_cur;
    alloc_loop: LOOP
        FETCH alloc_cur INTO v_location, v_level;
        IF v_done = 1 OR v_remaining <= 0 THEN
            LEAVE alloc_loop;
        END IF;
        SET v_take = LEAST(v_level, v_remaining);
        UPDATE Product_Inventory
        SET stock_level = stock_level - v_take
        WHERE product_id = p_product_id AND location_id = v_location;
        SET v_remaining = v_remaining - v_take;
    END LOOP;
    CLOSE alloc_cur;

    IF v_remaining > 0 THEN
        SET v_msg = CONCAT('Insufficient stock for product ', p_product_id);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
    END IF;
END$$


CREATE TRIGGER trg_location_bu BEFORE UPDATE ON Inventory_Location
FOR EACH ROW
BEGIN
    DECLARE v_used INT;
    SELECT COALESCE(SUM(stock_level), 0) INTO v_used
    FROM Product_Inventory WHERE location_id = NEW.location_id;
    IF NEW.capacity < v_used THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Capacity cannot be set below the stock the location currently holds';
    END IF;
END$$


CREATE TRIGGER trg_product_bi BEFORE INSERT ON Product
FOR EACH ROW
BEGIN
    SET NEW.stock_quantity = 0;
END$$

CREATE TRIGGER trg_product_bu BEFORE UPDATE ON Product
FOR EACH ROW
BEGIN
    IF NEW.stock_quantity <> OLD.stock_quantity AND COALESCE(@stock_sync, 0) = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock is maintained through Product_Inventory and cannot be edited directly';
    END IF;
END$$


CREATE TRIGGER trg_pinv_bi BEFORE INSERT ON Product_Inventory
FOR EACH ROW
BEGIN
    DECLARE v_capacity INT;
    DECLARE v_used INT;
    SELECT capacity INTO v_capacity FROM Inventory_Location WHERE location_id = NEW.location_id;
    IF v_capacity IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventory location does not exist';
    END IF;
    SELECT COALESCE(SUM(stock_level), 0) INTO v_used
    FROM Product_Inventory WHERE location_id = NEW.location_id;
    IF v_used + NEW.stock_level > v_capacity THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'This location does not have enough remaining capacity';
    END IF;
END$$

CREATE TRIGGER trg_pinv_bu BEFORE UPDATE ON Product_Inventory
FOR EACH ROW
BEGIN
    DECLARE v_capacity INT;
    DECLARE v_used INT;
    IF NEW.product_id <> OLD.product_id OR NEW.location_id <> OLD.location_id THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'The product or location of a stock record cannot be changed';
    END IF;
    IF NEW.stock_level > OLD.stock_level THEN
        SELECT capacity INTO v_capacity FROM Inventory_Location WHERE location_id = NEW.location_id;
        SELECT COALESCE(SUM(stock_level), 0) INTO v_used
        FROM Product_Inventory WHERE location_id = NEW.location_id;
        IF v_used - OLD.stock_level + NEW.stock_level > v_capacity THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'This location does not have enough remaining capacity';
        END IF;
    END IF;
END$$

CREATE TRIGGER trg_pinv_ai AFTER INSERT ON Product_Inventory
FOR EACH ROW
BEGIN
    SET @stock_sync = 1;
    UPDATE Product SET stock_quantity = stock_quantity + NEW.stock_level
    WHERE product_id = NEW.product_id;
    SET @stock_sync = 0;
END$$

CREATE TRIGGER trg_pinv_au AFTER UPDATE ON Product_Inventory
FOR EACH ROW
BEGIN
    IF NEW.stock_level <> OLD.stock_level THEN
        SET @stock_sync = 1;
        UPDATE Product SET stock_quantity = stock_quantity + (NEW.stock_level - OLD.stock_level)
        WHERE product_id = NEW.product_id;
        SET @stock_sync = 0;
    END IF;
END$$

CREATE TRIGGER trg_pinv_ad AFTER DELETE ON Product_Inventory
FOR EACH ROW
BEGIN
    SET @stock_sync = 1;
    UPDATE Product SET stock_quantity = stock_quantity - OLD.stock_level
    WHERE product_id = OLD.product_id;
    SET @stock_sync = 0;
END$$


CREATE TRIGGER trg_order_cart_bi BEFORE INSERT ON Order_Cart
FOR EACH ROW
BEGIN
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_stock INT;
    DECLARE v_in_cart INT;
    DECLARE v_msg VARCHAR(200);

    IF NEW.order_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'New cart items cannot be attached to an order directly';
    END IF;

    IF EXISTS (SELECT 1 FROM Order_Cart
               WHERE cart_id = NEW.cart_id AND customer_id <> NEW.customer_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This cart belongs to a different customer';
    END IF;

    IF EXISTS (SELECT 1 FROM Order_Cart
               WHERE customer_id = NEW.customer_id AND order_id IS NULL AND cart_id <> NEW.cart_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The customer already has a different open cart';
    END IF;

    SELECT price, stock_quantity INTO v_price, v_stock
    FROM Product WHERE product_id = NEW.product_id;
    IF v_price IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product does not exist';
    END IF;

    SELECT COALESCE(SUM(quantity), 0) INTO v_in_cart
    FROM Order_Cart WHERE cart_id = NEW.cart_id AND product_id = NEW.product_id;
    IF v_in_cart + NEW.quantity > v_stock THEN
        SET v_msg = CONCAT('Only ', v_stock, ' unit(s) of product ', NEW.product_id, ' are available');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
    END IF;

    IF NEW.serial_no = 0 THEN
        SET NEW.serial_no = (SELECT COALESCE(MAX(serial_no), 0) + 1
                             FROM Order_Cart WHERE cart_id = NEW.cart_id);
    END IF;
    SET NEW.unit_price = v_price;
    SET NEW.subtotal = NEW.quantity * NEW.unit_price;
END$$

CREATE TRIGGER trg_order_cart_bu BEFORE UPDATE ON Order_Cart
FOR EACH ROW
BEGIN
    DECLARE v_stock INT;
    DECLARE v_others INT;
    DECLARE v_owner INT;
    DECLARE v_msg VARCHAR(200);

    IF NEW.cart_id <> OLD.cart_id OR NEW.serial_no <> OLD.serial_no
       OR NEW.customer_id <> OLD.customer_id OR NEW.product_id <> OLD.product_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The identity of a cart item cannot be changed';
    END IF;

    IF NEW.unit_price <> OLD.unit_price THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The unit price is fixed when the item is added';
    END IF;

    IF OLD.order_id IS NOT NULL THEN
        IF NOT (NEW.order_id <=> OLD.order_id) OR NEW.quantity <> OLD.quantity THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Items on a placed order cannot be changed';
        END IF;
    ELSEIF NEW.order_id IS NOT NULL THEN
        SELECT customer_id INTO v_owner FROM Orders WHERE order_id = NEW.order_id;
        IF v_owner IS NULL OR v_owner <> NEW.customer_id THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'The order does not belong to the owner of this cart';
        END IF;
        IF NEW.quantity <> OLD.quantity THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Quantity cannot change while the cart is being checked out';
        END IF;
    ELSE
        IF NEW.quantity > OLD.quantity THEN
            SELECT stock_quantity INTO v_stock FROM Product WHERE product_id = NEW.product_id;
            SELECT COALESCE(SUM(quantity), 0) INTO v_others
            FROM Order_Cart
            WHERE cart_id = NEW.cart_id AND product_id = NEW.product_id AND serial_no <> NEW.serial_no;
            IF v_others + NEW.quantity > v_stock THEN
                SET v_msg = CONCAT('Only ', v_stock, ' unit(s) of product ', NEW.product_id, ' are available');
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
            END IF;
        END IF;
        SET NEW.subtotal = NEW.quantity * NEW.unit_price;
    END IF;
END$$

CREATE TRIGGER trg_order_cart_au AFTER UPDATE ON Order_Cart
FOR EACH ROW
BEGIN
    IF OLD.order_id IS NULL AND NEW.order_id IS NOT NULL THEN
        CALL sp_allocate_stock(NEW.product_id, NEW.quantity);
        UPDATE Orders SET total_amount = total_amount + NEW.subtotal
        WHERE order_id = NEW.order_id;
    END IF;
END$$

CREATE TRIGGER trg_order_cart_bd BEFORE DELETE ON Order_Cart
FOR EACH ROW
BEGIN
    IF OLD.order_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Items on a placed order cannot be removed';
    END IF;
END$$


CREATE TRIGGER trg_orders_bi BEFORE INSERT ON Orders
FOR EACH ROW
BEGIN
    SET NEW.order_status = 'Placed';
    SET NEW.delivery_status = 'Pending';
    SET NEW.delivery_person_id = NULL;
    SET NEW.delivery_date = NULL;
    SET NEW.total_amount = 0;
END$$

CREATE TRIGGER trg_orders_bu BEFORE UPDATE ON Orders
FOR EACH ROW
BEGIN
    DECLARE v_old_rank INT;
    DECLARE v_new_rank INT;

    IF NEW.customer_id <> OLD.customer_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The customer of an order cannot be changed';
    END IF;

    IF OLD.delivery_person_id IS NULL AND NEW.delivery_person_id IS NOT NULL THEN
        IF OLD.order_status <> 'Placed' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Only a placed order can be assigned for delivery';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM Invoice_Bill
                       WHERE order_id = OLD.order_id AND payment_status = 'Paid') THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'The order must be paid before it is assigned for delivery';
        END IF;
        IF NEW.delivery_date IS NULL THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'A delivery date is required when assigning a delivery person';
        END IF;
        SET NEW.delivery_status = 'Assigned';
    ELSEIF NOT (NEW.delivery_person_id <=> OLD.delivery_person_id) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A delivery person is already assigned to this order';
    END IF;

    SET v_old_rank = FIELD(OLD.delivery_status, 'Pending', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered');
    SET v_new_rank = FIELD(NEW.delivery_status, 'Pending', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered');

    IF v_new_rank <> v_old_rank THEN
        IF v_new_rank <> v_old_rank + 1 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Delivery status must move forward one step at a time';
        END IF;
        IF NEW.delivery_person_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'No delivery person is assigned to this order';
        END IF;
        IF NEW.delivery_status = 'Picked Up' THEN
            SET NEW.order_status = 'Shipped';
        ELSEIF NEW.delivery_status = 'Delivered' THEN
            SET NEW.order_status = 'Delivered';
            SET NEW.delivery_date = CURDATE();
        END IF;
    END IF;
END$$


CREATE TRIGGER trg_invoice_bi BEFORE INSERT ON Invoice_Bill
FOR EACH ROW
BEGIN
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_status VARCHAR(20);
    SELECT total_amount, order_status INTO v_total, v_status
    FROM Orders WHERE order_id = NEW.order_id;
    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order does not exist';
    END IF;
    IF v_status = 'Cancelled' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A cancelled order cannot be invoiced';
    END IF;
    IF v_total <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order with no items cannot be invoiced';
    END IF;
    SET NEW.total_amount = v_total;
    SET NEW.tax_amount = ROUND(v_total * 0.18, 2);
    SET NEW.payment_status = 'Unpaid';
END$$

CREATE TRIGGER trg_invoice_bu BEFORE UPDATE ON Invoice_Bill
FOR EACH ROW
BEGIN
    IF NEW.order_id <> OLD.order_id OR NEW.total_amount <> OLD.total_amount
       OR NEW.tax_amount <> OLD.tax_amount THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'The order and amounts on an invoice cannot be changed';
    END IF;
END$$


CREATE TRIGGER trg_payment_bi BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_tax DECIMAL(10,2);
    DECLARE v_status VARCHAR(20);
    SELECT total_amount, tax_amount, payment_status INTO v_total, v_tax, v_status
    FROM Invoice_Bill WHERE invoice_id = NEW.invoice_id;
    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invoice does not exist';
    END IF;
    IF v_status = 'Paid' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This invoice has already been paid';
    END IF;
    SET NEW.amount = v_total + v_tax;
    SET NEW.payment_status = 'Pending';
END$$

CREATE TRIGGER trg_payment_bu BEFORE UPDATE ON Payment
FOR EACH ROW
BEGIN
    IF OLD.payment_status = 'Success' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A successful payment cannot be modified';
    END IF;
    IF NEW.invoice_id <> OLD.invoice_id OR NEW.amount <> OLD.amount THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'The invoice and amount of a payment cannot be changed';
    END IF;
    IF NEW.payment_status <> OLD.payment_status THEN
        IF NOT ((OLD.payment_status = 'Pending' AND NEW.payment_status IN ('Success', 'Failed'))
                OR (OLD.payment_status = 'Failed' AND NEW.payment_status = 'Pending')) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'That payment status change is not allowed';
        END IF;
    END IF;
END$$

CREATE TRIGGER trg_payment_au AFTER UPDATE ON Payment
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'Success' AND OLD.payment_status <> 'Success' THEN
        UPDATE Invoice_Bill SET payment_status = 'Paid' WHERE invoice_id = NEW.invoice_id;
    END IF;
END$$


CREATE TRIGGER trg_feedback_bi BEFORE INSERT ON Feedback
FOR EACH ROW
BEGIN
    DECLARE v_status VARCHAR(20);
    SELECT order_status INTO v_status FROM Orders WHERE order_id = NEW.order_id;
    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order does not exist';
    END IF;
    IF v_status <> 'Delivered' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Feedback can only be left once the order has been delivered';
    END IF;
    IF NEW.feedback_id = 0 THEN
        SET NEW.feedback_id = (SELECT COALESCE(MAX(feedback_id), 0) + 1
                               FROM Feedback WHERE order_id = NEW.order_id);
    END IF;
END$$


CREATE TRIGGER trg_return_bi BEFORE INSERT ON Return_Cart
FOR EACH ROW
BEGIN
    DECLARE v_order_id INT;
    DECLARE v_order_date DATETIME;
    DECLARE v_status VARCHAR(20);

    SELECT oc.order_id, o.order_date, o.order_status INTO v_order_id, v_order_date, v_status
    FROM Order_Cart oc JOIN Orders o ON o.order_id = oc.order_id
    WHERE oc.cart_id = NEW.cart_id AND oc.serial_no = NEW.serial_no;

    IF v_order_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Only items from a placed order can be returned';
    END IF;
    IF v_status <> 'Delivered' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only delivered orders can be returned';
    END IF;
    IF DATEDIFF(CURDATE(), DATE(v_order_date)) > 10 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'The 10 day return window for this order has closed';
    END IF;
    IF NEW.reason NOT IN ('Damaged item', 'Defective item', 'Wrong item delivered',
                          'Not as described', 'Missing parts') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Reason must be one of: Damaged item, Defective item, Wrong item delivered, Not as described, Missing parts';
    END IF;
    IF EXISTS (SELECT 1 FROM Return_Cart
               WHERE cart_id = NEW.cart_id AND serial_no = NEW.serial_no
                 AND return_status <> 'Rejected') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This item already has an active return';
    END IF;

    IF NEW.return_cart_id = 0 THEN
        SET NEW.return_cart_id = (SELECT COALESCE(MAX(return_cart_id), 0) + 1
                                  FROM Return_Cart
                                  WHERE cart_id = NEW.cart_id AND serial_no = NEW.serial_no);
    END IF;
    SET NEW.return_status = 'Requested';
    SET NEW.refund_amount = 0;
    SET NEW.delivery_person_id = NULL;
END$$

CREATE TRIGGER trg_return_bu BEFORE UPDATE ON Return_Cart
FOR EACH ROW
BEGIN
    DECLARE v_line_total DECIMAL(10,2);

    IF NEW.cart_id <> OLD.cart_id OR NEW.serial_no <> OLD.serial_no
       OR NEW.return_cart_id <> OLD.return_cart_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The item behind a return cannot be changed';
    END IF;

    IF OLD.return_status IN ('Rejected', 'Refunded') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This return is closed and cannot be modified';
    END IF;

    IF NEW.return_status <> OLD.return_status THEN
        IF OLD.return_status = 'Requested' AND NEW.return_status NOT IN ('Approved', 'Rejected') THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'A requested return can only be approved or rejected';
        ELSEIF OLD.return_status = 'Approved' AND NEW.return_status <> 'Refunded' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'An approved return can only move on to refunded';
        END IF;
    END IF;

    IF NOT (NEW.delivery_person_id <=> OLD.delivery_person_id) AND OLD.return_status <> 'Approved' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A pickup can only be arranged for an approved return';
    END IF;

    IF NEW.refund_amount <> OLD.refund_amount AND NEW.return_status <> 'Refunded' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A refund can only be recorded when the return is marked refunded';
    END IF;

    IF OLD.return_status = 'Approved' AND NEW.return_status = 'Refunded' THEN
        IF NEW.delivery_person_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Arrange a pickup before refunding the return';
        END IF;
        SELECT subtotal INTO v_line_total FROM Order_Cart
        WHERE cart_id = NEW.cart_id AND serial_no = NEW.serial_no;
        IF NEW.refund_amount <= 0 OR NEW.refund_amount > v_line_total THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'The refund must be above zero and at most the value of the item';
        END IF;
    END IF;
END$$

DELIMITER ;
