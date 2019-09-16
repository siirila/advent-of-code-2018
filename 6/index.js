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

function getNearestCoordinates(point, coordinates) {
    let nearest = [];
    let nearestDistance;
    // console.log(`Point ${point.x}, ${point.y} is on the edge of the grid: ${isOnEdgeOfGrid(point)}`);

    coordinates.forEach((coordinate) => {
        let distance = computeDistance(point, coordinate.point);

        if (nearestDistance === undefined || distance < nearestDistance || distance === 0) {
            nearest = [coordinate.id];
            nearestDistance = distance;
        } else if (distance === nearestDistance) {
            nearest.push(coordinate.id);
        }
    });

    // console.log(`The nearest coordinates to ${point} are ${nearest} with a distance of ${nearestDistance}`);
    return nearest;
}

function computeNearestCoordinatesForEachPosition(grid, coordinates) {
    grid.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            let point = { x: columnIndex, y: rowIndex};
            let nearest = getNearestCoordinates(point, coordinates);
            // console.log(`Getting nearest coordinates for x ${columnIndex} y ${rowIndex}`);

            if (nearest.length === 1) {
                grid[rowIndex][columnIndex] = nearest[0];
                if (isOnEdgeOfGrid(point)) {
                    coordinates[nearest[0]].isInfinite = true;
                }

                // console.log(`Updating nearest coordinate for x ${columnIndex} y ${rowIndex}`)
            }
        });
    });
}

function getSortedClosestForEachCoordinate(grid, coordinates) {
    let coordinateTotals = {};

    grid.forEach((row) => {
        row.forEach((point) => {
            if (Number.isInteger(point)) {
                if (coordinateTotals[point]) {
                    coordinateTotals[point]++;
                } else {
                    coordinateTotals[point] = 1;
                }
            }
        });
    });

    return coordinateTotals;
}

function findGreatestCoordinateAreaWithoutInfinite(coordinates) {
    let greatestArea = 0;
    _.forEach(coordinates, (area, id) => {
        // console.log(`coordinate ${id} has area ${area}`);
        if (area > greatestArea && !globalCoordinates[id].isInfinite) {
            greatestArea = area;
            console.log(`The coordinate of ${id} is now the greatest area with area ${area}`);
        }
    });
}

function isOnEdgeOfGrid({x, y}) {
    return x === 0 || x === greatestXCoordinate || y === 0 || y === greatestYCoordinate;
}

function printGrid(grid) {
    grid.forEach((row) => {
        console.log(row.join(' '));
    });
}

function performCalculation() {
    let grid = createGrid(greatestXCoordinate, greatestYCoordinate);
    computeNearestCoordinatesForEachPosition(grid, globalCoordinates);
    // printGrid(grid);
    let coordinateTotals = getSortedClosestForEachCoordinate(grid, globalCoordinates);
    console.log(JSON.stringify(coordinateTotals));
    findGreatestCoordinateAreaWithoutInfinite(coordinateTotals);
}

let stream = byline(fs.createReadStream('6-input.txt', { encoding: 'utf8' }));

stream.on('data', saveCoordinates);

stream.on('end', performCalculation);
