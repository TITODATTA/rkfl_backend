// src/controllers/transactionController.js
const Transaction = require('../models/transactionsMaster');

const createOrUpdateTransaction = async (req, res) => {
    try {
        const { employeeCode, section80C, section80D, section10, section24, section80CCD, finalActualSubmission, plant } = req.body;
        // Check if an entry with the provided employee code exists
        let transaction = await Transaction.findOne({ employeeCode });

        if (!transaction) {
            // If no entry exists, create a new one
            transaction = new Transaction({ employeeCode, section80C, section80D, section10, section24, section80CCD, finalActualSubmission, plant });
        } else {
            // If an entry exists, update the arrays with the new values
            if (section80C) transaction.section80C = section80C;
            if (section80D) transaction.section80D = section80D;
            if (section10) transaction.section10 = section10;
            if (section24) transaction.section24 = section24;
            if (section80CCD) transaction.section80CCD = section80CCD;
            if (finalActualSubmission) transaction.finalActualSubmission = finalActualSubmission;
            if (plant) transaction.plant = plant;
        }

        // Save the transaction
        await transaction.save();

        res.status(201).json({ message: 'Transaction created or updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const getTransactionByEmployeeCode = async (req, res) => {
    try {
        const { employeeCode } = req.body; // Extract employee code from URL parameter

        // Find the transaction by employee code
        const transaction = await Transaction.findOne({ employeeCode });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction found', data: transaction });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const getAllTransactionData = async (req, res) => {
    try {
        const { authorization } = req.headers;

        if (authorization !== 'Admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Retrieve all transactions from the database
        const transactions = await Transaction.find();

        // Initialize arrays for each section
        const section80C = [];
        const section80D = [];
        const section10 = [];
        const section24 = [];
        const section80CCD = [];

        // Iterate through the transactions and categorize the data
        transactions.forEach(transaction => {
            section80C.push(...transaction.section80C);
            section80D.push(...transaction.section80D);
            section10.push(...transaction.section10);
            section24.push(...transaction.section24);
            section80CCD.push(...transaction.section80CCD);
        });

        // Create an object with the categorized data
        const categorizedData = {
            section80C,
            section80D,
            section10,
            section24,
            section80CCD,
        };

        res.status(200).json({ message: 'Transaction data retrieved', data: categorizedData });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const combineEmployeeArrays = async (req, res) => {
    try {
        // Retrieve all transactions from the database
        const { plant } = req.body;

        // Retrieve all transactions from the database that match the specified "plant" value
        const transactions = await Transaction.find({ plant });
        // Initialize an array to combine all employee arrays
        const combinedArrays = [];

        // Iterate through the transactions and combine the arrays
        transactions.forEach(transaction => {
            combinedArrays.push(...transaction.section80C);
            combinedArrays.push(...transaction.section80D);
            combinedArrays.push(...transaction.section10);
            combinedArrays.push(...transaction.section24);
            combinedArrays.push(...transaction.section80CCD);
        });

        res.status(200).json({ message: 'Combined arrays retrieved', data: combinedArrays });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const updateTransactionObject = async (req, res) => {
    try {
        const { employeeCode, sectionArray, objectId, isEdit, status, accountantsComments } = req.body;

        // Find the transaction by employee code
        const transaction = await Transaction.findOne({ employeeCode });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Determine which section array to update based on the provided sectionArray value
        let arrayToUpdate;
        switch (sectionArray) {
            case 'Section 80C':
                arrayToUpdate = transaction.section80C;
                break;
            case 'Section 80D':
                arrayToUpdate = transaction.section80D;
                break;
            case 'Section 10':
                arrayToUpdate = transaction.section10;
                break;
            case 'Section 24':
                arrayToUpdate = transaction.section24;
                break;
            case 'Section 80CCD':
                arrayToUpdate = transaction.section80CCD;
                break;
            default:
                return res.status(400).json({ error: 'Invalid sectionArray value' });
        }

        // Find the object within the selected section array by object ID
        const objectToUpdate = arrayToUpdate.find(obj => obj.uniqueId.toString() === objectId);

        if (!objectToUpdate) {
            return res.status(404).json({ error: 'Object not found in the selected section array' });
        }

        const updatedObject = {
            ...objectToUpdate,
            isEdit: isEdit,
            status: status,
            accountantsComments: accountantsComments,
        };

        // Push the updated object back to the section array
        arrayToUpdate[arrayToUpdate.indexOf(objectToUpdate)] = updatedObject;

        // Save the updated transaction
        await transaction.save();

        res.status(200).json({ message: 'Object updated successfully', data: objectToUpdate });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// src/controllers/transactionController.js

const updateObjectStatusAndResubmission = async (req, res) => {
    try {
        const { employeeCode, sectionArray, objectToUpdate } = req.body;

        // Find the transaction by employee code (employeeCode)
        const transaction = await Transaction.findOne({ employeeCode });

        if (!transaction) {
            return res.status(404).json({ error: 'No employee found' });
        }

        // Determine which section array to update based on the provided sectionArray value
        let arrayToUpdate;
        switch (sectionArray) {
            case 'Section 80C':
                arrayToUpdate = transaction.section80C;
                break;
            case 'Section 80D':
                arrayToUpdate = transaction.section80D;
                break;
            case 'Section 10':
                arrayToUpdate = transaction.section10;
                break;
            case 'Section 24':
                arrayToUpdate = transaction.section24;
                break;
            case 'Section 80CCD':
                arrayToUpdate = transaction.section80CCD;
                break;
            default:
                return res.status(400).json({ error: 'Invalid sectionArray value' });
        }

        // Find the object within the selected section array by object ID
        const existingObjectIndex = arrayToUpdate.findIndex(obj => obj.uniqueId.toString() === objectToUpdate.uniqueId);

        if (existingObjectIndex === -1) {
            return res.status(404).json({ error: 'Object not found in the selected section array' });
        }

        // Update the object's status and resubmission counter with values from the provided object
        arrayToUpdate[existingObjectIndex] = objectToUpdate;
        arrayToUpdate[existingObjectIndex].status = "Resubmitted";
        arrayToUpdate[existingObjectIndex].isEdit = false;
        arrayToUpdate[existingObjectIndex].accountantsComments = "";
        arrayToUpdate[existingObjectIndex].resubmissionCounter = objectToUpdate.resubmissionCounter ? objectToUpdate.resubmissionCounter + 1 : 1

        // Save the updated transaction
        await transaction.save();
        res.status(200).json({ message: 'Object updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};





module.exports = {
    createOrUpdateTransaction,
    getTransactionByEmployeeCode,
    getAllTransactionData,
    combineEmployeeArrays,
    updateTransactionObject,
    updateObjectStatusAndResubmission,
};
