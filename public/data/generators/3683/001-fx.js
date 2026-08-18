/*

//▓▓▓▓▓▓▓//▓▓/////▓▓/▓▓▓▓▓▓▓▓/▓▓▓▓▓▓▓▓//▓▓////////▓▓▓▓▓▓▓/////▓▓▓////▓▓▓▓▓▓▓▓//▓▓▓▓▓▓▓▓/▓▓▓▓▓▓▓▓/
/▓▓/////▓▓/▓▓/////▓▓/▓▓///////▓▓/////▓▓/▓▓///////▓▓/////▓▓///▓▓/▓▓///▓▓/////▓▓/▓▓///////▓▓/////▓▓
/▓▓/////▓▓/▓▓/////▓▓/▓▓///////▓▓/////▓▓/▓▓///////▓▓/////▓▓//▓▓///▓▓//▓▓/////▓▓/▓▓///////▓▓/////▓▓
/▓▓/////▓▓/▓▓/////▓▓/▓▓▓▓▓▓///▓▓▓▓▓▓▓▓//▓▓///////▓▓/////▓▓/▓▓/////▓▓/▓▓/////▓▓/▓▓▓▓▓▓///▓▓/////▓▓
/▓▓/////▓▓//▓▓///▓▓//▓▓///////▓▓///▓▓///▓▓///////▓▓/////▓▓/▓▓▓▓▓▓▓▓▓/▓▓/////▓▓/▓▓///////▓▓/////▓▓
/▓▓/////▓▓///▓▓/▓▓///▓▓///////▓▓////▓▓//▓▓///////▓▓/////▓▓/▓▓/////▓▓/▓▓/////▓▓/▓▓///////▓▓/////▓▓
//▓▓▓▓▓▓▓/////▓▓▓////▓▓▓▓▓▓▓▓/▓▓/////▓▓/▓▓▓▓▓▓▓▓//▓▓▓▓▓▓▓//▓▓/////▓▓/▓▓▓▓▓▓▓▓//▓▓▓▓▓▓▓▓/▓▓▓▓▓▓▓▓/

/////////BY P1XELFOOL

*/


//TIMECOUNT
let t = 0.0;

//IMAGE
let pg, pg2;

///CELL SIZE
let cellSize = 0.0;   
let cellArray = [5, 10, 20, 40];

//COLOR
let bgArray = [0, 150];
let bgColor = 0.0;
let colorsArray = [[0, 40], [0, 120],[80,180],[80,240],[0, 240],[120, 240],[160, 180],[240, 280], [320,360]];
let colorsArrayStripe = [[0, 20],[80, 120],[120, 240],[160, 180],[320,360]];
let colorsArraySolid = [0, 80, 120, 240, 300];
let color1, color2, color3, color4, colorSolid = 0.0;
let colorPalette, colorPaletteStripe, colorPaletteSolid;

//FREQUENCY
let freqShowX, freqShowY = 0.0;
let showTime = 0.0;

///CROSS SIZE
let crossSize = 2.0;

//////////////TRAITS
let overloaded = 0.0;
let layer0 = 0.0;
let gradient = 0.0;
let flashing = 0.0;
let striped = 0.0;

/////////SETUP

