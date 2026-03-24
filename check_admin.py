import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus
load_dotenv()

def build_database_url():
    explicit_url = os.getenv("DATABASE_URL")
    if explicit_url:
        return explicit_url
    host = os.getenv("MYSQL_HOST")
    port = os.getenv("MYSQL_PORT")
    user = os.getenv("MYSQL_USER")
    password = os.getenv("MYSQL_PASSWORD")
    database = os.getenv("MYSQL_DATABASE")
    if not all([host, port, user, database]):
        print("❌ Missing DB config in .env")
        return None
    user = quote_plus(user)
    password = quote_plus(password or "")
    credentials = f"{user}:{password}" if password else user
    return f"mysql+pymysql://{credentials}@{host}:{port}/{database}?charset=utf8mb4"

db_url = build_database_url()
if not db_url:
    exit(1)

engine = create_engine(db_url)
try:
    with engine.connect() as conn:
        # Check table
        result = conn.execute(text("SHOW TABLES LIKE 'admin_users'"))
        table_exists = result.fetchone() is not None
        print(f"✅ admin_users table {'EXISTS' if table_exists else 'MISSING'}")
        
        if table_exists:
            users = conn.execute(text("SELECT id, email, full_name, is_active FROM admin_users")).fetchall()
            print("\nAdmin Users:")
            if users:
                for u in users:
                    print(f"  ID: {u[0]}, Email: {u[1]}, Name: {u[2]}, Active: {u[3]}")
            else:
                print("  ❌ NO USERS FOUND")
        else:
            print("❌ Create table & user via bootstrap or manual SQL")
            
        # Test dashboard route (requires login)
        print("\n✅ DB Connected!")
        
except Exception as e:
    print(f"❌ DB Error: {e}")

print("\nDefault login (if user exists): admin@neargoal.com / Admin@123")
print("Test: http://localhost:5001/admin/login → /admin/dashboard")

