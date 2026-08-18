// Author: Nathaniel Sarkissian
// Date: February 26, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

let minH = 100;
let maxH = -100;

let craterMin = 100;
let craterMax = -100;

let colorR;

let bigCratorProb;
let pyramids;
let pyramidsOn;

function prepHeightMap() {
    pyramids = [];
    for (let i = 0; i < hMap.length; i++) {
        for (let j = 0; j < hMap[i].length; j++) {
            hMap[i][j] = 0;
        }
    }

    for (let i = 0; i < craterMap.length; i++) {
        for (let j = 0; j < craterMap[i].length; j++) {
            craterMap[i][j] = 0;
        }
    }

    for (let i = 0; i < colorMap.length; i++) {
        colorMap[i] = 0;
    }


    lighting = true;
    if (random(100) < 25) {
        colorR = 3;
    } else {
        colorR = floor(random(25));
    }
    print("color palette", colorR);
    if (colorR == 0) {
        darkRock = color('#856050');
        lightRock = color('#C9A9A1');
        sand1 = color('#E5CAB7');
        sand2 = color('#B2D3C9');
        craterColor = color('#B47A66');
        dikeColor = lightRock;
        boulderColor = darkRock;
    } else if (colorR == 1) {
        darkRock = color('#283235');
        lightRock = color('#243236');
        sand1 = color('#473E38');
        sand2 = color('#291D16');
        craterColor = color('#2E2C2C');
        dikeColor = lightRock;
        boulderColor = color('#436D7A');
    } else if (colorR == 2) {
        darkRock = color('#40536f');
        lightRock = color('#535870');
        sand1 = color('#805270');
        sand2 = color('#91778A');
        craterColor = color('#182646');
        dikeColor = color('#C43BA9');
        boulderColor = color('#7B1357');
    } else if (colorR == 3) {
        lighting = false;
        frame = false;
        darkRock = color('#646464');
        lightRock = color('#ffffff');
        sand1 = color('#373737');
        sand2 = color('#9b9b9b');
        craterColor = color('#BBBBBB');
        dikeColor = lightRock;
        boulderColor = darkRock;
    } else if (colorR == 4) {
        darkRock = color('#515151');
        lightRock = color('#BAB0B0');
        sand1 = color('#666666');
        sand2 = color('#8B8B8B');
        craterColor = color('#5F1B1B');
        dikeColor = color('#A58686');
        boulderColor = color('#850909');
    } else if (colorR == 5) {
        darkRock = color('#3C5457');
        lightRock = color('#693B29');
        sand1 = color('#774F40');
        sand2 = color('#533032');
        craterColor = color('#B88F7F');
        dikeColor = color('#30494E');
        boulderColor = color('#573646');
    } else if (colorR == 6) {
        darkRock = color('#856050');
        lightRock = color('#e1a99b');
        sand1 = color('#FFE6C6');
        sand2 = color('#E27B58');
        craterColor = color('#663926');
        dikeColor = lightRock;
        boulderColor = darkRock;
    } else if (colorR == 7) {
        darkRock = color('#EDAFB8');
        lightRock = color('#45616A');
        sand1 = color('#A78672');
        sand2 = color('#644634');
        craterColor = color('#373737');
        dikeColor = lightRock;
        boulderColor = darkRock;
    } else if (colorR == 8) {
        darkRock = color('#40536f');
        lightRock = color('#553f3c');
        sand1 = color('#E5BFA8');
        sand2 = color('#182646');
        craterColor = color('#182646');
        dikeColor = lightRock;
        boulderColor = darkRock;
    } else if (colorR == 9) {
        darkRock = color('#253b47');
        lightRock = color('#E27B58');
        sand1 = color('#fedcc7');
        sand2 = color('#623d2f');
        craterColor = color('#fedcc7');
        dikeColor = lightRock;
        boulderColor = darkRock;
    } else if (colorR == 10) {
        darkRock = color('#373737');
        lightRock = color('#ffffff');
        sand1 = color('#9b9b9b');
        sand2 = color('#646464');
        craterColor = color('#550000');
        dikeColor = lightRock;
        boulderColor = darkRock;
    } else if (colorR == 11) {
        darkRock = color('#99563C');
        lightRock = color('#5C314D');
        sand1 = color('#E8AB92');
        sand2 = color('#3C1F2D');
        craterColor = color('#B88F7F');
        dikeColor = lightRock;
        boulderColor = darkRock;
    } else if (colorR == 12) {
        mountainColor1 = color('#2F3B66');
        mountainColor2 = color('#353F60');
        terrainColor1 = color('#4F4260');
        terrainColor2 = color('#71243A');
        craterColor = color('#8FDDE2');
        dikeColor = color('#822C44');
        boulderColor = color('#E6A8CD');
    } else if (colorR == 13) {
        mountainColor1 = color('#483F39');
        mountainColor2 = color('#5A433B');
        terrainColor1 = color('#936C62');
        terrainColor2 = color('#B24705');
        craterColor = color('#C3B19E');
        dikeColor = color('#D46521');
        boulderColor = color('#E0DBD6');
    } else if (colorR == 14) {
        if (random(1) < 0.5) {
            mountainColor1 = color('#064D63');
            mountainColor2 = color('#2F3637');
            terrainColor1 = color('#45879C');
            terrainColor2 = color('#495357');
            craterColor = color('#65A6CB');
            dikeColor = color('#75DFED');
            boulderColor = color('#D1ECF2');
        } else {
            mountainColor1 = color('#165569');
            mountainColor2 = color('#1C525B');
            terrainColor1 = color('#4F6E78');
            terrainColor2 = color('#425E69');
            craterColor = color('#83CBE6');
            dikeColor = color('#8FB6C0');
            boulderColor = color('#133C45');
        }
    } else if (colorR == 15) {
        mountainColor1 = color('#33261C');
        mountainColor2 = color('#446215');
        terrainColor1 = color('#4A3822');
        terrainColor2 = color('#623D2F');
        craterColor = color('#7E593C');
        dikeColor = color('#8FDDE2');
        boulderColor = color('#C49E7D');
    } else if (colorR == 16) {
        mountainColor1 = color('#471F15');
        mountainColor2 = color('#5F2B1B');
        terrainColor1 = color('#AB4212');
        terrainColor2 = color('#BE613A');
        craterColor = color('#AB4212    ');
        dikeColor = color('#DDAC7E');
        boulderColor = color('#471F15');
    } else if (colorR == 17) {
        mountainColor1 = color('#2A2324');
        mountainColor2 = color('#3D1319');
        terrainColor1 = color('#800B0B');
        terrainColor2 = color('#AD191A');
        craterColor = color('#3D1319');
        dikeColor = color('#B21A0A');
        boulderColor = color('#2A2324');
    } else if (colorR == 18) {
        mountainColor1 = color('#401B0C');
        mountainColor2 = color('#623D2F');
        terrainColor1 = color('#71230D');
        terrainColor2 = color('#7A2E18');
        craterColor = color('#8D3F1F');
        dikeColor = color('#D1A26A');
        boulderColor = color('#EEA436');
    } else if (colorR == 19) {
        mountainColor1 = color('#3A3946');
        mountainColor2 = color('#4B3E5A');
        terrainColor1 = color('#665769');
        terrainColor2 = color('#887282');
        craterColor = color('#A5E6EB');
        dikeColor = color('#924385');
        boulderColor = color('#D83FAA');
    } else if (colorR == 20) {
        mountainColor1 = color('#6E5545');
        mountainColor2 = color('#695047');
        terrainColor1 = color('#94775C');
        terrainColor2 = color('#92684E');
        craterColor = color('#C5AB91');
        dikeColor = color('#D68351');
        boulderColor = color('#DFC3A8');
    } else if (colorR == 21) {
        mountainColor1 = color('#8B4223');
        mountainColor2 = color('#7B2F0C');
        terrainColor1 = color('#B0572F');
        terrainColor2 = color('#AE6749');
        craterColor = color('#995e39');
        dikeColor = color('#D48967');
        boulderColor = color('#2b221c');
    } else if (colorR == 22) {
        mountainColor1 = color('#300E13');
        mountainColor2 = color('#300C11');
        terrainColor1 = color('#410E18');
        terrainColor2 = color('#4A0D0E');
        craterColor = color('#B21A0A');
        dikeColor = color('#7c106f');
        boulderColor = color('#DF0F25');
    } else if (colorR == 23) {
        mountainColor1 = color('#C3AA90');
        mountainColor2 = color('#B8A692');
        terrainColor1 = color('#B3987A');
        terrainColor2 = color('#A9835E');
        craterColor = color('#A27952');
        dikeColor = color('#E7C582');
        boulderColor = color('#E7B85C');
    } else if (colorR == 24) {
        mountainColor1 = color('#9F4CB1');
        mountainColor2 = color('#87E2FF');
        terrainColor1 = color('#6ACFE5');
        terrainColor2 = color('#FFA2F0');
        craterColor = color('#D20FAB');
        dikeColor = color('#D6125C');
        boulderColor = color('#B6113E');
    }

    windowAreaM = map(width * height, 0, 592900, 0, 1);
    print(windowAreaM);

    overallScale = 1;

    let r;
    if (random(100) < 25) {
        r = 4;
    } else {
        r = floor(random(4));
    }
    if (r == 0) {
        rockyMountainsAndPlains();
    } else if (r == 1) {
        sharpRockyMountainsAndPlains();
    } else if (r == 2) {
        littleDunes();
    } else if (r == 3) {
        canyonsAndPlains();
    } else {
        boulders();
    }

    if (pyramidsOn) {
        for (let i = 0; i < pyramids.length; i++) {
            let p = pyramids[i];
            pyramid(p[0], p[1], p[2], p[3]);
        }
    }
    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            if (hMap[i][j] > maxH) {
                maxH = hMap[i][j];
            }
            if (hMap[i][j] < minH) {
                minH = hMap[i][j];
            }
        }
    }

    print("minH", minH, "maxH", maxH);
    print("craterMin", craterMin, "craterMax", craterMax);

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            hMap[i][j] = map(hMap[i][j], minH, maxH, 0, 1);
            hMap[i][j] *= 40;
        }
    }
}

