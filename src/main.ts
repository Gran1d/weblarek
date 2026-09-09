import './scss/styles.scss';
import {ProductCatalog} from "./components/Models/ProductCatalog.ts";
import {Cart} from "./components/Models/Cart.ts";
import {Consumer} from "./components/Models/Consumer.ts";
import {ApiClient} from "./components/ApiClient.ts";
import {API_URL, CDN_URL} from "./utils/constants.ts";
import {Api} from "./components/base/Api.ts";
import {cloneTemplate, ensureElement} from "./utils/utils.ts";
import {Gallary} from "./components/Views/Gallery.ts";
import {CardCatalog} from "./components/Views/CardCatalog.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {IProduct} from "./types";
import {Header} from "./components/Views/Header.ts";
import {Modal} from "./components/Views/Modal.ts";
import {CardPreview} from "./components/Views/CardPreview.ts";
import {BasketGallery} from "./components/Views/BasketGallery.ts";
import {CardBasket} from "./components/Views/CardBasket.ts";
import {FormOrder} from "./components/Views/FormOrder.ts";
import {FormContact} from "./components/Views/FormContact.ts";
import {SuccessOrder} from "./components/Views/SuccessOrder.ts";

const events = new EventEmitter();
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

const productCatalog = new ProductCatalog(events);
const consumer = new Consumer(events);
const cart = new Cart(events);

const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('.modal');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketGalleryTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardPreviewElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
const basketGalleryElement = cloneTemplate<HTMLElement>(basketGalleryTemplate);
const formOrderElement = cloneTemplate<HTMLElement>(formOrderTemplate);
const formContactElement = cloneTemplate<HTMLElement>(formContactsTemplate);
const successOrderElement = cloneTemplate<HTMLElement>(successOrderTemplate);

const header = new Header(events, headerContainer);
const gallery = new Gallary(galleryContainer);
const modal = new Modal(events, modalContainer);

const cardPreview = new CardPreview(cardPreviewElement, events);
const basketGallery = new BasketGallery(events, basketGalleryElement);

const formOrder = new FormOrder(events, formOrderElement);
const formContact = new FormContact(events, formContactElement);
const successOrder = new SuccessOrder(events, successOrderElement);

events.on('catalog:changed', () => {
    const cartProducts = productCatalog.getProducts().map((product) => {
        const cartCatalog = new CardCatalog(cloneTemplate<HTMLElement>(cardCatalogTemplate), {
            onClick: () => {
                events.emit('catalog:cartClicked', product);
            }
        })
        cartCatalog.image = product.image;
        cartCatalog.title = product.title;
        cartCatalog.category = product.category;
        cartCatalog.price = product.price;

        return cartCatalog.render();
    })
    gallery.render({catalog: cartProducts});
});

events.on('catalog:cartClicked', (product: IProduct) => {
    if (!product) {
        return
    }
    productCatalog.setSelectedProduct(product);
});

events.on('catalog:selected', () => {
    const selectedProduct = productCatalog.getSelectedProduct();

    if (selectedProduct) {
        cardPreview.render({
            title: selectedProduct.title,
            image: selectedProduct.image,
            price: selectedProduct.price,
            category: selectedProduct.category,
            description: selectedProduct.description
        })
        if (!selectedProduct.price) {
            cardPreview.buttonText = "Недоступно";
            cardPreview.isDisabled = true;
        }
        if (cart.checkProductInCart(selectedProduct.id)) {
            cardPreview.buttonText = "Удалить из корзины";
            cardPreview.isDisabled = false;
        }
        if (!cart.checkProductInCart(selectedProduct.id) && selectedProduct.price) {
            cardPreview.buttonText = "Купить";
            cardPreview.isDisabled = false;
        }

        modal.render({content: cardPreview.render()});
        modal.open();
    }
});

