// By Roni Block
// May 2022

// License: CC BY-NC-SA 4.0

let margin = 2;
let N = 16;
let gap, u;
let palette, strokeCol = 5, backCol = "#fffbe6";
let maxSize, myStyle, myPal, flat;
let cvsSize, sw;
let squares;
let mySeed;

let randInt = (a, b) => (floor(random(a, b)));

let palName, styleName, biggestSquare = 0;

function setup() {
  initParams(windowWidth, windowHeight);
	mySeed = fxrand()*10000;

	createCanvas(cvsSize, cvsSize);
	pixelDensity(2);

	noLoop();
}

function draw() {
	randomSeed(mySeed);

	maxSize = random([2, 3, 3, 3, 4, 4, 4, 5, 5, 5]);
	myStyle = randInt(-1, 10);
	myPal = randInt(-1, 10);
	flat = random() < 1/10;
	choosePalette();

	stroke(strokeCol);
	strokeWeight(sw);
  strokeJoin(ROUND);
	background(backCol);

  let smol = (random() < 0.01) ? 0 : 1;
  for (let i = 0; i < smol*500; i++) {
    let newSqu = generateSquare();
    let canAdd = true;
    for (let squ of squares) {
      if (squaresIntersect(newSqu, squ)) {
        canAdd = false;
        break;
      }
    }
    if (canAdd) {
      drawSquare(newSqu.i*u+gap/2, newSqu.j*u+gap/2, newSqu.s*u-gap);
      squares.push(newSqu);
    }
  }

	for (let i = margin; i < N-margin; i++) {
		for (let j = margin; j < N-margin; j++) {
			let newSqu = {
				i: i,
				j: j,
				s: 1
			}
			let canAdd = true;
			for (let squ of squares) {
				if (squaresIntersect(newSqu, squ)) {
					canAdd = false;
					break;
				}
			}
			if (canAdd) {
				drawSquare(i*u+gap/2, j*u+gap/2, u-gap);
			}
		}
	}

  window.$fxhashFeatures = {
    "Palette": (myPal == -1) ? "Mix" : palName,
    "Flat": flat ? "Yes" : "No",
    "Style": (myStyle == -1) ? "Mix" : styleName,
    "Max size": biggestSquare
  }
  fxpreview();
}

function keyPressed() {
	if (key == "s") {
    initParams(2048, 2048);
    resizeCanvas(cvsSize, cvsSize);
		saveCanvas("ten.png");
    initParams(windowWidth, windowHeight);
  	resizeCanvas(cvsSize, cvsSize);
	}
}

function windowResized() {
	initParams(windowWidth, windowHeight);
	resizeCanvas(cvsSize, cvsSize);
}

function initParams(w, h) {
	cvsSize = min(w, h);
	u = cvsSize/N;
	gap = u/4;
	sw = cvsSize/250;
	squares = [];
}

function choosePalette() {
	let green1 = "#abcd5e", green2 = "#29ac9f", green3 = "#14976b";
	let blue1 = "#b3dce0", blue2 = "#62b6de", blue3 = "#2b67af";
	let yellow = "#f9d531", pink = "#f589a3", red = "#ef562f", orange = "#fc8405";

	let pal = (myPal == -1) ? randInt(0, 10) : myPal;
	if (pal == 0) {
		palette = [pink, green2, yellow];
    palName = "Chewing Gum";
	} else if (pal == 1) {
		palette = [red, yellow, blue3];
    palName = "Not Mondrian";
	} else if (pal == 2) {
		palette = [green1, green2, green3];
    palName = "Root";
	} else if (pal == 3) {
		palette = [red, orange, yellow];
    palName = "Burn";
	} else if (pal == 4) {
		palette = [blue2, yellow, orange];
    palName = "Barn";
	} else if (pal == 5) {
		palette = [blue1, blue2, blue3];
    palName = "Round";
	} else if (pal == 6) {
		palette = [blue1, blue2, yellow];
    palName = "Blue Sky";
	} else if (pal == 7) {
		palette = [blue2, green1, yellow];
    palName = "Planet";
	} else if (pal == 8) {
		palette = [pink, red, blue3];
    palName = "Spring";
	} else if (pal == 9) {
		palette = [yellow, red, green3];
    palName = "Miracle";
	}

	if (flat) {
		let col = random(palette);
		palette = [col, col, col, col];
	} else {
		palette.push(backCol);
	}
}

