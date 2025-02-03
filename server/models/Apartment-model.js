const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Apartments_sum = require("./Apartments_sum-model")

const ApartmentSchema = new Schema({
    building_id: {
        type: mongoose.ObjectId,
        required:true
     },
     number:{
        type:Number,
        required:true,
        min:0
     },
    password:{
        type:String,
        required:true
     },
    mail:{
        type:String,
        required:true,
        unique:true
     },
    last_name:{
        type:String,
        required:true
    },
    entered_date:{
        type:Date,
        required:true
    },
    is_admin:{
        type:Boolean,
        default:false
    },
    area:{
        type:Number
    },
    floor:{
        type:Number
    },
    entrance:{
        type:String
    },
    is_active:{
        type:Boolean,
        default:true
    },
    balance:{
        type:Number,
        default:0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Apartment", ApartmentSchema)
