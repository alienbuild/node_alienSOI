const yargs = require('yargs');

console.log('Aliens made contact.');

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/symbols", { useNewUrlParser: true });

var symSchema = new mongoose.Schema({
    company: String,
    symbol: String,
    exchange: String,
    date: String,
    open: String,
    valueIncreased: String,
    chart: [
        {
            volume: String,
            close: String,
            time: String,
        },
        {
            volume: String,
            close: String,
            time: String,
        },
        {
            volume: String,
            close: String,
            time: String,
        }
    ]
});

var Symbol = mongoose.model("Symbol", symSchema);


const getSym = require('./symbols/symbol.js');

const argv = yargs
    .options({
        update: {
            demand: false,
            alias: 'u',
            describe: 'Symbol to fetch data for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

// Define an Array of Symbols
var syms = new Array('fb','atvi');

// For each symbol run the fetch request
syms.forEach(function(val, index) {
    getSym.symbol(val, (errorMessage, results) => {
        if (errorMessage) {
            console.log(errorMessage);
        } else {
            var data = new Symbol(results);
            data.save();
            console.log(`${results.symbol} has been updated.`);
        }
    });
});

