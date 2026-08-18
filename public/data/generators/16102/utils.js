// Author: Nathaniel Sarkissian
// Date: July 8, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function drawLoadingScreen() {
    canv.push();
    // canv.scale(mag, mag);
    canv.scale(resScaleFactor, resScaleFactor);
    canv.push();
    canv.translate(1210, 1100);
    canv.scale(20, 20);

    for (let j = 0; j < 10; j++) {
        canv.push();
        canv.translate(frandAB(-1, 1) * 0.5, frandAB(-1, 1) * 0.2);
        canv.strokeWeight(0.1);
        let bladeAngle = frandA(PI / 4) - PI / 8;

        for (let i = 0; i < 1; i++) {
            let blade = createVector(0, -frandAB(3, 5));
            // blade.mult(frandA(1));
            blade.rotate(bladeAngle);
            let spread = createVector(frandA(j) / 10, 0);
            spread.rotate(frandA(TAU));
            let grassX = spread.x;
            let grassY = spread.y * 0.3;
            // let grassEndX = grassX + blade.x;
            // let grassEndY = grassY + blade.y;
            let flowerType = frandArr(flowerTypes);

            if (flowerType == "daisy") {
                drawDaisy(grassX, grassY, 1, blade.mag(), blade.heading() + PI / 2, 1, true);
            } else if (flowerType == "rose") {
                drawRose(grassX, grassY, 1, blade.mag(), blade.heading() + PI / 2, 1, true);
            } else if (flowerType == "thistle") {
                drawThistle(grassX, grassY, 1, blade.mag(), blade.heading() + PI / 2, 1, true);
            } else if (flowerType == "tall") {
                drawTallFlower(grassX, grassY, 1, blade.mag(), blade.heading() + PI / 2, 1, true);
            } else {
                drawPoppy(grassX, grassY, 1, blade.mag(), blade.heading() + PI / 2, 1, true);
            }
        }

        for (let i = 0; i < 100; i++) {
            let blade = createVector(0, -pow(frandA(2), 2));
            let angleNoise = 0; //frandAB(-1,    1) * PI / 8;
            blade.mult(frandA(1));
            blade.rotate(bladeAngle + angleNoise);
            let spread = createVector(frandA(1), 0);
            spread.rotate(frandA(TAU));
            let grassX = spread.x;
            let grassY = spread.y * 0.3;
            let grassEndX = grassX + blade.x;
            let grassEndY = grassY + blade.y;
            drawBlade(grassX, grassY, grassEndX, grassEndY, 1, 1, blade.length);
            // drawBlade(grassX, grassY, grassEndX, grassEndY, 1, 0, blade.length);
        }
        canv.pop();
    }
    // canv.pop();

    canv.textFont(loadingFont);
    canv.textSize(5);
    canv.fill(grassCols[grassCols.length-1]);
    canv.text("Bardez", -11 - canv.textWidth("Bardez") / 2, 0);
    // canv.textSize(2);
    // canv.text("Nat Sarkissian", -15, 2);
    canv.pop();
    canv.pop();

    image(canv, 0, 0, width, height);
}

