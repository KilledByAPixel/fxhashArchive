// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.noise = (noise2dGridSize, noise3dGridSize) => {
  return `
    const float NOISE_2D_GRID_SIZE = ${noise2dGridSize}.;
    const float NOISE_3D_GRID_SIZE = ${noise3dGridSize}.;

    uniform sampler2D noiseLookup2D;
    uniform sampler3D noiseLookup3D;

    float randCnt = 0.;

    float rand2static(vec2 s) {
      return fract(sin(dot(s + staticSeed, vec2(12.9898,78.233)))*43758.5453123);
    }

    float randNew() {
      return rand2static(uv + seed + randCnt ++);
    }

    // smoothstep the 2D noise texture
    float noise2d(vec2 p) {
      p = abs(p + vec2(17.31, 14.11));
      vec2 t = floor(p) + smoothstep(0., 1., fract(p)) - .5;
      return texture(noiseLookup2D, t / NOISE_2D_GRID_SIZE).r;
    }

    // smoother 2D noise
    // (for some reason unknown to me, noise2d produces artifacts on smooth surfaces)
    float noise2dSmoother(vec2 p) {
      p = abs(p + vec2(17.31, 13.11));
      ivec2 pi = ivec2(floor(p));

      vec2 f = smoothstep(0., 1., fract(p));

      float aa, ba, ab, bb, x1, x2;
      aa = texelFetch(noiseLookup2D, pi, 0).x;
      ab = texelFetch(noiseLookup2D, pi + ivec2(0,1), 0).x;
      ba = texelFetch(noiseLookup2D, pi + ivec2(1,0), 0).x;
      bb = texelFetch(noiseLookup2D, pi + ivec2(1,1), 0).x;

      x1 = mix(aa, ba, f.x);
      x2 = mix(ab, bb, f.x);
      return mix(x1, x2, f.y);
    }

    // smoothstep the 3D noise texture
    float noise3d(vec3 p) {
      p = abs(p + vec3(7.3, 11.2, 16.7));
      vec3 t = floor(p) + smoothstep(0., 1., fract(p)) - .5;
      return texture(noiseLookup3D, t / NOISE_3D_GRID_SIZE).r;
    }

    float fnoise3d(vec3 p) {
      float v = 0., a = 1., s = 0.;
      for (int i = 0; i < 5; i ++) {
        v += noise3d(p) * a;
        s += a;
        p *= 2.; a *= .5;
      }
      return v / s;
    }
  `
}
