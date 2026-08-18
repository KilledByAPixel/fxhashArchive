// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

const pick = (array) => array[Math.floor(fxrand() * array.length)];

const featuresPreBuild = () => {
  const baseSize = pick([100, 120, 120, 140, 140, 160, 160, 160]);

  const ground = fxrand() < 0.1;

  const smokeEnabled = fxrand() < 0.5;
  const smokeOffset = 0;
  const smokeSpeed = 0;
  const bwMode = ground || fxrand() < 0.1;

  const smokeLevel = smokeEnabled ? (fxrand() < .5 ? .5 : .75) : 0;
  const smokeFalloff = smokeEnabled && fxrand() < 0.33;
  const smoothNoise = smokeEnabled && fxrand() < 0.5;

  const sdfs = ground && fxrand() < 0.7 || fxrand() < 0.05;
  const sdf_sphere = sdfs && fxrand() < (ground ? 0.7 : 0.5);
  const metalScale = 1.0;

  let twist = fxrand() < 0.5 || (sdfs && !sdf_sphere);
  const twistIntensity = twist ? (fxrand() < 0.6 ? .5 : 1.) : 0.;
  const brightLine = twistIntensity >= 1. && fxrand() < 0.15;
  twist = true; // so that can edit in GUI

  const negativeTwist = twist && fxrand() < 0.5;

  const maxDist = '20.';

  const lookAt = '0, 2.15, 0';
  const zoom = '1.55';

  const defaultBrightness = 0.9;

  const reverseLight = fxrand() < 0.5;
  const lightFalloff = true;
  const lightBottom = !ground && lightFalloff && fxrand() < 0.5;

  const lightPosX = 34
  const lightPosY = lightBottom ? 0 : 20;
  const lightPosZ = 34;

  const staticSeed = fxrand();

  const ambientLightR = .25;
  const rimLightR = 0.0;
  const groundLight = 1.0;
  const keyLightR = 1.0 - ambientLightR - rimLightR;

  const fadeTop = ground || fxrand() < .9;

  const sat = 0.0;

  let features = {
    baseSize: baseSize,

    maxDist: maxDist,
    lightPosX: lightPosX,
    lightPosY: lightPosY,
    lightPosZ: lightPosZ,
    lightFalloff: lightFalloff,
    reverseLight: reverseLight,
    lookAt: lookAt,
    zoom: zoom,

    bwMode: bwMode,
    smokeFalloff: smokeFalloff,

    twist: twist,
    twistIntensity: twistIntensity,
    negativeTwist: negativeTwist,

    brightLine: brightLine,
    sdfs: sdfs,
    sdf_sphere: sdf_sphere,
    metalScale: metalScale,

    smokeLevel: smokeLevel,
    smokeOffset: smokeOffset,
    smokeSpeed: smokeSpeed,

    smokeEnabled: smokeEnabled,
    ground: ground,

    smoothNoise: smoothNoise,

    staticSeed: staticSeed,

    cameraZ: 10,
    cameraY: 0,
    fixedFocalDistance: 0, // need this for animation. otherwise focal distance twitches

    shapeAngle: 0,

    buildLevel: 1,

    vignette: true,
    blurEdge: true,
    dof: .10,

    rimLightR: rimLightR,
    ambientLightR: ambientLightR,
    keyLightR: keyLightR,
    groundLight: groundLight,

    ambientLight: ambientLightR,
    rimLight: ambientLightR + rimLightR,
    defaultBrightness: defaultBrightness,
    lightBrightness: defaultBrightness,

    fadeTop: fadeTop,

    sat: sat,
  }

  if (params.pinSettings) {
    let loaded = JSON.parse(localStorage.getItem('f'));
    let style = JSON.parse(localStorage.getItem('style'));
    styles[loaded.styleIndex] = style;

    for (const [key, value] of Object.entries(loaded)) {
      if (value != undefined) {
        features[key] = value;
      }
    }

  }

  return features;
}

const updateFeaturesPostBuild = (result) => {
  if (!params.pinSettings) {
    f.shapeAngle = selectAngle(result.eI);

    if (f.bwMode) {
      f.styleIndex = styles.bwStart + Math.floor(fxrand() * styles.bwLength);
    }
    else {
      f.styleIndex = Math.floor(fxrand() * styles.length);
    }

    // Custom for some unique styles
    const style = styles[f.styleIndex];
    if(style.lightBrightness) {f.lightBrightness = style.lightBrightness};
  }
}

