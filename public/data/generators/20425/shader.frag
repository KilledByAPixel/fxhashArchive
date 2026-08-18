#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14

uniform vec2 u_resolution;

uniform float u_xSeed;
uniform float u_ySeed;
uniform float u_mSeed;
uniform float u_lac;
uniform float u_format;
uniform float u_dir;
uniform float u_edge;
uniform float u_bor;

uniform vec3 u_clr0;
uniform vec3 u_clr1;
uniform vec3 u_clr2;
uniform vec3 u_clr3;
uniform vec3 u_clr4;
uniform vec3 u_clr5;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(u_xSeed,u_ySeed))) * (u_mSeed));
}
vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(u_xSeed,3.11)),dot(p,vec2(6.95,u_ySeed))))*(u_mSeed));
}
float gRand (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}
// 2D NOISE By Morgan McGuire
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
// FRACTAL BROWNIAN MOTION by Inigo Quilez
float fbm( in vec2 x) {
    float a = 0.5;
    float t = 0.0;
    for( int i = 0; i < 5; i++ ) {
        t += a*noise(x);
        x *= u_lac;
        a *= 0.5;
    }
    return t;
}
// DOMAIN WARPING by Inigo Quilez
float pattern( in vec2 p ) {
    float offset = 2.0;
    float chaos = 5.0;
    p = p * offset;
    vec2 q = vec2( fbm( p + vec2(0.0,0.0) ),
                   fbm( p + vec2(5.2,1.3) ) );
    vec2 r = vec2( fbm( p + chaos*q + vec2(1.7,9.2)),
                   fbm( p + chaos*q + vec2(8.3,2.8)) );
    return fbm( p + chaos*r );
}
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float lineSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return smoothstep(0.0006, 0.0008, length(pa - ba*h));
}
float when_lt(float x, float y) {
  return max(sign(y - x), 0.0);
}
float when_ge(float x, float y) {
  return 1.0 - when_lt(x, y);
}
float and(float a, float b) {
  return a * b;
}
float makeFormat(vec2 p) {
  float numColors = 6.0;
  float borderTop = 0.0;
  float borderBottom = 0.0;
  float n = pattern(p);
  if (u_format == 0.0) {
    n = n - p.y + 0.5;
    borderTop = -0.0625;
    borderBottom = -0.0625;
  } else if (u_format == 1.0) {
    n = n + (atan(0.5 - p.y, 0.5 - p.x) + PI * 1.1) / (2.0 * PI) - 0.5;
    n = n + distance(p, vec2(0.5)) * 2.0 * u_dir;
    borderTop = 0.0;
    borderBottom = 0.0;
  } else if (u_format == 2.0) {
    n = n - p.y + 0.5;
    borderTop = 0.25;
    borderBottom = 0.15;
  } else if (u_format == 3.0) {
    n = n + ((0.5 - p.x) * u_dir);
    borderTop = 0.2;
    borderBottom = 0.2;
  } else if (u_format == 4.0) {
    n = n + (0.5 - distance(p, vec2(0.5, 0.5)) * 1.25) * u_dir;
    borderTop = 0.0;
    borderBottom = 0.0;
  } else if (u_format == 5.0) {
    n = n - p.y + 0.5;
    borderTop = 0.3;
    borderBottom = -0.3;
  } else if (u_format == 6.0) {
    n = n - p.y + 0.5;
    borderTop = -0.4;
    borderBottom = 0.4;
  }
  n = map(n, borderTop, 1.0 - borderBottom, 0.0, 1.0);
  n = n * (numColors - 1.0) + 0.5;
  return n;
}
float makeFract(float n) {
  return clamp(map(abs(fract(n) - 0.5), -0.5, 0.5, 1.9, 0.0), 0.0, 1.0);
}
void main() {
    vec2 px = gl_FragCoord.xy/u_resolution.xy;
    vec2 st = px;
    float sx = u_resolution.y/u_resolution.x;
    st.x += sx * 0.5 - 0.5;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = u_clr0;
    color += (u_clr1 - color) * when_lt(u_format, 1.5);
    float clrRaw = makeFormat(st);
    float clrFract = makeFract(clrRaw);

    if (u_format == 1.0) {
      float t = mod(floor(clrRaw - 1.0), 5.0) + 1.0;
      clrRaw = t + clrFract;
    }

    color += (u_clr2 - color) * and(when_ge(clrRaw, 1.0), when_lt(clrRaw, 2.0));
    color += (u_clr3 - color) * and(when_ge(clrRaw, 2.0), when_lt(clrRaw, 3.0));
    color += (u_clr4 - color) * and(when_ge(clrRaw, 3.0), when_lt(clrRaw, 4.0));
    color += (u_clr5 - color) * and(when_ge(clrRaw, 4.0), when_lt(clrRaw, 5.0));

    float sc = 110.0;
    vec2 stL = st * sc;
    float sr = 0.01;

    for (float y = 0.0; y < 2.0; y+=1.0) {
      for (float x = 0.0; x < 2.0; x+=1.0) {
        vec2 boxOffset = vec2(0.5 * x, 0.5 * y);
        vec2 ipos = floor(stL + boxOffset);
        vec2 cpos = ipos + (0.5 - boxOffset);
        vec2 moveCpos = vec2(random2(cpos * 5.37)) * 0.5;
        cpos = cpos - 0.25 + moveCpos;
        float cFract = makeFract(makeFormat(cpos/sc));
        float loDiff = 9999.9;
        vec2 loPos = vec2(0.0);
        float a = random(cpos * 2.29) * PI;
        for (float i = 0.0; i < 4.0; i+=1.0) {
          float eLoc = a + PI * (i / 4.0);
          vec2 sinCos = vec2(cos(eLoc), sin(eLoc));
          vec2 epos = sinCos * sr;
          float eFract = makeFract(makeFormat((cpos + epos)/sc));
          float nDiff = abs(cFract - eFract);
          loPos += (sinCos - loPos) * when_lt(nDiff, loDiff);
          loDiff = min(nDiff, loDiff);
        }
        float mixAmt = 0.5;
        if (u_format > 1.0 && clrRaw < 1.0 - u_edge || u_format > 1.0 && clrRaw > 5.0 + u_edge) {
          mixAmt = max((color.r * 0.299 + color.g * 0.587 + color.b * 0.114) * 0.33, 0.05);
          cFract = 1.0;
        }
        vec2 halfLine = loPos * 0.9;
        vec3 colorMix = mix(vec3(cFract), color, lineSegment(st, (cpos - halfLine)/sc, (cpos + halfLine)/sc));
        color = mix(color, colorMix, mixAmt);
        vec2 cRand = random2(cpos * 7.38) - 0.5;
        vec2 lRand = random2(cpos * 6.91) * 0.2 - 0.1;
        if (u_format > 1.0 && clrRaw > 1.0 - u_edge && clrRaw < 5.0 + u_edge) {
            cFract = makeFract(makeFormat((cpos + cRand)/sc));
        }
        colorMix = mix(vec3(cFract), color, lineSegment(st, (cpos + cRand - halfLine - lRand)/sc, (cpos + cRand + halfLine + lRand)/sc));
        color = mix(color, colorMix, mixAmt);
      }
    }
    if (u_bor == 1.0) {
      color = mix(color * 0.9, color, smoothstep(0.0, 0.05, px.y));
      color = mix(color * 0.9, color, smoothstep(1.0, 0.95, px.y));
      color = mix(color * 0.9, color, smoothstep(0.0, 0.05 * sx, px.x));
      color = mix(color * 0.9, color, smoothstep(1.0, 1.0 - 0.05 * sx, px.x));
      vec3 bClr = vec3(0.88, 0.86, 0.79);
      float es = 0.0155;
      float ee = 0.0165;
      float pNoi = pattern(px * 0.25);
      float tr = 0.014 * pNoi;
      vec2 stG = st * 1000.0;
      vec2 ipos = floor(stG);
      float gNoi = pattern(ipos * 0.0005);
      vec3 gClr = vec3(0.59, 0.53, 0.31);
      vec3 mClr = mix(bClr, gClr, clamp(gNoi * 2.0 - 0.5, 0.0, 1.0));
      mClr = mix(bClr, mClr, gRand(ipos) * 0.4);
      color = mix(mClr, color, smoothstep(es + tr, ee + tr, px.y));
      color = mix(mClr, color, smoothstep(1.0 - (es + tr), 1.0 - (ee + tr), px.y));
      color = mix(mClr, color, smoothstep((es + tr) * sx, (ee + tr) * sx, px.x));
      color = mix(mClr, color, smoothstep(1.0 - (es + tr) * sx, 1.0 - (ee + tr) * sx, px.x));
    }

    gl_FragColor = vec4(color,1.0);
}
