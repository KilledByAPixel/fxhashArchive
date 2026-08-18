// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

shaderFns.noise = (f, noise3dGridSize) => {
  return `
    uniform sampler3D noiseLookup3D;

    float noise3d(vec3 p) {
      p = abs(p + ${noise3dGridSize / 2}.);
      ${f.smoothNoise ? 'p += rnd() * .15 - .075;' : ''}
      vec3 t = floor(p) + smoothstep(0., 1., fract(p)) - .5;
      return texture(noiseLookup3D, t / ${noise3dGridSize}.).r;
    }
  `;
}
