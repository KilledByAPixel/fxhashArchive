function lndscpLine(x, y, x1, y1, wobbliness) {
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.4

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}


	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0];
		let y = controlPoints[i][1];
		pg.noStroke()
		if (colorpalette.name === "28") {
			pg.stroke(hue(colz), saturation(colz) - 10, brightness(colz) + random(-5, 0), random(0.1, 0.2))
		} else {
			pg.fill(hue(backCol), saturation(backCol) - 10, brightness(backCol) + random(-5, 5) + 25, random(0.1, 0.2))
		}

		elements(x, y, random(0.1, 1))
	}
}

function lndscpLine2(x, y, x1, y1, wobbliness) {
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.02

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}


	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0];
		let y = controlPoints[i][1];
		pg.noFill()
		if (colorpalette.name === "28") {
			pg.stroke(hue(colz), saturation(colz) - 10, brightness(colz) + random(-5, 0), random(0.1, 0.5))
		} else {
			pg.stroke(hue(backCol), saturation(backCol) - 10, brightness(backCol) + random(-5, 5) + 10, random(0.1, 0.5))
		}

		elements(x, y, random(0.5, 3))
	}
}

function listener(x, y, x1, y1, wobbliness, szz, colz, a) {
	let listenerCol = random(colorpalette.colors)
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.5
	let initialThickness = szz

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	if (random() > 0.5) {
		for (let i = 0; i < controlPoints.length; i++) {
			let x = controlPoints[i][0];
			let y = controlPoints[i][1];
			let currentThickness1 = map(i, 0, segments, initialThickness, 0)

			if (colorpalette.name === "28") {
				pg.fill(hue(listenerCol), saturation(listenerCol), brightness(listenerCol) + random(-5, 0), a)
			} else {
				pg.fill(hue(listenerCol), saturation(listenerCol), brightness(listenerCol) + random(-5, 5), a)
			}
			pg.noStroke()

			elements(x, y, random(1.5, currentThickness1))
		}
	} else {
		for (let i = 0; i < controlPoints.length; i++) {
			let x = controlPoints[i][0];
			let y = controlPoints[i][1];
			let currentThickness2 = map(i, 0, segments, 0, initialThickness)

			if (colorpalette.name === "28") {
				pg.fill(hue(listenerCol), saturation(listenerCol), brightness(listenerCol) + random(-5, 0), a)
			} else {
				pg.fill(hue(listenerCol), saturation(listenerCol), brightness(listenerCol) + random(-5, 5), a)
			}
			pg.noStroke()

			elements(x, y, random(1.5, currentThickness2))
		}
	}
}

function distraction(x, y, x1, y1, wobbliness) {
	let distrCol = random(colorpalette.colors)
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 2

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.02, yEnd * 0.02)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}


	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]

		distrLine(x, y, x1, y1, wobbliness, random(0.1, 0.2), distrCol)
	}
}

function distrLine(x, y, x1, y1, wobbliness, szz, colz) {
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.5

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	pg.noFill()
	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		let brVar = map(i, 0, segments, -10, 10)
		pg.fill(hue(colz) + brVar, saturation(colz), brightness(colz) + brVar, random(0.5, 1))
		pg.noStroke()

		elements(x, y, random(1.5, szz))
	}
}

function habits(x, y, x1, y1, wobbliness, szz) {
	let habitCol = random(colorpalette.colors)
	let brightrnd = random(-5, 5)
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.2
	let initialThickness = szz

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.005, yEnd * 0.005)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}


	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		let currentThickness = map(i, 0, segments * 2, initialThickness, 0)
		let size = random(1.5, currentThickness)
		pg.noStroke()
		if (colorpalette.name === "28") {
			pg.fill(hue(habitCol), saturation(habitCol), brightness(habitCol) + brightrnd - 4)
			elements(x + 1, y + 1, size)

			pg.fill(hue(habitCol), saturation(habitCol), brightness(habitCol) + brightrnd)
			elements(x, y, size)

			pg.fill(hue(habitCol), saturation(habitCol), brightness(habitCol) + brightrnd, 0.3)
			elements(x - 1, y - 1, size * 0.8)
		} else {
			pg.fill(hue(habitCol), saturation(habitCol), brightness(habitCol) + brightrnd - 4)
			elements(x + 1, y + 1, size)

			pg.fill(hue(habitCol), saturation(habitCol), brightness(habitCol) + brightrnd)
			elements(x, y, size)

			pg.fill(hue(habitCol), saturation(habitCol), brightness(habitCol) + brightrnd + 5, 0.3)

			elements(x - 1, y - 1, size * 0.8)
		}
	}
}

