let canvasSize;
let stage, stagecount;
let len = chancedice([10,20,70,80]) + 3;
let ratio = 0.6;
let rotatebase = fxrand() * 240 + 360;
rotatebase=600;
let xnbase = Math.floor(fxrand() * 40)+200;
let ynbase = Math.floor(fxrand() * 40)+400;
let framemode = chancedice([50,50,20]);
let scalemode;
let shiftpositionx;
let shiftpositiony;
let dyeing = chancedice([50,50]);
let pattern = chancedice([50,5,80]);

let fragunit;


let fragmentvariant = chancedice([90,10,10,10]);
//pattern = (fragmentvariant != 0) ? 2 : pattern;
let fragmode = chancedice([90,10,10,10]);
fragmode = (fragmentvariant != 0) ? 0 : fragmode;



let bgbase = [
    [214, 15, 85],
    [39, 3, 95],
    [0, 0, 0],
    [0, 0, 95],
    [0, 0, 80],
    [225, 42, 15],
    [0, 100, 75]

];

let colorset = [
    [
        [186, 33, 15],
        [169, 14, 25],
        [33, 15, 25],
        [0, 0, 35],
        [0, 0, 5]
    ],
    [
        [33, 98, 25],
        [5, 98, 25],
        [0, 98, 25],
        [0, 98, 25],
        [0, 98, 65]
    ],
    [
        [355, 80, 35],
        [355, 55, 25],
        [349, 40, 35],
        [0, 98, 25],
        [0, 98, 25]
    ],
    [
        [349, 98, 25],
        [39, 64, 25],
        [28, 75, 25],
        [11, 88, 25],
        [0, 89, 25]
    ],
    [
        [174, 72, 35],
        [169, 98, 25],
        [169, 98, 15],
        [169, 98, 15],
        [0, 0, 5]
    ],
    [
        [355, 94, 45],
        [67, 12, 55],
        [11, 36, 45],
        [0, 94, 35],
        [0, 58, 35]
    ],
    [
        [220, 75, 35],
        [220, 64, 25],
        [214, 64, 35],
        [214, 64, 35],
        [0, 0, 45]
    ],
    [
        [214, 98, 15],
        [33, 44, 45],
        [28, 66, 25],
        [11, 59, 25],
        [0, 0, 45]
    ],
    [
        [37, 98, 75],
        [37, 98, 85],
        [37, 98, 45],
        [50, 12, 15],
        [0, 0, 95]
    ],
    [
        [231, 70, 25],
        [225, 62, 65],
        [225, 53, 55],
        [208, 25, 85],
        [0, 0, 95]
    ],
    [
        [214, 98, 25],
        [214, 64, 65],
        [207, 50, 55],
        [205, 22, 79],
        [200, 7, 95]
    ],
    [
        [349, 29, 45],
        [349, 15, 45],
        [349, 15, 45],
        [203, 31, 45],
        [203, 1, 45]
    ],
    [
        [186, 98, 35],
        [186, 58, 55],
        [186, 36, 75],
        [186, 19, 95],
        [22, 47, 65]
    ],
    [
        [180, 98, 25],
        [169, 98, 45],
        [163, 98, 65],
        [28, 98, 95],
        [11, 98, 45]
    ],
    [
        [214, 69, 75],
        [208, 69, 75],
        [67, 47, 65],
        [50, 89, 95],
        [45, 88, 95]
    ],
    [
        [39, 9, 95],
        [33, 64, 95],
        [16, 73, 55],
        [11, 78, 35],
        [11, 28, 65]
    ],
    [
        [203, 23, 75],
        [39, 55, 95],
        [33, 98, 65],
        [28, 45, 95],
        [22, 44, 65]
    ],
    [
        [175, 77, 94],
        [176, 51, 95],
        [169, 83, 84],
        [165, 94, 35],
        [160, 100, 6]
    ],
    [
        [33, 47, 95],
        [28, 47, 85],
        [22, 55, 85],
        [22, 51, 65],
        [16, 58, 55]
    ],
    [
        [0, 0, 85],
        [0, 0, 65],
        [0, 0, 45],
        [0, 0, 35],
        [0, 0, 15]
    ],
    [
        [349, 86, 65],
        [344, 98, 85],
        [242, 56, 75],
        [129, 1, 95],
        [11, 78, 85]
    ],
    [
        [225, 42, 15],
        [225, 34, 5],
        [220, 26, 25],
        [214, 14, 45],
        [203, 4, 45]
    ],

];
let combination = [
    [2, 3, 4, 6, 7, 8, 9, 10, 11, 15, 16, 18, 19, 21],
    [0, 4, 5, 6, 7, 9, 10, 11, 12, 15, 17, 18, 19, 21],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 19, 21],
    [0, 4, 5, 6, 7, 9, 10, 11, 12, 15, 17, 18, 19, 21],
    [0, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 15, 18, 19, 21],
    [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 17, 18, 19, 20, 21],
    [0, 1, 3, 5, 7, 13, 17, 19]
];
let colordice = chancedice([10,10,10,10,10,10,5]);
pattern = (colordice == 6) ? 2 : pattern;
framemode = (colordice == 2) ? 0 : framemode;
framemode = (colordice == 5) ? 2 : framemode;
framemode = (colordice == 6) ? 0 : framemode;
len=(pattern==1)?len*0.8:len;

