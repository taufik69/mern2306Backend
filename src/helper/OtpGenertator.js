const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");
const MakeOtp = async () => {
  return aleaRNGFactory(new Date()).uInt32().toString().slice(0, 4);
};

module.exports = { MakeOtp };
