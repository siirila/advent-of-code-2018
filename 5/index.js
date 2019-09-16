let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


function isSameTypeDifferentPolarity(unit1, unit2) {
    return (unit1.toUpperCase() === unit2.toUpperCase() && unit1 !== unit2);
}

function removeMatchingOppositePolarities(polymer) {
    let position = 0;
    while (position < polymer.length - 1) {
        if (isSameTypeDifferentPolarity(polymer[position], polymer[position + 1])) {
            polymer = polymer.slice(0, position) + polymer.slice(position + 2);
            if (position !== 0) position--;
        } else {
            position++;
        }
    }

    return polymer;
}

// removeMatchingOppositePolarities('dabAcCaCBAcCcaDA');

let shortestPolymer;
let removedChar = '';

function processInput(polymer) {
    let chars = [...'abcdefghijklmnopqrstuvwxyz'];

    chars.forEach((char) => {
        let filteredPolymer = _.filter([...polymer], (inputChar) => {
            return inputChar.toLowerCase() !== char;
        }).join('');
        // console.log(filteredPolymer);

        let filteredReducedPolymer = removeMatchingOppositePolarities(filteredPolymer);

        console.log(`${char} reduced polymer processed`);
        if (!shortestPolymer || filteredReducedPolymer.length < shortestPolymer.length) {
            shortestPolymer = filteredReducedPolymer;
            removedChar = char;
            console.log(`${char} reduced polymer was shorter than any previous one`);
        }
    });

    console.log(`The shorted reduced polymer is ${shortestPolymer} which is ${shortestPolymer.length} units long`);
    console.log(`This polymer was produced by removing all of the ${removedChar} units`);

    // let polymer = removeMatchingOppositePolarities(input);
    // console.log(`The reduced polymer is ${polymer} which is ${polymer.length} units long`);
}

// processInput('dabAcCaCBAcCcaDA');


let stream = byline(fs.createReadStream('5-input.txt', { encoding: 'utf8' }));
let input;

stream.on('data', (line) => {
    input = line;
});

stream.on('end', () => {
    processInput(input);
    // console.log(`The length was ${removeMatchingOppositePolarities(input).length}`);
});
