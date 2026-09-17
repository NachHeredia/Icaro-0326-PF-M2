import { cartManager } from "./CartManager.js";

function formatPrice(value) {
  return `$${Math.round(value).toLocaleString("es-AR")}`;
}

function injectDrawerMarkup() {
  if (document.querySelector(".cart-drawer")) return;

  const markup = `
    <div class="cart-overlay" id="cart-overlay"></div>

    <aside class="cart-drawer" id="cart-drawer">
      <div class="cart-drawer__header">
        <h2 class="cart-drawer__title">Tu carrito</h2>
        <button class="cart-drawer__close" id="cart-drawer-close" type="button" aria-label="Cerrar carrito">&times;</button>
      </div>

      <div class="cart-drawer__items" id="cart-drawer-items"></div>

      <div class="cart-drawer__summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span id="cart-summary-subtotal">$0</span>
        </div>
        <div class="summary-row summary-row--discount" id="cart-summary-discount-row" style="display:none;">
          <span>Descuento (10%)</span>
          <span id="cart-summary-discount">-$0</span>
        </div>
        <div class="summary-row summary-row--total">
          <span>Total</span>
          <span id="cart-summary-total">$0</span>
        </div>
        <button class="btn-checkout" type="button" disabled>Ir a pagar (próximamente)</button>
      </div>
    </aside>
  `;

  document.body.insertAdjacentHTML("beforeend", markup);
}

function openDrawer() {
  document.getElementById("cart-overlay").classList.add("is-open");
  document.getElementById("cart-drawer").classList.add("is-open");
  document.body.classList.add("cart-open");
}

function closeDrawer() {
  document.getElementById("cart-overlay").classList.remove("is-open");
  document.getElementById("cart-drawer").classList.remove("is-open");
  document.body.classList.remove("cart-open");
}

function renderCartItem(item) {
  return `
    <div class="cart-item" data-key="${item.key}">
      <div class="cart-item__media">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__variant">${item.variant}</p>
        <div class="cart-item__bottom-row">
          <div class="qty-stepper">
            <button type="button" class="stepper-decrement" aria-label="Restar">-</button>
            <span class="stepper-qty">${item.quantity}</span>
            <button type="button" class="stepper-increment" aria-label="Sumar">+</button>
          </div>
          <span class="cart-item__price">${formatPrice(item.lineTotal)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderDrawer() {
  const items = cartManager.getItems();
  const itemsContainer = document.getElementById("cart-drawer-items");

  itemsContainer.innerHTML = items.length
    ? items.map(renderCartItem).join("")
    : `<p class="cart-drawer__empty">Todavía no agregaste productos.</p>`;

  const subtotal = cartManager.getSubtotal();
  const discount = cartManager.getDiscount();
  const total = cartManager.getTotal();

  document.getElementById("cart-summary-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("cart-summary-total").textContent = formatPrice(total);

  const discountRow = document.getElementById("cart-summary-discount-row");
  if (discount > 0) {
    discountRow.style.display = "flex";
    document.getElementById("cart-summary-discount").textContent = `-${formatPrice(discount)}`;
  } else {
    discountRow.style.display = "none";
  }
}

function attachEvents() {
  document.getElementById("cart-overlay").addEventListener("click", closeDrawer);
  document.getElementById("cart-drawer-close").addEventListener("click", closeDrawer);

  document.querySelectorAll("#cart-button").forEach((btn) => {
    btn.addEventListener("click", openDrawer);
  });

  document.getElementById("cart-drawer-items").addEventListener("click", (event) => {
    const itemEl = event.target.closest(".cart-item");
    if (!itemEl) return;
    const key = itemEl.dataset.key;

    if (event.target.closest(".stepper-increment")) {
      cartManager.incrementQty(key);
    } else if (event.target.closest(".stepper-decrement")) {
      cartManager.decrementQty(key);
    }
  });

  document.addEventListener("cart:updated", renderDrawer);
}

export function initCartDrawerUi() {
  injectDrawerMarkup();
  renderDrawer();
  attachEvents();
}