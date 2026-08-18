let FPS = 60
const border = 0.05

const modesProbabilities =  [0.22, 0.45, 0.15,  0.08, 0.10]
const modes =               [0,    1,    2,     3,    4]
const patterns = [0,1,2,3,4,5]
const ratios = [1.2,1.4142135624,1.618,2]

const MODE_PLOTTER = 0
const MODE_FLAT = 1
const MODE_3D = 2
const MODE_SCREEN = 3
const MODE_SERIGRAPH = 4

const COL_STANDARD = '#ddd'
const COL_DARK     = '#333'

const STYLE_SWATCHES = {
  name:        'Swatches',
  background:  [COL_STANDARD],
  palette:     ['#22AA55','#ee0000','#FF6611','#ffee22','#00a9ee','#231f20','#e2118f','#ffffff']
}
const STYLE_GESTALT = {
  name:        'Gestalt',
  background:  [COL_STANDARD],
  palette:     ['#f1f1f1','#23120b','#dd0100','#225095','#FDB827','#127740','#f697a8']
}
const STYLE_LITMUS = {
  name:        'Litmus',
  background:  [COL_STANDARD],
  palette:     ['#d9cfc5','#da595a','#f18d3e','#ffc83d','#bdaa76','#59535f','#694e66','#5d4252']
}
const STYLE_COMPUTERKUNST = {
  name:        'Computerkunst',
  background:  ['#fee00e'],
  palette:     ['#e06f2b','#dea41e','#d4451d','#c41e5c','#bb6274','#172e57','#0d5377','#056a30','#20936c','#020f08']
}
const STYLE_MOTHERBOARD = {
  name:        'Motherboard',
  background:  [COL_STANDARD],
  palette:     ['#243638','#51827c','#71846e','#dbddc5','#919d93','#6b7f64','#809b7a','#22caf0'] 
}
const STYLE_20sMETAVERSE = {
  name:        '20s Metaverse',
  background:  ['#050c16'],
  palette:     ['#19013d','#58169a','#2a0564','#522081','#d30b88','#a93da0','#f17142','#11eef7']
}
const STYLE_90sMETAVERSE = {
  name:        '90s Metaverse',
  background:  ['#2d1932'],
  palette:     ['#003cba','#003cba','#002573','#b7032a','#d92030','#00494f','#026d29','#82c66f','#5cb362','#cc8449','#f39d6a','#fb7324','#c4a555','#bdb550','#693c8d','#88356d','#d4436c','#d164a5']
}
const STYLE_BW = {
  name:        'B&W',
  background:  ['#222',COL_STANDARD],
  palette:     ['#F2F2F2','#BFBFBF','#8C8C8C','#0D0D0D']
}
const STYLE_ANALOG_GREEN = {
  name:        'Analog Green',
  background:  ['#0c160e'],
  palette:     ['#50ffa9']
}
const STYLE_LIGHTCYCLES = {
  name:        'Light Cycles',
  background:  ['#0a1d2e'],
  palette:     ['#469eff','#fc3ffe','#ff9664','#f0ff30','#4fff5a']
}
const STYLE_SERIGRAPH_DARK = {
  name:        'Dark',
  background:  ['#231f20'],
  palette:     ['#f1f1f1']
}
const STYLE_SERIGRAPH_LIGHT = {
  name:        'Light',
  background:  ['#f1f1f1'],
  palette:     ['#231f20']
}
const STYLE_MONDRIAN = {
  name:        'HWF Mondrian',
  background:  [COL_STANDARD],
  palette:     ['#f70202','#84ff84','#84ff84','#000084','#007f00','#000000','#ff00ff','#ffff00','#ff8484','#7b84ff','#fffc81','#bdbdbd']
}

let styles = [
  STYLE_SWATCHES,
  STYLE_GESTALT,
  STYLE_LITMUS,
  STYLE_COMPUTERKUNST,
  STYLE_MOTHERBOARD,
  STYLE_20sMETAVERSE,
  STYLE_90sMETAVERSE,
  STYLE_BW,
  STYLE_ANALOG_GREEN,
  STYLE_LIGHTCYCLES,
  STYLE_SERIGRAPH_DARK,
  STYLE_SERIGRAPH_LIGHT,
  STYLE_MONDRIAN
]

let ww, wh
let intFeatures = {}
let polys = [[]]
let bg = '#eee'
let colors = []
let scrollCount = 0
let renderCount = 0
let polyCount = 0
let gens = []
let firstTimeRendered = true
let clicked = false

