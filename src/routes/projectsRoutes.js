// projectssRoutes.js
const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");
const authenticateToken = require("../middlewares/authenticateToken");

// Rutas para gestionar Proyectos

// Crear un nuevo PROYECTO
router.post(
  "/createProject",
  authenticateToken,
  projectsController.createProject
);

// Aplicacion a un PROYECTO
router.post(
  "/applicationProjectById",
  projectsController.applicationProjectById
);

module.exports = router;
