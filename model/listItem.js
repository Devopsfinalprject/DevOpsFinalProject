const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  icon: String,
});
exports.Category = mongoose.model("category", categorySchema);
const addressSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phone: String,
  address: String,
  city: String,
  postcode: String,
  orderNote: String,
});

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: [categorySchema],
});
