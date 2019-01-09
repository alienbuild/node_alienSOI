const mongoose = require("mongoose");

const symSchema = new mongoose.Schema({
    company: String,
    key: String,
    symbol: String,
    exchange: String,
    date: Number,
    open: Number,
    valueIncreased: Number,
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
        }
    ]
});

module.exports = mongoose.model('Symbol', symSchema, 'symbols');