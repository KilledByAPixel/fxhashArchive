function element(x, y, r) {
	pg.beginShape()
	const sides = random(1, 4)
	const increment = PI / sides
	const randomOffset = random(1, 5)

	for (let a = 0; a < TWO_PI; a += increment) {
		const angle = a + randomOffset
		const sx = x + Math.cos(angle) * r
		const sy = y + Math.sin(angle) * r
		pg.curveVertex(sx, sy)
	}
	pg.endShape(CLOSE)
}

function elements(x, y, elementSize) {
	colNoiFac = noise(x * 0.005, y * 0.005)
	colorpalette.name === "28" ? colvar = map(colNoiFac, 0, 1, -15, 0) : colvar = map(colNoiFac, 0, 1, -15, 15)
	colorpalette.name === "28" ? colrnd = map(colNoiFac, 0, 1, -10, 0) : colrnd = map(colNoiFac, 0, 1, -10, 10)
	noize += noizeChange
	let val = noise(noize)
	if (val < 0.01) return
	let randomVal = random(0.1, 1)
	let sz = elementSize + val * randomVal
	let noiseVal = noise(x * 0.01, y * 0.01)

	x += noiseVal * sz
	y += noiseVal * sz

	element(x, y, sz)
}

function eternalLine(x, y, x1, y1, wobbliness, szz, colz) {
	let density = random(0.1, 0.3)
	colorpalette.name === "28" ? colvarAdd = random(-15, 0) : colvarAdd = random(-15, 15)
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * density
	let initialThickness = szz

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		let currentThickness = map(i, 0, segments * 2, initialThickness, 0)
		if (waveColChooser < 0.5) { colz = waveCol(x, y) }

		if (grunge < 0.1) {
			pg.stroke(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 8)
			pg.strokeWeight(2)
			pg.noFill()
		} else {
			pg.stroke(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 8)
			pg.strokeWeight(currentThickness / 4)
			pg.fill(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 2)
		}
		elements(x, y, random(1.5, currentThickness * random(0.8, 1.2)))

	}
}

function eternalLineShadow(x, y, x1, y1, wobbliness, szz, colz) {
	density = random(0.05, 0.3)
	colorpalette.name === "28" ? colvarAdd = random(-15, 0) : colvarAdd = random(-15, 15)
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * density
	let initialThickness = szz

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		let currentThickness = map(i, 0, segments * 2, initialThickness, 0)
		if (waveColChooser < 0.5) { colz = waveCol(x, y) }

		if (dirt < 0.2) {
			pg.stroke(random(15, 25))
		} else {
			pg.stroke(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 20, 0.5)
		}

		if (grunge < 0.1) {
			pg.strokeWeight(2)
			pg.noFill()
		} else {
			pg.strokeWeight(colvar)
			pg.fill(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 6)
		}

		elements(x + 2, y + 2, currentThickness * 1.01)
	}
}

function eternalLineLight(x, y, x1, y1, wobbliness, szz, colz) {
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * density
	let initialThickness = szz

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		let currentThickness = map(i, 0, segments * 2, initialThickness, 0)
		if (waveColChooser < 0.5) { colz = waveCol(x, y) }

		if (grunge < 0.1) {
			pg.stroke(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar, 0.3)
			pg.noFill()
		} else {
			pg.noStroke()
			pg.fill(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar, 0.3)
		}
		elements(x - 2, y - 2, currentThickness * 0.98)
	}
}

function spiralLine(x, y, x1, y1, wobbliness, szz, colz) {
	let density = random(0.05, 0.1)
	colorpalette.name === "28" ? colvarAdd = random(-15, 0) : colvarAdd = random(-15, 15)
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * density
	let initialThickness = szz

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		let currentThickness = map(i, 0, segments * 2, initialThickness, 0)
		if (waveColChooser < 0.5) { colz = waveCol(x, y) }

		pg.stroke(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 8)
		pg.strokeWeight(currentThickness / 4)
		pg.fill(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 2)
		elements(x, y, random(1.5, currentThickness * random(0.8, 1.2)))
	}
}

function spiralLineShadow(x, y, x1, y1, wobbliness, szz, colz) {
	let density = random(0.01, 0.05)
	colorpalette.name === "28" ? colvarAdd = random(-15, 0) : colvarAdd = random(-15, 15)
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * density
	let initialThickness = szz

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		let currentThickness = map(i, 0, segments * 2, initialThickness, 0)
		if (waveColChooser < 0.5) { colz = waveCol(x, y) }

		if (dirt < 0.2) {
			pg.stroke(random(15, 25))
		} else {
			pg.stroke(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 20, 0.5)
		}
		pg.strokeWeight(colvar)
		pg.fill(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar - 6)

		elements(x + 2, y + 2, currentThickness * 1.01)
	}
}

function spiralLineLight(x, y, x1, y1, wobbliness, szz, colz) {
	let density = random(0.01, 0.05)
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * density
	let initialThickness = szz

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])

	}

	for (let i = 0; i < controlPoints.length; i++) {
		let x = controlPoints[i][0]
		let y = controlPoints[i][1]
		let currentThickness = map(i, 0, segments * 2, initialThickness, 0)
		if (waveColChooser < 0.5) { colz = waveCol(x, y) }

		pg.noStroke()
		pg.fill(hue(colz) + colrnd + colvarAdd, saturation(colz), brightness(colz) + colvar, 0.3)
		elements(x - 2, y - 2, currentThickness * 0.98)
	}
}

function drawSpiral(centerX, centerY, angleStep, maxRadius) {
	let x = centerX
	let y = centerY
	let radius = 0
	let angle = 0

	for (let i = 0; i < maxRadius; i++) {
		angle += angleStep
		radius += 1
		let newX = x + cos(angle) * radius
		let newY = y + sin(angle) * radius

		spiralLineShadow(x, y, newX, newY, random(10, 30), random(20, 30), colz)
		spiralLine(x, y, newX, newY, random(10, 30), random(20, 30), colz)
		spiralLineLight(x, y, newX, newY, random(10, 30), random(20, 30), colz)

		x = newX
		y = newY
	}
}