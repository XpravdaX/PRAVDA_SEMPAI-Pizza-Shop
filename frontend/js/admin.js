// Административная панель - JavaScript

// Тестовые данные
const mockData = {
    orders: [
        { id: 1, number: 'ORD-20231215-0001', customer: 'Иван Иванов', phone: '+7 (999) 123-45-67', amount: 1250, status: 'delivered', date: '15.12.2023 18:30', items: [{name: 'Пепперони', size: '30см', quantity: 2}]},
        { id: 2, number: 'ORD-20231215-0002', customer: 'Анна Петрова', phone: '+7 (999) 234-56-78', amount: 890, status: 'preparing', date: '15.12.2023 19:15', items: [{name: 'Маргарита', size: '25см', quantity: 1}]},
        { id: 3, number: 'ORD-20231215-0003', customer: 'Сергей Сидоров', phone: '+7 (999) 345-67-89', amount: 1670, status: 'ready', date: '15.12.2023 20:00', items: [{name: 'Мясная', size: '35см', quantity: 1}]},
        { id: 4, number: 'ORD-20231214-0001', customer: 'Мария Козлова', phone: '+7 (999) 456-78-90', amount: 2100, status: 'on_delivery', date: '14.12.2023 21:45', items: [{name: 'Четыре сыра', size: '30см', quantity: 3}]},
        { id: 5, number: 'ORD-20231214-0002', customer: 'Дмитрий Волков', phone: '+7 (999) 567-89-01', amount: 950, status: 'pending', date: '14.12.2023 22:30', items: [{name: 'Острая мексиканская', size: '30см', quantity: 1}]}
    ],
    pizzas: [
        { id: 1, name: 'Маргарита', price: 450, active: true, orders: 156 },
        { id: 2, name: 'Пепперони', price: 550, active: true, orders: 210 },
        { id: 3, name: 'Четыре сыра', price: 520, active: true, orders: 98 },
        { id: 4, name: 'Мясная', price: 620, active: true, orders: 134 },
        { id: 5, name: 'Острая мексиканская', price: 580, active: false, orders: 76 },
        { id: 6, name: 'Вегетарианская', price: 490, active: true, orders: 87 }
    ],
    customers: 1540,
    revenue: 248950
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка данных
    loadDashboard();
    loadOrders();
    loadPizzas();
    
    // Навигация
    setupNavigation();
    
    // Поиск
    setupSearch();
    
    // График
    initChart();
    
    // Обновление счетчиков
    updateCounters();
});

// Навигация по разделам
function setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Убираем активный класс у всех
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Добавляем активный класс к текущему
            this.classList.add('active');
            
            // Получаем секцию
            const section = this.dataset.section;
            
            // Скрываем все секции
            document.querySelectorAll('.admin-section').forEach(sec => {
                sec.style.display = 'none';
            });
            
            // Показываем нужную секцию
            const targetSection = document.getElementById(`${section}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
                document.getElementById('page-title').textContent = this.querySelector('span').textContent;
            }
            
            // Загружаем данные для секции
            switch(section) {
                case 'orders':
                    loadOrders();
                    break;
                case 'pizzas':
                    loadPizzas();
                    break;
                case 'analytics':
                    initChart();
                    break;
            }
        });
    });
}

// Загрузка дашборда
function loadDashboard() {
    loadRecentOrders();
    loadPopularPizzas();
}

// Последние заказы на дашборде
function loadRecentOrders() {
    const container = document.getElementById('recentOrders');
    if (!container) return;
    
    const recentOrders = mockData.orders.slice(0, 3);
    
    let html = '<div class="admin-table-container"><table class="admin-table"><thead><tr>';
    html += '<th>№ Заказа</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr></thead><tbody>';
    
    recentOrders.forEach(order => {
        const statusText = getStatusText(order.status);
        const statusClass = getStatusClass(order.status);
        
        html += `<tr>
            <td><strong>${order.number}</strong></td>
            <td>${order.customer}</td>
            <td>${order.amount} ₽</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewOrder(${order.id})" title="Просмотр">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="updateOrderStatus(${order.id})" title="Изменить статус">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Популярные пиццы на дашборде
function loadPopularPizzas() {
    const container = document.getElementById('popularPizzas');
    if (!container) return;
    
    const popularPizzas = [...mockData.pizzas]
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 4);
    
    let html = '<div class="pizza-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">';
    
    popularPizzas.forEach(pizza => {
        html += `
            <div class="pizza-card">
                <div class="pizza-content" style="padding: 20px;">
                    <div class="pizza-header">
                        <h3 class="pizza-title">${pizza.name}</h3>
                        <span class="pizza-price">${pizza.price} ₽</span>
                    </div>
                    <p style="color: var(--text-gray); margin: 10px 0;">
                        <i class="fas fa-shopping-bag"></i> ${pizza.orders} заказов
                    </p>
                    <div class="pizza-actions">
                        <button class="btn btn-primary" onclick="editPizza(${pizza.id})" style="flex: 1;">
                            <i class="fas fa-edit"></i> Редактировать
                        </button>
                        <button class="btn btn-outline" onclick="togglePizzaStatus(${pizza.id})" style="width: 40px;">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Загрузка всех заказов
function loadOrders() {
    const container = document.getElementById('ordersTableBody');
    if (!container) return;
    
    container.innerHTML = '';
    
    mockData.orders.forEach(order => {
        const statusText = getStatusText(order.status);
        const statusClass = getStatusClass(order.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.number}</strong></td>
            <td>${order.customer}</td>
            <td>${order.phone}</td>
            <td>${order.amount} ₽</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${order.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewOrder(${order.id})" title="Просмотр">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="updateOrderStatus(${order.id})" title="Изменить статус">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="cancelOrder(${order.id})" title="Отменить">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        `;
        container.appendChild(row);
    });
}

