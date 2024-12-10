const express = require("express");
const _ = express.Router();
const {
  makeOffer,
  getAllOffer,
} = require("../../Controller/offerDate.controller");
_.route("/makeoffer").post(makeOffer).get(getAllOffer);
module.exports = _;
