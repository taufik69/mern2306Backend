const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const offerModel = require("../Model/timeOffer.model.js");
const { off } = require("../Model/flashSale.model.js");

const makeOffer = async (req, res) => {
  try {
    const { offerName, offerDate } = req.body;
    if (!offerName || !offerDate) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `OfferDate or OfferName Missing !!`)
        );
    }

    // check is already Exist offer Name
    const checkOffer = await offerModel.find({ offerName: offerName });
    if (checkOffer?.length) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Offer Already Exist  !!`));
    }

    // now the total amount of offer
    const totalamountOfOffer = await offerModel.find();
    let count = totalamountOfOffer?.length < 2;
    if (!count) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `OfferDate must be 2 !!`));
    }
    // now save to the offer info into db
    const saveOffer = await offerModel.create({ offerName, offerDate });
    if (!saveOffer) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Offer does not created !!`));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(true, saveOffer, 200, null, " Offercreate   sucesfull")
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `make offer Controller Error:  ${error} !!`
        )
      );
  }
};

// get all Offer

const getAllOffer = async (req, res) => {
  try {
    const allOffer = await offerModel.find();
    if (allOffer) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            allOffer,
            200,
            null,
            " All Offer Retrive   sucesfull"
          )
        );
    }
    return res
      .status(401)
      .json(new ApiError(false, null, 401, `Offer Not Found !!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `get All  offer Controller Error:  ${error} !!`
        )
      );
  }
};
module.exports = { makeOffer, getAllOffer };
