let houses = [];
let canvasSize;
let density = 100;
let chaos = 0.3;
let haswindow = false;
let hastower = false;
let hassmalltower = false;
let hashouse = false;
let hasmystery = false;
let hasmysterytown = false;
let haspyramid = false;
let hasgreatpyramid = false;
let haswallblock = false;
let hasgarden = true;
let hassolid = true;
let hasreflection = true;

let hastree = false;
let hasfog = false;
let houselakeside = 20;
let sWeight = 0.3;
let preset = true;
let refresh = true;
let bigcanvassize=2048;
//dice=38;
let objectmodedatabase=[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,3,3,3,3,4,4,5,5,6,6,6,6,6,6,7,7,8,8,8,8,8,8,9,9,9,9,9,9,10,10,10,10,11,11,11,11,12,12,13,13,13,13,14,14,14,14,14,14,15,15,15,15,16,16,16,16,17];
let dice = Math.floor(fxrand() * objectmodedatabase.length);
let objectmode = objectmodedatabase[dice];
let bigcanvas;
dice = Math.floor(fxrand() * 30);
//dice=19;
let currentcolor = 1;
let colordicedatabase = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5,5,5,6,6,6,7,7,7,8,9];
let colordice = colordicedatabase[dice];


let lightratial = 20;
let housecount = 10;
let rowcount = 4;
let colordatabase = [
    [
        [39, 9, 95],
        [0, 33, 2],
        [0, 0, 5],
        [0, 0, 23]
    ],
    [
        [24, 12, 95],
        [0, 20, 5],
        [0, 0, 5],
        [191, 20, 5]
    ],
    [
        [228, 58, 40],
        [0, 33, 2],
        [40, 0, 76],
        [57, 72, 100]
    ],
    [
        [0, 0, 15],
        [0, 0, 0],
        [0, 0, 71],
        [57, 72, 100]

    ],
    [
        [203, 28, 15],
        [0, 0, 0],
        [203, 15, 95],
        [45, 64, 95]
    ],
    [
        [214, 26, 45],
        [214, 9, 5],
        [56, 26, 75],
        [208, 25, 95]
    ],
    [
        [208, 51, 55],
        [208, 56, 5],
        [208, 25, 95],
        [208, 25, 95]
    ],
    [
        [189, 23, 78],
        [204, 28, 10],
        [221, 28, 35],
        [208, 25, 95]
    ],
    [
        [203, 28, 15],
        [50, 73, 95],
        [203, 15, 65],
        [45, 64, 95]
    ],
    [
        [203, 98, 75],
        [214, 19, 100],
        [214, 19, 85],
        [214, 19, 100]
    ]




];
//colordice = 0;
let colormode = colordatabase[colordice];

window.$fxhashFeatures = {
  "ColorMode": colordice,
  "ObjectMode": objectmode
}

class tree {
    constructor(x, y, z, scalex, scaley, scalez, density, rotation) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scalex = scalex;
        this.scaley = scaley;
        this.scalez = scalez;
        this.rotation = rotation;
        this.isTower = false;
        this.towerheight = 7;
        let parts = [];
        let vectors = [];
        let windows = [];
        this.chaos1 = 0;

