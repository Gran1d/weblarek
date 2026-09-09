import {Form} from "./Form.ts";
import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";

interface IFormContact{
    email: string,
    number: string,
}

export class FormContact extends Form<IFormContact> {
    formEmail: HTMLInputElement;
    formNumber: HTMLInputElement

    constructor(protected events: IEvents, protected container: HTMLElement) {
        super(events, container);

        this.formEmail = ensureElement<HTMLInputElement>('[name="email"]', this.container);
        this.formNumber = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
    }

    set email(value: string) {
        this.formEmail.value = value;
    }

    set number(value: string) {
        this.formNumber.value = value;
    }
}