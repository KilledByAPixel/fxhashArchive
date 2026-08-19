let canvasSize;
let len = Math.floor(fxrand() * 30) * 0.1 + 2.5;
let huescale = fxrand() * 360;
let satscale = fxrand() * 100;
let briscale = fxrand() * 100;
let basehue = fxrand() * 360;
let rotatebase = fxrand() * 360 + 720;
let xnbase = fxrand() * 150 + 150;
let ynbase = fxrand() * 300 + 600;
let fxpre = false;
let revhue = Math.floor(fxrand() * 3) - 1;
let revsat = Math.floor(fxrand() * 3) - 1;
let revbri = Math.floor(fxrand() * 3) - 1;
let colormode = Math.floor(fxrand() * 3);
let linemode = Math.floor(fxrand() * 2);
let lengthmode = Math.floor(fxrand() * 5);
let bordermode = Math.floor(fxrand() * 3);
let colorvariant = fxrand() * 3 + 2;


let bgbase = [
    [214, 15, 85],
    [39, 3, 95],
    [45, 12, 85],
    [45, 3, 95],
    [0, 0, 95],
    [0, 0, 85],
    [0, 0, 15],

];
let colordice = Math.floor(fxrand() * bgbase.length);
let bgcolor = bgbase[colordice];
let cnv;

function setup() {
    if (innerWidth > innerHeight) {
        canvasSize = innerHeight;
    } else {
        canvasSize = innerWidth;
    }
    console.log(fxhash);
    console.log(xnbase);
    console.log(ynbase);
    console.log(len);

    cnv = createCanvas(canvasSize * 0.6, canvasSize, WEBGL);
    var x = (innerWidth - canvasSize * 0.6) / 2;
    var y = (innerHeight - canvasSize) / 2;
    cnv.position(x, y);


    colorMode(HSB, 360, 100, 100);
    background(bgcolor);
    noiseSeed(fxrand() * 10000);
    pixelDensity(displayDensity() * 2);
}

function draw() {
    if (frameCount == 1) {

        background(bgcolor);

    }
    if (frameCount < 640) {
        fr = frameCount % 640;
        latestpx = -canvasSize / 2;
        for (var i = 0; i < 800; i += len) {
            push();
            px = i / (800) - 0.5;
            py = (fr + 1) / (640) - 0.5;
            no = noise(i / xnbase, fr / ynbase) * -0.5;
            nextno = noise((i + 1) / xnbase, fr / ynbase) * -0.5;
            nextpx = (i + 1) / (800) - 0.5;
            currentpx = px * canvasSize + no * canvasSize * 1.5;
            nextpx = nextpx * canvasSize + nextno * canvasSize * 1.5;
            drawlength = (nextpx - currentpx) * 0.6;
            currentpy = py * canvasSize * 0.6;
            mypx = py * canvasSize * 0.6;
            mypy = currentpx * -2;
            finalpy = mypy * 1.5 - canvasSize / 2;
            translate(mypx, finalpy);
            rotate(no * rotatebase);
            if (linemode == 0) {
                strokeWeight(0.8 - no / 8 - drawlength / 8);
            } else if (linemode == 1) {
                strokeWeight(0.8 + no / 4);
            }
            border = canvasSize * 0.025;
            if (mypx > (-canvasSize * 0.3 + border) && mypx < canvasSize * 0.3 - border) {
                if ((finalpy) > (-canvasSize * 0.5 + border) && (finalpy) < (canvasSize * 0.5 - border)) {
                    if (currentpx > latestpx) {
                        //stroke((340+(mypy/canvasSize))%360, 95, 15+(mypy/canvasSize));
                        if (colormode == 0) {
                            stroke(basehue + py * huescale * revhue, 50 + px * satscale * revsat, 25 + py * briscale * revbri);
                        } else if (colormode == 1) {
                            stroke(basehue + px * huescale * revhue, 50 + py * satscale * revsat, 25 + px * briscale * revbri);
                        } else if (colormode == 2) {
                            stroke(basehue + px * huescale * revhue, 50 + px * satscale * revsat, 25 + px * briscale * revbri);
                        }
                        if (colordice == 6) {
                            stroke((basehue + colorvariant * px * huescale * revhue) % 360, min(2, 2 - px * satscale * revsat), 95 - px * briscale * revbri);

                        }
                        if (lengthmode == 0) {
                            line(-drawlength * len * 1, -drawlength * len * 1, drawlength * len * 1.8, drawlength * len * 1.8);
                        } else if (lengthmode == 1) {
                            line(-drawlength * len * 1.5, -drawlength * len * 1.5, drawlength * len * 2, drawlength * len * 2);
                        } else if (lengthmode == 2) {
                            line(-drawlength * len * 2.5, -drawlength * len * 2.5, drawlength * len * 3, drawlength * len * 3);
                        } else if (lengthmode == 3) {
                            line(-drawlength * len * 1, -drawlength * len * 1, drawlength * len * 3, drawlength * len * 3);
                        } else if (lengthmode == 4) {
                            //line(0,0,drawlength*len*1,drawlength*len*1); 
                            line(3, 3, 3 - drawlength * len * 3, 3 + drawlength * len * 3);
                        }
                        latestpx = currentpx;

                    }
                }
            } 

            pop();

        }
    } else {
        if (fxpre == false) {
            fxpreview();
            fxpre = true;
        }
    }
    rectMode(CENTER);
    if (bordermode == 0) {
        strokeWeight(canvasSize * 0.03);
    } else if (bordermode == 1) {
        strokeWeight(canvasSize * 0.04);
    } else if (bordermode == 2) {
        strokeWeight(canvasSize * 0.05);
    }
    stroke(bgcolor)
    noFill();
    rect(0, 0, canvasSize * 0.6, canvasSize);
}

function keyPressed() {
    if (keyCode === 65) {
        saveCanvas("camino:" + fxhash, "jpg");
    }
}