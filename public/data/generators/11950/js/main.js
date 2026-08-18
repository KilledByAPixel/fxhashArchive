// Omega Point
// Copyright (c) 2022 Monotau

"use strict";

const DEFAULT_DELAY_MIN = 100;
const DEFAULT_DELAY_MAX = 2000;
const NOISE_GRID_SIZE = 64;
const TIME_FIRST_N_FRAMES = 8;
const PREVIEW_SIZE = 1024;
const MAX_FRAMES = 80;

let gl, program, canvas, framebuffers, textures, timeStart;

let maxFrames = 30;
let frameCount = 0;
let _renderingDelay = -1;
let timeFrames = 1;
let animating = false;

const round = (n, p) => Math.round((n + Number.EPSILON) * p) / p;

const createShader = (shaderString, type) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  gl.attachShader(program, shader);
}

const setUniform = (string, type, value) => {
  var loc = gl.getUniformLocation(program, string);
  eval('gl.uniform' + type + '(loc, value)');
}

const set2DTextureParams = (width, height) => {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

const set3DTextureParams = (size, buffer) => {
  gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, size, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);

  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
}

const renderingDelay = () => {
  if (isFxpreview || frameCount < 10) return 10;
  if (_renderingDelay >= 0) return _renderingDelay;
  const f = frameCount < 20 ? 2. : 3.;
  return Math.min(
    Math.max(timeFrames / TIME_FIRST_N_FRAMES * f, DEFAULT_DELAY_MIN), DEFAULT_DELAY_MAX
  )
}

const loopRender = () => {
  animating = true;

  if (frameCount == 0) {
    timeStart = performance.now();
  }
  else if (frameCount == TIME_FIRST_N_FRAMES) {
    timeFrames = performance.now() - timeStart;
  }

  if (frameCount >= maxFrames) {
    animating = false;
    document.title = 'Omega Point';
    if (isFxpreview) fxpreview();
    return;
  }

  //////

  // Set uniforms
  setUniform('iteration', '1i', frameCount);
  setUniform('seed', '1f', fxrand());
  setUniform('copy', '1i', false);

  // Render to texture
  const c = frameCount % 2;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[c]);
  gl.activeTexture(gl.TEXTURE0 + c);
  gl.bindTexture(gl.TEXTURE_2D, textures[(c + 1) % 2]);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // Copy texture to canvas
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, textures[c]);
  setUniform('copy', '1i', true);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  frameCount ++;
  document.title = frameCount + '/' + maxFrames;

  setTimeout(() => {
    requestAnimationFrame(loopRender);
  }, renderingDelay());
}

const setup = () => {
  // Create canvas
  let size = Number(new URLSearchParams(window.location.search).get('size'))
  let pixelRatio = window.devicePixelRatio;

  if (isFxpreview) {
    size = PREVIEW_SIZE;
    pixelRatio = 1;
  }
  else if (size) {
    size = Math.floor(size / pixelRatio);
  }
  else {
    size = Math.min(window.innerWidth, window.innerHeight);
  }

  canvas = document.createElement('canvas');
  canvas.style.width = canvas.style.height = size;

  size = Math.floor(size * pixelRatio);
  canvas.width = canvas.height = size;

  document.body.appendChild(canvas);

  // Init WebGL
  gl = canvas.getContext('webgl2', {
    alpha: false, depth: false, powerPreference: 'high-performance', preserveDrawingBuffer: true
  });

  if (!gl) {
    document.body.append('Unable to initialize WebGL.');
    return;
  }

  // Features
  const staticSeed = fxrand();
  const angle = round(fxrand(), 20) * Math.PI * 2;
  const fov = fxrand() < 0.5 ? '80.' : '60.';
  const ffactor = 8 + fxrand() * 6;
  const tMode = fxrand() < 0.2;
  const sMode = fxrand() < 0.8;
  const useSign = fxrand() < (tMode ? 0.5 : 0.6);
  const offset = !tMode && !sMode ? true : fxrand() < (tMode ? 0.66 : 0.5);
  const fog = !tMode && fxrand() < 0.4;
  const bwMode = fxrand() < (tMode || fog ? 0.05 : 0.15);

  const rand = fxrand();
  const colorFactor = !tMode && rand < 0.2 ? '1.3' : (rand > (fog ? 0.66 : 0.85) ? '1.8' : '2.3');

  // Create program
  let fragmentShaderString =
    fragmentShader(size, tMode, sMode, bwMode, useSign, angle, offset, fog, fov, colorFactor);

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
  setUniform('staticSeed', '1f', staticSeed);
  setUniform('ffactor', '1f', ffactor);

  // Create noise texture
  const noiseLookup = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 2);
  gl.bindTexture(gl.TEXTURE_3D, noiseLookup);
  let noiseValues = [];
  for (let i = 0; i < 4 * NOISE_GRID_SIZE**3; i ++) {
    noiseValues.push(Math.floor(fxrand() * 256));
  }
  set3DTextureParams(NOISE_GRID_SIZE, new Uint8Array(noiseValues));

  const textureLocation = gl.getUniformLocation(program, 'noiseLookup');
  gl.uniform1i(textureLocation, 2);

  // Create textures/framebuffers
  textures = [];
  framebuffers = [];
  for (let i = 0; i < 2; i ++) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    set2DTextureParams(size, size);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    textures.push(texture);
    framebuffers.push(framebuffer);
  }

  // Render
  requestAnimationFrame(loopRender);
}

const download = () => {
  let a = document.createElement('a');
  a.setAttribute('download', 'omega-point-' + fxhash + '.png');
  let url =
    gl.canvas.toDataURL('image/png').replace(/^data:image\/png/,'data:application/octet-stream');
  a.setAttribute('href', url);
  a.click();
};

document.addEventListener("keypress", function(event) {
  switch (event.keyCode) {
    // 'space' -> continue rendering up to MAX_FRAMES
    case 32:
      if (maxFrames < MAX_FRAMES) {
        maxFrames = MAX_FRAMES;
        if (!animating) requestAnimationFrame(loopRender);
      }
      break;
    // 'f' -> fast rendering
    case 102:
      _renderingDelay = 10;
      break;
    // 'r' -> change resolution
    case 114:
      let size = prompt('Canvas width in pixels (8-4096)', canvas.width);
      if (size >= 8 && size <= 4096) {
        let url = window.location.href;
        const parser = new URL(window.location);
        parser.searchParams.set('size', size);
        window.location = parser.href;
      }
      break;
    // 's' -> save
    case 115:
      download();
      break;
  }
});

setup();
