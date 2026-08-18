let colors = []
let rows = 40
let cols = 40
let gridSize
let groundLevel = 8
let firstTimeRender = true
let lastRendered
let date = 0
let seconds = 0
let minutes = 0
let hours = 0
let day = 0
let month = 0
let hoursRange

// features
let scheme
let solid = false
let numberOfBuildings
let mode
let fxrandBirthday

let buildingVars = []

function setupCanvas(){
  createCanvas(min(window.innerWidth,window.innerHeight),min(window.innerWidth,window.innerHeight));
  gridSize = width/cols
}

function windowResized(){
  setupCanvas()
  
  render()
}

function setup() {
  setupCanvas()
  pixelDensity(2) 
  
  hoursRange = {'start':6,'end':18}
  
  // Features
  scheme = ['Light','Dark','Mondrian','Blueprint'][random_int(0,3)]
  numberOfBuildings = random_int(2,28)
  mode = fxrand()>0.5?'Night':'Day'
  fxrandBirthday = getRandomDateObj()
  
  switch(scheme){
    case 'Dark':
      colors = ['#23120b','#F1F1F1']
      mode = 'Night'
      break;
    case 'Light':
      colors = ['#F1F1F1','#23120b']
      mode = 'Day'
      break;
    case 'Mondrian':
      colors = ['#F1F1F1','#dd0100','#225095','#FDB827']
      solid = fxrand()>0.9?true:false
      break;
    case 'Blueprint':
      colors = ['#225095','#F1F1F1']
      break;
  }
  
  for(let i=0;i<numberOfBuildings;i++){    
    let alphaColor = colors[random_int(1,colors.length-1)]
    let buildWidth = random_int(1,4)
    let buildHeight = random_int(6,24)
    let startX = random_num(3,cols-3-buildWidth)
    let pattern = random_int(0,5)
    let gap = scheme=='Mondrian'&&solid?27.5:buildWidth*random_int(2.5,3)
    let alpha = random_int(50,140)
    
    let obj = {
      "color":alphaColor,
      "startX":startX,
      "buildWidth":buildWidth,
      "buildHeight":buildHeight,
      "pattern":pattern,
      "gap":gap,
      "alpha":alpha,
    }
    buildingVars.push(obj)
  }
  
  // console.log(buildingVars)
  
  let features = {
    "Style":scheme,
    "Density":getFeatureString("density",numberOfBuildings),
    "Setting":mode,
    "Solid":solid,
    "City Day":getFeatureString('City Day',fxrandBirthday)
  }
  
  console.log(features)
  
  window.$fxhashFeatures = features;
}

function getFeatureString(feature,value) {
  if(feature=="density"){
    if (value < 10) return "Low"
    if (value < 20) return "Medium"
    else return "High"
  } else if(feature=="City Day"){
    return `${value.day} ${monthNames[value.month]}`
  }
}

function draw(){
  date = new Date();
  seconds = date.getSeconds();
  minutes = date.getMinutes();
  hours = date.getHours();
  day = date.getDate();
  month = date.getMonth();
  
  if(firstTimeRender){
    render()
    firstTimeRender = false
  } else {
    if(lastRendered!=minutes){
      render()
    }
  }
}

function render() {
  lastRendered = minutes
  background(colors[0]);

  if(
    (mode=='Day'&&(hours>=hoursRange.start&&hours<=hoursRange.end))||(mode=='Night'&&(hours>=hoursRange.end||hours<hoursRange.start))){
      drawSunMoon()
    }
  
  if((month==0&&day==1&&hours==0)||(month==fxrandBirthday.month&&day==fxrandBirthday.day)){
    drawSurprise()
  }
  
  for(let i=0;i<numberOfBuildings;i++){    
    let alphaColor = color(buildingVars[i].color)
    alphaColor.setAlpha(buildingVars[i].alpha)
    noStroke()
    fill(alphaColor)
    let x = (buildingVars[i].startX/cols)*width
    let y = (rows-groundLevel-buildingVars[i].buildHeight)/rows*height
    drawBuilding(x,y,buildingVars[i].buildWidth,buildingVars[i].buildHeight,buildingVars[i].pattern,buildingVars[i].gap)
  }
  
  addGrain(random_int(8,12))
}

