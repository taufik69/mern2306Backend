const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const bestSellingProductSchema = new Schema({
  //   product: [
  //     {
  //       type: Types.ObjectId,
  //       ref: "product",
  //     },
  //   ],
  product: {
    type: Types.ObjectId,
    ref: "product",
  },
});

module.exports = mongoose.model("bestSellingProduct", bestSellingProductSchema);
