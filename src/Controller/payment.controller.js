const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const ordermodel = require("../Model/order.model.js");
const invoiceModel = require("../Model/invoice.model.js");
const { usermodel } = require("../Model/User.model.js");

const sucess = async (req, res) => {
  try {
    const { trans_id } = req.params;
    // find the invoice with trnasid
    const updateinvoice = await invoiceModel.findOneAndUpdate(
      { tran_id: trans_id },
      { payment_status: "Success" },
      { new: true }
    );
    console.log(updateinvoice);
    // update order payment ispaid
    const order = await ordermodel.findOne({ _id: updateinvoice.order_id });
    order.paymentinfo.ispaid = true;
    await order.save();
    res.redirect(`${process.env.FRONTEND_DOMAIN}/Sucess`);
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `payment sucess  controller Error:  ${error} !!`
        )
      );
  }
};

const Failed = async (req, res) => {
  try {
    const { trans_id } = req.params;
    // find the invoice with trnasid
    const updateinvoice = await invoiceModel.findOneAndUpdate(
      { tran_id: trans_id },
      { payment_status: "Failed" },
      { new: true }
    );

    // update order payment ispaid
    const order = await ordermodel.findOne({ _id: updateinvoice.order_id });
    order.paymentinfo.ispaid = false;
    await order.save();
    res.redirect(`${process.env.FRONTEND_DOMAIN}/fail`);
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `payment Failed  controller Error:  ${error} !!`
        )
      );
  }
};

const Cancel = async (req, res) => {
  try {
    const { trans_id } = req.params;
    // find the invoice with trnasid
    const updateinvoice = await invoiceModel.findOneAndUpdate(
      { tran_id: trans_id },
      { payment_status: "Cancel" },
      { new: true }
    );
    console.log(updateinvoice);
    // update order payment ispaid
    const order = await ordermodel.findOne({ _id: updateinvoice.order_id });
    order.paymentinfo.ispaid = false;
    await order.save();
    res.redirect(`${process.env.FRONTEND_DOMAIN}/cancel`);
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `payment cancel  controller Error:  ${error} !!`
        )
      );
  }
};

module.exports = { sucess, Cancel, Failed };
