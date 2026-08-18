// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function _createV(x, y, z) {
    let _z = z;
    if (_z == undefined) {
        _z = 0;
    }
    return {
        x: x,
        y: y,
        z: _z
    };
}

function _dot(v1, v2) {
    return (
        v1.x * v2.x +
        v1.y * v2.y +
        v1.z * v2.z);
}

function _setMag(v, mag) {
    let nrm = _normalize(v);
    return _scalarMult(nrm, mag);
}

function _normalize(v) {
    let mg = _mag(v);
    if (mg == 0) {
        return v;
    }
    return _scalarMult(v, 1 / mg);
}

function _scalarMult(v, s) {
    return _createV(
        v.x * s,
        v.y * s,
        v.z * s
    );
}

function _mag(v) {
    return sqrt(sq(v.x) + sq(v.y) + sq(v.z));
}

function _magSq(v) {
    return sq(v.x) + sq(v.y) + sq(v.z);
}

function _rotate(v, a, b, c) {
    let ca = cos(a);
    let cb = cos(b);
    let cc = cos(c);

    let sa = sin(a);
    let sb = sin(b);
    let sc = sin(c);

    let r = {
        x: v.x,
        y: v.y,
        z: v.z
    };
    let x1 = ca;
    let x2 = sa;
    let x3 = 0;
    let y1 = -sa;
    let y2 = ca;
    let y3 = 0;
    let z1 = 0;
    let z2 = 0;
    let z3 = 1;

    r = {
        x: r.x * x1 + r.y * y1 + r.z * z1,
        y: r.x * x2 + r.y * y2 + r.z * z2,
        z: r.x * x3 + r.y * y3 + r.z * z3
    };

    x1 = cb;
    x2 = 0;
    x3 = sb;
    y1 = 0;
    y2 = 1;
    y3 = 0;
    z1 = -sb;
    z2 = 0;
    z3 = cb;

    r = {
        x: r.x * x1 + r.y * y1 + r.z * z1,
        y: r.x * x2 + r.y * y2 + r.z * z2,
        z: r.x * x3 + r.y * y3 + r.z * z3
    };

    x1 = 1;
    x2 = 0;
    x3 = 0;
    y1 = 0;
    y2 = cc;
    y3 = sc;
    z1 = 0;
    z2 = -sc;
    z3 = cc;

    r = {
        x: r.x * x1 + r.y * y1 + r.z * z1,
        y: r.x * x2 + r.y * y2 + r.z * z2,
        z: r.x * x3 + r.y * y3 + r.z * z3
    };
    return r;
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
                    sum += map[i - 1][j]; // left
                    if (j > 0) {
                        count++;
                        sum += map[i - 1][j - 1]; // top left
                    }
                    if (j < map[0].length - 1) {
                        count++;
                        sum += map[i - 1][j + 1]; // bottom left
                    }
                }
                if (i < map.length - 1) {
                    count++;
                    sum += map[i + 1][j]; // right
                    if (j > 0) {
                        count++;
                        sum += map[i + 1][j - 1]; // top right
                    }
                    if (j < map[0].length - 1) {
                        count++;
                        sum += map[i + 1][j + 1]; // bottom right
                    }
                }
                sum += map[i][j];
                count++;

                map[i][j] = lerp(map[i][j], sum / count, strength);
            }
        }
    }
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