import { CartItem } from "./Cart.js";

const storageKey = "ninalu_cart";
const offerDiscountRate = 0.10;

export class CartManager {
    constructor() {
        /** @type {CartItem[]} **/
        this.items = this._loadFromStorage();
    }
}

