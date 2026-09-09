import {Component} from "../base/Component.ts";
import {IEvents} from "../base/Events.ts";
import {ensureElement} from "../../utils/utils.ts";

interface IForm{
    errors: string,
    isDisabled: boolean
}

export class Form<T> extends Component<IForm & T> {
    protected submitButton: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(protected events: IEvents, protected container: HTMLElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();

            this.events.emit(`${(this.container as HTMLFormElement).name}:submit`);
        })
        this.container.addEventListener("input", (evt) => {
            const target = evt?.target as HTMLInputElement;

            this.events.emit(`${(this.container as HTMLFormElement).name}:change`, {
                field: target.name,
                value: target.value,
            });
        });
    }

    set isDisabled(value: boolean) {
        this.submitButton.disabled = value;
    }

    set errors(value: string) {
        this.formErrors.textContent = value;
    }
}