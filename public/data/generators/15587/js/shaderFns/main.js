// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.main = (f, size) => {
  const AMBIENT_FRAMES = 5;
  const BOUNCES = f.earth && f.water && f.sphere ? 5 : 3;

  const mat2angleX = mat2rotate(f.angleX);

  return `
    uniform int iteration;
    uniform bool copy;

    vec3 intersect(vec3 c, vec3 r, int b, float t, float mFirst) {
      bool bm = b == 0 || mFirst > 0.;
      for (int i = 0; i < 512 && t < ${f.maxDist}; i ++) {
        vec3 p = c + t * r;

        vec2 s = shape(p);
        float v = s.x, m = s.y;

        if (v < .0001)
          return vec3(v, t, m);

        float mt = (
          bm && (m == BOXES || m >= WATER) ?
            (b == 0 && (
              m == BOXES ${f.enceladus ? '|| m == TERRAIN' : ''}
            ) && abs(p.z - c.z) < ${f.enceladus ? '2.' : '1.2'} ? .2 : .3) : .9
        );
        t += v * mt;
        if (i > 128) t += .001 * randNew();
      }

      return vec3(0);
    }

    void main()
    {
      uv = gl_FragCoord.xy / vec2(${size});

      // copy to canvas and exit
      if (copy) {
        copyToCanvas();
        return;
      }

      uv += (vec2(randNew(), randNew()) - .5) / vec2(${size});

      bool useAmbient = iteration < ${AMBIENT_FRAMES};
      vec3 light = vec3(${f.lightPos});

      vec3 rc = vec3(0, ${f.cameraY}, ${f.cameraZ});
      vec3 rr = normalize(vec3((uv - .5) * 2., -1. / tan(radians(${f.fov}) * .5)));

      // rotate view
      rc.yz *= ${mat2angleX};
      rr.yz *= ${mat2angleX};

      // dof
      float s = .02;
      vec2 r = .3 * (vec2(randNew(), randNew()) - .5);
      rc.xy += r * s;
      rr.xy += normalize(rr * 1.8 - vec3(r, 0)).xy * s;

      // prepare for the main loop
      float t = .2;
      float tFinal = ${f.maxDist};
      vec3 pFinal = rc + tFinal * rr;

      float mFirst = 0.;
      float m, mPrev = 0.;

      mcGlobal.yz = rc.yz;

      vec3 tColor = vec3(0);
      vec3 mColor = vec3(1);

      vec3 p;
      int bb = ${BOUNCES - 2};

      // main loop
      for (int b = 0; b + bb < ${BOUNCES}; b ++) {
        if (b >= 3 && (m != WATER && m != MIRROR)) break;
        mPrev = m;

        vec3 iv = intersect(rc, rr, b, t, mFirst);
        float v = iv.x;
        t = iv.y, m = iv.z;
        p = rc + t * rr;

        if (mFirst == 0. && (m == WATER || m == MIRROR)) mcGlobal.x = mFirst = m;

        if (t == 0.) {
          if (mFirst == MIRROR && b == 1) {
            tFinal = ${f.maxDist}; pFinal = rc + tFinal * rr;
          }
          break;
        }
        if (b == 0 || mFirst == MIRROR && b == 1) {
          pFinal = p; tFinal = t;
        }

        // light
        float _shadow = m == MIRROR ? 1. : shadow(p, normalize(light - p), b, mFirst);

        vec3 n = normal(p, v);
        float diffuse = dot(n, normalize(light - p));

        float occF = .8;
        if (m == MOSS && diffuse > .5 && _shadow == 0. && p.z > .3) {
          occF = 1.4;
        }

        if (useAmbient) occF *= .75;
        float ambOcc = ambientOcclusion(p, n, occF);

        // color
        vec3 color = colorMaterial(p, n, m, t, diffuse, _shadow, ambOcc, useAmbient);
        vec3 lColor = colorLight(rc, light, p, n, m, _shadow, ambOcc, useAmbient);

        // sun trace
        if (_shadow > 0.) {
          color = mix(
            color,
            vec3(1),
            min(3. * pow(max(dot(normalize(light - p), rr), 0.), ${f.sunPower} * .125), 1.)
          );
        }

        //
        rc = p;
        t = .01;
        if (${f.enceladus ? 'false' : `${f.mars && f.ice ? 'm == WATER || ' : ''}m == TERRAIN`}) {
          rr = hnRay(n);
        }
        else if (
          m == MIRROR || m == WATER ||
          randNew() < ${f.enceladus ? '(m == TERRAIN ? .2 : .8)' : (f.moss ? '.6' : '.8')})
        {
          rr = normalize(reflect(rr, n));
        }
        else {
          rr = hnRay(n);
        }

        if (m == MIRROR || m == WATER) {
          if (bb > 0) bb --;
          mColor *= ${f.enceladus ? '.85' : '.95'};
          tColor += lColor * color;
        }
        else {
          mColor *= color;
          tColor += lColor * mColor;
        }
      }

      // apply the sky color
      if (t == 0.) {
        tColor = addSkyColor(tColor, mColor, p, mFirst, mPrev);
      }

      // tune
      tColor = clamp(tColor * ${f.enceladus ? '.89' : '.95'}, 0., 1.);

      // fog
      tColor = fog(tColor, pFinal, tFinal, mFirst == MIRROR && mPrev != WATER && t == 0.);

      // sun
      if (mFirst > 0. && t == 0.) {
        float s = max(dot(normalize(light - pFinal), rr), 0.);
        if (s > .25) {
          tColor = mix(tColor, min(tColor * 1.3, vec3(1)), min(pow(s, ${f.sunPower} * .05), 1.));
          tColor = mix(tColor, vec3(1), min(pow(s, ${f.sunPower}), 1.));
        }
      }

      // balance
      tColor =
        smoothstep(
          ${f.bwMode && f.snow && !f.dusk ? '.12' : '.07'}, 1.,
          pow(tColor,
            vec3(${f.bwMode && f.earth && !f.snow && !f.dusk && !f.topView ? '.73' : '.8'})
          )
        );
      tColor -= .07;

      // saturation
      float saturationLevel = ${
        f.mars ? '1.9' : (f.enceladus ? '2.4' : (f.desert ? '2.8' : '(mPrev != BOXES ? 5. : 3.)'))
      };
      ${f.desert || f.earth || f.enceladus ? `
        if (useAmbient) saturationLevel *= ${f.desert || f.earth || f.dusk ? '.7' : '.8'};
      ` : ''}
      tColor = saturation(tColor, saturationLevel);

      // low fog
      ${f.lowFog ? 'tColor = lowFog(tColor, pFinal, tFinal);' : ''}

      // mix
      vec3 cmix = mix(
        texelFetch(tex, ivec2(gl_FragCoord.xy), 0).xyz,
        tColor,
        1. / (float(iteration) + 1.)
      );

      fragColor = vec4(cmix, 1.);
    }
  `;
}
