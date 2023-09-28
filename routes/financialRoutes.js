// src/routes/financialRoutes.js
const express = require('express');
const { createFinancial, getFinancials, updateInvestmentTypeToActual } = require('../controllers/financialController'); // Import the controllers
const router = express.Router();

// Define the route to create a financial entry
router.post('/createFinancial', createFinancial);

// Define the route to get all financial entries
router.get('/getFinancials', getFinancials);
router.put('/updateInvestmentTypeToActual', updateInvestmentTypeToActual);

module.exports = router;
