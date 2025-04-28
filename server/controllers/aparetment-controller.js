const Apartment = require("../models/Apartment-model");
const Building = require("../models/Building-model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const login = async (req, res) => {
    const { mail, password } = req.query

    if (!mail || !password)
        return res.status(401).send("must insert mail & passwowrd")

    const apartment = await Apartment.findOne({ mail: mail ,is_active:true}).lean()
    if (!apartment)
        return res.status(400).send("apartment does not exist")

    const match = await bcrypt.compare(password, apartment?.password)
    if (!match)
        return res.status(400).send("apartment not exist")

    const allApartments = apartment?.is_admin ? await Apartment.find({ building_id: apartment.building_id, is_active: true }).sort({ number: 1 }) : null

    const building = await Building.findOne({ _id: apartment?.building_id })
    
    try {
        delete apartment.password;
        delete building.password;
        const accessToken = jwt.sign(apartment, process.env.ACCESS_TOKEN_SECRET);
        res.json({ token: accessToken, apartment, building, allApartments })
    }
    catch (e) {
        return res.status(404).send("not success")
    }
}


const logUp = async (req, res) => {
    let newApartment = req.body
    console.log(newApartment);
    
    if (!newApartment.building_id || !newApartment.number || !newApartment.password || !newApartment.mail || !newApartment.last_name) {
        return res.status(401).json({ message: 'insert fields required' })
    }

    const duplicate = await Apartment.findOne({ mail: newApartment.mail,is_active:true }).lean()
    if (duplicate) {
        return res.status(409).json({ error: "Email already exists." });
    }

    const hashedPwd = await bcrypt.hash(newApartment.password, 10)
    newApartment.password = hashedPwd

    if (!newApartment.entered_date)
        newApartment.entered_date = new Date()


    try {
        let apartment = await Apartment.create(newApartment);
        const allApartments = newApartment.is_admin ? await Apartment.find({ building_id: newApartment.building_id, is_active: true }).sort({ number: 1 }) : null
        const apartmentPayload = apartment.toObject();
        delete apartmentPayload.password;
        const accessToken = jwt.sign(apartmentPayload, process.env.ACCESS_TOKEN_SECRET);
        return res.status(201).json({ token: accessToken, allApartments: allApartments, apartment: apartmentPayload });
    }
    catch (e) {
        console.log(e);
        return res.status(405).send("not successful")
    }
}


const sendApartmentEmail = async (req, res) => {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text)
        return res.status(400).send("Must insert valid")

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'y0504169427@gmail.com',
            pass: 'qyzwcvhjelxgtslj'
        }
    });

    // async function main() {
    try {
        await transporter.sendMail({
            from: '"מערכת הבית שלך 🏠" <maddison53@ethereal.email>',
            to,
            subject,
            // text,
            html: `<div dir="rtl">${text}</div>`
        });
        res.status(200).send('Email sent successfully');
    }

    // main().catch(console.error);

    catch (error) {
        res.status(400).send('Error sending email :' + error);
    }
};

const apartmentLeft = async (req, res) => {
    const {id} = req.body
    if (!id)
        return res.status(400).send("Must insert id");
    try {
        const apartment = await Apartment.findById(id).exec();
        if (!apartment)
            return res.status(400).send("Apartment not exist");

        apartment.is_active = false;
        await apartment.save()
        return res.status(200).send("Success!")
    }
    catch (e) {
        return res.status(400).send(e)
    }
}


const updateApartment = async (req, res) => {
    const { id } = req.params;
    const { last_name, area, floor, entrance } = req.body;

    if (!id) {
        return res.status(400).send("Missing apartment ID");
    }

    try {
        const apartment = await Apartment.findById(id);
        if (!apartment || !apartment.is_active) {
            return res.status(404).send("Apartment not found or inactive");
        }

        apartment.last_name = last_name;
        apartment.area = area;
        apartment.floor = floor;
        apartment.entrance = entrance;

        await apartment.save();

        const updatedApartment = apartment.toObject();
        delete updatedApartment.password; // לא מחזירים סיסמה

        return res.status(200).json({ message: "Apartment updated successfully", apartment: updatedApartment });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error while updating apartment");
    }
};

module.exports = {
    login,
    logUp,
    sendApartmentEmail,
    apartmentLeft,
    updateApartment
};


