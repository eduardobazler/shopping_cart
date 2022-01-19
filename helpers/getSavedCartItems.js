const getSavedCartItems = () => {
  const itensString = localStorage.getItem('cartItems');

  return itensString;
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
