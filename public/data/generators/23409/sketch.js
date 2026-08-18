w= 2000
h = 2500
marg = 0
willReadFrequently = true
let shade;
function preload() {
  shade = loadShader("shader.vert", "shader.frag");
}
url = new URL(window.location.href)
urlParams = new URLSearchParams(url.search)
if(url.searchParams.has('size') == true) {
  pxSize = url.searchParams.get('size')
} else {
  url.searchParams.append('size', 1);
}
pxSize = url.searchParams.get('size')



//declarations
lastUpdate = Date.now()
dt = 0
textured = true
zoomed = false
root.style.setProperty("--type", "contain");
words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

//parameters
maxDis = 18
brushSize = maxDis*7
startAng = randomVal(0, 360)
numStrokes = 100000
strokesLeft = numStrokes
perFrame = 50
startFrame = 10000000000000000000
triggeredStop = false

lumNS = 0.0005
shadeStrokeDens = randomVal(2, 6)
contrast = 1
mountNS = randomVal(0.001, 0.05)
paintMarg = 0   

etchCrazy = randomInt(1, 100)
if (etchCrazy < 10) {
  etchingOverdrive = true
  numDrawings = 500
} else {
  etchingOverdrive = false
  numDrawings = randomInt(50, 150)
}
detailAlph = randomVal(0.2, 0.25)
numScratches = randomInt(20, 40)
numPatches = randomInt(1, 4)
numDrips = 40

compMode = randomInt(1, 4)
if(compMode == 1) {
  compName = 'Mountain Subsection'
} else if(compMode == 2) {
  compName = 'Form'
} else if(compMode == 3) {
  compName = 'Hinge'
} else if(compMode == 4) {
  compName = 'Patchwork'
} 

//pick horizon for split background
horizon = randomVal(h*0.2, h*0.8)
//pick vert horizon
hrzn = map_range(horizon, 0, h, 0, w)
fullness = 0.5
minIrreg = 0.25
strokeNS = 0.1

//for our shader
startRot = randomVal(0, 6.28319)
seed = randomVal(0, 10)

window.$fxhashFeatures = {
  "Palette": palName,
  "Composition": compName,
  "# Etchings": numDrawings,
  "Etching Overdrive": etchingOverdrive,
  "# Patches": numPatches*2,

}

function setup() {
  var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oraßn|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|verßi|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
}
// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

  createCanvas(w, h, WEBGL);
  // if(isFxpreview == true || isMobile == true || isSafari == true) {
  //   pixelDensity(1)
  // } else {
  //   pixelDensity()
  // }
  if(pxSize == 1) {
    pixelDensity(1)
  } else if (pxSize == 2) {
    pixelDensity(2)
  } else if (pxSize == 3) {
    pixelDensity(3)
  }
  p = createGraphics(w, h)
  s = createGraphics(w, h)
  c = createGraphics(w, h)
  c2 = createGraphics(w, h)
  g = createGraphics(w, h)
  angleMode(DEGREES)
  p.angleMode(DEGREES)
  s.angleMode(DEGREES)
  c.angleMode(DEGREES)
  c2.angleMode(DEGREES)
  g.angleMode(DEGREES)
  frameRate(60)
}

nSeed = randomInt(1, 100000000000)

