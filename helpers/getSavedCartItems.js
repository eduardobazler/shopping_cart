const getSavedCartItems = () => {
  const itensString = localStorage.getItem('itens');
  const objectItens = JSON.parse(itensString);
  return objectItens;
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