function prepareRocks() {
    rockMap = createGraphics(mapW, mapH);
    rockMap.background(0);
    for (let i = 0; i < mapW; i++) {
        let row = [];
        for (let j = 0; j < mapH; j++) {
            row.push(0); //random(1) < 0.5 ? 1 : 0);
        }
        rockMapArr.push(row);
    }

    r = floor(frandA(30));
    if (r < 15) { // mid angle
        rockPlacement = "random";
    } else if (r < 20) {
        rockPlacement = "circle";
    } else {
        rockPlacement = "none";
    }

    if (overallZoom > 0.5) { // wide angle
        r = floor(frandA(10));
        if (r < 8) {
            rockPlacement = "random";
        } else {
            rockPlacement = "circle";
        }
    }

    if (overallZoom <= 0.2) { // narrow angle
        r = floor(frandA(10));
        if (r < 8) {
            rockPlacement = "random";
        } else {
            rockPlacement = "none";
        }
    }
    // rockPlacement = "none";
    // rockPlacement = "x";
    // rockPlacement = "circle";
    // rockPlacement = "grid";
    // rockPlacement = "big in middle";
    // rockPlacement = "random";

  // print(rockPlacement);
    let nRocks;
    if (rockPlacement == "random") {
        nRocks = frandAB(1, 7) * areaM * 4;
        let nTries = 0;
        let clumpPos = createVector(frandA(mapW / 4), 0);
        clumpPos.rotate(frandA(TAU));
        clumpPos.x += mapW / 2;
        clumpPos.y += mapH / 1.8;
        for (let i = 0; i < nRocks; i++) {
            let posOffset = createVector(frandA(mapW / 1.4), 0);
            posOffset.rotate(frandA(TAU));
            // let pos = createVector(
            //   frandAB(10, mapW),
            //   frandAB(50 * overallZoom, mapH*0.8));
            let pos = p5.Vector.add(clumpPos, posOffset);
            let rockSz;
            let r = floor(frandA(100));
            if (r < 10) {
              // print("sz1");
                rockSz = frandAB(0.06, 0.07);
            } else if (r < 75) {
              // print("sz2");
                rockSz = frandAB(0.04, 0.06);
            } else {
              // print("sz3");
                rockSz = frandAB(0.07, 0.1);
            }
            if (overallZoom <= 0.2) {
                rockSz *= 0.4;
                pos.y -= 20;
            } else if (overallZoom <= 0.4) {
                rockSz *= 0.8;
                pos.y -= 20;
            }

            let tooClose = false;
            if (pos.x < mapW * 0.1 || pos.x >= mapW * 0.9 || pos.y < 0 || pos.y >= mapH * 0.6) {
                tooClose = true;
            }

            if (!tooClose) {
                for (let j = 0; j < rocks.length; j++) {
                    let r = rocks[j];
                    let d = dist(pos.x, pos.y, r.i, r.j);
                    if (d < (r.sz + rockSz) * 240) {
                        tooClose = true;
                        break;
                    }
                }
            }

            if (tooClose) {
                nTries++;
                if (nTries < 5) {
                    i--;
                }
            } else {
                nTries = 0;
                rocks.push(
                    new Rock(
                        rockSz, // frandAB(0.06, 0.15),
                        pos.x,
                        pos.y
                    )
                );
            }
        }
    } else if (rockPlacement == "circle") {
        nRocks = max(6, floor(frandAB(7, 9) * overallZoom));
      // print("nRocks", nRocks);
        let angleOffset = frandA(TAU);
        let center = createVector(mapW / 1.9, mapH / 1.9);
        if (overallZoom >= 0.6 && overallZoom <= 1) {
            center = transformXYZ(-map(overallZoom, 0.6, 1, 1, 4) * xyFlip, 0, 0);
        } else {
            center.x += mapW / 4 * (floor(frandA(10)) < 5 ? -1 : 1);
            center.y -= mapH / 8;
        }
        for (let i = 0; i < nRocks; i++) {
            if (floor(frandA(100)) < 99) {
                let angle = fmap(i, 0, nRocks, 0, TAU) + frandAB(-1, 1) * PI / 64 + angleOffset;
                let radiusAdjust = 0.5;
                let radiusX = (mapW * radiusAdjust) / 2;
                let radiusY = (mapW * radiusAdjust * max(aspectRatio, 0.7)) / 2;
                let x = radiusX * cos(angle) + center.x;
                let y = radiusY * sin(angle) + center.y;
                let pos = createVector(x, y);
                let rockSz = frandAB(0.03, 0.07);
                if (overallZoom < 0.5) {
                    rockSz *= 0.8;
                    pos.y -= 20;
                }
                rocks.push(
                    new Rock(
                        rockSz,
                        pos.x,
                        pos.y
                    )
                );
            }
        }
    }

  // print("Flip", xyFlip);
    rockMap.loadPixels();
    for (let i = 0; i < mapW; i++) {
        for (let j = 0; j < mapH; j++) {
            let pi = floor(i);
            let pj = floor(j);

            if (xyFlip == -1) {
                pi = floor(mapW - i - 1);
            }
            let pixInd = (floor(i) + floor(j) * mapW) * 4;
            let br = rockMapArr[pi][pj];
            if (rockMapArr[pi][pj] > 0) {
                rockMap.pixels[pixInd + 0] = 255;
                rockMap.pixels[pixInd + 1] = 255;
                rockMap.pixels[pixInd + 2] = 255;
                rockMap.pixels[pixInd + 3] = 255;
            } else {
                rockMap.pixels[pixInd + 0] = 0;
                rockMap.pixels[pixInd + 1] = 0;
                rockMap.pixels[pixInd + 2] = 0;
                rockMap.pixels[pixInd + 3] = 255;
            }
        }
    }
    rockMap.updatePixels();
}

