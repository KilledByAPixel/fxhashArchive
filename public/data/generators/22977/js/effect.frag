precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform vec2 resolution;
uniform float u_time;
uniform vec3 borderColor;
uniform vec3 accentColor;
uniform bool finished;
uniform bool removeRandom;
uniform vec2 paperMult;
uniform float randomSeed;
// uniform float mag;

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
    
    // for border, only uncomment when using padding border
    vec2 originalUv=vec2(uv.x,uv.y);
    
    // dotted shader
    vec2 oldUv=vec2(uv.x,uv.y);
    float mag=0.;// set to uniform if you want to change it on the fly
    uv+=vec2(fbm(uv*50.)*mag-mag/2.);
    // uv+=vec2(fbm((1.-uv))*mag-mag/2.);
    uv+=vec2(random(vec2(uv.x))*mag-mag/2.,random(vec2(uv.y))*mag-mag/2.);
    
    vec4 tex=texture2D(tex0,uv);
    
    // recombine the three texures into a single one for output
    vec3 color=vec3(tex.r,tex.g,tex.b);
    float brightness=(color.r+color.g+color.b)/3.;
    
    // combine dotted texture with original to create sharp yet soft edges
    // only uncomment when you are using dotted shader
    vec4 oldTex=texture2D(tex0,oldUv);
    // color=mix(
        //     color,
        //     vec3(oldTex.r,oldTex.g,oldTex.b),
        //     fbm(uv)*.5+.5
    // );
    
    if(finished){
        if(removeRandom)color-=random(uv*10.)*.1;
        else color+=random(uv*10.)*.03;
        color+=fbm(uv*3.5)*.025;
        
        color=mix(
            color,
            borderColor,
            fbm(uv*5.5)*.1
        );
        
        // paint texture
        // vec2 paperMult=vec2(800.,100.);// x,y axis of multiplication of noise
        
        float paperOffset=.0003;// offset between highlight / shadow
        vec2 paperUv=vec2(originalUv.x,originalUv.y);// copy uv to morph it
        
        if(paperMult.x!=paperMult.y){
            paperUv+=(fbm(paperUv*4.)*.1-.05);// add noise to copied uv
            paperUv*=rotate(floor((color.r+color.g+color.b)*8.)/8.*PI);// rotate copied uv based on color
        }
        
        vec2 paperUvDark=vec2((paperUv.x+paperOffset)*paperMult.x,(paperUv.y+paperOffset)*paperMult.y);
        vec2 paperUvLight=vec2((paperUv.x-paperOffset)*paperMult.x,(paperUv.y-paperOffset)*paperMult.y);
        
        float paintMag=.05;
        color-=step(.6,fbm(paperUvDark))*paintMag;// shadow
        color+=step(.6,fbm(paperUvLight))*paintMag;// highlight
        
        // border
        vec2 padding=vec2(.015,.015*.75);
        vec2 borderUv=originalUv;
        if(borderUv.x<padding.x||borderUv.x>1.-padding.x||borderUv.y<padding.y||borderUv.y>1.-padding.y){
            // color=mix(accentColor,borderColor,.95);
            // color=mix(
                //     color,
                //     accentColor,
                //     fbm(uv*5000.)*.1
            // );
            // color=mix(
                //     color,
                //     borderColor,
                //     random(uv*10.)*.5
            // );
        }
    }
    
    gl_FragColor=vec4(color,1.);
}