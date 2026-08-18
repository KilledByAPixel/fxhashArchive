// CODE BY ALEJANDRO CAMPOS, A.K.A. (RAT)ARCHITECT (@RATCHITECT), RATCHITECT.TEZ, RATCHITECT.ETH
// P5.JS LIBRARY LICENSE: https://p5js.org/copyright.html

// HIGH-RES CANVAS and MARGINS

    const papel = [
        // Name                 Proportion  Adjust
        ["square",              1,          0.15],
        ["portrait",            640/512,    0],
        ["tall",                768/512,    -0.1],
        ["landscape",           512/768,    0.25],
        ["landscape_wide",      512/1000,   0.35],
    ];
    var papelS = weightedRand({
        0: 40,
        1: 40,
        2: 10,
        3: 40,
        4: 20,
    });
    let papelProp = papel[papelS][1];

    const margenes = [
        // Name             Margin
        ["Borderline",      0.0],
        ["Just Right",      0.07],
        ["Fresh Air",       0.1],
    ];
    var margenesS = weightedRand({
        0: 40,
        1: 40,
        2: 20,
    });
    let marg = margenes[margenesS][1];

    function coge(name){
        if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
    }
    if (parseInt(coge('res'))) {var resolution = parseInt(coge('res'));}
    else {var resolution = 0;}
    let widthW;
    let heightW;
    let pixel;
    if(window.innerHeight <= window.innerWidth*papelProp) {
        heightW = Math.max(window.innerHeight, resolution*papelProp);
        pixel = heightW/700;
        widthW = heightW/papelProp;
    }

    else {
        widthW = Math.max(window.innerWidth, resolution);
        heightW = widthW*papelProp;
        pixel = heightW/700;
    }

    let margin = marg*widthW;
    let w1Active = margin;
    let w2Active = widthW - margin;
    let h1Active = margin;
    let h2Active = heightW - margin;

// COLOR PALETTES

const colors = [
    ["Blanc Ivoire",            "#cdd3e3",  "#2c695a",      "#DCD5C9",      "#003c32",      "#B4AEA4",      "#2c695a",      "#DCD5C9"],
    ["Outremer Gris",           "#e2e7dc",  "#7b4800",      "#002185",      "#fcd300",      "#003c32",      "#f6684f",      "#6b9404"],
    ["Gris Clair",              "#ccccc6",  "#877c6a",      "#9c2128",      "#f4bd48",      "#395a8e",      "#7facc6",      "#2c695a"], 
    ["BLeU",                    "#0657a9",  "#c6353c",      "#488b6d",      "#f6684f",      "#cdd3e3",      "#f6684f",      "#4e93cc"],
    ["Le Rubis",                "#6c2b3b",  "#f9c814",      "#c76282",      "#e0b411",      "#9cc99f",      "#445e87",      "#c8491b"],
    ["Bleu Outremer Fonc\xE9",  "#0e2d58",  "#c8c9ca",      "#939598",      "#ffffff",      "#616568",      "#0e1318",      "#080f15"],
    ["Noir d'Ivoire",           "#080f15",  "#C8C1B7",      "#b0b0b0",      "#d7d7d7",      "#8b8b8b",      "#676767",      "#464646"],
];
let paleta = parseInt(weightedRand({
    0: 120,  // Blanc Ivoire
    1: 70,  // Outremer Gris
    2: 100,  // Gris Clair
    3: 200,  // BLeU
    4: 10,  // Le Rubis
    5: 150,  // Bleu Outremer Foce
    6: 150,  // Noir d'Ivoire
}));
let chosenbg = colors[paleta][1];

// escala

let escala = parseInt(weightedRand({
    1: 70,
    2: 20,
    0.6: 10,
}));

// TWEAKED PRIMARY FUNCTION VARIABLES

var vibration = 0;
var quality = 10;
let density;

// OTHER
var baseSize = (5+5*fxrand())*pixel;
let nrWindows;
let nrBuildings;

// SETUP and DRAW
// START

// FX(HASH) FEATURES
window.$fxhashFeatures = {
    "Palette": colors[paleta][0],
    "Proportion": papel[papelS][0],
}

function setup () {
    createCanvas(floor(widthW), floor(heightW));
    angleMode(DEGREES)
    background(colors[paleta][1])
    rectMode(CENTER);



    // BG GRADIENT
    push();
    var fondos = color(200);
    fondos.setAlpha(50);
    patternColors([color(0,0,0,0), fondos]);
    pattern(PTN.noiseGrad(0.3,0.9*pixel,0.3,0));
    translate(widthW/2,heightW/2)
    rotate(90)
    rectPattern(0,0,heightW,widthW);
    pop();

    // LINES
    for (j=0; h1Active + j*baseSize*3.5-baseSize <= 0.95*heightW; j++) { 
        push();
        let colorL = color(colors[paleta][2])
        colorL.setAlpha(90);
        stroke(colorL)
        strokeVibration(1.1);
        pencilQuality(5);
        strokeWeight(0.4*pixel)
        linea(0,2*h1Active+3.5*j*baseSize-baseSize/2,w2Active+0.05*w1Active,2*h1Active+3.5*j*baseSize-baseSize/2);
        linea(0,2*h1Active+3.5*j*baseSize+baseSize/2,w2Active+0.05*w1Active,2*h1Active+3.5*j*baseSize+baseSize/2);
        pop();
    }
    
    // NR WINDOWS & BUILDINGS
    nrBuildings = (rande(35,60)+papel[papelS][2]*15)/escala;
    nrWindows = (25+rande(12,25)+papel[papelS][2]*15)/escala;
}

