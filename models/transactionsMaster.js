const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    employeeCode: { type: Number, required: true },
    section80C: { type: [Object], default: [] },
    section80D: { type: [Object], default: [] },
    section10: { type: [Object], default: [] },
    section24: { type: [Object], default: [] },
    section80CCD: { type: [Object], default: [] },
    finalActualSubmission: { type: Boolean, default: false },
    plant: { type: String, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;