const colors = [
        ["#ffc0cb", "#FF3764", "#ff6347", "#141432", "#000025"],
        ["#fff", "#123", "#50f", "#f30", "#3b6"],
        ["#fff", "#5730F9", "#203", "#FF1C4C"],
        ["#fff", "#FF0", "#012", "#2AF"],
        ["#fff", "#F70", "#FA3", "#002"],
        ["#fff", "#123", "#002", "#FED", "#ff6347"],
        ["#fff", "#022", "#3FA", "#ff4040", "#44d7a8"],
];

const random = fxrand;
const r = (from = 0, to = 1) => from + random() * (to - from);
const pick = (d) => d[Math.floor(r() * d.length)];
const ns = "http://www.w3.org/2000/svg";
let svg = null;

const main = document.querySelector("main");
const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;
const lrp = (a, b, s) => [lerp(a[0], b[0], s), lerp(a[1], b[1], s)];
const line = (a) => `M ${a[0][0]} ${a[0][1]} L ` + a.map((d) => d.join(" "));

const frames = [];
const size = {};

class Frame {
        constructor(colors, x, y, w, h) {
                this.colors = colors;
                this.stack = [];
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                //this.m = 0.05 * r() + 0.01;
                //this.m = 0.1 * r() + 0.002;
                const flex = r() > 0.1 ? 0.05 : 0.15;
                this.m = flex * r() + 0.002;
                new Box(this, 0, x, y, w, h);
                return this;
        }

        render() {
                this.g = document.createElementNS(ns, "g");
                svg.appendChild(this.g);

                const t = this;
                t.color = pick(this.colors);
                this.el = document.createElementNS(ns, "path");
                this.el.setAttribute("fill", t.color);
                this.el.setAttribute(
                        "d",
                        `M ${t.x} ${t.y} L ${t.x + t.w} ${t.y}, ${t.x + t.w} ${
                                t.y + t.h
                        }, ${t.x} ${t.y + t.h}`
                );
                this.g.appendChild(this.el);
                this.stack.map((d) => d.render());
        }

        change() {
                const res = Math.floor(r(1, 37));
                for (let i = 0; i < res; i++) {
                        pick(this.stack).change();
                }
        }
}

const m = 0.01;

class Box {
        constructor(frame, level, x, y, w, h) {
                const t = this;
                t.frame = frame;
                t.level = level + 1;
                t.x = x;
                t.y = y;
                t.w = w;
                t.h = h;
                t.m = frame.m;
                //if (t.level < 5) {
                //      t.m = r() * 0.3;
                //}
                t.color = pick(t.frame.colors);
                const max = r(1, 14);
                if (level < max && w > m && h > m) {
                        t.split(t);
                } else {
                        t.frame.stack.push(this);
                }
        }

        split(t) {
                let s = r(0, 2) > 1 ? r(1 - this.m, 1) : r(0, this.m);
                /*
                if (r(0, 1) > 0.9) {
                        s = r(0.9, 0.99);
                }
*/
                if (r(0, 2) > 1) {
                        const k = t.w * s;
                        new Box(t.frame, t.level, t.x, t.y, k, t.h);
                        new Box(t.frame, t.level, t.x + k, t.y, t.w - k, t.h);
                } else {
                        const k = t.h * s;
                        new Box(t.frame, t.level, t.x, t.y, t.w, k);
                        new Box(t.frame, t.level, t.x, t.y + k, t.w, t.h - k);
                }
        }

        change() {
                this.color = pick(this.frame.colors);
                const dur = r() * (r() > 0.9 ? 10 : 1000) * 1000;
                //const dur = r() * (r() > 0.9 ? 10 : 100) * 100;
                const timing = {
                        fill: "forwards",
                        easing: "ease",
                        duration: dur,
                        delay: 0,
                };
                this.el.animate({ fill: this.color }, timing);
                //.onfinish = (e) => this.el.remove();
        }

        render() {
                const t = this;
                this.el = document.createElementNS(ns, "path");
                this.el.setAttribute("fill", t.color);
                //const op = (r() > 0.3 ? 1 : r()).toFixed(3);
                //this.el.setAttribute("fill-opacity", op);
                const [x, y, w, h] = [this.x, this.y, this.w, this.h];
                const k = Math.min(Math.min(w, h) * 0.1, 1);
                const foo = (_) => k;
                const aa = k;
                const bb = k;
                const cc = k;
                const dd = k;
                const v = [
                        [x, y + aa],
                        [x + aa, y],
                        [x + w - bb, y],
                        [x + w, y + bb],
                        [x + w, y + h - cc],
                        [x + w - cc, y + h],
                        [x + dd, y + h],
                        [x, y + h - dd],
                ];
                const tmp = v.map((d) => d.map((e) => e.toFixed(4)));
                const first = tmp.shift().join(" ");
                const str = `M ${first} L ${tmp.join(" ")} Z`;
                this.el.setAttribute("d", str);
                t.frame.g.appendChild(this.el);
        }
}

const change = (_) => {
        frames.map((d) => d.change());
};

const atiming = {
        fill: "forwards",
        easing: "ease",
        duration: 700,
        delay: 0,
};

let timer = null;
const draw = (_) => {
        if (timer != null) {
                window.clearTimeout(timer);
        }
        const old = svg;
        if (old) {
                const amove = [{ marginTop: "-100vh" }];
                old.animate(amove, atiming).onfinish = (e) => old.remove();
        }
        svg = document.createElementNS(ns, "svg");
        svg.setAttribute("xmlns", ns);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.setAttribute("viewBox", `0 0 ${size.w} ${size.h}`);
        svg.style.background = "black";

        const ca = colors[0];
        const cb = colors[1];

        frames.length = 0;
        const a = r(0.1, 0.9);
        const b = 1 - a;
        if (size.w > size.h) {
                //if (r()>0.5) {
                frames[0] = new Frame(ca, 0, 0, size.w * a, size.h);
                frames[1] = new Frame(cb, size.w * a, 0, size.w * b, size.h);
        } else {
                frames[0] = new Frame(ca, 0, 0, size.w, size.h * a);
                frames[1] = new Frame(cb, 0, size.h * a, size.w, size.h * b);
        }

        frames.map((d) => d.render());
        //svg.style.transform = 'scale('+r()+')';
        //svg.style.transform = 'scale(0.8)';
        main.appendChild(svg);
        svg.addEventListener("click", draw, { once: true });
        const next = Math.floor(r() * 1000 + 10);
        timer = setTimeout(draw, next * 1000);
};

setInterval(change, 1000);

const ro = new ResizeObserver((entries) => {
        while (main.lastChild) {
                main.removeChild(main.lastChild);
        }
        for (let entry of entries) {
                const cr = entry.contentRect;
                size.w = Math.floor(cr.width);
                size.h = Math.floor(cr.height);
                draw();
        }
});

ro.observe(document.body);

const fullscreen = (event) => {
        const d = document.documentElement;
        if (d.requestFullscreen) {
                d.requestFullscreen();
        } else if (d.webkitRequestFullScreen) {
                d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
};

document.body.addEventListener("dblclick", fullscreen);

const download = (blob, ext) => {
        const time = new Date().toISOString().replaceAll(":", "-");
        const link = document.createElement("a");
        link.download = `${document.title}-${time}.${ext}`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
};

const save = (_) => {
        const mime = { type: "image/svg+xml" };
        const xml = new XMLSerializer();
        const str = xml.serializeToString(svg);
        download(new Blob([str], mime), "svg");
};

const keyHandler = (e) => {
        if (e.key === "s") {
                save();
        }
};

document.addEventListener("keypress", keyHandler);
