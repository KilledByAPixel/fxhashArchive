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

function constrainNum(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

function keyTyped() {
  if (key === "s" || key === "S") {
    save('re_build.png')
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

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function randColor() {
  return chroma(truePal[randomInt(0, truePal.length-1)]).hex()
}

function angBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

function midpoint(x1, y1, x2, y2) {
  x = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2];
  return x
}
function findMidPt(xA, yA, xB, yB) {
  midX = map(0.5, 0, 1, xA, xB)
  midY = map(0.5, 0, 1, yA, yB)
  vec = createVector(midX, midY)
  return vec
}
function ptFromAng(x, y, ang, dis) {
  xC = cos(ang)*dis
  yC = sin(ang)*dis

  return createVector((x+xC), (y+yC))
}

function randBool() {
  decider = fxrand() 
  if(decider < 0.5) {
    thisVar = true
  } else {
    thisVar = false
  }
  return thisVar
}


////////////////////////////////////////



  function layerQuad(xA, yA, xB, yB, xC, yC, xD, yD, numLayers) {
    p.strokeCap(SQUARE)
    p.strokeJoin(ROUND)
    p.rectMode(CENTER)
    p.noFill()
    for(let i = 0; i < numLayers; i++) {
      lA = randomVal(100, 1000)
      lB = randomVal(100, 1000)
      lC = randomVal(100, 1000)
      lD = randomVal(100, 1000)
      lE = randomVal(100, 1000)
      lF = randomVal(100, 1000)
      p.drawingContext.setLineDash([lA, lB, lC, lD, lE, lF])
      p.stroke(chroma(randColor()).alpha(1).hex())
      p.strokeWeight(randomVal(300, 300))
      p.rect(w/2, h/2, w, h)
    }
  }

  function lineQuad(xA, yA, xB, yB, wt, filled) {
    p.strokeCap(PROJECT)
    p.strokeJoin(BEVEL)
    sects = []
    here = createVector(xA, yA)
    there = createVector(xB, yB)
    dis = here.dist(there)
    numSects = randomInt(2, 10)
    for(let i = 0; i < numSects+1; i++) {
      sects[i] = fxrand()
    }
    nSorted = fxrand()
    if(nSorted < 0.75) {
      sects.sort()
    }
    sects.sort()
    
    standout = randomInt(1, numSects-1)
    colorStandout = randomInt(1, numSects-1)
    sects[0] = 0
    sects[numSects-1] = 1
    standWt = wt
    for(let i = 1; i < numSects; i++) {
      startX = map(sects[i], 0, 1, here.x, there.x)
      startY = map(sects[i], 0, 1, here.y, there.y)
      endX = map(sects[i-1], 0, 1, here.x, there.x)
      endY = map(sects[i-1], 0, 1, here.y, there.y)
      start = createVector(startX, startY)
      end = createVector(endX, endY)
      midPt = findMidPt(startX, startY, endX, endY)
      ang = angBetween(startX, startY, endX, endY)
      length = start.dist(end)

      
      if(filled == true) {
        p.fill(frameCol)
      } else {
        p.noFill()
      }
      
      p.strokeWeight(randomVal(0.25, 2))
      p.stroke(frameCol)
      p.noStroke()
      
      if(i == standout) {
        wt = randomVal(standWt, standWt*10)
      } else {
        wt = standWt
      }

      if(i == colorStandout) {
        p.fill(randColor())
      }

      polarQuad(midPt.x, midPt.y, wt, length, ang-90)
    }
    

    
  }

  function polarQuad(x, y, wid, hei, ang) {
    p.push()
    corners = []
    p.translate(x, y) 
    p.rotate(ang)
    p.beginShape()
    isFilled = fxrand()
    fillChance = 0.1
    numSides = 4
    if(isFilled < fillChance) {
      p.fill(randColor())
      p.beginShape()
    }
    
    for(let i = 0; i < 360; i+=360/numSides) {
      r = min(1 / abs(cos(i)), 1 / abs(sin(i)))
      xC = cos(i+45)*wid*r*randomVal(0.75, 1)
      yC = sin(i+45)*hei*r*randomVal(0.9, 1)/1.4
      p.vertex(xC, yC)
      corner = createVector(xC, yC)
      corners.push(corner)
    }
    if(isFilled < fillChance) {
      p.endShape(CLOSE)
    }
    p.push()
    play = globalPlay
    
    for(let j = 0; j < numAccents; j++) {
      offX = randomVal(-play, play)
      offY = randomVal(-play, play)
      for(let i = 1; i < 4; i++) {
        lB = randomVal(5, hei)
        lA = randomVal(5, hei)
        lC = randomVal(5, hei)
        lD = randomVal(5, hei)
        lE = randomVal(5, hei)
        lF = randomVal(5, hei)
        p.drawingContext.setLineDash([lA, lB, lC, lD, lE, lF])
        p.stroke(frameCol)
        thisCorner = i 
        thatCorner = i+3
        if(thatCorner > 3) {
          thatCorner -=4
        }
        
        
        p.strokeJoin(BEVEL)
        p.line(corners[thisCorner].x+offX, corners[thisCorner].y+offY, corners[thatCorner].x+offX, corners[thatCorner].y+offY)
        
      }
    }
    
    p.pop()
    p.endShape(CLOSE)
    p.pop()
  }

  function quadQuad(x, y, wid, hei, wt) {
    wid /= 1.4
    hei /= 1.4

    p.push()
    p.translate(x, y)
    numSides = 4
    quadCorners = []
    isFilled = fxrand()
    fillChance = 0.5
    p.fill('pink')
    p.beginShape()
    for(let i = 0; i < 360; i+=360/numSides) {
      r = min(1 / abs(cos(i)), 1 / abs(sin(i)))
      xC = cos(i+45)*wid*r*randomVal(0.5, 1)
      yC = sin(i+45)*hei*r*randomVal(0.5, 1)
      corner = createVector(xC, yC)
      quadCorners[quadCorners.length] = corner
      if(isFilled < fillChance) {
        p.vertex(xC, yC)
      }
      
    }
    p.endShape(CLOSE)
    for(let i = 0; i < 4; i++) {

    }
    lineQuad(quadCorners[0].x, quadCorners[0].y, quadCorners[1].x, quadCorners[1].y, wt, true)
    lineQuad(quadCorners[1].x, quadCorners[1].y, quadCorners[2].x, quadCorners[2].y, wt, true)
    lineQuad(quadCorners[2].x, quadCorners[2].y, quadCorners[3].x, quadCorners[3].y, wt, true)
    lineQuad(quadCorners[3].x, quadCorners[3].y, quadCorners[0].x, quadCorners[0].y, wt, true)
    p.pop()
  }

  function quadQuadCorner(x, y, wid, hei, wt) {
    wid /= 1.4
    hei /= 1.4
    theCorner = randomInt(0, 3)
    p.push()
    p.translate(x, y)
    numSides = 4
    quadCorners = []
    col = chroma.mix(randColor(), bgc, 0)
    p.fill(chroma(col).alpha(maxAlph).hex())
    isFilled = fxrand()
    fillChance = chanceToFill
    p.beginShape()
    for(let i = 0; i < 360; i+=360/numSides) {
      r = min(1 / abs(cos(i)), 1 / abs(sin(i)))
      if(quadCorners.length == theCorner) {
        whichSide = fxrand()
        if(whichSide < 0.5) {
          xC = cos(i+45)*wid*r*randomVal(0, 1)
          yC = sin(i+45)*hei*r
        } else {
          xC = cos(i+45)*wid*r
          yC = sin(i+45)*hei*r*randomVal(0, 1)
        }
      } else {
        xC = cos(i+45)*wid*r
        yC = sin(i+45)*hei*r
      }
      
      corner = createVector(xC, yC)
      quadCorners[quadCorners.length] = corner

      if(filled == true) {
        p.vertex(xC, yC)
      }
    }
    p.endShape(CLOSE)
    for(let i = 0; i < 4; i++) {

    }
    lineQuad(quadCorners[0].x, quadCorners[0].y, quadCorners[1].x, quadCorners[1].y, wt, true)
    lineQuad(quadCorners[1].x, quadCorners[1].y, quadCorners[2].x, quadCorners[2].y, wt, true)
    lineQuad(quadCorners[2].x, quadCorners[2].y, quadCorners[3].x, quadCorners[3].y, wt, true)
    lineQuad(quadCorners[3].x, quadCorners[3].y, quadCorners[0].x, quadCorners[0].y, wt, true)
    p.pop()
  }

  function quadRect(x, y, wid, hei, wt) {
    //top
    lineQuad(x-wid/2, y-hei/2, x+wid/2, y-hei/2, wt, true)
    //right
    lineQuad(x+wid/2, y-hei/2, x+wid/2, y+hei/2, wt, true)
    //bottom
    lineQuad(x+wid/2, y+hei/2, x-wid/2, y+hei/2, wt, true)
    //left
    lineQuad(x-wid/2, y+hei/2, x-wid/2, y-hei/2, wt, true)
  }

function quadGrid() {
  rows = randomInt(1, 6)
  cols = randomInt(1, 6)
  cellW = (w-(marg*2))/cols 
  cellH = (h-(marg*2))/rows
  padding = min([cellW, cellH])*randomVal(0, 0.7)
  for(let y = 0; y < rows; y++) {
    for(let x = 0; x < cols; x++) {
      quadQuadCorner(marg+x*cellW+cellW/2, marg+y*cellH+cellH/2, cellW-padding, cellH-padding, randomVal(minLineWeight, maxLineWeight))
      console.log()
    }
  }
}

function quadGridOverlap() {
  cellW = (w-(marg*2))/cols 
  cellH = (h-(marg*2))/rows
  padding = min([cellW, cellH])*randomVal(0, 0.7)
  for(let y = 0; y < rows; y++) {
    
    for(let x = 0; x < cols; x++) {
      numWide = randomInt(1, cols-x-1)
      numHigh = randomInt(1, rows-y-1)
      if(y == 0) {
        chimney = randomInt(0, 1)
        chimHeight = marg/2
        leftTop = createVector(marg+(x*cellW), marg+(y*cellH)-(chimney*chimHeight))
        rightBot = createVector(marg+(x*cellW)+(cellW*numWide), marg+(y*cellH)+(cellH*numHigh))
        cent = findMidPt(leftTop.x, leftTop.y, rightBot.x, rightBot.y)
        thisWid = cellW*numWide
        thisHei = (cellH*numHigh)+(chimHeight*chimney)
      } else {
        leftTop = createVector(marg+(x*cellW), marg+(y*cellH))
        rightBot = createVector(marg+(x*cellW)+(cellW*numWide), marg+(y*cellH)+(cellH*numHigh))
        cent = findMidPt(leftTop.x, leftTop.y, rightBot.x, rightBot.y)
        thisWid = cellW*numWide
        thisHei = cellH*numHigh
      }
      
      filled = panels[y][x]
      if(panelSpawns[y][x] == true) {
        quadQuadCorner(cent.x, cent.y+(marg/4), thisWid, thisHei, randomVal(minLineWeight, maxLineWeight))
      }
      console.log()
    }
  }
}

function randQuads() {
  numBlocks = 3
  for(let i = 0; i < numBlocks; i++) {
    wid = randomVal(100, w-(marg*2))/3
    hei = randomVal(100, h-(marg*2))/3
    filled = randBool()
    quadQuadCorner(randomVal(marg+(wid/2), w-marg-(wid/2)), randomVal(marg+(hei/2), h-marg-(hei/2)), wid, hei, randomVal(minLineWeight, minLineWeight))
  }
}

