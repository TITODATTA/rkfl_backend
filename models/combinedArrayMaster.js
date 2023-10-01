// src/models/combinedArrays.js
const mongoose = require('mongoose');

const combinedArraysSchema = new mongoose.Schema({
    employeeCode: { type: Number },
    financialYear: { type: String },
    mainSection: { type: String },
    investmentCode: { type: String },
    subSectionCode: { type: String },
    division: { type: String },
    investment: { type: String },
    investmentType: { type: String },
    accommodation: { type: String },
    cityCategory: { type: String },
    pan: { type: String },
    landLoardName: { type: String },
    landLoardAddress: { type: String },
    property: { type: String },
    eligible80EEA: { type: String },
    possession: { type: String },
});

const CombinedArrays = mongoose.model('CombinedArrays', combinedArraysSchema);

module.exports = CombinedArrays;
