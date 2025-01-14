const express = require("express");
const _ = express.Router();
const { addtoCart, allcartItem } = require("../../Controller/cart.controller");
const { authGurad } = require("../../middleware/authguard");
_.route("/addtocart").post(authGurad, addtoCart).get(authGurad, allcartItem);

module.exports = _;
