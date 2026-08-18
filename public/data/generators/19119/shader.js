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
uniform float seed;
uniform float distort;
uniform float eraser;

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

float rnoise(vec2 v, float mi, float ma) {
  return ((snoise(v) + 1.0) * 0.5) * (ma - mi) + mi;
}

float rand( vec2 p )
{
  vec2 K1 = vec2(
  23.14069263277926, // e^pi (Gelfond's constant)
  2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
);
  return fract( cos( dot(p,K1) ) * 12345.6789 );
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

float sharpsin(float x) {
  //return -(((1. - pow(sin(x),6.)) * 2. - 1.) + pow(sin(3.*x),2.));
  return (1. - pow(sin(x),6.)) * 2. - 1.;
}

float dullsin(float x) {
  return -(1. - pow(sin(x + 1.570795),2.));
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec2 orig = uv;

  float do_distort = fnoise(vec2(floor(uv.x * distort)) * 856. + seed);
  if ((distort > 0.) && (do_distort < 0.25)) {
    float rx = floor(uv.x * distort + snoise(uv + seed) * 0.25 );
    //uv.y = fract(uv.y + rand(vec2(rx)) * 0.2 );
    if (eraser > 0.) {
      uv.y = fract(uv.y + snoise(uv * 100. + seed) * 0.2 );
    }
    else {
      uv.y = fract(uv.y + snoise(vec2(rx) * 100. + seed) * 0.5 );
    }
  }

  vec4 pixel = texture2D(imgTex,uv + snoise(uv*10. + seed) * 0.0005);
  
  if ((distort > 0.) && (do_distort < 0.25)) {
    if (orig.y < 1./16.) {
      pixel = vec4(0.96);
    }
    if (orig.y > 15./16.) {
      pixel = vec4(0.96);
    }
  }

	float d = length(pixel - vec4(1.));

	vec3 hsv = rgb2hsv(vec3(pixel));

  float aspect = 1.3125;
  float res = 800.;


  // grid
  uv += vec2(snoise(uv*40.+seed), snoise(uv*40.+seed+413.)) * 0.0005;
  hsv.z += (sharpsin(uv.y * res * aspect) + sharpsin(uv.x * res)) * 0.05 * rnoise(uv*8.+seed+88., 0.35, 1.0);
  
	//lines
	//hsv.z += (sin((uv.y + snoise(vec2(uv.x*0.2))*0.2 + snoise(uv*40.)*0.001 + rand(uv)*0.001) * 1800.) * 0.1 * fnoise(uv*8.+seed+88.));
  
  // grit
  hsv.z += (dullsin(uv.y * res * aspect) + dullsin(uv.x * res)) * fnoise(uv*200.+seed) * 0.05 * rand(uv);
  
	//dust
  hsv.z -= max(fnoise(uv*200.+seed+167.)-0.9,0.) * 5.;
	hsv.z -= max(fnoise(uv*100.+seed+167.)-0.9,0.) * 2.;
	hsv.z -= max(fnoise(uv*50.+seed+167.)-0.9,0.) * 1.;
	hsv.z -= max(fnoise(uv*25.+seed+167.)-0.9,0.) * 0.5;
  

	pixel = vec4(hsv2rgb(hsv), 1.);

  gl_FragColor = pixel; //+ offset;
}`;

class Shader {
  constructor() {
    this.shader = createShader(vert, frag);
  }
  draw(distort, eraser) {
    shader(this.shader);
    this.shader.setUniform('imgTex', get());
    this.shader.setUniform('seed', random() * 567);
    this.shader.setUniform('distort', distort);
    this.shader.setUniform('eraser', eraser);
    rect(0,0,width,height);
  }
}