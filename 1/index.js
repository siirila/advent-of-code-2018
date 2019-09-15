let fs = require('fs');
let byline = require('byline');
 
let stream = byline(fs.createReadStream('1-1-input.txt', { encoding: 'utf8' }));

let frequency = 0;
let previousFrequencies = [0];
let frequencyChanges = [];
let isRepeatFrequency = false;

stream.on('data', function(line) {
    console.log(Number(line));
    frequencyChanges.push(Number(line));
});

stream.on('end', function() {
    let currentFrequencyChange = 0;
    
    while (!isRepeatFrequency) {
        frequency += frequencyChanges[currentFrequencyChange];
        console.log(`new frequency ${frequency}`);
        if (previousFrequencies.includes(frequency)) {
            break;
        }
        previousFrequencies.push(frequency);
    
        currentFrequencyChange = (currentFrequencyChange + 1) % frequencyChanges.length;
    }
    
    console.log(`The first repeating frequency is ${frequency}`);
});

