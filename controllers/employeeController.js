// src/controllers/employeeController.js
const Employee = require('../models/employeeMaster');
const Role = require('../models/role');
const Transaction = require('../models/transactionsMaster');
const jwt = require('jsonwebtoken');


const createEmployee = async (req, res) => {
    try {
        const newEmployee = req.body;

        // Basic validation: Check if the required fields are provided
        const requiredFields = [
            'employeeCode',
            'employeeName',
            'panNumber',
            'plant',
            'department',
            'designation',
            'dateOfJoining',
            'officialEmail',
            'loginPassword',
        ];

        const missingFields = requiredFields.filter(field => !newEmployee[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const employee = new Employee(newEmployee);
        await employee.save();
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle validation errors
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: validationErrors });
        }
        res.status(500).json({ error: 'An error occurred' });
    }
};

const loginEmployee = async (req, res) => {
    try {
        const { employeeCode, loginPassword, userRole } = req.body;

        // Basic validation: Check if all required fields are provided
        if (!employeeCode || !loginPassword || !userRole) {
            return res.status(400).json({ error: 'Employee code, password, and user role are required' });
        }

        // Check if an employee with the provided code exists
        const employee = await Employee.findOne({ employeeCode });
        if (!employee) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the provided password matches the employee's password
        if (employee.loginPassword !== loginPassword) {
            return res.status(400).json({ error: 'Wrong password' });
        }
        if (userRole === "Employee") {
            const employeeRole = await Role.findOne({ employeeCode });
            if (!employeeRole) {
                res.json({ message: 'Successfully logged in', data: employee, role: userRole });
            }
            else if (employeeRole.userRole === "Accountant") {
                res.json({ message: 'Successfully logged in', data: employee, role: userRole });
            }
            else if (employeeRole.userRole === "Administrator") {
                res.json({ message: 'Successfully logged in', data: employee, role: userRole });
            }
            else if (employeeRole.userRole !== userRole) {
                return res.status(400).json({ error: 'User is not an employee' });
            }
        }

        // Retrieve the corresponding role for the employee from the Role model

        if (userRole !== "Employee") {
            const employeeRole = await Role.findOne({ employeeCode });

            if (!employeeRole) {
                return res.status(400).json({ error: 'User is not the role specified' });
            }
            else if (employeeRole.userRole !== userRole) {
                return res.status(400).json({ error: 'User role does not match' });
            }
            else {
                res.json({ message: 'Successfully logged in', data: employee, role: userRole });
            }
        }
        // else {
        //     res.json({ message: 'Successfully logged in' });
        // }

    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const createRole = async (req, res) => {
    try {
        const newRole = req.body;

        // Basic validation: Check if all required fields are provided
        if (!newRole.employeeCode || !newRole.plant || !newRole.userRole) {
            return res.status(400).json({ error: 'Employee code, plant, and user role are required' });
        }

        // Check if the provided user role exists in the enum
        if (!['Accountant', 'Administrator', 'Employee'].includes(newRole.userRole)) {
            return res.status(400).json({ error: 'User role does not exist' });
        }

        const role = new Role(newRole);
        await role.save();
        res.status(201).json({ message: 'Role created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const deleteAllDocumentsEmployee = async (req, res) => {
    try {
        const employeeToKeep = await Employee.findOne({ employeeCode: 191272 });

        if (!employeeToKeep) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        await Employee.deleteMany({ _id: { $ne: employeeToKeep._id } });
        res.status(200).json({ message: 'All documents deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const updateTransactionPlantFromEmployee = async (req, res) => {
    try {
        // Fetch all employee records
        const employees = await Employee.find({}, 'employeeCode plant');

        // Iterate through each employee
        for (const employee of employees) {
            // Find the corresponding transaction, if exists, by employeeCode
            const transaction = await Transaction.findOne({ employeeCode: employee.employeeCode });

            if (transaction) {
                // Check if the plant in the transaction matches the employee's plant
                if (transaction.plant !== employee.plant) {
                    // Update the plant in the transaction model
                    transaction.plant = employee.plant;
                    await transaction.save();
                }
            }
        }

        res.status(200).json({ message: 'Transaction plants updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};



module.exports = {
    createEmployee,
    loginEmployee,
    createRole,
    deleteAllDocumentsEmployee,
    updateTransactionPlantFromEmployee
};
