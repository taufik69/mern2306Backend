const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandeler } = require("../utils/asynhandeler.js");
const { usermodel } = require("../Model/User.model.js");
const { bcryptPassword, generateAccesToken, decodeHashPassword } = require("../helper/helper.js");
const { passwordChecker, EamilChecker } = require("../utils/Checker.js");
const { sendMail } = require("../utils/SendMail.js");
const { MakeOtp } = require("../helper/OtpGenertator.js");
const nodemailer = require("nodemailer");
/**
 * todo: createUser controller implement
 * @param {{ req.body }} req
 * @param {{  }} res
 */

const options = {
  httpOnly: true,
  secure: true,
};

const CreateUser = asyncHandeler(async (req, res) => {
  // send information into database
  try {
    const {
      FirstName,
      LastName,
      Email_Adress,
      Telephone,
      Adress1,
      City,
      Password,
    } = req?.body;
    if (!FirstName) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `FirstName Missing !!`));
    }
    if (!LastName) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `LastName Missing !!`));
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
    if (!Telephone) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Telephone Missing !!`));
    }
    if (!Adress1) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Adress1 Missing !!`));
    }
    if (!City) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `City Missing !!`));
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
      LastName,
      Email_Adress,
      Telephone,
      Adress1,
      City,
      Password: hasPassword,
    }).save();

    // create accessToken
    let accessToken = await generateAccesToken(Email_Adress, Telephone);
    // send a user email
    const otp = await MakeOtp();
    const mailInfo = await sendMail(FirstName, Email_Adress, otp);

    if (Users || accessToken || mailInfo) {
      // now set the token in database
      await usermodel.findOneAndUpdate(
        { _id: Users._id },
        {
          $set: { Token: accessToken },
        },
        {
          new: true,
        }
      );

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
        .cookie("Token", accessToken, options)
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
    const { Email_Adress, Password } = req.body

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


    const findUser = await usermodel.findOne({ Email_Adress: Email_Adress })

    const userPasswordIsValid = decodeHashPassword(Password, findUser?.Password);
    if (userPasswordIsValid) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            {
              FirstName: findUser?.FirstName
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
        new ApiError(
          false,
          null,
          400,
          `Login Controller Error:  ${error} !!`
        )
      );
  }
}

module.exports = { CreateUser, loginCrontroller };
