// Общие функции для всех страниц

// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Обновление счетчика корзины
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Добавление товара в корзину
function addToCart(pizzaId, pizzaName, price, size, image) {
    const existingItem = cart.find(item => 
        item.id === pizzaId && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: pizzaId,
            name: pizzaName,
            price: price,
            size: size,
            image: image,
            quantity: 1
        });
    }

    saveCart();
    showNotification(`"${pizzaName}" добавлена в корзину!`);

    // Добавляем анимацию
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.parentElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.parentElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// Показ уведомления
function showNotification(message, type = 'success') {
    // Удаляем предыдущие уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notif => notif.remove());

    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';

    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e63946' : 'linear-gradient(135deg, var(--primary-red), #ff6b6b)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        max-width: 350px;
    `;

    document.body.appendChild(notification);

    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимации
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Мобильное меню
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            this.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.style.display = 'none';
                hamburger.classList.remove('active');
            });
        });
    }

    // Добавляем активный класс к текущей странице
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Функция для проверки корзины
function checkCart() {
    if (cart.length === 0 && window.location.pathname.includes('cart.html')) {
        // Уже обрабатывается в cart.js
        return false;
    }
    return cart.length > 0;
}

// Экспортируем функции для использования в других файлах
window.addToCart = addToCart;
window.saveCart = saveCart;
window.showNotification = showNotification;
window.updateCartCount = updateCartCount;