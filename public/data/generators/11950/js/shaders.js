// Omega Point
// Copyright (c) 2022 Monotau

const mat2rotate = (angle) => {
  return `mat2(${Math.cos(angle)}, ${-Math.sin(angle)}, ${Math.sin(angle)}, ${Math.cos(angle)})`;
}

const fragmentShader =
  (size, tMode, sMode, bwMode, useSign, angle, offset, fog, fov, colorFactor) => {

  const tsMode = tMode || sMode;
  const mat2angle = mat2rotate(angle);
  const mat2_2_53 = mat2rotate(2.53);
  const mat2_2_43 = mat2rotate(2.43);

  let vCondition = tMode ?
    'vv > vcut && vv < .003 + (1. - ti * ti) * .01105' :
    '(b > 0 && v < .002) || (v < .011 && v > .028 * l * rand2static(vec2(ti)))';

  return `#version 300 es
  precision mediump float;
  precision lowp sampler3D;

  out vec4 fragColor;

  uniform int iteration;
  uniform bool copy;
  uniform sampler2D texture;
  uniform sampler3D noiseLookup;
  uniform float seed, staticSeed, ffactor;

  vec2 uv;
  float randCnt = 0.;

  const float MAX_DIST = 4.6;
  const float START_DIST = 1.;

  const vec3 CAMERA_POS = vec3(0, 0, 3.4);
  const vec3 LIGHT_POS = vec3(-20., 0., 45.);

  const vec3 BASE_COLOR = vec3(0.7813, 0.9375, 0.996);
  const vec3 FINAL_COLOR = vec3(0.9961, 0.7813, 0.7813);

  //////////////////////////////////////////////////////////////////////////////////////////////////

  float noise(vec3 p) {
    p = abs(p);
    ivec3 pi = ivec3(floor(p));

    vec3 f = smoothstep(0., 1., fract(p));

    float aa, ba, ab, bb, x1, x2, y1, y2;
    aa = texelFetch(noiseLookup, pi, 0).x;
    ba = texelFetch(noiseLookup, pi + ivec3(1,0,0), 0).x;
    ab = texelFetch(noiseLookup, pi + ivec3(0,1,0), 0).x;
    bb = texelFetch(noiseLookup, pi + ivec3(1,1,0), 0).x;

    x1 = mix(aa, ba, f.x);
    x2 = mix(ab, bb, f.x);
    y1 = mix(x1, x2, f.y);

    aa = texelFetch(noiseLookup, pi + ivec3(0,0,1), 0).x;
    ba = texelFetch(noiseLookup, pi + ivec3(1,0,1), 0).x;
    ab = texelFetch(noiseLookup, pi + ivec3(0,1,1), 0).x;
    bb = texelFetch(noiseLookup, pi + ivec3(1,1,1), 0).x;

    x1 = mix(aa, ba, f.x);
    x2 = mix(ab, bb, f.x);
    y2 = mix(x1, x2, f.y);

    return mix(y1, y2, f.z);
  }

  float fnoise(vec3 p) {
    float v = 0., a = 1.;
    for (int i = 0; i < 4; i ++) {
      v += noise(p) * a;
      p *= 2.; a *= .5;
    }
    return v;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  // not deterministic
  float rand2static(vec2 s) {
    return fract(sin(dot(s, vec2(12.9898,78.233)))*43758.5453123);
  }

  float rand2(vec2 v) {
    return rand2static(v) + .1 * rand2static(v + seed);
  }

  float rand(float s) {
    return rand2(vec2(s));
  }

  float randNew() {
    return rand2static(uv + seed + randCnt ++);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  float shapeNoise(vec3 p0) {
    vec3 p = p0;
    p.x -= 6.;
    p.zy *= ${mat2_2_43};

    float n = .7 + .35 * noise(1.4 * p) * distance(CAMERA_POS, p0);
    p = abs(abs(p) - 4.) * n - 4.;

    return min(length(p.xy), p.z) * 0.25;
  }

  float shapeFractal(vec3 p){
    p.xy *= ${mat2angle};
    p += vec3(0, -.4, ${offset ? '-.6' : '-1.1'});
    p.zy *= ${mat2_2_53};

    float s = min(staticSeed * 0.7 + 0.3, 0.7);
    vec3 r = vec3(2) + s * vec3(1, 1.2, 2.1);
    vec3 rs = r + s * .4;

    float scale = .8;
    for (int i = 0; i < 4; i ++) {
      float v = max(1., (ffactor ${tsMode ? '+ 3.' : ''}) / dot(p, p));
      p = ${tsMode ? 'sign(p) *' : ''}(abs(abs(p * v) - rs) - r);
      scale *= v;
    }

    return min(
      length(p.xy), ${tsMode && !useSign ? 'p.z' : '-p.z'}
    ) / scale ${tMode ? '' : '* 1.3'};
  }

  float shape(vec3 p) {
    float a = shapeFractal(p);
    float b = shapeNoise(p);
    float k = ${tMode ? '.001' : '.0001'};
    float d = a ${tMode ? '-' : '+'} b;
    return (a ${tMode ? '+ b -' : '- b +'} sqrt(d * d + k)) * .5;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  vec3 normal(vec3 p, float sp) {
    vec2 e = vec2(.0001, 0);
    return normalize(
      vec3(shape(p + e.xyy) - sp, shape(p + e.yxy) - sp, shape(p + e.yyx) - sp)
    );
  }

  float illumination(vec3 camera, vec3 light, vec3 p, vec3 n) {
    float ambient = .7;
    float diffuseFactor = ${tMode ? '.9' : (fog ? '.5' : '.7')};
    float shininess = 8.;

    vec3 lr = normalize(light - p);
    float diffuse = diffuseFactor * dot(n, lr);
    if (diffuse < 0.)
      return ambient;

    vec3 cr = normalize(camera - lr);
    vec3 rL = normalize(reflect(-light, n));

    float spec = dot(rL, cr);
    if (spec < 0.)
      return ambient + diffuse;

    float specular = pow(spec, shininess);
    return ambient + diffuse + specular;
  }

  float shadow(vec3 p0, vec3 r, float cut, int b) {
    float t = ${tMode ? '.08' : '.02'};
    float bound = .005 + float(b) * .01;

    float s = 1.;
    for (int i = 0; i < 32; i ++) {
      vec3 p = p0 + t * r;
      if (dot(p, p) > cut) break;

      float v = ${tMode ? 'abs' : ''}(shape(p));
      if (v < bound) return 0.;

      s = min(s, 3. * v / t);
      t += v;
    }
    return s;
  }

  float ambientOcclusion(vec3 p, vec3 n, float v) {
    float c = 1., a = .5, step = .02;
    vec3 nstep = n * step;
    for (int i = 0; i < 3; i ++) {
      v += step; p += nstep;
      c *= min(1. - ${tMode ? '20.' : '70.'} * (v - shape(p)) * a, 1.);
      a *= .5;
    }
    return c;
  }

  vec3 fog(vec3 c, vec3 p, float tp) {
    p = .5 * p + vec3(.8, .84, .73);

    float f = 0.;
    vec3 fogColor = vec3(0);

    ${fog ? `
      f = pow(fnoise(p), .6) * (tp < MAX_DIST ? .57 : .7);
      fogColor = min(f * vec3(1., 1.02, 1.03), 1.);
    ` : ''}

    float k = smoothstep(0., 1., (tp - 1.) / (MAX_DIST + 1.4) - .2);
    float fm = exp2(-10. * k);
    c = mix(fogColor, c, fm);

    ${fog ? '' : `
      f = pow(abs(.25 * fnoise(2. * p) - .2), .55);
      float vx = clamp((.5 - 0.7 * uv.y * f), 0., 1.);
      vec3 cd = clamp(vx * (1. - k) * k * ${tMode ? '.9' : '1.5'} * vec3(1.05, 1.05, .97), 0., 1.);
      c = mix(c, c * .8 + cd, vx);
    `}

    return c;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  void copyToCanvas() {
    vec3 c = texelFetch(texture, ivec2(gl_FragCoord.xy), 0).xyz;
    vec2 u = uv * (1. - uv);

    float v = ${fog ? '1.' : '.4 + .6 * pow(min(u.x * u.y * 90., 1.), .4)'};
    ${fog ? '' : 'c *= vec3(.99, .945, 1.17);'}

    float screenNoise = .16 * pow(u.x * u.y * 37., .2) + .03 * randNew() - .06;
    c = min(c * v + screenNoise, 1.);

    ${bwMode ? 'c = clamp(vec3(dot(vec3(.3, .6, .1), c)), 0., 1.);' : ''}

    // border
    float d = .025;
    if (any(lessThan(u, vec2(d + .015)))) {
      d -= .01 * smoothstep(.2, 1.2, fnoise(vec3(15. * uv, 1.)));
      if (any(lessThan(u, vec2(d)))) {
        vec2 a = min(d - u, .05) * 1000.;
        fragColor = vec4(mix(vec3(1.), c, max(1. - max(a.x, a.y), 0.)), 1);
        return;
      }
    }

    fragColor = vec4(c, 1.);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  vec2 intersect(vec3 c, vec3 r, int b, float t, float cut) {

    float step = .01;
    float mstep = .6 / step;
    float l = length(uv.xy - .5);
    float rn = .01 * randNew();

    ${tMode ? 'float vcut = .02 * ((l * .9) + .1);': ''}

    for (int i = 0; i < 96 && t < MAX_DIST; i ++) {
      vec3 p = c + t * r;
      float d = dot(p, p);
      float ti = clamp((t - 1.) * .2, 0., 1.);

      float vv = d > cut ? .1 : shape(p);
      float v = ${tMode ? 'abs' : ''}(vv);

      if ((b > 0 || t >= START_DIST + .03) && (${vCondition})) {
        return vec2(vv, t);
      }

      // variable step
      if (d < 1.45 + rand2(p.xy) * .6) {
        t += v * (b == 0 ? .2 : .4);
      }
      else {
        t += b > 0 ? .1 + rn : max(floor(.5 + v * mstep) * step, step);
      }

      if (${!tMode || bwMode} || b > 0 || l * rn < .004) {
        t += rand(ti) * rn * max(float(i) * .04, 1.);
      }
    }

    return vec2(0);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  void main()
  {
    uv = gl_FragCoord.xy / vec2(${size});

    // copy to canvas and exit
    if (copy) {
      copyToCanvas();
      return;
    }

    //
    vec3 camera = CAMERA_POS;
    vec3 light = LIGHT_POS;

    vec3 ray = normalize(vec3((uv - .5) * 2., -1. / tan(radians(${fov}) * .5)));
    camera.xy += (vec2(randNew(), randNew()) - .5) * .001;

    //
    float cut = ${fov == '60.' ? '2.2' : '2.65'};
    cut *= cut;

    float l = length(uv.xy - .5);

    //
    vec3 rc = camera;
    vec3 rr = ray;

    float t = START_DIST;
    float tp = MAX_DIST;

    vec3 color = vec3(0);
    vec3 tColor = vec3(0);
    vec3 mColor = vec3(1);

    for (int b = 0; b < 3; b ++) {
      vec2 iv = intersect(rc, rr, b, t, cut);
      float v = iv.x;
      t = iv.y;

      if (t == 0.) break;
      if (b == 0) tp = t;

      vec3 p = rc + t * rr;

      // color
      float cf = ${colorFactor} * (l + .13);
      vec3 s = mix(BASE_COLOR, FINAL_COLOR, min(cf * rand(max(t - 1., 0.)), 1.));
      color = s * (color + 1. - s) * ${tMode ? '1.9' : '1.7'};
      if (b > 0) color *= ${tMode ? '1.4' : '2.'};

      // light
      float _shadow = shadow(p, normalize(light - p), cut, b);
      color *= min(${tMode ? '.72' : '.63'} + 3.6 *  _shadow, 1.);

      vec3 n = normal(p, v);
      vec3 lColor =
        vec3(illumination(camera, light, p, n)) * (1.9 + ${tMode ? '4.' : '2.5'} * _shadow);
      lColor *= ambientOcclusion(p, n, v);

      //
      rc = p;
      t = .01;
      rr = normalize(reflect(rr, n));

      mColor *= color * .92;
      tColor += lColor * mColor;
    }
    tColor = clamp(tColor, 0., 1.);

    // pick the final color
    ${tMode ? `
      color *= (.4 + tColor * .9) * .8;
      color += 1.2 * tColor * (clamp((tp - 1.) / 3.6, 0., 1.));
    ` : 'color = tColor;'}

    // tune
    ${fog ? 'color *= vec3(.99, .945, 1.32);' : ''}

    // fog
    color = fog(color, camera + tp * ray, tp);

    // balance
    color =
      smoothstep(
        0., ${bwMode && !fog ? '.9' : '1.'},
        pow(color, vec3(${tMode ? '.6' : (fog ? '0.9' : '.8')}))
      );

    // saturation
    ${tMode ? '' : `
      vec3 sat = vec3(dot(color, vec3(.21, .71, .08)));
      color = mix(sat, color, .8);
    `}

    // mix
    float m = 1. / (float(iteration) + 1.);
    vec3 cmix = mix(texelFetch(texture, ivec2(gl_FragCoord.xy), 0).xyz, color, m);

    fragColor = vec4(cmix, 1.);
  }`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

const vertexShader = `#version 300 es
  in vec2 pos;

  void main() {
	  gl_Position = vec4(pos, 0, 1);
  }
`;
