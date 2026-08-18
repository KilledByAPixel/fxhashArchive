let pencil = '#444'
const pencilMultiplier = random(1,2)
const pencilThickness = random(1,1.3)

const colors = ['#914E72', '#0078BF', '#00A95C', '#3255A4', '#F15060', '#765BA7', '#00838A', '#FF665E', '#FFE800', '#FF6C2F', '#E45D50', '#FF7477', '#62A8E5', '#4982CF', '#19975D', '#00AA93', '#62C2B1', '#67B346', '#009DA5', '#169B62', '#9D7AD2', '#BB76CF', '#F65058', '#6C5D80', '#D2515E', '#B44B65', '#E3ED55', '#FFB511', '#FFAE3B', '#F6A04D', '#FF6F4C', '#F2CDCF', '#F984CA', '#FF8E91', '#5EC8E5', '#82D8D5', '#FF4C65']

const withBlackEyes = random() < 0.1
const withPupils = !withBlackEyes && random() < 0.65
const withLookAway = withPupils && random() < 0.3
const withSilkScreenOffset = random() < 0.5
const withMoss = random() < 0.5
const withHair = false
const numBalls = round_random(0, 3)
const withFloor = random() < 0.82
const withAirFlow = random() < 0.7
const withCrutches = withFloor
const numRocks = withFloor ? round_random(1, 10) : round_random(3,7)
const withColor = true
const withShadow = withFloor && random() < 0.7
const withLips = random()<0.2
const withFace = true
const doubleFace = random()<0.1
const tripleFace = doubleFace && random()<0.1

async function makeImage() {
    blobColor = choose(colors)
    blobShadow = choose(colors)
    blobShadow2 = choose(colors)
    blobHighlight = choose(colors)
    oppositeColor = choose(colors)
    ballsColor = 'white'
    rockColor = choose(colors)

    otherPaintPaths = new paper.Group()
    const bg = new paper.Path.Rectangle(0, 0, width, height)
    bg.fillColor = '#ddd'
    bg.sendToBack()

    const secondLayer = new paper.Layer();

    // ----------------------------------------------------------------------------
    // ----------------------------------------------------------------------------
    // ----------------------------------------------------------------------------
    await timeout(0)


    floorHeight = height * .65
    floorBlob = new Blob(new Path.Rectangle(p(0, floorHeight), p(width, height)))
    centerPoint = p(width / 2, height * .5)
    lightSource = p(random(width), 0)

    makeMainBlob()
    makeBalls()
    await timeout(0)


    balls.paint(ballsColor)
    mainBlob.paint(blobColor)
    mainBlob.shadows(-20, blobShadow)
    mainBlob.shadows(20, blobShadow)
    mainBlob.shadows(180, blobHighlight)
    await timeout(0)

    mainBlob.doFoldShadows(blobShadow2)
    balls.dropShadowOn(mainBlob, blobShadow2)
    mainBlob.drawSpots()
    if (withHair) mainBlob.drawHair()
    await timeout(0)
    
    if (withFace) new Face()
    if (doubleFace) new Face()
    if (tripleFace) new Face()

    if (withMoss) makeMoss()
    drawRocks()
    await timeout(0)

    if (withCrutches) crutches(mainBlob)

    floorBlob.path.remove()
    floorHeight += p(width/2,height/2).subtract(mainBlob.path.bounds.center).y
    secondLayer.translate(p(width/2,height/2).subtract(mainBlob.path.bounds.center))
    await timeout(0)

    if (!withFloor && withAirFlow) airFlow()

    // -----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------

    paper.project.activeLayer.children.forEach(child => child.strokeColor = null)
    img = paper.project.activeLayer.rasterize()
    await timeout(0)


    if (withShadow){
        shadowPath = new Path.Circle(p(mainBlob.path.bounds.center.x, floorHeight), mainBlob.path.bounds.width/2)
        shadowPath.scale(1,0.1)
        shadowPath.rebuild(10).wonky().smooth()
        fillPath(shadowPath, pencil)
        drawPath(shadowPath)
    }

    if (!withFloor) rocksUnder.drawCurvesp5()
    mainBlob.drawCurvesp5()
    await timeout(0)


    balls.drawCurvesp5()
    if (withMoss) moss.drawCurvesp5()
    rocks.drawCurvesp5()
    
    if (withCrutches) allCrutches.children.forEach(crutch => drawPath(crutch))

    if (withFace) faces.forEach(face => face.drawp5())


    if (!withFloor && withAirFlow) airPaths.forEach(airPath => drawPath(airPath))
    await timeout(0)

    // -----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------

    linesImg = get()
    clear()

    const prevWidth = width
    resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight))
    const rescaleRatio = width/prevWidth
    background(255, 248, 245)
    
    if (withColor){
        const imageX = img.bounds.topLeft.x*rescaleRatio + (withSilkScreenOffset ? random(-5, 5) : 0)
        const imageY = img.bounds.topLeft.y*rescaleRatio + (withSilkScreenOffset ? random(-5, 5) : 0)
        image(img, imageX, imageY, img.bounds.width * rescaleRatio, img.bounds.height * rescaleRatio)
    }
    image(linesImg, 0, 0, width, height)
    await timeout(0)

    loadPixels()
    for (let i = 0; i < pixels.length; i += 4) {
        const x = (i / 4) % width - width/2
        const y = Math.floor((i / 4) / width)
        const val = random(25 * pixelDensity()) - noise(x/500/pixelDensity(), y/500/pixelDensity())*10*pixelDensity()
        pixels[i] += val
        pixels[i + 1] += val
        pixels[i + 2] += val
    }
    updatePixels()

    document.getElementById("loading").style.display = "none"
    canvas.elt.style.display = 'block';
    paperCanvas.style.display = 'none';

    fxpreview()
}