function transformIJ(i, j, sc) {
    if (i < 0 || i >= mapW || j < 0 || j >= mapH) {
      // print("err");
        return createVector(-1, -1, -1);
    }
    let h1 = fmap(hMap[i][j], hMin, hMax, 0, maxTerrH);
    let v = createVector(i - mapW / 2, h1, j - mapH / 2);
    v.mult(sc);
    return v;
}

function transformXYZ(x, y, z, sc) {
    let v = createVector(x, y, z / zAngle);
    v.mult(1 / sc);
    v.x += mapW / 2;
    v.z += mapH / 2;
    return createVector(v.x, v.z);
}

function frandAB(a, b) {
    randomCount++;
    let d = Math.fround(b) - Math.fround(a);
    return Math.fround(fxrand()) * d + Math.fround(a);
    // return Math.fround(random(a, b));
}

function frandA(a) {
    randomCount++;
    return Math.fround(Math.fround(fxrand()) * Math.fround(a));
    // return Math.fround(random(a));
}

function frandArr(a) {
    randomCount++;
    let ind = floor(fxrand() * a.length);
    return a[ind];
    // return random(a);
}

function fnoise(_a, _b, _c) {
    let a = _a;
    if (_b == undefined) {
        b = 0;
    } else {
        b = _b;
    }
    if (_c == undefined) {
        c = 0;
    } else {
        c = _c;
    }
    return Math.fround(noise(Math.fround(a), Math.fround(b), Math.fround(c)));
}

function fpow(a, b) {
    return Math.fround(pow(a, b));
}

