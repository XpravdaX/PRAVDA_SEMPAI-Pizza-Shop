from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas
import random
import string
from datetime import datetime


# CRUD операции для Pizza
def get_pizza(db: Session, pizza_id: int):
    return db.query(models.Pizza).filter(models.Pizza.id == pizza_id).first()


def get_pizzas(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(models.Pizza)
    if active_only:
        query = query.filter(models.Pizza.is_active == True)
    return query.order_by(models.Pizza.id).offset(skip).limit(limit).all()


def get_pizzas_by_tags(db: Session, tags: str):
    """Фильтрация пицц по тегам"""
    tag_list = [tag.strip() for tag in tags.split(",")]

    query = db.query(models.Pizza).filter(models.Pizza.is_active == True)
    for tag in tag_list:
        query = query.filter(models.Pizza.tags.contains(tag))

    return query.all()


def create_pizza(db: Session, pizza: schemas.PizzaCreate):
    db_pizza = models.Pizza(**pizza.dict())
    db.add(db_pizza)
    db.commit()
    db.refresh(db_pizza)
    return db_pizza


def update_pizza(db: Session, pizza_id: int, pizza: schemas.PizzaUpdate):
    db_pizza = get_pizza(db, pizza_id)
    if db_pizza:
        for key, value in pizza.dict().items():
            setattr(db_pizza, key, value)
        db.commit()
        db.refresh(db_pizza)
    return db_pizza


def delete_pizza(db: Session, pizza_id: int):
    db_pizza = get_pizza(db, pizza_id)
    if db_pizza:
        db.delete(db_pizza)
        db.commit()
    return db_pizza


# Генерация номера заказа
def generate_order_number():
    date_part = datetime.now().strftime("%Y%m%d")
    random_part = ''.join(random.choices(string.digits, k=6))
    return f"ORD-{date_part}-{random_part}"


# CRUD операции для Order
def create_order(db: Session, order: schemas.OrderCreate):
    # Генерируем номер заказа
    order_number = generate_order_number()

    # Создаем заказ
    db_order = models.Order(
        order_number=order_number,
        **order.dict(exclude={"items"})
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Добавляем позиции заказа
    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            **item.dict()
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)
    return db_order


def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def get_order_by_number(db: Session, order_number: str):
    return db.query(models.Order).filter(models.Order.order_number == order_number).first()


def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).order_by(desc(models.Order.created_at)).offset(skip).limit(limit).all()


def get_orders_by_status(db: Session, status: str):
    return db.query(models.Order).filter(models.Order.status == status).order_by(desc(models.Order.created_at)).all()


def update_order_status(db: Session, order_id: int, status: str, comment: str = None):
    db_order = get_order(db, order_id)
    if db_order:
        db_order.status = status
        if comment:
            db_order.comment = comment
        db.commit()
        db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: int):
    db_order = get_order(db, order_id)
    if db_order:
        db.delete(db_order)
        db.commit()
    return db_order