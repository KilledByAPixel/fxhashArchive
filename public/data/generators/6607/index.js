// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()


let S = 500
let colors = [[255, 255, 255], [95, 79, 53], [19, 20, 22], [255, 217, 172], [246, 203, 0], [39, 43, 44], [185, 36, 55], [70, 73, 78], [129, 134, 138], [175, 179, 180], [229, 196, 83], [255, 220, 49], [249, 218, 91]]
let fColors = []

let bckColor = colors[parseInt(getRandomInt(0,colors.length))]
let pplColor 
let d = 0
for(let i =0; i < colors.length; i += 1){
  let strokeColor = colors[parseInt(getRandomInt(0,colors.length))]
  let dif = Math.abs(bckColor[0] - strokeColor[0]) + Math.abs(bckColor[1] - strokeColor[1]) + Math.abs(bckColor[1] - strokeColor[1])
  if (dif > 120){
    fColors.push(strokeColor)
    if(dif > d){
      pplColor = strokeColor
      d = dif
    }
  }
}
colors = fColors

let LINEFLOOR




// RoofType 0:No Roof 1:All triangular 2: 50% triangular  3: circular  4:castle  5;combo
let roofType = parseInt(getRandomInt(0,6))

// Windowds 0: No  1: All  2: 50% 3: Up and down
let windowType = parseInt(getRandomInt(0,4))

// Minimal is no elevation lines and no ppl
let minimalist = parseInt(getRandomInt(0,100)) < 2

//Antennas yes or no
let anth = parseInt(getRandomInt(0,1))

//Floating or touch the floor
let floating = parseInt(getRandomInt(0,3)) < 2


// Define if birds or not
let drawBirds = parseInt(getRandomInt(0,10)) < 1

//Full Moon or not
let moon = parseInt(getRandomInt(0,100)) < 7

//Name
let name = "Castle Rock"

let slabsTop = []
let slabsBtm = []

let nFloors = parseInt(getRandomInt(8,19))
let adjust

