const Building = require("../models/Building-model");
const Apartment = require("../models/Apartment-model");

const getBuilding = async (req, res) => {
    const { password } = req.params
    
    //check validation
    if (!password)
        return res.status(400).send("password not found")

    //get building
    const building = await Building.findOne({ password: password }).lean()

    
    if (!building)
        return res.status(400).send("building not exist")

    //declare apartmentsNull
    let apartmentsNull = []
    for (let i = 0; i < building.apartments_sum; i++) {
        apartmentsNull.push(building.minimum_apartment_number + i)
    }
    const existingApartmentNumbers = await Apartment.find({ building_id: building._id,is_active:true }, { number: 1 }).lean()
    
    apartmentsNull = apartmentsNull.filter(a => !existingApartmentNumbers.some(existing => existing.number === a));

    return res.json({building, apartmentsNull})
}

const addBuilding = async (req, res) => {
    const { address, minimum_apartment_number, apartments_sum } = req.body
    
    //declare password uniqe
    let randomPass = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    let duplicate = await Building.find({ password: randomPass })
    while(duplicate.length > 0)
    {
        randomPass = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
        duplicate = await Building.find({ password: randomPass })
    }

    //create
    const building = await Building.create({
        address: address,
        password: randomPass,
        minimum_apartment_number :minimum_apartment_number,
        apartments_sum:apartments_sum
    })
    if(!building)
        return res.status(400).send("failed add build")
    let apartmentsNull = []
    for (let i = 0; i < building.apartments_sum; i++) {
        apartmentsNull.push(building.minimum_apartment_number + i)
    }
    const existingApartmentNumbers = await Apartment.find({ building_id: building._id,is_active:true }, { number: 1 }).lean()
    apartmentsNull = apartmentsNull.filter(a => !existingApartmentNumbers.includes(a));
    return res.json({building, apartmentsNull})
}

module.exports = { getBuilding, addBuilding }