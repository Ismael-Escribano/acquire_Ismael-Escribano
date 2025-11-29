'use strict'

const express = require('express');
const router = express.Router();

const acquireController = require('../controllers/acquireController');

router.get("/health", predictController.health);
router.post("/data", predictController.fetchData);
router.get("/data", predictController.obtenerTodasAdquisiciones);
router.get("/data/:id", predictController.obtenerAdquisicionPorId);
router.delete("/data/:id", predictController.eliminarAdquisicion);

module.exports = router;