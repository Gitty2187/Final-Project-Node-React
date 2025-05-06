const Apartment_Payment = require("../models/Aparetment_payment-model")
const Apartment = require("../models/Apartment-model")
const Apartment_sum_one = require("../models/Apartment_sum_one-model")

const add = async (req, res) => {
    const { apartment_id, date, sum, comment, payment_method } = req.body

    if (!apartment_id || !date || !sum || !payment_method)
        return res.status(401).send("must insert required params")

    try {
        const payment = await Apartment_Payment.create({
            admin_id: req.admin._id,
            date,
            sum,
            comment,
            apartment_id,
            payment_method,
            admin_last_name: req.admin.last_name
        });

        let apartment = await Apartment.findById(apartment_id).exec();
        if (!apartment) {
            return res.status(404).json({ message: "הדירה לא נמצאה" });
        }

        apartment.debt = apartment.debt - payment.sum;
        let sumPay = payment.sum;
            const debts = await Apartment_sum_one.find({ apartment: apartment_id }).populate('apartment_sum', 'sum').sort({ date: 1 });
            for (const d of debts) {
                if (d.paid < d.apartment_sum.sum) {
                    const remainingDebt = d.apartment_sum.sum - d.paid;
                    if (remainingDebt <= sumPay) {
                        sumPay -=  remainingDebt;
                        d.paid = d.apartment_sum.sum;
                    } else {
                        d.paid += sumPay;
                        sumPay = 0;
                    }
                    await d.save();
                    if (sumPay === 0) break;
                }
            }
        await apartment.save();

        // const allApartments = await Apartment.find({ building_id: req.admin.building_id, is_active: true }).sort({ number: 1 });
        return res.status(200).json({ apartment });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "אירעה שגיאה בעת שמירת התשלום" });
    }
}

const getById = async (req, res) => {
    try {
        const payments = await Apartment_Payment.find({ apartment_id: req.apartment._id }).lean().sort({ date: 1 });
        if (!payments) {
            return res.status(404).json({ message: "לא נמצאו תשלומים" });
        }
        return res.status(200).json(payments);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "אירעה שגיאה בעת שליפת התשלומים" });
    }
}

module.exports = { add, getById };