function setup() {
  console.log(`fxhash: ${fxhash}`)
  initPiece()
  console.log(`ww:${ww} wh:${wh}`)
  console.log(`wiw:${window.innerWidth} wih:${window.innerHeight}`)

  window.$fxhashFeatures = getFxFeatures()
  console.log(intFeatures)
  console.table(window.$fxhashFeatures)
}

function getFxFeatures(){
  let features = {}
  switch(intFeatures.mode){
    case MODE_PLOTTER:
      features['Mode'] = 'Plotter';
      break;
    case MODE_FLAT:
      features['Mode'] = '2D';
      break;
    case MODE_3D:
      features['Mode'] = '3D';
      break;
    case MODE_SCREEN:
      features['Mode'] = 'Screen';
      break;
    case MODE_SERIGRAPH:
      features['Mode'] = 'Serigraph';
      break;
  }

  let ratio
  switch(intFeatures.ratio){
    case 1.618:
    case 2:
    case 1.2:
      ratio = intFeatures.ratio;
      break;
    case 1.4142135624:
      ratio = '√2';
      break;
  }
  features['Aspect Ratio'] = (intFeatures.orientation=='l')?`${ratio}:1`:`1:${ratio}`
  
  features['Palette'] = intFeatures.palette;

  switch(intFeatures.subdivRatio){
    case 1.2:
      features['Subdivision Ratio'] = 'Ratio A';
      break;
    case 1.4142135624:
      features['Subdivision Ratio'] = 'Ratio B';
      break;
    case 1.618:
      features['Subdivision Ratio'] = 'Ratio C';
      break;
    case 2:
      features['Subdivision Ratio'] = 'Ratio D';
      break;
  }

  if(intFeatures.recursive<=0.16){
    features['Recursion Probability'] = 'Low'
  } else if (intFeatures.recursive>0.16&&intFeatures.recursive<=0.74){
    features['Recursion Probability'] = 'Medium'
  } else if (intFeatures.recursive>0.84&&intFeatures.recursive<=0.97){
    features['Recursion Probability'] = 'High'
  } else {
    features['Recursion Probability'] = 'Very High'
  }

  if(intFeatures.divs<=16){
    features['Subdivisions'] = 'Low'
  } else if (intFeatures.divs>16&&intFeatures.divs<=40){
    features['Subdivisions'] = 'Medium'
  } else {
    features['Subdivisions'] = 'High'
  }


  features['Color Selection'] = intFeatures.ratiodColors?'Proportioned':'Uniform'


  return features
}

