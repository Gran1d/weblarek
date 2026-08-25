import {IProduct} from "../../types";

export class Cart {
    private cartProducts: IProduct[];

    constructor() {
        this.cartProducts = [];
    }

    getCartProducts(): IProduct[] {
        return this.cartProducts;
    }

    setCartProduct(product: IProduct): void {
        this.cartProducts.push(product);
    }

    removeCartProduct(product: IProduct): void {
        this.cartProducts = this.cartProducts.filter(item => item.id !== product.id);
    }

    clearCart(): void {
        this.cartProducts = [];
    }

    getTotalCartPrice(): number {
        return this.cartProducts.reduce((total, current) => {
            const price = current.price ?? 0;
            return total + price;
        }, 0)
    }

    getCountCartProducts(): number {
        return this.cartProducts.length;
    }

    checkProductInCart(id: string): boolean {
        return this.cartProducts.some((item) => item.id === id);
    }
}