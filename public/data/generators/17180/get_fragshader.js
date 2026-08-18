const qphi=d=>(s=2,L(32,i=>{s=(1+s)**(1/(d+1))}),L(d,i=>s**(i-d)));

function fragsrc_raymarcher() {
  let rot1=a=>`mat2(${a*=TAU,[cos(a),-sin(a),sin(a),cos(a)]})`;

  let genpat=_=>{
    let u,v,w,x; // zigzag params
    while(!u||(2*u-w)/v>-.1) {
      w = RX(3,12); // y rep
      v = RX(3,12); // x rep
      x = .2 + R(.2); // thickness 
      u = (w*x+v)*.25;
    }
    return [`// zigzag
const mat2 rm = ${rot1(.375)};
const V rr = V(${[v,w]}), rr1=1/rr;
const V db = V(0,${u});
p.xy += V(${[R(12),R(12)]});
p.xy *= ${rot1(R())};
p.xy *= rr1;
W q = fract(p.xxy + W(0,.5,0))*rr.xxy-.5*rr.xxy;
F d = max(edge((q.yz+db)*rm), edge(kr*(q.xz-db)*rm));    
q.z = fract(p.y+.5)*rr.y-.5*rr.y;
d = min(d, max(edge((q.yz+db)*rm), edge(kr*(q.xz-db)*rm)));`,
`// concentric squares
const F rr = ${RX(2,12)}, rr1=1/rr;
p.xy += V(${[R(12)-6,R(12)-6]});
F d = (abs(fract(square(p.xy*${rot1(R())}*rr1,${R()}))-.5)-.1-${R(.1)})*rr;
`,
`// concentric circles
const F rr = ${RX(2,12)}, rr1=1/rr;
p.xy += V(${[R(22)-11,R(22)-11]});
F d = (abs(fract(L(p.xy*rr1)-${R()})-.5)-.1-${R(.1)})*rr;
`,][R(3)|0];
  }

  return `in V u;
  out X cc;
  uniform V res;
  uniform V rb;
  uniform sampler2D tex0;
  uniform sampler2D tex1;
  uniform sampler2D tex2;

  const F MAX_DIST = 250;
  const F SURF_DIST = .001;

  const W camera_pos = W(${camera_pos});
  const W look_at = W(0,0,-1.5);
  const F zoom = 1.8;

  const mat2 mtex0 = mat2(${a=R(TAU),c=.1*cos(a),s=.1*sin(a),[c,-s,s,c]});
  const mat2 mtex1 = mat2(${a=R(TAU),c=.1*cos(a),s=.1*sin(a),[c,-s,s,c]});
  const mat2 mtex2 = mat2(${a=R(TAU),c=.1*cos(a),s=.1*sin(a),[c,-s,s,c]});
  const V kr = V(1,-1);

  W get_tex(V uv, F a) {
    // uv -= .5;//uv.y=1-uv.y;
    // uv.xy += .5;    
    return pow((a<1?texture(tex0, uv*mtex0+.5):a<2?texture(tex1, uv*mtex1+.5):texture(tex2, uv*mtex2+.5)).rgb, W(2.2));
  }

  F square(V p, F b) {
    V d = abs(p)-b;
    return max(d.x,d.y);
  }

  F edge(V p) {
    return min(max(p.x,p.y),0)+L(max(p,0));
  }

  F relif(F d, F z, F w) {
    return edge(V(d,abs(z)-w));
  }

  ${hh0 = 1+R(2),
  hz2 = hh0*R(),
  hb2 = .5+R(.5),hh0*=.5,

  hh1 = 1+R(2),
  hz3 = hh1*R(),
  hb3 = .5+R(.5),hh1*=.5,''}

  F pat0(W p) { ${genpat()} return relif(d,p.z+${hh0}-9,${hh0}+9); }
  F pat1(W p) { ${genpat()} return relif(d,p.z+${hh1}-9,${hh1}+9); }
  F pat2(W p) { ${genpat()} return relif(d,p.z+${hz2+hb2},${hb2}); }
  F pat3(W p) { ${genpat()} return relif(d,p.z+${hz3+hb3},${hb3}); }

  F ds;
  V mt;
  F df(W p) {
    X d = X(pat0(p),pat1(p),pat2(p),pat3(p));
    mt = step(d.zw,d.xy);
    d.xy = min(d.xy, d.zw);
    ds = max(d.x, d.y);
    return min(
      max(-p.z,-min(d.x,d.y)),
      ds
    );
  }

  F intersect(W ro, W rd, F t0, F t1) {
    for (F t = t0; t < t1; ) {
      F h = df(ro + t * rd);
      t += h;
      if (h < SURF_DIST) return t;
    }
    return t1;
  }

  F shadow(W ro, W rd, F t0, F t1) {
    for (F t = t0; t < t1; ) {
      F h = df(ro + t * rd);
      t += h;
      if (h < SURF_DIST) return 0;
    }
    return 1;
  }

  W normal(W p) {
      const V k = V(1, -1)*.0001;
      return N(k.xyy*df(p + k.xyy) + 
               k.yyx*df(p + k.yyx) + 
               k.yxy*df(p + k.yxy) + 
               k.xxx*df(p + k.xxx) );
  }

  W pix(V uv, X R) {
    // camera setup constants
    const W fwd = N(look_at - camera_pos);
    const F focus_distance = L(look_at - camera_pos);
    const W right = N(cross(W(0,1,0), fwd));
    const W up = cross(fwd, right); 
    const mat3 cam = mat3(right, up, fwd);

    R.xyz *= W(TAU,TAU,2);R.z -= 1;
    W go = W(cos(R.x),sin(R.x),0)*sqrt(R.w)*.25, 
      p = camera_pos + go.x * right + go.y * up,
      rd = N(W(uv,zoom*2));
    rd.xy += N(rd*focus_distance-go).xy;
    rd = N(cam*rd); // ray direction

    F d = intersect(p, rd, 0, MAX_DIST); // raymarch
    F bg = S(MAX_DIST, MAX_DIST * .25, d); // did we hit anything
    p += rd * d; // hit position
    F h = df(p);
    F mm = step(ds, SURF_DIST);
    V ccm = mt;

    W n = normal(p);

    // diffuse lighting
    W light_pos = vec3(cos(R.y),sin(R.y),R.z);
    light_pos.xy *= sqrt(1-R.z*R.z);
    light_pos += W(-6,7,-15);

    W light_dir = light_pos - p;
    F light_dist = L(light_dir);
    light_dir /= light_dist;
    F diffuse = max(0, dot(n, light_dir));

    // ambient occlusion
    const F ao_step =.5;
    F ao=0,aofs=0;

    for (F i=1;i<8;i+=1) {
        W r=fract(i*W(${qphi(3)})+R.wzx)*W(TAU,2,1)+W(0,-1,0);
        W o=W(cos(r.x),sin(r.x),r.y);
        r.yz=sqrt(r.yz*V(-r.y,1)+V(1,0));
        o.xy*=r.y;o*=r.z;
        F d=dot(o,n);
        o *= sign(d);d=abs(d);
        ao+=max(0,df(p+o*ao_step)*d);
        aofs+=d*ao_step;
    } 
    ao=clamp(ao/aofs,0,1)*S(2,-5,p.z);

    // shadow
    F shade = shadow(p+n*SURF_DIST, light_dir, SURF_DIST, light_dist);

    // texture
    F a = 1/(1-n.z), b=-n.x*n.y*a;
    mat3 txM = mat3(1-n.x*n.x*a, b, n.x, b, 1-n.y*n.y*a, n.y, -n.x, -n.y, n.z);
    W tx = p * txM;
    W col = get_tex(tx.xy * kr, mm*(1+ccm.${'xy'[R(2)|0]}));

    col *= (shade*diffuse+ao*.3);
    col = mix(W(${R()<.5?0:9}), col, bg);
    return clamp((col*(2.51*col+.03))/(col*(2.43*col+.59)+.14),0,1);
  }

  void main() {    
      F px = 1/res.y;
      V as = res * px; px *= 1.5;
      V uv = u * as;
      W col = W(0);
      const F NA = 8;
      X wat=fract(sin(X(uv,uv*uv)*mat4(${L(16,_=>1+R())})*999)*999);
      X wot=fract(sin(X(uv,uv*uv)*mat4(${L(16,_=>1+R())})*999)*999);
      for(F i=0;i<NA;i++){
        X R = fract(i * X(${qphi(4)})+wat);
        V d = fract(i * V(${qphi(2)})+wot.wz);
        col += pix((d-.5)*px+uv, R);
      }
      col/=NA;
      cc = X(pow(clamp(col,0,1), W(1/2.2))+wot.rgb/256, 1);
  }`;
}