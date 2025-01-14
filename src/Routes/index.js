var express = require("express");
const { Router } = express;
const _ = Router();
const { ApiError } = require("../utils/ApiError.js");
const authRoutes = require("./api/auth.ApiRoutes.js");
const categoryRoutes = require("./api/category.apiRoutes.js");
const subCategoryRoutes = require("./api/subCategory.Apiroutes.js");
const storeRoutes = require("./api/storeApiRoutes.js");
const productRoutes = require("./api/product.ApiRoutes.js");
const adminRoutes = require("./api/admin/admin.apiroutes");
const bestSellilngRoutes = require("./api/bestSellilngApiRoutes.js");
const flashSaleRoutes = require("./api/flashSale.ApiRoutes.js");
const bannerRoutes = require("./api/banner.ApiRoutes.js");
const OfferDateRoutes = require("./api/OfferDate.apiRoutes.js");
const cartRoutes = require("../Routes/api/cart.apiRoutes.js");

_.use(process.env.BASE_URL, authRoutes);
_.use(process.env.BASE_URL, categoryRoutes);
_.use(process.env.BASE_URL, subCategoryRoutes);
_.use(process.env.BASE_URL, storeRoutes);
_.use(process.env.BASE_URL, productRoutes);
_.use(process.env.BASE_URL, adminRoutes);
_.use(process.env.BASE_URL, bestSellilngRoutes);
_.use(process.env.BASE_URL, flashSaleRoutes);
_.use(process.env.BASE_URL, bannerRoutes);
_.use(process.env.BASE_URL, OfferDateRoutes);
_.use(process.env.BASE_URL, cartRoutes);

_.use(process.env.BASE_URL, (req, res) => {
  res.status(400).json(new ApiError(false, null, 404, "Api Routes InValid !!"));
});
module.exports = _;
