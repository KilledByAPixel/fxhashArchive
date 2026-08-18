precision highp float;
#define maxN 250
varying vec2 vTexCoord;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uRandOffset;
uniform int uSampleCnt;
uniform int uOctaves;
uniform float uAngles[maxN];
uniform float uLengths[maxN];
uniform float uAmpFalloff;
uniform float uNoiseBase;
uniform float uRandN;
uniform int uConstrainEdge;
uniform float uLineWidth;


float RAND(vec2 l){return fract(sin(dot(l.xy,uRandOffset))*uRandN);}
float NOISE(vec2 l){vec2 i=floor(l),f=fract(l),u=f*f*(3.-2.*f);float a=RAND(i),b=RAND(i+vec2(1.,0.)),c=RAND(i+vec2(0.,1.)),d=RAND(i+vec2(1.,1.));return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}
float BROWN(vec2 l){float v=0.,a=.5;for(int o=0;o<maxN;o++){v+=a*NOISE(l);l*=2.;a*=uAmpFalloff;if(o==uOctaves){break;}}return v;}

void main(){
    vec2 uv = vTexCoord;
    vec2 texel = 1. / uResolution;
    uv.y = 1. - uv.y;

    float transparentCnt = 0.;
    float opaqueCnt = 0.;
    float localAlpha = texture2D(uTexture, uv).a;

    for(float i = 0.; i < 360.; i++){
        float a = radians(i);
        vec2 v = uv + vec2(cos(a), sin(a)) * texel * uLineWidth;
        texture2D(uTexture, v).a > 0. ? opaqueCnt++ : transparentCnt++;
    }

    float a = (transparentCnt * opaqueCnt > 0. && localAlpha <= 0.) ? 2. : 0.;
    gl_FragColor = uLineWidth < 0. ? vec4(0.) : vec4(0.,0.,0.,a);
}
