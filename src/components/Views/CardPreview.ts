import {Card} from "./Card.ts";
import {TCardPreview} from "../../types";
import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";
import {categoryMap} from "../../utils/constants.ts";

export class CardPreview extends Card<TCardPreview> {
    protected cardCategory: HTMLElement;
    protected cardButtond: HTMLButtonElement;
    protected cardImage: HTMLImageElement;
    protected cardDescription: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardButtond = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);

        this.cardButtond.addEventListener('click', () => {
            this.events.emit('cardButton:clicked');
        })
    }

    set category(value: string) {
        this.cardCategory.textContent = value;

        Object.values(categoryMap).forEach((cls) => {
            this.cardCategory.classList.remove(cls);
        })

        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if(categoryClass) {
            this.cardCategory.classList.add((categoryClass));
        }
    }

    set image(value: string) {
        this.setImage(this.cardImage, value, this.title);
    }

    set description(value: string) {
        this.cardDescription.textContent = value;
    }

    set buttonText(value: string) {
        this.cardButtond.textContent = value;
    }

    set isDisabled(value: boolean) {
        this.cardButtond.disabled = value;
    }
}