function setup() {
    createCanvas(windowWidth > windowHeight ? windowHeight : windowWidth, windowHeight < windowWidth ? windowHeight : windowWidth);
    pg = createGraphics(400, 400);
    pg2 = createGraphics(1600, 1600);
    pg.pixelDensity(1);
    pg2.pixelDensity(1);
    frameRate(30);

    ///CRISP
    canvas.imageSmoothingEnabled = false;
    pg.noSmooth();
    pg2.noSmooth();
    noSmooth();

    //stroke weight
    pg.strokeWeight(2);  
    pg2.strokeWeight(1);  

    //CELL SIZE
    cellSize = cellArray[floor(map(fxrand(), 0, 1, 0, cellArray.length))];

    //COLOR PALETTES
    colorPalette = floor(map(fxrand(), 0, 1, 0, colorsArray.length));
    colorPaletteStripe = floor(map(fxrand(), 0, 1, 0, colorsArrayStripe.length));
    colorPaletteSolid = floor(map(fxrand(), 0, 1, 0, colorsArraySolid.length));

    //COLORS
    color1 = colorsArray[colorPalette][0];
    color2 = colorsArray[colorPalette][1];
    color3 = colorsArrayStripe[colorPaletteStripe][0];
    color4 = colorsArrayStripe[colorPaletteStripe][1];
    colorSolid = colorsArraySolid[colorPaletteSolid];

    //BG COLOR
    bgColor = bgArray[floor(map(fxrand(), 0, 1, 0, bgArray.length))];


    //FREQUENCY ARRAY
    let freqShow = [
        [0, 1],
        [0.5, 0.5], 
        [0.5, 2], 
        [0.5, 10], 
        [0.5, 20], 
        [1, 10], 
        [1, 0.05], 
        [3, 3], 
        [3, 20],
        [5, 0.5], 
        [10, 0.5],
        [20, 0],
        [20, 0.5],
        [20, 20],
        [30, 2]
    ];

    let freq = floor(map(fxrand(), 0, 1, 0, freqShow.length));
    freqShowX = freqShow[freq][0];
    freqShowY = freqShow[freq][1];


    //Time multiplier for showing cells
    if(density() == 2){
        showTime = floor(map(fxrand(), 0, 1, 1, 3));
    } else {
        showTime = floor(map(fxrand(), 0, 1, 2, 4));
    }

    
    //Number of Cells
    console.log("Background: " + isBG());
    
    //Number of Cells
    console.log("Grid: " + grid());

    //Freq
    console.log("Frequency: " + frequency());

    //is gradient?
    gradient = fxrand();
    console.log("Gradient: " + isGradient());

    //is it flashing
    flashing = fxrand();
    console.log("Flashing: " + isFlashing());

    //is it striped?
    striped = fxrand();
    console.log("Striped: " + isStriped());


    //Fill Layer
    layer0 = fxrand();
    console.log("Layer0: " + isLayer0());    

    //Palette
    console.log("Palette: " + colPalette());

    //Overload
    overloaded = fxrand();
    console.log("Overloaded: " + isOverloaded());


    window.$fxhashFeatures = {
        "Background": isBG(),
        "Grid": grid(),
        "Frequency": frequency(),
        "Gradient": isGradient(),
        "Flashing": isFlashing(),
        "Striped": isStriped(),
        "Layer0": isLayer0(),
        "Palette": colPalette(),
        "Overloaded": isOverloaded()
    }


    ///CROSS FILL CHANGE
    if(density() == 2){
        pg2.stroke(80);
    } else {
        pg2.stroke(80, 150);
    }


    //////////////////DEFINE PG2
    pg2.clear();
    pg2.noFill();

    for (let x=80.0; x<pg2.width-79; x+=cellSize*4) {
        for (let y=80.0; y<pg2.height-79; y+=cellSize*4) {
            pg2.line(x-crossSize,y,x+crossSize,y);
            pg2.line(x,y-crossSize,x,y+crossSize);

        }
    }


}

///////FEATURES CHECK
function isBG() {
    if (bgColor == 0) return "Black"
    else return "Grey"
}

function isGradient() {
    if (gradient>0.5) return "Yes"
    else return "No"
}

function isFlashing() {
    if (flashing>0.5 && isGradient() == "No") return "Yes"
    else return "No"
}

function isStriped() {
    if (striped>0.5 && isGradient() == "No" && color3 != color4) return "Yes"
    else return "No"
}

function isLayer0() {
    if (layer0>0.5) return "Yes"
    else return "No"
}

function grid() {
    return 360 / cellSize + "x" + 360 / cellSize;
}

function frequency() {
    return freqShowX + "x" + freqShowY;
}

function isOverloaded() {
    if (overloaded<0.4) {
        if(cellSize == 40 && isFlashing() == "No"){
            return "No";
        }else if(isStriped() == "Yes" && isFlashing() == "No"){
            return "No";
        }else{
            return "Yes";
        }
    } else {
        return "No";
    }
}

function colPalette() {
    let finalPalette = "";
    
    //GRADIENT
    if(isGradient() == "Yes"){
        if(colorPalette == 0){
            finalPalette = "0x40";
        }
        else if(colorPalette == 1){
            finalPalette = "0x120";
        }
        else if(colorPalette == 2){
            finalPalette = "80x180";
        }
        else if(colorPalette == 3){
            finalPalette = "80x240";
        }
        else if(colorPalette == 4){
            finalPalette = "0x240";
        }
        else if(colorPalette == 5){
            finalPalette = "120x240";
        }
        else if(colorPalette == 6){
            finalPalette = "160x180";
        }
        else if(colorPalette == 7){
            finalPalette = "240x280";
        }else{
            finalPalette = "320x360";
        }
    }

    //STRIPED
    else if(isStriped() == "Yes"){
        ////DUAL
        //[0, 20],[80, 120],[120, 240],[160, 180],[320,360]
        if(colorPaletteStripe == 0){
            finalPalette = "0x20";
        }
        else if(colorPaletteStripe == 1){
            finalPalette = "80x120";
        }
        else if(colorPaletteStripe == 2){
            finalPalette = "120x240";
        }
        else if(colorPaletteStripe == 3){
            finalPalette = "160x180";
        }else{
            finalPalette = "320x360";
        }
    }

    //SOLID
    else{
        //[0, 80, 120, 240, 300];
        if(colorPaletteSolid == 0){
            finalPalette = "000000";
        }
        else if(colorPaletteSolid == 1){
            finalPalette = "80";
        }
        else if(colorPaletteSolid == 2){
            finalPalette = "120";
        }
        else if(colorPaletteSolid == 3){
            finalPalette = "240";
        } else{
            finalPalette = "300";
        }

    }

    if(isLayer0() == "Yes"){
        return finalPalette + "x" + color3;
    } else {
        return finalPalette;
    }

}



