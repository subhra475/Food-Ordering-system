/* Global State from LocalStorage */
let cart = JSON.parse(localStorage.getItem('goldenbite_cart')) || [];

/* Products Data */
const products = [
  { id: 1, name: "Margherita Pizza", price: 299, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", category: "pizza" },
  { id: 2, name: "Gourmet Burger", price: 249, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", category: "burger" },
  { id: 3, name: "Truffle Pasta", price: 349, image: "./images/chinese pasta.jpg", category: "pasta" },
  { id: 4, name: "Italian Pasta", price: 399, image: "./images/italian pasta.png", category: "pasta" },
  { id: 5, name: "Mexican Taco", price: 469, image: "./images/mexican taco.jpg", category: "mexican" },
  { id: 6, name: "Hot Chocolate Milk", price: 499, image: "./images/Hot chocolate milk.jpg", category: "beverage" }
];

/* --- INIT --- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartIcon();

  // If on Menu Page
  if (document.querySelector('.menu-grid')) {
    renderMenu('all');
  }

  // If on Checkout Page
  if (document.getElementById('checkout-bill')) {
    renderCheckout();
  }

  // Check Auth State for Navbar
  const user = JSON.parse(localStorage.getItem('goldenbite_user'));
  const navAuth = document.getElementById('nav-auth');
  if (navAuth) {
    if (user) {
      navAuth.innerHTML = `<a href="#" onclick="logout()">Logout (${user.name})</a>`;
    } else {
      navAuth.innerHTML = `<a href="login.html">Login</a>`;
    }
  }
});

/* --- MENU --- */
function renderMenu(category) {
  const grid = document.querySelector('.menu-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const filtered = category === 'all' ? products : products.filter(p => p.category === category);

  filtered.forEach(p => {
    const div = document.createElement('div');
    div.className = 'menu-item scroll-reveal';
    div.innerHTML = `
            <img src="${p.image}" loading="lazy">
            <h3>${p.name}</h3>
            <p>₹${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
    grid.appendChild(div);
  });
}

function filterMenu(cat) {
  renderMenu(cat);
}

/* --- CART --- */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartIcon();
  showToast(`Added ${product.name}`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  if (document.getElementById('checkout-bill')) renderCheckout();
  updateCartIcon();
}

function updateQuantity(id, change) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    if (document.getElementById('checkout-bill')) renderCheckout();
    updateCartIcon();
  }
}

function saveCart() {
  localStorage.setItem('goldenbite_cart', JSON.stringify(cart));
}

function updateCartIcon() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/* --- CHECKOUT & BILLING --- */
function renderCheckout() {
  const container = document.getElementById('checkout-items');
  const summary = document.getElementById('checkout-summary');

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    summary.innerHTML = "";
    return;
  }

  // 1. Render Items
  container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="info">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
            </div>
            <div class="total">₹${item.price * item.quantity}</div>
            <div class="controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

  // 2. Calculate Bill
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cgst = subtotal * 0.025; // 2.5%
  const sgst = subtotal * 0.025; // 2.5%
  const total = subtotal + cgst + sgst;

  // 3. Render Summary
  summary.innerHTML = `
        <div class="summary-row"><span>Subtotal</span> <span>₹${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>CGST (2.5%)</span> <span>₹${cgst.toFixed(2)}</span></div>
        <div class="summary-row"><span>SGST (2.5%)</span> <span>₹${sgst.toFixed(2)}</span></div>
        <div class="summary-row total"><span>Grand Total</span> <span>₹${total.toFixed(2)}</span></div>
    `;
}

/* --- PAYMENT --- */
function selectPayment(method) {
  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
  document.getElementById(`pay-${method}`).classList.add('selected');

  const details = document.getElementById('payment-details');
  if (method === 'upi') {
    details.innerHTML = `
            <div style="text-align:center; margin-top:1rem;">
                <p>Scan to Pay</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=shop@upi&pn=GoldenBite&am=100" alt="UPI QR">
            </div>
        `;
  } else if (method === 'card') {
    details.innerHTML = `
            <input type="text" placeholder="Card Number" class="w-full mt-2 p-2 bg-dark border border-gold rounded text-white">
            <div class="flex gap-2 mt-2">
                <input type="text" placeholder="MM/YY" class="w-1/2 p-2 bg-dark border border-gold rounded text-white">
                <input type="text" placeholder="CVC" class="w-1/2 p-2 bg-dark border border-gold rounded text-white">
            </div>
        `;
  } else {
    details.innerHTML = `<p style="margin-top:1rem;color:#ecc94b;">Cash on Delivery selected. Pay when you eat!</p>`;
  }
}

function processOrder(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerText = "Processing...";

  setTimeout(() => {
    // Success
    cart = [];
    saveCart();
    window.location.href = "index.html?order=success";
  }, 2000);
}

/* --- UTILS --- */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Check for success param
if (new URLSearchParams(window.location.search).get('order') === 'success') {
  showToast("Order Placed Successfully! 🎉");
}

/* Logout Helper */
function logout() {
  localStorage.removeItem('goldenbite_user');
  window.location.reload();
}