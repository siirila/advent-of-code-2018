let _ = require('lodash');
let PF = require('pathfinding');


function sortByXY(a, b) {
    if (a.y < b.y || (a.y === b.y && a.x < b.x)) {
        return -1;
    }
    if (b.y < a.y || (b.y === a.y && b.x < a.x)) {
        return 1;
    }

    return 0;
}

function printMap(map) {
    map.forEach(row => {
        console.log(row.join(''));
    });
}
exports.printMap = printMap;

function isTrees(char) {
    return char === '|';
}

function isLumberyard(char) {
    return char === '#';
}

function isOpen(char) {
    return char === '.';
}

function getMap(data) {
    let map = [];

    data.forEach(row => {
        map.push(row.split(''));
    });

    return map;
}
exports.getMap = getMap;

function getAdjacentSquares(startingX, startingY, map) {
    let mapHeight = map.length;
    let mapWidth = map[0].length;
    let squares = [];
    for (let x = Math.max(0, startingX - 1); x < Math.min(startingX + 2, mapWidth); x++) {
        for (let y = Math.max(0, startingY - 1); y < Math.min(startingY + 2, mapHeight); y++) {
            if (!(x === startingX && y === startingY)) {
                squares.push(map[y][x]);
            }
        }
    }

    return squares;
}
exports.getAdjacentSquares = getAdjacentSquares;

function getNextState(acre, x, y, map) {
    let adjacentAcres = getAdjacentSquares(x, y, map);
    let nextState = acre;
    
    if (isOpen(acre)) {
        if (adjacentAcres.filter(isTrees).length >= 3) {
            nextState = '|';
        }
    }

    if (isTrees(acre)) {
        if (adjacentAcres.filter(isLumberyard).length >= 3) {
            nextState = '#';
        }
    }

    if (isLumberyard(acre)) {
        if (adjacentAcres.filter(isLumberyard).length && adjacentAcres.filter(isTrees).length) {
            nextState = '#';
        } else {
            nextState = '.';
        }
    }

    return nextState;
}

function round(map) {
    let newMap = [];

    map.forEach((row, rowIndex) => {
        let newRow = [];
        row.forEach((acre, acreIndex) => {
            newRow.push(getNextState(acre, acreIndex, rowIndex, map));
        });
        newMap.push(newRow);
    });

    return newMap;
}
exports.round = round;

function elapseMinutes(map, minutes) {
    let minute = 0;
    let newMap = map;

    while (minute < minutes) {
        if ((minute % 10000) === 0) {
            // console.log(`Map after minute ${minute}`);
            // printMap(newMap);
            // console.log(`\n\n`);
            collectLumberAndLumberyards(newMap, minute);
        }
        newMap = round(newMap);
        minute++;
    }
    console.log(`Map after minute ${minute}`);
    printMap(newMap);

    return newMap;
}
exports.elapseMinutes = elapseMinutes;

function collectLumberAndLumberyards(map, minute = 0) {
    let lumber = 0;
    let lumberyards = 0;

    map.forEach((row) => {
        row.forEach((acre) => {
            if (isTrees(acre)) lumber++;
            if (isLumberyard(acre)) lumberyards++;
        });
    });

    // console.log(`There were ${lumber} trees and ${lumberyards} lumberyards found`);
    console.log(`At minute ${minute} the score is ${lumber * lumberyards}`);
}
exports.collectLumberAndLumberyards = collectLumberAndLumberyards;