function generateSquare() {
  let s = randInt(2, maxSize+1);
  let i = randInt(margin, N-margin-s+1);
  let j = randInt(margin, N-margin-s+1);
  let squ = {
    i: i,
    j: j,
    s: s
  };
  return squ;
}

function squaresIntersect(squ1, squ2) {
	return ((squ1.i <= squ2.i && squ1.i+squ1.s > squ2.i) || (squ2.i <= squ1.i && squ2.i+squ2.s > squ1.i)) && ((squ1.j <= squ2.j && squ1.j+squ1.s > squ2.j) || (squ2.j <= squ1.j && squ2.j+squ2.s > squ1.j))
}

function drawSquare(x, y, s) {
	let style = (myStyle == -1) ? randInt(0, 10) : myStyle;

	let n = round((s+gap)/u);
  if (n > biggestSquare) biggestSquare = n;

	if (myPal == -1 || flat) {
		choosePalette();
	}
	shuffle(palette, true);

	if (style == 0) {
		study(x, y, s);
    styleName = "Study";
	} else if (style == 1) {
		lewitt(x, y, s);
    styleName = "LeWitt";
	} else if (style == 2) {
		cube(x, y, s);
    styleName = "Cube";
	} else if (style == 3) {
		design(x, y, s);
    styleName = "Design";
	} else if (style == 4) {
		truchetBig(x, y, s);
    styleName = "Truchet (Big)";
	} else if (style == 5) {
		mondrian(x, y, round(4*s/u), round(4*s/u), n, random() < 1/2);
    styleName = "Mondrian";
	} else if (style == 6) {
		circular(x, y, s);
    styleName = "Circular";
	} else if (style == 7) {
		zigzag(x, y, s);
    styleName = "Zigzag";
	} else if (style == 8) {
		truchetSmall(x, y, s);
    styleName = "Truchet (Small)";
	} else if (style == 9) {
		hideAndSeek(x, y, s);
    styleName = "Hide and Seek";
	}
}

function study(x, y, s) {
  let i = 0;
  if (random() < 1/3) {
    rectMode(CENTER);
    for (let w = s; w > 0; w -= u/2) {
      fill(palette[(i++)%palette.length]);
      square(x+s/2, y+s/2, w);
    }
		rectMode(CORNER);
  } else {
    push();
    translate(x+s/2, y+s/2);
    rotate(random([0, PI/2, PI, 3*PI/2]));
		let lines = random() < 1/2;
    for (let w = 0; w < s-0.01; w += u/4) {
      fill(palette[(i++)%palette.length]);
      if (lines) rect(-s/2, w-s/2, s, u/4);
			else square(-s/2, -s/2, s-w);
    }
    pop();
  }
}

function lewitt(x, y, s) {
  let types = shuffle([0, 1, 2, 3]);

	fill(palette[0]);
	square(x, y, s);

	let n = random([1, 2]);
	for (let i = 0; i < n; i++) {
		let t = types[i];

		for (let z = u/4; z < s - 0.01; z += u/4) {
			if (t == 0) {
				line(x+z, y, x+z, y+s);
			} else if (t == 1) {
				line(x, y+z, x+s, y+z);
			}
		}

		for (let z = u/4; z < s; z += u/2) {
			if (t == 2) {
				line(x+z, y, x+s, y+s-z);
				line(x, y+z, x+s-z, y+s);
			} else if (t == 3) {
				line(x+z+u/4, y, x, y+z+u/4);
				line(x+s, y+z, x+z, y+s);
			}
		}
	}
}

