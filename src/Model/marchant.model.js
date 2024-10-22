const mongoose = require('mongoose');
const { Schema } = mongoose;

const marchant = new Schema({
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
    name: {
        type: String,
        trim: true,
    }
})