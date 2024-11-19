const express = require('express');
const _ = express.Router();
const { adminSignUp } = require('../../../Controller/admin/adminAuth.controller')

_.route('/admin/signUp').post(adminSignUp)
module.exports = _;