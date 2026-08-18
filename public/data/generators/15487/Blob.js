class Blob {
    constructor(path) {
        this.group = new Group([this.path])
        this.paintPaths = new Group()
        this.group.addChild(this.paintPaths)
        this.path = path
    }

    apply(func) {
        this.getPaths().forEach(path => func(path))
    }

    drawCurvesp5(){
        erase()
        fill(0)
        this.apply(path=>fillPath(path))
        noErase()
        noFill()

        this.apply(path=>drawPath(path))

        if (this.folds) this.folds.children.forEach(fold=>drawPath(fold))
        if (this.spots) 
            this.spots.children.forEach(spot=>{
                if (spot.data.withStroke) drawPath(spot,0.4)
            })
        if (this.hair) this.hair.children.forEach(hair=>drawPath(hair))
    }

    getPaths() {
        if (this.path.children) return this.path.children
        return [this.path]
    }

    getMask(){
        if (this.path.children) {
            const newMask = this.path.clone()
            newMask.children.forEach(path => {
                path.wonky(0.96,1.04, seg=>
                    random()<0.2 && !(path.contains(seg.point.add(seg.handleIn)) && path.contains(seg.point.add(seg.handleOut))))
            })
            return newMask
        }
        return this.path.clone().wonky(0.96,1.04, seg=>
                random()<0.2 && !(this.path.contains(seg.point.add(seg.handleIn)) && this.path.contains(seg.point.add(seg.handleOut))))
    }

    initDraw() {
        this.bg = this.path.clone()
        this.bg.fillColor = 'white'
        this.group.addChild(this.bg)
        this.bg.sendToBack()
        this.path.strokeColor = pencil
        this.drawFolds(this.path)
        this.path.bringToFront()
    }

    draw(fillColor) {
        this.initDraw()
        this.path.fillColor = fillColor
    }

    paint(fillColor) {
        this.initDraw()
        this.apply(path=>path.waterColor(fillColor, this))
        // this.apply(path=>path.waterColor(fillColor, this))
    }

    shadows(angleOffset, clr) {
        this.shadowPaths = new Group()
        this.group.addChild(this.shadowPaths)
        const offsetSize = random(20,40)
        this.getPaths().forEach(path => {
            let groups = []
            let points = []
            let offset = 0
            for (let i = 0; i < path.length; i += 10) {
                const loc = path.getLocationAt(i)
                const rotatedNormal = loc.normal.rotate(-angleOffset)
                const newOffset = abs(rotatedNormal.angle) - 90
                offset = offset + (newOffset - offset) / 10
                if (offset < 0) {
                    if (points.length == 0) points.push(i)
                    points.push(loc.point.add(loc.normal.multiply(round(offset/offsetSize)*offsetSize)))
                } else if (points.length > 0) {
                    points.push(i)
                    groups.push([...points])
                    points = []
                }
            }
            groups.forEach(group => {
                points = []
                const start = group.shift()
                const end = group.pop()
                for (let i = start; i < end; i += 2) {
                    points.push(path.getPointAt(i))
                }
                points.reverse()
                group = group.filter(p => path.contains(p))
                const paintPath = new Path([...group, ...points])
                paintPath.simplify(5)
                paintPath.waterColor(clr, this)
                this.shadowPaths.addChild(paintPath)
            })
        })
    }

    doFoldShadows(clr) {
        this.foldShadows = new Group()
        this.group.addChild(this.foldShadows)
        this.getPaths().forEach(path => {
            this.folds.children.forEach(fold => {
                const loc = path.getNearestLocation(fold.firstSegment.point)
                if (loc.point.getDistance(fold.firstSegment.point) > 3) return
                let startOffset = loc.offset - 10
                if (startOffset < 0) startOffset = path.length + startOffset
                const points = []
                for (let i = startOffset; i < startOffset + 20; i += 5) {
                    points.push(path.getPointAt(i % path.length))
                }
                const pathToDraw = new Path(points)
                const tangentStength = random(10, 20)
                pathToDraw.add(new Segment(
                    fold.lastSegment.point,
                    fold.lastSegment.location.tangent.multiply(-tangentStength),
                    fold.lastSegment.location.tangent.multiply(-tangentStength)))
                pathToDraw.closePath()
                pathToDraw.waterColor(clr, this)
                this.foldShadows.addChild(pathToDraw)
            })
        })

        this.apply(path=>{
            path.segments.forEach(seg => {
                if (path.contains(seg.point.add(seg.handleIn.normalize(5).multiply(-1))) && 
                    path.contains(seg.point.add(seg.handleOut.normalize(5).multiply(-1)))) {
                    
                    const anotherShadow = new Path.Circle(seg.point, max(seg.handleIn.length, seg.handleOut.length))
                    anotherShadow.waterColor(clr, this)
                }
            })
        })
    }

    drawFolds() {
        this.folds = this.folds || new Group()
        this.group.addChild(this.folds)

        this.getPaths().forEach(path => {
            path.segments.forEach((seg, i) => {
                if (this.folds.children.length > 0) {
                    const minDistance = this.folds.children.map(a => a.getNearestPoint(seg.point).getDistance(seg.point)).reduce((a, b) => a < b ? a : b)
                    if (minDistance < 30) return
                }

                if (seg.handleIn.rotate(180).angle != seg.handleOut.angle) {
                    // if inner corner
                    if (path.contains(seg.point.add(seg.handleIn)) && path.contains(seg.point.add(seg.handleOut))) {
                        if (random() < 0.5) return
                        const loc1 = seg.location
                        const locationOffset = random(10, 25)
                        const loc2 = path.getLocationAt((seg.location.offset + locationOffset) % path.length)
                        const offset = -random(15)
                        const offsetPosition1 = loc1.point.add(loc1.normal.multiply(offset))
                        const offsetPosition2 = loc2.point.add(loc2.normal.multiply(offset))
                        const seg1 = new Segment(offsetPosition1, loc1.tangent.multiply(-locationOffset))
                        const seg2 = new Segment(offsetPosition2, loc2.tangent.multiply(-locationOffset))
                        const fold = new Path([seg1, seg2])
                        this.folds.addChild(fold)
                    } else {
                        const largeHandle = seg.handleIn.length > seg.handleOut.length ? seg.handleIn.clone() : seg.handleOut.clone()
                        largeHandle.angle -= 180
                        largeHandle.length *= random(1,3)

                        if (path.contains(seg.point.add(largeHandle))) {
                            const seg1 = new Segment(seg.point, null, largeHandle)
                            largeHandle.angle -= 10
                            const seg2 = new Segment(seg.point.add(largeHandle))
                            const fold = new Path([seg1, seg2])
                            if (path.contains(fold.getPointAt(fold.length/2)) && path.contains(fold.lastSegment.point)) this.folds.addChild(fold)
                            else fold.remove()
                        }
                    }
                }
            })
            path.segments.forEach((seg, i) => {
                const handlePos1 = seg.point.add(seg.handleIn)
                const handlePos2 = seg.point.add(seg.handleOut)
                if (path.contains(handlePos1) && path.contains(handlePos2)) {
                    const seg1 = new Segment(seg.point, null, seg.location.normal.multiply(-10).rotate(random(-30, 30)))
                    const seg2 = new Segment(seg.point.add(seg.location.normal.multiply(-random(5, 10))))
                    const fold = new Path([seg1, seg2])
                    this.folds.addChild(fold)
                }
            })
        })

        this.folds.strokeColor = pencil
    }

    join(blob) {
        this.path = this.path.unite(blob.path)
        return this
    }

    cut(blob) {
        this.path = this.path.subtract(blob.path)
        if (this.path.segments) {
            for (let i = 0; i < this.path.segments.length; i++) {
                const seg = this.path.segments[i]
                if (blob.path.contains(seg.point)) {
                    this.path.divideAt(seg.location.offset - 5)
                    this.path.divideAt(seg.location.offset + 5)
                    this.path.removeSegment(i + 1)
                    i++
                }
            }
        }
        return this
    }

    randomOnBorder() {
        const borderPath = choose(this.getPaths())
        return borderPath.getLocationAt(random(borderPath.length))
    }

    contains(point) {
        return this.path.contains(point)
    }

    dropShadowOn(blob, clr) {
        this.getPaths().forEach(path => {
            const b = path.clone().wonky(1,1.5)
            b.waterColor(clr, blob)
            b.remove()
        })
    }

    drawSpots() {
        this.spots = new Group()
        this.group.addChild(this.spots)
        for (let i = 0; i < 100; i++) {
            const p = this.randomInside()
            const s = new Path.Circle(p, 3).wonky(0.5, 2)
            s.waterColor(choose([blobShadow,blobHighlight,blobColor]), this)
            if (this.path.getNearestPoint(p).getDistance(p) < 40 && random() < .3) {
                const trimmedS = s.intersect(this.path)
                trimmedS.strokeColor = '#00000022'
                trimmedS.data.withStroke = true
                this.spots.addChild(trimmedS)
                s.remove()
            } else {
                s.remove()
            }
        }
    }

    randomInside() {
        let t = 0
        while (t < 100) {
            const loc = this.randomOnBorder()
            const p = loc.point.add(loc.normal.multiply(random(-10, -100)))
            if (this.path.contains(p)) {
                return p
            }
            t++
        }
    }

    drawHair() {
        this.hair = new Group()
        this.group.addChild(this.hair)
        for (let i = 0; i < 30; i++) {
            const outerPoint = this.path.bounds.topLeft.add(this.path.bounds.width * random(), 0)
            const loc = this.path.getNearestLocation(outerPoint)
            const path = new Path()
            let pos = loc.point
            let dir = loc.normal
            const hairLength = random(3, 10)
            for (let j=0;j<hairLength;j++){
                path.add(pos.clone())
                pos = pos.add(dir.multiply(random(4,10)))
                dir = dir.rotate(random(-30,30))
            }
            path.smooth()
            path.strokeColor = 'black'
            this.hair.addChild(path)
        }
        this.hair.children.forEach(hair=>drawPath(hair))
    }
}


