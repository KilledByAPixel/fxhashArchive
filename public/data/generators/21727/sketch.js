let ww, wh
let bg, fg, highlight
let cols, rows
let colors = []
let alphaCol

let xVariance, yVariance
let wobblyVariance, wobblyFactor, thicknessVariance
let noFace, thick, rough
let seed
let PD = 2

const t1 = {x:2,y:1}
const t2 = {x:4,y:1}
const t3 = {x:3,y:2}
const t4 = {x:1,y:2}
const b1 = {x:2,y:3}
const b2 = {x:4,y:3}
const b3 = {x:3,y:4}
const b4 = {x:1,y:4}

const empty = {x:0,y:0}

let face = [empty,empty,empty,empty]

const faces = [
  [t1,t2,t3,t4],
  [b1,b2,b3,b4],
  [t4,t1,b1,b4],
  [t3,t2,b2,b3],
  [t1,t2,b2,b1],
  [t4,t3,b3,b4],
]

const segments = [
  [t1,t2],
  [t2,t3],
  [t3,t4],
  [t4,t1],
  [b1,t1],
  [t2,b2],
  [b3,t3],
  [t4,b4],
  [b1,b2],
  [b2,b3],
  [b3,b4],
  [b4,b1],
]

function initPiece(){
  fxrand = sfc32(...hashes)
  console.log(`fxhash: ${fxhash}`)
  
  clear()
  resetMatrix()
  
  randomSeed(fxrand()*999999)
  noiseSeed(fxrand()*999999)
  
  // ww=wh=699
  ww=wh=max(min(window.innerWidth,window.innerHeight),1)

  console.log(`ww: ${ww}, wh: ${ww}, wiw: ${window.innerWidth}, wih: ${window.innerHeight}`)
  createCanvas(ww, wh);
  pixelDensity(2)
  
  noFace = random()<0.03?true:false
  thick = random()>0.4?true:false
  rough = random()>0.4?true:false
  
  xVariance = random(-0.1,0.75)
  yVariance = random(-0.1,0.75)
  wobblyFactor = rough?random(1,8):random(0.5,5)
  wobblyVariance = randomGaussian(0.25,0.3) // face
  thicknessFactor = rough?random(0.1,10):random(0.01,1)
  
  colors = []
  
  colors.push(...[
    ['#231f20','#fdfdfd','#22AA55','#ee0000','#FF6611','#ffee22','#00a9ee','#e2118f'],
    ['#23120b','#f1f1f1','#dd0100','#225095','#FDB827'],
    ['#23120b','#f1f1f1','#ba0000','#225095','#FDB827','#127740','#f697a8'],
    ['#3162c3','#279a29','#f51022','#f8df20','#f25519','#960083'],
    ['#F2F2F2','#BFBFBF','#8C8C8C','#0D0D0D'],
    ['#e5e5e7','#2a2c38','#0088e9','#fc90e1','#f0e54d'],
    // ['#d9cfc5','#da595a','#f18d3e','#ffc83d','#bdaa76','#59535f','#694e66','#5d4252'],
    ['#e64830','#fc222a','#fd6266']
  ][weighted_index([
    1.6,
    1.2,
    1.2,
    0.4,
    0.2,
    0.3,
    // 0.5,
    0.1
  ])])
  
  bg = colors.splice(floor(random(colors.length-1)),1)
  fg = random(colors)
  highlight = random(colors)
  
  let features = {
    thick:thick,
    rough:rough,
    wobblyFactor:wobblyFactor,
    wobblyVariance:wobblyVariance,
    thicknessFactor:thicknessFactor,
    xVariance:xVariance,
    yVariance:yVariance,
    colors:colors,
  }

  console.log(features)
  
  if(fg==highlight){
    fg = color(getVariedColor(color(fg)))
  }
  
  cols = 5
  rows = 5  
  gridSize = width/cols
  
  background(bg);
}

function getVariedColor(col){
  let h = max(min(round(hue(col)+random(-3,3)),360),0)
  let s = max(min(round(saturation(col)+random(-3,3)),100),0)
  let b = max(min(round(brightness(col)+random(-8,8)),97),3)
  return color(`hsb(${h}, ${s}%, ${b}%)`).toString()
}

