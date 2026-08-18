function weightedRnd(input) {
	const out = []

	for (let inp of input) {
		for (let i = 0; i < inp[1]; i++) {
			out.push(inp[0])
		}
	}

	const output = int(random(out.length))
	return out[output]
}

function keyPressed() {
	if (key == 'p') save(title + "_" + fxhash + ".png")
	if (key == 'j') save(title + "_" + fxhash + ".jpg")

	if ("1" === key) {
		localStorage.setItem("pxlDens", 3)
		localStorage.setItem("w", w)
		localStorage.setItem("h", h)
		localStorage.setItem("onePressed", true)
		location.reload()
	}

	if ("2" === key) {
		localStorage.setItem("pxlDens", 3)
		localStorage.setItem("w", w)
		localStorage.setItem("h", h)
		location.reload()
	}

	if ("8" === key) {
		localStorage.setItem("pxlDens", 6)
		localStorage.setItem("w", w)
		localStorage.setItem("h", h)
		localStorage.setItem("eightPressed", true)
		location.reload()
	}

	if ("9" === key) {
		localStorage.setItem("pxlDens", 6)
		localStorage.setItem("w", w)
		localStorage.setItem("h", h)
		location.reload()
	}

	if ("0" === key) {
		localStorage.setItem("pxlDens", 1)
		localStorage.setItem("w", 1500)
		localStorage.setItem("h", 2000)
		location.reload()
	}

	if ("f" === key) {
		localStorage.setItem("pxlDens", 1)
		localStorage.setItem("w", windowWidth * 1.5)
		localStorage.setItem("h", windowHeight * 1.5)
		localStorage.setItem("fPressed", true)
		location.reload()
	}

	if ('h' === key) {
		localStorage.setItem("pxlDens", 3)
		localStorage.setItem("w", windowWidth * 1.5)
		localStorage.setItem("h", windowHeight * 1.5)
		location.reload()
	}

	if ("w" === key) {
		localStorage.setItem("pxlDens", 2)
		localStorage.setItem("w", 1179)
		localStorage.setItem("h", 2556)
		localStorage.setItem("wPressed", true)
		location.reload()
	}

	if ("a" === key) {
		localStorage.setItem("pxlDens", 1)
		localStorage.setItem("w", w)
		localStorage.setItem("h", h)
		localStorage.setItem("aPressed", true)
		location.reload()
	}
}

function touchStarted() {
	if (touches.length === 1) {
		saveTimeout = setTimeout(saveCan, 2000)
		saving = true
	}
}

function touchEnded() {
	if (saving) {
		clearTimeout(saveTimeout)
		saving = false
	}
}

function saveCan() {
	save(title + "_" + fxhash + ".jpg")
}