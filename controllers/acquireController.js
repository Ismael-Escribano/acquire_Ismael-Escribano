'use strict'

const acquireService = require('../services/acquireService');

function health(req, res) {
    res.json({
        status: 'ok',
        service: 'acquire'
    });
}

async function fetchData(req, res) {
    // TODO: obtener rango de fechas
    //       preprocesar datos de Kunna para guardar en mongo
    //       añadir manejo de errores
    KunnaData = acquireService.fetchKunna();

    const datosEntrada = {
        features,
        featureCount,
        scalerVersion,
        createdAt,
        targetDate,
        dailyValues,
        kunnaMeta: {
            alias,
            name,
            daysUsed
        },
        fetchMeta: {
            timeStart,
            timeEnd
        },
        source
    }
    const adquisitionStored = await acquireService.crearEntrada(datosEntrada);

    res.status(201).json({
        dataId: adquisitionStored.id,
        features: features,
        featureCount: featureCount,
        scalerVersion: ScalerVersion,
        createdAt: CreatedAt
    })
}

async function obtenerAdquisicionPorId (req, res) {
    let adquisicionId = req.params.id;
    try {
        const adquisicion = await acquireService.obtenerAdquisicionPorId(adquisicionId);
        if (!adquisicion) {
            return res.status(404).send({ mensaje: 'La Adquisición no existe' });
        }
        res.status(200).send({ adquisicion });
    } catch (err) {
        res.status(500).send({ mensaje: `Error al realizar la petición: ${err.message}`});
    }
}

async function obtenerTodasAdquisiciones(req, res) {
    try {
        const adquisiciones = await acquireService.obtenerTodasAdquisiciones();
        if (!adquisiciones) {
            return res.status(404).send({ mensaje: 'No existen adquisiciones' });
        }
        res.status(200).send({ adquisicion: adquisiciones });
    } catch (err) {
        res.status(500).send({ mensaje: `Error al obtener las adquisiciones: ${err.message}`});
    }
}

async function eliminarAdquisicion(req, res) {
    let adquisicionId = req.params.id
    try {
        const adquisicionDeleted = await acquireService.eliminarAdquisicion(adquisicionId);
        if (!adquisicionDeleted) {
            return res.status(404).send({ mensaje: 'La adquisición no existe' });
        }
        res.status(200).send({ adquisicion: adquisicionDeleted });
    } catch (err) {
        res.status(500).send({ mensaje: `Error al eliminar la adquisición: ${err.message}`})
    }
}

module.exports = {
    health,
    fetchData,
    obtenerAdquisicionPorId,
    obtenerTodasAdquisiciones,
    eliminarAdquisicion
}