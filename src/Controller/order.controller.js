const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const ordermodel = require("../Model/order.model.js");
const cartModel = require("../Model/cart.model.js");
const { usermodel } = require("../Model/User.model.js");
const placeorder = async (req, res) => {
  try {
    const { customerinfo, paymentinfo } = req.body;
    const userinfo = req.user;
    const BearerToken = req.headers.authorization;

    const { phone, address1, city, district } = customerinfo;
    const { paymentmethod } = paymentinfo;
    //validation
    if (!phone || !address1 || !city || !district || !paymentmethod) {
      return res
        .status(401)
        .json(
          new ApiError(
            false,
            null,
            401,
            `Billing / payment credential Missing !!`
          )
        );
    }

    // user cartItem
    const response = await fetch(`${process.env.BACKEND_DOMAIN}/usercartitem`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: BearerToken,
      },
    });
    const data = await response.json();

    const { cart, totalPrice, totalQuantity } = data?.data;
    const cartItemId = cart.map((item) => {
      return item._id;
    });
    //
    if (paymentmethod == "cash") {
      const saveOrder = await new ordermodel({
        user: userinfo.id,
        cartItem: cartItemId,
        customerinfo: customerinfo,
        paymentinfo: paymentinfo,
        subTotal: totalPrice,
        totalQuantity: totalQuantity,
      }).save();
      res.json({ saveOrder: saveOrder });
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(false, null, 501, `place  controller Error:  ${error} !!`)
      );
  }
};

module.exports = { placeorder };
