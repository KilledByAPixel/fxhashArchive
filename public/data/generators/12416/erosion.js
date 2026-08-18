// Author: Nathaniel Sarkissian
// Date: May 4, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

// Hydraulic erosion is a relatively well known idea in terrain generation. This
// implementation started with Sebastian Lague's Unity/C# implementation. Other
// than porting it to JavaScript and adapting it to the data structures I had in
// place for this project, I modified somewhat significantly. I removed the
// erosion brush concept. I modified the scale of a few of the parameters such
// as sediment capacity, erosion speed, deposit speed, etc. I added
// functionality to carry the color of the sediment in the rain drops in order
// to cause the terrain to be colored by the erosion effect.

function erode(mp, nDrops, sedAmt, dropRadius) {
    let length = random(0.5, 2);
    let maxIterations = 60 * length;
    let initSpeed = 0;
    let initWaterVolume = 1;
    let inertia = 0.5;
    let sedimentCapacityFactor = 4 * sedAmt * 10;
    let minSedimentCapacity = 0.01;
    let depositSpeed = 0.6 * sedAmt;
    let erodeSpeed = 0.6 * sedAmt;
    let gravity = 4;
    let evaporateSpeed = 0.1 / length;

    for (let j = 0; j < nDrops; j++) {
        let r1 = random(1);
        let r2 = random(1);
        let p = createVector(random(hResX - 1), random(hResY - 1));
        let dir = createVector(0, 0);
        let speed = initSpeed;
        let water = initWaterVolume;
        let sediment = 0;
        let colorCariedR = -1;
        let colorCariedG = -1;
        let colorCariedB = -1;

        for (let i = 0; i < maxIterations; ++i) {

            let nodeX = round(p.x);
            let nodeY = round(p.y);

            if (nodeX < 0 || nodeY < 0) {
                break;
            }

            if (nodeX >= hResX - 1 || nodeY >= hResY - 1) {
                break;
            }

            let cellOffsetX, cellOffsetY;
            if (p.x > nodeX) {
                cellOffsetX = p.x - nodeX;
            } else {
                cellOffsetX = nodeX - p.x;
            }
            if (p.y > nodeY) {
                cellOffsetY = p.y - nodeY;
            } else {
                cellOffsetY = nodeY - p.y;
            }

            let heightAndGradient = calculateHeightAndGradient(mp, nodeX, nodeY);

            if (isNaN(heightAndGradient[0])) {
                break;
            }

            if (isNaN(heightAndGradient[1])) {
                break;
            }

            if (isNaN(heightAndGradient[2])) {
                break;
            }

            dir.x = dir.x * inertia - heightAndGradient[0] * (1 - inertia);
            dir.y = dir.y * inertia - heightAndGradient[1] * (1 - inertia);

            dir.normalize();

            p.add(dir);

            if (dir.x == 0 && dir.y == 0) {
                break;
            }

            if (p.x < 0 || p.x >= hResX - 1) {
                break;
            }

            if (p.y < 0 || p.y >= hResY - 1) {
                break;
            }

            let newHeight = calculateHeightAndGradient(mp, p.x, p.y)[2];
            if (isNaN(newHeight)) {
                break;
            }
            let deltaHeight = newHeight - heightAndGradient[2];

            let sedimentCapacity = max(
                -deltaHeight * speed * water * sedimentCapacityFactor,
                minSedimentCapacity
            );

            if (sediment > sedimentCapacity || deltaHeight > 0) {
                let _nodeX = nodeX;
                let _nodeY = nodeY;

                let amountToDeposit =
                    deltaHeight > 0
                        ? min(deltaHeight, sediment)
                        : (sediment - sedimentCapacity) * depositSpeed * depositMap[_nodeX][_nodeY];
                sediment -= amountToDeposit;

                let c1 = (1 - cellOffsetX) * (1 - cellOffsetY);
                let c2 = cellOffsetX * (1 - cellOffsetY);
                let c3 = (1 - cellOffsetX) * cellOffsetY;
                let c4 = cellOffsetX * cellOffsetY;

                mp[_nodeX][_nodeY] +=
                    amountToDeposit * c1;
                mp[_nodeX + 1][_nodeY] +=
                    amountToDeposit * c2;
                mp[_nodeX][_nodeY + 1] +=
                    amountToDeposit * c3;
                mp[_nodeX + 1][_nodeY + 1] +=
                    amountToDeposit * c4;

                if (colorCariedR != -1) {
                    let colorInd = (_nodeX + _nodeY * hResX) * 3;

                    let dr = colorCariedR - colorMap[colorInd];
                    let dg = colorCariedG - colorMap[colorInd + 1];
                    let db = colorCariedB - colorMap[colorInd + 2];

                    colorMap[colorInd] += dr * c1;
                    colorMap[colorInd + 1] += dg * c1;
                    colorMap[colorInd + 2] += db * c1;

                    colorInd = ((_nodeX + 1) + _nodeY * hResX) * 3;

                    dr = colorCariedR - colorMap[colorInd];
                    dg = colorCariedG - colorMap[colorInd + 1];
                    db = colorCariedB - colorMap[colorInd + 2];

                    colorMap[colorInd] += dr * c2;
                    colorMap[colorInd + 1] += dg * c2;
                    colorMap[colorInd + 2] += db * c2;


                    colorInd = (_nodeX + (_nodeY + 1) * hResX) * 3;

                    dr = colorCariedR - colorMap[colorInd];
                    dg = colorCariedG - colorMap[colorInd + 1];
                    db = colorCariedB - colorMap[colorInd + 2];

                    colorMap[colorInd] += dr * c3;
                    colorMap[colorInd + 1] += dg * c3;
                    colorMap[colorInd + 2] += db * c3;


                    colorInd = ((_nodeX + 1) + (_nodeY + 1) * hResX) * 3;

                    dr = colorCariedR - colorMap[colorInd];
                    dg = colorCariedG - colorMap[colorInd + 1];
                    db = colorCariedB - colorMap[colorInd + 2];

                    colorMap[colorInd] += dr * c4;
                    colorMap[colorInd + 1] += dg * c4;
                    colorMap[colorInd + 2] += db * c4;
                }

            } else {
                for (let m = 0; m <= dropRadius; m++) {
                    for (let k = 0; k <= dropRadius; k++) {
                        let influence;
                        influence = 1.0 / sq(dropRadius + 1);

                        let _nodeX = nodeX + m;
                        let _nodeY = nodeY + k;

                        if (r1 < 0.5) {
                            _nodeX = nodeX - m;
                        }
                        if (r2 < 0.5) {
                            _nodeY = nodeY - k;
                        }

                        if (_nodeX < 0 || _nodeY < 0) {
                            break;
                        }

                        if (_nodeX >= hResX - 1 || _nodeY >= hResY - 1) {
                            break;
                        }

                        let amountToErode = min(
                            (sedimentCapacity - sediment) * erodeSpeed,
                            -deltaHeight
                        ) * erodeMap[_nodeX][_nodeY] * influence;

                        let weighedErodeAmount =
                            amountToErode * 1;

                        let deltaSediment =
                            mp[_nodeX][_nodeY] < weighedErodeAmount
                                ? mp[_nodeX][_nodeY]
                                : weighedErodeAmount;
                        mp[_nodeX][_nodeY] -= deltaSediment;
                        sediment += deltaSediment;

                        let colorInd = (_nodeX + _nodeY * hResX) * 3;
                        colorCariedR = colorMap[colorInd];
                        colorCariedG = colorMap[colorInd + 1];
                        colorCariedB = colorMap[colorInd + 2];
                    }
                }
            }

            speed = sqrt(speed * speed + abs(deltaHeight) * gravity);
            water *= 1 - evaporateSpeed;
            if (water < 0.0001) {
                break;
            }
        }
    }
}

function calculateHeightAndGradient(mp, posX, posY) {
    if (posX < 0 || posX >= mp.length - 1) {
        return [0, 0, 0];
    }
    if (posY < 0 || posY >= mp[0].length - 1) {
        return [0, 0, 0];
    }

    let coordX = floor(posX);
    let coordY = floor(posY);

    let x = posX - coordX;
    let y = posY - coordY;

    let heightNW = mp[coordX][coordY];
    let heightNE = mp[coordX + 1][coordY];
    let heightSW = mp[coordX][coordY + 1];
    let heightSE = mp[coordX + 1][coordY + 1];

    let gradientX = (heightNE - heightNW) * (1 - y) + (heightSE - heightSW) * y;
    let gradientY = (heightSW - heightNW) * (1 - x) + (heightSE - heightNE) * x;

    let ht =
        heightNW * (1 - x) * (1 - y) +
        heightNE * x * (1 - y) +
        heightSW * (1 - x) * y +
        heightSE * x * y;

    return [gradientX, gradientY, ht];
}