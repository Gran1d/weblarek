import {TPayment} from "../../types";
import {Form} from "./Form.ts";
import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";

interface IFormOrder{
    address: string,
    payment: TPayment,
}

export class FormOrder extends Form<IFormOrder> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected formAddress: HTMLInputElement;

    constructor(protected events: IEvents, protected container: HTMLElement) {
        super(events, container);

        this.cardButton = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
        this.formAddress = ensureElement<HTMLInputElement>('[name="address"]', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('payment:change', {
                payment: "card"
            })
        })
        this.cashButton.addEventListener('click', () => {
            this.events.emit('payment:change', {
                payment: "cash"
            })
        })
    }

    set address(value: string) {
        this.formAddress.value = value;
    }

    set payment(value: TPayment | null) {
        this.cardButton.classList.remove("button_alt-active");
        this.cashButton.classList.remove("button_alt-active");

        if (value === "card") {
            this.cardButton.classList.add("button_alt-active");
        }
        if (value === "cash") {
            this.cashButton.classList.add("button_alt-active");
        }
    }
}