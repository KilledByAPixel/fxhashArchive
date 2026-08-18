// created by florian berger (flockaroo) - 2022
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

/*
 Mountain View

 fully generative mountain view from different locations and view angles.
 every minted image can be displayed (and downloaded as SVG) in different color schemes varying
 from extreme colors over subtle shading to pure outlines
 ...also pays off to play with different aspect ratios

 press 's' for downloading as SVG image file
 press 'c' for toggling between 6 different color modes
 */

function resize()
{
  resizeCanvas(window.innerWidth,window.innerHeight);
  ix0=0;
  iy0=0;
  posOut=false;
  negOut=false;
  yOut=false;
  g_frameCnt=0;
  tris=[];
}

window.addEventListener("resize", resize);

function setup() {
    startTime=Date.now()/1000.0;
    createCanvas(window.innerWidth,window.innerHeight);
    //createCanvas(800,80);
}

const PI2=Math.PI*2.0;
const PI=Math.PI;


//var create_360=true;
var create_360=false;

//var tintCol=[1,1,1];
//var c_cnt=2;
//var g_th = 1.35;
//var PosX=(myrandom()-.5)*10.;
//var PosY=(myrandom()-.5)*10.;
//var PosZ    = 1.;
var tintCol = hsv2rgb([window.$fxhashFeatures.TintHue,window.$fxhashFeatures.TintSat,1.]);
var colorHash = window.$fxhashFeatures.ColorHash;
var c_cnt   = window.$fxhashFeatures.ColorMode;
var g_th    = window.$fxhashFeatures.Elev;
var g_ph    = window.$fxhashFeatures.Azim;
var PosX    = window.$fxhashFeatures.PosX;
var PosY    = window.$fxhashFeatures.PosY;
var PosZ    = window.$fxhashFeatures.PosZ;
var FrameXR = .075;
var FrameYR = .075;
//c_cnt   =2;
//tintCol = [1,1,1];
//g_th=1.;
//c_cnt=2;
var colorQuat = randQuat(colorHash);

var FrameX = 0;
var FrameY = 0;

var fogCol=[1,1,1];
var g_zoom_t = 1.;
var g_zoom = 1.;
var g_ph_t = 0.;
var g_ph = 0.;
var g_th_t = 0.;
//var g_th = PI2*.25;
var mouseX_p=-1;
var mouseY_p=-1;


function mouseWheel(event) {
    g_zoom_t *= (event.delta > 0) ? 1./.9 : .9;
    g_zoom_t = min(1.5,max(g_zoom_t,.5));
}

function myrandom()
{
  return fxrand();
  //return Math.random();
}

var tanFOVh=.5;

var SQH=.707106781187;

