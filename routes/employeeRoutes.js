// src/routes/employeeRoutes.js
const express = require('express');
const { loginEmployee, createEmployee, createRole } = require('../controllers/employeeController');
const router = express.Router();

// Define the route to create an employee
router.post('/createEmployee', createEmployee);
router.post('/login', loginEmployee);
router.post('/role', createRole);

module.exports = router;
