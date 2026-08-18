const fs = `#version 300 es
precision highp float;
uniform vec3 color;
out vec4 outColor;
void main(void) { 
	outColor = vec4(color, 1); 
}`,
	vs = `#version 300 es
in vec3 position;
uniform float time;
vec2 pos;
void main(void) {
  pos = vec2(position.x,position.y);
  pos.x *= 1.0 + position.z * time * 0.37;
  gl_Position = vec4(pos.x, pos.y, 0, 1);
}`;

const colors = [
	["#ffc0cb", "#FF3764", "#ff6347", "#141432", "#000025"],
	["#fff", "#123", "#50f", "#f30", "#3b6"],
	["#fff", "#5730F9", "#203", "#FF1C4C"],
	["#fff", "#FF0", "#012", "#2AF"],
	["#fff", "#F70", "#FA3", "#002"],
	["#fff", "#123", "#002", "#FED", "#ff6347"],
	["#fff", "#111", "#000"],
];

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? [
				parseInt(result[1], 16) / 255,
				parseInt(result[2], 16) / 255,
				parseInt(result[3], 16) / 255,
		  ]
		: null;
}

const flt = (k, i) => i > 0;
const mlt = (f) => f + "" + f;
const exp = (e) =>
	"#" +
	e
		.split("")
		.filter(flt)
		.map(mlt)
		.join("");
const hex = colors.map((d) => d.map((e) => (e.length === 4 ? exp(e) : e)));
const cols = hex.map((t) => t.map((l) => hexToRgb(l)));
const r = fxrand;
const create = (str, type) => {
		let shader = gl.createShader(type);
		gl.shaderSource(shader, str);
		gl.compileShader(shader);
		return shader;
	},
	createProgram = (vs, fs) => {
		let p = gl.createProgram();
		gl.attachShader(p, create(vs, gl.VERTEX_SHADER));
		gl.attachShader(p, create(fs, gl.FRAGMENT_SHADER));
		gl.linkProgram(p);
		if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
			throw "Program link failed with: " +
				gl.getProgramInfoLog(p);
		}
		return p;
	},
	linkProgram = (p) => {
		gl.attachShader(p, create(p.vshaderSource, gl.VERTEX_SHADER));
		gl.attachShader(p, create(p.fshaderSource, gl.FRAGMENT_SHADER));
		gl.linkProgram(p);
	};

const res = 50000;
const vertices = new Float32Array(res * 2);

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const glOptions = {
	preserveDrawingBuffer: true,
	antialias: false,
	alpha: false,
};

const gl = canvas.getContext("webgl2", glOptions),
	p = createProgram(vs, fs),
	position = gl.getAttribLocation(p, "position"),
	time = gl.getUniformLocation(p, "time"),
	color = gl.getUniformLocation(p, "color");

const ac = new AudioContext();
const gainNode = ac.createGain();

/*
const filter = ac.createBiquadFilter();
filter.type = "lowshelf";
filter.type = "allpass";
filter.frequency.value = 500;
filter.gain.value = 1;
*/
//filter.connect(cp);

gainNode.connect(ac.destination);

const buffer = ac.createBuffer(2, vertices.length, ac.sampleRate),
	left = buffer.getChannelData(0),
	right = buffer.getChannelData(1);

let n = null;

const updateBuffer = (_) => {
	if (n != null) {
		n.stop();
		n.disconnect();
	}
	n = ac.createBufferSource();
	//n.playbackRate.value = 0.00137;
	n.playbackRate.value = r() * 0.007;
	n.loop = true;
	n.buffer = buffer;
	n.connect(gainNode);
	n.start();

	gainNode.gain.setValueAtTime(0.0, ac.currentTime);
	gainNode.gain.linearRampToValueAtTime(1.0, ac.currentTime + 3);
};

