import {Component} from "../base/Component.ts";
import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";

interface IHeader {
    counter: number
}

export class Header extends Component<IHeader> {
    private basketButton: HTMLButtonElement;
    private counterElement: HTMLElement;

    constructor(protected events: IEvents, protected container: HTMLElement) {
        super(container);

        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit("basket:open");
        })
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}