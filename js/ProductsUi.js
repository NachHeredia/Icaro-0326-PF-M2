import { cartManager } from "./CartManager.js";

function formatPrice(value) {
  return `$${value.toLocaleString("es-AR")}`;
}

function getSelectedProductData(card) {
  const productId = card.dataset.productId;
  const name = card.dataset.name;
  const category = card.dataset.category;
  const isOffer = card.dataset.offer === "true";
  const image = card.querySelector(".product-card__media img")?.getAttribute("src") || "";

  const selectedPill = card.querySelector(".qty-pill.is-selected");

  if (selectedPill) {
    return {
      productId,
      name,
      category,
      isOffer,
      image,
      variant: selectedPill.dataset.variant,
      unitPrice: Number(selectedPill.dataset.price),
    };
  }

  const priceValueEl = card.querySelector(".price-value");
  return {
    productId,
    name,
    category,
    isOffer,
    image,
    variant: card.dataset.variant || "Único",
    unitPrice: Number(priceValueEl?.dataset.price || 0),
  };
}

function handlePillClick(card, clickedPill) {
  card.querySelectorAll(".qty-pill").forEach((pill) => pill.classList.remove("is-selected"));
  clickedPill.classList.add("is-selected");

  const priceValueEl = card.querySelector(".price-value");
  const newPrice = Number(clickedPill.dataset.price);
  priceValueEl.dataset.price = newPrice;
  priceValueEl.textContent = formatPrice(newPrice);
}

function buildStepper(card) {
  const stepper = document.createElement("div");
  stepper.className = "qty-stepper";
  stepper.style.display = "none";
  stepper.innerHTML = `
    <button type="button" class="stepper-decrement" aria-label="Restar">-</button>
    <span class="stepper-qty">1</span>
    <button type="button" class="stepper-increment" aria-label="Sumar">+</button>
  `;

  const addButton = card.querySelector(".btn-add-cart");
  addButton.insertAdjacentElement("afterend", stepper);
  return stepper;
}

function showStepper(card, quantity) {
  const addButton = card.querySelector(".btn-add-cart");
  const stepper = card.querySelector(".qty-stepper");

  addButton.style.display = "none";
  stepper.style.display = "flex";
  stepper.querySelector(".stepper-qty").textContent = quantity;
}

function showAddButton(card) {
  const addButton = card.querySelector(".btn-add-cart");
  const stepper = card.querySelector(".qty-stepper");

  stepper.style.display = "none";
  addButton.style.display = "block";
}

export function initProductsUi() {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    const stepper = buildStepper(card);
    card.querySelectorAll(".qty-pill").forEach((pill) => {
      pill.addEventListener("click", () => handlePillClick(card, pill));
    });

    const addButton = card.querySelector(".btn-add-cart");
    addButton.addEventListener("click", () => {
      const productData = getSelectedProductData(card);
      const item = cartManager.addItem(productData, 1);
      // Guardamos la key en el propio DOM para no recalcularla después
      stepper.dataset.key = item.key;
      showStepper(card, item.quantity);
    });

    stepper.querySelector(".stepper-increment").addEventListener("click", () => {
      cartManager.incrementQty(stepper.dataset.key);
    });

    stepper.querySelector(".stepper-decrement").addEventListener("click", () => {
      cartManager.decrementQty(stepper.dataset.key);
    });
  });

  document.addEventListener("cart:updated", () => {
    cards.forEach((card) => {
      const stepper = card.querySelector(".qty-stepper");
      const key = stepper.dataset.key;
      if (!key) return;

      const currentItem = cartManager.getItems().find((item) => item.key === key);

      if (!currentItem) {
        showAddButton(card);
      } else {
        showStepper(card, currentItem.quantity);
      }
    });
  });
}
