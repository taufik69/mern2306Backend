const express = require("express");
const _ = express.Router();
const {
  createCatagoryController,
  getAllcategoryController,
  getSingleCategory,
  addprovedCatagory,
  deleteSingleCategory,
} = require("../../Controller/category.controller");
_.route("/category")
  .post(createCatagoryController)
  .get(getAllcategoryController);
_.route("/singlecategory/:id")
  .get(getSingleCategory)
  .delete(deleteSingleCategory);
_.route("/approvecategory").post(addprovedCatagory);

module.exports = _;