function setup() {
  initPiece()
  noLoop()
}

function backgroundTexture(){
  push()
  let b = brightness(bg)
  // console.log(b)
  let divs = random([5,10,15])
  let divSize = ww/divs
  for(let i=0;i<divs;i++){
    for(let j=0;j<divs;j++){
      noStroke()
      let alphaCol
      let alpha
      if(b<=72){ 
        alphaCol = color('#fdfdfd')
        alpha = (b>15)?map(noise(i*0.1,j*0.1),0,1,1.5,3.5):map(noise(i*0.1,j*0.1),0,1,0.5,2.5)
        blendMode(DODGE)
      } else if(b>97){
        alphaCol = color('#000000')
        alpha = map(noise(i*0.1,j*0.1),0,1,0.5,1.5)
        blendMode(BURN)
      } else {
        if(random()>0.5){
          alphaCol = color('#fdfdfd')
          alpha = map(noise(i*0.1,j*0.1),0,1,2,5)
          blendMode(DODGE)
        } else {
          alphaCol = color('#000000')
          alpha = map(noise(i*0.1,j*0.1),0,1,1,2.5)
          blendMode(BURN)
        }
      }
      alphaCol.setAlpha(alpha)
      fill(alphaCol)
      let xOff = map(noise(i,j),0,1,divSize*-0.5,divSize*0.5)
      let yOff = map(noise(i,j),0,1,divSize*-1,divSize*1)
      for(let k=0;k<random(1,2);k++){
        let irregularSize = map(noise(i*0.5,j*0.5,k),0,1,divSize*0.8,divSize*4)
        irregularShape(i*divSize+xOff,j*divSize+yOff,irregularSize)  
      }
    }
  }
  pop()
}

function draw() {
  randomSeed(fxrand()*999999)
  noiseSeed(fxrand()*999999)
  
  backgroundTexture()
  
  drawScribbles(random(5))
  
  if(!noFace){
    if(random()>0.5){
      face = random(faces)
    } else {
      face = faces[4]
    }
  }
  
  let faceMask = [
    {x:(face[0].x/cols*ww)+(gridSize/6*random(-wobblyVariance,wobblyVariance)),y:(face[0].y/rows*wh)+(gridSize/6*random(-wobblyVariance,wobblyVariance))},
    {x:(face[1].x/cols*ww)+(gridSize/6*random(-wobblyVariance,wobblyVariance)),y:(face[1].y/rows*wh)+(gridSize/6*random(-wobblyVariance,wobblyVariance))},
    {x:(face[2].x/cols*ww)+(gridSize/6*random(-wobblyVariance,wobblyVariance)),y:(face[2].y/rows*wh)+(gridSize/6*random(-wobblyVariance,wobblyVariance))},
    {x:(face[3].x/cols*ww)+(gridSize/6*random(-wobblyVariance,wobblyVariance)),y:(face[3].y/rows*wh)+(gridSize/6*random(-wobblyVariance,wobblyVariance))},
  ]
  


  alphaCol = color(fg)
  alphaCol.setAlpha(200)
  fill(alphaCol)
  noStroke()
  
  let faceMult = rough?random(14.5,18):random(19,22)
  let facePattern = 1
  
  let faceRendered = false
  if(!noFace&&random()>0.015){
    push()
    alphaCol = color(highlight)
    alphaCol.setAlpha(180)
    fill(alphaCol)
    hatchedRect(0,0,ww,wh, 1, faceMult, facePattern, faceMask)
    pop()
    
    faceRendered=true;
  }
  
  for(let j=0;j<segments.length;j++){
    let segment = segments[j]
    let renderSegment = true
    for(let i=0;i<face.length;i++){
      let a = face[i]
      let b = face[(i+1)%face.length]
      
      if((segment[0].x==a.x&&segment[0].y==a.y&&segment[1].x==b.x&&segment[1].y==b.y)||
        (segment[0].x==b.x&&segment[0].y==b.y&&segment[1].x==a.x&&segment[1].y==a.y)
        ){
         renderSegment = false
       }
    }
    if(renderSegment){
      drawSegment(segment[0],segment[1])  
    }
  }
  
  if(!noFace&&!faceRendered){
    push()
    alphaCol = color(highlight)
    alphaCol.setAlpha(200)
    fill(alphaCol)
    hatchedRect(0,0,ww,wh, 1, faceMult, facePattern, faceMask)
    pop()
  }
  
  // drawCrease()
  
  backgroundTexture()
  addGrain(random(8,10))
  
  fxpreview()
  // saveCanvas(`${fxhash}`,'png')
}

