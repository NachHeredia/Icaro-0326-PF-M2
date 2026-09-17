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
  card.querySelectorAll(".qty-pill").forEach((pill) => {
    pill.classList.remove("is-selected");
  });
  clickedPill.classList.add("is-selected");

  const priceValueEl = card.querySelector(".price-value");
  const newPrice = Number(clickedPill.dataset.price);
  priceValueEl.dataset.price = newPrice;
  priceValueEl.textContent = formatPrice(newPrice);
}

function showAddedFeedback(button) {
  const originalText = button.textContent;
  button.textContent = "¡Agregado! ✓";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 900);
}

export function initProductsUi() {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    // --- Pastillas de cantidad ---
    card.querySelectorAll(".qty-pill").forEach((pill) => {
      pill.addEventListener("click", () => handlePillClick(card, pill));
    });

    // --- Botón "Agregar al carrito" ---
    const addButton = card.querySelector(".btn-add-cart");
    if (!addButton) return;

    addButton.addEventListener("click", () => {
      const productData = getSelectedProductData(card);
      cartManager.addItem(productData, 1);
      showAddedFeedback(addButton);
    });
  });
}
