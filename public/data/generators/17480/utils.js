function getColors(colors){

  let bckColor = colors[getRandomIntOut(0,colors.length)]
  let bckSum = bckColor[0] + bckColor[1] + bckColor[2]
  let noColorComb = [814, 622, 623, 694, 288, 589, 722, 563, 939, 682, 1166, 992, 520, 639, 732, 953, 866, 282, 227, 765, 761, 595, 705, 775, 766, 503, 450, 1088, 1093, 976, 1033, 1273, 1289, 1323, 1154, 947, 1028, 1214, 1352, 575, 1299, 780, 847, 988, 174, 794, 768, 1045, 899, 628, 904, 1285, 796, 1040, 708, 826, 1025, 569, 827, 810, 746, 818, 813] //color sum not accepted by the algo
  let shufColors = shuffle(colors)
  let colSum
  let stkSum
  let stkColor
  for(let i =0; i < shufColors.length; i += 1){
    stkColor = shufColors[i]
    stkSum = stkColor[0] + stkColor[1] + stkColor[2]
    let dif = Math.abs(stkSum -  bckSum)
    colSum = bckSum + stkSum
    if (dif > 150 && !noColorComb.includes(colSum)){
      break
    }
  }

  // If bckground is darker than lines, make the special darker
  bckSum = bckColor[0] + bckColor[1] + bckColor[2]
  stkSum = stkColor[0] + stkColor[1] + stkColor[2]
  let bckIsDarker = bckSum < stkSum
  colSum = bckSum + stkSum

  return [bckColor, stkColor, bckIsDarker, colSum]
}
function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function getRandomInt(min, max) {

  if(Math.abs(min-max) <= 0.002) return min;

  if(max < min){
    var mn = max;
    var mx = min;

    min = mn;
    max = mx;
  }

  min = Math.ceil(min);
  max = Math.floor(max)-0.001;
  const r = random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
  return Math.floor(r)
}

