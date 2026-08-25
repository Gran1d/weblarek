import {IBuyer, TPayment} from "../../types";

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

    validateConsumerData(): Partial<Record<keyof IBuyer, string>>{
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        if (this.payment === null) {
            errors.payment = 'Payment is required';
        }
        if (this.address === '') {
            errors.address = 'Address is required';
        }
        if (this.phone === '') {
            errors.phone = 'Phone is required';
        }
        if (this.email === '') {
            errors.email = 'Email is required';
        }

        return errors;
    }
}