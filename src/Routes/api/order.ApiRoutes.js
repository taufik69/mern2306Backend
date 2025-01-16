const express = require("express");
const _ = express.Router();
const { placeorder } = require("../../Controller/order.controller");
const { authGurad } = require("../../middleware/authguard");

_.route("/placeorder").post(authGurad, placeorder);

module.exports = _;
