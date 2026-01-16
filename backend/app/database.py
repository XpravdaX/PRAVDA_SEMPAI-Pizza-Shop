from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# SQLite база данных (для разработки)
SQLALCHEMY_DATABASE_URL = "sqlite:///./pizza_shop.db"
# Для PostgreSQL раскомментируйте строку ниже:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/pizza_shop"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}  # Только для SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Функция для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()