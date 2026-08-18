// Author: Nathaniel Sarkissian
// Date: July 8, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function drawFloofPlant(x1, y1, br, _len, ang, z) {
    let len = fmap(_len, 4, 10, 3, 15);
    let segFactor = 2;
    let nSegs = floor(grassCols.length * segFactor);
    canv.strokeWeight(0.15);

    let petalSpread = 1;
    let spread = createVector(petalSpread, 0);

    let step = len / nSegs;
    canv.push();
    canv.translate(x1, y1);
    canv.rotate(ang * 0.5);
    // let petalCol = floofCols[floor(frandA(floofCols.length))];

    let drawPetals = floor(frandA(10)) < 8;

    for (let i = 0; i < nSegs; i++) {
        let matrix = canv.drawingContext.getTransform();
        let x_0 = matrix['e'];
        let y_0 = matrix['f'];
        let x_1 = matrix['a'] + matrix['e'];
        let y_1 = matrix['b'] + matrix['f'];
        let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
        let p5_current_x = x_0 / media_per_unit;
        let p5_current_y = y_0 / media_per_unit;

        let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
        let globalY = zAngle * mapH / 4;
        let sx = p5_current_x - globalX;
        let sy = p5_current_y - globalY;

        let ij2 = transformXYZ(sx, y1, z, 0.5);
        let _i2 = ij2.x;
        let _j2 = ij2.y;
        pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
        rockPixel = rockMap.pixels[pixInd + 0];
        if (rockPixel > 0) {
            broke = i;
            break;
        }

        let c = color(lerpColor(lightColor(br / 255 + frandAB(-1, 1) * 0.1), grassCols[floor(i / segFactor)], 0.6));
        canv.stroke(c);
        canv.line(0, 0, 0, -step);
        canv.translate(0, -step);
        canv.rotate(fmap(i, 0, nSegs, 0, 0.7) * PI / 10 * frandAB(-1, 1));

        if (i > nSegs * 0.8 && drawPetals) {
            for (let j = 0; j < 5; j++) {
                let petalCol = frandArr(floofCols);

                let petalBr =
                    floor(frandA(20)) < floor(fmap(i, 0, nSegs - 1, 0, 0.2 * br / 255) * 10) ?
                        1 :
                        br / 255;
                let lightCol = lightColor(
                    constrain((len *
                        floor(frandA(100)) > floor(petalBr * 100) ?
                        1 :
                        petalBr) + frandAB(-1, 1) * 0.2, 0, 1));

                petalLightCol = lerpColor(petalCol, lightCol, 0.4);

                canv.fill(petalLightCol);
                canv.stroke(petalLightCol);

                // canv.push();
                //canv.rotate(frandA(TAU));
                // let y = frandA(step);
                // canv.pop();

                spread.x = petalSpread * frandA(1);
                spread.y = 0;
                spread.rotate(frandA(TAU));
                spread.mult(fmap(i, 0, nSegs, 2, 0.1));
                canv.circle(spread.x, spread.y + frandAB(-1, 1) * step, 0.1);
            }
        }
    }
    canv.pop();
}

function drawSagePlant(x1, y1, br, _len, ang, z) {
    let len = _len;
    let actualAng = ang * 0.5;
    let segFactor = floor(len / 5); //floor(1, 3);
    let nSegs = floor(grassCols.length * segFactor);
    canv.strokeWeight(0.15);

    let leafSpread = 1;
    let spread = createVector(leafSpread, 0);

    let step = len / nSegs;
    canv.push();
    canv.translate(x1, y1);
    if (floor(frandA(10)) < 5) {
        canv.scale(-1, 1);
    }
    //canv.rotate(actualAng * 0.5);

    let a = PI, da = 0, ta;

    ta = 0;
    a = frandA(PI / 2); //frandA(PI / 4) * nSegs / 6;
    // a = frandA(PI / 4) * nSegs / 6;
    let leafBr = br / 255;

    let leafLightCol;

    canv.rotate(a);
    for (let i = 0; i < nSegs; i++) {
        let matrix = canv.drawingContext.getTransform();
        let x_0 = matrix['e'];
        let y_0 = matrix['f'];
        let x_1 = matrix['a'] + matrix['e'];
        let y_1 = matrix['b'] + matrix['f'];
        let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
        let p5_current_x = x_0 / media_per_unit;
        let p5_current_y = y_0 / media_per_unit;

        let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
        let globalY = zAngle * mapH / 4;
        let sx = p5_current_x - globalX;
        let sy = p5_current_y - globalY;

        let ij2 = transformXYZ(sx, y1, z, 0.5);
        let _i2 = ij2.x;
        let _j2 = ij2.y;
        pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
        rockPixel = rockMap.pixels[pixInd + 0];
        if (rockPixel > 0) {
            broke = i;
            break;
        }
        let leafCol = frandArr(sageCols);
        let lightCol = lightColor(constrain(fmap(i, 0, nSegs, 0, leafBr), 0, 1));
        leafLightCol = lerpColor(leafCol, lightCol, sageContrast);

        canv.stroke(leafLightCol);
        canv.line(0, 0, 0, -step);
        canv.translate(0, -step);

        da = (ta - a) * 0.1;
        a += da;
        canv.rotate(da);

        if (i > nSegs * 0.2) {
            //speckles
            canv.stroke(lerpColor(color(leafBr > 0.5 ? 255 : 0), lightColor(leafBr), 0.5));
            for (let k = 0; k < 3; k++) {
                let p = createVector(frandA(1) * 1, 0);
                p.rotate(frandA(TAU));
                canv.point(p.x, p.y);
            }
            let nLeaves = floor(frandAB(2, 5));
            for (let j = 0; j < nLeaves; j++) {
                lightCol = lightColor(constrain(frandAB(-1, 1) * 0.3 +
                    (floor(frandA(100)) < floor(floor(len) * fmap(i, nSegs * 0.2, nSegs, -2, 2)) ?
                        1 :
                        (floor(frandA(10)) < 3 ? round(leafBr) : (leafBr * fmap(i, nSegs * 0.2, nSegs, 0.5, 1)))),
                    0, 1)
                );

                leafLightCol = lerpColor(
                    leafCol,
                    lightCol,
                    floor(frandA(5)) < fmap(i, nSegs * 0.2, nSegs - 1, 0, br / 255) ?
                        0.8 :
                        sageContrast
                );

                canv.fill(leafLightCol);
                canv.stroke(leafLightCol);

                spread.x = 1;
                spread.y = 0;
                spread.rotate(fmap(j, 0, nLeaves, 0, TAU));
                spread.rotate(fmap(i, 0, nSegs, 0, PI));
                spread.mult(fmap(i, 0, nSegs, 1, 0.1));
                canv.line(0, 0, spread.x, spread.y);
                canv.circle(spread.x, spread.y, fmap(i, 0, nSegs, 0.6, 0.1) * 1);
            }
        }
    }
    canv.pop();
}

