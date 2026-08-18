precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D imgTex;
uniform float seed;
uniform int mode;
uniform float agedProb;
uniform float marg;
uniform float rgbFilter;
uniform vec2 mu;

uniform float ress;

uniform sampler2D randvals;

float margin_wrap(float co) {
  float size = 1. - (2.*marg);
  return fract( (co-marg) / size ) * size + marg;
}

vec2 margin_wrap(vec2 co) {
  float size = 1. - (2.*marg);
  return fract( (co-marg) / size ) * size + marg;
}


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


// two random functions
// one for aesthetic
// and univ_rand for universal platform consistency

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float rand(float c) {
  return rand(vec2(c));
}



float univ_rand(vec2 p) {
  return texture2D(randvals, fract(p)).x;
}


float univ_rand2(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}


float univ_rand(float c) {
  return univ_rand(vec2(c));
}


/*
uint triple32(uint x)
{
    x ^= x >> 17;
    x *= 0xed5ad4bbU;
    x ^= x >> 11;
    x *= 0xac4c1b51U;
    x ^= x >> 15;
    x *= 0x31848babU;
    x ^= x >> 14;
    return x;
}

float univ_rand(float x) {
  return float(triple32(x)) / float( 0xffffffffU );
} 

float univ_rand(vec2 x) {
  return univ_rand(x.x + x.y);
}
*/


vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 rotateUV(vec2 uv, float rotation, float scale)
{
    float mid = 0.5;
    float margin = 1. / 8.;
    uv = uv * scale;
    return vec2(
        fract(cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid) * (1. - 2. * margin) + margin,
        fract(cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid) * (1. - 2. * margin) + margin
    );
}

vec2 rotateUV(vec2 uv, float rotation, vec2 mid)
{
    uv = uv * 2.;
    return vec2(
      margin_wrap(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x),
      margin_wrap(cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y)
    );
    /*
    return vec2(
      fract(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x) * (1. - 2. * margin) + margin,
      fract(cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y) * (1. - 2. * margin) + margin
    );
    */
}


vec2 rotateUV(vec2 uv, float rotation, vec2 mid, float scale)
{
    uv = uv * scale;
    return vec2(
      margin_wrap(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x),
      margin_wrap(cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y)
    );
    /*
    return vec2(
      fract(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x) * (1. - 2. * margin) + margin,
      fract(cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y) * (1. - 2. * margin) + margin
    );
    */
}

// ============================
// ============================
// different FX

vec2 drawn(vec2 co) {
  float amount = 16.0;
  float depth = 0.0005;
  co.x = fract(co.x + snoise(co * amount + seed + 738.) * depth);
  co.y = fract(co.y + snoise(co * amount + seed + 812.) * depth);
  return co;
}

vec2 diag_wave(vec2 co, float res) {
  float base = floor(fract(co.x - co.y) * res) / res;
  co.y = co.y + univ_rand(vec2(base*5.+fract(seed))) * max(0.,fnoise(vec2(base+seed))-0.25) * 0.1; // 0.1
  co = rotateUV(co, 0.25*3.14159, vec2(0.5,0.5), 1.25);
  return margin_wrap(co);
}

vec2 shift_horiz(vec2 co, float res, float scale, float amount) {
  float y = 1. - cos(pow(co.y,1.0) * 6.28);
  y = fnoise(vec2(co.y,co.y));
  vec2 base = vec2(floor(y*res),floor(y*res))/res;
  //return fract(co + vec2(univ_rand(base + seed) * 0.1 + snoise(base * scale + seed) * amount, 0));
  return margin_wrap(co + vec2(univ_rand(base + seed) * fnoise(base * scale + seed) * amount, 0));
}

vec2 tri_shift(vec2 co, float res) {
  co.x = margin_wrap(co.x + floor(co.y * res)/res);
  return co;
}

vec2 tri_shift_partial(vec2 co, float res, float prob) {  
  float base = floor(co.y * res) / res;
  if (univ_rand(vec2(base))<prob) {
    co.x = margin_wrap(co.x + base);
  }
  else {
    co.x = margin_wrap(co.x + univ_rand(vec2(base)));
  }
  return co;
  
}

vec2 shift_partial_horiz(vec2 co, float res, float prob, float amount) {
  float base = floor(co.y * res) / res;
  if (univ_rand(vec2(base)+seed)<prob*pow(co.y,3.)) {
    co.x = margin_wrap(co.x + snoise(vec2(base+412.+seed)) * amount);
  }
  return co;
}

vec2 shift_partial_vert(vec2 co, float res, float prob, float amount) {
  float p = 2.5;
  float base = floor(co.x * res) / res;
  if (univ_rand(vec2(base)+seed)<prob*pow(co.x,p)) {
    //co.y = margin_wrap(co.y + snoise(vec2(base*0.5+652.+seed)) * pow(co.x,p) * amount + (univ_rand(vec2(base+seed+745.))-0.5)*0.005);
    co.y = co.y + snoise(co*vec2(4.,0.5)+652.+seed) * pow(co.x,3.) * amount + (univ_rand(vec2(base+seed+745.))-0.5)*0.005;
  }
  //else {
  //  co.y = co.y + snoise(co+652.+seed) * pow(co.x,3.) * amount * univ_rand(vec2(base+seed+643.));
  //}
  co.y = margin_wrap(co.y); // + (univ_rand(vec2(base+seed+745.))-0.5)*0.005);
  return co;
}

vec2 scaled(vec2 co, vec2 res) {
  co.y = fract(co.y + rand(seed));
  if (rand(seed) < 0.5) {
    co.y = 1. - co.y; // flip directions
  }
  float by = floor(pow(co.y,2.0) * res.y) / res.y;
  co.y = co.y - by;
  co.x = margin_wrap(co.x + by);
  return co;
}

