const Notice = require("../models/Notice-model");

const add = async (req, res) => {
    const { title, content, endDate} = req.body;

    if (!title || !content) {
        return res.status(400).send("Missing required fields: title and content");
    }

    try {
        const newNotice = await Notice.create({
            title,
            content,
            publisher: req.apartment._id,
            building_id: req.apartment.building_id,
            endDate
        });

        const populatedNotice = await newNotice.populate('publisher', 'last_name _id');

        return res.status(201).json(populatedNotice);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Failed to create notice due to server error");
    }
};

const update = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).send("Missing notice ID");
    }

    try {
        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).send("Notice not found");
        }

        if (!notice.publisher.equals(req.apartment._id)) {
            return res.status(403).send("You are not authorized to update this notice");
        }

        notice.title = title;
        notice.content = content;

        await notice.save();

        const populatedNotice = await notice.populate('publisher', 'last_name _id');

        return res.status(200).json({ message: "Notice updated successfully", notice: populatedNotice });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error while updating notice");
    }
};

const deleteNotice = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send("Missing notice ID");
    }

    try {
        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).send("Notice not found");
        }

        if (!notice.publisher.equals(req.apartment._id)) {
            return res.status(403).send("You are not authorized to delete this notice");
        }

        await notice.deleteOne();
        return res.status(200).send("Notice deleted successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error while deleting notice");
    }
};

const getNoticesByBuilding = async (req, res) => {
    const apartment = req.apartment;

    if (!apartment || !apartment.building_id) {
        return res.status(400).send("Building ID is missing from the request.");
    }

    const buildingId = apartment.building_id;

    try {
        const notices = await Notice.find({
            building_id: buildingId,
            endDate: { $gte: new Date() } 
        })
        .populate('publisher', 'last_name _id')
        .sort({ createdAt: -1 });

        return res.status(200).json(notices);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error while fetching notices");
    }
};

module.exports = {
    add,
    update,
    deleteNotice,
    getNoticesByBuilding
};
