let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');
 

let tree = {};
let metadataSum = 0;

function parseNodeData(treeData, node) {
    let [childrenCount, metadataCount, ...otherData] = treeData;

    node = {
        childrenCount,
        metadataCount,
        data: {}
    };
    console.log(`Node has ${childrenCount} children and ${metadataCount} metadata entries`);

    while (childrenCount > 0) {
        otherData = parseNodeData(otherData, node.data);
        childrenCount--;
    }

    let metadataEntries = [];
    while (metadataEntries.length < metadataCount) {
        let entry = otherData.shift();
        metadataEntries.push(entry);
        metadataSum += entry;
    }
    node.data.metadata = metadataEntries;

    console.log(`This tree element is ${JSON.stringify(node)}`);
    console.log(`The sum of the metadata entries is: ${metadataSum}`);

    return otherData;
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', (line) => {
    parseNodeData(line.split(' ').map((num) => Number.parseInt(num, 10)));
});

stream.on('end', function() {

});

