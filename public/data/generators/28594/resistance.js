function resistanceFoundation() {
	compositionChoice = random()
	rectHor = false
	rectVert = false
	rectCollision = false
	rndRectGrid = false
	spiral = false
	concentric = false
	rhombuses = false
	polyGrid = false
	poly3 = false
	polyChaos = false

	if (compositionChoice < 0.15) {
		rectCollision = true
		//rect grid collision
		for (let i = 0; i < 10; i++) {
			let x, y, w, h, pos, vectors

			do {
				x = random(50, width - 50)
				y = random(50, height - 50)
				w = random(width / 30, width / 1.5)
				h = random(width / 30, width / 1.5)
				pos = createVector(x, y)
				topLeft = pos.copy()
				topRight = createVector(x + w, y)
				bottomLeft = createVector(x, y + h)
				bottomRight = createVector(x + w, y + h)

				vectors = [topLeft, topRight, bottomRight, bottomLeft]
			} while (checkRectCollision(vectors))

			polygon.push(createVector(pos.x, pos.y))
			polygon.push(createVector(topRight.x, topRight.y))
			polygon.push(createVector(bottomRight.x, bottomRight.y))
			polygon.push(createVector(bottomLeft.x, bottomLeft.y))
		}
	} else if (compositionChoice < 0.25) {
		rndRectGrid = true
		//randomized rectangle grid
		const x = 150
		const y = 150
		const w = width - 50
		const h = height - 50
		const numCols = random([5, 6])
		const numRows = random([5, 6])
		const colWidth = (w - x) / numCols
		const rowHeight = (h - y) / numRows

		for (let i = 0; i < numCols; i++) {
			for (let j = 0; j < numRows; j++) {
				const rx = x + i * colWidth
				const ry = y + j * rowHeight
				const rw = colWidth * random()
				const rh = rowHeight * random()

				polygon.push(createVector(rx, ry))
				polygon.push(createVector(rx + rw, ry))
				polygon.push(createVector(rx + rw, ry + rh))
				polygon.push(createVector(rx, ry + rh))
			}
		}

	} else if (compositionChoice < 0.55) {
		polyGrid = true
		//poly grid
		const polyGridSize = random([2, 3])
		const margin = 50
		const cellWidth = (width - 2 * margin) / polyGridSize
		const cellHeight = (height - 2 * margin) / polyGridSize

		for (let row = 0; row < polyGridSize; row++) {
			for (let col = 0; col < polyGridSize; col++) {
				polyNormalSides = int(random(4, 16))

				const polyNormalX = margin + col * cellWidth + cellWidth / 2
				const polyNormalY = margin + row * cellHeight + cellHeight / 2
				const polyNormalRad = Math.min(cellWidth, cellHeight) / random([0.5, 1, 2, 3])

				for (let i = 0; i < polyNormalSides; i++) {
					let angle = map(i, 0, polyNormalSides, 0, TWO_PI)
					let x = polyNormalX + cos(angle) * polyNormalRad
					let y = polyNormalY + sin(angle) * polyNormalRad

					x = constrain(x, margin, width - margin)
					y = constrain(y, margin, height - margin)

					polygon.push(createVector(x, y))
				}
			}
		}
	} else if (compositionChoice < 0.65) {
		poly3 = true
		//polys chaos 1
		const polyChaosSides = int(random(8, 25))
		const polyChaosRad = height / 4
		const margin = 50

		for (let i = 0; i < polyChaosSides; i++) {
			const angle = map(i, 0, polyChaosSides, 0, TWO_PI)
			let x = random(width - margin) + cos(angle) * polyChaosRad
			let y = random(height - margin) + sin(angle) * polyChaosRad / 2

			x = constrain(x, margin, width - margin)
			y = constrain(y, margin, height - margin)

			polygon.push(createVector(x, y))
		}
	} else if (compositionChoice < 1) {
		polyChaos = true
		//polys chaos 2
		for (let i = 0; i < 3; i++) {
			const polyNormalSides = int(random(8, 25))
			const margin = 50
			const polyNormalX = random(width - margin)
			const polyNormalY = random(height - margin)
			const polyNormalRad = height / 5

			for (let i = 0; i < polyNormalSides; i++) {
				const angle = map(i, 0, polyNormalSides, 0, TWO_PI)
				let x = polyNormalX + cos(angle) * polyNormalRad
				let y = polyNormalY + sin(angle) * polyNormalRad / random([0.5, 1, 2])

				x = constrain(x, margin, width - margin)
				y = constrain(y, margin, height - margin)

				polygon.push(createVector(x, y))
			}
		}
	}
}

