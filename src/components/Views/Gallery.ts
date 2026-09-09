import {Component} from "../base/Component.ts";

interface IGallery{
    catalog: HTMLElement[];
}

export class Gallary extends Component<IGallery> {
    protected catalogElement: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);

        this.catalogElement = container;
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}