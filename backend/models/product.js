const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  royalexId : { type: String, required: true},
  name: { type: String, required: true },
  imagePath: { type: String }
});

module.exports = mongoose.model("Product", productSchema);
