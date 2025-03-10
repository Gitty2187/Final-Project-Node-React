const Expenses = require("../models/Expense-model")
const Building = require("../models/Building-model")
const Apartment = require("../models/Apartment-model")

const add = async (req, res) => {
    const add = req.body
    //validation
    if ( !add.date || !add.type || !add.sum)
        return res.status(400).send("insert required argomets")
    
    const addExpense = {...add, building_id:req.admin.building_id,admin_id:req.admin._id,admin_last_name:req.admin.last_name}
    
    // const build = await Building.findById(addExpense.building_id).lean()
    // if(!build)
    //     return res.status(405).send("building id is worng")
    // const apartment = await Apartment.findById(addExpense.admin_id).lean()
    // if(!apartment)
    //     return res.status(405).send("apartment_id is worng")

    const newExpense = await Expenses.create(addExpense)
    if (!newExpense)
        return res.status(401).res("failed")
    
    try {
        //const allExpenses = await Expenses.find({building_id:req.admin.building_id})
        return res.status(201).json([newExpense])
    }
    catch (e) {
        return res.status(402).send(e)
    }

}

const get = async (req, res) => {
    console.log(req.apartment);
    try {
        const allExpenses = await Expenses.find({building_id:req.apartment.building_id})
        return res.status(201).json(allExpenses)
    }
    catch (e) {
        return res.status(402).send(e)
    }
}

const deleteEx = async (req, res) => {
    const {_id} = req.query
    
    //validation
    if(!_id)
        return res.status(400).send("insert id")

    //delete
    const del = await Expenses.deleteOne({_id:_id})
    if(!del)
        return res.status(401).send("expenses not found")
    
    //return
    try {
        const allExpenses = await Expenses.find()
        return res.status(201).json(allExpenses)
    }
    catch (e) {
        return res.status(402).send(e)
    }
}

module.exports = { add, get,deleteEx }