let pg
// this code writes the values to the DOM as an example
function setup() {
  let SEED = int(fxrand() * 100000000)
  
  //let cvs = createCanvas(S, S, SVG);
  let screenSize
  if (windowWidth < windowHeight) { screenSize = windowWidth}
  else {screenSize = windowHeight}
  S = 1000
  screenSize = screenSize - (screenSize * 0.3)
  
  //let cvs = createCanvas(screenSize, screenSize, SVG);
  let cvs = createCanvas(S, S);
  pg = createGraphics(S, S)
  randomSeed(SEED)

 

  pg.background(bckColor[0], bckColor[1], bckColor[2]);
  let c = "rgb(" + String(bckColor[0]) + "," + String(bckColor[1]) + "," + String(bckColor[2]) + ")"
  document.body.style.backgroundColor = c


  //SUN/MOON
  
  let sunColor = colors[int((random(0,colors.length)))]
  pg.fill(sunColor)
  pg.noStroke()
  let xCircle = 100 
  let circleR = random(60,140)
  xCircle = circleR
  pg.circle(xCircle, xCircle, circleR)
  pg.fill(pplColor)
  //Details
  pg.stroke(sunColor)
  moonDetails([xCircle, xCircle], xCircle/2, xCircle/10)
  //Media Luna
  if(moon){
    pg.fill(bckColor)
    pg.noStroke()
    let moonDir = 1
    if(random(0,1) < 0.5){
      moonDir = -1
    }
    pg.circle(xCircle + random(circleR/8 * moonDir,circleR/6 * moonDir), xCircle, circleR)
  }
 
  // RoofTop max height
  let maxRoofH = random(20,60) 
  let maxChimen = random(20,100) 
  let floorH = random(4,8) 


  
  //Background lines - landscape
  
  let strColor = colors[int((random(0,colors.length)))]
  pg.stroke(strColor[0], strColor[1], strColor[2]);

  let bckPos = random(1.2, 1.7)
  let pointy = random(20,200) 
  let nBck = int(random(1,4))
  for(let j =0; j < nBck; j += 1){
  let x = 0
  //let y1 = screenSize/bckPos
  let y1 = S/bckPos
  let y2 = y1 - pointy
  let ptA = [x, random(y1, y2)]
    for(let i =0; i < 100; i += 1){
      x = x + random(40,200)

      let ptB = [x, random(y1, y2)]
      //First the shape
      pg.noStroke()
      pg.fill(bckColor)
      pg.beginShape()
      //vertex(ptA[0], screenSize)
      pg.vertex(ptA[0], S)
      pg.vertex(ptA[0], ptA[1])
      pg.vertex(ptB[0], ptB[1])
      //vertex(ptB[0], screenSize)
      pg.vertex(ptB[0], S)
      pg.endShape()
      //Then the line
      pg.strokeWeight(0.5)
      sketchyLine([ptA, ptB], strColor, 4 ,8 )
      ptA = ptB
      //if(x > screenSize){
        if(x > S){
        break
      }
    }
}

  //Floor
    //Define the line
    let FloorY = S - S * 0.1
    let A = [0,FloorY]
    let B = [S,FloorY]

    LINEFLOOR = [A,B]
    // Stroke Color
    let stColor = colors[int((random(0,colors.length)))]

    //Line Width
    let maxLine = random(8,16)
    let minLine = random(0.8, 2)
    pg.strokeWeight(2)
    sketchyLine(LINEFLOOR, stColor, maxLine, minLine)



  //If minimal just one color
  if (minimalist){
    colors = [pplColor]
  }





  let buildingW = int(random(4,7))

  //Avoid little buildings with flat roofs
  if(roofType == 0 && nFloors < 9){
    roofType = int(random(1,4))
  }

  // Define sections height
  let sectionH = 40 
  let h = FloorY

 
  if(floating){
    h = h - sectionH
  }
  for(let i =0; i < nFloors; i += 1){

    
    let limX = S/buildingW
    let A = [random(limX, S - limX), h + random(-1,1)]
    let B = [random(limX, S - limX), h + random(-1,1)]

    let LINE = [A,B]
    //Define the line
    h = h - sectionH



    //Define the floor height
    let fh = h - random(sectionH, sectionH * floorH) 
    let A2 = [A[0], fh]
    let B2 = [B[0], fh]
    let LINE2 = [A2, B2]


    if(fh > maxChimen && fh > maxRoofH){
      slabsBtm.push(LINE)
      slabsTop.push(LINE2)
    }



  }


  // ADD Columns
  pg.strokeWeight(1)
  for(let i =0; i < slabsBtm.length; i += 1){
        //Choose a slab
        let slab = slabsBtm[i]
        //Add Column
        for(let j =0; j < 2; j += 1){
          let pplX = random(slab[0][0], slab[1][0])
          let colLine = [[pplX, slab[0][1]], [pplX, FloorY]]
  
          let stColor = colors[int((random(0,colors.length)))]
          let maxLine = random(2,4) 
          let minLine = random(0.4, 1.4) 
          sketchyLine(colLine, stColor, maxLine, minLine)
        }

  }

  // ADD Sections
  let combo = roofType == 5
  for(let i =0; i < slabsBtm.length; i += 1){

        if(combo){
          roofType = int(random(0,5))
        }

        let A = slabsBtm[i][0]
        let B = slabsBtm[i][1]
        let A2 = slabsTop[i][0]
        let B2 = slabsTop[i][1]
        let LINE = [A,B]
        let LINE2 = [A2,B2]
        let fh = A2[1]

        //BackgroundRectangle
        pg.fill(bckColor)
        pg.fill(pplColor)
        pg.noStroke()
        let rectX = [A[0], B[0]].sort((a, b) => a - b)
        //rect(rectX[0], fh, 10, 10)
        pg.rect(rectX[0], fh, Math.abs(rectX[1] - rectX[0]), Math.abs(A[1] - A2[1]))  

        //ADD ROOF
        // RoofType 0:No Roof 1:All triangular 2: 50% triangular  3: circular  4:castle
        
        if( i == slabsBtm.length-1 || true){
          let roofPt = [random(A2[0], B2[0]), A2[1] - maxRoofH]
          let maxLine = random(4,6) 
          let minLine = random(0.4, 1.4) 
          let stColor = colors[int((random(0,colors.length)))]

          pg.noStroke()
          pg.fill(pplColor)

          if(roofType == 0){
            //
          }

          else if(roofType == 1 || roofType == 2){
            let draw = true
            if(roofType == 2 && random(0,1) < 0.5){
              draw = false
            }
            if(draw){

              pg.beginShape()
              pg.vertex(A2[0], A2[1])
              pg.vertex(roofPt[0], roofPt[1])
              pg.vertex(B2[0], B2[1])
              pg.vertex(A2[0], A2[1])
              pg.endShape()
    
              sketchyLine([[A2[0], A2[1]],[roofPt[0], roofPt[1]] ], stColor, maxLine, minLine)
              sketchyLine([[B2[0], B2[1]],[roofPt[0], roofPt[1]] ], stColor, maxLine, minLine)
    
            }


          }

          else if(roofType == 3){
            //Center of elipse
            
            let elipseWidth = distPts(A2, B2)
            let h = random(30,50) 
            let centreElipse = rectX[0] + elipseWidth/2
            pg.ellipse(centreElipse, A2[1], elipseWidth, h)
          }

          else if(roofType == 4){
            //Castle Like
            let dist = int(distPts(A2, B2) / 5)
            for(let j =0; j < dist; j += 1){
              let size1 = random(6,10) 
              let size2 = random(10,20) 
              let position = [random(A2[0], B2[0]), A2[1]]
              pg.rect(position[0] + size1, position[1] + 3 , -size1, -size2)
            }

          }

        }

        //Section Elements Elevation
        
          let floorL = int(Math.abs(A[1] - A2[1])) / 4
          let stColor = colors[int((random(0,colors.length)))]
          for(let j =0; j < floorL; j += 1){
            let x = random(A[0], B[0])
            let a = [x, A[1]]
            let b = [x + random(-1,1), A2[1]]
            pg.stroke(stColor)
            pg.strokeWeight(0.1)
            pg.line(a[0], a[1], b[0], b[1])
          }
        

    
        // Section Lines
        pg.strokeWeight(2)
        let LINES = [LINE, LINE2]
        
          for(let j =0; j < LINES.length; j += 1){
            // Stroke Color
            let stColor = colors[int((random(0,colors.length)))]
            //Line Width
            let maxLine = random(2,4) 
            let minLine = random(0.4, 1.4) 
            sketchyLine(LINES[j], stColor, maxLine, minLine)
    
               //Beams
            for(let n=0; n < LINES[j].length; n += 1){
              let colB = mv(LINES[j][n], [0, random(3,5) ])
              sketchyLine([LINES[j][n], colB], stColor, 1 , 2 )
            }
        }
        



        //Add Chimn
        if(i > slabsBtm.length/1.5){
          //Multiple chim
          for(let j =0; j < random(0,6); j += 1){
            let chimH = random(maxChimen/2, maxChimen)
            let roofPtA = [random(A2[0], B2[0]), A2[1]]
            let roofPtB = mv(roofPtA, [0,-chimH])
            //fill(pplColor)
            sketchyLine([roofPtA, roofPtB], pplColor, 4 , 10)
          }
        }

        //Add tendedero
        tendedero([A, B], A[1] - A2[1], pplColor)

        //ADD WINDOWS
        // Windowds 0: No  1: All  2: 50%  3: Up and down
        pg.noStroke()
        pg.fill(bckColor)
        if(windowType != 0){
          let dist = int(distPts(A2, B2))
          let nWindows = int(dist/20)
          let h = A[1] - A2[1]
          let hWindow = random(12, 40)
          let yWindow = A[1] - h/2 - hWindow

          let draw = true
          if(windowType == 2 || windowType == 3){
            draw = random(0,1) < 0.5
          }

          let extraY = 0
          
          //Multiple WINDOWS
          for(let j =0; j < nWindows; j += 1){
            if(windowType == 3){
              let range = h/2 - hWindow*2
              extraY = random(-range, range)
            }

            if(draw){
              let xWindow = random(A2[0], B2[0])
              pg.rect(xWindow, yWindow + extraY, 4, hWindow)
            }

          }
        }



        
  }

  // ADD People
  let nPpl = random(5,100)
  slabsBtm.splice(0,0,LINEFLOOR)
  for(let i =0; i < nPpl; i += 1){
    //Choose a slab
    let slab = slabsBtm[int(random(0,slabsBtm.length))]
    //Add person
    pg.noStroke()
    let stColor = colors[int((random(0,colors.length)))]
    pg.fill(stColor)
    let pplX = random(slab[0][0], slab[1][0])
    let height = random(-12,-16) 
    pg.rect(pplX, slab[0][1], -4, height)
    //head
    pg.rect(pplX, slab[0][1] - 2 - height, 2, -4 )

  }
  adjust = 1
  // ADD Antenas
  if(anth){
    antena(slabsTop, pplColor, maxChimen, 1, adjust)
  }

  // ADD STAIRS
  let stairDensity = random(0.2, 1)
  stairs(slabsBtm, stairDensity, pplColor, adjust)

  //ADD birds
  if(drawBirds){
    birds(random(7,15), pplColor, adjust)

  }

  resizeCanvas(screenSize, screenSize, false);
  image(pg, 0,0, screenSize, screenSize)
  //saveCanvas(cvs, 'myCanvas', 'jpg');
  //save("mySVG.svg"); // give file name
}

