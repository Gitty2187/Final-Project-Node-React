const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BuildingSchema = new Schema({
    address: {
        type:String,
        required:true,
     },
     password:{
        type:String,
        required:true,
     //   indexedDB:true
     },
     minimum_apartment_number:{
        type:Number,
        required:true
     },
     apartments_sum:{
        type:Number,
        required:true,
        min:1
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Building", BuildingSchema)
