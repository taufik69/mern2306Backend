const express = require("express");
const _ = express.Router();
const {
  sucess,
  Cancel,
  Failed,
} = require("../../Controller/payment.controller");
_.route("/success/:trans_id").post(sucess);
_.route("/cancel/:trans_id").post(Cancel);
_.route("/fail/:trans_id").post(Failed);

module.exports = _;
