// src/routes/employeeRoutes.js
const express = require('express');
const { loginEmployee, createEmployee, createRole, deleteAllDocumentsEmployee, updateTransactionPlantFromEmployee } = require('../controllers/employeeController');
const { getEmployeeContactInfo, updateOrCreateEmployeeContact } = require('../controllers/employeeContactController');
const router = express.Router();

// Define the route to create an employee
router.post('/createEmployee', createEmployee);
router.post('/login', loginEmployee);
router.post('/role', createRole);
router.delete('/deleteAllEmployees', deleteAllDocumentsEmployee);
router.get('/updateTransactionPlant', updateTransactionPlantFromEmployee);
router.post('/getContactInfo', getEmployeeContactInfo);
router.post('/updateOrCreateEmployeeContact', updateOrCreateEmployeeContact);

module.exports = router;
