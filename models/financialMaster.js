// src/models/employee.js
const mongoose = require('mongoose');

const financialMaster = new mongoose.Schema({
    financialYear: { type: String, required: true },
    financialYearDesc: { type: String, required: true },
    status: { type: String, required: true },
    investmentType: { type: String, required: true }
});

const Financial = mongoose.model('financialMaster', financialMaster);

module.exports = Financial;
