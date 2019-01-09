const getSym = require('../livescan/datacapture.js');
const fs = require("fs");
const LiveSymbol = require('../models/liveSymbols.js');

// Used to update daily data for all symbols
const liveScan = () => {

    console.log('** Live Scanning **');

    // Define an Array of Symbols
    const symFile = fs.readFileSync("./symlist.txt", "utf-8"); // Symbol list
    const syms = symFile.split('\r\n');

    console.log(`** Fetching Stocks - ${new Date()} **`);
    const interval = 25; // Adjust delay;

    var operationsCompleted = 0;
    function operation() {
        ++operationsCompleted;
        if (operationsCompleted ===  8272) {

            LiveSymbol.find({"chart.volume" : { $gt: 5000 }, "valueIncreased": 1, "chart.close": { $gt: 100 }, "change": { $lt: -100 } })
                .exec()
                .then(res => {
                    console.log('Locating *HOT* stocks...');
                    console.log(JSON.stringify(res, undefined, 2));
                    for(var key in res) {
                        var value = res[key];
                        fs.appendFileSync('hotpicks.txt', value.symbol + "\r\n");
                    }
                })
                .catch(err => console.log(err));
        }
    }

    for (let i = 0; i < syms.length; i++){

        setTimeout( function (index) {
            getSym.livesym(syms[i], (errorMessage, results) => {
                if (errorMessage) {
                    console.log(errorMessage);
                } else {
                    // Save updated data for each symbol into Mongo
                    const data = new LiveSymbol(results);
                    var query = {symbol: results.symbol};
                    LiveSymbol.findOneAndUpdate(query, results, {upsert: true}, function (err, doc) {
                        if (err) {
                            // Fail?
                            console.log(err);
                        } else {
                            // Success
                            console.log(`[${results.symbol}] stock has been updated.`);
                            operation();
                        }
                    });
                }
            });
        },interval * i, i);

    }


};

module.exports = liveScan;