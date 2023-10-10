const Taxation = require('../models/taxationMaster');

// src/controllers/taxationController.js

const checkTaxationData = async (req, res) => {
    try {
        const { employeeCode, financialYear } = req.body;

        // Find the taxation record for the given employeeCode
        const taxationRecord = await Taxation.findOne({ employeeCode, financialYear });

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
        const existingRecord = await Taxation.findOne({ employeeCode });

        if (existingRecord) {
            if (existingRecord.financialYear !== financialYear) {
                const taxationRecord = new Taxation({ employeeCode, financialYear, taxOption });
                await taxationRecord.save();
                res.status(201).json({ message: 'Taxation record created successfully', data: taxationRecord });
            }
            // return res.status(409).json({ error: 'Record already exists for this employee and financial year' });
        }
        else {
            const taxationRecord = new Taxation({ employeeCode, financialYear, taxOption });
            await taxationRecord.save();
            res.status(201).json({ message: 'Taxation record created successfully', data: taxationRecord });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};


const copyTaxationRecords = async (req, res) => {
    try {
        const { financialYear } = req.body;

        // Validate the new financial year
        if (!financialYear) {
            return res.status(400).json({ error: 'Financial year is required' });
        }

        // Find all existing taxation records
        const existingRecords = await Taxation.find();

        if (!existingRecords || existingRecords.length === 0) {
            return res.status(404).json({ error: 'No existing records found' });
        }

        const newRecords = existingRecords.map(record => ({
            ...record.toObject(), // Convert to plain JavaScript object
            _id: new Taxation().id, // Create a new _id
            financialYear: financialYear
        }));

        // Insert the new copies into the database
        const insertedRecords = await Taxation.insertMany(newRecords);

        res.status(201).json({ message: 'Taxation records copied successfully', data: insertedRecords });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
        console.log(error)
    }
};

const deleteRecordsByFinancialYear = async (req, res) => {
    try {
        // Define the financial year to delete (e.g., 2024)
        const { financialYear } = req.query;
        if (!financialYear) {
            return res.status(400).json({ error: 'Financial year is required' });
        }

        // Find and delete records with the specified financial year
        const deletedRecords = await Taxation.deleteMany({ financialYear: financialYear });

        res.status(200).json({ message: `Deleted records for financial year ${financialYear}`, data: deletedRecords });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = {
    checkTaxationData,
    createTaxationRecord,
    copyTaxationRecords,
    deleteRecordsByFinancialYear
};
