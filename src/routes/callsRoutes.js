const express = require('express');
const router = express.Router();
const callsController = require('../controllers/callsController');
const authenticateToken = require('../middlewares/authenticateToken');

// Rutas para gestionar Convocatorias

// Crear una nueva Convocatoria
router.post('/createCall', callsController.createCall);
// Obtener todoa las convocatorias
router.post('/getAllCalls', authenticateToken, callsController.getAllCalls);
// Obtener convocatoria por id
router.post('/getCallById', authenticateToken, callsController.getCallById);
// Obtener convocatoria por id
router.post('/updateStatusCallById', authenticateToken, callsController.updateStatusCallById);

module.exports = router;