function initPiece(){
  fxrand = sfc32(...hashes)
  
  clear()
  resetMatrix()
  
  polys = [[]]
  gens = []
  scrollCount = 0
  renderCount = 0
  frameCount = 0
  polyCount = 0
  intFeatures = {}
  
  intFeatures.mode = modes[weighted_index(modesProbabilities)]
  intFeatures.ratio = random_choice(ratios)
  intFeatures.subdivRatio = random_choice(ratios) 
  intFeatures.orientation = random_choice(['p','l'])
  intFeatures.divs = random_int(8,60)
  intFeatures.recursive = fxrand()
  intFeatures.gaps = random_bool(0.1)
  intFeatures.ratiodColors = random_bool(0.3)
  
  if(intFeatures.orientation=='l'){
    window.innerHeight<window.innerWidth?(
      ww=Math.max(window.innerWidth,1),
      wh=Math.max(window.innerWidth*(1/intFeatures.ratio),1))  
      :(
      ww=Math.max(window.innerWidth,1),
      wh=Math.max(window.innerWidth/intFeatures.ratio,1));
    if(wh>window.innerHeight) (wh=Math.max(window.innerHeight,1),ww=Math.max(wh*intFeatures.ratio,1))
  } else {
    window.innerHeight<window.innerWidth?(
      ww=Math.max(window.innerHeight,1)*(1/intFeatures.ratio),
      wh=Math.max(window.innerHeight,1))
      :(
      ww=Math.max(window.innerHeight/intFeatures.ratio,1),
      wh=Math.max(window.innerHeight,1));
    if(ww>window.innerWidth) (ww=Math.max(window.innerWidth,1),wh=Math.max(ww*intFeatures.ratio,1))
  }
  
  let style
  switch(intFeatures.mode){
    case MODE_PLOTTER:
      {
      createCanvas(ww,wh);
      let styleFilter = ['Swatches','Gestalt','HWF Mondrian']
      let filtered = styles.filter((data) => styleFilter.includes(data.name))
      style = random_choice(filtered)
      bg = random_choice(style.background)
      break;
      }
    case MODE_FLAT:
      {
      createCanvas(ww,wh);
      polys.push([])
      let styleFilter = ['Swatches','Gestalt','Litmus','Computerkunst','Motherboard','20s Metaverse','90s Metaverse','B&W','HWF Mondrian']
      let filtered = styles.filter((data) => styleFilter.includes(data.name))
      style = random_choice(filtered)
      bg = random_choice(style.background)
      break;
      }
    case MODE_3D:
      {
      createCanvas(ww,wh,WEBGL)
      let styleFilter = ['Swatches','Gestalt','20s Metaverse','90s Metaverse','Motherboard','HWF Mondrian']
      let filtered = styles.filter((data) => styleFilter.includes(data.name))
      style = random_choice(filtered)
      bg = '#352e40'
      break;
      }
    case MODE_SERIGRAPH:
      {
      createCanvas(ww,wh);
      let styleFilter = ['Dark','Light']
      let filtered = styles.filter((data) => styleFilter.includes(data.name))
      style = random_choice(filtered)
      bg = random_choice(style.background)
      break;
      }
    case MODE_SCREEN:
      {
      createCanvas(ww,wh);
      FPS = 24
      let styleFilter = ['Analog Green','Light Cycles']
      let filtered = styles.filter((data) => styleFilter.includes(data.name))
      style = random_choice(filtered)
      bg = random_choice(style.background)
      break;
      }
  }
  
  colors = style.palette
  colors = shuffle([...colors])
  intFeatures.palette = style.name
  
  frameRate(FPS)
  pixelDensity(2)
  background(intFeatures.mode==MODE_3D?getTimeLerpedCol():bg);
  
  for(let i=0;i<polys.length;i++){  
    generateSubdivisions(i)
  }
  
  if(intFeatures.mode===MODE_FLAT){
    noLoop()
  } else if(intFeatures.mode===MODE_PLOTTER){
    intFeatures.layers = [1,2][weighted_index([0.2,0.8])]
    createGenerators()
  }
}

function draw() {
  renderPolys()
}

function getTimeLerpedCol(){
  let date = new Date()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let lerpCol, amt
  if(hours<12){
    amt = map(hours*60+minutes,0,11*60,0,1)
    lerpCol = lerpColor(color(bg),color('#ccc'),amt)
  } else {
    amt = map(hours*60+minutes,12*60,23*60,0,1)
    lerpCol = lerpColor(color('#ccc'),color(bg),amt)
  }

  return lerpCol
}

