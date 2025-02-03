const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ExpensesSchema = new Schema({
    building_id: {
        type: mongoose.ObjectId,
        required: true
    },
    admin_id:{
        type: mongoose.ObjectId,
        required: true
    },
    admin_last_name:{
        type:String,
    },
    date: {
        type:Date,
        required:true,
     },
    type: {
        type: String,
        required: true,
    },
    sum: {
        type: Number,
        required: true
    },
    comment:{
       type:String,
       default:""
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Expenses ", ExpensesSchema)
