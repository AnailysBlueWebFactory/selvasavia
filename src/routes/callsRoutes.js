const express = require('express');
const router = express.Router();
const multer = require('multer');
const callsController = require('../controllers/callsController');
const authenticateToken = require('../middlewares/authenticateToken');

// Configuración de multer para gestionar la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });


// Rutas para gestionar Convocatorias
// Crear una nueva Convocatoria
router.post('/createCall', callsController.createCall);
// Obtener todoa las convocatorias
router.post('/getAllCalls', authenticateToken, callsController.getAllCalls);
// Obtener convocatoria por id
router.post('/getCallById', authenticateToken, callsController.getCallById);
// Obtener convocatoria por id
router.post('/updateStatusCallById', callsController.updateStatusCallById);
// Ruta para obtener la lista de convocatorias agrupadas por estado y su cantidad
router.post('/getCallsGroupedByStatus', authenticateToken, callsController.getCallsGroupedByStatus);
// Ruta para insertar campos de detalle de convocatoria
router.post('/insertCallDetails', authenticateToken, callsController.insertCallDetails);
// Ruta para crear una nueva publicación de convocatoria
router.post('/updatePublicationById', authenticateToken, upload.single('publicationImage'), callsController.updatePublicationById);
// Ruta para aplicar a convocatoria por id
router.post('/applicationCallById', callsController.applicationCallById);
// Ruta para aplicar a convocatoria por id
router.post('/getAllCallSite', callsController.getAllCallSite);
// Ruta para listar las convocatorias a gestionar un Leader
router.post('/getAllCallsLeader', authenticateToken, callsController.getAllCallsLeader);


module.exports = router;