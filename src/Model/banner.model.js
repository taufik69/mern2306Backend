const mongoose = require('mongoose');
const {Schema , Types} = mongoose;

const bannerSchema =  new Schema ({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String ,
        required:true
    }

},{Timestamp:true})

module.exports = mongoose.model('banner' ,bannerSchema )