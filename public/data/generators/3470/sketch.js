let colors = []
let gridH
let gridW
let cols
let rows
let startX
let endX
let startY
let endY
let lastCount = 0

let blockVars = []

// features
let scheme

function setupCanvas(){
  createCanvas(min(window.innerWidth,window.innerHeight),min(window.innerWidth,window.innerHeight));
  pixelDensity(2) 
  
  gridW = width/cols
  gridH = height/rows
  
  background(colors[0]);
}

function windowResized(){
  clear()
  setupCanvas()
  
  lastCount = 0
  loop()
  redraw()
}

function setup() {
  cols = round(random_int(10,40)/2)*2
  rows = round(random_int(10,80)/2)*2
  
  // Features
  scheme = ['Georg','Manfred','Josef','Sol','Vera'][random_int(0,4)]
  
  switch(scheme){
    case 'Manfred':
      colors = ['#23120b','#F1F1F1']
      break;
    case 'Georg':
      colors = ['#F1F1F1','#23120b']
      break;
    case 'Josef':
      colors = ['#F1F1F1','#225095']
      break;
    case 'Vera':
      colors = ['#F1F1F1','#dd0100']
      break;
    case 'Sol':
      colors = ['#F1F1F1','#3162c3','#279a29','#f51022','#f8df20','#f25519','#960083']
      break;
  }
  
  startX = random_num(0.1,0.45)
  endX = random_num(0.55,0.9)
  startY = random_num(0.15,0.45)
  endY = random_num(0.55,0.85)
  let explodingCol = cols*random_num(startX,endX)
  
  let numberOfBlocks = ((endX-startX)*cols)*((endY-startY)*rows)
  
  let defaultJitter = fxrand()
  
  for(let x=round(cols*startX);x<cols*endX;x++){
    for(let y=round(rows*startY);y<rows*endY;y++){        
      let randColor = color(colors[random_int(1,colors.length-1)])
      
      let explodingFactorY = random_num(0.5,5)
      let explodingFactorX = explodingFactorY+2
      let xOffset = random_num(0,max(0,(x-explodingCol))*max(0,(x-explodingCol))*explodingFactorX)
      let yOffset = random_num(0,max(0,(x-explodingCol))*max(0,(x-explodingCol))*explodingFactorY)
      let rotation = random(-defaultJitter,defaultJitter)+random_num(-max(0,(x-explodingCol))*max(0,(x-explodingCol))*5,max(0,(x-explodingCol))*max(0,(x-explodingCol))*5)+(random_num(-0.3,0.3))
      
      let obj = {
        'color':randColor,
        'xOffset':xOffset,
        'yOffset':yOffset,
        'rotation':rotation,
        'explodingFactorX':explodingFactorX,
        'explodingFactorY':explodingFactorY,
        'defaultJitter':defaultJitter
      }
      blockVars.push(obj)
    }
  }
  
  let features = {
    "Style":scheme,
    "Shape":getFeatureString("shape",{cols:cols,rows:rows}),
    "Volatility":getFeatureString("volatility",{startX:startX,endX:endX,explodingCol:explodingCol}),
  }
  
  console.log(features)
  
  window.$fxhashFeatures = features;
  
  setupCanvas()
  addGrain(random_int(8,12))
  noStroke();
}

function getFeatureString(feature,value) {
  if(feature=="volatility"){
    let range = abs(startX-endX)*cols
    if (value.explodingCol > (endX*cols)-(range/2.8)){
      return 'Low'
    } else {
      return 'High'
    }
  } else if(feature=="shape"){
    if(value.cols==value.rows){
      return "Square"
    } else if (value.cols<value.rows){
      return "Wide"
    } else if (value.cols>value.rows){
      return "Tall"
    }
  }
}

function draw(){
  if(lastCount==blockVars.length){
    noLoop();
  } else {
    render()
  }
}

function render() {
  
  let currCount = 0
  for(let x=round(cols*startX);x<cols*endX;x++){
    for(let y=round(rows*startY);y<rows*endY;y++){ 
      if(currCount==lastCount){
        colorMode(HSB)
        let blockColor = color(
          hue(blockVars[currCount].color),
          saturation(blockVars[currCount].color),
          brightness(blockVars[currCount].color)+random(-10,10)
        )
        blockColor.setAlpha(random(0.8,1))
        fill(blockColor)
        
        let xOffset = blockVars[currCount].xOffset
        let yOffset = blockVars[currCount].yOffset
        if((mouseX>x*gridW&&mouseX<x*gridW+gridW)&&
          (mouseY>y*gridH&&mouseY<y*gridH+gridH)){
          xOffset = 0
          yOffset = 0
        }
        
        jaggedBlock(
          x*gridW+xOffset,
          y*gridH+yOffset,
          gridW,
          gridH,
          radians(blockVars[currCount].rotation),
          8
        )
      }
      currCount++
    }
  }
  lastCount++
}

function jaggedBlock(x1,y1,w,h,angle,strokeMult){
  for(let j=0;j<h;j+=(width/800)){
    let v1 = createVector(x1+(j*Math.cos(angle+89.5)),y1+(j*Math.sin(angle+89.5)))
    let v2 = createVector(v1.x+(w*Math.cos(angle)),v1.y+(w*Math.sin(angle)))
    let dist = v1.dist(v2)
    
    for(let i=0;i<dist;i+=(width/random(1500,800))){
      let thickness = map(noise(random(10000),i*1),0,1,width/8000*strokeMult,width/3000*strokeMult)
      let x = v1.x + (i*Math.cos(angle) + random(-0.2,0.2))
      let y = v1.y + (i*Math.sin(angle) + random(-0.2,0.2))

      ellipse(x,y,thickness,thickness*0.8)

    }
  }
}

function addGrain(amount){
  loadPixels()

  for(let i=0;i<(width*pixelDensity())*(height*pixelDensity())*4;i+=4){
    let noise = map(fxrand(),0,1,-amount,amount)
    pixels[i] = pixels[i]+noise
    pixels[i+1] = pixels[i+1]+noise
    pixels[i+2] = pixels[i+2]+noise
    pixels[i+3] = pixels[i+3]+noise
  }

  updatePixels()
}

function random_num(a, b) {
    return a+(b-a)*fxrand()
  }
function random_int(a, b) {
  return Math.floor(random_num(a, b+1))
}

window.onkeydown = function(e) {
  if(e.keyCode===68){
    pixelDensity(pixelDensity()==2?4:2)
    console.log(`Pixel Density set to ${pixelDensity()}`)
    render()
  }
  return false;
}