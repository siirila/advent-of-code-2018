let {
    getMapAndUnitsFromData,
    performCombat,
    getElvesWinningScenario,
} = require('./functions.js');

function arrayify(text) {
    return text.split('\n');
}

let testInput1 = `#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`;

let testInput2 = `#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`;

let testInput3 = `#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######`;

let testInput4 = `#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######`;

let testInput5 = `#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######`;

let testInput6 = `#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########`;

let testInput7 = `####
##E#
#GG#
####`;

let testInput8 = `#####
#GG##
#.###
#..E#
#.#G#
#.E##
#####`;

let realInput = `################################
#######################...######
######################...#######
##############...####..G########
#############....G...G..########
############...#.......####..###
###########G.G##..#.G...###..###
##########....###.....G.G......#
#########....##....GG..G..###..#
###########..#................##
###########..#...#G...........##
##########...............G.....#
#####.#####...#####E.......E...#
####..#####..#######.....G..####
##.G..####G.#########.E...E...##
#...####....#########..........#
#.G.####....#########..........#
##..####....#########..##......#
###.###.....#########G.....#.###
###.##...G...#######..E.....####
###.....G.....#####E.......#####
###.......................######
######..............E.........##
######......###................#
#####.......##.................#
#####.#....##......##........E##
#######....######.##E.##########
#######....#########..##########
######.....#########....########
####.....###########..E.########
####...#.###########....########
################################`;


xdescribe('Test outcomes', () => {
    test('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput1));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(47);
        expect(remainingHp).toBe(590);
    });

    test('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput2));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(37);
        expect(remainingHp).toBe(982);
    });

    test('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput3));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(46);
        expect(remainingHp).toBe(859);
    });

    test('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput4));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(35);
        expect(remainingHp).toBe(793);
    });

    test('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput5));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(54);
        expect(remainingHp).toBe(536);
    });

    test('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput6));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(20);
        expect(remainingHp).toBe(937);
    });

    test('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput7));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(67);
        expect(remainingHp).toBe(200);
    });

    test('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput8));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(71);
        expect(remainingHp).toBe(197);
    });

    test('Just using a test to get the real output', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(realInput));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        // expect(roundsCompleted).toBe(71);
        // expect(remainingHp).toBe(197);
    })
});

describe('Test elves winning outcomes', () => {
    test('outcome is as expected', () => {
        let {roundsCompleted, remainingHp } = getElvesWinningScenario(arrayify(testInput1));
        expect(roundsCompleted).toBe(29);
        expect(remainingHp).toBe(172);
    });

    xtest('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput2));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(33);
        expect(remainingHp).toBe(948);
    });

    test('outcome is as expected', () => {
        let {roundsCompleted, remainingHp } = getElvesWinningScenario(arrayify(testInput3));
        expect(roundsCompleted).toBe(33);
        expect(remainingHp).toBe(948);
    });

    test('outcome is as expected', () => {
        let {roundsCompleted, remainingHp } = getElvesWinningScenario(arrayify(testInput4));
        expect(roundsCompleted).toBe(37);
        expect(remainingHp).toBe(94);
    });

    test('outcome is as expected', () => {
        let {roundsCompleted, remainingHp } = getElvesWinningScenario(arrayify(testInput5));
        expect(roundsCompleted).toBe(39);
        expect(remainingHp).toBe(166);
    });

    test('outcome is as expected', () => {
        let {roundsCompleted, remainingHp } = getElvesWinningScenario(arrayify(testInput6));
        expect(roundsCompleted).toBe(30);
        expect(remainingHp).toBe(38);
    });

    xtest('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput7));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(67);
        expect(remainingHp).toBe(200);
    });

    xtest('outcome is as expected', () => {
        let {map, units} = getMapAndUnitsFromData(arrayify(testInput8));
        let {roundsCompleted, remainingHp } = performCombat(units, map);
        expect(roundsCompleted).toBe(71);
        expect(remainingHp).toBe(197);
    });

    test('Just using a test to get the real output', () => {
        let {roundsCompleted, remainingHp } = getElvesWinningScenario(arrayify(realInput));
        // expect(roundsCompleted).toBe(71);
        // expect(remainingHp).toBe(197);
    })
});