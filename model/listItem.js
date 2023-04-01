const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  icon: String,
});
exports.Category = mongoose.model("category", categorySchema);
