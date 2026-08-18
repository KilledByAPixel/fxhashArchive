/* Copyright (C) 2021 Eko33 - All Rights Reserved
 */

let token = fxhash;

const palettes = [
	["#9fb256","#d3e1bf","#dc959b","#db6861","#7d1712"],
	["#db2f80","#ddb1c7","#f3ebd1","#f1e798","#4fa588"],
	["#dfc4dc","#dd70b7","#931c6d","#0c2545","#234d87"],
	["#e1d5b9","#010201","#ab3c32","#2a62b0","#e1b63d"]
];

let seeds;
let palette_id, angle, nbuffers;
let palette,offset;


	let rd = fxrand() * 100;
	if (rd < 2) {
		palette_id = 0;
	} else if (rd < 5) {
		palette_id = 1;
	} else if (rd < 10) {
		palette_id = 2;
	} else if (rd < 25) {
		palette_id = 3;
	} else if (rd < 35) {
		palette_id = 3;
	} else {
		palette_id = 3;
	}

	rd = fxrand() * 69;
	if (rd < 11) {
		angle = 0;
	} else if (rd < 18) {
		angle = 45;
	} else if (rd < 34) {
		angle = 90;
	} else if (rd < 39) {
		angle = 135;
	} else if (rd < 48) {
		angle = 180;
	} else if (rd < 56) {
		angle = 225;
	} else if (rd < 66) {
		angle = 270;
	} else {
		angle = 315;
	}

	rd = fxrand() * 100;
	if (rd < 20) {
		nbuffers = 3;
	} else if (rd < 45) {
		nbuffers = 4;
	} else if (rd < 55) {
		nbuffers = 5;
	} else if (rd < 65) {
		nbuffers = 6.5;
	} else if (rd < 75) {
		nbuffers = 7;
	} else if (rd < 80) {
		nbuffers = 8;
	} else if (rd < 97) {
		nbuffers = 8.5;
	} else {
		nbuffers = 12;
	}



window.$fxhashFeatures = {
  Era: palette_id,
  Cogs: angle,
  Workers: nbuffers
}



function decode(str) {
	let alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
	var base = alphabet.length;
	var decoded = 0;
	while (str){
		var index = alphabet.indexOf(str[0]);
		var power = str.length - 1;
		decoded += index * (Math.pow(base, power));
		str = str.substring(1);
	}
	return decoded;
}

function setup() {
	createCanvas(1000, 1000);
	noLoop();
	colorMode(HSB);
	angleMode(DEGREES);
	rectMode(CENTER);

	seeds = [];
	while (token) {
		let part = token.substring(0, 7);
		let s1 = decode(part);
		token = token.substring(7);
		part = token.substring(0, 7);
		let s2 = decode(part);
		token = token.substring(7);

		seeds.push(s1+s2);
	}
}

function draw() {
	randomSeed(seeds[3]);

	palette = shuffle(palettes[palette_id]);
	offset = width / random(1, 2);

	let buffers = [];
	for (let i = 0; i < nbuffers; ++i) {
		let buffer = createGraphics(width, height);
		buffer.blendMode(LIGHTEST);

		buffer.colorMode(HSB);
		buffer.angleMode(DEGREES);
		buffer.rectMode(CENTER);

		buffer.translate(width / 2, height / 2);
		buffer.rotate(angle);
		buffer.translate(-width / 2, -width / 2);

		let y = -offset;
		let dy = random(random(height * 2));
		while (y < height + offset) {
			let x = -offset;
			let dx = dy;
			while (x < width + offset) {
				if (random() > 0.9) {
					x += dx;
					dx = random(random(width * 2));
					continue;
				}
				buffer.push();
				buffer.translate(x + dx / 2, y + random(dy) / random(0.5, 2));
				let diag = sqrt(dx*dx + dy*dy);
				let angle = random(1260);
				let gradient = random() > 0.005
				? buffer.drawingContext.createLinearGradient(
					diag * 0.5 * cos(angle),
					diag * 0.5 * sin(angle),
					diag * 0.5 * cos(random(180) + angle),
					diag * 0.5 * sin(180 + angle) )
				: buffer.drawingContext.createRadialGradient(
					diag * 0.25 * cos(angle),
					diag * 0.25 * sin(angle),
					0,
					0,
					0,
					max(dx, dy) );

				let colors = shuffle(palette);
				gradientStep(gradient, 0, color(colors[0]), random());
				gradientStep(gradient, 0.01, color(colors[1]), random());
				gradientStep(gradient, random(), color(0, 0, 100, 0));
				gradientStep(gradient, 1, color(colors[2]), random());
				buffer.drawingContext.fillStyle = gradient;

				buffer.noStroke();
				buffer.circle(dy, dx, random(200));
				buffer.rect(0, 0, dx, dy + random(dy % dx), max(dx + random(300), random(dy)));
				shapeB(buffer, dx, dy, random(500 % dy), dy);
				shapeC(buffer, dy, dx, 100 % dy);
				shapeA(buffer, 0, dx, 100 % dy);
				buffer.pop();

				x += dx;
				dx = random(random(width * 2));
			}
			y += dy;
			dy = random(random(height * 2));
		}
		buffers.push(buffer);
	}

	clear();
	blendMode(SOFT_LIGHT);
	background(30, 30, 95);
	background(color(palette[0]));
	blendMode(BURN);

	for (let i = 0; i < buffers.length; ++i) {
		image(buffers[i], 0, 0);
	}
}

function gradientStep(g, s, c, a = 0) {
	c.setAlpha(a);
	g.addColorStop(s, c);
}

function shapeA(buffer, x, y, s) {
	let c = color(random(palette));
	buffer.stroke(c);
	buffer.fill(c);
	buffer.strokeWeight(s * random(0.5));
	if (random() < 0.5) {
		buffer.line(x, y, x, y + random(width));
	}
	if (random() < 0.5) {
		buffer.line(x, y, x, y - random(width));
	}

	buffer.circle(x, y, s);

	if (random() < 0.5) {
		buffer.fill(c);
		buffer.noStroke();
		buffer.circle(x, y, s * 0.5);
	}
}

function shapeB(buffer, x, y, s, h) {
	let sep = random(200);
	let w = s / random(sep);
	for (let i = 0; i < sep; ++i) {
		buffer.rect(x + i * w, y, w * random(h%x), s, 0);
	}
}

function shapeC(buffer, x, y, s) {
	let c = color(random(palette));
	let num = int(random(4));
	for (let i = 0; i < num; ++i) {
		let d = map(i, 0, num, s, 0);
		buffer.fill(c);
		buffer.circle(x, y, d);
	}
}
