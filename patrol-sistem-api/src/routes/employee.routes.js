const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const employeeController = require('../controllers/employee.controller');

router.get('/employee', guard.verifyAuth, employeeController.getAll);
router.get('/employee/:id', guard.verifyAuth, employeeController.getById);
router.post('/employee', guard.verifyAuth, employeeController.create);
router.put('/employee/:id', guard.verifyAuth, employeeController.update);

module.exports = router;
