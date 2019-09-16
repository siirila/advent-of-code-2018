let fs = require('fs');
let _ = require('lodash');


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
    for (let y = 1; y <= grid.length; y++) {
        let line = '';
        for (let x = 1; x <= grid[0].length; x++) {
            line += `${grid[y - 1][x - 1]}\t`;
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

function getLargestPower(width, height, serialNum) {
    let greatestPower = 0;
    let greatestPowerCoordinates = {
        x: 0,
        y: 0
    };

    let grid = createGrid(width, height, serialNum);
    
    for (let y = 1; y <= height - 3; y++) {
        for (let x = 1; x <= width - 3; x++) {
            let gridPower = computePowerOfXbyXSection(x, y, grid, 3);
            if (gridPower > greatestPower) {
                greatestPower = gridPower;
                greatestPowerCoordinates = { x, y };
            }
        }
    }

    console.log(`The greatest power found was the 3x3 grid starting at ${greatestPowerCoordinates.x}, ${greatestPowerCoordinates.y}`);
    console.log(`It had power ${greatestPower}`);
}

getLargestPower(300, 300, 7347);

