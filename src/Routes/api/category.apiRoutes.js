const express = require('express');
const _ = express.Router();
const { createCatagoryController, getAllcategoryController, getSingleCategory, addprovedCatagory } = require('../../Controller/category.controller')
_.route('/category').post(createCatagoryController).get(getAllcategoryController)
_.route('/singlecategory/:id').get(getSingleCategory);
_.route('/approvecategory').post(addprovedCatagory);

module.exports = _;