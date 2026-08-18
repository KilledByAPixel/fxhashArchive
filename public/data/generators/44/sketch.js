let colors = []

// features
let scheme
let density
let numberOfSegments
let segmentVars = []

function windowResized(){
  createCanvas(min(window.innerWidth,window.innerHeight),min(window.innerWidth,window.innerHeight));
  redraw()
}

function setup() {
  windowResized()
  
  // Features
  scheme = ['Light','Dark','Mondrian'][random_int(0,2)]
  numberOfSegments = random_int(4,40)
  
  if (scheme === 'Dark'){
    colors = ['#23120b','#F1F1F1']
    noStroke()
  } else if (scheme === 'Light'){
    colors = ['#F1F1F1','#23120b']
    noStroke()
  } else if (scheme === 'Mondrian'){
    colors = ['#F1F1F1','#dd0100','#225095','#FDB827']
    noStroke()
  }
  
  for(let i=0;i<numberOfSegments;i++){
    let startRadius = random_num(0.05,0.2)
    let endRadius = random_num(startRadius,random_num(0.25,0.4))
    
    let startAngle = random_int(0,360)
    let endAngle = random_int(startAngle+10,startAngle+45)%360
    
    let alphaColor = colors[random_int(1,colors.length-1)]
    let gap = 0.25*random_int(1,10)
    
    let obj = {
      "startRadius":startRadius,
      "endRadius":endRadius,
      "startAngle":startAngle,
      "endAngle":endAngle,
      "color":alphaColor,
      "gap":gap
    }
    segmentVars.push(obj)
  }
  
  window.$fxhashFeatures = {
    "Style":scheme,
    "Density":getFeatureString("density",numberOfSegments)
  }

  noLoop()
}

function getFeatureString(feature,value) {
  if(feature=="density"){
    if (value < 10) return "Low"
    if (value < 20) return "Medium"
    else return "High"
  }
}

function draw() {
  background(colors[0]);
  translate(width/2,height/2)
  
  for(let c=0;c<numberOfSegments;c++){    
    let alphaColor = color(segmentVars[c].color)
    let gap = 0.25*random_int(1,10)
    
    for (let b=width*segmentVars[c].startRadius;b<width*segmentVars[c].endRadius;b+=width/(width/segmentVars[c].gap)){
      let alpha = map(c,0,numberOfSegments,150,235)
      alphaColor.setAlpha(alpha)
      stroke(alphaColor)
      strokeWeight(width/(width/random_num(0.5,1)))
      noFill()
      beginShape();
      for (let a=segmentVars[c].startAngle;a<segmentVars[c].endAngle;a+=1) {
        let xoff = map(Math.cos(a + 1), -1, 1, 0, 10);
        let yoff = map(Math.sin(a + 1), -1, 1, 0, 10);
        let noiseAmount = width/(width/0.5)
        let r = map(noise(xoff, yoff,b*0.1), 0, 1, b, b+noiseAmount);
        let x = r * Math.cos(radians(a));
        let y = r * Math.sin(radians(a));
        vertex(x, y);
      }
      endShape();  
    }
  } 
}

function random_num(a, b) {
    return a+(b-a)*fxrand()
  }
function random_int(a, b) {
  return Math.floor(random_num(a, b+1))
}