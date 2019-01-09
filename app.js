const yargs = require('yargs');
const mongoose = require("mongoose");
const schedules = require('./schedules/notify');
const getSymList = require('./symbols/getSymList.js');
const Symbol = require('./models/symbols');
const updateSymbols = require('./symbols/updateSymbols.js');
const liveScan = require('./livescan/live.js');

// Did you start correctly?
console.log('App reporting for duty.');
schedules.schedules();

// MongoDB + Mongoose
mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/symbols", { useNewUrlParser: true });

// Commands
const argv = yargs
    .options({
        u: {
            demand: false,
            alias: 'update',
            describe: 'Update all symbols',
            string: true
        },
        s: {
            demand: false,
            alias: 'symbol',
            describe: 'Symbol to retrieve information',
            string: true
        },
        live: {
            demand: false,
            alias: 'liverun',
            describe: 'Run a live scan at market open',
            string: false
        }
    })
    .help()
    .alias('help', 'h')
    .argv;


// Live Scan
if (argv.live) {
    console.log('** Running Live Scan **');
    liveScan();
}

// Update manually requested
if (argv.update) {
    console.log('Updating symbols');
    updateSymbols();
}

// Update symbol list
if (argv.getSymbols) {
    console.log('Getting symbols');
    getSymList();
}

// Find Symbol
if (argv.symbol) {
    let query = argv.symbol;
    query = query.toUpperCase();
    Symbol.find({"symbol": query}, function (err, symbol) {
        console.log('Finding symbol: ' + query);
        if (err) {
            console.log(err);
        }
        console.log(JSON.stringify(symbol, undefined, 2));
    });
}