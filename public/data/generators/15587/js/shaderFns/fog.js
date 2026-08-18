// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.fog = (f) => {
  return `
    float skyNoise3d(vec3 p) {
      p.y = 1.5 * min(p.y, p.x + 20.);
      return fnoise3d(p);
    }

    float fogSky(vec3 p) {
      ${f.desert ? `
        return .6 + pow(skyNoise3d(p), .5) * .3;
      ` : `
        return min(.8 + pow(max(skyNoise3d(.5 * p) - .3, 0.), 3.) * 2., 1.);
      `}
    }

    vec3 fog(vec3 c, vec3 p, float t, bool mirror) {
      float f = 0.;
      vec3 fogColor = ${f.skyColor}${f.dusk ? ' * .4' : ''};
      if (mirror) p *= ${f.topView ? '.1' : '.25'};

      if (t < ${f.maxDist}) {
        ${f.earth ? 'fogColor = saturation(fogColor, .7);' : ''};
        f = pow(fnoise3d(p) + .8, .6) * .6;
        ${f.enceladus ? 'fogColor *= mix(.8, .1, clamp(p.y, .4, .7));' : ''}
      }
      else {
        if (mirror) fogColor *= .9;
        f = ${f.mars ? '.9' : (f.enceladus ? '.15' : 'fogSky(p)')};
      }
      fogColor = min(f * fogColor, 1.);

      float k =
        smoothstep(0., 1., (t - 1.) / ${f.topView ? '30.' : '20.4'} - ${f.mars ? '.02' : '.05'});
      float fm = exp2(-8. * k);
      c = mix(fogColor, c, fm);

      return c;
    }

    vec3 lowFog(vec3 color, vec3 p, float t) {
      float level = ${f.groundLevel} + ${f.lowFogOffset} - .05;
      if (p.y < -level) {
        color = mix(
          color,
          ${f.dusk ? `${f.skyColor} - ` : ''}vec3(pow(fnoise3d(p), .2)),
          clamp(-(p.y + level) * t * ${f.enceladus ? '.4' : '.5'}, 0., .8)
        );
      }
      return color;
    }

    vec3 addSkyColor(vec3 color, vec3 mColor, vec3 p, float mFirst, float m) {
      ${!f.enceladus ? `
        // apply sky color to materials
        if (mFirst > 0.) {
          vec3 sky =
            ${f.mars ? '.756' : '(mFirst == WATER ? 1.53 : 1.17)'} * ${f.skyColor};
          ${f.mars ? '' : 'sky *= (mFirst == WATER) ? .6 * (.1 + .7 * skyNoise3d(p)) : fogSky(p) * .7;'}
          ${f.dusk ? 'if (mFirst == MIRROR) sky *= .4;' : ''}
          color += mColor * sky;
        }
        else {
          color +=
            mColor * (.5 + (m == 0. ? 1. : 0.)) * ${f.mars ? '' : 'fnoise3d(4. * p) *'}
            ${f.skyColor} * ${f.mars ? '.2' : (f.desert ? '(m == TERRAIN ? .2 : .5)' : '.5')};
        }
      ` : `
        color += m == TERRAIN ? .34 : (mFirst == 0. ? .1 : .0);
      `}
      return color;
    }
  `;
}
