import {IBuyer, TConsumerErrors, TPayment} from "../../types";
import {IEvents} from "../base/Events.ts";

export class Consumer {
    private payment: TPayment | null
    private address: string
    private phone: string
    private email: string

    constructor(protected event: IEvents) {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    setConsumerData(buyerData: Partial<IBuyer>): void {
        if (buyerData.payment) {
            this.payment = buyerData.payment;
            this.event.emit('consumer:changed');
        }
        if (buyerData.address) {
            this.address = buyerData.address;
            this.event.emit('consumer:changed');
        }
        if (buyerData.phone) {
            this.phone = buyerData.phone;
            this.event.emit('consumer:changed');
        }
        if (buyerData.email) {
            this.email = buyerData.email;
            this.event.emit('consumer:changed');
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
        this.event.emit('consumer:changed');
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