const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const productModel = require('../Model/product.model.js');
const { uploadCloudinary } = require("../utils/cloudinary.js");

const createProduct = async (req, res) => {
    try {
        // const { name, description, category, price, discountPrice, rating, review, owner, storeid } = req.body;
        const nonRequiredItem = ["discountPrice", "rating", "review", "subcategory"];
        for (let key in req.body) {
            if (nonRequiredItem.includes(key)) {
                continue;
            }
            if (!req.body[key]) {
                return res
                    .status(404)
                    .json(
                        new ApiError(
                            false,
                            null,
                            400,
                            `Product ${key} Missing !!`
                        )
                    );
            }

        }
        const image = req.files?.image;
        if (!image) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `image Missing !!`
                    )
                );
        }

        const imageInfo = await uploadCloudinary(image[0].path);

        console.log(imageInfo);


    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    `Create product  Controller Error:  ${error} !!`
                )
            );
    }
}


module.exports = { createProduct }