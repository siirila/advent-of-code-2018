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

function printMap(map, units) {
    let width = map[0].length;
    let height = map.length;
    let textMap = ''

    for (let row = 0; row < height; row++) {
        let rowData = '';
        let unitsInRow = [];
        for (let column = 0; column < width; column++) {
            if (!isWall(map[row][column])) {
                if (hasUnit(column, row, units)) {
                    unitsInRow.push(getUnitAt(column, row, units));
                    rowData += getUnitAt(column, row, units).type;
                } else {
                    rowData += '.';
                }
            } else {
                rowData += '#';
            }
        }
        rowData += `\t`;
        unitsInRow.forEach(unit => rowData += `${unit.type} (${unit.hp})`);
        textMap += rowData + '\n';
    }

    return textMap;
}
exports.printMap = printMap;

function createPathfindingGrid(units, map) {
    let width = map[0].length;
    let height = map.length;
    let grid = [];

    for (let row = 0; row < height; row++) {
        let gridRow = [];
        for (let column = 0; column < width; column++) {
            if (isOccupied(column, row, units, map)) {
                gridRow.push(1);
            } else {
                gridRow.push(0);
            }
        }
        grid.push(gridRow);
    }

    return grid;
}
exports.createPathfindingGrid = createPathfindingGrid;

function createUnit(power) {
    return (x, y, type) => {
        return {
            x,
            y,
            type,
            hp: 200,
            power
        };
    }
}
exports.createUnit = createUnit;

let createGoblinUnit = createUnit(3);

let createElfUnit = createUnit(3);

function hasUnit(x, y, units) {
    return _.some(units, unit => unit.x === x && unit.y === y);
}

function getUnitAt(x, y, units) {
    return _.find(units, unit => unit.x === x && unit.y === y);
}

function getEnemyUnits(unit, units) {
    let enemyUnits = {
        'E': 'G',
        'G': 'E'
    };

    return units.filter(enemy => enemy.type === enemyUnits[unit.type]);
}

function isWall(char) {
    return char === '#';
}

function isUnit(char) {
    return char === 'G' || char === 'E';
}

function isGoblinUnit(char) {
    return char === 'G';
}

function isElfUnit(char) {
    return char === 'E';
}

function processMapRow(row, rowIndex) {
    let chars = row.split('');
    let mapRow = [];
    let unitsInRow = [];

    chars.forEach((char, index) => {
        if (isUnit(char)) {
            let createUnitFun;
            if (isElfUnit(char)) {
                createUnitFun = createElfUnit;
            } else {
                createUnitFun = createGoblinUnit;
            }
            unitsInRow.push(createUnitFun(index, rowIndex, char));
            mapRow.push('.');
        } else {
            mapRow.push(char);
        }
    });

    return {
        row: mapRow,
        units: unitsInRow
    };
}
exports.processMapRow = processMapRow;

function getMapAndUnitsFromData(data) {
    let currentRow = 0;
    let map = [];
    let units = [];

    data.forEach(rowData => {
        let { row: newRow, units: newUnits } = processMapRow(rowData, currentRow);
        currentRow++;
        map.push(newRow);
        units = units.concat(newUnits);
    });

    return {
        map,
        units
    };
}
exports.getMapAndUnitsFromData = getMapAndUnitsFromData;

function isOccupied(x, y, units, map) {
    return (isWall(map[y][x]) || _.some(units, unit => unit.x === x && unit.y === y));
}
exports.isOccupied = isOccupied;

function getAdjacentSquares(startingX, startingY) {
    let squares = [
        [startingX, startingY - 1],
        [startingX - 1, startingY],
        [startingX + 1, startingY],
        [startingX, startingY + 1],
    ];

    return squares;
}
exports.getAdjacentSquares = getAdjacentSquares;

function getOpenAdjacentSquares(unit, units, map) {
    return getAdjacentSquares(unit.x, unit.y).filter(square => !isOccupied(square[0], square[1], units, map));
}

function getEnemiesInRange(unit, units) {
    let enemiesInRange = [];
    let enemies = getEnemyUnits(unit, units);
    let adjacentSquares = getAdjacentSquares(unit.x, unit.y);

    adjacentSquares.forEach(square => {
        if (hasUnit(square[0], square[1], enemies)) {
            enemiesInRange.push(getUnitAt(square[0], square[1], enemies));
        }
    });

    return enemiesInRange;
}
exports.getEnemiesInRange = getEnemiesInRange;

function getSquaresInRangeOfEnemies(unit, units, map) {
    let enemyUnits = getEnemyUnits(unit, units);
    let squares = [];

    enemyUnits.forEach(enemy => {
        let adjacentSquares = getOpenAdjacentSquares(enemy, units, map);
        squares = squares.concat(adjacentSquares);
    });

    return squares;
}
exports.getSquaresInRangeOfEnemies = getSquaresInRangeOfEnemies;

function isAlive(unit, units) {
    return units.includes(unit);
}

