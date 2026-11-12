class ShopError(Exception):
    pass


class BusinessRuleError(ShopError):
    pass


class NotFoundError(ShopError):
    pass
