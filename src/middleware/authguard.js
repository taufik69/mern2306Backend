const { ApiError } = require("../utils/ApiError");
const jwt = require('jsonwebtoken');
const authGurad = async (req, res, next) => {
    try {
        const { cookie, authorization } = req.headers;
        const removeBearer = authorization?.split('Bearer')[1]
        const token = removeBearer?.split('@')[1];
        const cookiesToken = cookie?.split('=')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.ACCCESS_TOKEN_SCCRECT);
            if (decoded) {
                next()
            }

        } else if (cookiesToken) {
            const decoded = jwt.verify(cookiesToken, process.env.ACCCESS_TOKEN_SCCRECT);
            if (decoded) {
                next()
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
                    `AuthGuard middleware Error:  ${error} !!`
                )
            );
    }
}

module.exports = { authGurad }