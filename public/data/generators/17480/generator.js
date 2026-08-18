
//Multilines
function primaryEdges(genType, maxBsize){
    let nEdges = getRandomInt(16,25)
    let zone = getRandom(0.5,0.9) *  canvasSize
    let maxEdge = getRandom(0.25,0.9) * canvasSize
    let lines = []
    //let vR1 = () => {return [getRandom(-maxEdge,maxEdge), getRandom(-maxEdge,maxEdge)]}
    let vR1 = () => {return [getRandom(maxEdge*0.2,maxEdge)*choice([-1,1]), getRandom(maxEdge*0.2,maxEdge)*choice([-1,1])]}
    let vectorR = () => {
        let vR = vR1()
        for (let i = 0; i < 1000; i++) {
            let valV1 = Math.abs(Math.abs(vR[0]) - Math.abs(vR[0]))
            if(valV1 < 0.7){
                break
            }
            else{
                vR = vR1()
            }
        }
        return vR
    }
    //Random 1
    if(genType==0){
        zone = getRandom(0.2,0.7) * canvasSize

        for(let i = 0; i < nEdges; i += 1){
            p0 = [getRandom(0,zone), getRandom(0,zone)]
            p1 = [getRandom(0,zone), getRandom(0,zone)]
            lines.push([p0,p1])
        }
    }
    //Parallel lines
    else if([1,2,3].includes(genType)){
        let v = vectorR()
        let v2 = vectorR()

        let p0 = [getRandom(0,zone), getRandom(0,zone)]
        nEdges = nEdges/2
        for(let i = 0; i < nEdges; i += 1){
            if(genType==1){
                if(getRandom()>0.5 || i == 0){
                    v = v_mult(unit(v), getRandom(maxEdge,maxEdge*0.5))
                }
                else{
                    v = [0,1]
                    v2 = [1,0]
                }
                p0 = [getRandom(0,zone/2), getRandom(0,zone/2)]

            }
            else if (genType==2){
                p0 = mv(p0, v_mult(v2,0))
            }
            else if (genType==3){
                p0 = mv(p0, v_mult(v2,(i*5)/zone))
                v = v_mult(choice([[1,0],[0,1]]), getRandom(-maxEdge,maxEdge))
            }
            let p1 = mv(p0,v)
            lines.push([p0,p1])
            p0 = mv(p0,v_mult(vectorR(), 0.2))
        }
    }
    //Rectangle
    else if([4, 5].includes(genType)){
        p0 = [getRandom(0,zone), getRandom(0,zone)]
        rect = getRandom() < 0.5
        mvRect = getRandom() < 0.5
        v = vectorR()
        
        for(let i = 0; i < getRandomInt(2,3); i += 1) 
        {
            if(genType == 4){
                v = [0,1]
            }
            if(genType == 5){
                p0 = mv(p0, v_mult(vectorR(), 0.4))
            }
            w = maxEdge * getRandom(0.2,1) * choice([1,-1])
            if(w < 2*maxBsize){
                w = maxBsize * 4
            }
            w = Math.abs(w)
            h = w * getRandom(0.5,1)
            if(rect){w = h}
            r = rectangle(p0, v, w, h, false)
            r.forEach(l => lines.push([l[0],l[1]]))
        }
    }   
    // Parallel lines 90 degrees
    else if(genType==6){
        v = [0,1]
        vR = [1,0]
        px = [getRandom(0,zone),getRandom(0,zone)]
        for(let i = 0; i < nEdges; i += 1){
            p0 =  mv(px, v_mult(vectorR(),0.2))
            v0 = v_mult(choice([v,vR]), getRandom(0,zone*0.3)*choice([-1,1]))
            p0 = mv(px,v0 )
            vM = v_mult(choice([v,vR]), getRandom(0,zone*0.5)*choice([-1,1]))
            p1 = mv(p0, vM)
            lines.push([p0,p1])
        }
    }
    else if(genType==7){
        p0 = [getRandom(0,zone), getRandom(0,zone)]
        rect = getRandom() < 0.5
        mvRect = getRandom() < 0.5
        v = unit(vectorR())
        vR = vector90(v)
        w = getRandom(maxEdge/2,maxEdge)
        h = getRandom(maxEdge/2,maxEdge)
        nx = getRandomInt(2,5)
        ny = getRandomInt(2,5)
        for(let i = 0; i < nx; i += 1) 
        {
            for(let j = 0; j < ny; j += 1) {
                if(getRandom()>0.5 || lines.length < 2){
                    p = mv(p0, v_mult(v,w*i/2))
                    p = mv(p, v_mult(vR,h*j/2))
                    r = rectangle(p, v, w, h, false)
                    r.forEach(l => {
                        if(true){
                            lines.push([l[0],l[1]])
                        }
                        })
                }
            }
        }
    }  
    //RECTANGLES NEXT TO EACH OTHER
    else if(genType==8){
        p0 = [getRandom(0,zone), getRandom(0,zone)]
        v = unit(vectorR())
        w = () => getRandom(0,maxEdge)
        for(let i = 0; i < nEdges; i += 1) 
        {
            r = rectangle(p0, v, w(), w(), false)
            r.forEach(l => {if(getRandom()>0.5 || lines.length < 2)lines.push([l[0],l[1]])})
            pts = lines.flat()
            p0 = choice(pts)
            p0 = mv(p0, v_mult(v,w()*choice([-1,1])))
        }
    }
    //Parallel lines next to each other
    else if([9].includes(genType)){
        p0 = [getRandom(0,zone), getRandom(0,zone)]
        nXframes = getRandomInt(3,6)
        nYframes = 15
        //v = unit(vectorR())
        v = choice([[1,0],[0,1]])
        vR = vector90(v)
        for(let i = 0; i < nXframes; i += 1) {
            xSize = getRandom(maxEdge*0.1,maxEdge*0.5)
            vX = v_mult(v, xSize)
            //Vertical Frames
            for(let j = 0; j < nYframes; j += 1){
                p1 = mv(p0, v_mult(vR, getRandom(-maxEdge*0.3,maxEdge*0.3)))
                p2 = mv(p1, vX)
                lines.push([p1,p2])
            }
            p0 = mv(p0, vX)
        }
    }
    
    // Rectangles with no perpendicular extra lines
    else if(genType==10){
        let archType = getRandomInt(0,10) < 2
        if(archType){
            p0 = [getRandom(0,canvasSize), getRandom(0,canvasSize)]
            let v = [0,1]
            w = () => getRandom(0.25,0.6) * canvasSize
            nEdges = 15
            for(let i = 0; i < nEdges; i += 1) 
            {
                r = rectangle(p0, v, w(), w(), false)
                r.forEach(l => {lines.push([l[0],l[1]])})
                pts = lines.flat()
                p0 = choice(pts)
                p0 = mv(p0, v_mult(v,w()*choice([-1,1])))
            }
        }
        else{
            let maxW = getRandom(0.95, 0.3) * canvasSize * 0.5
            let maxStepY = getRandom(0.05, 0.1) * canvasSize
            let y = 0
            let p = [canvasSize/2, y]
            //Plaza
            let plazaPt = [getRandom(0.2,0.8) * canvasSize, getRandom(0.2,0.8) * canvasSize]
            let plazaX = canvasSize * getRandom(0.1,0.3) * 0.5
            plazaX = [plazaPt[0] - plazaX, plazaPt[0] + plazaX]
            let plazaY = canvasSize * getRandom(0.1,0.3) * 0.5
            plazaY = [plazaPt[1] - plazaY, plazaPt[1] + plazaY]
            let plaza = getRandomInt(0,2)
            // SOME ARE STRAIGHT
            let straight = getRandomInt(0,2)
            for (let i = 0; i < 100; i++) {
                let yStep = getRandom(0,maxStepY)
                y += yStep
                if(y > canvasSize){break}
                let x = getRandom(1,0.5) * maxW
                if(straight){x = maxW}
                let pm = mv(p, [0,y])
                let pR = mv(pm, [x,0])
                let pL = mv(pm, [-x,0])
                //plaza
                if(plaza){
                    if(y > plazaY[0] && y < plazaY[1]){
                        if(pL[0] < plazaX[0]){
                            lines.push([pL,[plazaX[0], y]])
                        }
                        if(pR[0] > plazaX[1]){
                            lines.push([pR,[plazaX[1], y]])
                        }
                    }
                    else{
                        lines.push([pR,pL])
                    }
                }
                else{
                    lines.push([pR,pL])
                }
                
            }
        }

    }
    //Crack
    else if(genType==11){
        let opt = getRandomInt(0,3)
        if(opt == 0){
            for (let i = 0; i < getRandomInt(3,6); i++) {
                let pTop = [getRandom(0,0.1) * canvasSize, getRandom(0.2,0.8) * canvasSize]
                let pBtm = [getRandom(0.9,1) * canvasSize, getRandom(0.2,0.8) * canvasSize]
                let l = [pTop, pBtm]
                lines.push(l)
                    let pL = evaluateCurve(l, getRandom())
                    let v = vector90(unit(v2pt(pTop, pBtm)))
                    v = v_mult(v, getRandom(0.2,0.5) * canvasSize * choice([1,-1]))
                    let pL2 = mv(pL, v)
                    lines.push([pL, pL2])
                
            }
        }
        else if(opt==1){
            for (let i = 0; i < getRandomInt(2,5); i++) {
                let pTop = [getRandom(0.2,0.8) * canvasSize, getRandom(0,0.1) * canvasSize]
                let pBtm = [getRandom(0.2,0.8) * canvasSize, getRandom(0.9,1) * canvasSize]
                let l = [pTop, pBtm]
                lines.push(l)
                let pL = evaluateCurve(l, getRandom())
                let v = vector90(unit(v2pt(pTop, pBtm)))
                v = v_mult(v, getRandom(0.2,0.5) * canvasSize * choice([1,-1]))
                let pL2 = mv(pL, v)
                lines.push([pL, pL2])
            }
        }
        else{
            let mainV = vR1()
            let v2 = unit(vector90(mainV))
            //let mainEdge = [0,0], [1200,1200]
            let line = [[0.2 * canvasSize, getRandom(0.2,0.65) * canvasSize], [0.8 * canvasSize, getRandom(0.2,0.65) * canvasSize]]
            lines.push(line)
            for (let i = 0; i < getRandomInt(6,15); i++) {
                let pTop = evaluateCurve(line, getRandom())
                let pBtm = mv(pTop, [getRandom(0.1,0.33) * canvasSize * choice([1,-1]), getRandom(0.1,0.33) * canvasSize * choice([1,-1])])
                lines.push([pTop, pBtm])
            }

        }

    }
    else if(genType==13){ //GRID
        let nX = getRandomInt(2,5)
        let nY = getRandomInt(2,5)
        let xSize = 100 * getRandom(0.8, 1.2)
        let ySize = 100 * getRandom(0.8, 1.2)
        let p0 = [0,0]
        for (let i = 0; i < nX; i++) {
            for (let j = 0; j < nY; j++) {
                let p = mv(p0, [i*xSize, j*ySize])
                let r = rectangle(p, [0,1], xSize, ySize, false, true, false, false)
                //rect pts into line
                for (let u = 0; u < r.length; u++) {
                    let l
                    if(u == r.length - 1){l = [r[u], r[0]]}
                    else{l = [r[u], r[u+1]]}
                    lines.push(l)
                }
            }
        }
    }
    else if(genType==14){
        //CITY
        let tejido = []
        for (let i = 0; i < 100; i++) {
            let rnN = () => {return getRandom(canvasSize * 0.1, canvasSize * 0.9)}
            let p1 = [rnN(), rnN()]
            let p2 =[rnN(), rnN()]
            if(dist2pts(p1,p2)> 0.1 * canvasSize){
                tejido.push([p1,p2])
                break
            }
        }
        //Draw the tejido
        let v = () => {return v_mult([getRandom(-1,1), getRandom(-1,1)], getRandom(0.2,0.8)* canvasSize) }
        for (let i = 0; i < 30; i++) {
            let edge = choice(tejido)  
            let p = evaluateCurve(edge, 0.5)
            let pEnd = mv(p, v())
            //pt in boundary
            for (let j = 0; j < 100; j++) {
                if(pEnd[0]>0 && pEnd[0]<canvasSize && pEnd[1]>0 && pEnd[1]<canvasSize){
                    break
                }
                edge = choice(tejido)
                p = evaluateCurve(edge, getRandom())
                pEnd = mv(p, v())
            }
            
            tejido.push([p, pEnd])
        }
        tejido.forEach(element => {
            lines.push(element)
        });
    }
    return lines
}


