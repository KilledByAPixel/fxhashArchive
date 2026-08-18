// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

const transitionList = (lambda, nStates) => {
  let l = Math.floor(lambda * 256);
  let size = (nStates ** 6 - 1) / (nStates - 1);
  let transitions = new Uint8Array(size);

  let r = 0;
  for (let i = 1; i < size; i++) {
    if (r == 0) r = R();
    if ((r & 0xff) < l) {
      transitions[i] = R() % (nStates - 1) + 1;
    }
    r >>>= 8;
  }

  return transitions;
}

const randomFirstLayer = (nStates, baseSize, gs, gh) => {
  let values = new Uint8Array(gs ** 2 * gh);
  let p = 0;

  let hgs = gs / 2;
  let has = baseSize / 2;
  for (let i = 0; i < gs; i++) {
    for (let j = 0; j < gs; j++, p++) {
      if (i >= hgs - has && i < hgs + has && j >= hgs - has && j < hgs + has) {
        values[p] = R() % nStates;
      }
      else {
        values[p] = 0;
      }
    }
  }

  return values;
}

const build = (transitions, values, gs, nStates, gridHeightMin, gridHeightMax) => {
  let pIndex = gridHeightMin * gs ** 2;
  let p = pIndex + gs ** 2;

  const n1 = nStates;
  const n2 = nStates ** 2;
  const n3 = nStates ** 3;
  const n4 = nStates ** 4;


  for (let i = gridHeightMin; i < gridHeightMax; i++) {
    for (let j = 0; j < gs; j++) {
      for (let k = 0; k < gs; k++, pIndex++, p++) {
        let tIndex = values[pIndex];

        let v = k > 0 ? -1 : gs - 1;
        tIndex += values[pIndex + v] * n1;

        v = k < gs - 1 ? 1 : -(gs - 1);
        tIndex += values[pIndex + v] * n2;

        v = j > 0 ? -gs : (gs - 1) * gs;
        tIndex += values[pIndex + v] * n3;

        v = j < gs - 1 ? gs : -(gs - 1) * gs;
        tIndex += values[pIndex + v] * n4;

        values[p] = transitions[tIndex];
      }
    }
  }
  return values;
}

const expand = (table, size, height) => {
  const coords = (i, j, k) => size ** 2 * i + size * j + k;

  let output = new Uint8Array(size ** 2 * height);

  for (let i = 0, p = 0; i < height; i++) {
    for (let j = 0; j < size; j++) {
      for (let k = 0; k < size; k++, p++) {
        if (table[p]) {
          for (let z = -1; z <= 1; z++) {
            for (let y = -1; y <= 1; y++) {
              for (let x = -1; x <= 1; x++) {
                output[coords(i + z, j + y, k + x)] = 1;
              }
            }
          }
        }
      }
    }
  }
  return output;
}

const downsample = (table, size, height, f) => {
  const s = size >> f;
  let output = new Uint8Array(s ** 2 * (height >> f));

  for (let i = 0, p = 0; i < height; i++) {
    let id = (i >> f) * s * s;
    for (let j = 0; j < size; j++) {
      let jd = (j >> f) * s;
      for (let k = 0; k < size; k++, p++) {
        if (table[p]) {
          output[id + jd + (k >> f)] = 1;
        }
      }
    }
  }
  return output;
}

const assignColors = (values, nStates, gridSize, numColors = 5) => {
  const steps = 10;
  const iStep = Math.floor(gridSize / steps);

  let stateCnt = new Uint32Array(nStates);

  for (let i = 1; i < steps; i++) {
    let index = values.length - (i * iStep) * gridSize ** 2;
    for (let j = 0; j < gridSize ** 2; j++, index++) {
      const state = values[index];
      if (state) {
        stateCnt[state]++;
      }
    }
  }

  const states = [...Array(nStates).keys()].sort((a, b) => stateCnt[a] > stateCnt[b] ? -1 : 1);
  const stateColors = {}
  for (let i in states) {
    stateColors[states[i]] = i % numColors + 1;
  }

  for (let i = 0; i < values.length; i++) {
    if (values[i]) {
      values[i] = Math.floor(stateColors[values[i]] * 255 / nStates);
    }
  }
}
