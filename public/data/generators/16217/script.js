

// zach variables:
//------------------------------------------
var useGL = false;
var renderer;
var density;
var aW, aH;


var p = {};
var blockType;
t=0;
var rand;
var size;
var pintaRojo = false;
var fSize = 1000;
var globalAspectRatio = 1.2/1.0;
var pgW,pgH,sW,sH;

// Auxiliary methods for random numbers
// Random number between 0 and B
// function fxrandB(B){
//   return fxrand()*B;
// }
// // Random number between A and B
// function fxrandAB(A,B){
//   return A+(B-A)*fxrand();
// }

function fxrandB(B){
  let result = fxrand()*B;
  result = Math.floor(result * 10000) / 10000;
  return result;
}
// Random number between A and B
function fxrandAB(A,B){
  let result = A+(B-A)*fxrand();
  result = Math.floor(result * 10000) / 10000;
  return result;
}


function fxrandChooseOption(theOptions){
    return theOptions[Math.floor(fxrandB(theOptions.length))]
  }

var isZach = fxrandB(100) < 50;    // todo: -- based on random!
if (isZach){
  useGL = true;
}

function preload() {
  if (useGL){
    if (minimizedShader() == true) {
      ;
    } else{
      theShader = loadShader('shader/basic.vert', 'shader/basic.frag');
    }
  }
}


function setup(){

  console.log(fxhash);
  sH = (windowWidth < windowHeight*globalAspectRatio) ? windowWidth/globalAspectRatio:windowHeight;
  sW = sH*globalAspectRatio;

  if (!useGL){
    // iskra!
    pixelDensity(3)
    createCanvas(sW,sH);
    pgW = 1000;
    pgH = pgW/globalAspectRatio;
    pg = createGraphics(pgW, pgH);
    pg.pixelDensity(3);
    noLoop();
    fxRandReset();
    setupArt();
    art();
    calculateFeatures();
  } else {

      setAttributes('premultipliedAlpha', true);
      density = 2;
      pixelDensity(density);
      renderer = createCanvas(Math.round(sW), Math.round(sH), WEBGL);
      const gl = renderer.GL;
      aW = gl.drawingBufferWidth;
      aH = gl.drawingBufferHeight;

      createPalette();

      if (minimizedShader() == true) {
          loadShaderFromMinized(renderer);
      } else {
          parseFrag(theShader._fragSrc);
      }
      setAttributes('alpha', false);
      noLoop();

      // needed for padding:   (todo: check this)
      var p5Canvas = document.getElementById("defaultCanvas0");
      var w = document.getElementById("defaultCanvas0").offsetWidth;
      var h = document.getElementById("defaultCanvas0").offsetHeight;
      p5Canvas.style.height = h-50 + 'px';
      p5Canvas.style.width = w-50 + 'px';

      placeFeatures();
      calculateFeatures();
  }

};

function draw(){


  if (useGL){

        shader(theShader);
        theShader.setUniform(goodname('res'), [sW, sH]);
        theShader.setUniform(goodname('resTarget'), [1000 * (sW / sH), 1000]);
        theShader.setUniform(goodname('actualSize'), [aW, aH]);
        theShader.setUniform(goodname('colorTex'), img);
        passSettings(theShader);
        background(220);
        noStroke();
        rect(-sW/2.0, -sH/2.0,sW, sH);
        resetShader();
    } else {
      // background(255,0,0)
      var p5Canvas = document.getElementById("defaultCanvas0");
      var w = document.getElementById("defaultCanvas0").offsetWidth;
      var h = document.getElementById("defaultCanvas0").offsetHeight;
      p5Canvas.style.height = h-50 + 'px';
      p5Canvas.style.width = w-50 + 'px';
      image(pg,0,0, sW, sH);

    }

    // This call triggers the preview generation
    // by fxhash to create the thumbnails etc.
    // It has to be called when the work has finished painting.
    fxpreview();


    console.log(window.$fxhashFeatures);


}; //fin draw



