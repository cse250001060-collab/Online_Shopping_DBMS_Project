import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")


@dataclass(frozen=True)
class Settings:
    host: str = os.getenv("SHOP_DB_HOST", "127.0.0.1")
    port: int = int(os.getenv("SHOP_DB_PORT", "3306"))
    user: str = os.getenv("SHOP_DB_USER", "root")
    password: str = os.getenv("SHOP_DB_PASSWORD", "")
    database: str = os.getenv("SHOP_DB_NAME", "shopping_dbms")
    payment_failure_rate: float = float(os.getenv("SHOP_PAYMENT_FAILURE_RATE", "0.1"))


settings = Settings()
