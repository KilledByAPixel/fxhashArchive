const Path = paper.Path
const Point = paper.Point
const Segment = paper.Segment

const DIRS = { UP: new Point(0, -1), DOWN: new Point(0, 1), LEFT: new Point(-1, 0), RIGHT: new Point(1, 0) }
const p = (x, y) => new Point(x, y)
const randomPoint = () => new Point(random(-1, 1), random(-1, 1)).normalize()
const pointFromAngle = (angle) => {
    return new Point(1, 0).rotate(angle)
}

paper.Path.prototype.getSection = function (from, to) {
    
    if (typeof from === 'number') from = this.getPointAt(from)
    else if (from instanceof paper.Point) from = this.getNearestPoint(from)
    else if (from instanceof paper.CurveLocation) from = this.getNearestPoint(from.point)
    if (!from) from = from = this.getPointAt(0)

    if (typeof to === 'number') to = this.getPointAt(to)
    else if (to instanceof paper.Point) to = this.getNearestPoint(to)
    else if (to instanceof paper.CurveLocation) to = this.getNearestPoint(to.point)
    if (!to) to = this.getPointAt(this.length)

    if (from.equals(to)) return

    const newPath = this.clone()
    const newPath2 = newPath.splitAt(newPath.getNearestLocation(from).offset)
    // const keepPath = newPath.getLocationOf(to) ? newPath : newPath2
    const keepPath = pointOnWhichPath(to, newPath, newPath2)
    const keepPath2 = keepPath.splitAt(keepPath.getNearestLocation(to).offset)
    const result = pointOnWhichPath(from, keepPath, keepPath2).clone()
    if (newPath) newPath.remove()
    if (newPath2) newPath2.remove()
    if (keepPath) keepPath.remove()
    if (keepPath2) keepPath2.remove()
    return result
}

function pointOnWhichPath(point,path1,path2){
    if (!path1) return path2
    if (!path2) return path1
    if (path1.getLocationOf(point)) return path1
    if (path2.getLocationOf(point)) return path2
    const pointOnPath1 = path1.getNearestPoint(point)
    const pointOnPath2 = path2.getNearestPoint(point)
    return pointOnPath1.getDistance(point) < pointOnPath2.getDistance(point) ? path1 : path2
}

function makeSpine2(v1, v2, sunPoints) {
    const dir = v2.subtract(v1)
    dir.length = 1
    dir.angle += 90
    const path = new Path()
    for (let i = 0; i <= sunPoints; i++) {
        const p = new Point(lerp(v1.x, v2.x, i / sunPoints), lerp(v1.y, v2.y, i / sunPoints))
        const p2 = p.add(dir.multiply(random(-50, 50) * pixelSize))
        path.add(p2)
    }
    path.smooth()
    return path
}

function makeSpine(start, dir, totalLength) {
    const segments = 10
    const segmentLength = totalLength / segments
    dir.length = segmentLength
    const path = new Path()
    path.add(start)
    for (let i = 0; i < segments; i++) {
        const segDir = dir.clone()
        segDir.angle += random(-15, 15)
        start = start.add(segDir)
        path.add(start)
    }
    path.smooth()
    return path
}



function pathToPoints(path) {
    const l = path.length
    const ps = []
    for (let i = 0; i < l; i++) ps.push(path.getPointAt(i))
    return ps
}

function drawPath(path) {
    path.strokeColor = 'black'
    const ps = pathToPoints(path)
    stroke(pencil)
    drawShape(ps)
}
function fillPath(path) {
    const ps = pathToPoints(path)
    fillShape(ps)
}




function spiralPath(center, rounds, spacing, startRadius) {
    const path = new Path()
    const start = center.clone()
    for (let i = 0; i < rounds; i++) {
        const dir = pointFromAngle(i * 60)
        const p = start.add(dir.multiply(startRadius + i * spacing))
        path.add(p)
    }
    path.smooth()
    return path
}

function offsetPath(path, offset) {
    const res = new Path()
    path.segments.forEach(seg => {
        const newSeg = seg.clone()
        newSeg.point = newSeg.point.add(seg.location.normal.multiply(offset))
        res.add(newSeg)
    })
    return res
}

function getFillet(path1, path2, radius) {
    const loc = path1.getIntersections(path2)[0]
    if (!loc) return null
    const reverseTangent = loc.offset > path1.length / 2 ? -1 : 1
    const toNormal = loc.point.add(loc.normal.multiply(radius))
    const toTangent = loc.point.add(loc.tangent.multiply(radius * reverseTangent))
    const path2Point = path2.getNearestLocation(toNormal)
    const path1Point = path1.getNearestLocation(toTangent)
    const seg1 = new Segment(path2Point.point, path2Point.tangent.multiply(radius * reverseTangent))
    const seg2 = new Segment(path1Point.point, path1Point.tangent.multiply(-radius * reverseTangent))
    return new Path([seg2, seg1])
}


function fillField(fieldPath) {
    const pathToFill = fieldPath.clone()
    const firstPoint = pathToFill.firstSegment.point
    const lastPoint = pathToFill.lastSegment.point

    const base1_1 = new Segment(firstPoint.add(fillExpandDir2 ? fillExpandDir : fillExpandDir.multiply(-1)))
    const base1_2 = new Segment(base1_1.point.add(fillForwardDir))
    const base2_1 = new Segment(lastPoint.add(fillExpandDir2 || fillExpandDir))
    const base2_2 = new Segment(base2_1.point.add(fillForwardDir))
    pathToFill.segments.unshift(base1_1)
    pathToFill.segments.unshift(base1_2)
    pathToFill.segments.push(base2_1)
    pathToFill.segments.push(base2_2)
    getNextFillColor()
    noStroke()
    fillPath(pathToFill)
    noFill()
    stroke(pencil)
    pathToFill.remove()
}

function joinAndFillet(paths, r1, r2) {
    if (paths.includes(null)) return null
    const sections = []
    if (paths[0].length > r1) sections.push(paths[0].getSection(null, paths[0].length - r1))
    else sections.push(new Path(paths[0].firstSegment.point))

    r2 = min(r2, paths[1].length/3)
    if (paths[1].length > r2 * 2) sections.push(paths[1].getSection(r2, paths[1].length - r2))

    if (paths[2].length > r1) sections.push(paths[2].getSection(r1))
    else sections.push(new Path(paths[2].lastSegment.point))

    if (sections.includes(null)) return null

    sections[0].lastSegment.handleOut = sections[0].lastSegment.handleIn
    sections[0].lastSegment.handleOut.length = -r1
    sections[sections.length - 1].firstSegment.handleIn = sections[sections.length - 1].firstSegment.handleOut
    sections[sections.length - 1].firstSegment.handleIn.length = -r1

    const result = new Path()
    sections.forEach(section => result.join(section))
    sections.forEach(section => section.remove())
    return result
}