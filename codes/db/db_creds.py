import sqlalchemy
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()


def _clean_env(value):
    if value is None:
        return None
    return str(value).strip().strip('"').strip("'")


def _env(*keys):
    for key in keys:
        value = _clean_env(os.getenv(key))
        if value not in (None, ""):
            return value
    return None


def create_connections():
    load_dotenv()
    server = _env("DB_HOST", "MYSQL_HOST")
    port = _env("DB_PORT", "MYSQL_PORT")
    database = _env("DB_DATABASE", "MYSQL_DATABASE")
    user_name = _env("DB_USERNAME", "MYSQL_USER")
    raw_password = _env("DB_PASSWORD", "MYSQL_PASSWORD") or ""
    conn_value = _env("DB_CONNECTION", "DATABASE_URL")

    try:
        # Allow a full SQLAlchemy URL via DB_CONNECTION.
        if conn_value and "://" in conn_value:
            connection_string = conn_value
        else:
            # Legacy style: DB_CONNECTION=mysql + host/port/db/user/password envs.
            if not all([server, port, database, user_name]):
                raise ValueError("Missing MySQL connection env values.")
            password = quote_plus(raw_password)
            credentials = f"{quote_plus(user_name)}:{password}" if raw_password else quote_plus(user_name)
            connection_string = f"mysql+pymysql://{credentials}@{server}:{port}/{database}?charset=utf8mb4"

        engine = create_engine(connection_string, pool_pre_ping=True)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return engine
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None