function doErosion() {
    let timer = millis();
    let erodeCount = 500000 * windowAreaM;
    let erodeTotal = erodeCount;
    while (erodeCount > 0) {
        let erodeAmt = min(50000, erodeCount);
        if (scaleMode == "scale") {
            if (windowScale == 1) {
                erode(hMap, erodeAmt, 1, 0);
            } else {
                erode(hMap, erodeAmt, 1, round(map(erodeCount, 500000 * windowAreaM, 0, sq(windowScale), 0)));
            }
        } else {
            erode(hMap, erodeAmt, 1, 0);
        }
        erodeCount -= erodeAmt;
        print("eroding", floor(100 - 100 * erodeCount / erodeTotal) + "% done");
    };

    let elapsed = millis() - timer;
    print("erode time:", round(elapsed));
}

function littleDunes() {
    print("little dunes");

    let r = random(100);
    if (r < 50) {
        overallScale = random(0.8, 1.2);
    } else if (r < 75) {
        overallScale = random(0.5, 0.8);
    } else if (r < 100) {
        overallScale = random(1.2, 2);
    }

    if (scaleMode == "scale") {
        overallScale /= windowScale;
    }

    print("overallScale", overallScale);

    noiseScale *= overallScale;

    sunH -= 300;

    terrainTypeMask = function (x, y) {
        let n0 = norm(offsetSimplexNoise(x, noiseScale * 0.3, 0, y, noiseScale * 0.3, 0), -1, 1);
        let n1 = norm(offsetSimplexNoise(x, noiseScale * 0.2, 0, y, noiseScale * 0.2, 0), -1, 1);
        let n2 = norm(offsetSimplexNoise(x, noiseScale * 0.4, 0, y, noiseScale * 0.4, 0), -1, 1);
        let n3 = norm(offsetSimplexNoise(x, noiseScale * 0.8, 0, y, noiseScale * 0.8, 0), -1, 1);
        return sigmoid(map(n0 + n1 * 0.5 + n2 * 0.25 + n3 * 0.125, 0, 1 + 0.5 + 0.25 + 0.125, -1, 1), 12);
    }

    let angle = random(TAU);

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let r = sqrt(i * i + j * j);
            let a = atan2(j, i);
            let _i = r * cos(a + angle);
            let _j = r * sin(a + angle);
            let offsetNoise = offsetSimplexNoise(i, noiseScale * 0.01, 0, j, noiseScale * 0.01, 0) * TWO_PI;
            let offsetStrength = 2;
            let nDunes = abs(offsetSimplexNoiseAngle(
                i, noiseScale * 2 * 0.1, offsetStrength * cos(offsetNoise),
                j, noiseScale * 2, offsetStrength * sin(offsetNoise),
                angle)) * 0.15 * 5;
            nDunes = pow(nDunes, 2);
            nDunes *= 4;

            let plainNoiseScale = noiseScale * 0.5;
            let nPlains1 = norm(offsetSimplexNoise(i, plainNoiseScale * 0.5, 0, j, plainNoiseScale * 0.5, 0), -1, 1);
            let nPlains2 = norm(offsetSimplexNoise(i, plainNoiseScale * 1, 0, j, plainNoiseScale * 1, 0), -1, 1);
            let nPlains3 = norm(offsetSimplexNoise(i, plainNoiseScale * 2, 0, j, plainNoiseScale * 2, 0), -1, 1);
            let nPlains4 = norm(offsetSimplexNoise(i, plainNoiseScale * 4, 0, j, plainNoiseScale * 4, 0), -1, 1);

            let nPlains = map(
                nPlains1 + nPlains2 * 0.25 + nPlains3 * 0.125 + nPlains4 * 0.06125,
                0, 1 + 0.25 + 0.125 + 0.06125, 0, 1
            );
            nPlains = pow(nPlains + 0.3, 10) * 0.4 * 5;

            let mDunePlain = terrainTypeMask(i, j);
            let n = lerp(nDunes, nPlains, mDunePlain);

            hMap[i][j] += n;

            if (colorR <= 11) {
                mountainColor1 = sand2;
                mountainColor2 = sand1;
                terrainColor1 = lightRock;
                terrainColor2 = sand1;
            }

            let duneCol;
            let duneEr, duneDe;
            if (nDunes > 0.02) {
                duneCol = mountainColor1;
                duneEr = 1;
                duneDe = 0.001;
            } else {
                duneCol = terrainColor1;
                duneEr = 1;
                duneDe = 0.5;
            }

            let plainCol;
            let plainEr, plainDe;
            plainEr = 1;
            plainDe = 0.001;

            plainCol = terrainColor2;

            erodeMap[i][j] = lerp(duneEr, plainEr, mDunePlain);
            depositMap[i][j] = lerp(duneDe, plainDe, mDunePlain);

            let r1 = red(duneCol);
            let g1 = green(duneCol);
            let b1 = blue(duneCol);

            let r2 = red(plainCol);
            let g2 = green(plainCol);
            let b2 = blue(plainCol);

            let col = color(
                lerp(r1, r2, mDunePlain),
                lerp(g1, g2, mDunePlain),
                lerp(b1, b2, mDunePlain)
            );

            let colorNoiseScale = noiseScale * 40;
            let colorNoise = offsetSimplexNoise(i, colorNoiseScale, 0, j, colorNoiseScale, 0);
            let hu = hue(col);
            let sa = constrain(saturation(col) + colorNoise * 0, 0, 100);
            let br = constrain(brightness(col) + colorNoise * 0, 0, 100);

            colorMode(HSL, 360, 100, 100);
            col = color(hu, sa, br);

            colorMode(RGB, 255);

            let colorInd = (i + j * hResX) * 3;
            colorMap[colorInd] = red(col);
            colorMap[colorInd + 1] = green(col);
            colorMap[colorInd + 2] = blue(col);
        }
    }

    placeFeatures(0.0002 * random(1), 0, 0.001);

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let crH = craterMap[i][j];
            hMap[i][j] += crH * 30;
            if (crH > 0) {
                if (crH > 0.0 + norm(offsetSimplexNoise(i, noiseScale, 0, j, noiseScale, 0), -1, 1) * 0.001) {
                    let colorNoiseScale = noiseScale * 4;
                    let colorNoise = offsetSimplexNoise(i, colorNoiseScale, 0, j, colorNoiseScale, 0);
                    let finalCraterColor;
                    if (colorNoise < 0.5) {
                        finalCraterColor = craterColor;
                    } else if (colorNoise < 0.66) {
                        finalCraterColor = terrainColor1;
                    } else if (colorNoise < 0.77) {
                        finalCraterColor = terrainColor1;
                    } else {
                        finalCraterColor = mountainColor1;
                    }
                    let colorInd = (i + j * hResX) * 3;
                    colorMap[colorInd] = red(finalCraterColor);
                    colorMap[colorInd + 1] = green(finalCraterColor);
                    colorMap[colorInd + 2] = blue(finalCraterColor);
                }
            }
        }
    }
}

