// ===== PRODUCT DATA =====
const products = [
    { id: 1, name: 'Velvet Matte Lipstick', category: 'Lipstick', price: 28, oldPrice: 35, rating: 4.8, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80', discount: 20, reviews: 142 },
    { id: 2, name: 'Luminous Foundation', category: 'Foundation', price: 42, oldPrice: 52, rating: 4.9, img: 'https://images.unsplash.com/photo-1631214431700-37cc3f7c6db8?w=400&q=80', discount: 19, reviews: 98 },
    { id: 3, name: 'Glossy Lip Oil', category: 'Lip Gloss', price: 22, oldPrice: 28, rating: 4.7, img: 'https://images.unsplash.com/photo-1612437038229-0247a232ba98?w=400&q=80', discount: 21, reviews: 234 },
    { id: 4, name: 'Eyeshadow Palette', category: 'Eyeshadow', price: 38, oldPrice: 48, rating: 4.6, img: 'https://images.unsplash.com/photo-1516972810927-80185027ca84?w=400&q=80', discount: 20, reviews: 187 },
    { id: 5, name: 'Hydrating Primer', category: 'Primer', price: 32, oldPrice: 40, rating: 4.5, img: 'https://images.unsplash.com/photo-1631214425960-0d3c7d9a3b4c?w=400&q=80', discount: 20, reviews: 76 },
    { id: 6, name: 'Full Coverage Concealer', category: 'Concealer', price: 24, oldPrice: 30, rating: 4.8, img: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0c?w=400&q=80', discount: 20, reviews: 215 },
    { id: 7, name: 'Mascara Volume', category: 'Mascara', price: 26, oldPrice: 34, rating: 4.4, img: 'https://images.unsplash.com/photo-1519368358672-25b03afee2bf?w=400&q=80', discount: 23, reviews: 312 },
    { id: 8, name: 'Blush Duo', category: 'Blush', price: 30, oldPrice: 38, rating: 4.3, img: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&q=80', discount: 21, reviews: 56 },
    { id: 9, name: 'Highlighter Stick', category: 'Highlighter', price: 28, oldPrice: 36, rating: 4.9, img: 'https://images.unsplash.com/photo-1596462502278-27bfdc8bd30c?w=400&q=80', discount: 22, reviews: 89 },
    { id: 10, name: 'Cleansing Balm', category: 'Cleanser', price: 34, oldPrice: 42, rating: 4.6, img: 'https://images.unsplash.com/photo-1556228720-195a672e8a7a?w=400&q=80', discount: 19, reviews: 67 },
    { id: 11, name: 'Moisturizer Cream', category: 'Moisturizer', price: 44, oldPrice: 54, rating: 4.7, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80', discount: 18, reviews: 123 },
    { id: 12, name: 'Vitamin C Serum', category: 'Serum', price: 48, oldPrice: 60, rating: 4.9, img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80', discount: 20, reviews: 156 }
];

// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem('tarteCart')) || [];

function saveCart() {
    localStorage.setItem('tarteCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;

    const drawer = document.getElementById('cartItems');
    if (!drawer) return;

    if (cart.length === 0) {
        drawer.innerHTML = '<p style="text-align:center;color:#888;padding:40px 0;">Your bag is empty.</p>';
    } else {
        drawer.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div style="flex:1;">
                    <strong style="font-size:0.9rem;">${item.name}</strong>
                    <br><span style="color:#5A189A;font-weight:600;">$${item.price}</span>
                    <div class="qty" style="margin-top:4px;">
                        <button onclick="changeQty(${idx},-1)">−</button>
                        <span style="min-width:24px;text-align:center;">${item.qty}</span>
                        <button onclick="changeQty(${idx},1)">+</button>
                    </div>
                </div>
                <button onclick="removeItem(${idx})" style="background:none;border:none;color:#b00;font-size:1.2rem;cursor:pointer;">✕</button>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 0 ? 5 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('shipping').textContent = shipping.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('grandTotal').textContent = total.toFixed(2);
}

window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...p, qty: 1 });
    }
    saveCart();
    
    // Feedback
    const btn = document.querySelector(`[data-product-id="${id}"]`);
    if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Added';
        btn.style.background = '#28a745';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
        }, 1500);
    }
};

window.changeQty = function(idx, delta) {
    if (cart[idx]) {
        cart[idx].qty = Math.max(1, cart[idx].qty + delta);
        saveCart();
    }
};

window.removeItem = function(idx) {
    cart.splice(idx, 1);
    saveCart();
};

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
});

// ===== HAMBURGER MENU =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });
    }

    // Cart drawer toggle
    const cartIcon = document.getElementById('cartIcon');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCart = document.getElementById('closeCart');
    
    if (cartIcon && cartDrawer) {
        cartIcon.addEventListener('click', function() {
            cartDrawer.classList.toggle('open');
        });
    }
    
    if (closeCart && cartDrawer) {
        closeCart.addEventListener('click', function() {
            cartDrawer.classList.remove('open');
        });
    }

    // Clear cart
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Empty your cart?')) {
                cart = [];
                saveCart();
            }
        });
    }

    updateCartUI();
});