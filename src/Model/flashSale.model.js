const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const flashSaleSchema = new Schema({
  productId: {
    type: Types.ObjectId,
    ref: "product",
    required: true,
  },
  offerDate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("flashSale", flashSaleSchema);
