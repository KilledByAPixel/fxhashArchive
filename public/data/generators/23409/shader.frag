#ifdef GL_ES
precision highp float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

//textures and uniforms from p5
uniform sampler2D p;
uniform sampler2D g;
uniform vec2 u_resolution;
uniform float seed;
uniform vec3 bgc;
uniform float marg;
uniform float startRot;
uniform bool textured;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec3 adjustContrast(vec3 color, float value) {
  return 0.5 + (1.0 + value) * (color - 0.5);
}
vec3 adjustExposure(vec3 color, float value) {
  return (1.0 + value) * color;
}
vec3 adjustSaturation(vec3 color, float value) {
  const vec3 luminosityFactor = vec3(0.2126, 0.7152, 0.0722);
  vec3 grayscale = vec3(dot(color, luminosityFactor));

  return mix(grayscale, color, 1.0 + value);
}
vec3 adjustBrightness(vec3 color, float value) {
  return color + value;
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

mat2 rotate(float angle){
    return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

void main() {
  vec2 uv = vTexCoord*u_resolution;
  vec2 st = vTexCoord;
  vec2 stB = vTexCoord;
  vec2 stPaper = vTexCoord;

  //flip the upside down image
  st.y = 1.0 - st.y;
  stB.y = 1.0 - stB.y;

  vec4 texP = texture2D(p, st);
  vec4 texG = texture2D(g, st);

  float rotAmt = map((texP.r+texP.g+texP.b)/3.0, 0.0, 1.0, 0.0, startRot+(6.28319*4.0));
  float sclAmt = 200.00;
  
  stPaper.xy *= rotate(rotAmt+startRot);
  stPaper.xy *= 4.0;
  //stroke length
  stPaper.y*= 150.0;
  //width between strokes
  stPaper.x*= 1.75;

  vec3 color = vec3(0.0);
  vec3 final = vec3(0.0);
  color = vec3(texP.r, texP.g, texP.b);

  //lum variations
  vec2 lum = vec2((texP.r + texP.g + texP.b)/3.0, (texP.r + texP.g + texP.b)/3.0);
  vec4 colVal = texture2D(g, lum);
  bool painted = false;
  color = colVal.rgb;

  final = color;
  // adjust contrast and saturation
  float brightnessNow = (final.r, final.g, final.b)/3.0;
  final = adjustContrast(final, 0.1);
  final = adjustExposure(final, 0.1);
  final = adjustSaturation(final, -0.1);
  float noiseGray = map(random(st.xy), 0.0, 1.0, -0.1, 0.1);

  if (textured == true) {
    //Paper texture
    stPaper.xy *= rotate(0.7853981633974483*2.0);
    float damageThresh = noise(seed+stPaper.xy);
    float damageDark = 1.0-damageThresh;
    float accentNoise = noise(seed+stB.xy*500.0);
    float oppAccentNoise = 1.0 - accentNoise;
    //offset grid
    float offsetDens = 1000.0;
    float vSinB = sin(seed+st.y*offsetDens);
    float hSinGuide = sin(seed+st.y*(offsetDens/2.0));
    float hSinB = 0.0;
    if(hSinGuide > 0.0) {
      hSinB = sin(seed+st.x*(offsetDens));
    } else {
      hSinB = sin(seed+st.x*offsetDens)*-1.0;
    }

    float midPt = 0.6;
    float expoInc = 0.025;
    //brush texture
    if(damageThresh > midPt && damageThresh < midPt+0.08) {
      final = adjustExposure(final, -expoInc/2.0);
    } else if(damageDark > midPt && damageDark < midPt+0.08) {
      final = adjustExposure(final, expoInc);
    }
  }
  gl_FragColor = vec4(final.rgb, 1.0);
}
