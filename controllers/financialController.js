// src/controllers/financialController.js
const Financial = require('../models/financialMaster');

const createFinancial = async (req, res) => {
    try {
        const newFinancial = req.body;

        // Basic validation: Check if all required fields are provided
        if (!newFinancial.financialYear || !newFinancial.financialYearDesc || !newFinancial.status) {
            return res.status(400).json({ error: 'Financial year, description, and status are required' });
        }

        const financial = new Financial(newFinancial);
        await financial.save();
        res.status(201).json({ message: 'Financial entry created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const getFinancials = async (req, res) => {
    try {
        const financials = await Financial.find();
        res.json({ financials });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const updateInvestmentTypeToActual = async (req, res) => {
    try {
        const { authorization } = req.headers;

        // Check if the authorization header is valid (assuming "Admin" is the valid admin token)
        if (authorization !== 'Admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find the object with status "open" and update its investmentType to "actual"
        await Financial.updateOne({ status: "Open" }, { $set: { investmentType: "actual" } });

        res.status(200).json({ message: 'Investment type updated to "actual"' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};


module.exports = {
    createFinancial,
    getFinancials,
    updateInvestmentTypeToActual,
};
