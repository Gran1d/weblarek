import {IProduct} from "../../types";

export class ProductCatalog {
    private products: IProduct[];
    private selectedProduct: IProduct | null;

    constructor() {
        this.products = [];
        this.selectedProduct = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductByID(id: string) {
        return this.products.find((item) => item.id === id);
    }

    setSelectedProduct(item: IProduct): void {
        this.selectedProduct = item;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}