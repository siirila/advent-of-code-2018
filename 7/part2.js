let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


let globalSteps = {};
let stepTime = ['',...'ABCDEFGHIJKLMNOPQRSTUVQXYZ'];

function recordStepRequirements(stepInstructions, steps) {
    [,prerequisiteStep,,,,,,step] = stepInstructions.split(' ');
    // console.log(`Step ${prerequisiteStep} must be finished before step ${step} can begin`);

    if (steps[step]) {
        steps[step].prerequisiteSteps.push(prerequisiteStep);
    } else {
        steps[step] = {
            prerequisiteSteps: [prerequisiteStep],
            stepTime: stepTime.indexOf(step) + 60
        };
    }

    if (!steps[prerequisiteStep]) {
        steps[prerequisiteStep] = {
            prerequisiteSteps: [],
            stepTime: stepTime.indexOf(prerequisiteStep) + 60
        };
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

function startWorkingStep(step, steps) {
    // console.log(`Starting work on step ${step}`);
    delete steps[step];
}

function completeStep(step, steps, stepsTaken) {
    // console.log(`Completing step ${step}`);
    stepsTaken += step;

    _.forEach(steps, (currentStep) => {
        removePrequisite(currentStep, step);
    });

    return stepsTaken;
}

function assignStepsToWorkers(availableSteps, workers, maxWorkers, allSteps) {
    while (workers.length < maxWorkers && availableSteps.length) {
        let newWorker = getWorker();
        let step = availableSteps.shift();
        newWorker.isWorking = true;
        newWorker.step = step[0];
        newWorker.stepTime = step[1].stepTime;

        workers.push(newWorker);
        startWorkingStep(step[0], allSteps);
    }
}

function workOnSteps(workers, steps) {
    workers.forEach((worker) => {
        worker.elapsedTimeOnStep++;
    });
}

function getCompletedSteps(workers, steps) {
    let completedSteps = [];
    // console.log(JSON.stringify(steps));
    workers.forEach((worker) => {
        // console.log(`working on step ${worker.step}`);
        if (worker.elapsedTimeOnStep === worker.stepTime) {
            completedSteps.push(worker.step);
        }
    });

    return completedSteps;
}

function removeCompletedWorkers(workers) {
    return _.filter(workers, (worker) => {
        return worker.elapsedTimeOnStep !== worker.stepTime
    });
}

function getWorker() {
    return {
        isWorking: false,
        step: '',
        elapsedTimeOnStep: 0
    };
}

function getTotalTime(steps, maxWorkers = 2) {
    let workers = [];
    let elapsedTime = 0;
    let stepsTaken = '';

    while (Object.keys(steps).length || workers.length) {
        workOnSteps(workers, steps);

        // Mark any steps complete that are done now
        let completedSteps = getCompletedSteps(workers, steps);
        completedSteps.forEach((step) => {
            stepsTaken = completeStep(step, steps, stepsTaken);
        });
        workers = removeCompletedWorkers(workers);

        if (workers.length < maxWorkers) {
            // Find new steps to work
            let availableSteps = findStepsWithNoPrequisites(steps);
            assignStepsToWorkers(availableSteps, workers, maxWorkers, steps);
        }

        elapsedTime++;
    }

    console.log(`The steps were resolved in order ${stepsTaken} in time ${elapsedTime - 1}`);
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', (line) => {
    recordStepRequirements(line, globalSteps);
});

stream.on('end', () => {
    getTotalTime(globalSteps, 5);
});
