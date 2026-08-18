// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.copy = (f) => {
  return `
    void copyToCanvas() {
      vec3 c = texelFetch(tex, ivec2(gl_FragCoord.xy), 0).xyz;
      vec2 u = uv * (1. - uv);

      float v = .4 + .6 * pow(min(u.x * u.y * 90., 1.), .2);
      c = min(c * v + .16 * pow(u.x * u.y * 37., .2) - .05, 1.);

      ${f.bwMode ? 'c = clamp(vec3(dot(vec3(.3, .6, .1), c)), 0., 1.);' : ''}

      fragColor = vec4(c, 1.);
    }
  `;
}
