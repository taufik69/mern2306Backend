const mongoose = require("mongoose");
const timeOfferSchema = new mongoose.Schema({
  offerName: {
    type: String,
    required: true,
    trim: true,
  },
  offerDate: {
    type: Number,
    default: 1,
    required: true,
  },
});

module.exports = mongoose.model("timeOffer", timeOfferSchema);
