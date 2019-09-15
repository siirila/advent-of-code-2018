let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


let elfPositions=[0, 1];
let scores = [3,7];

function printScoreboard(scores, elfPositions) {
    let printedScores = '';
    scores.forEach((score, index) => {
        if (index === elfPositions[0]) {
            printedScores += `(${score})`;
        } else if (index === elfPositions[1]) {
            printedScores += `[${score}]`;
        } else {
            printedScores += ` ${score} `;
        }
    });

    console.log(printedScores);
}

function addNewRecipeScores(scores, elfPositions) {
    let sum = scores[elfPositions[0]] + scores[elfPositions[1]];
    if (sum > 9) scores.push(1);
    scores.push(sum % 10);

    return scores;
}

function stepElvesForward(scores, elfPositions) {
    return elfPositions.map(elfPosition => {
        return (elfPosition + scores[elfPosition] + 1) % scores.length;
    });
}

function round(scores, elfPositions) {
    scores = addNewRecipeScores(scores, elfPositions);
    elfPositions = stepElvesForward(scores, elfPositions);
    // printScoreboard(scores, elfPositions);
    return {
        scores,
        elfPositions
    };
}

function goXRounds(numberOfRounds, scores, elfPositions) {
    let state = { scores, elfPositions };
    for (let roundNum = 0; roundNum < numberOfRounds; roundNum++) {
        state = round(state.scores, state.elfPositions);
    }
}

function goUntilScoreLongerThan(minScoreLength, scores, elfPositions) {
    let state = { scores, elfPositions };
    while (state.scores.length < minScoreLength) {
        state = round(state.scores, state.elfPositions);
    }

    return state;
}

function getNextTenScores(scores, startingScoreNum) {
    return scores.slice(startingScoreNum, startingScoreNum + 10);
}

printScoreboard(scores, elfPositions);
let recipesToCreate = 556061;
goUntilScoreLongerThan(recipesToCreate + 10, scores, elfPositions);
console.log(`The scores we are looking for are ${getNextTenScores(scores, recipesToCreate).join('')}`);