vec2 flow_distort(vec2 co, vec2 res, float off, float amount) {
  vec2 base = floor(co * res)/res;
  float angle = snoise(base * amount + seed + off) * 3.14159 * fnoise(base * amount + seed + 534.);
  return rotateUV(co, angle, vec2(0.5,0.5), 1.);
}

vec2 diag_shift(vec2 co, float res) {
  vec2 base = floor((co - co.x) * res) / res;
  return fract(co + (univ_rand(base)-0.5)*0.25);
}

vec2 ripple(vec2 co, float res) {
  //vec2 mymu = vec2(univ_rand(vec2(seed))-0.5, univ_rand(vec2(seed) + 894.)-0.5) * 10.;
  //vec2 mu = vec2(univ_rand(vec2(seed))-0.5, univ_rand(vec2(seed)) + 894.);
  float base = floor(length(co-mu) * res);
  float rot = 0.;
  if (univ_rand(vec2(base/res)) < 0.75) {
    rot = snoise(vec2(base)/res * 8. + seed) * 0.25;
  }
  return rotateUV(co, rot, sqrt(2.));
}

vec2 ripple2(vec2 co, float res, float amount) {
  float base = floor(fract(co.x - co.y) * res);
  vec2 b2 = vec2(base, 0.);
  return rotateUV(co, 0.25*3.14159, cos(co * 6.28 * snoise(b2 + seed)) * snoise(co*0.5 + seed) * amount, 1. ); // 0.25
}

vec2 grift(vec2 co) {
  float scale = 1.;
  vec4 tex = texture2D(imgTex, co);
  return margin_wrap(co + snoise(co*scale+seed) * rand(co+seed) * tex.x);
}

vec2 grift2(vec2 co) {
  co = tri_shift_partial(co, 64., 0.5);
  float scale = 1.;
  vec4 tex = texture2D(imgTex, co);
  //float nam = cos(snoise(co+seed+8247.) * 2.);
  float nam = pow(snoise(co+seed+8247.), 5.);
  //float nam = snoise(co+seed+8247.);
  co = margin_wrap(co + nam * rand(co+seed) * tex.x); //* max(0.,((nam+1.)*0.5)-0.25));
  return co;
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec2 origuv = uv;

  vec2 loc;
  if (mode == 0) {
    loc = uv; // default
  }
  else if (mode == 1) {
    // amount of 0.5, 1.0
    // res 16, 64
    //loc = flow_distort(uv, vec2(32.), 817., 0.5); // 64. , 0.5
    loc = flow_distort(uv, vec2(ress), 817., 0.5); // 64. , 0.5
  }
  else if (mode == 2) {
    // 16 - 128
    //loc = tri_shift_partial(uv, 128., 0.75); // 128.
    loc = tri_shift_partial(uv, ress, 0.75); // 128.
  }
  else if (mode == 3) {
    // res 32 128
    //loc = ripple(uv, 128.); // 128.
    loc = ripple(uv, ress); // 128.
  }
  else if (mode == 4) {
    // amount 0.25, 1.0
    // res 16 128.
    //loc = ripple2(uv, 128., 1.0); // 64. 0.25
    loc = ripple2(uv, ress, 0.25); // 64. 0.25
  }
  else if (mode == 5) {
    // res 32 128
    //loc = scaled(uv, vec2(64.)); // 64.
    loc = scaled(uv, vec2(ress)); // 64.
  }
  else if (mode == 6) {
    //loc = shift_horiz(uv, 32., 2.0, 0.05); // 32.
    loc = shift_horiz(uv, ress, 2.0, 0.05); // 32.
  }
  else if (mode == 7) {
    loc = diag_wave(uv, 128.);
  }

  // aged look can be applied after affect
  if (rand(uv+seed+723.) < agedProb) {
    loc = margin_wrap(loc + vec2(texture2D(imgTex, margin_wrap(loc+rand(uv+seed)*0.1))) );
  }

  // drawn effect
  loc = drawn(loc);
  vec4 pixel = vec4(vec3(texture2D(imgTex, loc)), 1.); // fixes darkness issue
  vec4 orig = vec4(vec3(texture2D(imgTex, origuv)), 1.);


  // rgb distort filter
  
  if (rgbFilter > 0.) {
    float push = 0.1;
    vec2 res = vec2(8.,1.);
    vec2 section = floor(cos(loc*2.*3.14159) * res);
    section.y = 0.;
    vec2 goff = vec2(univ_rand(section+165.+seed)*push, 0.); //rand(section + 657.)*push);
    vec2 boff = vec2(univ_rand(section+716.+seed)*push, 0.); //rand(section + 987.)*push);

    pixel = vec4(
      texture2D(imgTex,loc).x, 
      texture2D(imgTex,fract(loc+goff)).y, 
      texture2D(imgTex,fract(loc+boff)).z, 
      1.
    );
  }
  
  // visualize the noise
  //float s = texture2D(randvals, origuv).x;
  //pixel = vec4(s, s, s, 1.);

  if (pixel.x == 0.) {
    gl_FragColor = pixel;
  }

  float limit = marg;
  if ((origuv.x < limit) || (origuv.x > 1.-limit) || (origuv.y < limit) || (origuv.y > 1.-limit)) {
    gl_FragColor = vec4(1., 1., 1., 1.);
  }

  else {
    gl_FragColor = pixel + (rand(uv)-0.5) * 0.25;
    //gl_FragColor = pixel + snoise(uv*1000.) * 0.4;
  }  
}