function macos(x) { return Math.acos(x); }
function masin(x) { return Math.asin(x); }
function matan(y,x) { return Math.atan2(y,x); }
function mcos(x) { return Math.cos(x); }
function msin(x) { return Math.sin(x); }
function cos2(x) { return [Math.cos(x[0]),Math.cos(x[1])]; }
function cos3(x) { return [Math.cos(x[0]),Math.cos(x[1]),Math.cos(x[2])]; }
function sin2(x) { return [Math.sin(x[0]),Math.sin(x[1])]; }
function sin3(x) { return [Math.sin(x[0]),Math.sin(x[1]),Math.sin(x[2])]; }
function sin4(x) { return [Math.sin(x[0]),Math.sin(x[1]),Math.sin(x[2]),Math.sin(x[3])]; }
function SC(x) { return [Math.sin(x),Math.cos(x)]; }
function add2(a,b) { return [a[0]+b[0],a[1]+b[1]]; }
function add3(a,b) { return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]; }
function add31(a,b) { return [a[0]+b,a[1]+b,a[2]+b]; }
function add4(a,b) { return [a[0]+b[0],a[1]+b[1],a[2]+b[2],a[3]+b[3]]; }
function sub3(a,b) { return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
function sub2(a,b) { return [a[0]-b[0],a[1]-b[1]]; }
function dot3(a,b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
function abs3(a) { return [a[0]>0?a[0]:-a[0],a[1]>0?a[1]:-a[1],a[2]>0?a[2]:-a[2]]; }
function scale2(a,b) { return [a[0]*b,a[1]*b]; }
function scale3(a,b) { return [a[0]*b,a[1]*b,a[2]*b]; }
function scale4(a,b) { return [a[0]*b,a[1]*b,a[2]*b,a[3]*b]; }
function mul3(a,b) { return [a[0]*b[0],a[1]*b[1],a[2]*b[2]]; }
function mul4(a,b) { return [a[0]*b[0],a[1]*b[1],a[2]*b[2],a[3]*b[3]]; }
function mymix(a,b,f) { return a*(1.0-f)+b*f; }
function mymix22(a,b,f) { return [a[0]*(1.0-f[0])+b[0]*f[0],a[1]*(1.0-f[1])+b[1]*f[1]]; }
function mix1(a,b,f) { return a*(1.0-f)+b*f; }
function mix3(a,b,f) { return add3(scale3(a,(1.0-f)),scale3(b,f)); }
function length2(a) { return Math.sqrt(a[0]*a[0]+a[1]*a[1]); }
function length3(a) { return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]); }
function length4(a) { return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]+a[3]*a[3]); }
function normalize3(a) { return scale3(a,1.0/length3(a)); } 
function normalize4(a) { return scale4(a,1.0/length4(a)); }
function cross(a,b) {
    return [
        a[1]*b[2]-b[1]*a[2],
        a[2]*b[0]-b[2]*a[0],
        a[0]*b[1]-b[0]*a[1]
    ];
}
const G=(.5+Math.sqrt(5./4.));
function fract1(a) {return a-Math.floor(a);}
function floor2(a) { return [Math.floor(a[0]),Math.floor(a[1])];}
function fract2(a) { return [fract1(a[0]),fract1(a[1])];}
function fract3(a) { return [fract1(a[0]),fract1(a[1]),fract1(a[2])];}
function fract4(a) { return [fract1(a[0]),fract1(a[1]),fract1(a[2]),fract1(a[3])];}
function clamp1(a,a1,a2) { return a<a1?a1:(a>a2?a2:a); }
function clamp31(a,a1,a2) { return [clamp1(a[0],a1,a2),clamp1(a[1],a1,a2),clamp1(a[2],a1,a2)];}
function inverseQuat(q)
{
    //return vec4(-q.xyz,q.w)/length(q);
    // if already normalized this is enough
    return [-q[0],-q[1],-q[2],q[3]];
}

function multQuat(a,b)
{
    //return vec4(cross(a.xyz,b.xyz) + a.xyz*b.w + b.xyz*a.w, a.w*b.w - dot(a.xyz,b.xyz));
    var v=add3(add3(cross(a,b), scale3(a,b[3])), scale3(b,a[3]));
    var w=a[3]*b[3]-dot3(a,b);
    return [v[0],v[1],v[2],w];
}

function transformVecByQuat( v, q )
{
    //return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w*v );
    return add3(v, scale3(cross( q, add3(cross( q, v ) , scale3(v,q[3]) )) ,2.0));
}

function axAng2Quat(ax, ang)
{
    //return vec4(normalize(ax),1)*sin(vec2(ang*.5)+vec2(0,PI2*.25)).xxxy;
    var s=sin2([ang*0.5,ang*0.5+PI2*0.25]);
    var nax=normalize3(ax);
    return [nax[0]*s[0],nax[1]*s[0],nax[2]*s[0],s[1]];
}

function randQuat3(r) // construct a homogeneously distributed quaternion out outg 3 [0..1] white noise numbers
{
    s=[msin(PI2*r[2]*.5),mcos(PI2*r[2]*.5)]; // random angle of rotation out of r.z*PI2
    return mul4([
                 mcos(r[0]*PI2)*Math.sqrt(1.-r[1]*r[1]), // axis with r.y as z and r.x*PI2 as angle in xy
                 msin(r[0]*PI2)*Math.sqrt(1.-r[1]*r[1]), // axis with r.y as z and r.x*PI2 as angle in xy
                 r[1],1],
                 [s[0],s[0],s[0],s[1]]);
}

function randQuat(r) // construct a homogeneously distributed quaternion out outg 1 [0..1] white noise number
{
    return randQuat3([r,fract1(r*256.),fract1(r*256.*256.)]);
}


function rotX(ph,v) {
    return [ v[0],v[1]*mcos(ph)+v[2]*msin(ph), v[2]*mcos(ph)-v[1]*msin(ph) ];
}
function rotY(ph,v) {
    return [ v[0]*mcos(ph)+v[2]*msin(ph), v[1], v[2]*mcos(ph)-v[0]*msin(ph) ];
}
function rotZ(ph,v) {
    return [ v[0]*mcos(ph)+v[1]*msin(ph), v[1]*mcos(ph)-v[0]*msin(ph), v[2] ];
}