function cube(x, y, s) {
	push();
	translate(x+s/2, y+s/2);
	rotate(random([0, PI/2, PI, 3*PI/2]));

	let dim = u/4, bord = s/4;
	if (random() < 1/2) [bord, dim] = [dim, bord]

	fill(palette[0]);
	square(-s/2, -s/2, s-dim);

	fill(palette[1]);
	quad(s/2-dim, -s/2, s/2, -s/2+dim, s/2, s/2, s/2-dim, s/2-dim);
	fill(palette[2]);
	quad(-s/2, s/2-dim, -s/2+dim, s/2, s/2, s/2, s/2-dim, s/2-dim);

	if (s > u && random() < 1/2) {
		fill(backCol);
		square(-s/2+bord+dim, -s/2+bord+dim, s-2*dim-2*bord);
		fill(palette[1]);
		quad(-s/2+bord, -s/2+bord, -s/2+bord+dim, -s/2+bord+dim, -s/2+bord+dim, s/2-dim-bord, -s/2+bord, s/2-dim-bord);
		fill(palette[2]);
		quad(-s/2+bord, -s/2+bord, -s/2+bord+dim, -s/2+bord+dim, s/2-dim-bord, -s/2+bord+dim, s/2-dim-bord, -s/2+bord);
	}

	pop();
}

function design(x, y, s) {
  fill(palette[0]);
  square(x, y, s);
  push();
  translate(x+s/2, y+s/2);
  rotate(random([0, PI/2]));
  let r = randInt(0, 15);
  switch (r) {
    case 0:
      fill(palette[1]);
      arc(-s/2, -s/2, s, s, 0, PI/2, PIE);
			arc(s/2, s/2, s, s, PI, 3*PI/2, PIE);
      fill(palette[2]);
      arc(s/2, -s/2, s, s, PI/2, PI, PIE);
      arc(-s/2, s/2, s, s, 3*PI/2, 2*PI, PIE);
      break;
    case 1:
      fill(palette[1]);
      arc(-s/2, -s/2, s, s, 0, PI/2, PIE);
			arc(s/2, s/2, s, s, PI, 3*PI/2, PIE);
      fill(palette[2]);
      arc(s/2, -s/2, s, s, PI/2, PI, PIE);
      break;
    case 2:
      fill(palette[1]);
      arc(-s/2, -s/2, s, s, 0, PI/2, PIE);
      fill(palette[2]);
      arc(s/2, -s/2, s, s, PI/2, PI, PIE);
      break;
    case 3:
      fill(palette[1]);
      arc(-s/2, -s/2, s, s, 0, PI/2, PIE);
      arc(s/2, s/2, s, s, PI, 3*PI/2, PIE);
      break;
    case 4:
      fill(palette[1]);
      arc(-s/2, -s/2, s, s, 0, PI/2, PIE);
      break;
    case 5:
      fill(palette[1]);
      arc(0, -s/2, s, s, 0, PI, PIE);
      fill(palette[2]);
      arc(0, s/2, s, s, PI, 2*PI, PIE);
      break;
    case 6:
      fill(palette[1]);
      arc(0, -s/2, s, s, 0, PI, PIE);
      break;
    case 7:
      fill(palette[1]);
      arc(0, -s/2, s, s, 0, PI, PIE);
      fill(palette[2]);
      arc(s/2, s/2, s, s, PI, 3*PI/2, PIE);
      fill(palette[3]);
      arc(-s/2, s/2, s, s, 3*PI/2, 2*PI, PIE);
      break;
    case 8:
      fill(palette[1]);
      arc(0, -s/2, s, s, 0, PI, PIE);
      fill(palette[2]);
      arc(s/2, s/2, s, s, PI, 3*PI/2, PIE);
      break;
    case 9:
      fill(palette[1]);
      arc(0, -s/2, s, s, 0, PI, PIE);
      fill(palette[2]);
      arc(-s/2, s/2, s, s, 3*PI/2, 2*PI, PIE);
      break;
    case 10:
      fill(palette[1]);
      rect(-s/2, -s/2, s/2, s/2);
      fill(palette[2]);
      rect(-s/2, 0, s/2, s/2);
      fill(palette[3]);
      rect(0, -s/2, s/2, s/2);
      break;
    case 11:
      fill(palette[1]);
      rect(-s/2, -s/2, s, s/2);
      break;
    case 12:
      fill(palette[1]);
      rect(-s/2, -s/2, s, s/2);
      fill(palette[2]);
      rect(0, -s/2, s/2, s/2);
      break;
    case 13:
      fill(palette[1]);
      square(0, 0, s/2);
      break;
    case 14:
      fill(palette[1]);
      arc(-s/2, -s/2, s, s, 0, PI/2, PIE);
      fill(palette[2]);
      square(0, 0, s/2);
  }
  pop();
}

