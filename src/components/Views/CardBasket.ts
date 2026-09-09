import {Card} from "./Card.ts";
import {ICardAction} from "../../types";
import {ensureElement} from "../../utils/utils.ts";

interface ICardBasket{
    index: number
}

export class CardBasket extends Card<ICardBasket> {
    protected cardButton: HTMLButtonElement;
    protected cardIndexElement: HTMLElement;

    constructor(protected container: HTMLElement, protected action?: ICardAction) {
        super(container);

        this.cardButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.cardIndexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);

        if (action?.onClick) {
            this.cardButton.addEventListener('click', action.onClick);
        }
    }

    set index(value: number) {
        this.cardIndexElement.textContent = String(value);
    }
}