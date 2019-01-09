const fetch = require("node-fetch");
const fs = require('fs');

const symbol = (symbol, callback) => {

        const filters = '&filter=symbol,companyName,primaryExchange,change,volume,minute,close,label,date';
        const types = '&types=quote,chart&range=1d&chartInterval=30';
        fetch(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbol}${types}`)
            .then(res=>res.json())
            .then(data=>{
                // Did the stock gain or loose in value today after one hour?
                let valueIncreased;
                if (data[symbol.toUpperCase()].chart[2].close > data[symbol.toUpperCase()].quote.open) {
                    // Stock gained value after one hour
                    valueIncreased = 1;
                } else{
                    // Stock lost value after one hour
                    valueIncreased = 0;
                }

                // Take values needed and send it back to app.js
                callback(undefined,{
                    company: data[symbol.toUpperCase()].quote.companyName,
                    key: `${data[symbol.toUpperCase()].chart[0].date}-${data[symbol.toUpperCase()].quote.symbol}`,
                    symbol: data[symbol.toUpperCase()].quote.symbol,
                    exchange: data[symbol.toUpperCase()].quote.primaryExchange,
                    date: data[symbol.toUpperCase()].chart[0].date,
                    open: data[symbol.toUpperCase()].quote.open,
                    valueIncreased,
                    chart: [
                        {
                            volume: data[symbol.toUpperCase()].chart[0].volume,
                            close: data[symbol.toUpperCase()].quote.open,
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

            }).catch((error) => {
            console.log('Error with ' + symbol + error);
        });

};

module.exports.symbol = symbol;