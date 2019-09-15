let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


function getInitialPlayerState(numOfPlayers = 0) {
    return Array(numOfPlayers).fill(0);
}

function playGame(numOfPlayers = 0, numOfMarbles = 0) {
    let playersScores = getInitialPlayerState(numOfPlayers);
    let playBoard = [];
    let marbleToPlay = 0;
    let player = 0;
    let position = 0;

    while (marbleToPlay <= numOfMarbles) {
        if (playBoard.length === 0) {
            playBoard.push(marbleToPlay);
        } else if ((marbleToPlay % 23) === 0) {
            position = ((position + playBoard.length) - 7) % playBoard.length;
            let otherMarble = playBoard.splice(position, 1)[0];
            position = position % playBoard.length;
            // console.log(`Adding ${marbleToPlay} and ${otherMarble} to player ${player}s score`);
            playersScores[player] = marbleToPlay + playersScores[player] + otherMarble;
        } else {
            position = (position + 2) % playBoard.length;
            playBoard = playBoard.slice(0, position).concat(marbleToPlay, playBoard.slice(position))
        }

        // console.log(playBoard.join(' '));
        marbleToPlay++;
        player = (player + 1) % numOfPlayers;
    }
    // console.log(playersScores.join(' '));
    console.log(`Played a game with ${numOfPlayers} players and last marble of ${numOfMarbles}`);
    console.log(`The high score was ${_.max(playersScores)}`);
}

playGame(9, 25);
playGame(10, 1618);
playGame(13, 7999);
playGame(17, 1104);
playGame(21, 6111);
playGame(30, 5807);
playGame(446, 71522);
