from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
from datetime import datetime
from enum import Enum


# Enums для Pydantic
class PizzaSizeEnum(str, Enum):
    SMALL = "25см"
    MEDIUM = "30см"
    LARGE = "35см"


class OrderStatusEnum(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    ON_DELIVERY = "on_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class PaymentMethodEnum(str, Enum):
    CASH = "cash"
    CARD = "card"
    APPLE_PAY = "applepay"


# Pizza Schemas
class PizzaBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    tags: Optional[str] = None
    sizes: Optional[str] = "25см,30см,35см"


class PizzaCreate(PizzaBase):
    pass


class PizzaUpdate(PizzaBase):
    is_active: Optional[bool] = True


class Pizza(PizzaBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Order Item Schemas
class OrderItemBase(BaseModel):
    pizza_id: int
    pizza_name: str
    size: str
    quantity: int
    price_per_item: float
    total_price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


# Order Schemas
class OrderBase(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[EmailStr] = None
    delivery_address: str
    delivery_entrance: Optional[str] = None
    delivery_floor: Optional[int] = None
    delivery_intercom: Optional[str] = None
    delivery_time: str = "asap"
    payment_method: PaymentMethodEnum = PaymentMethodEnum.CASH
    comment: Optional[str] = None
    subtotal: float
    delivery_fee: float = 300.0
    discount: float = 0.0
    total: float


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    status: Optional[OrderStatusEnum] = None
    comment: Optional[str] = None


class Order(OrderBase):
    id: int
    order_number: str
    status: OrderStatusEnum
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItem]

    class Config:
        from_attributes = True


# Response Schemas
class OrderWithItems(Order):
    items: List[OrderItem]


# Admin Schemas
class AdminOrderUpdate(BaseModel):
    status: OrderStatusEnum
    comment: Optional[str] = None