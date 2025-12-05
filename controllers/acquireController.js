'use strict'

require('dotenv').config();
const acquireService = require('../services/acquireService');
const ScalerVersion = process.env.SCALER_VERSION;
const Alias = process.env.ALIAS;

function health(req, res) {
    res.json({
        status: 'ok',
        service: 'acquire'
    });
}

async function fetchData(req, res) {
    try {
        const Today = new Date();
        const hour = Today.getHours();
        let TimeEnd = new Date(Today);
        if (hour < 23) {
            TimeEnd.setDate(Today.getDate() - 1);
        }
        let TimeStart = new Date(TimeEnd);
        TimeStart.setDate(TimeEnd.getDate() - 3);
        
        var KunnaData;
        try {
            KunnaData = await acquireService.fetchKunna(TimeStart, TimeEnd);
        } catch (err) {
            if (err.message == 'KUNNA_INVALID_RESULT') {
                res.status(502).json({ mensaje: `La respuesta de la API es inválida: ${err}` })
            } else {
                res.status(504).json({ mensaje: `La API tardó mucho en responder: ${err}` })
            }
        }

        var DailyValues = Array();
        var DaysUsed = Array();
        var Features = Array();
        const value = 2; const time = 0;
        for (var i = 0; i < KunnaData.values.length; i++) {
            const datos = KunnaData.values[i]
            DailyValues.push(datos[value]);
            Features.push(datos[value]);
            DaysUsed.push(datos[time].split('T')[0]);
        }

        Features.push(Today.getUTCHours());
        Features.push(Today.getUTCDay());
        Features.push(Today.getUTCMonth() + 1);
        Features.push(Today.getUTCDate());
        
        const datosEntrada = {
            features: Features,
            featureCount: Features.length,
            scalerVersion: ScalerVersion,
            createdAt: Today,
            targetDate: TimeEnd,
            dailyValues: DailyValues,
            kunnaMeta: {
                alias: Alias,
                name: "1d",
                daysUsed: DaysUsed
            },
            fetchMeta: {
                timeStart: TimeStart,
                timeEnd: TimeEnd
            },
            source: "acquire"
        }

        const adquisitionStored = await acquireService.crearEntrada(datosEntrada);

        res.status(201).json({
            dataId: adquisitionStored.id,
            features: Features,
            featureCount: Features.length,
            scalerVersion: ScalerVersion,
            createdAt: Today
        })
    } catch (err) {
        res.status(500).json({ mensaje: `Error al realizar la pretición: ${err}` })
    }
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