function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(fxrand() * (max - min + 1) + min); // The maximum is exclusive and the minimum is inclusive
}
function randomVal(min, max) {
  return fxrand() * (max - min) + min;
}
function map_range(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

function shuff(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(fxrand() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
function tick() {
  now = Date.now()
  dt = now - lastUpdate
  lastUpdate = now 


}

function mouseClicked() {
  if (zoomed == false) {
    zoomed = true
    thisFrame = frameCount
    root.style.setProperty("--type", 'contain');
    root.style.setProperty("--zoom", '1000%');
  } else if(zoomed == true){
    zoomed = false
    root.style.setProperty("--type", 'contain');
    root.style.setProperty("--zoom", '100%');
  }
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function plusOrMin(x) {
  n = fxrand()
  if(n < 0.5) {
    posNeg = 1
  } else {
    posNeg = -1
  }

  return x*posNeg
}

function keyTyped() {
  if (key === "s" || key === "S") {
    save('Trust.png')
  }
  if (key === "t" || key === "T") {
    if(textured == true) {
      textured = false
      shade.setUniform("textured", textured)
    } else if( textured == false) {
      textured = true
      shade.setUniform("textured", textured)
    }

  }
  if (key === "1") {
    window.history.replaceState('', '', updateURLParameter(window.location.href, "size", "1"));
    window.location.reload();
  }
  if (key === "2") {
    window.history.replaceState('', '', updateURLParameter(window.location.href, "size", "2"));
    window.location.reload();
  }
  if (key === "3") {
    window.history.replaceState('', '', updateURLParameter(window.location.href, "size", "3"));
    window.location.reload();
  }
}

function updateURLParameter(url, param, paramVal)
{
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) 
    {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];
        if(TheAnchor)
            additionalURL = TheParams;

        tempArray = additionalURL.split("&");

        for (var i=0; i<tempArray.length; i++)
        {
            if(tempArray[i].split('=')[0] != param)
            {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }        
    }
    else
    {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor  = tmpAnchor[1];

        if(TheParams)
            baseURL = TheParams;
    }

    if(TheAnchor)
        paramVal += "#" + TheAnchor;

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function randColor() {
  return chroma(truePal[randomInt(0, truePal.length-1)]).saturate(0).hex()
}

function angBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

function midpoint(x1, y1, x2, y2) {
  x = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2];
  return x
}

function ptFromAng(x, y, ang, dis) {
  xC = cos(ang)*dis
  yC = sin(ang)*dis

  return createVector((x+xC), (y+yC))
}

////////////////////////////////////////

//Main stroke filter
function blendStrokeV2(xA, yA) {
  //get color from our c layer (our base composition)
  samp = createVector(xA, yA)
  col = color(c.get(samp.x, samp.y))

  //determine distance for this stroke
  timeMod = map(pow(num, 0.25), 0, pow(numStrokes, 0.25), 5, 1)
  dis = maxDis*randomVal(0.15, 2)*timeMod
  //determine angle of this stroke
  ang = 180//map(col.levels[0], 0, 255, 0, 360)+randomVal(-5, 5)-90//randomVal(0, 360)
  //package angle as variable to pass to geometry
  passAng = map(col.levels[0], 0, 255, 0, 180)+randomVal(-5, 5)+startAng
  //determine coords for the stroke ends
  here = ptFromAng(xA, yA, ang/2, dis)
  there = ptFromAng(xA, yA, 180+ang/2, dis)
  //determine alpha for this stroke
  alph = randomVal(0.5, 0.75)

  //sample colors from each end to mix
  sampColA = color(c.get(constrain(here.x, 0, w), constrain(here.y, 0, h)))
  sampColB = color(c.get(constrain(there.x, 0, w), constrain(there.y, 0, h)))
  //convert from rgba to rgb so chroma.js can decipher them
  colA = chroma(sampColA.levels[0], sampColA.levels[1], sampColA.levels[2]).hex()
  colB = chroma(sampColB.levels[0], sampColB.levels[1], sampColB.levels[2]).hex()

  //use our noise map to slightly change luminance/hue of each stroke
  lum = noise(samp.x*lumNS, samp.y*lumNS)
  if(lum < 0.5) {
    dark = map(lum, 0.5, 0, 0, contrast)
    light = 0
  } else {
    dark = 0
    light = map(lum, 0.5, 1, 0, contrast)
  }
  //mix fill and stroke versions to build texture
  //fill fills the page and stroke gives texture
  nStroke = fxrand()
  if(nStroke < fullness) {
    p.strokeCap(SQUARE)
    p.noFill()
    p.stroke(chroma.mix(colA, colB, 0.5).alpha(alph).darken(dark).brighten(light).hex())
  } else {
    //p.noStroke()
    p.stroke(chroma.mix(colA, colB, 0.4).alpha(alph*3).darken(dark).brighten(light).hex())
    p.fill(chroma.mix(colA, colB, 0.5).alpha(alph).darken(dark*randomVal(0.9, 1.1)).brighten(light*randomVal(0.9, 1.1)).hex())
  }

  //send our package to strokeLine()
  p.strokeWeight(randomVal(0, 1))
  strokeLine(here.x, here.y, there.x, there.y, randomVal(1, (brushSize*timeMod)*fxrand()), passAng)
}

//Gradient to feed the shader
//y = hue
function gradLUT() {
scl = 200
  for(let y = 0; y < h; y+=w/scl) {
    
      
      nY = map(y, 0, h, 0, 1)
      colScale = chroma.scale(truePal.slice(0, numColors))//.classes(numColors*tiers)
      hueCol = colScale(nY).hex()
      col = hueCol
      g.stroke(col)
      g.strokeWeight(h/scl)
      g.line(0, y, w,y)
    

  }
}

//Scotch tape texture
function swatchSwitch(x, y, wid, hei) {
  p.rectMode(CORNER)
  p.noStroke()
  swatchVal = randomVal(0, 255)
  p.fill(chroma(swatchVal).alpha(0.07).hex())
  p.strokeWeight(0.5)
  p.stroke(chroma(swatchVal).alpha(0.1).hex())
  p.push()
  p.translate(x+(wid/2), y+(hei/2))
  p.rotate(randomVal(-5, 5))
  p.translate(-(x+(wid/2)), -(y+(hei/2)))
  p.rect(x, y, wid, hei)
  p.pop()
}

//The actual geometry for the stroke
function blob(x, y, wid, hei) {
  phase = randomVal(0, 100000)
  p.push()
  p.translate(x, y)
  rot = randomVal(0, 360)
  p.beginShape()
  for(let i = rot; i < rot+360; i+=360/8) {
    xoff = map(cos(i), -1, 1, 0, 10)
    yoff = map(sin(i), -1, 1, 0, 10)
    n = noise(xoff*strokeNS, yoff*strokeNS, phase)
    r = min(1 / abs(cos(i)), 1 / abs(sin(i)))
    blobW = map(n, 0, 1, wid*minIrreg, wid*0.5)*r
    blobH = map(n, 0, 1, hei*minIrreg, hei*0.5)*r

    xC = cos(i)*blobW
    yC = sin(i)*blobH

    p.vertex(xC, yC)
  }
  p.endShape(CLOSE)
  p.pop()
}

//Middleman between the filter and the actual geometry, informs rotation and which colors are sampled to mix the final color
function strokeLine(xA, yA, xB, yB, weight, pass) {
  //save so we can translate to stroke location
  p.push()
  //rebuild coords as vectors
  here = createVector(xA, yA)
  there = createVector(xB, yB)
  midPt = createVector(map(0.5, 0, 1, xA, xB), map(0.5, 0, 1, yA, yB))
  //sample color from s, our layer which decides if a stroke is drawn or not
  sampMid = color(s.get(midPt.x, midPt.y))
  if(sampMid.levels[0] == 0) {
    //translate to stroke center so we can build polar geometry
    p.translate(midPt.x, midPt.y)
    //use our rotation angle we packaged earlier
    p.rotate(pass)
    //send to geometry
    blob(0, 0, weight, yA-yB)
  }
  //reset our translation
  p.pop()
}

//Mountain composition builder
function mountains() {
  //determine # of rows
  numRows = randomInt(4, 8)
  //determine height
  hei = h/numRows
  //establish a list of colors to be shuffled, so all values between 0 and 255 are shown which ensures contrast
  mountCols = []
  //fill list
  for(let i = 0; i < numRows; i++) {
    mountCols[i] = map(i, 0, numRows, 50, 250)
  }
  //shuffle list
  trueMountCols = shuff(mountCols)

  //build our mountains
  for(let i = 0; i < numRows; i++) {
    //set a third value for noise so all of our mountains are unique
    phase = randomVal(0, 10000000)
    c.fill(trueMountCols[i])
    //fairly thick stroke to make a small border when sent through the filter
    c.stroke(randomVal(0, 255))
    c.strokeWeight(randomVal(10, 30))
    c.beginShape()
    //build bottom left and right corners
    c.vertex(w, h)
    c.vertex(0, h)

    lineFreq = randomInt(60, 300)
    lined = randomInt(0, 10)
    //build full mountain shape
    for(let x = 0; x < w; x++) {
      maxH = map(i, 0, numRows, h, hei)
      n = map(noise(x*mountNS, phase), 0, 1, maxH-(hei*2), maxH)
      c.vertex(x, h-n)
      if(x % lineFreq == 0 && lined == 1) {
        // c.strokeWeight(randomVal(1, 50))
        // c.line(x, 0, x, h-n)
      }
    }
    c.endShape(CLOSE)
  }
}

//Box/blob composition builder
function boxes() {
  //same color randomizer as the mountains to ensure all colors are used
  boxCols = []
  //give variation to density
  numBoxes = randomVal(5, 40)//60//20//randomInt(4, 10)
  //fill color list
  for(let i = 0; i < numBoxes; i++) {
    boxCols[i] = map(i, 0, numBoxes, 50, 250)
  }
  //shuffle color list
  trueBoxCols = shuff(boxCols)
  //build shapes
  center = ptFromAng(w/2, h/2, randomVal(0, 360), randomVal(0, w/4))
  for(let i = 0; i < numBoxes; i++) {
    c.fill(chroma(trueBoxCols[i], trueBoxCols[i], trueBoxCols[i]).alpha(randomVal(1, 0.75)).hex())
    strokeVal = randomVal(10, 250)
    c.stroke(chroma(strokeVal, strokeVal, strokeVal).alpha(0.85).hex())
    c.strokeWeight(randomVal(10, 30))
    wid = randomVal(100, w*0.8)
    hei = randomVal(100, h*0.8)
    //limit the distance from center so there is natural margin
    here = ptFromAng(center.x, center.y, randomVal(0, 360),randomVal((w/2)-(wid/2), 0))
    x = here.x
    y = here.y
    c.rectMode(CENTER)
    //making shapes from polar noise loop blobs, sometimes squared sometimes rounded
    subBlob(x, y, wid, hei)
  }
}
//patchwork composition builder
function patchwork() {
  //same color randomizer as the mountains to ensure all colors are used
  boxCols = []
  //give variation to density
  numBoxes = randomVal(20, 60)//60//20//randomInt(4, 10)
  //fill color list
  for(let i = 0; i < numBoxes; i++) {
    boxCols[i] = map(i, 0, numBoxes, 50, 250)
  }
  //shuffle color list
  trueBoxCols = shuff(boxCols)
  //build shapes
  center = ptFromAng(w/2, h/2, randomVal(0, 360), randomVal(0, w/4))
  for(let i = 0; i < numBoxes; i++) {
    c.fill(chroma(trueBoxCols[i], trueBoxCols[i], trueBoxCols[i]).alpha(randomVal(1, 0.75)).hex())
    strokeVal = randomVal(10, 250)
    c.stroke(chroma(strokeVal, strokeVal, strokeVal).alpha(0.85).hex())
    c.strokeWeight(randomVal(10, 30))
    wid = randomVal(100, w*0.8)
    hei = randomVal(100, h*0.8)
    x = randomVal(0, w)
    y = randomVal(0, h)
    c.rectMode(CENTER)
    //making shapes from polar noise loop blobs, sometimes squared sometimes rounded
    subBlob(x, y, wid, hei)
  }
}

//Squiggly scratches across the canvas
function scratch(x, y, ns) {
  //random third value for uniqueness
  phase = randomVal(0, 1000000)
  //starting point
  start = createVector(x, y)
  col = randomVal(0, 255)
  //random rate of irregularity
  ns = randomVal(0.0001, 0.1)
  //how far do we go?
  length = randomVal(200, 2000)
  p.push()
  //fill last with current location so it can be used next loop
  for(let i = 0; i < length; i++) {
    if(i == 0) {
      last = start
    } else {
      last = here
    }
    //angle is given the noise values
    nAng = map(noise(i*ns, phase), 0, 1, -1, 1)
    //0.5 is the speed at which we move to the side
    here = createVector(0, 0.5)
    //translate to the start if starting, if not then translate x speed in nAng direction
    if(i == 0) {
      p.translate(start.x, start.y)
    } else {
      p.translate(0, 0.5)
    }
    //do the rotation
    p.rotate(nAng)
    //change stroke alpha and weight irregularly
    p.stroke(chroma(col).alpha(randomVal(0.05, 0.1)).hex())
    p.strokeWeight(randomVal(0.5, 1))
    //draw our point
    p.point(0, 0)
  }
  p.pop()
}

//Spiral version of the above scratch detail
function spiral(x, y, r) {
  //polar shape, so starting from the center, increasing radius as it rotates
  p.push()
  //start from center
  p.translate(x, y)
  //starting rotation
  startRot = randomVal(0, 360)
  //how many rotations?
  numRevs = randomVal(1, 10)
  //set color
  col = randomVal(0, 255)
  p.stroke(chroma(col).alpha(detailAlph).hex())
  //set irregularity offset's noise scale
  ns = 0.01
  startPt = randomVal(0, 0.4)
  //clockwise or counterclockwise decider
  dir = plusOrMin(1)
  //how thick our line can get
  maxWtNow = map(r, 50, 200, 3, 1.5)
  maxWt = randomVal(1, maxWtNow)
  for(let i = startRot; i < (360*numRevs)+startRot; i+=0.5) {
    //our offset to make our lines irregular
    mod = map(noise(i*ns), 0, 1, 0.7, 1.3)
    rad = map(i, startRot, (360*numRevs)+startRot, r*startPt, r)*mod
    xC = cos(i*dir)*rad/2
    yC = sin(i*dir)*rad/2
    //randomize pt size
    p.strokeWeight(randomVal(0.5, maxWt))
    p.point(xC, yC)
  }
  p.pop()
}

//Crude rectangle drawing/etching
function etchQuad(x, y, wid, hei) {
  p.push()
  //move to center as we're using a polar method
  p.translate(x, y)
  //a place for our corners of the shape to be stored
  pts = []
  //set color
  col = randomVal(0, 255)
  p.stroke(chroma(col).alpha(detailAlph).hex())
  p.noFill()
  //set 4 points evenly spaced and save to array
  for(let i = -45; i < 360-45; i+= 360/4) {
    mod = randomVal(0.75, 1)
    xC = cos(i)*wid*mod*2
    yC = sin(i)*hei*mod*2
    //create vector of location and pass to array
    pt = createVector(xC, yC)
    pts.push(pt)
  }
  //use pts in array to draw crude lines
  numCycles = randomInt(1, 4)
  for(let i = 0; i < numCycles; i++) {
    crudeLine(pts[0].x, pts[0].y, pts[1].x, pts[1].y, 0.5, 1, 10)
    crudeLine(pts[1].x, pts[1].y, pts[2].x, pts[2].y, 0.5, 1, 10)
    crudeLine(pts[2].x, pts[2].y, pts[3].x, pts[3].y, 0.5, 1, 10)
    crudeLine(pts[3].x, pts[3].y, pts[0].x, pts[0].y, 0.5, 1, 10)
  } 
  
  p.pop()
}
//Crude triangle drawing/etching
function etchTri(x, y, wid, hei) {
  p.push()
  //move to center as we're using a polar method
  p.translate(x, y)
  //a place for our corners of the shape to be stored
  pts = []
  //set color
  col = randomVal(0, 255)
  p.stroke(chroma(col).alpha(detailAlph).hex())
  p.noFill()
  startRot = randomVal(0, 360)
  //set 4 points evenly spaced and save to array
  for(let i = startRot; i < 360+startRot; i+= 360/3) {
    mod = randomVal(0.75, 1)
    xC = cos(i)*wid*mod*2
    yC = sin(i)*hei*mod*2
    //create vector of location and pass to array
    pt = createVector(xC, yC)
    pts.push(pt)
  }
  //use pts in array to draw crude lines
  numCycles = randomInt(1, 4)
  for(let i = 0; i < numCycles; i++) {
    crudeLine(pts[0].x, pts[0].y, pts[1].x, pts[1].y, 0.5, 1, 10)
    crudeLine(pts[1].x, pts[1].y, pts[2].x, pts[2].y, 0.5, 1, 10)
    crudeLine(pts[2].x, pts[2].y, pts[0].x, pts[0].y, 0.5, 1, 10)
  } 
  
  p.pop()
}

//Crude flower drawing/etching
function scratchFlower(x, y, r) {
  //random value for our noise function
  phase = randomVal(0, 10000000000)
  phaseB = randomVal(0, 10000000000)
  p.push()
  //translate to center
  p.translate(x, y)
  //how many petals does our flower have?
  numPetals = randomInt(4, 8)
  //how far back towards the center does our line retreat
  midPt = randomVal(0, 0.5)
  maxWt = randomVal(1.5, 3)
  col = randomVal(0, 255)
  //random starting rotation for variety among flowers
  rot = randomVal(0, 360)
  startRot = randomVal(0, 360)
  //color settings for center and stem
  p.stroke(chroma(col).alpha(detailAlph).hex())
  p.noFill()
  p.strokeWeight(maxWt/2)
  //draw a circle in the center
  crudeCircle(0, 0, r*midPt*randomVal(0.25, 1), maxWt)
  //noise value for irregularity
  ns = 0.04
  rotNS = 0.02
  cycles = randomVal(1, 3)
  for(let i = startRot; i < (360*cycles)+startRot; i+=0.2) {
    //noise for irregularity
    mod = map(noise(i*ns, phase), 0, 1, 0.8, 1.2)
    rotMod = map(noise(i*ns, phaseB), 0, 1, -10, 10)
    p.strokeWeight(randomVal(1, maxWt))
    rad = map(sin((i+rot)*(numPetals)), -1, 1, r*midPt, r)*mod
    xC = cos(i+rotMod)*rad /2
    yC = sin(i+rotMod)*rad/2
    //draw point
    p.point(xC, yC)
  }
  p.pop()
}

//Crude sun drawing/etching
function scratchSun(x, y, r) {
  phase = randomVal(0, 10000000000)
  p.push()
  p.translate(x, y)
  numPetals = randomInt(4, 15)
  midPt = randomVal(0.25, 0.75)
  col = randomVal(0, 255)
  ns = 0.05
  rot = randomVal(0, 360)
  p.stroke(chroma(col).alpha(detailAlph).hex())
  p.noFill()
  p.strokeWeight(randomVal(0.25, 1))
  p.beginShape()
  for(let i = 0; i < 360; i+=360/(numPetals*2)) {
    mod = map(noise(i*ns, phase), 0, 1, 0.8, 1.2)
    rad = map(sin((i+rot)*(numPetals)), -1, 1, r*midPt, r)*mod
    xC = cos(i+randomVal(-10, 10))*rad 
    yC = sin(i+randomVal(-10, 10))*rad
    p.vertex(xC, yC)
  }
  p.endShape(CLOSE)
  p.pop()
}

//Subtle text stamp
function stampText(x, y, sz) {
  numCycles = randomInt(2, 6)
  p.push()
  rot = 90*randomInt(0, 3)
  val = randomVal(0, 255)
  p.fill(chroma(val, val, val).alpha(0.1).hex())
  p.noStroke()
  p.textFont('GEORGIA')
  p.textAlign(CENTER)
  p.rectMode(CENTER)
  p.strokeWeight(randomVal(0.5, 1))
  p.textSize(sz)
  play = sz*0.1

  word = words[randomInt(0, words.length-1)]
  for(let i = 0; i < numCycles; i++) {
    xMod = randomVal(-play, play)
    yMod = randomVal(-play, play)
    p.push()
    p.translate(x, y)
    p.rotate(rot)
    p.text(word, xMod, yMod, 0)
    p.pop()
  }
  p.pop()
}

function crudeLine(xA, yA, xB, yB, minWt, maxWt, play) {
  here = createVector(xA, yA)
  there = createVector(xB, yB)
  dis = here.dist(there)
  phaseX = randomVal(0, 10000000000000)
  phaseY = randomVal(0, 10000000000000)
  ns = 0.01

  for(let i = 0; i < dis; i+=0.5) {
    xOff = map(noise(i*ns, phaseX), 0, 1, -play, play)
    yOff = map(noise(i*ns, phaseY), 0, 1, -play, play)
    x = map(i, 0, dis, here.x, there.x)+xOff
    y = map(i, 0, dis, here.y, there.y)+yOff
    p.strokeWeight(randomVal(minWt, maxWt))
    p.point(x, y)
  }
}

function crudeCircle(x, y, r, maxWt) {
  phase = randomVal(0, 1000000000000000)
  ns = randomVal(1, 3)
  p.push()
  p.translate(x, y)
  
  for(let i = 0; i < 360; i++) {
    xoff = map(cos(i), -1, 1, 0, ns)
    yoff = map(sin(i), -1, 1, 0, ns)

    rad = map(noise(xoff, yoff, phase), 0, 1, r*0.75, r)
    xC = cos(i)*rad 
    yC = sin(i)*rad 
    p.strokeWeight(randomVal(0.5, maxWt))
    p.point(xC, yC)
  }
  p.pop()
}

function crudeX(x, y, r) {
  start = randomVal(0, 360)
  aA = ptFromAng(x, y, start+0, r)
  aB = ptFromAng(x, y, start+180, r)
  bA = ptFromAng(x, y, start+90, r)
  bB = ptFromAng(x, y, start+240, r)
  numCycles = randomVal(1, 3)
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.noFill()
  for(let i = 0; i < numCycles; i++) {
    crudeLine(aA.x, aA.y, aB.x, aB.y, 0.5, 3, randomVal(10, 30))
    crudeLine(bA.x, bA.y, bB.x, bB.y, 0.5, 3, randomVal(10, 30))
  }
  
}

function crudeArrow(x, y, reach) {
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.noFill()
  numCycles = randomInt(1, 3)
  start = randomVal(0, 360)
  cent = createVector(x, y)
  mainLine = ptFromAng(x, y, start, reach)
  left = ptFromAng(x, y, start+randomVal(-25, -70), reach*randomVal(0.15, 0.4))
  right = ptFromAng(x, y, start+randomVal(25, 70), reach*randomVal(0.15, 0.4))
  for(let i = 0; i < numCycles; i++) {
    crudeLine(cent.x, cent.y, mainLine.x, mainLine.y, 0.5, 3, randomVal(5, 20))
    crudeLine(cent.x, cent.y, left.x, left.y, 0.5, 3, randomVal(5, 20))
    crudeLine(cent.x, cent.y, right.x, right.y, 0.5, 3, randomVal(5, 20))
  }
}
function grass(x, y, hei) {
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.noFill()
  p.push()
  p.translate(x, y)
  p.rotate(randomVal(-10, 10))
wid = hei*randomVal(1, 3)
numBlades = randomVal(40, 80)
  for(let i = 0; i < numBlades; i++) {
    xC = randomVal(-wid/2, wid/2)
    play = wid*0.3
    baseY = hei/2
    topY = -hei*randomVal(0.3, 0.5)
    crudeLine(xC, baseY, xC+randomVal(-play, play), topY, 0.5, 2, wid*0.1)
  }
  p.pop()
}

function orbit(x, y, r) {
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.strokeWeight(randomVal(0.5, 3))
  p.noFill()
  numCycles = randomInt(1, 3)
  numSats = randomVal(2, 8)
  centerR = randomVal(r*0.5, r*0.75)
  for(let i = 0; i < numCycles; i++) {
    crudeCircle(x, y, centerR, randomVal(0.5, 3))
  }
  
  satR = randomVal(0, r-centerR)
  for(let i = 0; i < numSats; i++) {
    thisR = randomVal(10, satR)
    here = ptFromAng(x, y, randomVal(0, 360), randomVal(centerR+thisR/2, r))
    for(let j = 0; j < numCycles; j++) {
      crudeCircle(here.x, here.y, thisR, randomVal(0.5, 3))
    }
  }
}

function bird(x, y, r, rot) {
  p.push()
  p.translate(x, y)
  p.rotate(rot)
  p.translate(-x, -y)
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph*2).hex())
  p.strokeWeight(randomVal(0.5, 3))
  p.noFill()

  wingArch = r*randomVal(0.25, 0.5)
  p.bezier(x, y, x, y, x+(r/4), y-wingArch, x+r/2, y-(wingArch/2))
  p.bezier(x, y, x, y, x-(r/4), y-wingArch, x-r/2, y-(wingArch/2))
  p.pop()
}

function etchGrid(xC, yC, wid, hei) {
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.noFill()
  p.push()
  p.translate(xC, yC)
  p.rotate(randomVal(-10, 10))
  cols = randomInt(3, 10)
  rows = cols
  cellW = wid/cols
  cellH = hei/rows 
  start = createVector(-wid/2, -hei/2)
  end = createVector(wid/2, hei/2)

  for(let y = 1; y < rows; y++) {
    yPos = map(y, 0, rows, -hei/2, hei/2)
    crudeLine(-wid/2, yPos, wid/2, yPos, 0.5, 1.5, randomVal(10, 30))
  }
  for(let x = 1; x < cols; x++) {
    xPos = map(x, 0, cols, -wid/2, wid/2)
    crudeLine(xPos, -hei/2, xPos, hei/2, 0.5, 1.5, randomVal(10, 30))
  }
  p.pop()
}

function flock(x, y, r) {
  numCycles = randomInt(1, 3)
  numBirds = randomVal(2, 7)
  for(let i = 0; i < numBirds; i++) {
    here = ptFromAng(x, y, (360/numBirds)*i+randomVal(-1, 1), randomVal(r*0.25, r))
    birdR = randomVal(r*0.25, r*0.5)
    rot = randomVal(-20, 20)
    for(let j = 0; j < numCycles; j++) {
      xMod = randomVal(-5, 5)
      yMod = randomVal(-5, 5)
      bird(here.x+xMod, here.y+yMod, birdR, rot)
    }
  }
}

function tree(x, y, r) {
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  numCycles = randomInt(1, 3)
  p.noFill()
  trunkBase = ptFromAng(x, y, 90+randomVal(-10, 10), r)
  for(let i = 0; i < numCycles; i++) {
    crudeLine(x, y, trunkBase.x, trunkBase.y, 1, 3, r*0.1)
  }
  numLeaves = 60
  
  for(let i = 0; i < numLeaves; i++) {
    hereY = randomVal(0, r*0.75)
    maxX = map(hereY, 0, r*0.75, 0, r/3)
    //hereX = randomVal()
    xMod = randomVal(-maxX, maxX)
    for(let j = 0; j < numCycles; j++) {
      crudeLine(x+randomVal(-maxX, maxX), y+hereY, x+xMod, y+hereY, 0.5, 2, r*0.1)
    }
  }
  
}

function tally(x, y, hei, wid) {
  val = randomVal(0, 255)
  numCycles = randomInt(1, 3)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.noFill()
  numTallies = randomInt(3, 5)
  dir = randomInt(1, 2)
  for(let i = 1; i < numTallies+1; i++) {
    for(let j = 0; j < numCycles; j++) {
      if(i < 5) {
        xPos = map(i, 0, 4, x-(wid/2), x+wid/2)
        crudeLine(xPos, y-hei/2, xPos, y+hei/2, 0.5, 2, randomVal(5, 20))
      } else if(i == 5 && dir == 1) {
        crudeLine(x-wid/2, y-hei/2, x+wid/2+(wid*0.1), y+hei/2, 0.5, 2, randomVal(5, 20))
      } else if (i == 5 && dir == 2) {
        crudeLine(x-wid/2, y+hei/2, x+wid/2+(wid*0.1), y-hei/2, 0.5, 2, randomVal(5, 20))
      } 
    }
  }
}

function crudeWindow(x, y, wid, hei) {
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.noFill()
  p.push()
  trueHeight = hei*randomVal(1, 3)
  p.translate(x, y)
  p.strokeWeight(randomVal(0.5, 3))
  p.bezier(-wid/2, hei/2, -wid/2, hei/2, 0, -trueHeight, wid/2, hei/2)
  crudeLine(-wid/2, hei/2, wid/2, hei/2, 0.5, 3, 10)
  p.pop()
}

function face(x, y, r) {
  p.push()
  numCycles = randomInt(1, 3)
  p.rotate(randomVal(0, 360))
  p.translate(x, y)
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.noFill()
  p.strokeWeight(randomVal(1, 5))
  play = 30
  happiness = randomVal(-r*0.25, r*0.9)

  for(let i = 0; i < numCycles; i++) {
    leftEye = ptFromAng(0, 0, -135+randomVal(-play, play), r/2*randomVal(0.8, 1.2))
    rightEye = ptFromAng(0, 0, -45+randomVal(-play, play), r/2*randomVal(0.8, 1.2))
    mouthA = ptFromAng(0, 0, 30+randomVal(-play, play), r/2*randomVal(0.8, 1.2))
    mouthB = ptFromAng(0, 0, 90+randomVal(-play, play), happiness)
    mouthC = ptFromAng(0, 0, 150+randomVal(-play, play), r/2*randomVal(0.8, 1.2))
    p.point(leftEye.x, leftEye.y)
    p.point(rightEye.x, rightEye.y)
    p.strokeWeight(randomVal(0.5, 3))
    crudeCircle(0, 0, r, randomVal(0.5, 3))
    p.bezier(mouthA.x, mouthA.y, mouthA.x, mouthA.y, mouthB.x, mouthB.y, mouthC.x, mouthC.y)
  }
  p.pop()
}

function spiralLine() {
  val = randomVal(0, 255)
  p.stroke(chroma(val, val, val).alpha(detailAlph).hex())
  p.noFill()
  here = createVector(randomVal(0, w), randomVal(0, h))
  there = ptFromAng(here.x, here.y, randomVal(0, 360), randomVal(50, 400))
  dis = here.dist(there)
  wt = randomVal(5, 40)
  minSpins = dis/(wt*4)
  maxSpins = dis/(wt*3)
  numSpins = randomInt(minSpins, maxSpins)
  p.strokeWeight(randomVal(0.5, 1))
  ns = 0.05
  dirMod = plusOrMin(1)

  for(let i = 0; i < dis; i+= 0.25) {
    mod = map(noise(i*ns), 0, 1, 0, 20)
    sineI = map(i, 0, dis/numSpins, 0, 360)*dirMod
    x = map(i, 0, dis, here.x, there.x)
    y = map(i, 0, dis, here.y, there.y)
    spiralPt = ptFromAng(x, y, sineI, wt+mod)
    p.point(spiralPt.x, spiralPt.y)
  }
}

function burst(x, y, r) {
  steps = randomInt(3, 20)
  for(let i = 0; i < 360; i+=360/steps) {
    start = ptFromAng(x, y, i, (r/2)*fxrand())
    end = ptFromAng(x, y, i, (r/2)*fxrand())
    crudeLine(start.x, start.y, end.x, end.y, 0.5, 3, 10)
  }
}

//Splotch on the composition to change the hue of the strokes in a certain location
function hueSpot() {
  here = createVector(randomVal(0, w), randomVal(0, h))
  hei = randomVal(10, 30) 
  wid = randomVal(10, 30)
  layers = 10
  phase = randomVal(0, 10000000)
  c.fill(chroma(randomVal(0, 255)).alpha(randomVal(0.1, 0.3)/numColors).hex())

  for(let j = 0; j < layers; j++) {
    rMod = map(j, 0, layers, 1, 0)
    c.push()

    c.translate(here.x, here.y)
    c.beginShape()
    for(let i = 0; i < 360; i+=360/20) {
      xoff = map(cos(i), -1, 1, 0, 10)
      yoff = map(sin(i), -1, 1, 0, 10)
      n = noise(xoff, yoff, phase)
      blobW = map(n, 0, 1, wid*0.25, wid*0.5)*rMod
      blobH = map(n, 0, 1, hei*0.25, hei*0.5)*rMod

      xC = cos(i)*blobW
      yC = sin(i)*blobH

      c.vertex(xC, yC)
    }
    c.endShape(CLOSE)
    c.pop()
  }
}

function lumSpecks() {
  numSpecks = randomVal(100, 250)
  for(let i = 0; i < numSpecks; i++) {
    p.strokeWeight(randomVal(0.5, 5))
    p.stroke(chroma(randomVal(0, 255)).alpha(0.2).hex())
    p.point(randomVal(0, w), randomVal(0, h))
  }
}

function horizStripes() {
  s.rectMode(CENTER)
  numStripes = randomInt(2, 50)
  for(let i = 0; i < numStripes; i++) {
    hei = (h-(marg*2))/numStripes
    wid = (w-(marg*2))
    multX = randomVal(0.25, 1)
    multY = randomVal(0.25, 0.75)
    s.rect(w/2, marg+(i*hei)+(hei/2), wid*multX-marg, hei*multY)
  }
}

function vertStripes() {
  s.rectMode(CENTER)
  numStripes = randomInt(2, 50)
  for(let i = 0; i < numStripes; i++) {
    hei = (h-(marg*2))
    wid = (w-(marg*2))/numStripes
    multX = randomVal(0.25, 0.75)
    multY = randomVal(0.25, 1)
    s.rect(marg+(i*wid)+(wid/2), h/2, wid*multX, hei*multY)
  }
}

function sRings() {
  numRings = randomInt(4, 12)
  here = createVector(randomVal(0, w), randomVal(0, h))
  for(let i = 0; i < numRings; i++) {
    if(i % 2 == 0) {
      s.fill('white')
    } else {
      s.fill('black')
    }
    r = map(i, 0, numRings, 2500, 0)
    s.circle(here.x, here.y, r)
  }

  s.push()
  s.noFill()
  s.stroke('white')
  s.strokeWeight(marg)
  s.rect(w/2, h/2, w-(marg/2), h-(marg/2))
  s.pop()
}

//Crude arc detail alluding to a coffee ring
function coffeeRing() {
 r = randomVal(50, 150)
 x = randomVal(marg+(r/2), w-(marg+(r/2)))
 y = randomVal(marg+(r/2), h-(marg+(r/2)))
 ns = randomVal(0.1, 0.01)
 phase = randomVal(0, 10000000000)

 p.noFill()
 p.stroke(chroma(randomVal(0, 255)).alpha(0.05).hex())
 p.strokeWeight(randomVal(1, 8))
 maxWt = randomVal(1, 10)
  startAng = randomVal(0, 360)
  endAng = randomVal(0, 360)
  p.push()
  p.translate(x, y)
  for(let i = 0; i < 360; i++) {
    n = map(noise(i*ns, phase), 0, 1, maxWt*0.5, maxWt)
  xC = cos(i)*r
  yC = sin(i)*r
    if(i > endAng && i < startAng) {
      p.strokeWeight(n)
      p.point(xC, yC)
    }
  
  }
  p.pop()
}

//Border around the edges to resemble paint overflow over taped margins
function border(minW, maxW, minH, maxH) {
  numLayers = 30

  for(let i = 0; i < numLayers; i++) {
    wid = randomVal(minW, maxW)
    hei = randomVal(minH, maxH)
    x = randomVal(wid/2, maxW-(wid/2))
    y = randomVal(hei/2, maxH-(hei/2))

    val = randomVal(0, 255)
    p.stroke(chroma(val, val, val).alpha(0.25).hex())
    // p.noFill()
    p.strokeWeight(randomVal(1, 50))
    p.rectMode(CENTER)
    borderRect(x, y, wid, hei, randomVal(1, 20))
  }
}

//Geometry to feed our border() function
function borderRect(x, y, wid, hei, maxStroke) {
  phase = randomVal(0, 100000)
  p.push()
  p.translate(x, y)
  rot = randomVal(0, 360)
  ns = randomVal(0.01, 0.1)
  
  for(let i = rot; i < rot+360; i+=0.1) {
    xoff = map(cos(i), -1, 1, 0, 10)
    yoff = map(sin(i), -1, 1, 0, 10)
    r = min(1 / abs(cos(i)), 1 / abs(sin(i)))
   

    xC = cos(i)*wid/2*r
    yC = sin(i)*hei/2*r
    wt = map(noise(i*ns, phase), 0, 1, -maxStroke, maxStroke)
    p.strokeWeight(wt)
    p.square(xC, yC, wt)
  }
  p.pop()
}

//Build the horizon line for the fgBg composition
function fgBg() {
  //fg block
  fgVal = randomVal(50, 250)
  c.fill(fgVal)
  c.stroke(randomVal(50, 250))
  c.rect(0, horizon, w, h-horizon)
  //bg block
  bgVal = fgVal + 125
  if(bgVal > 255) {
    bgVal -= 255
  }
  c.fill(bgVal)
  c.stroke(randomVal(50, 250))
  c.rect(0, 0, w, horizon)
}
//Build the vertical line for the lgRg composition
function lgRg() {
  //fg block
  fgVal = randomVal(50, 250)
  c.fill(fgVal)
  c.stroke(randomVal(50, 250))
  c.rect(hrzn, 0, w-hrzn, h)
  //bg block
  bgVal = fgVal + 125
  if(bgVal > 255) {
    bgVal -= 255
  }
  c.fill(bgVal)
  c.stroke(randomVal(50, 250))
  c.rect(0, 0, hrzn, 0)
}

//The subject to be placed on the fgBg composition
function subject() {
  centerBottom = map(0.5, 0, 1, horizon, h)
  centerTop = map(0.5, 0, 1, horizon, 0)
  centerY = map(0.5, 0, 1, centerTop, centerBottom)
  subH = centerTop - centerBottom
  c.ellipseMode(CENTER)
  c.stroke(randomVal(0, 255))
  c.fill(randomVal(0, 255))
  widMod = randomVal(1, 2)
  margX = w*0.333
  margY = (h-subH)/2
  offsetX = randomVal(-w/4, w/4)
  c.rectMode(CENTER)
  for(let i = 0; i < 50; i++) {
    wid = randomVal(50, w*0.5)
    hei = randomVal(100, subH/2)
    x = randomVal((margX)+(wid/2), (w-margX)-(wid/2))+offsetX
    y = randomVal(centerTop+(hei/2), centerBottom-(hei/2))

    c.strokeWeight(randomVal(5, 20))
    strokeVal = randomVal(0, 255)
    c.stroke(chroma(strokeVal, strokeVal, strokeVal).alpha(0.5).hex())
    val = randomVal(0, 255)
    c.fill(chroma(val, val, val).alpha(0.85).hex())
    subBlob(x, y, wid*widMod, hei)
  }
}
//The subject to be placed on the fgBg composition
function subjectH() {
  centerRight = map(0.5, 0, 1, hrzn, w)
  centerLeft = map(0.5, 0, 1, hrzn, 0)
  centerY = map(0.5, 0, 1, centerLeft, centerRight)
  subW = centerLeft - centerRight
  c.ellipseMode(CENTER)
  c.stroke(randomVal(0, 255))
  c.fill(randomVal(0, 255))
  heiMod = randomVal(1, 2)
  margX = (w-subW)/2
  margY = h*0.333
  offsetX = randomVal(-h/4, h/4)
  c.rectMode(CENTER)
  for(let i = 0; i < 50; i++) {
    wid = randomVal(50, subW/2)
    hei = randomVal(100, h*0.5)
    x = randomVal(centerLeft+(wid/2), centerRight-(wid/2))
    y = randomVal((margX)+(hei/2), (h-margX)-(hei/2))+offsetX

    c.strokeWeight(randomVal(5, 20))
    strokeVal = randomVal(0, 255)
    c.stroke(chroma(strokeVal, strokeVal, strokeVal).alpha(0.5).hex())
    val = randomVal(0, 255)
    c.fill(chroma(val, val, val).alpha(0.85).hex())
    subBlob(x, y, wid, hei*heiMod)
  }
}

//Obstruction function covering the canvas from some edge
function obstructH() {
  nObstruction = fxrand()
  if(nObstruction < 0.5) {
    nDir = randomInt(1, 2)
    if(nDir == 1) {
      midPt = randomVal(200, w/3)
      centerX = map(0.5, 0, 1, 0, midPt)
      c.fill(randomVal(50, 255))
      c.stroke(randomVal(0, 255))
      c.strokeWeight(randomVal(5, 20))
      c.rectMode(CORNER)
      c.rect(0, 0, midPt, h)
    } else if(nDir == 2) {
      wid = randomVal(0, w/3)
      midPt = w-wid
      centerX = map(0.5, 0, 1, w, midPt)
      c.fill(randomVal(50, 255))
      c.stroke(randomVal(0, 255))
      c.strokeWeight(randomVal(5, 20))
      c.rectMode(CORNER)
      c.rect(w-wid, 0, midPt, h)
    }
  }
}
function obstructV() {
  nObstruction = fxrand()
  if(nObstruction < 0.5) {
    nDir = randomInt(1, 2)
    if(nDir == 1) {
      hei = randomVal(200, h*0.4)
      midPt = hei
      centerX = map(0.5, 0, 1, 0, midPt)
      c.fill(randomVal(50, 255))
      c.stroke(randomVal(0, 255))
      c.strokeWeight(randomVal(5, 20))
      c.rectMode(CORNER)
      c.rect(0, 0, w, hei)
    } else if(nDir == 2) {
      hei = randomVal(0, h*0.4)
      midPt = h-hei
      centerX = map(0.5, 0, 1, h, midPt)
      c.fill(randomVal(50, 255))
      c.stroke(randomVal(0, 255))
      c.strokeWeight(randomVal(5, 20))
      c.rectMode(CORNER)
      c.rect(0, h-hei, w, hei)
    }
  }
}

function randObstruction() {
  nDir = fxrand()
  if(nDir < 0.5) {
    obstructH()
  } else {
    obstructV()
  }
}

//Geometry to feed the boxes() and subject() functions
function subBlob(x, y, wid, hei) {
  c.push()
  phase = randomVal(0, 10000000)
  ns = randomVal(2, 10)
  isSquare = randomInt(1, 2)
  
  c.translate(x, y)
  c.rotate(randomVal(0, 360))
  c.beginShape()
  for(let i = 0; i < 360; i+=360/30) {
    xoff = map(cos(i), -1, 1, 0, ns)
    yoff = map(sin(i), -1, 1, 0, ns)
    if(isSquare == 1) {
      squareMod = min(1 / abs(cos(i)), 1 / abs(sin(i)))
    } else if(isSquare == 2){
      squareMod = 1
    }
    mod = map(noise(xoff, yoff, phase), 0, 1, 0.25, 1)
    xC = cos(i)*(wid*squareMod)*mod/2
    yC = sin(i)*(hei*squareMod)*mod/2
    c.vertex(xC, yC)
  }
  c.endShape(CLOSE)
  c.pop()
}