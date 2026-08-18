// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

shaderFns.shapes = (f, voxelGridSize) => {
  return `
    uniform sampler3D voxelsTex, emptyVoxelsTex;

    float noiseSmoke(vec3 p) {
      float v = 0., a = 1., s = 0.;
      for (int i = 0; i < 5; i ++) {
        v += noise3d(p - smokeOffset - float(iteration)*smokeSpeed) * a;
        p *= 2.; s += a; a *= .7;
      }
      v /= s;
      return v;
    }

    float noiseGround(vec3 p) {
      float v =
        1. - 1.082 * noise3d(p) -
              .397 * noise3d(2. * p) -
              .278 * noise3d(4. * p) -
              .194 * noise3d(8. * p) -
              .136 * noise3d(16. * p) +
              .087 * noise3d(32. * p);
      return v * pow(length(p.xz), .5) * .12;
    }

    float box(vec3 p, vec3 b) {
      p = abs(p) - b;
      return max(p.x, max(p.y, p.z));
    }

    vec2 voxels(vec3 p, bool smoke)
    {
      vec3 v = vec3(${voxelGridSize / 2}., ${voxelGridSize/2}., ${voxelGridSize});
      ivec3 pos = ivec3(floor(abs(p.zxy + v)));

      float w = texelFetch(emptyVoxelsTex, pos / 4, 0).r;
      if (w > 0.) return vec2(w * 256., 0.);

      w = texelFetch(voxelsTex, pos, 0).r;
      if (w == 0.) return vec2(.5 + rnd(), 0.);


      float stateY = 1. - (p.y + ${voxelGridSize}.) / ${voxelGridSize * 2}.;
      if(1. - buildLevel > stateY) {
        return vec2(.5 + rnd(), 0.);
      }

      if (hq && !smoke)
        return vec2(length(fract(p) - .5) - .5, w);
      else
        return vec2(box(fract(p) - .5, vec3(.49)), w);
    }

    vec4 transformShape(vec3 p, bool smoke) {
      float _smoke = 0.;
      p.y -= 2.;

      if(smokeEnabled && smoke) {
        float n = noiseSmoke(2. * p);
        if (n < .8 * (1.05 - .7 * rnd())) {
          float d = (4. - min(length(p.xz), 4.)) * ${f.smoothNoise ? '.3' : '.25'};
          vec3 xx = vec3(rnd(), rnd(), rnd()) * d;
          vec3 vv = n * 3. - 1.5 + xx;
          float level = 2.5 + 3. * smokeLevel;
          if (box(p + vv - vec3(0,${f.smokeFalloff ? '-8. * rnd()' : '0'},-4.), vec3(level, 4, level)) < .2 * rnd()) {
            p += vv; p *= ${f.smokeFalloff ? '.6' : '.8'};
            p.xz *= rotate(-.25 * p.y * rnd());
            _smoke = 1.;
          }
        }
      }
      if (_smoke == 1.) p.y -= 1.;
      p.xz *= rotate(shapeAngle);

      // twist
      if(twist) {
        float py = p.y - 4.;
        float k = (.5 + staticSeed) * py * .05;
        ${f.negativeTwist ? 'k = -k;' : ''}
        p.xz *= rotate(twistIntensity * k * py);
      }

      return vec4(p, _smoke);
    }

    vec2 shape(vec3 p, bool smoke) {
      float pp = p.y + 2.;
      ${f.ground ? `
        if (pp < .25) {
          vec3 pGround = p;
          pGround.xz *= rotate(shapeAngle);
          pp += noiseGround(2. * pGround) - .05;
        }
        ` : ''}
      if (pp < .001) return vec2(pp, 1.);

      vec3 p0 = p;
      vec4 ps = transformShape(p, smoke);
      p = ps.xyz;
      float _smoke = ps.w;

      p0 = transformShape(p0, false).xyz;
      float bb = box(p0, vec3(2, 4, 2)) * .5;

      float scale = ${voxelGridSize / 4}.;
      vec2 b = voxels(p * scale, _smoke == 1.);
      b.x /= scale;

      if (_smoke == 0.) {
        b.x = max(bb, b.x);
      }
      b.x = min(pp, b.x);

      ${f.sdfs ? `
        ${f.sdf_sphere ? '' : 'p0 = mod(p0 + .9, 1.8) - .9;'}
        float sph1 = max(bb, ${f.sdf_sphere ? 'length(p0) - 1.8 * metalScale' : 'length(p0.xz) - .1 * metalScale'});
        float sph2 = max(bb, ${f.sdf_sphere ? 'length(p0) - 1.6 * metalScale' : 'length(p0.xz) - .085 * metalScale'});

        b.x = max(b.x, -sph1);
        if (b.x > sph2 + .001) b.y = 2.;
        b.x = min(sph2, b.x);
      ` : ''}

      if (_smoke == 1. && b.y > 0. && b.y < 1.) b.y += 3.;

      return b;
    }

    float shapeFloat(vec3 p) {
      float pp = p.y + 2.;
      ${f.ground ? `
        if (pp < .25) {
          vec3 pGround = p;
          pGround.xz *= rotate(shapeAngle);
          pp += noiseGround(2. * pGround) - .05;
        }
        ` : ''}
      if (pp < .001) return pp;

      p = transformShape(p, false).xyz;

      ${f.sdfs ? `
        float bb = box(p, vec3(2.5, 4, 2.5));

        ${f.sdf_sphere ? '' : 'p = mod(p + .9, 1.8) - .9;'}
        float sph2 = max(bb, ${f.sdf_sphere ? 'length(p) - 1.6 * metalScale' : 'length(p.xz) - .085 * metalScale'});

        if (sph2 < .01) return sph2;
      ` : ''}

      const float scale = ${voxelGridSize / 4}.;
      if (hq)
        return (length(fract(p * scale) - .5) - .5) / scale;
      else
        return box(fract(p * scale) - .5, vec3(.49)) / scale;
    }

    vec3 normal(vec3 p) {
      float e = .0001;
      vec2 k = vec2(1, -1);
      vec2 ke = k * e;
      return normalize(
        k.xxx * shapeFloat(p + ke.xxx) + k.xyy * shapeFloat(p + ke.xyy) +
        k.yxy * shapeFloat(p + ke.yxy) + k.yyx * shapeFloat(p + ke.yyx)
      );
    }
  `;
}
