// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.light = (f) => {
  return `
    float diffuseIntensity(vec3 n, vec3 lr) {
      float diffuseFactor = ${f.mars ? '.5' : '.7'};
      float diffuse = diffuseFactor * dot(n, lr);
      return diffuse < 0. ? 0. : diffuse;
    }

    float specular(vec3 rc, vec3 light, vec3 p, vec3 n) {
      vec3 lr = normalize(light - p);
      vec3 cr = normalize(rc - lr);
      vec3 rL = normalize(reflect(-light, n));

      float spec = dot(rL, cr);
      return spec < 0. ? 0. : pow(spec, 64.);
    }

    float shadow(vec3 p0, vec3 r, int b, float mFirst) {
      float bound = .0001;
      if (b > 0 && mFirst == 0.) bound *= 10.;

      float s = 1., t = .004;
      for (int i = 0; i < 128 && t < ${f.maxDist}; i ++) {
        vec3 p = p0 + t * r;

        vec2 ss = shape(p);
        float v = ss.x, m = ss.y;

        if (m < WATER && dot(p, p) > ${f.topView ? '3. *' : ''} 7.02) break;
        if (v < bound) return 0.;

        s = min(s, 3. * v / t);
        t += v;
      }
      return s;
    }

    float ambientOcclusion(vec3 p, vec3 n, float occF) {
      float c = 0., v = 0., a = 1., step = .02;
      vec3 nstep = n * step;
      for (int i = 0; i < 3; i ++) {
        v += step; p += nstep; a *= .5;
        c += (v - shapeFloat(p)) * a;
      }
      return clamp(1. - c * occF * 25., 0.4, 1.);
    }
  `;
}
