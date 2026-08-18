// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

const DEBUG_SHAPE = new URLSearchParams(window.location.search).get('debug_shape');
const MAX_TRIES = 2048;


const vI = (x, y, z, gs) => {
    x = x < 0 ? gs - 1 + x : x % gs;
    z = z < 0 ? gs - 1 + z : z % gs;
    return (y * ((gs) ** 2)) + z * (gs) + x;
}

const buildValues = (lambda, nStates, baseSize, gs, gh) => {

    let result, transitions;

    const testSize = 64;
    const factor = testSize / gs;

    let i;
    for (i = 0; i < MAX_TRIES; i++) {
        // Test a new transition table with small structure
        transitions = transitionList(lambda, nStates);

        if (DEBUG_SHAPE) {
            console.time(`test ${i}`);
        }

        const bs = Math.floor(BASE_SCALE * baseSize * factor);
        result = testValues(nStates, transitions, bs, testSize, gh * factor);
        result.log.TestNumber = i;
        if (DEBUG_SHAPE && result.pass) {
            console.table(result.log);
        }
        if (DEBUG_SHAPE) {
            console.timeEnd(`test ${i}`);
        }

        if (result.pass) break
    }
    let eI = calculateEmptySides(result.values, testSize, (gh * factor) / 2);

    let values;
    if (testSize == gs) {
        values = result.values;
    }
    else {
        // Generate full structure
        values = randomFirstLayer(nStates, Math.floor(baseSize * BASE_SCALE), gs, gh)
        values = build(transitions, values, gs, nStates, 0, gh);
    }

    eI = confirmEmptySides(values, gs, gh, eI);

    return { values: values, eI: eI }
}

const testValues = (nStates, transitions, baseSize, gs, gh) => {
    /*

    Approach:

    First eliminate
    * Faster code that eliminates qualities that are 99% bad.

    Then select
    * Slower code that selects qualities that are 99% good.

    */

    let values = randomFirstLayer(nStates, baseSize, gs, gh)
    let log = {};

    const fail = { values: values, pass: false, log: log };

    let top = 0;
    const buildTo = (end) => {
        values = build(transitions, values, gs, nStates, top, end);
        top = end - 1;
    }

    buildTo(5);
    if (!checkDensity(values, gs, top, baseSize ** 2, .08, 1, log)) return fail;

    buildTo(10);
    if (!checkDimensions(values, gs, baseSize, top, 2, 1, log)) return fail;

    buildTo(Math.floor(gh / 2))
    if (!checkDensity(values, gs, top, baseSize ** 2, .19, 2.1, log)) return fail;
    if (!checkDimensions(values, gs, baseSize, top, 2, 1, log)) return fail;

    checkLines(values, gs, top, log)

    buildTo(Math.floor(gh - 1));
    // 20 is permissive, 25 is aggressive
    const square = checkSquareness(values, gs, top, 25, log);
    if (square) return fail;

    if (!checkDiagonalEmptyness(values, gs, top, 40, log)) return fail;

    const contrast = checkLines(values, gs, top, log)
    if (!contrast) return fail;

    // only need to do this sometimes
    const rez = 128;
    let topHiRez = rez * 2.0;
    let valuesH = randomFirstLayer(nStates, baseSize * 2, rez, topHiRez)
    valuesH = build(transitions, valuesH, rez, nStates, 0, topHiRez - 1);
    if (!checkDiagonalEmptyness(valuesH, rez, topHiRez - 2, 60, log)) return fail;
    const densityHiRez = checkDensity(values, gs, top, rez ** 2, .0015, 1, log);

    return { values: values, pass: true, log: log }
}

