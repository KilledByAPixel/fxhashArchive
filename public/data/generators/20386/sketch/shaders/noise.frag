precision highp float;
#define maxN 200
varying vec2 vTexCoord;
uniform sampler2D uTexture;
uniform vec2 uResolution,uRandOffset;
uniform int uSampleCnt,uOctaves;
uniform float uAngles[maxN],uLengths[maxN],uAmpFalloff,uNoiseBase,uRandN,uAlphaFactor;
uniform int uConstrainEdge;

float RAND(vec2 l){return fract(sin(dot(l.xy,uRandOffset))*uRandN);}
float NOISE(vec2 l){vec2 i=floor(l),f=fract(l),u=f*f*(3.-2.*f);float a=RAND(i),b=RAND(i+vec2(1.,0.)),c=RAND(i+vec2(0.,1.)),d=RAND(i+vec2(1.,1.));return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}
float BROWN(vec2 l){float v=0.,a=.5;for(int o=0;o<maxN;o++){v+=a*NOISE(l);l*=2.;a*=uAmpFalloff;if(o==uOctaves){break;}}return v;}
void main(){
    vec2 uv = vTexCoord;
    vec2 texel = 1. / uResolution;
    uv.y = 1. - uv.y;
    float n = BROWN(uv / (1. / uNoiseBase));

    vec4 color = texture2D(uTexture, uv);
    vec4 centerColor = color;
    vec3 rgb = vec3(0.5);
    float alpha = color.a;

    float cntRGB = 1.;
    float cntAlpha = 1.;

    for(int i = 0; i < maxN; i++){
        float a = uAngles[i];
        vec2 v = uv + vec2(cos(a), sin(a)) * texel * uLengths[i] * n;
        vec4 sample = texture2D(uTexture, v);

        alpha += sample.a;
        cntAlpha ++;
        if(sample.a > 0.){
            rgb += sample.rgb;
            cntRGB ++;
        }
        if(i == uSampleCnt){
            break;
        }
    }

    color = vec4(rgb / cntRGB, alpha / cntAlpha);
    if(centerColor.a == 0. && uConstrainEdge == 1){
        color = centerColor;
    }
    color.a *= uAlphaFactor;
    gl_FragColor = color;
}