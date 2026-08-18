let holes = []

class Hole {
    constructor(pos, size) {
        if (pos && size) {
            this.size = size; this.pos = pos
            this.hole = new Path.Circle(pos, size)
            this.hole.segments.forEach(seg => {
                seg.point = seg.point.subtract(pos).multiply(random(1, 1.5)).add(pos)
            })
            this.hole.strokeColor = '#00000044'
            this.createTail()
        }
        holes.push(this)
    }

    createTail() {
        const dir = this.hole.position.subtract(growthCenter).normalize()
        this.tail = makeSpine(this.hole.position, dir, height)
        this.tail.strokeColor = '#00000044'
    }

    trimTail() {
        for (hole of holes.filter(hole => hole != this)) {
            const holeIntersections = this.tail.getIntersections(hole.hole)
            holeIntersections.sort((a, b) => a.offset - b.offset)
            if (holeIntersections.length > 0) this.tail.splitAt(holeIntersections[0].offset)
            const tailIntersections = this.tail.getIntersections(hole.hole)
            tailIntersections.sort((a, b) => a.offset - b.offset)
            if (tailIntersections.length > 0) this.tail.splitAt(tailIntersections[0].offset)
        }
    }

    finalShape() {
        const tailOffset1 = offsetPath(this.tail, -.5)
        const tailOffset2 = offsetPath(this.tail, .5)
        tailOffset1.reverse()
        tailOffset1.join(tailOffset2)
        const intersections = getOrderedIntersections(tailOffset1, [this.hole])
        if (intersections.length < 2) {
            this.path = this.hole
        } else {
            const tail1 = tailOffset1.getSection(null, intersections[0].point)
            const tail2 = tailOffset1.getSection(intersections[1].point)
            const holePart = this.hole.getSection(intersections[0].point, intersections[1].point)
            const r = min(this.size,50) * pixelSize
            this.path = joinAndFillet([tail1, holePart, tail2], r,r)
            this.path.strokeColor = '#00000044'

            tail1.remove()
            tail2.remove()
            holePart.remove()
        }

        this.hole.remove()
        this.tail.remove()
        tailOffset1.remove()
        tailOffset2.remove()
    }

    draw() {
        fill(color(pencil))
        noStroke()
        fillPath(this.path)
        noFill()
        stroke(pencil)
    }

    drawingPartOf() {
        if (!this.drawn) {
            this.drawn = true
            this.draw()
        }
    }

    mirror() {
        if (abs(this.pos.x - width / 2) > this.size*2) {
            const newPos = new Point(width - this.pos.x, this.pos.y)
            new Hole(newPos, this.size)
        } else {
            this.hole.translate(new Point(width / 2 - this.pos.x, 0))
            this.tail.translate(new Point(width / 2 - this.pos.x, 0))
        }
    }

    static Random(xrange,yrange,baseSize) {
        xrange = xrange || [width*.2,width*.8]
        yrange = yrange || [height*.2,height*.8]
        let pos = new Point(randomRange(xrange), randomRange(yrange))
        // let size = baseSize * random(0.5,1.2) * pixelSize || width*random(0.01,0.08)
        let size = lineSpacing * random(1,6) * pixelSize
        let goodPos = false
        let tries = 0
        while (!goodPos) {
            goodPos = true
            for (const hole of holes) {
                if (pos.getDistance(hole.pos) < size + hole.size + 60 * pixelSize) {
                    goodPos = false
                    pos = new Point(randomRange(xrange), randomRange(yrange))
                    size = lineSpacing * random(1,6) * pixelSize
                    break
                }
            }
            if (tries++ > 100) return
        }
        return new Hole(pos, size)
    }

    redraw(){
        const c = get(this.pos.x,this.pos.y)
        if (c[0]!=27 || c[1]!=27 || c[2] != 15) this.draw()
    }

    async floodFill(clr) {
        const fillColor = color(clr)

        const pathFillGraphics = createGraphics(width, height)
        pathFillGraphics.fill(0)
        pathFillGraphics.noStroke()
        const ps = pathToPoints(this.path)
        pathFillGraphics.beginShape()
        ps.forEach(p => pathFillGraphics.vertex(p.x, p.y))
        pathFillGraphics.endShape()
        pathFillGraphics.loadPixels()
        loadPixels()
        
        const x = round(this.pos.y)
        const y = round(this.pos.y)
        const startPixelIndex = getPixelIndex(x,y)
        const startColor = getPixelRGB(startPixelIndex)
        if (startColor == colorToRGB(fillColor)) return
        const stack = [{ pos: new Point(x, y), depth: 0 }]
        let count = 0
        while (stack.length > 0) {
            const newPos = stack.pop()
            const pixelIndex = getPixelIndex(newPos.pos.x, newPos.pos.y)
            const posColor = getPixelRGB(pixelIndex)
            const sameAsStart = posColor == startColor
            const isInPath = pathFillGraphics.pixels[pixelIndex] == 0 
            if (!isInPath) continue
            if (sameAsStart || newPos.depth < 3) {
                let nextDepth = sameAsStart ? 0 : newPos.depth + 1
                if (newPos.depth > 0) nextDepth++
                setPixel(pixelIndex, fillColor)
                if (count++ % 500 == 0) {
                    updatePixels()
                    await timeout(0)
                }
                stack.push({ pos: newPos.pos.add(new Point(-1, 0)), depth: nextDepth })
                stack.push({ pos: newPos.pos.add(new Point(0, -1)), depth: nextDepth })
                stack.push({ pos: newPos.pos.add(new Point(1, 0)), depth: nextDepth })
                stack.push({ pos: newPos.pos.add(new Point(0, 1)), depth: nextDepth })
            }
        }
        updatePixels()
    }

    static RandomMirror(){
        const hole = Hole.Random([width*.2,width*.5])
        if (hole) hole.mirror()
    }
}




function setPixel(index, clr) {
    pixels[index] = red(clr)
    pixels[index + 1] = green(clr)
    pixels[index + 2] = blue(clr)
}
const getPixelIndex = (x, y) => (x + y * width) * 4
const getPixelRGB = index => pixels[index] + ',' + pixels[index + 1] + ',' + pixels[index + 2]
const colorToRGB = (clr) => red(clr) + ',' + green(clr) + ',' + blue(clr)