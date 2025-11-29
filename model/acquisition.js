'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AcquisitionSchema = new Schema({
    features: { type: Array, required: True },
    featureCount: Number,
    scalerVersion: String,
    createdAt: Date,
    targetDate: Date,
    dailyValues: Array,
    kunnaMeta: {
        alias: String,
        name: String,
        daysUsed: Array
    },
    fetchMeta: {
        timeStart: Date,
        timeEnd: Date
    },
    source: String
});

module.exports = mongoose.model('Acquisition', AcquisitionSchema);