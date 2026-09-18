import { FilterUi } from "./CategoryFilterUi.js";
import { initProductsUi } from "./ProductsUi.js";
import { initCartBadgeUi } from "./CartBadgeUi.js";
import { initCartDrawerUi } from "./CartDrawerUi.js";
import { initSearchUi } from "./SearchUi.js";

export function initApp() {
  initCartBadgeUi();
  initCartDrawerUi();
  initSearchUi();

  if (document.querySelector(".product-card")) {
    initProductsUi();
  }

  if (document.querySelector(".category-section")) {
    new FilterUi();
  }
}


