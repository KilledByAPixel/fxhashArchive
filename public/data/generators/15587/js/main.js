// Cradle
// Copyright (c) 2022 Monotau

"use strict";

const MAX_FRAMES = 256;
const MAX_FRAMES_PREVIEW = 64;

const NOISE_3D_GRID_SIZE = 64;
const NOISE_2D_GRID_SIZE = 1024;

let frameCount = 0;
let fastMode = false;
let animating = false;
let play = true;

let gl, program, framebuffers, textures, segmentPos, segmentSize, screenSize;

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

const set2DTextureParams = (size) => {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

const set2DNoiseTextureParams = (size, buffer) => {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, size, size, 0, gl.RED, gl.FLOAT, buffer);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

const set3DNoiseTextureParams = (size, buffer) => {
  gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8, size, size, size, 0, gl.RED, gl.UNSIGNED_BYTE, buffer);

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
  gl.scissor(segmentPos, 0, segmentSize, screenSize);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  glFinish(gl.FLOAT);

  segmentPos += segmentSize;
  if (segmentPos < screenSize) {
    requestAnimationFrame(renderSegments);
  }
  else {
    // Render to canvas
    gl.disable(gl.SCISSOR_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, textures[frameCount % 2]);
    setUniform('copy', '1i', true);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    glFinish(gl.UNSIGNED_BYTE);

    frameCount ++;
    document.title = frameCount + '/' + MAX_FRAMES;

    requestAnimationFrame(render);
  }
}

const render = () => {
  animating = true;

  if (!play || frameCount >= (isFxpreview ? MAX_FRAMES_PREVIEW : MAX_FRAMES)) {
    animating = false;
    document.title = 'Cradle';
    if (isFxpreview) fxpreview();
    return;
  }

  // Set uniforms
  setUniform('iteration', '1i', frameCount);
  setUniform('seed', '1f', fxrand());
  setUniform('copy', '1i', false);

  // Render to texture
  const c = frameCount % 2;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[c]);
  gl.activeTexture(gl.TEXTURE0 + c);
  gl.bindTexture(gl.TEXTURE_2D, textures[(c + 1) % 2]);

  // Render by segments
  const segmentCnt =
    fastMode || isFxpreview ? 1 : (frameCount < 8 ? 16 : (frameCount < 64 ? 32 : 64));
  segmentSize = Math.floor(screenSize / segmentCnt);
  segmentPos = 0;

  renderSegments();
}

const setup = () => {
  // Create canvas
  let size = Number(new URLSearchParams(window.location.search).get('size'))
  const pixelRatio = window.devicePixelRatio;

  if (size) {
    size = Math.floor(size / pixelRatio);
  }
  else {
    size = Math.min(window.innerWidth, window.innerHeight);
  }

  const canvas = document.createElement('canvas');
  canvas.style.width = canvas.style.height = `${size}px`;

  size = Math.floor(size * pixelRatio);
  canvas.width = canvas.height = size;
  screenSize = size;

  document.body.appendChild(canvas);

  // Init WebGL
  gl = canvas.getContext('webgl2', {
    alpha: false, depth: false, powerPreference: 'high-performance', preserveDrawingBuffer: true
  });
  gl.getExtension('EXT_color_buffer_float');

  if (!gl) {
    document.body.append('Unable to initialize WebGL.');
    return;
  }

  // Create program
  const fragmentShaderString =
    fragmentShader(features(), size, NOISE_2D_GRID_SIZE, NOISE_3D_GRID_SIZE);

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
  setUniform('staticSeed', '1f', fxrand());

  // Create 3D noise texture
  const noiseLookup3D = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 2);
  gl.bindTexture(gl.TEXTURE_3D, noiseLookup3D);
  let noiseValues3D = [];
  for (let i = 0; i < NOISE_3D_GRID_SIZE ** 3; i ++) {
    noiseValues3D.push(Math.floor(fxrand() * 256));
  }
  set3DNoiseTextureParams(NOISE_3D_GRID_SIZE, new Uint8Array(noiseValues3D));
  gl.uniform1i(gl.getUniformLocation(program, 'noiseLookup3D'), 2);

  // Create 2D noise texture
  const noiseLookup2D = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 3);
  gl.bindTexture(gl.TEXTURE_2D, noiseLookup2D);
  let noiseValues2D = [];
  for (let i = 0; i < NOISE_2D_GRID_SIZE ** 2; i ++) {
    noiseValues2D.push(fxrand());
  }
  set2DNoiseTextureParams(NOISE_2D_GRID_SIZE, new Float32Array(noiseValues2D));
  gl.uniform1i(gl.getUniformLocation(program, 'noiseLookup2D'), 3);

  // Create textures/framebuffers
  textures = [];
  framebuffers = [];
  for (let i = 0; i < 2; i ++) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    set2DTextureParams(size);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    textures.push(texture);
    framebuffers.push(framebuffer);
  }

  requestAnimationFrame(render);
}

const download = () => {
  let a = document.createElement('a');
  a.setAttribute('download', 'cradle-' + fxhash + '.png');
  let url =
    gl.canvas.toDataURL('image/png').replace(/^data:image\/png/,'data:application/octet-stream');
  a.setAttribute('href', url);
  a.click();
};

document.addEventListener("keypress", (event) => {
  switch (event.keyCode) {
    // 'space' -> stop/continue rendering
    case 32:
      play = !play;
      if (play && !animating) {
        requestAnimationFrame(render);
      }
      break;
    // 'f' -> fast rendering
    case 102:
      fastMode = true;
      break;
    // 'r' -> change resolution
    case 114:
      const size = prompt('Canvas width in pixels (8-8192)', gl.canvas.width);
      if (size >= 8 && size <= 8192) {
        const url = window.location.href;
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
