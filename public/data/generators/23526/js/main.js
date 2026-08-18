// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

const MAX_FRAMES = 10000;
const MAX_FRAMES_PREVIEW = 256;
const SHOW_AT_FRAME = 4;

const NOISE_3D_GRID_SIZE = 64;

let rez = Number(new URLSearchParams(window.location.search).get('rez')) || 512;
const VOXEL_GRID_SIZE = rez;
const VOXEL_GRID_HEIGHT = VOXEL_GRID_SIZE * 2;

const BASE_SCALE = VOXEL_GRID_SIZE / 512 * 0.75;

const ASPECT = 1.3;

let frameCount = 0;
let animating = false;
let play = true;

let f;

let gl, program, framebuffers, textures, segmentPos, segmentSize, screenWidth, screenHeight;

const createShader = (shaderString, type) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(shaderString.split('\n'));
    throw gl.getShaderInfoLog(shader);
  }

  gl.attachShader(program, shader);
}

const setUniform = (string, type, value) => {
  var loc = gl.getUniformLocation(program, string);
  eval('gl.uniform' + type + '(loc, value)');
}

const set2DTextureParams = (width, height) => {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

const set3DTextureParams = (sizeX, sizeY, sizeZ, buffer) => {
  gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8, sizeX, sizeY, sizeZ, 0, gl.RED, gl.UNSIGNED_BYTE, buffer);

  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
}

const glFinish = (type) => {
  // don't throttle GPU. thanks @piterpasma!
  gl.readPixels(0, 0, 1, 1, gl.RGBA, type, new (type == gl.FLOAT ? Float32Array : Uint8Array)(4));
  gl.finish();
}

const renderSegments = () => {
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(segmentPos, 0, segmentSize, screenHeight);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  glFinish(gl.FLOAT);

  segmentPos += segmentSize;
  if (segmentPos < screenWidth) {
    requestAnimationFrame(renderSegments);
  }
  else {
    // Render to canvas
    gl.disable(gl.SCISSOR_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, textures[frameCount % 2]);
    setUniform('copy', '1i', true);

    if (frameCount >= SHOW_AT_FRAME - 1) {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      glFinish(gl.UNSIGNED_BYTE);
    }

    frameCount++;
    document.title = frameCount + '/' + MAX_FRAMES;

    requestAnimationFrame(render);
  }
}

const render = () => {
  animating = true;

  if (!play || frameCount >= (isFxpreview ? MAX_FRAMES_PREVIEW : MAX_FRAMES)) {
    if (!params.realtime) {
      animating = false;
      document.title = 'Chrysalis';
      if (isFxpreview) fxpreview();
      return;
    }
  }

  // Set uniforms
  setUniform('iteration', '1i', frameCount);
  setUniform('seed', '1f', fxrand());
  setUniform('copy', '1i', false);
  setFeaturesUniforms();

  A.animate();

  // Render to texture
  const c = frameCount % 2;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[c]);
  gl.activeTexture(gl.TEXTURE0 + c);
  gl.bindTexture(gl.TEXTURE_2D, textures[(c + 1) % 2]);

  // Render by segments
  const segmentCnt =
    isFxpreview || params.realtime || !params.shareGPU || frameCount < 32 ? 1 : (frameCount < 64 ? 4 : 16);
  segmentSize = Math.floor(screenWidth / segmentCnt);
  segmentPos = 0;

  renderSegments();
}