function checkRectCollision(rectVectors) {
	for (let i = 0; i < polygon.length; i++) {
		const other = polygon[i]
		for (let j = 0; j < other.length; j++) {
			const corner = other[j]
			if (
				rectVectors[0].x < corner.x &&
				rectVectors[1].x > corner.x &&
				rectVectors[0].y < corner.y &&
				rectVectors[3].y > corner.y
			) {
				return true
			}
		}
	}

	if (
		rectVectors[0].x < 50 ||
		rectVectors[1].x > width - 50 ||
		rectVectors[0].y < 50 ||
		rectVectors[3].y > height - 50
	) {
		return true
	}

	return false
}

function pencilPigment(x, y, r) {
	resistance.noStroke()
	const sides = random(4, 6)
	const increment = PI / sides
	const randomOffset = random(1, 2)

	resistance.beginShape()
	for (let a = 0; a < TWO_PI; a += increment) {
		const angle = a + randomOffset
		const sx = x + Math.cos(angle) * r + random(2, 4)
		const sy = y + Math.sin(angle) * r + random(2, 4)

		resistance.vertex(sx, sy)
	}
	resistance.endShape(CLOSE)
}

function pencilLineSegment(x, y, x1, y1) {

	const controlPoints = []
	const d = dist(x, y, x1, y1)
	const segments = d * 0.3

	for (let i = 0; i <= segments; i++) {
		const xEnd = x + (x1 - x) * i / segments
		const yEnd = y + (y1 - y) * i / segments

		controlPoints.push([xEnd, yEnd])

		const mainSlope = (y1 - y) / (x1 - x)
		const perpSlope = -1 / mainSlope
		const perpIntercept = yEnd - perpSlope * xEnd
		const perpX = xEnd + 1
		const perpY = perpSlope * perpX + perpIntercept

		controlPoints.push([perpX, perpY])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		const pointX = controlPoints[i][0]
		const pointY = controlPoints[i][1]

		resistance.fill(20, 10, 20, 0.5)
		resistance.noStroke()

		pencilPigment(pointX, pointY, random(0.5, 1))
	}
}

function drawPencilLine(x, y, x1, y1, wobbliness) {
	const controlPoints = []
	const d = dist(x, y, x1, y1)
	const segments = d * 0.7

	for (let i = 0; i <= segments; i++) {
		const xEnd = x + (x1 - x) * i / segments
		const yEnd = y + (y1 - y) * i / segments
		const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		const multX = Math.sin(noiseFactor * TWO_PI * 2)
		const multY = Math.cos(noiseFactor * TWO_PI * 2)
		const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
		const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
		pencilAngle = map(noiseFactor, 0, 1, -3, 3) * multY

		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		startX = controlPoints[i][0]
		startY = controlPoints[i][1]
		endX = controlPoints[i + 1][0]
		endY = controlPoints[i + 1][1]
		rndspread = pencilAngle

		push()
		pencilLineSegment(
			startX + random(-rndspread, rndspread),
			startY + random(-rndspread, rndspread),
			endX + random(-rndspread, rndspread),
			endY + random(-rndspread, rndspread))
		pop()
	}

}

function drawResistance() {
	for (let i = 0; i < polygon.length - 1; i++) {
		drawPencilLine(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y, 200)

	}
	
	if (!rndRectGrid && !rhombuses) {
		drawPencilLine(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y, 200)
	}

}