import {Component} from "../base/Component.ts";
import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";

interface IBasketGallery{
    basketCatalog: HTMLElement[];
    totalPrice: number;
    isDisabled: boolean;
}

export class BasketGallery extends Component<IBasketGallery> {
    protected basketElement: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketPriceElement: HTMLElement;

    constructor(protected events: IEvents, protected container: HTMLElement) {
        super(container);

        this.basketElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:order')
        })
    }

    set basketCatalog(items: HTMLElement[]) {
        this.basketElement.replaceChildren(...items);
    }

    set isDisabled(value: boolean) {
        this.basketButton.disabled = value;
    }

    set totalPrice(value: number) {
        this.basketPriceElement.textContent = `${value} синапсов`
    }
}