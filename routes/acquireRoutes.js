'use strict'

const express = require('express');
const router = express.Router();

const acquireController = require('../controllers/acquireController');

router.get("/health", acquireController.health);
router.post("/data", acquireController.fetchData);
router.get("/data", acquireController.obtenerTodasAdquisiciones);
router.get("/data/:id", acquireController.obtenerAdquisicionPorId);
router.delete("/data/:id", acquireController.eliminarAdquisicion);

module.exports = router;