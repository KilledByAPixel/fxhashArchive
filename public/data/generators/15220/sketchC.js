R=(a=1)=>fxrand()*a;
RT=(a=1)=>a*(R()-R());
RV=(v)=>v[R(v.length)|0];
C=(a)=>R()<a;
let w,h,pt;
let Nx,Ny,px,py,dx,dy,cx,cy,dr,cb,c1,c2,c1n,c2n,rbw,rv=[],dtr,ep,ep3,ep2,lv;
let ar = 4/3;
let gr,gr2;
let cols = [[6,45,52],[25,47,53],[45,43,54],[106,26,41],[199,35,42],[220,32,47],[244,22,49],[0,0,10],[0,0,93]];
let colorNames = ["Red","Orange","Yellow","Green","Teal","Blue","Purple","Black","White"];
function setup(){
    let wh = windowHeight;
    let ww = windowWidth;
    wh>=ar*ww?(w=ww,h=ar*ww):(w=wh/ar,h=wh);
    pt=w/1000;
    px = (.1+RT(.05))*w;
    py = px;
    Nx = R(20)|0+3;
    if(C(.1))Nx*=2;
    dx = (w-2*px)/Nx;
    dy = dx;
    Ny = ~~((h-2*py)/dy);
    py = (h-Ny*dy)/2;
    cx = R(Nx)|0;
    cy = R(Ny)|0;
    dtr = R(.5);
    ep=.25+R();
    ep2=.25+R();
    ep3=.1+R();
    lv=R(30)*R();
    if (C(.8)) {
        cb=C(.5)?8:7;
        c1=R(cols.length-2)|0;
        c2=(cb==7)?8:7;
        rbw = C(.75);
    } else {
        cb=R(cols.length-2)|0;
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
    rectMode(CENTER);
    gr=createGraphics(w,h);
    gr.colorMode(HSL);
    gr.rectMode(CENTER);
    noLoop();
}
function draw(){
    background(...cols[cb])
    noStroke();
    let drk = C(.5)
    if (cb==7)drk=1;
    if (cb==8)drk=0;
    for (let i=-1;i<=Nx;i++){
        gr.stroke(drk?100:0);
        gr.strokeWeight((pt/8+R(pt))*constrain(10/max(Nx,Ny),1,3)/2);
        let x = px+i*dx;
        gr.line(x+dx/2,R(py),x+dx/2,h-R(py));
    }
    for (let i=-1;i<=Ny;i++){
        gr.stroke(drk?100:0);
        gr.strokeWeight((pt/8+R(pt))*constrain(10/max(Nx,Ny),1,3)/2);
        let y = py+i*dy;
        gr.line(R(px),y+dy/2,w-R(px),y+dy/2);
    }
    noStroke()
    let xd1=C(.5),yd1=C(.5),w1=R(),s1=RT(.5);
    let xd2=C(.5),yd2=C(.5),w2=R(),s2=RT(.5);
    let fp = 1 + RT(.25);
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
            let col = [...cols[coln]];
            if (rbw)col = [...cols[rv[R(rv.length)|0]]];
            fill(col[0]+RT(3),col[1]+RT(10),col[2]+RT(lv),.9+R(.1))
            rf=1;
            if(rf) rect(x,y,dx,dy);
        }
    }
    noStroke()
    for (let i=0;i<Nx*Ny*4*ep;i++){
        fill(...cols[cb],round(20*(1-R()*R()*dtr))/20)
        let sc = .1+R(.8)+R()*R()*R()*2;
        let x = R(w);
        let y = R(h);
        rect(x,y,dx*sc,dy*sc);
    }
    let lgt = cols[cb][2];
    let fg=lgt<20?30:lgt>80?50:80;
    for (let i=0;i<Nx*Ny*4*ep2*5;i++){
        fill(fg,round(20*(1-R()*R()*dtr))/20/100);
        let sc = .1+R(.8)+R()*R()*R()*2;
        let x = R(w);
        let y = R(h);
        rect(x,y,dx*sc,dy*sc);
    }
    gr.noStroke();
    gr.erase();
    for (let i=0;i<Nx*Ny*4*ep3;i++){
        gr.fill(...cols[cb]);
        let sc = .1+R(.8)+R()*R()*R()*2;
        let x = R(w);
        let y = R(h);
        gr.rect(x,y,dx*sc,dy*sc);
    }
    gr.noErase();
    image(gr,0,0);
    perf = round(100*perf/(Nx*Ny));
    let cN = colorNames[c1n]+"/"+colorNames[c2n];
    if (c1f==0&&c2f==1) cN = colorNames[c2n];
    if (c1f==1&&c2f==0) cN = colorNames[c1n];
    if (rbw) cN = "Various";
    if ((c1f==0&&c2f==0)||rctf==0) cN = "None";
    window.$fxhashFeatures = {
        "Grid Size X": Nx,
        "Grid Size Y": Ny,
        "Background Color": colorNames[cb],
        "Block Colors": cN
    }
    fxpreview();
}