// Загрузка всех пицц
function loadPizzas() {
    const container = document.getElementById('pizzasList');
    if (!container) return;
    
    container.innerHTML = '';
    
    mockData.pizzas.forEach(pizza => {
        const pizzaCard = document.createElement('div');
        pizzaCard.className = 'pizza-card';
        pizzaCard.innerHTML = `
            <div class="pizza-content" style="padding: 20px;">
                <div class="pizza-header">
                    <h3 class="pizza-title">${pizza.name}</h3>
                    <span class="pizza-price">${pizza.price} ₽</span>
                </div>
                <div style="margin: 15px 0;">
                    <span class="tag" style="background: ${pizza.active ? 'var(--admin-success)' : 'var(--admin-danger)'}; color: white;">
                        ${pizza.active ? 'Активна' : 'Неактивна'}
                    </span>
                    <span class="tag" style="margin-left: 10px;">
                        <i class="fas fa-shopping-bag"></i> ${pizza.orders} заказов
                    </span>
                </div>
                <div class="pizza-actions">
                    <button class="btn btn-primary" onclick="editPizza(${pizza.id})" style="flex: 1;">
                        <i class="fas fa-edit"></i> Редактировать
                    </button>
                    <button class="btn ${pizza.active ? 'btn-outline' : 'btn-primary'}" onclick="togglePizzaStatus(${pizza.id})" style="width: 40px;">
                        <i class="fas fa-power-off"></i>
                    </button>
                    <button class="btn btn-outline" onclick="deletePizza(${pizza.id})" style="width: 40px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(pizzaCard);
    });
}

// Просмотр заказа
function viewOrder(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    const statusText = getStatusText(order.status);
    const statusClass = getStatusClass(order.status);
    
    modalBody.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="margin-bottom: 20px; color: var(--text-light);">Заказ ${order.number}</h2>
            
            <div style="background: var(--secondary-dark); padding: 20px; border-radius: var(--radius); margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4 style="color: var(--text-gray); margin-bottom: 10px;">Информация о клиенте</h4>
                        <p><strong>Имя:</strong> ${order.customer}</p>
                        <p><strong>Телефон:</strong> ${order.phone}</p>
                    </div>
                    <div>
                        <h4 style="color: var(--text-gray); margin-bottom: 10px;">Детали заказа</h4>
                        <p><strong>Статус:</strong> <span class="status ${statusClass}">${statusText}</span></p>
                        <p><strong>Дата:</strong> ${order.date}</p>
                        <p><strong>Сумма:</strong> ${order.amount} ₽</p>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: var(--text-light); margin-bottom: 10px;">Состав заказа</h4>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Товар</th>
                            <th>Размер</th>
                            <th>Количество</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.size}</td>
                                <td>${item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-primary" onclick="updateOrderStatus(${order.id})">
                    <i class="fas fa-edit"></i> Изменить статус
                </button>
                <button class="btn btn-outline" onclick="printOrder(${order.id})">
                    <i class="fas fa-print"></i> Печать
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Изменение статуса заказа
function updateOrderStatus(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return;
    
    showConfirmModal(
        'Изменить статус заказа',
        `Выберите новый статус для заказа ${order.number}:`,
        () => {
            const modal = document.getElementById('orderModal');
            const modalBody = document.getElementById('orderModalBody');
            
            modalBody.innerHTML = `
                <div style="max-width: 500px; margin: 0 auto;">
                    <h2 style="margin-bottom: 20px; color: var(--text-light);">Изменить статус</h2>
                    
                    <div style="margin-bottom: 30px;">
                        <p>Текущий статус: <strong>${getStatusText(order.status)}</strong></p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                        <button class="btn btn-outline ${order.status === 'pending' ? 'active' : ''}" onclick="setOrderStatus(${orderId}, 'pending')">
                            Ожидание
                        </button>
                        <button class="btn btn-outline ${order.status === 'confirmed' ? 'active' : ''}" onclick="setOrderStatus(${orderId}, 'confirmed')">
                            Подтвержден
                        </button>
                        <button class="btn btn-outline ${order.status === 'preparing' ? 'active' : ''}" onclick="setOrderStatus(${orderId}, 'preparing')">
                            Готовится
                        </button>
                        <button class="btn btn-outline ${order.status === 'ready' ? 'active' : ''}" onclick="setOrderStatus(${orderId}, 'ready')">
                            Готов
                        </button>
                        <button class="btn btn-outline ${order.status === 'on_delivery' ? 'active' : ''}" onclick="setOrderStatus(${orderId}, 'on_delivery')">
                            В доставке
                        </button>
                        <button class="btn btn-outline ${order.status === 'delivered' ? 'active' : ''}" onclick="setOrderStatus(${orderId}, 'delivered')">
                            Доставлен
                        </button>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-outline" onclick="closeModal()">
                            <i class="fas fa-times"></i> Отмена
                        </button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
        }
    );
}

