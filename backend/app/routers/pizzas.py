from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/pizzas", tags=["pizzas"])


@router.get("/", response_model=List[schemas.Pizza])
def read_pizzas(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    tags: Optional[str] = Query(None, description="Фильтр по тегам (через запятую)"),
    db: Session = Depends(get_db)
):
    """
    Получить список пицц.
    - **skip**: сколько записей пропустить
    - **limit**: максимальное количество записей
    - **active_only**: показывать только активные пиццы
    - **tags**: фильтр по тегам (например: classic,meat)
    """
    if tags:
        return crud.get_pizzas_by_tags(db, tags=tags)
    return crud.get_pizzas(db, skip=skip, limit=limit, active_only=active_only)


@router.get("/{pizza_id}", response_model=schemas.Pizza)
def read_pizza(pizza_id: int, db: Session = Depends(get_db)):
    """
    Получить пиццу по ID.
    """
    pizza = crud.get_pizza(db, pizza_id=pizza_id)
    if pizza is None:
        raise HTTPException(status_code=404, detail="Пицца не найдена")
    return pizza


@router.post("/", response_model=schemas.Pizza)
def create_pizza(pizza: schemas.PizzaCreate, db: Session = Depends(get_db)):
    """
    Создать новую пиццу.
    """
    return crud.create_pizza(db=db, pizza=pizza)


@router.put("/{pizza_id}", response_model=schemas.Pizza)
def update_pizza(pizza_id: int, pizza: schemas.PizzaUpdate, db: Session = Depends(get_db)):
    """
    Обновить пиццу.
    """
    db_pizza = crud.get_pizza(db, pizza_id=pizza_id)
    if db_pizza is None:
        raise HTTPException(status_code=404, detail="Пицца не найдена")
    return crud.update_pizza(db=db, pizza_id=pizza_id, pizza=pizza)


@router.delete("/{pizza_id}")
def delete_pizza(pizza_id: int, db: Session = Depends(get_db)):
    """
    Удалить пиццу.
    """
    db_pizza = crud.get_pizza(db, pizza_id=pizza_id)
    if db_pizza is None:
        raise HTTPException(status_code=404, detail="Пицца не найдена")
    crud.delete_pizza(db=db, pizza_id=pizza_id)
    return {"message": "Пицца удалена"}