function sketchyLine(LINE, strokeColor, maxLine, minLine){
  pg.stroke(strokeColor)
  // Define the vector
  let vx = LINE[1][0] - LINE[0][0]
  let vy = LINE[1][1] - LINE[0][1]
  let v = unit([vx, vy])
  // Rotate the vector 90deg
  let vR = [-1 * v[1], v[0]]

  let dist = distPts(LINE[0], LINE[1])
  let nDivisions = dist/1.3

  //mv intensity
  let mvment = []
  for(let i =0; i < nDivisions; i += 1){
    let mv0 = random(0, dist)
    mvment.push(mv0)
  }

  mvment = mvment.sort((a, b) => a - b)

  for(let i =0; i < nDivisions; i += 1){
    let mv0 = mvment[i]
    mv0 = v_mult(v, mv0)
    let linePt = mv(LINE[0], mv0)


    // //Draw the line
     let length = random(minLine, maxLine)
     let mv1 =  v_mult(vR, length)

     linePt = mv(linePt, v_mult(mv1, -0.5))
     let lineMv = mv(linePt, mv1)

     pg.line(linePt[0], linePt[1], lineMv[0], lineMv[1])

      // Add some "dirt"
      if(random(0,100) > 98){
        //Move it far
        let intensity = random(maxLine * -5, maxLine * 5)
        intensity = v_mult(vR, intensity)
        let dirtA = mv(linePt, intensity)
        let dirtB = mv(lineMv, intensity)
        pg.line(dirtA[0], dirtA[1], dirtB[0], dirtB[1])
      }
  }

}

