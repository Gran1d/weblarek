import {Component} from "../base/Component.ts";
import {TCard} from "../../types";
import {ensureElement} from "../../utils/utils.ts";

export class Card<T> extends Component<TCard & T> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(text: string) {
        this.cardTitle.textContent = text;
    }

    set price(value: number | null) {
        if (value !== null){
            this.cardPrice.textContent = `${value} синапсов`;
        } else {
            this.cardPrice.textContent = 'Бесценно';
        }
    }
}