let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


let globalSteps = {};

function recordStepRequirements(stepInstructions, steps) {
    [,prerequisiteStep,,,,,,step] = stepInstructions.split(' ');
    // console.log(`Step ${prerequisiteStep} must be finished before step ${step} can begin`);

    if (steps[step]) {
        steps[step].prerequisiteSteps.push(prerequisiteStep);
    } else {
        steps[step] = {}
        steps[step].prerequisiteSteps = [prerequisiteStep];
    }

    if (!steps[prerequisiteStep]) {
        steps[prerequisiteStep] = {};
        steps[prerequisiteStep].prerequisiteSteps = [];
    }
}

function findStepsWithNoPrequisites(steps) {
    let matchingSteps = _.filter(_.toPairs(steps), (step) => {
        return step[1].prerequisiteSteps.length === 0;
    });

    matchingSteps = _.sortBy(matchingSteps, (step) => step[0]);

    return matchingSteps;
}

function removePrequisite(currentStep, prerequisiteStep) {
    currentStep.prerequisiteSteps = _.filter(currentStep.prerequisiteSteps, (currentPreq) => currentPreq !== prerequisiteStep);
}

function takeStep(step, steps, stepsTaken) {
    console.log(`Taking step ${step}`);
    stepsTaken += step;
    delete steps[step];

    _.forEach(steps, (currentStep) => {
        removePrequisite(currentStep, step);
    });

    return stepsTaken;
}

function getInstructionsOrder(steps) {
    let stepOrder = '';
    
    while(Object.keys(steps).length) {
        let nextSteps = findStepsWithNoPrequisites(steps);
        stepOrder = takeStep(nextSteps[0][0], steps, stepOrder);
        console.log(stepOrder);
    }
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', (line) => {
    recordStepRequirements(line, globalSteps);
});

stream.on('end', () => {
    getInstructionsOrder(globalSteps);
});
