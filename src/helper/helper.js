const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bcryptPassword = async (password) => {
  try {
    const hasPasword = await bcrypt.hash(password, 10);
    return hasPasword;
  } catch (error) {
    console.log(error);
  }
};

const generateAccesToken = async (Email_Adress, Telephone) => {
  const AccessToken = await jwt.sign(
    {
      Email_Adress,
      Telephone,
    },
    process.env.ACCCESS_TOKEN_SCCRECT,
    { expiresIn: process.env.ACCCESS_TOKEN_EXPIRAY }
  );

  return AccessToken;
};

module.exports = { bcryptPassword, generateAccesToken };