function renderPolys(){
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  if(seconds==0&&intFeatures.mode!=MODE_FLAT&&!firstTimeRendered){
    initPiece()
  }
  
  switch(intFeatures.mode){
    case MODE_PLOTTER:
      noStroke()
      let drawLoops = 100
      for(let i=0;i<drawLoops;i++){
        if(polyCount<gens.length){
          let fillCol=color(polys[floor(polyCount/polys[0].length)][polyCount%polys[0].length].col)
          fillCol.setAlpha(255)
          fill(fillCol)
          let result = gens[polyCount].next()
        } else if(polyCount==gens.length) {
          if(i==drawLoops-1){
            fxpreview()
            firstTimeRendered = false
          }
        }
      }
      break;
    case MODE_FLAT:
      background(bg);
      if(frameCount%round(wh*0.9)==0){
        scrollCount++
        console.log(`Scrolls: ${scrollCount}`)
        generateSubdivisions((scrollCount+1)%polys.length)
      }

      for(let i=0;i<polys.length+1;i++){
        let start=-wh*0.9
        let currPoly = polys[i%polys.length]
        for(let j=currPoly.length-1;j>=0;j--){
          let poly = currPoly[j].verts
          let randCol = color(currPoly[j].col)
          stroke(randCol)
          strokeWeight((wh>=ww?ww:wh)/1200)

          fill(randCol)

          if(poly[0].y>poly[2].y){
            let swap = poly.splice(2, 2)
            poly.splice(0, 0, swap[0],swap[1]);
          }  

          let w = poly[1].x-poly[0].x
          let h = poly[2].y-poly[1].y    
            beginShape()
            let jitterAmt = 0
            for(let k=0;k<poly.length;k++){
              let jitter = 0
              jitter = random_num(wh*-jitterAmt,wh*jitterAmt)
              vertex(poly[k%poly.length].x+jitter,
                     start+(wh*0.9*(i+1))+poly[k%poly.length].y+jitter-((frameCount)%(wh*0.9*(polys.length)))
                    )
            }
            endShape(CLOSE)
        }

        push()
          fill(bg)
          noStroke()
          beginShape()
          vertex(0,0)
          vertex(ww,0)
          vertex(ww,wh)
          vertex(0,wh)
          beginContour()
          vertex(border*wh,border*wh)
          vertex(border*wh,((1-border)*wh)-2)
          vertex(ww-border*wh,((1-border)*wh)-2)
          vertex(ww-border*wh,border*wh)
          endContour()
          endShape(CLOSE)
        pop()
      }
      if(renderCount==0) fxpreview(); firstTimeRendered = false
      if(!scroll) noLoop()
      break;
    case MODE_3D:
      if(renderCount<=1){
        if(renderCount==0){background(getTimeLerpedCol())}

        translate(0,0,-80)
        
        let currPoly = polys[0]
        for(let j=currPoly.length-1;j>=0;j--){
          let poly = currPoly[j].verts
          let randCol = color(currPoly[j].col)

          if(poly[0].y>poly[2].y){
            let swap = poly.splice(2, 2)
            poly.splice(0, 0, swap[0],swap[1]);
          }

          let w = abs(poly[1].x-poly[0].x)
          let h = abs(poly[2].y-poly[1].y)
          let d = currPoly[j].depth
          if(w>0.0025*(wh>=ww?ww:wh)&&h>0.0025*(wh>=ww?ww:wh)){
            let a = (w>=h?w:h)
            let b = (a>=d?a:d)
            let pg = createGraphics(a, b);
            pg.noStroke()
            pg.fill(randCol)
            noStroke()
            stroke('#F1F1F1')
            if(renderCount==1){
              hatchedTexture(0,0,a,b, random_num(5.5,6.5), 12, currPoly[j].pattern,pg)
            }
            push()
            texture(pg)
            
            translate(-ww/2,-wh/2)
            translate(poly[0].x+w/2,poly[0].y+h/2,d/2)
            box(w,h,d)
            pop()
          }
        }
      }
      if (renderCount==1) fxpreview(); firstTimeRendered = false

      break;
    case MODE_SCREEN:
      noSmooth()
      
      let alphaBg = color(bg)
      alphaBg.setAlpha(40)
      background(alphaBg);
      let currPoly = polys[0]
      if(renderCount<currPoly.length){

        let latestPoly = currPoly[renderCount].verts
        if(latestPoly[0].y>latestPoly[2].y){
          let swap = latestPoly.splice(2, 2)
          latestPoly.splice(0, 0, swap[0],swap[1]);
        } 
        push()
        let alphaWhite = color('#ffffff')
        alphaWhite.setAlpha(255)
        stroke(alphaWhite)
        strokeCap(ROUND)
        strokeWeight((wh>=ww?ww:wh)/100)
        for(let j=0;j<=latestPoly.length;j++){
              line(latestPoly[j%latestPoly.length].x,latestPoly[j%latestPoly.length].y,latestPoly[(j+1)%latestPoly.length].x,latestPoly[(j+1)%latestPoly.length].y)
            }
        pop()
      }
      // gridlines
      for(let y=0;y<wh/10;y++){
        for(let x=0;x<ww/10;x++){
          push()
          fill(intFeatures.palette=='Light Cycles'?'#163643':'#000')
          noStroke()
          rect(x*ww/10,y*wh/10,ww,(wh>=ww?ww:wh)/800)
          rect(x*ww/10,y*wh/10,(wh>=ww?ww:wh)/800,wh)
          pop()
        }
      }
      
      for(let k=0;k<3;k++){
        for(let i=0;i<=min(renderCount-3,currPoly.length-1);i++){
          let poly = currPoly[i].verts
          if(poly[0].y>poly[2].y){
            let swap = poly.splice(2, 2)
            poly.splice(0, 0, swap[0],swap[1]);
          } 

          beginShape()
          let alphaCol = color(currPoly[i].col)
          if(k==0){
            alphaCol.setAlpha(8)
            strokeWeight((wh>=ww?ww:wh)/150+(sin(renderCount*0.2)*3))
          } else if (k==1) {
            alphaCol.setAlpha(200)
            strokeWeight((wh>=ww?ww:wh)/250)
          } else if (k==2) {
            alphaCol = color('#fff')
            alphaCol.setAlpha(150)
            strokeWeight((wh>=ww?ww:wh)/900)
          }
          stroke(alphaCol)
          strokeCap(ROUND)
          noFill()
          for(let j=0;j<poly.length;j++){
            vertex(poly[j].x,poly[j].y)
          }
          endShape(CLOSE)
        }
      }
      if(renderCount==currPoly.length+round(FPS*5)){
        fxpreview()
        firstTimeRendered = false
      }
      break;
      case MODE_SERIGRAPH:
        const secsToRender = 6
        if(renderCount<round(FPS*secsToRender)){
          for(let i=0;i<polys.length;i++){
            let currPoly = polys[i]
            for(let j=currPoly.length-1;j>=0;j--){
              let poly = currPoly[j].verts


              let alphaCol = color(currPoly[j].col)
              if(intFeatures.palette=='Light'){
                blendMode(BURN)
                alphaCol.setAlpha(50)
              } else {
                blendMode(OVERLAY)
                alphaCol.setAlpha(160)
              }

              noStroke()
              fill(alphaCol)


              if(poly[0].y>poly[2].y&&!intFeatures.gaps){
                let swap = poly.splice(2, 2)
                poly.splice(0, 0, swap[0],swap[1]);
              }  

              let w = poly[1].x-poly[0].x
              let h = poly[2].y-poly[1].y
              if(w>0.0025*(wh>=ww?ww:wh)&&h>0.0025*(wh>=ww?ww:wh)){    
                stippledRect(poly[0].x,poly[0].y, w, h,random_num(5,8),0.001)
              }
            }
          }
        } else if(renderCount==round(FPS*secsToRender)) {
          fxpreview()
          firstTimeRendered = false
        }
      break;
  }
  renderCount++
}

