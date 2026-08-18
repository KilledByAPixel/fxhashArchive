// Author: Nathaniel Sarkissian
// Date: August 7, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function lightColor(br) {
    if (shading == "soft") {
        if (br < 0.5) {
            return darkCol;
        } else {
            return _lerpColor(midCol, lightCol, (br - 0.5) * 2);
        }
    } else if (shading == "hard") {
        let _br = br + (shadingGradient == "noisy" ? random(-1, 1) * 0.1 : 0);
        _br = round(_br * 2) / 2;
        _br = constrain(_br, 0, 1);
        if (_br == 1) {
            return lightCol;
        } else if (_br == 0.5) {
            return midCol;
        } if (_br == 0) {
            return darkCol;
        }
    }
}

function _lerpColor(c1, c2, m) {
    colorMode(RGB, 255);
    let lc = lerpColor(c1, c2, m);
    colorMode(HSB, 360, 100, 100);
    let h = hue(lc);
    let s1 = saturation(c1);
    let s2 = saturation(c2);
    let b1 = brightness(c1);
    let b2 = brightness(c2);
    return color(h, lerp(s1, s2, m), lerp(b1, b2, m));
}

function handleUrlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const magParam = urlParams.get('mag')
    if (magParam == null) {
        mag = 1;
    } else {
        if (float(magParam) > 0) {
            mag = max(float(magParam), 1);
        } else {
            mag = 1;
        }
    }
}

function triArea(_a, _b, _c) {
    return abs(_a.x * _b.y + _b.x * _c.y + _c.x * _a.y - _a.y * _b.x + _b.y * _c.x + _c.y * _a.x) / 2;
}

function randomInTri(_a, _b, _c) {
    let b = p5.Vector.sub(_b, _a);
    let c = p5.Vector.sub(_c, _a);

    let s = random(1);
    let t = random(1);
    let p;
    let in_triangle = s + t <= 1;
    if (in_triangle) {
        let b = p5.Vector.sub(_b, _a);
        p = b.mult(s).add(c.mult(t));
    } else {
        p = b.mult(1 - s).add(c.mult(1 - t));
    }
    return p5.Vector.add(p, _a);
}

