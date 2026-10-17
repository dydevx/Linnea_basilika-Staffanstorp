/**
 * Linnea & Basilika – Cart System
 * Persists cart data in localStorage
 */

const CART_KEY = "lb_cart";

let cart = loadCart();

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn("Could not save cart to localStorage");
  }
}

function addToCart(item) {
  // item: { id, code, name, price, quantity, note, extras }
  const existing = cart.find(i => i.id === item.id && i.note === (item.note || ""));
  if (existing) {
    existing.quantity += (item.quantity || 1);
  } else {
    cart.push({
      id: item.id,
      code: item.code || null,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      note: item.note || "",
      extras: item.extras || [],
      image: item.image || (window.getDishImage ? window.getDishImage(item) : "")
    });
  }
  saveCart();
  updateCartUI();
  showToast(`${item.name} tillagd i varukorgen!`);
}

function removeFromCart(cartIndex) {
  cart.splice(cartIndex, 1);
  saveCart();
  updateCartUI();
}

function updateQuantity(cartIndex, delta) {
  if (!cart[cartIndex]) return;
  cart[cartIndex].quantity += delta;
  if (cart[cartIndex].quantity <= 0) {
    removeFromCart(cartIndex);
  } else {
    saveCart();
    updateCartUI();
  }
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const extrasTotal = (item.extras || []).reduce((s, e) => s + (e.price || 0), 0);
    return sum + (item.price + extrasTotal) * item.quantity;
  }, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartUI() {
  // Update badge
  const badges = document.querySelectorAll(".cart-badge");
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach(element => {
    element.textContent = count;
  });
  document.querySelectorAll("[data-cart-total]").forEach(element => {
    element.textContent = `${getCartTotal()} kr`;
  });
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? "flex" : "none";
  });

  renderCatalogCart();
  // Update cart drawer if open
  renderCartDrawer();
}

function renderCatalogCart() {
  const itemsEl = document.getElementById("catalog-cart-items");
  const totalEl = document.getElementById("catalog-cart-total");
  if (!itemsEl || !totalEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="catalog-empty">Inga rätter ännu</p>';
  } else {
    itemsEl.innerHTML = cart.map((item, index) => {
      const extrasTotal = (item.extras || []).reduce((sum, extra) => sum + (extra.price || 0), 0);
      const lineTotal = (item.price + extrasTotal) * item.quantity;
      return `
        <div class="catalog-cart-item">
          <div class="catalog-cart-item-copy">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${lineTotal} kr</span>
          </div>
          <div class="catalog-cart-item-controls" aria-label="Antal ${escapeHtml(item.name)}">
            <button type="button" data-cart-delta="-1" data-cart-index="${index}" aria-label="Minska antal ${escapeHtml(item.name)}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-delta="1" data-cart-index="${index}" aria-label="Öka antal ${escapeHtml(item.name)}">+</button>
            <button type="button" data-cart-remove="${index}" aria-label="Ta bort ${escapeHtml(item.name)}">Ta bort</button>
          </div>
        </div>
      `;
    }).join("");
  }

  totalEl.textContent = `${getCartTotal()} kr`;
}

function renderCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  if (!drawer) return;

  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total-amount");
  const emptyEl = document.getElementById("cart-empty");
  const contentEl = document.getElementById("cart-content");

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = "flex";
    if (contentEl) contentEl.style.display = "none";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";
  if (contentEl) contentEl.style.display = "flex";

  cartItemsEl.innerHTML = cart.map((item, idx) => {
    const extrasTotal = (item.extras || []).reduce((sum, extra) => sum + (extra.price || 0), 0);
    const image = item.image || (window.getDishImage ? window.getDishImage(item) : "assets/images/ai/mixed-plate.png");
    return `
    <div class="cart-item" data-index="${idx}">
      <img class="cart-item-thumb" src="${escapeHtml(image)}" alt="" loading="lazy">
      <div class="cart-item-info">
        <div class="cart-item-name">
          ${item.code ? `<span class="cart-item-code">Nr ${item.code}</span>` : ""}
          ${escapeHtml(item.name)}
        </div>
        ${item.note ? `<div class="cart-item-note">${escapeHtml(item.note)}</div>` : ""}
        ${(item.extras || []).length > 0 ? `<div class="cart-item-extras">${item.extras.map(e => escapeHtml(e.name)).join(", ")}</div>` : ""}
        <div class="cart-item-price">${item.price} kr/st</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQuantity(${idx}, -1)" aria-label="Minska antal">−</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${idx}, 1)" aria-label="Öka antal">+</button>
        <button class="remove-btn" onclick="removeFromCart(${idx})" aria-label="Ta bort">🗑</button>
      </div>
      <div class="cart-item-subtotal">${((item.price + extrasTotal) * item.quantity)} kr</div>
    </div>
  `;
  }).join("");

  if (cartTotalEl) cartTotalEl.textContent = `${getCartTotal()} kr`;
}

function showToast(message) {
  const existing = document.querySelector(".cart-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.setAttribute("role", "status");
  const icon = document.createElement("span");
  icon.className = "toast-check-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "✓";
  const label = document.createElement("span");
  label.textContent = message;
  toast.append(icon, label);
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Init cart on load
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});

document.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const addButton = target.closest("[data-cart-item]");
  if (addButton) {
    addToCart(JSON.parse(decodeURIComponent(addButton.dataset.cartItem)));
    const label = addButton.querySelector("span");
    addButton.classList.add("is-added");
    if (label) label.textContent = "Tillagd";
    clearTimeout(addButton.feedbackTimeout);
    addButton.feedbackTimeout = setTimeout(() => {
      addButton.classList.remove("is-added");
      if (label) label.textContent = "Lägg till";
    }, 1400);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const rect = addButton.getBoundingClientRect();
      const particle = document.createElement("span");
      particle.className = "fly-plus-one";
      particle.textContent = "+1";
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top}px`;
      document.body.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
      document.querySelectorAll(".btn-order, .mobile-cart-count, [data-cart-total]").forEach(badge => {
        badge.classList.remove("cart-feedback");
        void badge.offsetWidth;
        badge.classList.add("cart-feedback");
        badge.addEventListener("animationend", () => badge.classList.remove("cart-feedback"), { once: true });
      });
    }
    return;
  }

  const quantityButton = target.closest("[data-cart-delta]");
  if (quantityButton) {
    const index = Number(quantityButton.dataset.cartIndex);
    const delta = Number(quantityButton.dataset.cartDelta);
    if (Number.isInteger(index) && (delta === -1 || delta === 1)) {
      updateQuantity(index, delta);
    }
    return;
  }

  const removeButton = target.closest("[data-cart-remove]");
  if (removeButton) {
    const index = Number(removeButton.dataset.cartRemove);
    if (Number.isInteger(index)) removeFromCart(index);
  }
});
