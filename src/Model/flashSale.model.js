const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const flashSaleSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },

    timeOffer: {
      type: Types.ObjectId,
      ref: "timeOffer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("flashSale", flashSaleSchema);
