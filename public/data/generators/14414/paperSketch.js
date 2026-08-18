const BG = '#F3F2D4'
document.body.style.backgroundColor = BG
let pencil = '#1B1B0F'

const pallete1 = ['#de8ba0', '#a6465b', '#e5bcb6', '#de4704', '#f8a306']
const pallete2 = ['#4861a4', '#017f82', '#1B1B0F', '#fefffe', '#37166d', '#7b0517', '#ed8845', '#de0148']
const pallete3 = ["#F65817", "#1F8734", "#A82E79", "#3E7282", "#FA9B4E"]
const pallete4 = ['#a7dfff', '#467194', '#b07967', '#78544c']
const pallete5 = ['#fd0155', '#fa76c6']
const gold = ['#a67c00', '#bf9b30', '#ffbf00', '#ffcf40', '#ffdc73']
const bw = [pencil, BG]
const randomColors = [random(50, 150), random(130, 220)]
const colors = choose([pallete1, pallete2, pallete3, pallete4, pallete5, gold, bw, randomColors])

const lineSpacing = random(8, 20)
const colorfull = random() < 0.4
const holeNumber = random(1, 15)
const mirror = random() < 0.7
const sceneDir = choose(['vertical', 'horizontal'])
const sceneStyle = random() < 0.05 ? 'circles' : choose(['arcs', 'waves'])
const withBorder = random() < 0.7
const withDisturbance = random() < 0.25
const withoutLines = colorfull ? random() < 0.2 : false

let fillExpandDir2, fillExpandDir, fillForwardDir
async function makeImage() {
    colorMode(HSB, 255)
    fieldFillet = map(lineSpacing + holeNumber, 9, 30, 100, 50)


    background(BG)
    if (sceneStyle == 'circles') {
        growthCenter = choose([p(0, 0), p(width, height)])
        // growthCenter = p(100,100)
        fieldPaths = getFieldPaths_circles()
    } else if (sceneDir == 'horizontal') {
        growthCenter = new Point(random(width), random(-height, height))
        fillExpandDir = DIRS.RIGHT.multiply(width)
        fillForwardDir = DIRS.UP.multiply(width)
        if (sceneStyle == 'arcs') fieldPaths = getFieldPaths_arcs_horizontal()
        else if (sceneStyle == 'waves') fieldPaths = getFieldPaths_waves_horizontal()
    } else if (sceneDir == 'vertical') {
        growthCenter = new Point(random(width), height / 2)
        if (sceneStyle == 'arcs') fieldPaths = getFieldPaths_arcs_vertical()
        else if (sceneStyle == 'waves') fieldPaths = getFieldPaths_waves_vertical()
        fillExpandDir = DIRS.DOWN.multiply(width)
        fillForwardDir = DIRS.RIGHT.multiply(width)
    }


    for (let i = 0; i < holeNumber; i++) {
        if (mirror) Hole.RandomMirror()
        else Hole.Random()
    }

    for (hole of holes) hole.trimTail()
    for (hole of holes) hole.finalShape()
    await applyField(fieldPaths)
    for (hole of holes) hole.redraw()

    // FINISH IMAGE
    stroke(BG)
    strokeWeight(30 * pixelSize)
    rect(0, 0, width, height)
    rect(0, 0, width, height, 60 * pixelSize)
    borderPath = new Path.Rectangle(new paper.Rectangle(15 * pixelSize, 15 * pixelSize, width - 30 * pixelSize, height - 30 * pixelSize), 45 * pixelSize)
    borderPath.strokeColor = pencil
    if (withBorder) {
        stroke(pencil)
        drawPath(borderPath)
    }
    // if (pixelSize > 0.5 && lineSpacing>12) addEffect()
    if (withDisturbance) disturbance()

    finishImage()
    fxpreview()
}

function disturbance() {
    fill(pencil)
    noStroke()
    for (let i = 0; i < 1000; i++) {
        push()
        translate(random(width), random(height))
        rotate(random(360))
        ellipse(0, 0, random(10, 20) * pixelSize, random(3) * pixelSize)
        pop()
    }
}

function getFieldPaths_waves_vertical() {
    const basePath = makeSpine2(CORNERS.TOP_LEFT, CORNERS.BOTTOM_LEFT, 10)
    const paths = []
    for (let x = CORNERS.TOP_LEFT.x; x < CORNERS.TOP_RIGHT.x; x += lineSpacing * pixelSize) {
        basePath.segments.forEach(p => p.point.x += lineSpacing * random(0.8, 1.2) * pixelSize)
        paths.push(basePath.clone())
    }
    return paths
}

function getFieldPaths_arcs_vertical() {
    const paths = []
    for (let x = CORNERS.TOP_LEFT.x; x < CORNERS.TOP_RIGHT.x; x += lineSpacing * pixelSize) {
        const distFromCenter = x - growthCenter.x
        newPath = new Path([p(x, CORNERS.TOP_LEFT.y), p(x + distFromCenter, height / 2), p(x, CORNERS.BOTTOM_LEFT.y)])
        newPath.smooth()
        paths.push(newPath)
    }
    return paths
}

