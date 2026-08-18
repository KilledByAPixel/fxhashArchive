// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

shaderFns.header = () => {
  return `
    precision highp float;
    precision lowp sampler3D;

    out vec4 fragColor;

    uniform float seed, staticSeed;
    uniform sampler2D tex;

    uniform int iteration;
  `;
}