function hsv2rgb(c)
{
    var K = [1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0];
    var p = abs3(sub3(scale3(fract3(add3([c[0],c[0],c[0]],K)), 6.0), [3,3,3]));
    return scale3( mix3([1,1,1], clamp31(sub3(p,[1,1,1]), 0.0, 1.0), c[1]), c[2]);
}

function getDir(ix,iy,nx,ny)
{
    var uv=[ix/nx,iy/ny];
    uv[1]=1.-uv[1];

    if (create_360)
    return [mcos(uv[0]*PI2),
            //((uv[1]*2.-1.)*height/width*PI),
            (uv[1]*height/width*PI),
            msin(uv[0]*PI2)];

    //uv[1]=mix1(uv[1],Math.sqrt(uv[1]),.5);
    //uv[1]*=uv[1];
    return [(uv[0]*2.-1.)*tanFOVh,(uv[1]*2.-1.)*height/width*tanFOVh,-1.];
}

function trafo(p,do_transl)
{
    var pt=p;
    if(do_transl) pt=add3(pt,[0,0,-PosZ]);
    pt=rotZ(g_ph,pt);
    pt=rotX(g_th,pt);
    return pt;
}

function trafoi(p,do_transl)
{
    var pt=p;
    pt=rotX(-g_th,pt);
    pt=rotZ(-g_ph,pt);
    if(do_transl) pt=add3(pt,[0,0,PosZ]);
    return pt;
}

function project(p)
{
    var s=max(width,height)*.5;
    var sm=min(width,height)*.5;
    var d0=1/tanFOVh;
    //p[2]+=MOEB_R*1.3/tanFOVh*g_zoom;
    //mcos(uv[0]*PI2)
    if (create_360)
    {
        var ang=matan(p[2],p[0]); if(ang<0.) ang+=PI2;
        //((uv[1]*2.-1.)*height/width*PI)
        return [ang/PI2*width,
                //p[1]/-length2([p[0],p[2]])/PI*width*.5+height*.5,
                p[1]/-length2([p[0],p[2]])/PI*width*.5,
                length2([p[0],p[2]])];
    }

    return [p[0]/p[2]/tanFOVh*width*.5+width*.5,
            p[1]/p[2]/tanFOVh*width*.5+height*.5,
            p[2] ];
}

var sky=false;

function applyOffs(p_i)
{
    var p=p_i;
    p[0]-=PosX;
    p[1]-=PosY;
    var im=[0,0,0,0];
    for(var sc=10.;sc>.02;sc/=1.2) {
        //var q = [0,0,0,1];
        var im=fract4(add4(im,scale4([7,11,13,5],1./SQH)));
        var q = normalize4(im);
        //vec4 ri=getRand(i);
        //q = randQuat(im.xyz);
        //uv=transformVecByQuat(p,q).xy*sc*.08+vec2(.1,1.4)*.65+vec2(.1,1.4)*iTime*.003*sc*.5*1.;
        //p+=(getRand(uv+0.*vec2(13*i,17*i)/256.).xyz-.5)/(sc)*.02;
        var pt=scale3(transformVecByQuat(p,q),sc*60.);
        //p+=(-abs(sin(pt.zxy*.5+iTime*sqrt(sc)*1.+1.*vec3(7*i,13*i,17*i)))+.6)/(sc)*.012;
        //p+=sin(pt.yxz*.5+pt.zxy*.67+im.xyz+vec3(.7,1.1,.5)*sc*1.*(iTime*1.+2.1)+0.*im.wxy)/sc*.006;
        //p+=sin(pt.yxz*.5+pt.zxy*.67)/sc*.006;
        p=add3(p,scale3(cos3([pt[1],pt[0],pt[2]]),(sky?.002:.005)/sc));
        //p+=cos((pt.yxz)*1.3+vec3(.7,1.1,.5)*sc*1.*(iTime*1.+2.1)+0.*im.wxy)/sc*.003;
    }
    p[0]+=PosX;
    p[1]+=PosY;
    return p;
}

var g_frameCnt=0;

var ix0=0;
var iy0=0;
var posOut=false;
var negOut=false;
var yOut=false;
var drawing_ready=false;

var tris=[];

var ldir=normalize3([1,1,1]);

