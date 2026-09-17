import { cartManager } from "./CartManager.js";

const BADGE_SELECTOR = "#cart-badge";

function updateBadge(itemCount){
    const badge = document.querySelector(BADGE_SELECTOR);
    if(!badge) return;
    badge.textContent = itemCount;
    badge.computedStyleMap.display = itemCount > 0 ? "inline-flex" : "none";
}

export function initCartBadgeUi(){
    updateBadge(cartManager.getItemCount());

    document.addEventListener("cart:updated", (event) => {
        updateBadge(event.detail.itemCount);
    });
}