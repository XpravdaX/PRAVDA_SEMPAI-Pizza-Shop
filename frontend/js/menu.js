// Конфигурация API
const API_BASE_URL = window.location.origin + "/api";
console.log("API Base URL:", API_BASE_URL);

// Загрузка меню
async function fetchPizzas() {
    try {
        console.log("Запрашиваю пиццы с API...");
        const response = await fetch(`${API_BASE_URL}/pizzas/`);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const pizzas = await response.json();
        console.log("Получено пицц:", pizzas.length);
        return pizzas;
    } catch (error) {
        console.error('Ошибка загрузки меню:', error);
        // Возвращаем тестовые данные если API недоступен
        return getFallbackPizzas();
    }
}

function getFallbackPizzas() {
    return [
        {
            id: 1,
            name: "Маргарита",
            price: 450,
            image_url: "images/pizza1.png",
            description: "Классическая итальянская пицца с томатным соусом, моцареллой и свежим базиликом",
            tags: "classic,veg",
            sizes: "25см,30см,35см"
        },
        {
            id: 2,
            name: "Пепперони",
            price: 550,
            image_url: "images/pizza2.png",
            description: "Острая пицца с колбасками пепперони и двойной порцией сыра",
            tags: "classic,spicy,meat",
            sizes: "25см,30см,35см"
        },
        {
            id: 3,
            name: "Четыре сыра",
            price: 520,
            image_url: "images/pizza3.png",
            description: "Моцарелла, горгонзола, пармезан и фета с соусом альфредо",
            tags: "classic,veg",
            sizes: "25см,30см,35см"
        },
        {
            id: 4,
            name: "Мясная",
            price: 620,
            image_url: "images/pizza4.png",
            description: "Бекон, ветчина, пепперони и говядина с сочным томатным соусом",
            tags: "meat",
            sizes: "25см,30см,35см"
        },
        {
            id: 5,
            name: "Острая мексиканская",
            price: 580,
            image_url: "images/pizza5.png",
            description: "Острый перец халапеньо, чили, курица и кукуруза",
            tags: "spicy,meat",
            sizes: "25см,30см,35см"
        },
        {
            id: 6,
            name: "Вегетарианская",
            price: 490,
            image_url: "images/pizza6.png",
            description: "Свежие овощи: перец, помидоры, грибы, оливки и лук",
            tags: "veg",
            sizes: "25см,30см,35см"
        }
    ];
}

function getTagName(tag) {
    const tags = {
        'classic': 'Классическая',
        'spicy': 'Острая',
        'meat': 'Мясная',
        'veg': 'Вегетарианская'
    };
    return tags[tag] || tag;
}

async function loadMenu() {
    const menuContainer = document.getElementById('pizza-menu');
    if (!menuContainer) return;

    menuContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Загружаем меню...</p></div>';

    try {
        const pizzas = await fetchPizzas();

        if (!pizzas || pizzas.length === 0) {
            menuContainer.innerHTML = `
                <div class="error" style="text-align: center; padding: 40px;">
                    <h3>Меню временно недоступно</h3>
                    <p>Попробуйте обновить страницу или зайти позже</p>
                    <button class="btn btn-primary" onclick="loadMenu()">
                        <i class="fas fa-sync"></i> Попробовать снова
                    </button>
                </div>
            `;
            return;
        }

        menuContainer.innerHTML = '';

        pizzas.forEach(pizza => {
            const tagsArray = pizza.tags ? pizza.tags.split(',').map(t => t.trim()) : [];
            const sizesArray = pizza.sizes ? pizza.sizes.split(',') : ["25см", "30см", "35см"];

            const pizzaCard = document.createElement('div');
            pizzaCard.className = 'pizza-card';
            pizzaCard.dataset.tags = tagsArray.join(' ');

            pizzaCard.innerHTML = `
                <img src="${pizza.image_url || 'images/default-pizza.png'}" alt="${pizza.name}" class="pizza-image">
                <div class="pizza-content">
                    <div class="pizza-header">
                        <h3 class="pizza-title">${pizza.name}</h3>
                        <span class="pizza-price">${pizza.price} ₽</span>
                    </div>
                    <p class="pizza-description">${pizza.description || ''}</p>
                    <div class="pizza-tags">
                        ${tagsArray.map(tag => `<span class="tag">${getTagName(tag)}</span>`).join('')}
                    </div>
                    <div class="pizza-actions">
                        <select class="size-selector" id="size-${pizza.id}">
                            ${sizesArray.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                        <button class="btn btn-primary add-to-cart" onclick="addPizzaToCart(${pizza.id})">
                            <i class="fas fa-cart-plus"></i> В корзину
                        </button>
                    </div>
                </div>
            `;

            menuContainer.appendChild(pizzaCard);
        });

        setupFilters();
        console.log("Меню успешно загружено!");

    } catch (error) {
        console.error("Ошибка при загрузке меню:", error);
        menuContainer.innerHTML = `
            <div class="error" style="text-align: center; padding: 40px; color: #e63946;">
                <h3><i class="fas fa-exclamation-triangle"></i> Ошибка загрузки</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadMenu()">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
            </div>
        `;
    }
}

function addPizzaToCart(pizzaId) {
    const pizzaElement = document.querySelector(`#size-${pizzaId}`).closest('.pizza-card');
    const pizzaName = pizzaElement.querySelector('.pizza-title').textContent;
    const pizzaPrice = parseFloat(pizzaElement.querySelector('.pizza-price').textContent.replace(' ₽', ''));
    const sizeSelect = document.getElementById(`size-${pizzaId}`);
    const size = sizeSelect ? sizeSelect.value : '30см';
    const imageUrl = pizzaElement.querySelector('.pizza-image').src;

    // Вызываем функцию из app.js
    if (typeof addToCart === 'function') {
        addToCart(pizzaId, pizzaName, pizzaPrice, size, imageUrl);
    } else {
        console.error("Функция addToCart не найдена!");
        alert("Ошибка добавления в корзину. Обновите страницу.");
    }
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            filterPizzas(filter);
        });
    });
}

function filterPizzas(filter) {
    const pizzaCards = document.querySelectorAll('.pizza-card');

    pizzaCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const tags = card.dataset.tags.split(' ');
            if (tags.includes(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Загружаем меню при загрузке страницы
document.addEventListener('DOMContentLoaded', loadMenu);

// Экспортируем для использования в консоли
window.loadMenu = loadMenu;
window.fetchPizzas = fetchPizzas;