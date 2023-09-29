// src/routes/employeeRoutes.js
const express = require('express');
const { checkTaxationData, createTaxationRecord } = require('../controllers/taxationController');
const router = express.Router();

// Define the route to create an employee
router.post('/checkTaxation', checkTaxationData)
router.post('/createTaxation', createTaxationRecord)

module.exports = router;
