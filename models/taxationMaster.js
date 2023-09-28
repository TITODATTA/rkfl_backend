// src/models/employee.js
const mongoose = require('mongoose');

const taxationSchema = new mongoose.Schema({
    employeeCode: { type: Number, required: true },
    financialYear: { type: String, required: true },
    taxOption: { type: Number, required: true },
});

const taxation = mongoose.model('TaxationMaster', taxationSchema);

module.exports = taxation;
