// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.terrain = (f) => {
  return `
    float marsTerrainNoise(vec2 p) {
      float ta = 0., a = 1., s = 0.;
      for (int i = 0; i < 3; i ++) {
        ta += noise2dSmoother(p) * a;
        p *= 2.; s += a; a *= .5;
      }
      ta = .5 * (ta / s) + .2;

      float tb = 0.;
      for (int i = 0; i < 5; i ++) {
        tb += noise2dSmoother(p) * a; p *= 2.; s += a; a *= .5;
      }
      tb = .9 * pow(tb / s, 1.2) + .5;

      return 1.7 * smin(ta, tb, .1) + .4;
    }

    float enceladusTerrainNoise(vec2 p) {
      p *= 2.;
      float v = 0., a = 1., s = 0.;
      for (int i = 0; i < 10; i ++) {
        v += noise2d(p) * a;
        p *= 2.; s += a; a *= .5;
      }
      v /= s;

      return max(pow(v, 2.), .3) + v * .15 ${f.groundView ? '+ .5' : '- .1'};
    }

    float waterNoise(vec2 p) {
      vec2 p0 = p;
      p *= 80.;
      float v = 0., a = 1., s = 0.;
      for (int i = 0; i < 3; i ++) {
        v += noise2d(p) * a;
        p *= 2.; a *= .45; s += a;
      }
      return v / s * ${f.ice ? '.1' : '.05 * (.55 + .5 * sin(p0.x * 2.6))'};
    }

    float ssin(float f) {
      f += staticSeed * 4.;
      float n = noise2d(vec2(f));
      return (sin(f + n) + sin(2. * f + n) * .5 + sin(4. * f + n) * .25) * .6;
    }

    float dune(vec2 p0) {
      return abs(.15 * ssin(3. * p0.x) * (1.2 + .2 * ssin(p0.y)) + .2 * ssin(2. * p0.y));
    }

    float desertTerrainNoise(vec2 p0) {
      vec2 p = p0;
      p *= 10.;

      float v = 0., a = 1., s = 0.;
      for (int i = 0; i < 4; i ++) {
        v += noise2dSmoother(p) * a;
        p *= 2.; s += a; a *= .5;
      }

      p0 *= .5;
      return 1.4 * (
        dune(p0) + dune(1.4 * p0) * .5 + dune(3. * p0) * .25
      ) + randNew() * .002
        + .01 * (v / s)
        + .0004 * sin(800. * p0.y) * noise2dSmoother(3. * p0) + .65;
    }

    float earthTerrainNoise(vec2 p) {
      ${f.sparseTerrain ? 'p *= .4;' : ''}
      vec2 p0 = p;
      p *= 2.;
      float v = 0., a = 1., s = 0.;
      for (int i = 0; i < 3; i ++) {
        v += noise2dSmoother(p + 2.) * a;
        p *= 2.; s += a; a *= .5;
      }
      for (int i = 0; i < ${f.snow ? '6' : '7'}; i ++) {
        v += noise2d(p + 2.) * a ${f.snow && !f.groundView ? '' : '* (i >= 4 ? 1.3 : 1.)'};
        p *= 2.; s += a; a *= .5;
      }
      s -= 1.;
      return ${
        f.sparseTerrain ?
          'pow(v / s, .26) * 2. - 1.' :
          (f.topView ?
            '.26 - ssin(noise2d(p0) * 2.) * .5 + pow(v / s, .26) - .05' :
            'pow(v / s, .26) - .05'
          )
      };
    }

    float terrainNoise(vec2 p) {
      return ${
        f.desert ? 'desertTerrainNoise' : (
          f.mars ? 'marsTerrainNoise' :
          (f.enceladus ? 'enceladusTerrainNoise' : 'earthTerrainNoise')
        )
      }(p);
    }
  `;
}
