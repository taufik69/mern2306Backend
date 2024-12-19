const express = require('express');
const { createProduct, getAllProducts, updateProduct, singleProduct, searchProduct,delteproduct } = require('../../Controller/product.controller');
const { upload } = require('../../middleware/multer.middleware')
const _ = express.Router();
_.route('/product').post(upload.fields([{ name: 'image', maxCount: 10 }]), createProduct).get(getAllProducts);
_.route('/product/:id').patch(upload.fields([{ name: 'image', maxCount: 10 }]), updateProduct).get(singleProduct).delete(delteproduct)
_.route('/product-search').get(searchProduct)



module.exports = _;