function lndscp() {
	rndx = random(100, w - 300)
	rndy = random(100, h - 200)
	sxrnd = random(0.1, 2)
	len = random(10, 200)

	for (let i = 0; i < random(2, 5); i++) {
		let y = rndy + i * random(2, 20)
		for (let j = 0; j < random(2, 5); j++) {
			let x = rndx + random(-10, 5);

			lndscpLine(x, y, x + len, y, 200)
			lndscpLine2(x, y, x + len, y, 100)
		}
	}
}

function drawStatic() {
	let static = {
		x: random(-100, w),
		y: random(-100, h),
		width: random(20, 1500),
		height: random(20, 1500),
		drawn: false
	}

	for (let i = 0; i < statics.length; i++) {
		if (static.x < statics[i].x + statics[i].width &&
			static.x + static.width > statics[i].x &&
			static.y < statics[i].y + statics[i].height &&
			static.y + static.height > statics[i].y) {
			return
		}
	}

	statics.push(static)

	for (let static of statics) {
		if (!static.drawn) {
			let staticCol = random(colorpalette.colors)
			let rndstaticszmax = random(0.5, 5)
			let rndstaticszmin = rndstaticszmax - 1

			const drawSL = (x1, y1, x2, y2) => staticLine(x1, y1, x2, y2, 50, random(rndstaticszmin, rndstaticszmax), staticCol)

			drawSL(static.x, static.y, static.x + static.width, static.y)
			drawSL(static.x + static.width, static.y, static.x + static.width, static.y + static.height)
			drawSL(static.x + static.width, static.y + static.height, static.x, static.y + static.height)
			drawSL(static.x, static.y + static.height, static.x, static.y)

			if (random() < 0.5) {
				for (let i = static.y + 10; i < static.y + static.height; i += random(5, 20)) {
					let x1 = static.x
					let y1 = i
					let x2 = static.x + static.width
					let y2 = i

					let cosVal = cos(y1 / 20)
					x1 += cosVal * 20
					x2 -= cosVal * 20
					drawSL(x1, y1, x2, y2)
				}
			} else {
				for (let i = static.x + 10; i < static.x + static.width; i += random(10, 20)) {
					let x1 = i
					let y1 = static.y
					let x2 = i
					let y2 = static.y + static.height

					let cosVal = cos(x1 / 20)
					y1 += cosVal * 20
					y2 -= cosVal * 20
					drawSL(x1, y1, x2, y2)
				}
			}

			static.drawn = true
		}
	}
}

function staticLine(x, y, x1, y1, wobbliness, szz, colz) {
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.3

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	pg.noFill()
	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		if (colorpalette.name === "28") {
			pg.fill(hue(colz), saturation(colz), brightness(colz) + random(-5, 0))
		} else {
			pg.fill(hue(colz), saturation(colz), brightness(colz) + random(-5, 5) + 10)
		}
		pg.noStroke()

		elements(x, y, random(1.5, szz))
	}
}