function truchetBig(x, y, s) {
	fill(palette[0]);
	square(x, y, s);

	let n = (s+gap)/u;
	let zMax = s;
	switch (n) {
		case 1:
			zMax = s;
			break;
		case 2:
			zMax += random([0, u/2]);
			break;
		case 3:
			zMax += random([0, u/2]);
			break;
		case 4:
			zMax += random([0, u/2, u]);
			break;
		case 5:
			zMax += random([0, u/2, u, 3*u/2]);
			break;
	}

	push();
	translate(x+s/2, y+s/2);
  rotate(random([0, PI/2]));
	let z = zMax;
	let i = 1;
	while (z > u/2) {
		fill(palette[i%2+1]);
		arc(-s/2, -s/2, z, z, 0, PI/2, PIE);
		arc(s/2, s/2, z, z, PI, 3*PI/2, PIE);
		z -= u/2;
		i++;
	}
	z = 2*s-zMax-u/2;
	i = 0;
	while (z > u/2) {
		fill(palette[i%2+1]);
		arc(s/2, -s/2, z, z, PI/2, PI, PIE);
		arc(-s/2, s/2, z, z, 3*PI/2, TAU, PIE);
		z -= u/2;
		i++;
	}
	pop();
}

function mondrian(x, y, nw, nh, n, horiz) {
	if (n == 0 || (horiz && nh < 3) || (!horiz && nw < 3)) {
		fill(random(palette));
		rect(x, y, nw*u/4, nh*u/4);
		return;
	}
	if (horiz) {
		let div = (nh == 3) ? randInt(1, 3) : randInt(2, nh-1);
		mondrian(x, y, nw, div, n-1, false);
		mondrian(x, y+div*u/4, nw, nh-div, n-1, false);
	} else {
		let div = (nw == 3) ? randInt(1, 3) : randInt(2, nw-1);
		mondrian(x, y, div, nh, n-1, true);
		mondrian(x+div*u/4, y, nw-div, nh, n-1, true);
	}
}

function circular(x, y, s) {
	let buf = createGraphics(s, s);
	buf.stroke(strokeCol);
	buf.strokeWeight(sw);
	let i = 0;
	if (random() < 1/3) buf.translate(-s/2, 0);
	else if (random() < 1/2) buf.translate(-s/2, -s/2);
	for (let d = s*3+u/4+u/30; d > u/10; d -= u/2) {
		buf.fill(palette[i%palette.length]);
		buf.circle(s/2, s/2, d);
		i++;
	}

	push();
	translate(x+s/2, y+s/2);
	rotate(random([0, PI/2, PI, 3*PI/2]));
	image(buf, -s/2, -s/2);
	pop();
	noFill();
	square(x, y, s);
}

