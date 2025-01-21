const express = require("express");
const _ = express.Router();
_.route("/success/:trans_id").post((req, res) => {
  res.status(200).json({
    data: "payemnt",
  });
});

module.exports = _;
