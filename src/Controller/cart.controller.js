const cartModel = require("../Model/cart.model");
const { usermodel } = require("../Model/User.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

const addtoCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    // validation user input
    if (!product) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `cart credential missing !!`));
    }
    // check is item alrady in cart
    const isExist = await cartModel.findOne({ product: product });

    if (isExist) {
      isExist.quantity += 1;
      await isExist.save();
      return res
        .status(201)
        .json(new ApiResponse(true, isExist, 201, null, "Again Add to cart"));
    }
    // now save the infortion into database
    const saveproduct = await cartModel.create({
      product,
      quantity,
      user: req.user?.id,
    });
    if (!saveproduct) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Add to cart Failed !!`));
    }

    // push the cart item into user model
    const user = await usermodel.findById(req.user?.id);
    user.cartitem.push(saveproduct._id);
    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(true, saveproduct, 200, null, "add to cart   sucesfull")
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          `addtocart Controller Error:  ${error} !!`
        )
      );
  }
};

// get all cart items by user
const allcartItem = async (req, res) => {
  try {
    const { id } = req.user;

    const cartitem = await cartModel
      .find({ user: id })
      .populate({
        path: "product",
      })
      .populate({
        path: "user",
      });
    if (!cartitem) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Add to cart Not Found !!`));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          cartitem,
          200,
          null,
          "add to cart retrive  sucesfull"
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
          `get addtocart Controller Error:  ${error} !!`
        )
      );
  }
};

module.exports = { addtoCart, allcartItem };
