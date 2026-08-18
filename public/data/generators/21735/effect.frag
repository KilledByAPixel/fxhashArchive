precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;// our texture coming from p5
uniform float u_time;
uniform vec2 focusPos;
uniform vec3 bgColor;
uniform vec3 altColor;
uniform vec3 fgColor;
uniform float gridSize;
uniform vec2 sinMag;
uniform float randSeed;
uniform bool rainbow;
uniform bool paperTexture;

vec3 colors[7];

uniform vec3 clr1;
uniform vec3 clr2;
uniform vec3 clr3;
uniform vec3 clr4;
uniform vec3 clr5;
uniform vec3 clr6;
uniform vec3 clr7;

const float PI=3.14159265359;

float random(in vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898+randSeed,78.233)))*43758.5453123);
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

float circ(vec2 position,float radius,float cols,float rows){
    vec2 pos=position;
    
    pos-=.5;
    pos*=rotate(PI*.25);
    pos+=.5;
    
    // find current col / row of position
    float col=floor(mod(pos.x,1.)*cols);
    float row=floor(mod(pos.y,1.)*rows);
    
    // find the center of the current col / row
    float colCenter=col*float(1./cols)+float(1./cols)/2.;
    float rowCenter=row*float(1./rows)+float(1./rows)/2.;
    
    // find the distance from the center of the current col / row
    float dist=length(vec2(position.x-colCenter,position.y-rowCenter));
    
    // get angle of position
    float angle=atan(position.y-rowCenter,position.x-colCenter);
    
    // return 1. if the distance is less than the radius
    return 1.-step(dist,radius);
}

void main(){
    vec2 uv=vTexCoord;
    
    // the texture is loaded upside down and backwards by default so lets flip it
    // uv.y=1.-uv.y;
    
    // for border, only uncomment when using padding border
    vec2 originalUv=vec2(uv.x,uv.y);
    
    // dotted blur, based on focus position. Causes dof effect
    vec2 oldUv=vec2(uv.x,uv.y);
    float distMag=max(0.,distance(uv,focusPos)*.1-.05)*.3;
    float mag=0.;
    uv+=vec2(fbm(uv*50.)*.0025-.00125);
    uv+=vec2(fbm((1.-uv))*.0025-.00125);
    uv+=vec2(random(vec2(uv.x*100.))*mag-mag/2.,random(vec2(uv.y*100.))*mag-mag/2.);
    
    // uv+=(fbm(uv*10.)*.1-.05)*abs(uv.x-.5);
    
    // get the color from the texture at the current uv
    vec4 tex=texture2D(tex0,uv);
    
    // get colors
    // colors[0]=vec3(232./255.,123./255.,75./255.);
    // colors[1]=vec3(59./255.,180./255.,119./255.);
    // colors[2]=vec3(69./255.,107./255.,140./255.);
    // colors[3]=vec3(190./255.,165./255.,168./255.);
    // colors[4]=vec3(240./255.,181./255.,16./255.);
    // colors[5]=vec3(134./255.,68./255.,166./255.);
    // colors[6]=vec3(34./255.,40./255.,49./255.);
    
    colors[0]=clr1;
    colors[1]=clr2;
    colors[2]=clr3;
    colors[3]=clr4;
    colors[4]=clr5;
    colors[5]=clr6;
    colors[6]=clr7;
    
    // recombine the three texures into a single one for output
    vec3 ogColor=vec3(tex.r,tex.g,tex.b);
    float brightness=max(.1,(ogColor.r+ogColor.g+ogColor.b)/2.)-.2;
    bool grayscale=(ogColor.r==ogColor.g)&&(ogColor.g==ogColor.b);
    bool isBg=(ogColor.r==1.&&ogColor.g==1.&&ogColor.b==1.);
    
    // dotted texture with density based on brightness
    float cols=gridSize*50.+fbm(vec2(uv.y*10.))*sinMag.x;//*(fbm(uv)*10.);
    float rows=gridSize*50.+fbm(vec2(uv.x*10.))*sinMag.y;//*(fbm(uv)*10.);
    
    // mix color 1 (bgColor)
    vec3 color=bgColor;
    vec3 mixClr=fgColor;
    vec3 fbmColor=mixClr;
    
    if(rainbow){
        float colorIndex=clamp(fbm(uv*2.+randSeed)*7.,0.,7.);
        float colorIndex2=clamp(brightness*10.,0.,7.);
        colorIndex=mix(colorIndex,colorIndex2,1.);
        if(colorIndex<1.){
            mixClr=mix(colors[0],colors[1],colorIndex);
        }else if(colorIndex<2.){
            mixClr=mix(colors[1],colors[2],colorIndex-1.);
        }else if(colorIndex<3.){
            mixClr=mix(colors[2],colors[3],colorIndex-2.);
        }else if(colorIndex<4.){
            mixClr=mix(colors[3],colors[4],colorIndex-3.);
        }else if(colorIndex<5.){
            mixClr=mix(colors[4],colors[5],colorIndex-4.);
        }else if(colorIndex<6.){
            mixClr=mix(colors[5],colors[0],colorIndex-5.);
        }else if(colorIndex<7.){
            mixClr=mix(colors[0],colors[1],colorIndex-6.);
        }
        
        // float c=fbm(uv*10.);
        // mixClr=vec3(c,c,c);
    }
    
    float val=circ(originalUv,brightness/float(cols),cols,rows);
    color=mix(
        color,
        mixClr,
        val
    );
    
    // mix color 2 (alt color)
    // mixClr=altColor;
    float val2=circ(originalUv,brightness/float(cols),cols*2.,rows*2.);
    float mult=1.;
    if(grayscale){
        mult=.1;
    }
    // color=mix(
        //     color,
        //     mixClr,
        //     val2*mult
    // );
    
    // color=mix(
        //     color,
        //     fgColor,
        //     tex.a*.5
    // );
    
    // border
    vec2 padding=vec2(.025,.025*.75);
    vec2 borderUv=originalUv;
    if(borderUv.x<padding.x||borderUv.x>1.-padding.x||borderUv.y<padding.y||borderUv.y>1.-padding.y){
        color=mix(
            color,
            fgColor,
            1.
        );
    }
    
    // paper texture
    if(paperTexture){
        vec2 paperMult=vec2(100.,2500.);// x,y axis of multiplication of noise
        float paperOffset=.0005;// offset between highlight / shadow
        vec2 paperUv=vec2(uv.x,uv.y);// copy uv to morph it
        paperUv+=(fbm(paperUv*3.)*.1-.05)*.5;// add noise to copied uv
        
        vec2 paperUvDark=vec2((paperUv.x+paperOffset)*paperMult.x,(paperUv.y+paperOffset)*paperMult.y);
        vec2 paperUvLight=vec2((paperUv.x-paperOffset)*paperMult.x,(paperUv.y-paperOffset)*paperMult.y);
        
        color-=step(.6,fbm(paperUvDark))*.1;// shadow
        color+=step(.6,fbm(paperUvLight))*.1;// highlight
    }
    
    // color-=step(0.,sin(paperUvDark.x))*step(0.,sin(paperUvDark.y))*.1;
    // color+=step(0.,sin(paperUvLight.x))*step(0.,sin(paperUvLight.y))*.1;
    
    color-=random(originalUv*1000.)*.1;// grain
    
    gl_FragColor=vec4(color,1.);
}