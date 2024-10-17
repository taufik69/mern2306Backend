const express = require('express');
const _ = express.Router();
const { createSubCategory, getAllSubCategory, deleteSubCategory } = require('../../Controller/subCategory.controller')
_.route('/subCategory').post(createSubCategory).get(getAllSubCategory);
_.route('/deltesubcategory/:id').delete(deleteSubCategory)
module.exports = _;