function timeWarp() {
	colorpalette.name === "28" ? timeWarpCol = color(0) : timeWarpCol = color(20)
	let circR = random(20, 400)
	let r = circR
	let n = r * 0.2
	let wobb = 2000
	let noiVal = 0.003 / noiseDet
	let timeWarpszmax = random(0.5, 5)
	let timeWarpszmin = timeWarpszmax - 1
	let innerR = random(0.5, 0.8)

	let timeWarpPos = createVector(random(0, w - circR), random(0, h - circR));

	for (let i = 0; i < timeWarps.length; i++) {
		let d = dist(timeWarpPos.x, timeWarpPos.y, timeWarps[i].pos.x, timeWarps[i].pos.y);
		if (d < r + timeWarps[i].r) {
			return
		}
	}

	let timeWarpObj = {
		pos: timeWarpPos,
		r: r,
	}

	timeWarps.push(timeWarpObj)

	pg.beginShape()
	for (let i = 0; i < n; i++) {
		let angle = map(i, 0, n, 0, TWO_PI)
		let x = r * cos(angle) + timeWarpObj.pos.x
		let y = r * sin(angle) + timeWarpObj.pos.y
		let noiX = x * noiVal
		let noiY = y * noiVal
		let noiseVal = noise(noiX, noiY)
		let wobble = map(noiseVal, 0, 1, -wobb, wobb)
		let xx = x + wobble
		let yy = y + wobble

		pg.stroke(timeWarpCol)
		pg.noFill()
		pg.strokeWeight(2)
		pg.curveVertex(xx, yy)
	}
	pg.endShape(CLOSE)

	pg.beginShape()
	for (let i = 0; i < n; i++) {
		let angle = map(i, 0, n, 0, TWO_PI)
		let x = (r * innerR) * cos(angle) + timeWarpObj.pos.x
		let y = (r * innerR) * sin(angle) + timeWarpObj.pos.y
		let noiX = x * noiVal
		let noiY = y * noiVal
		let noiseVal = noise(noiX, noiY)
		let wobble = map(noiseVal, 0, 1, -wobb, wobb)
		let xx = x + wobble
		let yy = y + wobble

		pg.stroke(timeWarpCol)
		pg.noFill()
		pg.strokeWeight(2)
		pg.curveVertex(xx, yy)
	}
	pg.endShape(CLOSE)

	for (let i = 0; i < n; i++) {
		let angle = map(i, 0, n, 0, TWO_PI)
		let outerX = r * cos(angle) + timeWarpObj.pos.x
		let outerY = r * sin(angle) + timeWarpObj.pos.y
		let innerX = (r * innerR) * cos(angle) + timeWarpObj.pos.x
		let innerY = (r * innerR) * sin(angle) + timeWarpObj.pos.y
		let noiX = outerX * noiVal
		let noiY = outerY * noiVal
		let noiseVal = noise(noiX, noiY)
		let wobble = map(noiseVal, 0, 1, -wobb, wobb)
		innerX += wobble
		innerY += wobble
		outerX += wobble
		outerY += wobble

		timeWarpLine(outerX, outerY, innerX, innerY, 10, random(timeWarpszmin, timeWarpszmax), timeWarpCol);
	}

}

function timeWarpLine(x, y, x1, y1, wobbliness, szz, colz) {
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.5

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	pg.noFill()
	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		if (colorpalette.name === "28") {
			pg.fill(hue(0), saturation(0), brightness(0))
		} else {
			pg.fill(hue(colz), saturation(colz), brightness(colz) + random(-5, 5) + 10)
		}
		pg.noStroke()

		elements(x, y, random(1.5, szz))
	}
}

function eraser() {
	let absoluteSpacing = 5
	let spacing = 2
	let size = random(100, 350)
	let posX = random(w)
	let posY = random(h)

	for (let x = 0; x < w; x += spacing + absoluteSpacing) {
		for (let y = 0; y < h; y += spacing + absoluteSpacing) {
			let distance = dist(x, y, posX, posY)
			let noiseFactor = noise(x * 0.005, y * 0.005)
			let elementSize = map(noiseFactor, 0, 1, 1, 6) * (1.5 - distance / size)

			if (distance < size) {
				if (colorpalette.name === "28") {
					pg.fill(hue(0), saturation(0), brightness(0))
				} else {
					pg.fill(hue(backCol), saturation(backCol), brightness(backCol))
				}
				pg.noStroke()

				pg.circle(x, y, elementSize)
			}
		}
	}
}

