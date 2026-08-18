// Cradle
// Copyright (c) 2022 Monotau

"use strict";

shaderFns.shapes = (f) => {
  const mat2angleFrame = mat2rotate(f.angleFrame);
  const mat2angleBox = mat2rotate(f.angleBox);
  const mat2frameXZ = mat2rotate(f.stepXZ * Math.PI/2);
  const mat2frameXY = mat2rotate(f.stepXY * Math.PI/2);
  const mat2frameYZ = mat2rotate(f.stepYZ * Math.PI/2);

  return `
    mat2 rotate(float a) {
      return mat2(cos(a), -sin(a), sin(a), cos(a));
    }

    float smaxDist(float a, float b, vec3 p) {
      ${f.moss ? 'if (p.z < 0.)' : ''} return max(a, b);

      // sharper edges at the distance
      float k = .00002 * p.z;

      float d = a - b;
      return (a + b + sqrt(d * d + k)) * .5;
    }

    float smax(float a, float b) {
      float k = .002;
      float d = a - b;
      return (a + b + sqrt(d * d + k)) * .5;
    }

    float circular(vec3 p, float b, float e) {
      p.xz *= ${mat2rotate(Math.PI / 4)};

      vec3 q = abs(p) - vec3(b,b,e);
      float x = length(max(q,0.)) + min(max(q.x,max(q.y,q.z)),0.);
      return max(max(x, length(p.xy) - 2. * b), -(length(p.xy) - b + e));
    }

    // Credit: IQ
    float boxFrame( vec3 p, float b, float e ) {
      p = abs(p) - b;
      vec3 q = abs(p + e) - e;
      return min(
        min(
          length(max(vec3(p.x, q.y, q.z), 0.)) + min(max(p.x, max(q.y, q.z)), 0.),
          length(max(vec3(q.x, p.y, q.z), 0.)) + min(max(q.x, max(p.y, q.z)), 0.)
        ),
        length(max(vec3(q.x, q.y, p.z), 0.)) + min(max(q.x, max(q.y, p.z)), 0.)
      );
    }

    float modifiedFrame( vec3 p, float b, float e )
    {
      ${f.circularShape ? 'float t = circular(p, b, e)' : ''};

      p = abs(p) - b;
      vec3 q = abs(p + e) - e;
      q.xz *= ${mat2angleBox};

      float v = min(
        length(max(vec3(q.x, p.y, q.z), 0.)) + min(max(q.x, max(p.y, q.z)), 0.),
        length(max(vec3(q.x, q.y, p.z), 0.)) + min(max(q.x, max(q.y, p.z)), 0.)
      );
      return ${f.circularShape ? 'smin(t, v, .005)' : 'v'};
    }

    float shapeFrame(vec3 p) {
      vec3 p0 = p;
      p.z += ${f.enceladus ? '.6' : (f.desert ? '.3' : '.2')};

      ${f.flipXY ? `p.xy *= ${mat2rotate(Math.PI/2)};` : ''}

      p.xz *= ${mat2frameXZ};
      p.xy *= ${mat2frameXY};
      p.yz *= ${mat2frameYZ};

      // twist
      float k = .2 + staticSeed;
      ${f.twistZinit ? `
        ${!f.twistZ ? 'k = (p0.z < 1.5 ? -(p0.z - 1.5) : 0.) * staticSeed;' : ''}
        k = min(abs(k), 1.);
      ` : ''}

      ${f.twistZ ? `k += .5 * abs(p0.z) * ${f.twistZint};` : ''}
      ${f.twistY ? `k += ${f.twistYsign ? '-' : ''}abs(p.y) * ${f.twistYint};` : ''}
      ${f.twistX ? `k += p.x * ${f.twistXint};` : ''}

      ${f.negativeTwist ? 'k = -k;' : ''}

      p.xz *= rotate(k * p.y);
      ${f.twistXY ? 'p.xy *= rotate(-k * .25 * p.y);' : ''}

      float b = ${f.modifiedFrame ? 'modifiedFrame' : 'boxFrame'}(
        p, ${f.boxGridSize == 15 ? '1.19' : '1.2'}, ${f.boxGridSize == 15 ? '.23' : '.25'}
      );

      ${f.decayFrame ? `b = smax(b, -(- p0.y + 1.6 -  1. * noise2dSmoother(1.5 * p0.xz)));` : ''}

      return b;
    }

    float boxes(vec3 p)
    {
      float rr = texelFetch(noiseLookup3D, ivec3(floor(abs(p))), 0).r;
      float r = ${f.boxSize} * rr;
      if (r < .2) r = 0.;
      return boxFrame(fract(p) - .5, r, r * .2);
    }

    float shapeMoss(vec3 p){
      p += vec3(staticSeed, -.4, .4);
      float scale = 1.;
      for (int i = 0; i < 24; i ++) {
        float v = max(.3, 1. / dot(p, p));
        p = (abs(abs(p * v) - 1.88) - 1.8);
        scale *= v;
      }
      return min(length(p.xy), -p.z) / scale;
    }

    float shapeBoxes(vec3 p){
      return boxes(p * ${f.boxGridSize}.) / ${f.boxGridSize}.;
    }

    float mixSW(float a, float b) {
      return ${
        !f.mars && !f.enceladus && !f.desert ?
          'min(a, b)' :
          `smin(a, b, ${f.mars || f.desert ? '.0009' : (f.enceladus ? '.003' : '.0003')})`
      };
    }

    float water(vec3 p) {
      return p.y + ${f.waterOffset} +
             waterNoise(${f.ice ? '.3 * ' : ''}p.xz) *
             ${f.ice ? '.07' : (f.bwMode ? '.01' : '.005')};
    }

    float terrain(vec3 p) {
      float v = p.y + ${f.groundLevel} + terrainNoise(p.xz);
      ${f.groundView ? `
        if (mcGlobal.x > 0.) return v;

        float d = abs(mcGlobal.z - p.z);
        if (d > 1.) return v;
        return mix(mcGlobal.y + 1., v, smoothstep(0., 1., d));
      ` : 'return v;'}
    }

    vec2 shape(vec3 p) {
      float s = p.y < ${-f.groundLevel} + 1. ? terrain(p) : 10.;

      float c = shapeFrame(p);
      float a = 1., b = 1.;
      if (c < 1.) {
        a = smaxDist(shapeBoxes(p), c, p);
        b = smaxDist(shapeMoss(p), c, p);
      }

      float w = ${f.water ? `p.y < ${-f.waterOffset} + .1 ? water(p) : 10.` : '10.'};

      float m = MOSS;
      if (w < min(s, min(a, b)) - .002) m = WATER;
      else if (s < min(a, b) - .002) m = TERRAIN;
      else if (a < b + .02) m = BOXES;

      s = ${f.water ? 'min(s, w)' : 's'};
      s = mixSW(s, smin(a, b, .0003));

      ${f.sphere ? `
        float r = length(p) - 1.;
        if (r < s) m = MIRROR;
        s = min(r, s);
      ` : ''}

      return vec2(s, m);
    }

    float shapeFloat(vec3 p) {
      return shape(p).x;
    }

    vec3 normal(vec3 p, float sp) {
      vec2 e = vec2(.001, 0);
      return normalize(
        vec3(shapeFloat(p + e.xyy) - sp, shapeFloat(p + e.yxy) - sp, shapeFloat(p + e.yyx) - sp)
      );
    }
  `;
}
