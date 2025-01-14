const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandeler } = require("../utils/asynhandeler.js");
const { usermodel } = require("../Model/User.model.js");
const { bcryptPassword, decodeHashPassword } = require("../helper/helper.js");
const { passwordChecker, EamilChecker } = require("../utils/Checker.js");
const { sendMail } = require("../utils/SendMail.js");
const { MakeOtp } = require("../helper/OtpGenertator.js");
const { generateAccesToken } = require("../helper/helper.js");

/**
 * todo: createUser controller implement
 * @param {{ req.body }} req
 * @param {{  }} res
 */

// Cookie options
const options = {
  httpOnly: true, // Prevent client-side JavaScript access
  secure: false, // Set to true if using HTTPS
};

const CreateUser = asyncHandeler(async (req, res) => {
  // send information into database
  try {
    const { FirstName, Email_Adress, Password } = req?.body;
    if (!FirstName) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `FirstName Missing !!`));
    }

    if (!Email_Adress || !EamilChecker(Email_Adress)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Email_Adress Missing or Invalid Eamil  !!`
          )
        );
    }
    if (!Password || !passwordChecker(Password)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Password Missing or Minimum eight characters, at least one uppercase letter, one lowercase letter and one number !!`
          )
        );
    }

    // Check if user Alrady exist or not

    const ExisUser = await usermodel.find({
      $or: [{ FirstName: FirstName }, { Email_Adress: Email_Adress }],
    });
    if (ExisUser?.length) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `${ExisUser[0]?.FirstName} Already Exist !!`
          )
        );
    }

    // now make a  password encrypt
    const hasPassword = await bcryptPassword(Password);

    // create a new users in database
    const Users = await new usermodel({
      FirstName,
      Email_Adress,
      Password: hasPassword,
    }).save();

    // create accessToken

    // send a user email
    const otp = await MakeOtp();
    const mailInfo = await sendMail(FirstName, Email_Adress, otp);

    if (Users || accessToken || mailInfo) {
      // now set the opt
      await usermodel.findOneAndUpdate(
        {
          _id: Users._id,
        },
        {
          $set: { OTP: otp },
        },
        {
          new: true,
        }
      );

      const recentCreateUser = await usermodel
        .find({ $or: [{ FirstName }, { Email_Adress }] })
        .select("-Password ");
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            recentCreateUser,
            200,
            null,
            "Registration  sucesfull"
          )
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Registration Controller Error:  ${error} !!`
        )
      );
  }
});

// login controller
const loginCrontroller = async (req, res) => {
  try {
    const { Email_Adress, Password } = req.body;

    if (!Email_Adress || !EamilChecker(Email_Adress)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Email_Adress Missing or Invalid Eamil  !!`
          )
        );
    }

    if (!Password || !passwordChecker(Password)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Password Missing or Minimum eight characters, at least one uppercase letter, one lowercase letter and one number !!`
          )
        );
    }

    const findUser = await usermodel.findOne({ Email_Adress: Email_Adress });

    const userPasswordIsValid = decodeHashPassword(
      Password,
      findUser?.Password
    );

    // generate access token
    const token = await generateAccesToken({
      email: Email_Adress,
      id: findUser._id,
    });

    if (userPasswordIsValid) {
      return res
        .status(200)
        .cookie("Token", token, {
          httpOnly: true,
          secure: false, // Ensure HTTPS is used
          sameSite: "None", // Allow cross-origin cookies
        })
        .json(
          new ApiResponse(
            true,
            {
              FirstName: findUser?.FirstName,
              token: `Bearer ${token}`,
            },
            200,
            null,
            "Login sucesfull !!"
          )
        );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Login Controller Error:  ${error} !!`)
      );
  }
};

