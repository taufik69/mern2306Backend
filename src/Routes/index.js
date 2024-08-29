var express = require('express')
const {Router} = express;
const _ = Router();
const authRoutes = require('./api/auth.ApiRoutes.js')
const {ApiError} = require('../utils/ApiError.js')


_.use(process.env.BASE_URL ,authRoutes)
_.use(process.env.BASE_URL ,(req,res)=> {
    res.status(400).json(new ApiError(false, null, 404, "Api Routes InValid !!"))
  
} )
module.exports = _;



