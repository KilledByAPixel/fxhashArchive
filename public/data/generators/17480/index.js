//const utils = require('./utils');
// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm

const deviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
  }
  else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "mobile";
  }
  return "desktop";
};


let globalBCount = 0

// main structure
let mainStruct = getRandomIntOut(0,14)
//reduce the chance of technical and chaotic settlement
if([1,3,6,8].includes(mainStruct)){mainStruct = getRandomIntOut(0,18)}
if([8].includes(mainStruct)){mainStruct = getRandomIntOut(0,18)}
if(mainStruct == 12){mainStruct = 11}
if([15,16,17].includes(mainStruct)){mainStruct = 14}
if(getRandomOut()<0.1){mainStruct = 11}
if(getRandomOut()<0.1){mainStruct = 14}
// Colors to combine from
let colors = [[0,0,0], [255, 255, 255], [255, 217, 172], [19, 20, 22],[81, 71, 22], [208, 200, 179],[186, 180, 154], [47, 74, 67],[212, 168, 9], [252, 208, 179], [190, 53, 17],
  [95, 79, 53], [246, 203, 0], [39, 43, 44], [185, 36, 55], [70, 73, 78], [129, 134, 138], [175, 179, 180], [229, 196, 83], [255, 220, 49], [249, 218, 91]]
///////// COLORS 
let colorParams = getColors(colors)
let bckColor = colorParams[0]
let stkColor = colorParams[1]
let bckIsDarker = colorParams[2]
let colSum = colorParams[3]

// Avoid technical with darker background
if([1,3,4,5,6,8,9,13].includes(mainStruct)){
  for (let i = 0; i < 100; i++) {
    colorParams = getColors(colors)
    bckColor = colorParams[0]
    stkColor = colorParams[1]
    bckIsDarker = colorParams[2]
    colSum = colorParams[3]
    if(!bckIsDarker){break}
  }
}

/////////////////////// BLACK AND WHITE
let rC = getRandomOut()
if (rC<0.1){
  bckColor = [255,255,255]
  stkColor = [0,0,0]
  colSum = 765
  bckIsDarker = false
}
else if (rC < 0.22){
  bckColor = [255,217,172]
  stkColor = [19,20,22]
  colSum = 705
  bckIsDarker = false
}


// Get a hint of other color 
colors = shuffle(colors)
specialColor = stkColor
let difBckVal = 40
let difStkVal = 60

if(bckIsDarker){
  specialColor = bckColor
  difStkVal = 110
}
for(let i =0; i < colors.length; i += 1){
  let difBck = Math.abs(colors[i][0] - bckColor[0]) + Math.abs(colors[i][1] - bckColor[1]) + Math.abs(colors[i][1] - bckColor[1])
  let difStk = Math.abs(colors[i][0] - stkColor[0]) + Math.abs(colors[i][1] - stkColor[1]) + Math.abs(colors[i][1] - stkColor[1])
  let sumStk = colors[i][0] + colors[i][1] + colors[i][2]
  if (difBck > difBckVal && difStk > difStkVal && sumStk != 0){
    specialColor = colors[i]
    break
  }
}


/// CLASSIC BP COLOR
let colorBP = [57,86,217]
let stkBP = [230,230,230]
let specialBP = [20,50,207]


// Rare palette
let rarePalette = getRandomOut(0,256) > 220
if(rarePalette){
  let uniqueBck = [182,39,67] 
  let uniqueStk = [22,22,22]
  let uniqueSpecial = [213,174,62]
  bckColor = uniqueBck
  stkColor = uniqueStk
  specialColor = uniqueSpecial
}



//////////////////////// PARAMETERS ------------------------------- BLUEPRINTS
let pg
let pgAnim
let canvasSize = 250
let P0 = [canvasSize/2, canvasSize/2]

//List probability generation. Includes n in the list
let LP = (n) => {l=[];for(let i =0; i < n+1; i += 1){if(getRandomOut()>0.5){l.push(i)}};if(l.length==0){l=[0]};return l}


let annotationDensity = getRandomOut(0.1,1)
let bDensity = getRandomOut(0.5,1)
let sWOut = 1.5 //Stroke Width
let parallelSecond = getRandomOut() < 0.9
let parallelThird = getRandomOut() < 0.9
parallelSecond = true
parallelThird = true



let buildColors1 = getRandomIntOut(0,3) //0: all fill, 1: no fill, 2: combo
let buildColors2 = getRandomIntOut(0,3)
let buildColors3 = getRandomIntOut(0,3)
let metaLength =getRandomOut(0.2,1)

//0:rect 1:circle 2,3:triangle
let annoType = LP(4)

let archiMode = false
if(mainStruct == 10){archiMode = true}
let letterType = getRandomIntOut(0,3) //0:vertical 1:horizontal 2:combo
let buildingsFirst = getRandomIntOut(0,2)
//0: rect, 1:meta 2:metawithall 3: circle 4,5:bendrect
let buildingEdgeType = LP(5)
let organic = getRandomIntOut(0,20) > 18
let nVegZones = getRandomIntOut(0,5)
if(organic){buildingEdgeType = [6,7]}
if(archiMode){
  buildingEdgeType = [0],
  mainStruct = 10,
  annoType = [0,4]
}



