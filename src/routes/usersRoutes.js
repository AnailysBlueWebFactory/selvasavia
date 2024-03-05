// usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authenticateToken = require('../middlewares/authenticateToken');

// Rutas para gestionar usuarios

// Crear un nuevo usuario
router.post('/createUser', authenticateToken, usersController.createUser);

// Obtener todos los usuarios
router.post('/getAllUsers', authenticateToken, usersController.getAllUsers);

// Obtener un usuario por ID
router.post('/getUserById', authenticateToken,usersController.getUserById);

// Actualizar un usuario por ID
router.post('/updateUserById', authenticateToken,usersController.updateUserById);

// Eliminar un usuario por ID
router.post('/deleteUserById', authenticateToken,usersController.deleteUserById);

// Login User (No aplica el middleware authenticateToken aquí)
router.post('/loginUser', usersController.loginUser);

module.exports = router;