// TODO
// 3 types of distriution
// random, same distance, gradient
function secondaryEdges(edges, maxEdge, minEdge, parallel=false){
    
    lines = []
    for(let i = 0; i < edges.length; i += 1){
        let line = edges[i]
        let lineDist = dist2pts(line[0], line[1])
        nDiv = lineDist/getRandom(5,10)
        nDiv = getRandom(7,13)
        for(let j = 0; j < nDiv; j += 1){
            // Random pts along the curve
            let vLine = unit(v2pt(line[0], line[1]))
            let v = vector90(vLine)
            t = getRandom(0,1)
            p0 = evaluateCurve(line, t)
            //mv the point
            var plusOrMinus = getRandom() < 0.5 ? -1 : 1;
            let lineLen = getRandom(minEdge, maxEdge)
            v = v_mult(v, lineLen * plusOrMinus)
            p1 = mv(p0, v)
            if(!parallel){
                p1 = mv(p1, v_mult(vLine, getRandom(-maxEdge/4, maxEdge/4)))
            }
            let lineOut = [p0,p1]

            lines.push(lineOut)
        }
    }
    return lines
}

function ruler(line, canvasSize){
    let lineLen = dist2pts(line[0], line[1])
    let v = v2pt(line[0], line[1], true)
    //Add ruler mode
    let rulerDiv = canvasSize * getRandom(0.01, 0.025) 
    let rulerHmax = canvasSize * getRandom(0.005, 0.015) 
    if(ruler && lineLen>canvasSize*0.05){
        let nDiv = int(lineLen/rulerDiv)
        let step = 1/nDiv
        for (let i = 0; i < nDiv; i++) {
            let t = step * i
            let pR = evaluateCurve(line, t)
            let vR = v_mult(vector90(v), rulerHmax/2)
            let pR1 = mv(pR, vR)
            let pR2 = mv(pR, v_mult(vR,-1))
            shape([pR1, pR2])   
            //inbetween
            t += 0.5 * step
            pR = evaluateCurve(line, t)
            vR = v_mult(vector90(v), rulerHmax/6)
            pR1 = mv(pR, vR)
            pR2 = mv(pR, v_mult(vR,-1))
            shape([pR1, pR2])         
            } 
        }
}


