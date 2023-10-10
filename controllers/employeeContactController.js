// controllers/employeeController.js

const EmployeeContact = require('../models/employeeContact');

const getEmployeeContactInfo = async (req, res) => {
    try {
        const { employeeCode } = req.body;

        const employeeContact = await EmployeeContact.findOne({ employeeCode });

        if (employeeContact) {
            res.status(200).json({
                contactInfo: true,
                phoneNumber: employeeContact.phoneNumber,
            });
        } else {
            res.status(200).json({
                contactInfo: false,
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
const updateOrCreateEmployeeContact = async (req, res) => {
    try {
        const { employeeCode, phoneNumber } = req.body;

        // Find the employee contact by employee code
        let employeeContact = await EmployeeContact.findOne({ employeeCode });

        if (!employeeContact) {
            // If employee contact doesn't exist, create a new one
            employeeContact = new EmployeeContact({
                employeeCode,
                phoneNumber,
            });
        } else {
            // If employee contact exists, update the phone number
            employeeContact.phoneNumber = phoneNumber;
        }

        await employeeContact.save();

        res.status(200).json({
            message: 'Employee contact updated or created successfully',
            data: employeeContact,
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};


module.exports = {
    getEmployeeContactInfo,
    updateOrCreateEmployeeContact,
};
