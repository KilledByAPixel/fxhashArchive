#ifdef GL_ES
precision highp float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

//textures and uniforms from p5
uniform sampler2D p;
uniform vec2 u_resolution;
uniform float seed;
uniform bool textured;
uniform float startRot;
uniform vec3 bgc;
uniform float marg;

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
  vec2 stDmg = vTexCoord;

  //flip the upside down image
  st.y = 1.0 - st.y;

  vec4 texP = texture2D(p, st);


  vec3 color = vec3(0.0);
  color = texP.rgb;

  //stroke params
  float startRot = 0.0;
  float rotAmt = 0.0;//6.28319/0.0;
  float expoInc = 0.0;
  // stB.xy*=10.0;

  expoInc = map(noise(seed+st.xy*10.0), 0.0, 1.0, 0.015, 0.03);
  
  //Paper texture params
  stPaper.xy *= rotate(rotAmt);
  //scale
  stPaper.xy *= 100.0;
  //stroke length
  stPaper.y*= 6.0;
  //width between strokes
  stPaper.x*= 1.0;


  //paper damage params
  stDmg.xy *= 500.0;
  //color noise
  float noiseGray = map(random(st.xy), 0.0, 1.0, -0.05, 0.05);

  vec3 final = vec3(0.0);
  final = color;

  //Draw margin
  float margX = marg;
  float margY = margX*0.8;
  if(stB.x < margX || stB.x > 1.0-margX || stB.y < margY || stB.y > 1.0-margY) {
    final = vec3(1.0);
  }

  float midPt = 0.65;
  float dmgPt = 0.1;
  float dmgPercent = 0.5;

  float damageThresh = noise((seed+(st.xy*100.0))+stDmg.xy);
  
  float paperThresh = noise((seed+(st.y*200.0))+stPaper.xy);
  float paperDark = 1.0-paperThresh;
  if(textured == true) {
    if(paperThresh > midPt && paperThresh < midPt+0.3) {
      if(bgc.r > 0.5) {
        final = adjustExposure(final, -expoInc/4.0);
      } else {
        final = adjustBrightness(final, -expoInc/4.0);
      }
        
    } else if(paperDark > midPt && paperDark < midPt+0.3) {
      if(bgc.r > 0.5) {
        final = adjustExposure(final, expoInc/4.0);
      } else {
        final = adjustBrightness(final, expoInc/4.0);
      }
        
    }

    if(damageThresh > dmgPt && damageThresh < dmgPt+0.05) {
      float inc = map(damageThresh, 0.0, dmgPercent, 0.0, 0.2);
      final.rgb = mix(final.rgb, bgc.rgb, inc);
    }
  }

  


  final += noiseGray;
  gl_FragColor = vec4(final, 1.0);
}
