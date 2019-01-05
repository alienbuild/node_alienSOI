const fetch = require("node-fetch");

var symbol = (symbol, callback) => {

    fetch(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbol}&types=quote,chart&range=1d&chartInterval=30&filter=symbol,companyName,primaryExchange,change,volume,minute,close,label,date`)
        .then(res=>res.json())
        .then(data=>{

            callback(undefined, {
                company: data[symbol.toUpperCase()].quote.companyName,
                symbol: data[symbol.toUpperCase()].quote.symbol,
                exchange: data[symbol.toUpperCase()].quote.primaryExchange,
                date: data[symbol.toUpperCase()].chart[0].date,
                open: data[symbol.toUpperCase()].quote.open,
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