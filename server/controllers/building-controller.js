const Building = require("../models/Building-model");
const Apartment = require("../models/Apartment-model");

const getBuilding = async (req, res) => {
    const { password } = req.params;

    if (!password) {
        return res.status(400).json({ message: "חובה לספק סיסמה." });
    }

    try {
        const building = await Building.findOne({ password: password }).lean();

        if (!building) {
            return res.status(404).json({ message: "הבניין לא קיים." });
        }

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

        return res.status(200).json({ building, apartmentsNull });
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

        const building = await Building.create({
            address,
            password: randomPass,
            minimum_apartment_number,
            apartments_sum
        });

        if (!building) {
            return res.status(500).json({ message: "נכשלה יצירת בניין חדש." });
        }

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

        return res.status(201).json({ building, apartmentsNull });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "אירעה שגיאה בעת הוספת בניין חדש." });
    }
};

module.exports = { getBuilding, addBuilding };
