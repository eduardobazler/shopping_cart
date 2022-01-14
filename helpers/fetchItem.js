const fetchItem = async (idElement) => {
  const url = `https://api.mercadolibre.com/items/${idElement}`;

  const { id, price, title } = await fetch(url).then((response) => response.json());
  return {
    sku: id,
    name: title,
    salePrice: price,
  };
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
