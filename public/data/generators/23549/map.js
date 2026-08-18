// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function prepareHeightMap() {
    mapW = 100 + mapTrim * 2;
    mapH = 100 + mapTrim * 2;
    let areaAdj = mapW * mapH / 10000;

    noiseDetail(1, 1);

    let mapScale = random(0.15, 1);
    let sustain = map(mapScale, 0.15, 1, 0.6, 0.2);
    let noiseDist = [
        [1, 1 * mapScale],
        [sustain, 2 * mapScale],
        [pow(sustain, 2), 4 * mapScale],
    ];
    let noiseTotal = 0;
    for (let i = 0; i < noiseDist.length; i++) {
        noiseTotal += noiseDist[i][0];
    }
    for (let i = 0; i < mapW; i++) {
        let row = [];
        let erodeMapRow = [];
        let depositMapRow = [];
        for (let j = 0; j < mapH; j++) {

            let offsetNoiseScale = noiseScale * 4;
            let offsetNoiseStr = 0.0;
            let offsetNoise = noise(i * offsetNoiseScale, j * offsetNoiseScale) * TAU;
            let iNoiseScale = 1;
            let jNoiseScale = 1;

            let nx = 0;
            for (let k = 0; k < noiseDist.length; k++) {
                nx += norm(sNoise.noise2D(
                    i * noiseScale * iNoiseScale * noiseDist[k][1] * 2 + cos(offsetNoise) * offsetNoiseStr,
                    j * noiseScale * jNoiseScale * noiseDist[k][1] * 2 + sin(offsetNoise) * offsetNoiseStr
                ), -1, 1) * noiseDist[k][0];
            }

            let ns = constrain(pow(
                map(
                    nx,
                    0,
                    noiseTotal,
                    0, 1
                ) * 1,
                1), 0, 1);

            ns = floor(ns * 100000)/100000;
            ns *= TAU * 2 * map(j, 0, mapH, 1, 0.5);

            let y = map(j, 0, mapH-1, 0, targetSz);
            y += map(ns, 0, 2 * TAU, 0, 1) * terrainHt;
            if (y < minY) {
                minY = y;
            }
            if (y > maxY) {
                maxY = y;
            }

            row.push(
                ns
            );
            let erodeAmt = 0.1;
            let depositAmt = 0.001;
            erodeMapRow.push(erodeAmt);
            depositMapRow.push(depositAmt);
        }
        hMap.push(row);
        erodeMap.push(erodeMapRow);
        depositMap.push(depositMapRow);
    }

    erode(hMap, 10000 * areaAdj, 1, 4);
    erode(hMap, 10000 * areaAdj, 1, 4);
    erode(hMap, 10000 * areaAdj, 1, 4);
    erode(hMap, 10000 * areaAdj, 1, 2);
    blurMap(hMap, 1, 0.2);
}

function prepareLigthMap() {
    for (let i = 0; i < mapW; i++) {
        let row = [];
        for (let j = 0; j < mapH; j++) {
            let nrm = _normalize(hMapNormal(i, j));
            let dt = _dot(nrm, lgt);
            row.push(dt);
        }
        lMap.push(row);
    }
}