// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

shaderFns.copy = (f) => {
  return `
    void copyToCanvas(vec2 res) {
      vec4 t = texelFetch(tex, ivec2(gl_FragCoord.xy), 0);
      vec3 c = blendHSV(t.xyz, t.w * 6.);

      vec2 uv = gl_FragCoord.xy / res;
      vec2 u = .95 * (uv + .03);
      u = u * (1. - u);

      float v = 1.;
      if(vignette) {
        v = pow(min(pow(u.x, 1.5) * u.y * 120., 1.), .2);
        v *= pow(min(u.y * 10., 1.), .8);
      }

      c = min(c * v + .07 * pow(u.x*u.y*37., .2 * rand2static(uv) + .1) - .05, 1.);

      ${f.ground ? 'c = clamp(vec3(dot(vec3(.3, .6, .1), c)), 0., 1.);' : ''}

      if(vignette) {
        float vn = length(uv-.5);
        c -= .1  * smoothstep(.4, 1., vn);
      }

      fragColor = vec4(pow(clamp(c, 0., 1.), vec3(1.2)), 1.);
    }
  `;
}
