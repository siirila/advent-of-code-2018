let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');
 
let stream = byline(fs.createReadStream('2-1-input.txt', { encoding: 'utf8' }));

let twos = 0;
let threes = 0;

function countRepeats(text) {
    let chars = _.countBy([...text]);
    chars = _.invert(chars);
    console.log(chars);

    if (chars[2]) twos++;
    if (chars[3]) threes++;
}

stream.on('data', countRepeats);

stream.on('end', function() {
    console.log(`twos total: ${twos}`);
    console.log(`threes total: ${threes}`);
    console.log(`checksum ${twos * threes}`);
});

