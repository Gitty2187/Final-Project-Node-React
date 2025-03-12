const Aparetment_Payment = require("../models/Aparetment_payment-model")
const Apartment = require("../models/Apartment-model")
const Apartment_sum_one = require("../models/Apartment_sum_one-model")

const add = async (req, res) => {
    const { apartment_id, date, sum, comment, payment_method} = req.body

    if (!apartment_id || !date || !sum  || !payment_method)
        return res.status(401).send("must insert required params")

    try {
            const payment = await Aparetment_Payment.create({ 
                admin_id:req.admin._id, date, sum, comment,apartment_id,payment_method,admin_last_name:req.admin.last_name})
            let apartment = await Apartment.findById(apartment_id).exec()
            console.log("apartment: "+ apartment);
            apartment.balance = apartment.balance-payment.sum
            if (apartment.balance > 0)
                {
                    const debts = Apartment_sum_one.find({apartment_id:apartment_id}).sort({date:1});
                    debts.forEach(d => {
                        if(d.paid < d.sum){
                            if(d.sum - d.paid < apartment.balance){
                                apartment.balance = apartment.balance-(d.sum - d.paid);
                                d.paid = d.sum;
                            }
                            else{
                                d.paid = d.paid + apartment.balance;
                                apartment.balance = 0; 
                            }
                            d.save()
                        }
                   });
                }
                await apartment.save()
        
            const allApartments = await Apartment.find({ building_id: req.admin.building_id,is_active:true }).sort({ number: 1 })
            return res.json({ allApartments})
        }
        catch (e) {
            console.log(e);
            return res.status(403).send("faild")
        }
}


const getById = async (req,res) => {
    try{
        const payments = await Aparetment_Payment.find({ apartment_id:req.apartment._id }).lean().sort({date:1});
        return res.status(200).json(payments)
    }catch(e){
        // console.log(e);
        return res.status(400).send("Faild")
    }
}
module.exports = {add,getById}