function draw () {

    // BUILDINGS
    if (frameCount <= nrBuildings) {
        randomRect(rand(-0.1,1.1)*widthW,rand(0.25,1.3)*heightW+papel[papelS][2]*heightW)
    }

    // WINDOWS
    if (frameCount >= nrBuildings*0.5 && frameCount <= nrWindows) {
        push();
        noStroke();
        let numRows = rande(5,15);
        let numCols = rande(5,15);
        let point0 = [rand(-0.1,1.1)*widthW,rand(0.2,0.8)*heightW];
        let windowW = rand(4,8)*pixel;
        var relleno = color(colors[paleta][rande(2,7.5)]);
        relleno.setAlpha(130);
        patternColors([color(0, 0, 0, 0), relleno]);
        pattern(PTN.noiseGrad(rand(0.6,1),1*pixel,rand(0.6,0.7),90));

        for (i=0; i<=numRows; i++) {
            for (j=0;j<=numCols;j++) {
                rectPattern(point0[0]+escala*10*j*pixel,point0[1]+escala*30*i*pixel,escala*windowW,escala*15*pixel)
            }
        }
        pop();
    }
    
    // BORDERS
    if (frameCount >= nrBuildings*0.5+nrWindows-10 && frameCount <= nrBuildings*0.5+nrWindows+10) {
        let border = 285*marg*pixel;
        push();
            rectMode(CORNERS)
            noStroke();
            let fillC = color(colors[paleta][1])
            fillC.setAlpha(18);
            patternColors([color(0, 0, 0, 0), fillC]);
            pattern(PTN.noise(0.8));

            rectPattern(border,0,widthW-border,border)
            rectPattern(widthW-border,0,widthW,heightW)
            rectPattern(0,0,border,heightW)
            rectPattern(border,heightW-border,widthW-border,heightW)
        pop();
    }

    // PREVIEW
    if (frameCount == 150) {
        fxpreview();
    }
}

function randomRect(x,y) {
        push();
        var relleno = color(colors[paleta][rande(2,7.5)]);
        relleno.setAlpha(130);
        patternColors([color(0, 0, 0, 0), relleno]);
        pattern(PTN.noiseGrad(rand(0.3,1),rand(0.7*pixel,1*pixel),rand(0.4,0.7),90));
        translate(x,y)
        rectPattern(0,0,escala*rand(70*pixel,widthW*(0.5-papel[papelS][2])),escala*rand(70*pixel,widthW*0.7));
        pop();
}

// TWEAKED PRIMARY FUNCTIONS

function strokeVibration (a) {
    vibration = a*pixel;
}

function pencilQuality (a) {
    if (a <= 3) {
        quality = 3;
    }
    else {quality = a;}
}

function linea (x1,y1,x2,y2) {
    strokeW = this.drawingContext.lineWidth;
    var difX = x2-x1;
    var difY = y2-y1;
    var difM = Math.max(Math.abs(difX),Math.abs(difY));
    var x;
    var y;
    for (i = 0; i <= difM*2/strokeW; i++) {
        x = map(i,0,difM*2/strokeW,0,difX/pixel) + rand(0,vibration);
        y = map(i,0,difM*2/strokeW,0,difY/pixel) + rand(0,vibration);
        strokeWeight(rand(0.85,1.15)*strokeW)
        if (i <= 0.1 * difM*2/strokeW || i >= 0.9 * difM*2/strokeW) {
            if (rand(0,quality*0.75)>2) {
                point(x1+x,y1+y);
            }
        }
        else if (i <= 0.35 * difM*2/strokeW || i >= 0.65 * difM*2/strokeW) {
            if (rand(0,quality*0.85)>2) {
                point(x1+x,y1+y);
            }
        }
        else {
            if (rand(0,quality)>2) {
                point(x1+x,y1+y);
            }
        }
    }
}

// RAND FUNCTIONS

function rand(e, r) {
    return map(fxrand(), 0, 1, e, r)
}

function rande(e, r) {
    return Math.floor(map(fxrand(), 0, 1, e, r))
}

function weightedRand(e) {
    var r, a, n = [];
    for (r in e)
        for (a = 0; a < 10 * e[r]; a++)
            n.push(r);
    
        return n[Math.floor(fxrand() * n.length)]
}

// INTERACTIVITY

function keyReleased(){
    if (keyCode === 49) {
        // SAVE CANVAS AS PNG (screen size)
        saveCanvas('fx(hAIsh)-' + fxhash, 'png');
    }   
} 