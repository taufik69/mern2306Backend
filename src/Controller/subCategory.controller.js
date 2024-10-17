const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const subCategoryModel = require('../Model/subCategory.model.js');
const categoryModel = require('../Model/category.model.js');

const createSubCategory = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        if (!title || !description || !category) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `sub Category credintail missing !!`
                    )
                );
        }

        const subCategoryInstace = await new subCategoryModel({
            title, description, category
        }).save()

        if (subCategoryInstace) {
            // store the subCategory in the category collection
            // const findCategoryById = await categoryModel.findOneAndUpdate({ _id: category },
            //     {
            //         $push: { subcategory: subCategoryInstace._id }
            //     },
            //     { new: true });
            // console.log(findCategoryById);

            const findCategoryById = await categoryModel.findById(category);
            findCategoryById.subcategory.push(subCategoryInstace._id)
            findCategoryById.save()

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        subCategoryInstace,
                        200,
                        null,
                        "Sub Category Created sucesfull"
                    )
                );

        } else {
            return null
        }



    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    501,
                    `sub category  createSubCategory Error:  ${error} !!`
                )
            );
    }
}
// get AllSubCategoryController
const getAllSubCategory = async (req, res) => {
    try {
        const allSubCategory = await subCategoryModel.find().populate("category");
        if (allSubCategory?.length) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        allSubCategory,
                        200,
                        null,
                        "Sub Category Created sucesfull"
                    )
                );

        } else {
            return res
                .status(501)
                .json(
                    new ApiError(
                        false,
                        null,
                        501,
                        `getAllSubCategory  not Found  !!`
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
                    `getAllSubCategory  Error:  ${error} !!`
                )
            );
    }
}
// delete subCategory 
const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params
        const deltedItem = await subCategoryModel.findOneAndDelete({ _id: id });
        if (deltedItem) {
            const searchCategory = await categoryModel.findById(deltedItem.category)
            if (searchCategory) {
                searchCategory.subcategory.pull(deltedItem._id)
                searchCategory.save()
                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            true,
                            deltedItem,
                            200,
                            null,
                            "Sub Category Deleted  sucesfull"
                        )
                    );

            } else {
                return null
            }
        } else {
            return null
        }

    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    501,
                    `Delete SubCategory  Error:  ${error} !!`
                )
            );
    }
}

module.exports = { createSubCategory, getAllSubCategory, deleteSubCategory }