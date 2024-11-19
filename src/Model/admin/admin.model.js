const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const adminSchema = new Schema({
    usernameOrEmail: {
        type: String,
        trim: true,
        required: [true, "UsernameOrEmail requird"]
    },
    password: {
        type: String,
        trim: true
    },
    image: {
        type: String
    }
})

const adminModel = mongoose.model('admin', adminSchema);
module.exports = adminModel 