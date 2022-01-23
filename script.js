function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('button', 
  'item__add btn btn-primary', 'Adicionar ao carrinho!'));
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function listItemsLocalStorage() {
  const listItemsElement = document.querySelectorAll('.cart__item');
  const listDescriptionItems = [];
  listItemsElement.forEach((element) => listDescriptionItems.push(element.innerText));
  return listDescriptionItems;
}

function setUpLocalStorage() {
  const listaItens = listItemsLocalStorage();
  const objectItems = {
    amount: listaItens.length,
    listItens: listaItens,
  };

  saveCartItems(JSON.stringify(objectItems));
}

function takePriceOfString(string) {
  const stringValor = string.split('$')[1];
  return Number.parseFloat(stringValor);
}

function totalPrice() {
  const elementPrice = document.querySelector('.total-price');
  const { listItens } = JSON.parse(getSavedCartItems());
  const listPriceItens = [];
  listItens.forEach((item) => {
    listPriceItens.push(takePriceOfString(item));
  });
  const total = listPriceItens.reduce((acc, current) => (acc + current), 0);
  elementPrice.textContent = total.toFixed(2);
}

function cartItemClickListener(event) {
  const elementParent = event.path[1];
  elementParent.removeChild(event.target);
  setUpLocalStorage();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const cartShopping = document.querySelector('.cart__items');

async function detailsOfItem(event) {
  const item = event.path[1];
  const idItem = item.children[0].textContent;
  const { id, title, price } = await fetchItem(idItem);
  
  const objectItem = {
    sku: id,
    name: title,
    salePrice: price,
  };
  
  const itemCreated = createCartItemElement(objectItem);
  itemCreated.addEventListener('click', cartItemClickListener);
  cartShopping.appendChild(itemCreated);
  setUpLocalStorage();
  totalPrice();
}

function addListenerInItems() {
  const listButton = document.querySelectorAll('.item button');
  listButton.forEach((elemtent) => elemtent.addEventListener('click', detailsOfItem));
}

function listSaved() {
  const { listItens } = JSON.parse(getSavedCartItems());
  listItens.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.addEventListener('click', cartItemClickListener);
    li.classList.add('cart__item');
    cartShopping.appendChild(li);
  });
  totalPrice();
}

function showLoading() {
  const elementParent = document.querySelector('.container');
  const loading = document.createElement('h1');
  loading.className = 'loading';
  loading.innerText = 'carregando...';
  elementParent.appendChild(loading);
}

function removeLoading() {
  const elementParent = document.querySelector('.container');
  const loading = document.querySelector('.loading');
  elementParent.removeChild(loading);
}

async function setUpListProducts(categoria = 'computador') {
  showLoading();
  const { results: listOfItem } = await fetchProducts(categoria);
  const itemsParent = document.querySelector('.items');
  listOfItem.forEach(({ id, title, thumbnail }) => {
    const objetoItem = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const itemChild = createProductItemElement(objetoItem);
    itemsParent.appendChild(itemChild);
  });
  addListenerInItems();
  removeLoading();
}

function emptyCart() {
  const listParent = document.querySelector('.cart__items');
  listParent.innerHTML = '';
  setUpLocalStorage();
  totalPrice();
}

const buttonEmptyCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', emptyCart);
};

function clearProducts() {
  document.querySelector('.items').innerHTML = '';
}

function diversos() {
  const list = document.querySelectorAll('.item');
  if (list.length === 0) {
    setUpListProducts('diveros');
  }
}

const buttonSearch = async () => {
  const valor = document.querySelector('#input-intes').value;
  clearProducts();
  await setUpListProducts(valor);
  diversos();
};

const button = document.querySelector('.buton-search');
button.addEventListener('click', buttonSearch);

buttonEmptyCart();

window.onload = async () => { 
  await setUpListProducts();

  listSaved();
};
