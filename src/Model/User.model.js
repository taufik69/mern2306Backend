const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    FirstName: {
      type: String,
      required: [true, "FirstName Missing !!"],
      trim: true,
      max: [25, "Max Name Size 25 Character "],
      min: [3, "Min Value 3 character"],
    },
    LastName: {
      type: String,
      trim: true,
      max: [15, "Max Name Size 15 Character "],
      min: [3, "Min Value 3 character"],
    },
    Email_Adress: {
      type: String,
      required: [true, "Email Missing !!"],
    },

    Telephone: {
      type: String,
    },
    Adress1: {
      type: String,
    },
    Adress2: {
      type: String,
    },
    City: {
      type: String,
    },
    PostCode: {
      type: Number,
      max: [4, "Invalid post Code max size 4 !!"],
      min: [4, "Invalid post Code min size 4 !!"],
    },
    Divison: {
      type: String,
    },
    District: {
      type: String,
    },
    Password: {
      type: String,
      required: true,
      trim: true,
    },
    OTP: {
      type: Number,
    },
    resetOTP: {
      type: Number,
    },
    userIsVerifid: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "merchant"],
      default: "user",
    },
    Token: {
      type: String,
    },
    avatar: {
      type: String,
    },
    cartitem: [{ type: Schema.Types.ObjectId, ref: "cart" }],
  },
  { timestamps: true }
);

const usermodel = mongoose.model("user", UserSchema);
module.exports = { usermodel };
