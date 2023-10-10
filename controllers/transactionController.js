// src/controllers/transactionController.js
const Transaction = require('../models/transactionsMaster');
const CombinedArrays = require('../models/combinedArrayMaster');

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
const combineAllEmployeeArrays = async (req, res) => {
    try {
        const transactions = await Transaction.find();

        // Initialize an array to store the specific data from the combined arrays
        const combinedData = [];
        transactions.forEach(transaction => {
            const combinedMap = new Map();
            const combinedMap2 = new Map();
            transaction.section80C.forEach(item => {
                const key = `${item.employeeCode}-${item.investmentCode}`;
                if (combinedMap.has(key)) {
                    // Add the investment to the existing entry
                    const existingEntry = combinedMap.get(key);
                    existingEntry.investment = (
                        parseInt(existingEntry.investment) + parseInt(item.investment)
                    ).toString();
                } else {
                    // Create a new entry
                    combinedMap.set(key, {
                        employeeCode: item.employeeCode,
                        financialYear: item.financialyear,
                        mainSection: item.mainSection,
                        investmentCode: item.investmentCode,
                        investment: item.investment,
                        adjustedInvestment: item.adjustedInvestment,
                        investmentType: item.investmentSchedule,
                        status: item.status || "",
                    });
                }

            });
            combinedData.push(...combinedMap.values());

            transaction.section80D.forEach(item => {
                const key = `${item.employeeCode}-${item.subSectionCode}-${item.division}`;
                if (combinedMap2.has(key)) {
                    // Add the investment to the existing entry
                    const existingEntry = combinedMap2.get(key);
                    existingEntry.investment = (
                        parseInt(existingEntry.investment) + parseInt(item.investment)
                    ).toString();
                } else {
                    // Create a new entry
                    combinedMap2.set(key, {
                        employeeCode: item.employeeCode,
                        financialYear: item.financialyear,
                        mainSection: item.mainSection,
                        subSectionCode: item.subSectionCode,
                        division: item.division,
                        investment: item.investment,
                        adjustedInvestment: item.adjustedInvestment,
                        investmentType: item.investmentSchedule,
                        status: item.status || "",
                    });
                }
            });
            combinedData.push(...combinedMap2.values());

            transaction.section10.forEach(item => {
                combinedData.push({
                    employeeCode: item.employeeCode,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    financialYear: item.financialyear,
                    mainSection: item.mainSection,
                    investment: item.investment,
                    adjustedInvestment: item.adjustedInvestment,
                    accommodation: item.accommodationType,
                    cityCategory: item.cityCategory,
                    pan: item.pan,
                    landLoardName: item.landLoardName,
                    landLoardAddress: item.landLoardAddress.length > 35 ? item.landLoardAddress.slice(0, 35) : item.landLoardAddress,
                    landLoardAddress1: item.landLoardAddress.length > 35 ? item.landLoardAddress.slice(35, 35 + 35) : "",
                    landLoardAddress2: item.landLoardAddress.length > 35 + 35 ? item.landLoardAddress.slice(35 + 35) : "",
                    investmentType: item.investmentSchedule,
                    status: item.status || "",
                });
            });
            transaction.section24.forEach(item => {
                combinedData.push({
                    employeeCode: item.employeeCode,
                    financialYear: item.financialyear,
                    mainSection: item.mainSection,
                    investment: item.investment,
                    adjustedInvestment: item.adjustedInvestment,
                    property: item.propertyType,
                    eligible80EEA: item.eligible80EEA,
                    possession: item.possession,
                    pan: item.pan,
                    landLoardName: item.landLoardName,
                    landLoardAddress: item.landLoardAddress.length > 75 ? item.landLoardAddress.slice(0, 75) : item.landLoardAddress,
                    landLoardAddress1: item.landLoardAddress.length > 75 ? item.landLoardAddress.slice(75, 75 + 35) : "",
                    landLoardAddress2: item.landLoardAddress.length > 75 + 35 ? item.landLoardAddress.slice(75 + 35) : "",
                    investmentType: item.investmentSchedule,
                    status: item.status || ""

                });
            });
            // Repeat the same process for other sections (80D, 10, 24, 80CCD)
            // ...

            // Note: Adjust the "mainSection" and "division" values as needed for each section
        });
        // Create a new instance of CombinedArrays model and save the extracted data
        const savedCombinedData = await CombinedArrays.insertMany(combinedData);

        res.status(200).json({ message: 'Combined data extracted and saved', data: savedCombinedData });
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
const updateTransactionObjectAccepted = async (req, res) => {
    try {
        const { employeeCode, sectionArray, objectId, adjustedInvestment, adjustedComments } = req.body;

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
            status: 'Accept',
            adjustedInvestment: adjustedInvestment,
            adjustedComments: adjustedComments || "",
        };

        // Push the updated object back to the section array
        arrayToUpdate[arrayToUpdate.indexOf(objectToUpdate)] = updatedObject;

        // Save the updated transaction
        await transaction.save();

        res.status(200).json({ message: 'Object Accepted Successfully', data: objectToUpdate });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const copyTransactionObjects = async (req, res) => {
    try {
        const { financialYear } = req.body;

        // Validate the year
        if (!financialYear) {
            return res.status(400).json({ error: 'Year is required' });
        }

        // Find all transactions
        const transactions = await Transaction.find();

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ error: 'No transactions found' });
        }

        // Define the criteria for copying objects
        const criteria = {
            investmentSchedule: 'actual',
            financialyear: financialYear,
        };

        // Loop through all transactions and copy objects based on criteria
        const updatedTransactions = transactions.map(transaction => {
            const updatedSection80C = transaction.section80C.length > 0 ? transaction.section80C.map(obj => {
                if (obj.investmentSchedule === criteria.investmentSchedule && obj.financialyear === criteria.financialyear) {
                    // Create a duplicate of the object and update its fields
                    const duplicatedObj = { ...obj };
                    duplicatedObj.investmentSchedule = 'provisional';
                    duplicatedObj.uniqueId += 1;
                    duplicatedObj.financialyear = (parseInt(obj.financialyear) + 1).toString();
                    duplicatedObj.file = [];
                    duplicatedObj.policyNo = '';
                    duplicatedObj.actualSubmission = false;
                    duplicatedObj.status = '';
                    delete duplicatedObj.adjustedInvestment
                    if (duplicatedObj.hasOwnProperty('adjustedComments')) {
                        delete duplicatedObj.adjustedComments
                    }
                    return [obj, duplicatedObj];;
                }
                return obj;
            }) : [];
            const updatedSection80D = transaction.section80D.length > 0 ? transaction.section80D.map(obj => {
                if (obj.investmentSchedule === criteria.investmentSchedule && obj.financialyear === criteria.financialyear) {
                    // Create a duplicate of the object and update its fields
                    const duplicatedObj = { ...obj };
                    duplicatedObj.investmentSchedule = 'provisional';
                    duplicatedObj.uniqueId += 1;
                    duplicatedObj.financialyear = (parseInt(obj.financialyear) + 1).toString();
                    duplicatedObj.file = [];
                    duplicatedObj.policyNo = '';
                    duplicatedObj.actualSubmission = false;
                    duplicatedObj.status = '';
                    delete duplicatedObj.adjustedInvestment
                    if (duplicatedObj.hasOwnProperty('adjustedComments')) {
                        delete duplicatedObj.adjustedComments
                    }
                    return [obj, duplicatedObj];;
                }
                return obj;
            }) : [];
            const updatedSection10 = transaction.section10.length > 0 ? transaction.section10.map(obj => {
                if (obj.investmentSchedule === criteria.investmentSchedule && obj.financialyear === criteria.financialyear) {
                    // Create a duplicate of the object and update its fields
                    const duplicatedObj = { ...obj };
                    duplicatedObj.investmentSchedule = 'provisional';
                    duplicatedObj.uniqueId += 1;
                    duplicatedObj.financialyear = (parseInt(obj.financialyear) + 1).toString();
                    duplicatedObj.file = [];
                    duplicatedObj.policyNo = '';
                    duplicatedObj.actualSubmission = false;
                    duplicatedObj.status = '';
                    delete duplicatedObj.adjustedInvestment
                    if (duplicatedObj.hasOwnProperty('adjustedComments')) {
                        delete duplicatedObj.adjustedComments
                    }
                    return [obj, duplicatedObj];;
                }
                return obj;
            }) : [];
            const updatedSection24 = transaction.section24.length > 0 ? transaction.section24.map(obj => {
                if (obj.investmentSchedule === criteria.investmentSchedule && obj.financialyear === criteria.financialyear) {
                    // Create a duplicate of the object and update its fields
                    const duplicatedObj = { ...obj };
                    duplicatedObj.investmentSchedule = 'provisional';
                    duplicatedObj.uniqueId += 1;
                    duplicatedObj.financialyear = (parseInt(obj.financialyear) + 1).toString();
                    duplicatedObj.file = [];
                    duplicatedObj.policyNo = '';
                    duplicatedObj.actualSubmission = false;
                    duplicatedObj.status = '';
                    delete duplicatedObj.adjustedInvestment
                    if (duplicatedObj.hasOwnProperty('adjustedComments')) {
                        delete duplicatedObj.adjustedComments
                    }
                    return [obj, duplicatedObj];
                }
                return obj;
            }) : [];
            const updatedSection80CCD = transaction.section80CCD.length > 0 ? transaction.section80CCD.map(obj => {
                if (obj.investmentSchedule === criteria.investmentSchedule && obj.financialyear === criteria.financialyear) {
                    // Create a duplicate of the object and update its fields
                    const duplicatedObj = { ...obj };
                    duplicatedObj.investmentSchedule = 'provisional';
                    duplicatedObj.uniqueId += 1;
                    duplicatedObj.financialyear = (parseInt(obj.financialyear) + 1).toString();
                    duplicatedObj.file = [];
                    duplicatedObj.policyNo = '';
                    duplicatedObj.actualSubmission = false;
                    duplicatedObj.status = '';
                    delete duplicatedObj.adjustedInvestment
                    if (duplicatedObj.hasOwnProperty('adjustedComments')) {
                        delete duplicatedObj.adjustedComments
                    }
                    return [obj, duplicatedObj];;
                }
                return obj;
            }) : [];

            // Similarly, update other section arrays (e.g., section80D, section10, section24, section80CCD)

            return {
                ...transaction.toObject(),
                section80C: updatedSection80C.flat(),
                section80D: updatedSection80D.flat(),
                section10: updatedSection10.flat(),
                section24: updatedSection24.flat(),
                section80CCD: updatedSection80CCD.flat(),
                finalActualSubmission: false
                // Update other section arrays here
            };
        });
        // Update the records in the database
        await Promise.all(updatedTransactions.map(transaction => Transaction.updateOne({ _id: transaction._id }, transaction)));

        res.status(200).json({ message: 'Objects copied and updated successfully' });
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
    copyTransactionObjects,
    combineAllEmployeeArrays,
    updateTransactionObjectAccepted,
};
