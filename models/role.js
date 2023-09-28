// src/models/role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    employeeCode: { type: Number, required: true },
    plant: { type: String, required: true },
    userRole: {
        type: String,
        enum: ['Accountant', 'Administrator', 'Employee'],
        required: true,
    },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
