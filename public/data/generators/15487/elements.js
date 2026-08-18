
function makeMainBlob() {
    const withGidul = random() < 0.2
    const numLumps = round_random(1, 10)
    const withFloating = withFloor && !withGidul && random() < .4

    const mainBlobSize = 160
    mainBlob = new Blob(new Path.Circle(centerPoint, mainBlobSize * random(.5, 1)).wonky().blocky(.5, 1))
    const sumMainLumps = round_random(2, 5)
    for (let i = 0; i < sumMainLumps; i++) {
        const positionOffset = p(mainBlobSize * random(-1, 1), mainBlobSize * random(-1, 1))
        const size = mainBlobSize * random(.5, 1)
        const shape = new Path.Circle(centerPoint.add(positionOffset), size).wonky().blocky(.5, 1)
        const blob = new Blob(shape)
        mainBlob.join(blob)
        shape.remove()
    }

    if (withGidul) {
        const loc = mainBlob.randomOnBorder()
        const pos = loc.point.subtract(loc.normal.multiply(40))
        const limb = Limb(pos, pos.add(pointFromAngle(random(360)).multiply(random(200, 400))), random(20, 40), random(10, 20))
        if (random() < 0.5)
            for (let i = 0; i < 50; i++) {
                limb.join(new Blob(new Path.Circle(limb.randomOnBorder().point, random(10, 20)).wonky()))
            }
        mainBlob.join(limb)
    }

    if (withFloating) {
        for (let i = 0; i < 5; i++) {
            const blob = new Blob(new Path.Circle(centerPoint.add(mainBlobSize * random(-1, 1), mainBlobSize * random(-2, -1)), mainBlobSize * random(.25, .5)).wonky())
            mainBlob.join(blob)
            blob.path.remove()
        }
    }

    for (let i = 0; i < numLumps; i++) {
        const blob = new Blob(new Path.Circle(mainBlob.randomOnBorder().point, random(10, 20)).wonky())
        mainBlob.join(blob)
        blob.path.remove()
    }
    cutWithFloor(mainBlob)
    mainBlob.path.translate(0, -8)
}

function makeBalls() {
    balls = new Blob(new Path())
    for (let i = 0; i < numBalls; i++) {
        const blob = new Blob(new Path.Circle(mainBlob.randomOnBorder().point, random(20, 40)).wonky())
        balls.join(blob)
        blob.path.remove()
    }
    cutWithFloor(balls)
    mainBlob.cut(balls)
}


function drawRocks() {
    rocks = new Blob(new Path())
    if (!withFloor) rocksUnder = new Blob(new Path())
    for (let i = 0; i < numRocks; i++) {
        const pos = withFloor ? p(width * random(.3, .7), floorHeight) : centerPoint.add(pointFromAngle(random(360)).multiply(random(200, 300)))
        const blob = new Blob(new Path.Circle(pos, random(20, 60)).wonky().blocky())
        if (withFloor) rocks.join(blob)
        else {
            if (random()<0.5) rocks.join(blob)
            else rocksUnder.join(blob)
        }
        blob.path.remove()
    }
    cutWithFloor(rocks)
    if (withFace) faces.forEach(face => rocks.cut(face.faceContainer))
    rocks.paint(rockColor)
    if (!withFloor) {
        rocksUnder.paint(rockColor)
        rocksUnder.group.sendToBack()
    }
    rocks.path.bringToFront()
    // rocks.shadows(0, '#555')
}

function crutches(blob, obstacles) {
    allCrutches = new Group()
    const paths = blob.getPaths()
    paths.forEach(path => {
        for (let posOffset = 0; posOffset < path.length; posOffset += 10) {
            const loc = path.getLocationAt(posOffset)
            if (floorHeight - loc.point.y < 30) continue
            const angle = positiveAngle(loc.tangent.angle)
            if ((angle > 240 && angle < 260) || (angle > 120 && angle < 140)) {
                const floorOffset = angle > 240 ? random(-20) : random(20)
                const pathToFloor = new Path([loc.point, p(loc.point.x + floorOffset, floorHeight)])
                const breakInPath = 2
                for (let i = 1; i < breakInPath; i++) pathToFloor.divideAt(pathToFloor.length * i / breakInPath)
                for (let i = 1; i < pathToFloor.segments.length - 1; i++) pathToFloor.segments[i].point = pathToFloor.segments[i].point.add(random(-5, 5), 0)
                drawCrutch(pathToFloor)
                posOffset += random(10, 25)
            }
        }
    })
    blob.group.addChild(allCrutches)
    return allCrutches
}

