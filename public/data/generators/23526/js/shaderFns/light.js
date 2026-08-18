// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

shaderFns.light = (f) => {
  return `
    float diffuse(vec3 n, vec3 lr) {
      return max(dot(n, lr), 0.);
    }

    float diffuseSS(vec3 n, vec3 lr) {
      return max((dot(n, lr) + .5) / 1.5, 0.);
    }

    float specular(vec3 rc, vec3 light, vec3 p, vec3 n) {
      vec3 lr = normalize(light - p);
      vec3 cr = normalize(rc - lr);
      vec3 rL = normalize(reflect(-light, n));
      float spec = dot(rL, cr);
      return spec < 0. ? 0. : pow(spec, ${f.sdf_sphere ? '100.' : '4.'});
    }

    bool shadow(vec3 p0, vec3 r, bool smoke) {
      float t = .01;
      for (int i = 0; i < 512 && t < ${f.maxDist}; i ++) {
        vec3 p = p0 + t * r;

        vec2 vm = shape(p, smoke);
        if (vm.x < .0001) return true;

        t += vm.x;
      }
      return false;
    }

    bool shadowFull(vec3 p, vec3 r) {
      bool s = shadow(p, r, false);
      if(smokeEnabled) {
        if (realtime) return s;

        if (s) return true;
        return shadow(p, r, true);
      } else {
        return s;
      }
    }

    float lightIntensity(vec3 p, vec3 light) {
      float c = 2., f = 7.2;
      return c * (1. - clamp(distance(p, light * .1), 0., f) / f);
    }
  `;
}
