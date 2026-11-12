import os
import sys
from pathlib import Path

os.environ["SHOP_DB_NAME"] = "shopping_dbms_test"
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest

import setup_db


@pytest.fixture(autouse=True)
def fresh_db():
    setup_db.rebuild()
    yield
