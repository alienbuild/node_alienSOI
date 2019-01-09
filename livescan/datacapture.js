const fetch = require("node-fetch");

const livesym = (symbol, callback) => {

    const filters = '&filter=symbol,companyName,primaryExchange,change,volume,minute,close,label,date,avgTotalVolume,open';
    const types = '&types=quote,chart&range=1d&chartLast=5';
    fetch(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbol}${types}${filters}`)
        .then(res=>res.json())
        .then(data=>{
            // Did the stock gain or loose in value today after one hour?
            let valueIncreased;

            if (data[symbol.toUpperCase()].chart[3].close > data[symbol.toUpperCase()].quote.open) {
                // Stock gained value after one hour
                valueIncreased = 1;
            } else{
                // Stock lost value after one hour
                valueIncreased = 0;
            }

            let open = data[symbol.toUpperCase()].quote.open;
            let close = data[symbol.toUpperCase()].chart[4].close;
            let difference = open - close;
            let result = difference * 100;

            if (isNaN(result) ) {
                result = 0;
            }

            // Take values needed and send it back to app.js
            callback(undefined,{
                company: data[symbol.toUpperCase()].quote.companyName,
                symbol: data[symbol.toUpperCase()].quote.symbol,
                exchange: data[symbol.toUpperCase()].quote.primaryExchange,
                close: data[symbol.toUpperCase()].quote.close,
                open: data[symbol.toUpperCase()].quote.open,
                avgVol: data[symbol.toUpperCase()].quote.avgTotalVolume,
                change: result,
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
                    },
                    {
                        volume: data[symbol.toUpperCase()].chart[3].volume,
                        close: data[symbol.toUpperCase()].chart[3].close,
                        time: data[symbol.toUpperCase()].chart[3].label
                    },
                    {
                        volume: data[symbol.toUpperCase()].chart[4].volume,
                        close: data[symbol.toUpperCase()].chart[4].close,
                        time: data[symbol.toUpperCase()].chart[4].label
                    }
                ]
            });

        }).catch((error) => {
        console.log('Error with ' + symbol + error);
    });

};

module.exports.livesym = livesym;