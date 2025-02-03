const mongoose = require("mongoose")
const Schema = mongoose.Schema

//const Apartment_sum = require('./Apartments_sum-model')

const Apartments_sum_oneSchema = new Schema({
    apartment_sum:{
        type: mongoose.ObjectId,
        ref: "Apartment_sum"
    },
    apartment:{
        type: mongoose.ObjectId,
        ref: 'Apartment'
    },
     paid:{
         type:Number,
         default:0
     },
     comment:{
        type:String,
        default:""
     }
}, {
    timestamps: true
})

module.exports = mongoose.model("Apartments_sum_one", Apartments_sum_oneSchema)
