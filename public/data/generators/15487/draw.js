allDots = 0
const drawDot = (p) => {
    drawDotXY(p.x, p.y)
}
nx = 0
nxs = 0.06
nx2 = 0
nxs2 = 0.05
function drawDotXY(x, y, opacity = 1) {
    allDots++
    nx += nxs
    nx2 += nxs2
    stroke((40+noise(nx2+0.5)*40)/pencilMultiplier, (noise(nx2)*60+100) * opacity)
    strokeWeight((2 + noise(nx) * 2) * pixelSize*pencilThickness)
    line(x, y, x, y)
    if (random() < 0.1) {
        const rx = random(-1, 1) * .5
        const ry = random(-1, 1) * .5
        line(x + rx, y + ry, x + rx, y + ry)
    }
}

function fillShape(ps, x = 0, y = 0) {
    beginShape()
    ps.forEach(p => vertex(p.x + x, p.y + y))
    endShape()
}

function drawShape(ps, x = 0, y = 0) {
    ps.forEach(p => drawDotXY(p.x + x, p.y + y))
}

function timeout(ms) {
    // return waitForKey(32).then(() => new Promise(resolve => setTimeout(resolve, max(ms, 100))))
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForKey(key) {
    return new Promise(resolve => {
        if (keyIsDown(key)) resolve()
        else window.addEventListener('keydown', e => {
            if (e.keyCode == key) resolve()
        })
    })
}
function addEffect() {
    filter(ERODE)
    filter(DILATE)
}

function pathToPoints(path) {
    const l = path.length
    const ps = []
    for (let i = 0; i < l; i++) ps.push(path.getPointAt(i))
    return ps
}

function drawPath(path, opacity = 1) {
    path.strokeColor = 'black'
    if (path.children) {
        path.children.forEach(drawPath)
        return 
    }
    const ps = pathToPoints(path)
    ps.forEach(p => drawDotXY(p.x, p.y, opacity))
}
function fillPath(path,clr) {
    if (clr) fill(clr)
    noStroke()
    const ps = pathToPoints(path)
    fillShape(ps)
}