//Draw details of circles or rectangles or triangles around
function details(line, type, color, strokeW){
    let vU = unit(vector90(v2pt(line[0], line[1])))
    ts = [0,1]
    nDiv = getRandomInt(1,5)
    pg.stroke(color)
    pg.strokeWeight(getRandom(strokeW/2, strokeW))
    pg.noFill()
    //make solid a little %
    if(getRandomInt(0,20) == 7){
      pg.fill(color)
    }
    for (let i = 0; i < nDiv ; i += 1){
        t = getRandom(0,1)
        p0 = evaluateCurve(line, t)
        v = v_mult(vU, canvasSize * getRandom(-0.01,0.01))
        p0m = mv(p0, v)
        size1 = canvasSize * getRandom(0.001,0.006)
        size2 = canvasSize * getRandom(0.001,0.006)
        if(type == 0){
            pg.circle(p0m[0], p0m[1], size1)
        }
        else if(type == 1){
            pg.rect(p0m[0], p0m[1], size1, size2)
        }
    }
}


function warningCircle(pt, size, color1, color2){
    //circulo completo
    pg.translate(pt[0], pt[1])
    pg.fill(color1)
    pg.stroke(color2)
    pg.circle(0, 0, size);
    
    //Esquinas
    pg.fill(color2)
    
    pg.arc(0, 0, size, size, 0, HALF_PI);
    pg.rotate(PI);
    pg.arc(0, 0, size, size, 0, HALF_PI);
    //Back to normal position
    pg.rotate(PI);
    pg.translate(pt[0] * -1, pt[1] * -1)

}

