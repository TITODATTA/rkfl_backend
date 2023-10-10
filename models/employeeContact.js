// src/models/employee.js
const mongoose = require('mongoose');

const employeeContactSchema = new mongoose.Schema({
    employeeCode: { type: Number },
    phoneNumber: { type: String }
});

const EmployeeContact = mongoose.model('EmployeeContact', employeeContactSchema);

module.exports = EmployeeContact;
