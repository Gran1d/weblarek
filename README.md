# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
В ходе анализа проекта было установлено: в приложении используются две сущности, которые описывают данные, 
— товар и покупатель. Их можно описать такими интерфейсами:

#### Интерфейс IProduct
Интерфейс используется для описания структуры данных сущности товара
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

#### Интерфейс IBuyer
Интерфейс используется для описания структуры данных сущности покупателя
```
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

#### Интерфейс IServerProductsData
Интерфейс для типизированного получения данных о товарах с сервера
```
interface IServerProductsData {
  items: IProduct[];
  total: number;
}
```

#### Интерфейс IOrderData
Интерфейс для типизированной отправки данных на сервер о покупке
```
interface IOrderData extends IBuyer {
  items: string[];
  total: number;
}
```

#### Интерфейс IOrderDataResponse
Интерфейс для типизированного получения ответа с сервера о покупке
```
interface IOrderDataResponse{
  id: string;
  total: number;
}
```

#### Тип TPayment
Тип данных для описания способа оплаты
```
TPayment = 'card' | 'cash'; 
```

### Модели данных
Для учёта данных в приложении должны быть три класса, которые будут разделены между собой по смыслу и зонам ответственности:

#### Класс ProductCatalog
Используется для работы с товарами в представленном каталоге

Поля класса:
`product: IProduct[]` - Массив хранения всех полученных товаров
`selectedProduct: IProduct | null` - Данные выбранного товара

Конструктор:  
`constructor()` - Инициализирует стартовые значения полей класса

Методы класса:  
`saveProducts(products: IProduct[]): void` - Сохранение новый массив товаров полученный в параметрах метода;
`getProducts(): IProducts[]` - Возвращает текущий массив товаров;
`getProductbyID(id: string): IProducts | undefined` - Возвращает товар по его идентификатору;
`setSelectedProduct(item: IProducts): void` - Сохранение товара в `selectedProduct`;
`getSelectedProduct(): IProduct | null` - Получение сохраненного товара;

#### Класс Сart
Используется для работы с товарами размещаемых в корзине покупателя

Поля класса:
`cartProducts: IProduct[]` - Массив хранения всех полученных товаров

Конструктор:  
`constructor()` - Инициализирует стартовые значения полей класса

Методы класса:
`getCartProducts(): IProducts[]` - Возвращает текущий массив товаров находящихся в корзине покупателя;
`setCartProduct(product: IProduct): void:` - Добавляет новый товар в корзину покупателя;
`removeCartProduct(product: IProduct): void` - Удаление товара находящегося в корзине покупателя;
`clearCart(): void` - Очистка корзины (удаление всех элементов массива `cartProducts`);
`getTotalCartPrice(): number` - Возвращает сумму всех товаров в корзине покупателя;
`getCountCartProducts(): number` - Возвращает количество товаров в корзине покупателя;
`checkProductInCart(id: string): boolean` - Проверка нахождения товара по id в корзине покупателя;

#### Класс Consumer
Используется для работы с товарами размещаемых в корзине покупателя

Поля класса:
`payment: 'TPayment' | 'null'` - Способ оплаты
`address: string` - Адресс получения товара
`phone: string` - Телефон получателя
`email: string` - Email получателя

Конструктор:  
`constructor()` - Инициализирует стартовые значения полей класса

Методы класса:
`setConsumerData(Partial<IBuyer>): void` - Сохранение полученных данных в существующие поля класса
`getConsumerData(): IBuyer` - Получение всех данных о покупателе
`clearConsumerData(): void` - Очистка данных о покупателе
`validateConsumerData(): Partial<Record<keyof IBuyer, string>>` - Валидация данных, возвращает объект ошибок

### Слой коммуникации
Класс для взаимодействия с сервером использующий интерфейс IApi.

#### Класс ApiClient
Используется для получения и отправки данных на сервер.

Конструктор:  
`constructor(private api: IApi)` - Инициализирует стартовые значения

Методы класса:
`async getProductCatalogData(): Promise<IServerProductsData>` - Получение данных о товарах с сервера
`async postCartData(orderData: IOrderData): Promise<IOrderDataResponse>` - Отправка данных о покупке на сервер

### Слой View
Классы, интерфейсы и типы данных которые используются для отображения контента.

#### Интерфейс IHeader
```
interface IHeader{
  counter: number;
}
```

#### Класс Header extends Components<IHeader>
Используется для отображения Header'а страницы, в частности для работы с кнопкой и счетчиком корзины.
Наследование от родительского класса Component

Поля класса:
`basketButton: HTMLButtonElement` - Кнопка корзины
`counterElement: HTMLElement` - Элемент счетчика товаров в корзине

Конструктор:  
`constructor(protected events: IEvents, protected container: HTMLElement)` - Принимает брокер события и ссылку на 
DOM элемент. Инициализирует стартовые значения полей класса, а так же эмитит событие.

Методы класса:
`set counter(value: number)` - Изменяет счетчик корзины. 

#### Интерфейс IGallery
```
interface IGallery{
  catalog: HTMLElement[];
}
```

#### Класс Gallery extends Components<IGallery>
Используется для отображения галереи товаров на странице.

Поля класса:
`catalogElement: HTMLElement` - Контейнер для отображения карточек товаров.

Конструктор:  
`constructor(protected container: HTMLElement)` - Принимает ссылку на DOM элемент. 
Инициализирует стартовые значения полей класса.

Методы класса:
`set catalog(items: HTMLElement[])` - Добавляет карточки в каталог.

#### Интерфейс IModal
```
interface IModal{
  content: HTMLElement;
}
```

#### Класс Modal extends Components<IModal>
Используется для отображения модального окна.

Поля класса:
`modalCloseButton: HTMLButtonElement` - Кнопка закрытия модального окна.
`contentElement: HTMLElement` - Контейнер для содержимого модального окна.

Конструктор:  
`constructor(protected events: IEvents, protected container: HTMLElement)` - Принимает брокер события и ссылку на
DOM элемент. Инициализирует стартовые значения полей класса, а так же эмитит событие для закрытия модалки.

Методы класса:
`set content(item: HTMLElement)` - Добавление контента для модалного окна.

#### Интерфейс ISuccess
```
interface ISuccess{
  description: string;
}
```

#### Класс SuccessOrder extends Components<ISuccess>
Используется для отображения шаблона об успешном заказе.

Поля класса:
`successDescription: HTMLElement` - Элемент с описанием.
`successButton: HTMLButtonElement` - Кнопка с возможностью закрытия модального окна

Конструктор:  
`constructor(protected events: IEvents, protected container: HTMLElement)` - Принимает брокер события и ссылку на
DOM элемент. Инициализирует стартовые значения полей класса, а так же эмитит событие для закрытия модалки.

Методы класса:
`set description(text: string)` - Изменение текста описания.

#### Тип TCard
```
type TCard = Pick<IProduct, 'title' | 'price'>
```

#### Класс Card<T> extends Components<TCard & T>
Выступает в качестве родительского класса для всех реализаций карточки товара.

Поля класса:
`cardTitle: HTMLElement` - Элемент названия товара.
`cardPrice: HTMLElement` - Элемент цены товара.

Конструктор:  
`constructor(protected container: HTMLElement)` - Принимает ссылку на DOM элемент. 
Инициализирует стартовые значения полей класса.

Методы класса:
`set title(text: string)` - Изменение названия карточки.
`set price(value: number | null)` - Изменение цены товара.


#### Тип TCardCatalog
```
type TCardCatalog = Pick<IProduct, 'category' | 'image'>
```

#### Класс CardCatalog extends Card<TCardCatalog>
Используется для отображения карточки товара в каталоге товаров.

Поля класса:
`cardCategory: HTMLElement` - Элемент категории карточки.
`cardImage: HTMLImageElement` - Элемент картинки карточки.

Конструктор:  
`constructor(protected container: HTMLElement, protected ?action: ICardAction)` - Принимает объект типа ICardAction и
ссылку на DOM элемент. Инициализирует стартовые значения полей класса, а так же добавляет событие для контейнера(кнопка).

Методы класса:
`set category(value: string)` - Изменение категории карточки и добавление нужного класса для этой категории.
`set image(value: string)` - Изменение изображения товара.

#### Тип TCardPreview
```
type TCardPreview = Pick<IProduct, 'description' | 'image' | 'category'> & {button: TPreviewCardButton}
```

#### Тип TPreviewCardButton
```
type TPreviewCardButton = 'buy' | 'delete' | null;
```

#### Класс CardPreview extends Card<TCardPreview>
Используется для отображения карточки товара в модальном окне.

Поля класса:
`cardCategory: HTMLElement` - Элемент категории карточки.
`cardButtond: HTMLButtonElement` - Элемент кнопки добавления/удаления в/из корзины.
`cardImage: HTMLImageElement` - Элемент картинки карточки.
`cardDescription: HTMLElement;` - Элемент описания карточки.


Конструктор:  
`constructor(protected container: HTMLElement, protected events: IEvents)` - Принимает брокер события и ссылку на
DOM элемент. Инициализирует стартовые значения полей класса, а так же эмитит событие для добавления/удаления товара в корзину.

Методы класса:
`set category(value: string)` - Изменение категории карточки и добавление нужного класса для этой категории.
`set image(value: string)` - Изменение изображения товара.
`set description(value: string)` - Изменение описание товара.
`set buttonText(value: string)` - Изменение текста кнопки.
`set isDisabled(value: boolean)` - Включение/ выключение кнопки.

#### Интерфейс IBasketGallery
```
interface IBasketGallery{
  basketCatalog: HTMLElement[];
  totalPrice: number;
  isDisabled: boolean;
}
```

#### Класс BasketGallery extends Components<IBasket>
Используется для отображения галереи товаров в корзине.

Поля класса:
`basketElement: HTMLElement` - Контейнер для отображения карточек товаров.
`basketButton: HTMLButtonElement` - Кнопка оформления заказа.
`basketPriceElement: HTMLElement` - Элемент с итоговой ценой

Конструктор:  
`constructor(protected events: IEvents, protected container: HTMLElement)` - Принимает брокер события и ссылку на
DOM элемент. Инициализирует стартовые значения полей класса, а так же эмитит событие для оформления заказа.

Методы класса:
`set basketCatalog(items: HTMLElement[])` - Добавляет карточки в каталог.
`set isDisabled(value: boolean)` - Включение/ выключение кнопки.
`set totalPrice(value: number)` - Установление итоговой цены.

#### Интерфейс ICardBasket
```
interface ICardBasket{
    index: number
}
```

#### Класс CardBasket extends Card<ICardBasket>
Используется для отображения карточки товара в модальном окне корзины.

Поля класса:
`cardButton: HTMLButtonElement` - Элемент кнопки удаления товара из корзины.
`cardIndexElement: HTMLElement` - Элемент индекса.

Конструктор:  
`constructor(protected container: HTMLElement, protected ?action: ICardAction)` - Принимает объект типа ICardAction и
ссылку на DOM элемент. Инициализирует стартовые значения полей класса, а так же добавляет событие для кнопки удаления.

Методы класса:
`set index(value: number)` - Установление индекса.

#### Интерфейс IForm
```
interface IForm{
    errors: string,
    isDisabled: boolean
}
```

#### Класс Form<T> extends Component<IForm & T>
Родительский класс для форм.

Поля класса:
`submitButton: HTMLButtonElement` - Элемент кнопки отправки форма.
`formErrors: HTMLElement` - Элемент ошибок заполнения формы.

Конструктор:  
`constructor(protected events: IEvents, protected container: HTMLElement)` - Принимает брокер события и ссылку на
DOM элемент. Инициализирует стартовые значения полей класса, а так же эмитит событие для отправки формы.

Методы класса:
`set isDisabled(value: boolean)` - Включение/ выключение кнопки.
`set errors(value: string)` - Включение/ выключение кнопки.

#### Интерфейс IFormOrder
```
interface IFormOrder{
    address: string,
    payment: TPayment,
}
```

#### Класс FormOrder extends Component<IFormOrder>
Форма с выбором способа оплаты, а так же вводом адреса получения.

Поля класса:
`cardButton: HTMLButtonElement` - Элемент кнопки оплаты онлайн
`cashButton: HTMLButtonElement` - Элемент кнопки оплаты наличными.
`formAddress: HTMLInputElement` - Элемент адреса доставки.

Конструктор:  
`constructor(protected events: IEvents, protected container: HTMLElement)` - Принимает брокер события и ссылку на
DOM элемент. Инициализирует стартовые значения полей класса, а так же эмитит событие для отправки формы и выбора способа
оплаты.

Методы класса:
`set address(value: string)` - Добавление адреса.
`set payment(value: TPayment)` - Выбор способа оплаты.

#### Интерфейс IFormContact
```
interface IFormContact{
    email: string,
    number: string,
}
```

#### Класс FormContact extends Component<IFormContact>
Форма с вводом emal'а, а так же номера телефона.

Поля класса:
`formEmail: HTMLInputElement` - Элемент ввода почты.
`formNumber: HTMLInputElement` - Элемент ввода номера телефона.

Конструктор:  
`constructor(protected events: IEvents, protected container: HTMLElement)` - Принимает брокер события и ссылку на
DOM элемент. Инициализирует стартовые значения полей класса, а так же эмитит событие для отправки формы.

Методы класса:
`set email(value: string)` - Добавление почты.
`set number(value: string)` - Добавление номера телефона.


### Презентер

### События приложения

***basket:open*** — открытие корзины. Событие вызывается классом `Header` при нажатии на кнопку корзины. Обработчик открывает модальное окно с содержимым корзины.

***modal:close*** — закрытие модального окна. Событие используется для закрытия текущего модального окна.

***cardButton:clicked*** — нажатие на кнопку добавления товара в корзину или удаления товара из корзины. Обработчик проверяет наличие выбранного товара в `Cart` и в зависимости от результата добавляет его или удаляет.

***order:submit*** — подтверждение первой формы оформления заказа. Событие вызывается после нажатия кнопки «Далее» и открывает вторую форму для ввода контактных данных.

***order:change*** — изменение поля в первой форме заказа. Используется для передачи изменённого адреса доставки в модель `Consumer` и последующей проверки данных.

***contacts:submit*** — подтверждение второй формы оформления заказа. Событие вызывается после нажатия кнопки «Оплатить». На его основе формируется заказ, отправляется запрос на сервер и после успешного ответа открывается окно `SuccessOrder`.

***contacts:change*** — изменение поля во второй форме. Используется для передачи изменённых электронной почты или номера телефона в модель `Consumer` и обновления состояния формы.

***payment:change*** — изменение способа оплаты. Событие вызывается при выборе способа оплаты «Онлайн» или «При получении» и сохраняет выбранное значение в модели `Consumer`.

***basket:changed*** — изменение содержимого корзины. Вызывается моделью `Cart` после добавления, удаления или очистки товаров. Используется для обновления списка товаров, счётчика и общей стоимости корзины.

***consumer:changed*** — изменение данных покупателя в модели `Consumer`. Вызывается после изменения данных покупателя и используется для повторной валидации форм, отображения ошибок и изменения состояния кнопок.

***catalog:changed*** — изменение каталога продуктов. Вызывается после загрузки или обновления списка товаров и используется для создания и отображения карточек каталога.

***catalog:selected*** — изменение выбранного товара. Вызывается после выбора товара и используется для отображения подробной информации о нём в модальном окне.

***catalog:cartClicked*** — нажатие на карточку товара в каталоге. Передаёт выбранный товар в модель `ProductCatalog`, после чего вызывается событие `catalog:selected`.

***card:itemDeleted*** — удаление товара из корзины. Вызывается при нажатии на кнопку удаления у конкретного товара и передаёт этот товар в модель `Cart`.

***basket:order*** — переход от корзины к оформлению заказа. Вызывается при нажатии кнопки «Оформить» и открывает первую форму `FormOrder`.
