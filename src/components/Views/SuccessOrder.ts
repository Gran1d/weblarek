import {Component} from "../base/Component.ts";
import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";

interface ISuccess{
    description: string;
}

export class SuccessOrder extends Component<ISuccess> {
    protected successDescription: HTMLElement;
    protected successButton: HTMLButtonElement;

    constructor(protected events: IEvents, protected container: HTMLElement) {
        super(container);

        this.successDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.successButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        })
    }

    set description(text: string) {
        this.successDescription.textContent = text;
    }
}