const { floor, ceil } = Math;
const dom = {
        data: [],
        r: fxrand,
        root: document.getElementById("container"),
};

dom.pick = (d) => d[floor(dom.r() * d.length)];

// txpiter https://twitter.com/piterpasma/status/1591727290802741248
let piter = 0;
dom.pk = (...w) => (
        (piter = 0),
        w.map((x) => (x[0] = piter += x[0])),
        (piter = dom.r() * piter),
        w.filter((x) => piter < x[0])[0].slice(1)
);

dom.p = (w) => dom.pk(...w)[0];

dom.generate = (res) => {
        return Array(res)
                .fill(0)
                .map((d, i) => {
                        const align = dom.r() > 0.5;
                        const justify = dom.r() > 0.5;
                        const span = dom.p([
                                [50, 1],
                                [7, 2],
                                [2, 3],
                                [1, 5],
                        ]);
                        const margin = dom.p([
                                [37, 1],
                                [7, 0],
                                [5, 2],
                                [1, 100],
                                [1, 500],
                        ]);
                        const rmargin = dom.p([
                                [1, 10],
                                [2, 3],
                                [10, 1],
                                [20, 1],
                                [10, 0],
                        ]);
                        const subres = dom.p([
                                [4, 7],
                                [10, 1],
                                [37, 3],
                                [2, 37],
                                [1, 50],
                        ]);
                        const items = Array(subres)
                                .fill(0)
                                .map((d, zz) => {
                                        const width = dom.p([
                                                [5, 1],
                                                [1, 2],
                                                [7, 10],
                                                [7, 50],
                                                [2, 80],
                                                [37, 100],
                                        ]);

                                        const height = dom.p([
                                                [500, "line"],
                                                [100, "stroke"],
                                                [100, "em"],
                                                [37, "gold"],
                                                [17, "buren"],
                                                [10, "viewportgr"],
                                                [7, "viewport"],
                                                [1, "milian"],
                                                [1, "leander"],
                                        ]);

                                        const margin = dom.p([
                                                [37 * 3, 1],
                                                [7, 2],
                                                [37, 5],
                                                [5, 37],
                                                [1, 70],
                                        ]);
                                        return {
                                                width,
                                                height,
                                                margin,
                                        };
                                });

                        const clone = dom.p([
                                [20, 1],
                                [20, 2],
                                [5, 3],
                                [7, 4],
                                [1, 5],
                                [3, 37],
                                [1, 37 * 2],
                                [1, 37 * 3],
                                [1, 37 * 7],
                        ]);
                        const t = Array(clone)
                                .fill(0)
                                .map((n, zz) => {
                                        const obj = {
                                                align,
                                                justify,
                                                pad: zz,
                                                margin,
                                                rmargin,
                                                items: items.map((o) =>
                                                        Object.assign({}, o)
                                                ),
                                                span,
                                        };

                                        return obj;
                                });

                        if (dom.r() > 0.7) {
                                const m = ceil(dom.r() * 4);
                                t.filter((d, i) => i % m).map(
                                        (f) => (f.align = !f.align)
                                );
                        }
                        if (dom.r() > 0.5) {
                                dom.pick(dom.pick(t).items).width = ceil(
                                        dom.r() * 100
                                );
                        }
                        return t;
                });
};

dom.intersect = (entries, observer) => {
        entries.forEach((entry) => {
                if (entry.intersectionRatio > 0) {
                        dom.observer.unobserve(entry.target);
                        entry.target.remove();
                        dom.data = dom.data.concat(dom.create());
                }
        });
};
dom.observer = new IntersectionObserver(dom.intersect, { rootMargin: "500px" });

dom.create = (_) => {
        dom.frag = new DocumentFragment();
        const g = document.createElement("div");
        const columnFractions = [
                [37, 1 / 1.618],
                [27, 1],
                [10, 1.618],
                [15, 7],
                [1, 37],
        ];
        const gridCols = dom.p([
                [7, 3],
                [37, 5],
                [10, 7],
                [1, 10],
                [1, 17],
        ]);
        const templateColumns = Array(gridCols)
                .fill()
                .map((v) => dom.p(columnFractions) + "fr");
        g.style.gridTemplateColumns = templateColumns.join(" ");
        dom.frag.appendChild(g);
        dom.data = dom.generate(144);
        dom.data.map((dd, i) => {
                dd.map((d, m) => {
                        const e = document.createElement("div");
                        if (d.align) {
                                e.style.alignItems = "end";
                        }
                        if (d.justify) {
                                e.style.justifyContent = "end";
                        }
                        d.items.map((dd, ii) => {
                                const k = document.createElement("div");
                                e.append(k);
                                k.style.setProperty("--w", dd.width + "%");
                                k.classList.add(dd.height);
                                k.style.marginBottom = dd.margin + "px";
                                dd.div = k;
                        });
                        e.style.margin = `${d.align ? "auto" : 0} ${
                                d.rmargin
                        }px ${d.margin}px 0`;
                        if (d.span > 1) {
                                e.style.gridColumnEnd = "span " + d.span;
                        }
                        d.div = e;
                        g.append(e);
                });
        });

        dom.overlay = document.createElement("div");
        dom.overlay.classList.add("overlay");
        dom.overlay.style.setProperty("--mk", ceil(dom.r() * 37));
        dom.overlay.style.setProperty("--rows", ceil(dom.r() * 37) + "vh");
        dom.overlay.style.gridTemplateColumns = templateColumns.join(" ");
        g.appendChild(dom.overlay);
        Array(ceil(dom.r() * 20))
                .fill(0)
                .map((t) => dom.overlay.append(document.createElement("div")));
        dom.sensor = document.createElement("div");
        dom.sensor.classList.add("sensor");
        dom.frag.append(dom.sensor);
        dom.root.append(dom.frag);
        dom.observer.observe(dom.sensor);
        return dom.data;
};

