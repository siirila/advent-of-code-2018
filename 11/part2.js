let fs = require('fs');
let _ = require('lodash');



function createGrid(width, height, serialNum) {
    let grid = [];

    for (let y = 0; y <= height; y++) {
        grid.push(new Array(width).fill(0));
        for (let x = 0; x <= width; x++) {
            let power = computePowerForGridPosition(x, y, serialNum);
            grid[y][x] = power;
        }
    }

    return grid;
}

function printGrid(grid) {
    for (let y = 1; y < grid.length; y++) {
        let line = '';
        for (let x = 1; x < grid[0].length; x++) {
            line += `${grid[y][x]}\t`;
        }
        console.log(line);
    }
}

function printGridPortion(grid, startingX, startingY, width, height) {
    for (let y = startingY; y <= startingY + height; y++) {
        let line = '';
        for (let x = startingX; x <= startingX + width; x++) {
            line += `${grid[y][x]}\t`;
        }
        console.log(line);
    }
}

function computePowerForGridPosition(x, y, serialNum) {
    let rackId = x + 10;
    let power = rackId;
    power = rackId * y;
    power += serialNum;
    power *= rackId;
    power = Math.floor((power / 100) % 10);
    power -= 5;
    return power;
}

function computePowerOfXbyXSection(startingX, startingY, grid, sectionSize) {
    let gridPower = 0;

    for (let y = startingY; y < startingY + sectionSize; y++) {
        for (let x = startingX; x < startingX + sectionSize; x++) {
            gridPower += grid[y][x];
        }
    }
    
    return gridPower;
}

function getRowSum(x, y, length, grid) {
    let sum = 0;
    for (let pos = x; pos < x + length; pos++) {
        sum += grid[y][pos];
    }

    return sum;
}

function getColumnSum(x, y, height, grid) {
    let sum = 0;
    for (let pos = y; pos < y + height; pos++) {
        sum += grid[pos][x];
    }

    return sum;
}

function getGreatestPowerSectionStartingAtOld(x, y, grid) {
    let greatestSquarePossible = Math.min(grid.length - y - 1, grid[0].length - x - 1);
    let greatestPowerCoordinatesAndSize = {
        x,
        y,
        size: 0,
        power: undefined
    };
    let currentPower = 0;

    for (let gridSize = 1; gridSize <= greatestSquarePossible; gridSize++) {
        currentPower = computePowerOfXbyXSection(x, y, grid, gridSize);

        if (!greatestPowerCoordinatesAndSize.power || currentPower > greatestPowerCoordinatesAndSize.power) {
            greatestPowerCoordinatesAndSize.size = gridSize;
            greatestPowerCoordinatesAndSize.power = currentPower;
        }
    }

    return greatestPowerCoordinatesAndSize;
}

function getGreatestPowerSectionStartingAt(x, y, grid) {
    let greatestSquarePossible = Math.min(grid.length - y - 1, grid[0].length - x - 1);
    let greatestPowerCoordinatesAndSize = {
        x,
        y,
        size: 0,
        power: undefined
    };
    let currentPower = 0;

    for (let gridSize = 1; gridSize <= greatestSquarePossible; gridSize++) {
        currentPower = currentPower +
        getColumnSum(x + gridSize - 1, y, gridSize, grid) +
        getRowSum(x, y + gridSize - 1, gridSize - 1, grid);
        // console.log(`The power for a ${gridSize}x${gridSize} grid starting at ${x}, ${y} is ${currentPower}`);

        if (!greatestPowerCoordinatesAndSize.power || currentPower > greatestPowerCoordinatesAndSize.power) {
            greatestPowerCoordinatesAndSize.size = gridSize;
            greatestPowerCoordinatesAndSize.power = currentPower;
        }
    }

    return greatestPowerCoordinatesAndSize;
}

function printColumnAndRowSums(grid) {
    for (let y = 1; y < grid.length; y++) {
        console.log(`The row sum for row ${y} is ${getRowSum(1, y, grid[0].length - 1, grid)}`);
    }

    for (let x = 1; x < grid[0].length; x++) {
        console.log(`The column sum for row ${x} is ${getColumnSum(x, 1, grid.length - 1, grid)}`);
    }
}

function getLargestPower(width, height, serialNum) {
    let greatestPower = 0;
    let greatestPowerCoordinates = {
        x: 0,
        y: 0
    };
    let greatestPowerGridSize = 0;

    let grid = createGrid(width, height, serialNum);
    // printGrid(grid);
    // printColumnAndRowSums(grid);

    for (let y = 1; y <= height; y++) {
        for (let x = 1; x <= width; x++) {
            let gridPower = getGreatestPowerSectionStartingAt(x, y, grid);
            if (gridPower.power > greatestPower) {
                greatestPower = gridPower.power;
                greatestPowerCoordinates = { x, y };
                greatestPowerGridSize = gridPower.size;
            }
        }
    }

    console.log(`The greatest power found was the ${greatestPowerGridSize}x${greatestPowerGridSize} grid starting at ${greatestPowerCoordinates.x}, ${greatestPowerCoordinates.y}`);
    console.log(`It had power ${greatestPower}`);
}

getLargestPower(300, 300, 7347);
