const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Aparetment_paymentSchema = new Schema({
   apartment_id: {
      type: mongoose.ObjectId,
      required: true
   },
   admin_id: {
      type: mongoose.ObjectId,
      required: true
   },
   admin_last_name:{
      type:String,
      required:true
   },
   date: {
      type: Date,
      required: true,
   },
   sum: {
      type: Number,
      required: true,
   },
   comment: {
      type: String,
      default:""
   },
   payment_method: {
      type: String,
      enum: ['מזומן', 'צק']
   }
}, {
   timestamps: true
})

module.exports = mongoose.model("Aparetment_Payment", Aparetment_paymentSchema)
