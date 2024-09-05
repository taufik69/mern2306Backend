const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js')
const { asyncHandeler } = require('../utils/asynhandeler.js');
const { usermodel } = require('../Model/User.model.js');
const { passwordChecker, EamilChecker } = require('../utils/Checker.js')
/**
 * todo: createUser controller implement
 * @param {{ req.body }} req 
 * @param {{  }} res 
 */
const CreateUser = asyncHandeler(async (req, res) => {


    // send information into database
    try {
        const { FirstName, LastName, Email_Adress, Telephone, Adress1, City, Password } = req?.body;
        if (!FirstName) {
            return res.status(404).json(new ApiError(false, null, 400, `FirstName Missing !!`))
        }
        if (!LastName) {
            return res.status(404).json(new ApiError(false, null, 400, `LastName Missing !!`))
        }
        if (!Email_Adress || !EamilChecker(Email_Adress)) {
            return res.status(404).json(new ApiError(false, null, 400, `Email_Adress Missing or Invalid Eamil  !!`))
        }
        if (!Telephone) {
            return res.status(404).json(new ApiError(false, null, 400, `Telephone Missing !!`))
        }
        if (!Adress1) {
            return res.status(404).json(new ApiError(false, null, 400, `Adress1 Missing !!`))
        }
        if (!City) {
            return res.status(404).json(new ApiError(false, null, 400, `City Missing !!`))
        }
        if (!Password || !passwordChecker(Password)) {
            return res.status(404).json(new ApiError(false, null, 400, `Password Missing or Minimum eight characters, at least one uppercase letter, one lowercase letter and one number !!`))
        }


        // Check if user Alrady exist or not

        const ExisUser = await usermodel.find({ $or: [{ FirstName: FirstName }, { Email_Adress: Email_Adress }] })
        if (ExisUser?.length) {
            return res.status(404).json(new ApiError(false, null, 400, `${ExisUser[0]?.FirstName} Already Exist !!`))
        };

        const Users = await new usermodel({
            FirstName, LastName, Email_Adress, Telephone, Adress1, City, Password
        }).save();
        if (Users) {
            const recentCreateUser = await usermodel.find({ $or: [{ FirstName }, { Email_Adress }] }).select("-Password -_id")
            return res.status(200).json(new ApiResponse(true, recentCreateUser, 200, null, "Registration  sucesfull"))
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json(new ApiError(false, null, 400, `Registration Controller Error:  ${error} !!`))
    }

})

module.exports = { CreateUser }