function canyonsAndPlains() {
    print("canyons and plains");

    aoMax = 15000;

    let r = random(100);
    if (r < 78) {
        overallScale = random(1.0, 2.0);
    } else if (r < 88) {
        r = random(0.8, 1.0);
    } else {
        r = random(2.0, 6.4);
    }

    if (scaleMode == "scale") {
        overallScale /= windowScale;
    }

    print("overallScale", overallScale);
    noiseScale *= overallScale;
    let angle = random(TAU);

    terrainTypeMask = function (x, y, angle) {
        return 0;
    }

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let canyonNoiseScale = noiseScale;

            let offsetScale = 1;
            let nOffset = norm(offsetSimplexNoise(i, noiseScale * offsetScale, 100, j, noiseScale * offsetScale, 100), -1, 1) * TWO_PI;
            let offsetStrength = 0.0;

            canyonNoiseScale = noiseScale *
                map(
                    offsetSimplexNoise(
                        i, noiseScale * 0.1, 100,
                        j, noiseScale * 0.1, 100),
                    -1,
                    1,
                    0.5,
                    0.5 + 0.15
                )

            let n1 = pow(norm(offsetSimplexNoise(
                i, canyonNoiseScale * 0.3, offsetStrength * cos(nOffset),
                j, canyonNoiseScale, offsetStrength * sin(nOffset),
                angle), -1, 1) + 0.2, 4);
            let n2 = pow(norm(offsetSimplexNoise(i, canyonNoiseScale * 2, 0, j, canyonNoiseScale * 2, 0), -1, 1) + 0.2, 4);
            let n3 = pow(norm(offsetSimplexNoise(i, canyonNoiseScale * 4, 0, j, canyonNoiseScale * 4, 0), -1, 1) + 0.2, 4);
            let n4 = pow(norm(offsetSimplexNoise(i, canyonNoiseScale * 10, 0, j, canyonNoiseScale * 10, 0), -1, 1) + 0.2, 4);

            let n = pow(map(n1 + n2 * 0.25 + n3 * 0.0625 + n4 * 0.03125, 0, 1 + 0.25 + 0.0625 + 0.03125, 0, 1) + 0.3, 4);

            if (colorR <= 11) {
                mountainColor1 = lightRock;
                mountainColor2 = sand2;
                terrainColor1 = sand1;
                terrainColor2 = sand1;
            }

            let col;
            erodeMap[i][j] = 1;
            if (n > 0.8) {
                col = mountainColor1;
                depositMap[i][j] = 0.01;
            } else {
                if (n > 0.2) {
                    col = terrainColor1;
                    depositMap[i][j] = 0.5;
                } else {
                    col = terrainColor2;
                    depositMap[i][j] = 0.05;
                }
            }

            hMap[i][j] += n;

            let colorInd = (i + j * hResX) * 3;
            colorMap[colorInd] = red(col);
            colorMap[colorInd + 1] = green(col);
            colorMap[colorInd + 2] = blue(col);
        }
    }

    placeFeatures((random(1) < 0.3 ? 0.00012 : 0.00004), (random(1) < 0.3 ? 0.0001 : 0), 0);

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let crH = craterMap[i][j];
            hMap[i][j] += crH * 20;
            if (crH > 0) {
                if (crH > norm(offsetSimplexNoise(i, noiseScale, 0, j, noiseScale, 0), -1, 1) * 0.4) {
                    let colorInd = (i + j * hResX) * 3;
                    colorMap[colorInd] = red(craterColor);
                    colorMap[colorInd + 1] = green(craterColor);
                    colorMap[colorInd + 2] = blue(craterColor);
                    erodeMap[i][j] = 0.9;
                } else if (crH > norm(offsetSimplexNoise(i, noiseScale, 0, j, noiseScale, 0), -1, 1) * 0.3) {
                    let colorInd = (i + j * hResX) * 3;
                    colorMap[colorInd] = red(mountainColor2);
                    colorMap[colorInd + 1] = green(mountainColor2);
                    colorMap[colorInd + 2] = blue(mountainColor2);
                    erodeMap[i][j] = 0.9;
                }
            }
        }
    }

}

