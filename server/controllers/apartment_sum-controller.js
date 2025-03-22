const Apartment = require("../models/Apartment-model")
const Apartment_sum_one = require("../models/Apartment_sum_one-model")
const Apartment_sum = require("../models/Apartments_sum-model")

const get_all = async (req, res) => {
    
    try {
        const all = await Apartment_sum.find({ building_id: req.admin.building_id,is_general:true})
        return res.json({all})
    }
    catch (e) {
        return res.status(402).send(e)
    }
}

const add = async (req, res) => {
    
    const { apartments_id, date,type, sum, comment ,is_general} = req.body
    let paid = 0
    
    if (!apartments_id || !date || !type || !sum)
        return res.status(401).send("must insert required params")

    try {
        const apartment_sum = await Apartment_sum.create({ admin_last_name:req.admin.last_name,
            admin_id:req.admin._id, date, type, sum, comment,building_id: req.admin.building_id ,is_general})
        for (let id of apartments_id) {
            let apartment = await Apartment.findById(id).exec()
            
            if (apartment.balance < 0)
            {
                if ((-apartment.balance) > apartment_sum.sum) {
                    paid = apartment_sum.sum
                }
                else {
                    paid = (-apartment.balance)
                }
            }
            apartment.balance = apartment.balance+apartment_sum.sum
            await apartment.save()
            const sum_one = await Apartment_sum_one.create({
                apartment_sum:apartment_sum._id,
                apartment:id,
                paid
            });
            
            if(!sum_one)
                res.status(400).send("faild")
        }
        const allApartments = await Apartment.find({ building_id: req.admin.building_id,is_active:true }).sort({ number: 1 })
        //const allApartments_sum = await Apartment_sum.find({ building_id: req.admin.building_id ,is_general:true})
        return res.json({ allApartments, new:[apartment_sum ]})
    }
    catch (e) {
        console.log(e);

        return res.status(403).send("faild")
    }

}

const getById = async (req, res) => {
   
    try {
        const payments = await Apartment_sum_one.find({ apartment: req.apartment._id })
            .populate('apartment_sum')
            // .exec();

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this apartment' });
        }

        const sortedPayments = payments.sort((a, b) => {
            return new Date(a.apartment_sum.date) - new Date(b.apartment_sum.date);
        });

        const result = sortedPayments.map(payment => ({
            paymentDetails: payment.apartment_sum,
            amountPaid: payment.paid,
            comment: payment.comment,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching payments.' });
    }
};


module.exports = { get_all, add,getById}