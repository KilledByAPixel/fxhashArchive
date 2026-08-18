const vert = `#ifdef GL_ES
precision mediump float;
#endif

// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// we need our texcoords again
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}`;

const frag = `precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D imgTex;
uniform float scratch;
uniform float push;
uniform float time;
uniform float seed;
uniform vec3 colors[20];

uniform float totalScale;
uniform vec2 totalOffset;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fnoise(vec2 v) {
  return (snoise(v) + 1.0) * 0.5;
}

float rand( vec2 p ) {
  vec2 K1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );
  return fract( cos( dot(p,K1) ) * 12345.6789 );
}

float randSafe( vec2 p ) {
  return fnoise( p * 100. );
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  // allow subsections to be computed
  uv = (uv * totalScale) + totalOffset;

  float mseed = seed + time * 0.01;

  vec2 cuv = uv;

  if ((scratch > 0.) && (scratch < 2.)) {
    float rx = floor(uv.x * 32. + snoise(uv + seed) * 4. );
    uv.y = fract(uv.y + randSafe(vec2(rx)) * push );
  }

  if (scratch > 1.) {
    float ry = floor(uv.y * 32. + snoise(uv + seed) * 4. );
    uv.x = fract(uv.x + randSafe(vec2(ry)) * push );
  }

  vec3 color = vec3(0.);
  // 1200
  for (int i=0; i<1000; i++) {

    //float lx = floor(float(i)/50.)/50.;
    //float ly = fract(float(i)/50.);
    //vec4 v = texture2D(backbuffer, vec2(lx,ly));
    
    float sec = 128.;
    vec2 b = (floor(uv * sec) / sec);
    
    vec2 v = (vec2(
      fnoise(vec2(float(i)*100. + seed + b)),
      fnoise(vec2((float(i)+341.)*100. + seed + 723. + b)))-0.5) * (4./sec) + b;

    //vec2 v = (vec2(
    //  rand(vec2(float(i)/5000. + seed + b)),
    //  rand(vec2((float(i)+34.)/5000. + seed + 723. + b)))-0.5) * (4./sec) + b;

    // random coord in circle
    //float r = rand(vec2(float(i) + seed + b)) * (4./sec);
    //float a = rand(vec2(float(i) + seed + 657. + b)) * 2. * 3.14159;
    //vec2 v = vec2(cos(a)*r + b.x, sin(a)*r + b.y);

    float target_angle = fnoise(v.xy * 2. + mseed) + ((rand(v.xy)-0.5) * 0.1) * 2. * 3.14159;
    vec2 param = v.xy;

    float angle = atan(uv.y-param.y, uv.x-param.x) + 3.14159;
    float adist = abs(angle - target_angle);
    float rad = rand(param) * 0.1 + 0.01;
    //float rad = rand(param) * 0.3 + 0.01;

    if (adist < rad) {

      float ci = fnoise(v.xy + mseed); // no seed was here ...
      float dist = distance(uv, param);
      float segment = rand(param) * 500. + 100.;
      float mar = rand(vec2(floor(angle * segment))) * 0.2 + 0.1; // 0.3;
      //float mar = rand(vec2(floor(angle * segment))) * 0.7 + 0.1;
      float nor = rand(vec2(floor(angle * segment))) * 0.05 + 0.05;

      //vec3 use = mix(colors[0], colors[1], ci);
      vec3 use = texture2D(imgTex, uv).xyz;
      if (rand(v + seed + 3431.) < 0.5) {
        use = colors[i/100];
      }
      
      //vec3 use = colors[i];

      color += max(mar - dist / nor, 0.) * use;
    }
  }

  color *= fnoise(cuv + mseed) * 0.1 + 0.9;
  
  gl_FragColor = vec4(color + (rand(uv)-0.5) * 0.25, 1.);
}`;

class Shader {
  constructor() {
    //let pal = parseHexStrings("125b50f8b400faf5e4ff6363"); // e5e3c9b4cfb094b49f789395 f73d9316003b413f427f8487");
    let pal = parseHexStrings("feece9ccd1e4fe7e6d2f3a8f");
    this.seed = random() * 567;
    this.colors = [...Array(20).keys()].map(x => randitem(pal).map(x => x/255));
  }
  draw(scratch, push) {
    this.shader = createShader(vert, frag);
    shader(this.shader);
    this.shader.setUniform('imgTex', get());
    this.shader.setUniform('push', push);
    this.shader.setUniform('scratch', scratch);
    this.shader.setUniform('seed', this.seed);
    this.shader.setUniform('colors', this.colors.flat());
    this.shader.setUniform('time', frameCount);
    this.shader.setUniform('totalScale', 1.);
    this.shader.setUniform('totalOffset', [0.,0.]);
    rect(0,0,width,height);
  }
  draw_wc(c, scratch, push, totalScale, totalOffset) {
    this.shader = c.createShader(vert, frag);
    c.shader(this.shader);
    this.shader.setUniform('imgTex', c.get());
    this.shader.setUniform('push', push);
    this.shader.setUniform('scratch', scratch);
    this.shader.setUniform('seed', this.seed);
    this.shader.setUniform('colors', this.colors.flat());
    this.shader.setUniform('time', frameCount);
    this.shader.setUniform('totalScale', totalScale);
    this.shader.setUniform('totalOffset', totalOffset);
    c.rect(0,0,c.width,c.height);
  }
}