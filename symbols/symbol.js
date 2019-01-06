const fetch = require("node-fetch");

console.log('** Fetching stocks **');

var symbol = (symbol, callback) => {
    fetch(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbol}&types=quote,chart&range=1d&chartInterval=30&filter=symbol,companyName,primaryExchange,change,volume,minute,close,label,date`)
        .then(res=>res.json())
        .then(data=>{

            if (data[symbol.toUpperCase()].chart[2].close > data[symbol.toUpperCase()].chart[0].close) {
                // Stock gained value after one hour
                var valueIncreased = 1;
            } else{
                // Stock lost value after one hour
                var valueIncreased = 0;
            }

            // Take values needed and send it back to app.js
            callback(undefined, {
                company: data[symbol.toUpperCase()].quote.companyName,
                symbol: data[symbol.toUpperCase()].quote.symbol,
                exchange: data[symbol.toUpperCase()].quote.primaryExchange,
                date: data[symbol.toUpperCase()].chart[0].date,
                open: data[symbol.toUpperCase()].quote.open,
                valueIncreased,
                chart: [
                    {
                        volume: data[symbol.toUpperCase()].chart[0].volume,
                        close: data[symbol.toUpperCase()].chart[0].close,
                        time: data[symbol.toUpperCase()].chart[0].label
                    },
                    {
                        volume: data[symbol.toUpperCase()].chart[1].volume,
                        close: data[symbol.toUpperCase()].chart[1].close,
                        time: data[symbol.toUpperCase()].chart[1].label
                    },
                    {
                        volume: data[symbol.toUpperCase()].chart[2].volume,
                        close: data[symbol.toUpperCase()].chart[2].close,
                        time: data[symbol.toUpperCase()].chart[2].label
                    }
                ]
            });

        });
};

module.exports.symbol = symbol;