const dist3d = (v1, v2) => {
    var dx = v1[0] - v2[0];
    var dy = v1[1] - v2[1];
    var dz = v1[2] - v2[2];

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

const distnd = (v1, v2, denom) => {
    let sum = v1.reduce((a, v, i) => a += (v - v2[i]) ** 2, 0);
    return Math.sqrt(sum) / denom;
}

let shapesChecked = 0;

const checkLines = (values, gs, layer, log) => {
    shapesChecked++;

    layer += 1;

    const handleLine = (line, neighbors, dirs, points) => {
        const counts = new Array(10).fill(0);
        line.forEach(s => counts[s]++)
        let states = line.map((s) => [counts[s], s]).sort((a, b) => b[0] - a[0]);
        const mode = states[0][1];
        const lineClarity = states[0][0] / line.length;

        // This will merge 8, 1, 1 and 1,8,1.
        states = [...(new Set(states.map(a => a[1]).sort((a, b) => b - a)))];

        if (lineClarity > .5) {

            let displacement = [0, 0];
            let distance = [0, 0];
            for (let i = 0; i < dirs.length; i++) {
                displacement[0] += dirs[i][0];
                displacement[1] += dirs[i][1];
                distance[0] += Math.abs(dirs[i][0]);
                distance[1] += Math.abs(dirs[i][1]);
            }

            const key = `${states}-(${displacement.map(d => Math.sign(d))})`;

            lines[key] ||= { displacement: displacement, distance: distance, counts: counts, directions: dirs, state: mode, states: states, clarity: lineClarity, count: 0, lines: [], points: points }
            lines[key].count++;
            totalLines++;
            lines[key].lines.push({
                directions: dirs,
                line: line,
                clarity: lineClarity,
                neighbors: neighbors
            })
        }
    }


    const range = 1;
    const maxDepth = 6;
    let lines = {};
    let totalLines = 0;

    for (let x = 0; x < gs; x++) {
        for (let z = 0; z < gs; z++) {
            let s = values[vI(x, layer, z, gs)];

            if (!s) continue;

            let l = 0, line = [s], neighbors = [], dirs = [];
            let p = [x, z];
            let points = [[x, layer, z]];


            for (l; l < maxDepth; l++) {
                const n = [];
                const y = layer - l;
                for (let i = -range; i <= range; i++) {
                    for (let j = -range; j <= range; j++) {
                        if (i == 0 && j == 0) continue;
                        n.push(values[vI(p[0] + i, y, p[1] + j, gs)])
                    }
                }
                neighbors.push(n);

                let options = [];
                for (let i = -range; i <= range; i++) {
                    for (let j = -range; j <= range; j++) {
                        const n = values[vI(p[0] + i, y - 1, p[1] + j, gs)];

                        if (!n) continue;
                        options.push({ state: n, i: i, j: j });
                    }
                }

                if (options.length > 0) {
                    const score = options.map((o) => {
                        let s = 0;
                        if (dirs.length > 0) {
                            s += o.i == dirs[dirs.length - 1][0] ? 1 : 0;
                            s += o.j == dirs[dirs.length - 1][1] ? 1 : 0;
                        }
                        if (o.state == line[line.length - 1]) {
                            s += 2;
                        }
                        else if (line.indexOf(o.state) != -1) {
                            s += 1;
                        }
                        return s;
                    })
                    const choice = score.indexOf([...score].sort((a, b) => b - a)[0]); // this will introduce bias if there lots of equal options, but might not matter
                    const o = options[choice];
                    dirs.push([o.i, o.j]);
                    line.push(o.state);
                    points.push([p[0] + o.i, y - 1, p[1] + o.j]);
                    p = [p[0] + o.i, p[1] + o.j];

                    continue;
                }
                else {
                    break;
                }
            }

            if (l == maxDepth) {
                handleLine(line, neighbors, dirs, points);
            }
        }

    }

    lines = Object.values(lines).sort((a, b) => b.count - a.count);

    let summary = {
        uniqueLines: lines.length,
        totalLines: totalLines,
    };
    let stats = { emptyness: [] }

    summary.dominance = ``;
    summary.emptyness = ``;

    let runningEmptynessNum = 0;
    let runningEmptynessDenom = 0;
    let verticalTotal = 0;

    summary.patternsInSample = new Set();
    summary.modesInSample = new Set();

    // Summarize each line
    let runningTotal = 0;
    let stateTotals = {};
    let xDirs = { '-1': 0, 0: 0, 1: 0 };
    let yDirs = { '-1': 0, 0: 0, 1: 0 };
    const percentToCheck = .75;
    let percentChecked = 0;
    let lineIndex = 0;
    if (lines.length < 1) return false;

    // look at patterns that make up the majority of the lines, or at least 2
    while (percentChecked < percentToCheck || lineIndex < Math.min(2, lines.length)) {
        const line = lines[lineIndex];

        line.straight = line.distance[0] == Math.abs(line.displacement[0]) && line.distance[1] == Math.abs(line.displacement[1]);

        // Could differentiate organic straight vs twisting
        line.type = line.straight ? 'straight' : 'organic';

        if (line.displacement[0] == 0 && line.displacement[1] == 0) {
            line.class = 'vertical'
            verticalTotal += line.count;
        } else {
            line.class = 'diag'
        }

        const xDir = Math.sign(line.displacement[0]);
        const yDir = Math.sign(line.displacement[1]);
        xDirs[xDir] += line.count;
        yDirs[yDir] += line.count;
        line.direction = [xDir, yDir];

        // Doesn't take into account height
        line.length = Math.round(10 * Math.sqrt(line.displacement[0] ** 2 + line.displacement[1] ** 2)) / 10;

        let totalNeighbors = 0;
        let nCounts = new Array(10).fill(0);
        for (let i = 0; i < line.count; i++) {
            for (let j = 0; j < line.lines[i].neighbors.length; j++) {
                for (let k = 0; k < line.lines[i].neighbors[j].length; k++) {
                    nCounts[line.lines[i].neighbors[j][k]]++;
                    totalNeighbors++;
                }
            }
        }

        line.totalNeighbors = totalNeighbors;
        line.nCounts = nCounts;

        line.context = {
            empty: nCounts[0] / totalNeighbors,
            emptyOrMode: (nCounts[line.state] + nCounts[0]) / totalNeighbors,
            emptyOrSelf: (nCounts[0] + [...(new Set(line.lines[0].line))].reduce((a, v) => a += line.nCounts[v], 0)) / totalNeighbors
        }

        runningEmptynessNum += line.context.emptyOrSelf * line.count;
        runningEmptynessDenom += line.count;

        runningTotal += line.count;
        line.dom = runningTotal / totalLines;
        percentChecked = runningTotal / totalLines;

        let emptyness = Math.round(100 * (runningEmptynessNum / runningEmptynessDenom)) / 100;
        if (lineIndex % 3 == 0) {
            summary.dominance += `(${lineIndex}: ${Math.round(100 * line.dom) / 100}),  `
            summary.emptyness += `(${lineIndex}: ${emptyness}), `;
            stats.emptyness.push(emptyness)
        }

        stateTotals[line.states] ||= 0;
        stateTotals[line.states] += line.count;

        summary.patternsInSample.add(line.states.join());
        summary.modesInSample.add(line.state);

        // debug
        if (lineIndex == 0) {
            let points = line.points;
            for (let j = 0; j < points.length; j++) {
                values[vI(points[j][0], points[j][1] + 10, points[j][2], gs)] = line.lines[0].line[j];
            }
        }

        lineIndex++;
        if (line.count == 1) {
            break
        }
    }

    // reduce each line to three dimensions
    const maxCount = maxDepth + 1;
    const distances = {};
    let totalContrast = 0;
    let weightedContrastNum = 0;
    let weightedContrastDenom = 0;

    const graph = [];
    window.graph = graph;

    // compute distances
    for (let i = 0; i < lineIndex; i++) {

        const la = lines[i];
        const las = la.states.slice(0, 2);
        lines[i].totalDistance = 0;
        lines[i].weightedDistance = 0; // 0 contrast with self

        const edges = [];

        for (let j = 0; j < lineIndex; j++) {
            if (j == i) continue;

            let key = `${Math.max(i, j)}-${Math.min(i, j)}`;
            let dist = distances[key];
            if (!dist) {

                let va = [];
                let vb = [];

                const lb = lines[j];
                const lbs = lb.states.slice(0, 2);

                let dims = new Set([...las, ...lbs]);
                dims = [...dims];
                if (dims.length > 3) {
                    dist = 1;
                } else {
                    for (let d = 0; d < 3; d++) {
                        va[d] = (la.counts[dims[d]] / maxCount) || 0;
                        vb[d] = (lb.counts[dims[d]] / maxCount) || 0;
                    }
                    dist = dist3d(va, vb);
                }
                distances[key] = dist;
            }
            edges.push([j, distnd(la.counts, lines[j].counts, Math.sqrt(2 * maxCount ** 2))]);


            lines[i].totalDistance += dist;
            lines[i].weightedDistance += dist * lines[j].count;
        }
        G.add(graph, i, la, edges);

        lines[i].contrast = lines[i].totalDistance / (lineIndex - 1); // ignores self and counts
        lines[i].weightedContrast = lines[i].weightedDistance / runningTotal;

        // this isn't really weighted, in that the line contrast itself is not weighted
        weightedContrastNum += lines[i].count * lines[i].contrast;
        weightedContrastDenom += lines[i].count;

        totalContrast += lines[i].contrast;
    }

    summary.totalContrast = totalContrast;
    summary.avgContrast = totalContrast / lineIndex;
    summary.weightedAvgContrast = weightedContrastNum / weightedContrastDenom;
    summary.maxContrast = Math.max(...lines.slice(0, lineIndex).map(l => l.contrast));
    summary.maxwContrast = Math.max(...lines.slice(0, lineIndex).map(l => l.weightedContrast));

    summary.clusterScores = G.score(graph);

    const mostCommonPattern = Object.entries(stateTotals).sort((a, b) => b[1] - a[1])[0][1];

    summary.lineIndex = lineIndex;

    // summary.uniqPatterns = [...summary.patternsInSample].join(', ');
    summary.patternsInSample = summary.patternsInSample.size;
    summary.modesInSample = summary.modesInSample.size;

    summary.patternDominance = mostCommonPattern / runningTotal;
    summary.xDirs = Object.entries(xDirs).reduce((a, [k, v]) => a += `(${k}: ${Math.round(100 * v / runningTotal) / 100}), `, '')
    summary.yDirs = Object.entries(yDirs).reduce((a, [k, v]) => a += `(${k}: ${Math.round(100 * v / runningTotal) / 100}), `, '')
    summary.maxDir = Math.max(...Object.values(xDirs), ...Object.values(yDirs)) / runningTotal;
    summary.verticalDom = verticalTotal / runningTotal;

    const nothing = summary.patternsInSample < 2 && summary.modesInSample < 2;

    const a = {};
    if (DEBUG_SHAPE) {
        a.verticals = summary.verticalDom > .05;
        a.clearVertical = summary.clusterScores[1] > 1 && lines.slice(0, 3).filter((l) => { return l.displacement[0] == 0 && l.displacement[1] == 0 && l.type == 'straight' }).length > 0;
        a.noStateDominates = summary.patternDominance < .7;
        a.enoughStates = summary.patternsInSample > 3;
        a.emptyEnough = stats.emptyness[stats.emptyness.length - 1] >= .98;
        a.lineCountLowEnough = summary.uniqueLines < 300;
        a.noDirDominates = summary.maxDir < .9;

        const general = a.noStateDominates && a.enoughStates && a.emptyEnough && (a.verticals || a.lineCountLowEnough) && a.noDirDominates;
        log[`${layer} Check Lines General`] = `${general}: nsd ${a.noStateDominates}, es ${a.enoughStates}, ee ${a.emptyEnough}, lcle or v ${a.verticals || a.lineCountLowEnough}, ndd ${a.noDirDominates}`;

        a.highContrast = (summary.maxContrast > .9 || summary.maxwContrast > .9);

        log[`${layer} Check Lines has more than nothing`] = `${nothing ? 'fail' : 'pass'}`
        log[`${layer} Check Lines checked`] = shapesChecked;
        log[`${layer} Check Lines pass vertical`] = a.clearVertical;
        log[`${layer} Check Lines pass contrast`] = summary.clusterScores[1] > 1;
        log[`${layer} Check Lines clusters`] = summary.clusterScores.join(',')
    }

    if (!nothing && summary.clusterScores[2] > 2) {
        let output = {};
        let linesToShow = Math.floor(Math.max(Math.min(10, lines.length), lineIndex));

        for (let i = 0; i < linesToShow; i++) {
            let l = lines[i];
            let t = {};
            t.count = l.count;
            t.states = l.states.join(', ')
            t.mode = l.state;
            t.dom = l.dom;
            t.contrast = l.contrast;
            t.wContrast = l.weightedContrast;
            t.type = l.type;
            t.class = l.class;
            t.length = l.length;
            t.clarity = l.clarity;
            if (l.direction) {
                t.direction = l.direction.join(', ');
                t.displacement = l.displacement.join(', ');
                t.distance = l.distance.join(', ');
                t.empty = (l.context.empty * 100) + '%';
                t.emptyOrMode = (l.context.emptyOrMode * 100) + '%';
                t.emptyOrSelf = (l.context.emptyOrSelf * 100) + '%';
            }
            if (i >= lineIndex) {
                t.count += '-----'
            }
            output[i] = t;
        }
        if (DEBUG_SHAPE) {
            console.table(output);
            console.log(`and ${lines.length - linesToShow} others`)
            summary.clusterScores = summary.clusterScores.join(', ')
            console.table(summary);
            console.table(a);
        }

        return true;
    }

    return false;

}


const checkDiagonalEmptyness = (values, gs, top, max, log) => {
    const range = 8;
    const step = 2;
    let debugPoints = [];
    let diagTotalZ = 0;
    for (let y = 0; y < top - 10; y += 2) {
        let d = 0;
        let streak = 0;
        for (let z = 0; z < gs; z++) {
            let empty = true;
            for (let x = gs / 2 - range; x <= gs / 2 + range; x += step) {
                let s = values[vI(x, y + d, z, gs)];
                if (s != 0) empty = false;
            }
            if (!empty) {
                break;
            }
            else {
                d++;
                streak++;
            }
        }
        if (streak == gs) {
            diagTotalZ++;
        }
    }

    for (let y = 0; y < top - 10; y += 2) {
        let d = 0;
        let streak = 0;
        for (let z = gs - 1; z >= 0; z--) {
            let empty = true;
            for (let x = gs / 2 - range; x <= gs / 2 + range; x += step) {
                let s = values[vI(x, y + d, z, gs)];
                if (s != 0) {
                    empty = false;
                    break;
                }
            }
            if (!empty) {
                break;
            }
            else {
                d++;
                streak++;
            }
        }
        if (streak == gs) {
            diagTotalZ++;
        }
    }

    let diagTotalX = 0;

    for (let y = 0; y < top - 10; y += 2) {
        let d = 0;
        let streak = 0;
        for (let x = gs - 1; x >= 0; x--) {
            let empty = true;
            for (let z = gs / 2 - range; z <= gs / 2 + range; z += step) {
                let s = values[vI(x, y + d, z, gs)];
                if (s != 0) {
                    empty = false;
                    break;
                }
            }
            if (!empty) {
                break;
            }
            else {
                debugPoints.push([vI(x, y + d, gs / 2, gs), 1]);
                d++;
                streak++;
            }
        }
        if (streak == gs) {
            diagTotalX++;
        }
    }


    for (let y = 0; y < top - 10; y += 2) {
        let d = 0;
        let streak = 0;
        for (let x = 0; x < gs; x++) {
            let empty = true;
            for (let z = gs / 2 - range; z <= gs / 2 + range; z += step) {
                let s = values[vI(x, y + d, z, gs)];
                if (s != 0) {
                    empty = false;
                    break;
                }
            }
            if (!empty) {
                break;
            }
            else {
                debugPoints.push([vI(x, y + d, gs / 2, gs), 1]);
                d++;
                streak++;
            }
        }
        if (streak == gs) {
            diagTotalX++;
        }
    }

    const pass = (diagTotalX + diagTotalZ) <= max;

    if (pass) {
        log[`${top} Diagonal Emptyness`] = `pass ${diagTotalX} + ${diagTotalZ} is less than ${max}`
        return true;
    } else {
        log[`${top} Diagonal Emptyness`] = `fail ${diagTotalX} + ${diagTotalZ} is greater than ${max}`
        return false;
    }
}

const checkDensity = (values, gs, layer, denom, min, max, log) => {
    let cells = 0;
    const start = gs * gs * layer;

    for (let i = 0; i < gs ** 2; i++) {
        cells += values[start + i] != 0;
    }

    const ratio = cells / denom;

    if (ratio > max) {
        log[`${layer} Density`] = `fail ${ratio} > ${max} `;
        return false;
    } else if (ratio < min) {
        log[`${layer} Density`] = `fail ${ratio} < ${min}`;
        return false;
    }

    log[`${layer} Density`] = `pass ${ratio} `;
    return true;
}

const checkDimensions = (values, gridSize, baseSize, layer, minTotal, min, log) => {
    let index = vI(0, layer, 0, gridSize);
    let minK = gridSize, maxK = 0, minJ = gridSize, maxJ = 0;

    for (let j = 0; j < gridSize; j++) {
        for (let k = 0; k < gridSize; k++, index++) {
            if (values[index] != 0) {
                if (k > maxK) maxK = k;
                if (k < minK) minK = k;
                if (j > maxJ) maxJ = j;
                if (j < minJ) minJ = j;
            }
        }
    }


    const a = {};
    a.jRange1 = maxJ - minJ - baseSize;
    a.kRange1 = maxK - minK - baseSize;

    if (a.jRange1 + a.kRange1 < minTotal || (a.kRange1 < min || a.jRange1 < min)) {
        log[`${layer} Dimensions`] = `Thin(j: ${a.jRange1}, k: ${a.kRange1}, sum: ${a.jRange1 + a.kRange1})`
        return false;
    }

    log[`${layer} Dimensions`] = `pass ${a.jRange1}, ${a.kRange1}, sum: ${a.jRange1 + a.kRange1} `;
    return true;
}

// check for square top
const checkSquareness = (values, gs, layer, min, log) => {
    let a = {
        eht: 0,
        ehb: 0,
        vl: 0,
        vr: 0
    };

    const checkSide = (name, lookup) => {
        let streak = 0;
        for (let i = 0; i < gs; i++) {
            const l0 = values[lookup(i, layer)];
            const l1 = values[lookup(i, layer - 1)];
            const l2 = values[lookup(i, layer - 2)];
            if (l0 + l1 + l2 == 0) {
                streak++;
                a[name] = Math.max(a[name], streak);
            } else {
                streak = 0;
            }
        }
    }

    checkSide('eht', (i, l) => vI(i, l, 0, gs));
    checkSide('ehb', (i, l) => vI(i, l, gs - 1, gs));
    checkSide('vl', (i, l) => vI(0, l, i, gs));
    checkSide('vr', (i, l) => vI(gs - 1, l, i, gs));

    const sum = [a.eht, a.ehb, a.vl, a.vr].reduce((a, v) => a += v > min, 0);
    const minCount = 2;
    if (sum <= minCount) {
        log[`${layer} Squareness`] = `fail (${a.eht}, ${a.ehb}, ${a.vl}, ${a.vr}) has <= ${minCount} greater than ${min}`;
        return true
    }

    log[`${layer} Squareness`] = `pass (${a.eht}, ${a.ehb}, ${a.vl}, ${a.vr}) has > ${minCount} greater than ${min}`;
    return false;
}

const calculateEmptySides = (values, gridSize, layer) => {
    const halfGrid = gridSize / 2;

    let emptySides = [0, 0, 0, 0];

    const ind = (x, y, z) => (y * (gridSize ** 2)) + z * gridSize + x;

    let streak = 1;
    // check along each x axis line
    for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
            if (values[ind(x, layer, z)] == 0) {
                const esI = z < halfGrid ? 0 : 1;
                emptySides[esI] += streak;
                streak++;
            } else {
                streak = 1;
            }
        }
    }

    streak = 1;
    // check along each y axis line
    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            if (values[ind(x, layer, z)] == 0) {
                const esI = x < halfGrid ? 2 : 3;
                emptySides[esI] += streak;
                streak++;
            } else {
                streak = 1;
            }
        }
    }

    let eI = emptySides.indexOf(Math.max(...emptySides));

    if (f.brightLine) {
        for (let l = 0; l < 1024; l++) {
            values[ind(0, l, 0)] = 1;
        }
    }

    return eI;
}

const confirmEmptySides = (values, gs, gh, eI) => {
    let angleTest = calculateEmptySides(values, gs, gh / 4);
    if (eI != angleTest) {
        let options = [0, 0, 0, 0];
        options[eI]++;
        options[angleTest]++;
        let decider = calculateEmptySides(values, gs, gh / 2);
        options[decider]++;
        return options.indexOf(Math.max(...options));
    }
    return eI;
}
