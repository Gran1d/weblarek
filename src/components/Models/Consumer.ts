import {IBuyer, TConsumerErrors, TPayment} from "../../types";

export class Consumer {
    private payment: TPayment | null
    private address: string
    private phone: string
    private email: string

    constructor() {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    setConsumerData(buyerData: Partial<IBuyer>): void {
        if (buyerData.payment) {
            this.payment = buyerData.payment;
        }
        if (buyerData.address) {
            this.address = buyerData.address;
        }
        if (buyerData.phone) {
            this.phone = buyerData.phone;
        }
        if (buyerData.email) {
            this.email = buyerData.email;
        }
    }

    getConsumerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        }
    }

    clearConsumerData(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validateConsumerData(): TConsumerErrors {
        const errors: TConsumerErrors = {};
        if (this.payment === null) {
            errors.payment = "Не выбран тип оплаты";
        }
        if (this.address === '') {
            errors.address = "Не указан адрес получения";
        }
        if (this.phone === '') {
            errors.phone = "Не указан номер телефона";
        }
        if (this.email === '') {
            errors.email = "Не указана электронная почта";
        }

        return errors;
    }
}