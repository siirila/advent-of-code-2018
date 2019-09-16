let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');

let stream = byline(fs.createReadStream('4-input.txt', { encoding: 'utf8' }));

let entries = [];

let sleepingTimes = {};

function processLine(line) {
    entries.push(line);
}

function parseEntry(entry) {
    let [dateTimePortion, action] = entry.split(']');
    dateTimePortion = dateTimePortion.slice(1);
    let [date, time] = dateTimePortion.split(' ');
    let [year, month, day] = date.split('-');
    let [hour, minute] = time.split(':');
    minute = Number.parseInt(minute, 10);

    return {
        year,
        month,
        day,
        hour,
        minute,
        action
    };
}

function isWakingUp(action) {
    return action.includes('wakes up');
}

function isFallingAsleep(action) {
    return action.includes('falls asleep');
}

function isGuardShift(action) {
    return action.includes('begins shift');
}

function beginsShift(action) {
    let [guard, guardNum] = action.trim().split(' ');
    guardNum = guardNum.slice(1);
    return guardNum;
}

function computeGuardsSleepingTimes(entries) {
    let state = {
        guardNum: undefined,
        isAsleep: false,
        timeFellAsleep: 0,
        timeWokeUp: 0
    };

    entries.forEach(entry => {
        let {action, minute} = parseEntry(entry);

        if (isGuardShift(action)) {
            state.guardNum = beginsShift(action);
            state.isAsleep = false;
            state.timeFellAsleep = 0;
        } else if (isFallingAsleep(action)) {
            state.isAsleep = true;
            state.timeFellAsleep = minute;
        } else if (isWakingUp(action)) {
            if (state.isAsleep) {
                state.timeWokeUp = minute;

                recordSleepTime(state);
            } else {
                console.log('HOW CAN YOU WAKE UP WHEN YOU ARE NOT ASLEEP');
            }
        } else {
            console.log('SOMETHING WENT WRONG!!!!!!');
        }
    });
}

function recordSleepTime(entry) {
    if (sleepingTimes[entry.guardNum]) {
        sleepingTimes[entry.guardNum].push([entry.timeFellAsleep, entry.timeWokeUp]);
    } else {
        sleepingTimes[entry.guardNum] = [[entry.timeFellAsleep, entry.timeWokeUp]];
    }
}

function getLongestSleeper(sleepingTimes) {
    let totalSleepTimes =  _.mapValues(sleepingTimes, (sleepWindows) => {
        return sleepWindows.reduce((totalTimeSlept, currentSleepWindow) => {
            return totalTimeSlept + (currentSleepWindow[1] - currentSleepWindow[0]);
        }, 0);
    });

    let longestSleeper = {
        guardNum: undefined,
        totalSleepTime: 0
    };
    console.log(JSON.stringify(totalSleepTimes));

    _.forEach(totalSleepTimes, (sleepTime, guardNum) => {
        if (sleepTime > longestSleeper.totalSleepTime) {
            longestSleeper.guardNum = guardNum;
            longestSleeper.totalSleepTime = sleepTime;
        }
    });

    return longestSleeper;
}

function getMostFrequentMinuteAsleep(guardSleepTimes) {
    let minutes = new Array(60).fill(0);

    guardSleepTimes.forEach((sleepWindow) => {
        for (let minute = sleepWindow[0]; minute < sleepWindow[1]; minute++) {
            minutes[minute]++;
        }
    });

    let mostFrequentMinute = 0;
    let greatestFrequencyAsleep = 0;

    minutes.forEach((asleepFrequency, minute) => {
        if (asleepFrequency > greatestFrequencyAsleep) {
            mostFrequentMinute = minute;
            greatestFrequencyAsleep = asleepFrequency;
        }
    });
    return {
        minute: mostFrequentMinute,
        frequencyAtThatMinute: greatestFrequencyAsleep
    };
}

function getGuardAndMinuteMostCommonlyAsleep(sleepingTimes) {
    let mostFrequentMinute = 0;
    let greatestFrequencyAsleep = 0;
    let guardNum;

    _.forEach(sleepingTimes, (guardSleepTimes, currentGuardNum) => {
        let mostFrequentMinuteForGuard = getMostFrequentMinuteAsleep(guardSleepTimes);
        console.log(`Guard ${currentGuardNum} slept most frequently at ${mostFrequentMinuteForGuard.minute}`);
        if (mostFrequentMinuteForGuard.frequencyAtThatMinute > greatestFrequencyAsleep) {
            mostFrequentMinute = mostFrequentMinuteForGuard.minute;
            greatestFrequencyAsleep = mostFrequentMinuteForGuard.frequencyAtThatMinute;
            guardNum = currentGuardNum;
        }
    });

    return {
        minute: mostFrequentMinute,
        guardNum
    };
}

function findResult() {
    entries.sort();

    computeGuardsSleepingTimes(entries);
    console.log(JSON.stringify(sleepingTimes['2251']));
    let totalSleepTimes = getLongestSleeper(sleepingTimes);

    console.log(JSON.stringify(totalSleepTimes));
    let minuteMostOftenAsleep = getMostFrequentMinuteAsleep(sleepingTimes[totalSleepTimes.guardNum]).minute;
    console.log(`Guard ${totalSleepTimes.guardNum} is most often asleep at minute ${minuteMostOftenAsleep}`);
    console.log(`The guard num times the minute is ${Number.parseInt(totalSleepTimes.guardNum) * minuteMostOftenAsleep}`);
    let guardAndMinute = getGuardAndMinuteMostCommonlyAsleep(sleepingTimes);

    console.log(`The most frequent minute asleep by any guard was ${guardAndMinute.minute} by guardNum ${guardAndMinute.guardNum}`);
    console.log(`The guardNum times minute is ${Number.parseInt(guardAndMinute.guardNum, 10) * guardAndMinute.minute}`);
}

stream.on('data', processLine);

stream.on('end', findResult);