function setOrderStatus(orderId, status) {
    // В реальном приложении здесь был бы запрос к API
    const order = mockData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        loadOrders();
        loadRecentOrders();
        closeModal();
        
        showNotification(`Статус заказа ${order.number} изменен на "${getStatusText(status)}"`);
    }
}

// Создание нового заказа
function showNewOrderModal() {
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    modalBody.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="margin-bottom: 20px; color: var(--text-light);">Создать новый заказ</h2>
            
            <form id="newOrderForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Имя клиента *</label>
                        <input type="text" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Телефон *</label>
                        <input type="tel" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Адрес доставки *</label>
                        <input type="text" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Комментарий</label>
                        <textarea class="form-control" rows="3"></textarea>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: var(--text-light); margin-bottom: 15px;">Добавить пиццы</h4>
                    <div id="orderItemsContainer">
                        <!-- Здесь будут добавляться пиццы -->
                    </div>
                    <button type="button" class="btn btn-outline" onclick="addPizzaToOrder()" style="margin-top: 10px;">
                        <i class="fas fa-plus"></i> Добавить пиццу
                    </button>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-check"></i> Создать заказ
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </form>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Редактирование пиццы
function editPizza(pizzaId) {
    const pizza = mockData.pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;
    
    const modal = document.getElementById('pizzaModalAdmin');
    const modalBody = document.getElementById('pizzaModalBody');
    
    modalBody.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="margin-bottom: 20px; color: var(--text-light);">Редактировать пиццу</h2>
            
            <form id="editPizzaForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Название *</label>
                        <input type="text" class="form-control" value="${pizza.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Цена (₽) *</label>
                        <input type="number" class="form-control" value="${pizza.price}" required>
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea class="form-control" rows="3">${pizza.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Теги (через запятую)</label>
                        <input type="text" class="form-control" value="${pizza.tags || ''}" placeholder="classic,meat,spicy">
                    </div>
                    <div class="form-group">
                        <label>Размеры (через запятую)</label>
                        <input type="text" class="form-control" value="${pizza.sizes || '25см,30см,35см'}">
                    </div>
                    <div class="form-group">
                        <label class="checkbox">
                            <input type="checkbox" ${pizza.active ? 'checked' : ''}>
                            <span>Активная (отображается в меню)</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Сохранить изменения
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </form>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Создание новой пиццы
function showNewPizzaModal() {
    const modal = document.getElementById('pizzaModalAdmin');
    const modalBody = document.getElementById('pizzaModalBody');
    
    modalBody.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="margin-bottom: 20px; color: var(--text-light);">Добавить новую пиццу</h2>
            
            <form id="newPizzaForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Название *</label>
                        <input type="text" class="form-control" required placeholder="Название пиццы">
                    </div>
                    <div class="form-group">
                        <label>Цена (₽) *</label>
                        <input type="number" class="form-control" required placeholder="450">
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea class="form-control" rows="3" placeholder="Вкусное описание..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>URL изображения</label>
                        <input type="text" class="form-control" placeholder="images/pizza.png">
                    </div>
                    <div class="form-group">
                        <label>Теги (через запятую)</label>
                        <input type="text" class="form-control" placeholder="classic,meat,spicy">
                    </div>
                    <div class="form-group">
                        <label>Размеры (через запятую)</label>
                        <input type="text" class="form-control" value="25см,30см,35см">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Добавить пиццу
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </form>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Удаление пиццы
function deletePizza(pizzaId) {
    const pizza = mockData.pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;
    
    showConfirmModal(
        'Удалить пиццу',
        `Вы уверены, что хотите удалить пиццу "${pizza.name}"? Это действие нельзя отменить.`,
        () => {
            // В реальном приложении здесь был бы запрос к API
            mockData.pizzas = mockData.pizzas.filter(p => p.id !== pizzaId);
            loadPizzas();
            updateCounters();
            showNotification(`Пицца "${pizza.name}" удалена`);
        }
    );
}

// Переключение статуса пиццы
function togglePizzaStatus(pizzaId) {
    const pizza = mockData.pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;
    
    pizza.active = !pizza.active;
    loadPizzas();
    loadPopularPizzas();
    
    showNotification(`Пицца "${pizza.name}" ${pizza.active ? 'активирована' : 'деактивирована'}`);
}

// Поиск
function setupSearch() {
    const searchInput = document.getElementById('adminSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            // Фильтрация таблицы заказов
            const rows = document.querySelectorAll('#ordersTableBody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

// График аналитики
function initChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    // Если уже есть график, уничтожаем его
    if (window.salesChart instanceof Chart) {
        window.salesChart.destroy();
    }
    
    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
                label: 'Выручка (тыс. ₽)',
                data: [45, 52, 48, 65, 72, 85, 78],
                borderColor: 'var(--primary-red)',
                backgroundColor: 'rgba(230, 57, 70, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'var(--text-light)'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'var(--border-color)'
                    },
                    ticks: {
                        color: 'var(--text-light)'
                    }
                },
                y: {
                    grid: {
                        color: 'var(--border-color)'
                    },
                    ticks: {
                        color: 'var(--text-light)',
                        callback: function(value) {
                            return value + 'k';
                        }
                    }
                }
            }
        }
    });
}

