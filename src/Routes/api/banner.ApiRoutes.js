const express= require('express');
const _ = express.Router();
const {upload} = require('../../middleware/multer.middleware')
const {createBanner ,getAllBannerImage ,updateBanner}  = require('../../Controller/banner.controller')

_.route('/banner').post(upload.fields([{name:'image' , maxCount:1}]),createBanner).get(getAllBannerImage);
_.route('/banner/:id').put(upload.fields([{name:'image' , maxCount:1}]), updateBanner)
module.exports = _;