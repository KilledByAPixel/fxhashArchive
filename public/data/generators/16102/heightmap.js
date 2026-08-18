// Author: Nathaniel Sarkissian
// Date: July 8, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function prepareHeightmap() {
    hMapImg = createGraphics(mapW, mapH);
    hMapImg.background(0);

    let terrNoiseScale = noiseScale * 1.5;
    // hMapImg.loadPixels();
    for (let i = 0; i < mapW; i++) {
        let row = [];
        let row2 = [];
        let row3 = [];
        for (let j = 0; j < mapH; j++) {

            let erodeAmt = 0.5;
            let depositAmt = 0.001;
            let n0 = fpow(norm(sNoise.noise2D(i * terrNoiseScale * 0.5, j * terrNoiseScale * 0.5), -1, 1) + 0.02, 2);
            let n1 = fnoise(i * terrNoiseScale, j * terrNoiseScale);
            // let n1 = fpow(norm(sNoise.noise2D(i * terrNoiseScale, j * terrNoiseScale), -1, 1) + 0.0, 3);
            let n2 = norm(sNoise.noise2D(i * terrNoiseScale * 2, j * terrNoiseScale * 2), -1, 1);
            let n3 = norm(sNoise.noise2D(i * terrNoiseScale * 16, j * terrNoiseScale * 16), -1, 1);
            let n4 = norm(sNoise.noise3D(i * terrNoiseScale * 4, j * terrNoiseScale * 4, 5), -1, 1);
            let h = (n0 * 0.0 + n1 * 0.5 + n2 * 0.485 + n3 * 0.015) *
                map(
                    cos(map(i, 0, mapW, PI / 1.5, TWO_PI - PI / 1.5)),
                    -1,
                    1,
                    0.1,
                    0
                );
            // depositAmt = fmap(n4, 0, 1, 0.001, 1);
            erodeAmt = fmap(n4, 0, 1, 0.001, 1);

            row.push(Math.fround(h));
            row2.push(Math.fround(erodeAmt));
            row3.push(Math.fround(depositAmt));

            if (h > hMax) {
                hMax = h;
            } else if (h < hMin) {
                hMin = h;
            }
        }
        hMap.push(row);
        erodeMap.push(row2);
        depositMap.push(row3);
    }

    if (erosionEnabled) {
        // erode(hMap, areaM * 10000 * 15, 1, 4);
        erode(hMap, areaM * 10000 * 10, 1, 2);
        // erode(hMap, areaM * 10000 * 10, 1, 2);
        erode(hMap, areaM * 10000 * 5, 1, 1);
    }
}

