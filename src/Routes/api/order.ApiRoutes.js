const express = require("express");
const _ = express.Router();
const {
  placeorder,
  allorder,
  orderbyUser,
  cancleOrder,
} = require("../../Controller/order.controller");
const { authGurad } = require("../../middleware/authguard");

_.route("/placeorder").post(authGurad, placeorder);
_.route("/userorder").get(authGurad, orderbyUser);
_.route("/cancleorder/:orderId").get(authGurad, cancleOrder);
// for admin
_.route("/allorder").get(allorder);

module.exports = _;