function generateSubdivisions(index){
  polys[index].length=0
  
  let poly = []
  poly.push({
    x:border*wh,
    y:border*wh
  })
  poly.push({
    x:ww-border*wh,
    y:border*wh
  })
  poly.push({
    x:ww-border*wh,
    y:(1-border)*wh
  })
  poly.push({
    x:border*wh,
    y:(1-border)*wh
  })
  
  subdivide(poly,intFeatures.subdivRatio,1,index)

  for(let j=0;j<intFeatures.divs;j++){
    subdivide(getRandomPolyToSubdivide(polys[index]).verts,intFeatures.subdivRatio,1,index)
  } 
  
}

function* hatchedRect(x,y,w,h,gap,thicknessMult,pattern,pg,counter){
  let subGridSize = gap/450 * (wh>=ww?ww:wh)
  
  let y1=0
  let x1=0
  

    while(x1<w/subGridSize && y1<h/subGridSize){
    
      renderPattern(x,y,w,h,thicknessMult,pattern,pg,subGridSize,x1,y1)
      
      x1=counter%ceil(w/subGridSize)
      if(counter>0&&x1==0){
        y1++
      }
      
      yield counter++
    }    
  polyCount++
}

function hatchedTexture(x,y,w,h,gap,thicknessMult,pattern,pg){
  let subGridSize = floor(gap/450 * (wh>=ww?ww:wh)) 
    
  for(let y1=0;y1<h/subGridSize;y1++){
    for(let x1=0;x1<w/subGridSize;x1++){
      renderPattern(x,y,w,h,thicknessMult,pattern,pg,subGridSize,x1,y1)
    }    
  }
}

