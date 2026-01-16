from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    Создать новый заказ.
    """
    try:
        return crud.create_order(db=db, order=order)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Получить список заказов.
    """
    orders = crud.get_orders(db, skip=skip, limit=limit)
    return orders


@router.get("/{order_id}", response_model=schemas.OrderWithItems)
def read_order(order_id: int, db: Session = Depends(get_db)):
    """
    Получить заказ по ID.
    """
    order = crud.get_order(db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order


@router.get("/number/{order_number}", response_model=schemas.OrderWithItems)
def read_order_by_number(order_number: str, db: Session = Depends(get_db)):
    """
    Получить заказ по номеру.
    """
    order = crud.get_order_by_number(db, order_number=order_number)
    if order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order


@router.put("/{order_id}", response_model=schemas.Order)
def update_order(
        order_id: int,
        order_update: schemas.OrderUpdate,
        db: Session = Depends(get_db)
):
    """
    Обновить заказ.
    """
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    # Обновляем только статус и комментарий
    if order_update.status:
        db_order.status = order_update.status
    if order_update.comment:
        db_order.comment = order_update.comment

    db.commit()
    db.refresh(db_order)
    return db_order