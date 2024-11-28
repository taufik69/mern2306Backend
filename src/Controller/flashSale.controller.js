const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const flashSaleModel = require("../Model/flashSale.model.js");
const req = require("express/lib/request.js");

// create a flashSale
const createFlashSale = async (req, res) => {
  try {
    const { productId, offerDate } = req.body;
    if (!productId || !offerDate) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `FlashSale credential Missing !!`)
        );
    }

    // check this isFlashSaleProduct already exist in database
    const isFlashSaleProductExist = await flashSaleModel.findOne({ productId });
    if (isFlashSaleProductExist) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `This product alrady in FlashSale !!`)
        );
    }

    // save the information of database
    const saveFlashSale = await flashSaleModel.create({ productId, offerDate });
    if (saveFlashSale) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            saveFlashSale,
            200,
            null,
            "FlashSale  Create   sucesfull"
          )
        );
    }

    return res
      .status(501)
      .json(new ApiError(false, null, 501, `FlashSale Create Failed !!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Create Flash Sale Controller Error:  ${error} !!`
        )
      );
  }
};

// get All flashSale

const getAllFlashSale = async (req, res) => {
  try {
    const allFlashSale = await flashSaleModel
      .find({})
      .populate({
        path: "productId",
        // populate: "category",
        select: "-description -category -subcategory -review -owner",
      })
      .lean();

    if (allFlashSale?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            allFlashSale,
            200,
            null,
            "FlashSale  Retrive   sucesfull"
          )
        );
    }
    return res
      .status(501)
      .json(
        new ApiResponse(true, null, 501, null, "FlashSale  Retrive  Failed")
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Get All Flash Sale Controller Error:  ${error} !!`
        )
      );
  }
};

// update flashSale
const updateFlashSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updateProduct = await flashSaleModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (updateProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            updateProduct,
            200,
            null,
            "FlashSale  Updated   sucesfull"
          )
        );
    }

    return res
      .status(501)
      .json(new ApiError(false, null, 400, `FlashSale Updated Failed !!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `updateFlashSale Controller Error:  ${error} !!`
        )
      );
  }
};

// delete FlashSale
const deleteFlashSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFlashSale = await flashSaleModel.findByIdAndDelete(id);
    if (deleteFlashSale) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            deleteFlashSale,
            200,
            null,
            "deleteFlashSale  Updated  sucesfull"
          )
        );
    }
    return res
      .status(501)
      .json(new ApiError(false, null, 501, `deleteFlashSale unsesscuss !!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `deleteFlashSale Controller Error:  ${error} !!`
        )
      );
  }
};

// Get Single Flash Sale Item
const GetSingleFlashSaleItem = async (req, res) => {
  try {
    const { id } = req.params;
    const SingleFlashSaleItem = await flashSaleModel
      .findOne({ _id: id })
      .populate({ path: "productId", populate: "subcategory category" ,});

    if (SingleFlashSaleItem) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            SingleFlashSaleItem,
            200,
            null,
            "SingleFlashSaleItem  Updated  sucesfull"
          )
        );
    }

    return res
      .status(501)
      .json(
        new ApiError(false, null, 501, `GetSingleFlashSaleItem not found !`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `GetSingleFlashSaleItem Controller Error:  ${error} !!`
        )
      );
  }
};

module.exports = {
  createFlashSale,
  getAllFlashSale,
  updateFlashSale,
  deleteFlashSale,
  GetSingleFlashSaleItem,
};
