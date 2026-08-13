
// تحميل السلة من التخزين المحلي
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItems = document.getElementById('cart-items');
const totalDisplay = document.getElementById('total');

// عرض السلة في الصفحة
function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    let subtotal = item.price * item.quantity;
    total += subtotal;

    let row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}$</td>
        <td>
          <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty">
        </td>
        <td>${subtotal.toFixed(2)}$</td>
        <td><button class="remove" data-index="${index}">❌</button></td>
      </tr>
    `;
    cartItems.insertAdjacentHTML('beforeend', row);
  });

  totalDisplay.textContent = total.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// تحديث الكمية
cartItems.addEventListener('change', e => {
  if (e.target.classList.contains('qty')) {
    let index = e.target.dataset.index;
    cart[index].quantity = parseInt(e.target.value);
    renderCart();
  }
});

// حذف منتج
cartItems.addEventListener('click', e => {
  if (e.target.classList.contains('remove')) {
    let index = e.target.dataset.index;
    cart.splice(index, 1);
    renderCart();
  }
});

document.getElementById('checkout').addEventListener('click', () => {
  alert("تم إرسال الطلب بنجاح ✅");
  localStorage.removeItem('cart');
  cart = [];
  renderCart();
});

renderCart();