function makeSpine(v1, v2) {
    const dir = v2.subtract(v1).normalize().rotate(random(-90, 90)).multiply(150)
    const seg1 = new Segment(v1, null, dir)
    let path = new Path(seg1, v2)
    path = path.rebuild(4)
    for (let i = 1; i < path.segments.length - 1; i++) {
        const seg = path.segments[i]
        seg.point = seg.point.add(seg.location.normal.multiply(random(-30, 30)))
    }
    path.smooth()
    return path
}

function Limb(p1, p2, r1, r2) {
    const crv = makeSpine(p1, p2, 10)
    return crvToBlob(crv,r1,r2)
}

function crvToBlob(crv,r1,r2){
    blob = new Blob(new Path())
    for (let i = 0; i < crv.length; i += 20) {
        const loc = crv.getLocationAt(i)
        const currR = lerp(r1, r2, i / crv.length)
        const p1 = loc.point.add(loc.normal.multiply(currR))
        const c = new Path.Circle(p1, currR)
        blob.join(new Blob(c))
    }
    for (let i=0;i<crv.segments.length;i++){
        const loc = crv.segments[i].location
        const currR = lerp(r1, r2, loc.offset / crv.length)
        const p1 = loc.point.add(loc.normal.multiply(currR))
        const c = new Path.Circle(p1, currR)
        blob.join(new Blob(c))
    }
    blob.apply(crv => crv.simplify(30))
    crv.remove()
    return blob
}

function addLetterBlob(ps){
    const path = new Path(ps)
    path.rebuild(ps.length+3)
    path.segments.forEach(seg=>seg.point = seg.point.add(random(-10,10), random(-10,10)))
    path.smooth()
    path.translate(width/2,floorHeight)
    mainBlob.join(crvToBlob(path, 40, 40))
}