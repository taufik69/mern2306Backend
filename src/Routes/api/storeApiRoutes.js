const express = require('express');
const _ = express.Router();
const { createMarchant, getAllMarchant, updateMarchant, getSingleMarchant } = require('../../Controller/store.controller.js')
_.route('/becomeMarchant').post(createMarchant);
_.route("/getallmarchant").get(getAllMarchant);
_.route("/update-marchant/:id").patch(updateMarchant);
_.route("/single-marchant/:id").patch(getSingleMarchant);
module.exports = _;