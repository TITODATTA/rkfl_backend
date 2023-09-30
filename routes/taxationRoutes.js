// src/routes/employeeRoutes.js
const express = require('express');
const { checkTaxationData, createTaxationRecord, copyTaxationRecords, deleteRecordsByFinancialYear } = require('../controllers/taxationController');
const router = express.Router();

// Define the route to create an employee
router.post('/checkTaxation', checkTaxationData);
router.post('/createTaxation', createTaxationRecord);
router.post('/copy', copyTaxationRecords);
router.delete('/delete', deleteRecordsByFinancialYear);

module.exports = router;
