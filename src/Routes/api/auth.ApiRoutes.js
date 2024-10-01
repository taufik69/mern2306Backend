const express = require("express");
const { Router } = express;
const {
  CreateUser,
  loginCrontroller,
  optMatchController,
  forgotPasswordController,
  resetPassword,
  getAllRegisterUser,
  changeUserController,
} = require("../../Controller/User.controller.js");
const { authGurad } = require("../../middleware/authguard.js");
const _ = Router();
_.route("/registration").post(CreateUser);
_.route("/login").post(loginCrontroller);
_.route("/opt-verification").post(optMatchController);
_.route("/forgotpassword").post(forgotPasswordController);
_.route("/resetpassword").post(resetPassword);
_.route("/allusers").get(getAllRegisterUser);
_.route("/change-role").post(changeUserController);

module.exports = _;
