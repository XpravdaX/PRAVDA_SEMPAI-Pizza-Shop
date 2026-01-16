from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/orders", response_model=List[schemas.OrderWithItems])
def get_all_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Получить все заказы (админка).
    """
    return crud.get_orders(db, skip=skip, limit=limit)


@router.get("/orders/status/{status}", response_model=List[schemas.OrderWithItems])
def get_orders_by_status(status: str, db: Session = Depends(get_db)):
    """
    Получить заказы по статусу.
    """
    return crud.get_orders_by_status(db, status=status)


@router.patch("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status_update: schemas.AdminOrderUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить статус заказа.
    """
    order = crud.update_order_status(
        db=db,
        order_id=order_id,
        status=status_update.status,
        comment=status_update.comment
    )
    if order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order