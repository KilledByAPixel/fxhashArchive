precision highp float;
#define maxN 250

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int uSampleCnt;
uniform float uAngles[maxN];
uniform float uLengths[maxN];
uniform float uDiff;
uniform float uAlphaWeight;
uniform int uConstrainEdge;


void main()
{
  vec2 v = vTexCoord;
  v.y = 1. - v.y;
  vec2 texelSize = 1.0 / uResolution;
  vec4 color = texture2D(uTexture, v);
  vec4 centerColor = color;

  gl_FragColor = centerColor;

  float base = 1.;
  float maxDist = distance(vec4(0.), vec4(1.));

  for(int i=0; i<maxN; i++){
    float a = uAngles[i];
    vec2 l = v + vec2(cos(a), sin(a)) * texelSize * uLengths[i];

    vec4 sample = texture2D(uTexture, l);
    float diff = step(distance(sample, centerColor) / maxDist, uDiff);
    float dist =  max(0., 1. - distance(v, l));
    float weight = diff * dist;
    color += sample * weight;
    base += weight;

    if(i == uSampleCnt){
        break;
        }
  }
  color = (centerColor.a == 0. && uConstrainEdge == 1) ? centerColor : color / base;
  color.a *= 1.4;
  gl_FragColor = color;
}