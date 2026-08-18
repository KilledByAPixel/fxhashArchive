// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

shaderFns.rand = () => {
  return `
    vec2 randUV;
    float randCnt = 0.;

    float rand2static(vec2 s) {
      return fract(sin(dot(s + staticSeed, vec2(12.9898,78.233)))*43758.5453123);
    }

    float rnd() {
      return rand2static(randUV + seed + randCnt ++);
    }
  `
}
