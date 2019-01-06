const fs = require('fs');
const fetch = require("node-fetch");

const getSymList = () => {
    fetch(`https://api.iextrading.com/1.0/ref-data/symbols?filter=symbol`)
        .then(res=>res.json())
        .then(data=>{
            for (var i =0; i< data.length ;i++) {
                console.log('Found symbol: ' + data[i].symbol);
                fs.appendFileSync('symlist.txt', data[i].symbol+"\r\n");
            }
        }).catch(error => console.error('Error in getSymList'));
};

module.exports.getSymList = getSymList;