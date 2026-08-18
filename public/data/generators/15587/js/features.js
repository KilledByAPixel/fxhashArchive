// Cradle
// Copyright (c) 2022 Monotau

"use strict";

const pick = (array) => array[Math.floor(fxrand() * array.length)];

const pick1n = (array) => {
  const v = pick(array);
  return fxrand() < 0.5 ? v : 1 - v;
}

const features = () => {
  // planets
  const ENCELADUS = 'enceladus', MARS = 'mars', DESERT = 'desert', EARTH = 'earth';

  const planet =
    fxrand() < 0.2 ? ENCELADUS : (fxrand() < 0.2 ? MARS : (fxrand() < 0.2 ? DESERT : EARTH));
  const enceladus = planet == ENCELADUS;
  const mars = planet == MARS;
  const desert = planet == DESERT;
  const earth = planet == EARTH;

  // environments
  let ice, water;
  if (mars) {
    ice = water = fxrand() < 0.3;
  }
  else if (enceladus) {
    ice = true;
    water = false;
  }
  else if (desert) {
    water = ice = false;
  }
  else {
    ice = false;
    water = fxrand() < 0.5;
  }
  const snow = earth && fxrand() < 0.5;
  const dusk = earth && fxrand() < 0.3;

  // sun intensity
  const sunPower = {
    earth: dusk ? '100.' : '200.', mars: '600.', desert: '300.', enceladus: '300.'
  }[planet];

  // colors
  const terrainColor = {
    earth: 'vec3(.16, .156, .152)',
    mars: 'vec3(.225, .18, .162)',
    enceladus: 'vec3(.2, .208, .232)',
    desert: 'vec3(.255, .229, .201)'
  }[planet];

  const structureColor = {
    earth: `vec3(.2928, .2856, .2784)`,
    mars: 'vec3(.3024, .2688, .2415)',
    enceladus: 'vec3(.2639, .2626, .2704)',
    desert: 'vec3(.2323, .2218, .2102)'
  }[planet];

  const skyColor = {
    earth: 'vec3(.98, 1, 1.04)' + (snow ? ' * .93' : ''),
    mars: 'vec3(1.1, .8, .73)',
    enceladus: 'vec3(1.)',
    desert: 'vec3(1.04, 1.02, 1.)'
  }[planet];

  // moss
  const moss = fxrand() >= 0.5;

  // shape ...
  const angleBox = fxrand() < 0.1 ? fxrand() - 1 : 1.3 * fxrand() - 1.;
  const hugeBox = angleBox >= 0.4;
  const sphere = angleBox < 0.2 && fxrand() < 0.33;
  let decayFrame = fxrand() < 0.3;

  // views
  const topViewProb = earth ? 0.25 : (enceladus ? 0.15 : 0.2);
  const topView =
    (earth || decayFrame && hugeBox || !decayFrame && !earth) &&
    (angleBox > -0.7 || sphere) && fxrand() < topViewProb;
  const groundView = !hugeBox && !topView && fxrand() < 0.25;
  const closeView = !groundView && !topView && fxrand() < 0.33;

  if (topView && (earth || mars)) water = ice = false;

  // levels
  const groundLevel = groundView ? 0.01 : fxrand() * 0.25 + (enceladus ? 0.15 : -0.25);
  const lowFogOffset = enceladus && !groundView ? '.15' : (topView && earth ? '.9' : '.8');
  const waterOffset = groundLevel + (
    groundView ? (enceladus ? 1.18 : 1.05) : ice ? (enceladus ? .65 : 1.05) : .98
  );

  // scene
  const maxDist = topView && !enceladus ? '25.' : '12.';
  const angleX =
    topView ? -0.9 :
    (closeView ? -0.2 : (groundView ? 0.2 : -fxrand() * 0.4));
  const cameraY = topView && enceladus && !sphere ? '.4' : '0.';
  const cameraZ = groundView || closeView ? '2.8' : '3.05';
  const fov = !groundView && (topView || enceladus || fxrand() < 0.5) ? 85.1 : 75.1;

  // grayscale
  const bwMode = !mars && fxrand() < 0.2;

  // ... shape
  const circularShape = fxrand() < 0.4;
  const modifiedFrame = circularShape ? true : fxrand() < 0.8;
  const boxGridSize = Math.floor(fxrand() * 3) * 5 + 10;
  const boxSize = boxGridSize >= 20 ? '2.' : (boxGridSize == 15 && fxrand() < 0.5 ? '2.' : '.4');

  const twistZinit = fxrand() < 0.5;
  let twistZ = fxrand() < 0.5;
  const twistY = fxrand() < 0.2;
  const twistX = fxrand() < 0.1;
  const twistYsign = fxrand() < 0.5 ? 1 : -1;
  const twistXY = !twistX && !twistY && !twistZ && fxrand() < 0.7;
  const negativeTwist = fxrand() < 0.5;

  const twistZint = fxrand();
  const twistYint = fxrand();
  const twistXint = fxrand();

  const angleFrame = modifiedFrame && fxrand() < 0.5 ? Math.PI/2 : 0;

  const stepXZ = pick1n([0, 0.1, 0.125, 0.2, 0.25, 0.3]);
  if (stepXZ > 0 && stepXZ < 1) twistZ = false;

  const stepXYpicks = hugeBox ? [0] : (
    circularShape ? [0, 0, 0.1, 0.2, 0.25, 0.3, 0.4] : [0, 0, 0, 0.125, 0.2, 0.25, 1]
  );
  let stepXY = pick(stepXYpicks);
  if (groundView) stepXY = -stepXY;

  const stepYZ = pick(stepXYpicks) * (fxrand() < 0.5 ? 1 : -1);
  const flipXY = (topView ||
    !groundView &&
    (!circularShape || Math.abs(stepXZ) > 0.3 || Math.abs(stepXY) > 0.3 || Math.abs(stepYZ) > 0.3)
  ) && fxrand() < 0.5;

  // reduce decayFrame probability if flipXY
  if (flipXY && decayFrame) decayFrame = fxrand() < 0.4;

  // terrain
  const sparseTerrain =
    earth && (!groundView || snow && water) && (topView || sphere && !snow || fxrand() < 0.66);
  if (earth && !sparseTerrain) water = false;

  // fog
  const lowFog = enceladus || dusk || (earth && fxrand() < 0.5);

  // light
  const lightPos =
    `${fxrand() < 0.5 ? '-' : ''}13., ${dusk && !topView ? '2.5' : (topView ? '10.' : '5.')}, 18.0`

  // shadows
  const shadowSharpness =
    mars || (earth && !snow && fxrand() < 0.5) ? '15.' : (enceladus ? '60.' : '5.6');

  // all features
  const features = {
    earth: earth,
    mars: mars,
    desert: desert,
    enceladus: enceladus,
    ice: ice,
    water: water,
    snow: snow,
    dusk: dusk,
    sunPower: sunPower,
    moss: moss,
    terrainColor: terrainColor,
    structureColor: structureColor,
    skyColor: skyColor,
    topView: topView,
    groundView: groundView,
    closeView: closeView,
    groundLevel: groundLevel,
    lowFogOffset: lowFogOffset,
    waterOffset: waterOffset,
    maxDist: maxDist,
    angleX: angleX,
    cameraY: cameraY,
    cameraZ: cameraZ,
    fov: fov,
    bwMode: bwMode,
    circularShape: circularShape,
    modifiedFrame: modifiedFrame,
    boxGridSize: boxGridSize,
    boxSize: boxSize,
    twistZinit: twistZinit,
    twistZ: twistZ,
    twistY: twistY,
    twistX: twistX,
    twistYsign: twistYsign,
    twistXY: twistXY,
    negativeTwist: negativeTwist,
    twistZint: twistZint,
    twistYint: twistYint,
    twistXint: twistXint,
    angleFrame: angleFrame,
    angleBox: angleBox,
    sphere: sphere,
    decayFrame: decayFrame,
    stepXZ: stepXZ,
    stepXY: stepXY,
    stepYZ: stepYZ,
    flipXY: flipXY,
    sparseTerrain: sparseTerrain,
    lowFog: lowFog,
    lightPos: lightPos,
    shadowSharpness: shadowSharpness
  };

  let terrain = 'Mountains';
  if (desert) terrain = 'Desert';
  else if (mars && ice) terrain = 'Mountains & dry ice';
  else if (enceladus) terrain = 'Ice';
  else if (earth) {
    if (snow) terrain = 'Snowy mountains'
    if (water) terrain += ' & lakes';
  }

  // fxhash features
  const fxhashFeatures = {
    Location: desert ? 'Earth' : planet[0].toUpperCase() + planet.slice(1),
    Terrain: terrain,
    View: topView ? 'Top' : (groundView ? 'Ground' : 'Standard'),
    Structure: modifiedFrame ? (circularShape ? 'N frame' : 'Square frames') : 'Box frame',
    Grid: boxGridSize,
    Moss: moss,
    Melted: decayFrame,
    Sphere: sphere,
    Grayscale: bwMode,
    Daylight: !dusk,
  };

  console.table(fxhashFeatures);
  window.$fxhashFeatures = fxhashFeatures;

  return features;
}