        this.chaos2 = 4;
        for (var i = 0; i < 5 * density * scaley; i++) {
            let py = i / (5 * density * scaley) * -this.towerheight;

            let pyL = py + fxrand() * this.chaos1;
            let pxL = -1 + pyL / -this.towerheight * 0.25;
            let pzL = 1 - pyL / -this.towerheight * 0.25;
            let pyR = py + fxrand() * this.chaos1;
            let pxR = 1 - pyR / -this.towerheight * 0.25;
            let pzR = 1 - pyR / -this.towerheight * 0.25;
            let pyZ = py + fxrand() * this.chaos1;
            let pxZ = 1 - pyZ / -this.towerheight * 0.25;
            let pzF = -1 + pyZ / -this.towerheight * 0.25;


            vectors.push([pxL, pyL, pzL]);
            vectors.push([pxR, pyR, pzR]);
            vectors.push([pxR, pyR, pzR]);
            vectors.push([pxZ, pyZ, pzF]);

        }
        parts.push(vectors);
        vectors = [];
        for (var i = 0; i < 10 * density * scaley; i++) {
            let py = i / (10 * density * scaley) * -12;

            let pyL = py + fxrand() * this.chaos2;
            let pxL = -3 + pyL / -12 * 3;
            let pzL = 3 - pyL / -12 * 3;
            let pyR = py + fxrand() * this.chaos2;
            let pxR = 3 - pyR / -12 * 3;
            let pzR = 3 - pyR / -12 * 3;
            let pyZ = py + fxrand() * this.chaos2;
            let pxZ = 3 - pyZ / -12 * 3;
            let pzF = -3 + pyZ / -12 * 3;


            vectors.push([pxL, pyL - this.towerheight, pzL]);
            vectors.push([pxR, pyR - this.towerheight, pzR]);
            vectors.push([pxR, pyR - this.towerheight, pzR]);
            vectors.push([pxZ, pyZ - this.towerheight, pzF]);

        }
        parts.push(vectors);


        this.windows = windows;
        this.parts = parts;
    }



}

class wallblock {
    constructor(x, y, z, scalex, scaley, scalez, density) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scalex = scalex;
        this.scaley = scaley;
        this.scalez = scalez;
        this.density = density;
        this.rotation = 0;
        let parts = [];
        let vectors = [];
        let windows = [];
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 2; j++) {
                if (i % 2 == 0) {
                    vectors = [];
                    for (var k = 0; k <= 12 * this.density; k++) {
                        let px = -1 + (k / (12 * this.density)) * 0.8;
                        vectors.push([px, 0.25 * (i + 1), 0]);
                        vectors.push([px, 0.25 * i, 0]);
                    }
                    parts.push(vectors);
                    vectors = [];
                    for (var k = 0; k < 4 * this.density; k++) {
                        let py = (k / (4 * this.density)) * 0.25;
                        vectors.push([-0.2, py + 0.25 * i, 0]);
                        vectors.push([0.6, py + 0.25 * i, 0]);
                    }
                    parts.push(vectors);
                } else {
                    vectors = [];
                    for (var k = 0; k < 4 * this.density; k++) {
                        let py = (k / (4 * this.density)) * 0.25;
                        vectors.push([-0.6, py + 0.25 * i, 0]);
                        vectors.push([0.2, py + 0.25 * i, 0]);
                    }
                    parts.push(vectors);
                    vectors = [];
                    for (var k = 0; k < 12 * this.density; k++) {
                        let px = 0.2 + (k / (12 * this.density)) * 0.8;
                        vectors.push([px, 0.25 * (i + 1), 0]);
                        vectors.push([px, 0.25 * i, 0]);
                    }
                    parts.push(vectors);
                }
            }
        }
        this.windows = windows;
        this.parts = parts;
    }
}
class house {
    constructor(x, y, z, scalex, scaley, scalez, density, wx, wy, rotation) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scalex = scalex;
        this.scaley = scaley;
        this.scalez = scalez;
        this.rotation = rotation;
        this.isTower = false;
        let parts = [];
        let vectors = [];
        let windows = [];
        for (var i = 0; i < 5 * density * scaley; i++) {
            let py = i / (5 * density * scaley) * -2;
            let pyL = py + fxrand() * chaos;
            let pyR = py + fxrand() * chaos;
            let pyZ = py + fxrand() * chaos;
            vectors.push([-1, pyL, 0.6]);
            vectors.push([1, pyR, 0.6]);
            vectors.push([1, pyR, 0.6]);
            vectors.push([1, pyZ, -0.6]);

        }
        for (var i = 0; i < 2 * density * scaley; i++) {
            let py = -2.7 + (i / (2 * density * scaley)) * 0.7;
            let pyF = py + fxrand() * chaos;
            let pyB = py + fxrand() * chaos;

            let pzF = (i / (2 * density * scaley)) * 0.6;
            vectors.push([1, pyF, pzF]);
            vectors.push([1, pyB, -pzF]);

        }
        parts.push(vectors);
        vectors = [];

