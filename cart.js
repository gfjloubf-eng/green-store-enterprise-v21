// cart.js - Advanced Cart Logic for Green Market Global
// localStorage + AJAX save to PHP

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
  const tbody = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  if (!tbody || !totalEl) return;

  tbody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <button onclick="updateQty(${index}, -1)">-</button>
        ${item.quantity}
        <button onclick="updateQty(${index}, 1)">+</button>
      </td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td><button class="btn" style="background:#f44336" onclick="removeItem(${index})">حذف</button></td>
    `;
    tbody.appendChild(row);
    total += item.price * item.quantity;
  });

  totalEl.textContent = total.toFixed(2);
}

function updateQty(index, delta) {
  if (cart[index].quantity + delta > 0) {
    cart[index].quantity += delta;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function checkout() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone')?.value || '';
  const addr = document.getElementById('delivery_addr')?.value || '';

  if (!name || !email || cart.length === 0) {
    alert('املأ البيانات والسلة');
    return;
  }

  // Get delivery loc (demo first loc)
  fetch('api.php?action=locations')
    .then(res => res.json())
    .then(data => {
      const loc = data.locations[0] || {lat:15.55, lng:48.52};
      const orderData = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_addr: addr,
        lat: loc.lat,
        lng: loc.lng,
        products: cart.map(i => ({id: i.id || 0, name:i.name, qty:i.quantity, price:i.price})),
        total: parseFloat(document.getElementById('total').textContent)
      };

      fetch('save_order.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(orderData)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('تم حفظ الطلب! رقم الطلب: ' + data.order_id);
          cart = [];
          localStorage.removeItem('cart');
          renderCart();
        } else {
          alert('خطأ: ' + (data.message || data.error));
        }
      });
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const checkoutBtn = document.getElementById('checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }
});