function mv(pt, v){
  return [pt[0] + v[0], pt[1] + v[1]]
}

function v_mult(v, intensity){
  return [v[0]*intensity, v[1]*intensity]
}

//&& and

function inboundary(pt, x, y, offsetx, offsety){
  if (pt[0] < offsetx || pt[0] > x - offsetx || pt[1] < offsety || pt[1] > y - offsety) {
    return false
  } 
  else{
    return true
  }
}

function unit(v){
  let m = sqrt(v[0] * v[0] + v[1] * v[1])
  return [v[0]/m, v[1]/m]
}

function reverseV(v){
  return [v[0]*-1, v[1]*-1]
}

function distPts(ptA, ptB){
  let a = ptB[0] - ptA[0]
  let b = ptB[1] - ptA[1]
  return Math.sqrt((a*a) + (b*b))
}

function moonDetails(pos, radius, lineSize){
  let nDetails = int(random(3,10))
  for(let i =0; i < nDetails; i += 1){
    
    let v = v_mult(unit([random(-1,1), random(-1,1)]), radius)
    
    let pt = mv(pos, v)
    let lineL = [random(lineSize/2, lineSize), 0]
    let pt1 = mv(pt, lineL)
    let pt2 = mv(pt, [lineL[0] * -1, 0])
    pg.line(pt1[0], pt1[1], pt2[0], pt2[1])


  }
}

function stairs(lines, density, color, adjust){
  pg.stroke(color)
  for(let i =0; i < lines.length - 1; i += 1){
    if(random(0,1) < density || i == 0){
      //Always draw the connecting to the ground
      let slabBtm = lines[i]
      let slabTop = lines[i + 1]
      let pt1 = [random(slabBtm[0][0], slabBtm[1][0]), slabBtm[0][1]]
      let pt2 = [random(slabTop[0][0], slabTop[1][0]), slabTop[0][1]]
      if(i==0){
        // Remap the floor x
        pt1 = [random(slabTop[0][0], slabTop[1][0]), slabBtm[0][1]]
      }
      let dist = distPts(pt1, pt2)
  
      let LINE = [pt1, pt2]
        // Define the vector
      let vx = LINE[1][0] - LINE[0][0]
      let vy = LINE[1][1] - LINE[0][1]
      let v = unit([vx, vy])
      let nSteps = dist/2
      for(let j =0; j < nSteps ; j += 1){
        let vInt = random(0, dist)
        let pt = mv(pt1, v_mult(v, vInt))
        pg.line(pt[0], pt[1], pt[0] + random(4,10) * adjust, pt[1])
        
      }

    }

  }
}


