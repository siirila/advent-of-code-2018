let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


let points = [];

function getMinOfProperty(points, property) {
    return _.minBy(points, (point) => point[property])[property];
}

function getMaxOfProperty(points, property) {
   return  _.maxBy(points, (point) => point[property])[property];
}

function drawGrid(points) {
    let minX = getMinOfProperty(points, 'x');
    let maxX = getMaxOfProperty(points, 'x');
    let minY = getMinOfProperty(points, 'y');
    let maxY = getMaxOfProperty(points, 'y');

    console.log(`minX ${minX} maxX ${maxX} minY ${minY} maxY ${maxY}`);
    for (let y = minY; y <= maxY; y++) {
        let line = '';
        for (let x = minX; x <= maxX; x++) {
            if (_.some(points, (point) => point.x === x && point.y === y)) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }

    console.log('\n\n\n');
}

function getNumbers(text) {
    let [x, y] = text.split(',');
    x = Number.parseInt(x.trim());
    y = Number.parseInt(y.trim());

    return [x, y];
}

function addPoint(line) {
    let [position, velocity] = line.split('>');
    position = position.split('<')[1];
    velocity = velocity.split('<')[1];
    let [x, y] = getNumbers(position);
    let [xVelocity, yVelocity] = getNumbers(velocity);

    points.push({
        x,
        y,
        xVelocity,
        yVelocity
    });

    console.log(`The position and velocity of this point are ${x},${y} ${xVelocity}, ${yVelocity}`);
}

function elapseSecond(points) {
    points.forEach(point => {
        point.x += point.xVelocity;
        point.y += point.yVelocity
    });

    return points;
}

function chartSeconds(points, secondsToRender) {
    for (let second = 0; second <= secondsToRender; second++) {
        if (arePointsCloseVertically(points)) {
            drawGrid(points);
            console.log(`Message appeared after ${second} seconds`);
        }
        elapseSecond(points);
    }
}

function arePointsCloseVertically(points) {
    let minY = getMinOfProperty(points, 'y');
    let maxY = getMaxOfProperty(points, 'y');

    return (maxY - minY) <= 10;
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', addPoint);

stream.on('end', () => {
    // console.log(points);
    chartSeconds(points, 30000);
});