let SEED = parseInt(fxrand() * 100000000)
let sW //LIKE ADJUST

let nTZones = getRandomIntOut(2,5)
let txtZones
let txtParams

let movedLines1
let movedLines2
let movedLines3
let animLines

let pixelIncrement
// this code writes the values to the DOM as an example
function setup(){
  intro()
}
let frame = 0 //global variable to get the time passed
let animating = false
function draw() {
  if(frame == 15){
    blueprint(false, true)
    anno()
    myResize()
  }
  if(frame > 15 && animating){
    anno()
    frame ++
  }
  if(frame<16){
    frame ++
  }
}


function myResize(){
  if (windowWidth < windowHeight) { screenSize = windowWidth}
  else {screenSize = windowHeight}
  resizeCanvas(screenSize, screenSize, false)
  image(pg, 0,0, screenSize, screenSize)
  image(pgAnim, 0,0, screenSize, screenSize)
}


let countTouch = 0
let activate = false
let extraSpeed = 1
let showSpeed = 1000
function touchStarted(){
  if(countTouch == 0){
    animating = true
    activate = true
  }
  else{
    if(!activate){
      extraSpeed += 0.1
      showSpeed = 0
    }

  }
  countTouch ++
}

function windowResized() {
  myResize()
  }

let passw = ""
let isBP = false
function keyTyped() {
  let fileName = classification + '-blueprint.png'
  animating = false
  if (key === "1" || key === "1"){
    blueprint(4000, true)
    anno()
    saveMultiCanvas(fileName)
  }
  else if (key === "2" || key === "2"){
    blueprint(6000, true)
    anno()
    saveMultiCanvas(fileName)
  }
  else if (key === "3" || key === "3"){
    blueprint(8000, true)
    anno()
    saveMultiCanvas(fileName)
  }
  blueprint(false, true)
  animating = true

  passw += key
  if(passw.includes("blueprint") || passw.includes("BLUEPRINT")){
    bckColor = colorBP
    stkColor = stkBP
    specialColor = specialBP
    colors = [specialBP]
    animating = false
    blueprint(false, true)
    animating = true
    passw = ""
  }
}

function saveMultiCanvas(fileName){
  let e=createGraphics(canvasSize, canvasSize);
  e.pixelDensity(pixelIncrement)
  e.fill(bckColor),
  e.noStroke(),
  e.rect(0,0,canvasSize,canvasSize),
  e._renderer.blend.call(e,pg,0,0,canvasSize,canvasSize,0,0,canvasSize,canvasSize,blendMode),
  e._renderer.blend.call(e,pgAnim,0,0,canvasSize,canvasSize,0,0,canvasSize,canvasSize,blendMode),
  save(e,fileName)
  e.clear()
  e.pixelDensity(0)
  
}


// DEFINE TOKEN ATTRIBUTES ---------------------------------------------------------------------------
let paramColor = getPalette(colSum)
if(rarePalette){paramColor = "Starboy"}
let vegetationParam = (nVegZones * 25).toString() + "%"
let mainShapesDescription = buildName(buildingEdgeType)
if(organic){
  mainShapesDescription = "Contains blobby shapes"
}
let classification = structDescription(mainStruct)
let dateOfEmission = ""
window.$fxhashFeatures = {
  "Clasification": classification,
  "Palette": paramColor,
  "Main Shapes": mainShapesDescription,
  "Vegetation": vegetationParam,
  "Blobby": organic,
}



let nAnno = getRandomIntOut(30, 100)
if([3,6].includes(mainStruct)){nAnno = 15} //technical mode
let annoData
let movingData
let habitData
let device = deviceType()
let isPhone = ["mobile", "tablet"].includes(device)
function intro(){
    
    //WEB BACK COLOR
    let c = "rgb(" + String(bckColor[0]) + "," + String(bckColor[1]) + "," + String(bckColor[2]) + ")"
    document.body.style.backgroundColor = c
    pg = createGraphics(canvasSize, canvasSize)
    let outSize = [windowWidth, windowHeight].sort((a, b) => a - b)[0]

  if(!isPhone){
    if(outSize < 2000){
      outSize = 2000
    }
    pixelIncrement = outSize/canvasSize
    if(pixelIncrement<pg.pixelDensity()){
      pixelIncrement = pg.pixelDensity()
    }
    pg.pixelDensity(pixelIncrement)
  }


    pgAnim = createGraphics(canvasSize, canvasSize)

    // Animation parameters
    annoData = setAnnoScale(nAnno)
    movingData = setMovingObjs(1000)
    // ADD TEXT
    let extra = 1
    if(device == "desktop"){extra = 0.7}
      pg.fill(stkColor);
      pg.textAlign(CENTER);
      pg.textSize(0.04 * canvasSize);
      pg.text('BLUEPRINT', canvasSize/2, canvasSize/2);
      pg.fill(specialColor);
      pg.textSize(0.015 * canvasSize);
      pg.text('decoding', canvasSize/2, canvasSize/2 - canvasSize*0.045);
      pg.fill(stkColor)
      pg.textSize(0.015 * canvasSize);
      pg.text(classification, canvasSize/2, canvasSize/2 + canvasSize*0.032);
      

      // TEXT BP
      pg.stroke(stkColor)
      pg.noFill()
      pg.strokeWeight(0.001 * canvasSize)
      let nLines = getRandomInt(1,5)
      let lineIncrement = canvasSize * 0.02 
      let bpTextY = canvasSize/2 + canvasSize * 0.055

      for (let i = 0; i < nLines; i++) {
        let displacement = canvasSize * getRandom(0.2,0.33)
        textLine([[displacement, bpTextY], [canvasSize - displacement, bpTextY]], 0.006 * canvasSize)
        bpTextY += lineIncrement        
      }

      pg.strokeWeight(0)
      pg.fill(specialColor);
      pg.textSize(0.01 * canvasSize);
      pg.text('by Ismahelio', canvasSize/2, bpTextY + lineIncrement);
      
      // Square detail - ICONS
      pg.stroke(stkColor)
      pg.strokeWeight(0.01 * canvasSize)
      let canvasSizembolY = canvasSize * 0.4
      let canvasSizembolSize = canvasSize * 0.05
      rectangle([canvasSize * 0.4 ,canvasSizembolY], [0,1], canvasSizembolSize, canvasSizembolSize, true)
      pg.strokeWeight(0.001 * canvasSize)
      randomSeed(mainStruct)
      textLine([[canvasSize * 0.45, canvasSizembolY], [canvasSize * 0.6, canvasSizembolY]], 0.006 * canvasSize)


    myResize()

}

