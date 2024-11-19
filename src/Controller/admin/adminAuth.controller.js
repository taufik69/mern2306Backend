const { ApiError } = require("../../utils/ApiError.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const adminModel = require('../../Model/admin/admin.model');
const { bcryptPassword } = require('../../helper/helper')
const adminSignUp = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `Admin Credential Missing !`
                    )
                );
        }

        // check is Already exist admin
        const checkIsAlreadyExistAdmin = await adminModel.find({ $or: [{ usernameOrEmail: usernameOrEmail }] })

        if (checkIsAlreadyExistAdmin?.length) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `${usernameOrEmail} already Exist Try another One !`
                    )
                );
        }

        // now hash the password
        const haspassword = await bcryptPassword(password)
        const saveAdminInfo = await new adminModel({
            usernameOrEmail,
            password: haspassword,
            // image: (image && { ...image })
        }).save();
        if (saveAdminInfo) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        saveAdminInfo,
                        200,
                        null,
                        "Admin Create   sucesfull"
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
                    `Admin Controller Error:  ${error} !!`
                )
            );
    }
}

module.exports = { adminSignUp }