function fmap(a, a1, a2, b1, b2) {
    return Math.fround(map(a, a1, a2, b1, b2));
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = floor(frandA(currentIndex));
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function drawTri(arr, x1, y1, x2, y2, x3, y3) {
    let minx = min(min(floor(x1), floor(x2)), floor(x3));
    let miny = min(min(floor(y1), floor(y2)), floor(y3));
    let maxx = max(max(ceil(x1), ceil(x2)), ceil(x3));
    let maxy = max(max(ceil(y1), ceil(y2)), ceil(y3));

    let p1 = createVector(x1, y1);
    let p2 = createVector(x2, y2);
    let p3 = createVector(x3, y3);
    for (let x = minx; x <= maxx; x++) {
        for (let y = miny; y <= maxy; y++) {
            let ax = floor(x);
            let ay = floor(y);
            if (ax >= 0 && ax < arr.length) {
                if (ay >= 0 && ay < arr[ax].length) {
                    let pt = createVector(x, y);
                    if (pointInTriangle(pt, p1, p2, p3)) {
                        arr[ax][ay] = 1;
                    }
                }
            }
            ax = floor(x - 1);
            ay = floor(y);
            if (ax >= 0 && ax < arr.length) {
                if (ay >= 0 && ay < arr[ax].length) {
                    let pt = createVector(x, y);
                    if (pointInTriangle(pt, p1, p2, p3)) {
                        arr[ax][ay] = 1;
                    }
                }
            }
            ax = floor(x + 1);
            ay = floor(y);
            if (ax >= 0 && ax < arr.length) {
                if (ay >= 0 && ay < arr[ax].length) {
                    let pt = createVector(x, y);
                    if (pointInTriangle(pt, p1, p2, p3)) {
                        arr[ax][ay] = 1;
                    }
                }
            }
            ax = floor(x);
            ay = floor(y - 1);
            if (ax >= 0 && ax < arr.length) {
                if (ay >= 0 && ay < arr[ax].length) {
                    let pt = createVector(x, y);
                    if (pointInTriangle(pt, p1, p2, p3)) {
                        arr[ax][ay] = 1;
                    }
                }
            }
            ax = floor(x);
            ay = floor(y + 1);
            if (ax >= 0 && ax < arr.length) {
                if (ay >= 0 && ay < arr[ax].length) {
                    let pt = createVector(x, y);
                    if (pointInTriangle(pt, p1, p2, p3)) {
                        arr[ax][ay] = 1;
                    }
                }
            }
        }
    }
}

function sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function pointInTriangle(pt, v1, v2, v3) {
    let d1, d2, d3;
    let has_neg, has_pos;

    d1 = sign(pt, v1, v2);
    d2 = sign(pt, v2, v3);
    d3 = sign(pt, v3, v1);

    has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(has_neg && has_pos);
}

function rotateVector(v, a, b, c) {
    let x1 = cos(a);
    let x2 = sin(a);
    let x3 = 0;
    let y1 = -sin(a);
    let y2 = cos(a);
    let y3 = 0;
    let z1 = 0;
    let z2 = 0;
    let z3 = 1;

    v.set(v.x * x1 + v.y * y1 + v.z * z1,
        v.x * x2 + v.y * y2 + v.z * z2,
        v.x * x3 + v.y * y3 + v.z * z3);

    x1 = cos(b);
    x2 = 0;
    x3 = sin(b);
    y1 = 0;
    y2 = 1;
    y3 = 0;
    z1 = -sin(b);
    z2 = 0;
    z3 = cos(b);

    v.set(v.x * x1 + v.y * y1 + v.z * z1,
        v.x * x2 + v.y * y2 + v.z * z2,
        v.x * x3 + v.y * y3 + v.z * z3);

    x1 = 1;
    x2 = 0;
    x3 = 0;
    y1 = 0;
    y2 = cos(c);
    y3 = sin(c);
    z1 = 0;
    z2 = -sin(c);
    z3 = cos(c);

    v.set(v.x * x1 + v.y * y1 + v.z * z1,
        v.x * x2 + v.y * y2 + v.z * z2,
        v.x * x3 + v.y * y3 + v.z * z3);
}
function blurMap(map, it, strength) {
    let i, j, k, sum, count;
    for (k = 0; k < it; k++) {
        for (i = 0; i < map.length; i++) {
            for (j = 0; j < map[0].length; j++) {
                sum = 0;
                count = 0;

                if (i > 0) {
                    count++;
                    sum += map[i - 1][j];
                    if (j > 0) {
                        count++;
                        sum += map[i - 1][j - 1];
                    }
                    if (j < map[0].length - 1) {
                        count++;
                        sum += map[i - 1][j + 1];
                    }
                }
                if (i < map.length - 1) {
                    count++;
                    sum += map[i + 1][j];
                    if (j > 0) {
                        count++;
                        sum += map[i + 1][j - 1];
                    }
                    if (j < map[0].length - 1) {
                        count++;
                        sum += map[i + 1][j + 1];
                    }
                }
                sum += map[i][j];
                count++;

                map[i][j] = lerp(map[i][j], sum / count, strength);
            }
        }
    }
}
function percBr(col) {
    return (
        fpow(red(col), 2) * 0.2126 +
        fpow(green(col), 2) * 0.7152 +
        fpow(blue(col), 2) * 0.0722
    );
}

function updateShading() {
    theShader.setUniform('mxmy', [mouseX / canv.width, mouseY / canv.height]);
    theShader.setUniform('u_resolution', [mapW, mapH]);
    theShader.setUniform('hMapImg', hMapImg);
    // theShader.setUniform('colorMapTex', colorMapTex);
    // theShader.setUniform('frameTex', frameImg);
    theShader.setUniform('mouse', [mouseX, mouseY]);
    theShader.setUniform('lightAngle', lightAngle);
    theShader.setUniform('lightHeightAngle', lightHeightAngle); //2.2);
    theShader.setUniform('lightVector', [lightVector.x, lightVector.y, lightVector.z]);
    theShader.setUniform('aoMax', 1000); //aoMax);
    theShader.setUniform('minH', 0); //minH);
    theShader.setUniform('maxH', 40); //maxH);
    theShader.setUniform('sinImg', sinImg);
    theShader.setUniform('cosImg', cosImg);
    theShader.setUniform('tanImg', tanImg);
    theShader.setUniform('sn', sn);
    theShader.setUniform('cs', cs);

    lightMap.shader(theShader);
    lightMap.background(0);
    lightMap.rect(0, 0, lightMap.width, lightMap.height);
}

function getRayHeightAtPoint(height, LightAngleZ, distance) {
    return (distance * tan(LightAngleZ) + height);
}

function pixelHeightAtPoint(point) {
    let px = floor(point.x);
    let py = floor(point.y);
    if (px >= 0 && px < mapW) {
        if (py >= 0 && py < mapH) {
            let h = fmap(hMap[px][py], hMin, hMax, 0, maxTerrH);
            return h;
        }
    }
    return -1;
}

function pointOnLine(start, angle, length) {
    let x = length * cos(angle);
    let y = length * sin(angle);

    return createVector(start.x + x, start.y + y);
}

function getHeightAlongRay(start, lightAngleXY, distance) {
    let newTexCoord = pointOnLine(start, lightAngleXY, distance);
    return pixelHeightAtPoint(newTexCoord);
}

function lightColor(br) {
    return lerpColor(shadowCol, highlightCol, br);
}

function rockLightColor(br) {
    return lerpColor(rockShadowCol, rockHighlightCol, br);
}

function handleUrlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const magParam = urlParams.get('mag')
    if (magParam == null) {
      // print("no mag specified, setting mag to 1");
        mag = 1;
    } else {
      // print("Mag:", magParam);
        if (float(magParam) > 0) {
            mag = max(float(magParam), 1);
        } else {
          // print("invalid mag, setting mag mode to 1.0");
            mag = 1;
        }
    }
}