// otpMatch controller
const optMatchController = async (req, res) => {
  try {
    const { Email_Adress, OTP } = req.body;
    if (!Email_Adress || !OTP) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Email_Adress Missing or Invalid OTP  !!`
          )
        );
    }

    const checkEmailExistInDB = await usermodel.findOne({
      $and: [{ OTP: OTP, Email_Adress: Email_Adress }],
    });
    if (checkEmailExistInDB) {
      checkEmailExistInDB.OTP = null;
      await checkEmailExistInDB.save();
      return res
        .status(200)
        .json(new ApiResponse(true, 200, null, "OTP Verified !!"));
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `OTP Does not Match !!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Otp Controller Error:  ${error} !!`)
      );
  }
};

// forgot password
const forgotPasswordController = async (req, res) => {
  try {
    const { Email_Adress } = req.body;
    if (!Email_Adress || !EamilChecker(Email_Adress)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Email_Adress Missing or Invalid Eamil  !!`
          )
        );
    }

    // check is email exist in database
    const emailExistInDb = await usermodel
      .findOne({
        Email_Adress: Email_Adress,
      })
      .select("-Password -OTP");
    if (emailExistInDb) {
      const otp = await MakeOtp();
      await sendMail(emailExistInDb.FirstName, Email_Adress, otp);
      // emailExistInDb.OTP = otp;
      emailExistInDb.resetOTP = otp;
      await emailExistInDb.save();
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            emailExistInDb,
            200,
            null,
            "Please Check Your mail "
          )
        );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Forgot Password  Controller Error:  ${error} !!`
        )
      );
  }
};

// forgot password controller
const resetPassword = async (req, res) => {
  try {
    const { Email_Adress, OTP, newPassword } = req.body;
    if (!Email_Adress || !EamilChecker(Email_Adress)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Credential Missing or Wrong Email or Password Format!!`
          )
        );
    }
    if (!OTP || !newPassword || !passwordChecker(newPassword)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Credential Missing or Wrong Email or Password Format!!`
          )
        );
    }
    const isExistUser = await usermodel.findOne({
      $or: [{ Email_Adress: Email_Adress }, { resetOTP: OTP }],
    });
    if (isExistUser) {
      const newhasPassword = await bcryptPassword(newPassword);
      isExistUser.Password = newhasPassword;
      isExistUser.resetOTP = null;
      await isExistUser.save();
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            isExistUser,
            200,
            null,
            "Password updated sucessfully"
          )
        );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Forgot Password  Controller Error:  ${error} !!`
        )
      );
  }
};

// get all register user
const getAllRegisterUser = async (req, res) => {
  try {
    const alluser = await usermodel
      .find({})
      .select("-Password -OTP -Token -resetOTP");
    if (alluser?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            alluser,
            200,
            null,
            "Password updated sucessfully"
          )
        );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Forgot Password  Controller Error:  ${error} !!`
        )
      );
  }
};

// change user role controller
const changeUserController = async (req, res) => {
  try {
    const { Email_Adress, Telephone, role } = req.body;
    if (!Email_Adress || !Telephone) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Credential Missing !!`));
    }

    // find email adress and telephone in database
    const isExistUser = await usermodel
      .findOne({
        $or: [{ Email_Adress: Email_Adress }, { Telephone: Telephone }],
      })
      .select("-password -OTP -resetOTP");

    if (isExistUser) {
      if (isExistUser.role === "user") {
        isExistUser.role = role;
        await isExistUser.save();
        return res
          .status(200)
          .json(
            new ApiResponse(
              true,
              isExistUser,
              200,
              null,
              "Role updated sucessfully you are in marchant"
            )
          );
      } else {
        return res
          .status(200)
          .json(
            new ApiResponse(
              true,
              isExistUser.FirstName,
              200,
              null,
              "Yor are already Marchant"
            )
          );
      }
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Forgot Password  Controller Error:  ${error} !!`
        )
      );
  }
};

module.exports = {
  CreateUser,
  loginCrontroller,
  optMatchController,
  forgotPasswordController,
  resetPassword,
  getAllRegisterUser,
  changeUserController,
};
