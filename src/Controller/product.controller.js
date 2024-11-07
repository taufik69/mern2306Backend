const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const productModel = require('../Model/product.model.js');
const { uploadCloudinary  ,deleteCloudinaryAssets} = require("../utils/cloudinary.js");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
// upload product controller
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
        const isExistProduct = await productModel.find({ name: req.body.name });
        if (isExistProduct?.length) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        ` ${req.body.name} Product is Already Exist !!`
                    )
                );
        }
        const imageInfo = await uploadCloudinary(image);
       
        const saveProduct = await new productModel({
            ...req.body,
            image: [...imageInfo]
        }).save()
        if (saveProduct) {
            // delte the previous cache
            myCache.del('allproduct')
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        saveProduct,
                        200,
                        null,
                        "Product Create    sucesfull"
                    )
                );
        }
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    `Failed to Upload product Try Agin!!`
                )
            );

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

// get all product controller
const getAllProducts = async (req, res) => {
    try {
        let value = myCache.get("allproduct");
        if (value === undefined) {
            const allProducts = await productModel.find({}).populate(["category" , "subcategory" ,"owner" , "storeid"]);

            if (allProducts) {
                // cached the all produt
                myCache.set('allproduct', JSON.stringify(allProducts))
                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            true,
                            allProducts,
                            200,
                            null,
                            "Product Create    sucesfull"
                        )
                    );
            }
        } else {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        JSON.parse(value),
                        200,
                        null,
                        "Product Create    sucesfull"
                    )
                );
        }

        return res
            .status(400)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    `No Product Found !!`
                )
            );

    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    `Get All product  Controller Error:  ${error} !!`
                )
            );
    }
}

// update product controller
const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const image = req.files?.image;
        let updatedProduct = await productModel.findById(id);
        let updateProductObj= {}
        if(image){
           await deleteCloudinaryAssets(updatedProduct?.image);
           const imageUrl =  await uploadCloudinary(image)
            updateProductObj = { ...req.body, image: imageUrl };
          
        }else{
            updateProductObj = {...req.body}
        }
        const updatedProdut =  await productModel.findOneAndUpdate({_id:id } , {...updateProductObj } , {new:true})
        if (updatedProdut) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        updatedProdut,
                        200,
                        null,
                        "Product Create    sucesfull"
                    )
                );
        }
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    500,
                    ` Product Update Failed !!`
                )
            );


    } catch (error) {
        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    ` product update Controller Error:  ${error} !!`
                )
            );
    }
}

// get a singleproduct controller 
const singleProduct = async(req,res)=> {
    try {
        const {id} = req.params;
        const prouduct = await productModel.findById(id).populate(["category" , "subcategory" , "owner" , "storeid"]);
        if(prouduct){
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        prouduct ,
                        200,
                        null,
                        "Product Create    sucesfull"
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
                    `Get Single product  Controller Error:  ${error} !!`
                )
            );
    }
}

module.exports = { createProduct, getAllProducts, updateProduct ,singleProduct }