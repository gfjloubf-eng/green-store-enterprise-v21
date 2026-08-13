
// Load products dynamically
async function loadProducts() {
  try {
    const res = await fetch('api.php?action=products');
    const data = await res.json();
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    data.products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${product.img || 'photo/default.jpg'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>السعر: $${product.price}</p>
        <button class="btn add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">أضف إلى السلة</button>
      `;
      grid.appendChild(div);
    });
    attachCartListeners();
  } catch(e) {
    console.error('Load products error', e);
  }
}

function attachCartListeners() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.id == id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({id, name, price, quantity: 1});
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('تمت الإضافة 🛒');
    });
  });
}

// Hero btn scroll
document.querySelector('.btn')?.addEventListener('click', () => {
  document.getElementById('products').scrollIntoView();
});

// Init
loadProducts();



