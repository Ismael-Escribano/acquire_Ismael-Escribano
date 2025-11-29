'use strict'

require('dotenv').config;
const Acquisition = require('../model/acquisition');

const KUNNA_URL = process.env.KUNNA_URL;
const ALIAS = process.env.ALIAS;

/**
 * Llama a Kunna con un rango [timeStart, timeEnd]
 * y devuelve el objeto { columns, values }.
 */
async function fetchKunna(timeStart, timeEnd) {
    const url = KUNNA_URL;

    const headers = {
        "Content-Type": "application/json"
    };

    const body = {
        time_start: timeStart.toISOString(),
        time_end: timeEnd.toISOString(),
        filters: [
            { filter: "name", values: ["1d"] },
            { filter: "alias", values: [ALIAS] }
        ],
        limit: 100,
        count: false,
        order: "DESC"
    };

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`KUNNA_BAD_STATUS:${response.status}`);
    }

    const json = await response.json();
    const result = json.result;

    if (!result || !Array.isArray(result.columns) || !Array.isArray(result.values)) {
        throw new Error("KUNNA_INVALID_RESULT");
    }

    return result; // { columns, values }
}


async function crearEntrada(datosEntrada) {
    try {
        const acquisition = new Acquisition(datosEntrada);
        return await acquisition.save();
    } catch (err) {
        throw new Error(`Error al guardar los datos: ${err}`);
    }
}

async function obtenerAdquisicionPorId(id) {
    try {
        return await Acquisition.findById(id);
    } catch (err) {
        throw new Error(`Error al obtener los datos: ${err}`)
    }
}

async function obtenerTodasAdquisiciones() {
    try {
        return await Acquisition.find();
    } catch (err) {
        throw new Error(`Error al obtener todos los datos: ${err}`)
    }
}

async function eliminarAdquisicion(id) {
    try {
        return await Acquisition.findByIdAndDelete(id);
    } catch (err) {
        throw new Error(`Error al eliminar los datos: ${err}`)
    }
}

module.exports = {
    fetchKunna,
    crearEntrada,
    obtenerAdquisicionPorId,
    obtenerTodasAdquisiciones,
    eliminarAdquisicion
}