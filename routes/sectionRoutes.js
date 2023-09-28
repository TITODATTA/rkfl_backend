// src/routes/section80CRoutes.js
const express = require('express');
const { createSection80C, getSection80CData, getSection80DData, createSection80D, createSection10, getSection10Data, createSection24, createSection80CCD, getSection24Data, getSection80CCDData } = require('../controllers/sectionController'); // Import the createSection80C controller
const router = express.Router();

// Define the route to create Section 80C data
router.post('/createSection80C', createSection80C);
router.post('/createSection80D', createSection80D);
router.post('/createSection10', createSection10);
router.post('/createSection24', createSection24);
router.post('/createSection80CCD', createSection80CCD);
router.get('/getSection80CData', getSection80CData);
router.get('/getSection80DData', getSection80DData);
router.get('/getSection10Data', getSection10Data);
router.get('/getSection24Data', getSection24Data);
router.get('/getSection80CCDData', getSection80CCDData);

module.exports = router;
