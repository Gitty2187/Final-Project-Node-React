const Expenses = require("../models/Expense-model");

const add = async (req, res) => {
    const { date, type, sum } = req.body;

    if (!date || !type || !sum) {
        return res.status(400).json({ message: "חובה להכניס את כל הפרמטרים הנדרשים." });
    }

    const addExpense = {
        ...req.body,
        building_id: req.admin.building_id,
        admin_id: req.admin._id,
        admin_last_name: req.admin.last_name
    };

    try {
        const newExpense = await Expenses.create(addExpense);
        
        if (!newExpense) {
            return res.status(500).json({ message: "נכשל בהוספת הוצאה." });
        }

        return res.status(201).json([newExpense]);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "אירעה שגיאה בעת יצירת ההוצאה." });
    }
};

const get = async (req, res) => {
    try {
        const allExpenses = await Expenses.find({ building_id: req.apartment.building_id });

        if (!allExpenses) {
            return res.status(404).json({ message: "לא נמצאו הוצאות." });
        }

        return res.status(200).json(allExpenses);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "אירעה שגיאה בשאילתת הוצאות." });
    }
};

const deleteEx = async (req, res) => {
    const { _id } = req.query;

    // validation
    if (!_id) {
        return res.status(400).json({ message: "חובה לספק מזהה הוצאה למחיקה." });
    }

    try {
        const del = await Expenses.deleteOne({ _id });

        if (!del.deletedCount) {
            return res.status(404).json({ message: "ההוצאה לא נמצאה." });
        }

        const allExpenses = await Expenses.find({ building_id: req.admin.building_id });

        return res.status(200).json(allExpenses);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "אירעה שגיאה בעת מחיקת ההוצאה." });
    }
};

module.exports = { add, get, deleteEx };