const trigger = () => {
	flop();
	let x = r() - 0.5,
		y = r() - 0.5,
		z = 0.1,
		angle = Math.PI * 0.5 + 0.0008,
		radius = r(),
		s = 0.9;
	if (r() < 0.5) angle += Math.PI * 0.5;
	for (let i = 0; i < res; i++) {
		if (r() < 0.00005) angle += Math.PI * 0.25;
		if (r() < 0.0001) radius = 0.001 + r() * 0.3;
		if (i % 2 == 0 && r() < 0.001) z = r() - 0.5;
		x += Math.sin(angle) * radius;
		y += Math.cos(angle) * radius;
		if (i % 2 === 0) {
			if (x > s) {
				x = -s;
			} else if (x < -s) {
				x = s;
			}
			if (y > s) {
				y = -s;
			} else if (y < -s) {
				y = s;
			}
		}

		left[i * 2] = x * 1000;
		left[i * 2 + 1] = y * 1000;

		right[i * 2] = radius * angle - 1;
		right[i * 2 + 1] = radius * angle;

		vertices[i * 3] = x;
		vertices[i * 3 + 1] = y;
		vertices[i * 3 + 2] = z;
	}

	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

	if (ac.state === "suspended") {
		ac.resume().then(() => {
			//console.log("ac resumed");
			updateBuffer();
		});
	} else if (ac.state === "running") {
		updateBuffer();
	}
};

let frame = 0;
const render = (delta) => {
	if (frame % 2000 === 0 || frame < 3) {
		gl.clear(gl.COLOR_BUFFER_BIT);
	}
	frame++;
	const t = (Math.sin(delta * 0.0003) + 1) * 0.5;
	let range = Math.round((res * t) / 3) * 2 - 10;
	if (range < 10) range = 10;
	gl.uniform1f(time, t);
	gl.drawArrays(gl.LINES, 0, range);
};

const draw = (delta) => {
	if (frame < 5) {
		trigger();
	}
	//if (r() < 0.0037) trigger();
	if (r() < 0.00137) trigger();
	render(delta);
	requestAnimationFrame(draw);
};

gl.useProgram(p);

let flopSwitch = false;
let front, back;

const flop = (_) => {
	if ((flopSwitch = !flopSwitch)) {
		front = [0, 0, 0];
		back = [1, 1, 1];
	} else {
		front = [1, 1, 1];
		back = [0, 0, 0];
	}

	const theme = cols[Math.floor(r() * cols.length)];
	const index = Math.floor(r() * theme.length);
	front = theme[index];
	back = theme[(index + 1) % theme.length];

	gl.clearColor(...front, 1);
	gl.uniform3f(color, ...back);
};

gl.enableVertexAttribArray(position);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

const dpr = window.devicePixelRatio;

let w, h, rect;
const resizeObserver = new ResizeObserver((entries) => {
	for (let entry of entries) {
		rect = entry.contentRect;
		if (w != rect.width || h != rect.height) {
			//console.log("Size changed");
			(w = Math.floor(rect.width * dpr)),
				(h = Math.floor(rect.height * dpr));
			canvas.width = w;
			canvas.height = h;
			gl.viewport(0, 0, w, h);
		}
	}
});

resizeObserver.observe(document.documentElement);
canvas.addEventListener("click", trigger);

trigger();
draw();

const fullscreen = (event) => {
	const d = canvas;
	if (d.requestFullscreen) {
		d.requestFullscreen();
	} else if (d.webkitRequestFullScreen) {
		d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
};

const fsb = document.getElementById("fs");
fsb.addEventListener("click", fullscreen);
const hideBtn = (_) => fsb.classList.add("hide");
setTimeout(hideBtn, 20 * 1000);

document.addEventListener("fullscreenchange", (event) => {
	setTimeout(() => {
		trigger();
		frame = 0;
	}, 200);
});

const download = (blob) => {
	const link = document.createElement("a");
	const time = Math.round(new Date().getTime() / 1000);
	link.download = `${document.title}-${time}.png`;
	link.href = URL.createObjectURL(blob);
	link.click();
	URL.revokeObjectURL(link.href);
};

const save = (_) => {
	canvas.toBlob((blob) => download(blob));
	const image = canvas.toDataURL("image/png");
	location.href = image;
};

const keyHandler = (event) => {
	if (event.target === document.body) {
		if (event.key === "s") {
			save();
		}
	}
};

document.addEventListener("keypress", keyHandler);
