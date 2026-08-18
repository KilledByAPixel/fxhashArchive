// Cradle
// Copyright (c) 2022 Monotau

"use strict";

let shaderFns = {};

const mat2rotate = (angle) => {
  return `mat2(${Math.cos(angle)}, ${-Math.sin(angle)}, ${Math.sin(angle)}, ${Math.cos(angle)})`;
}

const fragmentShader = (f, size, noise2dGridSize, noise3dGridSize) => {
  return `#version 300 es
    ${shaderFns.header()}
    ${shaderFns.noise(noise2dGridSize, noise3dGridSize)}
    ${shaderFns.utils()}
    ${shaderFns.terrain(f)}
    ${shaderFns.shapes(f)}
    ${shaderFns.light(f)}
    ${shaderFns.copy(f)}
    ${shaderFns.color(f)}
    ${shaderFns.fog(f)}
    ${shaderFns.main(f, size)}
  `;
}

const vertexShader = `#version 300 es
  in vec2 pos;

  void main() {
	  gl_Position = vec4(pos, 0, 1);
  }
`;
