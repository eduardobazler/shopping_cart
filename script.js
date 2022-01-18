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
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
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
  saveCartItems('itens', JSON.stringify(objectItems));
}

function takePriceOfString(string) {
  const stringValor = string.split('$')[1];
  return Number.parseFloat(stringValor);
}

function totalPrice() {
  const elementPrice = document.querySelector('.total-price');
  const { listItens } = getSavedCartItems();
  const listPriceItens = [];
  listItens.forEach((item) => {
    listPriceItens.push(takePriceOfString(item));
  });
  const total = listPriceItens.reduce((acc, current) => (acc + current), 0);
  elementPrice.textContent = total;
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
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const cartShopping = document.querySelector('.cart__items');

async function detailsOfItem(event) {
  const item = event.path[1];
  const idItem = item.children[0].textContent;
  const objectItem = await fetchItem(idItem);

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
  const { listItens } = getSavedCartItems();
  listItens.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.addEventListener('click', cartItemClickListener);
    li.classList.add('cart__item');
    cartShopping.appendChild(li);
  });
  totalPrice();
}

async function setUpListProducts() {
  const listOfItem = await fetchProducts();

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

buttonEmptyCart();

window.onload = async () => { 
  await setUpListProducts();

  addListenerInItems();

  listSaved();
};
