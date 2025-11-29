'use strict'

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const acquireRoutes = require('./routes/acquireRoutes');

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('[DB] Conexión a la base de datos establecida');
        console.log(`[DB] MONGO_URI: ${MONGO_URI}`)
    }).catch(err => {
        console.error('[DB] Error de conexión a la base de datos:', err);
})

const app = express();
app.use(express.json());

app.use('/', acquireRoutes);

app.listen(PORT, async () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`[ACQUIRE] Servicio escuchando en ${serverUrl}`);
});