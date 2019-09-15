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

// function indexOfScoreDigits(scores, digits) {
//     let matchingIndex;
//     scores.find((score, index) => {
//         if (score === digits[0]) {
//             let isMatching = true;
//             for (let digitsIndex = 0; digitsIndex < digits.length && isMatching; digitsIndex++) {
//                 isMatching = scores[index + digitsIndex] === digits[digitsIndex];
//             }
//             if (isMatching) {
//                 matchingIndex = index;
//             }

//             return isMatching;
//         }
//     });

//     return matchingIndex;
// }

function indexOfScoreDigits(scores, digits) {
    let matchingIndex;
    if (scores.length >= digits.length) {
        for (let scoresIndex = scores.length - digits.length - 1; scoresIndex < scores.length; scoresIndex++) {
            let score = scores[scoresIndex];
            if (score === digits[0]) {
                let isMatching = true;
                for (let digitsIndex = 0; digitsIndex < digits.length && isMatching; digitsIndex++) {
                    isMatching = scores[scoresIndex + digitsIndex] === digits[digitsIndex];
                }
                if (isMatching) {
                    matchingIndex = scoresIndex;
                }
    
                return isMatching;
            }
        }
    }

    return matchingIndex;
}

function goUntilScoreDigitsExist(scores, elfPositions, digits) {
    let state = { scores, elfPositions };
    let foundScoreDigits = false;
    while (!foundScoreDigits) {
        state = round(state.scores, state.elfPositions);

        foundScoreDigits = indexOfScoreDigits(scores, digits);
    }
    console.log(`The score was first found after position ${foundScoreDigits}`);

    return state;
}

function getNextTenScores(scores, startingScoreNum) {
    return scores.slice(startingScoreNum, startingScoreNum + 10);
}

printScoreboard(scores, elfPositions);
let scoreDigits = [5,9,4,1,4]; // 556061;
goUntilScoreDigitsExist(scores, elfPositions, scoreDigits);
