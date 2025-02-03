const Expenses = require("../models/Expense-model")
const Building = require("../models/Building-model")
const Apartment = require("../models/Apartment-model")

const add = async (req, res) => {
    const addExpense = req.body
    
    //validation
    if (!addExpense.building_id || !addExpense.admin_id || !addExpense.date || !addExpense.type || !addExpense.sum)
        return res.status(400).send("insert required argomets")
    
    // const build = await Building.findById(addExpense.building_id).lean()
    // if(!build)
    //     return res.status(405).send("building id is worng")
    // const apartment = await Apartment.findById(addExpense.admin_id).lean()
    // if(!apartment)
    //     return res.status(405).send("apartment_id is worng")

    //create
    const newExpense = await Expenses.create(addExpense)
    if (!newExpense)
        return res.status(401).res("failed")
    //return
    try {
        const allExpenses = await Expenses.find({building_id:addExpense.building_id})
        return res.status(201).json(allExpenses)
    }
    catch (e) {
        return res.status(402).send(e)
    }

}

const get = async (req, res) => {
    const { id } = req.query
    
    try {
        const allExpenses = await Expenses.find({building_id:id})
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