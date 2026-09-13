export class Product {
    constructor (id, name, category, offer, variant = false) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.offer = offer;
        this.variant = variant;
    }
}