function sharpRockyMountainsAndPlains() {
    print("sharp rocky mountains and plains");

    aoMax = 15000;

    let r = random(100);
    if (r < 50) {
        overallScale = random(0.5, 1);
    } else {
        r -= 50;
        r *= 2;
        if (r < 90) {
            overallScale = random(0.5, 2);
        } else {
            overallScale = random(2, 4);
        }
    }

    if (scaleMode == "scale") {
        overallScale /= windowScale;
    }

    print("overallScale", overallScale);
    noiseScale *= overallScale;

    terrainTypeMask = function (x, y) {
        let n1 = offsetSimplexNoise(x, noiseScale * 0.2, 0, y, noiseScale * 0.2, 0);
        let n2 = offsetSimplexNoise(x, noiseScale * 0.2 * 2, 0, y, noiseScale * 0.2 * 2, 0) * 0.5;
        let n3 = offsetSimplexNoise(x, noiseScale * 0.2 * 4, 0, y, noiseScale * 0.2 * 4, 0) * 0.25;
        return sigmoid(map(n1 + n2 + n3, -1.75, 1.75, -1, 1), 20);
    }

    let angle = random(TAU);

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let r = sqrt(i * i + j * j);
            let a = atan2(j, i);
            let _i = r * cos(a + angle);
            let _j = r * sin(a + angle);

            let plainNoise = noiseScale * 50;
            let nPlains = plains(i, plainNoise, 0, j, plainNoise, 0, angle) * 5;
            let nOffset = norm(offsetSimplexNoiseAngle(i, noiseScale * 0.1, 100, j, noiseScale * 0.1, 100, angle), -1, 1) * TWO_PI;
            let cs = cos(nOffset);
            let sn = sin(nOffset);
            let offsetStrength = 0.8;

            let nSharpRockyMountains = sigmoid(
                offsetSimplexNoiseAngle(
                    i, noiseScale * 0.5 * 5 * 0.25, cs * offsetStrength,
                    j, noiseScale * 0.5 * 3.5, sn * offsetStrength,
                    angle
                ),
                2
            );
            nSharpRockyMountains = offsetPow(nSharpRockyMountains, 10, 0.5);
            nSharpRockyMountains *= 16;

            offsetStrength = 2;
            nSharpRockyMountains += offsetSimplexNoise(
                i, noiseScale * 10, cs * offsetStrength,
                j, noiseScale * 10, sn * offsetStrength)
                * 0.01
                * (nSharpRockyMountains * 0.5 + 0.5);


            nSharpRockyMountains *= norm(offsetSimplexNoise(
                i, noiseScale * 5, cs * offsetStrength,
                j, noiseScale * 5, sn * offsetStrength), -1, 1) * 0.2 + 0.8;

            nSharpRockyMountains += (offsetNoise(i, j) * 2 - 1) * 0.02;

            let mRockPlain = terrainTypeMask(i, j) * 1;
            let n = lerp(nPlains, nSharpRockyMountains, mRockPlain);

            hMap[i][j] += n * 2 / overallScale;

            if (colorR <= 11) {
                mountainColor1 = sand2;
                mountainColor2 = darkRock;
                terrainColor1 = lightRock;
                terrainColor2 = sand1;
            }

            let rockyCol;
            let rockEr;
            let rockDe;
            if (nSharpRockyMountains > 0.18) {
                let colorNoise = norm(offsetSimplexNoise(i, noiseScale * 15, 0, j, noiseScale * 15, 0), -1, 1);
                if (colorNoise < 0.25) {
                    rockyCol = mountainColor1;
                } else {
                    rockyCol = mountainColor2;
                }
                rockEr = 1;
                rockDe = 0.001;
            } else {
                rockyCol = terrainColor1;
                rockEr = 1;
                rockDe = 0.5;
            }

            let plainEr = 1;
            let plainDe = 0.2;
            let plainCol = terrainColor2;

            erodeMap[i][j] = lerp(plainEr, rockEr, mRockPlain);
            depositMap[i][j] = lerp(plainDe, rockDe, mRockPlain);

            let r1 = red(plainCol);
            let g1 = green(plainCol);
            let b1 = blue(plainCol);

            let r2 = red(rockyCol);
            let g2 = green(rockyCol);
            let b2 = blue(rockyCol);

            let colorInd = (i + j * hResX) * 3;
            colorMap[colorInd] = lerp(r1, r2, mRockPlain);
            colorMap[colorInd + 1] = lerp(g1, g2, mRockPlain);
            colorMap[colorInd + 2] = lerp(b1, b2, mRockPlain);

        }
    }

    if (random(1) < 0.5) {
        bigCratorProb = 0.5;
    }
    placeFeatures(0.0004, 0, 0);

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let crH = pow(craterMap[i][j], 1.5);
            hMap[i][j] += crH * 10;
            if (crH > 0) {
                if (crH > 0.0 + norm(offsetSimplexNoise(i, noiseScale, 0, j, noiseScale, 0), -1, 1) * 0.01) {
                    let colorInd = (i + j * hResX) * 3;
                    colorMap[colorInd] = red(craterColor);
                    colorMap[colorInd + 1] = green(craterColor);
                    colorMap[colorInd + 2] = blue(craterColor);
                }
            }
        }
    }

}

function rockyMountainsAndPlains() {
    print("rocky mountains and plains");

    let heightMod;
    let r = random(100);
    if (r < 50) {
        print("special");
        overallScale = 0.5;
        heightMod = random(1.5, 2);
    } else {
        print("basic");
        r -= 50;
        r *= 2;
        heightMod = random(1, 1.5);
        if (r < 77) {
            overallScale = random(0.5, 1);
        } else if (r < 87) {
            overallScale = random(1, 3);
        } else if (r < 92) {
            overallScale = random(3, 6);
        } else {
            overallScale = random(6, 8);
        }
    }

    if (scaleMode == "scale") {
        overallScale /= windowScale;
    }

    print("overallScale", overallScale);
    noiseScale *= overallScale;

    let angle = random(TAU);

    terrainTypeMask = function (x, y) {
        return sigmoid(
            map(
                norm(offsetSimplexNoise(x, noiseScale * 0.004, 0, y, noiseScale * 0.004, 0), -1, 1) * 0.1 +
                norm(offsetSimplexNoise(x, noiseScale * 2, 0, y, noiseScale * 2, 0), -1, 1) * 0.05 +
                norm(offsetSimplexNoise(x, noiseScale * 0.02, 0, y, noiseScale * 0.02, 0), -1, 1),
                0, 1 + 0.1 + 0.05, -1, 1)
            , 6);
    }

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let r = sqrt(i * i + j * j);
            let a = atan2(j, i);
            let nPlains = plains(i, 0.1, 0, j, 0.1, 0, angle) * 0.2;

            let offsetScale = 1;
            let nOffset = norm(offsetSimplexNoise(i, noiseScale * offsetScale, 100, j, noiseScale * offsetScale, 100), -1, 1) * TWO_PI;
            let offsetStrength = 0.1;

            let n1 = abs(offsetSimplexNoiseAngle(
                i, noiseScale * 0.5, offsetStrength * cos(nOffset),
                j, noiseScale, offsetStrength * sin(nOffset),
                angle));
            let n2 = pow(norm(offsetSimplexNoise(i, noiseScale * 4, 0, j, noiseScale * 4, 0), -1, 1) + 0.2, 3);

            let nRockyMountains = pow(map(n1 + n2 * 0.1, 0, 1 + 0.1, 0, 1) + 0.5, 5);


            let mRockPlain = terrainTypeMask(i, j);
            let n = lerp(nPlains, nRockyMountains, mRockPlain);
            hMap[i][j] += n * 5 * heightMod / overallScale;

            let plainCol;
            let plainEr, plainDe;

            if (colorR <= 11) {
                mountainColor1 = sand1;
                mountainColor2 = darkRock;

                terrainColor1 = sand2;
                terrainColor2 = lightRock
            }

            if (nPlains > 0.5) {
                plainCol = mountainColor1;
                plainEr = 1;
                plainDe = 0.1;
            } else {
                plainCol = terrainColor1;
                plainEr = 1;
                plainDe = 0.1;
            }

            let rockyMountainsCol;
            if (nRockyMountains > 0.5) {
                rockyMountainsCol = mountainColor2;
            } else {
                rockyMountainsCol = terrainColor2;
            }
            let rockyEr = 1;
            let rockyDe = 0.01;

            erodeMap[i][j] = lerp(plainEr, rockyEr, mRockPlain);
            depositMap[i][j] = lerp(plainDe, rockyDe, mRockPlain);

            let r1 = red(plainCol);
            let g1 = green(plainCol);
            let b1 = blue(plainCol);

            let r2 = red(rockyMountainsCol);
            let g2 = green(rockyMountainsCol);
            let b2 = blue(rockyMountainsCol);

            let colorInd = (i + j * hResX) * 3;
            colorMap[colorInd] = constrain(lerp(r1, r2, mRockPlain) + offsetNoise(i, j) * 5, 0, 255);
            colorMap[colorInd + 1] = constrain(lerp(g1, g2, mRockPlain) + offsetNoise(i, j) * 5, 0, 255);
            colorMap[colorInd + 2] = constrain(lerp(b1, b2, mRockPlain) + offsetNoise(i, j) * 5, 0, 255);
        }
    }

    if (random(1) < 0.5) {
        bigCratorProb = 1.5;
    }
    placeFeatures(0.0001 * (random(0.5) + 0.5), 0.00002, 0);

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let crH = craterMap[i][j];
            hMap[i][j] += crH * 15 * 2;
            if (crH > 0) {
                if (crH > 0.0 + norm(offsetSimplexNoise(i, noiseScale, 0, j, noiseScale, 0), -1, 1) * 0.9) {
                    let colorInd = (i + j * hResX) * 3;
                    colorMap[colorInd] = red(craterColor);
                    colorMap[colorInd + 1] = green(craterColor);
                    colorMap[colorInd + 2] = blue(craterColor);
                }
            }
        }
    }

}