function jaggedLine(x1,y1,x2,y2,thicknessMult,mask){
  let v1 = createVector(x1,y1)
  let v2 = createVector(x2,y2)
  let angleBetween = Math.atan2(y2-y1,x2-x1) 
  let dist = v1.dist(v2)
  
  for(let i=0;i<dist;i+=(ww/random(400,600))){ 
  // /*
    let x = v1.x + (i*Math.cos(angleBetween.toFixed(2))) + (random(-0.001,0.001)*ww)
    let y = v1.y + (i*Math.sin(angleBetween.toFixed(2))) + (random(-0.001,0.001)*ww)
    let thickness = map(noise(random(99999),x/ww,y/wh),0,1,ww/4000*thicknessMult,ww/2800*thicknessMult)
    
    if(random()<0.9999){
      if(typeof mask !== 'undefined'){
        if (isPointInPoly({x:x,y:y},[mask])){
          irregularShape(x,y,thickness*random(0.9,1.1))
        }
      } else {
        irregularShape(x,y,thickness*random(0.9,1.1))
      }
    } else {
      let randX = random()*ww
      let randY = random()*wh
      for(let j=0;j<random(1,3);j++){
        irregularShape(randX+ (random(-0.05,0.05)*ww),randY+ (random(-0.05,0.05)*ww),thickness*random(0.3,0.65))
      }
    }
  // */
  }
}

function irregularShape(x,y,r){
  let verts = []
  let randStart = random(TWO_PI)
  for(let a=randStart;a<TWO_PI+randStart;a+=TWO_PI/random(3,9)){
    let randR = rough?r * random(0.35,0.5):r * random(0.4,0.5)

    let xCoord = x + randR*cos(a)
    let yCoord = y + randR*random(0.9,1)*sin(a)
    
    verts.push({x:xCoord,y:yCoord})
  }
  beginShape()
  for(let i=0;i<verts.length;i++){
    if(rough){
      vertex(verts[i].x,verts[i].y)
    } else {
      curveVertex(verts[i].x,verts[i].y)
    }
  }
  endShape(CLOSE)
}

function isPointInPoly(point,polygons){
  let pt = point
  let c = false;
  for(let k = 0;k<polygons.length;k++){
    let verts = polygons[k]  
    for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
      if (((verts[i].y > pt.y) != (verts[j].y > pt.y)) && (pt.x < (verts[j].x - verts[i].x) * (pt.y - verts[i].y) / (verts[j].y - verts[i].y) + verts[i].x)) c = !c;
    }
  }
  return c;
}

function hatchedRect(x,y,w,h,gap,thicknessMult,pattern,mask){
  let subGridSize = round(gap/450,5) * ww
  // console.log(subGridSize)
  for(let y1=0;y1<h;y1+=subGridSize){
    for(let x1=0;x1<w;x1+=subGridSize){
      switch(pattern){
        case 0:
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1,
          thicknessMult, mask);
          break;
        case 1:
          jaggedLine(
            x+x1,            y+y1,
            x+x1,            y+y1+subGridSize,
          thicknessMult, mask);
          break;
        case 2:
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1+subGridSize,
          thicknessMult, mask);
          break;
        case 3:
          jaggedLine(
            x+x1+subGridSize,y+y1,
            x+x1,            y+y1+subGridSize,
          thicknessMult, mask);
          break;
        case 4:
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1+subGridSize,
          thicknessMult, mask);
          jaggedLine(
            x+x1+subGridSize,y+y1,
            x+x1,            y+y1+subGridSize,
          thicknessMult, mask);
          break;
        case 5:
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1,
            thicknessMult, mask);
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1+subGridSize,
          thicknessMult, mask);
          jaggedLine(
            x+x1+subGridSize,y+y1,
            x+x1,            y+y1+subGridSize,
          thicknessMult, mask);
          break;
      } 
    }
  }
}

