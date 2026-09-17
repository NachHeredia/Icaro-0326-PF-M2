import { CartItem } from "./Cart.js";

const OFFER_DISCOUNT_RATE = 0.10;

export class CartManager {
    constructor() {
        /** @type {CartItem[]} **/
        this.items = [];
    }

    _notifyChange() {
        document.dispatchEvent(
            new CustomEvent("cart:updated", {
                detail: {
                    items: this.getItems(),
                    itemCount: this.getItemCount(),
                    subtotal: this.getSubtotal(),
                    discount: this.getDiscount(),
                    total: this.getTotal(),
                },
            })
        );
    }


/**
 * @param {Object} productData
 * @param {number} [quantity]
 * @returns {CartItem} 
 */

addItem(productData, quantity = 1){
    const newItem = new CartItem({...productData, quantity});
    const existing = this.items.find((item) => item.key === newItem.key);

    if(existing){
        existing.quantity += quantity;
        this._notifyChange();
        return existing;
    }

    this.items.push(newItem);
    this._notifyChange();
    return newItem;
}

  /** @param {string} itemKey */
  removeItem(itemKey) {
    this.items = this.items.filter((item) => item.key !== itemKey);
    this._notifyChange();
  }

  /** @param {string} itemKey @returns {number} */
  incrementQty(itemKey) {
    const item = this.items.find((i) => i.key === itemKey);
    if (!item) return 0;
    item.quantity += 1;
    this._notifyChange();
    return item.quantity;
  }

  /** @param {string} itemKey @returns {number} la cantidad nueva, o 0 si se eliminó */
  decrementQty(itemKey) {
    const item = this.items.find((i) => i.key === itemKey);
    if (!item) return 0;

    item.quantity -= 1;
    if (item.quantity <= 0) {
      this.removeItem(itemKey);
      return 0;
    }
    this._notifyChange();
    return item.quantity;
  }

    clear() {
    this.items = [];
    this._notifyChange();
  }

  getItems() {
    return [...this.items];
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + item.lineTotal, 0);
  }

    getDiscount() {
    const offersSubtotal = this.items
      .filter((item) => item.isOffer)
      .reduce((total, item) => total + item.lineTotal, 0);
    return offersSubtotal * OFFER_DISCOUNT_RATE;
  }

  getTotal() {
    return this.getSubtotal() - this.getDiscount();
  }

  hasOfferItems() {
    return this.items.some((item) => item.isOffer);
  }
}

export const cartManager = new CartManager();