function drawColumn(columnIndex) {
    let v = drawVectors[columnIndex];
    if (v[0] == "column") {
        canv.strokeCap(SQUARE);
        let z = v[1] * zAngle; // z
        let h = v[3];   // y
        let lr = 1;
        let gradMag = 0;
        let pixInd = (v[5] + (mapH - 1 - v[6]) * mapW) * 4;
        lr = lightMap.pixels[pixInd + 0];
        let terrCol = grassCols[0];//lerpColor(thirdCol, fourthCol, fmap(h, 0, maxTerrH, 0, 1));
        canv.stroke(lerpColor(lightColor(lr / 255), terrCol, 0.5));

        lr += constrain(frandAB(-1, 1) * 0.2, 0, 1);
        canv.strokeWeight(0.5);
        canv.line(v[2], z - h, v[2], z - h + 1.3);
        // canv.line(v[2], z - h, v[2], z);

        // let depth = waterLevel - h;
        let nearRock = false;
        let rockNearness = 1;
        // let rockAngle = 0;

        for (let i = 0; i < rocks.length; i++) {
            let maxD = max(sq(rocks[i].sz * 100), 10 * 4) * 1.2;
            let maxD2 = max(sq(rocks[i].sz * 190), 17 * 4) * 1.2;
            let maxD3 = max(sq(rocks[i].sz * 250), 25 * 4) * 1.2;
            let dx = rocks[i].i - v[5];
            let dy = rocks[i].j - v[6];
            let d = sq(dx) + sq(dy);
            if (d < maxD) {
                // nearRock = true;
                rockNearness = fmap(d, 0, maxD2, 0.1, 0.4);
                rockAngle = dx > 0 ? -1 : 1;
                break;
            } else if (d < maxD3) {
                rockNearness = fmap(d, maxD2, maxD3, 0.4, 0.6);
                break;
            }
        }

        if (xyFlip == -1) {
            pixInd = ((mapW - v[5] - 1) + (v[6]) * mapW) * 4;
        } else {
            pixInd = (v[5] + (v[6]) * mapW) * 4;
        }
        rockPixel = rockMap.pixels[pixInd + 0];
        if (rockPixel > 128) {
            // nearRock = true;
        }

        if (drawGrass && v[4] == 0) {
            let maxGrad = 168;
            let r = floor(frandA(1000));
            if (r < 570) {
                let noiseScaleNoise = fmap(sNoise.noise2D(v[5] * noiseScale * 0.5 + 10, v[6] * noiseScale * 0.5 + 10), -1, 1, 1, 2);
                let lengthNoiseScale = noiseScale * 5 * noiseScaleNoise * 2;
                let tuftN = norm(sNoise.noise2D(v[5] * lengthNoiseScale * 32 + 10, v[6] * lengthNoiseScale * 32 + 10), -1, 1);
                let n0 = norm(sNoise.noise2D(v[5] * lengthNoiseScale * 2 + 423, v[6] * lengthNoiseScale * 2 + 423), -1, 1);
                let n1 = norm(sNoise.noise2D(v[5] * lengthNoiseScale * 4, v[6] * lengthNoiseScale * 4), -1, 1);
                let n2 = norm(sNoise.noise2D(v[5] * lengthNoiseScale * 8, v[6] * lengthNoiseScale * 8), -1, 1);
                let n3 = norm(sNoise.noise2D(v[5] * lengthNoiseScale * 16, v[6] * lengthNoiseScale * 16), -1, 1);
                let bladeLenN = (n0 * 0.7 + (n1 * 0.7 + n2 * 0.2 + n3 * 0.1) * 0.3);
                let bladeLen = (fpow(bladeLenN + 0.5, 4) + 0.85) * 3 * 0.667 * fmap(gradMag, 0, maxGrad, 1, 0.5) + 0.35;
                bladeLen *= rockNearness;
                if (tuftN > 0.75) {
                    bladeLen *= fmap(tuftN, 0.75, 1, 1, 1.5);
                }

                let nBlades = Math.fround(floor(4 + sq(gradMag) * 0.00015)) * constrain(map(rockNearness, 0.1, 0.7, 2, 1),1, 4);
                let angleSpread = PI / 8;
                for (let i = 1; i < nBlades; i++) { // MAIN GRASS
                    let angleNoiseScale = noiseScale * 10;
                    n1 = sNoise.noise2D(v[5] * angleNoiseScale * 1, v[6] * angleNoiseScale * 1);
                    n2 = sNoise.noise2D(v[5] * angleNoiseScale * 4, v[6] * angleNoiseScale * 4);
                    n3 = sNoise.noise2D(v[5] * angleNoiseScale * 8, v[6] * angleNoiseScale * 8);
                    let n4 = sNoise.noise2D(v[5] * angleNoiseScale * 16, v[6] * angleNoiseScale * 16);
                    let bladeAngle = (n1 * 0.7 + n2 * 0.2 + n3 * 0.1) * PI / 2 * (n4 * 0.5 + 0.5);
                    // bladeAngle = rockAngle * PI/4;

                    let blade = createVector(0, -1);

                    blade.mult(bladeLen);
                    blade.rotate(bladeAngle + frandAB(-1, 1) * angleSpread);

                    let spread = createVector(frandA(3), 0);
                    spread.rotate(frandA(TAU));

                    let grassX = v[2] + spread.x;
                    let grassY = z - h + spread.y * 0.35 * gradMag * 0.01;
                    let grassEndX = grassX + blade.x;
                    let grassEndY = grassY + blade.y;

                    if (!nearRock) {
                        drawBlade(grassX, grassY, grassEndX, grassEndY, lr, z, bladeLen);
                    }
                }

                let biome = isFloof(v[5], v[6]);
                let floofNoise = biome[1];

                if (drawFloofs && biome[0]) { // CAT TAILS
                    if (floor(frandA(10)) < 3) {
                        let angleNoiseScale = noiseScale * 20;
                        n1 = sNoise.noise2D(v[5] * angleNoiseScale * 1, v[6] * angleNoiseScale * 1);
                        n2 = sNoise.noise2D(v[5] * angleNoiseScale * 4, v[6] * angleNoiseScale * 4);
                        n3 = sNoise.noise2D(v[5] * angleNoiseScale * 8, v[6] * angleNoiseScale * 8);
                        let bladeAngle = frandAB(-1, 1) * PI / 8;

                        for (let i = 0; i < 2; i++) {
                            let blade = createVector(0, -1);
                            blade.mult(fmap(floofNoise, floofThresh, 1, 4, 10));
                            blade.rotate(bladeAngle + frandAB(-1, 1) * angleSpread);
                            let grassX = v[2] + frandAB(-1, 1);
                            let grassY = z - h;

                            drawFloofPlant(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                        }
                    }
                } else {
                    biome = isSage(v[5], v[6]);
                    let sageNoise = biome[1];

                    if (drawSage && biome[0]) { // SAGE
                        if (floor(frandA(100)) < 14) {
                            let angleNoiseScale = noiseScale * 20;
                            n1 = sNoise.noise2D(v[5] * angleNoiseScale * 1, v[6] * angleNoiseScale * 1);
                            n2 = sNoise.noise2D(v[5] * angleNoiseScale * 4, v[6] * angleNoiseScale * 4);
                            n3 = sNoise.noise2D(v[5] * angleNoiseScale * 8, v[6] * angleNoiseScale * 8);
                            // let n4 = sNoise.noise2D(v[5] * angleNoiseScale * 16, v[6] * angleNoiseScale * 16);
                            // let bladeAngle = frandAB(-1, 1) * PI / 8;


                            for (let i = 0; i < 5; i++) {
                                let blade = createVector(0, -1);
                                blade.mult(fpow(norm(sageNoise, sageThresh, 1) * frandAB(0.5, 1.1) + 0.4, 2) * 10 * frandAB(0.5, 1.4) + 5);
                                // blade.mult(fmap(sageNoise, sageThresh, 1, 0, 20) * frandAB(1, 1.3));
                                let grassX = v[2] + frandAB(-1, 1);
                                let grassY = z - h;

                                drawSagePlant(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                            }
                        }
                    } else {
                        biome = isFlower(v[5], v[6]);
                        let flowerNoise = biome[1];
                        if (flowerArrangment == "mixed") {
                            flowerType = flowerTypes[floor((biome[2] * flowerTypes.length * 2) % flowerTypes.length)];
                        }
                        if (drawFlowers && biome[0] && floor(frandA(100)) < floor(100 * (0.14 * (flowerNoise + 0.5)))) { // FLOWERS
                            let angleNoiseScale = noiseScale * 20 * 0.01;
                            n1 = sNoise.noise2D(v[5] * angleNoiseScale * 1, v[6] * angleNoiseScale * 1);
                            n2 = sNoise.noise2D(v[5] * angleNoiseScale * 4, v[6] * angleNoiseScale * 4);
                            n3 = sNoise.noise2D(v[5] * angleNoiseScale * 8, v[6] * angleNoiseScale * 8);
                            let bladeAngle = frandAB(-1, 1) * PI / 8;

                            let nFlowers = 1;
                            if (flowerType == "thistle") {
                                nFlowers = 3;
                                bladeAngle *= 0.5;
                            } else if (flowerType == "rose") {
                                nFlowers = 2;
                            } else if (flowerType == "poppy") {
                                nFlowers = 2;
                            } else if (flowerType == "lavender") {
                                nFlowers = 1;
                            } else if (flowerType == "tall") {
                                nFlowers = 1;
                            }
                            for (let i = 0; i < nFlowers; i++) {
                                let blade = createVector(0, -1);
                                blade.rotate(bladeAngle + frandAB(-1, 1) * angleSpread);
                                blade.mult(fmap(flowerNoise, 0, flowerThresh, 5, 3));

                                let grassX = v[2] + frandAB(-1, 1);
                                let grassY = z - h;

                                let flip = floor(frandA(100)) < -5;
                                let r = floor(frandA(60));
                                if (flip) {
                                    if (r < 10) {
                                        drawDaisy(grassX, grassY, lr, blade.mag() * 1.2, blade.heading() + PI / 2, z);
                                    } else if (r < 20) {
                                        drawRose(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    } else if (r < 30) {
                                        drawThistle(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    } else if (r < 40) {
                                        drawLavender(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    } else if (r < 50) {
                                        drawTallFlower(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    } else {
                                        drawPoppy(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    }
                                } else {
                                    if (flowerType == "daisy") {
                                        drawDaisy(grassX, grassY, lr, blade.mag() * 1.2, blade.heading() + PI / 2, z);
                                    } else if (flowerType == "rose") {
                                        drawRose(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    } else if (flowerType == "thistle") {
                                        drawThistle(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    } else if (flowerType == "lavender") {
                                        drawLavender(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    } else if (flowerType == "tall") {
                                        if (floor(frandA(10)) < 6) {
                                            drawTallFlower(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                        }
                                    } else {
                                        drawPoppy(grassX, grassY, lr, blade.mag(), blade.heading() + PI / 2, z);
                                    }
                                }
                            }
                        }
                    }
                }


                if (!nearRock && r < 8) { // TUFTS
                    canv.strokeWeight(0.1);
                    n1 = sNoise.noise2D(v[5] * noiseScale * 1, v[6] * noiseScale * 1);
                    n2 = sNoise.noise2D(v[5] * noiseScale * 4, v[6] * noiseScale * 4);
                    n3 = sNoise.noise2D(v[5] * noiseScale * 8, v[6] * noiseScale * 8);
                    let n4 = sNoise.noise2D(v[5] * noiseScale * 16, v[6] * noiseScale * 16);
                    let bladeAngle = (n1 * 0.7 + n2 * 0.2 + n3 * 0.1) * PI / 4 * (n4 * 0.9 + 0.1);

                    // bladeLen *= 1.5;
                    // draw tuft
                    for (let i = 0; i < 100; i++) {
                        let blade = createVector(0, -1);
                        let angleNoise = frandAB(-1, 1) * PI / 8;
                        blade.mult(
                            bladeLen *
                            fmap(abs(angleNoise), 0, PI / 8, 1.5, 1) * frandA(1));
                        blade.rotate(bladeAngle + angleNoise);
                        let grassX = v[2] + frandAB(-1, 1) * 0.4;
                        let grassY = z - h;
                        let grassEndX = grassX + blade.x;
                        let grassEndY = grassY + blade.y;
                        drawBlade(grassX, grassY, grassEndX, grassEndY, lr, z, bladeLen);
                    }
                }
            }
            // }
        }

        // if (depth > 0) { // WATER
        //    canv.strokeWeight(0.5);
        //    canv.stroke(waterCol);
        //     let waterX = v[2] + frandAB(-1, 1) * 0.1;
        //     canv.line(
        //         waterX,
        //         z - h,
        //         waterX,
        //         z - waterLevel);
        // }
    }
    else if (v[0] == "tri") {
        let v1 = v[2];
        let v2 = v[3];
        let v3 = v[4];

        let lr = 1;
        // let pixInd = (floor(v[8]) + (mapH - 1 - floor(v[9])) * mapW) * 4;
        lr = 1; //(lightMap.pixels[pixInd + 0]/255)*0.5 + 0.5;

        let i = floor(v[8] + v1.x);
        let j = floor(v[9] + v1.z);

        let shadow = 1;
        let start = createVector(i, j);
        let px = floor(i + v1.x);
        let py = floor(j + v1.y);
        if (px >= 0 && px < mapW && py >= 0 && py < mapH) {
            let baseTerrHt = fmap(hMap[px][py], hMin, hMax, 0, maxTerrH) - v1.y;
            // let baseTerrHt = v[6]; //getHeightAlongRay(start, lightAngle, 0);
            // print(baseTerrHt);
            for (let d = 0; d < 100; d++) {
                let step = 2;
                let rayX = start.x + d * step * cos(lightAngle);
                let rayH = d * tan(lightHeightAngle * 0.50) + baseTerrHt;
                let rayZ = start.y + d * step * sin(lightAngle);

                let px = floor(rayX);
                let py = floor(rayZ);
                if (!(px >= 0 && px < mapW)) {
                    continue;
                }
                if (!(py >= 0 && py < mapH)) {
                    continue;
                }
                let terrH = fmap(hMap[px][py], hMin, hMax, 0, maxTerrH);

                if (terrH > rayH) {
                    shadow = 0.5;
                    break;
                }
            }
        }


        let z = v[1] * zAngle; // z
        let h = v[6] * 1;   // y
        let dx = v[5];
        let dy = z - h;

        let br = fmap(v[7], 0, 1, 0, 1);

        canv.strokeWeight(0.3);
        canv.strokeCap(PROJECT);
        canv.strokeJoin(ROUND);

        let _x = (v1.x + v2.x + v3.x) / 3;
        let _y = (v1.y + v2.y + v3.y) / 3;
        let _z = (v1.z + v2.z + v3.z) / 3;

        let col;
        let colorNoiseScale = 0.36;
        let n1 = norm(worleyNoise.Euclidean(_x * colorNoiseScale + 10, _y * colorNoiseScale + 10, _z * colorNoiseScale + 10)[1], 0, 1);
        let n2 = norm(worleyNoise.Euclidean(_x * colorNoiseScale * 2 + 20, _y * colorNoiseScale * 2 + 20, _z * colorNoiseScale * 2 + 20)[0], 0, 1);
        let n3 = norm(worleyNoise.Euclidean(_x * colorNoiseScale * 4 + 30, _y * colorNoiseScale * 4 + 30, _z * colorNoiseScale * 4 + 30)[0], 0, 1);
        let n4 = norm(worleyNoise.Euclidean(_x * colorNoiseScale * 6 + 40, _y * colorNoiseScale * 6 + 40, _z * colorNoiseScale * 6 + 40)[0], 0, 1);


        let c1 = color(0);
        let c2 = color(8);
        let c3 = color(16);
        let c4 = color(32);
        let c5 = color(140);
        let c6 = color(180);
        let c7 = color(220);
        let c8 = color(255);

        if (n1 > n2) {
            if (n1 > 0.5) {
                col = c1;
            } else {
                col = c2;
            }
        } else {
            if (n2 > n3) {
                if (n2 > 0.5) {
                    col = c3;
                } else {
                    col = c4;
                }
            } else {
                if (n3 > n4) {
                    if (n3 > 0.5) {
                        col = c5
                    } else {
                        col = c6;
                    }
                } else {
                    if (n4 > 0.5) {
                        col = c7;
                    } else {
                        col = c8;
                    }
                }
            }
        }

        let lightCol = rockLightColor(
            lerp(
                red(col) / 255,
                br * lr * shadow,
                0.8)
        );
        col = lightCol;

        canv.fill(col);
        canv.stroke(col);

        canv.push();
        canv.translate(dx, dy - 1 - baseHeight);
        canv.triangle(
            v1.x,
            v1.y,
            v2.x,
            v2.y,
            v3.x,
            v3.y);
        canv.pop();
    }
}

function prepareDrawingArray() {
    canv.stroke(0);
    canv.noStroke();
    canv.fill(255);
    let sc = 0.5;
    canv.strokeWeight(1);

    let v1 = createVector(0, 0, 0);

    let maxHeight = 16777215; //256 * 256 * 255 + 256 * 255 + 255;
    let c = 65536; //256 * 256;
    let b = 256;
    let a = 1;


    hMapImg.loadPixels();
    for (let j = 0; j < mapH; j++) {
        for (let i = 0; i < mapW; i++) {
            let h1 = fmap(hMap[i][j], hMin, hMax, 0, maxTerrH);

            let floofH = isFloof(i, j);
            let sageH = isSage(i, j);
            let flowerH = isFlower(i, j);

            let plantH = 0;
            if (floofH[0]) {
                plantH = floofH[1];
            }
            if (sageH[0]) {
                plantH = max(plantH, sageH[1]);
            }
            if (flowerH[0]) {
                plantH = max(plantH, flowerH[1]);
            }

            plantH /= 1.27;

            let plantHAmp = 2;
            h1 += plantH * plantHAmp;

            let pixInd = (floor(i) + floor(j) * mapW) * 4;
            let ht = floor(fmap(h1, 0, maxTerrH + plantHAmp, 0, maxHeight));
            let temp = ht;

            let d3 = 0;
            while (temp >= 0) {
                d3++;
                temp -= c;
            }
            d3--;
            temp += c;

            let d2 = 0;
            while (temp >= 0) {
                d2++;
                temp -= b;
            }
            d2--;
            temp += b;

            let d1 = 0;
            while (temp >= 0) {
                d1++;
                temp -= a;
            }
            d1--;


            hMapImg.pixels[pixInd + 0] = d3;
            hMapImg.pixels[pixInd + 1] = d2;
            hMapImg.pixels[pixInd + 2] = d1;

            let heightAndGradient = calculateHeightAndGradient(hMap, i, mapH - j);

            v1 = transformIJ(i, j, sc);

            let edge = 0;
            if (i > trim && j > trim && i < mapW - trim && j < mapH - trim) {// && rr < 35000) {
                drawVectors.push([
                    "column",                   //0: type
                    v1.z,                       //1: depth
                    v1.x,                       //2: x
                    v1.y + baseHeight,          //3: y
                    edge,                       //4: is edge?
                    i,                          //5: grid x
                    j,                          //6: grid y
                    heightAndGradient[0],       //7: dydx
                    heightAndGradient[1]        //8: dydz
                ]);
                tintMax++;
            }
        }
    }
    hMapImg.updatePixels();

    hMapImg.loadPixels();
    for (let i = 0; i < rocks.length; i++) {
        let r = rocks[i];
        let rPosTransformed = transformIJ(floor(r.i), floor(r.j), sc);
        if (rPosTransformed.x == -1 && rPosTransformed.y == -1 && rPosTransformed.z == -1) {
          // print("errrrrrrrrrrrrrrrr");
            continue;
        }

        let rockShadowRad = r.sz * 200;
        for (let m = -rockShadowRad; m < rockShadowRad; m++) {
            for (let n = -rockShadowRad; n < rockShadowRad; n++) {
                let i = floor(r.i + m);
                let j = floor(r.j + n);
                if (i >= 0 || i < mapW) {
                    if (j >= 0 || j < mapH) {
                        let rr = m * m + n * n;
                        let dd = sq(rockShadowRad / 2) * 2;
                        if (rr < dd) {
                            let pixInd = (i + j * hMapImg.width) * 4;
                            if (pixInd >= 0 && pixInd < hMapImg.pixels.length) {
                                let currentCol = red(hMapImg.pixels[pixInd]);
                                let newH = constrain(currentCol + rockShadowRad * 1 * fmap(rr, 0, dd, 1, 0.0), 0, 255);
                                hMapImg.pixels[pixInd + 0] = newH;
                                hMapImg.pixels[pixInd + 1] = newH;
                                hMapImg.pixels[pixInd + 2] = newH;
                            }
                        }
                    }
                }
            }
        }

        for (let j = 0; j < r.tris.length; j++) {
            let t = r.tris[j];
            if (r.verts[t[0]].x + r.i > -5) {
                if (r.verts[t[0]].x + r.i < mapW + 5) {
                    // if (r.verts[t[0]].y < 0) {
                    drawVectors.push([
                        "tri",              //0: type
                        rPosTransformed.z + t[3],               //1: triangle depth
                        r.verts[t[0]],      //2: point 1
                        r.verts[t[1]],      //3: point 2
                        r.verts[t[2]],      //4: point 3
                        rPosTransformed.x,  //5: rock.x
                        rPosTransformed.y,  //6: rock.y
                        t[4],               //7: brightness
                        r.i,                //8: i
                        r.j                 //9: j
                    ]);
                    // }
                }
            }
        }
    }
    hMapImg.updatePixels();
  // print(drawVectors.length);
}
