from sqlalchemy.orm import Session
from . import models
from .database import SessionLocal

def create_initial_pizzas():
    db = SessionLocal()
    
    pizzas_data = [
        {
            "name": "Маргарита",
            "description": "Классическая итальянская пицца с томатным соусом, моцареллой и свежим базиликом",
            "price": 450.0,
            "image_url": "/images/pizza1.png",
            "tags": "classic,veg",
            "sizes": "25см,30см,35см"
        },
        {
            "name": "Пепперони",
            "description": "Острая пицца с колбасками пепперони и двойной порцией сыра",
            "price": 550.0,
            "image_url": "/images/pizza2.png",
            "tags": "classic,spicy,meat",
            "sizes": "25см,30см,35см"
        },
        {
            "name": "Четыре сыра",
            "description": "Моцарелла, горгонзола, пармезан и фета с соусом альфредо",
            "price": 520.0,
            "image_url": "/images/pizza3.png",
            "tags": "classic,veg",
            "sizes": "25см,30см,35см"
        },
        {
            "name": "Мясная",
            "description": "Бекон, ветчина, пепперони и говядина с сочным томатным соусом",
            "price": 620.0,
            "image_url": "/images/pizza4.png",
            "tags": "meat",
            "sizes": "25см,30см,35см"
        },
        {
            "name": "Острая мексиканская",
            "description": "Острый перец халапеньо, чили, курица и кукуруза",
            "price": 580.0,
            "image_url": "/images/pizza5.png",
            "tags": "spicy,meat",
            "sizes": "25см,30см,35см"
        },
        {
            "name": "Вегетарианская",
            "description": "Свежие овощи: перец, помидоры, грибы, оливки и лук",
            "price": 490.0,
            "image_url": "/images/pizza6.png",
            "tags": "veg",
            "sizes": "25см,30см,35см"
        }
    ]
    
    for pizza_data in pizzas_data:
        pizza = models.Pizza(**pizza_data)
        db.add(pizza)
    
    db.commit()
    db.close()

if __name__ == "__main__":
    create_initial_pizzas()
    print("✅ Тестовые пиццы добавлены в базу данных!")