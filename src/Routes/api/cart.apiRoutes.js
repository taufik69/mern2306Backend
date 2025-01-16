const express = require("express");
const _ = express.Router();
const {
  addtoCart,
  allcartItem,
  cartRemove,
  incrementCartItem,
  decrementCartItem,
  userCartItem,
} = require("../../Controller/cart.controller");
const { authGurad } = require("../../middleware/authguard");
_.route("/addtocart").post(authGurad, addtoCart).get(authGurad, allcartItem);
_.route("/addtocart/:id")
  .delete(authGurad, cartRemove)
  .post(authGurad, incrementCartItem);

_.route("/addtocartdecrement/:id").post(decrementCartItem);
_.route("/usercartitem").get(authGurad, userCartItem);

module.exports = _;