function drawBuilding(x,y,buildWidth,buildHeight,pattern,gap){
  let subGridSize = (buildWidth/cols*width)/gap;
  let strokeMult = 4
  for(let y1=0;y1<buildHeight/rows*height;y1+=subGridSize){
    for(let x1=0;x1<buildWidth/cols*width;x1+=subGridSize){
      switch(pattern){
        case 0:
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1,
          strokeMult);
          break;
        case 1:
          jaggedLine(
            x+x1,            y+y1,
            x+x1,            y+y1+subGridSize,
          strokeMult);
          break;
        case 2:
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1+subGridSize,
          strokeMult);
          break;
        case 3:
          jaggedLine(
            x+x1+subGridSize,y+y1,
            x+x1,            y+y1+subGridSize,
          strokeMult);
          break;
        case 4:
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1+subGridSize,
          strokeMult);
          jaggedLine(
            x+x1+subGridSize,y+y1,
            x+x1,            y+y1+subGridSize,
          strokeMult);
          break;
        case 5:
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1,
            strokeMult);
          jaggedLine(
            x+x1,            y+y1,
            x+x1+subGridSize,y+y1+subGridSize,
          strokeMult);
          jaggedLine(
            x+x1+subGridSize,y+y1,
            x+x1,            y+y1+subGridSize,
          strokeMult);
          break;
      } 
    }
  }
}

function drawSunMoon(){
  push()
  
  let startAngle = -55
  let endAngle = -140
  let currAngle
  if(mode == 'Day'){
    currAngle = map(hours+(minutes/60),hoursRange.start,hoursRange.end,startAngle,endAngle)
  } else {
    currAngle = map(((hours<=6)?hours+24:hours)+(minutes/60),hoursRange.end,24+hoursRange.start,startAngle,endAngle)
  }
  let originX = (width/2) + (width*Math.cos(radians(currAngle)))
  let originY = (height*1.3) + (height*1.2*Math.sin(radians(currAngle)))
  translate(originX,originY)
  
  let alphaColor
  switch(scheme){
    case 'Dark':
    case 'Light':
      alphaColor = color('#FDB827');
      break;
    case 'Mondrian':
      alphaColor = color('#23120b');
      break;
    case 'Blueprint':
      alphaColor = color('#F1F1F1')
      break;
  }
  alphaColor.setAlpha(round(random(120,150)))
  fill(alphaColor)
  noStroke()
  let r = width/8
  let lineSpacing = width/(width/(scheme=='Mondrian'?1.25:4));
  let circleLines = (r*2) / lineSpacing;
  
  for (let i=0;i<=circleLines;i++) {
    let sagittaLength = (i*lineSpacing) + lineSpacing;
    let chordLength = (Math.sqrt((2*sagittaLength*r) - (sagittaLength*sagittaLength))*2);
    let x1 = r - (chordLength/2)
    let y = i*lineSpacing
    let x2 = r - (chordLength/2) + chordLength
    jaggedLine(x1,y,x2,y,4)
  }
  pop()
}

function drawSurprise(){
  push()
  colorMode(HSB)
  noStroke()
  let numberOfSurprises = random(2,8)
  
  for (let j=0;j<numberOfSurprises;j++){
    let originX = random(2,rows-2)/cols*width
    let originY = random(4,16)/rows*height

    let increment = random(8,20)
    for (let i=0;i<TWO_PI;i+=radians(increment)){
      
      let alphaColor = color(random(360),30,85,0.75)
      fill(alphaColor)
      
      let multFactor = round(random(1,4))
      let r = random(0.25*multFactor,0.25*multFactor)
      let dist = random(0.1*multFactor,0.4*multFactor)

      let x1 = originX + (r * gridSize * Math.cos(i))
      let y1 = originY + (r * gridSize * Math.sin(i))
      let x2 = originX + ((r+dist) * gridSize * Math.cos(i))
      let y2 = originY + ((r+dist) * gridSize * Math.sin(i))

      jaggedLine(x1,y1,x2,y2,mode=='Night'?3.5:2.5)
    }
  }
  pop()
}

function jaggedLine(x1,y1,x2,y2,strokeMult){
  let v1 = createVector(x1,y1)
  let v2 = createVector(x2,y2)
  let angleBetween = Math.atan2(y2-y1,x2-x1);
  let dist = v1.dist(v2)
  
  for(let i=0;i<dist;i+=(width/random(3000,800))){
    let thickness = map(noise(random(10000),i*1),0,1,width/2000*strokeMult,width/900*strokeMult)
    let x = v1.x + (i*Math.cos(angleBetween.toFixed(2))) + random(-0.2,0.2)
    let y = v1.y + (i*Math.sin(angleBetween.toFixed(2))) + random(-0.2,0.2)
    
    if(y<(rows-groundLevel)/rows*height){
      ellipse(x,y,thickness)
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

function getRandomDateObj(){
	let date = new Date(Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365.25));
	return {'month':date.getMonth(),'day':date.getDate()}
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
  };
}