function tendedero(LINE, z, color ){
  pg.stroke(color)
  let nTend = int(random(0,2))
  //Get left and right pts
  let ptsX = [LINE[0][0], LINE[1][0]].sort((a, b) => a - b)
  let right = int(random(0,2))
  let ptx = ptsX[0]
  let vDir = -1
  if (right){
    ptx = ptsX[1]
    vDir = 1
  }
  let pt = [ptx, LINE[0][1]]
  for(let i =0; i < nTend; i += 1){
    let tpt = mv(pt, [0, random(0,-z)])
    // Move the point outside
    let tLength = random(7,20) * vDir
    let tpt2 = mv(tpt, [tLength, 0])
    //Draw the tendedero
    pg.line(tpt[0], tpt[1], tpt2[0], tpt2[1])
    //Hanging Ropes
    let nRopes = int(random(2,10))
    for(let j =0; j < nRopes; j += 1){
      let r1 = [random(tpt[0], tpt2[0]), tpt[1]]
      let rz = random(2,10)
      let r2 = mv(r1, [0, rz])
      pg.line(r1[0], r1[1], r2[0], r2[1])
    }


  }
}

function antena(lines, color, maxHeight, density, adjust){
  pg.stroke(color)
  maxHeight = - maxHeight
  for(let i =0; i < lines.length; i += 1){
    let nAnt = int(random(1,9))
    if(random(0,1) < density){
      for(let j =0; j < nAnt; j += 1){
        let slabTop = lines[i]
        let pt = [random(slabTop[0][0], slabTop[1][0]), slabTop[0][1]]
        let pt2 = mv(pt, [random(-2,2) * adjust , random(maxHeight/2, maxHeight)])
        pg.line(pt[0], pt[1], pt2[0], pt2[1])

        let LINE = [pt, pt2]
        // Define the vector
        let vx = LINE[1][0] - LINE[0][0]
        let vy = LINE[1][1] - LINE[0][1]
        let v = unit([vx, vy])
        let d = distPts(pt, pt2)

        let nDetails = int(random(2,5))
        for(let u=0; u < nDetails; u +=1 ){
          let p = mv(pt, v_mult(v, random(d/2,d)))
          let w = random(2,5) * adjust
          let vr = v_mult([-v[1], [0]], w)
          let p2 = mv(p, vr)
          pg.line(p[0], p[1], p2[0], p2[1])
        }
      }
    }
  }
}

function trees(lineFloor, color, maxHeight, adjust){
  pg.stroke(color)
  maxHeight = - maxHeight
  //10% chance of tree on roof
  //50% of bush on roof
  //40% of tree on ground
  let opt = random(0,100)
  // Trees on ground
  if(opt > 30){
    opt = 0
    edge = lineFloor[0]
  }
  // Bush
  else {
    opt = 1
    edge = lineFloor[int(random(1, lineFloor.length))]
  }


    if(opt == 0){
        //let edge = lineFloor[0]
        let pt = [random(edge[0][0] + 20, edge[1][0] - 20), edge[0][1]]
        let pt2 = mv(pt, [random(-2,2) * adjust, random(maxHeight/4, maxHeight)])
        pg.line(pt[0], pt[1], pt2[0], pt2[1])

        let LINE = [pt, pt2]
        // Define the vector
        let vx = LINE[1][0] - LINE[0][0]
        let vy = LINE[1][1] - LINE[0][1]
        let v = unit([vx, vy])
        let d = distPts(pt, pt2)

        pg.strokeWeight(0.5 * adjust)
        let nDetails = int(random(2,5))
        for(let u=0; u < nDetails; u +=1 ){
          let p = mv(pt, v_mult(v, random(d/2,d)))
          let w = random(-15,15) * adjust
          let vr = v_mult([-v[1], [0]], w)
          let p2 = mv(p, vr)
          pg.line(p[0], p[1], p2[0], p2[1])
        }

        let leaves = int(random(22,135))
        //noStroke()
        for(let u=0; u < leaves; u +=1 ){
          let p = mv(pt, v_mult(v, random(d/2,d)))
          let w = random(-15,15) * adjust
          let vr = v_mult([-v[1], [0]], w)
          let p2 = mv(p, vr)
          pg.rect(p2[0], p2[1], random(0,1), random(0,1))
      }
    }

    else{
      let nLeaves = random(50,100)

      
      if(random(0,4) < 1){
        let x1 = random(edge[0][0], edge[1][0])
        let x2 = random(edge[0][0], edge[1][0])
      for(let i =0; i < nLeaves; i += 1){
          let ptx = random(x1, x2)
          let pty = edge[0][1] + random(-5,30) * adjust
          pg.rect(ptx, pty, random(0,1) * adjust, random(0,1) * adjust)
      }
    }
    else{
      let ptx = random(edge[0][0], edge[1][0])
      let pty = edge[0][1]

      let wBush = random(0,6) * adjust
      let hBush = random(20, 100) * adjust

      let nBushes = random(10,30)
      for(let i =0; i < nBushes; i += 1){
        let npty = random(0,hBush) + pty
        let nptx = random(-wBush,wBush) + ptx
        pg.rect(nptx, npty, random(0,2), random(0,2))
      }
        
      }
        
    }

  }



