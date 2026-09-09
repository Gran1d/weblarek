import {IProduct} from "../../types";
import {IEvents} from "../base/Events.ts";

export class Cart {
    private cartProducts: IProduct[];

    constructor(protected event: IEvents) {
        this.cartProducts = [];
    }

    getCartProducts(): IProduct[] {
        return this.cartProducts;
    }

    setCartProduct(product: IProduct): void {
        this.cartProducts.push(product);
        this.event.emit('basket:changed');
    }

    removeCartProduct(product: IProduct): void {
        this.cartProducts = this.cartProducts.filter(item => item.id !== product.id);
        this.event.emit('basket:changed');
    }

    clearCart(): void {
        this.cartProducts = [];
        this.event.emit('basket:changed');
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