dom.data = dom.create();

window.scrollTo(0, 0);

if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
        dom.fullscreen = (event) => {
                const d = document.documentElement;
                if (d.requestFullscreen) {
                        document.fullscreenElement
                                ? document.exitFullscreen()
                                : d.requestFullscreen();
                }
        };
        dom.addButton = (_) => {
                dom.button = document.createElement("div");
                dom.button.id = "fullscreen";
                document.body.append(dom.button);
                dom.button.addEventListener("click", dom.fullscreen);
        };
        setTimeout(dom.addButton, 1000);
}

const click = (e) => {};
dom.root.addEventListener("click", click);

dom.anims = [];
dom.pauseTransport = (e) => {
        const event = document.createEvent("Event");
        event.initEvent("pauseTransport", true, true);
        document.body.dispatchEvent(event);
        document.body.classList.add("hold");
        dom.anims = dom.root
                .getAnimations({ subtree: true })
                .filter((d) => d.playState === "running");
        dom.anims.map((a) => a.pause());
};

dom.startTransport = (e) => {
        const event = document.createEvent("Event");
        event.initEvent("startTransport", true, true);
        document.body.dispatchEvent(event);
        document.body.classList.remove("hold");
        dom.anims.map((a) => a.play());
};

dom.visibilityChange = async () => {
        document.visibilityState === "visible"
                ? dom.startTransport()
                : dom.pauseTransport();
};
document.addEventListener("visibilitychange", dom.visibilityChange);

dom.clear = (d) => {
        requestAnimationFrame(() => {
                const p = d.parentNode;
                (p.parentNode.children.length < 3
                        ? p.parentNode
                        : p.children.length === 1
                        ? p
                        : d
                ).remove();
        });
};

dom.cut = (f) => {
        f.items.map((d, i) => {
                setTimeout(() => {
                        ["line", "stroke"].includes(d.height)
                                ? dom.clear(d.div)
                                : d.div.classList.add("bye");
                }, i * 100);
        });
};

const aend = (e) => dom.clear(e.target);
dom.root.addEventListener("animationend", aend);

dom.destroy = (e) => dom.data.splice(0, 7).map((d) => d.map(dom.cut));
document.addEventListener("snare", dom.destroy);
document.addEventListener("klick", dom.destroy);
dom.sign = (_) => dom.root.classList.toggle("dark");
document.addEventListener("sign", dom.sign);
dom.e144 = (e) => dom.root.classList.toggle("dir");
document.addEventListener("event144", dom.e144);
dom.newPart = (e) => dom.root.classList.toggle("rot");
document.addEventListener("newPart", dom.newPart);

dom.reloadHash = (_) => {
        const url = new URL(document.location);
        url.searchParams.append("fxhash", fxhash);
        document.location.search = url.searchParams;
};
dom.keyHandler = (event) => {
        if (event.ctrlKey && event.key === "r") {
                dom.reloadHash();
        }
};

dom.active = false;
dom.cursorDelay = 7000;
dom.hideCursor = (_) => {
        dom.active = false;
        document.body.classList.remove("active");
};

dom.cursorTimer = setTimeout(dom.hideCursor, dom.cursorDelay);

dom.move = (e) => {
        if (!dom.active) {
                dom.active = true;
                document.body.classList.add("active");
        }
        if (dom.cursorTimer) {
                clearInterval(dom.cursorTimer);
                dom.cursorTimer = setTimeout(dom.hideCursor, dom.cursorDelay);
        }
};

document.body.addEventListener("pointermove", dom.move);
document.addEventListener("keypress", dom.keyHandler);

if ("wakeLock" in navigator) {
        let wakeLock = null;
        const acquireWakeLock = async () => {
                if ("wakeLock" in navigator) {
                        try {
                                wakeLock = await navigator.wakeLock.request(
                                        "screen"
                                );
                        } catch (err) {
                                console.log(err);
                        }
                }
        };
        acquireWakeLock();
        document.addEventListener("visibilitychange", async () => {
                if (
                        wakeLock !== null &&
                        document.visibilityState === "visible"
                ) {
                        acquireWakeLock();
                }
        });
}
