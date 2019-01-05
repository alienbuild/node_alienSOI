const yargs = require('yargs');

const getSym = require('./symbols/symbol.js');

const argv = yargs
    .options({
        sym: {
            demand: true,
            alias: 'symbol',
            describe: 'Symbol to fetch data for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

getSym.symbol(argv.sym, (errorMessage, results) => {
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        console.log(JSON.stringify(results, undefined, 2));
    }
});