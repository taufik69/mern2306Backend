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

// delte cart item
const cartRemove = async (req, res) => {
  try {
    const { id } = req.params;
    const removeCartitem = await cartModel.findOneAndDelete({ _id: id });
    if (!removeCartitem) {
      return res
        .status(501)
        .json(new ApiError(false, null, 501, `Remove Cart Failed !!`));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          removeCartitem,
          200,
          null,
          "add to cart delete  sucesfull"
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
          `Remove addtocart Controller Error:  ${error} !!`
        )
      );
  }
};

// increment cart quantitiy
const incrementCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartModel.findOne({ _id: id });
    cart.quantity += 1;
    await cart.save();
    if (!cart) {
      return res
        .status(501)
        .json(
          new ApiError(false, null, 501, `Failed increment cartItem quantity!!`)
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(true, cart, 200, null, "cart item increment"));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          ` addtocart increment Controller Error:  ${error} !!`
        )
      );
  }
};

const decrementCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartModel.findOne({ _id: id });
    if (cart.quantity > 1) {
      cart.quantity -= 1;
      await cart.save();
    }

    if (!cart) {
      return res
        .status(501)
        .json(
          new ApiError(false, null, 501, `Failed increment cartItem quantity!!`)
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(true, cart, 200, null, "cart item increment"));
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          false,
          null,
          501,
          ` addtocart increment Controller Error:  ${error} !!`
        )
      );
  }
};

// user wise cart item
const userCartItem = async (req, res) => {
  try {
    const userid = req.user;
    const allcartItem = await cartModel
      .find({ user: userid.id })
      .populate(["product", "user"]);
    if (!allcartItem) {
      return res
        .status(401)
        .json(new ApiError(false, null, 501, `Cart Not Found !!`));
    }
    const subtotal = allcartItem?.reduce(
      (initailValue, item) => {
        const { quantity, product } = item;
        initailValue.totalPrice += parseFloat(
          product.price.replace(/,/gi, "") * quantity
        );
        initailValue.quantity += quantity;
        return initailValue;
      },
      {
        quantity: 0,
        totalPrice: 0,
      }
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        {
          cart: allcartItem,
          totalPrice: subtotal.totalPrice,
          totalQuantity: subtotal.quantity,
        },
        200,
        null,
        "cart item increment"
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
          `user getAddtocart Controller Error:  ${error} !!`
        )
      );
  }
};

module.exports = {
  addtoCart,
  allcartItem,
  cartRemove,
  incrementCartItem,
  decrementCartItem,
  userCartItem,
};