        for (var i = 0; i < 20 * density * scalex; i++) {
            let px = (i / (20 * density * scalex) - 0.5) * 2;
            let pxU = px + fxrand() * chaos;
            let pxD = px + fxrand() * chaos;

            vectors.push([pxD, -2, 0.6]);
            vectors.push([pxU, -2.7, 0]);

        }
        parts.push(vectors);

        let xc = Math.floor(scalex / 1);
        let yc = Math.floor(scaley / 1);

        for (var i = 1; i <= xc; i++) {
            for (var j = 1; j <= yc; j++) {
                px = -1 + i / (xc + 1) * 2;
                py = j / (yc + 1) * -2;
                let lightrate = Math.floor(fxrand() * lightratial);
                let wrotation = (fxrand() - 0.5) * 10 * 6.28 / 360;

                windows.push([px, py, 0.6, lightrate, wrotation]);
            }
        }
        this.windows = windows;
        this.parts = parts;
    }
}


class tower {
    constructor(x, y, z, scalex, scaley, scalez, density, wx, wy, rotation) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scalex = scalex;
        this.scaley = scaley;
        this.scalez = scalez;
        this.rotation = rotation;
        this.isTower = false;
        this.towerheight = 20;
        let parts = [];
        let vectors = [];
        let windows = [];
        for (var i = 0; i < 5 * density * scaley; i++) {
            let py = i / (5 * density * scaley) * -this.towerheight;

            let pyL = py + fxrand() * chaos;
            let pxL = -1 + pyL / -this.towerheight * 0.6;
            let pzL = 1 - pyL / -this.towerheight * 0.6;
            let pyR = py + fxrand() * chaos;
            let pxR = 1 - pyR / -this.towerheight * 0.6;
            let pzR = 1 - pyR / -this.towerheight * 0.6;
            let pyZ = py + fxrand() * chaos;
            let pxZ = 1 - pyZ / -this.towerheight * 0.6;
            let pzF = -1 + pyZ / -this.towerheight * 0.6;


            vectors.push([pxL, pyL, pzL]);
            vectors.push([pxR, pyR, pzR]);
            vectors.push([pxR, pyR, pzR]);
            vectors.push([pxZ, pyZ, pzF]);

        }
        parts.push(vectors);
        vectors = [];
        for (var i = 0; i < 1 * density * scaley; i++) {
            let py = i / (1 * density * scaley) * -1.5;

            let pyL = py + fxrand() * chaos;
            let pxL = -0.4 + pyL / -1.5 * 0.4;
            let pzL = 0.4 - pyL / -1.5 * 0.4;
            let pyR = py + fxrand() * chaos;
            let pxR = 0.4 - pyR / -1.5 * 0.4;
            let pzR = 0.4 - pyR / -1.5 * 0.4;
            let pyZ = py + fxrand() * chaos;
            let pxZ = 0.4 - pyZ / -1.5 * 0.4;
            let pzF = -0.4 + pyZ / -1.5 * 0.4;


            vectors.push([pxL, pyL - this.towerheight, pzL]);
            vectors.push([pxR, pyR - this.towerheight, pzR]);
            vectors.push([pxR, pyR - this.towerheight, pzR]);
            vectors.push([pxZ, pyZ - this.towerheight, pzF]);

        }
        parts.push(vectors);
        windows.push([0, -this.towerheight * 0.955, 0.4, 100, 0]);


        this.windows = windows;
        this.parts = parts;
    }



}


