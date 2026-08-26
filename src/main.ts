import './scss/styles.scss';
import {ProductCatalog} from "./components/Models/ProductCatalog.ts";
import {apiProducts} from "./utils/data.ts";
import {Cart} from "./components/Models/Cart.ts";
import {Consumer} from "./components/Models/Consumer.ts";
import {ApiClient} from "./components/ApiClient.ts";
import {API_URL} from "./utils/constants.ts";
import {Api} from "./components/base/Api.ts";

/// Тестирование класса ProductCatalog
const productCatalog = new ProductCatalog();
productCatalog.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", productCatalog.getProducts());
console.log("Товар по id: ", productCatalog.getProductByID("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));

const secondItem = productCatalog.getProducts()[1];
productCatalog.setSelectedProduct(secondItem);

console.log("Получен товар из selectedProduct: ", productCatalog.getSelectedProduct());

/// Тестирование класса Cart
console.log("---------------------------------------------------------");
const shoppingCart = new Cart();
shoppingCart.setCartProduct(secondItem);
shoppingCart.setCartProduct(productCatalog.getProducts()[0]);
shoppingCart.setCartProduct(productCatalog.getProducts()[2]);
console.log("Массив товаров из корзины: ", shoppingCart.getCartProducts());
console.log("Количество товаров в корзине: ", shoppingCart.getCountCartProducts());

shoppingCart.removeCartProduct(secondItem);
console.log("Массив товаров из корзины после удаления товара: ", shoppingCart.getCartProducts());
console.log("Количество товаров в корзине после удаления: ", shoppingCart.getCountCartProducts());

console.log("Сумма всех товаров в корзине: ", shoppingCart.getTotalCartPrice());
console.log("Проверка наличия товара в корзине: ", shoppingCart.checkProductInCart("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
console.log("Проверка наличия товара в корзине: ", shoppingCart.checkProductInCart("854cef69-976d-4c2a-a18c-2aa45046c390"));

shoppingCart.clearCart();
console.log("Корзина после полной очистки: ", shoppingCart.getCartProducts());

/// Тестирование класса Consumer
console.log("---------------------------------------------------------");
const consumer = new Consumer();
consumer.setConsumerData({payment: "card"});
console.log("Получение данных о покупателе, только с полем payment ", consumer.getConsumerData());
console.log("Валидация данных: ", consumer.validateConsumerData());

consumer.setConsumerData({email: "qwert@ya.ru"});
console.log("Получение данных о покупателе, только с полями payment и email ", consumer.getConsumerData());
console.log("Валидация данных: ", consumer.validateConsumerData());

consumer.setConsumerData({address: "gorod1"});
console.log("Получение данных о покупателе, только с полями payment, email, address ", consumer.getConsumerData());
console.log("Валидация данных: ", consumer.validateConsumerData());

consumer.setConsumerData({phone: "+79139999999"});
console.log("Получение данных о покупателе с полным набором данных", consumer.getConsumerData());
console.log("Валидация данных: ", consumer.validateConsumerData());

consumer.clearConsumerData();
console.log("Данные после очистки: ", consumer.getConsumerData());

/// Тестирование Api
console.log("---------------------------------------------------------");
async function testApi() {
    const api = new Api(API_URL);
    const apiClient = new ApiClient(api);

    console.log("Тестирование get запроса");

    const productCatalogApi = await apiClient.getProductCatalogData();

    console.log("Получение товаров с сервера: ", productCatalogApi);
    productCatalog.setProducts(productCatalogApi.items);

    console.log("Массив каталога после получения данных с сервера: ", productCatalog.getProducts());

    console.log("---------------------------------------------------------");
    console.log("Тестирование post запроса");

    consumer.setConsumerData({phone: "+79999999999", address: "gorod 1", email: "go@ya.ru", payment: "card"});
    shoppingCart.setCartProduct(productCatalogApi.items[0]);
    shoppingCart.setCartProduct(productCatalogApi.items[1]);
    shoppingCart.setCartProduct(productCatalogApi.items[3]);

    const idItemsInShoppingCart : string[] = [];
    shoppingCart.getCartProducts().forEach((item) => {
        idItemsInShoppingCart.push(item.id);
    })
    const dataToPostTest = {...consumer.getConsumerData(), items: idItemsInShoppingCart, total: shoppingCart.getTotalCartPrice()}

    const payResponse = await apiClient.postCartData(dataToPostTest)
    console.log("Ответ после отправки данных на сервер: ", payResponse);
}

testApi().catch(console.error)