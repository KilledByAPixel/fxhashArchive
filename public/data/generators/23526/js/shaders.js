// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

let shaderFns = {};

const mat2rotate = (angle) => {
  return `mat2(${Math.cos(angle)}, ${-Math.sin(angle)}, ${Math.sin(angle)}, ${Math.cos(angle)})`;
}

const fragmentShader = (width, height, voxelGridSize, noise3dGridSize) => {
  return `#version 300 es
    ${shaderFns.header()}
    ${shaderFns.featuresHeader()}
    ${shaderFns.rand()}
    ${shaderFns.utils()}
    ${shaderFns.noise(f, noise3dGridSize)}
    ${shaderFns.shapes(f, voxelGridSize)}
    ${shaderFns.light(f)}
    ${shaderFns.copy(f)}
    ${shaderFns.main(f, width, height)}
  `;
}

const vertexShader = `#version 300 es
  in vec2 pos;
  void main() {
	  gl_Position = vec4(pos, 0, 1);
  }
`;