datalength = combination[colordice].length;
let colorindex = combination[colordice][Math.floor(fxrand() * datalength)];
let bgcolor = bgbase[colordice];
let cnv;
let latestpx;

window.$fxhashFeatures = {
    "COLORSET": colordice*100+colorindex,
    "FRAMEMODE": framemode,
    "PATTERN": pattern,
    "SCALELEVEL": len,
    "FRAGMENT": fragmentvariant * 10 + fragmode,
    "DYEING": dyeing
}

function setup() {
    if (innerWidth < innerHeight*ratio) {
        canvasSize = innerWidth/ratio;
    } else {
        canvasSize = innerHeight;
    }
    
    //canvasSize=960;
    shiftpositionx = (fxrand() - 1) * canvasSize *0.6+canvasSize *0.1;
    shiftpositiony = (fxrand() - 0.5) * canvasSize * 0.9;
    fragunit=canvasSize/20;
    //shiftpositionx=80;
    //shiftpositiony=0;
    scalemode = 0.8 + 1 * abs(shiftpositiony) / canvasSize;
    cnv = createCanvas(canvasSize * ratio, canvasSize);
    cnv.style('display', 'block');
    var x = (innerWidth - canvasSize*0.6) / 2;
    var y = (innerHeight - canvasSize) / 2;
    cnv.position(x, y);


    colorMode(HSB, 360, 100, 100);

    noiseSeed(fxrand() * 10000);
    pixelDensity(displayDensity() * 4);
    stage = 0;

}

function draw() {
    translate((canvasSize / 2) + shiftpositionx, (canvasSize / 2) + shiftpositiony)
    if (stage==0){
        background(bgcolor);
        stage=1;
    }else if (stage == 1) {
        latestpx = -canvasSize / 2;
        stage = 2;
        stagecount = 0;
    } else if (stage == 2) {
        stagecount++;
        if (stagecount >= 800) {
            stage = 3;
        }
        fr = stagecount % 800;
        latestpx -= canvasSize / 2;

        for (var i = 0; i < 800; i += len) {
            push();
            px = i / (800) - 0.5;
            py = (fr + 1) / (800);

            no = noise(i / xnbase, fr / ynbase) * -0.5;
            nextno = noise((i + 1) / xnbase, fr / ynbase) * -0.5;
            nextpx = (i + 1) / (800) - 0.5;

            currentpx = (px + no) * canvasSize;
            nextpx = (nextpx + nextno) * canvasSize;
            drawlength = (nextpx - currentpx) * 0.6;
            currentpy = py * canvasSize * 1;
            mypx = py * canvasSize * 1;
            mypy = currentpx * -2;
            finalpy = mypy * 1.5 - canvasSize / 2;

            drawlength *= mypx / canvasSize * 5;


            strokeWeight(0.5);
            border = canvasSize * 0.025;
            if (fragmentvariant == 0) {
                myangle = mypy / canvasSize;
            } else if (fragmentvariant == 1) {
                myangle = int(mypy / canvasSize * 80) / 80;
            } else if (fragmentvariant == 2) {
                myangle = int(mypy / canvasSize * 70) / 70;
            }  else if (fragmentvariant == 3) {
                myangle = int(mypy / canvasSize * 60) / 60;
            }

            roundpx = Math.cos(myangle * 6.28) * mypx * 0.95;
            roundpy = Math.sin(myangle * 6.28) * mypx * 0.95;

            distp = Math.sqrt(roundpx * roundpx + roundpy * roundpy);
            realpx = shiftpositionx + roundpx;
            realpy = shiftpositiony + roundpy;

            if (1) {
                if (currentpx > latestpx) {
                    push();

                    scale(scalemode);
                    if (fragmode == 0) {
                        translate(roundpx, roundpy);
                    } else if (fragmode == 1) {
                        if (int((roundpx + canvasSize) / fragunit) % 6 > 4&&distp<canvasSize*0.66) {
                            translate(roundpx - canvasSize * 2, roundpy - canvasSize * 2);
                        } else {
                            translate(roundpx, roundpy);
                        }
                    } else if (fragmode == 2) {
                        if (int((roundpx + canvasSize) / fragunit) % 2 > 0&&distp<canvasSize*0.66) {
                            translate(roundpx - canvasSize * 2, roundpy - canvasSize * 2);
                        } else {
                            translate(roundpx, roundpy);
                        }

                    }
                    else if (fragmode == 3) {
                        if (int((roundpy + canvasSize) / fragunit) % 6 > 4&&distp<canvasSize*0.66) {
                            translate(roundpx - canvasSize * 2, roundpy - canvasSize * 2);
                        } else {
                            translate(roundpx, roundpy);
                        }
                    }
                    rotate(no * rotatebase);
                    rnbr = fxrand() * 20 - 10;
                    let colorpick;
                    if (dyeing == 1) {
                        colorpick = int(i / 16) % 5;
                    } else {
                        colorpick = int(abs(no * 150)) % 5;
                    }
                    mcolor = colorset[colorindex][colorpick];
                    stroke(colorset[colorindex][colorpick]);
                    drawmode(pattern, drawlength, mcolor, distp);
                    latestpx = currentpx;
                    pop();
                }
            }

            pop();

        }
    } else if (stage == 3) {

        rectMode(CENTER);

        //stroke(0,0,(50+bgcolor[2])%100);
        if (bgcolor[2] == 0) {
            stroke(0, 0, 100);
        } else {
            stroke(bgcolor[0], bgcolor[1], bgcolor[2]);
        }
        noFill();
        shiftcanvas = (canvasSize - canvasSize * ratio) / 2;
        //rect(-shiftpositionx-shiftcanvas,-shiftpositiony, canvasSize*ratio , canvasSize);
        strokeWeight(canvasSize * 0.06);

        if (framemode == 0) {


        } else if (framemode == 1) {
            blendMode(EXCLUSION);
            rect(-shiftpositionx - shiftcanvas, -shiftpositiony, canvasSize * ratio, canvasSize);

        } else if (framemode == 2) {
            blendMode(ADD);
            stroke(360, 0, 100);
            for (var i = 0; i < 10; i++)
                rect(-shiftpositionx - shiftcanvas, -shiftpositiony, canvasSize * ratio, canvasSize);
            blendMode(MULTIPLY);
            stroke(bgcolor[0], bgcolor[1], bgcolor[2]);
            rect(-shiftpositionx - shiftcanvas, -shiftpositiony, canvasSize * ratio, canvasSize);


        }

        stage = 4;
    } else if (stage == 4) {
        fxpreview();
        stage = 5;
    }

}