function getFillCol(n,fogFade)
{
    var fillCol;
    if(c_cnt%6==0) return [.4,.4,.4];
    if(c_cnt%6==1) return [1,1,1];
    if(c_cnt%6==2 || c_cnt%6==4)
    {
        var n2=transformVecByQuat(n,colorQuat);
        fillCol=mix3(add3(scale3(n2,.5),[.5,.5,.5]),fogCol,fogFade*.8);
        fillCol=mul3(fillCol,mix3(tintCol,[1,1,1],.8));
        if (c_cnt%6==4) fillCol=scale3(fillCol,.6);
        return fillCol;
    }
    if(c_cnt%6==3 || c_cnt%6==5)
    {
        fillCol=mix3(scale3([1,1,1],max(dot3(n,ldir),0.)+.3),[.5,.5,.5],fogFade*.8);
        fillCol=mul3(fillCol,mix3(tintCol,[1,1,1],.5*fillCol[0]*fillCol[0]));
        if (c_cnt%6==5) fillCol=scale3(fillCol,.9);
        return fillCol;
    }
    return scale3(fogCol,.8);
    return fillCol;
}

function getStrokeCol(n,fogFade)
{
    if(c_cnt%6==0) return [1,1,1];
    if(c_cnt%6==1) return [.4,.4,.4];
    if(c_cnt%6==2 || c_cnt%6==4)
    {
        var bright=((c_cnt%6==4)?1.:0.);
        var col=scale3(getFillCol(n,fogFade),.5+1.2*bright);
        col=add31(col,(bright-.5)*.1);
        col=clamp31(col,0.,1.);
        col=mix3(col,fogCol,fogFade*.35);
        return col;
    }
    if(c_cnt%6==3 || c_cnt%6==5)
    {
        var bright=((c_cnt%6==5)?1.:0.);
        var col=scale3(getFillCol(n,fogFade),.5+1.2*bright);
        col=add31(col,(bright-.5)*.1);
        col=clamp31(col,0.,1.);
        col=mix3(col,fogCol,fogFade*.35);
        return col;
    }
    return scale3(getFillCol(n,fogFade),.5);
}

function getBgCol()
{
    if(c_cnt%6==0) return [0,0,0];
    if(c_cnt%6==1) return [1,1,1];
    if(c_cnt%6==2) return scale3(mix3(tintCol,[.9,1,1.1],.8),.73);
    if(c_cnt%6==3) return scale3(tintCol,.75);
    if(c_cnt%6==4) return scale3(mix3(tintCol,[.9,1,1.1],.8),.73);
    if(c_cnt%6==5) return scale3(tintCol,.25);
    return scale3(fogCol,.8);
}


