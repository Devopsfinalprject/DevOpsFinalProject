module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function (item, id) {
    let storeItem = this.items[id];
    if (!storeItem) {
      storeItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    storeItem.qty++;
    storeItem.price = storeItem.item.price * storeItem.qty;
    this.totalQty++;
    this.totalPrice += storeItem.item.price;

    this.reduceByOne = function (id) {
      this.items[id].qty--;
      this.items[id].price -= this.items[id].item.price;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.price;

      if (this.items[id].qty <= 0) {
        delete this.items[id];
      }
    };

    this.increaseByOne = function (id) {
      this.items[id].qty++;
      this.items[id].price += this.items[id].item.price;
      this.totalQty++;
      this.totalPrice += this.items[id].item.price;
    };
  };
};
