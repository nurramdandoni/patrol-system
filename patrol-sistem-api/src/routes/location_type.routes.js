const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const locationTypeController = require('../controllers/location_type.controller');

router.get('/location/type', guard.verifyAuth, locationTypeController.getAll);
router.get('/location/type/:id', guard.verifyAuth, locationTypeController.getById);
router.post('/location/type', guard.verifyAuth, locationTypeController.create);
router.put('/location/type/:id', guard.verifyAuth, locationTypeController.update);

module.exports = router;
