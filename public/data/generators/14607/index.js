// Copyright © 2022 Brian Gawlik
// See LICENSE.txt for license information

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var fxrand = sfc32(...hashes)
myrng = fxrand;

//////////////////////////////////////////////////////////////////////////////////// PALETTE SELECT
let pIndex = chooseFromArray( [ 0,0,0, 1,1,1, 2, 3,3 ] );


//////////////////////////////////////////////////////////////////////////////////// SCENE SELECT
let sceneN = getRandomInt(1,6);




let paletteNames = ["Lush Day", "Autumn Day", "Autumn Night", "Lush Night"]

console.log("Scene",sceneN)
console.log("Palette -", paletteNames[pIndex])
// console.log("fog",fogName)

window.$fxhashFeatures = {
  "Scene": sceneN,
  "Pallette": paletteNames[pIndex],
}







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Global Variables
artboardAR = 1/2;
// artboardW = 2048;
artboardW = 4096;


xCenterOffset = 0;
yCenterOffset = 0;

// Settings
xOrigin = 0.5;
yOrigin = 0.0;
canvasPad = 0.00;

// Initialize the IMAGES array to hold the image bitmaps
IMAGES = [];




window.addEventListener('resize', handleResize);



// window.onload = function () {
window.onload = RUN(artboardW);




async function RUN(resolution) {

    artboardW = resolution;
    artboardH = artboardW * artboardAR;
    artboardWo2 = 1/artboardAR/2

    // canvas
    canvas0 = document.getElementById("canvas0");
    ctx0 = canvas0.getContext("2d");

    auxCanvas01 = document.getElementById("auxCanvas01");
    auxCanvas01.width = artboardW;
    auxCanvas01.height = artboardH;
    ctx_aux01 = auxCanvas01.getContext('2d');

    auxCanvas02 = document.getElementById("auxCanvas02");
    auxCanvas02.width = artboardW;
    auxCanvas02.height = artboardH;
    ctx_aux02 = auxCanvas02.getContext('2d');


    ctxToDrawToNow = ctx_aux01;


    sizeCanvasInitial() ;
    

    drawAll_forThisLevel(1);
    window.requestAnimationFrame(doNothing);
    await new Promise(resolve => setTimeout(resolve, 50)); // got this online - it acts as a wait function 

    drawAll_forThisLevel(2);
    window.requestAnimationFrame(doNothing);
    await new Promise(resolve => setTimeout(resolve, 50)); // got this online - it acts as a wait function 

    drawAll_forThisLevel(3);
    window.requestAnimationFrame(doNothing);
    await new Promise(resolve => setTimeout(resolve, 50)); // got this online - it acts as a wait function 

    fxpreview();

    console.log("DONE");

    
}