// To calculate features,
// the easiest is that we populate the
// "blockType", "by" and "variations" variables
// in our code, then we call this function at the
// end of our setup.
function calculateFeatures(){
    window.$fxhashFeatures = {
      "Modes": blockType,
      "By": by,
      "Variations": variations,
    }
  }



function keyPressed(){

//  t (zach for testing)
  // if (keyCode === 84) {
  //   randomize();
  //   draw();
  // }

  // s (zach for saving)
  if (keyCode === 83){
      save("output_pd" + pixelDensity()+"_"+ fxhash + ".png");
  }

  // iskra
  if (keyCode === 72) {
    // h to set high res to pixeldensity 6
    changeRes(6,true);
  }else if (keyCode === 76) {
    // l to lower pixel density by 1
    changeRes(-1,false);
  }else if (keyCode === 77) {
    // to increase pixel density by 1
    changeRes(1,false);
  }
}

// resets the random number generator
function fxRandReset(){
    fxhashTrunc = fxhash.slice(2)
  regex = new RegExp(".{" + ((fxhashTrunc.length/4)|0) + "}", 'g')
  hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
  sfc32 = (a, b, c, d) => {
    return () => {
      a |= 0; b |= 0; c |= 0; d |= 0
      var t = (a + b | 0) + d | 0
      d = d + 1 | 0
      a = b ^ b >>> 9
      b = c + (c << 3) | 0
      c = c << 21 | c >>> 11
      c = c + t | 0
      return (t >>> 0) / 4294967296
    }
  }
  fxrand = sfc32(...hashes)
}

function changeResWebgl(val){


  const gl = renderer.GL;
  var test = displayDensity();    // either get density or use what we set
  density = val;
  pixelDensity(density);
  renderer.resize(width, height);
  aW = gl.drawingBufferWidth;
  aH = gl.drawingBufferHeight;
  shader(theShader);
  theShader.setUniform(goodname('res'), [width, height]);
  theShader.setUniform(goodname('density'), density);
  theShader.setUniform(goodname('colorTex'), img);
  theShader.setUniform(goodname('actualSize'), [aW, aH]);
  passSettings(theShader);
  background(220);
  noStroke();
  rect(-width/2.0, -height/2.0,width, height);
  resetShader();
  var p5Canvas = document.getElementById("defaultCanvas0");
  console.log(document.getElementById("defaultCanvas0").offsetWidth);
  var w = document.getElementById("defaultCanvas0").offsetWidth;
  var h = document.getElementById("defaultCanvas0").offsetHeight;
  p5Canvas.style.height = h-50 + 'px';
  p5Canvas.style.width = w-50 + 'px';


}

// changes the pixelDensity to achieve higher or lower resolutions
function changeRes(pdvalue,absolute=true){
    let thePixelDensity = pixelDensity();
    if (absolute) {
      thePixelDensity = pdvalue;
    } else {
      thePixelDensity += pdvalue;
      thePixelDensity = max(thePixelDensity, 1.); // don't go to zero
    }


    if (useGL){
      changeResWebgl(thePixelDensity);
    } else {
      pg.clear();
      pg = createGraphics(pgW,pgH);

      pg.pixelDensity(thePixelDensity);
      pixelDensity(thePixelDensity);
      // resets the random number generator to re-generate the drawing
      // with the new pixel density.
      fxRandReset();
      setupArt();
      art();
      redraw();
    }

}



function windowResized(){

    sH = (windowWidth < windowHeight*globalAspectRatio) ? windowWidth/globalAspectRatio:windowHeight;
    sW = sH*globalAspectRatio;

    if (useGL){

      var p5Canvas = document.getElementById("defaultCanvas0");
      console.log(document.getElementById("defaultCanvas0").offsetWidth);
      var w = document.getElementById("defaultCanvas0").offsetWidth;
      var h = document.getElementById("defaultCanvas0").offsetHeight;
      p5Canvas.style.height = sH-50 + 'px';
      p5Canvas.style.width = sW-50 + 'px';

    } else {
      resizeCanvas(sW-50,sH-50);
    }
  }