function getFieldPaths_arcs_horizontal() {
    const arcsCenter = random(height)
    const paths = []
    for (let y = CORNERS.BOTTOM_LEFT.y; y > CORNERS.TOP_RIGHT.y; y -= lineSpacing * pixelSize) {
        const distFromCenter = y - arcsCenter
        newPath = new Path([p(CORNERS.TOP_LEFT.x, y), p(width / 2, y + distFromCenter), p(CORNERS.TOP_RIGHT.x, y)])
        newPath.smooth()
        paths.push(newPath)
    }
    return paths
}

function getFieldPaths_arcs() {
    const paths = []
    for (let y = height; y >= 0; y -= lineSpacing * pixelSize) {
        newPath = new Path.Arc({ from: p(width * .5 - y, 0), through: p(width * .5, y), to: p(width * .5 + y, 0) });
        newPath.simplify(30)
        paths.push(newPath)
    }
    return paths
}

function getFieldPaths_waves_horizontal() {
    const basePath = makeSpine2(CORNERS.BOTTOM_LEFT, CORNERS.BOTTOM_RIGHT, random(10, 16))
    const paths = []
    for (let y = CORNERS.BOTTOM_LEFT.y; y > CORNERS.TOP_LEFT.y; y -= lineSpacing * pixelSize) {
        basePath.segments.forEach(p => p.point.y -= lineSpacing * random(0.8, 1.2) * pixelSize)
        paths.push(basePath.clone())
    }
    return paths
}

function getFieldPaths_circles() {
    const maxDistance = Math.max(...Object.values(CORNERS).map(p => growthCenter.getDistance(p)))
    const paths = []
    const center = p(width / 2, height / 2)
    const dirToCenter = center.subtract(growthCenter)
    const dirToLeft = p(1, 0).rotate(round(dirToCenter.angle / 90 + 1) * 90)
    const dirToRight = p(1, 0).rotate(round(dirToCenter.angle / 90) * 90)
    for (let r = 30 * pixelSize; r < maxDistance; r += lineSpacing * random(0.8, 1.2) * pixelSize) {
        dirToCenter.length = r
        const leftPoint = growthCenter.add(dirToLeft.normalize(r))
        const rightPoint = growthCenter.add(dirToRight.normalize(r))
        const centerPoint = growthCenter.add(dirToCenter.normalize(r))
        newPath = new Path.Arc({ from: leftPoint, through: centerPoint, to: rightPoint })
        paths.push(newPath)
    }
    fillExpandDir = dirToLeft.normalize(width)
    fillExpandDir2 = dirToRight.normalize(width)
    fillForwardDir = dirToCenter.normalize(width)
    return paths
}
















async function applyField(fieldPaths) {
    let lastPath = null
    for (path of fieldPaths) {
        const holesToTryAgain = []
        for (hole of holes) {
            const intersections = getOrderedIntersections(path, [hole.path])
            if (intersections.length == 1) holesToTryAgain.push(hole)
            if (intersections.length > 1) path = makeField(path, hole, intersections)
        }
        for (hole of holesToTryAgain) {
            const intersections = getOrderedIntersections(path, [hole.path])
            if (intersections.length > 1) path = makeField(path, hole, intersections)
        }
        // fillField(path)
        if (!lastPath) lastPath = path
        else {
            let newPath = path.clone()
            newPath.strokeColor = pencil
            lastPath.reverse()
            lastPath.addSegments(path.segments)
            getNextFillColor()
            noStroke()
            fillPath(lastPath)
            noFill()
            if (!withoutLines) drawPath(lastPath)
            lastPath.remove()
            lastPath = path
        }
        // path.parent = paper.project.activeLayer
        // path.remove()
        await timeout(0)
    }
}

function getNextFillColor() {
    if (!colorfull) fill(BG)
    else if (colors == randomColors) fill(random(255), colors[0] + random(-20, 20), colors[1] + random(-20, 20))
    else {
        const chosenColor = colors.shift()
        colors.sort((a, b) => random(-1, 1))
        colors.push(chosenColor)
        const clr1 = color(chosenColor)
        const clr2 = color(hue(clr1) + random(-10, 10), saturation(clr1) + random(-10, 10), brightness(clr1))
        fill(clr2)
    }
}


function makeField(newPath, hole, intersections) {
    const firstIntersection = intersections[0]
    const lastIntersection = intersections[intersections.length - 1]
    part1 = newPath.getSection(null, firstIntersection.point)
    part3 = newPath.getSection(lastIntersection.point, null)
    part2 = hole.path.getSection(firstIntersection.point, lastIntersection.point)
    if (part2.firstSegment.point.getDistance(part1.lastSegment.point) > 2) part2.reverse()
    hole.drawingPartOf()
    result = joinAndFillet([part1, part2, part3], fieldFillet * pixelSize, fieldFillet * .5 * pixelSize) || newPath
    part1.remove()
    part2.remove()
    part3.remove()
    newPath.remove()
    return result
}



function getOrderedIntersections(mainPath, paths) {
    allIntersections = []
    paths.forEach(path => {
        const pathIntersections = mainPath.getIntersections(path, (i) => i.offset > 3)
        pathIntersections.forEach(i => allIntersections.push(i))
    })
    allIntersections.sort((a, b) => a.offset - b.offset)
    return allIntersections
}
