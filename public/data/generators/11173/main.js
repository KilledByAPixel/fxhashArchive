// https://unicode-table.com/en/blocks/block-elements/

window.scrollTo(0, 0);
const sensor = document.getElementById("sensor");
const pick = (array) => array[Math.floor(r() * array.length)];
const e = ["▒", "░", "█", "▀"];
const pr = [
        "Ok",
        "Yo",
        "fxhash 1.0",
        "saturday",
        "16.April",
        "agglo",
        "leander herzog",
];

const r = fxrand;
const main = document.querySelector("main");

const pre = () => {
        let last = "";
        let str = "",
                s = "";
        const max = 10 * 1000;
        const p = r() > 0.9 ? 0.9 : r() > 0.95 ? 0.999 : 0.99;
        while (str.length < max) {
                if (r() > p) {
                        let res = r() > 0.9 ? r() * 27 + 1 : r() * 8 + 1;
                        if (r() > 0.7) {
                                res = 1;
                        }
                        if (r() > 0.999) {
                                res = 200;
                        }
                        //const res = Math.floor(Math.random() * 10 + 1);
                        last = s;
                        if (r() < 0.8) {
                                s = new Array(Math.floor(res))
                                        .fill(0)
                                        .map((d) => pick(e))
                                        .join("");
                        } else {
                                s = new Array(Math.floor(res))
                                        .fill(pick(e))
                                        .join("");
                        }
                }
                str += s;

                if (r() > 0.999) {
                        str += pick(e);
                }
                if (r() > 0.999) {
                        str += last;
                }
                /*
                if(r() > 0.98){
                     str += "▀" + pick(pr).toUpperCase() + "▀";
                }
                */
        }
        return str;
};

const go = (_) => {
        if (main.children.length > 200) {
                while (main.children.length > 3) {
                        main.removeChild(main.firstChild);
                }
        }
        const el = document.createElement("span");
        el.textContent = pre();
        main.insertBefore(el, sensor);
};
go();

const config = {
        rootMargin: "0px 0px 500px 0px",
};
const cb = (e) => e.forEach((entry) => go());
const observer = new IntersectionObserver(cb, config);
observer.observe(sensor);

if (isFxpreview === false) {
        const fullscreen = (event) => {
                const d = document.documentElement;
                if (d.requestFullscreen) {
                        d.requestFullscreen();
                } else if (d.webkitRequestFullScreen) {
                        d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
        };
        document.body.addEventListener("dblclick", fullscreen);

        window.onbeforeunload = function () {
                window.scrollTo(0, 0);
        };

        const slide = (event) => {
                window.scrollBy({
                        top: (r() * 3 + 0.1) * window.innerHeight,
                        left: 0,
                        behavior: "smooth",
                });
        };

        document.body.addEventListener("click", slide);

        const wait = 20 * 1000;
        let timer = null;

        const check = (_) => {
                slide();
                const t = r() > 0.8 ? r() * 1000 : r() * 10000;
                timer = setTimeout(check, Math.floor(t + 100));
        };

        const move = (event) => {
                clearInterval(timer);
                timer = setTimeout(check, wait);
        };

        timer = setTimeout(check, wait);

        window.addEventListener("pointermove", move);
        window.addEventListener("click", move);

        if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("sw.js");
        }
}
