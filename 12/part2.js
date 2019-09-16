let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


let currentState = [];
let notes = {};


function getLine(line) {
    if (line.includes("initial state: ")) {
        let [,,state] = line.split(" ");
        setInitialPotsState(state);
    } else if (line.includes("=>")) {
        setNote(line);
    }
}

function setInitialPotsState(pots) {
    let initialPotsState = [];
    console.log(`The initial pots inputs contains ${pots.length} pots`);
    pots.split('').forEach((pot, index) => {
        if (pot === "#") initialPotsState.push(index);
    });
    currentState = initialPotsState;
    console.log(initialPotsState.join());
    console.log(convertPotsToString(initialPotsState));
}

function convertPotsToString(pots) {
    let potsString = '';
    for (let pot = pots[0]; pot < pots[pots.length - 1]; pot++) {
        if (pots.includes(pot)) {
            potsString += '#';
        } else {
            potsString += '.';
        }
    }

    return potsString;
}

function setNote(note) {
    let [rule, result] = note.split(" => ");

    if (result === "#") {
        // console.log(`Adding the plant creation rule: ${rule}`);
        notes[rule] = true;
    }
}

function getNumberOfAlivePots(pots) {
    return pots.length;
}

function isPotAlive(potGroup, notes) {
    return notes[potGroup];
}

let potGroup = new Array(5).fill('.');
function getPotGroup(pots, potIndex) {
    let startingPotPosition = potIndex - 2;
    // potGroup.forEach((pot, index) => potGroup[index] = potGroup[index + 1]);
    // potGroup[potGroup.length - 1] = pots.includes(potIndex) ? '#' : '.';
    for (let pot = startingPotPosition; pot <= potIndex + 2; pot++) {
        if (pots.includes(pot)) {
            potGroup[pot - startingPotPosition] = '#';
        } else {
            potGroup[pot - startingPotPosition] = '.';
        }
    }

    // console.log(`The group for pot ${potIndex} is ${potGroup.join('')}`);
    return potGroup.join('');
}

function getNextGeneration(currentPots, notes) {
    let nextPots = [];

    for (let pot = currentPots[0] - 4; pot < currentPots[currentPots.length - 1] + 4; pot++) {
        let potGroup = getPotGroup(currentPots, pot);
        if (isPotAlive(potGroup, notes)) {
            nextPots.push(pot);
        }
    }
    // console.log(convertPotsToString(nextPots));
    return nextPots;
}

function stepThroughGenerations(initialPots, notes, generations) {
    let pots = initialPots;

    for (let generation = 0; generation < generations; generation++) {
        pots = getNextGeneration(pots, notes);

        if (((generation + 1) % 100000) === 0) {
            console.log(`Completed generation ${generation}`);
            console.log(convertPotsToString(pots));
            console.log(`The sum is ${getSumOfPotsContainingPlants(pots)}`);
        }
    }

    return pots;
}

function getSumOfPotsContainingPlants(pots) {
    return _.sum(pots);
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', getLine);

stream.on('end', () => {
    let generations = 50000000000;
    let finalPots = stepThroughGenerations(currentState, notes, generations);
    console.log(`The sum of the planted pots after ${generations} generations is ${getSumOfPotsContainingPlants(finalPots)}`);
});