function draw() {
  noiseSeed(nSeed)
  randomSeed(nSeed)
  if(frameCount == 1) {
    //Background setup
    s.background('white')
    background(bgc)
    p.background((255/truePal.length)*1)
    c.background(hilo[0])
    c2.background(hilo[0])

    //Define margin
    s.fill('black')
    s.noStroke()
    s.rectMode(CENTER)
    s.ellipseMode(CENTER)
    s.rect(w/2, h/2, w-(marg*2), h-(marg*2))
  


    //Sketch
    //Build the palette reference for the shader
    gradLUT()

    //Tell the algo which composition to draw and then draw it
    if(compMode == 1) {
      mountains()
    } else if(compMode == 2) {
      bgDir = randomInt(1, 2)
      if(bgDir == 1) {
        lgRg()
      } else if(bgDir == 2) {
        fgBg()
      } else {
        mountains()
      }
      boxes()
    } else if( compMode == 3) {
      bgDir = randomInt(1, 2)
      if(bgDir == 2) {
        fgBg()
        subject()
      } else {
        lgRg()
        subjectH()
      }
      
    } else if( compMode == 4) {
      bgDir = randomInt(1, 2)
      if(bgDir == 2) {
        fgBg()
      } else {
        lgRg()
      }
      patchwork()
    }

    //50% chance of sun in mountain composition
    if(randomInt(0, 1) == 1 && compMode == 1) {
      c.fill(hilo[0])
      c.circle(w/2, h*fxrand(), randomVal(300, 800))
    }
    

    
    //Draw the obstruction
    if(compMode == 1) {
      numObstructs = randomVal(10, 15)
    } else if(compMode == 4) {
      numObstructs = randomVal(2, 10)
    } else {
      numObstructs = randomVal(0, 2)
    }
    for(let i = 0; i < numObstructs; i++) {
      randObstruction()
    }
    

    //blobs around the canvas that alter hue just in that spot
    for(let i = 0; i < numDrips; i++) {
      hueSpot()
    }

    //Store the stroke locations in an array for faster animation
    // for(let i = 0; i < numStrokes; i++) {
    //   here = createVector(randomVal(paintMarg, w-paintMarg), randomVal(paintMarg, h-paintMarg))
    //   strokeCoords[i] = here
    // }
    num = 0
    //First layer of the border (gets painted over partially)
    border(w-30, w, h-30, h)
    
  }

  //Full send on the animation
  if(num < numStrokes) {
    tick()
    if (dt > 60) {
      perFrame -= dt;
    } else {
      perFrame += 3;
    }
    perFrame = constrain(perFrame, 1, Infinity);
    for(let i = 0; i < perFrame; i++) {
      // blendStrokeV2(strokeCoords[num].x, strokeCoords[num].y)
      blendStrokeV2(randomVal(0, w), randomVal(0, h))
      num++
      if(num == numStrokes) {
        return
      }
    }
  }

  if(num >= numStrokes && triggeredStop == false) {
    startFrame = frameCount
    triggeredStop = true
  }

  //Final details and texture elements
  if(frameCount == startFrame) {
    
    //Scotch tape filter
    for(let i = 0; i < numPatches; i++) {
      wid = randomVal(50, 500)
      hei = randomVal(50, 500)
      swatchSwitch(randomVal(0, w-wid), randomVal(0, h-hei), wid, hei)
      swatchSwitch(randomVal(0, w-wid), randomVal(0, h-hei), wid*0.2, hei*0.2)
    }
    //Scratches in the paint
    for(let i = 0; i < numScratches; i++) {
      scratch(randomVal(0, w), randomVal(0, h), randomVal(0.0025, 0.05))
    }
    //Specks for texture
    lumSpecks()
  }

  if(frameCount > startFrame && frameCount < startFrame+numDrawings) {
    //pick a drawing and draw it
    nDrawing = randomInt(1, 19)
    if(nDrawing == 1) {
      spiral(randomVal(0, w), randomVal(0, h), randomVal(50, 300))
    } else if(nDrawing == 2) {
      scratchFlower(randomVal(0, w), randomVal(0, h), randomVal(50, 300))
    } else if(nDrawing == 3) {
      scratchSun(randomVal(0, w), randomVal(0, h), randomVal(25, 80))
    } else if(nDrawing == 4) {
      etchQuad(randomVal(0, w), randomVal(0, h), randomVal(50, 300), randomVal(50, 300))
    } else if(nDrawing == 5) {
      crudeWindow(randomVal(200, w-200), randomVal(200, h-200), randomVal(20, 100), randomVal(20, 100))
    } else if(nDrawing == 6) {
      crudeX(randomVal(0, w),  randomVal(0, h), randomVal(15, 60))
    } else if(nDrawing == 7) {
      crudeArrow(randomVal(0, w),  randomVal(0, h), randomVal(30, 200))
    } else if(nDrawing == 8) {
      coffeeRing()    
    } else if(nDrawing == 9) {
      grass(randomVal(0, w), randomVal(0, h), randomVal(30, 70))
    } else if(nDrawing == 10) {
      orbit(randomVal(0, w),  randomVal(0, h), randomVal(30, 150))
    } else if(nDrawing == 11) {
      flock(randomVal(0, w),  randomVal(0, h), randomVal(30, 150))
    } else if(nDrawing == 12) {
      etchGrid(randomVal(0, w),  randomVal(0, h), randomVal(50, 150), randomVal(50, 150))
    } else if(nDrawing == 13) {
      tree(randomVal(0, w),  randomVal(0, h), randomVal(50, 200))
    } else if(nDrawing == 14) {
      tally(randomVal(0, w),  randomVal(0, h), randomVal(50, 100), randomVal(50, 100))
    } else if(nDrawing == 15) {
      face(randomVal(0, w),  randomVal(0, h), randomVal(40, 70))
    } else if(nDrawing == 16) {
      spiralLine()
    } else if(nDrawing == 17) {
      stampText(randomVal(0, w), randomVal(0, h), randomVal(15, 100))
    } else if(nDrawing == 18) {
      etchTri(randomVal(0, w), randomVal(0, h), randomVal(50, 300), randomVal(50, 300))
    } else if(nDrawing == 19) {
      burst(randomVal(0, w), randomVal(0, h), randomVal(50, 300))
    }
  }

  if(frameCount == startFrame+numDrawings) {
    //Draw the second layer of border on top of the paint (slightly smaller)
    border(w-10, w, h-10, h)
  }

  //Post processing
   bgc = color(bgc)
   shader(shade)
   shade.setUniform("u_resolution", [w, h]);
   shade.setUniform("p", p);
   shade.setUniform("rotStart", startRot)
   shade.setUniform("textured", textured)
   shade.setUniform("g", g);
   shade.setUniform("seed", seed);
   shade.setUniform("bgc", [
     bgc.levels[0] / 255,
     bgc.levels[1] / 255,
     bgc.levels[2] / 255,
   ]);

   rect(0, 0, w, h)
   if(frameCount == startFrame + numDrawings + 1) {
     fxpreview()
   }
}
