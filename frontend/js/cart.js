// Функции для страницы корзины

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartItemsContainer) return;
    
    // Если корзина пуста
    if (cart.length === 0) {
        if (emptyCart) {
            cartItemsContainer.innerHTML = '';
            emptyCart.style.display = 'block';
            cartItemsContainer.appendChild(emptyCart);
        }
        updateSummary();
        return;
    }

    if (emptyCart) {
        emptyCart.style.display = 'none';
    }

    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image || 'images/default-pizza.png'}" alt="${item.name}"
                 class="cart-item-image" onerror="this.src='images/default-pizza.png'">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-size">Размер: ${item.size}</p>
                <p class="cart-item-price">${item.price * item.quantity} ₽</p>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})" title="Удалить">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    updateSummary();
}

function updateQuantity(index, change) {
    if (index < 0 || index >= cart.length) return;

    const newQuantity = cart[index].quantity + change;

    if (newQuantity < 1) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQuantity;
        saveCart();
        loadCartItems();
        showNotification(`Количество изменено: ${cart[index].name}`);
    }
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;

    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    loadCartItems();
    showNotification(`${itemName} удален из корзины`);
}

function updateSummary() {
    const itemsPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryPrice = itemsPrice > 1000 ? 0 : 300;
    const totalPrice = itemsPrice + deliveryPrice;

    // Обновляем цены
    const itemsPriceElement = document.getElementById('itemsPrice');
    const deliveryPriceElement = document.getElementById('deliveryPrice');
    const totalPriceElement = document.getElementById('totalPrice');
    const itemsCountElement = document.getElementById('itemsCount');

    if (itemsPriceElement) itemsPriceElement.textContent = `${itemsPrice} ₽`;
    if (deliveryPriceElement) deliveryPriceElement.textContent = `${deliveryPrice} ₽`;
    if (totalPriceElement) totalPriceElement.textContent = `${totalPrice} ₽`;
    if (itemsCountElement) itemsCountElement.textContent = totalItems;

    // Обновляем количество товаров в заголовке
    const summaryItems = document.querySelector('.summary-row span:first-child');
    if (summaryItems) {
        summaryItems.textContent = `Товары (${totalItems})`;
    }

    // Показываем бесплатную доставку
    if (deliveryPrice === 0) {
        if (deliveryPriceElement) {
            deliveryPriceElement.textContent = 'Бесплатно';
            deliveryPriceElement.style.color = 'var(--success)';
        }
    } else {
        if (deliveryPriceElement) {
            deliveryPriceElement.style.color = '';
        }
    }
}

// Обработка промокода
document.getElementById('applyPromo')?.addEventListener('click', function() {
    const promoInput = document.getElementById('promoInput');
    const promoCode = promoInput.value.trim().toUpperCase();
    const discountElement = document.getElementById('discount');

    if (promoCode === 'PRAVDA10') {
        const itemsPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = itemsPrice * 0.1; // 10% скидка
        discountElement.textContent = `-${discount.toFixed(0)} ₽`;
        discountElement.style.color = 'var(--success)';

        // Пересчитываем итого со скидкой
        const deliveryPrice = itemsPrice > 1000 ? 0 : 300;
        const totalPrice = itemsPrice + deliveryPrice - discount;
        document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(0)} ₽`;

        showNotification('Промокод PRAVDA10 применен! Скидка 10%');
        promoInput.value = '';
        promoInput.disabled = true;
        this.disabled = true;
        this.textContent = 'Применено';
        this.classList.remove('btn-outline');
        this.classList.add('btn-primary');
    } else if (promoCode) {
        showNotification('Неверный промокод. Попробуйте PRAVDA10');
        promoInput.style.borderColor = 'var(--primary-red)';
        setTimeout(() => {
            promoInput.style.borderColor = '';
        }, 2000);
    } else {
        showNotification('Введите промокод');
    }
});

// Обработка поля промокода
document.getElementById('promoInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('applyPromo').click();
    }
});

// Обработка выбора доставки
document.querySelectorAll('input[name="delivery"]')?.forEach(radio => {
    radio.addEventListener('change', function() {
        // Убираем active со всех опций
        document.querySelectorAll('.delivery-option').forEach(option => {
            option.classList.remove('active');
        });

        // Добавляем active к выбранной
        this.closest('.delivery-option').classList.add('active');

        // Обновляем цену доставки
        if (this.id === 'delivery2') { // Самовывоз
            document.getElementById('deliveryPrice').textContent = 'Бесплатно';
        } else {
            const itemsPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliveryPrice = itemsPrice > 1000 ? 0 : 300;
            document.getElementById('deliveryPrice').textContent = `${deliveryPrice} ₽`;
        }

        updateSummary();
    });
});

// Переход к оформлению
document.getElementById('checkoutBtn')?.addEventListener('click', function() {
    if (cart.length === 0) {
        showNotification('Добавьте товары в корзину перед оформлением');
        return;
    }

    // Добавляем анимацию загрузки
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Переход к оформлению...';
    this.disabled = true;

    setTimeout(() => {
        window.location.href = 'order.html';
    }, 500);
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем корзину
    loadCartItems();

    // Активируем первую опцию доставки
    const firstDeliveryOption = document.querySelector('.delivery-option');
    if (firstDeliveryOption) {
        firstDeliveryOption.classList.add('active');
    }
});