// Вспомогательные функции
function getStatusText(status) {
    const statuses = {
        'pending': 'Ожидание',
        'confirmed': 'Подтвержден',
        'preparing': 'Готовится',
        'ready': 'Готов',
        'on_delivery': 'В доставке',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status;
}

function getStatusClass(status) {
    return status;
}

function updateCounters() {
    document.getElementById('orders-count').textContent = mockData.orders.length;
    document.getElementById('pizzas-count').textContent = mockData.pizzas.length;
    document.getElementById('customers-count').textContent = mockData.customers.toLocaleString();
}

function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    
    // Удаляем старые обработчики
    confirmYes.replaceWith(confirmYes.cloneNode(true));
    confirmNo.replaceWith(confirmNo.cloneNode(true));
    
    // Добавляем новые обработчики
    document.getElementById('confirmYes').addEventListener('click', function() {
        closeModal();
        onConfirm();
    });
    
    document.getElementById('confirmNo').addEventListener('click', function() {
        closeModal();
    });
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function logout() {
    showConfirmModal(
        'Выход из системы',
        'Вы уверены, что хотите выйти из административной панели?',
        () => {
            localStorage.removeItem('admin_token');
            window.location.href = 'index.html';
        }
    );
}

// Экспортируем функции
window.viewAllOrders = function() {
    document.querySelector('.admin-nav-item[data-section="orders"]').click();
};

window.viewPizzas = function() {
    document.querySelector('.admin-nav-item[data-section="pizzas"]').click();
};

// Обработчики модальных окон
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});