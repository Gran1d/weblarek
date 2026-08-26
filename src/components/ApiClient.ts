import {IApi, IOrderData, IOrderDataResponse, IServerProductsData} from "../types";

export class ApiClient {
    constructor(private api: IApi) {};

    getProductCatalogData(): Promise<IServerProductsData> {
        return this.api.get<IServerProductsData>("/product")
    }

    postCartData(orderData: IOrderData): Promise<IOrderDataResponse> {
        return this.api.post<IOrderDataResponse>("/order", orderData)
    }
}