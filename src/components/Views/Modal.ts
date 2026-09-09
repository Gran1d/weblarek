import {Component} from "../base/Component.ts";
import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";

interface IModal{
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected modalCloseButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(protected events: IEvents, protected container: HTMLElement) {
        super(container);

        this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container)

        this.modalCloseButton.addEventListener('click', () => {
            this.close();
        })
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        })
    }

    set content(item: HTMLElement) {
        this.contentElement.replaceChildren(item);
    }

    close() {
        this.container.classList.remove('modal_active');
    }

    open() {
        this.container.classList.add('modal_active');
    }
}