function drawSegment(a,b){
  push()
  let v1 = createVector(a.x/cols*ww,a.y/rows*wh)
  let v2 = createVector(b.x/cols*ww,b.y/rows*wh)
  let angleBetween = Math.atan2(b.y-a.y,b.x-a.x) 
  let dist = v1.dist(v2)
  
  let thicknessMult = thick?random(40,80):random(8,28)
  
  for(let i=0;i<dist;i+=(ww/random(1000,1200))){
  let x = v1.x + (i*Math.cos(angleBetween.toFixed(2))) 
  let y = v1.y + (i*Math.sin(angleBetween.toFixed(2))) 
    
    let distorted = createVector(x+map(noise(x/ww*wobblyFactor,y/wh*wobblyFactor),0,1,-gridSize*xVariance,gridSize*xVariance),
  y+map(noise(x/ww*wobblyFactor,y/wh*wobblyFactor),0,1,-gridSize*yVariance,gridSize*yVariance))
    
    let thickness = map(noise(x/ww*thicknessFactor,y/wh*thicknessFactor),0,1,ww/5000*thicknessMult,ww/2000*thicknessMult)
    
    resetMatrix()
    translate(distorted.x+(random(-0.0005,0.0005)*ww),distorted.y+(random(-0.0005,0.0005)*wh))
    rotate(TAU)
    
    if(rough){
      irregularShape(0,0,thickness*random(0.75,0.9),thickness*random(0.5,0.8))
    } else {
      rect(-thickness/2,-thickness/2,thickness*random(0.8,0.9),thickness*random(0.7,0.8),thickness*random(0.5,0.8),thickness*random(0.5,0.8),thickness*random(0.5,0.8))
    }

    rotate(random(TWO_PI))
    if(rough&&random()>0.9){
      for(let j=0;j<random(2,6);j++){
        push()
        fill(random()>0.9?bg:fg)
        irregularShape(thickness*random(-0.33,0.33),thickness*random(-0.33,0.33),thickness*random(0.1,0.2))
        pop()
      }
    }
  }
  pop()
}

function drawScribbles(nbScribbles){
  for(let i=0;i<nbScribbles;i++){
    push()
    let b = brightness(bg)
    let alphaCol
    if(b<=72){ 
      alphaCol = color('#fdfdfd')
    } else if(b>97){
      alphaCol = color('#23120b')
    } else {
      alphaCol = random()>0.5?color('#23120b'):color('#fdfdfd')
    }
    
    
    alphaCol.setAlpha(random(30,40))
    strokeWeight(max(0.5,ww/1500))
    stroke(alphaCol)
    noFill()
    beginShape()
    let verts = random(4,12)
    let v1, v2
    v1 = createVector(random()*ww,random()*wh)
    curveVertex(v1.x,v1.y)
    let angle
    for(let j=0;j<verts;j++){
      do{
        v2 = createVector(random()*ww,random()*wh)
      } while (v1.dist(v2)>ww*0.3)
      curveVertex(v2.x,v2.y)
      v1 = v2
    }
    endShape()
    pop()
  }
}

function addGrain(amount){
  loadPixels()

  for(let i=0;i<(width*pixelDensity())*(height*pixelDensity())*4;i+=4){
    let noise = map(random(),0,1,-amount,amount)
    pixels[i] = pixels[i]+noise
    pixels[i+1] = pixels[i+1]+noise
    pixels[i+2] = pixels[i+2]+noise
    pixels[i+3] = pixels[i+3]+noise
  }

  updatePixels()
}

function weighted_index(list){
  let totalWeight = 0;

  for (let i = 0; i < list.length; i++) {
    totalWeight += list[i];
  }

  let rand = totalWeight * random();
  for (let i = 0; i < list.length; i++) {
    if (rand < list[i]) {
      return i;
    }
    rand -= list[i];
  }
  return list.length-1;
}

function keyPressed(){
  if (keyCode === 82) { // R
    initPiece()
    redraw()
    if(!isLooping) loop()
  }
}