class pyramid {
    constructor(x, y, z, scalex, scaley, scalez, density, wx, wy, rotation) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scalex = scalex;
        this.scaley = scaley;
        this.scalez = scalez;
        this.rotation = rotation;
        this.isPryamid = true;
        let parts = [];
        let vectors = [];
        let windows = [];
        for (var i = 0; i < 5 * density * scaley; i++) {
            let py = i / (5 * density * scaley) * -10;

            let pyL = py + fxrand() * chaos;
            let pxL = -10 + pyL / -10 * 10;
            let pzL = 10 - pyL / -10 * 10;
            let pyR = py + fxrand() * chaos;
            let pxR = 10 - pyR / -10 * 10;
            let pzR = 10 - pyR / -10 * 10;
            let pyZ = py + fxrand() * chaos;
            let pxZ = 10 - pyZ / -10 * 10;
            let pzF = -10 + pyZ / -10 * 10;


            vectors.push([pxL, pyL, pzL]);
            vectors.push([pxR, pyR, pzR]);
            vectors.push([pxR, pyR, pzR]);
            vectors.push([pxZ, pyZ, pzF]);

        }
        parts.push(vectors);




        this.windows = windows;
        this.parts = parts;
    }



}

class greatpyramid {
    constructor(x, y, z, scalex, scaley, scalez, density, wx, wy, rotation) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scalex = scalex;
        this.scaley = scaley;
        this.scalez = scalez;
        this.rotation = rotation;
        this.isPryamid = true;
        let parts = [];
        let vectors = [];
        let windows = [];
        for (var i = 0; i < 5 * density * scaley; i++) {
            let py = i / (5 * density * scaley) * -10;

            let pyL = py + fxrand() * chaos;
            let pxL = -10 + pyL / -10 * 10;
            let pzL = 10 - pyL / -10 * 10;
            let pyR = py + fxrand() * chaos;
            let pxR = 10 - pyR / -10 * 10;
            let pzR = 10 - pyR / -10 * 10;
            let pyZ = py + fxrand() * chaos;
            let pxZ = 10 - pyZ / -10 * 10;
            let pzF = -10 + pyZ / -10 * 10;


            vectors.push([pxL, pyL + 1, pzL]);
            vectors.push([pxR, pyR + 1, pzR]);
            vectors.push([pxR, pyR + 1, pzR]);
            vectors.push([pxZ, pyZ + 1, pzF]);

        }
        parts.push(vectors);




        this.windows = windows;
        this.parts = parts;
    }



}




function setup() {
    if (windowWidth > windowHeight) {
        canvasSize = windowHeight;
    } else {
        canvasSize = windowWidth;
    }
    //canvasSize=2048;
    colorMode(HSB, 360, 100, 100);
    //noSmooth();
    createCanvas(canvasSize, canvasSize);
    settingmode();

    redice();

}


