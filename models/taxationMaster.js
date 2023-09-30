// src/models/employee.js
const mongoose = require('mongoose');

const taxationSchema = new mongoose.Schema({
    employeeCode: { type: Number, required: true },
    financialYear: { type: Number, required: true },
    taxOption: { type: Number },
});

const Taxation = mongoose.model('TaxationMaster', taxationSchema);

module.exports = Taxation;
