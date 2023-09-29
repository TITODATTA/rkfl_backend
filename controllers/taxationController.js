const Taxation = require('../models/taxationMaster');

// src/controllers/taxationController.js

const checkTaxationData = async (req, res) => {
    try {
        const { employeeCode, financialYear } = req.body;

        // Find the taxation record for the given employeeCode
        const taxationRecord = await Taxation.findOne({ employeeCode });

        if (!taxationRecord) {
            return res.status(200).json({ message: 'Employee not found', newEntry: true });
        }

        // Check if the financialYear matches
        if (taxationRecord.financialYear !== financialYear) {
            return res.status(200).json({ message: 'No data as financial year is different', newEntry: true });
        }

        res.status(200).json({ message: 'Data exists for the provided employeeCode and financial year', data: taxationRecord, newEntry: false });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const createTaxationRecord = async (req, res) => {
    try {
        const { employeeCode, financialYear, taxOption } = req.body;

        // Validate required fields
        if (!employeeCode || !financialYear || !taxOption) {
            return res.status(400).json({ error: 'Employee code, financial year, and tax option are required' });
        }

        // Check if a record with the same employeeCode and financialYear already exists
        const existingRecord = await Taxation.findOne({ employeeCode, financialYear });

        if (existingRecord) {
            return res.status(409).json({ error: 'Record already exists for this employee and financial year' });
        }

        // Create a new taxation record
        const taxationRecord = new Taxation({ employeeCode, financialYear, taxOption });
        await taxationRecord.save();

        res.status(201).json({ message: 'Taxation record created successfully', data: taxationRecord });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    checkTaxationData,
    createTaxationRecord
};
