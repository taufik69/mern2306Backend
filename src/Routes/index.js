var express = require('express')
const { Router } = express;
const _ = Router();
const { ApiError } = require('../utils/ApiError.js')
const authRoutes = require('./api/auth.ApiRoutes.js');
const categoryRoutes = require('./api/category.apiRoutes.js');



_.use(process.env.BASE_URL, authRoutes)
_.use(process.env.BASE_URL, categoryRoutes)
_.use(process.env.BASE_URL, (req, res) => {
    res.status(400).json(new ApiError(false, null, 404, "Api Routes InValid !!"))

})
module.exports = _;



