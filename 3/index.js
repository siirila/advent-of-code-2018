let fs = require('fs');
let byline = require('byline');

let stream = byline(fs.createReadStream('3-1-input.txt', { encoding: 'utf8' }));

let fabricSquares = [];

let claims = [];

function markUsedSquares({ id: claimId, leftOffset, topOffset, width, height }) {
    for (let row = topOffset; row < (height + topOffset); row++) {
        if (!Array.isArray(fabricSquares[row])) fabricSquares[row] = [];

        for (let column = leftOffset; column < (width + leftOffset); column++) {
            if (fabricSquares[row][column]) {
                fabricSquares[row][column].push(claimId);
            } else {
                fabricSquares[row][column] = [claimId];
            }
        }
    }
}

function findUniqueClaims({ id: claimId, leftOffset, topOffset, width, height }) {
    let isUnique = true;

    for (let row = topOffset; row < (height + topOffset); row++) {
        for (let column = leftOffset; column < (width + leftOffset); column++) {
            if (fabricSquares[row][column].length !== 1) isUnique = false;
        }
    }

    if (isUnique) {
        console.log(`claimId ${claimId} is a unique claim`);
    }
    return isUnique;
}

function processLine(line) {
    let [id, temp, offsets, size] = line.split(' ');

    let [leftOffset, topOffset] = offsets.split(',');
    topOffset = topOffset.slice(0, -1);
    let [width, height] = size.split('x');

    leftOffset = Number.parseInt(leftOffset, 10);
    topOffset = Number.parseInt(topOffset, 10);
    width = Number.parseInt(width, 10);
    height = Number.parseInt(height, 10); 

    // console.log(` leftOffset: ${leftOffset} topOffset: ${topOffset} width: ${width} height: ${height}`);

    let claim = {
        id,
        leftOffset,
        topOffset,
        width,
        height
    };

    claims.push(claim);

    markUsedSquares(claim);
}

function countMultiplyMarkedSquares() {
    let reusedSquares = 0;

    for (let row = 0; row < fabricSquares.length; row++) {
        for (let column = 0; column < fabricSquares[row].length; column++) {
            if (fabricSquares[row][column] && fabricSquares[row][column].length > 1) reusedSquares++;
        }
    }

    console.log(`The number of reused squares would be ${reusedSquares}`);
}

function printUniqueClaims() {
    claims.forEach(findUniqueClaims);
}

stream.on('data', processLine);

stream.on('end', printUniqueClaims);
