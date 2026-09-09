export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'cash' | 'card';

export type TConsumerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IServerProductsData {
    items: IProduct[];
    total: number;
}

export interface IOrderData extends IBuyer {
    items: string[];
    total: number;
}

export interface IOrderDataResponse{
    id: string;
    total: number;
}

export type TCard = Pick<IProduct, 'title' | 'price'>

export type TCardCatalog = Pick<IProduct, 'category' | 'image'>

type TPreviewCardButton = 'buy' | 'delete' | null;

export type TCardPreview = Pick<IProduct, 'description' | 'image' | 'category'> & {button: TPreviewCardButton}

export interface ICardAction {
    onClick?: () => void,
}