const colors = [
	["ffc0cb", "FF3764", "ff6347", "141432", "000025"],
	["fff", "123", "50f", "f30", "3b6"],
	["fff", "5730F9", "203", "FF1C4C"],
	["fff", "FF0", "012", "2AF"],
	["fff", "F70", "FA3", "002"],
	["fff", "123", "002", "FED", "ff6347"],
	["fff", "111", "000"],
].map((d) => d.map((e) => "#" + e));

const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t,
	xmlns = "http://www.w3.org/2000/svg",
	frame = document.getElementById("returns"),
	mime = {
		type: "image/svg+xml",
	},
	r = fxrand,
	pick = (d) => d[Math.floor(r() * d.length)];

function shuffle(array) {
	var m = array.length,
		t,
		i;
	while (m) {
		i = Math.floor(r() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}

class Stack {
	constructor() {
		this.svg = document.createElementNS(xmlns, "svg");
		frame.appendChild(this.svg);

		const desc = document.createElementNS(xmlns, "desc");
		desc.textContent = document.title;
		this.svg.appendChild(desc);
		this.svg.setAttribute("xmlns", xmlns);
		this.svg.setAttributeNS(
			null,
			"preserveAspectRatio",
			"xMidYMid meet"
		);
		this.svg.style.background = "#EEE";
		this.render();
		setInterval(() => this.render(), 5 * 60 * 1000);
		setTimeout(() => this.change(), 1000);
	}

	change() {
		shuffle(this.items);
		const e = Math.floor(r() * (this.items.length - 1) + 1);
		const num = r() > 0.9 ? e : 1;
		for (let i = 0; i < num; i++) {
			const block = this.items[i];
			const duration = Math.floor(r() * 2000) + "ms";
			block.path.style.setProperty("--d", duration);
			block.paint();
		}
		const slow = Math.floor((r() * 20 + 1) * 1000);
		const delay = r() > 0.1 ? slow : r();
		setTimeout(() => this.change(), delay);
	}

	render() {
		this.colors = pick(colors);
		this.color = Math.floor(r() * this.colors.length);
		this.maxLevel = Math.floor(r() * 10 + 1);
		this.items = [];
		if (this.g) this.svg.removeChild(this.g);
		this.g = this.svg.appendChild(
			document.createElementNS(xmlns, "g")
		);
		const f = frame.getClientRects()[0];
		const [w, h] = [f.width, f.height];

		new Block(this, 0, 0, 0, w, h);
		const p = Math.min(w, h) * 0.05;
		const view = [-p, -p, w + p * 2, h + p * 2];
		const viewStr = view.map(Math.round).join(" ");
		this.svg.setAttribute("viewBox", viewStr);
		this.items.map((item) => item.render());
		this.log();
	}

	log() {
		const noshow = !grid.classList.contains("show");
		const hasChildren = grid.children.length > 0;
		if (hasChildren && noshow) {
			grid.classList.add("show");
		}

		const gridLimit = 500;
		if (grid.children.length > gridLimit) {
			grid.removeChild(grid.firstChild);
		}

		const el = this.svg.cloneNode(true);
		grid.append(el);

		const title = document.createElementNS(xmlns, "title");
		title.textContent = document.title;
		el.insertBefore(title, el.children[0]);
	}

	over(event) {
		event.preventDefault();
		if (event.target.nodeName === "polygon") {
			const t = this.items.filter(
				(f) => f.path == event.target
			)[0];
			if (t) {
				t.repaint();
				const e = Math.floor(r() * 2) + "ms";
				t.path.style.setProperty("--d", e);
			}
		}
	}
}

class Block {
	constructor(stack, level, x, y, w, h) {
		const t = this;
		t.level = level + 1;
		[t.stack, t.x, t.y, t.w, t.h] = [stack, x, y, w, h];
		t.center = [t.x + t.w * 0.5, t.y + t.h * 0.5];
		const maxLevel = Math.floor(r() * stack.maxLevel + 2);
		t.level < maxLevel ? t.split() : t.stack.items.push(t);
	}

	subd(a, b) {
		let res = Math.round(r() * 10 + 2);
		let f = new Array(res)
			.fill()
			.map(r)
			.sort();
		return [f[0], f[f.length - 1]].map((d) => [
			lerp(a[0], b[0], d),
			lerp(a[1], b[1], d),
		]);
	}

	mid(c) {
		const arr = c.length;
		const tmp = [];
		const k = 0.005;
		for (let i = 0; i < arr; i++) {
			const [a, b] = [c[i], c[(i + 1) % c.length]];
			tmp.push(
				[lerp(a[0], b[0], k), lerp(a[1], b[1], k)],
				[
					lerp(a[0], b[0], 1 - k),
					lerp(a[1], b[1], 1 - k),
				]
			);
		}
		return tmp;
	}

	build() {
		const [x, y, w, h] = [this.x, this.y, this.w, this.h],
			a = [
				[x, y],
				[x + w, y],
				[x + w, y + h],
				[x, y + h],
			],
			b = [
				[0, 1],
				[1, 2],
				[2, 3],
				[3, 0],
			],
			c = b
				.map((d) => this.subd(a[d[0]], a[d[1]]))
				.reduce((a, b) => a.concat(b));
		return this.mid(c).map(
			(d) => d[0].toFixed(2) + " " + d[1].toFixed(2)
		);
	}

	split() {
		const [x, y, w, h, rr] = [this.x, this.y, this.w, this.h, r()],
			hey = [
				[x, y, w * rr, h],
				[x + w * rr, y, w - w * rr, h],
			],
			hoo = [
				[x, y, w, h * rr],
				[x, y + h * rr, w, h - h * rr],
			];
		(w < h ? hoo : hey).map(
			(e) => new Block(this.stack, this.level, ...e)
		);
	}

	paint() {
		const c = this.stack.colors,
			defaultColor = this.stack.color,
			randomColor = Math.floor(r() * c.length);
		this.color = r() > 0.5 ? defaultColor : randomColor;
		this.path.setAttribute("fill", c[this.color]);
	}

	repaint() {
		const wrap = this.stack.colors.length;
		this.color = (this.color + 1) % wrap;
		const fill = this.stack.colors[this.color];
		this.path.setAttribute("fill", fill);
	}

	render() {
		this.path = document.createElementNS(xmlns, "polygon");
		this.path.setAttribute("points", this.build());
		this.stack.g.appendChild(this.path);
		this.paint();
		//this.path.style.setProperty('--delay', Math.floor(r() * 300) + "ms");
	}
}

const stack = new Stack();

function imgLoaded() {
	const time = Math.round(new Date().getTime() / 1000);
	const name = `${document.title}-${time}.jpg`;

	const canvas = document.createElement("canvas");
	canvas.width = Math.floor(window.innerWidth * 3);
	canvas.height = Math.floor(window.innerHeight * 3);

	const ctx = canvas.getContext("2d");
	ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

	canvas.toBlob(function(blob) {
		const filesArray = [
			new File([blob], name, {
				type: "image/jpeg",
				lastModified: new Date().getTime(),
			}),
		];
		if (
			navigator.canShare &&
			navigator.canShare({
				files: filesArray,
			})
		) {
			navigator
				.share({
					files: filesArray,
					url: window.location.href,
					title: document.title,
				})
				.then(() => console.log("Share worked"))
				.catch((er) =>
					console.log("Sharing failed", er)
				);
		}
	});
}

const share = (_) => {
	const str = new XMLSerializer().serializeToString(stack.svg);
	const DOMURL = self.URL || self.webkitURL || self;
	const svg = new Blob([str], mime);
	const url = DOMURL.createObjectURL(svg);
	const img = new Image();
	img.onload = imgLoaded;
	img.src = url;
};

if (navigator.share) {
	const btn = document.createElement("button");
	btn.id = "share";
	btn.classList.add("share");
	btn.textContent = "share";
	document.body.insertBefore(btn, grid);
	btn.addEventListener("click", share);
}

const click = (event) => {
	if (["fs", "share"].includes(event.target.id)) {
		return;
	} else if (event.target.closest("#grid")) {
		const svg = event.target.closest("svg");
		svg ? save(svg) : stack.render();
	} else {
		stack.render();
	}
};

document.body.addEventListener("click", click);
frame.addEventListener("pointerover", (e) => stack.over(e));

const download = (blob) => {
	const link = document.createElement("a"),
		time = Math.round(new Date().getTime() / 1000);
	link.download = `${document.title}-${time}.svg`;
	link.href = URL.createObjectURL(blob);
	link.click();
	URL.revokeObjectURL(link.href);
};

const save = (svg) => {
	const str = new XMLSerializer().serializeToString(svg);
	download(new Blob([str], mime));
};

const fullscreen = (event) => {
	const d = document.documentElement;
	if (d.requestFullscreen) {
		d.requestFullscreen();
	} else if (d.webkitRequestFullScreen) {
		d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
};

fs.addEventListener("click", fullscreen);
const hideBtn = (_) => fs.classList.add("hide");
setTimeout(hideBtn, 20 * 1000);

document.addEventListener("fullscreenchange", (event) => {
	setTimeout(() => {
		stack.render();
	}, 200);
});

const keyHandler = (event) => {
	if (event.key === "f") {
		fullscreen();
	} else if (event.key === "s") {
		save(stack.svg);
	}
};

document.addEventListener("keypress", keyHandler);
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("sw.js");
}

// https://github.com/mdn/dom-examples/blob/master/screen-wake-lock-api/script.js
if ("wakeLock" in navigator) {
	let wakeLock = null;
	const requestWakeLock = async () => {
		try {
			wakeLock = await navigator.wakeLock.request("screen");
			wakeLock.onrelease = function(ev) {
				//console.log(ev);
			};
			wakeLock.addEventListener("release", () => {
				//console.log("released")
			});
		} catch (err) {
			console.log(`${err.name}, ${err.message}`);
		}
	}; 
	requestWakeLock();

  const handleVisibilityChange = () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange);
}
