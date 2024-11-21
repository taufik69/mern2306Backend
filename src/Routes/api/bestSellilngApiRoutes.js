const express = require("express");
const _ = express.Router();
const {
  createBestSEllling,
  getAllbestSellingProduct,
  updateBestSellingProduct,
  deltebestSelllingProduct
} = require("../../Controller/bestSellingProduct.controller");
_.route("/bestSelling").post(createBestSEllling).get(getAllbestSellingProduct);

_.route("/bestselling/:produtId").put(updateBestSellingProduct).delete(deltebestSelllingProduct);

module.exports = _;
