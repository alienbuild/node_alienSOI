const yargs = require('yargs');
const fs = require("fs");
const schedule = require('node-schedule');

schedule.scheduleJob('0 0 * * *', function(){
    console.log('The answer to life, the universe, and everything!');
});

console.log('Aliens made contact.');

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/symbols", { useNewUrlParser: true });

const symSchema = new mongoose.Schema({
    company: String,
    key: String,
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

const Symbol = mongoose.model("Symbol", symSchema);

const getSym = require('./symbols/symbol.js');

const argv = yargs
    .options({
        update: {
            demand: false,
            alias: 'u',
            describe: 'Update all symbols',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

// Define an Array of Symbols
const symFile = fs.readFileSync("./symlist.txt", "utf-8"); // Symbol list
const syms = symFile.split('\r\n');
console.log(syms);

// For each symbol run the fetch request
syms.forEach(function(val, index) {
    getSym.symbol(val, (errorMessage, results) => {
        if (errorMessage) {
            console.log(errorMessage);
        } else {
            const data = new Symbol(results);
            data.save();
            console.log(`[${results.symbol}] stock has been updated.`);
        }
    });
});