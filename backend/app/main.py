from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import os
import uvicorn

from .database import engine, Base
from .routers import pizzas, orders, admin
from .seed_data import seed_initial_data
seed_initial_data()

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)

# Создаем приложение FastAPI
app = FastAPI(
    title="PRAVDA_SEMPAI Pizza Shop API",
    description="API для пиццерии PRAVDA_SEMPAI",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене замените на конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(pizzas.router)
app.include_router(orders.router)
app.include_router(admin.router)


# Функция для обслуживания фронтенда
def setup_frontend():
    """Проверяем существование папки фронтенда"""
    # Путь к фронтенду относительно текущего файла
    current_dir = Path(__file__).parent
    project_root = current_dir.parent.parent
    frontend_path = project_root / "frontend"

    return frontend_path


# Получаем путь к фронтенду
FRONTEND_PATH = setup_frontend()


# API эндпоинты
@app.get("/")
async def read_root():
    """Главная страница - перенаправляем на фронтенд"""
    return FileResponse(str(FRONTEND_PATH / "index.html"))


@app.get("/api/health")
async def health_check():
    """Проверка здоровья API"""
    return {"status": "healthy", "service": "pizza_shop_api", "frontend_available": FRONTEND_PATH.exists()}


@app.get("/api/info")
async def api_info():
    """Информация о API"""
    return {
        "name": "PRAVDA_SEMPAI Pizza Shop API",
        "version": "1.0.0",
        "frontend_path": str(FRONTEND_PATH),
        "frontend_exists": FRONTEND_PATH.exists()
    }


# Статические файлы фронтенда
@app.get("/{filename}")
async def serve_html(filename: str):
    """Обслуживаем HTML файлы"""
    if filename.endswith(".html"):
        file_path = FRONTEND_PATH / filename
        if file_path.exists():
            return FileResponse(str(file_path))
    raise HTTPException(status_code=404, detail="Файл не найден")


@app.get("/css/{file_path:path}")
async def serve_css(file_path: str):
    """Обслуживаем CSS файлы"""
    css_path = FRONTEND_PATH / "css" / file_path
    if css_path.exists():
        return FileResponse(str(css_path))
    raise HTTPException(status_code=404, detail="CSS файл не найден")


@app.get("/js/{file_path:path}")
async def serve_js(file_path: str):
    """Обслуживаем JS файлы"""
    js_path = FRONTEND_PATH / "js" / file_path
    if js_path.exists():
        return FileResponse(str(js_path))
    raise HTTPException(status_code=404, detail="JS файл не найден")


@app.get("/images/{file_path:path}")
async def serve_images(file_path: str):
    """Обслуживаем изображения"""
    image_path = FRONTEND_PATH / "images" / file_path
    if image_path.exists():
        return FileResponse(str(image_path))
    raise HTTPException(status_code=404, detail="Изображение не найдено")


# Обработка 404 для API
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc: HTTPException):
    """Кастомная обработка 404 ошибок"""
    # Если запрос к API - возвращаем JSON
    if request.url.path.startswith("/api/"):
        return JSONResponse(
            status_code=404,
            content={"detail": "API endpoint не найден"}
        )
    # Если запрос к фронтенду - пробуем вернуть index.html
    elif FRONTEND_PATH.exists():
        index_path = FRONTEND_PATH / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))

    return JSONResponse(
        status_code=404,
        content={"detail": "Ресурс не найден"}
    )


# Инициализация при запуске
@app.on_event("startup")
async def startup_event():
    """Событие запуска приложения"""
    print("=" * 50)
    print("🚀 PRAVDA_SEMPAI Pizza Shop запущен!")
    print("=" * 50)
    print(f"📁 Путь к фронтенду: {FRONTEND_PATH}")
    print(f"✅ Фронтенд доступен: {FRONTEND_PATH.exists()}")
    print("🌐 API доступен по: http://localhost:8000/api/")
    print("📚 Документация API: http://localhost:8000/api/docs")
    print("📄 Фронтенд: http://localhost:8000/")
    print("=" * 50)

    if not FRONTEND_PATH.exists():
        print("⚠️  ВНИМАНИЕ: Папка фронтенда не найдена!")
        print("   Убедитесь, что структура проекта правильная:")
        print("   pizza_shop_project/")
        print("   ├── backend/")
        print("   └── frontend/ <-- эта папка должна существовать")
        print("=" * 50)


# Для запуска через python backend/app/main.py
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )