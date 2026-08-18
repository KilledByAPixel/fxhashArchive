precision highp float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform sampler2D ogTex;
uniform vec2 resolution;
uniform float u_time;
uniform vec3 bgColor;
uniform vec3 accentColor;
uniform float frames;
uniform float framesMax;
uniform float randomSeed;
uniform bool bgSplot;

uniform float postNoiseMag;
uniform float postNoiseSpeed;
uniform float postNoiseMix;
uniform float postNoiseAngleMult;

const float PI=3.14159265359;

float random(in vec2 st){
    return fract(sin(dot(st.xy+randomSeed,vec2(12.9898,78.233)))*43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    // Four corners in 2D of a tile
    float a=random(i);
    float b=random(i+vec2(1.,0.));
    float c=random(i+vec2(0.,1.));
    float d=random(i+vec2(1.,1.));
    
    vec2 u=f*f*(3.-2.*f);
    
    return mix(a,b,u.x)+
    (c-a)*u.y*(1.-u.x)+
    (d-b)*u.x*u.y;
}

#define OCTAVES 6
float fbm(in vec2 st){
    // Initial values
    float value=0.;
    float amplitude=.5;
    float frequency=0.;
    //
    // Loop of octaves
    for(int i=0;i<OCTAVES;i++){
        value+=amplitude*noise(st);
        st*=2.;
        amplitude*=.5;
    }
    return value;
}

mat2 rotate(float angle){
    return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

// All components are in the range [0…1], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K=vec4(0.,-1./3.,2./3.,-1.);
    vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));
    vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));
    
    float d=q.x-min(q.w,q.y);
    float e=1.e-10;
    return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K=vec4(1.,2./3.,1./3.,3.);
    vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);
    return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);
}

void main(){
    
    vec2 uv=vTexCoord;
    // the texture is loaded upside down and backwards by default so lets flip it
    uv.y=1.-uv.y;
    
    vec2 originalUv=uv;
    vec3 originalColor=texture2D(ogTex,originalUv).rgb;
    vec3 originColor=texture2D(tex0,originalUv).rgb;
    
    // move the uv coords around a bit using fbm noise
    float angle=fbm(uv*postNoiseMag)*PI*postNoiseAngleMult;
    angle+=randomSeed;// offset the angle when angleMult is 0 to start on a random direction
    // constrain the angle to increments of PI/2
    // angle=floor(angle/(PI/4.))*(PI/4.);
    float mag=postNoiseSpeed;
    uv.x+=cos(angle)*fbm(vec2(uv.x))*mag;
    uv.y+=sin(angle)*fbm(vec2(uv.y))*mag;
    
    // lets get the color of the pixel
    vec3 color=texture2D(tex0,uv).rgb;
    
    // lets convert the color to hsv
    vec3 hsv=rgb2hsv(color);
    vec3 originalHsv=rgb2hsv(originColor);
    
    // background texture test
    if(originalColor==bgColor&&bgSplot){
        vec2 mixUv=vec2(
            uv.x+fbm(uv*10.+u_time*3.)*.5-.25,
            uv.y+fbm(uv*10.+u_time*3.+1000.)*.5-.25
        );
        color=mix(
            color,
            texture2D(tex0,mixUv).rgb,
            .5-frames/framesMax*.5
        );
        
        color=mix(
            color,
            bgColor,
            frames/framesMax*.5
        );
    }
    
    // keep whichever color has higher saturation
    if(originalHsv.y>hsv.y){
        color=originColor;
    }else{
        color=mix(
            color,
            originalColor,
            postNoiseMix
        );
    }
    
    gl_FragColor=vec4(color,1.);
}