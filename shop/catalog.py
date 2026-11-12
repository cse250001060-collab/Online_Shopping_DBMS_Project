from . import db

MAX_PAGE_SIZE = 200


def search_products(name=None, category_id=None, category_name=None,
                    min_price=None, max_price=None, in_stock_only=False,
                    limit=50, offset=0):
    sql = (
        "SELECT p.product_id, p.product_name, p.brand, p.price, p.description, "
        "c.category_id, c.category_name, p.stock_quantity AS available "
        "FROM Product p JOIN Product_Category c ON c.category_id = p.category_id"
    )
    where, params = [], []
    if name:
        where.append("p.product_name LIKE %s")
        params.append(f"%{name}%")
    if category_id is not None:
        where.append("p.category_id = %s")
        params.append(category_id)
    if category_name:
        where.append("c.category_name = %s")
        params.append(category_name)
    if min_price is not None:
        where.append("p.price >= %s")
        params.append(min_price)
    if max_price is not None:
        where.append("p.price <= %s")
        params.append(max_price)
    if in_stock_only:
        where.append("p.stock_quantity > 0")
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY p.product_name LIMIT %s OFFSET %s"
    params += [max(1, min(int(limit), MAX_PAGE_SIZE)), max(0, int(offset))]
    return db.fetch_all(sql, params)


def get_product(product_id):
    return db.fetch_one(
        "SELECT p.*, c.category_name FROM Product p "
        "JOIN Product_Category c ON c.category_id = p.category_id "
        "WHERE p.product_id = %s",
        (product_id,),
    )
