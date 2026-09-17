export class CartItem {
    /**
     * @param {Object} data
     * @param {string} data.productId
     * @param {string} data.name
     * @param {string} data.category
     * @param {string} data.variant
     * @param {number} data.unitPrice
     * @param {boolean} [data.isOffer]
     * @param {string} [data.image]
     * @param {number} [data.quantity]
     */
    constructor({productId, name, category, variant, unitPrice, isOffer = false, image = "", quanttity = 1}) {
        this.productId = productId;
        this.name = name;
        this.category = category;
        this.variant = variant;
        this.unitPrice = unitPrice;
        this.isOffer = isOffer;
        this.image = image;
        this.quantity = quanttity;
    }

    get key(){
        return `${this.productId}::${this.variant}`;
    }

    get lineTotal(){
        return this.unitPrice * this.quantity;
    }
}