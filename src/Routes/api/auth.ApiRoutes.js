const express = require('express');
const { Router } = express;
const { CreateUser, loginCrontroller } = require('../../Controller/User.controller.js');
const { authGurad } = require("../../middleware/authguard.js")
const _ = Router();
_.route("/registration").post(CreateUser);
_.route('/login').post(authGurad, loginCrontroller)

module.exports = _