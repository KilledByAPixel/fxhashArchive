let vert = /*glsl*/`
#ifdef GL_ES
precision highp float;
precision highp int;
#endif

attribute vec3 aPosition;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

let dpslcmnt = /*glsl*/`
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_canvasSize;
uniform float u_time;
uniform float u_rndPos;
uniform float pixelDensity;
uniform float u_rnd;
uniform float u_speed;
uniform float u_wet;
uniform float u_noise2Rnd;
uniform float u_noise2Scale;
uniform float u_tanrnd;
uniform float u_anglrbool;
uniform float u_anglrzrnd;
uniform float u_tanDir;
uniform float u_generalDir;
uniform float u_rasterVis;

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 perm(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; 
    vec3 x3 = x0 - D.yyy;     

    i = mod289(i); 
    vec4 p = perm( perm( perm( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 )
           );

    float n_ = 0.142857142857; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float angularize(float value, float modAmount) {
  return mod(floor(value * modAmount), modAmount) / modAmount;
}

float fbm(vec3 p) {
    float sum = 0.0;
    float amplitude = 1.0;

    for (int i = 0; i < 4; i++)
    {
        sum += amplitude * snoise(p);
        p *= 2.;
        amplitude *= 0.5;
    }
    return sum;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_canvasSize.xy / pixelDensity;
  st.y = 1.0 - st.y;
  vec2 uv = gl_FragCoord.xy / u_canvasSize.xy / pixelDensity;
  uv.y = 1.0 - uv.y;

  float textureAspect = u_canvasSize.x / u_canvasSize.y;
  uv.x *= textureAspect;

  vec3 noiseX1 = vec3(fbm(vec3(uv + vec2(5.0,0.0), u_time * 0.1) * 30.)) * 1.2; // Normal Scale
  vec3 noiseY1 = vec3(fbm(vec3(uv + vec2(0.0,5.0), u_time * 0.1) * 30.)) * 1.2;

  vec3 noiseX2 = vec3(snoise(vec3(uv + vec2(50.0,0.0), u_time * 0.9) * u_noise2Scale)) * u_noise2Rnd; // Big Scale
  vec3 noiseY2 = vec3(snoise(vec3(uv + vec2(0.0,50.0), u_time * 0.9) * u_noise2Scale)) * u_noise2Rnd;

  vec3 noiseX3 = vec3(snoise(vec3(uv + vec2(20.0,10.0), u_time * 0.1))) * 15.0; // Mega Scale
  vec3 noiseY3 = vec3(snoise(vec3(uv + vec2(10.0,20.0), u_time * 0.1))) * 15.0;

  vec3 noiseX4 = vec3(fbm(vec3(uv + vec2(30.,40.0), u_time * 0.1) * 200.0)) * 1.2; // Small Scale
  vec3 noiseY4 = vec3(fbm(vec3(uv + vec2(40.0,30.), u_time * 0.1) * 200.0)) * 1.2;

  float msk = snoise(vec3(uv * 0.1, u_time * 0.2));
  msk = (msk + 1.0) / 2.0;
  
  vec3 noiseX5 = vec3(snoise(vec3(uv + vec2(100.0,0.0), u_time * 0.2) * 500.0)) * 0.5 * msk; 
  vec3 noiseY5 = vec3(snoise(vec3(uv + vec2(0.0,100.0), u_time * 0.2) * 500.0)) * 0.5 * msk;
  
  vec3 noiseX6 = vec3(snoise(vec3(uv + vec2(150.0,0.0), u_time * 0.3) * 300.0)) * 0.3 * msk;
  vec3 noiseY6 = vec3(snoise(vec3(uv + vec2(0.0,150.0), u_time * 0.3) * 300.0)) * 0.3 * msk;

  vec3 mixedNoiseX = mix(mix(mix(noiseX1, noiseX2, 0.5), mix(noiseX3, noiseX4, 0.3), 0.5), mix(noiseX5, noiseX6, 0.7), 0.3);
  vec3 mixedNoiseY = mix(mix(mix(noiseY1, noiseY2, 0.5), mix(noiseY3, noiseY4, 0.3), 0.5), mix(noiseY5, noiseY6, 0.7), 0.3);

  if (u_anglrbool < 0.4) {
    mixedNoiseX.x = angularize(mixedNoiseX.x, u_anglrzrnd);
    mixedNoiseY.y = angularize(mixedNoiseY.y, u_anglrzrnd);
  }

  vec4 color = texture2D(u_image, st);

  float warpAmount = snoise(vec3(u_time, 0.0, 0.0));
  vec2 warp = vec2(sin(uv.y * warpAmount), cos(uv.x * warpAmount));

  vec2 cell = floor(st * u_rasterVis);
  int cellX = int(cell.x);
  int cellY = int(cell.y);
  int cellShift = int(mod(float(cellX + cellY + int(floor(u_time))), 3.0));

  vec2 displacedST = st + warp + vec2(mixedNoiseX.x - tan(u_tanDir * u_time * u_speed / u_tanrnd), mixedNoiseY.y + (u_generalDir * u_time * u_speed)) * u_wet + vec2(cellShift, cellShift) * 0.1;

  vec4 displacedColor = texture2D(u_image, fract(displacedST * sin(u_time * 1.5)));
  if (displacedColor.a < 0.9) discard;
  
  gl_FragColor = displacedColor;
}
`;

let paperSoft = /*glsl*/`
precision mediump float;

uniform float u_time;
uniform vec2 u_canvasSize;
uniform float pixelDensity;

vec3 permute(vec3 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

float noise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366015403784439,
                      -0.576350169189626,
                      0.024590243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

const int OCTAVES = 10;
float turbulence(vec2 v){
    float turb = 0.0;
    float freq = 90.0, amp = 1.;

    for(int i = 0; i < OCTAVES; i++){
        turb += abs(noise(v*freq))*amp;
        freq *= 0.50;
        amp *= 0.6;
    }
    return turb;
}

float random(vec2 st) {
    vec2 i = floor(st);
    vec3 g = vec3(0.1031, 0.11369, 0.13787);
    vec2 offset = vec2(dot(g.xy, i), dot(g.yz, i));
    return fract(sin(offset.x + offset.y) * 43758.5453);
}

float stipple(vec2 st) {
    vec2 grid = floor(st);
    vec2 fract_st = fract(st);
    vec2 center = fract_st - 0.5;
    float d = length(center);
    float threshold = random(grid);
    return step(threshold, 1.1 - d);
}


void main() {
  vec2 st = gl_FragCoord.xy / u_canvasSize.xy / pixelDensity;
  st.y = 1.0 - st.y;
  vec2 uv = gl_FragCoord.xy / u_canvasSize.xy / pixelDensity;
  uv.y = 1.0 - uv.y;

  float textureAspect = u_canvasSize.x / u_canvasSize.y;
  uv.x *= textureAspect;

  float t = turbulence(uv * 13.0);
  float t2 = turbulence(uv * 15.0);

  const int numInstances = 5;

  float scalingFactors[numInstances];
  scalingFactors[0] = 50.0;
  scalingFactors[1] = 30.0;
  scalingFactors[2] = 70.0;
  scalingFactors[3] = 100.0;
  scalingFactors[4] = 60.0;

  for (int i = 0; i < numInstances; i++) {
    float dots = stipple(st * scalingFactors[i]);
    t += dots * 0.1;
  }

  t *= t2 * 0.8; //less mult is more!

  float greyscale = (t + 1.0) / 2.0;
  vec3 color = vec3(greyscale);
  vec3 finalColor = color;

  gl_FragColor = vec4(finalColor, 1.);
}
`;

let borderShd = /*glsl*/`
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_canvasSize;
uniform float u_time;
uniform float pixelDensity;
uniform float u_rndPos;

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 perm(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float snoise(vec3 v){ 
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; 
    vec3 x3 = x0 - D.yyy;     

    i = mod289(i); 
    vec4 p = perm(perm(perm( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0)) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0)
           );

    float n_ = 0.142857142857; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);    

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 st = gl_FragCoord.xy / u_canvasSize.xy / pixelDensity;
  st.y = 1.0 - st.y;
  vec2 uv = gl_FragCoord.xy / u_canvasSize.xy / pixelDensity;
  uv.y = 1.0 - uv.y;

  float textureAspect = u_canvasSize.x / u_canvasSize.y;
  uv.x *= textureAspect;
  
  // First octave
  float noiseX1 = snoise(vec3(uv * 1000. + vec2(5.0, 0.0), u_time * 0.1 + u_rndPos)) * 0.005;
  float noiseY1 = snoise(vec3(uv * 1000. + vec2(0.0, 5.0), u_time * 0.1 + u_rndPos)) * 0.005;

  // Second octave
  float noiseX2 = snoise(vec3(uv * 50. + vec2(5.0, 0.0), u_time * 0.2 + u_rndPos)) * 0.005;
  float noiseY2 = snoise(vec3(uv * 50. + vec2(0.0, 5.0), u_time * 0.2 + u_rndPos)) * 0.005;

  // Third octave
  float noiseX3 = snoise(vec3(uv * 5. + vec2(10.0, 0.0), u_time * 0.15 + u_rndPos)) * 0.015;
  float noiseY3 = snoise(vec3(uv * 5. + vec2(0.0, 10.0), u_time * 0.15 + u_rndPos)) * 0.015;

  float mixedNoiseX = mix(noiseX1, mix(noiseX2, noiseX3, 0.5), 0.5);
  float mixedNoiseY = mix(noiseY1, mix(noiseY2, noiseY3, 0.5), 0.5);

  vec4 color = texture2D(u_image, st);

  vec2 displacedST = st + vec2(mixedNoiseX, mixedNoiseY);

  vec4 displacedColor = texture2D(u_image, displacedST);
  if (displacedColor.a < 1.0) discard;
  
  gl_FragColor = displacedColor;
}
`;

function margin() {
  border.push()
  border.noFill()
  border.stroke(backCol)
  border.strokeWeight(50)
  border.rect(0, 0, w, h)
  border.pop()
}

function borderDsplc() {
  borderShader = createShader(vert, borderShd)
  shader(borderShader)

  borderShader.setUniform("u_time", counter / 120)
  borderShader.setUniform('u_image', border)
  borderShader.setUniform("u_canvasSize", [w, h])
  borderShader.setUniform('pixelDensity', pxlDensShdr)
  borderShader.setUniform('u_rndPos', shdrNoiseRndPos)

  noStroke()
  rect(0, 0, w, h)
}

function activateShdr() {
  createCanvas(w, h, WEBGL)
  background(hue(backCol), saturation(backCol), brightness(backCol))
  pxlshdr = createShader(vert, dpslcmnt)
}

function drawDsplc() {
  shader(pxlshdr)
  pxlshdr.setUniform('u_time', counter / 120)
  pxlshdr.setUniform('u_canvasSize', [w, h])
  pxlshdr.setUniform('u_image', pg)
  pxlshdr.setUniform('u_rndPos', shdrNoiseRndPos)
  pxlshdr.setUniform('pixelDensity', pxlDensShdr)
  pxlshdr.setUniform('u_speed', shdrSpeed)
  pxlshdr.setUniform('u_wet', shdrWet)
  pxlshdr.setUniform('u_noise2Rnd', noise2Rnd)
  pxlshdr.setUniform('u_noise2Scale', noise2Scale)
  pxlshdr.setUniform('u_tanrnd', tanrnd)
  pxlshdr.setUniform('u_anglrbool', anglrbool)
  pxlshdr.setUniform('u_anglrzrnd', anglrzrnd)
  pxlshdr.setUniform('u_tanDir', tanDir)
  pxlshdr.setUniform('u_generalDir', generalDir)
  pxlshdr.setUniform('u_rasterVis', rasterVis)

  noStroke()
  rect(-w / 2, -h / 2, w, h)
}

function shadeTex() {
  translate(-w / 2, -h / 2)
  texShader = createShader(vert, paperSoft)
  shader(texShader)

  texShader.setUniform("u_time", millis() / 1000.0)
  texShader.setUniform("u_canvasSize", [w, h])
  texShader.setUniform('pixelDensity', pxlDensShdr)

  blendMode(MULTIPLY)
  noStroke()
  rect(0, 0, w, h)
}