function blueprint(pixelD = false, drawText = true){
  // adjust the sizes + strokes
  randomSeed(SEED)

  offset = 0.1
  globalBCount = 0
  //WEB BACK COLOR
  let c = "rgb(" + String(bckColor[0]) + "," + String(bckColor[1]) + "," + String(bckColor[2]) + ")"
  document.body.style.backgroundColor = c
  //////////////////// STRUCTURE SETUP 
  let edges1 = []
  let edges2 = []
  let edges3 = []
  /////------- Original Structure
  if(!archiMode){
    edges1 = primaryEdges(mainStruct)
    //get main shape to balance the lenght 
    let edges1Lenghts = edges1.map(x=>dist2pts(x[0],x[1]))
    let averageEdges1 = edges1Lenghts.reduce((a, b) => a + b, 0) / edges1Lenghts.length;
    if([11,14].includes(mainStruct) ){averageEdges1 *= 0.35}
    if([4,5,13].includes(mainStruct)){averageEdges1 *= getRandom(0.6,0.8)}
    if([13].includes(mainStruct)){ //reduce density
      let edges1reduced = []
      edges1.map(e => {if(getRandom()>0.3){edges1reduced.push(e)}})
      edges1 = edges1reduced
    }
    edges2 = secondaryEdges(edges1, getRandom(averageEdges1,averageEdges1*0.4),  getRandom(averageEdges1,averageEdges1*0.4), parallelSecond)
    let edges2Lenghts = edges2.map(x=>dist2pts(x[0],x[1]))
    let average = edges2Lenghts.reduce((a, b) => a + b, 0) / edges2Lenghts.length;
    edges3 = secondaryEdges(edges2, average, average*0.2, parallelThird, true)  
  }
  else{
    ///// --------- Architectural structure
    edges1 = primaryEdges(10)
    //get main shape to balance the lenght 
    let edges1Lenghts = edges1.map(x=>dist2pts(x[0],x[1]))
    const averageEdges1 = edges1Lenghts.reduce((a, b) => a + b, 0) / edges1Lenghts.length;
    let edgesX2 = edges1.concat(edges1)
    let edges2_3 = secondaryEdges(edgesX2, getRandom(averageEdges1,averageEdges1*0.4),  getRandom(averageEdges1*0.2,averageEdges1*0.4), parallelSecond, true)

    edges2_3.forEach(e => {
      let s = getRandomInt(0,2)
      if(s==0){edges2.push(e)}
      else{edges3.push(e)}
    });
  }
 
 
  annoDens = annotationDensity/(edges1.length*0.04)

  allEdges = (edges1.concat(edges2)).concat(edges3)
  let allPts = allEdges.flat() //just points
  let dom = domain(allPts)
  let wCanvas = dom[1]
  let hCanvas = dom[2]
  let minXdom= dom[3]
  let minYdom= dom[4]
  let ratioW = 1
  let ratioH = 1
  let displX = 0
  let displY = 0
  ////// Remap canvas
  if(wCanvas>hCanvas){
    ratioH = hCanvas/wCanvas
    displY = (canvasSize - (canvasSize * ratioH))/2
  }
  else{
    ratioW = wCanvas/hCanvas
    displX = (canvasSize - (canvasSize * ratioW))/2
  }



  offset = canvasSize * getRandom(0.05,0.1)
  //// REMAP
  movedLines1 = remapEdges(edges1, minXdom+wCanvas, minXdom, canvasSize, minYdom+hCanvas, minYdom, canvasSize, offset, displX, displY)
  movedLines2 = remapEdges(edges2, minXdom+wCanvas, minXdom, canvasSize, minYdom+hCanvas, minYdom, canvasSize, offset, displX, displY)
  movedLines3 = remapEdges(edges3, minXdom+wCanvas, minXdom, canvasSize, minYdom+hCanvas, minYdom, canvasSize, offset, displX, displY)
  allMovedLines = (movedLines1.concat(movedLines2)).concat(movedLines3)
  allPts = allMovedLines.flat() //just points

  ///////////////// SQUARE CANVAS
  sW = sWOut * adjustStroke(canvasSize)
  //Building size
  let sSizes = formatSize(mainStruct)
  buildW = [sSizes[0]*canvasSize, sSizes[1]*canvasSize]
  buildH = buildW

  ptS = [canvasSize/2, canvasSize/2] //Mid point of canvas
  let outSize = [windowWidth, windowHeight].sort((a, b) => a - b)[0]

  // MODIFY RESOLUTION
  if(!isPhone){

    if(pixelD != false){
      outSize = pixelD
    }
    else{
      if(outSize < 2000){outSize = 2000}
    }
  
    pixelIncrement = outSize/canvasSize
    if(pixelIncrement<pg.pixelDensity()){
      pixelIncrement = pg.pixelDensity()
    }
    
    if(outSize == false){ 
      pixelIncrement = outSize/canvasSize
    }
    pg.pixelDensity(pixelIncrement)
  }



  pg.background(bckColor[0], bckColor[1], bckColor[2]);
  ///////////////////////////////////////////////////////////////
  pg.fill(stkColor)
  pg.textSize(12);


  //Rectangle to frame
  pg.stroke(stkColor)
  pg.noFill()
  pg.strokeWeight(sW)
  dash()
  
    /////// Background GRID
    pg.fill(stkColor)
    pg.stroke(choice([specialColor, stkColor]))
    pg.stroke(specialColor)
    pg.strokeWeight(sW/10)
    dash(false)
    grid(offset, canvasSize - (offset*2), canvasSize - (offset*2),sW/10 , specialColor, stkColor, bckColor)

    //////// BACKGROUND TEXT Props//////////////////////////////////////////////////////////////////////////////////////////////
    txtZones = evaluateRectangle(P0, canvasSize, allPts)
    /////// Background text Params////////////////////
    txtParams = []
    let maxTxtBlock = []
    let txtParamsCol = choice([specialColor, stkColor])
    for (let i = 0; i < nTZones; i++) {
      let textSize = getRandom(canvasSize * 0.005, canvasSize * 0.002)
      let txtParamsStk = sW/getRandom(10,16)
      let lineTextL = getRandom(canvasSize * 0.2, canvasSize*0.05)
      let z = txtZones[i]
      let v = [z[2], choice([1,-1])]
      let p = mv(z[0], v_mult(v, z[1]*getRandom(0.35,0.4)))
      let nLines = int((z[1]/textSize) * getRandom(1,2))
      let txtParamsInd = [txtParamsCol, txtParamsStk, textSize, lineTextL, z, v, p, nLines]
      txtParams.push(txtParamsInd)
      maxTxtBlock.push(nLines)
    }

    //redraw with new size: add text at once
    let maxTxtBlock_ = maxTxtBlock.sort((a, b) => a - b)[0]
    if(drawText){
      for (let i = 0; i < maxTxtBlock_; i++) {
        loadText(i)       
      }
    }



  let densities = [getRandom(0.1, 0.5), getRandom(0.05, 0.3), getRandom(0.05, 0.2)]
  densities = shuffle(densities)
  let b1Density = densities[0]
  let b2Density = densities[1]
  let b3Density = densities[2]
  //compensate if too empty
  if (edges1.length < 6){
    bDensity = 1
    b1Density = 1
  }
  //Rectangle or grid
  if([4,5,13].includes(mainStruct)){
    b1Density = getRandom(0.1, 0.5)
    b2Density = getRandom(0.05, 0.2)
    b3Density = getRandom(0.05, 0.1)
  }
  //organic
  if(organic){
    b1Density = getRandom(0.5, 0.8)
    b2Density = getRandom(0.3, 0.5)
    b3Density = getRandom(0.05, 0.2)
  }
  let adjustDens1 = b1Density > b2Density && b1Density > b3Density
  let adjustDens2 = b2Density > b1Density && b2Density > b3Density
  let adjustDens3 = b3Density > b2Density && b3Density > b1Density

  // Reduce Density for chaotic settlements
  if([4,5,9,11,13,14].includes(mainStruct) || archiMode){
    b2Density = 0
    b3Density = 0
    b1Density = 0.4
  }



  // Functions to draw the massing
  let dB1 = (large) =>  draw_buildings(movedLines1, stkColor, b1Density, bckColor, sW, buildColors1, bDensity, buildingEdgeType, metaLength, buildW,false, [canvasSize, canvasSize], adjustDens1, large)
  let dB2 = () =>  draw_buildings(movedLines2, stkColor, b2Density, bckColor, sW, buildColors2, bDensity, buildingEdgeType, metaLength, buildW,false, [canvasSize, canvasSize], adjustDens2)
  let dB3 = () =>  draw_buildings(movedLines3, stkColor, b3Density * 0.5, bckColor, sW, buildColors3, bDensity * 0.5, buildingEdgeType, metaLength, buildW,false, [canvasSize, canvasSize], adjustDens3)
  let dBSpecial = () =>  draw_buildings(choice([movedLines1, movedLines2, movedLines3]), stkColor, 0.1, specialColor, sW, buildColors1, bDensity, buildingEdgeType, metaLength, buildW,true, [canvasSize, canvasSize], adjustDens1)

  let largestEdge
  let lEl
  allMovedLines.map(l => {
    if(largestEdge!=null){
      let d = dist2pts(l[0], l[1])
      if(d > lEl){
        largestEdge=l
        lEl=d
      }
    }
    else{
      largestEdge = l
      lEl = dist2pts(largestEdge[0], largestEdge[1])
    }
  })
  if(mainStruct == 9){
    let x = getRandom(0.3,0.7) * canvasSize
    let y1 = getRandom(0.1,0.2) * canvasSize
    let y2 = getRandom(0.8,0.9) * canvasSize
    largestEdge = [[x, y1],[x, y2]]
  }

  //////// MAIN EDGES
    pg.strokeWeight(sW/2)
    pg.stroke(stkColor)
    movedLines1.map(x => {dash(false); pg.line(x[0][0], x[0][1], x[1][0], x[1][1])})
    dash(false)
    movedLines1.map(x => { for (let i = 0; i < getRandomInt(1,4) ; i += 1){
      brokenLine(x, 5, canvasSize * getRandom(0.05,0.01), [sW/5, sW/3], stkColor)
    }})
    movedLines1.map(x => {[...Array(getRandomInt(0,10)).keys()].forEach(i=>rectangle(mv(evaluateCurve(x,getRandom()),randomV(5)), v2pt(x[0],x[1]),canvasSize * getRandom(0.001,0.005),canvasSize * getRandom(0.001,0.005)));})
    
  
 
  dB1()
 


  /////// SECONDARY EDGES
  pg.stroke(stkColor)
  pg.strokeWeight(sW/3)
  movedLines2.map(x => {dash(); pg.line(x[0][0], x[0][1], x[1][0], x[1][1])})
  movedLines2.map(x => {if (getRandom(0,1) < 0.5) {dash(); brokenLine(x, 3, canvasSize * getRandom(0.05,0.01), [sW/3, sW/2], stkColor)}})
  dash(false)
  pg.fill(stkColor)
  pg.stroke(stkColor)
  pg.strokeWeight(sW*0.2)
  let specialDetail = getRandomInt(10,30)
  let detailSizeSec = () => { return canvasSize * getRandom(0.001,0.005)}
  movedLines2.map(x => {[...Array(getRandomInt(0,specialDetail)).keys()].forEach(i=>rectangle(mv(evaluateCurve(x,getRandom()),randomV(5)), v2pt(x[0],x[1]),detailSizeSec() ,detailSizeSec()));})
  pg.noFill()
  pg.stroke(stkColor)
  movedLines2.map(x => {[...Array(getRandomInt(0,10)).keys()].forEach(i=>rectangle(mv(evaluateCurve(x,getRandom()),randomV(5)), v2pt(x[0],x[1]),detailSizeSec(),detailSizeSec()));})


  ////// Vegetation

  let maxVegSize = getRandom(0.007,0.025)
      //let ptTrees = [txtZones[0][0],txtZones[1][0]]
      let ptTrees = []
      for (let i = 0; i < nVegZones; i++) {
        ptTrees.push(txtZones[i][0])
      }
      pg.noFill()
      pg.stroke(specialColor)
      pg.strokeWeight(sW*0.3)
      pg.fill(bckColor)
      ptTrees.map(p => vegetation(p, [canvasSize/2, canvasSize/2], canvasSize, stkColor, specialColor, maxVegSize))
  


  ////// TERCIARY EDGES
  pg.stroke(stkColor)
  pg.strokeWeight(sW/4)
  animLines = [] //broken lines to add animation
  dash()
  if(getRandomInt(0,2)){
    movedLines3.map(x => { 
      dash(); 
      pg.strokeWeight(sW*getRandom(0.2,0.4))
      pg.stroke(choice([stkColor, specialColor])); 
      lineShifted([[x[0][0], x[0][1]], [x[1][0], x[1][1]]], getRandom(0.01, 0.02)  * canvasSize)}) 
  }
  else{
    movedLines3.map(x => {if (getRandom(0,1) < 0.5) {dash(); 
      let bkL = brokenLine(x, 3, canvasSize * getRandom(0.05,0.01), [sW/3, sW/2], stkColor)
      bkL.map(l => animLines.push(l))
    }})

  }
  dash(false)
  movedLines3.map(x => {if (getRandom(0,1) < 0.5) {dash(); 
  let bkL = brokenLine(x, 3, canvasSize * getRandom(0.05,0.01), [sW/3, sW/2], stkColor)
  bkL.map(l => animLines.push(l))
}})

  // RULER
  
  movedLines3.map(x => {if (getRandom(0,1) < 0.5){pg.stroke(stkColor);ruler(x, canvasSize)}})

  pg.stroke(stkColor)
  let maxDetSize = canvasSize * getRandom(0.001,0.006)
  let detailSize = () => { return maxDetSize * getRandom(0.3,1)}
  pg.strokeWeight(sW*getRandom(0.2,0.4))
  movedLines3.map(x => {[...Array(getRandomInt(0,3)).keys()].forEach(i=>{p = mv(evaluateCurve(x,getRandom()),randomV(5));pg.circle(p[0],p[1],detailSize()) });})
  pg.fill(stkColor)
  movedLines3.map(x => {[...Array(getRandomInt(0,2)).keys()].forEach(i=>{p = mv(evaluateCurve(x,getRandom()),randomV(5));rectangle(p, v2pt(x[0],x[1]),detailSize(),detailSize()) });})
  pg.fill(bckColor)
  //Detail of circle at the end
  let endDetailCirc = choice([true, false])
  movedLines3.map(x => {
    if(endDetailCirc){
      pg.circle(x[1][0], x[1][1], canvasSize * getRandom(0.001,0.006))
      let linePt = evaluateCurve(x, getRandom())
      pg.circle(linePt[0], linePt[1], canvasSize * getRandom(0.001,0.006))
    }
    else{
      rectangle(x[1], v2pt(x[0],x[1]), canvasSize * getRandom(0.001,0.006), canvasSize * getRandom(0.001,0.006), true)
      let linePt = evaluateCurve(x, getRandom())
      rectangle(linePt, v2pt(x[0],x[1]), canvasSize * getRandom(0.001,0.006), canvasSize * getRandom(0.001,0.006), true)
    }
  })
  
  // Walls
  pg.fill(bckColor)
  pg.stroke(stkColor)
  pg.strokeWeight(sW*0.6)
  let wallDens = getRandom(0,0.5)

  let maxWallW = canvasSize * getRandom(0.007,0.005)
  movedLines3.map(x => {if (getRandom() > wallDens) {walls(x, stkColor, bckColor, maxWallW, false)}})
  movedLines2.map(x => {if (getRandom() > wallDens) {walls(x, stkColor, bckColor, maxWallW, false)}})
  movedLines1.map(x => {if (getRandom() > wallDens) {walls(x, stkColor, bckColor, maxWallW, false)}})

  //dB3()
  let limitB = 150
  if(allEdges.length > 1000){limitB = getRandomInt(50,150)}
  for (let i = 0; i < 100; i++) {
    if(globalBCount < 150){
      let opt = getRandomInt(0,3)
      if(opt == 0){dB1()}
      else if(opt == 1 && !archiMode){dB2()}
      else if(!archiMode){dB3()}
      
    }
    else{
      globalBCount = 0
      break
    }
  }
  if(getRandom()>0.5){
    dBSpecial()
  }
  //Increase dramatically dbs
  if([13,9].includes(mainStruct)){
    dB1(largestEdge)
  }

  ////// DETAILS  
  pg.noFill()
  dash(false)
  allMovedLines.map(x => {if (getRandom(0,1) < 0.5) { details(x, getRandomInt(0,2), stkColor, sW/4)}})
  ////////// Circles
  pg.noFill()
  edgesInt = []
  allMovedLines.map(x => {
    allMovedLines.map(y => {p = linesIntersection(x[0], x[1], y[0], y[1]); if(p!=false){edgesInt.push(p)}})
  })
  let typeRC = true //CIRCLE OR RECTANGLE
  if(archiMode || mainStruct == 4){typeRC = false}
  let nedgesInt = shuffle(edgesInt)
  nedgesInt = nedgesInt.slice(0, 5)
  let nRep = getRandomInt(3,8)
  let maxDiam = getRandom(canvasSize*0.2, canvasSize*0.15)
  for (let i = 0; i < nRep ; i += 1){
    nedgesInt.map(x=>{
      dash();
      pg.strokeWeight(getRandom(sW*0.2, sW*0.4)) ;
      let diam = maxDiam * getRandom(0.7, 1)
      //Dont draw ouside of canvas
      if(x[0] - diam/2 > offset && x[0] + diam/2 < canvasSize - offset && x[1] - diam/2 > offset && x[1] + diam/2 < canvasSize - offset){
        if(typeRC){
          pg.circle(x[0], x[1], diam)}
        else{
          rectangle(x, randomV(1), diam/2, getRandom(diam/4, diam/2))
        }
      }

      })
  }
  pg.stroke(stkColor)

    
  // Arcs
  for (let i = 0; i < getRandomInt(1,4) ; i += 1){
    dash()
    pg.strokeWeight(getRandom(sW/4, sW/3))
    p1 = evaluateCurve(choice(movedLines1), getRandom())
    p2 = evaluateCurve(choice(movedLines1), getRandom())
    curve2pts(p1,p2,100)
  }


  ///////////// SOME ANNOTATIONS

  // Warning
  pg.strokeWeight(sW/2)
  {[...Array(getRandomInt(5,10)).keys()].forEach(i=>{p = evaluateCurve(choice(movedLines3),getRandom());warningCircle(p, getRandom(canvasSize * 0.03,canvasSize * 0.01), bckColor, stkColor)})}
  // Zelda BoW
  {[...Array(getRandomInt(5,20)).keys()].forEach(i=>{p = evaluateCurve(choice(movedLines3),getRandom());zeldaSymbol(p, getRandom(canvasSize * 0.03,canvasSize * 0.01), stkColor, bckColor)})}
  
    //Text annotations around
    pg.strokeWeight(sW/4)
    pg.stroke(stkColor)
    {[...Array(getRandomInt(20,60)).keys()].forEach(i=>{
      p = evaluateCurve(choice(movedLines3),getRandom())
      //move to the right
      pg.strokeWeight(sW/getRandom(4,6))
      pg.stroke(choice([stkColor, specialColor, bckColor]))
      let maxL = canvasSize * getRandom(0.05,0.2) * choice([-1,1])
      let p2 = mv(p, [maxL,0])
      textLine([p, p2], canvasSize* getRandom(0.001,0.002))
    })}


  print(windowWidth, windowHeight)
  

}

