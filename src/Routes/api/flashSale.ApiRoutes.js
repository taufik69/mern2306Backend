const express = require("express");
const _ = express.Router();
const {
  createFlashSale,
  getAllFlashSale,
  updateFlashSale,
  deleteFlashSale,
  GetSingleFlashSaleItem
} = require("../../Controller/flashSale.controller");
_.route("/flashSale").post(createFlashSale).get(getAllFlashSale);
_.route("/flashSale/:id").put(updateFlashSale).delete(deleteFlashSale).get(GetSingleFlashSaleItem);
module.exports = _;
