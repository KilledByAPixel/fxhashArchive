// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.utils = () => {
  return `
    float smin(float a, float b, float k) {
      float d = a - b;
      return (a + b - sqrt(d * d + k)) * .5;
    }

    vec3 saturation(vec3 color, float amount) {
      vec3 sat = vec3(dot(color, vec3(.21, .71, .08)));
      return mix(sat, color, amount);
    }

    vec3 hRay() {
      float u = 2. * randNew() - 1.;
      float phi = ${2 * Math.PI} * randNew();
      float a = sqrt(1. - u*u);
      return vec3(sin(phi) * a, cos(phi) * a, u);
    }

    vec3 hnRay(vec3 n) {
      vec3 h = hRay();
      return dot(h, n) < 0. ? -h : h;
    }
  `;
}