function drawLavender(x1, y1, br, _len, ang, z, force) {
    lavenderCount++;
    let len = fmap(_len, 3, 5, 5, 16) * frandAB(1, 1.3);
    let actualAng = ang;
    let segFactor = 3;
    let nSegs = floor(grassCols.length * segFactor * 1.5);
    canv.strokeWeight(0.15);

    let leafSpread = 1;
    let spread = createVector(leafSpread, 0);

    let step = len / nSegs;
    canv.push();
    canv.translate(x1, y1);
    if (floor(frandA(10)) < 5) {
        canv.scale(-1, 1);
    }
    canv.rotate(actualAng * 0.5);

    let a = PI, da = 0, ta;

    ta = 0;
    a = frandA(PI / 4) * nSegs / 6;
    let leafBr = br / 255;

    let leafLightCol;

    let petalStart = frandAB(0.7, 0.9);

    canv.rotate(a);
    for (let i = 0; i < nSegs; i++) {
        if (!force) {
            let matrix = canv.drawingContext.getTransform();
            let x_0 = matrix['e'];
            let y_0 = matrix['f'];
            let x_1 = matrix['a'] + matrix['e'];
            let y_1 = matrix['b'] + matrix['f'];
            let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
            let p5_current_x = x_0 / media_per_unit;
            let p5_current_y = y_0 / media_per_unit;

            let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
            let globalY = zAngle * mapH / 4;
            let sx = p5_current_x - globalX;
            let sy = p5_current_y - globalY;

            let ij2 = transformXYZ(sx, y1, z, 0.5);
            let _i2 = ij2.x;
            let _j2 = ij2.y;
            pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
            rockPixel = rockMap.pixels[pixInd + 0];
            if (rockPixel > 0) {
                broke = i;
                break;
            }
        }

        segCount++;
        let c = color(lerpColor(lightColor(br / 255 + frandAB(-1, 1) * 0.1), grassCols[floor(fmap(i, 0, nSegs, 0, grassCols.length))], 0.6));
        canv.stroke(c);

        canv.line(0, 0, 0, -step);
        canv.translate(0, -step);

        da = (ta - a) * 0.2;
        a += da;
        canv.rotate(da);

        if (i > nSegs * petalStart) {
            // if (floor(i * 10) > floor(nSegs * petalStart * 10)) {
            let nLeaves = floor(frandAB(2, 4));
            for (let j = 0; j < nLeaves; j++) {
                if (floor(i * 10) > floor(frandA(nSegs * petalStart * 20))) {

                    let sz = fmap(i, nSegs * petalStart, nSegs, 0.2, 0.1) * 2;
                    let dir = createVector(1, 0);
                    for (let j = 0; j < 3; j++) {
                        let c = frandArr(lavenderCols);
                        let lightCol = lightColor(constrain(leafBr + frandAB(-1, 1) * 0.2, 0, 1));
                        c = lerpColor(c, lightCol, 0.5);
                        canv.stroke(c);
                        dir.set(1, 0);
                        dir.mult(frandAB(0.2, 0.6) * sz);
                        dir.rotate(frandAB(-1, 1) * PI / 4);
                        canv.line(0, frandAB(-1, 1) * 0.5, dir.x, dir.y);
                        dir.set(-1, 0);
                        dir.mult(frandAB(0.2, 0.6) * sz);
                        dir.rotate(frandAB(-1, 1) * PI / 4);
                        canv.line(0, frandAB(-1, 1) * 0.5, dir.x, dir.y);
                    }
                }
            }
        } else {
            if (floor(frandA(10)) < 5) {
                let nLeaves = 1;
                for (let j = 0; j < nLeaves; j++) {
                    let c = color(lerpColor(lightColor(br / 255 + frandAB(-1, 1) * 0.1),
                        grassCols[
                        constrain(
                            floor(
                                fmap(i, 0, nSegs, 0, grassCols.length) + frandAB(-1, 1)
                            ),
                            0,
                            grassCols.length - 1
                        )
                        ]
                        , 0.6));
                    canv.stroke(c);
                    let sz = fmap(i, 0, nSegs * petalStart, 0.5, 0.1);
                    let dir = createVector(1, 0);
                    for (let j = 0; j < 3; j++) {
                        dir.set(1, 0);
                        dir.mult(frandAB(0.6, 1) * sz);
                        dir.rotate(frandAB(-1, 1) * PI / 4);
                        canv.line(0, frandAB(-1, 1) * 0.3, dir.x, dir.y);
                        dir.set(-1, 0);
                        dir.mult(frandAB(0.6, 1) * sz);
                        dir.rotate(frandAB(-1, 1) * PI / 4);
                        canv.line(0, frandAB(-1, 1) * 0.3, dir.x, dir.y);
                    }
                    // }
                }
            }
        }
    }
    canv.pop();
}