function boulders() {
    print("boulders");
    let boulderM = 1;
    let r = random(100);
    if (r < 67) {
        overallScale = random(0.1, 0.4);
    } else if (r < 92) {
        overallScale = random(0.8, 1.6);
    } else {
        overallScale = random(4, 8);
        boulderM = 1.5;
    }

    if (scaleMode == "scale") {
        overallScale /= windowScale;
    }

    print("overallScale", overallScale);
    noiseScale *= overallScale;

    let bouldersNoiseScale = noiseScale * 1;

    let angle = random(TAU);


    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {

            let nOffset = norm(offsetSimplexNoise(i, noiseScale * 0.5, 100, j, noiseScale * 0.5, 100), -1, 1) * TWO_PI;
            let offsetStrength = 0;
            if (scaleMode == "scale") {
                offsetStrength *= windowScale;
            }

            let n1 = plains(
                i, 0.2, offsetStrength * cos(nOffset),
                j, 1, offsetStrength * sin(nOffset),
                angle) * 5;
            let n2 = norm(offsetSimplexNoiseAngle(i, bouldersNoiseScale * 2, 0, j, bouldersNoiseScale * 2, 0, angle), -1, 1);
            let n3 = norm(offsetSimplexNoiseAngle(i, bouldersNoiseScale * 4, 0, j, bouldersNoiseScale * 4, 0, angle), -1, 1);
            let n4 = norm(offsetSimplexNoiseAngle(i, bouldersNoiseScale * 10, 0, j, bouldersNoiseScale * 10, 0, angle), -1, 1);
            let nPlains = map(
                n1 + 0.02 * n2 + 0.01 * n3 + 0.005 * n4,
                0,
                1 + 0.02 + 0.01 + 0.005,
                0,
                1);

            let col;

            erodeMap[i][j] = 1;
            depositMap[i][j] = 0.001;

            if (colorR <= 11) {
                mountainColor1 = sand1;
                terrainColor2 = sand2;
                terrainColor1 = sand1;
            }

            let boulderThreshold = 0.75;
            if (nPlains < boulderThreshold * 0.9) {
                col = terrainColor1;
            } else if (nPlains < boulderThreshold) {
                col = terrainColor2;
            } else {
                nPlains = min(
                    nPlains,
                    boulderThreshold + map(nPlains, boulderThreshold, 1, 0, 1 - boulderThreshold)
                );
                col = mountainColor1;
            }

            let n = pow(nPlains + 0.2, 6);
            hMap[i][j] += n * 5 / overallScale;

            let colorInd = (i + j * hResX) * 3;
            colorMap[colorInd] = red(col);
            colorMap[colorInd + 1] = green(col);
            colorMap[colorInd + 2] = blue(col);
        }
    }

    placeFeatures(0.00005 * (random(0.5) + 0.5), 0, 0.002 * boulderM);

    for (let i = 0; i < hResX; i++) {
        for (let j = 0; j < hResY; j++) {
            let crH = craterMap[i][j];
            hMap[i][j] += crH * 30;
            if (crH > 0) {
                if (crH > norm(offsetSimplexNoise(i, noiseScale, 0, j, noiseScale, 0), -1, 1) * 0.4) {
                    let colorInd = (i + j * hResX) * 3;
                    colorMap[colorInd] = red(mountainColor1);
                    colorMap[colorInd + 1] = green(mountainColor1);
                    colorMap[colorInd + 2] = blue(mountainColor1);
                } else if (crH > norm(offsetSimplexNoise(i, noiseScale, 0, j, noiseScale, 0), -1, 1) * 0.02) {
                    let colorInd = (i + j * hResX) * 3;
                    colorMap[colorInd] = red(craterColor);
                    colorMap[colorInd + 1] = green(craterColor);
                    colorMap[colorInd + 2] = blue(craterColor);
                }
            }
        }
    }

}

function dike(sx, sy, dikeThresh, ns) {
    let dH = ns * 0.1;
    let l = ns * 1000 / overallScale;
    let w = l / (ns * 100);
    let d = offsetNoise(nSeed);
    let angle = ns * PI;
    if (ns > dikeThresh) {
        for (let x = 0; x < l; x++) {
            let dir = createVector(x, 0);
            dir.rotate(angle);
            for (let y = 0; y < sin(map(x, 0, l, 0, PI)) * w; y++) {
                for (let a = -1; a <= 1; a++) {
                    for (let b = -1; b <= 1; b++) {
                        let perp = createVector(0, y);
                        perp.rotate(angle);
                        let px = sx + dir.x + perp.x + a;
                        let py = sy + dir.y + perp.y;
                        let xInd = floor(px);
                        let yInd = floor(py);

                        if (xInd >= 0 && xInd < hMap.length - 1) {
                            if (yInd >= 0 && yInd < hMap[0].length - 1) {
                                hMap[xInd][yInd] += sin(map(x, 0, l, 0, PI)) * dH;

                                erodeMap[xInd][yInd] = 0.7;
                                depositMap[xInd][yInd] = d;

                                let colorInd = (xInd + yInd * hResX) * 3;
                                colorMap[colorInd] = red(dikeColor);
                                colorMap[colorInd + 1] = green(dikeColor);
                                colorMap[colorInd + 2] = blue(dikeColor);
                            }
                        }
                    }
                }
            }
        }
    }
}

function dunes(i, j, sc) {
    let nOffset = norm(offsetSimplexNoise(i, noiseScale, 100, j, noiseScale, 100), -1, 1) * TWO_PI * 0.25;
    let offsetStrength = 0;
    let nDune = abs(
        offsetSimplexNoise(
            i, noiseScale * sc * 0.1, cos(nOffset) * offsetStrength,
            j, noiseScale * sc, sin(nOffset) * offsetStrength)
    );
    nDune = pow(nDune, 2);
    return nDune;
}

function plains(i, ni, oi, j, nj, oj, angle) {
    let nSand = norm(offsetSimplexNoiseAngle(i, noiseScale * ni, oi, j, noiseScale, oj, angle), -1, 1);
    nSand += norm(offsetSimplexNoiseAngle(i, noiseScale * ni * 2, oi, j, noiseScale * nj * 2, oj, angle), -1, 1) * 0.1;
    nSand += norm(offsetSimplexNoiseAngle(i, noiseScale * ni * 5, oi, j, noiseScale * nj * 5, oj, angle), -1, 1) * 0.05;
    nSand += norm(offsetSimplexNoiseAngle(i, noiseScale * ni * 40, oi, j, noiseScale * nj * 50, oj, angle), -1, 1) * 0.005;
    nSand = map(nSand, 0, 1.155, 0, 0.2);
    return nSand;
}

