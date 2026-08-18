// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

shaderFns.utils = () => {
  return `
    mat2 rotate(float a) {
      return mat2(cos(a), -sin(a), sin(a), cos(a));
    }

    vec3 saturation(vec3 color, float amount) {
      vec3 sat = vec3(dot(color, vec3(.21, .71, .08)));
      return mix(sat, color, amount);
    }

    vec3 hRay() {
      float u = 2. * rnd() - 1.;
      float phi = ${2 * Math.PI} * rnd();
      float a = sqrt(1. - u*u);
      return vec3(sin(phi) * a, cos(phi) * a, u);
    }

    vec3 hnRay(vec3 n) {
      vec3 h = hRay();
      return dot(h, n) < 0. ? -h : h;
    }

    vec3 hsv2rgb(float h, float s, float v) {
      vec3 p = abs(fract(vec3(h) + vec3(1., 2. / 3., 1. / 3.)) * 6. - vec3(3));
      return v * mix(vec3(1), clamp(p - vec3(1), 0., 1.), s);
    }

    vec3 rgb2hsv(vec3 rgb) {
      float M = max(rgb.r, max(rgb.g, rgb.b));
      float m = min(rgb.r, min(rgb.g, rgb.b));
      float d = M - m;

      float v = M;
      if (M <= m) {
        return vec3(0, 0, v);
      }

      float h = 0.;
      float s = d / M;

      if (rgb.r == M)
        h = (rgb.g - rgb.b) / d;
      else {
        if (rgb.g == M)
          h = 2. + (rgb.b - rgb.r) / d;
        else
          h = 4. + (rgb.r - rgb.g) / d;
      }
      h = fract(h / 6.);

      return vec3(h, s, v);
    }

    vec3 blendHSV(vec3 rgb, float L) {
      vec3 hsv = rgb2hsv(rgb);
      return hsv2rgb(hsv.x, hsv.y, L);
    }
  `;
}
