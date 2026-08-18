allDots = 0
const drawDot = (p) => {
    drawDotXY(p.x, p.y)
}
nx = 0
nxs = 0.02
function drawDotXY(x, y) {
    allDots++
    nx += nxs
    strokeWeight((2 + noise(nx) * 2) * pixelSize)
    line(x, y, x, y)
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