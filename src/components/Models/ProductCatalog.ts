import {IProduct} from "../../types";
import {IEvents} from "../base/Events.ts";

export class ProductCatalog {
    private products: IProduct[];
    private selectedProduct: IProduct | null;

    constructor(protected event: IEvents) {
        this.products = [];
        this.selectedProduct = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.event.emit('catalog:changed');
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductByID(id: string) {
        return this.products.find((item) => item.id === id);
    }

    setSelectedProduct(item: IProduct): void {
        this.selectedProduct = item;
        this.event.emit('catalog:selected');
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}