function isFloof(i, j) {
    let floofNoiseScale = noiseScale * 6 * 1.5;
    let nx = i + frandAB(-1, 1) * 2;
    let ny = j + frandAB(-1, 1) * 2;
    noiseOff = 10;
    n1 = norm(sNoise.noise2D(nx * floofNoiseScale * 1 + noiseOff, ny * floofNoiseScale * 1 + noiseOff), -1, 1);
    n2 = norm(sNoise.noise2D(nx * floofNoiseScale * 4 + noiseOff, ny * floofNoiseScale * 4 + noiseOff), -1, 1);
    n3 = norm(sNoise.noise2D(nx * floofNoiseScale * 8 + noiseOff, ny * floofNoiseScale * 8 + noiseOff), -1, 1);
    let floofNoise = n1 * 0.7 + n2 * 0.2 + n3 * 0.1;

    return [floor(floofNoise * 10) > floor(floofThresh * 10), floofNoise];
}

function isSage(i, j) {
    // let noiseScaleNoise = fmap(sNoise.noise2D(i * noiseScale * 0.5 + 10, j * noiseScale * 0.5 + 10), -1, 1, 1, 3);
    let sageNoiseScale = noiseScale * 1 / overallZoom; //map(overallZoom, 0.5, 1, 0.8, 1); // * noiseScaleNoise;
    nx = i + frandAB(-1, 1) * 2;
    ny = j + frandAB(-1, 1) * 2;
    noiseOff = 105;
    n1 = norm(sNoise.noise2D(nx * sageNoiseScale * 1 + noiseOff, ny * sageNoiseScale * 1 + noiseOff), -1, 1);
    n2 = norm(sNoise.noise2D(nx * sageNoiseScale * 4 + noiseOff, ny * sageNoiseScale * 4 + noiseOff), -1, 1);
    n3 = norm(sNoise.noise2D(nx * sageNoiseScale * 8 + noiseOff, ny * sageNoiseScale * 8 + noiseOff), -1, 1);

    let sageNoise = n1 * 0.3 + n2 * 0.4 + n3 * 0.3; //n1 * 0.5 + n2 * 0.4 + n3 * 0.1;
    // let sageNoise = n1 * 0.5 + n2 * 0.4 + n3 * 0.1;
    return [floor(sageNoise * 10) > floor(sageThresh * 10), sageNoise];
}

