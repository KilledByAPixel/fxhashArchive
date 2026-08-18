let title = 'Rückkopplung'

let loadingScreen
let progress = 0
let closeLastRhombus = false
let isFirstIteration = true

let saveTimeout
let saving = false

let h = 2000
let w = h * 0.75
let seed

function setup() {
	loadingScreen = document.createElement('div')
	loadingScreen.id = 'loading-screen'
	document.body.appendChild(loadingScreen)
	loadingSpiral = document.createElement('div')
	loadingSpiral.id = 'loading-spiral'
	document.body.appendChild(loadingSpiral)
	bodyElement = document.body

	$fx.rand.reset()

	const storedpxlDens = localStorage.getItem("pxlDens")
	pxlDens = storedpxlDens ? parseInt(storedpxlDens) : 1

	const storedWidthValue = localStorage.getItem("w")
	w = storedWidthValue ? parseInt(storedWidthValue) : w

	const storedHeightValue = localStorage.getItem("h")
	h = storedHeightValue ? parseInt(storedHeightValue) : h

	const storedOnePressedValue = localStorage.getItem("onePressed")
	onePressed = storedOnePressedValue ? JSON.parse(storedOnePressedValue) : false

	const storedEightPressedValue = localStorage.getItem("eightPressed")
	eightPressed = storedEightPressedValue ? JSON.parse(storedEightPressedValue) : false

	const storedWPressedValue = localStorage.getItem("wPressed")
	wPressed = storedWPressedValue ? JSON.parse(storedWPressedValue) : false

	const storedFPressedValue = localStorage.getItem("fPressed")
	fPressed = storedFPressedValue ? JSON.parse(storedFPressedValue) : false

	const storedAPressedValue = localStorage.getItem("aPressed")
	aPressed = storedAPressedValue ? JSON.parse(storedAPressedValue) : false

	seed = fxrand() * 123456789

	if (!aPressed) {
		new p5(loadingSketch, "loading-animation", seed)
		new p5(loadingSketchSpiral, "loading-AniSpiral", seed)
	}

	randomSeed(seed)
	noiseSeed(seed)

	createCanvas(w, h)
	pg = createGraphics(w, h)
	resistance = createGraphics(w, h)
	border = createGraphics(w, h)
	overl = createGraphics(w, h)

	pixelDensity(pxlDens)
	pg.pixelDensity(1)
	resistance.pixelDensity(pxlDens)
	border.pixelDensity(pxlDens)
	overl.pixelDensity(pxlDens)
	pxlDensShdr = pxlDens
	localStorage.clear()

	noiseDet = random([3, 10])
	noiseDetail(noiseDet)

	colorMode(HSB)
	pg.colorMode(HSB)
	resistance.colorMode(HSB)
	border.colorMode(HSB)
	overl.colorMode(HSB)

	strokeCap(ROUND)
	frameRate(120)

	shdrNoiseRndPos = random(0, 100)
	shdrSpeed = random(10, 100)
	shdrwt = [
		[0.02, 25],
		[0.025, 35],
		[0.03, 30],
		[0.04, 5],
		[0.1, 5]
	]
	shdrWet = weightedRnd(shdrwt)
	shdrWet === 0.1 ? noise2Scale = 1 : noise2Scale = 5
	noise2Rnd = random(5, 10)
	tanrnd = random(2, 30)
	anglrbool = random()
	anglrzrnd = random(5, 10)
	tanDir = random([-1, 1])
	generalDir = random([-1, 1])
	raster = [
		[1, 95],
		[1200, 5]
	]
	rasterVis = weightedRnd(raster)

	noize = 0
	noizeChange = 0.1

	colorpalette = getPalettes()
	colorzz = colorpalette.colors
	colShuffle(colorzz)
	col = random(colorzz)
	backCol = random(colorpalette.back)
	loadingColz = colorpalette.colors.filter(color => color !== backCol)
	waveColChooser = random()
	bodyElement.style.backgroundColor = color(hue(backCol), saturation(backCol), brightness(backCol) / 4)

	$fx.features({
		'palette': colorpalette.name
	})

	counter = 0
	count = [
		[5, 10],
		[15, 10],
		[25, 25],
		[50, 30],
		[100, 15],
		[150, 10]
	]
	cnt = weightedRnd(count)
	habitcnt = 25
	paintdur = int(random(25, 100))

	eternalArr = random()
	eternalDens = random([1, 2])
	eternalOutline = random()
	eternalSzChsr = random()

	wobble = random([20, 600, 900])

	dirt = random()
	spirals = random()
	minimal = random()
	if (minimal < 0.03) {
		cnt = 150
		paintdur = 70
	}
	grunge = random()
	colorpalette.name === "28" ? dirt = 1 : dirt = random()

	drawcomp = cnt + habitcnt

	staticTimeWarpChooser = random()

	listenerDir = random()

	statics = []
	staticDens = random([1, 2, 3, 4])
	timeWarps = []

	polygon = []
	concentricPolyCenter = random()
	resistanceFoundation()

	texLinesDrawn = 0

	waveAngle = random(TWO_PI)
	dotWaveFreq = random(0.001, 0.05)
	dotWaveAmp = random(10, 50)
	dotWaveThick = random(50, 250)
	dotWaveStretch = random([HALF_PI, TWO_PI])

	dotWaveFreq2 = random(0.005, 0.01)
	dotWaveAmp2 = random(10, 30)
	dotWaveThick2 = random(100, 250)

	background(hue(backCol), saturation(backCol), brightness(backCol))

	isIOS = /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
	if (isIOS) {
		setBackgroundColor(backCol)
	}
	toggleLoadingIndicator()
}