function zeldaSymbol(pt, size, colorStk, colorBck){
    size = size/2
    pg.noFill()
    pg.stroke(colorStk)
    pg.strokeWeight(0.1 * size)
    //First rectangle
    rectangle(pt, [1,1], size, size, draw_=true)
    //Second rectangle
    pg.strokeWeight(0.05 * size)
    pg.fill(colorBck) 
    let rSize = size*0.7
    rectangle(pt, [1,1], rSize, rSize, draw_=true)
    //Circle in the middle
    pg.fill(colorStk) 
    pg.noStroke()
    pg.circle(pt[0], pt[1], size * 0.5);
    //Little details at sides
    pg.strokeWeight(0.2 * size)
    pg.stroke(colorStk)
    let pt1 = mv(pt, [rSize/3, rSize/3])
    pg.line(pt[0],pt[1],pt1[0],pt1[1])
    pt1 = mv(pt, [-rSize/3, rSize/3])
    pg.line(pt[0],pt[1],pt1[0],pt1[1])
}

function walls(line, colorStk, colorBck, maxW, boost)
{
    let v = unit(v2pt(line[0], line[1]))
    let vR = vector90(v)
    nWalls = getRandomInt(0,2)
    if (boost){nWalls = getRandomInt(3,7)}
    pg.fill(choice([colorStk, colorBck]))
    for (let i = 0; i < nWalls ; i += 1)
    {
        //colorInt(color, 10)
        p1 = evaluateCurve(line, getRandom())
        p2 = evaluateCurve(line, getRandom())
        pm = evaluateCurve([p1,p2], 0.5)
        h = dist2pts(p1,p2)
        w = maxW * getRandom(0.5,1)
        vM = v_mult(vR, getRandom(-0.01,0.01) * canvasSize)
        p0 = mv(pm, vM)
        rectangle(p0, v, w, h)
    }
}

