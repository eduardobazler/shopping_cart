const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const fetchProducts = async () => {
  const { results } = await fetch(url).then((response) => response.json());
  return results;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