function redice() {
    houses = [];
    if (bigcanvas) bigcanvas.remove();
    bigcanvas = createGraphics(bigcanvassize, bigcanvassize, WEBGL);
    bigcanvas.colorMode(HSB, 360, 100, 100);

    bigcanvas.camera = bigcanvas.createCamera();
    bigcanvas.camera.pan(6.28 / 360 * 45);
    bigcanvas.camera.move(bigcanvassize * 0.8, -bigcanvassize, bigcanvassize * 5);
    bigcanvas.camera.move(0, 0, 0);
    bigcanvas.camera.tilt(6.28 / 360 * 5);
    bigcanvas.perspective(PI / 3.0, bigcanvassize / bigcanvassize, bigcanvassize * 0.01, bigcanvassize * 35);
    bigcanvas.background(colormode[0]);

    if (hasgarden == true) {
        for (var i = 0; i < 12; i++) {
            px = cos(i / 12 * 6.28) * 20;
            py = 0;
            pz = sin(i / 12 * 6.28) * 20 - 20;
            scalex = 0.4 + fxrand() * 0.1;
            scaley = scalex;
            scalez = scalex;
            density = 20 + fxrand() * 5;
            rotation = fxrand() * 1 - 0.5;
            houses.push(new tree(px, py, pz, scalex, scaley, scalez, density, rotation));
        }
        px = 3.5;
        pz = -16;
        py = pz * 0.0;
        scalex = 3 + fxrand() * 0.3;
        scaley = scalex;
        scalez = scalex;
        density = 20 + fxrand() * 5;
        rotation = fxrand() * 0.8 - 0.4;
        houses.push(new house(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));


    }
    if (hastree == true) {
        for (var j = 0; j < rowcount; j++) {

            for (var i = 0; i < housecount; i++) {
                px = -4 * housecount + (i / housecount) * 8 * housecount;
                pz = -2 - j * 10 + fxrand() * -4;;
                py = 0;
                scalex = 0.5;
                scaley = 0.5;
                scalez = 0.5;
                density = 20 + fxrand() * 30;
                rotation = fxrand() * 0.8 - 0.4;
                houses.push(new tree(px, py, pz, scalex, scaley, scalez, density, rotation));

            }
        }
    }
    if (haswallblock == true) {
        for (var j = 0; j < rowcount; j++) {

            for (var i = 0; i < housecount; i++) {
                px = -16 + (i / housecount) * 2 * housecount;
                pz = -2;
                py = 0;
                scalex = 1;
                scaley = 3.2;
                scalez = 1;
                density = 4;
                houses.push(new wallblock(px, py, pz, scalex, scaley, scalez, density));

            }
        }
    }
    if (hashouse == true) {
        for (var j = 0; j < rowcount; j++) {

            for (var i = 0; i < housecount; i++) {
                px = -4 * housecount + (i / housecount) * 8 * housecount;
                pz = -2 - j * 10 + fxrand() * -4;
                py = pz * 0.1;
                scalex = 2.4 + fxrand() * 0.5;
                scaley = 1 + fxrand() * 2;
                scalez = 2.5 + fxrand();
                density = 4 + fxrand() * 8;
                rotation = fxrand() * 0.8 - 0.4;
                houses.push(new house(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));

            }
        }
    }
    if (hastower == true) {
        for (var j = 0; j < 1; j++) {

            for (var i = 0; i < 1; i++) {
                px = fxrand() * (-4 * housecount + (i / housecount) * 8 * housecount);
                pz = -2 - j * 10 + fxrand() * -4;
                py = pz * 0.1;
                scalex = 1 + fxrand() * 0.5;
                scaley = scalex;
                scalez = scalex;
                density = 60 + fxrand() * 5;
                rotation = fxrand() * 0.8 - 0.4;
                houses.push(new tower(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));

            }
        }
    }
    if (hassmalltower == true) {
        for (var j = 0; j < 1; j++) {

            for (var i = 0; i < 1; i++) {

                px = fxrand() * (-4 * housecount + (i / housecount) * 8 * housecount);
                pz = -2 - j * 10 + fxrand() * -4;
                py = pz * 0.1;
                scalex = 0.75 + fxrand() * 0.25;
                scaley = scalex;
                scalez = scalex;
                density = 45 + fxrand() * 5;
                rotation = fxrand() * 0.8 - 0.4;
                houses.push(new tower(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));
            }
        }
    }
    if (hasgreatpyramid == true) {
        for (var j = 0; j < rowcount; j++) {

            for (var i = 0; i < housecount; i++) {
                px = -4 * housecount + (i / housecount) * 8 * housecount;
                pz = -15 - j * 10 + fxrand() * -4;
                py = pz * 0.0;
                scalex = 1.5 + fxrand() * 0.5;
                scaley = scalex;
                scalez = scalex;
                density = 45 + fxrand() * 5;
                rotation = fxrand() * 0.8 - 0.4;
                houses.push(new greatpyramid(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));

            }
        }
    }
    if (haspyramid == true) {
        for (var j = 0; j < rowcount; j++) {

            for (var i = 0; i < housecount; i++) {
                px = -4 * housecount + (i / housecount) * 8 * housecount;
                pz = -5 - j * 10 + fxrand() * -4;
                py = pz * 0;
                scalex = 0.5 + fxrand() * 0.4;
                scaley = scalex;
                scalez = scalex;
                density = 45 + fxrand() * 5;
                rotation = fxrand() * 0.8 - 0.4;
                houses.push(new pyramid(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));

            }
        }
    }
    if (hasmystery == true) {
        for (var i = 0; i < 12; i++) {
            px = cos(i / 12 * 6.28) * 10;
            py = 0;
            pz = sin(i / 12 * 6.28) * 10 - 10;
            scalex = 0.4 + fxrand() * 0.2;
            scaley = scalex;
            scalez = scalex;
            density = 100 + fxrand() * 5;
            rotation = fxrand() * 0.8 - 0.4;
            houses.push(new tower(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));
        }
    }

    if (hasmysterytown == true) {
        for (var i = 0; i < 12; i++) {
            px = cos(i / 12 * 6.28) * 12;
            py = 0;
            pz = sin(i / 12 * 6.28) * 12 - 12;
            scalex = 0.8 + fxrand() * 0.3;
            scaley = scalex;
            scalez = scalex;
            density = 20 + fxrand() * 5;
            rotation = fxrand() * 1 - 0.5;
            houses.push(new house(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));
        }
        px = 3.5;
        pz = -8;
        py = pz * 0.0;
        scalex = 0.7 + fxrand() * 0.3;
        scaley = scalex;
        scalez = scalex;
        density = 200 + fxrand() * 5;
        rotation = fxrand() * 0.8 - 0.4;
        houses.push(new tower(px, py, pz, scalex, scaley, scalez, density, 1, 1, rotation));
    }
}

