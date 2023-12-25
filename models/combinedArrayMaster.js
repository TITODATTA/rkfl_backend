// src/models/combinedArrays.js
const mongoose = require('mongoose');

const combinedArraysSchema = new mongoose.Schema({
    employeeCode: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    financialYear: { type: String },
    mainSection: { type: String },
    investmentCode: { type: String },
    subSectionCode: { type: String },
    division: { type: String },
    investment: { type: String },
    adjustedInvestment: { type: String },
    accommodation: { type: String },
    cityCategory: { type: String },
    pan: { type: String },
    landLoardName: { type: String },
    landLoardAddress: { type: String },
    landLoardAddress1: { type: String },
    landLoardAddress2: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    dob: { type: String },
    childAllowance: { type: String },
    property: { type: String },
    lenderType: { type: String },
    eligible80EEA: { type: String },
    possession: { type: String },
    investmentType: { type: String },
    status: { type: String },
});

const CombinedArrays = mongoose.model('CombinedArrays', combinedArraysSchema);

module.exports = CombinedArrays;
