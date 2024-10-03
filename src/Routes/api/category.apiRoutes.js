const express = require('express');
const _ = express.Router();
const { createCatagoryController, getAllcategoryController, getSingleCategory } = require('../../Controller/category.controller')
_.route('/category').post(createCatagoryController).get(getAllcategoryController)
_.route('/singlecategory/:id').get(getSingleCategory)

module.exports = _;