function zigzag(x, y, s) {
	let buf = createGraphics(s, s);
	buf.stroke(strokeCol);
	buf.strokeWeight(sw);
	let i = 0;
	if (random() < 2/3) {
		if (random() < 1/2) buf.translate(-s/2, 0);
		for (let d = s*2-u/4; d > 0; d -= u/2) {
			buf.fill(palette[i%palette.length]);
			buf.quad(s/2, s/2-d, s/2+d, s/2, s/2, s/2+d, s/2-d, s/2);
			i++;
		}
	} else {
		let j0 = random([0, 1]);
		for (let d = s; d > 0; d -= u/2) {
			buf.fill(palette[i%palette.length]);
			buf.beginShape();
			buf.vertex(0, 0);
			let j = j0;
			for (let x1 = 0; x1 <= s; x1 += u/4) {
				buf.vertex(x1, d + (j % 2 == 0 ? u/4 : 0));
				j++;
			}
			buf.vertex(s, 0);
			buf.endShape();
			i++;
		}
	}

	push();
	translate(x+s/2, y+s/2);
	rotate(random([0, PI/2, PI, 3*PI/2]));
	image(buf, -s/2, -s/2);
	pop();
	noFill();
	square(x, y, s);
}

function truchetSmall(x, y, s) {
	let buf = createGraphics(s, s, WEBGL);
	buf.strokeWeight(sw);
	buf.background(palette[0]);
	buf.noFill();
	let i1 = 0, i2 = 1;
	for (let x1 = -s/2; x1 < s/2; x1 += u/2) {
		for (let y1 = -s/2; y1 < s/2; y1 += u/2) {
			if (random() < 1/2) {
				buf.fill(palette[i1]);
				buf.noStroke();
				buf.square(x1, y1, s);
				buf.fill(palette[i2]);
				buf.stroke(strokeCol);
				buf.arc(x1, y1, u/2, u/2, 0, PI/2);
				buf.arc(x1+u/2, y1+u/2, u/2, u/2, PI, 3*PI/2);
			} else {
				buf.fill(palette[i2]);
				buf.noStroke();
				buf.square(x1, y1, s);
				buf.fill(palette[i1]);
				buf.stroke(strokeCol);
				buf.arc(x1+u/2, y1, u/2, u/2, PI/2, PI);
				buf.arc(x1, y1+u/2, u/2, u/2, 3*PI/2, TAU);
			}
			[i1, i2] = [i2, i1];
		}
		[i1, i2] = [i2, i1];
	}

	push();
	translate(x+s/2, y+s/2);
	rotate(random([0, PI/2, PI, 3*PI/2]));
	image(buf, -s/2, -s/2);
	pop();
	noFill();
	square(x, y, s);
}

function hideAndSeek(x, y, s) {
	fill(palette[0]);
	square(x, y, s);

	push();
	translate(x+s/2, y+s/2);
	fill(palette[1]);

	function layer1() {
		if (random() < 1/3) {
			circle(0, 0, s*2/3);
		}
	}

	function layer2() {
		rotate(random([0, PI/2]));
		let r = randInt(0, 6);
		if (r == 0) {
			rect(-s/2, -s/2, s, s/2);
		} else if (r == 1) {
			triangle(-s/2, -s/2, -s/2, s/2, s/2, -s/2);
		} else if (r == 2) {
			square(-s/2, -s/2, s/2);
			square(0, 0, s/2);
		} else if (r == 3) {
			triangle(-s/2, -s/2, 0, 0, -s/2, s/2);
		} else if (r == 4) {
			square(0, 0, s/2);
		} else {
			triangle(-s/2, -s/2, 0, 0, -s/2, s/2);
			triangle(s/2, -s/2, 0, 0, s/2, s/2);
		}
	}

	if (random() < 1/2) {
		fill(palette[1]);
		layer1();
		fill(palette[2]);
		layer2();
	} else {
		fill(palette[1]);
		layer2();
		fill(palette[2]);
		layer1();
	}

	pop();
}
