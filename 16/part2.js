let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');
let operations = require('./operations.js');


let data = [];
let before = [];
let after = [];
let finished = false;
let instruction = [];

function readLine(line) {
    let parts = line.split(' ');

    if (parts[0].includes('Before')) {
        before = getRegisters(parts.slice(1));
    }

    if (parts.length && !parts[0].includes('Before') && !parts[0].includes('After')) {
        instruction = parts.map(part => {
            return Number.parseInt(part, 10);
        });
    }

    if (parts[0].includes('After')) {
        after = getRegisters(parts.slice(2));
        data.push({
            before: [...before],
            instructions: [...instruction],
            after: [...after]
        });
    }
}

function getRegisters(inputs) {
    let digits = /\d+/;
    return inputs.map(input => {
        // console.log(input.match(digits));
        return Number.parseInt(input.match(digits)[0], 10);
    });
}

let instructions = [];
function readInstruction(instruction) {
    instructions.push(instruction.split(' ').map(part => {
        return Number.parseInt(part, 10);
    }));
}

let stream = byline(fs.createReadStream('part1Input.txt', { encoding: 'utf8' }));
let stream2 = byline(fs.createReadStream('part2Input.txt', { encoding: 'utf8' }));

stream.on('data', readLine);

stream.on('end', () => {
    let opcodeNumbers = operations.determineOpcodeNumbers(data);

    stream2.on('data', readInstruction);

    stream2.on('end', () => {
        operations.performInstructions(instructions, opcodeNumbers);
    });
});




