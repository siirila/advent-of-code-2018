let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');
 

let tree = {};

function parseNodeData(treeData) {
    let [childrenCount, metadataCount, ...otherData] = treeData;

    let node = {
        childrenCount,
        metadataCount,
        nodes: []
    };
    // console.log(`Node has ${childrenCount} children and ${metadataCount} metadata entries`);

    while (childrenCount > 0) {
        let computation = parseNodeData(otherData);
        node.nodes.push(computation.node);
        otherData = computation.otherData;
        childrenCount--;
    }

    let metadataEntries = [];
    while (metadataEntries.length < metadataCount) {
        let entry = otherData.shift();
        metadataEntries.push(entry);
    }
    node.metadata = metadataEntries;

    return {
        node,
        otherData
    };
}

function getNodeValue(node) {
    if (node.childrenCount === 0) {
        let sum = _.sum(node.metadata);
        console.log(`No children, this nodes value is: ${sum}`);
        return _.sum(node.metadata);
    }

    return node.metadata.reduce((acc, entry) => {
       if (!node.nodes[entry - 1]) {
           return acc;
       }
       return acc + getNodeValue(node.nodes[entry - 1]);
    }, 0);
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', (line) => {
    let data = parseNodeData(line.split(' ').map((num) => Number.parseInt(num, 10)));
    console.log(`This tree element is ${JSON.stringify(data.node)}`);
    console.log(`The value of the root node is ${getNodeValue(data.node)}`);
});

stream.on('end', function() {

});