function getRandom(min=0, max=1) {
  return (random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getRandomIntOut(min, max) {
  if(Math.abs(min-max) <= 0.002) return min;

  if(max < min){
    var mn = max;
    var mx = min;

    min = mn;
    max = mx;
  }

  min = Math.ceil(min);
  max = Math.floor(max)-0.001;
  const r = fxrand() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
  return Math.floor(r)
}

function getRandomOut(min=0, max=1) {
  return (fxrand() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function dash(dashed = true, anim = false){
  if(dashed){
    let dashMax = canvasSize * 0.002
    let dashMin = canvasSize * 0.0005
    dL = [getRandom(dashMin,dashMax), getRandom(dashMin,dashMax)] //line, gap
    setLineDash(dL, anim)
  }
  else{
    setLineDash([1,0], anim)
  }

}

function setLineDash(list, anim = false) {
  if(anim){
    pgAnim.drawingContext.setLineDash(list);
  }
  else{
    pg.drawingContext.setLineDash(list);
  }
  }

function shape(pts, anim=false){
  if(anim){
    pgAnim.beginShape()
    pts.map(p => pgAnim.vertex(p[0], p[1]))
    pgAnim.endShape(CLOSE);
  }
  else{
    pg.beginShape()
    pts.map(p => pg.vertex(p[0], p[1]))
    pg.endShape(CLOSE);
  }

}

function shapeCrv(pts){
  pg.beginShape()
  pts.map(p => pg.curveVertex(p[0], p[1]))
  pg.endShape(CLOSE);
}

function rectangles(pts, colors, minL, maxL, density){
    for(let j = 0; j < pts.length - 1; j += 1){
      if(random(0,1) < density){
        let ptx = pts[j][0]
        let pty = pts[j][1]
        let l = getRandomInt(minL, maxL)
        let rColor = colors[parseInt(getRandomInt(0,colors.length))]
        pg.fill(rColor)
        pg.rect(ptx, pty, l, l)
      }

    }
      
  }

function lineShifted(line, maxShift){
  let v = v2pt(line[0], line[1])
  v = unit(vector90(v))
  mvInt = getRandom(-maxShift, maxShift)
  v = v_mult(v, mvInt)
  let ts = [0]
  for (let i = 0; i < 3; i++) {
    ts.push(getRandom())
  }
  ts.push(1)
  ts.sort((a, b) => a - b)
  let pts = []
  for (let i = 0; i < ts.length; i++) {
    let p1 = evaluateCurve(line, ts[i])
    if(i==2 || i ==3){
      p1 = mv(p1, v)
    }
    pts.push(p1)
  }
  for (let i = 0; i < pts.length - 1; i++) {
    if(getRandom() > 0.2){
      pg.line(pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1])
    }
  }
  
}

  function mv(pt_, v_){
    return [pt_[0] + v_[0], pt_[1] + v_[1]]
  }
  
  function v_mult(vector_, intensity){
    return [vector_[0]*intensity, vector_[1]*intensity]
  }
  
  function rotatePt(angle, pt, ptO ){
    //Convert to radians
    angle = angle * Math.PI / 180

    //Translate point back to origin
    let px = pt[0] - ptO[0]
    let py = pt[1] - ptO[1]

    //Rotate point
    let Rx = (px * Math.cos(angle)) - (py * Math.sin(angle))
    let Ry = (px * Math.sin(angle)) + (py * Math.cos(angle))

    //Translate point back
    Rx = Rx + ptO[0]
    Ry = Ry + ptO[1]

    return [Rx, Ry]
  }

  
  function inboundary(pt, x, y, offsetx, offsety){
    if (pt[0] < offsetx || pt[0] > x - offsetx || pt[1] < offsety || pt[1] > y - offsety) {
      return false
    } 
    else{
      return true
    }
  }

  function v_mult(v, intensity){
    return [v[0]*intensity, v[1]*intensity]
  }

  function unit(v){
    if(v[0]== 0 && v[1]== 0){
      return [0,0]
    }
    let m = sqrt(v[0] * v[0] + v[1] * v[1])
    return [v[0]/m, v[1]/m]
  }

  function v2pt(pt1, pt2, unitV=false){
    let x = pt2[0] - pt1[0]
    let y = pt2[1] - pt1[1]
    //same pts
    if(x == 0 && y == 0){
      return [0,0]
    }
    if(unitV){
      return unit([x,y])
    }
    return [x,y]
  }

  function vAdd(v1, v2){
    return [v1[0] + v2[0], v1[1] + v2[1]]
  }

  function dist2pts(pt1, pt2){
    return (Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2)))
  }

  function ptInShape(pt, shape){
    //the shape is a list with pts. Each pt join with the next one
    let ptLine1 = [-10000, pt[1]]
    let ptLine2 = pt
    n = 0

    shape = shape[0]
    //iterate all the lines
    for(let i = 0; i < shape.length - 1; i += 1){

      if(linesIntersection(ptLine1, ptLine2, shape[i], shape[i + 1])){
        n += 1
      }
    }
    //if the number is odd the pt is inside the shape
    if(n % 2 == 1){
      return true
    }
    else{
      return false
    }
  }

  function linesIntersection(p1,p2,p3,p4){
    let A1 = p2[1] - p1[1]
    let B1 = p1[0] - p2[0]
    let C1 = A1 * p1[0] + B1 * p1[1]

    let A2 = p4[1] - p3[1]
    let B2 = p3[0] - p4[0]
    let C2 = A2 * p3[0] + B2 * p3[1]

    let det = int(A1 * B2 - A2 * B1)

    if (det == 0) {
      //Lines are parallel
      return false
    } else {
      let x = int((B2 * C1 - B1 * C2) / det)
      let y = int((A1 * C2 - A2 * C1) / det) //X Y FROM THE INTERSECTING POINT
   

      // Pt in the domain 
      let xDomain = [int(p3[0]), int(p4[0])]
      let yDomain = [int(p3[1]), int(p4[1])]
      xDomain.sort((a, b) => a - b)
      yDomain.sort((a, b) => a - b)
      let inDomainX = xDomain[0] <= x && x <= xDomain[1]
      let inDomainY = yDomain[0] <= y && y <= yDomain[1]


      if (inDomainX && inDomainY && x < p2[0]){

        return [x,y]
      }
      else{
        return false
      }
    }

  }



  function offsetShape(shape, dist){
  //OFFSET 3DASPECT
  let dom = domain(shape)
  let center = dom[0]
  let offsetShape = []
  for (let i = 0; i < shape.length - 1; i++) {
    let A = shape[i]
    let B = shape[shape.length - 1]
    let C = shape[i + 1]
    if(i!=0){B = shape[i - 1]}
    let v = vectorBetween2v(A,B,C)
    
    let po = mv(A, v_mult(v,dist));
    offsetShape.push(po)
  }


  return offsetShape

}

  function rotVec(v, angle){
    //Angle in degrees
    angle = angle * Math.PI/180
    let oldX = v[0]
    let oldY = v[1]
    newX = oldX * Math.cos(angle) - oldY * Math.sin(angle)
    newY = oldX * Math.sin(angle) + oldY * Math.cos(angle)
    return [newX, newY]
  }

  function mirror(shapes, x, y, S){
    let newShapes = []
    for (let i = 0; i < shapes.length ; i += 1){
      let s = []
      for (let j = 0; j < shapes[i].length ; j += 1){
        let nX = shapes[i][j][0]
        let nY = shapes[i][j][1]
        if(x){
          nX = S - nX
        }
        if(y){
          nY = S - nY
        }
        s.push([nX,nY])

      }
      newShapes.push(s)
    }

    return newShapes
  }



function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(fxrand() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function keyTyped() {

    if (key === "e" || key === "E"){
      pg.clear()
    }

  }




//get height and width from a cloud point
function domain(pts){
    let x = pts.map(i => i[0])
    let y = pts.map(i => i[1])
    x.sort((a, b) => a - b)
    y.sort((a, b) => a - b)
    
    w = Math.abs(x[x.length-1] - x[0])
    h = Math.abs(y[y.length-1] - y[0])

    //la mitad del rectangulo: punto medio
    px = x[0] + (w/2)
    py = y[0] + (h/2)

    return [[px, py], w, h,x[0], y[0]]
}

function evaluateCurve(line, t){
    //t is 0 to 1 of the curve lengt
    v = unit(v2pt(line[0], line[1]))
    dist = dist2pts(line[0], line[1])
    vmv = v_mult(v, t * dist)
    pt = mv(line[0], vmv)
    return pt
}

function vector90(v){
    return [v[1]*-1, v[0]]
}

function brokenLine(line, nDiv, maxMv, strokeDom, color){
    let vU = unit(vector90(v2pt(line[0], line[1])))
    let brkL = []
    ts = [0,1]
    for (let i = 0; i < nDiv-1 ; i += 1){
        ts.push(getRandom(0,1))
    }
    ts.sort((a, b) => a - b)
    //break the lines mtfk
    for (let i = 0; i < nDiv ; i += 1){
        p0 = evaluateCurve(line, ts[i])
        p1 = evaluateCurve(line, ts[i+1])
        //mv the point
        v = v_mult(vU, getRandom(-maxMv, maxMv))
        p0m = mv(p0, v)
        p1m = mv(p1, v)
        //Draw the line
        stroke = getRandom(strokeDom[0], strokeDom[1])
        pg.strokeWeight(stroke)
        pg.stroke(color)
        pg.line(p0m[0], p0m[1], p1m[0], p1m[1])
        brkL.push([p0m, p1m])
    }

    return brkL
}

function choice(list){
  index = getRandomInt(0, list.length)
  return list[index]
}

function choiceOut(list){
  index = getRandomIntOut(0, list.length)
  return list[index]
}


function curve2pts(p1,p2){
  pmid = evaluateCurve([p1,p2], 0.5)
  d = dist2pts(p1,p2)/6
  let vU = unit(vector90(v2pt(p1,p2)))
  pmidMv = mv(pmid, v_mult(vU, d))
  
  pg.noFill();
  shape([p1, p1, pmidMv, p2, p2])
}

function colorInt(color, max){
  v = getRandom(-max,max)
  newColor = color.map(x => x + v)
  pg.fill(newColor)
}

function rectangle(pt0, dir, w, h, draw_=true, returnPts = false, offSet = false, anim = false)
{
    let v = unit(dir)
    vR = vector90(v)
    let p1 = mv(mv(pt0, v_mult(vR, w/2)), v_mult(v, h/2))
    let p2 = mv(p1, v_mult(vR, -w))
    let p3 = mv(p2, v_mult(v, -h))
    let p4 = mv(p3, v_mult(vR, w))
    let pts = [p1,p2,p3,p4]
    if(draw_){
      shape(pts, anim)      
    }
    // Offset corners
    if(offSet){
      let minSide = [h, w].sort((a, b) => a - b)[0]
      let offVal = minSide * 0.1
      let lineLen = minSide * getRandom(0.1,0.5)
      for (let i = 0; i < pts.length; i++) {
        let p = pts[i]
        // Line direction
        let pback
        if(i == 0){pback = pts[3]}
        else{pback = pts[i-1]}
        let pFront
        if(i == pts.length - 1){pFront = pts[0]}
        else{pFront = pts[i+1]}
        let vBack = v_mult(unit(v2pt(p, pback)), lineLen) 
        let vFront = v_mult(unit(v2pt(p, pFront)), lineLen) 
        /////Offset pt
        let pOffset = mv(p, v_mult(unit(vBack), -offVal))
        pOffset = mv(pOffset, v_mult(unit(vFront), -offVal))
        //Line length
        let pOffBack = mv(pOffset, vBack)
        let pOffFront = mv(pOffset, vFront)
        pg.line(pOffset[0],pOffset[1],pOffBack[0],pOffBack[1])
        pg.line(pOffset[0],pOffset[1],pOffFront[0],pOffFront[1])
        
      }
    }


    if(returnPts){
      return [p1,p2,p3,p4]
    }
    return [[p1,p2],[p2,p3],[p3,p4],[p4,p1]]
}

function metaRectangle(pt0, dir, w, h, flip = false, limit, organic, offsetCorner = true, multiOffset = true)
{

    let v = unit(dir)
    if(flip && getRandom()<0.5){
      v = v_mult(v,-1)
    }
    vR = vector90(v)
    let p1 = mv(mv(pt0, v_mult(vR, w/2)), v_mult(v, h/2))
    let p2 = mv(p1, v_mult(vR, -w))
    let p3 = mv(p2, v_mult(v, -h))
    let pEnd = mv(p3, v_mult(vR, w))
    //Make the wing
    wingLength = getRandom(h/3, h)
    wingWidth = getRandom(w/4,w/2)
    let p4 = mv(mv(p3, v_mult(v, -wingLength )), v_mult(vR, w - wingWidth))
    let p5 = mv(p4, v_mult(vR,wingWidth))

    //draw within canvas
    let draw1 = p4[0] > 0 && p4[0] < limit && p4[1] > 0 && p4[1] < limit
    let draw2 = p5[0] > 0 && p5[0] < limit && p5[1] > 0 && p5[1] < limit
    if (draw1 && draw2){
      if(organic){
        shapeCrv([p1,p1,p2,p3,p4,p5,pEnd,pEnd])
      }
      else{
        let metaShape = [p1,p2,p3,p4,p5,pEnd,p1]
        shape(metaShape)
        //offset
        if(multiOffset){
          let offVal = getRandom(0.1,0.2)
          for (let i = 0; i < getRandomInt(0,4); i++) {
            dash()
            let off = offsetShape(metaShape, w * offVal)
            shape(off)
            offVal += getRandom(0.1,0.2)
          }
        }

        dash(false)
        //Offset corner
        if(offsetCorner){
          let offsetS = w * 0.1
          let offsetV1 = v_mult(v, -offsetS)
          let offsetV2 = v_mult(vR, offsetS)
          let po1 = mv(p4, offsetV1)
          let po2 = mv(p5, offsetV1)
          po2 = mv(po2, offsetV2)
          let po3 = mv(pEnd, offsetV2)
          pg.line(po1[0], po1[1], po2[0], po2[1])
          pg.line(po3[0], po3[1], po2[0], po2[1])
        }


      }

    }

    return [p1,p2,p3,p4,p5,pEnd]
}

function rectBend(pt0, dir, w, h, flip = false, limit, organic=false)
{

    let v = unit(dir)
    if(flip && getRandom()<0.5){
      v = v_mult(v,-1)
    }
    vR = vector90(v)
    //Fix proportions
    if(w>h){h = w; w = h * 0.5}
    //Vector for bending
    let bendAngle = getRandom(-45,45)
    if(organic){bendAngle *= 0.25}
    let vBend = unit(rotVec(v, bendAngle))
    let vBendR = vector90(vBend)


    let p1 = mv(mv(pt0, v_mult(vR, w/2)), v_mult(v, h/2))
    let p2 = mv(p1, v_mult(vR, -w))
    let p3 = mv(p2, v_mult(v, -h))
    //Make the bend
    let bendLength = getRandom(h/3, h)
    vBend = v_mult(vBend, -bendLength)
    vBendR = v_mult(vBendR, w)


    let p4 = mv(p3, vBend)
    let p5 = mv(p4, vBendR)

    //Intersection
    let l1p1 = mv(p1, v_mult(v, -100))
    let l1p2 = mv(p1, v_mult(v, 100))
    let l2p1 = mv(p5, v_mult(vBend, -100))
    let l2p2 = mv(p5, v_mult(vBend, 100))
    let p6 = linesIntersection(l1p1, l1p2, l2p1, l2p2)


    //draw within canvas
    let draw1 = p4[0] > 0 && p4[0] < limit && p4[1] > 0 && p4[1] < limit
    let draw2 = p5[0] > 0 && p5[0] < limit && p5[1] > 0 && p5[1] < limit
    if (draw1 && draw2 && p6){
      if(organic){
        let p3pre = mv(p2, v_mult(v, -h/2))
        shapeCrv([p3pre,p3,p4,p5,p6,p1,p2,p3pre])
      }
      else{
        let metaShape = [p1,p2,p3,p4,p5,p6]
        shape(metaShape)
        //offset
        let offVal = getRandom(0.1,0.2)
        for (let i = 0; i < getRandomInt(0,4); i++) {
          dash()
          let off = offsetShape(metaShape, w * offVal)
          shape(off)
          offVal += getRandom(0.1,0.2)
        }
        dash(false)
      }
    }

    return [p1,p2,p3,p4,p5,p6]
}


function randomV(max){
  return [getRandom(-max,max), getRandom(-max,max)]
}

function cross(pt, size, v=[1,0], anim=false)
{
  v = v_mult(unit(v), size/2)
  let vN = vector90(v)
  let p1 = mv(pt, v)
  let p2 = mv(pt,(v_mult(v,-1)))
  let p3 = mv(pt, vN)
  let p4 = mv(pt,(v_mult(vN,-1)))
  let canvas = pg
  if(anim){
    canvas = pgAnim
  }
  canvas.line(p1[0],p1[1],p2[0],p2[1])
  canvas.line(p3[0],p3[1],p4[0],p4[1])
}

function circularBuild(line, size, colorFill, strkW, colorStrk, limitCanvas){
  //Background Shape
  pg.fill(colorFill)
  let d = dist2pts(line[0], line[1])
  let cirSize = getRandom(size[0], size[1])
  if(cirSize > d * 0.5){cirSize = d * 0.5}
  let nCir = getRandomInt(d/cirSize,d*3/cirSize)
  let data = []
  for (let i = 0; i < nCir ; i += 1){
    let p = evaluateCurve(line, getRandom())
    let mvCirc = () => { return getRandom(0.005, -0.005) * canvasSize}
    p = mv(p, [mvCirc() ,mvCirc()])
    let d = getRandom(cirSize*0.2, cirSize)
    let r = d
    //draw the circle only within boundaries
    let draw_ = p[0]-r > 0 && p[0]+r < limitCanvas && p[1]-r > 0 && p[1]+r < limitCanvas
    if(draw_){
      data.push([p,d])
    }
    
  }
  //Extra Background line
  data.map(x => {dash();pg.strokeWeight(getRandom(strkW, strkW/2));if(getRandom()<0.3) {pg.circle(x[0][0], x[0][1], x[1] + getRandom(cirSize*0.1, cirSize*0.3))}})
  dash(false)
  //First the background to get strokeLine
  data.map(x => {pg.strokeWeight(getRandom(strkW*2, strkW/2));pg.circle(x[0][0], x[0][1], x[1])})
  //Fill to erase the intersections
  pg.strokeWeight(0)
  data.map(x => {pg.circle(x[0][0], x[0][1], x[1])})
  //Details
  pg.noFill()
  data.map(x => {[...Array(getRandomInt(0,7)).keys()].forEach(i=>{dash();pg.strokeWeight(getRandom(strkW/4, strkW/2));if(getRandom()<0.8) { p = mv(x[0], [canvasSize * getRandom(-0.015,0.015), canvasSize * getRandom(-0.015,0.015)]);pg.circle(p[0], p[1], x[1] - getRandom(cirSize*0.1, cirSize*0.3))}})})
  //Little details
  dash(false)
  pg.fill(colorStrk)
  data.map(x => {[...Array(getRandomInt(5,17)).keys()].forEach(i=>{s=x[1];p = mv(x[0], [getRandom(-s,s)/2,getRandom(-s,s)/2]);pg.circle(p[0], p[1], canvasSize * getRandom(-0.003,0.003))})})
  //Large details
  pg.fill(colorFill)
  data.map(x => {[...Array(getRandomInt(1,3)).keys()].forEach(i=>{s=x[1];p = mv(x[0], [getRandom(-s,s)/2,getRandom(-s,s)/2]);pg.circle(p[0], p[1], canvasSize * getRandom(-0.006,0.006))})})


}

function adjustPixel(w,h){
  if(w>1500 || h>1500){pg.pixelDensity(0.7);}
  else if(w>700 || h>700){pg.pixelDensity(1.2);}
  else{pg.pixelDensity(3);}
}

function adjustStroke(size){
  return size/700
}



function vectorBetween2v(pA, pB, pC){
  //pA is the point where the 2 lines meet
  let AB = [pB[0] - pA[0], pB[1] - pA[1]]
  let BC = [pC[0] - pA[0], pC[1] - pA[1]]
  let v = [AB[0] + BC[0], AB[1] + BC[1]]
  v = unit(v)
  return v
}

// LERP for movement
function bezier(t, ran){
  let r = ran.sort((a, b) => a - b)
  return r[0] + t * (r[1] - r[0])
}

function myLerp(t, ran){
  let r = ran.sort((a, b) => a - b)
  t = t*t*(3- 2*t)
  return r[0] + t * (r[1] - r[0])
}



class AnnoClass{

  dir;
  maxScale;
  minScale;
  t;


  constructor(dir_, maxScale_, minScale_, t_){
    this.dir = dir_;
    this.maxScale = maxScale_;
    this.minScale = minScale_;
    this.t = t_
  }
}


function setAnnoScale(n){
  let annoData = []
  for (let i = 0; i < n; i++) {
    let dir = choice([true, false])
    let scale = getRandom(0.1,0.3)
    let maxScale = 1 + scale
    let minScale = 1 - scale
    let t = getRandom()
    annoData.push(new AnnoClass(dir, maxScale, minScale, t))
  }
  return annoData
}

class MovingClass{

  dir;
  t;
  speed;

  constructor(dir_, t_, speed_){
    this.dir = dir_;
    this.t = t_;
    this.speed = speed_;
  }
}

function setMovingObjs(n){
  let data = []
  for (let i = 0; i < n; i++) {
    let dir = choice([true, false])
    let speed = getRandom(0.0005,0.002)
    let t = getRandom()
    data.push(new MovingClass(dir, t, speed))
  }
  return data
}

class HabitanteClass{

  habPos;
  speed;
  despistado;
  hSize;
  distToTarget;

  constructor(habPos_, speed_, despistado_, hSize_, distToTarget_){
    this.habPos = habPos_;
    this.speed = speed_;
    this.despistado = despistado_;
    this.hSize = hSize_;
    this.distToTarget = distToTarget_;
  }

  change() {
    this.speed = getRandomOut(0.001,0.002) * canvasSize * 0.2;
    this.despistado = getRandomOut(0.99,1)
    this.hSize = getRandomOut(0.003, 0.001) * canvasSize
  }
}

function setHabitantes(n, pt){
  let data = []
  for (let i = 0; i < n; i++) {
    let dist = 1
    let pos = mv(pt, [getRandom(-dist, dist), getRandom(-dist, dist)])
    let habitObj = new HabitanteClass(pos)
    habitObj.change()
    habitObj.distToTarget = dist2pts(pos, pt)
    data.push(habitObj)
  }
  return data
}




function structDescription(n){
  let d
  if (n==0){
    d = "Chaos"
  }
  else if(n==1 || n==3 || n==6){
    d = "Circuit"
  }
  else if(n==2 || n==8 || n==7){
    d = "Slum"
  }
  else if(n==4 || n==5){
    d = "Agora"
  }
  else if(n==9){
    d = "Density"
  }
  else if(n==10){
    d = "Architectural"
  }
  else if(n==11){
    d = "Superstructure"
  }
  else if(n==13){
    d = "Raze"
  }
  else if(n==14){
    d = "Urban"
  }
  else{
    d = "Unclassified"
  }
  return d
}


function buildName(builds){
  //first sort the list
  let sortB = builds.sort((a, b) => a - b)
  //dup meta and bend elements
  if(sortB.includes(1) && sortB.includes(2)){
    const index = sortB.indexOf(1);
    if (index > -1) {
      sortB.splice(index, 1); 
    }
  }
  if(sortB.includes(4) && sortB.includes(5)){
    const index = sortB.indexOf(4);
    if (index > -1) {
      sortB.splice(index, 1); 
    }
  }

  let description = "Contains "
  for (let i = 0; i < sortB.length; i++) {
    const element = sortB[i];
    let name
    if(element == 0){
      name = "rectangles"
    }
    else if([1,2].includes(element)){
      name = "metarectangles"
    }
    else if(element == 3){
      name = "circles"
    }
    else if([4,5].includes(element)){
      name = "bends"
    }
    if(i!=0){
      if(i!=sortB.length-1){description += ", "}
      else{description += " and "}
    }
    description += name
  }
  return description

}

function formatSize(number){
  if(number == 0){ return [0.2, 0.01]} //Artistic machine
  else if([2].includes(number)){return [0.05, 0.01]}
  else if([1,3,6,13,14].includes(number)){return [0.025, 0.01]}
  else if([4,5,11].includes(number)){return [0.05, 0.025]}
  else if([7,8].includes(number)){return [0.1, 0.025]}
  else if(number == 10){return [0.07, 0.03]}
  else{return [0.25, 0.08]}
}

function getPalette(num){
  let p = {'1025': 'Hatysa', '515': 'Gomeisa', '520': 'Chara', '1032': 'Denebola', '524': 'Enif', '1036': 'Chalawan', '527': 'Rasalgethi', '1040': 'Sualocin', '1041': 'Sadalsuud', '1042': 'Sirius', '1044': 'Ran', '534': 'Albaldah', '536': 'Alcyone', '1054': 'Alderamin', '1058': 'Aljanah', '1066': 'Almach', '558': 'Alkes', '563': 'Meridiana', '1078': 'Wurren', '569': 'Kornephoros', '1082': 'Kaus Borealis', '61': 'Tureis', '577': 'Tejat', '1092': 'Tarazed', '581': 'Tianguan', '1095': 'Porrima', '585': 'Alpherg', '587': 'Fumalsamakah', '589': 'Kraz', '595': 'Nahn', '1107': 'Baten Kaitos', '1111': 'Cor Caroli', '1121': 'Castor', '610': 'Cujam', '616': 'Atik', '619': 'Alshain', '622': 'Alcor', '623': 'Alsciaukat', '1145': 'Alkaid', '634': 'Arneb', '1147': 'Anser', '637': 'Aspidiske', '126': 'Alterf', '639': 'Muscida', '1152': 'Miaplacidus', '644': 'Fafnir', '646': 'Cursa', '1159': 'Diphda', '648': 'Lesath', '649': 'Lich', '650': 'Torcular', '1163': 'Secunda Hyadum', '1164': 'Sadalmelik', '1166': 'Sceptrum', '1168': 'Sheratan', '660': 'Seginus', '1173': 'Scheat', '661': 'Saiph', '665': 'Polaris', '1178': 'Polis', '670': 'Veritate', '676': 'Zaurak', '677': 'Zosma', '682': 'Elkurud', '684': 'Athebyne', '1197': 'Avior', '1202': 'Azelfafage', '694': 'Beid', '696': 'Chamukuy', '698': 'Copernicus', '187': 'Elnath', '188': 'Edasich', '700': 'Eltanin', '705': 'Gacrux', '708': 'Fuyue', '709': 'Giausar', '712': 'Altais', '713': 'Arkab Posterior', '1226': 'Alphecca', '1231': 'Proxima Centauri', '722': 'Polaris Australis', '725': 'Alkalurops', '729': 'Algedi', '732': 'Aldebaran', '221': 'Almaaz', '735': 'Alchiba', '227': 'Sheliak', '741': 'Situla', '745': 'Skat', '746': 'Rukbat', '235': 'Albireo', '747': 'Acrux', '751': 'Albali', '755': 'Adhil', '761': 'Khambalia', '249': 'Matar', '765': 'Jishui', '770': 'Titawin', '1283': 'Tania Borealis', '260': 'Wazn', '775': 'Theemin', '779': 'Syrma', '784': 'Merope', '785': 'Mimosa', '276': 'Menkent', '790': 'Mirach', '282': 'Menkar', '288': 'Arkab Prior', '800': 'Caph', '808': 'Deneb Algedi', '810': 'Fomalhaut', '300': 'Rotanev', '813': 'Schedar', '814': 'Aladfar', '818': 'Ain', '826': 'Algenib', '827': 'Alkaphrah', '314': 'Alnair', '832': 'Menkalinan', '321': 'Mekbuda', '834': 'Maia', '838': 'Minchir', '337': 'Zhang', '850': 'Zubeneschamali', '347': 'Libertas', '860': 'Iklil', '863': 'Keid', '865': 'Kochab', '866': 'Xamidimura', '353': 'Tegmine', '871': 'Unurgunite', '362': 'Xuange', '891': 'Pleione', '1404': 'Nusakan', '1409': 'Pollux', '897': 'Nashira', '386': 'Naos', '389': 'Ukdah', '395': 'Ainalrami', '909': 'Acubens', '401': 'Fawaris', '913': 'Bunda', '915': 'Alruba', '402': 'Bharani', '920': 'Canopus', '921': 'Biham', '409': 'Alsephina', '923': 'Alniyat', '925': 'Alnitak', '415': 'Algol', '935': 'Alrakis', '939': 'Aldhanab', '434': 'Alula Australis', '953': 'Aludra', '957': 'Ancha', '959': 'Mothallah', '448': 'Dabih', '449': 'Errai', '969': 'Dubhe', '973': 'Dalim', '462': 'Electra', '464': 'Kaffaljidhma', '983': 'Kurhah', '986': 'Meissa', '992': 'Lilii Borea', '481': 'Haedus', '487': 'Hamal', '1007': 'Pipirima', '497': 'Peacock', '508': 'Ogma', '510': 'Talitha'}
  let paletteKey = num.toString()
  return p[paletteKey]
}