function getPathToSquare(unit, square, units, map) {
    // get paths to square
    let grid = createPathfindingGrid(units, map);
    grid = new PF.Grid(grid);
    let finder = new PF.BreadthFirstFinder();
    let path;

    path = finder.findPath(unit.x, unit.y, square[0], square[1], grid);

    return path;
}

function getPathsToSquares(unit, squares, units, map) {
    // get paths to squares in range of enemies
    let paths = [];

    squares.forEach(square => {
        let path = getPathToSquare(unit, square, units, map);
        if (path.length) {
            paths.push({ square, path: path.slice(1) });
        }
    });

    return paths;
}
exports.getPathsToSquares = getPathsToSquares;

function getBestReadingOrderPath(bestCurrentPath, unit, units,  map) {
    let adjacentSquares = getOpenAdjacentSquares(unit, units, map);

    let newBestPath = adjacentSquares.map(square => {
        return getPathToSquare({ x: square[0], y: square[1]}, bestCurrentPath.square, units, map);
    }).filter(path => path.length === bestCurrentPath.path.length)[0];

    return newBestPath;
}

function move(unit, units, map) {
    // if in range of enemy already, don't move
    let enemiesInRange = getEnemiesInRange(unit, units)
    if (enemiesInRange.length) {
        return;
    }

    let squaresInRange = getSquaresInRangeOfEnemies(unit, units, map);

    if (squaresInRange.length) {
        let pathsToSquares = getPathsToSquares(unit, squaresInRange, units, map);
        pathsToSquares = _.sortBy(pathsToSquares, ['path.length', 'path.square[1]', 'path.square[0]']);
        // let pathToSquare = getPathToSquare(unit, squaresInRange[0], units, map);
        // If there is an open path to a square, move to that square
        let pathToSquare;
        if (pathsToSquares.length) {
            pathToSquare = getBestReadingOrderPath(pathsToSquares[0], unit, units, map);
        }
        // If there is an open path to a square, move to that square
        if (pathToSquare) {
            unit.x = pathToSquare[0][0];
            unit.y = pathToSquare[0][1];
        }
        return pathToSquare;
    }
}
exports.move = move;

function takeTurn(unit, units, map) {
    // move
    move(unit, units, map);

    // get adjacent enemies
    let enemies = getEnemiesInRange(unit, units);
    if (enemies.length) {
        // get weakest adjacent enemy
        let weakestEnemy = _.sortBy(enemies, ['hp', 'y', 'x'])[0];

        // attack!!!
        weakestEnemy.hp = weakestEnemy.hp - unit.power;
    }
}
exports.takeTurn = takeTurn;

function round(units, map, shouldLog = false) {
    let sortedUnits = _.sortBy(units, ['y', 'x']);
    let remainingUnits = sortedUnits;
    let isCombatOver = false;

    sortedUnits.forEach(unit => {
        if (isAlive(unit, remainingUnits)) {
            isCombatOver = getEnemyUnits(unit, remainingUnits).length === 0;
            if (isCombatOver) {
                return;
            }
            // console.log(`${unit.type} at ${unit.x}, ${unit.y} is taking their turn`);
            takeTurn(unit, remainingUnits, map);
            
            remainingUnits = remainingUnits.filter(unit => unit.hp > 0);
            // console.log(printMap(map, remainingUnits));
        }
    });
    // console.log(printMap(map, remainingUnits));

    return {
        remainingUnits,
        isCombatOver
    };
}
exports.round = round;

function performCombat(units, map) {
    let roundsCompleted = 0;
    let results = {
        remainingUnits: units,
        isCombatOver: false
    };

    while (!results.isCombatOver) {
        // console.log(`starting round ${roundsCompleted + 1}`)
        results = round(results.remainingUnits, map);
        // console.log(results.remainingUnits);
        if (!results.isCombatOver) roundsCompleted++;
    }

    let remainingHp = _.sumBy(results.remainingUnits, 'hp');

    console.log(results.remainingUnits);
    console.log(printMap(map, results.remainingUnits));
    console.log(`Completed ${roundsCompleted} rounds`);
    console.log(`Sum of remaining hp is ${remainingHp}`);
    console.log(`outcome: ${roundsCompleted * remainingHp}`);
    return {
        roundsCompleted,
        remainingHp,
        units: results.remainingUnits
    };
}
exports.performCombat = performCombat;

function getElvesWinningScenario(data) {
    let elfPower = 3;
    let results = {
        units: []
    };
    createElfUnit = createUnit(elfPower);
    let simulationData = getMapAndUnitsFromData(data);
    let elfUnitsCount = simulationData.units.filter(unit => unit.type === 'E').length;

    while (results.units.filter(unit => unit.type === 'E').length !== elfUnitsCount) {
        simulationData = getMapAndUnitsFromData(data);
        results = performCombat(simulationData.units, simulationData.map);
        elfPower++;
        createElfUnit = createUnit(elfPower);
    }

    return results;
}
exports.getElvesWinningScenario = getElvesWinningScenario;