function drawshape() {
    bigcanvas.fill(colormode[0]);
    bigcanvas.translate(0, 0, -4);
    bigcanvas.scale(0.0625 * bigcanvassize, 0.0625 * bigcanvassize, 0.0625 * bigcanvassize);
    bigcanvas.stroke(colormode[1]);


    for (var i = 0; i < houses.length; i++) {
        drawhouse(houses[i]);
    }

}

function landmask() {
    bigcanvas.fill(colormode[0]);
    bigcanvas.noStroke();
    bigcanvas.beginShape();
    for (var i = 0; i < 100; i++) {
        px = (i / 100 - 0.5) * 320;
        pz = 2 + fxrand() * -4;
        bigcanvas.vertex(px, 0, pz);

    }
    bigcanvas.vertex(160, 0, -200);
    bigcanvas.vertex(-160, 0, -200);
    bigcanvas.endShape();

}

function draw() {
    //background(255);
    //orbitControl();
    if (preset == true) {
        redice();
        preset = false;
        refresh = true;

    }
    if (refresh == true) {
        bigcanvas.background(colormode[0]);
        drawshape();
        landmask();
        land();
        lake();
        //imageMode(CENTER);
        image(bigcanvas, 0, 0,canvasSize,canvasSize);
        if (hasfog == true) {
            filter(BLUR, 0.6);
        }
        refresh = false;
        fxpreview();
    }




}

