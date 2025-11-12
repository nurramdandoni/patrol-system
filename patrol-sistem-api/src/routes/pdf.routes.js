const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const pdfController = require('../controllers/pdf.controller');

router.post('/pdf/location', guard.verifyAuth, pdfController.generateLocationPDF);

module.exports = router;