const setup = () => {
  // Create canvas
  let height = Number(new URLSearchParams(window.location.search).get('height'))
  const pixelRatio = window.devicePixelRatio;

  if (height) {
    height = Math.floor(height / pixelRatio);
  }
  else {
    height = Math.min(window.innerWidth * ASPECT, window.innerHeight);
  }
  let width = Math.floor(height / ASPECT);

  const canvas = document.createElement('canvas');
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  height = Math.floor(height * pixelRatio);
  width = Math.floor(width * pixelRatio);

  screenWidth = canvas.width = width;
  screenHeight = canvas.height = height;

  document.body.appendChild(canvas);

  // Init WebGL
  gl = canvas.getContext('webgl2', {
    alpha: false, depth: false, powerPreference: 'high-performance', preserveDrawingBuffer: true
  });
  gl.getExtension('EXT_color_buffer_float');
  gl.getExtension('OES_texture_float_linear');

  if (!gl) {
    document.body.append('Unable to initialize WebGL.');
    return;
  }

  // Choose features that the build needs to generate values
  f = featuresPreBuild();

  // Generate CA values
  let lambda = 0.25;
  let nStates = 10;

  let result = buildValues(lambda, nStates, f.baseSize, VOXEL_GRID_SIZE, VOXEL_GRID_HEIGHT);
  let values = result.values;
  assignColors(values, nStates, VOXEL_GRID_SIZE);

  // Choose features that require values
  updateFeaturesPostBuild(result);


  // Create program
  const fragmentShaderString =
    fragmentShader(width, height, VOXEL_GRID_SIZE, NOISE_3D_GRID_SIZE);

  program = gl.createProgram();
  createShader(vertexShader, gl.VERTEX_SHADER);
  createShader(fragmentShaderString, gl.FRAGMENT_SHADER);
  gl.linkProgram(program);
  gl.useProgram(program);


  // Vertex buffer
  const vertexPosBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
  gl.enableVertexAttribArray(program.vertexPosAttrib);
  gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

  // Set uniforms
  setUniform('staticSeed', '1f', f.staticSeed);

  // Set voxel map
  gl.activeTexture(gl.TEXTURE0 + 2);
  gl.bindTexture(gl.TEXTURE_3D, gl.createTexture());

  set3DTextureParams(VOXEL_GRID_SIZE, VOXEL_GRID_SIZE, VOXEL_GRID_HEIGHT, values);
  gl.uniform1i(gl.getUniformLocation(program, 'voxelsTex'), 2);

  // Empty voxels map
  const fStep = 2;
  const dSize = VOXEL_GRID_SIZE >> fStep;
  const dHeight = VOXEL_GRID_HEIGHT >> fStep;
  let emptyValues = new Uint8Array(dSize ** 2 * dHeight);

  let s = dSize;
  let h = dHeight;
  for (let f = 0; f < 6; f += fStep) {
    values = expand(downsample(values, s << fStep, h << fStep, fStep), s, h);

    for (let i = 0, p = 0; i < dHeight; i++) {
      let id = (i >> f) * s * s;
      for (let j = 0; j < dSize; j++) {
        let jd = (j >> f) * s;
        for (let k = 0; k < dSize; k++, p++) {
          if (values[id + jd + (k >> f)] == 0) {
            emptyValues[p] = 1 << (f + fStep);
          }
        }
      }
    }
    s >>= fStep; h >>= fStep;
  }
  values = null;

  gl.activeTexture(gl.TEXTURE0 + 3);
  gl.bindTexture(gl.TEXTURE_3D, gl.createTexture());

  set3DTextureParams(dSize, dSize, dHeight, new Uint8Array(emptyValues));
  gl.uniform1i(gl.getUniformLocation(program, 'emptyVoxelsTex'), 3);
  emptyValues = null;

  // Create 3D noise texture
  const noiseLookup3D = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 4);
  gl.bindTexture(gl.TEXTURE_3D, noiseLookup3D);

  let noiseValues3D = new Uint8Array(NOISE_3D_GRID_SIZE ** 3);
  for (let i = 0; i < NOISE_3D_GRID_SIZE ** 3; i++) {
    noiseValues3D[i] = Math.floor(fxrand() * 255);
  }

  set3DTextureParams(NOISE_3D_GRID_SIZE, NOISE_3D_GRID_SIZE, NOISE_3D_GRID_SIZE, new Uint8Array(noiseValues3D));
  gl.uniform1i(gl.getUniformLocation(program, 'noiseLookup3D'), 4);
  noiseValues3D = null;

  // Create textures/framebuffers
  textures = [];
  framebuffers = [];
  for (let i = 0; i < 2; i++) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    set2DTextureParams(width, height);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    textures.push(texture);
    framebuffers.push(framebuffer);
  }

  setupGUI();
  requestAnimationFrame(render);
}

const download = () => {
  let a = document.createElement('a');
  a.setAttribute('download', 'chrysalis-' + fxhash + '.png');
  let url =
    gl.canvas.toDataURL('image/png').replace(/^data:image\/png/, 'data:application/octet-stream');
  a.setAttribute('href', url);
  a.click();
};

document.addEventListener("keypress", (event) => {
  switch (event.keyCode) {
    // 'g' -> toggle GUI
    case 103:
      toggleGUI();
      break;
    // 'r' -> change resolution
    case 114:
      const height = prompt('Canvas height in pixels (8-8192)', gl.canvas.height);
      if (height >= 8 && height <= 8192) {
        const parser = new URL(window.location);
        parser.searchParams.set('height', height);
        window.location = parser.href;
      }
      break;
    // 's' -> save
    case 115:
      download();
      break;
  }
});

setTimeout(setup, 10);
