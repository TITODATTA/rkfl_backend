// src/routes/transactionRoutes.js
const express = require('express');
const { createOrUpdateTransaction, getTransactionByEmployeeCode, getAllTransactionData, combineEmployeeArrays, updateTransactionObject
    , updateObjectStatusAndResubmission, copyTransactionObjects, combineAllEmployeeArrays, updateTransactionObjectAccepted,
} = require('../controllers/transactionController'); // Import the controller
const router = express.Router();

// Define the route to create or update transactions
router.post('/createOrUpdateTransaction', createOrUpdateTransaction);
router.post('/getTransactionByEmployeeCode', getTransactionByEmployeeCode);
router.get('/getAllTransactionData', getAllTransactionData);
router.post('/combineEmployeeArrays', combineEmployeeArrays);
router.get('/combineAllEmployeeArrays', combineAllEmployeeArrays);
router.put('/updateTransactionObject', updateTransactionObject);
router.put('/updateObjectStatusAndResubmission', updateObjectStatusAndResubmission);
router.put('/updateTransactionObjectAccepted', updateTransactionObjectAccepted);
router.post('/copyObjects', copyTransactionObjects);
// router.post('/generatePdf', generatePDF);

module.exports = router;