// Rectangular buildings next to each other
function  buildings1(line, strk, density, type=2, colorFill, colorStrk, metaLength = 1, mxW = [10,30], mxH = [30,40], limits=[0,0], ogStkCol, special){
    //Make sure there are dark elements to increase depth
    let limX = limits[0]
    let limY = limits[1]
    let v = vector90(unit(v2pt(line[0], line[1])))
    let d = dist2pts(line[0], line[1])
    let t = [0]
    let tSum = 0
    if(getRandom()<0.1){pg.stroke(specialColor)}
    else{pg.stroke(bckColor)}

    if(special){pg.stroke(bckColor)}
    
    //REMAP
    let OldRange = (d - 0)  
    let NewRange = (1 - 0)  
    let minX = (((mxW[0] - 0) * NewRange) / OldRange) + 0
    let maxX = (((mxW[1] - 0) * NewRange) / OldRange) + 0
    for (let i = 0; i < parseInt(d/mxW[0]) ; i += 1){
        tt = getRandom(minX, maxX)
        tSum += tt
        if(tSum > 1){
            t.push(1)
            break
        }
        else{
            t.push(tSum)
        }
    }
    // Draw the buildings
    //circles
    if(type == 3){
        circularBuild(line, mxW, colorFill,strk, colorStrk, limX)
    }
    else{
    for (let i = 0; i < t.length -1 ; i += 1){
        if(getRandom() < density){
            p1 = evaluateCurve(line, t[i])
            p2 = evaluateCurve(line, t[i+1])
            p0 = evaluateCurve([p1,p2], 0.5)
            p0 = mv(p0, v_mult(v, getRandom(-5,5)))
            pg.strokeWeight(getRandom(strk/3, strk/6))
            if(getRandom()<0.1){
                pg.strokeWeight(strk/2)
            }
            w = dist2pts(p1,p2)
            h = getRandom(mxH[0], mxH[1]) * metaLength
            //Only draw if the h is within the limits
            let maxR = h * 1.1
            let draw_ = p0[0]-maxR > 0 && p0[0]+maxR < limX && p0[1]-maxR > 0 && p0[1]+maxR < limY
            if(draw_){
                //Increase depth with stk bck col
                if(getRandom() < 0.2){pg.fill(ogStkCol)}
                else{pg.fill(colorFill)}

                if(type == 0){
                    rectangle(p0, v, w, h, true, true, true)
                    //extraoffset
                    for (let i = 0; i < 3; i++) {
                        pg.strokeWeight(getRandom(strk/3, strk/6))
                        pg.noFill()
                        dash()
                        let pOffset = mv(p0, v_mult(v, getRandom(-5,5)))
                        let minSide = [w,h].sort((a, b) => a - b)[0]
                        let offset = minSide * getRandom(0.02,0.3)
                        rectangle(pOffset, v, w-offset, h-offset, true, true)
                    }
                    dash(false)
                    pg.fill(colorFill)
                }
                else if(type == 1){
                    metaRectangle(p0, v, w, h, false, limX)
                }
                else if(type == 2){
                    metaRectangle(p0, v, w, h, true, limX)
                }
                else if(type == 4){
                    rectBend(p0, v, w, h, true, limX)
                }
                else if(type == 5){
                    rectBend(p0, v, w, h, false, limX)
                }
                else if(type == 6){
                    rectBend(p0, v, w, h * 0.8, choice([true, false]), limX, true)
                }
                else if(type == 7){
                    metaRectangle(p0, v, w, h * 0.5, choice([true, false]), limX, true)
                }
    
                
                //Extra details, like courtyards
                for (let j = 0; j < getRandomInt(2,8) ; j += 1){
                    p0m = mv(p0, [getRandom(-w/3, w/3), getRandom(-h/3, h/3)])
                    rectangle(p0m, v, getRandom(0, w/3), getRandom(0, w/3))
                }
            }

        }
    }}
}

function boxes(pt,strkW, maxSize){
    nBoxes = getRandomInt(1,5)
    boxSize = () => { return maxSize * getRandom(0.2,1) }
    for (let i = 0; i < nBoxes ; i += 1){
        pgAnim.strokeWeight(getRandom(strkW*0.3, strkW))
        let dir = randomV(1) 
        let speed = getRandom(0.01,1) * choice([1,-1])
        //rotate
        dir = rotVec(dir, frame * speed)
        let mvRect = randomV(getRandom(0.08, 0) * canvasSize)
        rectangle(mv(pt, mvRect), dir, boxSize(), boxSize(), true, false, false, true)
    }
}

function annotation(pt, size, type=0, strCol = [0,0,0], bckCol = [0,0,0], strW, letterType){
    

    let dir = choice([-1,1])
    pgAnim.fill(bckCol)
    pgAnim.stroke(strCol)
    let sW = strW * getRandom(0.2, 0.8)
    let lStroke = (x) => {pgAnim.strokeWeight(x)}
    lStroke(sW)
    
    let v1 = v_mult([dir,-1], getRandom(0.9, 1.1)*size)
    let v2 = v_mult([dir,0], getRandom(1.5, 2)*size)
    let p1 = mv(pt, v1)
    let p2 = mv(p1, v2)

    let recW = getRandom(1.5, 3) * size
    let recH = getRandom(0.3, 0.6) * size

    if(type==0){
        recW *= 2
        recH *= 2
    }

    //Cross
    cross(pt, size/2, [0,1], true)

    // Rectangle
    pr = mv(p2, [(recW * dir)/2, 0])
    if(type==0){
        rectangle(pr, [0,dir], recW, recH, true, false, false, true)
        lStroke(sW)
        language(pr, recH * 0.8, letterType, true)
    }
    if(type==1){
        pgAnim.circle(pr[0], pr[1], recW)
        pgAnim.fill(strCol)
        lStroke(sW)
        language(pr, recW/3, letterType, true)
    }
    if([2,3].includes(type)){
        //TRIANGLE
        let ts = recW/2
        if(type == 3){ts = -ts}
        let ptr = mv(pr, [recW/4*dir*-1, 0])
        let pt1 = mv(ptr, [0,ts])
        let pt2 = mv(ptr, [ts,-ts])
        let pt3 = mv(ptr, [-ts,-ts])
        pgAnim.beginShape()
        pgAnim.vertex(pt1[0], pt1[1])
        pgAnim.vertex(pt2[0], pt2[1])
        pgAnim.vertex(pt3[0], pt3[1])
        pgAnim.endShape(CLOSE)
        pgAnim.fill(strCol)
        let ptr0 = mv(ptr, [0, -0.1*ts])
        lStroke(sW)
        language(ptr0, recW/3, letterType, true)

    }
    //Rectangle less fino
    if(type==4){
        let nH = recH*getRandom(1.5,3.5)
        rectangle(pr, [0,dir], recW, nH, true, false, false, true)
        lStroke(sW)
        language(pr, nH * 0.7, letterType, true)
    }
    //
    
    pgAnim.strokeWeight(strW * 0.7)
    pgAnim.noFill()
    pgAnim.beginShape()
    pgAnim.vertex(pt[0], pt[1])
    pgAnim.vertex(p1[0], p1[1])
    pgAnim.vertex(p2[0], p2[1])
    pgAnim.endShape();

    // Fake text


}