function drawhouse(house) {
    let windows = house.windows;
    let parts = house.parts;
    let vectors;

    for (var i = 0; i < parts.length; i++) {

        vectors = parts[i];

        if (hassolid == true) {
            bigcanvas.push();
            bigcanvas.translate(house.x, house.y, house.z);
            bigcanvas.scale(house.scalex, house.scaley, house.scalez);

            bigcanvas.rotateY(house.rotation);
            bigcanvas.strokeWeight(sWeight);

            bigcanvas.beginShape(LINES);
            for (var j = 0; j < vectors.length; j++) {
                bigcanvas.vertex(vectors[j][0], vectors[j][1], vectors[j][2]);
            }
            bigcanvas.endShape();
            bigcanvas.pop();
        }


        if (hasreflection == true) {

            bigcanvas.push();
            bigcanvas.strokeWeight(sWeight / 2);
            bigcanvas.translate(house.x, -house.y, house.z);
            bigcanvas.scale(house.scalex, -house.scaley, house.scalez);

            bigcanvas.rotateY(house.rotation);
            bigcanvas.beginShape(LINES);
            for (var j = 0; j < vectors.length; j++) {
                bigcanvas.vertex(vectors[j][0], vectors[j][1], vectors[j][2]);
            }
            bigcanvas.endShape();
            bigcanvas.pop();

        }
    }



    bigcanvas.push();
    bigcanvas.strokeWeight(1);
    bigcanvas.translate(house.x, house.y, house.z);
    bigcanvas.scale(house.scalex, house.scaley, house.scalez);

    bigcanvas.rotateY(house.rotation);


    for (var i = 0; i < windows.length; i++) {
        bigcanvas.push();
        bigcanvas.translate(windows[i][0], windows[i][1], windows[i][2] + 0.1);
        if (windows[i][3] > 0) {
            bigcanvas.fill(colormode[3]);

        } else {
            bigcanvas.fill(colormode[1]);
        }
        bigcanvas.noStroke();
        bigcanvas.rotateZ(windows[i][4]);
        if (haswindow == true && hassolid == true) {
            if (house.isTower == true) {
                bigcanvas.box(0.15, 0.03, 0.01);

            } else {
                bigcanvas.box(0.15, 0.1, 0.01);
            }
        }
        bigcanvas.pop();
    }
    bigcanvas.pop();

    bigcanvas.push();
    bigcanvas.strokeWeight(1);
    bigcanvas.translate(house.x, -house.y, house.z);
    bigcanvas.scale(house.scalex, -house.scaley, house.scalez);

    bigcanvas.rotateY(house.rotation);

    for (var j = 0; j < windows.length; j++) {


        bigcanvas.push();
        bigcanvas.translate(windows[j][0], windows[j][1], windows[j][2] + 0.1);
        if (windows[j][3] > 0) {
            bigcanvas.fill(colormode[3]);

        } else {
            bigcanvas.fill(colormode[1]);
        }
        bigcanvas.noStroke();
        if (haswindow == true && hasreflection == true) {
            if (house.isTower == true) {
                bigcanvas.box(0.15, 0.03, 0.01);

            } else {
                bigcanvas.box(0.15, 0.1, 0.01);
            }
        }
        bigcanvas.pop();
    }

    bigcanvas.pop();


}

function land() {
    bigcanvas.stroke(colormode[2]);
    bigcanvas.strokeWeight(1);

    for (var i = 0; i < 4000; i++) {
        bigcanvas.push();
        bigcanvas.beginShape(LINES);
        px = (i / 4000 - 0.5) * 320;
        pxF = px + fxrand() * 8;
        pxB = px + fxrand() * 8;
        pzF = fxrand() * 200;
        pzB = pzF + fxrand() * 1;
        pzY = -pzF * fxrand() * 0.1;
        bigcanvas.vertex(pxF, pzY, -pzF);
        bigcanvas.vertex(pxB, pzY, -pzB);
        bigcanvas.endShape();
        bigcanvas.pop();

    }
}

function lake() {
    bigcanvas.stroke(colormode[2]);
    bigcanvas.strokeWeight(0.3);

    for (var i = 0; i < 100; i++) {
        bigcanvas.push();
        bigcanvas.strokeWeight(1);
        bigcanvas.beginShape(LINES);
        px = (i / 100) * 50;
        pxF = px + fxrand() * 2;
        pxB = px + fxrand() * 2;
        pzF = fxrand() * 200;
        pzB = pzF + fxrand() * 2;
        pzY = -pzF * fxrand() * 0.01;
        //pxF=pzF/200*pxF;
        //pxB=pzF/200*pxB;
        //rotateX(1.5);

        //scale(fxrand());
        bigcanvas.vertex(pxF, pzY, pzF);
        bigcanvas.vertex(pxB, pzY, pzB);
        bigcanvas.endShape();
        bigcanvas.pop();

    }
}

