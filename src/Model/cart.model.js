const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;
const cartSchema = new Schema({
  product: {
    type: Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  user: {
    type: Types.ObjectId,
    ref: "user",
  },
});

module.exports = model("cart", cartSchema);