// Fake language to add graphical value: not as complex as u might think ;)
function language(pt, size, type=2, anim = false){
    let density = getRandom(0.2,0.9)
    let chance = () => {return getRandom() > density}
    let nSquare = size/3
    let p0 = mv(pt, [-nSquare/2,-nSquare])
    let allPt = []
    let horizontal = false
    let canvas = pg
    if(anim) {canvas = pgAnim}
    if(type==1){
        horizontal = true
    }
    else if(type == 2){
        horizontal = getRandomInt(0,2)
    }
    for (let i = 0; i < 4 ; i += 1){
        for (let j = 0; j < 3 ; j += 1){
            let pS = mv(p0, [nSquare*i/2, nSquare*j])
            if(chance()){
                //horizontal
                if(horizontal){
                    allPt.push([[pS[0], pS[1]], [pS[0] - nSquare, pS[1]]])
                }
                else{
                    allPt.push([[pS[0], pS[1]], [pS[0], pS[1] - nSquare]])
                }
            }
        }
    }
    //Center the points to the original point to center the language
    let pts = allPt.flat() 
    let pt0 = domain(pts)[0] //mid point of cloud
    let v = v2pt(pt0, pt)
    allPt.map(x=>{let p1=mv(x[0],v);let p2=mv(x[1],v);
        canvas.line(p1[0], p1[1], p2[0], p2[1])})
}

function grid(ofs, w, h, strkW, strCol, realStrkCol, bckCol){
    let nx = getRandomInt(10,190)
    let ny = getRandomInt(10,190)
    let offsetX = w * choice([0.15, 0.25, 0.35])
    let offsetY = h * choice([0])
    w = w - (offsetX*2)
    h = h - (offsetY*2)
    let xSq = w/nx
    let ySq = h/ny
    let p0 = [ofs + offsetX, ofs + offsetY]
    let sep = - ofs/3
    let rW = xSq * getRandom(0.1,0.7)
    if(rW > w*0.004){rW = w*0.001}
    let rY = ySq * getRandom(0.1,0.7)
    if(rY > w*0.004){rY = w*0.001}
    let rLen = w * getRandom(0.01,0.03)
    let cir = getRandomInt(0,2)
    cir = true
    let cirRsides = rW/2
    let cirRtopBtm = rY/2
    let fillTransp = [strCol[0],strCol[1],strCol[2],150]
    //CORNERS
    let cornerSize = w*0.01
    let pR = mv(p0, [xSq/2,ySq/2])
    let pR2 = mv(p0, [w, h])
    let pR3 = mv(p0, [0, h])
    let pR4 = mv(p0, [w, 0])
    let cornerPts = [p0, pR2, pR3, pR4]
    pg.fill(bckCol)
    pg.strokeWeight(strkW)
    cornerPts.map(p => {rectangle(p, [0,1], cornerSize, cornerSize, true, false ,true)})
    pg.strokeWeight(strkW*5)
    cornerPts.map(p => {cross(p, cornerSize, [1,1])})

    //SECOND RECTANGLE
    dash()
    pg.strokeWeight(strkW*3)
    pg.noFill()
    pg.rect(p0[0], p0[1], w, h)
    pR = mv(p0, [xSq,ySq])
    pg.rect(pR[0], pR[1], w-(xSq*2), h-(ySq*2))
    //lines first
    for (let i = 1; i < nx ; i += 1){
        pg.strokeWeight(strkW)
        dash(false)
        pT = mv(p0, [(xSq * i),0])
        pB = mv(pT, [0, h])
        pg.line(pT[0], pT[1],pB[0], pB[1])
        //Sublines
        pg.strokeWeight(strkW/2)
        setLineDash([2,2])
        pT2 = mv(pT, [xSq/2,0])
        pB2 = mv(pB, [xSq/2,0])
        pg.line(pT2[0], pT2[1],pB2[0], pB2[1])
        if(i==1){
            pT2 = mv(pT, [-xSq/2,0])
            pB2 = mv(pB, [-xSq/2,0])
        }
        pg.line(pT2[0], pT2[1],pB2[0], pB2[1])
        ///////////// Details at the end
        pg.fill(fillTransp)
        pg.strokeWeight(strkW)
        dash(false)
        if(cir){
            let p = mv(pT, [0, sep + cirRsides])
            pg.circle(p[0],p[1], cirRsides)
            p = mv(pB, [0, (sep + cirRsides)*-1])
            pg.circle(p[0],p[1], cirRsides)
        }
        else{
            if(i%2 == 0){
                rectangle(mv(pT, [0, sep]), [0,1], rW, rLen)
                rectangle(mv(pB, [0, (sep)*-1]), [0,1], rW, rLen)
            }

        }
 

    }
    for (let i = 1; i < ny ; i += 1){
        pg.strokeWeight(strkW)
        dash(false)
        pT = mv(p0, [0,ySq * i])
        pB = mv(pT, [w, 0])
        pg.line(pT[0], pT[1],pB[0], pB[1])
        //Sublines
        pg.strokeWeight(strkW/2)
        setLineDash([2,2])
        pT2 = mv(pT, [0,ySq/2])
        pB2 = mv(pB, [0,ySq/2])
        pg.line(pT2[0], pT2[1],pB2[0], pB2[1])
        if(i==1){
            pT2 = mv(pT, [0,-ySq/2])
            pB2 = mv(pB, [0,-ySq/2])
        }
        pg.line(pT2[0], pT2[1],pB2[0], pB2[1])
        ///////////// Details at the end
        pg.fill(fillTransp)
        pg.strokeWeight(strkW)
        dash(false)
        if(cir){
            let p = mv(pT, [sep + cirRtopBtm, 0])
            pg.circle(p[0],p[1], cirRtopBtm)
            p = mv(pB, [(sep + cirRtopBtm)*-1,0 ])
            pg.circle(p[0],p[1], cirRtopBtm)
        }
        else{
            if(i%2 == 0){
                rectangle(mv(pT, [sep, 0]), [1,0], rY, rLen)
                rectangle(mv(pB, [ (sep)*-1,0]), [1,0], rY, rLen)
            }

        }

    }
}

