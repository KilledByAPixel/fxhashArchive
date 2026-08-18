#ifdef GL_ES
precision mediump float;
#endif


/* VARS */

varying vec2 vTexCoord;
uniform float u_seed;
uniform float u_blurStep;
uniform float u_paperTexture;

uniform sampler2D u_layer0;
uniform sampler2D u_layer1;
uniform sampler2D u_layer2;
uniform sampler2D u_layer3;

uniform float u_layer1_ampl1;
uniform float u_layer1_ampl2;
uniform float u_layer2_ampl1;
uniform float u_layer3_ampl1;
uniform float u_layer3_grain;


/* NOISE FUNCTION */

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}


/* RANDOM */

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float fbm(vec2 co, float lac, float gain) {
    float value = 0.0;
    float ampl = 0.5;
    for (int i = 0; i < 6; i++) {
        value += ampl * snoise(co);
        co *= lac; // lacunarity
        ampl *= gain; // gain
    }
    return value;
}

float fbm(vec2 co) {
    return fbm(co, 2.0, 0.5);
}


/* MAIN */

vec4 blur(sampler2D tex, vec2 xy) {
    vec2 u = vec2(u_blurStep, 0.0);
    vec2 v = vec2(0.0, u_blurStep);

    vec4 s = 0.0625 * texture2D(tex, xy - u - v);
    s += 0.125 * texture2D(tex, xy - u);
    s += 0.0625 * texture2D(tex, xy - u + v);
    s += 0.125 * texture2D(tex, xy - v);
    s += 0.25 * texture2D(tex, xy);
    s += 0.125 * texture2D(tex, xy + v);
    s += 0.0625 * texture2D(tex, xy + u - v);
    s += 0.125 * texture2D(tex, xy + u);
    s += 0.0625 * texture2D(tex, xy + u + v);
    return s;
}


vec2 warp1(vec2 xy, float seed, float amplSeed) {
    float ampl, sc;

    // tattered edge
    ampl = 0.0015;
    sc = 30.0;
    xy.x += ampl * fbm(sc * xy + seed + 0.0);
    xy.y += ampl * fbm(sc * xy + seed + 1.0);

    // splatter 1
    ampl = u_layer1_ampl1 * mix(0.1, 1.0, smoothstep(0.0, 0.5, fbm(3.0 * xy + amplSeed + 2.0)));
    sc = 30.0;
    xy.x += ampl * fbm(sc * xy + seed + 3.0);
    xy.y += ampl * fbm(sc * xy + seed + 4.0);

    // splatter 2
    ampl = u_layer1_ampl2 * mix(0.1, 1.0, smoothstep(0.0, 0.2, fbm(3.0 * xy + amplSeed + 5.0)));
    sc = 100.0;
    xy.x += ampl * fbm(sc * xy + seed + 6.0);
    xy.y += ampl * fbm(sc * xy + seed + 7.0);

    return xy;
}


vec2 warp2(vec2 xy, float seed) {
    xy.x += u_layer2_ampl1 * fbm(2.15 * xy + seed + 0.0, 2.5, 0.75);
    xy.y += u_layer2_ampl1 * fbm(2.15 * xy + seed + 1.0, 2.5, 0.75);
    return xy;
}


vec2 warp3(vec2 xy, float seed) {
    xy.x += u_layer3_ampl1 * fbm(10.0 * xy + seed + 0.0, 1.75, u_layer3_grain);
    xy.y += u_layer3_ampl1 * fbm(10.0 * xy + seed + 1.0, 1.75, u_layer3_grain);
    return xy;
}


vec4 blend(vec4 s, sampler2D layer, vec2 xy) {
    vec4 tex = blur(layer, xy);
    return mix(s, tex, tex.a);
}


void main() {
    vec2 xy = vTexCoord;
    xy = vec2(xy.x, 1.0-xy.y);

    // layer 0 - scribbles
    vec4 s = blur(u_layer0, xy);

    // layer 3 - marbled grains
    s = blend(s, u_layer3, warp3(xy, 0.0));
    s = blend(s, u_layer3, warp3(xy, 100.0));
    s = blend(s, u_layer3, warp3(xy, 200.0));

    // layer 1 - base pigment
    s = blend(s, u_layer1, warp1(xy, 300.0, 100.0));
    s = blend(s, u_layer1, warp1(xy, 400.0, 100.0));
    s = blend(s, u_layer1, warp1(xy, 500.0, 100.0));

    // layer 2 - details pigment
    s = blend(s, u_layer2, warp2(xy, 600.0));

    if (u_paperTexture > 0.5) {
      // cross-hatch
      s += 0.013 * fbm(vec2(1000.0 * xy.x, 2.0 * xy.y) + 1000.0);
      s += 0.013 * fbm(vec2(1000.0 * xy.y, 2.0 * xy.x) + 1001.0);

      // graininess
      s -= 0.02 * rand(xy + 1002.0);
      s += 0.02 * rand(xy + 1003.0);
    }

    // set alpha to 1
    s.a = 1.0;
    gl_FragColor = s;
}

