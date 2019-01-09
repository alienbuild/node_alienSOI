const mongoose = require("mongoose");

const liveSchema = new mongoose.Schema({
    company: String,
    key: String,
    symbol: String,
    exchange: String,
    open: Number,
    close: Number,
    avgVol: Number,
    valueIncreased: Number,
    change: { type: Number, default: '0' },
    chart: [
        {
            volume: Number,
            close: Number,
            time: String,
        },
        {
            volume: Number,
            close: Number,
            time: String,
        },
        {
            volume: Number,
            close: Number,
            time: String,
        },
        {
            volume: Number,
            close: Number,
            time: String,
        },
        {
            volume: Number,
            close: Number,
            time: String,
        }
    ]
});

module.exports = mongoose.model('LiveData', liveSchema, 'live');