function loadText(countNlines){
    /////// Background text ////////////////////
    dash(false)
    //Define how many text zones
    for (let i = 0; i < nTZones; i++) {
            //[txtParamsCol, txtParamsStk, textSize, lineTextL, z, v, p, nLines] paramsTxtInd[0]
      let paramsTxtInd = txtParams[i]
      pg.stroke(paramsTxtInd[0])
      pg.strokeWeight(paramsTxtInd[1])
      let textSize = paramsTxtInd[2]
      let lineTextL = paramsTxtInd[3]
      let z = paramsTxtInd[4]
      let v = paramsTxtInd[5]
      let p = paramsTxtInd[6]

      let nLines = paramsTxtInd[7]
      if(countNlines < nLines){
        textLines(p, z[2]*-1, v[1]*-1, countNlines, lineTextL, lineTextL*0.3, textSize)
      }
    }

    ///////////////////////// DRAW IT /////////////////////
    myResize()
}

let wakeUpSize = 30
function anno(){
   // Boxes on top  //MAKE IT A FIX NUMBER OF BOXES NOT A MAP BCS THEN IT CAN VERY DENSE
  /////////////////////////// ----------------------------------------
  randomSeed(SEED)
  pgAnim.clear()
  if(!isPhone){
    pgAnim.pixelDensity(pixelIncrement)
  }
  ////
  habit()
  randomSeed(SEED)
    // Moving elements over lines
    pgAnim.fill(stkColor);
    pgAnim.strokeWeight(0) 
    let moveSq = getRandomInt(0,2)
    {[...Array(movingData.length).keys()].forEach(i=>{
      
      let data = movingData[i];
      let line = choice(animLines)
      let dir = data.dir
      let t = data.t
      let speed = data.speed
      if(dir){t += speed}
      else{t -= speed}
      if(t > 1){dir = false}
      if(t < 0){dir = true}
      let lerpVal = myLerp(t, [0, 1])
  
      movingData[i].dir = dir
      movingData[i].t = t
  
      let pos = evaluateCurve(line, lerpVal)
      let circleSize = getRandom(0.001, 0.005) * canvasSize
      if(archiMode || moveSq){
        let v = [0,1]
        if(!archiMode){v = v2pt(line[0], line[1])}
        rectangle(pos, v, circleSize, circleSize, true, false, false, true)
      }
      else{
        pgAnim.circle(pos[0], pos[1], circleSize)
      }
  
    } )}

  // BOXES ROTATING
  pgAnim.fill(bckColor)
  pgAnim.stroke(stkColor)
  pgAnim.strokeWeight(getRandom(sW/6, sW/3))
  let multiColorComb = getRandomInt(0,20) > 17
  dash(false)
  let boxescanvasSize = getRandom(canvasSize * 0.007, canvasSize * 0.01)
  let boxCount = 0
  let maxBoxN = 400
  let mxb = () => {return boxCount < maxBoxN}
  if([3,6,11,14].includes(mainStruct) || archiMode){boxescanvasSize = canvasSize * 0.01} //technical mode
  movedLines2.map(x => {if(mxb()){p = evaluateCurve(x,getRandom()); boxes(p, sW, boxescanvasSize);boxCount++}})
  pgAnim.fill(specialColor)
  movedLines1.map(x => {if(multiColorComb){pgAnim.fill(choice(colors))}; if(mxb()){p = evaluateCurve(x,getRandom()); boxes(p, sW, boxescanvasSize);boxCount++}})
  let maxCajitas = getRandom(0.1,0.3)
  if([4,5].includes(mainStruct)){maxCajitas = getRandom(0.65,0.75)}
  pgAnim.fill(specialColor)
  movedLines3.map(x => {if(getRandom()< maxCajitas && mxb()){if(multiColorComb){pgAnim.fill(choice(colors))}; p = evaluateCurve(x,getRandom()); boxes(p, sW, boxescanvasSize);boxCount++}})
  
  // Cajitas Anno
  let annoLines = choice([movedLines1, movedLines2, movedLines3])
  annoLines =  (movedLines1.concat(movedLines2)).concat(movedLines3)

  // Annotations Cajas con scaling
  pgAnim.fill(bckColor); 
      {[...Array(nAnno).keys()].forEach(i=>{
        let x = choice(annoLines);
        let p = evaluateCurve(x,getRandom()); 
        //Scale Anim
        
        let annoAnim = annoData[i]
        let dir = annoAnim.dir
        let t = annoAnim.t
        let maxScale = annoAnim.maxScale
        let minScale = annoAnim.minScale
        let step = 0.001
        if(dir){t += step}
        else{t -= step}
        if(t > 1){dir = false}
        if(t < 0){dir = true}

        let lerpVal = myLerp(t, [minScale, maxScale])
        let annoSize = canvasSize * 0.01 * lerpVal
        //Update the class
        annoData[i].dir = dir
        annoData[i].t = t

        if(true){
          annotation(p, annoSize, choice(annoType), stkColor, bckColor, sW, letterType)
        }
        })}

    //////// Name TITLE BOX
    pgAnim.strokeWeight(sW/4)
    titleBox(P0, canvasSize, offset, bckColor, specialColor, stkColor)

    


  //DRAW ACTIVATE PANEL
  if(activate){
    activateCount++
    if(activateCount < 100){
      // TEXT
      let y = canvasSize * 0.02
      let size = canvasSize * 0.01
      let textPt = [canvasSize/2, y]

      pgAnim.fill(bckColor);
      pgAnim.stroke(stkColor)
      rectangle([canvasSize/2, canvasSize/2], [0,1], size * 2, canvasSize * 1.2, true, false, false, true)
      pgAnim.strokeWeight(sW * 0.5)
      pgAnim.textAlign(CENTER);
      pgAnim.textSize(wakeUpSize);
      //pgAnim.text('...wake up...', canvasSize/2, canvasSize/2);

      for (let i = 0; i < 80; i++) {
        language(textPt, size, choice([0,1,2]), true)
        textPt = mv(textPt, [0,y])
        
      }
      wakeUpSize -= 0.01
    } 
    else{
      activate = false
      activateLife = true
    }
  }
  if(showSpeed < 50){
    showSpeed ++
          // TEXT
          pgAnim.fill(stkColor);
          pgAnim.stroke(bckColor)
          pgAnim.strokeWeight(sW * 2)
          pgAnim.textAlign(CENTER);
          pgAnim.textSize(wakeUpSize);
          pgAnim.text('+', canvasSize/2, canvasSize/2);
  }
  

  
  /////////////////////////// ----------------------------------------
  myResize()
  if(frame == 15){
    fxpreview()
  }
}

