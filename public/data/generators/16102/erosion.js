// Author: Nathaniel Sarkissian
// Date: July 8, 2022
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
  // print("erosion radius:", dropRadius);
    let length = frandAB(0.5, 2);
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
        let r1 = frandA(1);
        let r2 = frandA(1);
        let p = createVector(frandA(mapW - 1), frandA(mapH - 1));
        let dir = createVector(0, 0);
        let speed = initSpeed;
        let water = initWaterVolume;
        let sediment = 0;
        
        for (let i = 0; i < maxIterations; ++i) {

            let nodeX = round(p.x);
            let nodeY = round(p.y);

            if (nodeX < 0 || nodeY < 0) {
                break;
            }

            if (nodeX >= mapW - 1 || nodeY >= mapH - 1) {
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

            if (p.x < 0 || p.x >= mapW - 1) {
                break;
            }

            if (p.y < 0 || p.y >= mapH - 1) {
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
                        // : (sediment - sedimentCapacity) * depositSpeed * 0.001 * depositFactor;
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

                        if (_nodeX >= mapW - 1 || _nodeY >= mapH - 1) {
                            break;
                        }

                        let amountToErode = min(
                            (sedimentCapacity - sediment) * erodeSpeed,
                            -deltaHeight
                        // ) * influence * 0.5 * erodeFactor;
                        ) * erodeMap[_nodeX][_nodeY] * influence;

                        let weighedErodeAmount =
                            amountToErode * 1;

                        let deltaSediment =
                            mp[_nodeX][_nodeY] < weighedErodeAmount
                                ? mp[_nodeX][_nodeY]
                                : weighedErodeAmount;
                        mp[_nodeX][_nodeY] -= deltaSediment;
                        sediment += deltaSediment;
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