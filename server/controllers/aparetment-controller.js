const Apartment = require("../models/Apartment-model");
const Building = require("../models/Building-model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const login = async (req, res) => {
    const { mail, password } = req.body;

    if (!mail || !password) {
        return res.status(400).json({ message: "Must provide mail and password." });
    }

    try {
        const apartment = await Apartment.findOne({ mail: mail, is_active: true }).lean();
        if (!apartment) {
            return res.status(401).json({ message: "Apartment not found." });
        }

        const match = await bcrypt.compare(password, apartment.password);
        if (!match) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const allApartments = apartment.is_admin
            ? await Apartment.find({ building_id: apartment.building_id, is_active: true }).sort({ number: 1 })
            : null;

        const building = await Building.findById(apartment.building_id).lean();
        if (!building) {
            return res.status(404).json({ message: "Building not found." });
        }

        delete apartment.password;

        const accessToken = jwt.sign(apartment, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json({ token: accessToken, apartment, building, allApartments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};

const logUp = async (req, res) => {
    let newApartment = req.body;

    if (!newApartment.building_id || !newApartment.number || !newApartment.password || !newApartment.mail || !newApartment.last_name) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const duplicate = await Apartment.findOne({ mail: newApartment.mail, is_active: true }).lean();
        if (duplicate) {
            return res.status(401).json({ message: "Email already exists." });
        }

        newApartment.password = await bcrypt.hash(newApartment.password, 10);

        if (!newApartment.entered_date)
            newApartment.entered_date = new Date();

        let apartment = await Apartment.create(newApartment);

        const allApartments = newApartment.is_admin
            ? await Apartment.find({ building_id: newApartment.building_id, is_active: true }).sort({ number: 1 })
            : null;

        const apartmentPayload = apartment.toObject();
        delete apartmentPayload.password;

        const accessToken = jwt.sign(apartmentPayload, process.env.ACCESS_TOKEN_SECRET);

        return res.status(201).json({ token: accessToken, apartment: apartmentPayload, allApartments });
    } catch (error) {
        return res.status(500).json({ message: "Server error during signup." });
    }
};

const sendApartmentEmail = async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ message: "Missing email parameters." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'yourhomecontrol2025@gmail.com',
                pass: process.env.MAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: '"מערכת הבית שלך 🏠" <maddison53@ethereal.email>',
            to,
            subject,
            html: `<div dir="rtl">${text}</div>`
        });

        res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email." });
    }
};

const apartmentLeft = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Missing apartment ID." });
    }

    try {
        const apartment = await Apartment.findById(id);
        if (!apartment || !apartment.is_active) {
            return res.status(404).json({ message: "Apartment not found or already inactive." });
        }

        apartment.is_active = false;
        await apartment.save();

        res.status(200).json({ message: "Apartment deactivated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during apartment deactivation." });
    }
};

const updateApartment = async (req, res) => {
    const { id } = req.params;
    const { last_name, floor, entrance } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Missing apartment ID." });
    }

    try {
        const apartment = await Apartment.findById(id);
        if (!apartment || !apartment.is_active) {
            return res.status(404).json({ message: "Apartment not found or inactive." });
        }

        apartment.last_name = last_name
        apartment.floor = floor
        apartment.entrance = entrance

        await apartment.save();

        const updatedApartment = apartment.toObject();
        delete updatedApartment.password;

        res.json({ message: "Apartment updated successfully.", apartment: updatedApartment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during apartment update." });
    }
};

module.exports = {
    login,
    logUp,
    sendApartmentEmail,
    apartmentLeft,
    updateApartment
};
