const express = require("express");
const _ = express.Router();
const { makeOffer } = require("../../Controller/offerDate.controller");
_.route("/makeoffer").post(makeOffer);
module.exports = _;
