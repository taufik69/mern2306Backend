const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const bannerModel = require("../Model/banner.model.js");
const {
  uploadCloudinary,
  deleteCloudinaryAssets,
} = require("../utils/cloudinary.js");
const createBanner = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.files?.image;
    if (!image || !name) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `Banner image or name missing !!`)
        );
    }

    // check this banner image already exist in datbase
    const isAlreadyExistBanner = await bannerModel.find({ name: name });

    if (isAlreadyExistBanner?.length) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `Banner  ${name}  Already Exist !!`)
        );
    }

    // now upload the image on cloudinary

    const uploadUrl = await uploadCloudinary(image);

    // now save the banner image and  name on database
    const saveBannerImage = await new bannerModel({
      name: name,
      image: uploadUrl[0],
    }).save();
    if (saveBannerImage) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            saveBannerImage,
            200,
            null,
            "banner image create   sucesfull"
          )
        );
    }
    return res
      .status(401)
      .json(new ApiError(false, null, 401, `Banner Image create Failed !!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `createBanner Controller Error:  ${error} !!`
        )
      );
  }
};

// get all banner image
const getAllBannerImage = async (req, res) => {
  try {
    const allBanner = await bannerModel.find({});
    if (allBanner?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            allBanner,
            200,
            null,
            "banner image create   sucesfull"
          )
        );
    }
    return res
      .status(401)
      .json(new ApiError(false, null, 501, `Banner Not found !!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `getAllBanner controller Error:  ${error} !!`
        )
      );
  }
};

// update banner
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.files?.image;
    if (!image) {
      return res
        .status(401)
        .json(new ApiError(false, null, 401, `image missing!!`));
    }
    const searchItem = await bannerModel.findById(id);
    const deletedItem = await deleteCloudinaryAssets([searchItem?.image]);

    if (deletedItem) {
      // upload new image on cloudinary
      const uploadUrl = await uploadCloudinary(image);
      const updatedBanner = await bannerModel.findOneAndUpdate(
        { _id: id },
        { ...req.body, image: uploadUrl[0] },
        { new: true }
      );
      if (updatedBanner) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              true,
              updatedBanner,
              200,
              null,
              "banner image update   sucesfull"
            )
          );
      }
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `updateBanner Controller Error:  ${error} !!`
        )
      );
  }
};

module.exports = { createBanner, getAllBannerImage, updateBanner };
