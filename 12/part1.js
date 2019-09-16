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

function convertPotsToString(pots) {
    return pots.map(pot => {
        if (pot.isAlive) return "#";
        return ".";
    }).join('');
}

function getPot(position, isAlive) {
    return {
        position,
        isAlive
    };
}

function setInitialPotsState(pots) {
    let initialPotsState = [];
    pots.split('').forEach((pot, index) => {
        initialPotsState.push(getPot(index, pot === "#"));
    });
    initialPotsState = padWithEmptyPots(initialPotsState);
    currentState = initialPotsState;
    console.log(`Set initial state to: ${convertPotsToString(initialPotsState)}`);
}

function setNote(note) {
    let [rule, result] = note.split(" => ");

    if (result === "#") {
        // console.log(`Adding the plant creation rule: ${rule}`);
        notes[rule] = true;
    }
}

function padWithEmptyPots(pots) {
    let paddedPots = pots;
    while (_.findIndex(paddedPots, pot => pot.isAlive) < 5) {
        paddedPots = [getPot(paddedPots[0].position - 1, false), ...paddedPots];
    }

    while (_.findLastIndex(paddedPots, pot => pot.isAlive) > (paddedPots.length - 5)) {
        paddedPots = [...paddedPots, getPot(paddedPots[paddedPots.length - 1].position + 1, false)];
    }

    return paddedPots;
}

function getNumberOfAlivePots(pots) {
    return _.filter(pots, (pot) => pot === "#").length;
}

function isPotAlive(potGroup, notes) {
    return notes[convertPotsToString(potGroup)];
}

function getNextGeneration(currentPots, notes) {
    let nextPots = [];

    for (let pot = 2; pot < (currentPots.length - 2); pot++) {
        let potGroup = currentPots.slice(pot - 2, pot + 3);
        if (isPotAlive(potGroup, notes)) console.log(`Pot ${currentPots[pot].position} is alive in the next generation`);
        nextPots.push(getPot(currentPots[pot].position, isPotAlive(potGroup, notes)));
    }
    nextPots = padWithEmptyPots(nextPots);
    // console.log(convertPotsToString(nextPots));
    return nextPots;
}

function getMatchingGeneration(currentGen, generations) {
    let possibleMatches = _.filter(generations, (generation) => {
        generation.sum === currentGen.sum
    });

    return _.first(possibleMatches, (generation) => {
        return _.difference(currentGen.pots, generation.pots).length === 0;
    });
}

function stepThroughGenerations(initialPots, notes, generations) {
    let pots = initialPots;
    let history = [];
    history.push({
        pots,
        generation: 0,
        sum: getSumOfPotsContainingPlants(pots)
    });

    for (let generation = 0; generation < generations; generation++) {
        pots = getNextGeneration(pots, notes);
        let currentGen = {
            pots,
            generation,
            sum: getSumOfPotsContainingPlants(pots)
        };
        history.push(currentGen);

        let matchingGeneration = getMatchingGeneration(currentGen, history);
        if (matchingGeneration) {
            console.log(`WE FOUND A LOOP at generation ${matchingGeneration.generation}`);
        }

        if ((generation % 10000) === 0) {
            console.log(`Completed generation ${generation}`);
        }
    }

    return pots;
}

function getSumOfPotsContainingPlants(pots) {
    return _.sumBy(_.filter(pots, pot => pot.isAlive), pot => pot.position);
}

let stream = byline(fs.createReadStream('testinput.txt', { encoding: 'utf8' }));

stream.on('data', getLine);

stream.on('end', () => {
    let generations = 1; // 50000000000;
    console.log(convertPotsToString(currentState));
    let finalPots = stepThroughGenerations(currentState, notes, generations);
    console.log(convertPotsToString(finalPots));
    console.log(`The sum of the planted pots after ${generations} generations is ${getSumOfPotsContainingPlants(finalPots)}`);
});
