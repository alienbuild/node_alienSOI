const fetch = require("node-fetch");

var symbol = (symbol, callback) => {

    const symbols = symbol;

    fetch(` https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=quote,chart&range=1d&chartInterval=30`)
        .then(res=>res.json())
        .then(data=>{

            callback(undefined, {
                company: data[symbols.toUpperCase()].quote.companyName,
                symbol: data[symbols.toUpperCase()].quote.symbol,
                exchange: data[symbols.toUpperCase()].quote.primaryExchange,
                date: data[symbols.toUpperCase()].chart[0].date,
                open: data[symbols.toUpperCase()].quote.open,
                firstInt: [{
                    volume: data[symbols.toUpperCase()].chart[0].volume,
                    close: data[symbols.toUpperCase()].chart[0].close,
                    time: data[symbols.toUpperCase()].chart[0].label
                }],
                secondInt: [{
                    volume: data[symbols.toUpperCase()].chart[1].volume,
                    close: data[symbols.toUpperCase()].chart[1].close,
                    time: data[symbols.toUpperCase()].chart[1].label
                }],
                thirdInt: [{
                    volume: data[symbols.toUpperCase()].chart[2].volume,
                    close: data[symbols.toUpperCase()].chart[2].close,
                    time: data[symbols.toUpperCase()].chart[2].label
                }]
            });

        });
};

module.exports.symbol = symbol;