let setHabit = true
let multiHabit = []
let targets = []
let distToTarget = []
let waitFrames = []
let waiting = []
let vReb = []
let hCol = []
let activateLife = false
let activateCount = 0
function habit(){
    if(setHabit){
      for (let i = 0; i < 50; i++) {
        let nAgents = getRandomInt(10,30)
        let startPt = choice(allMovedLines)[0]
        let habitData = setHabitantes(nAgents, startPt)
        multiHabit.push(habitData)
        let target = choice(allMovedLines)[0]
        targets.push(target)
        distToTarget.push(dist2pts(startPt, target))
        waiting.push(0)
        waitFrames.push(getRandom(100,300))
        vReb.push(getRandom(0.3,1))
        let colH = stkColor
        if(getRandom()<0.13){colH = specialColor}
        hCol.push(colH)
      }
      setHabit = false
    }


     ////// HABITANTES ////////////
     multiHabit.forEach((habitData,j) => {
      
      if(activateLife){
        let target = targets[j]
        //Multiple habitantes
       if(frame%3 != 0){
        // Get closest point to target
        let p = null 
        let minDist
        habitData.forEach(habit => {
          let hp = habit.habPos
          let dist = dist2pts(hp, target)
          if(p == null){
            p = hp
            minDist = dist
          }
          else{
            if(dist<minDist){
              p = hp
              minDist = dist
            }
          }
          });
          //Move pts to closest pt
          for (let i = 0; i < habitData.length; i++) {
            let habit = habitData[i];
            let speed = habit.speed * extraSpeed
            let pt = habit.habPos
            //Lerp the speed for fluidity
            let currentDist = dist2pts(pt, targets[j])
            let t = currentDist > distToTarget[j] ? 1 : currentDist/distToTarget[j];
     

            //Move pt to closest
            let v = v_mult(unit(v2pt(pt, p)), speed)
            //despistado
            let despistado = habit.despistado < getRandomOut()
            if(despistado){
              v = v_mult(unit([getRandomOut(-1,1), getRandomOut(-1,1)]), speed)
            }
            let nPt = mv(pt, v)
            //Update array
            habitData[i].habPos = nPt
          }
          if(minDist < getRandom(0.1,0.05) * canvasSize){
            waiting[j] ++
            if(waiting[j] > waitFrames[j]){
              target = allMovedLines[getRandomIntOut(0,allMovedLines.length-1)][0]
              targets[j] = target
              waiting[j] = 0
              waitFrames[j] = getRandomOut(100,500)
              //update the dist to the new target
              distToTarget[j] = dist2pts(target, p)
            }
          }
      }
      else{
        //Move random
        for (let i = 0; i < habitData.length; i++) {
          let habit = habitData[i];
          let speed = habit.speed * extraSpeed
          let pt = habit.habPos
          //Move pt to closest
          let v = v_mult(unit([getRandom(-1,1), getRandom(-1,1)]), speed)
          let nPt = mv(pt, v)
          //Update array
          habitData[i].habPos = nPt
          if(getRandomOut()<0.05){
            habitData[i].change()
          }
        }
      }
      }

    //Draw the habitantes
    pgAnim.fill(hCol[j])
    pgAnim.strokeWeight(0)
    habitData.forEach(habit => {
      let pt = habit.habPos
      let hSize = habit.hSize
      pgAnim.circle(pt[0], pt[1], hSize)
    });
  });


}