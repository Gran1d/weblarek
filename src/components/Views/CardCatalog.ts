import {Card} from "./Card.ts";
import {ICardAction, TCardCatalog} from "../../types";
import {ensureElement} from "../../utils/utils.ts";
import {categoryMap} from "../../utils/constants.ts";

export class CardCatalog extends Card<TCardCatalog> {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;

    constructor(protected container: HTMLElement, protected action?: ICardAction) {
        super(container);

        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (action?.onClick) {
            this.container.addEventListener('click', action.onClick);
        }
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
}