function drawmode(drawmode, drawlength, mcolor, distp) {
    switch (drawmode) {
        case 0:
            if (mcolor[2] > bgcolor[2]) {
                blendMode(ADD);
            } else {
                blendMode(DIFFERENCE);

            }
            strokeWeight(0.1 + distp * 2 / canvasSize);

            line(0, 0, 0, -drawlength * len * 2);
            line(0, 0, 0, drawlength * len * 2);
            circle(0, -drawlength * len * 2, drawlength * 0.5);
            circle(0, drawlength * len * 2, drawlength * 0.5);
            circle(0, -drawlength * len * 1.75, drawlength * 0.5);
            circle(0, -drawlength * len * 1.5, drawlength * 0.5);
            circle(0, -drawlength * len * 1.25, drawlength * 0.5);
            break;
        case 1:
            if (mcolor[2] > bgcolor[2]) {
                blendMode(ADD);
            } else {
                blendMode(DIFFERENCE);

            }
            strokeWeight(0.1 + distp * 2 / canvasSize);
            line(0, 0, 0, -drawlength * len * 1);
            line(-drawlength * len * 2, -drawlength * len * 2, drawlength * len * 2, -drawlength * len * 2);
            circle(0, -drawlength * len * 1, drawlength * 0.5);
            circle(0, -drawlength * len * 1.5, drawlength * 0.5);
            circle(0, -drawlength * len * 1.25, drawlength * 0.5);
            break;

        case 2:
            if (mcolor[2] > bgcolor[2]) {
                blendMode(ADD);
            } else {
                blendMode(DIFFERENCE);

            }
            strokeWeight(0.1 + distp * 2 / canvasSize);

            //line(0,0,drawlength * len*2,-drawlength * len*2);
            line(0, 0, drawlength * len * 2, drawlength * len * 2);
            line(0, 0, -drawlength * len * 2, drawlength * len * 2);
            circle(0, -drawlength * len * 1.75, drawlength * 0.5);
            circle(0, -drawlength * len * 1.5, drawlength * 0.5);
            circle(0, -drawlength * len * 1.25, drawlength * 0.5);
            break;

        default:
            break;

    }


}

function chancedice(dicer){
  let totaldice=0;
  let dicearray=[];
  for(var i=0;i<dicer.length;i++){
    totaldice+=dicer[i];
    for(var j=0;j<dicer[i];j++){
      dicearray.push(i);
    }
  }
  diceresult=dicearray[Math.floor(fxrand()*totaldice)];
  return diceresult; 
}
function keyPressed() {
    if (keyCode === 65) {
        saveCanvas("REQUIEM_CLOUD:" + fxhash, "jpg");
    }else if (keyCode === 66) {
      stage=0;
      stagecount=0;
    }
}