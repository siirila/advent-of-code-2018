let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


let trackGrid = [];
let carts = [];
let currentRow = 0;

function getTrackPiece(x, y, type) {
    return {
        x,
        y,
        type
    };
}

function getCartPiece(x, y, direction) {
    return {
        x,
        y,
        direction,
        nextIntersection: 'l'
    };
}

function isTrack(char) {
    return !!char.match(/[-|+/\\]/);
}

function isCart(char) {
    return !!char.match(/[\^<>v]/);
}

function isVerticalCart(char) {
    return char.match(/[\^v]/);
}

function isHorizontalCart(char) {
    return char.match(/[<>]/);
}

function getTrackAt(x, y, tracks) {
    return _.find(tracks, track => track.x === x && track.y === y);
}

function getCartAt(x, y, carts) {
    return _.find(carts, cart => cart.x === x && cart.y === y);
}

function printGrid(tracks, carts) {
    let width = _.maxBy(tracks, track => track.x).x + 1;
    let height = _.maxBy(tracks, track => track.y).y + 1;

    // console.log(tracks);
    // console.log(`Printing a track grid ${width} wide and ${height} high`);

    for (let row = 0; row < height; row++) {
        let rowData = '';
        for (let column = 0; column < width; column++) {
            let cart = getCartAt(column, row, carts);
            let track = getTrackAt(column, row, tracks);
            if (cart) {
                rowData += cart.direction;
            } else if (track) {
                rowData += track.type;
            } else {
                rowData += ' ';
            }
        }
        console.log(rowData);
    }
}

function processTrackRow(row, tracks) {
    let chars = row.split('');

    chars.forEach((char, index) => {
        if (isCart(char)) {
            carts.push(getCartPiece(index, currentRow, char));
            if (isVerticalCart(char)) {
                tracks.push(getTrackPiece(index, currentRow, '|'));
            } else {
                tracks.push(getTrackPiece(index, currentRow, '-'));
            }
        } else if (isTrack(char)) {
            tracks.push(getTrackPiece(index, currentRow, char));
        }
    });
    currentRow++;
}

function checkForCollision(carts) {
    let collision;

    collision = carts.find(cart => {
        return carts.find(otherCart => {
            if ((cart.x === otherCart.x && cart.y === otherCart.y) &&
              (cart !== otherCart)) {
                return true;
            }
        });
    });

    if (collision) {
        console.log(`Carts collided at ${collision.x}, ${collision.y}`);
    }
    return collision;
}

function sortByXY(a, b) {
    if (a.y < b.y || (a.y === b.y && a.x < b.x)) {
        return -1;
    }
    if (b.y < a.y || (b.y === a.y && b.x < a.x)) {
        return 1;
    }

    return 0;
}

function setCartDirection(cart, trackPiece) {
    let downSwitch = { '>': 'v', 'v': '>', '<': '^', '^': '<'};
    let upSwitch = { '>': '^', 'v': '<', '<': 'v', '^': '>'};
    let nextIntersection = [1, 0, -1];
    let intersectionLeft = { '>': '^', '^': '<', '<': 'v', 'v': '>'};
    let intersectionRight = { '>': 'v', 'v': '<', '<': '^', '^': '>'};

    if (trackPiece.type === '\\') {
        cart.direction = downSwitch[cart.direction];
    }
    
    if (trackPiece.type === '/') {
        cart.direction = upSwitch[cart.direction];
    }

    if (trackPiece.type === '+') {
        if (cart.nextIntersection === 'l') {
            cart.direction = intersectionLeft[cart.direction];
            cart.nextIntersection = 's';
        }else if (cart.nextIntersection === 'r') {
            cart.direction = intersectionRight[cart.direction];
            cart.nextIntersection = 'l';
        } else {
            cart.nextIntersection = 'r';
        }
    }
}

function moveCart(cart, tracks) {
    if (cart.direction === '>') cart.x++;
    if (cart.direction === 'v') cart.y++;
    if (cart.direction === '<') cart.x--;
    if (cart.direction === '^') cart.y--;

    setCartDirection(cart, getTrackAt(cart.x, cart.y, tracks));
}

function tick(tracks, carts, tock) {
    carts.sort(sortByXY);
    let newCarts = [...carts];

    carts.forEach(cart => {
        if (newCarts.includes(cart)) {
            moveCart(cart, tracks);
            let collision = checkForCollision(newCarts);
            if (collision) {
                // console.log(carts);
                console.log(`Removing carts that collided at ${collision.x}, ${collision.y} at tick ${tock}`);
                newCarts = newCarts.filter((cart) => (cart.x !== collision.x) || (cart.y !== collision.y));
            }
        }
    });

    return newCarts;
}

function runTillOneCartLeft(tracks, carts) {
    let ticks = 0;
    let currentCarts = [...carts];
    while (currentCarts.length !== 1) {
        // console.log(`Tick: ${ticks}`);
        currentCarts = tick(tracks, currentCarts, ticks);
        ticks++;
    }

    console.log(`The last cart is at ${currentCarts[0].x}, ${currentCarts[0].y}`);
}

function runForever(tracks, carts) {
    let currentCarts = [...carts];
    setInterval(() => { currentCarts = tick(tracks, currentCarts); printGrid(tracks, currentCarts); }, 1000);
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', (line) => {
    processTrackRow(line, trackGrid);
});

stream.on('end', function() {
    // console.log(carts);
    // printGrid(trackGrid, carts);
    runTillOneCartLeft(trackGrid, carts);
    // runForever(trackGrid, carts);
    // checkForCollision(carts);
});