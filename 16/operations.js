let _ = require('lodash');

function getReg(registers, registerNum) {
    return registers[registerNum];
}

function setReg(registers, registerNum, value) {
    registers[registerNum] = value;
}

function addr(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) + getReg(registers, b));
}


function addi(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) + b);
}

function mulr(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) * getReg(registers, b));
}

function muli(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) * b);
}

function banr(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) & getReg(registers, b));
}

function bani(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) & b);
}

function borr(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) | getReg(registers, b));
}

function bori(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) | b);
}

function setr(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a));
}

function seti(registers, [op, a, b, c]) {
    setReg(registers, c, a);
}

function gtir(registers, [op, a, b, c]) {
    setReg(registers, c, a > getReg(registers, b) ? 1 : 0);
}

function gtri(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) > b ? 1 : 0);
}

function gtrr(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) > getReg(registers, b) ? 1 : 0);
}

function eqir(registers, [op, a, b, c]) {
    setReg(registers, c, a === getReg(registers, b) ? 1 : 0);
}

function eqri(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) === b ? 1 : 0);
}

function eqrr(registers, [op, a, b, c]) {
    setReg(registers, c, getReg(registers, a) === getReg(registers, b) ? 1 : 0);
}

let opcodes = {
    addr,
    addi,
    mulr,
    muli,
    banr,
    bani,
    borr,
    bori,
    setr,
    seti,
    gtir,
    gtri,
    gtrr,
    eqir,
    eqri,
    eqrr
};

function findMatchingOpcodes({ before, instructions, after }) {
    let matchingOpcodes = [] 
    _.forEach(opcodes, (op, opcode) => {
        let regs = [...before];
        op(regs, instructions);
        // console.log(`Testing opcode ${opcode}: results ${regs}`);
        let matches = true;
        regs.forEach((reg, index) => {
            if (reg !== after[index]) matches = false;
        });
        
        if (matches) {
            matchingOpcodes.push(opcode);
        }
    });

    return matchingOpcodes;
}
exports.findMatchingOpcodes = findMatchingOpcodes;

function findAllThatMatchThreeOrMoreOpcodes(data) {
    let numberMatching = 0;

    data.forEach(instruction => {
        if (findMatchingOpcodes(instruction).length >= 3) {
            numberMatching++;
        }
    });

    return numberMatching;
}
exports.findAllThatMatchThreeOrMoreOpcodes = findAllThatMatchThreeOrMoreOpcodes;

function determineOpcodeNumbers(data) {
    let possibleOpcodes = {};
    
    data.forEach(instruction => {
        let number = instruction.instructions[0];
        if (possibleOpcodes[number]) {
            possibleOpcodes[number].push(findMatchingOpcodes(instruction));
        } else {
            possibleOpcodes[number] = [findMatchingOpcodes(instruction)]
        }
    });

    // let matchesToRemove = [];
    // _.forEach(possibleOpcodes, (matches, opcodeNumber) => {
    //     let matchedEachRun = _.intersection(...matches);
    //     if (matchedEachRun.length === 1) {
    //         matchesToRemove.push({ opcodeNumber, opcode: matchedEachRun[0]});
    //         console.log(`Found a matching number of ${opcodeNumber} for opcode ${matchedEachRun[0]}`);
    //     }
    // });
    return getUniqueOpcodeNumbers(possibleOpcodes);
}
exports.determineOpcodeNumbers = determineOpcodeNumbers;

function getUniqueOpcodeNumbers(possibleOpcodes, matchesSoFar = {}) {
    if (_.size(possibleOpcodes) === 0) {
        return matchesSoFar;
    } else {
        let matchesToRemove = [];
        let newPossibleOpcodes = {...possibleOpcodes};
        _.forEach(possibleOpcodes, (matches, opcodeNumber) => {
            let matchedEachRun = _.intersection(...matches);
            if (matchedEachRun.length === 1) {
                matchesSoFar[opcodeNumber] = matchedEachRun[0];
                delete newPossibleOpcodes[opcodeNumber];
                matchesToRemove.push(matchedEachRun[0]);
                console.log(`Found a matching number of ${opcodeNumber} for opcode ${matchedEachRun[0]}`);
            }
        });

        newPossibleOpcodes = _.mapValues(newPossibleOpcodes, possibleOpcodes => {
            return possibleOpcodes.map(possibleOpcodesList => _.difference(possibleOpcodesList, matchesToRemove));
        });

        return getUniqueOpcodeNumbers(newPossibleOpcodes, matchesSoFar);
    }
}

function performInstructions(instructions, opcodeMapping) {
    let registers = [0, 0, 0, 0];

    instructions.forEach(instruction => {
        opcodes[opcodeMapping[instruction[0]]](registers, instruction);
    });

    console.log(`The state of the registers after all instructions is ${registers}`);
}
exports.performInstructions = performInstructions;
