const express = require('express');
const {Router} = express;
const {ApiResponse} = require('../../utils/ApiResponse.js')
const _  = Router();
_.route("/getname").get((req,res)=> {
    res.status(200).json(new ApiResponse(true,"mern 2307" , false , "Everyting is fair and love and war"))
    
})

module.exports = _