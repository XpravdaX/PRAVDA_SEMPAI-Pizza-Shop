from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base


class PizzaSize(str, enum.Enum):
    SMALL = "25см"
    MEDIUM = "30см"
    LARGE = "35см"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"           # Ожидает подтверждения
    CONFIRMED = "confirmed"       # Подтвержден
    PREPARING = "preparing"       # Готовится
    READY = "ready"              # Готов к выдаче
    ON_DELIVERY = "on_delivery"  # В пути
    DELIVERED = "delivered"      # Доставлен
    CANCELLED = "cancelled"      # Отменен


class PaymentMethod(str, enum.Enum):
    CASH = "cash"           # Наличные
    CARD = "card"           # Карта онлайн
    APPLE_PAY = "applepay"  # Apple Pay


class Pizza(Base):
    __tablename__ = "pizzas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    tags = Column(String(255))  # "classic,meat,spicy"
    sizes = Column(String(100), default="25см,30см,35см")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(100))
    delivery_address = Column(Text, nullable=False)
    delivery_entrance = Column(String(10))
    delivery_floor = Column(Integer)
    delivery_intercom = Column(String(10))
    delivery_time = Column(String(50))  # ASAP, 30min, specific time
    payment_method = Column(SQLEnum(PaymentMethod), default=PaymentMethod.CASH)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING)
    comment = Column(Text)
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, default=300.0)
    discount = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Связь с позициями заказа
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    pizza_id = Column(Integer, ForeignKey("pizzas.id"))
    pizza_name = Column(String(100), nullable=False)
    size = Column(String(20), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_item = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    # Связи
    order = relationship("Order", back_populates="items")
    pizza = relationship("Pizza")