function draw_texture(W=1024) { 
  let ncols = [[46,47,91],[41,49,92],[47,32,91],[44,48,91],[41,52,92],[50,37,91],[49,31,90],[50,21,89],[60,7,81],[60,4,78],[120,3,78],[90,2,76],[47,19,71],[150,1,68],[100,3,60],[226,6,40],[222,7,37],[231,12,32],[197,9,31],[231,9,30],[256,7,29],[224,21,21],[217,20,21],[239,41,19],[233,56,20],[222,22,49],[239,28,34],[225,20,52],[217,37,62],[216,29,64],[216,29,67],[189,29,70],[200,18,62],[204,15,67],[210,21,89],[219,25,67],[236,26,32],[233,23,31],[231,21,58],[258,21,44],[264,21,35],[243,21,36],[228,16,82],[229,9,56],[231,18,38],[115,12,83],[73,8,77],[111,5,70],[185,10,44],[163,25,70],[170,10,77],[99,23,74],[112,26,64],[70,14,51],[102,16,25],[62,26,43],[62,21,52],[56,21,71],[92,6,47],[45,28,53],[56,40,68],[53,40,65],[48,50,81],[46,29,56],[46,47,69],[49,56,70],[49,57,74],[41,46,58],[31,37,44],[39,33,48],[44,50,78],[45,36,71],[42,52,76],[41,51,74],[44,55,84],[38,57,61],[38,60,68],[32,53,56],[11,31,42],[26,54,47],[18,34,52],[16,41,53],[15,39,45],[2,42,46],[6,39,48],[12,40,57],[336,91,22],[30,45,76],[33,34,85],[23,35,84],[343,38,55],[330,32,49],[344,21,58],[310,35,26],[345,19,37],[274,12,23],[353,7,52],[320,12,25],[357,23,32],[10,29,38],[343,19,29],[349,11,29],[7,22,37],[28,26,45],[35,31,62],[350,9,27],[36,13,48],[31,13,55],[16,11,42],[315,3,25],[0,0,93],[0,0,12]];
  let Nc = 1+R(9)|0;
  let cat=[0,0,0,0,0,0,0,0,0];
  let cind = [0,8,16,23,34,45,61,75,81,99,110];
  let pals=[];
  for (let i=0;i<ncols.length;i++){
    ncols[i][1]+=10;
    ncols[i][2]+=5;
  }
  for (let i=0;i<Nc;i++){
    flag=1;
    let ncat=0;
    while(flag){
      ncat = ~~(R(cat.length));
      if (cat[ncat]==0){
        flag=0;
        cat[ncat]=1;
      }
    }
    pals[i]=cind[ncat]+~~R(cind[ncat+1]-cind[ncat]);
  }
  const color=(h,s,l)=>'hsl('+h+','+s+'%,'+l+'%)';
  function circle(cx,x,y,r) {
    cx.beginPath();
    cx.arc(x, y, r, 0, TAU);
    cx.stroke();
    cx.fill();
  }

  // make 2D canvases for textures
  const init_canvas = () => {
    let a = D.createElement('canvas'), c=a.getContext('2d');
    a.width=W; a.height=W;
    return [a,c];
  }
  let ctx=[];
  let C0,C1,C2;
  [C0,ctx[0]]=init_canvas();
  [C1,ctx[1]]=init_canvas();
  [C2,ctx[2]]=init_canvas();

  for (let c=0;c<3;c++){
    let Ni = 2+R()*R(30)|0;
    let Nj = 2+R()*R(30)|0;
    let xd=[],yd=[];
    for (let i=0;i<=Ni;i++){
      if (i==0 || i==Ni) {xd[i]=0;}
      else {xd[i]=-.5+R();}
    }
    for (let j=0;j<=Nj;j++){
      if (j==0 || j==Nj) {yd[j]=0;}
      else {yd[j]=-.5+R();}
    }
  
    //background color
    let col = ncols[pals[R(pals.length)|0]];
    ctx[c].fillStyle=color(...col);
    ctx[c].fillRect(0,0,W,W);

    //grid
    for (let i = 0; i < Ni; i++) {
      let lw = R(6);
      ctx[c].fillStyle=color(0,0,0);
      ctx[c].fillRect((i+xd[i])/Ni*W-lw/2,0,lw,W);
    }
    for (let j = 0; j < Nj; j++) {
      let lw = R(6);
      ctx[c].fillStyle=color(0,0,0);
      ctx[c].fillRect(0,(j+yd[j])/Nj*W-lw/2,W,lw);
    }

    //fill grid
    let fill_percent = R(.8);
    let line_percent = R(.5)*R();
    for (let i = 0; i < Ni; i++) {
      for (let j = 0; j < Nj; j++) {
        let col0 = ncols[pals[R(pals.length)|0]];
        ctx[c].fillStyle=color(col0[0],col0[1]-(c==0?30:0)+RT(10),col0[2]-(c==0?30:0)+RT(10));
        let x = (i+xd[i])/Ni*W;
        let y = (j+yd[j])/Nj*W;
        let dx = W/Ni*(1-xd[i]+xd[i+1]);
        let dy = W/Nj*(1-yd[j]+yd[j+1]);
        let pd = RT(4);
        if (R()<fill_percent) ctx[c].fillRect(x+pd,y+pd,dx-2*pd,dy-2*pd);

        //hatch lines
        col0 = ncols[pals[R(pals.length)|0]];
        ctx[c].fillStyle=color(col0[0],col0[1]-(c==0?30:0)+RT(10),col0[2]-(c==0?30:0)+RT(10));
        let Nl = 2+R(10|0);
        if (R()<line_percent){
          for (let xm=dx/Nl;xm<dx;){
            let lw = R(6);
            let dym = dy*R();
            ctx[c].fillRect(x+xm,y+R(dy-dym),lw,dym);
            xm+=dx*(1+RT(.5))/Nl;
          }
        }
        if (R()<line_percent){
          for (let ym=dy/Nl;ym<dy;ym){
            let lw = R(6);
            let dxm=dx*R();
            ctx[c].fillRect(x+R(dx-dxm),y+ym,dxm,lw);
            ym+=dy*(1+RT(.5))/Nl;
          }
        }
        let cp = R<.1?R(.5):0;
        if (R()<cp){
          col0 = ncols[pals[R(pals.length)|0]];
          if (R()<.5)ctx[c].strokeStyle= color(0,0,0);
          else ctx[c].fillStyle=color(col0[0],col0[1],col0[2]);
          let shiftx=0, shifty=0;
          if (dx>dy){shiftx = (dx-dy)/2;}
          else {shifty = (dy-dx)/2;}
          circle(ctx[c],x+dx/2+RT(shiftx),y+dy/2+RT(shifty),min(dx/2,dy/2));
        }
      }
    }

    const imageData = ctx[c].getImageData(0, 0, W, W);
    const pixels = imageData.data;
    for (var i = 0; i < pixels.length; i += 4) {
      let dp = RT(c==0?30:10);
      pixels[i]=pixels[i]+dp;
      pixels[i+1]=pixels[i+1]+dp;
      pixels[i+2]=pixels[i+2]+dp;
    }
    ctx[c].putImageData(imageData,0,0);
  }

  return [C0,C1,C2]; // return the canvas
}