function drawPoppy(x1, y1, br, _len, ang, z, force) {
    poppyCount++;
    let len = fmap(_len, 3, 5, 4, 12) * frandAB(1, 1.2);

    let nSegs = floor(grassCols.length);
    canv.strokeWeight(0.15);

    let stemNoiseScale = noiseScale * 16;
    let step = len / nSegs;
    canv.push();
    canv.translate(x1, y1);
    canv.rotate(ang);
    let broke = -1;
    for (let i = 0; i < nSegs; i++) {
        if (!force) {
            let matrix = canv.drawingContext.getTransform();
            let x_0 = matrix['e'];
            let y_0 = matrix['f'];
            let x_1 = matrix['a'] + matrix['e'];
            let y_1 = matrix['b'] + matrix['f'];
            let media_per_unit = dist(x_0, y_0, x_1, y_1);
            let p5_current_x = x_0 / media_per_unit;
            let p5_current_y = y_0 / media_per_unit;

            let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
            let globalY = zAngle * mapH / 4;
            let sx = p5_current_x - globalX;
            let sy = p5_current_y - globalY;

            let ij2 = transformXYZ(sx, y1, z, 0.5);
            let _i2 = ij2.x;
            let _j2 = ij2.y;
            pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
            rockPixel = rockMap.pixels[pixInd + 0];
            if (rockPixel > 0) {
                broke = i;
                break;
            }


            if (i == nSegs - 1) {
                ij2 = transformXYZ(sx + 3, y1, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
                ij2 = transformXYZ(sx - 3, y1, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
            }
        }

        let c = color(lerpColor(lightColor(br / 255), grassCols[i], 0.6));
        canv.stroke(c);
        canv.line(0, 0, 0, -step);
        canv.translate(0, -step);
        canv.rotate(fmap(i, 0, nSegs, 0, 0.8) * PI / 4 * fmap(fnoise(x1 * stemNoiseScale, y1 * stemNoiseScale), 0, 1, -1, 1));
    }

    if (broke == -1) {
        let petalBr = br / 255;
        let nPetals = floor(frandAB(5, 20));

        let petalBlade = createVector(1, 0);
        petalBlade.rotate(frandA(TAU));
        let flowerScale = fmap(len, 0, 30, 1, 2);
        canv.push();
        canv.scale(flowerScale, flowerScale);

        //speckles
        canv.stroke(lerpColor(color(petalBr > 0.5 ? 255 : 0), lightColor(petalBr), 0.5));
        for (let k = 0; k < 5; k++) {
            let p = createVector(frandA(1) * 1, 0);
            p.rotate(frandA(TAU));
            canv.point(p.x, p.y);
        }

        canv.scale(1, frandAB(0.4, 0.8));
        for (let i = 0; i < nPetals; i++) {

            petalBlade.setMag(0.5 * fmap(i, 0, nPetals, 1, 0.1) * 0.75);
            petalBlade.rotate(frandA(TAU));
            let lightCol = lightColor(len * floor(frandA(3)) > floor(petalBr * 100) ? 1 : petalBr);
            let c = lerpColor(frandArr(poppyCols), lightCol, constrain(0.5 + frandAB(-1, 1) * 0.1, 0, 1));
            canv.stroke(c);
            canv.fill(c);
            canv.noStroke();
            canv.circle(petalBlade.x, petalBlade.y, fmap(i, 0, nPetals, 1, 0.1));
        }
        canv.fill(0);
        canv.circle(0, 0, 0.5);
        canv.pop();

        drawInsect(x1, y1);
    }
    canv.pop();

}

function drawRose(x1, y1, br, _len, ang, z, force) {
    roseCount++;
    let len = fmap(_len, 3, 5, 4, 9);
    let nSegs = grassCols.length;
    canv.strokeWeight(0.15);

    let stemNoiseScale = noiseScale * 16;
    let step = len / nSegs;

    let totalAng = 0;
    canv.push();
    canv.translate(x1, y1);
    totalAng += ang;
    canv.rotate(ang);
    let broke = -1;
    for (let i = 0; i < nSegs; i++) {
        if (!force) {
            let matrix = canv.drawingContext.getTransform();
            let x_0 = matrix['e'];
            let y_0 = matrix['f'];
            let x_1 = matrix['a'] + matrix['e'];
            let y_1 = matrix['b'] + matrix['f'];
            let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
            let p5_current_x = x_0 / media_per_unit;
            let p5_current_y = y_0 / media_per_unit;

            let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
            let globalY = zAngle * mapH / 4;
            let sx = p5_current_x - globalX;
            let sy = p5_current_y - globalY;

            let ij2 = transformXYZ(sx, y1, z, 0.5);
            let _i2 = ij2.x;
            let _j2 = ij2.y;
            pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
            rockPixel = rockMap.pixels[pixInd + 0];
            if (rockPixel > 0) {
                broke = i;
                break;
            }

            if (i == nSegs - 1) {
                ij2 = transformXYZ(sx + 2, y1, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
                ij2 = transformXYZ(sx - 2, y1, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
            }
        }

        let c = color(lerpColor(lightColor(br / 255), grassCols[floor(fmap(i, 0, nSegs, 0, nSegs * 0.8))], 0.6));
        canv.stroke(c);
        canv.line(0, 0, 0, -step);
        canv.translate(0, -step);
        let da = fmap(i, 0, nSegs, 0, 0.8) * PI / 8 * fmap(fnoise(x1 * stemNoiseScale, y1 * stemNoiseScale), 0, 1, -1, 1);
        totalAng += da;
        canv.rotate(da);
    }

    if (broke == -1) {
        let petalBr = br / 255;
        let nPetals;

        let petalBlade = createVector(1, 0);
        petalBlade.rotate(frandA(TAU));
        let flowerScale = fmap(len, 0, 30, 1.1, 2);
        canv.push();
        canv.scale(flowerScale, flowerScale);

        //speckles
        canv.stroke(lerpColor(color(petalBr > 0.5 ? 255 : 0), lightColor(petalBr), 0.5));
        for (let k = 0; k < 2; k++) {
            let p = createVector(frandA(1) * 1, 0);
            p.rotate(frandA(TAU));
            canv.point(p.x, p.y);
        }

        let baseCol = frandArr(roseCols);
        canv.scale(1, frandAB(0.4, 0.8));
        nPetals = floor(frandAB(8, 10));
        for (let i = 0; i < nPetals; i++) {
            let lightCol = lightColor(constrain(petalBr + frandAB(-1, 1) * 0.2, 0, 1));
            let c = lerpColor(baseCol, lightCol, floor(frandA(10)) < 2 ? 0.8 : 0.5);
            // let lightCol = lightColor(len * floor(frandA(3)) > floor(petalBr * 100) ? 1 : petalBr);
            // let c = lerpColor(frandArr(roseCols), lightCol, constrain(0.5 + frandAB(-1, 1) * 0.1, 0, 1));
            canv.noStroke();
            canv.push();
            canv.rotate(fmap(i, 0, nPetals, 0, TAU));
            canv.fill(c);
            let petalSc = frandAB(0.1, 1);
            canv.scale(petalSc, petalSc);
            canv.ellipse(0.5, 0, 1, 0.75);
            canv.pop();
        }


        canv.fill(lerpColor(roseMid1, roseMid2, br / 255));
        canv.circle(0, 0, 0.5);
        canv.pop();

        //canv.strokeWeight(0.1);
        // let nStamens = round(frandAB(1, 2));
        // for (let i = 0; i < nStamens; i++) {
        //     let base = createVector(0.05, 0);
        //     base.rotate(frandA(TAU));
        //     let dir = createVector(0, frandAB(0.25, 1) * -0.5);
        //     dir.rotate(frandAB(-1, 1) * PI / 12);
        //    canv.stroke(lerpColor(roseMid1, roseMid2, 0.5 + 0.5 * br / 255));
        //     canv.line(base.x, base.y, dir.x, dir.y);
        //    canv.fill(lerpColor(roseMid1, roseMid2, 0.5 + 0.5 * br / 255));
        //     canv.circle(dir.x, dir.y, 0.1);
        // }

        canv.push();
        canv.rotate(-totalAng);
        drawInsect(x1, y1);
        canv.pop();
    }

    canv.pop();

}

function drawThistle(x1, y1, br, _len, _ang, z, force) {
    // thistleCount++;
    let lenNoise = 1; //fmap(sNoise.noise2D(nx * noiseScale * 2, ny * noiseScale * 2), -1, 1, 0.5, 1);

    let len = fmap(_len, 3, 5, 3, 15) * frandAB(0.8, 1.2) * lenNoise;
    let ang = _ang * 0.9;
    let droopAngle = PI / 16;
    let nSegs = floor(grassCols.length);
    canv.strokeWeight(0.15);

    let stemNoiseScale = noiseScale * 8;
    let step = len / nSegs;

    canv.push();
    canv.translate(x1, y1);
    canv.rotate(ang);
    let totalAng = ang;
    let broke = -1;
    for (let i = 0; i < nSegs; i++) {
        if (!force) {
            let matrix = canv.drawingContext.getTransform();
            let x_0 = matrix['e'];
            let y_0 = matrix['f'];
            let x_1 = matrix['a'] + matrix['e'];
            let y_1 = matrix['b'] + matrix['f'];
            let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
            let p5_current_x = x_0 / media_per_unit;
            let p5_current_y = y_0 / media_per_unit;

            let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
            let globalY = zAngle * mapH / 4;
            let sx = p5_current_x - globalX;
            let sy = p5_current_y - globalY;

            let ij2 = transformXYZ(sx, y1, z, 0.5);
            let _i2 = ij2.x;
            let _j2 = ij2.y;
            pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
            rockPixel = rockMap.pixels[pixInd + 0];
            if (rockPixel > 0) {
                broke = i;
                break;
            }

            if (i == nSegs - 1) {
                ij2 = transformXYZ(sx + 2, y1, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
                ij2 = transformXYZ(sx - 2, y1, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
                ij2 = transformXYZ(sx, y1 - 2, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
                ij2 = transformXYZ(sx, y1 + 2, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
            }
        }

        let randLight = frandAB(-1, 1) * 0.5;
        // let lightCol = lightColor(constrain(floor((1 - fpow(frandA(1), 10)) * 100) < floor(100 * br / 255) ? 1 : (br / 255 + randLight), 0, 1));
        let lightCol = lightColor(constrain(floor((1 - fpow(frandA(1), 10)) * 200) < floor(100 * br / 255) ? 1 : (br / 255 + randLight), 0, 1));
        let c = lerpColor(lightCol, grassCols[floor(map(i, 0, nSegs, 0, grassCols.length * 0.8))], grassContrast);

        canv.stroke(c);
        canv.fill(c);
        canv.line(0, 0, 0, -step);
        canv.translate(0, -step);
        let da = fmap(i, 0, nSegs, 0.8, 0.0) * droopAngle * fmap(fnoise(x1 * stemNoiseScale, y1 * stemNoiseScale), 0, 1, -1, 1);
        totalAng += da;
        canv.rotate(da);

        if (i < nSegs * 0.8) {

            let stemSc = fmap(i, 0, nSegs * 0.8, 0.2, 0.1);

            for (let j = 0; j < 5; j++) {
                if (floor(frandA(10)) < 6) {
                    thistleCount++;
                    let randLight = frandAB(-1, 1) * 0.3;
                    // if (floor(100 * (1 - fpow(frandA(1), 10))) < floor(100 * br / 255)) {
                    if (floor(100 * (1 - fpow(frandA(1), 10))) < floor(100 * br / 255)) {
                        lightCol = lightColor(1);
                    } else {
                        lightCol = lightColor(br / 255 + randLight);
                    }
                    c = lerpColor(lightCol, grassCols[i], grassContrast);
                    let leafVector = createVector(0.5, 0);
                    leafVector.rotate(frandA(-PI / 4));
                    leafVector.mult(stemSc * 3);
                    let y = frandA(step);

                    canv.push();
                    if (floor(frandA(10)) < 5) {
                        canv.scale(-1, 1);
                    }
                    canv.line(0, y, leafVector.x, y + leafVector.y);
                    canv.circle(leafVector.x, y + leafVector.y, stemSc);
                    canv.pop();
                }
            }
        }
    }

    if (broke == -1) {
        let petalBr = br / 255;

        let petalBlade = createVector(1, 0);
        petalBlade.rotate(frandA(TAU));
        let flowerScale = fmap(len, 0, 30, 0.5, 2) * 0.9;
        canv.scale(flowerScale, flowerScale);

        //speckles
        canv.stroke(lerpColor(color(petalBr > 0.5 ? 255 : 0), lightColor(petalBr), 0.5));
        for (let k = 0; k < 5; k++) {
            let p = createVector(frandA(1) * 1, 0);
            p.rotate(frandA(TAU));
            canv.point(p.x, p.y);
        }

        let nPetals = floor(frandAB(10, 20));
        for (let i = 0; i < nPetals; i++) {
            let baseCol = frandArr(thistleCols);
            let lightCol = lightColor(constrain(petalBr + frandAB(-1, 1) * 0.2, 0, 1));
            let c = lerpColor(baseCol, lightCol, floor(frandA(10)) < 2 ? 0.8 : 0.3);
            canv.push();
            canv.scale(1, frandAB(0.7, 0.8));
            let a = fmap(i, 0, nPetals, -PI / 4, PI / 4);
            canv.rotate(a - PI / 2 + frandAB(-1, 1) * PI / 32);
            canv.fill(c);
            canv.stroke(c);
            canv.line(0, 0, frandA(2.2) * map(abs(a), 0, PI / 4, 1.1, 0.5), 0);
            canv.pop();
        }
        let leafCol = frandArr(sageCols);
        let leafBr = br / 255;
        let lightCol;
        let r = floor(frandA(10));
        if (floor(frandA(150)) < floor(10 * floor(len))) {
            lightCol = lightColor(1);
        } else {
            lightCol = lightColor(
                (r < 3 ?
                    round(leafBr) :
                    leafBr));
        }
        // lightCol = lightColor(
        //     floor(frandA(150)) < floor(10 * floor(len)) ? 1 :
        //         (floor(frandA(10)) < 3 ? round(leafBr) : leafBr)
        // );

        for (let i = 0; i < 5; i++) {
            if (floor(frandA(10)) < 2) {
                leafLightCol = lerpColor(leafCol, lightCol, 0.5);
            } else {
                leafLightCol = lerpColor(leafCol, lightCol, 0.2);
            }

            canv.fill(leafLightCol);
            canv.noStroke();

            let baseSc = fmap(i, 0, 5, 0.8, 0.6) * 0.8;
            canv.push();
            canv.scale(baseSc, baseSc);
            canv.ellipse(frandAB(-1, 1) * 0.06, frandAB(-1, 1) * 0.06, 0.75, 0.75);
            canv.pop();

            canv.stroke(leafLightCol);
            let spine = createVector(1, 0);
            spine.mult(frandAB(0.5, 0.6));
            spine.rotate(frandA(TAU));
            canv.line(0, 0, spine.x, spine.y);
        }

        canv.push();
        canv.rotate(-totalAng);
        drawInsect(x1, y1);
        canv.pop();
    }

    canv.pop();

}

function drawDaisy(x1, y1, br, _len, ang, z, force) {
    daisyCount++;
    let len = fmap(_len, 3, 5, 5, 6);
    let nSegs = grassCols.length;
    canv.strokeWeight(0.15);

    let stemNoiseScale = noiseScale * 16;
    let step = len / nSegs;

    let totalAng = 0;
    canv.push();
    canv.translate(x1, y1);
    totalAng += ang;
    canv.rotate(ang);
    let broke = -1;
    for (let i = 0; i < nSegs; i++) {
        if (!force) {
            let matrix = canv.drawingContext.getTransform();
            let x_0 = matrix['e'];
            let y_0 = matrix['f'];
            let x_1 = matrix['a'] + matrix['e'];
            let y_1 = matrix['b'] + matrix['f'];
            let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
            let p5_current_x = x_0 / media_per_unit;
            let p5_current_y = y_0 / media_per_unit;

            let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
            let globalY = zAngle * mapH / 4;
            let sx = p5_current_x - globalX;
            let sy = p5_current_y - globalY;

            let ij2 = transformXYZ(sx, y1, z, 0.5);
            let _i2 = ij2.x;
            let _j2 = ij2.y;
            pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
            rockPixel = rockMap.pixels[pixInd + 0];
            if (rockPixel > 0) {
                broke = i;
                break;
            }

            if (i == nSegs - 1) {
                ij2 = transformXYZ(sx + 2, y1, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
                ij2 = transformXYZ(sx - 2, y1, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
                ij2 = transformXYZ(sx, y1 + 2, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
                ij2 = transformXYZ(sx, y1 - 2, z, 0.5);
                _i2 = ij2.x;
                _j2 = ij2.y;
                pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                rockPixel = rockMap.pixels[pixInd + 0];
                if (rockPixel > 0) {
                    broke = i;
                    break;
                }
            }
        }

        let c = color(lerpColor(lightColor(br / 255), grassCols[i], 0.6));
        canv.stroke(c);
        canv.line(0, 0, 0, -step);
        canv.translate(0, -step);
        let da = fmap(i, 0, nSegs, 0, 0.8) * PI / 4 * fmap(fnoise(x1 * stemNoiseScale, y1 * stemNoiseScale), 0, 1, -1, 1);
        totalAng += da;
        canv.rotate(da);
    }

    if (broke == -1) {
        let petalBr = br / 255;

        //speckles
        canv.stroke(lerpColor(color(petalBr > 0.5 ? 255 : 0), lightColor(petalBr), 0.5));
        for (let k = 0; k < 5; k++) {
            let p = createVector(frandA(1) * 1, 0);
            p.rotate(frandA(TAU));
            canv.point(p.x, p.y);
        }

        let nPetals;
        let petalBlade = createVector(1, 0);
        petalBlade.rotate(frandA(TAU));
        let flowerScale = fmap(len, 0, 30, 1.1, 2);
        canv.push();
        canv.scale(flowerScale, flowerScale);


        if (daisyType == "normal" || floor(frandA(10)) < 3) {
            canv.scale(1, frandAB(0.5, 0.8));
            nPetals = floor(frandAB(5, 16));
            for (let i = 0; i < nPetals; i++) {
                let petalSz = map(i, 0, nPetals, 1, 0.1);
                // let baseCol = frandArr(daisyCols);
                let lightCol = lightColor(len * floor(frandA(3)) > floor(petalBr * 100) ? 1 : petalBr);
                let c = lerpColor(frandArr(daisyCols), lightCol, constrain(0.5 + frandAB(-1, 1) * 0.1, 0, 1));
                // let lightCol = lightColor(constrain(petalBr * petalSz + frandAB(-1, 1) * 0.2, 0, 1));
                // let c = lerpColor(baseCol, lightCol, floor(frandA(10)) < 1 ? 0.8 : 0.45);
                canv.noStroke();
                canv.push();
                canv.rotate(fmap(i, 0, nPetals, 0, TAU * 2) + frandAB(-1, 1) * PI / 12);
                canv.fill(c);
                canv.ellipse(frandAB(0.2, 0.5), 0, frandAB(0.8, 1.2) * petalSz, frandAB(0.5, 0.8) * petalSz);
                canv.pop();
            }
        } else if (daisyType == "down") {
            canv.rotate(-totalAng + frandAB(-1, 1) * PI / 8);
            nPetals = floor(frandAB(1, 10));
            let squish = frandAB(0.6, 0.8);
            for (let i = 0; i < nPetals; i++) {
                let lightCol = lightColor(constrain(petalBr + frandAB(-1, 1) * 0.2, 0, 1));
                let c = lerpColor(baseCol, lightCol, floor(frandA(10)) < 2 ? 0.8 : 0.45);
                canv.fill(c);
                canv.noStroke();
                canv.push();
                let petalAng = frandAB(-1, 1) * PI / 4 + PI / 2;
                canv.translate(cos(petalAng) * 0.9, sin(petalAng) * squish * 0.7);
                canv.rotate(petalAng);
                let petalLen = frandAB(0.8, 1.5);
                canv.ellipse(0, 0, petalLen, 0.35);
                canv.pop();
            }
            canv.scale(1, squish);
        }

        canv.fill(lerpColor(daisyMid1, daisyMid2, br / 255));
        canv.circle(0, 0, 0.35);

        canv.pop();
        canv.push();
        canv.rotate(-totalAng);
        drawInsect(x1, y1);
        canv.pop();
    }
    canv.pop();

}

function drawTallFlower(x1, y1, br, _len, _ang, z, force) {
    poppyCount++;
    let len = fmap(_len, 3, 5, 10, 30) * frandAB(1, 1.2) * 0.9;
    let ang = _ang * 0.6;

    let nSegs = floor(grassCols.length * 4);
    canv.strokeWeight(0.15);

    let stemNoiseScale = noiseScale * 16; //16;
    let step = len / nSegs;
    let flip = (rSeed % 2 == 1 ? 1 : -1);
    let droopAngle = PI / 9 * flip; //PI/16;
    let limitAng = PI / 22;
    let totalAng = ang;
    canv.push();
    canv.translate(x1, y1);

    canv.rotate(ang);

    let broke = -1;
    for (let i = 0; i < nSegs; i++) {
        if (!force) {
            let matrix = canv.drawingContext.getTransform();
            let x_0 = matrix['e'];
            let y_0 = matrix['f'];
            let x_1 = matrix['a'] + matrix['e'];
            let y_1 = matrix['b'] + matrix['f'];
            let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
            let p5_current_x = x_0 / media_per_unit;
            let p5_current_y = y_0 / media_per_unit;

            let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
            let globalY = zAngle * mapH / 4;
            let sx = p5_current_x - globalX;
            let sy = p5_current_y - globalY;

            let ij2 = transformXYZ(sx, y1, z, 0.5);
            let _i2 = ij2.x;
            let _j2 = ij2.y;
            pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
            rockPixel = rockMap.pixels[pixInd + 0];
            if (rockPixel > 0) {
                broke = i;
                break;
            }
        }

        let c = color(lerpColor(lightColor(br / 255), grassCols[floor(fmap(i, 0, nSegs, 0, grassCols.length))], 0.6));
        canv.stroke(c);
        canv.line(0, 0, 0, -step);

        canv.translate(0, -step);
        let da;
        if (flip == 1) {
            da = min(fmap(i, 0, nSegs, 0.3, 1) * droopAngle, limitAng) * fmap(fnoise(x1 * stemNoiseScale, y1 * stemNoiseScale, i * 0.08), 0, 1, -1, 1);
        } else {
            da = max(fmap(i, 0, nSegs, 0.3, 1) * droopAngle, -limitAng) * fmap(fnoise(x1 * stemNoiseScale, y1 * stemNoiseScale, i * 0.08), 0, 1, -1, 1);
        }
        totalAng += da;
        canv.rotate(da);
        let nPetals = floor(frandAB(1, 3));
        for (let k = 0; k < nPetals; k++) {
            let petalBlade = createVector(1, 0);
            petalBlade.rotate(frandA(-PI / 4));
            petalBlade.setMag(0.5 * fmap(i, 0, nSegs, 1, 0.5));
            let c = color(lerpColor(lightColor(constrain(br / 255 + frandAB(-1, 1) * 0.2, 0, 1)), grassCols[floor(fmap(i, 0, nSegs, 0, grassCols.length))], 0.6));
            canv.stroke(c);
            canv.fill(c);
            canv.push();
            if (floor(frandA(10)) < 5) {
                canv.scale(-1, 1);
            }
            let petalOffset = random(step);
            canv.line(0, petalOffset, petalBlade.x, petalBlade.y + petalOffset);
            canv.pop();
        }
    }
    canv.pop();

    let flowerStartThresh = 0.2;

    canv.push();
    canv.translate(x1, y1);
    canv.rotate(ang);
    totalAng = 0;
    for (let i = 0; i < nSegs; i++) {
        if (i == broke) {
            break;
        }
        canv.translate(0, -step);
        let da;
        if (flip == 1) {
            da = min(fmap(i, 0, nSegs, 0.3, 1) * droopAngle, limitAng) * fmap(fnoise(x1 * stemNoiseScale, y1 * stemNoiseScale, i * 0.08), 0, 1, -1, 1);
        } else {
            da = max(fmap(i, 0, nSegs, 0.3, 1) * droopAngle, -limitAng) * fmap(fnoise(x1 * stemNoiseScale, y1 * stemNoiseScale, i * 0.08), 0, 1, -1, 1);
        }
        canv.rotate(da);
        totalAng += da;
        let nFlowers = 2;
        for (let j = 0; j < nFlowers; j++) {
            let flowerOffset = frandA(step);

            if (i > nSegs * flowerStartThresh || i == nSegs - 1) {
                if (floor(frandA(100)) < floor(10 * fmap(i, 0, nSegs, 0, 1))) {
                    let flowerScale = fmap(len, 0, 30, 1, 2) * fmap(i, nSegs * flowerStartThresh, nSegs, 1, 0.5);
                    ////
                    if (!force) {
                        let matrix = canv.drawingContext.getTransform();
                        let x_0 = matrix['e'];
                        let y_0 = matrix['f'];
                        let x_1 = matrix['a'] + matrix['e'];
                        let y_1 = matrix['b'] + matrix['f'];
                        let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
                        let p5_current_x = x_0 / media_per_unit;
                        let p5_current_y = y_0 / media_per_unit;

                        let globalX = zAngle * mapW / 2 - trim / 2 - 1 + 0.5;
                        let globalY = zAngle * mapH / 4;
                        let sx = p5_current_x - globalX;
                        let sy = p5_current_y - globalY;

                        let ij2 = transformXYZ(sx + flowerScale, y1, z, 0.5);
                        let _i2 = ij2.x;
                        let _j2 = ij2.y;
                        pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                        rockPixel = rockMap.pixels[pixInd + 0];
                        if (rockPixel > 0) {
                            broke = i;
                            break;
                        }

                        ij2 = transformXYZ(sx - flowerScale, y1, z, 0.5);
                        _i2 = ij2.x;
                        _j2 = ij2.y;
                        pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                        rockPixel = rockMap.pixels[pixInd + 0];
                        if (rockPixel > 0) {
                            broke = i;
                            break;
                        }

                        ij2 = transformXYZ(sx, y1 + flowerScale, z, 0.5);
                        _i2 = ij2.x;
                        _j2 = ij2.y;
                        pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                        rockPixel = rockMap.pixels[pixInd + 0];
                        if (rockPixel > 0) {
                            broke = i;
                            break;
                        }

                        ij2 = transformXYZ(sx, y1 - flowerScale, z, 0.5);
                        _i2 = ij2.x;
                        _j2 = ij2.y;
                        pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
                        rockPixel = rockMap.pixels[pixInd + 0];
                        if (rockPixel > 0) {
                            broke = i;
                            break;
                        }
                    }
                    ////

                    let petalBr = br / 255;
                    let nPetals = floor(frandAB(5, 20));

                    let petalBlade = createVector(1, 0);
                    petalBlade.rotate(frandA(TAU));
                    canv.push();
                    canv.scale(flowerScale, flowerScale);

                    //speckles
                    canv.stroke(lerpColor(color(petalBr > 0.5 ? 255 : 0), lightColor(petalBr), 0.5));
                    for (let k = 0; k < 5; k++) {
                        let p = createVector(frandA(1) * 1, 0);
                        p.rotate(frandA(TAU));
                        canv.point(p.x, p.y);
                    }

                    canv.scale(1, frandAB(0.4, 0.8));
                    for (let k = 0; k < nPetals; k++) {
                        petalBlade.setMag(0.5 * fmap(k, 0, nPetals, 1, 0.1) * 0.75);
                        petalBlade.rotate(frandA(TAU));
                        let lightCol = lightColor(len * floor(frandA(3)) > floor(petalBr * 100) ? 1 : petalBr);
                        let c = lerpColor(frandArr(tallCols), lightCol, constrain(0.5 + frandAB(-1, 1) * 0.1, 0, 1));
                        canv.stroke(c);
                        canv.fill(c);
                        canv.noStroke();
                        canv.circle(petalBlade.x, petalBlade.y + flowerOffset, fmap(k, 0, nPetals, 1, 0.1));
                    }
                    canv.fill(0);
                    canv.circle(0, flowerOffset, 0.5);
                    canv.pop();

                    canv.push();
                    canv.rotate(-totalAng);
                    drawInsect(x1, y1);
                    canv.pop();
                }
            }
        }

    }
    canv.pop();
}

function drawBlade(x1, y1, x2, y2, br, z, len) {
    let nSegs = floor(grassCols.length);
    canv.strokeWeight(0.15);

    for (let i = 0; i < nSegs; i++) {
        let m1 = float(i) / nSegs;
        let m2 = float(i + 1) / nSegs;
        // let matrix = canv.drawingContext.getTransform();
        // let x_0 = matrix['e'];
        // let y_0 = matrix['f'];
        // let x_1 = matrix['a'] + matrix['e'];
        // let y_1 = matrix['b'] + matrix['f'];
        // let media_per_unit = dist(x_0, y_0, x_1, y_1) * 1;
        // let p5_current_x = x_0 / media_per_unit;
        // let p5_current_y = y_0 / media_per_unit;

        // let globalX = zAngle * mapW / 2 - trim / 2 - 1;
        // let globalY = zAngle * mapH / 4;
        // let sx = p5_current_x - globalX;
        // let sy = p5_current_y - globalY;

        // let ij2 = transformXYZ(lerp(x1, x2, m1), lerp(y1, y2, m1), z, 0.5);
        // let _i2 = ij2.x;
        // let _j2 = ij2.y;
        // pixInd = (floor(_i2) + floor(_j2) * rockMap.width) * 4;
        // rockPixel = rockMap.pixels[pixInd + 0];
        // if (rockPixel > 0) {
        //     broke = i;
        //     break;
        // }

        let lightCol = lightColor(floor((1 - fpow(frandA(1), 10)) * 100) < floor(100 * br / 255) ? 1 : br / 255);
        let c = lerpColor(lightCol, grassCols[i], grassContrast);
        canv.stroke(c);
        canv.line(lerp(x1, x2, m1),
            lerp(y1, y2, m1),
            lerp(x1, x2, m2),
            lerp(y1, y2, m2));
    }
}

function drawInsect(x, y) {
    if (isBee(x, y)) {
        let beePos = createVector(frandA(15), 0);
        beePos.rotate(frandA(-PI));
        canv.push();
        drawBee(beePos.x, beePos.y);
        canv.pop();
    } else if (isDragonFly(x, y)) {
        let dragonFlyPos = createVector(frandA(15), 0);
        dragonFlyPos.rotate(frandA(-PI));
        canv.push();
        drawDragonFly(dragonFlyPos.x, dragonFlyPos.y);
        canv.pop();
    }
}

function drawBee(x, y) {
    canv.push();
    canv.translate(x, y);
    let sc = frandAB(0.02, 0.04);
    canv.scale(sc, sc);
    if (floor(frandA(10)) < 5) {
        canv.scale(-1, 1);
    }
    canv.rotate(frandAB(-1, 1) * PI / 16);
    canv.noStroke();
    let angle = frandAB(0.2, 1);
    let nSegs = 5;
    let segOffset = 2 * angle;
    let frontBack = floor(frandA(10)) < 5;
    let wingPos;
    if (frontBack) {
        wingPos = nSegs - 2;
    } else {
        wingPos = 1;
    }
    for (let i = 0; i < nSegs; i++) {
        if (i == wingPos) {
            canv.push();
            canv.translate(-1 * (1 - angle) + 1 * angle, -5);
            canv.rotate(PI / 4);
            canv.fill('#ffffea');
            canv.ellipse(0, 0, 10, 5);
            canv.pop();

            canv.push();
            canv.translate((1 - angle) + 8 * angle, -5);
            canv.rotate(-PI / 4);
            canv.fill('#ffffea');
            canv.ellipse(0, 0, 10, 5);
            canv.pop();
        }
        if (i % 2 == 1) {
            canv.fill(lerpColor(lightColor(0.8), color('#fbd144'), 0.5));
        } else {
            canv.fill(lerpColor(lightColor(0.2), color('#382716'), 0.5));
        }
        let segSz = 8;
        canv.circle(i * segOffset, 0, segSz, segSz);
    }
    canv.pop();
}

function drawDragonFly(x, y) {
    canv.push();
    canv.translate(x, y);
    let sc = frandAB(0.03, 0.04);
    canv.scale(sc, sc);
    if (floor(frandA(10)) < 5) {
        canv.scale(-1, 1);
    }
    canv.noStroke();
    let angle = frandAB(0.2, 1);
    let nSegs = floor(frandAB(3, 4)) * 2 + 1;
    let segOffset = 2 * angle;
    let wingLen = frandAB(20, 25);
    let wingWid = frandAB(3, 4);
    let wingAng = PI / 15;
    let wingAngOff = PI / 10 * frandAB(0.5, 1.1);
    let frontBack = floor(frandA(10)) < 5;
    let wingPos;
    if (frontBack) {
        wingPos = nSegs - 3;
    } else {
        wingPos = 2;
    }
    for (let i = 0; i < nSegs; i++) {
        if (i == wingPos) {
            canv.push();
            canv.translate(0, -1);
            canv.push();
            canv.translate(i * segOffset, 0);
            canv.rotate(wingAng + wingAngOff);
            canv.translate(-wingLen / 2, 0);
            canv.fill('#ffffea');
            canv.ellipse(0, 0, wingLen, wingWid);
            canv.pop();

            canv.push();
            canv.translate(i * segOffset, 0);
            canv.rotate(PI - wingAng - wingAngOff);
            canv.translate(-wingLen / 2, 0);
            canv.fill('#ffffea');
            canv.ellipse(0, 0, wingLen, wingWid);
            canv.pop();

            canv.push();
            canv.scale(1, -1);
            canv.push();
            canv.translate(i * segOffset, 0);
            canv.rotate(wingAng * 0.6 - wingAngOff * 0.6);
            canv.translate(-wingLen / 2, 0);
            canv.fill('#ffffea');
            canv.ellipse(0, 0, wingLen, wingWid);
            canv.pop();

            canv.push();
            canv.translate(i * segOffset, 0);
            canv.rotate(PI - wingAng * 0.6 + wingAngOff * 0.6);
            canv.translate(-wingLen / 2, 0);
            canv.fill('#ffffea');
            canv.ellipse(0, 0, wingLen, wingWid);
            canv.pop();
            canv.pop();
            canv.pop();
        }
        if (i % 2 == 1) {
            canv.fill('#476af8');
        } else {
            canv.fill('#00204f')
        }
        let segSz = frandAB(5, 6); //map(i, 0, nSegs - 1, 8, 10);
        if (i == 0) {
            if (frontBack) {
                segSz = 7;
            } else {
                segSz = 8;
            }
        } else if (i == nSegs - 1) {
            if (frontBack) {
                segSz = 8;
            } else {
                segSz = 7;
            }
        }
        canv.circle(i * segOffset, 0, segSz, segSz);
    }
    canv.pop();
}