function rockyMountains(i, j) {
    let nOffset = norm(offsetSimplexNoise(i, noiseScale * 0.1, 100, j, noiseScale * 0.1, 100), -1, 1) * TWO_PI;
    let offsetStrength = 0.0;
    let cs = cos(nOffset) * offsetStrength;
    let sn = sin(nOffset) * offsetStrength;

    let nRock = pow(norm(offsetSimplexNoise(i, noiseScale, cs, j, noiseScale, sn), -1, 1), 2);
    nRock += pow(norm(offsetSimplexNoise(i, noiseScale * 2, cs, j, noiseScale * 2, sn), -1, 1), 2) * 0.2;
    nRock += pow(norm(offsetSimplexNoise(i, noiseScale * 3, sn + 10, j, noiseScale * 3, cs + 10), -1, 1), 2) * 0.2;
    nRock += pow(norm(offsetSimplexNoise(i, noiseScale * 5, cs, j, noiseScale * 5, sn), -1, 1), 2) * 0.05;
    nRock += pow(norm(offsetSimplexNoise(i, noiseScale * 50, cs, j, noiseScale * 50, sn), -1, 1), 2) * 0.005;
    nRock = pow(map(nRock, 0, 1.455, 0, 1) + 0.3, 3);
    return nRock;
}

function boulder(sx, sy, _r) {
    let n = norm(offsetSimplexNoise(sx, noiseScale, 0, sy, noiseScale, 0), -1, 1);
    let h = n * 5 + 2;
    let r = _r * n / overallScale;

    let rr = r * r;
    let d = offsetNoise(sx, sy);
    let boulderThresh = 0.5;
    if (n > boulderThresh) {
        for (let a = -r; a <= r; a++) {
            for (let b = -r; b <= r; b++) {
                let xInd = sx + a;
                let yInd = sy + b;

                if (xInd >= 0 && xInd < hMap.length) {
                    if (yInd >= 0 && yInd < hMap[0].length) {
                        let rNoise = norm(
                            offsetSimplexNoise(xInd, noiseScale * 30, 0,
                                yInd, noiseScale * 30, 0)
                            , -1, 1);
                        let dd = a * a + b * b;
                        if (dd < rr * rNoise) {
                            xInd = floor(sx + a);
                            yInd = floor(sy + b);
                            let dh = h * rNoise * 0.15 * 1;
                            hMap[xInd][yInd] += dh
                            erodeMap[xInd][yInd] = 0.7;
                            depositMap[xInd][yInd] = d;

                            if (dh > 0.25 / sqrt(overallScale)) {
                                let col = boulderColor;
                                let colorInd = (xInd + yInd * hResX) * 3;
                                colorMap[colorInd] = red(col);
                                colorMap[colorInd + 1] = green(col);
                                colorMap[colorInd + 2] = blue(col);
                            }
                        }
                    }
                }
            }
        }
    }
}

function crater(_x, _y, craterMap, strengthMultiplier, _nx, _ny) {
    let x = _x;
    let y = _y;
    let minRad = 5 / overallScale;

    let nx = 1 * _nx;
    let ny = 1 * _ny;

    let maxRad = min(1000, 1000 / overallScale);
    let offset = noise(nx, ny, 0) * 1000;

    let r = random(100);

    if (r < 50) {
        rad = random(10, 20);
    } else if (r < 95) {
        rad = random(40, 80);
    } else if (r < 100 - bigCratorProb) {
        rad = random(100, 200);
    } else {
        rad = 500;
    }

    rad /= sqrt(overallScale);
    if (scaleMode == "scale") {
        rad *= sqrt(windowScale);
    }

    let craterH = map(rad, minRad, maxRad, 0.2, 2) * strengthMultiplier * 0.25;
    let nScale = 0.5;

    let radiusNoiseStrength = 0.6;
    let ridgeNoiseStrength = 1;

    let sum = 0;
    let cnt = 0;
    for (let i = x - rad; i <= x + rad; i++) {
        for (let j = y - rad; j <= y + rad; j++) {
            let xInd = floor(i);
            let yInd = floor(j);
            let angle = atan2(j - y, i - x);

            let cs = cos(angle);
            let sn = sin(angle);
            if (xInd >= 0 && xInd < hMap.length) {
                if (yInd >= 0 && yInd < hMap[0].length) {
                    let dx = i - x;
                    let dy = j - y;
                    let dd = (dx * dx + dy * dy);
                    let n = offsetNoise(cs * nScale + 100, sn * nScale + 100, offset) * radiusNoiseStrength + (1 - radiusNoiseStrength);
                    let rr = rad * rad * (n * n);
                    if (dd < rr) {
                        let _x = map(dd, 0, rr, 0, 1);
                        let ridgeNoise = offsetNoise(
                            cs * nScale * 10 + 200 + offset,
                            sn * nScale * 10 + 200 + offset, sqrt(dd) * 0.01) * ridgeNoiseStrength + (1 - ridgeNoiseStrength);
                        let inner = (pow(_x, 2) * 1.5);
                        let outer = (3 - 3 * pow(_x, 2));
                        craterMap[xInd][yInd] = max(
                            smin(outer, inner, 4) * craterH,
                            craterMap[xInd][yInd] * 0.0 + 0.001) * ridgeNoise;
                        if (craterMap[xInd][yInd] > craterMax) {
                            craterMax = craterMap[xInd][yInd];
                        }
                        if (craterMap[xInd][yInd] < craterMin) {
                            craterMin = craterMap[xInd][yInd];
                        }

                        sum += hMap[xInd][yInd];
                        cnt++;
                    }
                }
            }
        }
    }

    sum /= cnt;


    let explodeAngles = [];
    let nExplodes = max(rad * 0.03, 20);
    for (let i = 0; i < nExplodes; i++) {
        let a = offsetNoise(nx, ny, nSeed + i) * TWO_PI;
        explodeAngles.push(a);
    }

    for (let i = 0; i < nExplodes; i++) {
        let cs = cos(explodeAngles[i]);
        let sn = sin(explodeAngles[i]);
        let n = offsetNoise(cs * nScale + 100, sn * nScale + 100, offset) * radiusNoiseStrength + (1 - radiusNoiseStrength);
        let d = rad * offsetNoise(i) * 3 + 1;
        let explodeStart = rad * n * 1.01;
        let explodeLen = explodeStart + d;
        let explodeW = offsetNoise(i);
        for (let r = explodeStart; r < explodeLen; r++) {
            let angleNoise = offsetSimplexNoise(i, noiseScale * map(r, explodeStart, explodeLen, 0, 10)) * PI / 32;
            cs = cos(explodeAngles[i] + angleNoise);
            sn = sin(explodeAngles[i] + angleNoise);
            let _xInd = (cs * r * 0.9 + x);
            let _yInd = (sn * r * 0.9 + y);

            let off = createVector();
            let taper = pow(map(r, explodeStart, explodeLen, 1, 0), 2);
            let blastWidth = explodeW * taper * rad * 0.2;
            for (let br = 0; br < blastWidth; br += 0.5) {
                off.x = br * map(rad, minRad, maxRad, 0.2, 1);
                off.y = 0;
                off.rotate(explodeAngles[i] + PI / 2);
                let px = _xInd + off.x;
                let py = _yInd + off.y;
                let xInd = floor(px);
                let yInd = floor(py);

                let ridgeNoise = offsetNoise(
                    xInd * nScale * 10 + 200,
                    yInd * nScale * 10 + 200, offset) *
                    ridgeNoiseStrength + (1 - ridgeNoiseStrength);
                let blastHeight = craterH * map(br, 0, blastWidth, 1, 0) * taper * 0.3 * ridgeNoise;


                if (xInd >= 0 && xInd < hMap.length) {
                    if (yInd >= 0 && yInd < hMap[0].length) {
                        craterMap[xInd][yInd] = smax(
                            blastHeight + 0.001,
                            craterMap[xInd][yInd] + 0.001,
                            4);
                        if (craterMap[xInd][yInd] > craterMax) {
                            craterMax = craterMap[xInd][yInd];
                        }
                        if (craterMap[xInd][yInd] < craterMin) {
                            craterMin = craterMap[xInd][yInd];
                        }
                    }
                }
                off.x = br * map(rad, minRad, maxRad, 0.2, 1) * -1;
                off.y = 0;
                off.rotate(explodeAngles[i] + PI / 2);
                xInd = floor(_xInd + off.x);
                yInd = floor(_yInd + off.y);
                if (xInd >= 0 && xInd < hMap.length) {
                    if (yInd >= 0 && yInd < hMap[0].length) {
                        craterMap[xInd][yInd] = smax(
                            blastHeight + 0.001,
                            craterMap[xInd][yInd] + 0.001,
                            4);
                        if (craterMap[xInd][yInd] > craterMax) {
                            craterMax = craterMap[xInd][yInd];
                        }
                        if (craterMap[xInd][yInd] < craterMin) {
                            craterMin = craterMap[xInd][yInd];
                        }
                    }
                }
            }
        }
    }

    for (let i = x - rad; i <= x + rad; i++) {
        for (let j = y - rad; j <= y + rad; j++) {
            let xInd = floor(i);
            let yInd = floor(j);
            let angle = atan2(j - y, i - x);
            let cs = cos(angle);
            let sn = sin(angle);

            if (xInd >= 0 && xInd < hMap.length) {
                if (yInd >= 0 && yInd < hMap[0].length) {
                    let dx = i - x;
                    let dy = j - y;
                    let dd = (dx * dx + dy * dy);
                    let n = offsetNoise(cs * nScale + 100, sn * nScale + 100, offset) * radiusNoiseStrength + (1 - radiusNoiseStrength);
                    let rr = rad * rad * n * n;
                    if (dd < rr) {
                        hMap[xInd][yInd] = sum
                            + norm(offsetSimplexNoise(xInd * noiseScale, yInd * noiseScale), -1, 1)
                            * craterH * 0.2
                            * map(dd, 0, rr, 1, 0);
                    }
                }
            }
        }
    }

}

