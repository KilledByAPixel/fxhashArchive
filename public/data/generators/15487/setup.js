async function setup() {
    canvas = createCanvas(1000, 1000)
    paperCanvas = document.getElementById('paperCanvas');
    paperCanvas.width = width;
    paperCanvas.height = height
    pixelSize = 1
    canvas.elt.style.display = 'none';
    paperCanvas.style.display = 'none';
    paper.setup(paperCanvas);

    CORNERS = {
        TOP_LEFT: p(-width * 0.2, -height * 0.2),
        TOP_RIGHT: p(width * 1.2, -height * 0.2),
        BOTTOM_LEFT: p(-width * 0.2, height * 1.2),
        BOTTOM_RIGHT: p(width * 1.2, height * 1.2)
    }

    noiseSeed(round_random(100000))

    noLoop()
    await makeImage()
}


pressedKeys = ""
drawnHair = false
function keyPressed() {
    pressedKeys += key
    if (pressedKeys.includes("hair")) {
        if (!drawnHair) {
            resizeCanvas(1000,1000)
            image(linesImg, 0, 0, width, height)
            mainBlob.drawHair()
            linesImg = get()
            clear()

            const prevWidth = width
            resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight))
            const rescaleRatio = width / prevWidth
            background(255, 248, 245)

            if (withColor) {
                const imageX = img.bounds.topLeft.x * rescaleRatio + (withSilkScreenOffset ? random(-5, 5) : 0)
                const imageY = img.bounds.topLeft.y * rescaleRatio + (withSilkScreenOffset ? random(-5, 5) : 0)
                image(img, imageX, imageY, img.bounds.width * rescaleRatio, img.bounds.height * rescaleRatio)
            }
            image(linesImg, 0, 0, width, height)
            
            loadPixels()
            for (let i = 0; i < pixels.length; i += 4) {
                const x = (i / 4) % width - width / 2
                const y = Math.floor((i / 4) / width)
                const val = random(25 * pixelDensity()) - noise(x / 500 / pixelDensity(), y / 500 / pixelDensity()) * 10 * pixelDensity()
                pixels[i] += val
                pixels[i + 1] += val
                pixels[i + 2] += val
            }
            updatePixels()
            
            drawnHair = true
        }
    }
}