function draw() {

    FrameX = width*FrameXR;
    FrameY = width*FrameXR;

    if(create_360) { FrameX=0.; FrameY=0.; }
    var t=(Date.now()/1000.0-startTime)*1.;

    //PosX=(myrandom()-.5)*100.;
    //PosY=(myrandom()-.5)*100.;

    var numX=500;
    var numY=int(numX*height/width)*.7;

    var YOverShoot=1.;

    var QuadsPerFrame = numX;

    //fogCol=[.8,.9,1];
    fogCol=tintCol;
    fogCol=getBgCol();

    if (g_frameCnt*QuadsPerFrame>numX*numY*YOverShoot) {
        //g_frameCnt=0;
        //phi++;
    }

    if (g_frameCnt==0) { background(scale3(getBgCol(),255)); }

    if(!yOut)
    {
        var yOut2=true;
        for(var i=0;i<QuadsPerFrame;i++)
        {
            var ix=int(numX/2) + ((ix0%2==0)?int(ix0/2):-int(ix0/2));
            var iy=iy0;
            var p  =[[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
            var pu =[[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
            var pp =[[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
            var dir=[[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
            var p0=trafoi([0,0,0],true);
            for(var j=0;j<4;j++)
            {
                off=[[0,0],[1,0],[1,1],[0,1]];
                dir[j]=trafoi(getDir(ix+off[j][0],iy+off[j][1],numX,numY),false);
                p[j]=p0;
                // project to z=0
                p[j]=add3(p[j],scale3(dir[j],-p[j][2]/dir[j][2]));
                //if(i==int(QuadsPerFrame/2*0)) console.log("p0="+p[0]);
                p[j]=applyOffs(p[j]);
                pu[j]=p[j];
                p[j]=trafo(p[j],true);
                pp[j]=project(p[j]);
            }
            sky=false;
            if(dir[0][2]>0.) sky=true;
            var n  = normalize3(cross(sub3(pu[2],pu[0]),sub3(pu[1],pu[0])));
            var n2 = normalize3(cross(sub3(pu[3],pu[0]),sub3(pu[2],pu[0])));
            //console.log("fillCol="+n);

            var fillCol;

            var dp=sub3(pu[0],p0);
            //var fogFade=(1.-Math.exp(-.025*length3(dp)))*1.3;
            var iy_hor=numY*.5-Math.tan(1.57-g_th)/(tanFOVh*height/width)*numY*.5;
            var fogFade=1.-Math.abs(iy-iy_hor)/numY*1.7;
            if(create_360) fogFade=1.-iy/numY*.5;

            noStroke();
            strokeWeight(0.5);
            fillCol=getFillCol(n,fogFade);
            strokeCol=getStrokeCol(n,fogFade);
            fill(scale3(fillCol,255.));
            stroke(scale3(strokeCol,255.));

            /*quad(pp[0][0],pp[0][1],
                 pp[1][0],pp[1][1],
                 pp[2][0],pp[2][1],
                 pp[3][0],pp[3][1]);*/

            var drawit=true;
            if(Math.abs(p[0][2])>120.) drawit=false;
            if( create_360 ) {
                if(length2(sub2(pp[0],pp[1]))>width*.3) drawit=false;
                if(length2(sub2(pp[1],pp[2]))>width*.3) drawit=false;
                if(length2(sub2(pp[2],pp[3]))>width*.3) drawit=false;
                if(length2(sub2(pp[3],pp[0]))>width*.3) drawit=false;
            }
            if(drawit) {
            if(dot3(n,(dp))<0.)
            if( !(pp[0][0]<FrameX || pp[0][0]>width-FrameX ||
                  pp[0][1]<FrameY || pp[0][1]>height-FrameY ) )
            {
                tris.push( pp[0][0],pp[0][1], pp[1][0],pp[1][1], pp[2][0],pp[2][1], fogFade, n[0],n[1],n[2] );
                triangle(  pp[0][0],pp[0][1], pp[1][0],pp[1][1], pp[2][0],pp[2][1] );
            }

            fillCol=getFillCol(n2,fogFade);
            strokeCol=getStrokeCol(n2,fogFade);
            fill(scale3(fillCol,255.));
            stroke(scale3(strokeCol,255.));

            if(dot3(n2,(dp))<0.)
            if( !( pp[0][0]<FrameX || pp[0][0]>width-FrameX ||
                   pp[0][1]<FrameY || pp[0][1]>height-FrameY ) )
            {
                tris.push( pp[0][0],pp[0][1], pp[2][0],pp[2][1], pp[3][0],pp[3][1], fogFade, n2[0],n2[1],n2[2] );
                triangle(  pp[0][0],pp[0][1], pp[2][0],pp[2][1], pp[3][0],pp[3][1] );
            }
            }
            if(pp[0][0]<FrameX)        { negOut=true; }
            if(pp[0][0]>width-FrameX)  { posOut=true; }
            if(pp[0][1]<height-FrameY) { yOut2=false; }
            if(pp[1][1]<height-FrameY) { yOut2=false; }
            if(pp[2][1]<height-FrameY) { yOut2=false; }
            if(pp[3][1]<height-FrameY) { yOut2=false; }

            ix0++;
            if( negOut && posOut && (!create_360)  ) {
                posOut=false;
                negOut=false;
                ix0=0;
                iy0++;
                //break;
            }
        }
        if(create_360) iy0++;
        yOut=yOut2;
    }
    else
    {
        if(!drawing_ready) {
            console.log("ready!!!");
            fxpreview();
        }
        drawing_ready=true;
    }

    g_frameCnt++;
}

var Base64={
    _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode:function(e){
        var t="";
        var n,r,i,s,o,u,a;
        var f=0;
        e=Base64._utf8_encode(e);
        while(f<e.length){
            n=e.charCodeAt(f++);
            r=e.charCodeAt(f++);
            i=e.charCodeAt(f++);
            s=n>>2;
            o=(n&3)<<4|r>>4;
            u=(r&15)<<2|i>>6;
            a=i&63;
            if(isNaN(r)){
                u=a=64
            }
            else if(isNaN(i)){
                a=64
            }
            t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)
        }
        return t;
    },
    decode:function(e){
        var t="";
        var n,r,i;
        var s,o,u,a;
        var f=0;
        e=e.replace(/\++[++^A-Za-z0-9+/=]/g,"");
        while(f<e.length){
            s=this._keyStr.indexOf(e.charAt(f++));
            o=this._keyStr.indexOf(e.charAt(f++));
            u=this._keyStr.indexOf(e.charAt(f++));
            a=this._keyStr.indexOf(e.charAt(f++));
            n=s<<2|o>>4;
            r=(o&15)<<4|u>>2;
            i=(u&3)<<6|a;
            t=t+String.fromCharCode(n);
            if(u!=64){t=t+String.fromCharCode(r)}
            if(a!=64){t=t+String.fromCharCode(i)}
        }
        t=Base64._utf8_decode(t);
        return t
    },
    _utf8_encode:function(e){
        e=e.replace(/\r\n/g,"n");
        var t="";
        for(var n=0;n<e.length;n++){
            var r=e.charCodeAt(n);
            if(r<128){t+=String.fromCharCode(r)}
            else if(r>127&&r<2048){
                t+=String.fromCharCode(r>>6|192);
                t+=String.fromCharCode(r&63|128)
            }else{
                t+=String.fromCharCode(r>>12|224);
                t+=String.fromCharCode(r>>6&63|128);
                t+=String.fromCharCode(r&63|128)}
        }
        return t
    },
    _utf8_decode:function(e){
        var t="";
        var n=0;
        var r=c1=c2=0;
        while(n<e.length){
            r=e.charCodeAt(n);
            if(r<128){
                t+=String.fromCharCode(r);n++
            }else if(r>191&&r<224){
                c2=e.charCodeAt(n+1);
                t+=String.fromCharCode((r&31)<<6|c2&63);
                n+=2
            }else{
                c2=e.charCodeAt(n+1);
                c3=e.charCodeAt(n+2);
                t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}
        }return t
    }
}

function hexCol1(c)
{
    c=clamp31(c,0.,1.);
    var i = int(c[2]*255)+int(c[1]*255)*256+int(c[0]*255)*256*256; // your number
    return ("00000" + i.toString(16)).substr(-6);
}

function downloadSVG()
{
    titleinfo = document.title;
    //metainfo = " Florian Berger (flockaroo) - https://flockaroo.at "
    //var txt="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 "+width+" "+height+"' height='"+height+"' width='"+width+"'>\n";
    var txt="";
    txt+='<?xml version="1.0" encoding="utf-8"?>\n';
    txt+="<!-- "+titleinfo+" -->\n";
    txt+='<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
    txt+="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 "+width+" "+height+"'>\n";
    txt+="<metadata>\n";
    txt+=titleinfo+"\n";
    txt+="This SVG image is licensed under CC BY-SA 4.0\n"
    txt+="</metadata>\n";

    txt+="<rect fill='#"+hexCol1(getBgCol())+"' width='"+width+"' height='"+height+"'/>\n";
    for(var i=0; i<tris.length;i+=10)
    {
        var n=[tris[i+7],tris[i+8],tris[i+9]];
        var fogFade=tris[i+6];
        var fillCol  =getFillCol(n,fogFade);
        var strokeCol=getStrokeCol(n,fogFade);
        txt+="<polyline style='fill:#"+hexCol1(fillCol)+";stroke:#"+hexCol1(strokeCol)+";stroke-width:"+"0.5"+";' points='";
        txt+=" "+tris[i+0].toFixed(1)+","+tris[i+1].toFixed(1);
        txt+=" "+tris[i+2].toFixed(1)+","+tris[i+3].toFixed(1);
        txt+=" "+tris[i+4].toFixed(1)+","+tris[i+5].toFixed(1);
        txt+="'/>\n";
    }
    txt+="</svg>\n";
    txt="data:image/svg+xml;base64,"+Base64.encode(txt);

    var link = document.createElement('a');
    link.download = "image.svg";
    link.href = txt;
    link.click();
    //return txt;
}

function keyTyped() {
    if (key === 'c') {
        c_cnt++;
        background(scale3(getBgCol(),255));
        fogCol=getBgCol();
        for(var i=0;i<tris.length;i+=10)
        {
            var n=[tris[i+7],tris[i+8],tris[i+9]];
            var fogFade=tris[i+6];
            var fillCol=getFillCol(n,fogFade);
            var strokeCol=getStrokeCol(n,fogFade);
            fill(scale3(fillCol,255));
            stroke(scale3(strokeCol,255));
            //triangle( tris.slice(i,i+6) );
            triangle( tris[i], tris[i+1], tris[i+2], tris[i+3], tris[i+4], tris[i+5] );
        }
    //value = 255;
    } else if (key === 's') {
        downloadSVG();
    }
  // uncomment to prevent any default behavior
  // return false;
}