events.on('cardButton:clicked', () => {
    const selectedProduct = productCatalog.getSelectedProduct();

    if (!selectedProduct) {
        return
    }

    if (cart.checkProductInCart(selectedProduct.id)) {
        cart.removeCartProduct(selectedProduct);
    } else {
        cart.setCartProduct(selectedProduct);
    }
    modal.close();
});

events.on('basket:changed', () => {
    header.render({counter: cart.getCountCartProducts()});
});

events.on('basket:changed', () => {
   const basketItems = cart.getCartProducts();
   const cardBasketItems = basketItems.map((item) => {
       const cardBasket = new CardBasket(cloneTemplate<HTMLElement>(cardBasketTemplate), {
           onClick: () => {
               events.emit('card:itemDeleted', item)
           }
       })
       cardBasket.title = item.title;
       cardBasket.price = item.price;
       cardBasket.index = basketItems.indexOf(item) + 1;
       return cardBasket.render();
   })
    if (cart.getCountCartProducts() === 0) {
        basketGallery.isDisabled = true;
    } else {
        basketGallery.isDisabled = false;
    }
    basketGallery.totalPrice = cart.getTotalCartPrice();
    basketGallery.render({basketCatalog: cardBasketItems})
});

events.on('basket:open', () => {
    if (cart.getCountCartProducts() === 0) {
        basketGallery.isDisabled = true;
    }
    modal.content = basketGallery.render();
    modal.open();
});

events.on('card:itemDeleted', (item: IProduct) => {
   cart.removeCartProduct(item);
});

events.on("basket:order", () => {
    modal.content = formOrder.render();
    modal.render();
});

events.on('order:change', ({field, value}: {field: string, value: string}) => {
    if (field === 'address'){
        consumer.setConsumerData({address: value})
    }
});

events.on('contacts:change', ({field, value}: {field: string, value: string}) => {
    if (field === 'email'){
        consumer.setConsumerData({email: value})
    }
    if (field === 'phone') {
        consumer.setConsumerData({phone: value})
    }
});

events.on('payment:change', ({payment}: {payment: string}) => {
    if (payment === "cash") {
        formOrder.payment = "cash";
        consumer.setConsumerData({payment: "cash"})
    }
    if (payment === "card"){
        formOrder.payment = "card"
        consumer.setConsumerData({payment: "card"})
    }
});

events.on('consumer:changed', () => {
    const buyer = consumer.getConsumerData();
    const errors = consumer.validateConsumerData();

    const orderError =
        errors.payment ?? errors.address ?? '';

    if (buyer.payment !== null) {
        formOrder.payment = buyer.payment;
    }

    formOrder.address = buyer.address;
    formOrder.errors = orderError;
    formOrder.isDisabled = Boolean(orderError);

    const contactError =
        errors.email ?? errors.phone ?? '';

    formContact.email = buyer.email;
    formContact.number = buyer.phone;
    formContact.errors = contactError;
    formContact.isDisabled = Boolean(contactError);
});

events.on('order:submit', () => {
    modal.content = formContact.render();
    modal.render();
});

events.on('contacts:submit', async () => {
    const buyer = consumer.getConsumerData();

    const orderData = {
        ...buyer,
        items: cart.getCartProducts().map((product) => product.id),
        total: cart.getTotalCartPrice()
    };

    try {
        const result = await apiClient.postCartData(orderData);

        successOrder.description = `Списано ${result.total} синапсов`;

        modal.content = successOrder.render();
        modal.render();

        cart.clearCart();
        consumer.clearConsumerData();

    } catch (error) {
        console.error('Ошибка оформления заказа', error);
    }
});

events.on('modal:close', () => {
    modal.close();
});

(async () => {
    try {
        const productCatalogApi = await apiClient.getProductCatalogData();
        const fixedItems = productCatalogApi.items.map((item) => ({
                ...item,
                image: CDN_URL + item.image
        }))
        productCatalog.setProducts(fixedItems);
    }catch (error) {
        console.error("Ошибка получения данных с сервера", error);
    }
})()