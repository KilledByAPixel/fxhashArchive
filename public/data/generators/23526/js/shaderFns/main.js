// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

shaderFns.main = (f, width, height) => {

  return `

    uniform bool copy;


    vec3 intersect(vec3 c, vec3 r, float t, float tMax, bool smoke) {
      for (int i = 0; i < 512 && t < tMax; i ++) {
        vec3 p = c + t * r;

        vec2 s = shape(p, smoke);
        float v = s.x, m = s.y;

        if (v < .00001) return vec3(v, t, m);
        t += v * (smoke ? clamp(1.2 * rnd(), .4, .8) : .6);
      }
      return vec3(0);
    }

    vec3 intersectFull(vec3 c, vec3 r, float t) {
      vec3 vtm0 = intersect(c, r, t, ${f.maxDist}, false);

      if(smokeEnabled) {
        if (realtime) return vtm0;

        float tMax = vtm0.y;
        if (tMax == 0.) tMax = ${f.maxDist};

        vec3 vtm1 = intersect(c, r, t, tMax, true);

        if (vtm1.y == 0.) return vtm0;
        return vtm1;
      } else {
        return vtm0;
      }
    }

    void main()
    {
      vec2 res = vec2(${width}, ${height});
      randUV = gl_FragCoord.xy / res;

      // copy to canvas and exit
      if (copy) {
        copyToCanvas(res);
        return;
      }

      float tFinal;
      vec3 pFinal, start_rc, light;

      // calculate uv + blur edges
      vec2 u = randUV * (1. - randUV);
      float s = 0.;
      if(blurEdge) {
        s = (res.y / 20.) * (1. - pow(min(pow(u.x, 1.5) * u.y * 120., 1.), .1));
      }
      vec2 uv = 2. * ((gl_FragCoord.xy + (1. + s) * (vec2(rnd(), rnd()) - .5)) - .5 * res) / res.y;

      vec3 rc = vec3(0, cameraY, cameraZ);
      vec3 lookAt = vec3(${f.lookAt});

      vec3 cf = normalize(lookAt - rc);
      vec3 cr = cross(vec3(0, 1, 0), cf);
      vec3 cu = cross(cf, cr);
      vec3 rr = normalize(cf * ${f.zoom} + uv.x * cr + uv.y * cu);

      // dof
      if(dof > 0.) {
        float focalDistance = intersect(rc, cf, 0., ${f.maxDist}, false).y;

        if(fixedFocalDistance > 0.) {
          focalDistance = fixedFocalDistance;
        }

        if (focalDistance > 10. || focalDistance <= .2) focalDistance = rc.z - .7;

        vec3 fp = rc + rr * focalDistance;
        // vec2 mc = .1 * (vec2(rnd(), rnd()) - .5);
        vec2 mc = dof * (vec2(rnd(), rnd()) - .5);
        rc += mc.x * cr + mc.y * cu;
        rr = normalize(fp - rc);
      }

      // light
      light = vec3(lightPosX, lightPosY, lightPosZ);

      //${f.reverseLight ? 'light.x = -light.x;' : ''}
      if(reverseLight) {
        light.x = -light.x;
      }

      if (rnd() <= ambientLight) {
        light.xz *= rotate(rnd() * 6.28);
      }
      else if (rnd() <= rimLight) {
        light.xz *= rotate(3.14);
        light.xz *= rotate(rnd() * .2 - .1);
      }
      else {
        light.xz *= rotate(rnd() * .2 - .1);
      }

      // prepare for the main loop
      float t = .2;
      tFinal = ${f.maxDist};
      pFinal = rc + tFinal * rr;

      vec3 tColor = vec3(0);
      float m = 0.;

      start_rc = rc;
      int bb = hq && !realtime ? 4 : 2;

      // main loop
      for (int b = 0; b < bb; b ++) {

        vec3 vtm = intersectFull(rc, rr, t);
        float v = vtm.x;
        float m = vtm.z;

        t = vtm.y;
        vec3 p = rc + t * rr;

        if (t == 0.) break;

        // light
        vec3 n = m > 3. ? vec3(0) : normal(p);
        vec3 lr = normalize(light - p);

        // color
        vec3 color = vec3(${f.ground ? '.37' : '0.'});
        if (m > 0. && m < 1.) {
          color = colors[int(m * 10. + .1) - 1];
        }
        else if (m > 3.) {
          color = .2 + .6 * colors[int((m - 3.) * 10. + .1) - 1];
        }

        // add white
        if(m < 1.) {
          color = white + ((1. - white) * color);
        }

        // Smoke
        if(m > 3.) {
          float smokeWhite = white + .1;
          color = smokeWhite + ((1. - smokeWhite) * color);
          color *= .77;

          // Saturate
          color = saturation(color, 1.2 * clamp(4. - length(p.xz), .2, 1.5));

          // fade smoke
          float k = smoothstep(0., 1., length(p.xz) * .1 - .2);
          float fm = exp2(-8. * k);
          color = mix(vec3(0.), color, fm);
        }

        // light
        bool _shadow = shadowFull(p, lr);

        if (!_shadow) {
          vec3 iColor;
          if (m == 2.) {
            iColor = vec3(diffuse(n, lr) * ${f.sdf_sphere ? '0.' : '.3'} + 1.5 * specular(start_rc, light, p, n));
          }
          else {
            iColor = (b == 0 ? 3.8 : 2.6) * color * lightBrightness;
            if (m ${f.ground ? '<=' : '<'} 1.) iColor *= 1.8 * diffuseSS(n, lr);
          }
          ${f.lightFalloff ? ` iColor *= lightIntensity(p, light); `: ''}

          ${f.ground ? `
            if(m == 1.) iColor = mix((-.4 * lightBrightness + 1.6)* iColor - iColor * length(p.xz) * .25, iColor, groundLight);
          ` : ''}

          if (hq) iColor *= .8;

          tColor += iColor;
        }

        if (b == 0) {
          tFinal = t;
          pFinal = p;
        }

        //
        rc = p;
        t = .01;
        if (m == 1.) {
          if (${f.lightFalloff ? 'true' : 'rnd() < .7'}) {
            rr = normalize(reflect(rr, n)) * (1. + hnRay(n) * .2);
          }
          else {
            rr = hnRay(n);
          }
          ${f.ground ? `b ++;` : ''}
        }
        else if (m == 2.) {
          rr = normalize(reflect(rr, n));
        }
        else {
          rr = !hq || m > 3. ? hnRay(n) : normalize(reflect(rr, n));
          b ++;
        }
      }

      // Increase reflection
      ${f.ground ? '' : `
        if(pFinal.y < -1.999){
          tColor *= 1.2;
        }
      `};

      // WARM + COOL
      float lum = dot(tColor, vec3(.21, .71, .08));
      const vec3 blue = vec3(0.,0.,255./255.);
      const vec3 orangeRed = vec3(255./255.,69./255.,0.);
      vec3 duotone =  mix(blue, orangeRed, lum - warmCoolBalance) * lum;
      tColor = mix(tColor, duotone, warmCool);

      // Light the floor a tiny bit
      if (m == 0.){
        tColor += .02;
      }

      // Saturation
      tColor = saturation(tColor, (sat + 1.));

      // fog
      float k = smoothstep(0., 1., (tFinal - 7.5) / ${f.ground ? '30.' : '15.'} - .1);
      float fm = exp2(-8. * k);
      tColor = mix(vec3(0.), tColor, fm);

      // fade top
      if(fadeTop) {
        k = smoothstep(0., 1., (pFinal.y - 2.) / 2. - 1.5);
        fm = exp2(-8. * k);
        tColor = mix(vec3(0.), tColor, fm);
      }

      // mix
      vec4 tx = texelFetch(tex, ivec2(gl_FragCoord.xy), 0);
      float fmix = realtime ?  max(1. / (float(iteration) + 1.), .1) :  1. / (float(iteration) + 1.);

      vec3 cmix;
      float wmix = 1.;

      cmix = mix(tx.xyz, clamp(tColor * .25, 0., 1.), fmix);
      wmix = mix(tx.w, clamp(rgb2hsv(tColor).z / 6., 0., 1.), fmix);

      fragColor = vec4(cmix, wmix);
    }
  `;
}
