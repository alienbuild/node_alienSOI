const getSym = require('./symbol.js');
const fs = require("fs");
const Symbol = require('../models/symbols');

// Used to update daily data for all symbols
const updateSymbols = () => {

    // Define an Array of Symbols
    const symFile = fs.readFileSync("./symlist.txt", "utf-8"); // Symbol list
    const syms = symFile.split('\r\n');

    console.log(`** Fetching Stocks - ${new Date()} **`);
    const interval = 1 * 20; // Adjust delay;

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

module.exports = updateSymbols;