function moths() {
	for (let i = 0; i < 5; i++) {
		pg.noFill()
		pg.stroke(20)
		pg.strokeWeight(1)
		pg.circle(random(w), random(h), random(5, 10))
	}
}

function mementos(x, y, col) {
	shift = random(30, 150)
	rndcolz = random(-20, 20)
	pg.push()
	pg.translate(-10, -shift / 2)
	pg.rotate(random(0, 2 * PI))
	for (let i = 0; i < 20; i++) {
		pg.strokeWeight(random(4, 6))
		if (colorpalette.name === "28") {
			pg.stroke(
				hue(col) + rndcolz,
				saturation(col) + random(-10, 10),
				brightness(col) + random(-10, 0)
			)
			pg.line(
				x + i * random(3, 5),
				y + random(-50, 50),
				x + i * random(3, 5),
				y + shift + random(-50, 50)
			)

			pg.strokeWeight(random(0.5, 1))
			pg.stroke(
				hue(col) + rndcolz,
				saturation(col) + random(-10, 5),
				brightness(col)
			)
			pg.line(
				x + i * random(3, 5),
				y + random(-50, 50),
				x + i * random(3, 5),
				y + shift + random(-50, 50)
			)
		} else {
			pg.stroke(
				hue(col) + rndcolz,
				saturation(col) + random(-10, 10),
				brightness(col) + random(-10, 10)
			)
			pg.line(
				x + i * random(3, 5),
				y + random(-50, 50),
				x + i * random(3, 5),
				y + shift + random(-50, 50)
			)

			pg.strokeWeight(random(0.5, 1))
			pg.stroke(
				hue(col) + rndcolz,
				saturation(col) + random(-10, 5),
				brightness(col) + random(0, 10)
			)
			pg.line(
				x + i * random(3, 5),
				y + random(-50, 50),
				x + i * random(3, 5),
				y + shift + random(-50, 50)
			)
		}

	}
	pg.pop()
}

function tex() {
	const totalLines = Math.ceil((h + 40) / random(2, 3))
	const linesPerFrame = Math.ceil(totalLines / cnt)

	for (let i = 0; i < linesPerFrame && texLinesDrawn < totalLines; i++) {
		let y = texLinesDrawn * random(3, 5)
		let rndX = random(-1, 1)
		let rndY = random(-1, 1)

		texLines(-20 + rndX, y - 20 + rndY, w + 40 + rndX, y - 20 + rndY)

		texLinesDrawn++
	}
}

function texLines(x, y, x1, y1) {
	overl.push()
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * random(0.03, 0.1)

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -20, 20)
		let yOffset = map(noiseFactor, 0, 1, -20, 20)

		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		overl.noFill()
		let startX = controlPoints[i][0]
		let startY = controlPoints[i][1]
		let endX = controlPoints[i + 1][0]
		let endY = controlPoints[i + 1][1]
		let strk = random(1, 3)
		let rnd = 4

		//shadows
		overl.stroke(0, 0, 10, 0.05)
		overl.strokeWeight(strk)
		overl.line(startX + random(-rnd, rnd), startY + random(-rnd, rnd), endX + random(-rnd, rnd), endY + random(-rnd, rnd))
		//highlights
		overl.stroke(0, 0, 90, 0.01)
		overl.strokeWeight(strk)
		overl.line(startX + random(-rnd, rnd), startY - 2 + random(-rnd, rnd), endX + random(-rnd, rnd), endY - 2 + random(-rnd, rnd))

	}
	overl.pop()
}

function drawTex() {
	push()
	blendMode(ADD)
	image(overl, 0, 0, w, h)
	pop()

	push()
	blendMode(MULTIPLY)
	image(overl, 0, 0, w, h)
	pop()

	borderDsplc()
	resetShader()

	shadeTex()
	resetShader()
}