// src/models/employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeCode: { type: Number, required: true },
    employeeName: { type: String, required: true },
    panNumber: { type: String, required: true },
    plant: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    dateOfJoining: { type: String, required: true },
    offiicialEmail: { type: String, required: true },
    loginPassword: { type: String, required: true },
    phoneNumber: { type: String },
    userRole: { type: String }
});

const Employee = mongoose.model('EmployeeMaster', employeeSchema);

module.exports = Employee;