function birds(nBirds, color, adjust){
  pg.stroke(color)
  
  for(let i =0; i < nBirds; i += 1){
    let x = random(0, 1000)  * adjust
    let y = random(10,500)  * adjust
    let birdSize = random(2,6)  * adjust
    pg.line(x - birdSize, y - birdSize, x, y)
    pg.line(x,y, x + birdSize, y - birdSize)
  }
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  if (windowWidth < windowHeight) { screenSize = windowWidth}
  else {screenSize = windowHeight}
  screenSize = screenSize - (screenSize * 0.3)
  resizeCanvas(screenSize, screenSize, false);
  image(pg, 0,0, screenSize, screenSize)
}


// Difference on time from genesis
let genesis = new Date("01/11/2022")
genesis = genesis.getTime();

let now = new Date();
now = now.getTime();

let difTime = now - genesis
let nDays = Math.floor(difTime / (1000 * 3600 * 24))
console.log("days", nDays)

let count = 0
let drawText = true
let grow = false
function draw() {
  // // put drawing code here
  //SLABS
  let greenSlabs = [LINEFLOOR]
  greenSlabs = greenSlabs.concat(slabsTop)

  let texto = " days have passed since I was born"
  if(nDays == 1) {
    texto = " day have passed since I was born"
  }

  if(count == 0 && drawText && grow){
    drawText = false
    pg.fill(pplColor)
    pg.textSize(20);
    pg.text(String(nDays) + texto, 10, 950)
  }

  if (windowWidth < windowHeight) { screenSize = windowWidth}
  else {screenSize = windowHeight}
  screenSize = screenSize - (screenSize * 0.3)

  let maxHeight = 200 * adjust
  let treeColor = colors[int((random(0,colors.length)))]
  if(count < nDays && grow){
    //Make a very big tree
    if(random(0,100) > 99){
      maxHeight = 400 * adjust
    }
    //Create 1,2 or 3 vegetation per day
    for(let i =0; i < int(random(1,10)); i += 1){
      trees(greenSlabs, treeColor, maxHeight, adjust)
    }
    
    count += 1
    image(pg, 0,0, screenSize, screenSize)
  }


}

// this function fires with any touch anywhere
function touchStarted() {
  grow = true;
  //save("mySVG.svg"); // give file name
}

function keyTyped() {
  if (key === "s" || key === "S"){
    save(pg, 'NonSpace.png');
  }

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(fxrand() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function colorString(color){
  let colorS = "rgb: " + String(color[0]) + "," + String(color[1]) + "," + String(color[2])
  return colorS
}


// DEFINE TOKEN ATTRIBUTES
// RoofType 0:No Roof 1:All triangular 2: 50% triangular  3: circular  4:castle  5;combo
let roof = ["Flat", "Gable", "Gable", "Domes", "Castle", "Combo"]
window.$fxhashFeatures = {
  "Background Color": colorString(bckColor),
  "Building Color": colorString(pplColor),
  "Roof Type": roof[roofType],
  "Moon": moon,
  "Floating Building": floating,
  "Minimal":minimalist,
  "Birds": drawBirds,
  "Number of floors": nFloors
}