function keyPressed() {
    if (keyCode === 65) {
        currentcolor++;
        currentcolor %= colordatabase.length;
        colormode = colordatabase[currentcolor];
        preset = true;
    }
    if (keyCode === 83) {
        preset = true;
        refresh = true;
    }
    if (keyCode === 82) {
        currentcolor++;
        currentcolor %= colordatabase.length;
        colormode = colordatabase[currentcolor];
        objectmode++;
        objectmode %= 18;
        settingmode();



        preset = true;

    }

}

function settingmode() {
    offall();
    switch (objectmode) {
        case 17:
            rowcount = 1;
            housecount = 1;
            hastower = true;
            hassolid = false;
            break;

        case 16:
            rowcount = 1;
            housecount = 1;
            hasgarden = true;
            haswindow = true;
            break;

        case 15:
            rowcount = 6+Math.floor(fxrand()*2);
            housecount = 2;
            hastree = true;
            break;

        case 14:
            rowcount = 6;
            housecount = 13+Math.floor(fxrand()*3);
            hastree = true;
            break;

        case 13:
            rowcount = 1;
            housecount = 5+Math.floor(fxrand()*3);
            hastree = true;
            break;

        case 12:
            rowcount = 1;
            housecount = 1;
            hastree = true;
            break;

        case 11:
            rowcount = 2;
            housecount = 5+Math.floor(fxrand()*3);
            hashouse = true;
            haswindow = true;
            break;
        case 10:
            haswindow = false;
            hasmysterytown = true;
            break;

        case 9:
            rowcount = 5+Math.floor(fxrand()*3);
            housecount = 15+Math.floor(fxrand()*5);
            hashouse = true;
            hastower = true;
            break;

        case 9:
            rowcount = 5+Math.floor(fxrand()*3);
            housecount = 15+Math.floor(fxrand()*3);
            hashouse = true;
            hassmalltower = true;
            break;

        case 8:
            rowcount = 3+Math.floor(fxrand()*1);
            housecount = 5+Math.floor(fxrand()*3);
            hashouse = true;
            hassmalltower = true;
            break;
        case 7:
            hasgreatpyramid = true;
            break;

        case 6:
            rowcount = 3;
            housecount = 15+Math.floor(fxrand()*3);
            hashouse = true;
            hasstower = true;
            break;

        case 5:
            rowcount = 1;
            housecount = 1;
            hashouse = true;
            break;

        case 0:
            rowcount = 3;
            housecount = 7+Math.floor(fxrand()*3);
            hassmalltower = true;
            hashouse = true;
            haswindow = true;
            break;
        case 1:
            rowcount = 3;
            housecount = 8+Math.floor(fxrand()*3);
            hashouse = true;
            break;

        case 2:
            hastower = true;
            haswindow = true;
            break;
        case 3:
            hasmystery = true;
            break;
        case 4:
            haspyramid = true;
            break;
        default:
            break;

    }
}

function offall() {
    rowcount = 1;
    housecount = 1;
    hashouse = false;
    hastower = false;
    hasmystery = false;
    hasmysterytown = false;
    haswindow = false;
    haspyramid = false;
    hasgreatpyramid = false;
    hasfog = false;
    haswallblock = false;
    hastree = false;
    hasgarden = false;
    hasreflection = true;
    hassolid = true;
    hassmalltower = false;
}

function doubleClicked() {
  saveCanvas(bigcanvas, 'forsaken', 'jpg');
}
/*
function touchStarted() {
    currentcolor++;
    currentcolor %= colordatabase.length;
    colormode = colordatabase[currentcolor];
    objectmode++;
    objectmode %= 18;
    settingmode();
    preset = true;
}
*/