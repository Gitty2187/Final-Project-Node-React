const Apartment = require("../models/Apartment-model");
const Building = require("../models/Building-model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const login = async (req, res) => {
    const { mail, password } = req.query

    //validation
    if (!mail || !password)
        return res.status(401).send("must insert mail & passwowrd")

    // Find the apartment by email
    const apartment = await Apartment.findOne({ mail: mail ,is_active:true}).lean()
    if (!apartment)
        return res.status(400).send("apartment does not exist")


    // Compare passwords
    const match = await bcrypt.compare(password, apartment.password)
    if (!match)
        return res.status(400).send("apartment not exist")

    //if manager return also all the apartments
    const allApartments = apartment.is_admin ? await Apartment.find({ building_id: apartment.building_id, is_active: true }).sort({ number: 1 }) : null

    const building = await Building.findOne({ _id: apartment.building_id })

    //return token
    try {
        delete apartment.password;
        const accessToken = jwt.sign(apartment, process.env.ACCESS_TOKEN_SECRET);
        res.json({ token: accessToken, apartment, building, allApartments })
    }
    catch (e) {
        return res.status(404).send("not success")
    }
}


const logUp = async (req, res) => {
    let newApartment = req.body

    // Check for required fields
    if (!newApartment.building_id || !newApartment.number || !newApartment.password || !newApartment.mail || !newApartment.last_name) {
        return res.status(401).json({ message: 'insert fields required' })
    }

    // Check for duplicate email
    const duplicate = await Apartment.findOne({ mail: newApartment.mail,is_active:true }).lean()
    if (duplicate) {
        return res.status(409).json({ error: "Email already exists." });
    }

    // Hashing the password
    const hashedPwd = await bcrypt.hash(newApartment.password, 10)
    newApartment.password = hashedPwd

    // Set entered_date if not provided
    if (!newApartment.entered_date)
        newApartment.entered_date = new Date()

    //if manager return also all the apartments
    const allApartments = newApartment.is_admin ? await Apartment.find({ building_id: newApartment.building_id, is_active: true }).sort({ number: 1 }) : null

    // Create the new apartment
    try {
        let apartment = await Apartment.create(newApartment);
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

module.exports = { login, logUp, sendApartmentEmail,apartmentLeft }