function placeFeatures(craterProb, dikeProb, boulderProb) {
    // return;
    print("placing features");
    let pyramidProbability = 0.002;
    let pyramidNoiseProbability;
    let pyramidNoiseProbabilityStrength = 0.0006;
    let maxPyramids = 10;

    let nCrats = 0;
    let nDikes = 0;
    let nBoulders = 0;
    let dikeNoiseScale = noiseScale * 0.01;

    let wid = hResX;
    let hei = hResY;

    let iLimit = max(wid, hei);
    if (scaleMode == "scale") {
        dikeNoiseScale *= windowScale;
        iLimit /= windowScale;
    }
    iLimit *= 3;
    let step = 2;
    let cx, cy;
    for (let i = 0; i < iLimit; i += step) {
        for (j = -i; j <= i; j += step) {
            if (scaleMode == "scale") {
                cx = ((winHeight * aspectRatio) / 2 + j) * windowScale + offScreenMargin * windowScale / 2;
                cy = (winHeight / 2 - i) * windowScale + offScreenMargin * windowScale / 2;
            } else {
                cx = wid / 2 + j;
                cy = hei / 2 - i;
            }
            let rnd = random(1);
            if (rnd < craterProb) {
                crater(cx, cy, craterMap, offsetNoise(j * noiseScale, -i * noiseScale) * 2 + 1, j, -i);
                nCrats++;
            }
            rnd = random(1);
            if (rnd < dikeProb) {
                dike(cx, cy, offsetNoise(rSeed) * 0.2 + 0.3, offsetNoise(nSeed + 1, j * dikeNoiseScale, -i * dikeNoiseScale))
                nDikes++;
            }
            rnd = random(1);
            if (rnd < boulderProb) {
                boulder(cx, cy, offsetNoise(j, -i) * 18 + 2);
                nBoulders++;
            }
            rnd = random(1);
            if (rnd < pyramidProbability && pyramidsOn) {
                // pyramidNoiseProbability = norm(offsetSimplexNoise(j, noiseScale*0.1, 0, -i, noiseScale*0.1, 0), -1, 1) * 0.01;
                pyramidNoiseProbability = offsetNoise(j, -i) * pyramidNoiseProbabilityStrength;
                if (rnd < pyramidNoiseProbability) {
                    // let newPyramid = createVector(cx, cy, (offsetNoise(j, -i) * 18 + 7) / overallScale);
                    let newPyramid = [cx, cy, (offsetNoise(j, -i) * 10 + 5) / overallScale, offsetNoise(j, -i)];

                    let fits = true;
                    for (let k = 0; k < pyramids.length; k++) {
                        let d = dist(newPyramid[0], newPyramid[1], pyramids[k][0], pyramids[k][1]);
                        if (d < (pyramids[k][2] + newPyramid[2]) * 1.5) {
                            fits = false;
                            break;
                        }
                    }

                    if (fits) {
                        if (pyramids.length < maxPyramids) {
                            pyramids.push(newPyramid);
                        }
                    }
                }
            }

            if (scaleMode == "scale") {
                cy = (winHeight / 2 + i) * windowScale + offScreenMargin * windowScale / 2;
            } else {
                cy = hei / 2 + i;
            }
            rnd = random(1);
            if (rnd < craterProb) {
                crater(cx, cy, craterMap, offsetNoise(j * noiseScale, i * noiseScale) * 2 + 1, j, i);
                nCrats++;
            }
            rnd = random(1);
            if (rnd < dikeProb) {
                dike(cx, cy, offsetNoise(rSeed) * 0.2 + 0.3, offsetNoise(nSeed + 1, j * dikeNoiseScale, i * dikeNoiseScale))
                nDikes++;
            }
            rnd = random(1);
            if (rnd < boulderProb) {
                boulder(cx, cy, offsetNoise(j, i) * 18 + 2);
                nBoulders++;
            }
            rnd = random(1);
            if (rnd < pyramidProbability && pyramidsOn) {
                pyramidNoiseProbability = offsetNoise(j, i) * pyramidNoiseProbabilityStrength;
                if (rnd < pyramidNoiseProbability) {
                    // let newPyramid = createVector(cx, cy, (offsetNoise(j, i) * 18 + 7) / overallScale);
                    let newPyramid = [cx, cy, (offsetNoise(j, i) * 10 + 5) / overallScale, offsetNoise(j, i)];

                    let fits = true;
                    for (let k = 0; k < pyramids.length; k++) {
                        let d = dist(newPyramid[0], newPyramid[1], pyramids[k][0], pyramids[k][1]);
                        if (d < (pyramids[k][2] + newPyramid[2]) * 1.5) {
                            fits = false;
                            break;
                        }
                    }

                    if (fits) {
                        if (pyramids.length < maxPyramids) {
                            pyramids.push(newPyramid);
                        }
                    }
                }
            }

            if (scaleMode == "scale") {
                cx = ((winHeight * aspectRatio) / 2 - i) * windowScale + offScreenMargin * windowScale / 2;
                cy = (winHeight / 2 + j) * windowScale + offScreenMargin * windowScale / 2;
            } else {
                cx = wid / 2 - i;
                cy = hei / 2 + j;
            }
            rnd = random(1);
            if (rnd < craterProb) {
                crater(cx, cy, craterMap, offsetNoise(-i * noiseScale, j * noiseScale) * 2 + 1, -i, j);
                nCrats++;
            }
            rnd = random(1);
            if (rnd < dikeProb) {
                dike(cx, cy, offsetNoise(rSeed) * 0.2 + 0.3, offsetNoise(nSeed + 1, -i * dikeNoiseScale, j * dikeNoiseScale))
                nDikes++;
            }
            rnd = random(1);
            if (rnd < boulderProb) {
                boulder(cx, cy, offsetNoise(-i, j) * 18 + 2);
                nBoulders++;
            }
            rnd = random(1);
            if (rnd < pyramidProbability && pyramidsOn) {
                pyramidNoiseProbability = offsetNoise(-i, j) * pyramidNoiseProbabilityStrength;
                if (rnd < pyramidNoiseProbability) {
                    // let newPyramid = createVector(cx, cy, (offsetNoise(-i, j) * 18 + 7) / overallScale);
                    let newPyramid = [cx, cy, (offsetNoise(-i, j) * 10 + 5) / overallScale, offsetNoise(-i, j)];

                    let fits = true;
                    for (let k = 0; k < pyramids.length; k++) {
                        let d = dist(newPyramid[0], newPyramid[1], pyramids[k][0], pyramids[k][1]);
                        if (d < (pyramids[k][2] + newPyramid[2]) * 1.5) {
                            fits = false;
                            break;
                        }
                    }

                    if (fits) {
                        if (pyramids.length < maxPyramids) {
                            pyramids.push(newPyramid);
                        }
                    }
                }
            }

            if (scaleMode == "scale") {
                cx = ((winHeight * aspectRatio) / 2 + i) * windowScale + offScreenMargin * windowScale / 2;
            } else {
                cx = wid / 2 + i;
            }
            rnd = random(1);
            if (rnd < craterProb) {
                crater(cx, cy, craterMap, offsetNoise(i * noiseScale, j * noiseScale) * 2 + 1, i, j);
                nCrats++;
            }
            rnd = random(1);
            if (rnd < dikeProb) {
                dike(cx, cy, offsetNoise(rSeed) * 0.2 + 0.3, offsetNoise(nSeed + 1, i * dikeNoiseScale, j * dikeNoiseScale))
                nDikes++;
            }
            rnd = random(1);
            if (rnd < boulderProb) {
                boulder(cx, cy, offsetNoise(i, j) * 18 + 2);
                nBoulders++;
            }
            rnd = random(1);
            if (rnd < pyramidProbability && pyramidsOn) {
                pyramidNoiseProbability = offsetNoise(i, j) * pyramidNoiseProbabilityStrength;
                if (rnd < pyramidNoiseProbability) {
                    // let newPyramid = createVector(cx, cy, (offsetNoise(i, j) * 18 + 7) / overallScale);
                    let newPyramid = [cx, cy, (offsetNoise(i, j) * 10 + 5) / overallScale, offsetNoise(i, j)];

                    let fits = true;
                    for (let k = 0; k < pyramids.length; k++) {
                        let d = dist(newPyramid[0], newPyramid[1], pyramids[k][0], pyramids[k][1]);
                        if (d < (pyramids[k][2] + newPyramid[2]) * 1.5) {
                            fits = false;
                            break;
                        }
                    }

                    if (fits) {
                        if (pyramids.length < maxPyramids) {
                            pyramids.push(newPyramid);
                        }
                    }
                }
            }
        }
    }

    print("nCrats", nCrats);
    print("nDikes", nDikes);
    print("nBoulders", nBoulders);
}


