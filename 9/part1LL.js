let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


class Node {
    constructor (value, next, prev) {
      this.value = value;
      this.next = next || this;
      this.previous = prev || this;
    }
  
    append (value) {
        // console.log(`Before insertion this.value is ${this.value} this.next value is ${this.next.value}`);
        let newNode = new Node(value, this.next, this);
        let oldNext = this.next;
        this.next = newNode;
        oldNext.previous = newNode;

        // console.log(`After insertion this.value is ${this.value} this.next value is ${this.next.value}`);

        return newNode;
    }
  
    remove () {
        if (this.next === this && this.previous === this) {
            throw Error(`Tried to delete only item in linked list`);
        }
  
        this.previous.next = this.next;
        this.next.previous = this.previous;
  
        return this.next;
    }

    printNodes () {
        let nodes = this.value.toString();
        let currentNode = this.next;
        while (currentNode !== this) {
            // console.log(`Nodes so far ${nodes}`);
            nodes += ' ' + currentNode.value.toString();
            currentNode = currentNode.next;
        }

        return nodes;
    }
}

function getInitialPlayerState(numOfPlayers = 0) {
    return Array(numOfPlayers).fill(0);
}

function playGame(numOfPlayers = 0, numOfMarbles = 0) {
    let playersScores = getInitialPlayerState(numOfPlayers);
    let marbleToPlay = 0;
    let player = 0;
    let position;
    let initialPosition;

    while (marbleToPlay <= numOfMarbles) {
        if (!position) {
            initialPosition = position = new Node(marbleToPlay);
            // console.log(initialPosition.printNodes());
        } else if ((marbleToPlay % 23) === 0) {
            // console.log(`Removing a marble starting at value ${position.value}`);
            // console.log(position.printNodes());
            position = position.previous.previous.previous.previous.previous.previous.previous;
            // console.log(`The value of the removed marbles next is ${position.next.value}`);
            // console.log(`The value of the removed marble is ${position.value}`);
            let otherMarble = position.value;
            position = position.remove();
            // console.log(`Adding ${marbleToPlay} and ${otherMarble} to player ${player}s score`);
            playersScores[player] = marbleToPlay + playersScores[player] + otherMarble;
        } else {
            position = position.next;
            // console.log(`Inserting ${marbleToPlay} after ${position.value}`);
            position = position.append(marbleToPlay);
        }

        // console.log(playBoard.join(' '));
        marbleToPlay++;
        player = (player + 1) % numOfPlayers;
    }
    // console.log(playersScores.join(' '));
    // console.log(initialPosition.printNodes());
    console.log(`Played a game with ${numOfPlayers} players and last marble of ${numOfMarbles}`);
    console.log(`The high score was ${_.max(playersScores)}`);
}

playGame(9, 25);
playGame(10, 1618);
playGame(13, 7999);
playGame(17, 1104);
playGame(21, 6111);
playGame(30, 5807);
playGame(446, 71522 * 100);