//////////DRAW
function draw() {
    background(color(bgColor));
    //TIMER
    t = t + 1;
    //COLOR MODE
    pg.colorMode(HSB, 360, 255, 255, 255);

    //BG
    if (isOverloaded() == "Yes"){
        if(frameCount%100 == 0){
            pg.background(bgColor);
        }
    }else{
        pg.background(bgColor);
    }

    //NO STROKE
    pg.noStroke();

    //DRAW GRID
    for (let x=20.0; x<pg.width-20; x+=cellSize) {
        for (let y=20.0; y<pg.height-20; y+=cellSize) {

            //RAINBOW CHANCE
            let c = map(sin(radians(x/16 + t)), -1, 1, 0, 255);

            for(let xx=x; xx<x+cellSize; xx+=(cellSize/density())){
                for(let yy=y; yy<y+cellSize; yy+=(cellSize/density())){

                    let c = map(sin(radians(x*0.5 + y*0.5 + yy*1 + t*showTime*3)), -1, 1, color1, color2);
                    let c2 = map(sin(radians(100 + x*2 + y*0.5 + yy*1 + t*showTime*3)), -1, 1, color1, color2);

                    let showMult = map(sin(radians(xx*freqShowX + yy + t*showTime)), -1, 1, 0, 1);
                    let show = map(sin(radians(x*freqShowX/2*density() + y*freqShowY*2 + t*showTime)), -1, 1, 0, 360);
                    let glitch = map(sin(radians(x*freqShowX*10/2*density() + y*freqShowY + t*showTime*2))*showMult, -1, 1, 0, 1);
                    let glitchFlash = map(sin(radians(x*freqShowX + y*freqShowY + t*showTime*2))*showMult, -1, 1, 0, 1);
                    let showL0 = map(sin(radians(25 + x*freqShowX/2*density() + y*freqShowY*2 + t*showTime*1.5))*showMult, -1, 1, 0, 1);
                    let ranGlitch = fxrand();

                    function flashy(col){
                        if(isFlashing() == "Yes" && glitchFlash < 0.3){
                            if(frameCount%2==0){
                                pg.fill(col,255,255);
                            }else{
                                pg.fill(col,255,180);
                            }
                        } else {
                            pg.fill(col,255,255);
                        }
                    }

                    //if rainbow else divided colors
                    if(isGradient() == "Yes"){
                        if(glitch>150){
                            pg.fill(c,255,255);
                        }else{
                            pg.fill(c2,255,255);
                        }

                    }else if(isStriped() == "No"){
                        flashy(colorSolid);
                    }else{
                        if(density() == 2){ // IF CELLS > 10
                            //if movement is horizontal
                            if(freqShowX>freqShowY){
                                if(xx%(cellSize)==0){
                                    pg.fill(color3,255,255);
                                } else{
                                    flashy(color4);
                                }
                            }else{ //if movement is vertical
                                if(yy%(cellSize)==0){
                                    pg.fill(color3,255,255);
                                } else{
                                    flashy(color4);
                                }
                            }
                        } else { // IF CELLS < 10
                            //if movement is horizontal
                            if(freqShowX>freqShowY){
                                if(x%(cellSize*2)==0){
                                    pg.fill(color3,255,255);
                                } else{
                                    flashy(color4);
                                }
                            }else{ //if movement is vertical
                                if(y%(cellSize*2)==0){
                                    pg.fill(color3,255,255);
                                } else{
                                    flashy(color4);
                                }
                            }
                        }
                    }

                    //CHANGE SHOW THRESHOLD based on cellSize
                    let showThresh, glitchThresh = 0.0;
                    if(cellSize == 10){
                        showThresh = 210; 
                        glitchThresh = 0.7} 
                    else if(cellSize == 40){
                        showThresh = 200; 
                        glitchThresh = 0.7} 
                    else if(cellSize == 5){ // 5
                        showThresh = 240; 
                        glitchThresh = 0.4} 
                    else {showThresh = 200;  
                          glitchThresh = 0.97;}

                    ///DRAW PIXELS
                    if(show>showThresh){
                        if(glitch>glitchThresh || ranGlitch > 0.995){
                            pg.rect(xx-cellSize, yy, cellSize/density(), cellSize/density());
                        }else{
                            pg.rect(xx, yy, cellSize/density(), cellSize/density());
                        }
                        //DRAW LAYER0    
                    } else {
                        if(showL0<0.5 && isLayer0() == "Yes"){
                            pg.fill(color3,255,255);
                            pg.rect(xx, yy, cellSize/density(), cellSize/density());
                        }
                    }
                }
            }
        }
    }

    //DRAW IMAGES
    image(pg, 0, 0, windowWidth > windowHeight ? windowHeight : windowWidth, windowHeight < windowWidth ? windowHeight : windowWidth);
    image(pg2, 0, 0, windowWidth > windowHeight ? windowHeight : windowWidth, windowHeight < windowWidth ? windowHeight : windowWidth);
}


//DEFINE DENSITY
function density(){
    if(cellSize < 11){
        return 1;
    } else {
        return 2;
    }
}


function windowResized() {
    resizeCanvas(windowWidth > windowHeight ? windowHeight : windowWidth, windowHeight < windowWidth ? windowHeight : windowWidth);
}