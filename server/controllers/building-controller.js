const Building = require("../models/Building-model");
const Apartment = require("../models/Apartment-model");
const Apartments_sum_one = require("../models/Apartment_sum_one-model");
const Expenses = require("../models/Expense-model");


const getBuilding = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "חובה לספק סיסמה." });
    }

    try {
        const building = await Building.findOne({ password: password }).lean();

        if (!building) {
            return res.status(401).json({ message: "הבניין לא קיים." });
        }

        let apartmentsNull = [];
        for (let i = 0; i < building.apartments_sum; i++) {
            apartmentsNull.push(building.minimum_apartment_number + i);
        }

        const income = await Apartments_sum_one.find()
        .populate({
            path: "apartment_sum",
            select: "building_id sum",
        })
        .then((apartments) => {
            const filteredApartments = apartments.filter(
                (apartment) => apartment.apartment_sum?.building_id.toString() === building._id.toString()
            );

            const totalPaid = filteredApartments.reduce((sum, apartment) => sum + apartment.apartment_sum.sum, 0);

            return totalPaid;
        });


        const expenses = await Expenses.aggregate([
            { $match: { building_id: building._id } },
            { $group: { _id: null, total: { $sum: "$sum" } } }
        ]);

        const balance =
            (income.length > 0 ? income[0].total : 0) -
            (expenses.length > 0 ? expenses[0].total : 0);

        const buildingWithBalance = { ...building, balance };

        const existingApartmentNumbers = await Apartment.find(
            { building_id: building._id, is_active: true },
            { number: 1 }
        ).lean();

        apartmentsNull = apartmentsNull.filter(
            a => !existingApartmentNumbers.some(existing => existing.number === a)
        );

        return res.status(200).json({ building: buildingWithBalance, apartmentsNull });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "אירעה שגיאה בעת שליפת הבניין." });
    }
};

const addBuilding = async (req, res) => {
    const { address, minimum_apartment_number, apartments_sum } = req.body;

    if (!address || minimum_apartment_number == null || apartments_sum == null) {
        return res.status(400).json({ message: "חובה למלא את כל השדות הנדרשים." });
    }

    try {
        let randomPass;
        let duplicate;

        do {
            randomPass = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            duplicate = await Building.findOne({ password: randomPass });
        } while (duplicate);

        let building = await Building.create({
            address,
            password: randomPass,
            minimum_apartment_number,
            apartments_sum
        });

        if (!building) {
            return res.status(500).json({ message: "נכשלה יצירת בניין חדש." });
        }

        const balance = 0;
        const buildingWithBalance = { ...building.toObject?.(), balance }; // במידה ו-building מגיע ממונגו

        let apartmentsNull = [];
        for (let i = 0; i < building.apartments_sum; i++) {
            apartmentsNull.push(building.minimum_apartment_number + i);
        }

        const existingApartmentNumbers = await Apartment.find(
            { building_id: building._id, is_active: true },
            { number: 1 }
        ).lean();

        apartmentsNull = apartmentsNull.filter(
            a => !existingApartmentNumbers.some(existing => existing.number === a)
        );

        return res.status(201).json({ building: buildingWithBalance, apartmentsNull });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "אירעה שגיאה בעת הוספת בניין חדש." });
    }
};

module.exports = { getBuilding, addBuilding };
