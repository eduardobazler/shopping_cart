const fetchItem = async (idElement) => {
  try {
    const url = `https://api.mercadolibre.com/items/${idElement}`;

    const objectReturn = await fetch(url).then((response) => response.json());
    return objectReturn;
  } catch (error) {
    return new Error('You must provide an url');
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