const selectAngle = (eI) => {
  let twistIntensity = f.twistIntensity;
  let angle = 0;

  let tO = 0; // final twist offset

  if (f.twistIntensity != 0) {
    twistIntensity += f.staticSeed;
    twistIntensity = f.negativeTwist ? -1.0 * twistIntensity : twistIntensity;
    tO = twistIntensity * .4;
  }

  let angleReason = `${eI}`

  if (eI == 0) {
    angle = Math.PI / 2;
  } else if (eI == 1) {
    angle = -Math.PI / 2;
  } else if (eI == 2) {
    angle = Math.PI;
  } else if (eI == 3) {
    angle = 0;
  }

  const turn = Math.PI / 6;
  angle -= f.reverseLight ? -turn : turn;

  angle -= tO;

  if (f.reverseLight) {
    angleReason += ' (reversed)'
  }

  if (f.twistIntensity != 0) {
    angleReason += ` twist ${twistIntensity}`;
  }

  return angle;
}


const setFeaturesUniforms = () => {

  setUniform('realtime', '1i', params.realtime);
  setUniform('hq', '1i', params.hq);

  setUniform('shapeAngle', '1f', `${f.shapeAngle.toFixed(2)}`);
  setUniform('smokeEnabled', '1i', f.smokeEnabled);
  setUniform('smokeOffset', '1f', f.smokeOffset);
  setUniform('smokeSpeed', '1f', f.smokeSpeed);
  setUniform('smokeLevel', '1f', f.smokeLevel);

  setUniform('lightPosX', '1f', f.lightPosX);
  setUniform('lightPosY', '1f', f.lightPosY);
  setUniform('lightPosZ', '1f', f.lightPosZ);

  setUniform('reverseLight', '1i', f.reverseLight);

  setUniform('twist', '1f', f.twist);
  setUniform('twistIntensity', '1f', f.twistIntensity);

  setUniform('cameraZ', '1f', f.cameraZ);
  setUniform('cameraY', '1f', f.cameraY);


  setUniform('dof', '1f', f.dof);
  setUniform('fixedFocalDistance', '1f', f.fixedFocalDistance);

  setUniform('buildLevel', '1f', f.buildLevel);
  setUniform('metalScale', '1f', f.metalScale);

  setUniform('vignette', '1i', f.vignette);
  setUniform('blurEdge', '1i', f.blurEdge);
  setUniform('rimLight', '1f', f.rimLight);
  setUniform('groundLight', '1f', f.groundLight);
  setUniform('ambientLight', '1f', f.ambientLight);

  setUniform('fadeTop', '1i', f.fadeTop);

  let style = styles[f.styleIndex];
  setUniform('lightBrightness', '1f', f.lightBrightness);
  setUniform('white', '1f', style.white);
  setUniform('sat', '1f', f.sat);
  setUniform('warmCool', '1f', style.warmCool);
  setUniform('warmCoolBalance', '1f', style.warmCoolBalance);

  let a = [];
  let colors = style.colors;
  for (let i in colors) {
    const c = parseInt(colors[i][0] == '#' ? colors[i].split('#')[1] : colors[i], 16);
    a.push((c >>> 16) / 256.0);
    a.push(((c >>> 8) & 0xff) / 256.0);
    a.push((c & 0xff) / 256);
  }
  setUniform('colors', '3fv', a);
}


shaderFns.featuresHeader = () => {
  return `
    // Parms that are more about animation or exploring
    uniform bool realtime;
    uniform bool hq;

    uniform float lightPosX;
    uniform float lightPosY;
    uniform float lightPosZ;

    uniform bool reverseLight;

    uniform bool smokeEnabled;
    uniform float smokeOffset;
    uniform float smokeSpeed;
    uniform float smokeLevel;

    uniform float shapeAngle;

    uniform bool twist;
    uniform float twistIntensity;

    uniform float cameraZ;
    uniform float cameraY;
    uniform float fixedFocalDistance;

    uniform float buildLevel;
    uniform float metalScale;

    uniform bool vignette;
    uniform bool blurEdge;
    uniform float dof;

    uniform float rimLight;
    uniform float ambientLight;
    uniform float groundLight;

    // Params for the specific visual style
    uniform float white;
    uniform float sat;

    uniform float warmCool;
    uniform float warmCoolBalance;

    uniform float lightBrightness;

    uniform vec3 colors[5];

    uniform bool fadeTop;
  `;
}
