// Функции для страницы оформления заказа

function loadOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 1000 ? 0 : 300;
    const total = subtotal + delivery;
    
    if (!orderItems) return;
    
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span class="item-name">${item.name} (${item.size})</span>
            <span class="item-quantity">×${item.quantity}</span>
            <span class="item-price">${item.price * item.quantity} ₽</span>
        `;
        orderItems.appendChild(itemElement);
    });
    
    document.getElementById('orderSubtotal').textContent = `${subtotal} ₽`;
    document.getElementById('orderDelivery').textContent = `${delivery} ₽`;
    document.getElementById('orderTotal').textContent = `${total} ₽`;
}

// Обработка времени доставки
document.getElementById('deliveryTime')?.addEventListener('change', function() {
    const specificTime = document.getElementById('specificTime');
    if (this.value === 'specific') {
        specificTime.style.display = 'block';
    } else {
        specificTime.style.display = 'none';
    }
});

// Оформление заказа
document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // В реальном приложении здесь был бы запрос к API
    const orderNumber = Math.floor(Math.random() * 10000);
    document.getElementById('orderNumber').textContent = orderNumber;
    
    // Показываем модальное окно успеха
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    
    // Очищаем корзину
    cart = [];
    saveCart();
    
    // Добавляем обработчик для кнопки отслеживания
    document.getElementById('trackOrder').addEventListener('click', function() {
        alert(`Заказ №${orderNumber} передан курьеру. Ожидайте звонка!`);
        modal.style.display = 'none';
        window.location.href = 'index.html';
    });
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        modal.style.display = 'none';
        window.location.href = 'index.html';
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (cart.length === 0 && window.location.pathname.includes('order.html')) {
        showNotification('Корзина пуста! Добавьте товары');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    loadOrderSummary();
});