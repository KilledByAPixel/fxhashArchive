/*

Richard Nadler
https://twitter.com/RichardNadler1 
tz1Pu8zRmNghAHzWxsT9Cy2qXHxkCrHcB3vc

Leander Herzog
https://twitter.com/lennyjpg
tz1i7fDupvRU8AWoQgPtqJvKivXnyvuvTLYN




https://www.youtube.com/watch?v=yF6EluMNR14
https://en.wikipedia.org/wiki/Gerhard_Richter
https://en.wikipedia.org/wiki/Clyfford_Still

The discard keyword is only allowed within fragment shaders. It can be used within a fragment shader to abandon the operation on the current fragment. This keyword causes the fragment to be discarded and no updates to any buffers will occur. 

https://registry.khronos.org/OpenGL/specs/gl/GLSLangSpec.1.50.pdf


*/

const r = fxrand;

let run = true,
        frame = 0,
        offset = r() * 1234567;

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

const colors = [
        ["#ffc0cb", "#FF3764", "#ff6347", "#141432", "#000025"],
        ["#123", "#50f", "#f30", "#3b6"],
        ["#5730F9", "#203", "#FF1C4C"],
        ["#FF0", "#012", "#2AF"],
        ["#F70", "#FA3", "#002"],
        ["#123", "#002", "#FED", "#ff6347"],
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
const exp = (e) => "#" + e.split("").filter(flt).map(mlt).join("");
const hex = colors.map((d) => d.map((e) => (e.length === 4 ? exp(e) : e)));
const cols = hex.map((t) => t.map((l) => hexToRgb(l)));

const vertexShader = `#version 300 es
  in vec2 position;
  void main() {
	  gl_Position = vec4(position, 0, 1);
  }`;

const fragShader = `#version 300 es
precision highp float;
uniform vec2 res;
uniform vec3 color;
uniform float grau, frame, dir, angle, time, speed, zoom, blur, wrap;
uniform sampler2D t1, t2, t3;
out vec4 material;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

  void main() {
      float t = time * 0.0001 * (speed + 0.1);
      vec2 uv = gl_FragCoord.xy / res;
      uv *= -0.5;
      float rr = rand(uv * .77);
      vec2 s = uv * 0.5;
      s.y += t * (dir - 0.5);
      vec3 wow = texture(t3, uv * zoom).xyz;
      s.y += wow.r * .1;
      float bf = blur * .2;
      s.y += rr * bf * (uv.y + (sin(t) + 1.0) * .5);
     //s.y += rr * bf * (uv.x + (cos(t) + 1.0) * .5);
      vec3 map = texture(t2,s).xyz;
      float a = angle * 37.7;
      vec2 dir = vec2(sin(a), cos(a));
      float speed = t * 0.5;
      s.y += (map.r * map.g) * 0.2 + speed * dir.x;
      s.x += (map.b * map.g) * 0.3 + speed * dir.y;
      vec3 q = texture(t1 , s).xyz;
        if(frame < 3.0){
                 q = vec3(rr);
        }else if(q.r > map.r || q.b > map.b || q.g > map.g){
                 discard;
        }
        if(t > 0.01){
                q = q + color;
                if(wrap > 0.2){
                  q = fract(q);
                }
        }
      if(grau > 0.97){
          q = (vec3(q.r + q.g + q.b) / 3.0) * 1.5 - .2;
      }
      material = vec4(q * 1.1 , 1.0);
}
`;

const createShader = (str, type) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, str);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(s));
                return false;
        }
        return s;
};

const createProgram = (vstr, fstr) => {
        const p = gl.createProgram();
        gl.attachShader(p, createShader(vstr, gl.VERTEX_SHADER));
        gl.attachShader(p, createShader(fstr, gl.FRAGMENT_SHADER));
        gl.linkProgram(p);
        return p;
};

const linkProgram = (p) => {
        gl.attachShader(p, createShader(p.vshaderSource, gl.VERTEX_SHADER));
        gl.attachShader(p, createShader(p.fshaderSource, gl.FRAGMENT_SHADER));
        gl.linkProgram(p);
};

const options = {
        preserveDrawingBuffer: true,
        alpha: false,
};

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const gl = canvas.getContext("webgl2", options);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
const q = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
gl.bufferData(gl.ARRAY_BUFFER, q, gl.STATIC_DRAW);

const p = createProgram(vertexShader, fragShader);