function isFlower(i, j) {
    // let noiseScaleNoise = fmap(sNoise.noise2D(i * noiseScale * 0.5 + 10, j * noiseScale * 0.5 + 10), -1, 1, 1, 2);

    let flowerNoiseScale = noiseScale * 0.8 / map(overallZoom, 0.5, 1, 0.8, 1) * flowerNoiseScaleAdjust; // * noiseScaleNoise;
    nx = i + frandAB(-1, 1) * 2;
    ny = j + frandAB(-1, 1) * 2;
    noiseOff = 0; //300;
    n1 = norm(sNoise.noise2D(nx * flowerNoiseScale * 1 + noiseOff, ny * flowerNoiseScale * 1 + noiseOff), -1, 1);
    n2 = norm(sNoise.noise2D(nx * flowerNoiseScale * 4 + noiseOff, ny * flowerNoiseScale * 4 + noiseOff), -1, 1);
    n3 = norm(sNoise.noise2D(nx * flowerNoiseScale * 8 + noiseOff, ny * flowerNoiseScale * 8 + noiseOff), -1, 1);
    let flowerNoise = n1 * 0.2 + n2 * 0.6 + n3 * 0.2; //n1 * 0.5 + n2 * 0.35 + n3 * 0.15;
    // let flowerNoise = n1 * 0.5 + n2 * 0.35 + n3 * 0.15;

    let noiseOff2 = 300;
    flowerNoiseScale = noiseScale * 1.5 * flowerTypeNoiseScaleAdjust;
    n1 = norm(sNoise.noise2D(nx * flowerNoiseScale * 1 + noiseOff2, ny * flowerNoiseScale * 1 + noiseOff2), -1, 1);
    n2 = norm(sNoise.noise2D(nx * flowerNoiseScale * 4 + noiseOff2, ny * flowerNoiseScale * 4 + noiseOff2), -1, 1);
    n3 = norm(sNoise.noise2D(nx * flowerNoiseScale * 8 + noiseOff2, ny * flowerNoiseScale * 8 + noiseOff2), -1, 1);
    n4 = norm(sNoise.noise2D(nx * flowerNoiseScale * 20 + noiseOff2, ny * flowerNoiseScale * 20 + noiseOff2), -1, 1);
    let flowerTypeNoise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
    if (n4 > 0.7) {
        n1 = norm(sNoise.noise2D(nx * flowerNoiseScale * 1 + noiseOff2 * 2, ny * flowerNoiseScale * 1 + noiseOff2 * 2), -1, 1);
        n2 = norm(sNoise.noise2D(nx * flowerNoiseScale * 4 + noiseOff2 * 2, ny * flowerNoiseScale * 4 + noiseOff2 * 2), -1, 1);
        n3 = norm(sNoise.noise2D(nx * flowerNoiseScale * 8 + noiseOff2 * 2, ny * flowerNoiseScale * 8 + noiseOff2 * 2), -1, 1);
        flowerTypeNoise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
    }

    return [floor((flowerNoise + frandA(0.1)) * 10) < floor(flowerThresh * 10), flowerNoise, flowerTypeNoise];
    // return [floor((flowerNoise+frandA(0.1))*10 - 1) < floor(flowerThresh*10), flowerNoise, flowerTypeNoise];
}

function isBee(i, j) {
    if (!drawBees) {
        return false;
    }
    let beeNoiseScale = noiseScale * 0.8 / map(overallZoom, 0.5, 1, 0.8, 1); // * noiseScaleNoise;
    nx = i + frandAB(-1, 1) * 2;
    ny = j + frandAB(-1, 1) * 2;
    noiseOff = 0;
    n1 = norm(sNoise.noise2D(nx * beeNoiseScale * 1 + noiseOff, ny * beeNoiseScale * 1 + noiseOff), -1, 1);
    n2 = norm(sNoise.noise2D(nx * beeNoiseScale * 4 + noiseOff, ny * beeNoiseScale * 4 + noiseOff), -1, 1);
    n3 = norm(sNoise.noise2D(nx * beeNoiseScale * 8 + noiseOff, ny * beeNoiseScale * 8 + noiseOff), -1, 1);
    let beeNoise = n1 * 0.2 + n2 * 0.6 + n3 * 0.2;
    return floor(frandA(100) < 5) && beeNoise > 0.7;
}

function isDragonFly(i, j) {
    if (!drawDragonFlies) {
        return false;
    }
    let dragonFlyNoiseScale = noiseScale * 0.8 / map(overallZoom, 0.5, 1, 0.8, 1); // * noiseScaleNoise;
    nx = i + frandAB(-1, 1) * 2;
    ny = j + frandAB(-1, 1) * 2;
    noiseOff = 10;
    n1 = norm(sNoise.noise2D(nx * dragonFlyNoiseScale * 1 + noiseOff, ny * dragonFlyNoiseScale * 1 + noiseOff), -1, 1);
    n2 = norm(sNoise.noise2D(nx * dragonFlyNoiseScale * 4 + noiseOff, ny * dragonFlyNoiseScale * 4 + noiseOff), -1, 1);
    n3 = norm(sNoise.noise2D(nx * dragonFlyNoiseScale * 8 + noiseOff, ny * dragonFlyNoiseScale * 8 + noiseOff), -1, 1);
    let dragonFlyNoise = n1 * 0.2 + n2 * 0.6 + n3 * 0.2;
    return floor(frandA(1000) < 5) && dragonFlyNoise > 0.7;
}