function renderPattern(x,y,w,h,thicknessMult,pattern,pg,subGridSize,x1,y1){
  switch(pattern){
    case 0:
      jaggedLine(
        x+(x1*subGridSize),            y+(y1*subGridSize),
        x+((x1+1)*subGridSize),        y+(y1*subGridSize),
      thicknessMult,pg);
      if(y1>=floor(h/subGridSize)){
        jaggedLine(
          x+(x1*subGridSize),          y+((y1+1)*subGridSize),
          x+((x1+1)*subGridSize),      y+((y1+1)*subGridSize),
        thicknessMult,pg);
      }
      break;
    case 1:
      jaggedLine(
        x+(x1*subGridSize),            y+(y1*subGridSize),
        x+(x1*subGridSize),            y+((y1+1)*subGridSize),
      thicknessMult,pg);
      if(x1>=floor(h/subGridSize)){
        jaggedLine(
          x+((x1+1)*subGridSize),      y+(y1*subGridSize),
          x+((x1+1)*subGridSize),      y+((y1+1)*subGridSize),
        thicknessMult,pg);
      }
      break;
    case 2:
      jaggedLine(
        x+(x1*subGridSize),            y+(y1*subGridSize),
        x+((x1+1)*subGridSize),        y+((y1+1)*subGridSize),
      thicknessMult,pg);
      break;
    case 3:
      jaggedLine(
        x+((x1+1)*subGridSize),        y+(y1*subGridSize),
        x+(x1*subGridSize),            y+((y1+1)*subGridSize),
      thicknessMult,pg);
      break;
    case 4:
      jaggedLine(
        x+(x1*subGridSize),            y+(y1*subGridSize),
        x+((x1+1)*subGridSize),        y+((y1+1)*subGridSize),
      thicknessMult,pg);
      jaggedLine(
        x+((x1+1)*subGridSize),        y+(y1*subGridSize),
        x+(x1*subGridSize),            y+((y1+1)*subGridSize),
      thicknessMult,pg);
      break;
    case 5:
      jaggedLine(
        x+(x1*subGridSize),            y+(y1*subGridSize),
        x+((x1+1)*subGridSize),        y+(y1*subGridSize),
        thicknessMult,pg);
      jaggedLine(
        x+(x1*subGridSize),            y+(y1*subGridSize),
        x+((x1+1)*subGridSize),        y+((y1+1)*subGridSize),
      thicknessMult,pg);
      jaggedLine(
        x+((x1+1)*subGridSize),        y+(y1*subGridSize),
        x+(x1*subGridSize),            y+((y1+1)*subGridSize),
      thicknessMult,pg);
      if(y1>=floor(h/subGridSize)){
        jaggedLine(
          x+(x1*subGridSize),          y+((y1+1)*subGridSize),
          x+((x1+1)*subGridSize),      y+((y1+1)*subGridSize),
        thicknessMult,pg);
      }
    break;
    case 6:  
    jaggedCurve(x+((x1+0.5)*subGridSize),y+((y1+0.5)*subGridSize),subGridSize/4,0,360,thicknessMult)
    break;
  }
}

function jaggedLine(x1,y1,x2,y2,thicknessMult,pg){
  let v1 = createVector(x1,y1)
  let v2 = createVector(x2,y2)
  let angleBetween = Math.atan2(y2-y1,x2-x1) 
  let dist = v1.dist(v2)

  for(let i=0;i<dist;i+=((wh>=ww?ww:wh)/random_num(600,800))){
    let thickness = map(noise(random_int(0,10000),i*1),0,1,(wh>=ww?ww:wh)/6000*thicknessMult,(wh>=ww?ww:wh)/3000*thicknessMult)
    let x = v1.x + (i*Math.cos(angleBetween.toFixed(2))) + (random_num(-0.0001,0.0001)*wh)
    let y = v1.y + (i*Math.sin(angleBetween.toFixed(2))) + (random_num(-0.0001,0.0001)*wh)

    if(typeof pg !== "undefined"){
      pg.ellipse(x,y,thickness)
    } else {
      ellipse(x,y,thickness)
    }
  }
}

function jaggedCurve(x,y,r,startAngle,endAngle,strokeMult){
  for(let i=startAngle;i<endAngle;i+=(wh/random_num(60,60))){
    let thickness = map(noise(random_int(0,10000),i*1),0,1,wh/6000*strokeMult,wh/5000*strokeMult)
    let x1 = x + (r*Math.cos(radians(i))) + (random_num(-0.0001,0.0001)*wh)
    let y1 = y + (r*Math.sin(radians(i))) + (random_num(-0.0001,0.0001)*wh)
    ellipse(x1,y1,thickness)
  }
}

function stippledRect(x,y,w,h,thicknessMult,intensity){  
  for(let i=0;i<w*h*intensity;i++){
    let x1 = cosh_num(x,x+w)
    let y1 = cosh_num(y,y+h)
    
    let thickness = random_num((wh>=ww?ww:wh)/6000*thicknessMult,(wh>=ww?ww:wh)/2700*thicknessMult)
    ellipse(x1,y1,thickness,thickness*random_num(0.9,1.1))
  }
}