function preparePolys(normal) {
    print("processing shapes", normal.length);
    for (let i = 0; i < normal.length; i++) {
        let cell = normal[i];
        let center = createVector(0, 0);
        for (let j = 0; j < cell.length; j++) {
            center.x += cell[j][0];
            center.y += cell[j][1];
        }

        center.mult(1 / float(cell.length));
        if (center == undefined) {
            continue;
        }
        let ht;
        let htNoiseScale = noiseScale * 0.03;
        if (htDistribution == "noise") {
            let offsetNoiseScale = htNoiseScale * 0.1;
            let offsetNoiseStr = 2; // * map(divFactor, 60, 150, 1, 0.1);
            htNoiseScale *= map(divFactor, 60, 150, 1, 0.5);
            let offsetNoise = noise(center.x * offsetNoiseScale, center.y * offsetNoiseScale) * TAU * 2;
            ht = -(
                pow(
                    (noise(
                        center.x * htNoiseScale + cos(offsetNoise) * offsetNoiseStr,
                        center.y * htNoiseScale + sin(offsetNoise) * offsetNoiseStr
                    ) * 2 - 1) * 1.5,
                    htNoisePower
                ) * 200
            )
        } else if (htDistribution == "sine1") {
            let v = createVector(
                center.x * htNoiseScale * roofSinePeriod,
                center.y * htNoiseScale * roofSinePeriod).rotate(roofSineOffset);
            ht = sin(
                v.x + v.y
            ) * 200;
        } else if (htDistribution == "sine2") {
            let v = createVector(
                center.x * htNoiseScale * roofSinePeriod * 0.5,
                center.y * htNoiseScale * roofSinePeriod * 0.5).rotate(roofSineOffset);
            ht = sin(
                v.x * v.y
            ) * 200;
        } else if (htDistribution == "gradX1") {
            ht = pow(map(center.x, 0, targetSz, 0, 1), gradXPow) * 200;
        } else if (htDistribution == "gradX2") {
            ht = pow(map(center.x, 0, targetSz, 1, 0), gradXPow) * 200;
        } else if (htDistribution == "gradY") {
            ht = map(center.y, 0, targetSz / zAngle, 1, gradYDepth) * 200;
        } else if (htDistribution == "parabolaX") {
            ht = min(pow(map(center.x, 0, targetSz, 1, -1) * parabolaXHt, 2) * 200, 500);
        } else if (htDistribution == "parabolaY") {
            ht = min(pow(map(center.y, 0, targetSz / zAngle, 2, 0), 4) * 200, 500);
        }

        let base = 0.0;
        let roof;
        if (roofDistribution == "random") {
            roof = random(0.5, 1);
        } else if (roofDistribution == "skinny") {
            roof = 0.9;
        } else if (roofDistribution == "wide") {
            roof = 0.5;
        } else if (roofDistribution == "column") {
            roof = 0.0;
        } else if (roofDistribution == "point") {
            roof = 1;
        } else if (roofDistribution == "noise") {
            let roofNoiseScale = noiseScale * 0.05;
            roof = constrain(
                ceil(noise(center.x * roofNoiseScale, center.y * roofNoiseScale) * 2) / 1.5,
                0, 0.8);
        }

        let cap = [];
        cap.push([-100000 * (ht > 0 ? 1 : -1)]);
        for (let j = 0; j < cell.length; j++) {
            let p1 = createVector(
                lerp(cell[j][0], center.x, base),
                0,
                lerp(cell[j][1], center.y, base)
            );

            let p2 = createVector(
                lerp(cell[(j + 1) % cell.length][0], center.x, base),
                0,
                lerp(cell[(j + 1) % cell.length][1], center.y, base)
            );

            let p3 = createVector(
                lerp(cell[(j + 1) % cell.length][0], center.x, roof),
                ht,
                lerp(cell[(j + 1) % cell.length][1], center.y, roof)
            );

            let p4 = createVector(
                lerp(cell[j][0], center.x, roof),
                ht,
                lerp(cell[j][1], center.y, roof)
            );

            let U = p5.Vector.sub(p2, p1);
            let V = p5.Vector.sub(p3, p1);
            let N = createVector(
                U.y * V.z - U.z * V.y,
                U.z * V.x - U.x * V.z,
                U.x * V.y - U.y * V.x
            ).normalize();
            let shade = N.dot(lightDir);

            let divA, divB;
            if (subdivDistribution == "height") {
                divB = round(map(abs(ht), 0, 648, 1, 10));
                divA = 1;
            } else if (subdivDistribution == "random") {
                divA = ceil(random(3));
                divB = divA;
            } else if (subdivDistribution == "none") {
                divA = 1;
                divB = divA;
            } else if (subdivDistribution == "shading") {
                divA = round(1 + pow(abs(shade), 3) * 10);
                divB = round(divA * 1.5);
            } else if (subdivDistribution == "horizontal") {
                divA = 1;
                divB = round(map(abs(ht), 0, 648, 1, 10));;
            } else if (subdivDistribution == "vertical") {
                divA = round(map(abs(ht), 0, 300, 8, 1));
                divB = 1;
            }

            divA *= map(constrain(abs(ht), 0, 200), 1, 400, 0, 1);
            divB *= map(constrain(abs(ht), 0, 200), 1, 200, 0, 1);

            divA = round(constrain(divA, 1, 10));
            divB = round(constrain(divB, 1, 10));

            if (divA > 1) {
                divA = round(divA * 1.5);
            }
            if (divB > 1) {
                divB = round(divB * 1.5);
            }

            for (let a = 0; a < divA; a++) {
                let _a = map(a, 0, divA, 0, 1);
                let __a = map(a + 1, 0, divA, 0, 1);

                for (let b = 0; b < divB; b++) {
                    let _b = map(b, 0, divB, 0, 1);
                    let __b = map(b + 1, 0, divB, 0, 1);

                    let q1 = createVector(
                        lerp(
                            lerp(p1.x, p4.x, _b),
                            lerp(p2.x, p3.x, _b),
                            _a),
                        lerp(
                            lerp(p1.y, p4.y, _b),
                            lerp(p2.y, p3.y, _b),
                            _a),
                        lerp(
                            lerp(p1.z, p4.z, _b),
                            lerp(p2.z, p3.z, _b),
                            _a));
                    let q2 = createVector(
                        lerp(
                            lerp(p1.x, p4.x, _b),
                            lerp(p2.x, p3.x, _b),
                            __a),
                        lerp(
                            lerp(p1.y, p4.y, _b),
                            lerp(p2.y, p3.y, _b),
                            __a),
                        lerp(
                            lerp(p1.z, p4.z, _b),
                            lerp(p2.z, p3.z, _b),
                            __a));
                    let q3 = createVector(
                        lerp(
                            lerp(p1.x, p4.x, __b),
                            lerp(p2.x, p3.x, __b),
                            __a),
                        lerp(
                            lerp(p1.y, p4.y, __b),
                            lerp(p2.y, p3.y, __b),
                            __a),
                        lerp(
                            lerp(p1.z, p4.z, __b),
                            lerp(p2.z, p3.z, __b),
                            __a));
                    let q4 = createVector(
                        lerp(
                            lerp(p1.x, p4.x, __b),
                            lerp(p2.x, p3.x, __b),
                            _a),
                        lerp(
                            lerp(p1.y, p4.y, __b),
                            lerp(p2.y, p3.y, __b),
                            _a),
                        lerp(
                            lerp(p1.z, p4.z, __b),
                            lerp(p2.z, p3.z, __b),
                            _a));

                    drawArray.push([
                        [
                            (q1.z + q2.z + q3.z + q4.z) / 4,
                            0
                        ], // 0

                        // p1
                        q1.x,
                        q1.y,
                        q1.z, //1, 2, 3

                        // p2
                        q2.x,
                        q2.y,
                        q2.z, // 4, 5, 6

                        // p3
                        q3.x,
                        q3.y,
                        q3.z, // 7, 8, 9

                        // p4
                        q4.x,
                        q4.y,
                        q4.z, // 10, 11, 12

                        "quad" // 13
                    ]);

                    if (ht > 0) {
                        cap[0][0] = max(cap[0][0], drawArray[drawArray.length - 1][0][0]);
                    } else {
                        cap[0][0] = min(cap[0][0], drawArray[drawArray.length - 1][0][0]);
                    }
                }
            }
            cap.push(p4);
        }

        cap.push("poly");
        drawArray.push(cap);
    }
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