function titleBox(pt0, length, offset, bckCol, stkCol, stkCol2){
    dash(true, true)
    
    pgAnim.fill(bckCol)
    let lineCol = choice([stkCol, stkCol2])
    let npt0 = mv(pt0, [0,(length*0.5)-offset])
    let npt1 = mv(pt0, [0,-(length*0.5)+offset])
    let npts = [npt0, npt1]
    npts.map(p => {
        pgAnim.stroke(lineCol)
        let w = length* getRandom(0.15,0.8)
        let h = getRandom(length*0.03, length*0.02)
        rectangle(p, [1,0], h, w, true, false, true, true)
        //tEXTO FAKE
        dash(false, true)
        pgAnim.stroke(stkCol2)
        let rSize = length * 0.005
        nSymbol = int(((w*0.8)/2)/rSize)
        lineL = w*0.8
        let line = [mv(p,[-lineL/2, 0]), mv(p,[lineL/2,0])]
        textLine(line, rSize, true)
    })



    
}

function textLine(line, size, anim = false){
    let nChar = int(dist2pts(line[0], line[1])/size)
    //get left pt to generate the letters to the right
    let lpt = [line[0][0],line[1][0]]
    lpt = [lpt.sort((a, b) => a - b)[0], line[0][1]]
    for (let i = 0; i < nChar ; i += 1){
        //Some empty spaces
        if(getRandom()>0.2){
            p = mv(lpt, [(size*i)+size/2, 0])
            language(p, size, getRandomInt(0,3), anim)
        }
    }
}

function textLines(pt0, dir, dirY, nLines, maxL, minL, textSize, box=true){
    //Draw line by line 
    textSize = textSize * 0.9
    for (let i = 0; i < nLines ; i += 1){
        //Some empty lines
        if(getRandom()>0.3 && i==nLines-1){
            let lineL = getRandom(minL, maxL)
            dispX = getRandom(0,minL * 0.1)
            let p0 = mv(pt0, [dispX, (textSize * 1)*i*dirY])
            let p1 = mv(p0, [lineL*dir, 0])
            if(getRandom()>0.3){
                pR = mv(p0, [(dir*-1) - 0,0])
                pR = p0
                rectangle(pR, [1,0], textSize * 0.2, textSize * 0.9)
            }
            textLine([p0, p1], textSize * 0.9)
        }


    }
}

function ptsInRect(x,y,pts){
    //[x0,x1] [y0,y1]
    x.sort((a, b) => a - b)
    y.sort((a, b) => a - b)
    npts = 0
    pts.map(p => {
        if(p[0]>x[0] && p[0]<x[1] && p[1]>y[0] && p[1]<y[1]){
            npts+=1
            //pg.rect(p[0], p[1], 2,2)
        }
        
    })
    return npts
}

function evaluateRectangle (pt0, length, pts){
    //TL
    let vL = length/4
    let rectSide = length * 0.3
    let vectors = [[-1,1],[1,1], [-1,-1],[1,-1]] //TopL, TopR, BtmL, BtmR

    let zones = {}
    let nPtsZone = []
    vectors.map(v=> {
        let p = mv(pt0, v_mult(v,vL))
        let domS = rectSide/2
        xD = [p[0]-domS, p[0]+domS]
        yD = [p[1]-domS, p[1]+domS]
        nPts = ptsInRect(xD, yD, pts)
        ////////////
        language(p, 30)
        //Add text if less than x
        if(true){
            zones[npts]=[p, rectSide, v[0]]
            nPtsZone.push(npts)
        }

    })

    let sortedPts = nPtsZone.sort((a, b) => a - b)
    let sortedZones = []
    sortedPts.map(p => {sortedZones.push(zones[p])})


    return sortedZones
}

