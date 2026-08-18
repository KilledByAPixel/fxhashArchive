// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.color = (f) => {
  return `
    vec3 colorWater(vec3 p) {
      float v = (1. - terrainNoise(p.xz)) * 5.;
      float a = shapeFrame(p);
      v += clamp(.9 - pow(a, 2.), .0, .9) * .7;
      vec3 c = vec3(.58, .58, .6);
      return clamp(v * c, 0., 1.) * (.7 + ${f.angleX});
    }

    vec3 colorMoss(vec3 n, float _shadow, float ambOcc) {
      vec3 c = ${f.structureColor};
      if (ambOcc >= .7) return c;

      float g = .12 * pow(_shadow, .5);

      ${f.mars ?
        'c.r += g * 3.;' :
        (f.enceladus ? 'c += vec3(-g, 0, g); c *= 2.;' : 'c.g += g * 1.3;')
      }
      c.r += g * .24;
      ${f.earth ? 'if (n.y > 0.5)' : ''}
        c = saturation(c, ${f.desert || f.earth && f.groundView ? '1.2' : '1.6'});

      return c;
    }

    vec3 colorMaterial(
      vec3 p, vec3 n, float m, float t, float diffuse, float _shadow, float ambOcc, bool useAmbient
    ) {

      vec3 color;

      if (m == MIRROR) {
        color = vec3(${f.enceladus ? '.1' : '0'});
      }
      else if (m == WATER) {
        color = colorWater(p);
      }
      else if (m == TERRAIN) {
        color = ${f.terrainColor};
      }
      ${f.moss ? `
        else if (m == MOSS && diffuse < .5 && p.z > .3) {
          color = colorMoss(n, _shadow, ambOcc);
        }
      ` : ''}
      else {
        color = ${f.structureColor};
        if (m == BOXES) {
          if (diffuse < .5 && p.z > .3 && _shadow == 0.) color *= 1.2;
        }
      }

      // ice
      ${f.ice ? `
        vec3 iceColor = vec3(${f.enceladus ? '.6, .78, .96' : '.9'});
        if (m == TERRAIN) {
          float vy = ${f.waterOffset} - .01;
          ${f.enceladus ? 'vy += randNew() * .4 - .4;' : ''}
          if (p.y < -vy) color = mix(color, iceColor, .3 * smoothstep(0., .02, -p.y - vy));

          vy =
            ${f.waterOffset} -
            .15 * waterNoise(.4 * p.xz) ${f.enceladus ? '- randNew() * .04' : ''};
          ${f.enceladus ? 'vy -= .2;' : ''}

          if (p.y < -vy + randNew() * .02 && waterNoise(.2 * p.xz) < .06 + randNew() * .06) {
            color = (.5 + .5 * waterNoise(.2 * p.xz)) * iceColor;
          }
        }

        if (m == WATER) {
          color = iceColor * (2. + .8 * waterNoise(.2 * p.xz)) * .28;
        }
      `: ''}

      //
      ${f.earth ? `
        if (m == BOXES) {
          vec3 c = vec3(1);
          if (n.y > .85 - noise2d(p.xz * 2. + 1.) * .1) {
            c *= vec3(1.1, 1.05, 1.04) * noise2d(4. * p.xz) * 3.;
          }
          else if (n.y < .55) {
            c *= vec3(1.1, 1.05, 1.04) * (1. - randNew());
          }
          color *= .5 + .4 * c;
        }
      ` : ''}

      // snow
      ${f.snow ? `
        if (m == TERRAIN || m == BOXES || m == MOSS) {
          if (n.y > .65 - noise2d(p.xz * 2.) * .3) {
            color = vec3(.25, .25, .255);
          }
        }
      ` : ''}

      // vegetation + snow
      ${!f.snow && f.earth ? `
        float sl = ${-f.waterOffset} + .2;
        bool showSnow =
          p.y > sl - randNew() * .06 - noise2d(p.xz * 5.) * .1 + ${f.sparseTerrain ? '.22' : '.14'};

        if (m == TERRAIN) {
          color *= vec3(.816, .8, .8);
          if (showSnow) {
            if (n.y > .5) {
              color = vec3(.35, .35, .357);
            }
            else if (n.y < .3) {
              color = vec3(.0948, .0936, .0924);
            }
          }
          else {
            float nl = noise2d(p.xz * 2.);
            if (p.y < sl ${f.sparseTerrain ? '+ .14' : '- .05'} * randNew() &&
                n.y > .75 - nl * .3 && n.y < .8) {
              color = vec3(.124 * (.05 * nl + .95), .122, .118) * (.6 + .4 * nl);
            }
            else if (n.y >= .9) {
              color = vec3(.0648 + sin(400. * nl) * .003, .072, .063 - sin(500. * nl) * .003);
            }
            else if (n.y > .84) {
              color = vec3(
                .09 + sin(200. * nl) * .003, .086, .0819 - sin(300. * nl) * .003
              ) * 1.8;
            }
            if (n.z >= .4 && n.z <= .6) {
              color = color - .05;
            }
            if (ambOcc <= .95) {
              color.r *= 1.03;
            }
            color *= 1.1;
          }
          ${f.dusk ?
            `color *= ${f.topView ? '1.25' : '1.2'};` :
            (f.lowFog ? 'color *= .95;' : '')
          }
        }
        if (showSnow && (m == BOXES || m == MOSS)) {
          if (n.y > (m == MOSS && t < 2. ? .9 : .65) - noise2d(p.xz * 2.) * .3) {
            color = vec3(.25, .25, .255);
          }
        }
      ` : ''}

      //
      ${!f.snow && f.earth ? `
        if (m == TERRAIN) {
          if (ambOcc > .95 && ambOcc < 1. && n.y < .5) color *= .6;
        }
      ` : ''}

      // sand over the structure
      ${f.desert || f.mars ? `
        if (m == BOXES || m == MOSS) {
          if (n.y > .65 - noise2d(p.xz * 2.) * .3) {
            color = ${f.terrainColor};
          }
        }
      ` : ''}

      // shoreline
      ${!f.snow && f.water && f.earth ? `
        if (m == TERRAIN && n.y > .9 && p.y < ${-f.waterOffset} + .002) {
          color = mix(color, ${f.structureColor}, .4);
        }
      ` : ''}

      float shadowFactor = ${f.enceladus ? '.35' : (f.dusk ? '.5' : (f.mars ? '.6' : '.55'))};
      if (useAmbient) {
        shadowFactor *= ${f.mars ? '1.1' : (f.snow ? '1.3' : '1.2')};
      }
      color *= min(shadowFactor + ${f.shadowSharpness} *  _shadow, 1.);

      return color;
    }

    vec3 colorLight(
      vec3 rc, vec3 light, vec3 p, vec3 n, float m, float _shadow, float ambOcc, bool useAmbient
    ) {

      bool useSpecular = ${
        f.mars && f.moss ?
          'false' :
          `_shadow > 0. && m != TERRAIN ${f.enceladus ? '&& m != MIRROR' : ''}`
      };

      float amb = ${
        f.topView || f.enceladus && f.groundView ?
          `m == TERRAIN ?
            ${f.topView && f.enceladus ? '.6' :
            (f.snow ? '.5' : (f.desert ? '.68' : '.73'))} : 1.`
        : '1.'};

      vec3 lr = normalize(light - p);
      vec3 lColor = vec3(
        diffuseIntensity(n, lr) + (useSpecular ? specular(rc, light, p, n) : 0.)
      );

      if (useAmbient) {
        lColor +=
          amb * (m == TERRAIN ?
            ${
              f.topView || (f.earth && !f.snow) ? '1.4' : (f.enceladus || f.mars ? '1.1' : '1.')
            } : .75
          );
        lColor *= (${f.mars ? '1.7' : '1.9'} + .5 * _shadow);
      }
      else {
        lColor *= 3.2 + 1.6 * _shadow;
        ${f.desert ? 'if (m == TERRAIN) amb *= .7;' : ''}

        lr = hRay();
        if (m == TERRAIN && lr.y < 0.) lr = -lr;
        lColor +=
          vec3(diffuseIntensity(n, lr)) * 9. * amb ${f.earth ? '' : `* (.5 + .5 * ${f.skyColor})`};
      }
      lColor *= ambOcc;

      if (m == MIRROR ${f.ice ? '' : '|| m == WATER'}) {
        lColor = (m == WATER ? .5 : .2) + ${f.enceladus ? '.5' : '.3'} * lColor;
      }

      return lColor;
    }
  `;
}
