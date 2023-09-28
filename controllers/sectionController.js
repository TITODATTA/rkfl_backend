const { Section80C, Section80CCD, Section80D, Section10, Section24 } = require('../models/section');



const createSection80C = async (req, res) => {
    try {
        const newSection80CData = req.body;

        // Basic validation: Check if all required fields are provided
        if (!newSection80CData.subSectionCode || !newSection80CData.subSection) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const section80C = new Section80C(newSection80CData);
        await section80C.save();
        res.status(201).json({ message: 'Section 80C data created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const createSection80D = async (req, res) => {
    try {
        const newSection80DData = req.body;

        // Basic validation: Check if all required fields are provided
        if (!newSection80DData.subSectionCode || !newSection80DData.subSection) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const section80D = new Section80D(newSection80DData);
        await section80D.save();
        res.status(201).json({ message: 'Section 80D data created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const createSection10 = async (req, res) => {
    try {
        const newSection10 = req.body;

        // Basic validation: Check if all required fields are provided
        if (!newSection10.subSectionCode || !newSection10.subSection) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const section10 = new Section10(newSection10);
        await section10.save();
        res.status(201).json({ message: 'Section 10 data created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const createSection24 = async (req, res) => {
    try {
        const newSection24 = req.body;

        // Basic validation: Check if all required fields are provided
        if (!newSection24.subSectionCode || !newSection24.subSection) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const section24 = new Section24(newSection24);
        await section24.save();
        res.status(201).json({ message: 'Section 24 data created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const createSection80CCD = async (req, res) => {
    try {
        const newSection80CCD = req.body;

        // Basic validation: Check if all required fields are provided
        if (!newSection80CCD.subSectionCode || !newSection80CCD.subSection) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const section80CCD = new Section80CCD(newSection80CCD);
        await section80CCD.save();
        res.status(201).json({ message: 'Section 80CCD data created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const getSection80CData = async (req, res) => {
    try {
        const section80CData = await Section80C.find();
        res.status(200).json(section80CData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const getSection80DData = async (req, res) => {
    try {
        const section80DData = await Section80D.find();
        res.status(200).json(section80DData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const getSection10Data = async (req, res) => {
    try {
        const section10Data = await Section10.find();
        res.status(200).json(section10Data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const getSection24Data = async (req, res) => {
    try {
        const section24Data = await Section24.find();
        res.status(200).json(section24Data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const getSection80CCDData = async (req, res) => {
    try {
        const section80CCDData = await Section80CCD.find();
        res.status(200).json(section80CCDData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
module.exports = {
    createSection80C,
    getSection80CData,
    createSection80D,
    getSection80DData,
    createSection10,
    getSection10Data,
    createSection24,
    createSection80CCD,
    getSection80CCDData,
    getSection24Data
}