function pyramid(px, py, rd, _angle) {
    let r = rd;
    let rr = r * r;
    let monolithH = rd * 0.2;
    let minMonoH = 1000000;
    let angle = _angle * TAU; //offsetNoise(nSeed + 1, px * 0.1, py * 0.1) * TAU; //sNoise.noise2D(px*noiseScale * 0.1, py*noiseScale * 0.1) * PI;
    for (let i = -2 * r; i <= 2 * r; i++) {
        for (let j = -2 * r; j <= 2 * r; j++) {
            let c = createVector(i, j);
            c.x += px;
            c.y += py;
            let xInd = floor(c.x);
            let yInd = floor(c.y);
            if (xInd >= 0 && xInd < hResX) {
                if (yInd >= 0 && yInd < hResY) {
                    if (craterMap[xInd][yInd] > 0.1) {
                        return;
                    }
                    if (hMap[xInd][yInd] < minMonoH) {
                        minMonoH = hMap[xInd][yInd];
                    }
                }
            }
        }
    }


    let a = createVector(-r, -r);
    let b = createVector(r, -r);
    let c = createVector(r, r);
    let d = createVector(-r, r);
    let e = createVector(0, 0);

    a.rotate(angle);
    b.rotate(angle);
    c.rotate(angle);
    d.rotate(angle);

    for (let i = -2 * r; i <= 2 * r; i++) {
        for (let j = -2 * r; j <= 2 * r; j++) {
            let _c = createVector(i, j);
            let xInd = floor(_c.x + px);
            let yInd = floor(_c.y + py);
            if (xInd >= 0 && xInd < hResX) {
                if (yInd >= 0 && yInd < hResY) {
                    let newH = -1;
                    if (pointInTriangle(_c, a, b, e)) {
                        let refVect = createVector(0, -1);
                        refVect.rotate(angle);
                        let dt = p5.Vector.dot(refVect, createVector(_c.x - e.x, _c.y - e.y));
                        newH = map(dt, r, 0, 0, monolithH);
                    } else if (pointInTriangle(_c, b, c, e)) {
                        let refVect = createVector(1, 0);
                        refVect.rotate(angle);
                        let dt = p5.Vector.dot(refVect, createVector(_c.x - e.x, _c.y - e.y));
                        newH = map(dt, r, 0, 0, monolithH);
                    } else if (pointInTriangle(_c, c, d, e)) {
                        let refVect = createVector(0, 1);
                        refVect.rotate(angle);
                        let dt = p5.Vector.dot(refVect, createVector(_c.x - e.x, _c.y - e.y));
                        newH = map(dt, r, 0, 0, monolithH);
                    } else if (pointInTriangle(_c, d, a, e)) {
                        let refVect = createVector(-1, 0);
                        refVect.rotate(angle);
                        let dt = p5.Vector.dot(refVect, createVector(_c.x - e.x, _c.y - e.y));
                        newH = map(dt, r, 0, 0, monolithH);
                    }

                    newH += minMonoH;

                    if (newH > hMap[xInd][yInd]) {
                        hMap[xInd][yInd] = newH;
                        erodeMap[xInd][yInd] = 0.1;
                        depositMap[xInd][yInd] = 0.001;
                        let col = boulderColor;
                        let colorInd = (xInd + yInd * hResX) * 3;
                        colorMap[colorInd] = red(col);
                        colorMap[colorInd + 1] = green(col);
                        colorMap[colorInd + 2] = blue(col);
                    }
                }
            }
        }
    }
}

function h(x, y) {
    let xInd = floor(x);
    let yInd = floor(y);
    if (xInd >= 0 && xInd < hMap.length) {
        if (yInd >= 0 && yInd < hMap[0].length) {
            return hMap[xInd][yInd];
        }
    }
    return -1;
}