function draw_buildings(edges, stkColor, density, bckColor, sW, buildColors1, bDensity, buildingEdgeType, metaLength, buildW, special, limits, adjustDens, large) {
  ///////////////// BUILDINGS 1
  dash(false)
  let buildStk = stkColor
  let buildFill = bckColor
  let count = 0
  //Special case
  let largeSize = false
  if(large!=null){
        edges = [large]
        largeSize = true
        density = 1
        bDensity = 1
        adjustDens = false
    }

  edges.map(x => {if (getRandom(0,1) < density){
    if(!special){
        colorInt(stkColor, 10);
        buildStk=bckColor, 
        buildFill=stkColor
    }
    else{
        buildStk=bckColor;
        buildFill=specialColor}

    //Sometimes the buildings wont fit in some lines making the composition too simplistic
    if(adjustDens){
        let lineLen = dist2pts(x[0], x[1])
        let maxBuildSize = buildW.sort((a, b) => a - b)[1]
        if(lineLen < maxBuildSize*2){
            buildW = [lineLen * 0.6, lineLen * 0.9]
        }
    }
    let buildSize = buildW
    
    if(count == 2 && mainStruct != 14 || mainStruct == 9 || largeSize){
        let canvSize = limits[0]
        if(mainStruct != 11){
            buildSize = [0.1*canvSize, 0.05*canvSize] //increment radically some of the elements
        }
    }
    count++
    pg.stroke(buildStk);  
    pg.fill(buildFill);
    globalBCount += 1
    let bW = buildSize
    let bH = buildSize


    buildings1(x, sW*0.8, bDensity, choice(buildingEdgeType),buildFill,buildStk, metaLength, bW ,bH, limits, stkColor, special)
}})

}

function vegetation(ptA, ptB, canvasSize, col, colSpecial, maxVegSize ){
    let movement = () => { return getRandom(0.001, 0.01) * canvasSize}
    let vToB = (p, pb) => {return v_mult(unit(v2pt(p, pb)),movement())}
    let vR = () => {return v_mult(unit([getRandom(-1,1), getRandom(-1,1)]),movement())}

    let nRays = 8
    for (let i = 0; i < nRays; i++) {
        let pM = mv(ptA, v_mult(vR(), getRandom(1,25)))
        let target = mv(ptB, v_mult(vR(), getRandom(1,25)))
        let shapeLines = []
        for (let j = 0; j < 1000; j++) {
            let v = vR()
            if(getRandom()>0.7){
                v = vToB(pM, target)
            }
            pM = mv(pM, v)
            shapeLines.push(pM)
            // Add the trees
            if(getRandom() < 0.2){pg.stroke(colSpecial)}
            else{pg.stroke(col)}
            
            
            let treeDiam = getRandom(maxVegSize,maxVegSize/2) * canvasSize
            tree(pM, treeDiam)
            if(dist2pts(pM, target) < 0.25 * canvasSize){break}
        }
        //shape(shapeLines)

    }
}

function tree(pt, size){
    let vR = () => {return [getRandom(-1,1),getRandom(-1,1)]}
    let nRamas = 7
    pg.circle(pt[0], pt[1], size)
    dash()
    for (let i = 0; i < nRamas; i++) {
        let length = size * getRandom(0.5,1)
        let v = v_mult(vR(), length)
        let pt2 = mv(pt, v)
        pg.strokeWeight(sW * getRandom(0.1,0.5))
        dash()
        pg.line(pt[0],pt[1],pt2[0],pt2[1])
        
    }
}

function remapLine(line, oldMaxX, oldMinX, newMaxX ,oldMaxY, oldMinY, newMaxY, offset, displX, displY){
    let remapL = []
    for (let i = 0; i < line.length; i++) {

        let p = line[i]
        let x = p[0]
        let y = p[1]
        let newX = (((x - oldMinX) * (newMaxX - (offset*2) - displX)) / (oldMaxX - oldMinX)) + offset + displX/2
        let newY = (((y - oldMinY) * (newMaxY - (offset*2) - displY)) / (oldMaxY - oldMinY)) + offset + displY/2
        remapL.push([newX, newY])
        //NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin

    }
    return remapL
}

function remapEdges(edges, oldMaxX, oldMinX, newMaxX ,oldMaxY, oldMinY, newMaxY, offset, displX, displY){
    let newEdges = []
    edges.forEach(edge => {
        let nEdge = remapLine(edge, oldMaxX, oldMinX, newMaxX ,oldMaxY, oldMinY, newMaxY, offset, displX, displY)
        newEdges.push(nEdge)
    });
    return newEdges
}

