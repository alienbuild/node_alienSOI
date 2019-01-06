const yargs = require('yargs');
const fs = require("fs");
const schedule = require('node-schedule');
const mongoose = require("mongoose");
const getSym = require('./symbols/symbol.js');
const getSymList = require('./symbols/getSymList.js');

// Run these tasks at midnight every single day
schedule.scheduleJob('0 0 * * *', function(){
    updateSymbols();
});

// Did you start correctly?
console.log('Aliens spotted.');

// MongoDB + Mongoose
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

// Commands
const argv = yargs
    .options({
        u: {
            demand: false,
            alias: 'update',
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

// Used to update daily data for all symbols
const updateSymbols = () => {
    console.log(`** Fetching Stocks - ${new Date()} **`);

    const interval = 1 * 20; // 10 seconds;


    // For each symbol run the fetch request
    syms.forEach(function (val, index) {

        setTimeout( function (index) {
            getSym.symbol(val, (errorMessage, results) => {
                if (errorMessage) {
                    console.log(errorMessage);
                } else {
                    // Save updated data for each symbol into Mongo
                    const data = new Symbol(results);
                    var query = {key: results.key};
                    Symbol.findOneAndUpdate(query, results, {upsert: true}, function (err, doc) {
                        if (err) {
                            // Fail?
                            console.log(err);
                        } else {
                            // Success
                            console.log(`[${results.symbol}] stock has been updated.`);
                        }
                    });
                }
            });
        },interval * index, index);

    });
};

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