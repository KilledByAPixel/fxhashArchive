R=(a=1)=>fxrand()*a;
RT=(a=1)=>a*(R()-R());
C=(a)=>R()<a;

let w,h,pt;
let Nx,Ny,px,py,dx,dy,cx,cy,dr,cn;
let ar = 4/3;
let drk=C(.2);
let cols = [[6,45,52],[106,26,41],[220,32,47],[0,0,drk?87:15]];
let colorNames = ["Red","Green","Blue",drk?"White":"Black"];

function setup(){
    let wh = windowHeight;
    let ww = windowWidth;
    wh>=ar*ww?(w=ww,h=ar*ww):(w=wh/ar,h=wh);
    pt=w/1000;
    px = (.2+RT(.15))*w;
    Nx = 2 + R(13)|0;
    if (C(.1)) Nx*=2;
    dx = (w-2*px)/Nx;
    dy = dx;
    Ny = ~~((h-2*px)/dy);
    py = (h-Ny*dy)/2;
    cx = R(Nx)|0;
    cy = R(Ny)|0;
    cn=C(.6)?3:C(.66)?2:C(.5)?1:0    
    dr = R(.93)?1:0; 
    window.$fxhashFeatures = {
        "Grid Size X": Nx,
        "Grid Size Y": Ny,
        "Background Color": drk?"Black":"White",
        "Block Color": dr?colorNames[cn]:"None"
    }
    createCanvas(w,h);
    colorMode(HSL);
    noLoop();
}

function draw(){
    background(drk?15:87);
    noStroke();
    fill(...cols[cn]);
    if(dr)rect(px+cx*dx,py+cy*dy,dx,dy);
    strokeWeight(pt/8+R(pt));
    stroke(drk?87:15,.5+R(.5));
    for (let i=0;i<=Nx;i++){
        let x = px+i*dx;
        line(x,0,x,h);
    }
    for (let i=0;i<=Ny;i++){
        let y = py+i*dy;
        line(0,y,w,y);
    }
    fxpreview();
}

