const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const ordermodel = require("../Model/order.model.js");
const cartModel = require("../Model/cart.model.js");
const { usermodel } = require("../Model/User.model.js");
const invoiceModel = require("../Model/invoice.model.js");
const SSLCommerzPayment = require("sslcommerz-lts");
const crypto = require("crypto");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.ISLIVE == "false"; //true for live, false for sandbox
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
    if (paymentmethod.toLocaleLowerCase() == "cash".toLocaleLowerCase()) {
      const saveOrder = await new ordermodel({
        user: userinfo.id,
        cartItem: cartItemId,
        customerinfo: customerinfo,
        paymentinfo: paymentinfo,
        subTotal: totalPrice,
        totalQuantity: totalQuantity,
      }).save();
      // now save the invoice to the db
      const invoice = new invoiceModel({
        user_id: req.user.id,
        payment_status: "Pending",
        delivery_status: "Pending",
        cus_details: customerinfo,
        total: totalPrice,
        vat: 2,
        payable: parseInt((totalPrice * 2) / 100),
      }).save();
      res.json({ saveOrder: saveOrder });
    } else if (
      paymentmethod.toLocaleLowerCase() == "online".toLocaleLowerCase()
    ) {
      let trans_id = crypto.randomUUID().split("-")[0];
      const data = {
        total_amount: 100,
        currency: "BDT",
        tran_id: `trans_id${trans_id}`, // use unique tran_id for each api call
        success_url: "http://localhost:4000/api/v1/success/" + trans_id,
        fail_url: "http://localhost:4000/api/v1/fail/" + trans_id,
        cancel_url: "http://localhost:4000/api/v1/cancel/" + trans_id,
        ipn_url: "http://localhost:4000/api/v1/ipn" + trans_id,
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const apiResponse = await sslcz.init(data);
      if (!apiResponse) {
        return res
          .status(501)
          .json(
            new ApiError(false, null, 501, `Payment initailization Failed!!`)
          );
      }
      console.log(apiResponse.GatewayPageURL);

      const saveOrder = await new ordermodel({
        user: userinfo.id,
        cartItem: cartItemId,
        customerinfo: customerinfo,
        paymentinfo: paymentinfo,
        subTotal: totalPrice,
        totalQuantity: totalQuantity,
      }).save();
      // now save the invoice to the db
      new invoiceModel({
        user_id: req.user.id,
        payment_status: "Pending",
        delivery_status: "Pending",
        cus_details: customerinfo,
        total: totalPrice,
        tran_id: trans_id,
        vat: 2,
        payable: parseInt((totalPrice * 2) / 100),
      }).save();

      return res
        .status(200)
        .json({ saveOrder: saveOrder, payemntURl: apiResponse.GatewayPageURL });
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(false, null, 501, `place  controller Error:  ${error} !!`)
      );
  }
};

// get all order
const allorder = async (req, res) => {
  try {
    const getallorder = await ordermodel
      .find()
      .populate({
        path: "user",
      })
      .populate({
        path: "cartItem",
      });
    if (!getallorder) {
      return res
        .status(501)
        .json(new ApiError(false, null, 501, `Order Not Found !!`));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          getallorder,
          200,
          null,
          "All order retrive sucesfull"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `get all  controller Error:  ${error} !!`
        )
      );
  }
};

// user order
const orderbyUser = async (req, res) => {
  try {
    const userid = req.user;
    const userOrder = await ordermodel
      .find({
        user: userid.id,
      })
      .populate({
        path: "user",
      })
      .populate({
        path: "cartItem",
      });

    if (!userOrder?.length) {
      return res
        .status(401)
        .json(new ApiError(false, null, 401, `User Order Not Found !!`));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          userOrder,
          200,
          null,
          "userOrder  retive    sucesfull"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `User order  controller Error:  ${error} !!`
        )
      );
  }
};

// cancle order

const cancleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { id } = req.user;
    const cancleorderRequest = await ordermodel.findOne({
      _id: orderId,
      user: id,
    });

    cancleorderRequest.status = "cancel";
    await cancleorderRequest.save();
    if (!cancleorderRequest) {
      return res
        .status(501)
        .json(new ApiError(false, null, 501, `cancle order Failed!!`));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          cancleorderRequest,
          200,
          null,
          " cancleorderRequest    sucesfull"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `cancleOrder order  controller Error:  ${error} !!`
        )
      );
  }
};

module.exports = { placeorder, allorder, orderbyUser, cancleOrder };
