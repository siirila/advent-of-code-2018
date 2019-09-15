let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');
 
let stream = byline(fs.createReadStream('2-1-input.txt', { encoding: 'utf8' }));

let processedIds = [];

function checkSimilarity(list1, list2) {
    let numberDifferent = 0;
    let matchingChars = [];
    for(let i = 0; i < list1.length; i++) {
        if (list1[i] !== list2[i]) {
            numberDifferent++;
        } else {
            matchingChars.push(list1[i]);
        }
    }

    if (numberDifferent === 1) {
        console.log(`The lists ${list1.join('')} and ${list2.join('')} are similar`);
        console.log(`The matching chars are ${matchingChars.join('')}`);
    }
}

function checkBoxId(text) {
    let textList = [...text];
    processedIds.forEach((id) => checkSimilarity(id, textList));
    processedIds.push(textList);
}

stream.on('data', checkBoxId);

stream.on('end', function() {

});

