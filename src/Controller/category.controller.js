const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const categoryModel = require('../Model/category.model.js')
const createCatagoryController = async (req, res) => {
    try {

        const { title, description } = req.body
        if (!title || !description) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `Title or Description Missing !!`
                    )
                );
        }

        // check the title is already exist in database

        const isExistCategory = await categoryModel.find({ title: title });

        if (isExistCategory?.length) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `${isExistCategory[0]?.title} Already Exist !!`
                    )
                );
        }

        // finally saved the category document into database

        const categoryInstace = await new categoryModel({
            title: title,
            description: description
        }).save()

        if (categoryInstace) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        categoryInstace,
                        200,
                        null,
                        "Category Create   sucesfull"
                    )
                );
        }

    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    `Registration Controller Error:  ${error} !!`
                )
            );
    }
}
// get see all category 

const getAllcategoryController = async (req, res) => {
    try {
        const allCategory = await categoryModel.find({});
        if (allCategory) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        allCategory,
                        200,
                        null,
                        "Registration  sucesfull"
                    )
                );
        } else {


            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `Category Not Found in database !!`
                    )
                );
        }

    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    501,
                    `category get Controller Error:  ${error} !!`
                )
            );
    }
}


//  get single category 
const getSingleCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const searchItem = await categoryModel.findById({ _id: id });
        if (!searchItem) {
            return null
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    true,
                    searchItem,
                    200,
                    null,
                    "Retrive single category  sucesfull"
                )
            );


    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    501,
                    `category  get single Controller Error:  ${error} !!`
                )
            );
    }
}


// approve category by admin 

const addprovedCatagory = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);

    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    501,
                    `addprovedCatagory Controller Error:  ${error} !!`
                )
            );
    }
}
module.exports = { createCatagoryController, getAllcategoryController, getSingleCategory }