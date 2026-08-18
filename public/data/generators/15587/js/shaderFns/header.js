// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.header = () => {
  return `
    precision highp float;
    precision lowp sampler3D;

    out vec4 fragColor;

    const float BOXES = 1., MOSS = 2., WATER = 3., TERRAIN = 4., MIRROR = 5.;

    uniform float seed, staticSeed;
    uniform sampler2D tex;

    vec2 uv;
    vec3 mcGlobal;
  `;
}
