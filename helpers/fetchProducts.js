const fetchProducts = async (something) => {
  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${something}`;
    const results = await fetch(url).then((response) => response.json());
    return results;
  } catch (error) {
    return new Error('You must provide an url');
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