function draw() {
	if (counter < drawcomp) {
		drawComposition()
		image(pg, 0, 0)
	} else if (counter > drawcomp && counter === drawcomp + 1) {
		drawResistance()
		activateShdr()
	} else if (counter > drawcomp + 1 && counter < drawcomp + paintdur) {
		moths()
		drawDsplc()
	} else if (counter === drawcomp + paintdur) {
		resetShader()
		translate(-w / 2, -h / 2)
		image(resistance, 0, 0, w, h)

		if (pixelDensity() === 1 || onePressed || eightPressed || wPressed || fPressed) {
			drawTex()
		}

		hideLoadingScreen()
		noLoop()
		setTimeout(fxpreview(), 10000)

		if (pixelDensity() === 3) {
			save(title + "_" + fxhash + ".jpg")
			save(title + "_" + fxhash + ".png")
		}

		if (wPressed) { save(title + "_" + fxhash + ".jpg") }
	}

	if (counter < drawcomp + paintdur) {
		progress = counter / (drawcomp + paintdur)
	} else {
		progress = 1
	}

	counter++
}

function drawComposition() {
	eternalSzChsr < 0.6 ? eternalThickMax = random([40, 120]) : eternalThickMax = random([2, 5, 10, 20, 40])
	eternalThickMin = eternalThickMax - 1

	colz = random(colorzz)
	colz2 = random(colorzz)

	listenerlen = random(50, 400)
	listenervertx = random(0, w)
	listenerverty = random(0, h)
	listenerhorx = random(0, w)
	listenerhory = random(0, h)

	distrlen = random(30, 100)
	distrhorx = random(-100, w)
	distrhory = random(-100, h)

	etrnlx = random(0, w)
	etrnly = random(0, h)
	etrnlxend = random(0, w)
	etrnlyend = random(0, h)

	eternalHorX = 0
	eternalHorY = 0
	eternalHorXEnd = w
	eternalHorYEnd = h
	eternalIncr = counter * 50

	habitx = random(0, w)
	habity = random(0, h)
	habitxend = random(0, w)
	habityend = random(0, h)
	habitThickMax = random([2, 5, 8])
	habitThickMin = habitThickMax - 1

	mementoX = random(w)
	mementoY = random(h)

	spiralX = random(w)
	spiralY = random(h)

	tex()

	if (counter < cnt) {
		lndscp()
	}

	if (counter < cnt) {
		for (let i = 0; i < eternalDens; i++) {
			let col = random(colorpalette.colors)
			for (let i = 0; i < 5; i++) {
				mementos(mementoX + random(-50, 50), mementoY + random(-50, 50), col)
			}

			if (listenerDir > 0.5) {
				listener(listenervertx, listenerverty, listenervertx, listenerverty + listenerlen, 30, random(2, 6), colz, 1)
			} else {
				listener(listenerhorx, listenerhory, listenerhorx + listenerlen, listenerhory, 30, random(2, 6), colz, 1)
			}

			if (spirals < 0.2) {
				if (counter % 5 == 0) {
					drawSpiral(spiralX, spiralY, random(0.28, 0.35), random(120, 200))
				}
			} else {
				if (eternalArr < 0.85) {
					if (eternalOutline > 0.5) {
						eternalLine(etrnlx - eternalThickMax * 2, etrnly - eternalThickMax * 2, etrnlxend - eternalThickMax * 2, etrnlyend - eternalThickMax * 2, wobble, random(eternalThickMin, eternalThickMax * 2), colz2, random(0.5, 1))
					}
					eternalLineShadow(etrnlx, etrnly, etrnlxend, etrnlyend, wobble, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
					eternalLine(etrnlx, etrnly, etrnlxend, etrnlyend, wobble, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
					eternalLineLight(etrnlx, etrnly, etrnlxend, etrnlyend, wobble, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
				} else if (eternalArr < 0.95) { //horizontal
					if (eternalOutline > 0.5) {
						eternalLine(eternalHorX - eternalThickMax * 2, eternalIncr - eternalThickMax * 2, eternalHorXEnd - eternalThickMax * 2, eternalIncr - eternalThickMax * 2, 10, random(eternalThickMin, eternalThickMax * 2), colz2, random(0.5, 1))
					}
					eternalLineShadow(eternalHorX, eternalIncr, eternalHorXEnd, eternalIncr, 10, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
					eternalLine(eternalHorX, eternalIncr, eternalHorXEnd, eternalIncr, 10, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
					eternalLineLight(eternalHorX, eternalIncr, eternalHorXEnd, eternalIncr, 10, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
				} else { //vertical
					if (eternalOutline > 0.5) {
						eternalLine(eternalIncr - eternalThickMax * 2, eternalHorY - eternalThickMax * 2, eternalIncr - eternalThickMax * 2, eternalHorYEnd - eternalThickMax * 2, 10, random(eternalThickMin, eternalThickMax * 2), colz2, random(0.5, 1))
					}
					eternalLineShadow(eternalIncr, eternalHorY, eternalIncr, eternalHorYEnd, 10, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
					eternalLine(eternalIncr, eternalHorY, eternalIncr, eternalHorYEnd, 10, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
					eternalLineLight(eternalIncr, eternalHorY, eternalIncr, eternalHorYEnd, 10, random(eternalThickMin, eternalThickMax), colz, random(0.5, 1))
				}
			}
		}
	}

	if (counter % staticDens == 0 && counter < cnt) {
		staticTimeWarpChooser < 0.5 ? drawStatic() : timeWarp()
	}

	if (counter === 1) {
		margin()
	}

	if (counter % 10 == 0 && counter < cnt) {
		eraser()
	}

	if (counter % 20 == 0 && counter < cnt) {
		distraction(distrhorx, distrhory, distrhorx + distrlen, distrhory, 300, random(eternalThickMin, eternalThickMax))
	}

	if (counter > cnt && counter < cnt + habitcnt) {
		for (let i = 0; i < 2; i++) {
			habits(habitx, habity, habitxend, habityend, 600, random(habitThickMin, habitThickMax), random(0.5, 1))
		}
	}
}