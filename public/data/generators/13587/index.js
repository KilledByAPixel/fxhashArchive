const vert = `#version 300 es
precision highp float;
in vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const frag = `#version 300 es
precision highp float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D blueNoise;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;
uniform int shapeType1;
uniform int shapeType2;
uniform int shapeType3;
uniform vec2 shapeOffset1;
uniform vec2 shapeOffset2;
uniform vec2 shapeOffset3;
uniform float shapeScale1;
uniform float shapeScale2;
uniform float shapeScale3;
uniform float shapeMod1;
uniform float shapeMod2;
uniform float shapeMod3;
uniform int shapeBlend1;
uniform int shapeBlend2;
uniform float noiseScale;
uniform int noiseBlend;
uniform float distortionScale;
uniform float distortionIntensity;
uniform float animationDirection;

#define PI 3.14159265359
#define TAU 6.28318530718

float random(vec2 st) {
	return texelFetch(blueNoise, ivec2(st), 0).r;
}

float smoothmod(float v, float m) {
	return m * (0.75 - abs(fract(v) - 0.5) - 0.25);
}

// perlin 
float smootherstep(float x) {
	return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float smoothlerp(float x, float a, float b) {
	return a + smootherstep(x) * (b - a);
}

float grid(vec2 st, vec2 cell) {
	// generate a random unit vector for the gradient
	float angle = random(cell) * TAU;

	// animate
	angle += time * TAU;
	vec2 gradient = vec2(cos(angle), sin(angle));

	// distance vector from point to cell
	vec2 dist = st - cell;

	// return the dot product of the two
	return dot(gradient, dist);
}

float perlin(vec2 st, float scale) {
	st *= ceil(scale); // round up to avoid artifacts

	// containing cell
	vec2 cell = floor(st);

	// dot products of distance and gradient vectors for st and each cell corner
	float tl = grid(st, cell);
	float tr = grid(st, vec2(cell.x + 1.0, cell.y));
	float bl = grid(st, vec2(cell.x, cell.y + 1.0));
	float br = grid(st, cell + 1.0);

	// interpolate the four dot products to get the value
	float upper = smoothlerp(st.x - cell.x, tl, tr);
	float lower = smoothlerp(st.x - cell.x, bl, br);
	float val = smoothlerp(st.y - cell.y, upper, lower);
	val = (val + 1.0) * 0.5;
	return val;
}
// end perlin

vec3 colorize(float v) {
    v = mod(v, 1.0);
    vec3 color = vec3(1.0);

	// unsmooth color pass
    if (v < 0.1) {
        color = color1;
    } else if (v < 0.3) {
        color = color2;
    } else if (v < 0.5) {
        color = color3;
    } else if (v < 0.7) {
        color = color4;
    } else if (v < 0.9) {
        color = color5;
    } else {
        color = color1;
    }

	// smoothing pass
	float s = fwidth(v) * 0.75;
	if (s > 0.1) { s = 0.1; }
	if (v <= s || v >= 1.0 - s) {
		color = color1;
    } else if (v >= 0.1 - s && v <= 0.1 + s) {
        color = mix(color1, color2, smoothstep(0.1 - s, 0.1 + s, v));
    } else if (v >= 0.3 - s && v <= 0.3 + s) {
        color = mix(color2, color3, smoothstep(0.3 - s, 0.3 + s, v));
    } else if (v >= 0.5 - s && v <= 0.5 + s) {
        color = mix(color3, color4, smoothstep(0.5 - s, 0.5 + s, v));
    } else if (v >= 0.7 - s && v <= 0.7 + s) {
        color = mix(color4, color5, smoothstep(0.7 - s, 0.7 + s, v));
    } else if (v >= 0.9 - s && v <= 0.9 + s) {
        color = mix(color5, color1, smoothstep(0.9 - s, 0.9 + s, v));
    } 

    return color; 
}

float polarShape(vec2 st, int sides) {
    float angle = atan(st.x, st.y) + PI;
    float radius = TAU / float(sides);
    return cos(floor(0.5 + angle / radius) * radius - angle) * length(st);
}

float shape(vec2 st, vec2 offset, int type, float scale) {
	st += offset;

	float d = 1.0;
	if (type == 0) {
		// circle
		d = length(st);
	} else if (type == 1) {
		// triangle
		d = polarShape(st, 3);
	} else if (type == 2) {
		// square
		d = polarShape(st, 4);
	} else if (type == 3) {
		// hexagon
		d = polarShape(st, 6);
	} else if (type == 4) {
		// octagon
		d = polarShape(st, 8);
	}

	return d * scale;
}

// smoothmin from https://iquilezles.org/articles/smin/ - MIT License
float smin(float a, float b, float k) {
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k*(1.0/4.0);
}

// blend shapes together
float blend(float a, float b, int mode) {
	float v = 0.0;

	if (mode == 0) {
		// min
		v = min(a, b) + 0.25;
	} else if (mode == 1) {
		// smoothmin
		v = smin(a, b, 0.125) + 0.2;
	} else if (mode == 2) {
		// max
		v = max(a, smoothmod(b, 2.0));
	}

	return v;
}

// blend noise with shapes
float blend2(float a, float b, int mode) {
	float v = 0.0;

	if (mode == 0) {
		// add
		v = a + b - 0.5;
	} else if (mode == 1) {
		// reflect
		v = reflect(a, 1.0 - 1.75 * smoothmod(b, 0.75));
	} else if (mode == 2) {
		// refract
		v = refract(a * 0.4, b, 0.5);
	} else if (mode == 3) {
		// min
		v = min(a, abs(b - 1.0) - 0.2);;
	} else if (mode == 4) {
		// subtract
		v = a - b + 0.5;
	} else if (mode == 5) {
		// max
		v = max(a + 0.1, b + 0.2);
	}

	return v;
}

out vec4 fragColor;

void main() {
    // adjust coordinates
    vec2 st = gl_FragCoord.xy / resolution;
	float aspectRatio = resolution.x / resolution.y;
    st.x *= aspectRatio;
	vec2 uv = st;
    vec2 shapeCoord = st - vec2(0.5 * aspectRatio, 0.5);

	// create domain distortion and main noise
	st.x += perlin(st, distortionScale) * distortionIntensity;
	float noise = perlin(st, noiseScale);

	// make shapes
	float shape1 = shape(shapeCoord, shapeOffset1, shapeType1, shapeScale1);
	float shape2 = shape(shapeCoord, shapeOffset2, shapeType2, shapeScale2);
	float shape3 = shape(shapeCoord, shapeOffset3, shapeType3, shapeScale3);

	// apply smooth modulo to shapes if shapeMod > 0 for that shape
	if (shapeMod1 > 0.0) shape1 = smoothmod(shape1, shapeMod1);
	if (shapeMod2 > 0.0) shape2 = smoothmod(shape2, shapeMod2);
	if (shapeMod3 > 0.0) shape3 = smoothmod(shape3, shapeMod3);

	// combine shapes
	float shapes = blend(shape1, shape2, shapeBlend1);
	shapes = blend(shapes, shape3, shapeBlend2);

	// combine shapes with noise
	float mixed = blend2(noise, shapes, noiseBlend);

	// add or subtract time to cycle colors
	if (animationDirection < 0.5) {
		mixed += time; 
	} else {
		mixed -= time;
	}

	// colorize
	vec3 color = colorize(mixed);

	// add frame
	float frame = 0.025;
	if (uv.x < frame || uv.x > aspectRatio - frame || uv.y < frame || uv.y > 1.0 - frame) {
		color = color5;
	} 

	// add grain
	float grain = texture(blueNoise, uv * 20.0).r;
	color = mix(color, vec3(grain), 0.1);

    fragColor = vec4(color, 1.0);
}
`

// PRNG
S=Uint32Array.from([9,7,n=t=5,3]);
R=(a=1)=>a*(t=S[3],S[3]=S[2],S[2]=S[1],S[1]=n=S[0],t^=t<<11,S[0]^=(t^t>>>8)^(n>>>19),S[0]/2**32);
[...fxhash+'txpiter'].map(c=>R(S[3]^=c.charCodeAt()*23130));

const palettes = {
	'Acorn': [[0.14,0.13,0.16],[0.18,0.16,0.17],[0.67,0.3,0.2],[0.94,0.56,0.22],[0.95,0.92,0.76]],
    'Atlantic': [[0.03,0.04,0.05],[0.19,0.19,0.18],[0.32,0.36,0.4],[0.55,0.57,0.57],[0.87,0.82,0.7]],
	'Autumn': [[0.37,0.1,0.02],[0.62,0.24,0.1],[0.79,0.38,0.13],[0.91,0.67,0.44],[0.95,0.85,0.67]], 
    'Blues': [[0.18,0.22,0.07],[0.25,0.38,0.34],[0.16,0.51,0.43],[0.44,0.63,0.49],[0.94,0.84,0.51]],
    'Brick': [[0.3,0.2,0.17],[0.52,0.25,0.24],[0.66,0.51,0.4],[0.83,0.79,0.67],[0.95,0.95,0.85]],
    'Cargo': [[0.04,0.15,0.2],[0.15,0.25,0.25],[0.45,0.4,0.27],[0.76,0.71,0.48],[0.86,0.92,0.71]],
    'Charcoal': [[0.08,0.09,0.12],[0.15,0.16,0.19],[0.26,0.27,0.28],[0.55,0.56,0.57],[0.8,0.8,0.83]],
    'Chocomint': [[0.14,0.05,0.05],[0.33,0.24,0.17],[0.48,0.36,0.24],[0.60,0.67,0.54],[0.87,0.9,0.74]], 
    'Classic': [[0.28,0.2,0.12],[0.41,0.37,0.31],[0.59,0.56,0.48],[0.75,0.73,0.63],[0.93,0.93,0.81]],
    'Cyanical': [[0.11,0.27,0.13],[0.15,0.37,0.28],[0.24,0.43,0.37],[0.50,0.68,0.61],[0.82,0.82,0.72]], 
	'Deep': [[0.07,0.06,0.04],[0.15,0.15,0.16],[0,0.27,0.33],[0.17,0.56,0.52],[0.92,0.75,0.5]],
    'Faded': [[0.05,0.11,0.15],[0.22,0.24,0.25],[0.30,0.37,0.41],[0.53,0.59,0.58],[0.99,0.89,0.77]],
    'Flannel': [[0.17,0.11,0.16],[0.41,0.07,0.15],[0.44,0.35,0.32],[0.29,0.55,0.48],[0.86,0.69,0.47]],
	'Forest': [[0.01, 0.08, 0.2], [0.01, 0.21, 0.29], [0.01, 0.4, 0.39], [0.8, 0.7, 0.5], [0.9, 0.87, 0.8]],
	'Grayscale': [[0.11,0.11,0.14],[0.23,0.23,0.25],[0.38,0.39,0.41],[0.59,0.59,0.61],[0.79,0.79,0.82]],
	'Halloween': [[0.04,0.04,0.09],[0.28,0.24,0.28],[0.93,0.4,0.06],[0.96,0.65,0.06],[0.75,0.76,0.71]], 
    'Horizon': [[0.02,0.09,0.11],[0.11,0.17,0.19],[0.09,0.29,0.31],[0.29,0.58,0.51],[0.65,0.84,0.65]], 
    'Lucky': [[0.25,0.18,0.09],[0.2,0.33,0.22],[0.38,0.60,0.38],[0.8,0.8,0.4],[0.91,0.98,0.73]],
    'Mint': [[0.25,0.19,0.12],[0.3,0.35,0.31],[0.40,0.53,0.46],[0.6,0.71,0.6],[0.92,0.9,0.79]],
	'Moss': [[0.15,0.19,0.22],[0.21,0.27,0.32],[0.45,0.47,0.16],[0.67,0.62,0.35],[0.83,0.77,0.69]],
    'Olive': [[0.2,0.18,0.09],[0.31,0.33,0.1],[0.45,0.48,0.22],[0.62,0.64,0.42],[0.80,0.83,0.68]],
    'Outdoors': [[0.02,0.2,0.21],[0.12,0.32,0.27],[0.73,0.52,0.09],[0.83,0.73,0.37],[0.9,0.89,0.55]],
    'Polo': [[0.11,0.16,0.2],[0.64,0.19,0.05],[0.8,0.34,0.1],[0.38,0.75,0.73],[0.74,0.91,0.8]],
    'Scuba': [[0.1,0.2,0.16],[0.13,0.31,0.27],[0.06,0.5,0.47],[0.29,0.67,0.67],[0.57,0.91,0.88]],
    'Seafoam': [[0.04,0.1,0.14],[0.18,0.26,0.24],[0.42,0.59,0.46],[0.65,0.77,0.6],[0.88,0.93,0.7]],
    'Sepia': [[0.1,0.04,0.03],[0.35,0.22,0.09],[0.57,0.37,0.15],[0.7,0.57,0.36],[0.83,0.77,0.63]],
    'Shoreline': [[0.14,0.14,0.15],[0.11,0.2,0.25],[0.33,0.47,0.44],[0.61,0.68,0.63],[1,0.96,0.86]],
	'Sky': [[0.18,0.11,0.17],[0.2,0.2,0.37],[0.22,0.37,0.61],[0.4,0.6,0.77],[0.82,0.84,0.89]],
    'Slate': [[0.13,0.17,0.22],[0.2,0.26,0.31],[0.30,0.37,0.42],[0.48,0.56,0.61],[0.89,0.86,0.78]],
    'Spicy': [[0.1,0.12,0.16],[0.58,0.11,0.08],[0.67,0.32,0.23],[0.62,0.61,0.59],[0.87,0.8,0.8]],
    'Stoic': [[0.04,0.17,0.19],[0.36,0.21,0.18],[0.5,0.43,0.3],[0.7,0.63,0.5],[0.89,0.81,0.69]],
    'Stone': [[0.13,0.15,0.2],[0.23,0.25,0.25],[0.39,0.41,0.4],[0.63,0.6,0.53],[0.75,0.74,0.73]],
    'Stripes': [[0.13,0.13,0.14],[0.1,0.2,0.26],[0.73,0.18,0.15],[0.7,0.58,0.42],[1,0.91,0.68]],
	'Superhero': [[0,0.1,0.05],[0.09,0.24,0.26],[0.71,0.17,0],[0.83,0.4,0],[0.86,0.67,0.18]], 
    'Taupe': [[0.15,0.20,0.17],[0.25,0.28,0.22],[0.37,0.42,0.32],[0.6,0.66,0.47],[0.71,0.83,0.66]],
    'Tomato': [[0.2,0.05,0.05],[0.48,0.17,0.11],[0.65,0.36,0.27],[0.72,0.61,0.5],[0.81,0.8,0.69]],
	'Wacko': [[0.26,0.07,0],[0.53,0.17,0.1],[0.82,0.31,0.18],[0.92,0.64,0.27],[0.9,0.83,0.68]],
}


// get random palette
let paletteName = Object.keys(palettes)[R(Object.keys(palettes).length)|0]
let palette = palettes[paletteName]

let offsets = [
	// middle row
	[[-0.25, 0], [0, 0], [0.25, 0]],
	// middle column
	[[0, -0.25], [0, 0], [0, 0.25]],
	// diagonal right
	[[-0.25, -0.25], [0, 0], [0.25, 0.25]],
	// diagonal left
	[[0.25, -0.25], [0, 0], [-0.25, 0.25]],
	// top left, bottom center, top right
	[[0.25, -0.25], [0, 0.25], [-0.25, -0.25]],
	// bottom left, top center, bottom right
	[[0.25, 0.25], [0, -0.25], [-0.25, 0.25]],
]

let offsetIndex = R(offsets.length) | 0
let offset = offsets[offsetIndex]
let mods = [0, 0, 0, 0, 0, 2, 3, 4, 5, 6]

// randomize uniforms
const uniforms = {
    palette: paletteName,
	color1: palette[0],
	color2: palette[1],
	color3: palette[2],
	color4: palette[3],
	color5: palette[4],
	shapeType1: R(5) | 0,
	shapeType2: R(5) | 0, 
	shapeType3: R(5) | 0, 
	shapeOffset1: offset[0], 
	shapeOffset2: offset[1],
	shapeOffset3: offset[2],
	shapeScale1: R(6) + 3,
	shapeScale2: R(6) + 3,
	shapeScale3: R(6) + 3,
	shapeMod1: mods[R(mods.length)|0],
	shapeMod2: mods[R(mods.length)|0],
	shapeMod3: mods[R(mods.length)|0],
	shapeBlend1: R(2) | 0,
	shapeBlend2: R(3) | 0,
	noiseScale: (R(5) | 0) + 7,
	noiseBlend: R() > 0.75 ? 5 : R(6) | 0,
	distortionScale: (R(10) | 0) + 30,
	distortionIntensity: R(0.45) + 0.75,
	animationDirection: R(),
}

// keep it interesting, but not TOO interesting
let modSum = uniforms.shapeMod1 + uniforms.shapeMod2 + uniforms.shapeMod3
if (modSum < 6) {
	uniforms.shapeMod2 = 6
} else if (modSum >= 10) {
	uniforms.shapeMod3 = 0
}

// features
let shapes = ['Circle', 'Triangle', 'Square', 'Hexagon', 'Octagon']
let blendModes = ['Add', 'Reflect', 'Refract', 'Union', 'Subtract', 'Intersect']
let offsetNames = ['Row', 'Column', 'Right Diagonal', 'Left Diagonal', 'V', 'Inverted V']
window.$fxhashFeatures = {
	'Shape 1': shapes[uniforms.shapeType1],
	'Palette': paletteName,
	'Shape 2': shapes[uniforms.shapeType2],
	'Shape Offsets': offsetNames[offsetIndex],
	'Shape 3': shapes[uniforms.shapeType3],
	'Mix': blendModes[uniforms.noiseBlend],
}

// project settings
let settings = {
	title: 'Divergent Convergence',
	framerate: 20,
	totalframes: 120
}

// set canvas dimensions
if (window.innerWidth / window.innerHeight < 0.75) {
	settings.width = window.innerWidth
	settings.height = Math.round(window.innerWidth * 1.33333)
} else {
	settings.height = window.innerHeight
	settings.width = Math.round(window.innerHeight * 0.75)
}

let devicePixelRatio = window.devicePixelRatio || 1
settings.actualWidth = settings.width * devicePixelRatio
settings.actualHeight = settings.height * devicePixelRatio

// webgl boilerplate
const canvas = document.querySelector('canvas')
canvas.width = settings.actualWidth
canvas.height = settings.actualHeight
canvas.style.width = `${settings.width}px`
canvas.style.height = `${settings.height}px`

const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true })

const vertShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertShader, vert)
gl.compileShader(vertShader)

const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragShader, frag)
gl.compileShader(fragShader)

const program = gl.createProgram()
gl.attachShader(program, vertShader)
gl.attachShader(program, fragShader)
gl.linkProgram(program)

const vertices = new Float32Array([1, 1, 1, -1, -1, 1, -1, 1, 1, -1, -1, -1])

const vertexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

program.aPosition = gl.getAttribLocation(program, 'aPosition')
gl.enableVertexAttribArray(program.aPosition)
gl.vertexAttribPointer(program.aPosition, 2, gl.FLOAT, false, 0, 0)

gl.useProgram(program)
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

let texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))


// blue noise texture from http://momentsingraphics.de/BlueNoise.html - CC0 License
var image = new Image()
image.src = 'bluenoise.png'
image.addEventListener('load', function() {
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
	gl.generateMipmap(gl.TEXTURE_2D)
	draw()
})

// draw loop and associated variables
let frames = 0
let lastDrawTime = 0
let time = 0
let currentTime = 0
let deltaTime = 0
const interval = 1000 / settings.framerate
let paused = false
let firstDraw = true

function draw() {
	currentTime = performance.now()
	deltaTime = currentTime - lastDrawTime

	if (deltaTime >= interval - 5) {
		if (paused) { 
			requestAnimationFrame(draw)
			return 
		}

		time = frames / settings.totalframes
		if (time >= 100000000) { frames = 0 }
		frames += 1
		lastDrawTime = currentTime

		// update the shader uniforms
		gl.uniform2fv(gl.getUniformLocation(program, 'resolution'), [settings.actualWidth, settings.actualHeight])
		gl.uniform1f(gl.getUniformLocation(program, 'time'), time)
		gl.uniform3fv(gl.getUniformLocation(program, 'color1'), uniforms.color1)
		gl.uniform3fv(gl.getUniformLocation(program, 'color2'), uniforms.color2)
		gl.uniform3fv(gl.getUniformLocation(program, 'color3'), uniforms.color3)
		gl.uniform3fv(gl.getUniformLocation(program, 'color4'), uniforms.color4)
		gl.uniform3fv(gl.getUniformLocation(program, 'color5'), uniforms.color5)
		gl.uniform1i(gl.getUniformLocation(program, 'shapeType1'), uniforms.shapeType1)
		gl.uniform1i(gl.getUniformLocation(program, 'shapeType2'), uniforms.shapeType2)
		gl.uniform1i(gl.getUniformLocation(program, 'shapeType3'), uniforms.shapeType3)
		gl.uniform2fv(gl.getUniformLocation(program, 'shapeOffset1'), uniforms.shapeOffset1)
		gl.uniform2fv(gl.getUniformLocation(program, 'shapeOffset2'), uniforms.shapeOffset2)
		gl.uniform2fv(gl.getUniformLocation(program, 'shapeOffset3'), uniforms.shapeOffset3)
		gl.uniform1f(gl.getUniformLocation(program, 'shapeScale1'), uniforms.shapeScale1)
		gl.uniform1f(gl.getUniformLocation(program, 'shapeScale2'), uniforms.shapeScale2)
		gl.uniform1f(gl.getUniformLocation(program, 'shapeScale3'), uniforms.shapeScale3)
		gl.uniform1f(gl.getUniformLocation(program, 'shapeMod1'), uniforms.shapeMod1)
		gl.uniform1f(gl.getUniformLocation(program, 'shapeMod2'), uniforms.shapeMod2)
		gl.uniform1f(gl.getUniformLocation(program, 'shapeMod3'), uniforms.shapeMod3)
		gl.uniform1i(gl.getUniformLocation(program, 'shapeBlend1'), uniforms.shapeBlend1)
		gl.uniform1i(gl.getUniformLocation(program, 'shapeBlend2'), uniforms.shapeBlend2)
		gl.uniform1f(gl.getUniformLocation(program, 'noiseScale'), uniforms.noiseScale)
		gl.uniform1i(gl.getUniformLocation(program, 'noiseBlend'), uniforms.noiseBlend)
		gl.uniform1f(gl.getUniformLocation(program, 'distortionScale'), uniforms.distortionScale)
		gl.uniform1f(gl.getUniformLocation(program, 'distortionIntensity'), uniforms.distortionIntensity)
		gl.uniform1f(gl.getUniformLocation(program, 'animationDirection'), uniforms.animationDirection)

		gl.drawArrays(gl.TRIANGLES, 0, 6)
	}

	requestAnimationFrame(draw)

	if (firstDraw) {
		paused = true
		firstDraw = false
	}
}

// save canvas as PNG
function savePNG() {
	let a = document.createElement('a')
	a.href = canvas.toDataURL('image/png')
	a.setAttribute('download', `${settings.title.replace(' ', '-')}`)
	a.click()
}

// scale canvas to 3000x4000 and save as PNG
function saveFile() {
	const width = 3000
	const height = 4000
	let prevWidth = settings.actualWidth
	let prevHeight = settings.actualHeight
	let prevPaused = paused

	// scale canvas and redraw
	settings.actualWidth = width
	settings.actualHeight = height
	canvas.width = width
	canvas.height = height
	paused = true
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.uniform2fv(gl.getUniformLocation(program, 'resolution'), [settings.actualWidth, settings.actualHeight])
	gl.drawArrays(gl.TRIANGLES, 0, 6)

	// save image
	savePNG()
	
	// return to normal canvas size and redraw
	settings.actualWidth = prevWidth
	settings.actualHeight = prevHeight
	canvas.width = settings.actualWidth
	canvas.height = settings.actualHeight
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.uniform2fv(gl.getUniformLocation(program, 'resolution'), [settings.actualWidth, settings.actualHeight])
	gl.drawArrays(gl.TRIANGLES, 0, 6)
	paused = prevPaused
}

function togglePause() {
	paused = !paused
}

// reset animation to first frame and pause
function reset() {
	frames = 0
	lastDrawTime = 0
	time = 0
	currentTime = 0
	deltaTime = 0
	paused = false
	draw()
	paused = true
}

// handle keyboard input
function handleKeypress(e) {
	switch (e.code) {
		case 'KeyR':
			reset()
			break
		case 'KeyS':
			saveFile()
			break
		case 'Space':
			togglePause()
			break
	}
	e.preventDefault()
}

document.addEventListener('keydown', handleKeypress)
document.addEventListener('click', togglePause)
