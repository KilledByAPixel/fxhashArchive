function setBackgroundColor(color) {
    backgroundColor = color
    updateLoadingScreenBackground()
}

function updateLoadingScreenBackground() {
    const loadingScreen = document.getElementById('loading-screen')
    if (loadingScreen) {
        loadingScreen.style.backgroundColor = backCol
    }
}

function updateBodyBackground() {
    document.body.style.backgroundColor = backgroundColor
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen')
    const loadingSpiral = document.getElementById('loading-spiral')
    var loadingIndicator = document.querySelector(".loading-indicator")
    
    if (loadingScreen) {
        loadingScreen.style.opacity = 0
        setTimeout(function () {
            loadingScreen.style.display = 'none'
        }, 2000)
    }

    if (loadingSpiral) {
        loadingSpiral.style.opacity = 0
        setTimeout(function () {
            loadingSpiral.style.display = 'none'
        }, 200)
    }

    if (loadingIndicator) {
        loadingIndicator.style.opacity = 0
        setTimeout(function () {
            loadingIndicator.style.display = 'none'
        }, 1500)
    }
}

function toggleLoadingIndicator() {
    var loadingIndicator = document.querySelector(".loading-indicator")
    if (isIOS) {
        loadingIndicator.style.display = "block"
    } else {
        loadingIndicator.style.display = "none"
    }
}

const loadingSketch = (p, seed) => {
    let loadingcanvas

    p.setup = () => {
        loadingcanvas = p.createCanvas(w, h)
        loadingcanvas.id('loading-animation')
        loadingcanvas.parent('loading-screen')

        p.frameRate(120)
        p.colorMode(HSB)
        pcount = 0
    }

    p.draw = () => {
        if (pcount === 0) {
            p.noStroke();
            p.fill(backCol);
            p.rect(0, 0, w, h);
        }
        pcount++
    }
}

const loadingSketchSpiral = (p, seed) => {
    let loadingcanvasSpiral

    p.setup = () => {

        loadingcanvasSpiral = p.createCanvas(w, h)
        loadingcanvasSpiral.id('loading-AniSpiral')
        loadingcanvasSpiral.parent('loading-spiral')

        p.randomSeed(seed)
        p.noiseSeed(seed)
        noiseDet = p.random([3, 10])
        p.noiseDetail(noiseDet)
        p.frameRate(120)
        p.colorMode(HSB)
        pcount = 0
    }

    p.draw = () => {
            function element(x, y, r) {
                let colorNoiseVal = p.noise(x * 0.002, y * 0.002)
                let colorIndex = int(colorNoiseVal * loadingColz.length)
                let ldColz = loadingColz[colorIndex]

                p.stroke(hue(ldColz), saturation(ldColz), brightness(ldColz) - 5)
                p.strokeWeight(5)
                p.fill(hue(ldColz), saturation(ldColz), brightness(ldColz))
                p.beginShape()
                const sides = p.random(2, 4)
                const increment = PI / sides
                const randomOffset = p.random(1, 5)

                for (let a = 0; a < TWO_PI; a += increment) {
                    const angle = a + randomOffset
                    const sx = x + p.cos(angle) * r
                    const sy = y + p.sin(angle) * r
                    pg.curveVertex(sx, sy)
                }
                p.endShape(CLOSE)
            }

            const maxRadius = 200
            const spiralFactor = 5

            let angle = progress * TWO_PI * spiralFactor
            let radius = maxRadius * (1 - progress)
            let x = p.cos(angle) * radius + p.width / 2
            let y = p.sin(angle) * radius + p.height / 2
            const initialStrokeSize = 15
            const minStrokeSize = 2
            const maxProgress = 1.0
            const strkSz = p.map(progress, 0, maxProgress, initialStrokeSize, minStrokeSize)

            const noiseFactor = p.noise(x * 0.005, y * 0.005)
            const multX = Math.sin(noiseFactor * TWO_PI * 2)
            const multY = Math.cos(noiseFactor * TWO_PI * 2)
            const xOffset = p.map(noiseFactor, 0, 1, -30, 30) * multX
            const yOffset = p.map(noiseFactor, 0, 1, -30, 30) * multY

            element(x + xOffset, y + yOffset, strkSz)

        }
        pcount++
}