function drawCrutch(path) {
    const intersections = getOrderedIntersections(path)
    if (intersections.length > 0) {
        const rest = path.splitAt(intersections[0].offset)
        rest.remove()
        drawCrutch(path)
        return
    } else {
        for (let i = path.length * .33; i < path.length * .66; i += path.length / 10) {
            const hitTests = paper.project.activeLayer.hitTestAll(path.getPointAt(i))
            if (hitTests.length > 1) {
                path.remove()
                return
            }
        }
        path.smooth()
        path.strokeColor = pencil
        allCrutches.addChild(path)
        return
    }
}

function cutWithFloor(blob) {
    if (!withFloor) return
    blob.cut(floorBlob)
    blob.apply(crv => {
        for (let i = 0; i < crv.length; i += 30) {
            const pos = crv.getPointAt(i)
            if (abs(pos.y - floorHeight) < 5) {
                const seg = crv.divideAt(i)
                if (seg) {
                    seg.point.y += random(10)
                    seg.smooth()
                }
            }
        }
    })
}

function makeMoss() {
    moss = new Blob(new Path())
    for (let i = 0; i < 40; i++) {
        const outerPoint = mainBlob.path.bounds.topLeft.add(mainBlob.path.bounds.width * random(), 0)
        const loc = mainBlob.path.getNearestLocation(outerPoint)
        const pos = loc.path.getPointAt((loc.offset + random(-10, 10)) % loc.path.length).add(0, 5)
        const blob = new Blob(new Path.Circle(pos, random(5, 15)))
        moss.join(blob)
        blob.path.remove()
    }
    for (let i = 0; i < 10; i++) {
        const blob = new Blob(new Path.Circle(moss.randomOnBorder(), random(5, 15)).wonky())
        moss.join(blob)
    }
    if (withFace) faces.forEach(face => moss.cut(face.faceContainer))
    moss.paint(rockColor)
    moss.dropShadowOn(mainBlob, blobShadow)
}

const faces = []
class Face {
    constructor() {
        let locOnMain = mainBlob.randomOnBorder()
        this.faceContainer = new Path.Circle({ center: locOnMain.point.add(locOnMain.normal.multiply(random(-30, -80))), radius: 80 })
        let tries = 0
        while (!mainBlob.path.contains(this.faceContainer.position) ||
            this.faceContainer.getIntersections(balls.path).length != 0 ||
            faces.filter(face => !face.noFace).find(face => face.faceContainer.path.position.getDistance(this.faceContainer.position) < 80)) {
            locOnMain = mainBlob.randomOnBorder()
            this.faceContainer.position = locOnMain.point.add(locOnMain.normal.multiply(random(-30, -80)))
            if (tries++ > 100) {
                this.noFace = true
                return
            }
        }

        // Eyes
        this.eye1 = new Blob(new Path.Circle(this.faceContainer.position.add(30, -30), 20).wonky())
        this.eye2 = new Blob(this.eye1.path.clone())
        this.eye2.path.translate(-60, 0)
        this.eye2.path.scale(-1, 1)
        this.eye2.path.rotate(random(-40, 40))

        // Mouth
        const mouthPos = this.faceContainer.position.add(0, 0)
        const mouthWidth = random(6, 20)
        const mouthRotation = random(-60, 60)
        const seg1 = new paper.Segment(mouthPos.add(mouthWidth, 0), null, p(-1, 0).rotate(-mouthRotation).multiply(mouthWidth / 3))
        const seg2 = new paper.Segment(mouthPos.add(-mouthWidth, 0), p(1, 0).rotate(mouthRotation).multiply(mouthWidth / 3))
        this.mouth = new Path([seg1, seg2])

        this.faceGroup = new Group()
        this.faceGroup.addChildren([this.eye1.group, this.eye2.group, this.mouth])
        this.faceGroup.pivot = this.faceContainer.position
        this.faceGroup.rotate(0)

        mainBlob.folds.children.forEach(fold => {
            if (this.faceContainer.contains(fold.position)) {
                fold.remove()
            }
        })
        // faceContainer.remove()
        // faceContainer.fillColor = '#ff000055'
        this.faceContainer = new Blob(this.faceContainer)

        this.eye1.paint('white')
        this.eye2.paint('white')
        this.eye1.dropShadowOn(mainBlob, blobShadow)
        this.eye2.dropShadowOn(mainBlob, blobShadow)

        if (withPupils) {
            const pupilSize = random(5, 10)
            const pupilCommonOffset = withLookAway ? pointFromAngle(random(360)).multiply(random(pupilSize, pupilSize + 10)) : p(0, 0)
            this.pupil1 = new Path.Circle(this.eye1.path.position.add(pupilCommonOffset).add(pointFromAngle(random(360), random(6))), pupilSize * random(0.9, 1.1)).wonky(.9, 1.1).intersect(this.eye1.path)
            this.pupil2 = new Path.Circle(this.eye2.path.position.add(pupilCommonOffset).add(pointFromAngle(random(360), random(6))), pupilSize * random(0.9, 1.1)).wonky(.9, 1.1).intersect(this.eye2.path)
        }

        if (withBlackEyes) {
            const eyeLightOffset = random(6, 12)
            const lightLoc1 = this.eye1.path.getNearestLocation(lightSource)
            const lightLoc2 = this.eye2.path.getNearestLocation(lightSource)
            const lightPos1 = lightLoc1.point.subtract(lightLoc1.normal.multiply(eyeLightOffset))
            const lightPos2 = lightLoc2.point.add(lightLoc2.normal.multiply(eyeLightOffset))

            const lightShape_big1 = new Path.Circle(lightPos1, random(4, 6)).wonky()
            const lightShape_big2 = lightShape_big1.clone()
            lightShape_big2.position = lightPos2

            const lightShapeSmall1 = new Path.Circle(lightPos1.add(0, 10), random(2, 3)).wonky()
            const lightShapeSmall2 = lightShapeSmall1.clone()
            lightShapeSmall2.position = lightPos2.add(0, 10)


            this.eyeLights = [
                lightShape_big1,
                lightShape_big2,
                lightShapeSmall1,
                lightShapeSmall2
            ]
        }

        this.mouth.strokeColor = pencil
        this.mouth.translate(0, 15)
        if (withLips) this.lips = new Path.Circle(this.mouth.getPointAt(this.mouth.length / 2), random(3, 8)).wonky()
        faces.push(this)
    }

