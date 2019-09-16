let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');

let globalCoordinates = [];
let greatestXCoordinate = 0;
let greatestYCoordinate = 0;


function saveCoordinates(line) {
    let [x, y] = line.split(',');
    x = Number.parseInt(x.trim(), 10);
    y = Number.parseInt(y.trim(), 10);
    globalCoordinates.push({
        id: globalCoordinates.length,
        point: {
            x,
            y
        }
    });

    greatestXCoordinate = Math.max(greatestXCoordinate, x);
    greatestYCoordinate = Math.max(greatestYCoordinate, y);
}

function createGrid(width, height) {
    console.log(`Creating a ${width + 1} by ${height + 1} grid`);
    let grid = [];
    for (let row = 0; row <= height; row++) {
        grid.push(new Array(width + 1).fill('.'));
    }

    return grid;
}

function computeDistance({x: x1, y: y1}, {x: x2, y: y2}) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function getSumOfCoordinateDistances(point, coordinates) {
    let sumOfDistances = 0;

    coordinates.forEach((coordinate) => {
        let distance = computeDistance(point, coordinate.point);
        sumOfDistances += distance;
    });

    return sumOfDistances;
}

function computeSumOfCoordinatesForEachPosition(grid, coordinates) {
    grid.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            let point = { x: columnIndex, y: rowIndex};
            let sum = getSumOfCoordinateDistances(point, coordinates);
            // console.log(`Getting nearest coordinates for x ${columnIndex} y ${rowIndex}`);
            grid[rowIndex][columnIndex] = sum;
        });
    });
}

function getSizeOfRegionWithinTravelDistance(grid, travelDistance) {
    let size = 0;

    grid.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            if (column < travelDistance) size++;
        });
    });

    return size;
}

function printGrid(grid) {
    grid.forEach((row) => {
        console.log(row.join(' '));
    });
}

function performCalculation() {
    let grid = createGrid(greatestXCoordinate, greatestYCoordinate);
    computeSumOfCoordinatesForEachPosition(grid, globalCoordinates);
    // printGrid(grid);
    let regionSize = getSizeOfRegionWithinTravelDistance(grid, 10000);
    console.log(`The size of the region is ${regionSize}`);
}

let stream = byline(fs.createReadStream('6-input.txt', { encoding: 'utf8' }));

stream.on('data', saveCoordinates);

stream.on('end', performCalculation);
