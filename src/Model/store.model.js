const mongoose = require('mongoose');
const { Schema } = mongoose;

const storeSchema = new Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Email Required "]
    }
    ,
    phoneNumber: {
        type: Number,
        trim: true,
        required: [true, "phoneNumber Required "]
    },
    storename: {
        type: String,
        trim: true,
        required: [true, "Store Name  Required "]
    },
    adress: {
        type: String,
        trim: true,
    },
    users: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    products: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    status: {
        type: String,
        enum: ["pending", "Rejected", "Approved"],
        default: "pending"
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('store', storeSchema);