function createGenerators(){
  if(intFeatures.mode==MODE_PLOTTER){
    for(let i=1;i<intFeatures.layers;i++){
      polys[i]=[]

      for(let j=0;j<polys[0].length;j++){
        let newLayerPoly = {}
        newLayerPoly.verts = [...polys[0][j].verts]
        newLayerPoly.col = random_choice(colors)
        newLayerPoly.pattern = random_choice(patterns)
        polys[i].push(newLayerPoly)
      }
    }

    for(let i=0;i<polys[0].length;i++){
      for(let j=0;j<intFeatures.layers;j++){
        let poly = polys[j][i].verts
        
        if(poly[0].y>poly[2].y){
          let swap = poly.splice(2, 2)
          poly.splice(0, 0, swap[0],swap[1]);
        }  

        let w = poly[1].x-poly[0].x
        let h = poly[2].y-poly[1].y
        if(w>0.0025*(wh>=ww?ww:wh)&&h>0.0025*(wh>=ww?ww:wh)){
          gens.push(hatchedRect(poly[0].x,poly[0].y, w, h, random_num(4,5.5), 9, polys[j][i].pattern,undefined,0))
        }
      }
    }
  } else if (intFeatures.mode==MODE_3D){
    gens.push(hatchedBoxes(0))
  }
}

function getRandomPolyToSubdivide(source){
  let index 
  if(fxrand()<intFeatures.recursive){
    index = source.length-1
  } else {
    index = random_int(0,source.length-1)
  }

  return source.splice(index,1)[0]
}

function subdivide(poly, ratio, reps, index){
  let subdivided = []
  
  // startVertex of 0 means takes the right side
  let startVertex = random_bool(0.5)?0:2
  
  if(createVector(poly[0].x,poly[0].y).dist(createVector(poly[1].x,poly[1].y))>
     createVector(poly[1].x,poly[1].y).dist(createVector(poly[2].x,poly[2].y))){
    subdivided.push({
      x:poly[(startVertex+0)%poly.length].x+(poly[(startVertex+1)%poly.length].x-poly[(startVertex+0)%poly.length].x)/ratio,
      y:poly[(startVertex+1)%poly.length].y
    })
    subdivided.push(poly[(startVertex+1)%poly.length])
    subdivided.push(poly[(startVertex+2)%poly.length])
    subdivided.push({
      x:poly[(startVertex+0)%poly.length].x+(poly[(startVertex+1)%poly.length].x-poly[(startVertex+0)%poly.length].x)/ratio,
      y:poly[(startVertex+2)%poly.length].y
    })
    let subdividedParams = {
      verts:subdivided,
      col:(intFeatures.ratiodColors)?colors[weighted_index(ratioBasedColorProbabilities())]:random_choice(colors),
    }
    if(intFeatures.mode==MODE_PLOTTER||intFeatures.mode==MODE_3D){
      subdividedParams.pattern = random_choice(patterns)
    }
    if(intFeatures.mode==MODE_3D){
      subdividedParams.depth = random_num(20,80)
    }
    polys[index].push(subdividedParams)
    
    let other = []
    other.push(poly[(startVertex+0)%poly.length])
    other.push({
      x:poly[(startVertex+0)%poly.length].x+(poly[(startVertex+1)%poly.length].x-poly[(startVertex+0)%poly.length].x)/ratio,
      y:poly[(startVertex+1)%poly.length].y
    })
    other.push({
      x:poly[(startVertex+0)%poly.length].x+(poly[(startVertex+1)%poly.length].x-poly[(startVertex+0)%poly.length].x)/ratio,
      y:poly[(startVertex+2)%poly.length].y
    })
    other.push(poly[(startVertex+3)%poly.length])
    let otherParams = {
      verts:other,
      col:(intFeatures.ratiodColors)?colors[weighted_index(ratioBasedColorProbabilities())]:random_choice(colors),
    }
    if(intFeatures.mode==MODE_PLOTTER||intFeatures.mode==MODE_3D){
      otherParams.pattern = random_choice(patterns)
    }
    if(intFeatures.mode==MODE_3D){
      otherParams.depth = random_num(20,80)
    }
    polys[index].push(otherParams)
    
  } else {
    subdivided.push({
      x:poly[(startVertex+0)%poly.length].x,
      y:poly[(startVertex+1)%poly.length].y+(poly[(startVertex+2)%poly.length].y-poly[(startVertex+1)%poly.length].y)/ratio
    })
    subdivided.push({
      x:poly[(startVertex+1)%poly.length].x,
      y:poly[(startVertex+1)%poly.length].y+(poly[(startVertex+2)%poly.length].y-poly[(startVertex+1)%poly.length].y)/ratio
    })
    subdivided.push(poly[(startVertex+2)%poly.length])
    subdivided.push(poly[(startVertex+3)%poly.length])
    let subdividedParams = {
      verts:subdivided,
      col:(intFeatures.ratiodColors)?colors[weighted_index(ratioBasedColorProbabilities())]:random_choice(colors),
    }
    if(intFeatures.mode==MODE_PLOTTER||intFeatures.mode==MODE_3D){
      subdividedParams.pattern = random_choice(patterns)
    }
    if(intFeatures.mode==MODE_3D){
      subdividedParams.depth = random_num(20,80)
    }
    polys[index].push(subdividedParams)
    
    let other = []
    other.push(poly[(startVertex+0)%poly.length])
    other.push(poly[(startVertex+1)%poly.length])
    other.push({
      x:poly[(startVertex+1)%poly.length].x,
      y:poly[(startVertex+1)%poly.length].y+(poly[(startVertex+2)%poly.length].y-poly[(startVertex+1)%poly.length].y)/ratio
    })
    other.push({
      x:poly[(startVertex+0)%poly.length].x,
      y:poly[(startVertex+1)%poly.length].y+(poly[(startVertex+2)%poly.length].y-poly[(startVertex+1)%poly.length].y)/ratio
    })
    let otherParams = {
      verts:other,
      col:(intFeatures.ratiodColors)?colors[weighted_index(ratioBasedColorProbabilities())]:random_choice(colors),
    }
    if(intFeatures.mode==MODE_PLOTTER||intFeatures.mode==MODE_3D){
      otherParams.pattern = random_choice(patterns)
    }
    if(intFeatures.mode==MODE_3D){
      otherParams.depth = random_num(20,80)
    }
    polys[index].push(otherParams)
  }
    
  if(reps>1){
    subdivide(subdivided,ratio,reps-1,index)
  }
}

