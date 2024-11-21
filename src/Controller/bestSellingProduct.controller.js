const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const bestSellingModel = require("../Model/bestSellingProduct.model.js");

/**
 * todo : createBestSEllling controller
 * @param req({})
 * @param res({})
 */

const createBestSEllling = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `CreateBestSelling product credential Missing !!`
          )
        );
    }

    // check alrady exist the product in database
    const checkAlreadyExist = await bestSellingModel.find({ product: product });

    if (checkAlreadyExist?.length) {
      // product model query
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `This product Already Exist !!`));
    }

    // save the product id into database
    const saveProductId = await bestSellingModel.create({ product });
    if (saveProductId) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            saveProductId,
            200,
            null,
            "CreateBestSellingProduct  sucesfull"
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
          `createBestSEllling Controller Error:  ${error} !!`
        )
      );
  }
};

/**
 * todo getAllbestSellingProduct
 * @param req({})
 * @param res({})
 */
const getAllbestSellingProduct = async (_, res) => {
  try {
    const bestSellingProduct = await bestSellingModel
      .find({})
      .populate("product");
    if (bestSellingProduct?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            bestSellingProduct,
            200,
            null,
            "bestSellingProduct Retrive  sucesfull"
          )
        );
    }
    return res
      .status(501)
      .json(
        new ApiError(false, null, 501, `BestSEllling product Not Found !!`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `GetAllBestSEllling Controller Error:  ${error} !!`
        )
      );
  }
};

/**
 * todo updateBestSellingProduct
 * @param req({})
 * @param res({})
 */

const updateBestSellingProduct = async (req, res) => {
  try {
    const { produtId } = req.params;

    const searchBestSellingProducts = await bestSellingModel.findOneAndUpdate(
      {
        product: produtId,
      },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (searchBestSellingProducts) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            searchBestSellingProducts,
            200,
            null,
            "bestSellingProduct Retrive  sucesfull"
          )
        );
    }

    return res
      .status(501)
      .json(
        new ApiError(false, null, 501, `BestSellingProduct Update  Failed!!`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `updateBestSellingProduct Controller Error:  ${error} !!`
        )
      );
  }
};

/**
 * todo delete BestSellilgnProduct
 * @param req({})
 * @param res({})
 */

const deltebestSelllingProduct = async (req, res) => {
  const { produtId } = req.params;
  console.log(produtId);

  if (!produtId) {
    return res
      .status(404)
      .json(new ApiError(false, null, 400, ` deleted  Product id  Missing !!`));
  }
  const isDeletedProduct = await bestSellingModel.findOneAndDelete({
    product: produtId,
  });

  if (!isDeletedProduct) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 500, ` Can't delete product right now !!`)
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        true,
        isDeletedProduct,
        200,
        false,
        "successfully deleted product"
      )
    );

  console.log(isExistedProduct);
};

module.exports = {
  createBestSEllling,
  getAllbestSellingProduct,
  updateBestSellingProduct,
  deltebestSelllingProduct,
};
