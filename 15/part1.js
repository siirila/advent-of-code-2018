let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');
let functions = require('./functions.js');


let data = [];

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', (line) => {
    data.push(line);
});

stream.on('end', function() {
    let { map, units } = functions.getMapAndUnitsFromData(data);
    functions.performCombat(units, map);
});