function ratioBasedColorProbabilities(){
  let colorProbs = []
  let remaining = 1
  for(let i=0;i<colors.length;i++){
    let split = remaining * (1/intFeatures.subdivRatio)
    colorProbs.push(split)
    remaining -= split
  }
  return colorProbs
}

function mousePressed(){
 if (mouseButton === LEFT) {
    setTimeout(_=> { clicked = false},  500); 
  if(clicked){
   if(intFeatures.mode==MODE_FLAT){
      isLooping()?noLoop():loop()
   } else {
     initPiece()
     loop()
   }
    }
   clicked = true
 }
}

function touchStarted(){
   setTimeout(_=> { clicked = false},  500); 
  if(clicked){
   if(intFeatures.mode==MODE_FLAT){
      isLooping()?noLoop():loop()
   } else {
     initPiece()
     loop()
   }
    }
   clicked = true
}

function keyPressed(){
  if (keyCode === 82) { // R
    if(intFeatures.mode==MODE_FLAT){
      if(renderCount>1){ 
        initPiece()
        redraw()
      }
    } else {
      initPiece()
    }
  }
}


//////////////////////////////////
// FXHASH RANDOM UTIL FUNCTIONS //
//////////////////////////////////

function random_num(a, b) {
    return a+(b-a)*fxrand()
  }

function random_int(a, b) {
  return Math.floor(random_num(a, b+1))
}

function random_bool(p) {
  return fxrand() < p;
}

function random_choice(list) {
  return list[random_int(0, list.length - 1)];
}

function weighted_index(list){
  let totalWeight = 0;

  for (let i = 0; i < list.length; i++) {
    totalWeight += list[i];
  }

  let random = totalWeight * fxrand();
  for (let i = 0; i < list.length; i++) {
    if (random < list[i]) {
      return i;
    }
    random -= list[i];
  }
  return list.length-1;
}

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(fxrand() * (i + 1));
        let x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function cosh_num(a, b) {
    return a + (b - a) * cosh_rand()
}

function cosh_rand(){
  let r = Math.cosh(fxrand()*2)-1
  r=fxrand()<0.1?r:max(0,min(1,r))
  return fxrand()>0.8?r:1-r;
}