const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const storeModel = require('../Model/store.model.js');
const { usermodel } = require('../Model/User.model.js')
const { bdNumberChecker, EamilChecker } = require("../utils/Checker.js");
const createMarchant = async (req, res) => {
    try {
        const { users, storename, phoneNumber, email } = req.body;
        // validate or sanitize the merchant information
        if (!users || !storename || !phoneNumber || !email) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `Marchant Credintial missing !!`
                    )
                );
        }
        // check the number is valid or not 
        if (!bdNumberChecker(phoneNumber) || !EamilChecker(email)) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `Marchant Credintial format Invalid  !!`
                    )
                );
        }

        // now check is alrady exist marchnat
        const isAlreadyExistMarchant = await storeModel.find({
            $or: [{ email }, { phoneNumber }, { storename }, { users }]
        })
        if (isAlreadyExistMarchant?.length) {
            return res
                .status(404)
                .json(
                    new ApiError(
                        false,
                        null,
                        400,
                        `Marchant Already Registred !!`
                    )
                );
        }
        // now save the marchant information into database
        const saveMarchant = await new storeModel({
            users, storename, phoneNumber, email
        }).save();
        if (saveMarchant) {
            const updateUserRole = await usermodel.findOne({ _id: users }).select('-Password');
            updateUserRole.role = "merchant";
            await updateUserRole.save()
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        updateUserRole,
                        200,
                        null,
                        "Marchant Created sucesfull"
                    )
                );
        }

        return res
            .status(501)
            .json(
                new ApiError(
                    false,
                    null,
                    501,
                    `Marchant Create Failed  !!`
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
                    `Create Store  Error:  ${error} !!`
                )
            );
    }
}

//  get all marchant 
const getAllMarchant = async (req, res) => {
    try {
        const allMarchants = await storeModel.find().select("-password");
        if (allMarchants) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        allMarchants,
                        200,
                        null,
                        "Marchant Created sucesfull"
                    )
                );
        }
        return res
            .status(404)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    `Marchant Not Found !!`
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
                    `Get all Marchant  Error:  ${error} !!`

                )
            );
    }
}
// update marchant information
const updateMarchant = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, phoneNumber, storename, users } = req.body
        const findMarchnat = await storeModel.findById(id);
        if (findMarchnat) {
            const updateMarchant = await storeModel.findOneAndUpdate({ _id: id }, {
                ...(email && { email }),
                ...(phoneNumber && { phoneNumber }),
                ...(storename && { storename }),
                ...(users && { users })

                // ...req.body
            }, { new: true }).populate('users')

            if (updateMarchant) {
                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            true,
                            updateMarchant,
                            200,
                            null,
                            "Marchant update sucesfull"
                        )
                    );
            } else {
                return res
                    .status(501)
                    .json(
                        new ApiError(
                            false,
                            null,
                            501,
                            `Marchant update Failed !!`
                        )
                    );
            }
        }
        return res
            .status(404)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    `Marchant Not Found !!`
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
                    `Update Marchant  Error:  ${error} !!`

                )
            );
    }
}

// single marchnat  
const getSingleMarchant = async (req, res) => {
    try {
        const { id } = req.params;
        const findSingleMarchant = await storeModel.findById(id)
        if (findSingleMarchant) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        true,
                        findSingleMarchant,
                        200,
                        null,
                        "Marchant Retrive sucesfull"
                    )
                );
        }
        return res
            .status(404)
            .json(
                new ApiError(
                    false,
                    null,
                    400,
                    `Marchant Not Found !!`
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
                    `Get Single Marchant  Error:  ${error} !!`

                )
            );
    }
}

module.exports = { createMarchant, getAllMarchant, updateMarchant ,getSingleMarchant}