p.pos = gl.getAttribLocation(p, "position");
p.res = gl.getUniformLocation(p, "res");
p.time = gl.getUniformLocation(p, "time");
p.zoom = gl.getUniformLocation(p, "zoom");
p.speed = gl.getUniformLocation(p, "speed");
p.angle = gl.getUniformLocation(p, "angle");
p.color = gl.getUniformLocation(p, "color");
p.blur = gl.getUniformLocation(p, "blur");
p.wrap = gl.getUniformLocation(p, "wrap");
p.dir = gl.getUniformLocation(p, "dir");
p.frame = gl.getUniformLocation(p, "frame");
p.grau = gl.getUniformLocation(p, "grau");

gl.enableVertexAttribArray(p.pos);
gl.vertexAttribPointer(p.pos, 2, gl.FLOAT, false, 0, 0);
gl.useProgram(p);
gl.uniform1f(p.wrap, r());
const zf = (r() * 0.3 + 0.01).toFixed(2);
gl.uniform1f(p.zoom, zf);

gl.uniform1f(p.dir, r());
gl.uniform1f(p.blur, r());
gl.uniform1f(p.grau, r());

const s = 2;

const tick = (time) => {
        frame++;

        speed.current += (speed.target - speed.current) / s;
        gl.uniform1f(p.speed, speed.current);

        angle.current += (angle.target - angle.current) / s;
        gl.uniform1f(p.angle, angle.current);

        gl.uniform1f(p.time, time + offset);
        gl.uniform1f(p.frame, frame);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (run) {
                requestAnimationFrame(tick);
        }
};

const urlParams = new URLSearchParams(window.location.search);
const urlDpr = urlParams.has("dpr");
const dpr = urlDpr ? urlParams.get("dpr") : window.devicePixelRatio;
const last = { width: 0, height: 0 };
let w, h, rect;

const isDifferent = (a, b) => a.width != b.width || a.height != b.height;
const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
                rect = entry.contentRect;
                if (isDifferent(last, rect)) {
                        last.width = rect.width;
                        last.height = rect.height;
                        w = Math.floor(rect.width * dpr);
                        h = Math.floor(rect.height * dpr);
                        canvas.width = w;
                        canvas.height = h;
                        gl.viewport(0, 0, w, h);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                        gl.uniform2f(
                                p.res,
                                canvas.clientWidth,
                                canvas.clientHeight
                        );
                }
        }
});

const jumpFreq = Math.floor(r() * 700 + 100);

const loadImage = (d, i) => {
        gl.uniform1i(gl.getUniformLocation(p, `t${i + 1}`), i);
        const srcType = gl.UNSIGNED_BYTE;
        const img = new Image();
        img.onload = function () {
                gl.activeTexture(gl["TEXTURE" + i]);
                gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
                gl.texParameteri(
                        gl.TEXTURE_2D,
                        gl.TEXTURE_MAG_FILTER,
                        gl.LINEAR
                );
                gl.texParameteri(
                        gl.TEXTURE_2D,
                        gl.TEXTURE_MIN_FILTER,
                        gl.LINEAR
                );
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, srcType, this);
                if (i === images.length - 1) {
                        resizeObserver.observe(document.documentElement);
                        //console.log("ready " + performance.now());
                        trigger();
                        setTimeout(jump, r() * jumpFreq * 1000);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                        tick(0);
                }
        };
        img.src = d;
};

const files = new Array(12).fill().map((d, i) => `image${i + 1}.jpeg`);
const images = shuffle(files).slice(0, 3);
images.map(loadImage);

let speed = { current: 0, target: 0 };
let angle = { current: 0, target: 0 };

const trigger = (event) => {
        speed.target = r();
        angle.target += (r() - 0.5) * 0.3;
        const extraTheme = shuffle(cols)[0];
        const extra = shuffle(extraTheme)[0];
        gl.uniform3f(p.color, ...extra);
        gl.clearColor(...extra, 1.0);
};

canvas.addEventListener("click", trigger);

const jump = (_) => {
        trigger();
        setTimeout(jump, r() * jumpFreq * 1000);
};

const fullscreen = (event) => {
        const d = document.documentElement;
        if (d.requestFullscreen) {
                d.requestFullscreen();
        } else if (d.webkitRequestFullScreen) {
                d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
};

document.body.addEventListener("dblclick", fullscreen);

const download = (blob) => {
        const link = document.createElement("a");
        const time = Math.round(new Date().getTime() / 1000);
        link.download = `${document.title}-${time}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
};

const keyHandler = (event) => {
        if (event.key === " ") {
                run = !run;
                if (run) {
                        tick();
                }
        } else if (event.key === "s") {
                canvas.toBlob(download);
        } else if (event.key === "f") {
                fullscreen();
        }
};

document.addEventListener("keypress", keyHandler);
