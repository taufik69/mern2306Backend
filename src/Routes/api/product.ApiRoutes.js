const express = require('express');
const { createProduct } = require('../../Controller/product.controller');
const { upload } = require('../../middleware/multer.middleware')
const _ = express.Router();
_.route('/product').post(upload.fields([{ name: 'image', maxCount: 10 }]), createProduct)

module.exports = _;