    drawp5() {
        if (this.noFace) return
        this.eye2.drawCurvesp5()
        this.eye1.drawCurvesp5()
        if (withBlackEyes) {
            fillPath(this.eye1.path, pencil)
            fillPath(this.eye2.path, pencil)
            this.eyeLights.forEach(light => fillPath(light, 'white'))
        }
        drawPath(this.mouth)
        if (withLips) drawPath(this.lips)
        if (withPupils) {
            fillPath(this.pupil1, pencil)
            fillPath(this.pupil2, pencil)
            drawPath(this.pupil1)
            drawPath(this.pupil2)
        }
    }
}

function airFlow() {
    airPaths = []
    const airFlow = pointFromAngle(random(70, 110))
    const allRockPaths = [...rocks.getPaths(), ...rocksUnder.getPaths()]
    allRockPaths.forEach(path => {
        if (random() < 0.1) return
        const airFlowOffset = (sqrt(path.bounds.width ** 2 + path.bounds.height ** 2) / 2) * random(1.2, 1.6)
        const airFlowLength = random(50, 500)
        const pos = path.position.add(airFlow.multiply(airFlowOffset))
        const airPath = new Path.Line(pos, pos.add(airFlow.multiply(airFlowLength)))
        airPaths.push(airPath)

        const airPath2 = airPath.clone()
        airPath2.position = airPath.position.add(airFlow.rotate(90).multiply(20)).add(airFlow.multiply(random(-5, 5)))
        airPaths.push(airPath2)

        if (random() < 0.5) {
            const airPath3 = airPath.clone()
            airPath3.position = airPath.position.subtract(airFlow.rotate(90).multiply(20)).add(airFlow.multiply(random(-5, 5)))
            airPaths.push(airPath3)
        } else {
            airPath2.position = airPath2.position.subtract(airFlow.rotate(90).multiply(10))
            airPath.position = airPath.position.subtract(airFlow.rotate(90).multiply(10))
        }
    })
    airPaths.forEach(path => {
        const intersections = getOrderedIntersections(path)
        if (intersections.length > 0) {
            const rest = path.splitAt(intersections[0].offset)
            rest.remove()
        }
        path.segments = path.segments.filter(segment => {
            const hitTests = paper.project.activeLayer.hitTestAll(segment.point)
            return (hitTests.length == 1)
        })

        for (let i=0;i<path.length;i+=10) {
            const pos = path.getPointAt(i)
            if (pos.x < 50 || pos.x > width - 50 || pos.y < 50 || pos.y > height - 50) {
                path.splitAt(i)
                break
            }
        }
    })

    airPaths.forEach(path => {
        path.splitAt(path.length * random(0.7, 1))
        path.rebuild(ceil(path.length / 50))
        path.segments.forEach(seg => seg.point = seg.point.add(p(random(-3, 3), random(-3, 3))))
        path.smooth()
    })
}