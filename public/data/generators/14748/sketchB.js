R=(a=1)=>fxrand()*a;
RT=(a=1)=>a*(R()-R());
RV=(v)=>v[R(v.length)|0];
C=(a)=>R()<a;
let w,h,pt;
let Nx,Ny,px,py,dx,dy,cx,cy,dr,cb,c1,c2,c1n,c2n,rbw,rv=[];
let ar = 4/3;
let cols = [[6,45,52],[25,47,53],[45,43,54],[106,26,41],[199,35,42],[220,32,47],[244,22,49],[0,0,15],[0,0,87]];
let colorNames = ["Red","Orange","Yellow","Green","Teal","Blue","Purple","Black","White"];
function setup(){
    let wh = windowHeight;
    let ww = windowWidth;
    wh>=ar*ww?(w=ww,h=ar*ww):(w=wh/ar,h=wh);
    pt=w/1000;
    px = (.2+RT(.15))*w;
    py = (.2+RT(.15))*w;
    Nx = 3 + R(13)|0;
    if (C(.3)) Nx*=2;
    dx = (w-2*px)/Nx;
    dy = dx;
    Ny = ~~((h-2*py)/dy);
    py = (h-Ny*dy)/2;
    cx = R(Nx)|0;
    cy = R(Ny)|0;
    if (C(.4)) {
        cb=C(.75)?8:7;
        c1=C(.25)?5:C(.33)?RV([0,3]):R(cols.length-2)|0;
        c2=(cb==7)?8:7;
        rbw = C(.25);
    } else {
        cb=C(.25)?5:C(.33)?RV([0,3]):R(cols.length-2)|0;
        c1=7;
        c2=8;
        rbw=0;
    }
    if (C(.5)){
        let c1h=c1;c2h=c2;
        c2=c1h;c1=c2h;
    }
    c1n=c1;c2n=c2;
    let iv=0;
    let rp = .2+R(.8); 
    for (let i=0;i<cols.length;i++){
        if(C(rp))rv[iv++]=i;
        if(i==cols.length-1&&rv.length<3){i=0;iv=0;rv.length=0;}
    }
    createCanvas(w,h);
    colorMode(HSL);
    noLoop();
}
function draw(){
    background(...cols[cb])
    noStroke();
    rectMode(CENTER);
    let xd1=C(.5),yd1=C(.5),w1=R(),s1=RT(.5);
    let xd2=C(.5),yd2=C(.5),w2=R(),s2=RT(.5);
    let fp = 1 + RT(1);
    let c1f=0,c2f=0,rctf=0,perf=0;
    for (let j=0;j<Ny;j++){
        for (let i=0;i<Nx;i++){
            let x = px+i*dx+dx/2;
            let y = py+j*dy+dy/2;
            let im2 = xd2?i/(Nx-1):1-i/(Nx-1);
            let jm2 = yd2?j/(Ny-1):1-i/(Ny-1);
            let ym2 = im2*w2+(1-w2)*jm2+s2;
            let rf = C(ym2*fp);
            if (rf) {rctf=1;perf++;}
            let im = xd1?i/(Nx-1):1-i/(Nx-1);
            let jm = yd1?j/(Ny-1):1-i/(Ny-1);
            let ym = im*w1+(1-w1)*jm+s1;
            let coln = ym<R()?c1:c2;
            if (coln==c1&&rf) c1f=1;
            if (coln==c2&&rf) c2f=1;
            fill(...cols[coln],.9+R(.1));
            if (rbw)fill(...cols[rv[R(rv.length)|0]]);
            if(rf) rect(x,y,dx,dy);
        }
    }
    perf = round(100*perf/(Nx*Ny));
    let drk = C(.5)
    if (cb==7)drk=1;
    if (cb==8)drk=0;
    for (let i=0;i<=Nx;i++){
        stroke(drk?95:5,.5+R(.5));
        strokeWeight((pt/8+R(pt))*constrain(10/max(Nx,Ny),1,3));
        let x = px+i*dx;
        line(x,R(py),x,h-R(py));
    }
    for (let i=0;i<=Ny;i++){
        stroke(drk?95:5,.5+R(.5));
        strokeWeight((pt/8+R(pt))*constrain(10/max(Nx,Ny),1,3));
        let y = py+i*dy;
        line(R(px),y,w-R(px),y);
    }
    let cN = colorNames[c1n]+"/"+colorNames[c2n];
    if (c1f==0&&c2f==1) cN = colorNames[c2n];
    if (c1f==1&&c2f==0) cN = colorNames[c1n];
    if (rbw) cN = "Various";
    if ((c1f==0&&c2f==0)||rctf==0) cN = "None";
    window.$fxhashFeatures = {
        "Grid Size X": Nx,
        "Grid Size Y": Ny,
        "Background Color": colorNames[cb],
        "Block Colors": cN,
        "Block Fill":perf<25?"Sparse":perf>75?"Full":"Moderate"
    }
    fxpreview();
}

// Sketch A
// R=(a=1)=>fxrand()*a;
// RT=(a=1)=>a*(R()-R());
// C=(a)=>R()<a;
// let w,h,pt;
// let Nx,Ny,px,py,dx,dy,cx,cy,dr,cn;
// let ar = 4/3;
// let drk=C(.2);
// let cols = [[6,45,52],[106,26,41],[220,32,47],[0,0,drk?87:15]];
// let colorNames = ["Red","Green","Blue",drk?"White":"Black"];
// function setup(){
//     let wh = windowHeight;
//     let ww = windowWidth;
//     wh>=ar*ww?(w=ww,h=ar*ww):(w=wh/ar,h=wh);
//     pt=w/1000;
//     px = (.2+RT(.15))*w;
//     Nx = 2 + R(13)|0;
//     if (C(.1)) Nx*=2;
//     dx = (w-2*px)/Nx;
//     dy = dx;
//     Ny = ~~((h-2*px)/dy);
//     py = (h-Ny*dy)/2;
//     cx = R(Nx)|0;
//     cy = R(Ny)|0;
//     cn=C(.6)?3:C(.66)?2:C(.5)?1:0    
//     dr = R(.93)?1:0; 
//     window.$fxhashFeatures = {
//         "Grid Size X": Nx,
//         "Grid Size Y": Ny,
//         "Background Color": drk?"Black":"White",
//         "Block Color": dr?colorNames[cn]:"None"
//     }
//     createCanvas(w,h);
//     colorMode(HSL);
//     noLoop();
// }
// function draw(){
//     background(drk?15:87);
//     noStroke();
//     fill(...cols[cn]);
//     if(dr)rect(px+cx*dx,py+cy*dy,dx,dy);
//     strokeWeight(pt/8+R(pt));
//     stroke(drk?87:15,.5+R(.5));
//     for (let i=0;i<=Nx;i++){
//         let x = px+i*dx;
//         line(x,0,x,h);
//     }
//     for (let i=0;i<=Ny;i++){
//         let y = py+i*dy;
//         line(0,y,w,y);
//     }
//     fxpreview();
// }

