// PROJECT #618
// export date : Fri Apr 14 2023 12:22:14 GMT-0400 (heure d’été de l’Est nord-américain)

 //SCRIPT: http://localhost:8888/Patterns//Data/Js/myCommon.js?v=1.0

function RQPrintR(o,maxLevel)
{
	maxLevel = 0+maxLevel;
	if( o==null)
		return "(null)";
	if( typeof o==="object")
	{	var s=" { ";
		for(var k in o)
		{
			//s+=k+":"+RQPrintR(o[k])+" ";
			s+=k+":"+( typeof o[k]==="object" ? ( maxLevel>0? 
				 RQPrintR(o[k],maxLevel-1)				
				: "object"				
				) :  o[k]  )+" ";
		}
		s+="} ";
		return s;
	}
	return o;

}
function GetEltBody()
{
	return document.getElementsByTagName('body')[0];
}
const getById=(i)=>document.getElementById(i)
const _NS = "http://www.w3.org/2000/svg";
function NewElt(tag,attrs,scope)
{
    let elt=scope? document.createElementNS(scope,tag):document.createElement(tag);
    if(attrs)
    {   for(let a in attrs)
        {   switch(a)
            {   case 'text': elt.innerText=attrs[a]; break;
                case 'html': elt.innerHTML=attrs[a]; break;
                case 'appendTo': attrs[a].appendChild(elt);break;
                case 'insertTo':
                {   let p=attrs[a].childNodes[0]
                    if(p)attrs[a].insertBefore(elt,p); else attrs[a].appendChild(elt);
                }                    
                break;
                default : elt.setAttribute(a,attrs[a]);break;
            }  
        }
    }
    return elt;
}
function NewEltNs(tag,attrs)
{
	return NewElt(tag,attrs,_NS);
}
const 
$G=(()=>this)()
,_und=(v)=>v===undefined
,sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
,hexToD=(a)=>(a>=48&&a<=57)?a-48 : (a>=97&&a<=102)?(a-97)+10 : (a>=65 && a<=70)?(a-65)+10 : 0
,bytesToStr=(byteStr)=>{  let n=byteStr.length,str="";
  for( let k=0;k<n;k+=2) str+=String.fromCharCode(hexToD(byteStr.charCodeAt(k))*16 + hexToD(byteStr.charCodeAt(k+1))); 
  return str;
}
,hexToRGBA=(s,alpha)=>{
	let i,k,r=[0,0,0,alpha??1],t=s.charAt(0)=='#'?1:0;
	for(i=0,k=t;k<6+t;k+=2,i++)
	{	r[i]=hexToD(s.charCodeAt(k))*16 + hexToD(s.charCodeAt(k+1));
	}
	return `rgba(${r[0]},${r[1]},${r[2]},${r[3].toPrecision(2)})`;
}


//SCRIPT: http://localhost:8888/Patterns//Data/Js/FileSaver.min.js?v=1.1

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/RQMaths.js?v=0.5


(()=>{
	this.sfc32??=(a, b, c, d)=>{
		return  function() {
		  a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
		  var t = (a + b) | 0;
		  a = b ^ b >>> 9;
		  b = c + (c << 3) | 0;
		  c = (c << 21 | c >>> 11);
		  d = d + 1 | 0;
		  t = t + d | 0;
		  c = c + t | 0;
		  return (t >>> 0) / 4294967296;
		}
	}
	

})()
class ZMT
{

	constructor()
	{
	}
	static newRnd(seed){return sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed)}
	static newRnd2(seed){return sfc32(seed*9, seed/2|0, 0xB7E15162, seed)}
	static M_seed(seed,i)
	{
		if( !i)
		{
			ZMT.seed = seed;
			// https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
			ZMT.random = ZMT.newRnd(seed)
			ZMT.random2 ??= [];
			ZMT.random2[0]=ZMT.random;
			for (var i = 0; i < 15; i++) ZMT.random();
		}
		else
		{
			ZMT.random2[i]=ZMT.newRnd(seed);
			
		}

	}
	
	static M_clamp(x,a,b)
	{
		if( a>b) {var t=a;a=b;b=t;}
		if(x<a) return a;
		if( x>b) return b;
		return x;
	}
	static M_map(x, sa,sb, dsta, dstb)
	{	if(sa<sb) return x<=sa?dsta:(x>=sb?dstb:dsta+(x-sa)*(dstb-dsta)/(sb-sa));
		return x<=sb?dstb:(x>=sa?dsta:dstb+(x-sb)*(dsta-dstb)/(sa-sb));
	}
	static M_mapPow(x, sa,sb, dsta, dstb,pw)
	{	if(sa<sb) return x<=sa?dsta:(x>=sb?dstb:dsta+(x-sa)*Math.pow((dstb-dsta)/(sb-sa),pw));
		return x<=sb?dstb:(x>=sa?dsta:dstb+(x-sb)*Math.pow((dsta-dstb)/(sa-sb),pw));
	}
	//  M_getPointsBarycenter
	//  returns { size, G} where size is the max diameter of the shape
	static M_getPointsBarycenter(C)
	{
		let dim3 = C[0]&&(C[0].z!=undefined);
		var bary= dim3? new ZV3(0,0,0) :new ZV2(0,0); 
		var nb=C.length;
		for( var i=0; i<nb;i++)
		{
			bary.x+=C[i].x;
			bary.y+=C[i].y;
			if(dim3)
				bary.z+=C[i].z;
		}
		bary.x/=nb; bary.y/=nb;
		if(dim3)
			bary.z/=nb;
		// maxLength
		var l=0,r;
		for( var i=0; i<nb;i++)
		{	let lp = dim3? Math.hypot(C[i].x-bary.x,C[i].y-bary.y,C[i].z-bary.z):Math.hypot(C[i].x-bary.x,C[i].y-bary.y);
			r??=lp;
			if(lp>l) l=lp;
			if(lp<r) r=lp;
		}
		let out={size:l*2.0, g:bary};
		return out;
	
	}
	static M_getAABB(points)
	{
		var r,nb=points.length;
		for( let i=0; i<nb;i++)
		{	let p = points[i];
			if( i==0)
			{
				r = new ZRc(p.x,p.y,0,0);
			}
			else
				r.M_extend	(p.x,p.y,0,0);
				
		}
		return r;		
	
	}
	// M_getOBB
	// returns oriented bounding box
	// { I : axis I, J axis J, o : center,w : width, h : height}
	static M_getOBB(points, angleDeg)
	{	let ang = angleDeg*D2R;
		let I = new ZV2(Math.cos(ang), Math.sin(ang));
		let J = new ZV2(-I.y,I.x);
		var r;
		var nb=points.length;
		let q = new ZV2();
		for( let i=0; i<nb;i++)
		{	let p = points[i];
			q.M_set(I.x*p.x-J.x*p.y,-I.y*p.x+J.y*p.y); 
			if( i==0)
			{
				r = new ZRc(q.x,q.y,0,0);
			}
			else
				r.M_extend	(q.x,q.y,0,0);
				
		}
		let o = r.center(); 
		return {  I:I, J:J, o : new ZV2( I.x*o.x+J.x*o.y,I.y*o.x+J.y*o.y), w:r.w, h:r.h};		
	
	}
	static M_polylineFromOBB(obb)
	{
		var L = new ZPL();
		let w = obb.w/2;
		let h = obb.h/2;
		L._aP(obb.o.x-obb.I.x*w -obb.J.x*h,obb.o.y-obb.I.y*w -obb.J.y*h);
		L._aP(obb.o.x+obb.I.x*w -obb.J.x*h,obb.o.y+obb.I.y*w -obb.J.y*h);
		L._aP(obb.o.x+obb.I.x*w +obb.J.x*h,obb.o.y+obb.I.y*w +obb.J.y*h);
		L._aP(obb.o.x-obb.I.x*w +obb.J.x*h,obb.o.y-obb.I.y*w +obb.J.y*h);
		L._aP(L.M_getPoint(0));
		return L;
	}
	// distance to segment 
	static M_distToSeg(p,P,Q)
	{
		return Math.sqrt(this.M_distToSeg2(p,P,Q))
	}

	// distance to segment squared
	static M_distToSeg2(p,P,Q)
	{
		let l2=P.M_dist2(Q);
		if (l2 == 0) return p.M_dist2(P);
		let PQ=Q.M_minus(P),
		Pp=p.M_minus(P),
		k=ZMT.M_clamp( (Pp.x*PQ.x+Pp.y*PQ.y)/l2,0,1)
		return p.M_dist2(P.M_plusU(PQ,k))
	} 
	static M_distToLine(p,P,Q)
	{
		let denom=sqr(Q.x-P.x)+sqr(Q.y-P.y)
		if(denom==0) return P.M_dist(P);
		return Math.abs((Q.x-P.x)*(P.y-p.y)-(P.x-p.x)*(Q.y-P.y))/Math.sqrt(denom);
	}
	static modulo_0_centric(value,T)
	{
		if( value<(-T/2.))
			value += T* parseInt((value-T/2.)/-T);
		else if(value>(T/2.))
			value -= T*parseInt((value+T/2.)/T);
		return value;
	}
	static smoothStep(x)
	{ 
		  return -2 * Math.pow(x, 3) + 3 * Math.pow(x, 2);
	}
	static smooth0(x,C)
	{ 	C??=0.15;
		let R=0.5**(-2*C);
		return (x**C)*((1-x)**C)*R;
	}
	static polynomialStep(x,n)
	{ 
		  return  Math.pow(x, n)/(Math.pow(x, n)+Math.pow(1-x,n)) ;
	}
	static relax(value,target, dt, T)
	{
		value += (target-value)*Math.min(1, dt/T);
		return value;
	}
	static BezierCurve(p0,p1,p2,p3,minStep)
	{
		let a=[],ms=minStep??0.2*A.u,
		pointK=(k)=>{
			let A0 = p0.M_sweep(p1,k),
			A1 = p1.M_sweep(p2,k),
			A2 = p2.M_sweep(p3,k),
			B0 = A0.M_sweep(A1,k),
			B1 = A1.M_sweep(A2,k),
			p = B0.M_sweep(B1,k)
			return p;
		},
		cubicRecurs=(A,B,ka,kb)=>{
			if((kb-ka)>0.5 || A.M_dist(B)>ms)
			{	let midK = (ka+kb)/2,midP = pointK( midK );
				cubicRecurs(A,midP,ka,midK);
				cubicRecurs(midP,B,midK,kb);
			}
			else 
				a.push(B.clone());
	
		}
		a.push(p0);
		cubicRecurs(p0,p3,0,1);
		return new ZPL(a);
	}
	
	static poissonDisc(zone,r0,rnd)
	{	let r2=r0*r0, inc=r0/Math.sqrt(2),out=[];
		if(inc<=0)return out;
		rnd??=ZMT.newRnd;
		let cols = Math.ceil(zone.w/inc),
		rows = Math.ceil(zone.h/inc),
		grid = new Array(cols*rows),
		getGrid=(ij)=>grid[ij.i+cols*ij.j],
		setGrid=(ij,p)=>grid[ij.i+cols*ij.j]=p,
		coordToGrid=(x,y)=>((x-zone.x)/inc|0)+cols*((y-zone.y)/inc|0),
		coords=(x,y)=>{return {i:(x-zone.x)/inc|0,j:(y-zone.y)/inc|0};},
		setGridPoint=(x,y,o)=>{grid[ coordToGrid(x,y)]=o},
		distSmall=(p1,p2)=>(p1.x-p2.x)**2 + (p1.y-p2.y)**2 <r2,
		kernel=[{i:1,j:0},{i:0,j:1},{i:-1,j:0},{i:0,j:-1},{i:1,j:1},{i:1,j:-1},{i:-1,j:1},{i:-1,j:-1}],
		open=[],
		maxTries = 20,
		stop=false
		
		//First Point
		let p0=new ZV2(zone.x+rnd()*zone.w, zone.y+rnd()*zone.h);
		open.push(p0);
		setGridPoint(p0.x,p0.y,p0)
		
		while (!stop)
		{
			// select one of the open points 
			let rand = Math.floor(rnd()*open.length), tries=0;

			while (tries < maxTries)
			{
				let rd = rnd()*r0+r0,a=rnd()*Math.PI*2;
				let p = open[rand].M_plus(Math.cos(a)*rd,Math.sin(a)*rd);
				//If it is on the Screen
				if (zone.iPI(p))
				{
					let ij = coords(p.x,p.y)
					// is grid point available
					if (!getGrid(ij)) {
						//Testing distance with grid test
						let ok = true;
						let o,i2;
						for(let k=0;k<kernel.length;k++)
						{ 	let ij2={i:ij.i+kernel[k].i, j:ij.j+kernel[k].j}
							if(ij2.i>=0 && ij2.i<cols && ij2.j>=0 && ij2.j<rows)
							if( (o=getGrid(ij2)) && distSmall(p,o))
							{ok=false;break;}
						}
						if (ok)
						{	open.push(p);
							setGrid(ij,p);
						} else tries++;
					} else tries++;
				} else tries++;
		
			}

			//Marking Point as Closed
			out.push(open[rand]);
			open.splice(rand, 1);
			if (!open.length) stop=1;

		}
		return out;

	}



};

ZMT.M_seed( parseInt(Math.random()*100) );
const PI=Math.PI,PI2=2*PI,D2R=PI/180,
	isArr=Array.isArray,toArr=(a)=>isArr(a)?a:[a],
	rndRange=(v,rnd)=>{ if(v){rnd??=Math.random; return v.min+rnd()*(v.max-v.min);}},
	rndInt=(n,rnd)=>Math.round((-1+n|0)*(rnd??Math.random)())
	isInRange=(v,x)=>v.min<=v.max? x>=v.min && x<=v.max : x>=v.max && x<=v.min,
	rndArray=(a,rnd)=>isArr(a)? a[rndInt(a.length-1,rnd)]:a,
	arrVals=(o)=> Object.keys(o).map(function(k){return o[k]}),
	sqr=(x)=>x*x,
	cos=Math.cos,
	sin=Math.sin,
	abs=(x)=>x<0?-x:x,
	cosDeg=(a)=>cos(D2R*a),
	sinDeg=(a)=>sin(D2R*a)



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/RQVec2.js?v=1.05

class ZV2
{
	constructor(_x,_y)
	{
		this.M_set(_x,_y);
		
	}
	M_set(_x,_y)
	{
		if( typeof _x==='number')
		{
			this.x = _x;
			this.y = _y;
		}
		else if( typeof _x==='object') 
		{
			this.x = _x.x;
			this.y = _x.y;
		}
		else
		{
			this.x = 0.0;
			this.y = 0.0;
		}
	
	}
	clone()
	{
		return new ZV2(this.x,this.y);
	}
	M_add(a,b)
	{
		if( typeof a==='number')
		{	this.x+=a;
			this.y+=b;
		}
		else
		{	this.x+=a.x;
			this.y+=a.y;
		}
		return this;	
	}
	M_addU(u,k)
	{	this.x+=u.x*k; 
		this.y+=u.y*k;
		return this;
	}
	M_plus(a,b)
	{
		if( typeof a==='number')
			return new ZV2(this.x+a,this.y+b);
		else 
			return new ZV2(this.x+a.x,this.y+a.y);
	
	}
	M_plusU(u,k)
	{
		return new ZV2(this.x+u.x*k, this.y+u.y*k)
	}
	M_minus(a,b)
	{
		if( typeof a==='number')
			return new ZV2(this.x-a,this.y-b);
		else 
			return new ZV2(this.x-a.x,this.y-a.y);
	
	}
	M_sweep(B,k)
	{
		return new ZV2(this.x+(B.x-this.x)*k,this.y+(B.y-this.y)*k);
	}

	M_mul(k)
	{
		if( typeof k==='number')
		{	this.x*=k;
			this.y*=k;
		}
		else
		{
			this.x*=k.x;
			this.y*=k.y;
		}
		return this;
	}
	_mB(k)
	{
		return new ZV2( this.x*k, this.y*k);
	}

	M_dist(a,b)
	{
		if( a instanceof ZV2)
			return Math.hypot( a.x-this.x, a.y-this.y);
		return 	Math.hypot(a-this.x,b-this.y)
	
	}
	M_dist2(P)
	{	return sqr(P.x-this.x)+sqr(P.y-this.y)
	}
	
	M_length()
	{
		return Math.hypot(this.x,this.y);
	}
	M_cross	(b) 
	{
		return this.x*b.y - this.y*b.x;
	}
	M_dot	(a,b) 
	{
		if( a instanceof ZV2)
			return this.x*a.x + this.y*a.y;
		else
			return this.x*a + this.y*b;
	}

	Nz()
	{
		let l = Math.hypot(this.x,this.y);
		if( l>0)
		{	this.x/=l;
			this.y/=l;
		
		}
		return this;
	}
	M_equals(a,b)
	{
		if( typeof a==='number')
		{
			return this.x == a && this.y==b;
		}
		else
			return this.x == a.x && this.y== a.y;
	
	}
	M_getString()
	{ 	return "("+this.x.toFixed(FLOATPRECISION)+","+this.y.toFixed(FLOATPRECISION)+")";
	}
	
	M_isInRect(x,y,w,h)
	{
		return this.x>=x && this.x<=(x+w) && this.y>=y && this.y<=(y+h); 
	
	}
	M_rotated(angDeg)
	{	
		// P = this.x*I + this.y*J
		// I  cos(a)
		//    sin(a)
		// J  -sin(a)
		//     cos(a)
		// P' x*cos(a) + y*-sin(a)
		//    x*sin(a) + y*cos(a)
		let co=cos(angDeg*D2R);
		let si=sin(angDeg*D2R);
		return new ZV2( this.x*co-this.y*si, this.x*si+this.y*co);
	}
	M_rotate(angDeg)
	{
		let co=cos(angDeg*D2R);
		let si=sin(angDeg*D2R);
		this.M_set( this.x*co-this.y*si, this.x*si+this.y*co);
		return this;
	}

	M_isInTriangle(A,B,C,isReport)
	{

		// M = A + x AB + y AC
		// AM = xAB +yAC
		// AMx -y.ACx = x.ABx	(1)
		// AMy -y.ACy = x.ABy	(2)
		let AM=new ZV2();
		let AB=new ZV2();
		let AC=new ZV2();
		let x,y; 
		AM.x = this.x-A.x; AM.y = this.y-A.y;
		AB.x = B.x-A.x; AB.y = B.y-A.y;
		AC.x = C.x-A.x; AC.y = C.y-A.y;

		// (1)*ACy - (2)*ACx
		// AMx*ACy - AMy*ACy = x.(ABx*ACy - ABy*ACx)
		let vec = AB.x*AC.y - AB.y * AC.x;
		if( vec)
		{	x= (AM.x*AC.y - AM.y*AC.x)/vec;		
		} else x=0;

		// AMx -x.ABx = y.ACx 	(1)
		// AMy -x.ABy = y.ACy  	(2)
		// (1)*ABy -(2)*ABx
		// AMx*ABy - AMy*ABx = y.(ACx*ABy - ACy*ABx)
		vec = AC.x*AB.y - AC.y*AB.x;
		if(vec)
		{	y = (AM.x*AB.y - AM.y*AB.x) /vec;	
		} else y=0;
		let isIn= x>=0 && y>=0 && (x+y)<=1;
		if( isReport)
			return {in:isIn, x:x,y:y}
		else 
			return isIn;

	}
}



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/RQVec3.js?v=1.12

class ZV3
{
	constructor(_x,_y,_z)
	{
		this.M_set(_x,_y,_z);
		
	}
	M_set(_x,_y,_z)
	{
		if( typeof _x==='number')
		{
			this.x = _x;
			this.y = _y;
			this.z = _z;
		}
		else if( typeof _x==='object') 
		{
			this.x = _x.x;
			this.y = _x.y;
			this.z = _x.z;
		}
		else
		{
			this.x = 0.0;
			this.y = 0.0;
			this.z = 0.0;
		}
	
	}
	clone()
	{
		return new ZV3(this.x,this.y,this.z);
	}
	M_mul(k)
	{
		this.x*=k;
		this.y*=k;
		this.z*=k;
		return this;
	}
	_mB(k)
	{
		return new ZV3( this.x*k, this.y*k,this.z*k);
	}

	M_add(a,b,c)
	{
		if( typeof a==='number')
		{	this.x+=a;
			this.y+=b;
			this.z+=c;
		}
		else
		{	this.x+=a.x;
			this.y+=a.y;
			this.z+=a.z;
		}
		return this;
	}
	M_addU(u,k)
	{	this.x+=u.x*k; 
		this.y+=u.y*k;
		this.z+=u.z*k;
		return this;
	}

	M_sub(a,b,c)
	{
		if( typeof a==='number')
		{	this.x-=a;
			this.y-=b;
			this.z-=c;
		}
		else
		{	this.x-=a.x;
			this.y-=a.y;
			this.z-=a.z;
		}
		return this;
	}
	M_plus(a,b,c)
	{
		if( typeof a==='number')
			return new ZV3(this.x+a,this.y+b,this.z+c);
		else 
			return new ZV3(this.x+a.x,this.y+a.y,this.z+a.z);
	
	}
	M_minus(a,b,c)
	{
		if( typeof a==='number')
			return new ZV3(this.x-a,this.y-b,this.z-c);
		else 
			return new ZV3(this.x-a.x,this.y-a.y,this.z-a.z);
	
	}
	M_dist(a,b,c)
	{
		if( a instanceof ZV3)
			return Math.hypot( a.x-this.x, a.y-this.y,a.z-this.z);
		return 	Math.hypot(a-this.x,b-this.y,c-this.z)
	
	}
	M_length()
	{
		return Math.hypot(this.x,this.y,this.z);
	}
	Nz()
	{
		let n= Math.hypot(this.x,this.y,this.z);
		if( n>0.00001)
		{
			this.x/=n;
			this.y/=n;
			this.z/=n;
		}
		return this;
	}
	M_dot	(a,b,c) 
	{
		if( a instanceof ZV3)
			return this.x*a.x + this.y*a.y + this.z*a.z;
		else
			return this.x*a + this.y*b + this.z*c;
	}
	M_cross	(a,b,c) 
	{
		if( a instanceof ZV3)
			return new ZV3( this.y*a.z - this.z*a.y, this.z*a.x-this.x*a.z, this.x*a.y-this.y*a.x);
		else
			return new ZV3( this.y*c - this.z*b, this.z*a-this.x*c, this.x*b-this.y*a);
	}

	Nzd()
	{
		var n = this.clone();
		n.Nz();
		return n;
	}
	M_getString()
	{ 	return "("+this.x.toFixed(FLOATPRECISION)+","+this.y.toFixed(FLOATPRECISION)+","+this.z.toFixed(FLOATPRECISION)+")";
	}



};



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/RQMatrix4.js?v=1.09

class RQMatrix4
{
	constructor()
	{
		this.m_a = [];
		this.M_setIdentity();
					
	}
	M_setIdentity()
	{
		for(let i=0; i<16; i++)
		{
			this.m_a[i] = ((i%4)==(parseInt(i/4)))? 1.0 : 0.0; 
		
		}
		return this;
	
	
	}
	M_copyFrom(M)
	{
		for(let i=0; i<16; i++)
		{
			this.m_a[i] = M.m_a[i];
		}
		return this;
	}
	clone()
	{
		var M = new RQMatrix4();
		M.M_copyFrom(this);
		return M;	
	}

	//------------------------------------------------------------------------
	// M_setRotationMatrix
	// Set the rotation components of a 4x4 matrix
	//------------------------------------------------------------------------
	M_setRotationMatrix( angDeg, x, y, z)
	{
		let r=angDeg * D2R, c=cos(r), s=sin(r), c1=1-c, l=Math.hypot(x,y,z),u = [],i, j,a=this.m_a
							
		
		u[0] = x / l;
		u[1] = y / l;
		u[2] = z / l;
		
		for (i=0; i< 16;i++)a[i] = 0
		
		a[15] = 1
		
		for (i = 0; i < 3; i++) {
			a[i * 4 + (i + 1) % 3] = u[(i + 2) % 3] * s;
			a[i * 4 + (i + 2) % 3] = -u[(i + 1) % 3] * s;
		}
		
		for (i = 0; i < 3; i++) 
			for (j = 0; j < 3; j++) 
				a[i * 4 + j] += c1 * u[i] * u[j] + (i == j ? c : 0)
	}
	// M_rotate
	// Applies a rotation
	M_rotate(angleDeg, x, y, z)
	{
		let rotateMatrix = new RQMatrix4();
		rotateMatrix.M_setRotationMatrix(angleDeg, x, y, z);
			
		// matrix * scale_matrix
		let M = this._mBMatrix(rotateMatrix);
		this.M_copyFrom(M);
		return this;
	}
	// _mBMatrix
	_mBMatrix(mat)
	{
		let r = new RQMatrix4(),m=mat.m_a,a=this.m_a
		r.m_a[ 0] =m[ 0]*a[0] +m[1]*a[4] +m[2]*a[ 8] +m[3]*a[12];
		r.m_a[ 1] =m[ 0]*a[1] +m[1]*a[5] +m[2]*a[ 9] +m[3]*a[13];
		r.m_a[ 2] =m[ 0]*a[2] +m[1]*a[6] +m[2]*a[10] +m[3]*a[14];
		r.m_a[ 3] =m[ 0]*a[3] +m[1]*a[7] +m[2]*a[11] +m[3]*a[15];
	
		r.m_a[ 4] =m[ 4]*a[0] +m[ 5]*a[4] +m[6]*a[ 8] +m[7]*a[12];
		r.m_a[ 5] =m[ 4]*a[1] +m[ 5]*a[5] +m[6]*a[ 9] +m[7]*a[13];
		r.m_a[ 6] =m[ 4]*a[2] +m[ 5]*a[6] +m[6]*a[10] +m[7]*a[14];
		r.m_a[ 7] =m[ 4]*a[3] +m[ 5]*a[7] +m[6]*a[11] +m[7]*a[15];
	
		r.m_a[ 8] =m[ 8]*a[0] +m[ 9]*a[4] +m[10]*a[ 8] +m[11]*a[12];
		r.m_a[ 9] =m[ 8]*a[1] +m[ 9]*a[5] +m[10]*a[ 9] +m[11]*a[13];
		r.m_a[10] =m[ 8]*a[2] +m[ 9]*a[6] +m[10]*a[10] +m[11]*a[14];
		r.m_a[11] =m[ 8]*a[3] +m[ 9]*a[7] +m[10]*a[11] +m[11]*a[15];
	
		r.m_a[12] =m[12]*a[0] +m[13]*a[4] +m[14]*a[ 8] +m[15]*a[12];
		r.m_a[13] =m[12]*a[1] +m[13]*a[5] +m[14]*a[ 9] +m[15]*a[13];
		r.m_a[14] =m[12]*a[2] +m[13]*a[6] +m[14]*a[10] +m[15]*a[14];
		r.m_a[15] =m[12]*a[3] +m[13]*a[7] +m[14]*a[11] +m[15]*a[15];		
		return r;
	}	
	
	// returns: ZV3 with additional w
	_mBV(v)
	{
		v.w??=1;
		let r = new ZV3(),a=this.m_a
		r.x = a[0]*v.x + a[4]*v.y + a[8 ]*v.z + a[12]*v.w;
		r.y = a[1]*v.x + a[5]*v.y + a[9 ]*v.z + a[13]*v.w;
		r.z = a[2]*v.x + a[6]*v.y + a[10]*v.z + a[14]*v.w;
		r.w = a[3]*v.x + a[7]*v.y + a[11]*v.z + a[15]*v.w;
		return r;
	}
	
	// mRV
	// applies the rotation only to a ZV3
	// returns a rotated ZV3
	mRV(v)
	{
		let result = new ZV3();
		result.x = this.m_a[0]*v.x + this.m_a[4]*v.y + this.m_a[8 ]*v.z;
		result.y = this.m_a[1]*v.x + this.m_a[5]*v.y + this.m_a[9 ]*v.z;
		result.z = this.m_a[2]*v.x + this.m_a[6]*v.y + this.m_a[10]*v.z;
		return result;
	}
	// return the z component of a rotated vector
	M_getRotateZ(v)
	{
		return this.m_a[2]*v.x + this.m_a[6]*v.y + this.m_a[10]*v.z;
	
	}

	M_getTranslation() 
	{
		return new ZV3(this.m_a[12],this.m_a[13],this.m_a[14]);

	}
	M_setTranslation(x,y,z) 
	{	let o=typeof x==='object'
		this.m_a[12]=o?x.x:x
		this.m_a[13]=o?x.y:y
		this.m_a[14]=o?x.z:z
		return this
	}



	// M_translate
	M_translate( x,y,z)
	{	let _=this
		if( typeof x==='object')
		{	z=x.z
			y=x.y
			x=x.x
		}
		// matrix * translate_matrix
		_.m_a[12] += _.m_a[0] * x + _.m_a[4] * y + _.m_a[8]  * z;
		_.m_a[13] += _.m_a[1] * x + _.m_a[5] * y + _.m_a[9]  * z;
		_.m_a[14] += _.m_a[2] * x + _.m_a[6] * y + _.m_a[10] * z;
		_.m_a[15] += _.m_a[3] * x + _.m_a[7] * y + _.m_a[11] * z;
		return _
	}
	//  M_scale
	M_scale(x,y,z)
	{
		if( _und(y) || _und(z))
			y=z=x
		let a=this.m_a,i
		for(i=0;i<4;i++) a[i]*=x,a[4+i]*=y,a[8+i]*=z
		return this;
	}
	M_setBase(I,J,K)
	{
		this.m_a[0]	= I.x;
		this.m_a[1]	= I.y;
		this.m_a[2]	= I.z;
		
		this.m_a[4]	= J.x;
		this.m_a[5]	= J.y;
		this.m_a[6]	= J.z;
		
		this.m_a[8]	= K.x;
		this.m_a[9]	= K.y;
		this.m_a[10]= K.z;
		
		return this;
	}
	
	
	M_getString()
	{
		var s="\n";
		for(let j=0; j<4; j++)
		{	for(let i=0; i<4; i++)
			{ s+=this.m_a[i+j*4].toPrecision(6)+" ";
			}
			s+="\n";
		}
		return s;
	
	}
}



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/RQRectangle.js?v=1.20

class ZRc
{

	constructor(x,y,w,h)
	{
		if( x==undefined)
		{
			this.x = 0;	
			this.y = 0;	
			this.w = 0;	
			this.h = 0;	
		}
		else if( typeof x === 'object' && y==undefined)
		{	this.w = x.w;
			this.h = x.h; 
			this.y = x.y;	
			this.x = x.x;	
		}
		else if(x>0 && y>0 && w==undefined)	// x means w  
		{
			w=x; x=0;
			h=y; y=0;
			this.x = w>=0? x : x+w;	
			this.y = h>=0? y : x+h;	
			this.w = w>=0? w : -w;	
			this.h = h>=0? h : -h;	
		
		}
		else  
		{
			this.x = w>=0? x : x+w;	
			this.y = h>=0? y : x+h;	
			this.w = w>=0? w : -w;	
			this.h = h>=0? h : -h;	
		
		}
	}
	clone()
	{
		return new ZRc( this.x,this.y,this.w,this.h);
	
	}
	left()
	{
		return this.x;
	}
	right()
	{
		return this.x+this.w;
	
	}
	top()
	{
		return this.y+this.h;
	
	}
	bottom()
	{
		return this.y;
	
	}
	bottomLeft()
	{
		return new ZV2(this.x,this.y);
	}
	bottomRight()
	{
		return new ZV2(this.x+this.w,this.y);
	}
	topRight()
	{
		return new ZV2(this.x+this.w,this.y+this.h);
	}
	topLeft()
	{
		return new ZV2(this.x,this.y+this.h);
	}
	center()
	{
		return new ZV2( this.x+this.w*0.5, this.y+this.h*0.5);
	}


	M_inset	( w, h)
	{	
		if( h==undefined) h=w;
		this.x+=w;
		this.y+=h;
		this.w-=w+w;
		this.h-=h+h;
		return this
	}
	M_isInside( x, y, margin)
	{	margin??=0;
		if( x>=(this.x-margin) && y>= (this.y-margin) && x<(this.x+this.w+margin) && y<(this.y+this.h+margin))
			return true;
		return false;
	}
	iPI( P)
	{	return P.x>=this.x && P.y>= this.y && P.x<(this.x+this.w) && P.y<(this.y+this.h)
	}
	M_scale(sx,sy)
	{	let _=this
		_.x*=sx; _.w*=sx;
		_.y*=sy; _.h*=sy

	}
	M_extend	(x,y,w,h,isInit)
	{
		let change =false;
		if( isInit)
		{	this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			change= true;
		}
		else
		{	let x2=this.x+this.w;
			let y2=this.y+this.h;

			if( x<this.x) {this.x= x; change = true;}
			if( y<this.y) {this.y= y; change = true;}
			if( (x+w)>x2) {x2=x+w ;change=true;}
			if( (y+h)>y2) {y2=y+h ;change=true;}
			if( change )
			{	this.w = x2-this.x;
				this.h =y2-this.y;
			}		
		}
		return change;
	}
	M_isIntersect(r)
	{
		return (r.w<=0 || r.h<=0 || r.right()<=this.x ||  r.top()<=this.y || r.x>=this.right() || r.y>=this.top()) ?false:true;

	}
	gIersection(r)
	{
		if( !this.M_isIntersect(r))
			return null;
		
		let out=new ZRc();
		let xright = (r.right() < this.right() )? r.right() : this.right();
		out.x  = r.x>this.x? r.x:this.x;
		out.w = xright-out.x;

		let ytop = (r.top() < this.top() )? r.top() : this.top();
		out.y  = r.y>this.y? r.y:this.y;
		out.h = ytop-out.y;
		return out;
	}

	M_limitToRectangle(r)
	{
		let x2=this.x+this.w;
		let y2=this.y+this.h;
		if( this.x<r.x) this.x = r.x;
		if( this.y<r.y) this.y = r.y;
		if( x2>(r.x+r.w)) x2=r.x+r.w;
		if( y2>(r.y+r.h)) y2=r.y+r.h;
		this.w = x2-this.x;
		this.h = y2-this.y;
		return this;
	}
	M_rounding()
	{
		let x2=Math.ceil(this.x+this.w);
		let y2=Math.ceil(this.y+this.h);
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.w = x2-this.x;
		this.h = y2-this.y;
		return this;
	}


	M_getRatio	()  
	{
		if( this.h>0.)
			return this.w/this.h;
		return -1.;
	}

	M_getCenter()
	{
		return new ZV2( this.x+this.w/2, this.y+this.h/2);
	}
	_cP()
	{
		var L = new ZPL();
		L._aP(this.x,this.y);
		L._aP(this.x+this.w,this.y);
		L._aP(this.x+this.w,this.y+this.h);
		L._aP(this.x,this.y+this.h);
		L._aP(this.x,this.y);
		return L;
	}

	//  M_fitIn
	M_fitIn(zone)
	{

		if( zone && zone.h>0 && this.h>0)
		{
			let availRatio = zone.w/zone.h;
			let meRatio = this.w/this.h;
			if( meRatio>=availRatio) // relative landscape
			{
				this.w		= zone.w;
				this.h		= zone.w/meRatio;
				this.x		= zone.x;
				this.y		= zone.y + zone.h/2 - this.h/2;
			}
			else
			{
				this.w		= zone.h*meRatio;
				this.h		= zone.h;
				this.x		= zone.x + zone.w/2 - this.w/2;
				this.y		= zone.y;
			}
			
		}
	}

	M_getString()
	{
		var s=""; 
		for(let n in this)
			s+=n+"="+this[n].toFixed(FLOATPRECISION)+" ";
		return s;
	
	}
	M_toSVG(isStyle)
	{
		if(isStyle===undefined) isStyle=true;
		let s = "<rect x=\""+this.x.toFixed(FLOATPRECISION)+"\" y=\""+this.y.toFixed(FLOATPRECISION)+"\" width=\""+this.w.toFixed(FLOATPRECISION)+"\" height=\""+this.h.toFixed(FLOATPRECISION)+"\""+(isStyle?" stroke-width=\"1\" stroke=\"black\" fill=\"transparent\"":"")+"></rect>\n";
		return s;	
	}
	M_clipLine(L)
	{
		let out=[]
		,outputLine=(L)=>out.push(L)
		,seg, nbLines = L.M_nb()-1
		,newLine,wasOut=-1,iL,slope,P,len,d,l,isOut
		for( iL = 0; iL<nbLines; iL++)                          // for each segment of the polyline
		{
			seg = L.M_getLine(iL);                                  // get a Line(A,B) as the current segment
			slope= new ZV2(seg.B.x-seg.A.x,seg.B.y-seg.A.y) // slope of segment
			len=slope.M_length();                                   // length of segment
			if( len>0)
			{	P=seg.A.clone()		                                // P at the start of the segment
				d= new ZV2( slope.x/len, slope.y/len);           // d = unit vector along the segment
				
				for(l=0.0; l<=len; l+=1.0)
				{
					isOut =  this.iPI(P)?0:1      // is point outside ? 
					if( wasOut==-1)                                 // first point ever ?
					{	wasOut=isOut;
						if( !isOut)                                 // if we are inside, create a new line
						{   newLine=new ZPL([P.clone()]);
							outputLine(newLine);
						}
					}	
					else
					{	if( wasOut!=isOut)                          // a change in points
						{
							if( wasOut==1)	                        // we were outside : create a line
							{	newLine= new ZPL([P.clone()]);
								outputLine(newLine);
							}
							else	// a line is finished 
							{	newLine._aP(P.x-d.x,P.y-d.y);
								newLine=undefined;  // 
							}
							wasOut=isOut;
						}
					
					}
					P.x += d.x;
					P.y += d.y;
				}
				// segment is finished
				if( newLine)
				{	newLine._aP(seg.B.clone());
				}
	
			} // end len>0 
		} // end for
		return out
	
	}


}
class RQCircle extends ZRc
{
	// RQCircle(radius)				// circle centered at (0,0)
	// RQCircle(x,y,radius)			// circle with position
	// RQCircle(x,y, rx, ry)		// ellipse
	constructor(x,y,rx,ry)
	{
		if( y==undefined)
		{
			rx=x;
			x=0;
			y=0;
		}
		if( ry==undefined) 
			ry=rx;
		super(x-rx,y-ry,2*rx,2*ry);
	
	
	}
	static createWithRect(r)
	{	return new RQCircle(r.x+r.w/2,r.y+r.h/2,r.w/2,r.h/2);
	}
	M_getRadius()
	{
		return this.w/2;
	}
	M_toSVG(isStyle)
	{
		if(isStyle===undefined) isStyle=true;
		let s;
		let p = this.center();
		s = `<ellipse cx="${p.x.toFixed(FLOATPRECISION)}" cy="${p.y.toFixed(FLOATPRECISION)}" rx="${(this.w/2).toFixed(FLOATPRECISION)}" ry="${(this.h/2).toFixed(FLOATPRECISION)}" />\n`;
		return s;	
	}
	iPI( P)
	{	return this.M_isInside(P.x,P.y,0);
	}
	M_isInside( x, y, margin)
	{	margin??=0;	
		return Math.hypot( x-(this.x+this.w*0.5), (y-(this.y+this.h*0.5))*this.w/this.h)<(this.w*0.5+margin);
	}
	M_createPointsArray(nb)
	{
		let aStep = PI*2/nb;
		let a=0;
		let C=this.M_getCenter();
		let out=[];
		for( let i=0; i<=nb; i++)
		{
			out.push(new ZV2 (C.x+ this.w/2*cos(a),C.y+ this.h/2*sin(a)));
			a+=aStep;
		}
		return out;
	}
	M_sampleCount(step)
	{	return Math.max(PI*(this.w+this.h)/2/step|0,5);
	}
	// for auto step computation : nb=-1, step
	_cP(nb,step,aStart)
	{	nb??=-1;
		if(nb<3) nb=this.M_sampleCount(step??10);
		var L = new ZPL();
		let aStep = PI*2/nb;
		let a=(aStart??0)*D2R;
		let C=this.M_getCenter();
		for( let i=0; i<=nb; i++)
		{
			L._aP(C.x+ this.w/2*cos(a),C.y+ this.h/2*sin(a));
			a+=aStep;
		}

		return L;
	}
	_gS()
	{	let r=this.M_getRadius();
		let c=this.center();
		return `M ${c.x} ${c.y} m ${-r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 ${-(r * 2)},0`;

	}
	
}



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/RQLines.js?v=1.15


class ZL
{

	constructor(A,B,C,D)
	{
		if( A==undefined)
		{
			this.A = new ZV2(0,0);	
			this.B = new ZV2(0,0);	
		}
		else if(D!=undefined)
		{
			this.A = new ZV2(A,B);	
			this.B = new ZV2(C,D);	

		}
		else if( typeof A === 'object')
		{	this.A = A;
			this.B = B; 
			this.m_isPolyLine = false;	
		}
		else if( A=='poly')
		{
		
		}
	}
	clone()
	{
		return new ZL( this.A.clone(), this.B.clone() );
	
	}
	first()
	{	return this.A;
	}
	last()
	{	return this.B;
	}
	M_endPoint()
	{
		return this.B;
	}
	M_getPoint(i)
	{
		return (i==0)? this.A : i==1? (this.B) : null;
	
	}
	M_removePoint(i)
	{	this.mP.splice(i,1);

	}
	M_nb()
	{
		return 2;
	
	}
	
	M_reverseOrder()
	{
		let tmp=this.A;
		this.A=this.B;
		this.B=tmp;
	}
	toPolyline()
	{	return this.m_isPolyLine? this:new ZPL([this.A,this.B])
	}
	M_length()
	{
		return Math.hypot( this.B.x-this.A.x,this.B.y-this.A.y)
	}
	M_getString()
	{ 	return this.A.M_getString()+" to "+this.B.M_getString();
	}
	M_toSVG()
	{	
		return "<line x1=\""+this.A.x.toFixed(FLOATPRECISION)+"\" y1=\""+this.A.y.toFixed(FLOATPRECISION)+"\" x2=\""+this.B.x.toFixed(FLOATPRECISION)+"\" y2=\""+this.B.y.toFixed(FLOATPRECISION)+"\" />\n";	
	}
	M_toSVGElement()
	{
		let elt = document.createElementNS(_NS,"line");
		elt.setAttribute("x1" ,this.A.x.toFixed(FLOATPRECISION));
		elt.setAttribute("y1" ,this.A.y.toFixed(FLOATPRECISION));
		elt.setAttribute("x2" ,this.B.x.toFixed(FLOATPRECISION));
		elt.setAttribute("y2" ,this.B.y.toFixed(FLOATPRECISION));
		return elt;
	}
	
	_gS(isClose)
	{
		var pathPoints = "M "+this.A.x+" "+this.A.y+" L "+this.B.x+" "+this.B.y;
		
		return pathPoints;
	}
	M_getBarycenter()
	{
		return new ZV2((this.A.x+this.B.x)/2,(this.A.y+this.B.y)/2)
	}
	M_isClosed()
	{
		return this.last().M_dist(this.M_getPoint(0))<0.1;

	}
	// Sample : cuts in small segments
	M_sample(d)
	{	if(d<=0)return this;
		let me=this.m_isPolyLine?this:new ZPL([this.A,this.B]);
		let L=new ZPL(),nb=me.M_nb(),u,p,prev,l,s=0;
		for( let i=0; i<nb;i++)
		{	p=me.M_getPoint(i);
			if(i)
			{	u=p.M_minus(prev);
				l=u.M_length();
				if(l>d)
				{	u.M_mul(1/l);
					let k=l/d|0,r=(l-k*d)/2,q=prev.clone();
					q.M_addU(u,r);
					for(let j=0;j<k;j++)
					{	L._aP(q.clone());
						q.M_addU(u,d);
					}
				}
				L._aP(p)

			}
			else L._aP(p);
			prev=p;
		}
		return L;
	}
	M_break(){return [this]}

}
class ZPL extends ZL
{
	constructor(points)
	{
		super('poly');
		if( points != undefined && isArr( points ) )
			this.mP = points;
		else 
			this.mP = [];
		this.m_isPolyLine = true;	
	
	}
	clone()
	{
		var L = new ZPL();
		for(let i=0; i<this.mP.length; i++)
			L._aP( this.mP[i].clone());
		return L;
	}
	_aP(A,B)
	{
		if( typeof A==='number')
			this.mP.push( new ZV2(A,B) );
		else
			this.mP.push(A);
	
	
	}
	M_insertPoint(P,index) 
	{	if( index==undefined)
			index=0;
		this.mP.splice(index, 0, P);
	}
	M_nb()
	{
		return this.mP.length;
	}
	first()
	{	return this.mP[0];
	}
	last()
	{	return this.mP[this.M_nb()-1];
	}

	M_getPoint(i)
	{
		return this.mP[i];
	
	}
	M_endPoint()
	{
		var n =this.M_nb();
		if(n>=1)
			return this.mP[n-1];
	}
	M_getLine(i)
	{
		return new ZL( this.mP[i],this.mP[i+1]);
	
	}
	M_length()
	{
		let length=0,A,B,i
		for(i=this.mP.length-1; i>=0; i--)
		{ 	A=this.mP[i];
			if(B)
				length += A.M_dist(B);
			B=A;
		}
		//console.log("polyline length : "+length);
		return length;
	}
	M_reverseOrder()
	{
		this.mP.reverse();
	}

	M_translate(a,b)
	{
		if( typeof a==='object')
		{
			b=a.y;
			a=a.x;
		}
		for(var i=this.mP.length-1; i>=0; i--)
		{ 	this.mP[i].M_add(a,b);
		
		}
	}
	M_rotate(angleDeg)
	{
		for(var i=this.mP.length-1; i>=0; i--)
		{ 	this.mP[i].M_rotate(angleDeg);
		
		}
	}
	M_rotate(rotDeg,O)
	{	O??=new ZV2(0,0);
		let a=rotDeg*D2R;
		let co=cos(a);
		let si=sin(a);
		for(var i=this.mP.length-1; i>=0; i--)
		{ 	let p=this.mP[i];
			let u=p.M_minus(O);
			p.M_set(  O.x+u.x*co - u.y*si  , O.y+u.y*co +u.x*si   );
		}
	}
	M_closePath()
	{
		var A=this.M_getPoint(0);
		var B = this.M_endPoint();
		if( A!=undefined && B!=undefined)
		{	if( !A.M_equals(B))
			{
				this._aP(A.clone());
			}
		}
	}
	M_append(L)
	{	if(L?.mP?.length)
			this.mP.push(...L.mP);
		return this
	}
	M_appendReverse(L)
	{	if( L && isArr(L.mP))
		{
			let n=L.mP.length;
			for(let i=n-1; i>=0;i--)
				this.mP.push(L.mP[i]);
		}
	}
	M_break(){
		console.log('breaking line');
		let _=this,n=_.M_nb(),i,wasUp=-1,out=[],p,isUp,L
		for(i=0;i<n;i++)
		{	p=_.mP[i]
			isUp=p.penUp?1:0
			if(isUp||wasUp)
			{	if(!L) L=new ZPL(),out.push(L)
				L._aP(p);
			}
			if(wasUp!=isUp)
			{	if(isUp)
					L=undefined
				wasUp=isUp
			}
		}
		return out;
	}


	M_toSVG()
	{
		var n = this.M_nb(); 
		if( n<=1)
			return "";
		let s="<polyline points=\"";
		for( var i=0; i<n; i++)
		{
			if(i>0) s+=" ";
			s+=this.mP[i].x.toFixed(FLOATPRECISION)+","+this.mP[i].y.toFixed(FLOATPRECISION);			
		}
		s+="\" />\n";
		return s;	
	}
	M_toSVGElement()
	{
		var n = this.M_nb(); 
		if( n<=1)
			return null;
		let elt = document.createElementNS(_NS,"polyline");
		let s="";
		for( var i=0; i<n; i++)
		{	if(i>0) s+=" ";
			s+=this.mP[i].x.toFixed(FLOATPRECISION)+","+this.mP[i].y.toFixed(FLOATPRECISION);			
		}
		elt.setAttribute("points" ,s);
		return elt;
	}
	_gS(isClose)
	{
		var nbpoints = this.M_nb();		
		if( nbpoints>=2)
		{
			var pathPoints = "M ";
			
			for( let ip=0; ip<nbpoints; ip++)
			{
				let p =this.M_getPoint(ip);
				pathPoints+=`${ip==0?"":(p.penUp?" M ":" L ")}${p.x} ${p.y}`;		
			}
			if( isClose)
			{
				var A=this.M_getPoint(0);
				var B = this.M_endPoint();
				if( !A.M_equals(B))
				{
					pathPoints+=" L "+A.x+" "+A.y;				
				}
			}
			return pathPoints;
		}
		return null;
	}
	M_getAABB()
	{
		let n=this.mP.length;
		let r;
		for(let i=0; i<n;i++)
		{
			let p=this.mP[i];
			if(i==0)
				r=new ZRc(p.x,p.y,0,0);
			else
			{
				if(p.x>(r.x+r.w)) r.w=p.x-r.x;
				else if(p.x<r.x)  { r.w+=r.x-p.x; r.x=p.x }
				if(p.y>(r.y+r.h)) r.h=p.y-r.y;
				else if(p.y<r.y)  { r.h+=r.y-p.y; r.y=p.y }
			}

		}
		return r;
	}
	M_getBarycenter()
	{
		return ZMT.M_getPointsBarycenter(this.mP).g
	}
	M_getMinCircle()
	{	let Ps=this.mP,n=Ps.length,r,g=ZMT.M_getPointsBarycenter(Ps).g
		for(let i=0; i<n;i++)
		{	let l=ZMT.M_distToLine(g,Ps[i],Ps[(i+1)%n]);
			if(!i)r=l;else if(l<r)r=l;
		}
		return {C:g,r:r}
	}
	iPI(P,y)
	{
		if( y!=undefined)
		{	let x = P;
			P = new ZV2();
			P.M_set(x,y)
		}
		//if( m_aabb.iPI(x,y,mp_container->m_worldMargin) )
		{

			// test for polygon 
			let nbPoints = this.mP.length;
			if (nbPoints>=2)
			{

				let A = ZMT.M_getPointsBarycenter(this.mP).g;

				for (let i=0; i<nbPoints; i++)
				{	let i2 = (i+1)%nbPoints;
					if(RQTriangulate.sM_isInsideTriangle(P,A,this.mP[i],this.mP[i2]))
					//if( P.M_isInTriangle(A,this.mP[i],this.mP[i2]))
							return true;
					
				}

			}

			
		}
		return false;


	}
	


	M_getString()
	{
		let s = "";
		let nbpoints = this.mP.length;		

		for( let ip=0; ip<nbpoints; ip++)
		{	
			let p =this.mP[ip];
			s+= (ip>0? " ":"")+p.M_getString();
		}
		return s;		
	
	
	}
	

}




//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/RQTriangulate.js

 
// COTD Entry submitted by John W. Ratcliff [jratcliff@verant.com]

// ** THIS IS A CODE SNIPPET WHICH WILL EFFICIEINTLY TRIANGULATE ANY
// ** POLYGON/CONTOUR (without holes) AS A STATIC CLASS.  THIS SNIPPET
// ** IS COMPRISED OF 3 FILES, TRIANGULATE.H, THE HEADER FILE FOR THE
// ** TRIANGULATE BASE CLASS, TRIANGULATE.CPP, THE IMPLEMENTATION OF
// ** THE TRIANGULATE BASE CLASS, AND TEST.CPP, A SMALL TEST PROGRAM
// ** DEMONSTRATING THE USAGE OF THE TRIANGULATOR.  THE TRIANGULATE
// ** BASE CLASS ALSO PROVIDES TWO USEFUL HELPER METHODS, ONE WHICH
// ** COMPUTES THE AREA OF A POLYGON, AND ANOTHER WHICH DOES AN EFFICENT
// ** POINT IN A TRIANGLE TEST.
// ** SUBMITTED BY JOHN W. RATCLIFF (jratcliff@verant.com) July 22, 2000

//  Port in C++ RQLibs by Michaël Zancan on 24/09/12.
//  Port in Javascript by Michaël Zancan on 24/11/2021

class RQTriangulate
{
    constructor(contour)
    {
        this.triangles=[];
        if( contour && contour.length)
            this.M_process(contour);

    }



  	// triangulate a contour/polygon, result in member triangles
    // return bool
	M_process(contour)
    {
        this.triangles=[];
        
    
        /* allocate and initialize list of Vertices in polygon */

        let n = contour.length;
        if ( n < 3 ) return false;

        let V = []; for (let i=0;i<n;i++) V.push(0);

        // we want a counter-clockwise polygon in V 

        if ( 0 < RQTriangulate.sM_area(contour) )
           for (let v=0; v<n; v++) V[v] = v;
        else
            for(let v=0; v<n; v++) V[v] = (n-1)-v;

        let nv = n;

        ///  remove nv-2 Vertices, creating 1 triangle every time
        let count = 2*nv;   /* error detection */

        for(let m=0, v=nv-1; nv>2; )
        {
            // if we loop, it is probably a non-simple polygon
            if (0 >= (count--))
            {
                //** Triangulate: ERROR - probable bad polygon!
                return false;
            }

            // three consecutive vertices in current polygon, <u,v,w>
            let u = v  ; if (nv <= u) u = 0;        // previous
            v = u+1; if (nv <= v) v = 0;            // new v
            let w = v+1; if (nv <= w) w = 0;        // next

            if ( RQTriangulate.sM_snip(contour,u,v,w,nv,V) )
            {
                let a,b,c,s,t;

                // true names of the vertices
                a = V[u]; b = V[v]; c = V[w];

                // output Triangle
				this.triangles.push(a,b,c);				


                m++;

                // remove v from remaining polygon
                for(s=v,t=v+1;t<nv;s++,t++) V[s] = V[t]; nv--;

                // reset error detection counter
                count = 2*nv;
            }
        }
        return true;

    }
  
    // compute area of a contour/polygon
    static sM_area(contour)
    {
        let n = contour.length

        let a=0;
      
        for(let p=n-1,q=0; q<n; p=q++)
        {
          a+= contour[p].x*contour[q].y - contour[q].x*contour[p].y;
        }
        return a*0.5;
    }
  
    // decide if point P(x,y) is inside triangle defined by
    // pA, pB, pC
    // returns : true if yes
    static sM_isInsideTriangle(P,pA,pB,pC)
    {
        let ax, ay, bx, by, cx, cy, apx, apy, bpx, bpy, cpx, cpy;
        let cCROSSap, bCROSScp, aCROSSbp;
      
        ax = pC.x - pB.x;  ay = pC.y - pB.y;
        bx = pA.x - pC.x;  by = pA.y - pC.y;
        cx = pB.x - pA.x;  cy = pB.y - pA.y;
        apx= P.x - pA.x;  apy= P.y - pA.y;
        bpx= P.x - pB.x;  bpy= P.y - pB.y;
        cpx= P.x - pC.x;  cpy= P.y - pC.y;
      
        aCROSSbp = ax*bpy - ay*bpx;
        cCROSSap = cx*apy - cy*apx;
        bCROSScp = bx*cpy - by*cpx;
      
        return ((aCROSSbp >= 0) && (bCROSScp >= 0) && (cCROSSap >= 0));
    }


    static sM_snip( contour,u,v,w,n,V)
    {
        const EPSILON=0.0000000001;

        let p;
        let pA,pB,pC,P;
      
        pA= contour[V[u]];      
        pB= contour[V[v]];
        pC= contour[V[w]];
      
        if ( EPSILON > (((pB.x-pA.x)*(pC.y-pA.y)) - ((pB.y-pA.y)*(pC.x-pA.x))) ) return false;
      
        for (p=0;p<n;p++)
        {
          if( (p == u) || (p == v) || (p == w) ) continue;
          P = contour[V[p]];
          if (RQTriangulate.sM_isInsideTriangle(P,pA,pB,pC)) return false;
        }
      
        return true;
    }
	
};



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/delaunator.min.js

!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).Delaunator=i()}(this,(function(){"use strict";const t=134217729;function i(t,i,s,e,n){let h,r,l,o,a=i[0],f=e[0],c=0,u=0;f>a==f>-a?(h=a,a=i[++c]):(h=f,f=e[++u]);let _=0;if(c<t&&u<s)for(f>a==f>-a?(r=a+h,l=h-(r-a),a=i[++c]):(r=f+h,l=h-(r-f),f=e[++u]),h=r,0!==l&&(n[_++]=l);c<t&&u<s;)f>a==f>-a?(r=h+a,o=r-h,l=h-(r-o)+(a-o),a=i[++c]):(r=h+f,o=r-h,l=h-(r-o)+(f-o),f=e[++u]),h=r,0!==l&&(n[_++]=l);for(;c<t;)r=h+a,o=r-h,l=h-(r-o)+(a-o),a=i[++c],h=r,0!==l&&(n[_++]=l);for(;u<s;)r=h+f,o=r-h,l=h-(r-o)+(f-o),f=e[++u],h=r,0!==l&&(n[_++]=l);return 0===h&&0!==_||(n[_++]=h),_}function s(t){return new Float64Array(t)}const e=s(4),n=s(8),h=s(12),r=s(16),l=s(4);function o(s,o,a,f,c,u){const _=(o-u)*(a-c),d=(s-c)*(f-u),g=_-d;if(0===_||0===d||_>0!=d>0)return g;const y=abs(_+d);return abs(g)>=33306690738754716e-32*y?g:-function(s,o,a,f,c,u,_){let d,g,y,w,b,A,k,M,p,x,S,T,z,U,m,K,L,v;const F=s-c,P=a-c,E=o-u,H=f-u;U=F*H,A=t*F,k=A-(A-F),M=F-k,A=t*H,p=A-(A-H),x=H-p,m=M*x-(U-k*p-M*p-k*x),K=E*P,A=t*E,k=A-(A-E),M=E-k,A=t*P,p=A-(A-P),x=P-p,L=M*x-(K-k*p-M*p-k*x),S=m-L,b=m-S,e[0]=m-(S+b)+(b-L),T=U+S,b=T-U,z=U-(T-b)+(S-b),S=z-K,b=z-S,e[1]=z-(S+b)+(b-K),v=T+S,b=v-T,e[2]=T-(v-b)+(S-b),e[3]=v;let I=function(t,i){let s=i[0];for(let e=1;e<t;e++)s+=i[e];return s}(4,e),N=22204460492503146e-32*_;if(I>=N||-I>=N)return I;if(b=s-F,d=s-(F+b)+(b-c),b=a-P,y=a-(P+b)+(b-c),b=o-E,g=o-(E+b)+(b-u),b=f-H,w=f-(H+b)+(b-u),0===d&&0===g&&0===y&&0===w)return I;if(N=11093356479670487e-47*_+33306690738754706e-32*abs(I),I+=F*w+H*d-(E*y+P*g),I>=N||-I>=N)return I;U=d*H,A=t*d,k=A-(A-d),M=d-k,A=t*H,p=A-(A-H),x=H-p,m=M*x-(U-k*p-M*p-k*x),K=g*P,A=t*g,k=A-(A-g),M=g-k,A=t*P,p=A-(A-P),x=P-p,L=M*x-(K-k*p-M*p-k*x),S=m-L,b=m-S,l[0]=m-(S+b)+(b-L),T=U+S,b=T-U,z=U-(T-b)+(S-b),S=z-K,b=z-S,l[1]=z-(S+b)+(b-K),v=T+S,b=v-T,l[2]=T-(v-b)+(S-b),l[3]=v;const j=i(4,e,4,l,n);U=F*w,A=t*F,k=A-(A-F),M=F-k,A=t*w,p=A-(A-w),x=w-p,m=M*x-(U-k*p-M*p-k*x),K=E*y,A=t*E,k=A-(A-E),M=E-k,A=t*y,p=A-(A-y),x=y-p,L=M*x-(K-k*p-M*p-k*x),S=m-L,b=m-S,l[0]=m-(S+b)+(b-L),T=U+S,b=T-U,z=U-(T-b)+(S-b),S=z-K,b=z-S,l[1]=z-(S+b)+(b-K),v=T+S,b=v-T,l[2]=T-(v-b)+(S-b),l[3]=v;const q=i(j,n,4,l,h);U=d*w,A=t*d,k=A-(A-d),M=d-k,A=t*w,p=A-(A-w),x=w-p,m=M*x-(U-k*p-M*p-k*x),K=g*y,A=t*g,k=A-(A-g),M=g-k,A=t*y,p=A-(A-y),x=y-p,L=M*x-(K-k*p-M*p-k*x),S=m-L,b=m-S,l[0]=m-(S+b)+(b-L),T=U+S,b=T-U,z=U-(T-b)+(S-b),S=z-K,b=z-S,l[1]=z-(S+b)+(b-K),v=T+S,b=v-T,l[2]=T-(v-b)+(S-b),l[3]=v;const D=i(q,h,4,l,r);return r[D-1]}(s,o,a,f,c,u,y)}const a=Math.pow(2,-52),f=new Uint32Array(512);class c{static from(t,i=w,s=b){const e=t.length,n=new Float64Array(2*e);for(let h=0;h<e;h++){const e=t[h];n[2*h]=i(e),n[2*h+1]=s(e)}return new c(n)}constructor(t){const i=t.length>>1;if(i>0&&"number"!=typeof t[0])throw new Error("Expected coords to contain numbers.");this.coords=t;const s=Math.max(2*i-5,0);this._triangles=new Uint32Array(3*s),this._halfedges=new Int32Array(3*s),this._hashSize=Math.ceil(Math.sqrt(i)),this._hullPrev=new Uint32Array(i),this._hullNext=new Uint32Array(i),this._hullTri=new Uint32Array(i),this._hullHash=new Int32Array(this._hashSize).fill(-1),this._ids=new Uint32Array(i),this._dists=new Float64Array(i),this.update()}update(){const{coords:t,_hullPrev:i,_hullNext:s,_hullTri:e,_hullHash:n}=this,h=t.length>>1;let r=1/0,l=1/0,f=-1/0,c=-1/0;for(let i=0;i<h;i++){const s=t[2*i],e=t[2*i+1];s<r&&(r=s),e<l&&(l=e),s>f&&(f=s),e>c&&(c=e),this._ids[i]=i}const _=(r+f)/2,y=(l+c)/2;let w,b,A,k=1/0;for(let i=0;i<h;i++){const s=u(_,y,t[2*i],t[2*i+1]);s<k&&(w=i,k=s)}const M=t[2*w],p=t[2*w+1];k=1/0;for(let i=0;i<h;i++){if(i===w)continue;const s=u(M,p,t[2*i],t[2*i+1]);s<k&&s>0&&(b=i,k=s)}let x=t[2*b],S=t[2*b+1],T=1/0;for(let i=0;i<h;i++){if(i===w||i===b)continue;const s=d(M,p,x,S,t[2*i],t[2*i+1]);s<T&&(A=i,T=s)}let z=t[2*A],U=t[2*A+1];if(T===1/0){for(let i=0;i<h;i++)this._dists[i]=t[2*i]-t[0]||t[2*i+1]-t[1];g(this._ids,this._dists,0,h-1);const i=new Uint32Array(h);let s=0;for(let t=0,e=-1/0;t<h;t++){const n=this._ids[t];this._dists[n]>e&&(i[s++]=n,e=this._dists[n])}return this.hull=i.subarray(0,s),this.triangles=new Uint32Array(0),void(this.halfedges=new Uint32Array(0))}if(o(M,p,x,S,z,U)<0){const t=b,i=x,s=S;b=A,x=z,S=U,A=t,z=i,U=s}const m=function(t,i,s,e,n,h){const r=s-t,l=e-i,o=n-t,a=h-i,f=r*r+l*l,c=o*o+a*a,u=.5/(r*a-l*o);return{x:t+(a*f-l*c)*u,y:i+(r*c-o*f)*u}}(M,p,x,S,z,U);this._cx=m.x,this._cy=m.y;for(let i=0;i<h;i++)this._dists[i]=u(t[2*i],t[2*i+1],m.x,m.y);g(this._ids,this._dists,0,h-1),this._hullStart=w;let K=3;s[w]=i[A]=b,s[b]=i[w]=A,s[A]=i[b]=w,e[w]=0,e[b]=1,e[A]=2,n.fill(-1),n[this._hashKey(M,p)]=w,n[this._hashKey(x,S)]=b,n[this._hashKey(z,U)]=A,this.trianglesLen=0,this._addTriangle(w,b,A,-1,-1,-1);for(let h,r,l=0;l<this._ids.length;l++){const f=this._ids[l],c=t[2*f],u=t[2*f+1];if(l>0&&abs(c-h)<=a&&abs(u-r)<=a)continue;if(h=c,r=u,f===w||f===b||f===A)continue;let _=0;for(let t=0,i=this._hashKey(c,u);t<this._hashSize&&(_=n[(i+t)%this._hashSize],-1===_||_===s[_]);t++);_=i[_];let d,g=_;for(;d=s[g],o(c,u,t[2*g],t[2*g+1],t[2*d],t[2*d+1])>=0;)if(g=d,g===_){g=-1;break}if(-1===g)continue;let y=this._addTriangle(g,f,s[g],-1,-1,e[g]);e[f]=this._legalize(y+2),e[g]=y,K++;let k=s[g];for(;d=s[k],o(c,u,t[2*k],t[2*k+1],t[2*d],t[2*d+1])<0;)y=this._addTriangle(k,f,d,e[f],-1,e[k]),e[f]=this._legalize(y+2),s[k]=k,K--,k=d;if(g===_)for(;d=i[g],o(c,u,t[2*d],t[2*d+1],t[2*g],t[2*g+1])<0;)y=this._addTriangle(d,f,g,-1,e[g],e[d]),this._legalize(y+2),e[d]=y,s[g]=g,K--,g=d;this._hullStart=i[f]=g,s[g]=i[k]=f,s[f]=k,n[this._hashKey(c,u)]=f,n[this._hashKey(t[2*g],t[2*g+1])]=g}this.hull=new Uint32Array(K);for(let t=0,i=this._hullStart;t<K;t++)this.hull[t]=i,i=s[i];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(t,i){return Math.floor(function(t,i){const s=t/(abs(t)+abs(i));return(i>0?3-s:1+s)/4}(t-this._cx,i-this._cy)*this._hashSize)%this._hashSize}_legalize(t){const{_triangles:i,_halfedges:s,coords:e}=this;let n=0,h=0;for(;;){const r=s[t],l=t-t%3;if(h=l+(t+2)%3,-1===r){if(0===n)break;t=f[--n];continue}const o=r-r%3,a=l+(t+1)%3,c=o+(r+2)%3,u=i[h],d=i[t],g=i[a],y=i[c];if(_(e[2*u],e[2*u+1],e[2*d],e[2*d+1],e[2*g],e[2*g+1],e[2*y],e[2*y+1])){i[t]=y,i[r]=u;const e=s[c];if(-1===e){let i=this._hullStart;do{if(this._hullTri[i]===c){this._hullTri[i]=t;break}i=this._hullPrev[i]}while(i!==this._hullStart)}this._link(t,e),this._link(r,s[h]),this._link(h,c);const l=o+(r+1)%3;n<f.length&&(f[n++]=l)}else{if(0===n)break;t=f[--n]}}return h}_link(t,i){this._halfedges[t]=i,-1!==i&&(this._halfedges[i]=t)}_addTriangle(t,i,s,e,n,h){const r=this.trianglesLen;return this._triangles[r]=t,this._triangles[r+1]=i,this._triangles[r+2]=s,this._link(r,e),this._link(r+1,n),this._link(r+2,h),this.trianglesLen+=3,r}}function u(t,i,s,e){const n=t-s,h=i-e;return n*n+h*h}function _(t,i,s,e,n,h,r,l){const o=t-r,a=i-l,f=s-r,c=e-l,u=n-r,_=h-l,d=f*f+c*c,g=u*u+_*_;return o*(c*g-d*_)-a*(f*g-d*u)+(o*o+a*a)*(f*_-c*u)<0}function d(t,i,s,e,n,h){const r=s-t,l=e-i,o=n-t,a=h-i,f=r*r+l*l,c=o*o+a*a,u=.5/(r*a-l*o),_=(a*f-l*c)*u,d=(r*c-o*f)*u;return _*_+d*d}function g(t,i,s,e){if(e-s<=20)for(let n=s+1;n<=e;n++){const e=t[n],h=i[e];let r=n-1;for(;r>=s&&i[t[r]]>h;)t[r+1]=t[r--];t[r+1]=e}else{let n=s+1,h=e;y(t,s+e>>1,n),i[t[s]]>i[t[e]]&&y(t,s,e),i[t[n]]>i[t[e]]&&y(t,n,e),i[t[s]]>i[t[n]]&&y(t,s,n);const r=t[n],l=i[r];for(;;){do{n++}while(i[t[n]]<l);do{h--}while(i[t[h]]>l);if(h<n)break;y(t,n,h)}t[s+1]=t[h],t[h]=r,e-n+1>=h-s?(g(t,i,n,e),g(t,i,s,h-1)):(g(t,i,s,h-1),g(t,i,n,e))}}function y(t,i,s){const e=t[i];t[i]=t[s],t[s]=e}function w(t){return t[0]}function b(t){return t[1]}return c}));



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Math/perlin.js?v=1.1


/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

(function(global){
  var module = global.noise = {};

  function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }
  
  Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
  };

  Grad.prototype.dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
  };

  var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
               new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
               new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

  var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  // To remove the need for index wrapping, double the permutation table length
  var perm = new Array(512);
  var gradP = new Array(512);

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  module.seed = function(seed) {
    if(seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
      seed |= seed << 8;
    }

    for(var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  module.seed(0);

  /*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/

  // Skewing and unskewing factors for 2, 3, and 4 dimensions
  var F2 = 0.5*(Math.sqrt(3)-1);
  var G2 = (3-Math.sqrt(3))/6;

  var F3 = 1/3;
  var G3 = 1/6;

  // 2D simplex noise
  module.simplex2 = function(xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1; j1=0;
    } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  };

  // 3D simplex noise
  // MZ code removed
  

})(this);
const Noz=noise.simplex2


//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/Texture.js?v=1.34

class Texture
{
	constructor(opts)
	{
		this.m_canvas= null;
		this.stateStack=0;
		if( opts.width && opts.height)
		{	this.m_width = opts.width;
			this.m_height = opts.height;
			this.m_canvas = document.createElement('canvas');
			this.m_canvas.width  = this.m_width;
			this.m_canvas.height = this.m_height;
		}
		else if( opts.url)
		{
			// TODO : canvas from image
		
		}
		else if( opts.image)
		{
			this.m_canvas = document.createElement('canvas',WIDEGAMUT?{colorSpace:"display-p3"}:null);
			this.m_canvas.width  = this.m_width= opts.image.width;
			this.m_canvas.height = this.m_height= opts.image.height;
						
		}
		this.m_scale={x:1,y:1}


	}
	delete()
	{	let _=this,c
		if(c=_.m_canvas)
		{	let ctx=_._X()
			ctx.clearRect(0,0,c.width,c.height)
			// todo remove event listeners
			c.parentNode?.removeChild(c)
			_.m_canvas=null
			_.m_ctx=null
		}

	}
	doContext()
	{	if( this.m_canvas && this.m_canvas.getContext)
		{	return this.m_ctx=this.m_canvas.getContext('2d',{willReadFrequently:true});
		}
	}
	_X()
	{	return this.m_ctx??this.doContext()
	}
	M_clear()
	{
		var ctx = this._X();
		if( ctx)
			ctx.clearRect(0, 0, this.m_width, this.m_height);
	}
	M_fill(color)
	{
		var ctx = this._X();
		if( ctx)
		{
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, this.m_width, this.m_height);
		}
	
	}
	M_scale(sx,sy)
	{
		let ctx=this._X()
		ctx.scale(sx,sy)
		this.M_pushState()
		console.log(`scaling to ${sx},${sy}`);
		this.m_scale={x:sx,y:sy}
	}

	M_pushState()
	{
		var ctx = this._X();
		if( ctx)
		{
			ctx.save();
			this.stateStack++;
		}
	}
	M_popState(level)
	{	level??=0;
		var ctx = this._X();
		if( ctx && this.stateStack>level)
		{	while(this.stateStack>level)
			{	ctx.restore();
				this.stateStack--;
			}
		}
	}
	M_drawImage(opts)
	{
		if( this.m_canvas)
		{	if(opts.url)
			{	
				let o={ texture:this,img:new Image(),opts:opts};
				o.img.onload = function(){
					
					var context = this.texture._X();
					if( context)
					{	
						let r = this.opts.rect ? this.opts.rect : new ZRc(0,0,this.texture.m_width, this.texture.m_height);
						context.drawImage(this.img, r.x,r.y,r.w, r.h);				
					}
					// callback
					if( this.opts.onload)
					{	this.opts.onload.call();
					
					}
				
				}.bind(o);
				o.img.src = opts.url;
			}
			else if( opts.img)
			{
				var context = this._X();
				if( context)
				{
					let r = opts.rect ? opts.rect : new ZRc(0,0,this.m_width, this.m_height);
					context.drawImage(opts.img, r.x,r.y,r.w, r.h);				
				}
			
			}
		}
	}
	
	// returns [0;1]
	M_getPixelIntensity(x,y)
	{
		const _l = 255;
		var context = this._X();
		if( context)
		{
			let p = context.getImageData(x*this.m_scale.x,y*this.m_scale.y, 1, 1).data;
			let max=Math.max(p[0],p[1],p[2])
			return  max/_l;
		}
		return 0;
	}
}



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/Color.js?v=1.1

class RQColor
{

    constructor(c)
    {

        this.m_gradient = RQColor.sM_convert(c);
        

    }
  
    static sM_convert(c)
    {
        let matches = c.match(/linear\-gradient\(([0-9\-\.\%\,\sa-zA-Z\(\)]+)\)\;?/);
        if( matches!=null)
        {
            let gradient={stops:[],ang:90};
            let grad = matches[1];
            // example = 90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%
            var colorRegexp = /((rgba\([0-9\.\,]+\)|[a-zA-Z]+)\s+([0-9\.\-]+)\%)/g,
            angExp=/(\-?[0-9\.]+)\s?deg/,
            m;

            while (m = colorRegexp.exec(grad)) {
                // 2 : color
                // 3 : %
               gradient.stops.push({color:m[2],percent:parseFloat(m[3])});   
            }
            if(m=angExp.exec(grad))
                gradient.ang=1*m[1];
            return gradient;
        }else console.error(`error parsing gradient ${c}`);

    }
    static rgbaFromName(n)
    {   const names={black:"rgba(0,0,0,1)",white:"rgba(255,255,255,1)",red:"rgba(255,0,0,1)"}
        return names[n];
    }
    static sM_rgbaToArray(color)
    {   
        const reg=/rgba?\(([0-9\.]+),([0-9\.]+),([0-9\.]+),?([0-9\.]*)\)/
        let m = (RQColor.rgbaFromName(color)??color).match(reg);
        if(m && m.length>=4)
        {
            return [parseInt(m[1]),parseInt(m[2]),parseInt(m[3]),parseFloat(m[4]??"1")];
        }
    }
    static sM_rgbaToColorAlpha(color)
    {   let c=RQColor.sM_rgbaToArray(color)
        const a=(t)=>{ let h=Math.min(255,t|0).toString(16);if(h.length<2)h='0'+h;return h }
        //if(c)console.log(`sM_rgbaToColorAlpha c=${c[0]},${c[1]},${c[2]},${c[3]} convert=#${a(c[0])}${a(c[1])}${a(c[2])}`);
        return {color:c?`#${a(c[0])}${a(c[1])}${a(c[2])}`:color,opacity:c?c[3]:1}    

    }
    M_toContext(ctx,r)
    {   // make a rotation 
        let a=this.m_gradient.ang*D2R, p=new ZV2(r.w/2*cos(a),r.h/2*sin(a)),c=r.center();
        
        return this.M_createContextGradient( ctx,c.M_minus(p),c.M_plus(p));
    }
    M_createContextGradient(ctx,p1,p2)
    {
        if(this.m_gradient && ctx)
        {
            var gradient = ctx.createLinearGradient(p1.x,p1.y, p2.x, p2.y);
            for( let i=0; i<this.m_gradient.stops.length; i++)
            {   let stop=this.m_gradient.stops[i];
                gradient.addColorStop(stop.percent/100, stop.color );
            }
            ctx.fillStyle = gradient;
            return gradient;
        }

    }
    static getHue(r255,g255,b255)
    {
        if(r255==g255 && g255==b255)
            return -1;
        let a=[r255/255,g255/255,b255/255]
        let rmin=1,rmax=0;
        let kmax=0,kmin=0;
        for(let k=0;k<3;k++)
        {   if(a[k]>rmax) {rmax=a[k];kmax=k}
            if(a[k]<rmin) {rmin=a[k];kmin=k}
        }
        let d=rmax-rmin;
        if(d<0.2) return -1;    // greyish
        let hue=kmax==0? (a[1]-a[2])/d : (kmax==1? 2+(a[2]-a[0])/d : 4+(a[0]-a[1])/d)
        hue*=60; if(hue<0) hue+=360;
        return hue; 
    }
    static isPink(r255,g255,b255)
    {    let hue=RQColor.getHue(r255,g255,b255)
        return hue>280 && hue<325;
    }

};


//SCRIPT: http://localhost:8888/Patterns//Data/Js/Utils/RQEvents.js

class RQEvent
{
	constructor(tag,cb,data,ctx)
	{
		this.tag=tag;
		this.cb=cb;
		this.ctx=ctx;
		this.data=data;
	}
}

class RQEventManager
{
	constructor()
	{
		this.m_events=[]
	}
	M_on(tag,cb,data,ctx)
	{	this.m_events.push(new RQEvent(tag,cb,data,ctx))
	}
	M_fire(tag,data,ctx,is1)
	{	let i,e,E=this.m_events,n=E.length
		for(i=0;i<n;i++)
		{	e=E[i];
			if(e.tag==tag && e.cb)
			{	e.cb.call(e.ctx??ctx,data,e.data)
				if(is1) E.splice(i,1),i--,n--
			}

		}
	}
	M_fireOnce(tag,data,ctx)
	{	this.M_fire(tag,data,ctx,1)
	}
	async M_asyncFire(tag,data,ctx,is1)
	{	let i,e,E=this.m_events,n=E.length
		for(i=0;i<n;i++)
		{	e=E[i];
			if(e.tag==tag && e.cb)
			{	await e.cb.call(e.ctx??ctx,data,e.data)
				if(is1) E.splice(i,1),i--,n--
			}

		}

	}
}
const EventManager=new RQEventManager();


//SCRIPT: http://localhost:8888/Patterns//Data/Js/Utils/RQVariables.js

class RQVariables
{
	constructor(name)
	{	this.m_name = name;
		this._V={};
		this.m_pathPrefix= "../";

	}
	M_convertVariables()
	{
		for( var varname in this._V)
		{	let V = this._V[varname];
			let isObjectValue = V.E!==null &&  typeof V.E=== 'object';
			//console.log(varname+" => "+V.E+" isObjectValue?"+(isObjectValue?"true":"false" ));
			if( isArr(V.E ))
			{
				for( let i=0; i<V.E.length; i++)
				{
					var V2 = V.E[i];
					if( typeof V2==="object" && V2.m_templateName) // this is a Template
					{	//console.log("GOT template object "+V2.m_templateName);
						let rqVarObj = new RQVariables(V2.m_templateName);
						rqVarObj._V = {...V2._V};
						rqVarObj.m_title=V2.m_title;
						rqVarObj.M_convertVariables();
						V.E[i] = rqVarObj;
					}				
				}			
			}
		}
	}


	M_dumpVariables(tab)
	{	if(tab==undefined)
		tab="";
		var s=tab+"/*"+this.m_name+"*/\n";
		for( var varname in this._V)
		{
			var V=this._V[varname];
			s+=tab+varname;
			if( isArr(V.E))
			{	s+=" = Array\n";
				for(let i=0; i<V.E.length; i++)
				{	s+=tab+"("+i+") ";
					let Vitem = V.E[i];
					if( typeof Vitem==="object" )
					{
						if(Vitem.constructor.name=="RQVariables")
							s+="\n"+Vitem.M_dumpVariables(tab+"  ");
						else
							s+=RQPrintR(Vitem)+"\n";
					}
					else 
						s+= Vitem+"\n"; 
				}
			}
			else 
				s+=" = "+RQPrintR(V.E)+"\n";
		}
		return s;	
	}
	// --------------------------------------------------
	// get variables values
	// --------------------------------------------------
	is(n)
	{	return this._V.hasOwnProperty(n);
	}
	M_get(n,d)
	{	return this.is(n)?this._V[n].E:d??"";
	}

	gF(varname,d)
	{
		if( varname in this._V)
		{	
			var v = this._V[varname];		
			if( typeof v.E==="object")
			{	var a=d??{}
				for(var k in v.E) a[k] = parseFloat(v.E[k]);
				return a;
				
			}
			else 
			{	let f =  Number(v.E);
				if( isNaN(f))
					f=0;
				return f;
			}
		}
		else if(d!=undefined)
			return d;
		return 0.0;
	}
	gI(varname,defaultValue)
	{
		var v = this._V[varname];
		if(v!=undefined)
		{	if( typeof v.E==="object")
			{	var a={}
				for(var k in v.E)
				{	a[k] = parseInt(v.E[k])
				}
				return a;
				
			}
			else 
			{	let f =  parseInt(v.E);
				if( isNaN(f))
					f=0;
				return f;
			}
		}
		return defaultValue??0;
		
	}
	gB(varname,defaultValue)
	{
		if(this._V.hasOwnProperty(varname))
		{	
			return this._V[varname].E=="true";
		}
		else
		{ if( typeof defaultValue!=='undefined')
				return defaultValue?true:false;
		}
		return false;
	}
	M_getPath(varname)
	{
		var v = this._V[varname];
		if(v && v.E)
		{		
			return this.m_pathPrefix + v._O["PATH"] + v.E;
		}
		return 0;
	}
	M_getVarName(varname,brackets)
	{
		var v = this._V[varname];
		if(v && v._O)
		{	let vn= v._O['VARNAME'];
			if(brackets && typeof v.E==="object") vn+="[]";
			return vn;
		}
		return null;
	}
	M_getElt(varname,pre)
	{	let dName=this.M_getVarName(varname,1),e=document.querySelectorAll(`[name='${pre?pre:""}${dName}']`);
		if(e&&e.length) return e[0];
	}
	M_getEltComment(n)
	{	let e=this.M_getElt(n);
		if(e&&(e=e.parentNode) && (e=e.parentNode) && (e=e.querySelector(".inputComment")))
			return e;		
	}
	M_setEltComment(n,c)
	{	if(_UI)
		{
			let e=this.M_getEltComment(n);
			if(e) e.innerHTML=c;
		}
	}

	gO(varname,optname,df)
	{
		var v = this._V[varname];
		if(v && v._O)
		{	return v._O[optname]??df;
		}
		return df;
	}


	gPk(varName,templateName,getAll)
	{
		var all=[];		
		var V=this._V[varName];
		if( V!=undefined && isArr(V.E ))
		{
			if( !isArr(templateName))
				templateName=[templateName];
			for(let i=0; i<V.E.length;i++)
			{
				let C =V.E[i]; 
				let found=false;
				for(let i2=0;i2<templateName.length; i2++)
				{	if( C.m_name ==templateName[i2] )
					{	found=true;
						break;
					}
				
				}
				if( found)
				{
					if(getAll)
						all.push(C);
					else 
						return C;
				
				}
			}		
		}
		return getAll?all : null;
	}
}
var _UIStack=[];
_pushUI=(m)=>{
	let n=_UIStack.length;
	_UIStack.push({is:_UI}); _UI=m??1;
	console.warn(`Push UI: ${_UI?"true":"false"} stack=${_UIStack.length}`);
	return n;
}
_popUI=()=>{if(_UIStack.length) _UI=_UIStack.pop().is;
	console.warn(`Pop UI: ${_UI?"true":"false"} stack=${_UIStack.length}`);
}
async function _popUIWait(n)
{	_popUI();
	while(_UIStack.length>n) await sleep(10);
}


//SCRIPT: http://localhost:8888/Patterns//Data/Js/Utils/Factories.js

class FactoryManager
{
    constructor(name)
    {
        this.m_mngrName=name;
        this.m_lib={};
    }
    M_register(name, opts)
    {  this.m_lib[name]=opts;
    }

    M_createOne(_,Svar)
    {
        if( this.m_lib.hasOwnProperty(Svar.m_name))
        {
            let lib=this.m_lib[Svar.m_name];
            let factory = lib.factory?lib.factory:FactoryInstance.create;
            let instance = factory.call(_,Svar.m_name);
            if(instance)
            {   instance._V=Svar._V;					
                return instance
            }
        }
        else
            console.warn(`[manager ${this.m_mngrName}] ${Svar.m_name} not registered.`);

    }
    M_createFromVars(_,vars)
    {
        let out=[];
        		
		for( let is=0; is<vars.length; is++)
		{
            let instance = this.M_createOne(_,vars[is])
            if(instance)
                out.push(instance);
        }
        this.M_init(_,out)
        return out;


    }
    M_init(_,instances)
    {
        for( let i=0; i<instances.length; i++)
            instances[i].M_init(_);
    }
}
class FactoryInstance extends RQVariables
{

    constructor(name)
    {	super(name);
        this._g={};
        this.applyDistortion=()=>{}
    }
    static create(name)
    {   return new FactoryInstance(name);
    }
	M_declareGroup(_,tag)
	{	let Gr=_._Sv(this.m_name, tag);
		return this._g[tag]=A.M_getGroupInstance(Gr);
	}
    M_readGroups(_,varName)
    {   varName??="addons"
        _.M_makeBundleInstances(this,this.m_name);   
        
        // Stroke groups
        let i,a1 = this.gPk(varName,_.M_getLineGroups(),true);
        for(i=0; i<a1.length; i++)
            _._rS(this,a1[i]);
        
        // Fills and hatches
        let a2 = this.gPk(varName,_._gH(),true);
        for(i=0; i<a2.length; i++)
            _.M_readHatchVariable(this,a2[i]);

		// Deformers and other addons
        let a3 = this.gPk(varName,["DistortionModifier","ImplMod"],true);
        for(let ia=0; ia<a3.length; ia++)
        {	_.M_readSpecialAddons(this,a3[ia]);
        }

    }
    M_init(_)
    {   

    }
    M_draw(_)
    {}
};


//SCRIPT: http://localhost:8888/Patterns//Data/Js/Algorithms/PatternAlgorithm.js?v=1681489318

const FLOATPRECISION = 2;
//var WIDEGAMUT=0
class Animated
{
	constructor()
	{
		this.rnd = 0;
	
	}

};
// events
class ZPA extends RQVariables
{
	constructor(name)
	{
		//console.log("ZPA Constructor");
		super(name);
		EventManager.M_fire("AConstructor",{name:name},this);
		this.m_dt = 20;
		this.u = 10.0;
		this.m_pngUpscale = 1;
		this.mwA = new ZRc();
		this.m_sizeMm = {width:100,height:100};
		this.W = this.m_sizeMm.width*this.u;
		this.H = this.m_sizeMm.height*this.u;
		this.m_externalMargin = 0;
		this.m_strokeWidth = 1.0;
		this.m_strokeColor="#000000";
		this.m_isSvgBackgroundColor=true;
		this.m_mask= null;
		this.m_stencil= null;
		this.m_maskImage=null;
		this._o=null;
		this.mH=[];	// PNG / shapes heap
		this.mHL=[];	// PNG / lines heap
		this._renderOn=1;
		this._maskingOn=1;
		this.stackClipShape=null;
		this.m_isMainAlgorithm=true;
		this.m_clipThreshold = 128;
		this.m_logObj=null;
		this.logActive=true;
		this.m_abort = false;
		this.m_paperColor = "";
		this.m_paperColors=[];
		this.m_bgTransparent=false;
		this.m_lines 	= [];
		this._gDeclared =[];
		this._gInstances =[];
		this._g ={};
		this.m_isMakeSvgGroups = false;
		this.alwaysActivateGroups = false;
		this.m_allowLiveFillShape = false;
		this.m_lineCount = 0; 
		this.m_animated = [{t:0,tsin:0}];
		this.m_animation={ frameNb:0,frameId:0,every:1} 
		this.m_lineStyles=[],this._rLs()
		this.m_fillStyles=[],this._rFs()
		this.m_funcs=[],this.M_registerFuncs()
		this.m_lineGroups=['SVGGroup','SVGGroup2'],
		this.m_addOns=[],this.M_registerAddons()
		this.m_nbImagesLoading = 0;			
		this.m_nbImagesLoaded = 0;
		this.m_version = 0;	
		this.m_textures=[];
		this.m_deformersActive = true;
		this.m_deformer = null;
		this.m_deformStack=[];
		this.m_isOwnPalette = false;
		this.m_bgFilters=[];
		this.m_fgFilters=[];
		this.m_waitingfor=0;
		this.M_registerPaperColors();
	}
	M_isUseVersion($v)
	{
		if( this.m_useVersion <=0 || this.m_useVersion>=$v)
		{
			return true;
		}
		return false;
	
	}
	M_setArtworkTitle($t)
	{
		this.m_title = $t;
	}
	M_setVariables(jsonV)
	{
		let _=this,v=_._V = jsonV;
		_.M_convertVariables();
		//console.log(this.M_dumpVariables());
		EventManager.M_fire("VariablesInit",v,_);
		_.VM_onVariablesSet(v);
		EventManager.M_fire("VariablesSet",v,_);

		_.M_getSizeMm();
		_.M_getSvgProperties();
		_.M_getDefaultStyle();
		_.M_getMathsVariables();
		_.M_getClipParameters();
		if(_.isPNG()&& _.m_isMainAlgorithm)
			_.M_createOutputCanvas();	

	}
	VM_onVariablesSet(){}
	// --------------------------------------------------
	// M_createMaskCanvas M_createClipCanvas M_createOutputCanvas
	// --------------------------------------------------
	M_deleteCanvases()
	{	let _=this,t
		_.m_mask?.delete()
		_.m_stencil.delete()		
		_.m_mask=null
		_.m_stencil=null
		while(t=_.m_textures.pop()) t.delete()
	}
	M_createMaskCanvas()
	{
	
		if( this.m_mask==null)
		{	this.m_mask = new Texture({width:this.W, height: this.H});
			this.m_mask.M_fill("black");
		}
	}
	M_createClipCanvas()
	{
	
		if( this.m_stencil==null)
		{	this.m_stencil = new Texture({width:this.W, height: this.H});
			this.m_stencil.M_fill("black");
		}
	}
	M_createOutputCanvas()
	{
		if( this._o==null)
		{	
			let _=this,pu=_.m_pngUpscale, x=_.m_externalMargin,W=_.W*pu+2*x, H=_.H*pu+2*x;
			_._o = new Texture({width:W, height: H});
			let ctx=_._o._X();
			if(x) ctx.translate(x,x);
			ctx.scale(pu,pu);
			_._o.M_pushState();
			_.M_initOuputImage();
		}
	}
	M_drawFilters(filters)
	{
		if(filters)
		{
			for( let i=0; i<filters.length; i++)
			{	let f=filters[i];
				if(f.f)
					f.f.apply(f.ctx,[this,...(f.opts??[])]);
				else f.call(this);
			}
		}

	}
	M_initOuputImage()
	{	
		if(this._o )
		{
			let ctx=this._o._X();
			if(this.m_isMainAlgorithm)
			{	if(this.m_bgTransparent || this.m_paperColor=="Transparent")
					this._o.M_clear();
				else 
				{	ctx.fillStyle = this.M_getPaperColor(this.m_paperColor);
					let margin=this.m_externalMargin/this.m_pngUpscale;
					ctx.fillRect(-margin, -margin, this.W+2*margin, this.H+2*margin);
				}
				this.M_drawFilters(this.m_bgFilters);
			}

			//ctx.save();
		}
		this.M_clipToWorkArea()

	}
	M_clipToWorkArea(isStack,img,shape)
	{	isStack??=1
		shape??=this.M_get("workareaShape");
		this.m_clipArea=this.M_getClipArea(this.mwA)
		
		img??=this._o;
		//console.warn(`M_clipToWorkArea isStack=${isStack?"yes":"no"}`)
		//console.group(`M_clipToWorkArea main=${this.m_isMainAlgorithm?"yes":"no"}`);
		if(img)
		{	let ctx=img._X();
			img.M_popState(1);
			img.M_pushState();
			ctx.beginPath();
			this.M_clip1(ctx,this.mwA,shape)
			ctx.closePath();
			ctx.clip();


		}
		// save this clip area for stack
		if(isStack)
		{
			let s=A.stackClipShape;
			if(s){	
				A.mH.push({...s});
				//console.log(`Pushing to heap previous= ${RQPrintR(s,1)}`);
			}
			A.stackClipShape={m:'workarea',shape:this.m_clipArea.clone(),type:shape }
			//console.log(`Next will be= ${RQPrintR(A.stackClipShape,1)}`);
		}
		//console.groupEnd();
		//this.m_clipArea=this.mwA.clone();

	}
	M_getClipArea(r)
	{	return r.clone();

	}
	// **Deprecated**
	M_putWorkareaInStack()
	{	/*let o = {m:'workarea',shape:this.mwA,type:this.M_get("workareaShape") }; 
		console.warn("M_putWorkareaInStack "+RQPrintR(o,1)+" canvasHeap size="+this.mH.length );
		this.mH.push(o);*/

	}
	M_setClipRect(r)
	{	let img
		r??=this.mwA
		img??=this._o;
		this.m_clipArea=r.clone()
		if(img)
		{	let ctx=img._X();
			img.M_popState(1);
			img.M_pushState();
			ctx.beginPath();
			ctx.rect(r.x,r.y,r.w,r.h);
			ctx.closePath();
			ctx.clip();

		}
		// save this clip area for stack
		let s=A.stackClipShape;
		if(s)
			A.mH.push({...s});
		A.stackClipShape={m:'cliprect',r:r.clone()}
	}

	M_clip1(ctx,rect,shape)
	{
		switch(shape)
		{
			default:
				ctx.rect(rect.x,rect.y,rect.w,rect.h);
				//console.log("M_clip1 "+RQPrintR(rect));
				break;
			case "Circle":
				ctx.arc(rect.center().x,rect.y,rect.w/2,0,PI*2);
				break;
		}
	}
	M_resetClipping(isStack,isLineClip)
	{
		let img;
		img??=this._o;

		if(img)
		{
			img.M_popState(1);
			if(isStack) 
			{	let s=A.stackClipShape;
				A.mH.push({...s});
				A.stackClipShape={m:'workarea',shape:this.mdA.clone(),type:"rectangle" }
			}

		}
		if(isLineClip)
			this.m_clipArea=this.mdA.clone();
	}
   // --------------------------------------------------
   // M_showWorkCanvases
   // --------------------------------------------------
	M_showWorkCanvases()
	{
		if(this.logActive)
		{	this.M_showMaskCanvas();
			this.M_showStencilCanvas();
		}	
		this.M_showOutputImage();
	
	}
	M_createControlImg(id,title,content,out)
	{
		let dv =NewElt("div",{id:id,appendTo:out??GetEltBody()});
		if(title) NewElt("h4",{text:title,appendTo:dv});
		dv.appendChild(content);
		return dv;
	}
	M_showMaskCanvas()
	{
		if( this.maskDiv == undefined)
	   		this.maskDiv = this.M_createControlImg("mask","Mask",this.m_mask.m_canvas,document.getElementById("logContainer"));
	}
	M_showStencilCanvas()
	{
		if( this.stencilDiv == undefined)
	   		this.stencilDiv = this.M_createControlImg("stencil","Stencil",this.m_stencil.m_canvas,document.getElementById("logContainer"));
	}
	M_showOutputImage()
	{	//
		if( this._o && this._oDiv == undefined)
	   		this._oDiv = this.M_createControlImg("outputImage",0,this._o.m_canvas,document.getElementById("ARTWORK"));

		}

	
   // --------------------------------------------------
   // M_getClipParameters  
	M_getClipParameters()
	{	
		this.m_clipMinSegment = this.M_get("clipMinSegment")*this.u;
		this.m_clipThreshold = this.M_get("clipThreshold",128);
		this.m_isClipImageToWorkArea =  this.gB("isMapClipImageToWorkArea",false);
		this.m_protectionStrokeWidth = this.gF("protectionStrokeWidth",0.1)*this.u;
		this.m_isShortenJunctions = this.m_protectionStrokeWidth >= 1; 
		this.m_isUseMask=this.gB("isUseMask");
	
	}


	// M_getMathsVariables
	M_getMathsVariables()
	{
		// seed 
		let sd = this.gI("seed",0)
		this.M_seed(sd?sd:(Math.random()*1E3|0))
		
		this.m_useVersion = this.gF("useVersion",0);
		this.m_noiseFactor = this.gF("noiseFactor",{x:1,y:1});
		this.m_documentHorizon = this.gF("documentHorizon",0.9);
		this.m_perspectiveFactor = this.gF("perspectiveFactor",0.5);
		let l = this.gF("lightSource",{x:-1,y:2,z:0.6});
		this.m_lightSource = new ZV3(l.x,l.y,l.z); this.m_lightSource.Nz();
		this.m_toEyeVector = new ZV3(0,this.m_perspectiveFactor,1);
		this.m_toEyeVector.Nz();



	}
	M_setOrigin2D(o)
	{
		A.m_origin2D =o;
	}
	Pj( P, Porigin2D)
	{
		let Pproj = new ZV2(P.x, -P.y + P.z*this.m_perspectiveFactor);				
		if( typeof Porigin2D==="object")
		{	Pproj.M_add(Porigin2D);
		}
		else if(A.m_origin2D)
			Pproj.M_add(A.m_origin2D);
		else
			Pproj.y+=this.mwA.top();
		return Pproj;
	}
	M_isBackface(N,P)
	{	if(this.projFocal &&P)
		{
            let u=P.M_minus(this.projFocal).Nz();
			return (!N)||N.M_dot(new ZV3(0,-u.y,u.x))<0;
		}
		return (!N)|| N.M_dot(this.m_toEyeVector) <0
	}
	M_getProjectionFunc()
	{
		return this.Pj;
	}
	// Compute a projected orientation ( in deg ) of a 3D vector
	M_projectedOrientation(P)
	{	let dirProj = this.Pj(P,0); 
		return Math.atan2(dirProj.y,dirProj.x)/D2R;
	}
	
	// --------------------------------------------------
	// M_getSizeMm
	// reads the size from the dimensions variables  
	// --------------------------------------------------
	M_getSizeMm()
	{
		let _=this, upsc = _.gI("u");
		if( upsc>0) _.u = upsc
		let u=_.u,Art,em
		_.m_sizeMm = {width:_.gI("widthMm"),height:_.gI("heightMm")};
		_.W = _.m_sizeMm.width*u;
		_.H = _.m_sizeMm.height*u;
		if(Art=getById('ARTWORK'))	Art.setAttribute("width", ""+(_.m_sizeMm.width*148/98)+"mm")		
		_.m_documentMargin = _.gF("documentMargin",0)*u;
		if(em = _.gF("extMargin")) { _.m_externalMargin=em*u*_.gF("pngUpscale",1)|0} 
		_.M_makeWorkArea();



	}

	M_makeWorkArea()
	{	
		let m = this.m_documentMargin;
		this.mdA = new ZRc(0,0,this.W,this.H); 
		let workareaShape = this.M_get("workareaShape","Rectangle");
		//console.log("M_makeWorkArea on "+this.m_name+" shape="+workareaShape);
		let workareaCenter = this.gF("workareaCenter",{x:0.5,y:0.5});
		let minDim = Math.min(this.W,this.H)-2*m;
		let shift = {x:(workareaCenter.x-0.5)*this.W, y:-(workareaCenter.y-0.5)*this.H};
		switch(workareaShape)
		{
			case "Rectangle":
			default:
				this.mwA  = new ZRc(m+shift.x,m+shift.y,this.W-2*m,this.H-2*m);
				break;
			case "Square":
				this.mwA  = new ZRc( shift.x+(this.W-minDim)*0.5,shift.y+(this.H-minDim)*0.5,minDim,minDim);
				break;
			case "Circle":
				this.mwA  = new RQCircle( this.W*workareaCenter.x,this.H*(1-workareaCenter.y),minDim/2);
				break;
		
		}
		this.m_clipArea=this.M_getClipArea(this.mwA);

		//Art.css({minWidth:this.m_sizeMm.width+"mm", minHeight:this.m_sizeMm.height+"mm"})

	}
	// --------------------------------------------------
	// M_getDefaultStyle
	// reads the default stroke style  
	// --------------------------------------------------
	M_getDefaultStyle()
	{
		let n="strokeWidth",sc="strokeColor",sw=this.m_strokeWidth = this.gF(n,0.5)*this.u;
		this.m_strokeColor = this.M_get(sc,"black");
		this.m_hilight = this.M_get("hilight","white");
		
		this.m_paperColor = this.M_get("paperColor");
		this.m_bgTransparent = this.gB("bgTransparent",false);
		this.m_allowLiveFillShape = this.gB("isLiveFill",false);
		this.M_showMm(sw,n);
		//
		
	}
	M_showMm(l,n,v,fil)
	{	v??=this;
		let k,L=typeof l==='object'?l:{_:l},r=this.M_svgSize().w/this.W,s="",sep='';
		for(k in L)
		if(k=='_' || (!fil)||fil.includes(k))			
		{	let p=L[k]*r;
			s+=sep;
			if(k!='_')s+=`${k}:`;
			s+=`${(p*100|0)/100}mm`
			sep=" ";
		}
		v.M_setEltComment(n,s)
	}
	// --------------------------------------------------
	// LINE STYLES
	// --------------------------------------------------
	M_getStyle(S,v)
	{
		S??=this;v??=S;
		let t=this,sc="strokeColor",b,swn="strokeWidth";
		S.m_strokeColor = t.M_getColor(v.is("lineStyle")?v.gO("paletteTag","color"):v.M_get(sc,this.m_strokeColor));

		let setStrk=(l)=>{S['m_'+swn]=(l<=0 )?t.m_strokeWidth:Number(l)*t.u};
		setStrk(v.gF(swn))
		if(_UI)
		{	
			let e,f=()=>{this.M_showMm(S['m_'+swn],swn,v)}
			if(e=v.M_getElt(swn)) e.onchange=function(){ setStrk(this.value);f()}
			f();
		}

		S.m_isStrokeScale=v.gO(swn,"scale");
		S.m_isStrkPrtct=v.gO(swn,"prtct");
		S.m_isStrkRound=v.gO(swn,"round");
		S.m_paletteTag = v.M_get("paletteTag","line");
		S.m_paletteVariant = v.gO("paletteTag","variant");
		let ls,s=v.M_get(ls="lineStyle","-");if(s&&s!='-') S.m_lineStyle=this.M_getLineStyle(s,v,ls,S);
		if((b=v.gO(ls,"blend"))&&b!='-')S.blend=b;
		if(b=='shadow') S.shadowColor=v.gO(ls,"shadow")
		S.m_isFill=v.gB("isFill",false);
			
	}
	_rLs()
	{
		this._rL('pass',function(l,v,ls){
			l.samp=v.gO(ls,"samp",0)*this.u
		},  this.lsPass)

		this._rL('noiseDash',function(l,v,ls){
			l.samp=v.gO(ls,"samp",0)*this.u
			l.brk=v.gO(ls,"break",0)==true
		},  this.lsNoiseDash)
		this._rL('demult',function(l,v,ls){			
			l.ampl=v.gO(ls,"ampl",1)*this.u
			l.nbit=v.gO(ls,"nbit",2)|0
			l.samp=v.gO(ls,"samp",0)*this.u
			l.nk=1*v.gO(ls,"nk",30)
			l.stopSvg=v.gO(ls,"stopSvg",0)
		},this.lsDemult)
		this._rL('discard',(l,v,ls)=>{}, ()=>[])
	
	}
	_rL(name,fInit,fApply)
	{
		let h={init:fInit,fn:fApply}
		this.m_lineStyles[name]=h
		
	}

	M_getLineStyle(name,v,ls,S)
	{	let t=this, _ls=t.m_lineStyles[name];
		if(_ls)
		{	let l={name:name},chN=v.gO(ls,'chainNb'),ls2,nm2,l2,i
			_ls.init.call(this,l,v,ls)
			l.group=S;
			// additionnal line styles, if opt.chainNb
			if(chN>1)
			{	for(i=1;i<chN;i++)
				{	nm2=v.M_get(ls2=`${ls}+${i}`,"-")
					if(nm2&&nm2!='-')
					{	l.chain??=[]
						l.chain.push(t.M_getLineStyle(nm2,v,ls2,S))
						//console.log("YES "+RQPrintR(l.chain.pop()));	
					}
				}

			}
			return l;

		}
		
	}

	_aLs(lst,Ls,forSvg)
	{	let _=this,out,_ls=_.m_lineStyles[lst.name];
		if(forSvg)
		{	if(lst&&lst.stopSvg)
			{	forSvg.a=Ls.map((L)=>L.clone() )
				forSvg.stopped=1
			}
		}
		if(_ls&&_ls.fn)
		{	out= _ls.fn.call(_,lst,Ls)
			if(isArr(lst.chain))
				lst.chain.map((ls2,i)=>{
					out=_._aLs(ls2,out,forSvg);
				})
		}
		else out=Ls;
		if(forSvg)
		{	if(lst.stopSvg){
				if(!forSvg.stopped)
				{	forSvg.stopped=1
					forSvg.a=out.map((L)=>L.clone())
				}
			}
			if(!forSvg.stopped)
			{	forSvg.a=out
				if(lst.outSvg)
				{	forSvg.stopped=1
					forSvg.a=out.map((L)=>L.clone())
				}
			}
		}
		return out;
	}
	M_applyLSHeap(ls,context,heap,group,h,opt)
	{	let _=this,rep=1
		if(ls.fnHeap)
			rep&&=ls.fnHeap.call(_,ls,context,heap,group,h,opt)
		if(isArr(ls.chain))
		{
			ls.chain.map((ls2)=>{
				if(ls2.fnHeap) rep&&=ls2.fnHeap.call(_,ls2,context,heap,group,h,opt)})
		}
		return rep
	}

	
	lsPass(lst,Ls)
	{	if(!lst.samp) return Ls;
		let out=[]
		for(let j=0;j<Ls.length;j++)
			out.push(Ls[j].M_sample(lst.samp))
		return out;
	}
	lsNoiseDash(lst,Ls)
	{	let out=[],knx=200,j,i,n1=Ls.length;
		lst.rnd??=ZMT.newRnd(n1,"lsNoiseDash")
		for(j=0;j<n1;j++)
		{ 	let L=lst.samp?Ls[j].M_sample(lst.samp):Ls[j],l=0,n=L.M_nb(),ky0,pPrev;					
			for(i=0;i<n;i++)
			{ let p=L.M_getPoint(i);
				if(pPrev) l+=p.M_minus(pPrev).M_length();
				pPrev=p;
				ky0??=knx*(p.y+p.x)/this.H
				//if(Noz(knx*l/this.W,ky0)<0.2)
				p.penUp=lst.rnd()<0.5?1:0;
				
			}
			out.push( ...(lst.brk? L.M_break():[L]));

		}
		return out;
	}
	lsDemult(lst,Ls)
	{
		let out=[];
		let passes=lst.nbit;
		for(let ip=0;ip<passes;ip++)
		{	if(passes==1)ip=1
			let knx=lst.nk/*+ip*10*/;
			let amp=(0.3+ip*0.2)*lst.ampl;
			let shf=ip*knx/passes;
			for(let j=0;j<Ls.length;j++)
			{ 	let L=lst.samp?Ls[j].M_sample(lst.samp):Ls[j],l=0,n=L.M_nb(),ky0,pPrev,Amp,prvAmp,t,isCl=L.M_isClosed();					
				
				let L2=new ZPL();
				
				for(let i=0;i<n;i++)
				{  let p=L.M_getPoint(i);
					if(pPrev){
						let u=pPrev.M_minus(p);
						let d=u.M_length();
						if(d)
						{	l+=d
							t=u.M_rotate(90).Nz();
						}
					}
					pPrev=p;
					ky0??=knx*(p.y+p.x)/this.H
					let p2=p.clone(),
					//Amp=amp*Noz((knx+shf)*l/this.W,ky0)*(isCl?ZMT.smooth0(i/(n-1)):1);
					Amp=amp*Noz((knx+shf)*l/this.W,ky0)*(isCl?ZMT.smooth0(i/(n-1)):1);
					if(t) p2.M_addU(t,Amp);
					L2._aP(p2);
					if(i==1 && t &&!isCl)	// first point gets same tangent
						L2.first().M_addU(t,prvAmp)
					prvAmp=Amp;
					
				}
				if(isCl&&n>=2)L2.first().M_set(L2.last());
				out.push(L2);
			}
		}
		return out;
	}

   M_getStyleAsString(S)
   {	S??=this;
		var s = "stroke:"+S.m_strokeColor+";stroke-linecap:round;stroke-linejoin:round;stroke-width:"+S.m_strokeWidth+";fill:none";
		return s;
   }
   M_makeSVGColor(opt,S)					
   {	S??=this;
		let c=RQColor.sM_rgbaToColorAlpha(S.m_strokeColor)
		if(!c)console.error(`error on color ${S.m_strokeColor}`)
		opt.stroke=c.color??"rgba(0,0,0)";
		opt.opacity=c.opacity;
   }
   M_svgSize()
   {	if(!this.m_svgSize)this.M_getSvgProperties();
		return this.m_svgSize;
   }
   printMm(mm)
   {	return mm*this.W/this.M_svgSize().w;

   }
   isPNG(){return this.m_outputFormat=="PNG"}
   isSVG(){return this.m_outputFormat=="SVG"}
	M_getSvgProperties()
	{
		if(this.m_svgSize) return;
		
		let t=this;
		t.m_isMakeSvgGroups = t.gB("makeSvgGroups",0);
		t.m_outputFormat  = t.gB("outputFormat",0)? "PNG":"SVG";
		let pnm="pngUpscale",pn=t["m_"+pnm]=t.gF(pnm,1);if(pn<=0)pn=1;
		let wh= t.gF("svgSize",{w:-1,h:-1});
		let wmm=((wh.w>=1? wh.w:t.W/t.u)*10|0)/10;
		let hmm=((wh.h>=1? wh.h:wmm/t.W*t.H)*10|0)/10;
		t.m_svgSize={w:wmm,h:hmm}
		t.M_setEltComment("svgSize",`${wmm}mm x ${hmm}mm`);
	}
	M_getAnimationParameters()
	{
		if(this.m_isAnimation = this.gB("isAnimation",0))
			this.m_animation.frameNb= this.gI("nbAnimationFrames",30);
	}
	M_setPalette(palette)
	{
		this.m_palette = palette.colors;
		//console.group("M_setPalette");
		//console.log("Name = "+palette.title);	
		for(let tag in palette.colors)
		{	let c=palette.colors[tag];
			//console.log(" - "+tag+" light = "+c.light+" medium = "+c.medium+" dark = "+c.dark);
			// if( c.isMix) ...
		}
		//console.groupEnd();
	}
	M_getPaletteColor(tag, variant,color)
	{	if( tag && tag!='custom' && this.m_palette)
		{
			if(!this.m_palette.hasOwnProperty(tag))
				tag="fill"
			let p=this.m_palette[tag];
			if(p)
			{	if( p.isMix)
					return this.M_getColor(p[rndArray(p.keys(),this.rndPal??=ZMT.newRnd() )]);
				else
					return this.M_getColor(p[variant??"medium"]);
			}
		}
		if(color!=undefined)
			return this.M_getColor(color);
		return "black";
		
	
	}
	M_RGBA(c)
	{  let a,w=255;
		switch(c)
		{ 	case 'white':a=[w,w,w,1];break;
			case 'yellow':a=[w,w,0,1];break;
		}
		return a??[0,0,0,1];
	}
	M_getColor(c)
	{
		const reg = /[0-9\.]+\)/;
		if(c)
		{	let c0
			if(c.includes('*')&& (c0=c.match(/([a-zA-Z\-]+)\*/)))
			{	let m0=c.match(/\/([0-9\.]+)/),m,m2;
				let a=m0?parseFloat(m0[1]):1;
				if( (m=c.match(/\*rgba\(([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/))||(m2=c.match(/\*([a-zA-Z\-_]+)/)))
				{	let k,t=RQColor.sM_rgbaToArray(this.M_getColor(c0[1]));
					k=m?parseFloat(m[4]):this.M_RGBA(m2[1]);
					c="rgba(";for(let i=0;i<3;i++)c+=parseInt( t[i]*(1-k)+parseFloat(m[i+1])*k)+","; 						
					
					c+=`${a})`;
										
				}

			}
			else if(c.includes('/'))
			{
				let matches = c.match(/(.*)\/([0-9\.]+)/);
				if( matches!=null)
				{
					let opacity = matches[2]+")";
					c=this.M_getColor(matches[1]).replace(reg,opacity);
										
				}
			}
			switch(c)
			{
				case 'inherit':
					c=this.m_strokeColor;
					break;
				case 'black':c="rgba(0,0,0,1)";break;
				case 'white':c="rgba(255,255,255,1)";break;
				case 'hilight':c=this.m_hilight;break;
				case "paper":c=A.M_getPaperColor();break;
				case "MayGreenDark":
					c="rgba(151,165,29,0.7)";
					break;
				case "MayGreen":
					c="rgba(179,198,35,0.75)";
					break;
				case "CitrusBlack":
					c="rgba(100,122,0,0.75)";
					break;
			}
		}
		return c;
	
	}	
	M_registerPaperColors()
	{	this.M_registerPaper('White'		,"rgba(255,255,255,1)");
		this.M_registerPaper('YellowWhite'	,"rgba(225,226,207,1)");
		this.M_registerPaper('Transparent'	,"rgba(255,255,255,0)");
		this.M_registerPaper('Watercolor'	,"rgba(245,246,243,1)");
		this.M_registerPaper('Black'		,"rgba(0,0,0,1)");
		this.M_registerPaper('Pink'			,"rgba(214,96,134,1)");
		this.M_registerPaper('GreyGreen'	,"rgba(158,182,154,1)");
		this.M_registerPaper('BurntSienna'	,"rgba(33,30,33,1)");
	}
	M_registerPaper(tag,color)
	{
		this.m_paperColors[tag]={color:color};
	}
	M_getPaperColor(nm)
	{	let c=this.m_paperColors[nm??this.m_paperColor]??{color:"rgba(255,255,255,1)"};
		return c.color;
	
	}
	M_getPaperArrayRGBA(nm)
	{	let m,color;
		if( color= this.M_getPaperColor(nm))
		{	if(m=RQColor.sM_rgbaToArray(color) )
				return m;
		}
		return [255,128,128,1];
	}
	M_applyPaperColor()
	{
		if( this.m_paperColor.length)
		{	
			var color = this.M_getPaperColor(); 
			if( color!=undefined)
			{	if( this.svg && this.m_isSvgBackgroundColor)
					this.svg.style.backgroundColor=color;	
			}
		}
	
	
	}
	
	// M_seed
	M_seed(s,i)
	{	let _=this,j,r=ZMT.newRnd
		if(!i)
		{	_.m_seed=s
			
			_.random=r(s);
			for(j=15;j;j--) _.random();
			return _.random;
		}
		return _["random"+i]=r(s);

	}	

   // ---------------------------------------------
   // _rPV
   // loading an type Array variable with min and max  
   // ---------------------------------------------
   M_readMinMaxVar(S,varname,scale,isSign)
   {
	   return this._rPV(S,varname,scale,isSign,false);
   }
   _rPV(S,varname,scale,isSign,noStore) 
   {	
		var val	 = S.gF(varname);
		if(!noStore)
			S["m_"+varname]=val;
	   if( val.min==undefined)
	   {	val = {min:val,max:val,average:val}
	   }
	   if( scale )
	   {	val.min *=scale;
		   val.max *=scale;
	   }
		val.average = 0.5*(val.min+val.max);
	   val.method	= S.M_get(varname+"Method","Random");
	   val.func 	= this.M_getNamedFunction( val.method);
	   val.config 	= { min: val.min, max:val.max
		   , isCustomNoise  : S.gB(varname+"IsCustomNoise",false)
		   , noiseFact : S.gF(varname+"NoiseFactor",{x:1,y:1})
		   , shift : S.gF(varname+"Shift",{x:0,y:0})
		   , sign:isSign
		   , isMapRange: S.gB(varname+"IsMapRange",false)
		   , mapRange: S.gF(varname+"MapRange",{min:0,max:1})
		   , isAnimated  : S.gB(varname+"IsAnimated",false)
		   , centricScale : S.gF(varname+"CentricScale",{x:1,y:1})
		   , texName : S.M_get(varname+"textureName")
	   }; 
		val.config.tex = this.M_getTexture(val.config.texName);		   


		if(val.config.isAnimated)
		{
			val.config.rnd = this.random();
		}

	   // add a show/hide control next to the variable
	   if(_UI) EventManager.M_fire("MinMaxUI",{S:S,n:varname,val:val},this)
		  
	   return val;
   }
	   // ---------------------------------------------
	   // M_getNamedFunction   
	   // ---------------------------------------------
	   M_getNamedFunction(name)
	   {	let _=this
			return ["Noise","Random","Centric","Height","Constant","Texture"].includes(name)?
				 _["M_function"+name] : (name=="GlobalFunction"? _.M_globalFunction : (x,y,o)=>1 )
		   

			/*
			if(name=="Noise")
			{	return this.M_functionNoise;
			}
			else if(name== "Random")
			{
				return this.M_functionRandom;
			}
			 else if(name=="Centric")
			 {	return this.M_functionCentric;	
			 }
			 else if(name=="Constant")
			 {	return this.M_functionConstant;	
			 }
			 else if(name=="Texture")
			 {	return this.M_functionTexture;	
			 }
			else if(name=="GlobalFunction")
			{	return this.M_globalFunction;	
			}
			else if(name== "Height")
			{		
				return this.M_functionHeight;
			}
			else 
				return function(x,y,o){ return 1;}
				*/

	   }
	   M_functionMap(val,min,max)
	   {
		   if(val<min)
			   return 0;
		   if(val>max)
			   return 0;
			
		   let x = 2*(val-0.5*(min+max))/(max-min); // [-1;1]
			return 1+2*Math.pow(abs(x),3)-3*x*x;
		  // return 1-x*x;
	   }
	   M_functionNoise(x,y,o)
	   {
		   let noiseFact = o.isCustomNoise?  o.noiseFact : this.m_noiseFactor??{x:1,y:1};
		   //console.log("FunctionNoise : "+x+","+y+" noiseFact: "+noiseFactX+","+noiseFactY+" o="+RQPrintR(o));
		   if( o.isAnimated)
		   {	let dir = PI*2*(o.rnd+this.m_animated[0].t);
		   		let r = this.m_animated[0].tsin *this.W;
		   		x+= r*cos(dir) ; y+r*sin(dir);
		   }
		   let rnd = 0.5*(1+Noz(x/this.W*noiseFact.x-o.shift.x,y/this.H*noiseFact.y+o.shift.y)); 
		   if( o.isMapRange)
		   {	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max);		
		   }
		   var s=  (o.min + (o.max-o.min)* rnd);
		   
		   if( o.sign )
			   s*=Math.sign(this.random() -0.5);
		   return s;
	   }
	   M_functionCentric(x,y,o)
	   {
			if(o===undefined)
				o={min:0,max:1,isMapRange:false}
			if( o.isAnimated)
			{	let dir = PI*2*(o.rnd+this.m_animated[0].t);
				 let r = this.m_animated[0].tsin *this.W;
				 x+= r*cos(dir) ; y+r*sin(dir);
			}
			var zone = this.mwA; 
			var C = zone.center();
			let scale=o.centricScale;
			var h = Math.hypot( (x-C.x)/(zone.w*0.5*scale.x)+o.shift.x,(y-C.y)/(zone.h*0.5*scale.y)+o.shift.y); 
			h= ZMT.M_clamp(h,0,1);
			var rnd=h*h;
			if( o.isMapRange)
			{	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max);		
			}
			return o.min + (o.max-o.min)*rnd;
	   
	   }
	   M_functionConstant(x,y,o)
	   {
	   	return (o.min + o.max)*0.5;
	   }
	   M_functionTexture(x,y,o)
	   {
			let rnd=0;
			if( o.tex)
			{
				if( !o.texData)
				{
					o.texData =o.tex._X().getImageData(0,0,o.tex.m_width,o.tex.m_height);
				
				}
				if(o.texData)
				{	let j=y*o.tex.m_height/this.H+o.shift.y;
					let i=x*o.tex.m_width/this.W+o.shift.x;
					if(j>=o.tex.m_height)j=o.tex.m_height-1;
					if(i>=o.tex.m_width)i=o.tex.m_width-1;
					if(j<0)j=0;
					if(i<0)i=0;
					rnd = o.texData.data[ o.texData.width*4*(j|0)+4*(i|0) ]/255;
					
	   			}
	   			//let rnd = o.tex.M_getPixelIntensity( Math.floor(x*o.tex.m_width/this.W), Math.floor(y*o.tex.m_height/this.H)  );
				return o.min + (o.max-o.min)*rnd;
					
	   		}
	   		return 0.5*(o.max+o.min);
	   }

	   M_functionRandom(x,y,o)
	   {
		   var rnd= (o.rn??=ZMT.newRnd(1,"functionRandom"))(); 
		   if( o.isAnimated)
		   {	rnd=(rnd+o.rnd*this.m_animated[0].tsin)/(1+o.rnd);
		   }

		   if( o.isMapRange)
		   {	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max);		
		   }
		   var s=  o.min + (o.max-o.min)*rnd;
		   if( o.sign )
			   s*=Math.sign(o.rn() -0.5);
		   return s;
	   }

	   M_functionHeight(x,y,o)
	   {
		   var rnd = ZMT.M_map(y,this.H*(1-o.shift.y),(1-this.m_documentHorizon)*this.H,1, 0.0);
		   if( o.isMapRange)
		   {	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max);		
		   }
		   if(o.rndMultiplier!=undefined)
		   		rnd*=o.rndMultiplier;
		   var s= o.min + (o.max-o.min) * rnd;
		   
		   if( o.sign)
			   s*=(ZMT.random()>0.5? 1:-1);
		   return s;
	   }

	// FUNCTS
	M_registerFuncs()
	{
		
		EventManager.M_fire("RegisterFuncs",{},this);
	
	}
	M_registerFunc(name,F,ctx)
	{	if(name&&F)
		{
			ctx??=this
			this.m_funcs[name]=F.bind(ctx)
		}
	}
	M_getFunc(name)
	{	return this.m_funcs[name]??function(){};
	}
	//  FILL STYLES
	M_initFillStyle(F,v,name)
	{
		F??=this;v??=F;

		let _=this, _fs=_.m_fillStyles[name];
		if(_fs)
		{	F.m_fillStyle=name;
			_fs.init.call(_,F,v)
			F.m_spacing??={min:0,max:0}
		}
		else
		{	console.error(`M_initFillStyle : "${name}" not registered`)
		}
	}

	_rFs()
	{
		this._rF('None',function(F,v){			
			F.hatchFunc=this.M_nullHatchFunc;
		})
		this._rF('PNGFill',function(F,v){			
			F.m_isFill = 1;
			F.m_isFront = v.gB("isFront",0);
			F.hatchFunc=this.M_nullHatchFunc;
		})
		this._rF('PNGFilllTex',function(F,v){			
			F.m_isFill = 1;
			F.m_texName=v.M_get("texName")
			F.hatchFunc=this.M_nullHatchFunc;
		})
		
		this._rF(['HatchShape2','HatchShape'],function(H,v){			
			let _=this,u=_.u,hf
			H.m_perturbation = _._rPV(v,"perturbation",1,0);			
			H.m_spacing= H.m_lineSpacing = _._rPV(v,"lineSpacing",u,0);
			if(_UI) _.M_showMm(H.m_lineSpacing,"lineSpacing",v,["min","max","average"])
			H.protect = (v.gF("protect")??0)*u
			H.jointEnds = v.gB("jointEnds",1);
			H.orientation = v.gF("orientation",0);


			switch(v.M_get('hatchFunc'))
			{	case 'Line':
					break;	
				case 'SineFreq':
					H.m_amplitude	= v.gF("amplitude",0.5); H.m_amplitude*=u; 		
					H.m_wavelength	= v.gF("wavelength",{min:4,max:20}); H.m_wavelength.min*=u; H.m_wavelength.max*=u;
					H.obbMargin		= H.m_amplitude+_.m_strokeWidth; 
					hf= _.M_hatchFuncSine;
					break;
				case 'Leaf':
					hf= _.M_hatchFuncLeaf;
					break;
				case 'TreeBranch':
					H.m_amplitude	= v.gF("amplitude",0.5); H.m_amplitude*=u	
					H.m_barkNoiseFactor = v.gF("barkNoiseFactor",{x:120, y:28})
					H.m_torsion= v.gF("barkTorsion",30)
					H.inStencilLineCut = v.gB("inStencilLineCut",1)
					H.lightingAmplitude = v.gB("lightingAmplitude",0)
					H.expand = 0.2*u;	// TEMP TEST
					H.distrFunc = _.M_distFuncTreeBranch;		
					hf=_.M_hatchFuncTreeBranch;
					break;
			}
			H.hatchFunc=hf
		})

		this._rF('HatchFlowField',function(F,v){			

			let _=this,u=_.u,w
			F.m_maxStep = _._rPV(v,"maxStep",u,0);					
			F.m_wavelength=w=v.gF("wavelength",{min:8,max:40}); w.min*=u; w.max*=u; w.average = (w.min+w.max)*0.5;
			F.m_contribution= v.gF("contribution",{damping:0.5,perturbation:0.5});
			F.m_lineSpacing = v.gF("lineSpacing",{min:0.3,max:1.5});	for(let m in F.m_lineSpacing) F.m_lineSpacing[m]*=u;
			F.m_stopCollide = v.gB("stopCollide",0);
			F.m_perturbationSample = v.gB("perturbationSample",0);
			F.m_perturbation = _._rPV(v,"perturbation",1,0);
			F.m_maskStrokeWidth = v.gF("maskStrokeWidth",0); F.m_maskStrokeWidth*=u;

			F.hatchFunc=_.M_hatchFuncFlowField;

		})
		this._rF('HatchCirclePacking',function(H,v){			

			let _=this,u=this.u
			H.m_size = _._rPV(v,"size",u,0);
			H.jointEnds = 0;
			H.m_angle = _._rPV(v,"angle",1,0);
			H.m_maskStrokeWidth = v.gF("maskStrokeWidth",0); H.m_maskStrokeWidth*=u;
			H.m_modulation = v.gF("modulation",{amplitude:0.3,noiseFact:1});
			H.m_maskFill = v.gB("maskFill",0);
			H.m_density = _._rPV(v,"density",1.,0);
			H.m_isDistort = v.gB("distort",0);
	
			switch(H.m_shape = v.M_get("shape","circle"))
			{	case "circle":
				default:
					H.m_shapeFunc = _.M_radialFuncCircle;
					break;
				case "square":					
					H.m_shapeFunc = _.M_radialFuncSquare;
					break;
				case "leaf":					
					H.m_shapeFunc = _.M_radialFuncLeaf;
					break;
			}
			H.postProcessing = _.M_hatchPostProcessDrawLinesInMask;
			H.m_numberMax=10;
			H.distrFunc=function(OBB,x,H){
				if(x==0) {
					H.density= H.m_density.max? H.m_density.func.apply(this,[OBB.o.x,OBB.o.y,H.m_density.config] ) : 1; 
					H.m_numberMax=H.density*OBB.w*OBB.h/H.m_size.min/H.m_size.max;
				}
				return x<H.m_numberMax? { x:x+1, L:H.hatchFunc.apply(this, [OBB,x,H] )} :null
			}.bind(_);
		

			let texName =v.M_get("textureName","Mask"); 
			H.m_tex = _.M_getTexture(texName);
			//_.M_fillTextureSelect( $(`select[name=${v.M_getVarName("textureName")}]`),texName);
			if(_UI) _.M_fillTextureSelect(v.M_getElt("textureName"),texName)
			H.hatchFunc=_.M_hatchFuncCirclePacking;
		})
		this._rF("HatchCloudLines",function(H,v){
			let _=this,u=_.u
			H.m_spacing= H.m_lineSpacing = _._rPV(v,"lineSpacing",u,0);
			H.m_maskStrokeWidth = v.gF("maskStrokeWidth",0); H.m_maskStrokeWidth*=u;
			H.m_modulation = v.gF("modulation",{amplitude:0.3,noiseFact:1}); H.m_modulation.amplitude*=u;
			H.m_perturbation = _._rPV(v,"perturbation",1,0);			
			H.m_groundCut = v.gF("groundCut",0);H.m_groundCut*=u
			H.m_wavelength	= v.gF("wavelength",{min:4,max:20}); ['min','max'].map(k=>H.m_wavelength[k]*=u)
			H.m_maskFill = v.gB("maskFill",0);
			H.m_step = ((v.gF('step',0.5))??0.5)*u
			H.hatchFunc=_.M_hatchFuncCloudLines;					

		})

		EventManager.M_fire("RegisterFillStyles",{},this);

	}
	_rF(name,fInit)
	{	let a=isArr(name)?name:[name]
		a.map(n=>this.m_fillStyles[n]={init:fInit})		
	}

	_gH()
	{
	 	return Object.keys(this.m_fillStyles)
	
	}
	M_getLineGroups()
	{	return this.m_lineGroups
	}

	M_hatchPostProcessDrawLinesInMask(Ls,OBB,H)
	{
		if( (H.m_maskFill || H.m_maskStrokeWidth>0) && isArr(Ls) )
		{
			let tex=H.m_tex??this.m_mask,context=tex._X();
			context.strokeStyle = "white";
			context.fillStyle="white";

			for( let i=0; i<Ls.length; i++)
			{	let p = new Path2D(Ls[i]._gS(false));
				if(H.m_maskStrokeWidth>0)
					context.stroke(p);
				if(H.m_maskFill && Ls[i].mP)
					this._dM(Ls[i]);
			}


			/*
			context.lineWidth = H.m_maskStrokeWidth;
			for( let i=0; i<Ls.length; i++)
			{	let p = new Path2D(Ls[i]._gS(false));
				if(H.m_maskStrokeWidth>0)
					context.stroke(p);
				if( H.m_maskFill && Ls[i].mP)
				{	
					let G = ZMT.M_getPointsBarycenter(Ls[i].mP);
					let grad = context.createRadialGradient( G.g.x, G.g.y, 10, G.g.x,G.g.y,G.size/2 );

					grad.addColorStop(0, "white" );
					grad.addColorStop(1, "black" );

					context.fillStyle = grad;


					context.fill(p);
				}
			}*/
		
		}	
	}
	M_hatchFuncCirclePacking(OBB,x,opts )
	{
		if(OBB.done)
			return null;
		var Ls=[];
		var L = new ZPL();
		Ls.push(L); // TEMP
		if(OBB.cList===undefined)
			OBB.cList=[];
		let CList = OBB.cList;
		let isFree = false;
		let radiusMin = 0.5;
		let C;
		let nbAttempts=0;
		let modFact=opts.m_modulation.noiseFact;
		let scale=new ZV2(1,1);
		let isProj=opts.m_isDistort;
		if( opts.normal)
		{
			let Y =new ZV3(0,1,0);
			let X = this.m_toEyeVector.M_cross(Y);
			X.Nz();
			Y = X.M_cross(this.m_toEyeVector);
			Y.Nz();
			let N = opts.normal.Nzd();
			//let cross = opts.normal.M_cross(this.m_toEyeVector);
			scale.x = 1-0.8*abs( N.M_dot(X));
			scale.y = 1-0.8*abs( N.M_dot(Y));
		}
		while(!isFree)
		{
			nbAttempts++;
			if( nbAttempts>=100)
				break;
			let coord =  { x: (this.random()-0.5)*OBB.w, y:(this.random()-0.5)*OBB.h}
			let center = new ZV2(OBB.o.x+ coord.x*OBB.I.x + coord.y*OBB.J.x, OBB.o.y+ coord.x*OBB.I.y + coord.y*OBB.J.y );		
			let radius =  0.5* opts.m_size.func.apply(this,[center.x,center.y,opts.m_size.config] );
			let orientation =  opts.m_angle.func.apply(this,[center.x,center.y,opts.m_angle.config] );
			C = {p:center, r:radius,co:cos(orientation*D2R), si:sin(orientation*D2R)}
			isFree = true;
			for(let i=0; i<CList.length; i++)
			{	let C2 = CList[i];
				let d = C.p.M_dist( C2.p); 
				if( d<(C2.r+radiusMin) )
				{	isFree=false;
					break;
				}
			}
			if( isFree)
			{	// find the minimum radius
				for(let i=0; i<CList.length; i++)
				{	let C2 = CList[i];
					let u = C2.p.M_minus(C.p);
					let dist=u.M_length();
					// find angle of C2, then deduc shape at that point
					
					let a 	= Math.atan2(-u.x*C.si + u.y*C.co  , u.x*C.co +u.y*C.si );		// rotation of -orientation
					let a2 	= Math.atan2( u.x*C2.si- u.y*C2.co ,-u.x*C2.co-u.y*C2.si );		// rotation of -orientation2 with -u
					let A 	= opts.m_shapeFunc.apply(this,[a]);
					let A2 	= opts.m_shapeFunc.apply(this,[a2]);
					let V	= new ZV2(  C.co*A.x - C.si*A.y ,  C.si*A.x + C.co*A.y);
					let V2	= new ZV2( C2.co*A2.x-C2.si*A2.y, C2.si*A2.x+C2.co*A2.y);
					
					V.M_mul(scale);
					V2.M_mul(scale);
					let modAmp=opts.m_modulation.amplitude*C.r;
					let modAmp2=opts.m_modulation.amplitude*C2.r;
					

					let rnd = 0.5*(1+Noz(C.p.x+V.x*modFact,C.p.y+V.y*modFact)); 				
					let rnd2 = 0.5*(1+Noz(C2.p.x+V2.x*modFact,C2.p.y+V2.y*modFact)); 				

					let r = C.r-modAmp*rnd;					
					let r2 = C2.r-modAmp2*rnd2;					

					let p = new ZV2(C.p.x + r*V.x, C.p.y+r*V.y );
					let p2 = new ZV2(C2.p.x + r2*V2.x, C2.p.y+r2*V2.y );
					//r=p.M_dist(C.p);
					//r2=p2.M_dist(C2.p);



					 
					let d = dist-r-r2; 
					if( d<0)
					{
						r= dist-r2;
						
						C.r = r/Math.hypot(V.x,V.y)/(1-opts.m_modulation.amplitude*rnd); 
						if( false )	// TEMP
						{
							let L2 = new ZPL();
							L2._aP(p2.M_plus(0,-10) );
							L2._aP(p2.M_plus(0,10) );
							Ls.push(L2);
							L2 = new ZPL();
							L2._aP(p2.M_plus(-10,0) );
							L2._aP(p2.M_plus(10,0) );
							Ls.push(L2);
							L2 = new ZPL();
							L2._aP(C2.p );
							L2._aP(C.p );
							Ls.push(L2);
						}
					
					}
					/*let d = C.p.M_dist( C2.p); 
					if( (d-C2.r)<C.r)
						C.r = d-C2.r;*/					
				}		
			}
			
		}
		if( isFree)
		{	
			CList.push(C);		
			let nbPoints = 100;
			let aStep = PI*2/nbPoints;
			let a=0; 
			let modAmp=opts.m_modulation.amplitude*C.r;
			let V;
			for( let i=0; i<nbPoints; i++)
			{	
				let r = C.r;
				let A=opts.m_shapeFunc.apply(this,[a]);
				let V = new ZV2( C.co*A.x-C.si*A.y, C.si*A.x+C.co*A.y);
				V.M_mul(scale);

				if(modAmp!=0)
				{
					let rnd = 0.5*(1+Noz(C.p.x+V.x*modFact,C.p.y+V.y*modFact)); 				
					r-= modAmp*rnd;
				}
				if(isProj)
					L._aP(this.Pj(new ZV3(r*V.x,r*V.y,0 ),C.p));
				else 
					L._aP(new ZV2(C.p.x + r*V.x, C.p.y+r*V.y ));
				a+=aStep;
			}
			L.M_closePath();	
			//return L;
			return Ls; // temp
		}
		else
		{	OBB.done = true;
			return null;
		}
	}	
	M_radialFuncCircle(a)
	{
		return {x:cos(a),y:sin(a)}
	}
	M_radialFuncSquare(a)
	{	const sq = Math.sqrt(2)/2;
		let x=cos(a); let y=sin(a);
		if( abs(x)>abs(y))
			return {x:sq*Math.sign(x),y:y}
		else
			return {x:x,y:sq*Math.sign(y)}
	}
	M_radialFuncLeaf(a)
	{
		let y=0.5*(1+sin(a));
		let x= sin(Math.pow(y,1.4)*PI);
		// wave 
		let oakSpikes = 12;
		x-= Math.pow( (1+sin(y*PI*oakSpikes))*0.5,1.9)*x*0.5;
		return {x:Math.sign(cos(a))*x*0.65,y:y*2-1};	

	
	}
	
	M_hatchFuncSine(OBB, x ,opts)
	{
		var L = new ZPL();
		let P1 = new ZV2( OBB.o.x+x*OBB.I.x-OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y-OBB.h*0.5*OBB.J.y);
		let P2 = new ZV2( OBB.o.x+x*OBB.I.x+OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y+OBB.h*0.5*OBB.J.y);
		//return new ZL(P1,P2);
		let dist = OBB.h;

		let prevAngle = 0,angle=prevAngle,
		periodLength = opts.m_wavelength.max,
		angleFact = (2*PI)/periodLength,
		step = 0.5*this.u,
		nbPointsPerWavelength = 30;
		for( let x=0; x<dist; x+=step)
		{
			let P = new ZV2( P1.x+OBB.J.x*x , P1.y+OBB.J.y*x );
			let rnd;
			let decal;
			if( opts.m_perturbation)
				rnd = opts.m_perturbation.func.apply(this,[P.x,P.y,opts.m_perturbation.config] )
			else 
				rnd = 0.5*(1+Noz(P.x/this.W*this.m_noiseFactor.x,P.y/this.H*this.m_noiseFactor.y)); 

			decal = opts.m_amplitude * sin(x*angleFact*(1+rnd));
			P.M_add(OBB.I.x*decal,OBB.I.y*decal); 
			L._aP(P);

			// next 
			periodLength = ZMT.M_map(rnd,0,1,opts.m_wavelength.max,opts.m_wavelength.min);		// TEMP, modulation freq	  	
			step = periodLength / nbPointsPerWavelength;
			angle+= (2*PI)/nbPointsPerWavelength;


		}
		return L;
		
	}
	M_hatchFuncCloudLines(OBB, x ,opts)
	{
		let isDrawInMask = opts.m_maskStrokeWidth>0 || opts.m_maskFill;
		if( isDrawInMask && OBB.prevLines )
		{
			this.M_drawInPixels(OBB,OBB.prevLines,opts.m_maskStrokeWidth,opts.m_maskFill,opts.m_maskFill);
			
			// draw in the OBB 
			/*var context = this.m_stencil._X();			
			context.strokeStyle = "white";
			context.fillStyle="white";
			let p = new Path2D(OBB.prevLines[0]._gS(true));
			context.fill(p);*/
			
			OBB.prevLines = null;
		}



		var L = new ZPL();
		let P1 = new ZV2( OBB.o.x+x*OBB.I.x-OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y-OBB.h*0.5*OBB.J.y);
		let P2 = new ZV2( OBB.o.x+x*OBB.I.x+OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y+OBB.h*0.5*OBB.J.y);
		//return new ZL(P1,P2);
		let dist = OBB.h;

		let prevAngle = 0;
		let periodLength = opts.m_wavelength.max;
		let step = opts.m_step;
		let angle = prevAngle;
		let nbPointsPerWavelength = 60;
		let angleNoise = 0;
		let ampl  =opts.m_modulation.amplitude;
		for( let x=0; x<dist; x+=step)
		{
			let P = new ZV2( P1.x+OBB.J.x*x , P1.y+OBB.J.y*x );
			let rnd;
			let decalY,decalX;
			rnd = opts.m_perturbation.func.apply(this,[P.x,P.y,opts.m_perturbation.config] )

			
			let noiz=Noz(cos(angleNoise)*opts.m_modulation.noiseFact,sin(angleNoise)*opts.m_modulation.noiseFact);
			decalX = 0;//opts.m_modulation.amplitude * 0*0.5*sin(0.8*noiz);
			decalY = ampl*Math.pow(Math.max((noiz-opts.m_groundCut/ampl)/(1-opts.m_groundCut/ampl),0),0.4);
			decalY += 0.1*opts.m_modulation.amplitude *sin(PI*noiz*5)
			P.M_add(OBB.I.x*decalY,OBB.I.y*decalY); 
			P.M_add(OBB.J.x*decalX,OBB.J.y*decalX); 
			
			
			L._aP(P);

			// next 
			periodLength = ZMT.M_map(rnd,0,1,opts.m_wavelength.max,opts.m_wavelength.min);		// TEMP, modulation freq	  	
			step = periodLength / nbPointsPerWavelength;
			angle+= (2*PI)/nbPointsPerWavelength;
			angleNoise+=0.01;


		}
		if(isDrawInMask)
		{	let decalY = -(ampl*1.5-opts.m_groundCut) // opts.m_groundCut;
			P1.M_add(OBB.I.x*decalY,OBB.I.y*decalY); 
			P2.M_add(OBB.I.x*decalY,OBB.I.y*decalY); 
			let Lshape = L.clone();
			/*for( let i=0; i<Lshape.M_nb(); i++)
			{	Lshape.M_getPoint(i).M_add(OBB.I.x*opts.m_maskStrokeWidth,OBB.I.y*opts.m_maskStrokeWidth);

			}*/
			Lshape._aP(P2);
			Lshape._aP(P1);
			OBB.prevLines = [Lshape];
		
		}

		return L;
		
	}
   M_hatchFuncLeaf(OBB,x,opts)
   {
		let OL = opts.leaves;
		if(!OL) return;	
		let profile		= OL.profile;
		let invProfile	= OL.invProfile;
		let decalX = OBB.o.M_minus(OL.C).M_dot(OBB.I)-OBB.w/2; 
 	    let yNorm = (x-decalX)/OBB.w+0.5;
 	    if( yNorm<0) 
 	    	return null; 
		let XT = invProfile.apply(this,[yNorm,OL]);
		
		let leafLen = OL.length;
		let leafW = OL.width * 1.5;
		let bendAlpha = OL.bend*D2R;
	   	let bendR  = abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 0;

		let dz = (1-cos( yNorm*bendAlpha))*bendR; 
		let y = bendR*sin(yNorm*bendAlpha);

		//let segLen = 0.5*this.u;
		let segLen = this.printMm(0.5);// 0.5*this.u;
		let nbSeg = Math.max(Math.ceil(leafW/segLen),1);
		segLen = leafW/nbSeg;
		
		let PLocal = new ZV3();
		let PWorld;
		var L = new ZPL();
		for( let i=0; i<=nbSeg; i++)
		{
			PLocal.M_set( XT.x*2*(i-nbSeg/2)*segLen, y,dz)
			let dec = cos( (i/nbSeg-0.5)*PI*0.9 );
			PLocal.y+= (0.5-Math.pow(dec,5))*opts.spacing*5*sin( PI*yNorm);
			PWorld = OL.MV._mBV(PLocal);
			let Pproj = new ZV2(PWorld.x + OL.C.x,-PWorld.y + PWorld.z*this.m_perspectiveFactor+OL.C.y);				
			L._aP(Pproj);

		}
		return L;
	}
	M_hatchFuncFlowField(OBB, x ,opts)
	{
		let isDrawInMask = opts.m_maskStrokeWidth>0;
		if( isDrawInMask && OBB.prevLines )
		{
			this.M_drawInPixels(OBB,OBB.prevLines,opts.m_maskStrokeWidth);
			OBB.prevLines = null;
		}
		OBB.rnd??=ZMT.newRnd(1);
		var Ls=[];
		var L =null;
		x=-0.1*OBB.h+x*1.2;
		let P1 = new ZV2( OBB.o.x+x*OBB.I.x-OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y-OBB.h*0.5*OBB.J.y);
		let P2 = new ZV2( OBB.o.x+x*OBB.I.x+OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y+OBB.h*0.5*OBB.J.y);
		let P;
		let k = 20;
		let dist = 0;
		let step = 0.5*this.u;

		let speed=OBB.J.clone();
		let strokeDist;
		let strokeLen;
		let Jdist = 0;
		let allJdist = 0;
			if( opts.m_maxStep.func)
			{	opts.m_maxStep.config.rndMultiplier = OBB.rnd();
				allJdist -= opts.m_maxStep.func.apply(this,[P1.x,P1.y,opts.m_maxStep.config] );
			}
			else
			{
				allJdist-=OBB.rnd()*opts.m_maxStep.max;
			}

		let done = false;
		P = P1.clone();
		let isSampleSlope = opts.m_perturbationSample?true:false;
		let angle0 = opts.orientation;
		while(!done)
		{
			if( L==null)
			{
				L=new ZPL();
				//allJdist+=Jdist;
				P1 = new ZV2( OBB.o.x+x*OBB.I.x+(-OBB.h*0.5+allJdist)*OBB.J.x,  OBB.o.y+x*OBB.I.y+(-OBB.h*0.5+allJdist)*OBB.J.y);
				P=P1.clone();
				strokeDist = 0;
				speed = new ZV2(0,0);
				if(opts.m_wavelength)
				{ 	if(opts.m_wavelength.func)
						strokeLen = opts.m_wavelength.func.apply(this,[P.x,P.y,opts.m_wavelength.config] );
					else 
						strokeLen = opts.m_wavelength.average;
				}
				else 
					strokeLen = 40;
				
				let maxStep;
				if( opts.m_maxStep.func)
				{	opts.m_maxStep.config.rndMultiplier = OBB.rnd();
					maxStep = opts.m_maxStep.func.apply(this,[P.x,P.y,opts.m_maxStep.config] );
				}
				else
					maxStep = Math.max( (opts.m_maxStep.min<=1)? strokeLen*opts.m_maxStep.min :  Math.min(opts.m_maxStep.min, strokeLen),1*this.u); 
				allJdist+=maxStep;
			}
			
			L._aP(P.clone());
			let rnd00,rnd01,rnd11,rnd10,slope;
			if(this.m_hatchTexture)
			{	let context = this.m_hatchTexture._X();  
				if(isSampleSlope)
				{
					let id =context.getImageData(P.x-k, P.y-k, 1, 1);
					rnd00 = (id.data[0]/255-0.5)*2;
					
					id =context.getImageData(P.x+k, P.y-k, 1, 1);
					rnd10 = (id.data[0]/255-0.5)*2;
					id =context.getImageData(P.x+k, P.y+k, 1, 1);
					rnd11 = (id.data[0]/255-0.5)*2;
					id =context.getImageData(P.x-k, P.y+k, 1, 1);
					rnd01 = (id.data[0]/255-0.5)*2;
				}
				else
				{	let id =context.getImageData(P.x, P.y, 1, 1);
					rnd00 = (id.data[0]/255-0.5)*2;
				}	
			}
			else 
			{	
				if( opts.m_perturbation)
				{	if(isSampleSlope)
					{
						rnd00 = opts.m_perturbation.func.apply(this,[P.x-k,P.y-k,opts.m_perturbation.config] )
						rnd10 = opts.m_perturbation.func.apply(this,[P.x+k,P.y-k,opts.m_perturbation.config] )
						rnd11 = opts.m_perturbation.func.apply(this,[P.x+k,P.y+k,opts.m_perturbation.config] )
						rnd01 = opts.m_perturbation.func.apply(this,[P.x-k,P.y+k,opts.m_perturbation.config] )
					}
					else
						rnd00 = opts.m_perturbation.func.apply(this,[P.x,P.y,opts.m_perturbation.config] )
						
				}
				else 
				{	
					if( isSampleSlope)			
					{	rnd00 = Noz((P.x-k)/this.W*this.m_noiseFactor.x,(P.y-k)/this.H*this.m_noiseFactor.y); 
						rnd10 = Noz((P.x+k)/this.W*this.m_noiseFactor.x,(P.y-k)/this.H*this.m_noiseFactor.y); 
						rnd11 = Noz((P.x+k)/this.W*this.m_noiseFactor.x,(P.y+k)/this.H*this.m_noiseFactor.y); 
						rnd01 = Noz((P.x-k)/this.W*this.m_noiseFactor.x,(P.y+k)/this.H*this.m_noiseFactor.y); 
					}
					else
						rnd00 = Noz(P.x/this.W*this.m_noiseFactor.x,P.y/this.H*this.m_noiseFactor.y); 
						
				}
			}
			if(isSampleSlope)
			{	slope = new ZV2(rnd10-rnd11,rnd01-rnd11);
				slope.M_mul(opts.m_contribution.perturbation);
			}
			else 
			{	let ang = angle0 + rnd00*PI*opts.m_contribution.perturbation; 
				slope = new ZV2(cos(ang),sin(ang));
			}
			speed = OBB.J._mB(opts.m_contribution.damping);
			speed.M_add(slope);
			speed.Nz();
			P.M_add(speed.x*step,speed.y*step);
			dist+=step;
			strokeDist +=step;
			//
			if(  strokeDist===undefined || isNaN(strokeDist) || strokeDist<=0 )
				return Ls;
			let AP = P.M_minus(P1);
			Jdist = AP.M_dot(OBB.J);
			if( Jdist>=strokeLen || strokeDist>=2*strokeLen)
			{	L._aP(P.clone() );
				if(opts.m_stopCollide)
				{
					OBB.clipOpts.stopCollide =true;
					let Ls2 = this.M_computeLineMask(L,OBB.clipOpts);
					OBB.clipOpts.stopCollide =false;
					if( Ls2.length>0)
						Ls.push(...Ls2);
				
				}
				else 
					Ls.push(L);
				L = null;
				if( allJdist>=OBB.h*1.2)
				{	done=true;
					if(isDrawInMask)
					{	OBB.prevLines = Ls;
					
					}
				
				}
			}

		}

		
		return Ls;

	}	
	M_copyContextToClipOptsData( context,clipOpts )
	{
		if( context && clipOpts )
		{
			let d=clipOpts.data;
			let data = context.getImageData(d.x, d.y,d.id.width,d.id.height);
			if( data )
			{	clipOpts.data.id = data;
				//
			}
		}
	
	
	}
	M_drawInPixels(OBB, PL,strokeWidth,useSvgDrawing,isFill)
	{	
			var Copt;
			if( (Copt=OBB.clipOpts) && Copt.data)
			{
				if( useSvgDrawing)
				{
					let d = Copt.data;
					var context = this.m_stencil._X();			
					if(isFill)
						context.fillStyle = "white";
					if( strokeWidth>=1)
					{	context.strokeStyle = "white";
						context.lineWidth = strokeWidth;
					}
					for( let i=0; i<PL.length; i++)
					{	
						if( isFill)
							context.fill( new Path2D(PL[i]._gS(true) ));
						if( strokeWidth>0)
							context.stroke( new Path2D(PL[i]._gS(false) ));
					}
					// get back the stencil data
					this.M_copyContextToClipOptsData(context,Copt);
					
				}
				else
				{
					let kernelSize = strokeWidth-1;
					let kernelStart = -kernelSize/2;	


					let x0= Copt.data.x;
					let y0 = Copt.data.y;
					let w0 = Copt.data.id.width;
					let h0 = Copt.data.id.height;
					Copt.data.changed = true;
					let rowBytes = w0*4;
					let data = Copt.data.id.data; 
					for( let iL=0; iL<PL.length; iL++)
					{	let L = PL[iL];
						if( L && L.mP)
						for( let ip=0; ip<(L.mP.length-1); ip++)
						{	let P0 = L.mP[ip].clone(); 
							let I = L.mP[ip+1].clone().M_minus( P0);
							let dist= I.M_length();
							if( dist>=1)
							{	I.M_mul(1/dist);
								let J = new ZV2(-I.y,I.x); //new ZV2( -I.y,I.x); 
								for(let i=0;i<dist;i++)
								{	let P = new ZV2( P0.x+kernelStart*J.x,P0.y+kernelStart*J.y);
									for(let k=0; k<=kernelSize; k++)
									{	let x=Math.round(P.x-x0);
										let y=Math.round(P.y-y0);
										if( x>=0 && x<w0 && y>=0 && y<h0)
										{ 
											let ind = x*4+ y*rowBytes;
											data[ind]=data[ind+1]=data[ind+2]=255;
										}
										P.M_add(J.x,J.y);
									}
									P0.M_add(I);													
								}
							}
						}
					}
				}
			}	
	
	}



	// --------------------------------------------------
	// M_makeObjectSVG
	// --------------------------------------------------
	M_makeObjectSVG(id,W,H)
	{
		var cdata= ""; //<zancanpatterns:namedview >\n//<![CDATA[\n"+JSON.stringify(this._V)+"\n//]]></zancanpatterns>\n";
		let sz=this.M_svgSize();
		let svg= NewEltNs("svg",{
			style:`fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;`,
			xmlns:"http://www.w3.org/2000/svg",
			"xmlns:inkscape":"http://www.inkscape.org/namespaces/inkscape",
			zancanpatterns:"http:www.zancan.fr/zancanpatterns.dtd",
			version:"1.1",
			"xmlns:xlink":"http://www.w3.org/1999/xlink",
			"xml:space":"preserve",
			"xmlns:serif":"http://www.serif.com/",			
			width:`${sz.w}mm`,
			height:`${sz.h}mm`,
			viewBox:`0 0 ${W} ${H}`,
			id:`${id}`
		});

		return svg;

	}
	M_getTagSVG(svg)
	{
		var svgElt = NewElt("div");
		svgElt.appendChild(svg);
		return svgElt.innerHtml;
	}	
	// --------------------------------------------------
	// SVG Groups
	// --------------------------------------------------

	M_makeDefaultSvgGroup(name,style)
	{ 	
		this.m_defaultSvgGroup = NewEltNs("g",{name:name, style:style, "inkscape:groupmode":"layer", "inkscape:label":name,"fill":"none"}); 
		var grp = this._Sv(this.m_name,name,true,style,true);
		
		return this.m_defaultSvgGroup;
	}
	


	// 
	M_findGroupDeclaration(bundleName, tagName)
	{
		let D=A._gDeclared;
		for( let i=0; i<D.length; i++)
		{	let Gr = D[i];
			if( Gr.bundle==bundleName && Gr.name==tagName)
				return Gr;
		
		}	
		return null;		
	}

	M_newSvgGroup(name,o,prnt)
	{	o??={}
		let q={...o}
		q["inkscape:groupmode"]="layer";
		q.fill??="none"
		if((prnt||_und(prnt))&&!q.insertTo) q.appendTo=prnt??A.svg
		if(name)q.name=q["inkscape:label"]=name
		return  NewEltNs("g",q);

	}
	// Declare svg group
	// the defaultSvgGroup must have been created first	
	_Sv(bundleName,tagName,isInstanciate,style,isDefault)
	{
		if( tagName )
		{

			//
			var Gr=A.M_findGroupDeclaration(bundleName,tagName);
			if( Gr==null)
			{
				Gr 		= {	bundle		:bundleName,
							name		:tagName,
							id			:tagName,
							isSet		:0,
							strokeWidth	:this.m_strokeWidth,
							strokeColor : this.m_strokeColor,
							style		:this.M_getStyleAsString(this), 
							m_lines		:A.m_lines,
							instances	:0,
							isInstance	:false,
							m_svgGroup	:A.m_defaultSvgGroup,
							nbLines		:0 
						}
				if( isDefault)
					Gr.isDefault = true;
				A._gDeclared.push(Gr);
			} 	
			let hasObjStyle=false;
			if( style!=undefined && style!=null)
			{	

				if(typeof style==='string')
					Gr.style = style;
				else if(typeof style==='object')
				{
					Gr.style=this.M_getStyleAsString(style);
					hasObjStyle = true;
				}
			}
			// instance
			// create a named instance in this._g
			if(isInstanciate)
			{
				if( this._g[tagName]==undefined)
				{
					let gr = this._g[tagName] = A.M_getGroupInstance(Gr);	
					if( isDefault)
						gr.m_active = true;
					else if( this.m_isMakeSvgGroups )
					{	gr.m_active = true;
						gr.m_lines=[];
						let name;
						if( gr.id.length>=1) name=gr.bundle+"/"+gr.id;
						else name = gr.bundle+" "+gr.name+gr.instances;
						gr.m_svgGroup=this.M_newSvgGroup(name,{style:gr.style})
						/*let gElt = NewEltNs("g",{name:name,style:gr.style,"inkscape:groupmode":"layer","inkscape:label":name});
						A.svg.appendChild(gElt);
						gr.m_svgGroup = gElt;*/

						if(hasObjStyle)
						{
								if( style.m_paletteTag ) gr.m_paletteTag=style.m_paletteTag;
								if( style.m_strokeColor ) gr.m_strokeColor=style.m_strokeColor;
								if( style.m_strokeWidth ) gr.m_strokeWidth=style.m_strokeWidth;
						}

					}

				}
			}
			return Gr;
		}
		return null;
	}
	// create an instance of a declared group
	M_getGroupInstance(Gr)
	{	let gr=null;
		if(Gr)
		{ 	Gr.instances++;
		
			// create a copy
			gr = {...Gr};
			gr.M_applyScale=function(s,force){if(force||this.m_isStrokeScale) this.strokeScale=s;}
			gr.isInstance=1;
			gr.isSet=0;

			// save the instance in a global array
			A._gInstances.push(gr);

		   
		}
		return gr;
	}
	
	
	
	// M_getSvgGroups - will create a new instance of the group each time the function is called. Beware
	//M_getSvgGroups(bundleName,isActivate)
	M_makeBundleInstances(S,bundleName)
	{	let log=false;
		let D=A._gDeclared;
		if(log)console.group("M_makeBundleInstances "+bundleName+" declared:"+D.length);
		for( let i=0; i<D.length; i++)
		{	let Gr = D[i];
			//console.log(" ["+i+"] "+Gr.bundle+"/"+Gr.name);
			if( Gr.bundle==bundleName)
			{	if(log)console.log(" + Found group "+Gr.bundle+"/"+Gr.name);
				if( S._g==undefined)
					S._g={};
				if( S._g[Gr.name]==undefined)
				{
					if(log)console.log(" + Adding S._g["+Gr.name+"]");
					let gp = S._g[Gr.name] = A.M_getGroupInstance(Gr);	

										
					if(gp && this.m_isMakeSvgGroups)
					{
						gp.m_active = true;
						gp.m_lines = [];

						let name = gp.id.length>=1 ? `${gp.bundle}/${gp.id}` : `${gp.bundle}/${gp.name}${gp.instances}`;

						gp.m_svgGroup=this.M_newSvgGroup(name,{style:gp.style})

						//A.svg.appendChild( gp.m_svgGroup=NewEltNs("g", {name:name,style:gp.style,"inkscape:groupmode":"layer","inkscape:label":name}));

					}


				}

			}
		}
		if(log)console.groupEnd();
	
	}

	M_isGroupBundle(bundleName)
	{
		let D=A._gDeclared,i;
		for(i=0; i<D.length; i++)
			if( D[i]?.bundle==bundleName)
				return 1;
		return 0;	
	}
	_Svs()		
	{
		this.V_Svs();
		EventManager.M_fire("DeclareGroups",{},this);
	
	}
	V_Svs() // virtual
	{
	
	}

	M_applyDistortionsToSelect(s,d){}
	pushDeform(is,fn)
	{
		this.m_deformStack.push({is:this.m_deformersActive,fn:this.m_deformer})
		this.m_deformersActive=is??false;
		this.m_deformer=fn??this.m_deformer;

	}
	popDeform()
	{	let d=this.m_deformStack.pop();
		if(d)
			this.m_deformersActive=d.is,this.m_deformer=d.fn
	}
	
	// M_applySvgGroupsToSelect
	// finds all the SVG group selector inputs and add the various groups available to them
	// ------------------------
	M_applyGroupToSelect(){}
	M_applySvgGroupsToSelect(inSelect){}

   //  _rS
   _rS(S, vars)
   {	let log=0
		,groupName = vars.M_get("SvgObject")
		,name,opt
		if(log)console.group("_rS - "+groupName);
		
		// find the corresponding SELECT 
		if(_UI) this.M_applyGroupToSelect(vars,'SvgObject');
		
		if(  typeof A._g==="object" && groupName.length) 
		{   let gr = S._g[groupName]; 
			if(gr!=undefined)
			{
				if(this.m_isMakeSvgGroups)
				{	
					gr.m_active=1;
					gr.isSet = 1;
					gr.m_lines = [];
					this.M_getStyle(gr,vars);
					
					gr.id=vars.M_get("SvgGroupId");
					if( gr.id.length>=1) name=gr.bundle+"/"+gr.id;
					else name = gr.bundle+" "+gr.name+gr.instances;
					//TOTO
					
					opt={style:this.M_getStyleAsString(gr),"stroke-width":gr.m_strokeWidth.toPrecision(3)}
					this.M_makeSVGColor(opt,gr)
					gr.m_svgGroup=this.M_newSvgGroup(name,opt)

				}
			} 

		}
	   if(log)console.groupEnd();
	}
	
	M_registerAddons()
	{
		EventManager.M_fire("RegisterAddons",{},this);
	}

	M_registerAddon(name,title,fnRead)
	{
		this.m_addOns[name]={title:title,fnRead:fnRead};

	}
	M_readSpecialAddons(S,vars)
	{	let n=vars.m_name, ao=this.m_addOns[n];
		if(ao)
		{	if(ao.fnRead)
			{	ao.fnRead.call(this,S,vars)
			}
		}
		
	}
	M_readHatchVariable(S,vars)
	{
		
		var groupName = vars.M_get("SvgObject");
		const debug=false;
		if(debug)console.group("M_readHatchVariable "+groupName);
		var svgObjectName = vars.M_getVarName('SvgObject');

		// Find the corresponding select
		if(_UI)
		{	let elts= document.querySelectorAll(`select[name=${svgObjectName}]`);
		
			// In UI the groups must be added to this select first
			if(elts.length)
				this.M_applySvgGroupsToSelect(elts);


			for(let i=0;i<elts.length;i++) {elts[i].value=groupName;}
		}
		if( S._g==undefined)
			S._g={};
		
		{   let Gr = S._g[groupName]; 
			let Gref; 
			if(Gr!=undefined && (Gref = this.M_findGroupDeclaration(Gr.bundle, Gr.name)) )
			{	
				var groupActive = ('activate' in vars._V === false) || vars.gB("activate",true);
				if(debug)console.log("groupActive="+groupActive);
				Gr.m_active = true;	// TEST TEMP
				
				if(groupActive||this.alwaysActivateGroups)
				{
					if( Gr.fills==undefined)
					{	Gr.fills = [];
						if(debug)console.log("Creating fills array");
					}
					let gp = A.M_getGroupInstance(Gref);
					if(Gr.fill==undefined)
					{	Gr.fill = gp;
						if(debug)console.log("Setting fill variable");
					}
					Gr.fills.push(gp);

				   if(this.m_isMakeSvgGroups)
				   {   
					   gp.m_active = groupActive;
					   gp.m_lines = [];
					   this.M_getStyle(gp,vars);

					   let name;gp.id=vars.M_get("SvgGroupId");
					   if( gp.id.length>=1) name=gp.bundle+"/"+gp.id;
					   else name = gp.bundle+" "+gp.name+gp.instances;
					   let opt={style:this.M_getStyleAsString(gp),"stroke-width":gp.m_strokeWidth}
					   this.M_makeSVGColor(opt,gp)
					   gp.m_svgGroup =  this.M_newSvgGroup(name,opt)
					   
					}
				   
					
				   /*let hf = vars.M_get('hatchFunc');
				   if( !hf) hf=vars.m_name;
				   gp.hatchFunc = this.M_getHatchFunction(hf,gp,vars)*/

				   this.M_initFillStyle(gp,vars,vars.m_name)
				   


				}
			}
		}
		if(debug)console.groupEnd();
	}


	M_clearMask()
	{
		if( this.m_mask)
		{
			this.m_mask.M_fill("black");
		}
	}
	M_clearLines()
	{
		this.m_lines=[];
		let Grs = A._gInstances;
		for( let ig=0; ig<Grs.length; ig++)
		{
			let group = Grs[ig];
			if( group.m_svgGroup)
				group.m_svgGroup.innerHTML="";
			group.nbLines = 0;
		}
		this.mH=[];
		this.mHL=[];

	}
	M_clearDrawing()
	{	this.M_clearLines();
		this.M_initOuputImage();
	
	}
	
	M_log(s){console.log(s)}
	M_clearLog()
	{
		if(A.m_logObj)
		{
			let i,a=A.m_logObj.querySelectorAll("div:not([id])");
			if(a && isArr(a)) while(i=a.pop()) i.remove();
		}
	
	}

	M_isAbort()
	{
		if(this.m_abort)
		{
			
			return true;
		}
		return false;
	}

	// --------------------------------------------------
	// Images & Textures
	// --------------------------------------------------
	M_getTexture(name)
	{
		if( name )
			return this.m_textures[name];
		return null;	
	}
	M_getTextures(name)
	{	let _=this
		if(name && name.includes(";"))
		{	let a=name.split(";")
			return a.map((n)=>_.M_getTexture(n)).filter((n)=>n)
		}
		return _.M_getTexture(name)
	}
	M_onTextureLoaded(n,t){}
	async M_createTextures()
	{
		let _=this,
		textures = this.gPk("textureList","Texture",true);
		if( !isArr(textures))
			textures=[];
		
		
		
		// _.m_isUseMask
		// add the mask 
		_.m_textures["Mask"]=_.m_mask;
		_.m_textures["Stencil"]=_.m_stencil;

		let clipImage0 = _.M_getPath("clipImage");
		if( clipImage0)
			textures.push({name:"Mask",imagePath:clipImage0});
			
		if(isArr(textures))
		{
			for(let i=0; i<textures.length; i++)
			{	let S = textures[i];
				let name = S.name || S.M_get('name');
				let fillc=S.M_get('fillColor')
				if(name.length )
				{
					let isGen = false,heap=S.gB("heap")?[]:null
					if(_.m_textures[name]==undefined)
					{
						isGen = S.gB("isGenerative",false);
						if( isGen )
						{	
							
							var t;
							if(t=_.M_generateTexture(name))
							{
							}
							else 
							{	let w=_.W,h=_.H,k,m
								switch(S.M_get("size"))
								{
									case "scale":
										k=Math.max(1*S.gO("size","scale")??1,0.1)
										w*=k;h*=k
										break;
									case "max":
										m=Math.max(1*S.gO("size","max")??w,9)
										if(w>m || h>m)
										{	k=m/Math.max(w,h)
											w*=k;h*=k
										}
										break;
									case "fixed":
										w=1*(S.gO("size","w")??w)
										h=1*(S.gO("size","h")??h)
										break;										
								}
								t = new Texture({width:w, height:h});
								t.M_fill(fillc?fillc:"black");
								if(w!=_.W || h!=_.H)
									t.M_scale(w/_.W,h/_.H)						
							}
							t.heap=heap
							if(_UI)
							{	let e,ep,dv;
								if(e= S.M_getElt("image"))
								{	ep=e.parentElement;
									ep.setAttribute("style","display:none");
									dv=NewElt("div",{appendTo:ep.parentElement});
									dv.appendChild(t.m_canvas)
									t.m_canvas.setAttribute("style","max-width:100%");

								}
							}
					 
							_.m_textures[name]=t;

						}
					}
					if(!isGen)
					{
						let imagePath = S.imagePath??S.M_getPath("image");
						if( imagePath)
						{	await _.M_loadImage( S,"img",imagePath ).then(img=>{
								
								// Create a canvas with _ image
								_.m_textures[name]??=new Texture({image:S.img});
								let opts={img:S.img};
								_.m_textures[name].M_drawImage(opts);
								_.M_onTextureLoaded(name,_.m_textures[name]);
							}).catch(e=>{console.error(`Error M_loadImage ${imagePath}`);console.error(e);}); 
						}
					}
				}
			}
		}
		//
	}
	M_generateTexture(name)
	{
	}
	M_fillTextureSelect(){}

	M_loadImage = (S,varname,filepath)=>
		 new Promise((resolve, reject) => {
			if( filepath )
			{
				this.m_nbImagesLoading++;

				if( S[varname]==undefined) 
					S[varname] = new Image();
					S[varname].onload = function(){
						
						this.m_nbImagesLoaded++;
						resolve(S[varname]);
					}.bind(this);
				S[varname].onerror = reject;
				S[varname].src=filepath;

			}
			else
			{	console.log("No path for "+varname);

				resolve(null);
			}
	  	});  


	// --------------------------------------------------
	// M_includeArtwork(S,art)
	// --------------------------------------------------

	async M_includeArtwork(S,art)
	{
		
		let opts =art._O;
		if( opts['JSClass']!==undefined )
		{
			let ui=_pushUI(false);
			let c = getClass(opts['JSClass']); 
		   if( c!=undefined)
			   S.A = new c();  
		   if( S.A)
		   {	
				
				S.A.m_isMainAlgorithm = false;
				S.A.M_setArtworkTitle( opts['title']);
				S.A.m_isOwnPalette=opts['ownPalette']?true:false;
				if(S.A.m_isOwnPalette && opts['palette']!==undefined)
				{	try{
						S.A.M_setPalette(JSON.parse(opts['palette']));
					}
					catch(e)
					{
						console.error(e);
						console.error(opts['palette']);
					}
		   		}
				S.A.M_setVariables(JSON.parse(opts['JSONVars'] ));
			   this.M_initIncludedAlgorithm(S.A, false);
			   
			   // Init variables
			   await S.A.M_initVariables();

			   

		   }
		   await _popUIWait(ui);

		}			
	}
	M_initIncludedAlgorithm(Algo,isMainVars)
	{	   	_pushUI(false);
			let c=(t)=>{Algo[t]=this[t]},
			o=['svg','m_mask','m_stencil','_o','m_outputFormat','mH','mHL','W','H','m_svgSize']
		   if(!Algo.m_isOwnPalette)o.push('m_palette')
		     
		   Algo.m_lines = A.m_lines;
		   o.map((t)=>c(t));  
		   Algo.M_makeWorkArea();

		   Algo.m_isUseMask = true;
		   ['u','m_isMakeSvgGroups'].map((t)=>c(t));  
		   if(isMainVars)
		   {	['m_clipMinSegment','m_documentMargin','mdA','mwA','m_clipArea','m_protectionStrokeWidth','m_noiseFactor','m_documentHorizon','m_perspectiveFactor','m_lightSource','m_toEyeVector','m_strokeWidth','m_strokeColor'].map((t)=>c(t))
		   }
		   Algo.m_defaultSvgGroup = A.m_defaultSvgGroup;
		   //S.A._g = A._g;	// ?
		   Algo._Svs();
		   _popUI();
			
		   
	}
	M_isMaskInterrupt(input,options)
	{
		let Ls=isArr(input)?input:[input],
		opts=options??{},
		mask = opts.mask??this.m_mask,
		bounds=opts.bounds??this.m_clipArea,
		data,rowBytes,x0,y0,
		context = mask._X(),
		clipThres = opts.thres??this.m_clipThreshold,
		thres3 = clipThres**3


		if(opts.data)
			data = opts.data.id.data,x0= opts.data.x,y0 = opts.data.y,rowBytes = opts.data.id.width*4;
		else
		{	
			let aabb,L;
			for(let i=0;i<Ls.length;i++)
			{	L=Ls[i];
				let poly=L.m_isPolyLine;
				let T=ZMT.M_getAABB(poly?L.mP:[L.A,L.B]);
				aabb??=T;if(i) aabb.M_extend(T.x,T.y,T.w,T.h);
			}		
			if( !aabb) return true;
			aabb.M_inset(-2*this.u)
			aabb.M_limitToRectangle(bounds);
			if( aabb.w>=1 && aabb.h>=1)
			{
				let imgdata = context.getImageData(aabb.x,aabb.y,aabb.w,aabb.h ); 
				data = imgdata.data;
				x0 = aabb.x;
				y0 = aabb.y;
				rowBytes = imgdata.width*4;
			}
		}
		for(let i=0;i<Ls.length;i++)
		{	let L=Ls[i],
			mult= L.m_isPolyLine,
			l=L,nbSeg = mult?L.M_nb()-1:1;		


			for( let iLine = 0; iLine<nbSeg; iLine++)
			{
				if( mult)
					l = L.M_getLine(iLine);

				let	slope= new ZV2(l.B.x-l.A.x,l.B.y-l.A.y),
				len = slope.M_length();
				if( len>0)
				{	let P=l.A.clone();
					let d= new ZV2( slope.x/len, slope.y/len);
					
					for(let l=0.0; l<=len; l+=1.0)
					{
						if( bounds.M_isInside(P.x,P.y,-2) && this.m_clipArea.iPI(P) )
						{
							if( data)
							{	let ind = Math.round(P.x-x0)*4+ Math.round(P.y-y0)*rowBytes;
								if(data[ind]*data[ind+1]*data[ind+2]>=thres3 || data[ind+3]<clipThres )
									return true;
							}
							else 
							{	var p = context.getImageData(P.x,P.y, 1, 1).data;
								if( p[0]*p[1]*p[2]>=thres3 || p[3]<clipThres )
									return true;
							}
						} else return true;
					}
				}
			}
		}
		return false;
	}

// input : a ZL or a ZPL
// TODO : replace with a Bresenham
// opts : 
// bounds: ZRc or default to workarea
// thres: intensity [0,255]
M_computeLineMask(input,options)
{
	let outLines=[];
	if(input==null) return outLines;
	let opts=options??{},
	multipleLines,
	bounds = opts.bounds??this.m_clipArea,
	sx=1,sy=1,
	stopCollide = opts.stopCollide,
	clipThres = opts.thres??this.m_clipThreshold,
	thres3 = clipThres**3,
	testData=opts.thresRed?
		(data,i)=>data[i]>=clipThres || data[i+3]<clipThres	
		:(data,i)=>data[i]*data[i+1]*data[i+2]>=thres3 || data[i+3]<clipThres,
	outputLine = function(L)
	{ 
		if( multipleLines)
		{
			// compare with last point to output a polyline if needed
			let last =outLines.pop();
			if( last!=undefined && last.M_endPoint().M_equals(L.A))
			{
				// is it already a polyline ?
				if( last.m_isPolyLine)
				{	last._aP(L.B);
					outLines.push(last);
				}
				// else replace line with a polyline 
				else
				{
					var poly = new ZPL();
					poly._aP(last.A);
					poly._aP(last.B);
					poly._aP(L.B);
					outLines.push(poly);
				}
			}
			else
			{	if( last!=undefined)
					outLines.push(last);
				outLines.push(L);
			}
		}
		else
			outLines.push(L.clone());
	},
	mask = opts.mask??this.m_mask
	
	if( mask && (this.m_isUseMask || opts.active))
	{
		var context = mask._X();

		var isA=isArr(input);
		let nbInp=isA?input.length:1;

		let data,rowBytes,x0,y0;
		if(opts.data)
		{ 	data = opts.data.id.data; 
			x0= opts.data.x;
			y0 = opts.data.y;
			rowBytes = opts.data.id.width*4;
		} 
		else
		{	
			let aabb;
			for(let i=0;i<nbInp;i++)
			{	let L=isA?input[i]:input;
				let poly=L.m_isPolyLine;
				let T=ZMT.M_getAABB(poly?L.mP:[L.A,L.B]);
				aabb??=T;if(i) aabb.M_extend(T.x,T.y,T.w,T.h);
			}		
			if( !aabb) return outLines;
			aabb.M_inset(-2*this.u)
			aabb.M_limitToRectangle(bounds);
			sx=mask.m_scale.x;sy=mask.m_scale.y
			aabb.M_scale(sx,sy)
			if( aabb.w>=1 && aabb.h>=1)
			{
				let imgdata = context.getImageData(aabb.x,aabb.y,aabb.w,aabb.h ); 
				data = imgdata.data;
				x0 = aabb.x;
				y0 = aabb.y;
				rowBytes = imgdata.width*4;
			
			}
		}
		for(let i=0;i<nbInp;i++)
		{	let L=isA?input[i]:input;

			multipleLines= L.m_isPolyLine;	//
			let currentLine;
			var nbLines = multipleLines?L.M_nb()-1:1;
			currentLine = L;		


			for( let iLine = 0; iLine<nbLines; iLine++)
			{
				var newLine= new ZL()
				var wasOut=-1;
				if( multipleLines)
					currentLine = L.M_getLine(iLine);

				var slope= new ZV2(currentLine.B.x-currentLine.A.x,currentLine.B.y-currentLine.A.y);
				var len = slope.M_length();
				if( len>0)
				{	let P=currentLine.A.clone();
					let penUp = currentLine.A.penUp??false;
					let d= new ZV2( slope.x/len, slope.y/len);
					
					for(let l=0.0; l<=len; l+=1.0)
					{
						var isOut; 
						if( (!penUp) && bounds.M_isInside(P.x,P.y,-2) && this.m_clipArea.iPI(P) )
						{
							if( data)
							{
								let ind = Math.round((P.x-x0)*sx)*4+ Math.round((P.y-y0)*sy)*rowBytes;
								//isOut= (data[ind]*data[ind+1]*data[ind+2]>=thres3 || data[ind+3]<clipThres )?1:0;
								isOut = testData(data,ind)?1:0
							}
							else 
							{
								var p = context.getImageData(P.x*sx,P.y*sy, 1, 1).data;
								//isOut= (p[0]*p[1]*p[2]>=thres3 || p[3]<clipThres )?1:0;
								isOut = testData(p,0)?1:0
							}
						} else isOut = 1;
						if( wasOut==-1)
						{	wasOut=isOut;
							if( isOut==0)
							{	newLine.A.M_set(P);
							}
						}	
						else
						{	if( wasOut!=isOut)
							{
								if( wasOut==1)	// we enter the zone
								{	newLine= new ZL(P.clone(),P.clone());
								}
								else	// a line is finished 
								{	newLine.B.M_set(P.x-d.x,P.y-d.y);

									outputLine(newLine);							
									if( stopCollide)
										return outLines;
								}
								wasOut=isOut;
							}
						
						}
						if(penUp)
							break;
						P.x += d.x;
						P.y += d.y;
					}
					// end it
					if( wasOut==0)
					{	newLine.B.M_set(currentLine.B);
						outputLine(newLine);							
					}

				} // end len>0 
			} // end for
		}
		// filter by size
		for(var i = outLines.length -1; i >= 0 ; i--){
			if(outLines[i].M_length()<this.m_clipMinSegment)
				outLines.splice(i, 1);
		}

		

		//
		return outLines;

	}
	else
	{	return isA?input:[input];
	}
}


// --------------------------------------------------
	//  M_hatchShape  
	//  returns the lines
	// --------------------------------------------------
	M_nullHatchFunc(OBB,x,opts)
	{
		return null;
	}
	M_defaultHatchFunc(OBB,x,opts)
	{
		let p={x:OBB.o.x+x*OBB.I.x, y:OBB.o.y+x*OBB.I.y}
		let h = OBB.h*0.5;
		let P1 = new ZV2( p.x - h*OBB.J.x,  p.y - h*OBB.J.y);
		let P2 = new ZV2( p.x + h*OBB.J.x,  p.y + h*OBB.J.y);
		
		return new ZL(P1,P2);
	}
	M_defaultSpacingFunc(OBB,x,opts)
	{
		return opts.spacing??( opts.m_spacing? rndRange(opts.m_spacing,this.random) : this.u);	
	
	}
	M_defaultDistributionFunc(OBB,x,opts)
	{
		
		if( x<(OBB.w-this.m_strokeWidth/2))	// TODO: is it not opts.m_strokeWidth?
		{
			let hatchFunc = opts.hatchFunc?? this.M_defaultHatchFunc;	
			var L = hatchFunc.apply(this, [OBB,x-OBB.w/2,opts] );

			let spacingFunc = opts.spacingFunc?? this.M_defaultSpacingFunc;
			let spc = spacingFunc.apply(this, [OBB,x,opts] );
			x+=Math.max(spc,this.m_strokeWidth);


			return { x:x, L:L}
		}
		return null;

	}
	M_makeClipOBB(maskShape,opts)
	{
		let isA = isArr(maskShape),points;
		if(isA) points=[],maskShape.map(L=>points.push(...L.mP)); else points= maskShape.mP;
		let aabb0;
		opts??={}
		let mask=opts.mask??this.m_mask;
		let angleDeg=opts.orientation??0; 
		let augmentOBB = opts.obbMargin;

		if( opts.clipImage)
		{	aabb0 =ZMT.M_getAABB(points);
		}
		var OBB = ZMT.M_getOBB(points,angleDeg);
		if( augmentOBB)
		{
			OBB.w+=2*augmentOBB;
			OBB.h+=2*augmentOBB;
		}
		var obbContour = ZMT.M_polylineFromOBB(OBB);  
		var aabb = ZMT.M_getAABB(obbContour.mP);
		aabb.M_limitToRectangle(this.m_clipArea);

		let clipOpts = {mask:this.m_stencil,active:true,bounds:aabb.clone()};
		if( opts.thres!==undefined)
			clipOpts.thres= opts.thres;
		clipOpts.thresRed=opts.thresRed;
		
		// bounds are shrinked of half a pixel
		clipOpts.bounds.M_inset(0.5);

		aabb.M_inset(-this.u)
		//aabb.M_limitToRectangle(this.mwA);
		aabb.M_limitToRectangle(this.m_clipArea);		// TEST MZ 230210
		aabb.M_rounding();
		if( isNaN(aabb.w) || aabb.w<1 || aabb.h<1)
			return null;

		if(this.m_stencil)
		{	
			var stcCtx = this.m_stencil._X();			
			//this.m_stencil.M_fill("white");
			stcCtx.fillStyle = "white";
			stcCtx.fillRect(aabb.x, aabb.y, aabb.w, aabb.h);

			if(opts.clipImage)
			{	stcCtx.drawImage(opts.clipImage,aabb0.x, aabb0.y, aabb0.w, aabb0.h);			
			}
			else
			{	stcCtx.fillStyle = "black";
				if(opts.noFillShape)
					stcCtx.fillRect(aabb.x, aabb.y, aabb.w, aabb.h);				
				else 
				{
					let shapes=isA?maskShape:[maskShape];
					shapes.map(
						(L)=>
						{
							let pathPoints = L._gS(true),
							path = new Path2D(pathPoints);
				
							stcCtx.fill(path);
							// protection stroke width
							if(opts.expand)
							{	//console.log("Expanding !");
								stcCtx.lineWidth = opts.expand*2;
								stcCtx.strokeStyle = "black";
								stcCtx.stroke(path);
		
							}
							else if(opts.protect)
							{
								stcCtx.lineWidth = opts.protect*2;
									stcCtx.strokeStyle = "white";
									stcCtx.stroke(path);
							}
						}

					)
					
				}
			}
			// draw mask image
			if(mask)
			{	stcCtx.globalCompositeOperation = "lighter";

				let sx=mask.m_scale.x,sy=mask.m_scale.y;
				stcCtx.drawImage(mask.m_canvas, aabb.x*sx, aabb.y*sy, aabb.w*sx, aabb.h*sy,aabb.x, aabb.y, aabb.w, aabb.h);	
				stcCtx.globalCompositeOperation = "source-over";
			}else console.log("NO MASK ");

			// get the data from the aabb zone once for all to speed up queries
			let data = stcCtx.getImageData(aabb.x,aabb.y,aabb.w,aabb.h ); 
			clipOpts.data = { id : data, x:aabb.x,y:aabb.y }
			OBB.clipOpts=clipOpts;	// Test
		}
		OBB.end = ()=>{
			if(clipOpts && clipOpts.data.changed)
			{
				// put the data back into canvas for display
				let stcCtx = this.m_stencil._X();
				stcCtx.putImageData(clipOpts.data.id,clipOpts.data.x, clipOpts.data.y);
				
			}
		}
		return OBB;
	}

	
	// opts.orientation
	// opts.spacing 
	// opts.hatchFunc
	// opts.spacingFunc
	// opts.distrFunc
	// opts.alternate   true/false : alternate lines directions to optimize plotting
	// opts.jointEnds
	// opts.obbMargin;
	// opts.clipImage
	// opts.noFillShape
	// opts.protect		inner protection stroke width 
	// opts.postProcessing  // post processing function
	// opt.thres : mask threshold for clip line function
	M_hatchShape(maskShape,opts)
	{
		if(this.m_abort)
			return;
		let
		_=this
		,out=[]
		,isA=isArr(maskShape)
		,ls=opts.lineStyle
		,clip2=ls?.clipAfter
		,jointEnds = opts.jointEnds
		,alternate = jointEnds || opts.alternate
		,OBB,ln

		if((!isA) && (!maskShape || maskShape.mP.length<3 ))
			return ; 
		
		// Create the OBB 
		if( !(OBB = _.M_makeClipOBB(maskShape,opts))) return []
		
		// Apply distribution 
		let distributionFunc = opts.distrFunc??_.M_defaultDistributionFunc,
		sign = 1,hasPrev =0,x=0,D,L;
				
		while(D=distributionFunc.apply(_,[OBB,x,opts]))
		{
			x=D.x;
			if(D.L)
			{	let Ls=isArr(D.L)?D.L:[D.L]
				// perform reverse
				if( sign<0)
					Ls.reverse(),Ls.map((L)=>L.M_reverseOrder())

				// if clip2, apply lineStyle first
				if(ls&&clip2)
					Ls=_._aLs(ls,Ls)

					
				// Perform clipping
				Ls=_.M_computeLineMask( Ls,OBB.clipOpts);
				if(ls&&!clip2)
					Ls=_._aLs(ls,Ls)
				// bridges
				let L0
				if(jointEnds&& Ls?.length && (ln=out.length) &&(L0=out[ln-1]))
				{	let p1=L0.last(), p2=Ls[0].first()
					if(p1&&p2 &&p1.M_dist(p2)<(opts.spacing+2*_.m_strokeWidth)
						&&!_.M_isMaskInterrupt(new ZL(p1,p2),OBB.clipOpts))
					{	//(L0=L0.toPolyline()).M_append(Ls.shift())
						// Note : removing the shift produces a nice superposition effect
						Ls.splice(0,0,out.pop().toPolyline().M_append(Ls.shift()))
					}

				}

				// Output result
				out.push(...Ls)

				// if case of array of lines, we can't perform reversing / jointing lines
				/*if( )
				{
					
					if(ls)L=this._aLs(ls,L);

					for(let i=0; i<L.length; i++)
					{	clip1?out.push(L[i]):
						out.push(...this.M_computeLineMask( L[i] , OBB.clipOpts	));
					}
				}
				// Single line : performing reverse / jointing 
				else if(L)
				{	
					let Ls;
					if( clip1)
					{	let L1=this.M_computeLineMask( L,OBB.clipOpts);
						Ls=ls?this._aLs(ls,L1):L1;
					}
					else 
					{	if(ls) L=this._aLs(ls,[L]);
						Ls = this.M_computeLineMask( L , OBB.clipOpts);
					}
					
					if( Ls.length>=1)
					{	if( jointEnds)
						{
							if( hasPrev)
							{
								let Lprev = out.pop();
								let Lnext = Ls[0];
								if( Lprev && Lprev.M_nb()>=2)
								{
									if( Lprev.last().M_dist( Lnext.first()) <= (opts.spacing+2*this.m_strokeWidth)  
										&& !this.M_isMaskInterrupt(new ZL(Lprev.last(),Lnext.first()),OBB.clipOpts)
									)
									{ 
										

										let newL  = new ZPL();
										newL.M_append(Lprev);
										newL.M_append(Lnext);
										Ls[0] = newL;
									}
									else out.push(Lprev);
								}
							}
						}
						out.push(...Ls);
						hasPrev = true;
					}
					else 
						hasPrev = false;
				
				}
				else 
					hasPrev = false;
				*/

				if( alternate)
					sign=-sign;			
			}
		}
		OBB.end();
		if(opts.postProcessing)
		{
			opts.postProcessing.apply(this,[out,OBB,opts])
		}
		
		// mark a group
		if( opts.group)
		{
			return [{group:true,lines:out}];
		}
		
		return out;
 
	
	}
	
	
// _dM
// adds a shape to the mask
// opts.protect : protection stroke
// opt.intensity : [0-255]
// opt.nofill
_dM(shape,opts,mask)
{
	if( shape && this._maskingOn)
	{
		let o=opts??{}
		let protect=o.protect??this.m_protectionStrokeWidth;
		let path = new Path2D(shape._gS(true));
		mask??=this.m_mask;
		let ctx=mask._X();
		let color = o.intensity? `rgba(255,255,255,${o.intensity/255})`:"white";
		if(!o.nofill){ctx.fillStyle = color;ctx.fill(path);}
		if( protect)
		{
			ctx.lineWidth = protect*2;
			ctx.strokeStyle = color;
			ctx.stroke(path);
		}
		// callback
		if(this.cbDrawInMask)this.cbDrawInMask.apply(this,[shape,path,opts]);
		return path;
	}
	return null;
}
_DLInMask(L,strokeWidth)
{
	if(strokeWidth && L)
	{
		let Ls = isArr(L)? L : [L];
		let context = this.m_mask._X();
		context.strokeStyle = "white";
		context.lineWidth=strokeWidth;
		for( let i=0; i<Ls.length; i++)
		{	let path = new Path2D(Ls[i]._gS(false));			
			context.stroke(path);

		}


	}
}

M_drawImage(canvas,aabb,mode)
{
	if( this._o)
	{	let context = this._o._X();
		if(mode)
			context.globalCompositeOperation=mode;
		context.drawImage(canvas, aabb.x, aabb.y,aabb.w, aabb.h);
		if(mode)
			context.globalCompositeOperation="source-over";
	}
	let h={m:'canvas',c:canvas,aabb:aabb};
	if(mode) h.blend=mode;
	this.mH.push(h);

}
M_drawPoints(group,pointsArray)
{
	if( group && group.m_lines && pointsArray && isArr(pointsArray))
	{	
		if( this.isSVG())
		{
			// todo. How ? 
		}
		else if( this._o)
		{
			let context = this._o._X();
			let color=this.M_getGroupColor(group);
			let heap = this.mHL; 
			context.fillStyle = color;	
			for(let i=0; i<pointsArray.length;i++)
			{
				let pt = pointsArray[i];
				context.beginPath();
				context.arc(pt.x, pt.y, pt.r, 0, PI2, false);
				context.fill();
									
				heap.push({m:"round",c:color,x:pt.x,y:pt.y,r:pt.r});
			}

		}
	
	}

}
_DL(group,lines,isMask,opt)
{
	if( lines==undefined || !group )
		return;
	let _=this,Ls = isArr(lines)? lines : [lines]
	,ls=group.m_lineStyle
	,stroke = (group.m_strokeWidth|| _.m_strokeWidth)*(group.strokeScale||1)
	,clip2=ls?.clipAfter
	if(ls)ls.strokeWidth=stroke		// TODO : transmit to chained ls
	let applyStyleAndMask=(Ls,forSvg)=>{
		if(ls&&clip2)	Ls=_._aLs(ls,Ls,forSvg)
		if( isMask)		Ls=_.M_computeLineMask( Ls,opt);
		if(ls&&!clip2)	Ls=_._aLs(ls,Ls,forSvg)
		if(forSvg&&(forSvg.a.length==0 || !ls)) 
			forSvg.a=Ls;
		return Ls
	}
	
	
	if( _.isSVG())
	{
		if( group && group.m_lines)
		{	
			Ls=applyStyleAndMask(Ls)
			group.m_lines.push( ...Ls);		
		}	
	}
	else
	{	if( _._o && Ls[0])
		{
			let color = _.M_getColorFunc(group,Ls[0]) ?? _.M_getGroupColor(group);
			let context = _._o._X();
			let b=opt?.blend ?? group.blend;
			let bs=b=='shadow'?group.shadowColor:null
			if(group.m_isFill)
			{
				context.fillStyle = color;	
				for(let i=0; i<Ls.length;i++)
				{
					let lines = Ls[i]._gS(false);
					let path = new Path2D(lines);
					let heap = group.m_isFront? _.mHL : _.mH, h={m:"fill",c:color,path:path,l:/*lines*/Ls[i]}; 
					if(b) h.blend=b;
					if(_._renderOn)
					{	heap.push(h);
						context.fill(path);
					}
				}
				
			}
			else
			{

				context.strokeStyle = color;
				context.lineWidth = stroke;
				/*if( isMask)
					Ls= _.M_computeLineMask(Ls,opt);  */
				let forSvg=A.buildSvg?{a:[]}:null
				Ls=applyStyleAndMask(Ls,forSvg)

				let nb=Ls.length;
				let sortFunc=opt?.svgSort?opt.svgSort.func:null;
				let heap=group.m_isBack?A.mH:A.mHL;
				if(!_._skipLines)
				{	for(let i=0; i<nb;i++)
					{	if(Ls[i] && Ls[i]._gS)
						{
							if(sortFunc)
								Ls[i].sortOpt=opt.svgSort.param;
							
							let lines = Ls[i]._gS(false); 
							let path = new Path2D(lines),
							h={m:"stroke",w:stroke,c:color,path:path,l:/*lines*/Ls[i]};
							if(b)h.blend=b;
							if(bs) h.shadowColor=bs
							if(group.m_isStrkRound)
								h.cap="round";

							
							let is=ls?_.M_applyLSHeap(ls,context,heap,group,h,opt):1
							//let is =ls?.fnHeap? ls.fnHeap.call(_,ls,context,heap,group,h,opt):1
							if(is&&_._renderOn)
							{	if(opt?.heapFront) heap.splice(0,0,h); else heap.push(h);
								context.stroke(path);
							}
						}					
					}
					if( A.buildSvg)
					{	if(sortFunc)
						{	
							group.sortFunc??=sortFunc;
						}
						group.m_lines.push( ...forSvg.a);
					}
				}
			}		
		
		}
	}
}
M_getColorFunc(group,L)
{
	if(group.colorFunc)
		return group.colorFunc(L)
	else if(group.m_strokeColor && group.m_strokeColor.includes('func('))
	{	
		const reg=/func\(([a-zA-Z0-9_]+)\,?([a-zA-Z0-9\.\-\,]*)\)/;
		let m=group.m_strokeColor.match(reg);
		//console.log(RQPrintR(m,4));
		let a=m?m[1]:"";
		if(a && (typeof this[a] === "function"))
		{	let param=m[2]?m[2].split(","):[];
			return (group.colorFunc=(L)=>this[a](L,...param))(L);
		}
		else
		{	console.warn(`Err a. m.length=${m?m.length:'undefined'} a =${a}`);
			return (group.colorFunc=(p)=>"black")(L);
		}
	}
	else // static color : compute it and return value
	{
		let c=this.M_getGroupColor(group);
		return (group.colorFunc=(p)=>c)(L);
	}
	// undefined return == normal
}

M_getGroupColor(group)
{
	let A2 = this.m_isOwnPalette? this:A;
	let color = A.m_isMakeSvgGroups? A2.M_getPaletteColor(group.m_paletteTag,group.m_paletteVariant,group.m_strokeColor) : group.strokeColor;
	return color;
}
ColorAlphaCentric(L,r,g,b,a,a0,cx,cy,k)
{	cx??=0.5;
	cy??=0.5;
	let p=L.first();
	let t = k? ZMT.M_map(p.M_dist(this.W*cx,this.H*cy),0,k*this.W,1,0) : Math.min(1,p.M_dist(this.W*cx,this.H*cy)/(this.H/2));	// for compatibility 
	console.log(`t=${t}`)
	t=Math.pow(t,3);
	let s= `rgba(${r},${g},${b},${a*t+a0*(1-t)})`; 	
	//console.log(s);
	return s;
}
ColorYFrac(L,r1,g1,b1,a1,r2,g2,b2,a2,f1,f2)
{	//console.log("yFrac="+this.m_yFrac);
	f1??=0;f2??=1;
	let k=ZMT.M_map(this.m_yFrac,f1,f2,0,1),j=1-k;
	return `rgba(${r1*j+r2*k},${g1*j+g2*k},${b1*j+b2*k},${a1*j+a2*k})`; 	
}
ColorY(L,r1,g1,b1,a1,r2,g2,b2,a2,f1,f2)
{	f1??=0;f2??=1;
	let k=(L&&L.M_nb())? ZMT.M_map(L.first().y,this.H*(1-f1),this.H*(1-f2),0,1):0,j=1-k;
	return `rgba(${r1*j+r2*k},${g1*j+g2*k},${b1*j+b2*k},${a1*j+a2*k})`; 	
}
M_applyFills(g,L,opt)
{	if(g&&L&&( isArr(L) || L.M_nb()>=3))
	{	
	
		let Fs=g.fills; 
		if( isArr(Fs))
		{	Fs.map((F)=>
			{	let o={g:g,shape:L}
				if(g.active)g.active(this,F,o);
				if(g.setup)g.setup(this,F,o);
				if(F.m_active)
				{	if(F.setup) F.setup.apply(this,o)
					this._Fl(F,L,opt); 
					if(F.end) F.end.apply(this,o)
				}
			}
			)
		}
	}
}

_Fl(group,L,optIn) 
{	if(!group)return;
	let opt=optIn??group,_=this,
	isA = isArr(L), lst=opt.lineStyle=group.m_lineStyle,tex,liveFill,isSvg=_.isSVG()
	if((!L) || (isA&&!L.length) || ((!isA)&&L.M_nb()<3)) return;
	
	// Output to texture ? 
	if(group.m_texName)
	{ 	if(tex=(group.m_tex??=_.M_getTextures(group.m_texName)))
			liveFill=1,isSvg=0
		
	}
	// Default to main image 
	tex??=_._o



	if(isSvg)
	{
		if( opt.hatchFunc==this.M_nullHatchFunc)
			return;
		let Ls = this.M_hatchShape( L ,opt);
		if( isArr(Ls))
		group.m_lines.push(...Ls); 
		if(opt.strokeMask)
		{	this._DLInMask(Ls,opt.strokeMask)

		}
	}
	else if(tex)
	{	let b=opt?.blend??group.blend;
		liveFill ??= opt.liveFill??_.m_allowLiveFillShape
		toArr(tex).map((t)=>{
			let context=t._X(),heap=t.heap
			if(group.m_isFill)
			{	
				heap ??= group.m_isFront? A.mHL : A.mH			
	
				let Ls = toArr(L),i
				for(i=0; i<Ls.length;i++)
				{	
					let color = _.M_getColorFunc(group,Ls[i]) ?? _.M_getGroupColor(group);
					if(liveFill)
						context.fillStyle = color;	
	
					let lines =Ls[i]._gS(0), 
					path = new Path2D(lines),
					h={m:"fill",c:color,path:path,l:Ls[i]};
					if(b)h.blend=b;
					if(_._renderOn)
					{	if(heap)heap.push(h);
						if(liveFill)
							context.fill(path);
					}
				}
				
			}
			
			else
			{
				heap ??= group.m_isBack? A.mH: A.mHL
	
				let Ls = this.M_hatchShape( L ,opt);
				if( Ls && !this._skipLines)
				{
					context.lineWidth = group.m_strokeWidth;
					for(let i=0; i<Ls.length;i++)
					{	let lines = Ls[i].group?Ls[i].lines : [Ls[i]];
						for(let il=0; il<lines.length;il++)
						{
							let color = this.M_getColorFunc(group,lines[il]) ?? this.M_getGroupColor(group)
							let l1=lines[il]	// TEMP
							if(!l1) debugger;	// TEMP
							if(!l1._gS) debugger;	//TEMP
	
							let _l =lines[il]._gS(0),path = new Path2D(_l),h={m:"stroke",w:group.m_strokeWidth,c:color,path:path,l:lines[il]};
							if(b)h.blend=b;
	
							//let is =lst?.fnHeap?.call(this,lst,context,heap,group,h,opt)??1
							let is=lst?_.M_applyLSHeap(lst,context,heap,group,h,opt):1
							if(is&&this._renderOn)
							{	if(opt.heapFront)
									heap.splice(0,0,h);
								else 
									heap.push(h);
								context.strokeStyle = color;
								context.stroke(path);
							}
							
						}
						
					}
					if(opt.strokeMask)
					{	console.log("Calling stroke mask");
						this._DLInMask(Ls,opt.strokeMask)
		
					}
					if( A.buildSvg)
						group.m_lines.push( ...Ls);
		
					
				}
			
			
			}
	

		})
		
	
	
	}
}

async _DLToSvg(isForceSVG,isBg)
{	
	if( this.M_isAbort())
		return;
	await EventManager.M_asyncFire("DrawLines",{},this,1)
	if(this.isSVG() || isForceSVG)
	{
		if(!this.m_isMainAlgorithm) return;
		

		if(isForceSVG&&isBg==undefined)
		{	// create a rectangle for background 
			let opt=RQColor.sM_rgbaToColorAlpha(this.M_getPaperColor()),nm="PaperColor", r=this.mdA
			let gElt=this.M_newSvgGroup(nm,{insertTo:A.svg,stroke:"none",opacity:opt.opacity,fill:opt.color});
			NewEltNs("rect",{appendTo:gElt,x:r.x,y:r.y,width:r.w,height:r.h})
		}

		var hasLinesLeft = false;
		let Grs = A._gInstances;
		for( let ig=0; ig<Grs.length; ig++)
		{
			let group = Grs[ig];
			if( group.m_active)
			{	if(group.sortFunc)
				{	group.m_lines.sort((la,lb)=>{
						if(la.sortOpt && lb.sortOpt)
							return group.sortFunc(la.sortOpt,lb.sortOpt);
						else 
							return la.sortOpt? -1 : lb.sortOpt? 1 : 0;
					});
					group.sortFunc=null;
				}
				
				let groupElt=group.m_svgGroup;
				var linesNb = group.m_lines.length;
				if( linesNb>0)
				{	console.groupCollapsed(`Group ${group.bundle}/${group.name}/${group.id} - lines = ${linesNb}`)
					for( let ib=0; ib<1000 && linesNb; ib++)
					{  	let line =group.m_lines.pop(); 
						if((ib%50)==0) await sleep(1);
						if( line )
						{
							if( line.group==true)
							{
								group.groupCount ??= 0;
								let gElt = NewEltNs("g",{c:group.groupCount++})

								if( isArr(line.lines))
								{	let line2;
									while(line2 = line.lines.pop() )
									{
										this.m_lineCount ++;
										group.nbLines++;
										let elt=line2.M_toSVGElement();
										if( elt)
										{
											gElt.insertBefore(elt,gElt.childNodes[0]);
										}
									}
								}
								groupElt.insertBefore(gElt,groupElt.childNodes[0]);
							
							}
							else 
							{
								this.m_lineCount ++;
								group.nbLines++;

								try{	let Ls=isArr(line)?line:[line]
										Ls.map( (line)=>{
											let elt=line.M_toSVGElement()
											if( elt)
												groupElt.insertBefore(elt,groupElt.childNodes[0]);

										} )
									}
								catch(e)
								{	console.error(e);
									console.log(`group = ${group.id} line = `)
									console.log(line)
									
								}
							}
						}
					}
					if( group.m_lines.length)
						hasLinesLeft = 1, console.log(` - remaining : ${group.m_lines.length}`);
					console.groupEnd();
				}
			}
		}		

		if(!hasLinesLeft)
		{
			for( let ib=0; ib<30 && this.m_lines.length; ib++)
			{  
				var line =this.m_lines.pop(); 
				this.m_lineCount++;
				this.m_defaultSvgGroup.prepend(line.M_toSVG());
			}
			if( this.m_lines.length)
				hasLinesLeft = true;
		}  
		if( hasLinesLeft)
		{	await this._DLToSvg(isForceSVG,false);
		
		}
		else 
		{	
			//this.M_getTagSVG(this.svg);
			//
		}

	}
	else
		await this.M_drawHeap()

}
M_drawHeapElt(ctx,g,O)
{
	let shdw
	if(g.blend)
	{	if(shdw=g.blend=="shadow")
			ctx.shadowColor = g.shadowColor??'rgba(0,0,0,0.2)',ctx.shadowBlur = 10,ctx.shadowOffsetX = 3,ctx.shadowOffsetY = -3;
		else ctx.globalCompositeOperation=g.blend;
	}
	let c=g.c
	/*if(WIDEGAMUT&& typeof c==='string')
	{	
		const rx = /^rgba\(([0-9.]+),([\d.]+),([\d.]+),([\d.]+)\)$/,
		m= c.match(rx);
		if(m){ c=`color(display-p3 ${m[1]/255},${m[2]/255},${m[3]/255},${m[4]})`;
			console.log(c);
		}
	}*/
	switch(g.m)
	{	case 'fill':
			if(!this.m_noFills)
			{	ctx.fillStyle = c;
				ctx.fill(g.path);
			}
			break;
		case 'func':
			if(g.f)
				g.f.apply(g.ctx,[this,...(g.opts??[])]);
			break;
		case 'stroke':
			if(!this.m_noFills)
			{	ctx.strokeStyle = c;
				ctx.lineWidth = g.w;
				ctx.lineCap=g.cap??"square";
				ctx.stroke(g.path);
			}
			break;
		case 'round':
			ctx.fillStyle = c;
			ctx.beginPath();
			ctx.arc(g.x, g.y, g.r, 0, PI2, 0);
			ctx.fill();
			break;
		case 'dots':
		{	ctx.fillStyle=c
			let u=this.m_pngUpscale
			ctx.scale(1/u,1/u);
			for(let d,i=0; i<g.p.length;i++)
			{   d=g.p[i]
				

				ctx.beginPath();
				ctx.arc(u*d.x, u*d.y, u*d.r, 0, PI2, 0)
				ctx.fill();
			}
			ctx.scale(u,u);
		}
			break;
		case 'text':
			ctx.font = `${g.sz}px sans-serif`;
			ctx.fillStyle = c;
			ctx.fillText(g.str, g.x, g.y);
			break;

		case 'canvas':
			ctx.drawImage(g.c,g.aabb.x,g.aabb.y,g.aabb.w, g.aabb.h);
			break;
		case 'workarea':
			if(O.noClip) break;
			//console.group("Heap workarea");
			//console.log(`M_drawHeap - heap i=${i} setting clip mask to ${g.type} shape=${g.shape.M_getString()}`);
			O.tex.M_popState(1);
			O.tex.M_pushState();
			ctx.beginPath();
			this.M_clip1(ctx,g.shape,g.type)
			ctx.clip();
			ctx.closePath();
			//console.groupEnd();
			break;
		case 'cliprect':
			if(O.noClip) break;
			O.tex.M_popState(1);
			O.tex.M_pushState();
			ctx.beginPath();
			ctx.rect(g.r.x,g.r.y,g.r.w,g.r.h);			
			ctx.clip();
			ctx.closePath();
			break;
		
	}
	if(g.blend)
	{	if(shdw)
			ctx.shadowColor="transparent";
		else
			ctx.globalCompositeOperation='source-over';
	}

}

async M_drawFillHeap(tex,opt)
{	let _=this
	,heap=opt?.heap??_.mH
	, ctx=opt?.ctx??tex._X()
	,O={...(opt??{}),tex:tex}
	,i
	
	O.skip??=_.m_noFills
	for( i=heap.length-1; i>=0; i--)
		_.M_drawHeapElt(ctx,heap[i],O)

}
async M_drawStrokeHeap(tex,opt)
{	
	let _=this
	,heap=opt?.heap??_.mHL
	, ctx=opt?.ctx??tex._X()
	,O={...(opt??{}),tex:tex}
	,i

	ctx.lineCap="butt";
	ctx.miterLimit = _.m_strokeWidth
	for(i=heap.length-1; i>=0; i--)
		_.M_drawHeapElt(ctx,heap[i],O)
}

// M_drawHeap
async M_drawHeap()
{
	let _=this,tex=_._o
	if( tex && _.m_isMainAlgorithm)
	{
		
		
		_.M_initOuputImage(); 
		await _.M_drawFillHeap(tex);
		if(!_.m_noLines)
		{	_.M_resetClipping()
			await _.M_drawStrokeHeap(tex)
		}
		
		// Foreground filters
		_.M_drawFilters(_.m_fgFilters);

	
	}
}

M_downloadPNGasSVG(filename)
{
	// create a SVG and draw the heap in it

	var div = document.createElement("div");
	let svgpng=this.M_makeObjectSVG("svgpng",this.W,this.H);
	div.appendChild(svgpng);
	let svg=svgpng;

	this.M_makeSVGContent(svg)
	
	downloadSVG(div.innerHTML,filename);	

}
M_makeSVGContent(svg)
{
	let paper = this.M_getColor("paper");
	let defs = NewEltNs("defs",{appendTo:svg});
	let clipId=0; 
	let svgGrp = svg;
	let g;
	console.log(`M_makeSVGContent heap size=${this.mH.length} heapL=${this.mHL.length}`);
	for( let i=this.mH.length-1; i>=0; i--)
	{			
		g= this.mH[i];
		switch(g.m)
		{
			case 'fill':
				{
					if(g.l)
					{
						//NewEltNs("path",{d:new Path2D(g.l._gS(false)), style:`fill:${g.c===paper?"white":g.c}`, appendTo:svgGrp});
						if(g.l._gS)
							NewEltNs("path",{d:g.l._gS(false), style:`fill:${g.c===paper?"white":g.c}`, appendTo:svgGrp});
					}
				}
				break;
			case 'workarea':
				switch(g.type)
				{
					default:
					case "Circle":
						//ctx.rect(g.shape.x,g.shape.y,g.shape.w,g.shape.h);
						clipId++;
						let clip = NewEltNs("clipPath",{id:`_clip${clipId}`, html:g.shape.M_toSVG(false), appendTo:defs});
						svgGrp = NewEltNs("g", {"clip-path":`url(#_clip${clipId})`,id:`group${clipId}`, appendTo:svg});

						break;
				}
				//ctx.clip();
				break;
		
		}

	}
	for( let i=this.mHL.length-1; i>=0; i--)
	{			
		g=this.mHL[i];
		switch(g.m)
		{
			case 'fill':
				//NewEltNs("path",{d:new Path2D(g.l),style:`fill:${g.c===paper?"white":g.c}`,appendTo:svgGrp});
				break;
			case 'stroke':
				NewEltNs("path", {d:g.l._gS(false),"stroke-width":g.w, stroke:g.c===paper?"white":g.c, fill:"none",appendTo:svgGrp});
				break;
		}
	}


}

M_applyArtwork()
{	
	if( this.isSVG())
	{	
		let a=getById('ARTWORK');
		if(a && A.svg) 
			a.appendChild(A.svg);

	}

}
M_init(isAutoRun)
{
	this.M_applyPaperColor();
	this.M_applyArtwork();
	
}	
M_run()
{
	//this.m_timer= 	window.setInterval(this.M_update.bind(this), this.dt); 



}
M_launchAnimation()
{
	if(this.M_startAlgorithm)
		this.M_startAlgorithm();

}
M_initAnimationFrame(frameId,frameNb){
	this.M_clearMask();
	this.M_clearLog();
	this.M_clearDrawing();
	
}
M_update()
{

}

M_onAlgorithmDone()
{
	EventManager.M_asyncFire("AlgoDone",{},this,1);
	//if( !this.m_isGroupChkDone)
	//	this.M_makeSvgGroupsCheckboxes();
}
};

var A;



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/HatchGrids.js?v=1681489318

EventManager.M_on("RegisterFillStyles",function(){

    this._rF("HatchGrid",function(H,v){
        let _=this,u=_.u
        H.jointEnds = v.gB("jointEnds",1);
        H.grid=v.gF("grid",{x:5,y:5}); H.grid.x*=u,H.grid.y*=u
        H.m=v.gF("inMargin",{x:0,y:0}); H.m.x*=u,H.m.y*=u
        H.recurs=v.gB("recurs")
        H.m_spacing= H.m_lineSpacing = _._rPV(v,"lineSpacing",u,0);
        H.orientation = v.gF("orientation",0);
        H.distrFunc=HatchGridDistr.bind(_)
        H.isDistort = v.gB("distort",0);
        let ptrn=H.pattern=v.M_get('pattern');
        H.ptrnVariant= parseInt(v.gO('pattern','variant')??3)
        switch(ptrn)
        {   case 'dots':
            case 'stripe':
            H.enterCell=(i,j)=>{
                H.rnd??=ZMT.newRnd(0,"ls HatchGrid");
                let rnd
                switch(H.ptrnVariant)
                {   case 0:default: rnd=H.rnd()-0.5;break;
                    case 1: rnd=(i+j)%2?0:0.5; break;
                    case 2: rnd=(i+j)%2?-0.25:0.25; break;
                    case 3: rnd=-1+0.666*((i+j)%3);break;
                }
                let a=PI*rnd
                H.ca=cos(a)
                H.sa=sin(a)
                if( ptrn=='stripe')
                {   
                    H.hatchFunc=HatchGridStripe.bind(_);
                    H.rect=new ZRc(H.m.x/2,H.m.y/2,H.grid.x-H.m.x,H.grid.y-H.m.y)
                    H.xMax=Math.hypot(H.grid.x-H.m.x,H.grid.y-H.m.y)/2;
                    return -H.xMax;
                }
                else
                {    
                    H.hatchFunc=HatchGridDot.bind(_)
                    H.xMax=H.grid.x-H.m.x
                }

                return H.m.x;   // x init
            }
            H.R=H.grid.x/2-H.m.x;
            H.rt=(H.grid.y/2-H.m.y)/H.R;
            break;
            case 'flower':
            H.xMax=1
            H.kCenter=1*v.gO("pattern","kCenter",0.3)
            H.hatchFunc=HatchGridFlower.bind(_)
            H.enterCell=(i,j)=>{ 
                H.nbPetal=Math.ceil(H.grid.x/H.spacing);
                H.nbPts=H.nbPetal*20
                H.spacing=1; // will trigger only 1 instruction per cell
                return 0
            }
            break;
            case 'fish':
            H.xMax=H.grid.y-H.m.y
            
            H.enterCell=(i,j)=>{ 
                //H.spacing=1; // will trigger only 1 instruction per cell
                H.strong=1
                H.spacing=H.grid.x/Math.ceil(H.grid.x/H.spacing)
                let is=(i+j)%2
                H.shft=(i==0)&&!is
                H.hatchFunc= (is||H.shft)? HatchGridFish.bind(_) : ()=>null
                
                return 0
            }
                
            break;
            default:
            H.hatchFunc=HatchGrid.bind(_)
            H.xMax=H.grid.x-H.m.x
            H.enterCell=(i,j)=>{
                let spc=Math.max(H.spacing??0,1),nb= Math.ceil((H.grid.x-H.m.x-spc/2)/spc);
                return (H.grid.x-H.m.x-(nb-1)*spc)/2;
            }
            break;
        }
    })
    
})
let HGPatterns={'-':{name:"lines"},dots:{name:"dots"},stripe:{name:"Stripes"},flower:{name:"Flowers"},fish:{name:"Fish scales"}}
function HatchGridDistr(OBB,x,H)
{   let _=this;
    if(!OBB.grid)    // init
    {   // compute size of grid
        let w=H.grid.x,h=H.grid.y
        if(w<=0||h<=0)return;
        
        OBB.grid={i:0,j:0,w:w,h:h, ni:Math.ceil(OBB.w/w),nj:Math.ceil(OBB.h/h),on:1}
        _.pushDeform(H.isDistort)

         // Trying distortion ( works but TODO: sin wave based on document Width) 
         //OBB.grid.P=(x1,y1)=>OBB.o.M_plusU(OBB.I,x1-0.5*OBB.w).M_plusU(OBB.J,y1-0.5*OBB.h+h*0.3*sin((x1+y1)*4*PI/OBB.w) ) 

        if(H.isDistort)
        {   let zero2= new ZV2();
            OBB.grid.P=(x1,y1)=>{ 
                let p=zero2.M_plusU(OBB.I,x1-0.5*OBB.w).M_plusU(OBB.J,y1-0.5*OBB.h)
                if(0) p.M_addU(OBB.J,y1-0.5*OBB.h+h*0.3*sin((x1+y1)*4*PI/OBB.w))
                return _.Pj(new ZV3(p.x,p.y,0 ),OBB.o)
            };
        }
        else
            OBB.grid.P=(x1,y1)=>{
                let p=OBB.o.M_plusU(OBB.I,x1-0.5*OBB.w).M_plusU(OBB.J,y1-0.5*OBB.h)
                if(0) p.M_addU(OBB.J,y1-0.5*OBB.h+h*0.3*sin((x1+y1)*4*PI/OBB.w))
                return p;

            }
        x=H.m.x/2
    }
    let g=OBB.grid;
    if(g.on)
    {
        // g.i g.j = cell position. Cell dimensions = g.w, g.h
        // OBB definition : center = OBB.o[x,y] dimensions : [OBB.w, OBB.h]  orientation : basis(OBB.I, OBB.J)

        // point in the OBB 
        if(!H.spacing)  // it's a new cell
        {   
            if(H.recurs)H.heap=null
            let C2=g.P((g.i+0.5)*g.w,(g.j+0.5)*g.h)
            ,spc= Math.max(H.m_spacing.func.apply(this,[C2.x,C2.y,H.m_spacing.config]),H.m_strokeWidth)
            H.spacing=spc;
            if(H.enterCell) x=H.enterCell(g.i,g.j)
        }
        // Apply the function 
        var L,xMax=H.xMax
        if(H.recurs)
        {   
            // Make a heap ? 
            if(!H.heap)
            {   let rnd=(A.rndHatchGrid??=ZMT.newRnd(99,"rndHatchGrid"))
                H.heap=[],R=[]
                // feed the heap 
                R.push({i:g.i,j:g.j,w:g.w,h:g.h,iw:1,jh:1,lv:0})
                let hp
                let fn=(x,y,w,h)=>{
                    let min=1,max=0
                    for( let i=0; i<20;i++)
                    {   let C2={x: x+w*rnd(),y:y+h*rnd()}
                        let T=H.m_spacing
                        let hit=(T.func.apply(this,[C2.x,C2.y,T.config])-T.min)/(T.max-T.min)
                        if(hit<0.95)
                        {   if(hit<min) min=hit;
                            if(hit>max) max=hit;
                        }
                    }
                    if( (max-min)>=0 && (max-min)>0.4) return true;
                    if(rnd()<0.2) return true;
                    return false;
                }
                let isSubd=(x,y,w,h)=>{ return fn(x,y,w,h) && (w>_.u*3||h>_.u*3)}
                while(hp=R.pop())
                {   let C2=g.P( (hp.i+0.5*hp.iw)*g.w,(hp.j+0.5*hp.jh)*g.h)
                    if(isSubd(C2.x,C2.y,hp.w,hp.h) )
                    {   // push subdivision
                        if(1)   // Rectangular 
                        {   if(hp.lv%2==0)
                            {   R.push({i:hp.i,j:hp.j,w:hp.w,h:hp.h/2,iw:hp.iw,jh:hp.jh/2, lv:hp.lv+1})
                                R.push({i:hp.i,j:hp.j+hp.jh/2,w:hp.w,h:hp.h/2,iw:hp.iw,jh:hp.jh/2,lv:hp.lv+1})
                            }
                            else
                            if(hp.lv%2==1)
                            {   R.push({i:hp.i,j:hp.j,w:hp.w/2,h:hp.h,iw:hp.iw/2,jh:hp.jh,lv:hp.lv+1})
                                R.push({i:hp.i+hp.iw/2,j:hp.j,w:hp.w/2,h:hp.h,iw:hp.iw/2,jh:hp.jh,lv:hp.lv+1})
                            }
                        }
                        else
                        {   for( let i=0;i<2;i++)
                                for(let j=0; j<2; j++)
                                    R.push({i:hp.i+i*hp.iw/2,j:hp.j+j*hp.jh/2,w:hp.w/2,h:hp.h/2,iw:hp.iw/2,jh:hp.jh/2,lv:hp.lv+1})

                        }
                    } else H.heap.push(hp)

                }
            }
            if(!H.hp)
            {   // entering Heap cell
                H.hp=H.heap.pop();

                let C2=g.P((H.hp.i+H.hp.iw/2)*g.w,(H.hp.j+H.hp.jh/2)*g.h)
                ,spc= Math.max(H.m_spacing.func.apply(this,[C2.x,C2.y,H.m_spacing.config]),H.m_strokeWidth)
                H.spacing=spc;
                let rnd=-1+0.666*((H.hp.i*8+H.hp.j*8)%3),a=PI*rnd
                H.ca=cos(a)
                H.sa=sin(a)
                    
                H.rect=new ZRc(H.m.x/2,H.m.y/2,H.hp.w-H.m.x,H.hp.h-H.m.y)
                H.hXMax=Math.hypot(H.hp.w-H.m.x,H.hp.h-H.m.y)/2
                x=-H.hXMax;
            }
            xMax=H.hXMax
            if(H.hp)
                L = H.hatchFunc.apply(this, [OBB,{x:H.hp.i*g.w,y:H.hp.j*g.h,w:H.hp.w,h:H.hp.h},x,H] );  // dimensions problem..

        }
        else 
            L = H.hatchFunc.apply(this, [OBB,{x:g.i*g.w,y:g.j*g.h,w:g.w,h:g.h},x,H] );
        x+=H.spacing;

        if(x>=xMax)
        {   
            //console.log(`cell [${g.i},${g.j}]`)
            if(0) // send cell contour
            {   let contour = new ZPL( [g.P(g.i*g.w+x,g.j*g.h), g.P((g.i+1)*g.w+x,g.j*g.h),g.P((g.i+1)*g.w+x,(g.j+1)*g.h),g.P(g.i*g.w+x,(g.j+1)*g.h)])
                contour.M_closePath();
                L=[L,contour]

            }
            H.hp=null
            if( H.recurs && H.heap.length)
            {

            }
            else 
            {   H.heap=null
                // next cell
                x=H.m.x/2;
                H.spacing=undefined
                g.i++;
                if(g.i>=g.ni)
                {   g.i=0,g.j++;
                    if(g.j>=g.nj)
                    {    g.on=0        
                        _.popDeform();            
                    }
                }            
            }
        }
        return { x:x, L:L}        
    }

}
function HatchGrid(OBB,K,x,H)
{   let g=OBB.grid;
    let P1 = g.P(K.x+x,K.y+H.m.y/2)
    let P2 = g.P(K.x+x,K.y+K.h-H.m.y/2);
    return new ZPL([P1,g.P(K.x+x,K.y+K.h/2),P2]);
}

function HatchGridDot(OBB,K,x,H)
{   
    let g=OBB.grid,c = x-K.w/2;
    if( abs(c)<=H.R)
    {   let P=(x,y)=>g.P(K.x+K.w/2+x*H.ca-y*H.sa, K.y+K.h/2+x*H.sa+y*H.ca)
        let s=Math.sqrt(H.R*H.R-c*c)*H.rt
        let p0 = P(c,-s),
        p1 = P(c,0),
        p2 = P(c,s)
        return new ZPL([p0,p1,p2])
    }
    
}
function HatchGridStripe(OBB,K,x,H)
{   let g=OBB.grid,c = x
        
    let P=(x,y)=>new ZV2(K.w/2+x*H.ca-y*H.sa,K.h/2+ x*H.sa+y*H.ca)
    let L = new ZPL( [P(c,K.h),P(c,0),P(c,-K.h)] );
    let Ls= H.rect.M_clipLine(L)
    if( Ls&& (L=Ls[0])&&L.mP)
    {   
        L.mP= L.mP.map((p)=>g.P(K.x+p.x,K.y+p.y) ); return L;
    }
}
function HatchGridFlower(OBB,K,x,H)
{   let g=OBB.grid, L=new ZPL()
    for(let i=0; i<H.nbPts; i++)
    {   let a=PI*2*i/(H.nbPts-1)
        //let iPa = H.nbPetal*i/(H.nbPts-1);
        //let iPetal= iPa|0;
        //a-=sin((iPa-iPetal)*pi)*pi/H.nbPetal*2*2;
        
        let co=cos(a),si=sin(a)
        let kr=H.kCenter +(1-H.kCenter)*(1+sin(a*H.nbPetal))/2;
        
        L._aP( g.P(K.x+K.w/2+K.w*co*kr/2,K.y+K.h/2+K.h*si*kr/2) )

    }
    return L
}
function HatchGridFish(OBB,K,x,H)
{
    let g=OBB.grid, nbP=20,span=1,L=new ZPL()
    let kx=1-x/(H.xMax-H.spacing/2)
    let cosC2=1-kx
    let sinC2=sin(Math.acos(cosC2));
    if(H.shft)K.x-=K.w
    if(x>0) L._aP(g.P(K.x+K.w+K.w*kx,K.y+K.h*(sinC2-1) ))
    for( let i=0; i<nbP;i++)
    {   let a=PI*(0.5+span*(i/(nbP-1)-0.5)), co=cos(a),si=sin(a)
       
        let P=new ZV2(K.w+K.w*co*kx,K.h*si*kx/*-x*2$*/)
        L._aP( g.P(K.x+P.x,K.y+P.y) )

    }
    if(x>0) L._aP(g.P(K.x+K.w-K.w*kx,K.y+K.h*(sinC2-1) ));
    else if(H.strong)
    {   let L2=L.clone();
        L2.M_translate(0,H.m_strokeWidth*0.6)
        L.M_appendReverse(L2)

    }
    return L

}



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Algorithms/Grass.js?v=1681489318

class GrassAlgorithm extends ZPA
{
	constructor(name)
	{
		if( name==undefined)
			name = "Grass";
		super(name);
		this.svg=null;
		this.m_isNewImplementation=false;
		this._speciesOn=1
		
	}

	// Declares all the groups that a sketch can contain
	V_Svs()
	{	let _=this
		let d=(b,a)=>a.map((c)=>{_._Sv(b,c)})
		d('GrassHerb',["HerbHatches","Herb"])
		d('GrassDandelion'	, ["Dandelion","DandelionFlower"])
		d('GrassClover',["CloverFill","CloverStem","Clover","CloverFeatures"])
		d('GrassDaisy', ["DaisyHearts","DaisyStem","DaisyPetals","DaisyLeaf","DaisyFeatures"])
		d('GrassSunflower',["SunHearts","SunStem","SunPetals","SunLeaf","SunLeafFeat","SunHeartFeat"]);
		d('GrassPoppy',["PoppyHearts","PoppyStem","PoppyPetals","PoppyMask"])
		d('GrassMint',["MintLeaf","MintStem","MintFeatures"])
		d('GrassObject3D',["Faces","EdgesFlat","Edges"])
		d('TreeGrass',["Branches","Fruits","Leaves","LeafFeat"])
		d('GrassFern',["FernStem","FernLeaf"])
		d('IvyGrass',["Branches","Leaves","LeavesFeat","LeavesStem"])
		d('GrassObject3D',["Branches","Leaves","LeavesFeat","LeavesStem","Wires","Moss"])
		this._Sv('', "Background");
		//this._Sv('',"Debug", true, {m_strokeWidth:1, m_strokeColor:"rgba(255,0,0,0.7)",m_paletteTag:"custom"});

		
		
	}

	M_init(isAutorun)
	{
		
		this.svg= this.M_makeObjectSVG( "mainSVG",this.W,this.H );
		
		
		


		this.M_createMaskCanvas();
		this.M_createClipCanvas();
		this.m_isUseMask=this.gB("isUseMask");
		this.M_getAnimationParameters();
	
		// SVG
		var style= this.M_getStyleAsString(); 
		this.svg.append(	this.M_makeDefaultSvgGroup("0",style) );
		this._Svs();


		this.m_implantationFunc= this.M_doGrassAlgorithm.bind(this);






		this.M_initVariables().then(async ()=>
		{
			this.M_applySvgGroupsToSelect();

				if(isAutorun && !this.m_isAnimation)
					await this.M_startAlgorithm();		
		
		});
		this.M_applyArtwork();
		this.M_applyPaperColor();

		this.M_showWorkCanvases();
		
	}
	async M_initVariables()
	{
		// textures 
		await this.M_createTextures();
	

		//this.m_maskUnderneathHerb = true;

		this.m_depthScaleFactor = this.gF("depthScaleFactor",1.0);
		this.m_yStart = this.gF("yStart",-20);	this.m_yStart*=this.u;
		this.m_yFracStop = this.gF("yFracStop",1);	
		this.m_scaleStart = this.gF("scaleStart",1);
		if(!this.m_scaleStart) this.m_scaleStart=1;

		this.m_herbSpacing = this.gF("herbSpacing",8)*this.u;
		this.m_isSpacingScale= this.gO("herbSpacing","isScale")??false;
		this.m_protectionStrokeWidth = this.gF("protectionStrokeWidth",0.1)*this.u;
		this.m_isShortenJunctions = this.m_protectionStrokeWidth >= 1; 			// Shorter lines at junctions, to avoid overlapping when printing
		this.m_rndMethod = this.M_get("rndMethod","random");
		this.m_ownSeed = this.gI("ownDistrSeed",0)??0;
		this.m_isGlobalFuncDensity = this.gB("isGlobalFuncDensity",false);
		this.m_isGlobalDensityInverted = this.gB("isGlobalDensityInverted",false);
		this.m_isRelief = this.gB("relief",false);
		this.m_reliefParam = this.gF("reliefParam",{ ampl:27,noiseFact:1.5,noiseShift:0,isScale:0});
		this.m_isImplantMask=this.gB("isImplantMask",false);
		this.m_implantMaskName=this.M_get("implantMask","");
		if(this.gB("turnOffSpecies")) this._speciesOn=0


		this.m_globalFuncScale = this.gF("globalFuncScale",1.0);
		// this.m_strokeBackground = this.gF("strokeBackground",0)*this.u;
		//if( this.m_strokeBackground)
		//	this.m_maskUnderneathHerb = false;
		this.m_isMustEraseFirst = true;

		// SPECIES values
		await this.M_initSpeciesVariables();


		/*this.m_backgrounds = this.M_get("background");
		for( let i=0; i<this.m_backgrounds.length; i++)
		{ 	this.M_readBackgroundVars(this.m_backgrounds[i]);
		}*/
		//if(this.m_isMainAlgorithm)
		//	_UI=true;
		this.m_backgrounds = Backgrounds.M_createFromVars(this,this.M_get("background"));
		EventManager.M_fire("VariablesDone",{},this);
	}
	async M_initSpeciesVariables(vars)
	{	let _=this; vars??=_;
		_.m_segLength= _.printMm(2);
		_.m_species = vars.M_get("species");
		let SpecyNewGroup=(S,name)=>{S._g??={}; S._g[name]??=_.M_getGroupInstance(_._Sv(S.m_name, name))}

		for( let is=0; is<_.m_species.length; is++)
		{
			let S = _.m_species[is];
			if( S.m_name=="GrassHerb")
			{
				S.m_isHerb = true;
				_._rPV(S,"width",_.u,false); 			
				S.m_ondulation = S.gF("ondulation",{ang:35,noiseFact:5});


				S.m_LODthreshold = S.gF("LODthreshold",1.2)*_.u;
				S.m_isContour = S.gB("isContour",true);
				S.m_isMsk = S.gB("isMask",1);						
				S.m_eMin = S.gF("eMin",0); S.m_eMin*=_.u;
			}
			else if( S.m_name=="GrassDandelion")
			{ 
				S.m_isDandelion = true;
				
				S.m_flowerDiameter= S.gF("flowerDiameter");
				S.m_flowerDiameter.min*=_.u; S.m_flowerDiameter.max *=_.u;
				S.m_stemWidth= S.gF("stemWidth")*_.u;
				S.m_isHatchLeaves = S.gB("isHatchLeaves",false);

			}
			else if( S.m_name=="GrassClover")
			{	
				S.m_isClover = true;
				_._rPV(S,"height",_.u,false); 			
				S.m_stemWidth= S.gF("stemWidth")*_.u;
				S.m_leafShape= S.M_get("leafShape","Clover");
				S.m_nbLeaves = S.gI("nbLeaves",{min:3,max:3});
				S.m_heartShape = S.gF("heartShape",{min:0,max:0.18});
				S.m_isContour = S.gB("isContour",true);
			}
			else if( S.m_name=="GrassDaisy")
			{	
				S.m_isDaisy = true;
				_._rPV(S,"height",_.u,false);
				S.m_nbPetals = S.gI("nbPetals",20);
				S.m_isDrawHeart = S.gB("isDrawHeart",true);
				S.m_simplifyThres=S.gF("simplifyThres",0.5);
				S.m_coreRadius = S.gF("coreRadius",0.32);
				S.m_viewerOrientation = S.gF("viewerOrientation");
				S.m_stemWidth= S.gF("stemWidth")*_.u;

				S.m_leafShape= S.M_get("leafShape","None");
				if(S.m_hasLeaves= S.m_leafShape && S.m_leafShape!="None")
				{						
					S.m_leafOrganize = S.gF("leafOrganize",{nb:2,shiftDeg:90,seg:5,kStart:0.2,kEnd:0.6});
					S.m_leafOrganize.nb=parseInt(S.m_leafOrganize.nb);
					S.m_leafOrganize.seg*=_.u;
				}
			}
			else if( S.m_name=="GrassSunflower")
			{	
				S.m_isSunflower = true;
				_._rPV(S,"height",_.u,false);
				S.m_nbPetals = S.gI("nbPetals",20);
				S.m_isDrawHeart = S.gB("isDrawHeart",true);
				S.m_simplifyThres=S.gF("simplifyThres",0.5);
				S.m_coreRadius = S.gF("coreRadius",0.32);
				S.m_viewerOrientation = S.gF("viewerOrientation");
				S.m_stemWidth= S.gF("stemWidth")*_.u;
				S.m_stemSegment= S.gF("stemSegment",{min:10,max:10}); S.m_stemSegment.min*=_.u;S.m_stemSegment.max*=_.u;	

				S.m_leafShape= S.M_get("leafShape","None");
				S.m_leafOrganize = S.gF("leafOrganize",{nb:2,shiftDeg:90,seg:5,kStart:0.2,kEnd:0.6});
				S.m_leafOrganize.nb=parseInt(S.m_leafOrganize.nb);
				S.m_leafOrganize.seg*=_.u;
			}
			
			else if( S.m_name=="GrassPoppy")
			{	
				S.m_isPoppy = true;
				S.m_hasFlwAddons=true;
				_._rPV(S,"height",_.u,false); 			
				S.m_isDrawHeart = S.gB("isDrawHeart",true);
				S.m_viewerOrientation = S.gF("viewerOrientation");
				S.m_stemWidth= S.gF("stemWidth")*_.u;

				
			}
			else if( S.m_name=="GrassMint")
			{	
				S.m_isMint = true;
				_._rPV(S,"height",_.u,false); 			
				S.m_viewerOrientation = S.gF("viewerOrientation");
				S.m_stemWidth= S.gF("stemWidth")*_.u;
				S.m_stemSegment= S.gF("stemSegment",{min:10,max:10}); S.m_stemSegment.min*=_.u;S.m_stemSegment.max*=_.u;	
				S.m_leafShape= S.M_get("leafShape","Mint");
				S.m_leafOrganize = S.gF("leafOrganize",{nb:2,shiftDeg:90}); S.m_leafOrganize.nb=parseInt(S.m_leafOrganize.nb);
				S.m_isFeatures = S.gB("isFeatures",true);
				S.m_isContour = S.gB("isContour",true);
				S.m_noMask = S.gB("noMask",false);				
				S.m_stemKStart = S.gF("kStart",0);
				S.m_sizeFunc = S.M_get("sizeFunc","Straight");
			}
			else if( S.m_name=="GrassFern")
			{	
				S.m_isFern = true;
				_._rPV(S,"height",_.u,false); 			
				S.m_isDrawHeart = S.gB("isDrawHeart",true);
				S.m_viewerOrientation = S.gF("viewerOrientation");
				S.m_stemWidth= S.gF("stemWidth")*_.u;
				S.m_stemSegment= S.gF("stemSegment",{min:10,max:10}); S.m_stemSegment.min*=_.u;S.m_stemSegment.max*=_.u;	
				S.m_kStart = S.gF("kStart",0);
				S.m_leafSize  = S.gF("leafSize",{min:4,max:8,k:1,pow:1.5}); S.m_leafSize.min*=_.u; S.m_leafSize.max*=_.u;
				S.m_nbRoots= S.gI("nbRoots",{min:2,max:5});
				S.m_modulation = S.gF("modulation",{amplitude:0.3,noiseFact:1});
				S.m_leafShape= S.M_get("leafShape","-");

				
			}
			else if( S.m_name=="TreeGrass")
			{	
				S.m_isTree = true;
				_._rPV(S,"height",_.u,false); 			
				S.m_viewerOrientation = S.gF("viewerOrientation");
				S.m_maxLevel  = S.gI("maxLevel",{min:1,max:4});
				S.m_branchAngle  = S.gF("branchAngle",{min:20,max:40});
				S.m_e = 		S.gF("e",{root:2,min:0.2,length:0.8,branch:0.8});
				S.m_modulation = S.gF("branchModul",{amplitude:0,noiseFact:1});
				S.m_leafShape= S.M_get("leafShape","None");
				S.m_leafDistrib= S.M_get("leafDistrib",{rnd:0.1,height:0.5,level:0,nb:1});			// left refers to the last level, 1 to the last leve-1, etc
				S.m_isLeaves = S.m_leafShape && S.m_leafShape!="None";
				S.m_leafSize  = S.gF("leafSize",{min:4,max:8,k:1,pow:1.5}); S.m_leafSize.min*=_.u; S.m_leafSize.max*=_.u;
				S.m_isContour=S.gB("isContour",true);
				S.m_fillH		= S.gF("fillH",0);
				S.m_isFruits = S.gB("isFruits",false);
				S.m_isFruitsContour = S.gB("isFruitsContour",true);
				S.m_fruitSize = S.gF("fruitSize",{min:2,max:2}); for(let a in S.m_fruitSize) S.m_fruitSize[a]*=_.u;
				S.m_fruitStem	= S.gF("fruitStem",{length:0,e:0.3}); S.m_fruitStem.length*=_.u;S.m_fruitStem.e*=_.u;
				S.m_fruitDistrib= S.M_get("fruitDistrib",{rnd:0.01,height:0.5,level:0,nb:1});			// left refers to the last level, 1 to the last leve-1, etc
				S.m_fruitShape = S.M_get("fruitShape","round")??"round";
				_._rPV(S,"fruitRnd",1,false);
				S.m_intermediateBranch = S.gF("intermediateBranches",{rnd:0.1,height:0,level:0,newLevel:1});
				S.m_branchStrkLevelFact=S.gF("brnchFct",1)

			}
			else if( S.m_name=="IvyGrass")
			{	
				S.m_isIvy = true;
				_._rPV(S,"height",_.u,false); 			
				_._rPV(S,"leafsize",_.u,false); 

			}
			else if( S.m_name=="GrassObject3D")
			{	
				S.m_isObject3D = true;
				S.m_objShape = S.M_get("objShape","Cube");
				//if(S.m_objShape=="Extrude")
				//	_._Sv('GrassObject3D'	, "Wires");

				//$(`[name=${S.M_getVarName["objShape"]}`).parents('.panel2').first();
			
				S.m_isCutGround = S.gB("isCutGround",true);
				_._rPV(S,"height",_.u,false); 			
				_._rPV(S,"rotation",1,false); 			
				S.m_segmentHeight = S.gF("segmentHeight",100)*_.u;
				S.m_edgeAngleLimit = S.gF("edgeAngleLimit",0);
				S.m_segEdges = S.gF("segEdges",{seg:0,ampl:0,fact:1}); if(S.m_segEdges){S.m_segEdges.seg*=_.u;S.m_segEdges.ampl*=_.u; }
				S.m_param = S.gF("param",{ptMin:12,ptMax:12,decal:0.2,carveNb:3,shrink:0.4});
				

				_.M_makeBundleInstances(S,S.m_name);

				// Ivy add-on for objects
				let addons = S.gPk("addons","IvyObjectAddon",true);
				if( addons.length)
					S.m_ivy=[];
				for(let ia=0; ia<addons.length; ia++)
				{	
					let Ivy = addons[ia];
					S.m_ivy.push(Ivy);
					Ivy.m_isActive = Ivy.gB("isActive",true);
					Ivy.m_isDeformers = Ivy.gB("isDeformers",true);
					Ivy.m_maxLevel = Ivy.gI("maxLevel",{min:2,max:4});
					Ivy.m_nbTrees = Ivy.gI("nbTrees",{min:1,max:1});
					Ivy.m_leafShape= Ivy.M_get("leafShape","None");
					Ivy.m_treeShape= Ivy.M_get("treeShape","Ivy");
					Ivy.m_allLeavesFront = Ivy.gB("allLeavesFront",true);
					Ivy._g = S._g;
					_._rPV(Ivy,"height",_.u,false); 			
					_._rPV(Ivy,"leafsize",_.u,false); 

					// Create group instances for this species's name  
					
					// SVGGroup addons 
					let addons2 = Ivy.gPk("addons",_.M_getLineGroups(),true);
					for(let ib=0; ib<addons2.length; ib++)
					{	
						_._rS(Ivy,addons2[ib]);
					}
					// Hatch addons
					addons2 = Ivy.gPk("addons",_._gH(),true);
					for(let ib=0; ib<addons2.length; ib++)
						_.M_readHatchVariable(Ivy,addons2[ib]);


				}

			}
			else if( S.m_name=='GrassPattern')
			{
				//S.m_isSpecialSpecies = true;
				S.m_isPattern	= true;
				S.m_gridSize 	= S.gF("gridSpacing",{x:10,y:10});	for(let a in S.m_gridSize) S.m_gridSize[a]*=_.u;
				// height, decal ;.. 
				S.m_decal = S.M_get("decal","0");
				S.m_decalY = S.gF("decalY",0)??0;	S.m_decalY*=_.u;
				S.m_height =S.gF("height",{min:40,max:40});for(let a in S.m_height) S.m_height[a]*=_.u;
				S.m_shape = S.M_get("shape","circle");
				S.m_list 		= [];
			}
			else if( S.m_name=='GrassIncludeArtwork')
			{
				S.m_isAlgorithm 	= true;
				S.m_isSpecialSpecies = true;
				S.m_hasGroups = true;
				S.m_maxCalls 	 = 1;
				S.m_isActive 	= S.gB("isActive",true);
				S.m_isDeformers = S.gB("isDeformers",true);
				S.m_isWaitAsync=S.gB("isWaitAsync",true);
				S.m_isClipArea=S.gB("isClipArea",false);
				var art = S._V.artwork;
				let yStart = S.M_get("yStart","default");
				S._g={};
				S._g["Frame"]=_.M_getGroupInstance(_._Sv('GrassIncludeArtwork', "Frame"));
		
				if( art )
				{
					await _.M_includeArtwork(S,art);
					if( yStart !="default" )
					{	let f= parseFloat(yStart);
						if(S.A)
						{	S.m_yStart = f*_.u;
							S.A.m_isDeformers = S.m_isDeformers;
						}
					}
					
				}
				var me=this;
				//S.onAlgorithmList = function(s,err){ me.M_log("Got response from Ajax="+s);};
				//var algorithmName = S.M_get("algorithmName");
				//	RQSiteAdminAjaxCallPlugin("ListAlgorithms","action=getArtworkList&algorithmName="+algorithmName,"onAlgorithmList",S);

			}
			else if( S.m_name=='GrassMask')
			{
				S.m_isSpecialSpecies = true;
				S.m_events= new RQEventManager();
				S.m_isMask = true;
				S.m_isColor = S.gB("isColor",false);
				S.m_tag = S.M_get("tag");
				S.m_imagePath = S.M_getPath("image");
				S.m_yStart = S.M_get("yStart",0);	S.m_yStart*=_.u;
				S.m_maxCalls 	 = 1;
				S.m_isActive 	= S.gB("isActive",true);

			}
			else 	// Special in Sobj
			{
				S.m_isSpecialSpecies=1
				let Sobj;
				console.warn(`_.m_species[is]  = ${RQPrintR(_.m_species[is])}`);
				if(_.OBJs && (Sobj=_.OBJs.M_createOne(_,_.m_species[is])))
				{	S=_.m_species[is]=Sobj;
					S.M_init(_);
				}

			}
			// Common to species
			// -----------------	
			if( !S.m_isSpecialSpecies)
			{
				
				// Make a random function for this species
				

		
				S.m_isActive = S.gB("isActive",true);
				/*if(S.m_isActive && S.m_isPattern)
					_.m_isNoReverse = true;
				*/
				S.m_isDeformers = S.gB("isDeformers",true);
				S.m_isGlobalImpl = S.gB("isGlobalImpl",true);
				S.m_yRange = S.gF("yRange",{min:-0.5,max:1});
				S.m_xRange = S.gF("xRange",{min:-0.5,max:1.5});
		   	    S.m_isFreeUpRange = S.gO("yRange","freeup");

				_._rPV(S,"density",0.01,false); 
				_._rPV(S,"size",_.u,false); 
				if(S.m_spacing		= S.M_get("spacing")) {S.m_spacing.min *= _.u; S.m_spacing.max *= _.u;}
				_._rPV(S,"torsion",1,false);

				S.m_isFillStem = S.gB("isFillStem",true);
			}
			if(S.m_hasFlwAddons)
			{
				let i,a1 = S.gPk("flwAddons",["flwStamen","flwPetals"],true);
				for(i=0; i<a1.length; i++)
				{  let F=a1[i];
					switch(F.m_name)
					{	case 'flwStamen':
						{	S.hasStamen=F.gB('active',true);
							let O=S.Stmn={};
							O.len = F.gF("stamenLen");
							O.nb = F.gI("dotNb");
							O.rnd=ZMT.newRnd(1+_.m_seed,"flwStamen");	// DANGEROUS
							O.dotRad =F.gF("dotRad");
							SpecyNewGroup(S,'StamenTip');
							SpecyNewGroup(S,'Stamen');


						}
						break;
						case 'flwPetals':
							S.m_ptlShape=F.M_get("shape");
							S.m_ptlRatio=F.gF("ratio",0);
							S.m_ptlFeat=F.M_get("feat","-");
							if(S.m_ptlFeat && S.m_ptlFeat!="-")
							_._Sv(S.m_name,'PetalFeat');
						break;
						
		
					}
				}

			}
			if(S.m_hasGroups || !S.m_isSpecialSpecies)
			{
		
				// Create group instances for this species's name  
				if(!S.m_isObject3D)		// ( already done)
					_.M_makeBundleInstances(S,S.m_name);
			
				// SVGGroup addons 
				var addons = S.gPk("addons",this.M_getLineGroups(),true);
				for(let ia=0; ia<addons.length; ia++)
				{	
					_._rS(S,addons[ia]);

				}
				// Hatch addons
				addons = S.gPk("addons",_._gH(),true);
				for(let ia=0; ia<addons.length; ia++)
					_.M_readHatchVariable(S,addons[ia]);



			}


		}
		// Read global SVG groups
		//_.M_applySvgGroupsToSelect(_.M_getElt("styles"));
		let gps = _.gPk("styles",_.M_getLineGroups(),true);
		for(let ia=0; ia<gps.length; ia++)
		{	
			_._rS(this,gps[ia]);

		}
		let gps2 = _.gPk("styles",_._gH(),true);
		for(let ia=0; ia<gps2.length; ia++)
		{	_.M_readHatchVariable(this,gps2[ia]);
		}
		
	}
	M_getSpecyByName(n,id)
    {
        for(let i=0; i<this.m_species.length; i++)
        {   let S= this.m_species[i];
            if(S.m_name==n && (id===undefined || id==S.m_title ))
                return S;
        }
    }
	M_getSpecies(n,id)
    {	let out=[]
        for(let i=0; i<this.m_species.length; i++)
        {   let S= this.m_species[i];
            if( (n===undefined || S.m_name==n) && (id===undefined || id==S.m_title ))
                out.push(S);
        }
		return out;
    }
	M_getImplantationFunction()
	{
		if(this.m_implantationFunc)
		{	return this.m_implantationFunc;
		}
		else return async function(){}.bind(this);
	}
	async M_startAlgorithm()
	{
		if(this.m_isMainAlgorithm && this.m_isMustEraseFirst)
		{	this.M_clearDrawing();		
			//this.M_clearLog();
			this.M_clearMask();
		}
		// reinit the seed
		this.M_seed(this.m_seed);
		let rnd=this.random()
		noise.seed(rnd);
		
		// dist. seed
		let ods=this.m_ownSeed;
		if(ods)
		{	console.log('Using distr. RNG');
			this.m_distrRnd = ZMT.newRnd(ods);
		}
		if( !this.m_speciesRandomDone)
			this.M_initSpeciesRandom();
		
		await this.M_getImplantationFunction()().then(
			function(){console.log("OK Done !");},
			function(error){console.error("Ooops error in the async function",error);}
		);
	
	
	}
	M_initSpeciesRandom()
	{
		this.m_speciesRandomDone = true;
		for( let is=0; is<this.m_species.length; is++)
		{
			let S = this.m_species[is];
			//S.random=sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, S.gI("seed",this.m_seed ));
			S.random=ZMT.newRnd(S.gI("seed",this.m_seed),S.m_name);
			if( S.m_name=="IvyGrass" || (S.m_name=="GrassObject3D" && S.m_ivy))
			{
				if(S.m_ivy)
				{	for(let ii=0; ii<S.m_ivy.length; ii++)
						//S.m_ivy[ii].random=sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, S.m_ivy[ii].gI("seed",this.m_seed ));
						S.m_ivy[ii].random=ZMT.newRnd( S.m_ivy[ii].gI("seed",this.m_seed ));
						
				}
				if( !this.randomLeaves )
				{
					let leavesSeed = S.random();
					this.M_seed( parseInt(leavesSeed*100),"Leaves");	
					let maxDepth = 10; 
					for( let i=0;i<=(maxDepth+1);i++)
					{
						this.M_seed( parseInt(S.random()*100),"Depth"+i);	
					
					}
					this.M_seed(parseInt(S.random()*100),"Young");
				}					
			}

		}
	
	}

	async M_onAlgorithmDone() 
	{ 	if(this.m_isMainAlgorithm)
			super.M_onAlgorithmDone();
		
		if( this.m_isAnimation)
		{
			var anim = this.m_animation;
			// { frameNb: 30, frameId: 0} 
			// anim frame id
			let s="";
			var f=0+anim.frameId;
			for( let i=0;i<4; i++)
			{	s = s.replace (/^/,Number(f%10).toString());
				f=parseInt(f/10);			
			}
			//downloadSVG($('#ARTWORK').html(),this.m_title+"_"+s+".svg");
			let fileName = this.m_title+"_"+s+".png";
			await makeSnapshot(this,$('#ARTWORK').html(),fileName,1920).then(

				function()
				{
		
					
					anim.frameId++;
					if( anim.frameId <anim.frameNb)
					{
						this.M_initAnimationFrame(anim.frameId,anim.frameNb);
						// clear the mask
						this.M_clearMask();
						this.M_clearLog();
						// clear the groups / PNG
						this.M_clearDrawing();
						this.m_speciesRandomDone = false;

						// reset child algorithms
						for( let is=0; is<this.m_species.length; is++)
						{	let S = this.m_species[is];
							if( S.m_isAlgorithm )
							{	S.m_isPrinted = false;
							}
						}

						
						
						// relaunch anim
						if( !this.M_isAbort())
							self.setTimeout(this.M_startAlgorithm.bind(this),10);
					
					}
				}.bind(this),
				function(error)
				{
					
				}
			);
		}
	}
	M_initAnimationFrame(frameId,frameNb)
	{
		// update parameters
		this.m_animated[0].t = frameId/frameNb;
		this.m_animated[0].tsin = sin(2*PI*this.m_animated[0].t);
	}
	// ---------------------------------------------
	// M_getNamedFunction   
	// ---------------------------------------------
	M_getNamedFunction(name)
	{
		if(name=="GlobalFunction")
		{	return this.M_globalFunction;	
		}
		else
			return super.M_getNamedFunction(name);

	
	}
	M_globalFunction(x,y,o)
	{	if(o===undefined)
			o={min:0,max:1,isMapRange:false}
		if( o.isAnimated)
		{	let dir = PI*2*(o.rnd+this.m_animated[0].t);
			 let r = this.m_animated[0].tsin *this.W;
			 x+= r*cos(dir) ; y+r*sin(dir);
		}
		var C = new ZV2(this.W*0.5, this.H*(1-this.m_documentHorizon*0.5));
		var D = Math.min(this.W*0.5,this.H*this.m_documentHorizon*0.5)*this.m_globalFuncScale;
		var h = Math.hypot( x-C.x,y-C.y)/D; 
		h= ZMT.M_clamp(h,0,1);
		var rnd=h*h;
		if( o.isMapRange)
		{	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max,0,1);		
		}
		return o.min + (o.max-o.min)*rnd;
	}	

	// ---------------------------------------------
	//  M_doIncludedAlgorithm
	// ---------------------------------------------
	async M_doIncludedAlgorithm(_,opt)
	{	this.includedFrom=_;
		opt??={}
		if(_) _.m_waitingfor++;
		if( !this.m_speciesRandomDone)
			this.M_initSpeciesRandom();
		if(opt.wait)
		{	await this.M_doGrassAlgorithm();
			
		}
		else this.M_doGrassAlgorithm();
	
	}

	// ---------------------------------------------
	//  M_doGrassAlgorithm
	// ---------------------------------------------
	async M_doGrassAlgorithm()
	{
		var y = this.H -this.m_yStart; /*+20*this.u*/;		
		var yMax = this.H*this.m_documentHorizon;
		this.nbRowsOfGrass = 0; 
		var scale = this.m_scaleStart;

		var signDir = 1;
		let isBreak=false;
		while ( y > this.H-yMax)
		{
			this.m_currentY = y;

			//  run other algorithms
			await this.M_runSpecialSpecies(y);

			this.nbRowsOfGrass ++;
			scale =  ZMT.M_map( y,this.H,(1-this.m_documentHorizon)*this.H,this.m_scaleStart, this.m_depthScaleFactor);   // 1. -(1.-this.m_depthScaleFactor)*(this.H-y)/this.H;

			isBreak=false;			
			await this.M_makeLineOfGrass(y,scale,signDir).then((isStop)=>{
				if(isStop)
				{	
						isBreak=true; 
				}
			});
			if( isBreak)
				break;
			y-= 4*this.u*scale;
			if(!this.m_isNoReverse)
				signDir = -signDir;
			
			//if((this.nbRowsOfGrass%5)==1)
				 await sleep(1);

		}
		// run specials again, in case we missed them
		await this.M_runSpecialSpecies(0);


		this.m_abort=false;
		while(this.m_waitingfor>0)
		{	
			if(this.M_isAbort())
			{	for( let is=0; is<this.m_species.length; is++)
				{	let S = this.m_species[is];
					if(S.A )
						S.A.m_abort=true;
				}
			}
			else
				await sleep(20);
		}

		if( this.m_outputFormat=="PNG" )
		{
			this.M_putWorkareaInStack();		// doesn't seem to work in the right order
		}

		let b;
		if( b=this.m_backgrounds)
			for(let i=0; i<b.length; i++)
				b[i].M_drawOnce(this)


		// draw lines to Svg when done

		// Finish
		this.m_abort = false;
		if(this.includedFrom)
		{	this.includedFrom.m_waitingfor--;
		}
		else await this._DLToSvg();

		await this.M_onAlgorithmDone();

	
	}
	async M_runSpecialSpecies(y)
	{
		//let  ky= ZMT.M_map( y,this.H,(1-this.m_documentHorizon)*this.H,0, 1);	// problem : value is clipped under 0
		let ky = (this.H-y)/this.m_documentHorizon/this.H

		for( let is=0; is<this.m_species.length; is++)
		{	let S = this.m_species[is];
			if( S.m_isAlgorithm && S.m_isActive && S.A && !S.m_isPrinted)
			{	
				//let yAlgo = S.A.m_yStart ? S.A.m_yStart : 0; 
				let yAlgo=S.m_yStart;
			
				if( (this.mwA.top()-yAlgo)>y)
				{
					S.m_isPrinted = true;
					console.group("Calling M_startAlgorithm on "+S.A.m_name);
					if(S.A.cbStart) S.A.cbStart.apply(this,[S])
					S.A.m_mask = this.m_mask;
					S.A.m_isUseMask = true;
					let isSync=S.m_isWaitAsync;
					if(isSync && S.m_isClipArea)
					{	
						S.A.M_clipToWorkArea(false,this.m_mask);
					}
					let _=this;
					console.log(`DOING included algo yAlgo=${yAlgo} - y = ${y}`);
					if(this.M_isDoIncludedArt(S,S.A))
					{
						await S.A.M_doIncludedAlgorithm(this,{wait:S.m_isWaitAsync}).then(
						()=>{
								console.log("OK Included art Done !");
								console.groupEnd();
								if(isSync)
								{	console.log("Unclipping mask");
									_.m_mask.M_popState(0);
									// maybe unclip must go into heap as well ?
									//_.M_clipToWorkArea(_.m_mask);
									// clip back to main algorithm
									_.M_clipToWorkArea();
								}
								if(S.m_isClipArea)
								{	_._dM(S.A.mwA._cP())

								}

							},
						function(error){console.log(" M_doIncludedAlgorithm: Ooops error in the async function");console.groupEnd();}
						);
					}

				/*self.setTimeout( async function(S){ 
						);
					
					}.bind(this,S),0);
				*/
				}
				

				//self.setTimeout(S.A.M_startAlgorithm.bind(S.A),0);
			}
			else if(S.m_isMask && S.m_isActive && !S.m_isPrinted)
			{
				let yAlgo = S.m_yStart ? S.m_yStart : 0; 
			
				if( (this.mwA.top()-yAlgo)>y)
				{
					S.m_isPrinted = true;
					
					// TODO : blend mode LIGHTEN 
					await this.M_loadImage( S,"m_image",S.m_imagePath ).then(img=>{
						let _=this,evt=(texture)=>{if( S.m_events) S.m_events.M_fire("draw",{S:S,tex:texture},_)}
						if( S.m_isColor)
						{	//evt(S.m_image);
							this.M_drawImage(S.m_image,this.mdA)	
						}
						var tex=img;
						if(S.m_isColor||S.m_events)
						{	var t=new Texture({image:S.m_image});
							t.M_drawImage({img:img});
							evt(t);
							if(S.m_isColor)
							{
								var imgd =t._X().getImageData(0,0,t.m_width,t.m_height);
								var pix = imgd.data,k=0;
								for( let j=0; j<t.m_height; j++)
								{	for( let i=0; i<t.m_width; i++)
									{	let lum=pix[k+3]/255;
										pix[k] =pix[k+1]=pix[k+2]= (255*lum+0*lum)|0;
										pix[k+3]=222;
										k+=4;
									}
								}
								t._X().putImageData(imgd,0,0);
								tex=t.m_canvas;
							}
							
						}
						var context = this.m_mask._X();
						context.globalCompositeOperation = "lighter";
						this.m_mask.M_drawImage({img:tex});			
						context.globalCompositeOperation = "source-over";							

					}); 

				}				
			}
		}
		// backgrounds
		let b;
		if( b=this.m_backgrounds)
			for(let i=0; i<b.length; i++)
				if(ky>=b[i].m_kStart)
					if(b[i].M_drawOnce(this))
					{	b.splice(i,1);i--
					}

	}
	M_isDoIncludedArt(S,algo){return true;}
	// ---------------------------------------------
	VM_onLineOfGrassBegin(yFrac,y,scale){}
	// ---------------------------------------------
	// M_makeLineOfGrass
	// return true if stop
	// ---------------------------------------------
	M_makeLineOfGrass = (y,scale,signDir)=>new Promise((resolve, reject) => 

	//async M_makeLineOfGrass(y,scale,signDir)
	{
		//
		let _=this;
		if( signDir==undefined)
			signDir = 1;
		let shiftX = this.m_herbSpacing/2*scale; 
		var xMin = this.m_xBounds==undefined ? -shiftX : this.m_xBounds.min; 
		var xMax = this.m_xBounds==undefined ? this.W+shiftX : this.m_xBounds.max; 
		let yFrac = this.m_yFrac=(this.H-y)/this.H;
		if( yFrac>=this.m_yFracStop)
		{	
			resolve(true);
		}
		this.VM_onLineOfGrassBegin(yFrac,y,scale);
		//x-=shiftX;
		//xMax-=shiftX;
		//console.log("M_makeLineOfGrass("+y+","+scale+") x="+x+" this.W="+this.W);
		
		var opt = {x:0,y:y,seg:this.m_segLength,scale:scale}
		let x0=signDir<0?xMax:xMin,xStop=signDir<0?xMin:xMax;
		// repartition
		var isDensityGlobalFunction = this.m_isGlobalFuncDensity;
		var flowers=[];
		
		
		let _rndFunc =  _.m_rndMethod=="noise"? (x,y)=>_.M_functionNoise(x,y,{min:0,max:1,shift:{x:0,y:0}}) : (_.m_distrRnd? (x,y)=>_.m_distrRnd(): (x,y)=>_.random());


		// x<xMax => x-xMax<0
		// x>xMin => -(x-xMin)<0 
		for(let x=x0;signDir*(x-xStop)<0;  )
		{

			if(this.M_isAbort() )
			{	
				resolve(true);
			}

			var sumDensities = 0; 
			var areCustomDensities = false; 
			var customSumDensity=false;
			for( let is=0; is<this.m_species.length; is++)
			{	let S = this.m_species[is];
				S.inRange =  S.m_yRange? (S.m_yRange.min<=yFrac && S.m_yRange.max>=yFrac):1;
				// x range
				let xFrac = (x-xMin)/(xMax-xMin);
				S.inRange&=(S.m_xRange?(xFrac>=S.m_xRange.min && xFrac<=S.m_xRange.max):1);
	

				if(!S.m_isGlobalImpl) areCustomDensities=true;
				if(S.m_isActive && (!S.m_isSpecialSpecies) && (S.inRange||!S.m_isFreeUpRange) )
				{	let densityFunc=(S.m_rndDensity= S.m_density.func.apply(this,[x,y,S.m_density.config] ));
					sumDensities+=densityFunc ;
					if(!S.m_isGlobalImpl)
						customSumDensity+=densityFunc;
				}
				else 
					S.m_rndDensity = 0;
			}
			if( sumDensities<1)
				sumDensities = 1;
			if(customSumDensity<1)
				customSumDensity=1;

			opt.x=x*1;
			opt.y=y*1;
			if(this.m_isRelief)
			{	let a=this.m_reliefParam;
				opt.y += this.u*a.ampl*(a.isScale?scale:1)*Noz( a.noiseFact*opt.x/this.W+a.noiseShift,opt.y/this.H);		// TODO : heightmap
			}

			// Implantation func
			var advanceW = this.m_herbSpacing;//*scale;
			var globFunc =  this.M_globalFunction(x,y);
			if(this.m_isImplantMask)
			{	if(!this.m_implantTex )
				{
					this.m_implantTex = {tex:this.M_getTexture(this.m_implantMaskName),shift:{x:0,y:0},min:0,max:1}
				}
				else if( this.m_implantTex.tex)
				{	isDensityGlobalFunction	=true;
					globFunc = this.M_functionTexture(x,y,this.m_implantTex)
				}
			}
			// invert density
			if(this.m_isGlobalDensityInverted) globFunc = 1-globFunc;

			//S.m_isGlobalImpl? 
			let globRnd=1;
			let globCheck = areCustomDensities? true : (!isDensityGlobalFunction) || ((globRnd=_rndFunc(x,y))>globFunc);
			if(globCheck)
			{	/*let rnd = ZMT.random()/sumDensities*/;
				//let rnd = this.M_functionNoise(x,y,{ min: 0, max: sumDensities, noiseFactX : 2000, noiseFactY:500});
				let _rnd = _rndFunc(x,y) ; //this.random();
				//this.rndLog=(this.rndLog??0)+1
				//if( this.rndLog<500) { console.warn(`species ${this.rndLog}. RND=${_rnd}`)}
				let rnd = _rnd * sumDensities;
				let rndCustom = _rnd*customSumDensity;
				let thres=0;
				let thresCustom=0;
									
				for( let is=0; is<this.m_species.length; is++)
				{	let S = this.m_species[is];
					if( S.m_isActive && !( isDensityGlobalFunction && S.m_isGlobalImpl && !(globRnd>globFunc)))
					{	if(  (S.m_isGlobalImpl||!isDensityGlobalFunction)? rnd< (thres+=S.m_rndDensity) : rnd<(thresCustom+=S.m_rndDensity))
						{

							opt.S=S;

							advanceW = this.M_drawSpecy(S,opt)??this.m_herbSpacing*scale;
							// break 
							break;	
						
						}
					}
				}
				
			}
			// avance x
			if(this.m_isSpacingScale) advanceW*=scale;
			x+= signDir*advanceW;//*( 1.5+0.8*Noz(x/13,y/28) );
		}
	
		// Send the flowers after the line of grass
		for( let i=0; i<flowers.length; i++)
		{
			let f = flowers[i]
			f.fn.apply(this,[f.opts]);
		}
		
		this.nbRowsOfGrass--;
		resolve(false);

	});


	M_drawSpecy(S,opt)
	{	let advanceW = undefined;
		if( S.inRange&&this._speciesOn)
		{	A.m_deformersActive = S.m_isDeformers;
			// do something	
			if( S.m_isDandelion )
			{
				flowers.push( {fn:this.M_putDandelion,opts: {...opt} })
				
			}
			else if( S.m_isClover)
			{
				advanceW = this.M_putClover(opt);
			
			}
			else if( S.m_isDaisy)
			{
				advanceW = this.M_putDaisy(opt);
			
			}
			else if( S.m_isSunflower)
			{
				advanceW = this.M_putSunflower(opt);
			
			}
			else if( S.m_isPoppy)
			{
				advanceW = this.M_putPoppy(opt);
			
			}
			else if( S.m_isHerb)
			{
				for( let iHerb=0; iHerb<2; iHerb++)
				{	opt.grassStrandId = iHerb;
					advanceW = this.M_putHerb(opt);
				}
			
			}
			else if( S.m_isPattern)
			{
				this.M_putPattern(opt);
			}
			else if( S.m_isFern)
			{
				advanceW = this.M_putFern(opt);
				
			}
			else if( S.m_isMint)
			{
				advanceW = this.M_putMint(opt);
			
			}
			else if( S.m_isTree)
			{
				advanceW = this.M_putTreeGrass(opt);
			
			}
			else if( S.m_isIvy)
			{
				advanceW = this.M_putIvyTree(opt);
			
			}
			else if( S.m_isObject3D)
			{
				advanceW = this.M_putObject3D(opt);
			}
		}
		return advanceW;
	}


	// ---------------------------------------------
	//  PutHerb
	// ---------------------------------------------
	M_putHerb(opt)
	{
		var S=opt.S;
		var context = this.m_mask._X();			
		var sz = opt.scale; 
		S._g.Herb.M_applyScale(opt.scale);

		var grassW = opt.grassW= S.m_width.func.apply(this,[opt.x,opt.y,S.m_width.config] )*opt.scale;
		var spacing = grassW+(S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;

		//opt.x+=spacing*0.5;
		var grassH = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;
		var segmentLength = opt.seg;
		var segLen =  segmentLength;
		var nbSegs = Math.ceil(grassH/segLen);
		segLen = grassH/nbSegs;
		
		let strandShift = (0+opt.grassStrandId)*300;
		var dirChange = S.m_torsion.func.apply(this,[opt.x+strandShift,opt.y,S.m_torsion.config] ); 
		dirChange /= (grassH/segLen); 

		let line = new ZPL();
		let line2 = [];
		var direction = 0.;
		
		let C=new ZV2(opt.x,opt.y);
		var x2=0;
		var y2=0;
		var e;
		var eMin =  S.m_eMin? S.m_eMin*opt.scale  : Math.max(grassW/8, this.m_strokeWidth*4); 
		var kH;
		var seg=0;
		var kInflection = 0.6;
		var kDivider = grassH*(1-kInflection); kDivider = 1 / (kDivider*kDivider);
		let isNoiseDirection = S.m_ondulation.ang!=0; 
		
		let noiseDir=0;
		for( let iSeg = 0; iSeg<=nbSegs; iSeg++,seg+=segLen, direction+=dirChange)
		{
			kH = seg/grassH;
			// e= eMin + (grassW-eMin) * cos(-PI/2 + kH*PI);
			let mul  = Math.max(0,(1-(seg-grassH*kInflection)*(seg-grassH*kInflection)*kDivider ));
			e= grassW *mul ;
			
			if( isNoiseDirection)
			{	noiseDir = S.m_ondulation.ang*Noz( (opt.x+strandShift*mul)/this.W,opt.y+seg/this.H*S.m_ondulation.noiseFact/sz);
			}
			if( iSeg<nbSegs/2)
				e= Math.max(e,eMin);

			let I = new ZV2(cos((direction+noiseDir)*D2R),sin((direction+noiseDir)*D2R));
			let J = new ZV2( I.y,I.x );
			if( seg>0)
			{
			   x2+=J.x*segLen;
			   y2+=J.y*segLen;
			}
			var p = new ZV3(x2-I.x*e/2,y2-I.y*e/2,0);
			line._aP( this.Pj(p,C));
			if( iSeg<nbSegs)
				line2.push( this.Pj(new ZV3(x2+I.x*e/2,y2+I.y*e/2,0),C));



		
		}

		// merge lines
		const mergeLines = ()=>{
			let p2;
			while(p2=line2.pop())
			{	line._aP(p2);						
			}
		}
		let isTooThin = grassW< S.m_LODthreshold ;
		if( !isTooThin)
			mergeLines();
		if( S.m_isContour)
		{	//S._g.Herb.m_lines.push(...this.M_computeLineMask(line));
			this._DL(S._g.Herb, line,true);
		}
		if( isTooThin)
			mergeLines();
	
		// Hatching herb with H group			
		let Fs = S._g.HerbHatches.fills; 
		let F;
		if( isArr(Fs))
		{
			for(let iF=0; iF<Fs.length; iF++)
			{
				if( F =Fs[iF])
				{	F.orientation=direction / 2+90; //this.random()*180;
					F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*S.random();
					//F.jointEnds = true;
					
					//F.m_lines.push( ...this.M_hatchShape( line ,F));
					this._Fl(F,line,F); 

				}
			}
		}
	
		
		
		// draw the herb in the mask
		if(S.m_isMsk)
			this._dM(line)


		return spacing;
	}
	
	// ---------------------------------------------
	// DANDELION
	// ---------------------------------------------
	M_putDandelion(opt)
	{
		var sz = opt.scale;

		var S = opt.S;
		var grassH = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;

		opt.grassH = grassH;
		var direction = 0;
		var x2 = opt.x;
		var y2 = opt.y;
		var segLen = opt.seg;
		var dirChange = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ); 
		

		dirChange /= (grassH/segLen); 

		var dandelionRadius = (S.m_flowerDiameter.min + ( S.m_flowerDiameter.max-S.m_flowerDiameter.min )*S.random())* sz*0.5;
		var J = new ZV2(0,1);
		var I = new ZV2(1,0);
		
		// Leaves 
		var nbLeaves = 3+Math.round(4*S.random());

		//opt.leafHatchMargin 		= S.m_isHatchLeaves? 3*this.m_strokeWidth:0;

		opt.leaves = { open: {min:0.2 , max:0.5}, inclinaison: direction, bend : 60+50*S.random(), viewerInclinaison: 10, rotationStart: S.random()*180, length: grassH*0.35, width: grassH*0.35*0.18, centerLine:true, group : opt.S._g.Dandelion }

		this.M_organizeLeaves(this.M_drawDandelionLeaf, opt,"front",nbLeaves);

		
		// STEM
		var e= S.m_stemWidth*sz;
		var stemLines = [];
		for( let ie=-e/2; ie<e/2; ie+=this.m_strokeWidth*2) // TEMP 1.2
		{
			x2 = opt.x;
			y2 = opt.y;			
			direction = 0;
			let line = new ZPL();
			for( var seg=0.; seg<=grassH; seg+=segLen) 
			{
				J.M_set(sin(direction*D2R),cos(direction*D2R));
				I.M_set( J.y,J.x );

				line._aP( x2+I.x*ie,y2+I.y*ie);
			
				seg+=segLen;
				
				direction+=dirChange;
				if( seg<=grassH)
				{
					x2+=J.x*segLen;
					y2-=J.y*segLen;
				}
			}
			stemLines.push(line);
		}
		if( stemLines[0].M_nb()>=2)
		{
			// end point 
			var end = stemLines[0].M_endPoint(); 
			// Make a path with stem for masking
			var pathPoints = "M ";
			if( true )
			{
				var l1 = stemLines[0];
				var l2 = stemLines[stemLines.length-1]; 
				var nbpoints = l1.M_nb();		
				for( let ip=0; ip<nbpoints; ip++)
				{
					let p =l1.M_getPoint(ip);
					pathPoints+=(ip==0?"":" L ")+p.x+" "+p.y;				
				}
				nbpoints = l2.M_nb();		
				for( let ip=nbpoints-1; ip>=0; ip--)
				{
					let p =l2.M_getPoint(ip);
					pathPoints+=" L "+p.x+" "+p.y;				
				}
				// loop
				let p = l1.M_getPoint(0);
				pathPoints+=" L "+p.x+" "+p.y;				
				
			}

			// Dandelion flower center 
			var C = new ZV2( end.x +J.x*dandelionRadius*0.8, end.y-J.y*dandelionRadius*0.8);


			// draw the stem lines 
			for( let il=0; il<stemLines.length; il++)
			{	this._DL(S._g.Dandelion,stemLines[il],true);
				//S._g.Dandelion.m_lines.push(...this.M_computeLineMask(stemLines[il]));
			}


			// Draw the flower lines
			var lineSep = 3*this.m_strokeWidth;
			var nbLines = Math.max( 8, 2*Math.round(2*PI*dandelionRadius / (lineSep+this.m_strokeWidth+this.m_protectionStrokeWidth)/2));
			var a = 0;
			var aIncrement = 2*PI/nbLines;
			var I = new ZV2();
			var i=0;
			for( a=2*PI; a>0; a-=aIncrement)
			{
				I.M_set(cos(a),sin(a));
				let r= dandelionRadius*(0.7+0.3*S.random());
				let lineLength = r/( (i%2)? 3:5) ;
				let radiusStart = r-lineLength/2;
				let radiusEnd = r+lineLength/2;
				this._DL(S._g.DandelionFlower, new ZL(  new ZV2(C.x+I.x*radiusStart, C.y+I.y*radiusStart), new ZV2(C.x+I.x*radiusEnd, C.y+I.y*radiusEnd)  ), true);
				//S._g.DandelionFlower.m_lines.push( ...this.M_computeLineMask( new ZL(  new ZV2(C.x+I.x*radiusStart, C.y+I.y*radiusStart), new ZV2(C.x+I.x*radiusEnd, C.y+I.y*radiusEnd)  ))) 
				i++;
			}
			// draw Dandelion center
			let Fs=S._g.DandelionFlower.fills;
			if( isArr(Fs))
			{	let c = new RQCircle(C.x,C.y,dandelionRadius*0.8,dandelionRadius*0.8);
				for( let iF=0; iF<Fs.length; iF++)
				{
					let F=Fs[iF];
					if( F )
					{	F.orientation= S.random()*180;
						this._Fl(F,c,F);
					}
				}
			}
			
			// draw a circle in the mask 
			var context = this.m_mask._X();
			context.beginPath();
			context.arc(C.x, C.y, dandelionRadius*0.8, 0, 2 * PI, false);
			context.fillStyle = 'white';
			context.fill();
			
			// draw the stem in the mask
			let path = new Path2D(pathPoints);
			context.fill(path);
			if( this.m_isShortenJunctions)
			{	context.lineWidth = this.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(path);
			}

		}
		// Leaves
		this.M_organizeLeaves(this.M_drawDandelionLeaf, opt,"back",nbLeaves);
					
	
	}
	// ---------------------------------------------
	//  M_organizeLeaves
	// ---------------------------------------------
	M_organizeLeaves(func, opt,frontOrBack, nbLeaves)
	{
		// opt.leaves = { open: {min:0.3 ; max:1}, inclinaison: direction, viewerInclinaison, rotationStart: this.random()*60, length: leafSize, width: leafSize*0.6, centerLine:true, lines : S._g.Clover.m_lines }

		let OL = opt.leaves; 
		
		var angle = OL.rotationStart;
		var incAngle = 360/nbLeaves;

		// arrange the leaves on a circle
		var flags = frontOrBack=="front"? 1 : frontOrBack=="back"? 2 : 3;
		
		var h =OL.length; 

		// 3D version
	   let viewerOrientation = OL.viewerInclinaison;
	   let direction = OL.inclinaison;
	   var stack = [];
	   var MV = new RQMatrix4();						// MV is at the center of the leaves
	   MV.M_rotate(direction,0,0,1);					// rotate in the bend direction of the flower
	   MV.M_rotate(viewerOrientation,1,0,0);			// rotate in the direction of the viewer

	    var openAmount= OL.open.min + opt.S.random()* (OL.open.max-OL.open.min) ;

		let leafDir = new ZV3(0,0,-1);		// to get the direction of leaves, before we rotate the matrix with openAmout which will project the Y axis onto -Z 
		let Lv=[];
		for( let i=0;i<nbLeaves;i++)
		{
		   stack.push(MV.clone());
		   MV.M_rotate(angle,0,1,0);
		   MV.z = MV.M_getRotateZ(leafDir);
		   let isBack  = MV.z>=0;
		   if( ( (!isBack) && (flags&1)) || ( isBack  && (flags&2))) 
		   {
			   MV.M_rotate(openAmount*90,1,0,0);			    

			   Lv.push(MV)
		   
		   }
		   MV=stack.pop();
		   angle+=incAngle;		
		}
		// sort the MV
		Lv.sort( function(a,b){ return a.z<b.z?1 : -1} );

		// call the leaf 
		for( let i=0; i<Lv.length; i++)
			func.apply( this,[Lv[i],opt]);


	
	}
	


	// ---------------------------------------------
	//  M_drawLeaf
	// opt.leaves : 
	//  - profile
	//	- length
	//	- width 
	//  - nbProfilePoints
	//  - bend
	//  - group : group for lines
	//  - fills : group/fills
	//  - drawContour : bool ( default=1)
	// opt.x, opt.y : C ( ref ) 
	//  
	// ---------------------------------------------
	
	// 3D approach
	// leaf MV is oriented so that leaf profile is on Y,Z axis 
	M_drawLeaf(MV,opt)
	{
			// opt.leaves = { open: {min:0.3 ; max:1}, inclinaison: direction, viewerInclinaison, rotationStart: this.random()*60, length: leafSize, width: leafSize*0.6, centerLine:true, lines : S._g.Clover.m_lines }
		let OL = opt.leaves;
		let leafProfile = OL.profile;
		let leafLen 	= OL.length; 
		let leafWidth 	= OL.width;
		let nbPoints = Math.max(OL.nbProfilePoints,4);
		let isFeatures = opt.features??true;
		let isContour = OL.drawContour??1; 
		let C = new ZV2(opt.x,opt.y);
	   let Plocal = new ZV3() 
	   let P = new ZV2(); 
	   let bendAlpha = OL.bend*D2R;
	   let bendR  = abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 0;
	   
	   var kProfile = 1./(nbPoints-1);
	   let leafDecal = 0;	// TEMP
	   let L = [new ZPL(),new ZPL()]; 
	   var p;
	   for( let i=0; i<nbPoints; i++)
	   {	
		   let aProfile = i*kProfile; 
		   p= leafProfile.apply(this,[aProfile,opt]);
	      let dz = (1-cos( p.y*bendAlpha))*bendR; 
		   let y = bendR*sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 
		   for( let side=0; side<2; side++)
		   {	
		   		let sign = side==0? -1 : 1;
		   		Plocal.M_set( sign*p.x*leafWidth, y,dz)	// ok
			    Plocal.y += leafDecal; 

			   // P is the point oriented around the flower 
			   let Pworld = MV._mBV(Plocal);
			   //let Pproj = new ZV2(Pworld.x,-Pworld.y + Pworld.z*this.m_perspectiveFactor);				
			   
			   //L[side]._aP(Pproj.M_plus(C.x,C.y));
			  	L[side]._aP(this.Pj(Pworld,C));
			}	   
		   
	   }
	   // profile
	   // 	   let x =  2*t-1;
	   //      x = sin(Math.pow(t,0.8)*PI);
	   //     y = sin(t*PI*(0.5+opt.leaves.heartShape ));
	   //   y donné ---> t ? 
	   //    arcsin(y) = t* PI * (0.5+heartShape)
	   //    t= arcsin(y)/( t*PI*(0.5+heartShape) )
	   //    et x = sin( Math.pow(t,0.8)*PI )); 
	   
	   
	   // Param : p from profile
	   // 
	   // y = bendR*sin(p.y*bendAlpha);
	   // Plocal.M_set(p.x*leafWidth, y, dz )
	   // 
	   
	   
	   let orientation = L[0].M_endPoint().M_minus( L[0].M_getPoint(0));
	   orientation = Math.atan2(orientation.y,orientation.x)/D2R;
	   
	   // centerLine
	   let centerL = null;
	   if( OL.centerLine && p && p.y>0)
	   {	
	   		centerL = new ZPL();
	   		let segLen = 1*this.u/leafLen;
	   		let lineLen = 0.8*p.y;
	   		let nb  = lineLen/segLen;
	   		let y = 0;
	   		for( let i=0; i<=nb; i++)
	   		{
			    let dz = (1-cos( y*bendAlpha))*bendR; 
				let dy = bendR*sin(y*bendAlpha);

		   		Plocal.M_set( 0, dy,dz)
			    Plocal.y += leafDecal; 
			   let Pworld = MV._mBV(Plocal);
			   //let Pproj = new ZV2(Pworld.x,-Pworld.y + Pworld.z*this.m_perspectiveFactor);				
			  	
			  	centerL._aP(this.Pj(Pworld,C));
			   
			   //centerL._aP(Pproj.M_plus(C.x,C.y));
												
				y+=segLen;
			}  
	   }
	   
	   
	   // joint lines
	   let p2;
	   while(p2=L[1].mP.pop())
	   {	L[0]._aP(p2);						
	   }
	   var pathPoints = L[0]._gS(true);

		// Filling with hatches
		let N = MV.mRV((new ZV3(0,1,0)).M_cross( new ZV3(1,0,0))).Nzd(); 

		let lighting = (1+N.M_dot(this.m_lightSource))*0.5;
		lighting*=lighting;
		//
		let lightMax = 1; 
		

		let Fs=OL.fills;
		if( isArr(Fs))
		for( let iF=0; iF<Fs.length; iF++)
		{
			let F=Fs[iF];
			if( F && F.m_active)
			{	OL.MV = MV;
				OL.C = C;
				F.orientation= orientation;
				F.leaves = OL;
				//F.normal = N;
				F.spacing=  ZMT.M_map( lighting,0.2,lightMax,F.m_spacing.min , F.m_spacing.max);
				//F.jointEnds=true;
				//

				//F.m_lines.push( ...this.M_hatchShape( L[0] ,F)); 
				this._Fl(F,L[0],F);
			}
		}

	   // Draw the lines
	   //OL.lines.push(...this.M_computeLineMask(L[0]));
	   if(isContour)
		   	this._DL(OL.group,L[0],true);
	   if( centerL ) 
	   {
		  // OL.lines.push(...this.M_computeLineMask( centerL ));	   
		   this._DL(OL.groupFeat?OL.groupFeat:OL.group,centerL,true);
	   }
	   // Hatch the leaves
	   /*if(opt.leafHatchMargin>0)
		   opt.m_lines.push(...this.M_hatchShape(leafLeft,{orientation:direction,spacing:opt.leafHatchMargin}));
		*/
   
   
	   // draw the leaf in the mask
		if(!OL.noMask)  
	   		this._dM(L[0])
	   /*var context = this.m_mask._X();
	   let path = new Path2D(pathPoints);
	   context.fillStyle = 'white';
	   context.fill(path);
	   if( this.m_isShortenJunctions)
	   {   context.lineWidth = this.m_protectionStrokeWidth*2;
		   context.strokeStyle = "white";
		   context.stroke(path);
	   }*/

	
	}





	
	
	// ---------------------------------------------
	// CLOVER
	// ---------------------------------------------
	M_putClover(opt)
	{
		var sz = opt.scale;

		var S = opt.S;
		var cloverHeight = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		var leafSize = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;
		var spacing = leafSize+(S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;
		//opt.x += spacing * 0.5;
		var segLen = opt.seg;
		S._g.Clover.M_applyScale(opt.scale)
		S._g.CloverStem.M_applyScale(opt.scale)
		S._g.CloverFeatures.M_applyScale(opt.scale)

		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ) ; 
		var stemLines;
		if(cloverHeight>1)
		{
			opt.fillStem = S.m_isFillStem;

			stemLines = this.M_getStem(opt,0,direction,cloverHeight,S.m_stemWidth*opt.scale);
			if(stemLines.lines.length==0)
				return spacing;
			direction = stemLines.direction;
		}
		var nbLeaves = S.m_nbLeaves.min+Math.round((S.m_nbLeaves.max-S.m_nbLeaves.min)*S.random());
		opt.leaves = {  inclinaison: direction, viewerInclinaison: 10+S.random()*10, length: leafSize, drawContour:S.m_isContour,group : S._g.Clover, groupFeat:S._g.CloverFeatures }
		switch( S.m_leafShape)
		{
			default :
			case "Clover" :
			   opt.leaves.nbProfilePoints=30;
			   opt.leaves.profile	= this.M_cloverLeafProfile;
			   opt.leaves.invProfile  = this.M_cloverLeafInvProfile; 
			   opt.leaves.width = leafSize*0.6;
			   opt.leaves.heartShape= S.m_heartShape.min + (S.m_heartShape.max-S.m_heartShape.min)*S.random();
			   opt.leaves.open =  {min:0.2 , max:0.9};
			   opt.leaves.bend = 60;
			   opt.leaves.centerLine=true;
			   opt.leaves.rotationStart= S.random()*60;
			   break;
			   
			case "Ash":
			  //this.m_leafOpts = {profile:algorithm.M_ashLeafProfile,organizeFun: algorithm.M_ashOrganize, ashLeaves:4.5,segments:150,ratio:0.9,stemRatio:0,centerLine:false};
			   {
				   opt.leaves.nbProfilePoints=150;
				   opt.leaves.profile	= this.M_ashLeafProfile;
				   opt.leaves.width 	= leafSize*0.7;
				   opt.leaves.open 		=  {min:0.0 , max:0.5};
				   opt.leaves.bend 		= -10-S.random()*30;
				   opt.leaves.ashLeaves	=2.5+Math.round(6*S.random() );	// 4.5
				   opt.leaves.orient = [];
				   for( let i=0; i<Math.ceil(opt.leaves.ashLeaves);i++)
				   {	opt.leaves.orient[i]={o:0.1+0.4*S.random(),sz:0.8+0.2*S.random()};
				   }
				   opt.leaves.viewerInclinaison = -20;
				   opt.leaves.rotationStart= 30*S.random();
			   }
			  break;
		}	
		// Lucky clover ? 
		if(false && !this.m_isLuckyClover)
		{	let rnd = S.random();
			if(rnd<0.03)
			{	this.m_isLuckyClover = true;
				
				nbLeaves = 4;
			}
		} 
		// fill
		opt.leaves.fills= S._g.CloverFill.fills; 


		
		var O = new ZV2(opt.x,opt.y);
		var P = stemLines!=undefined? stemLines.end : O;
		opt.x=P.x;
		opt.y=P.y;
		this.M_organizeLeaves(this.M_drawCloverLeaf, opt,"front",nbLeaves);
		
		// draw the stem
		//let destination = (S.m_isFillStem &&  S._g.CloverFill.fill) ? S._g.CloverFill.fill : S._g.Clover;  
		if(stemLines!=undefined)
		{
			let destination = S._g.CloverStem;  
			for( let il=0; il<stemLines.lines.length; il++)
			{	this._DL(destination ,stemLines.lines[il],true) 
			}



			// draw the stem in mask
			if( stemLines.contourPath)
			{	let context = this.m_mask._X();
				context.fill(stemLines.contourPath);
				if( this.m_isShortenJunctions)
				{	context.lineWidth = this.m_protectionStrokeWidth*2;
					context.strokeStyle = "white";
					context.stroke(stemLines.contourPath);
				}

			}
		}
		
		this.M_organizeLeaves(this.M_drawCloverLeaf, opt,"back",nbLeaves);


		return spacing;
	}	

	// ---------------------------------------------
	// MINT
	// ---------------------------------------------
	M_drawMintLeaf(MV,opt)
	{

	   this.M_drawLeaf( MV,opt);
	}


	M_mintLeafProfile(t,opt)
	{
	   let x = sin(Math.pow(t,0.7)*PI);
	   x-=sin(t*20*PI)*0.05;
	   return {x: x, y : t};	
	}
	M_mintLeafInvProfile(y,OL)
	{
		let t= y;
		let x = sin(Math.pow(t,0.7)*PI);
		return {x:x,t:t};
	}

	M_putMint(opt)
	{
		var S = opt.S;
		var sz = opt.scale;
		//console.log(`M_putMint opt=${RQPrintR(opt,1)}`);
		S._g.MintStem.M_applyScale(opt.scale);
		S._g.MintLeaf.M_applyScale(opt.scale);
		S._g.MintFeatures.M_applyScale(opt.scale);

		var mintHeight = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		var leafSize = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;
		var spacing = /*leafSize+*/(S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;
		//opt.x += spacing * 0.5;
		var segLen = opt.seg;

		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] )/**-Math.sign(opt.x-this.W/2)*/ ; 

		// generate stem with sampling 
		opt.stemSamples = { segmentLength: S.m_stemSegment.min + (S.m_stemSegment.max-S.m_stemSegment.min)*S.random(), kStart:S.m_stemKStart };
		opt.fillStem = S.m_isFillStem;
		var stemLines = this.M_getStem(opt,0,direction,mintHeight,S.m_stemWidth);
		if(stemLines.lines.length==0)
			return spacing;
		opt.stemSamples = null;
		direction = stemLines.direction;

		var nbLeaves = 	S.m_leafOrganize.nb;
		let widthRatio = 1.;
		opt.leaves = { open: {min:0.2 , max:0.9}, inclinaison: direction, bend : 60, viewerInclinaison: 10+S.random()*10, centerLine:S.m_isFeatures, noMask:S.m_noMask, drawContour:S.m_isContour,group : S._g.MintLeaf, groupFeat:S._g.MintFeatures }
		// fill
		opt.leaves.fills= S._g.MintLeaf.fills; 

		switch(S.m_leafShape)
		{
			default:
			case "Mint":
			   opt.leaves.nbProfilePoints=50;
			   opt.leaves.profile	= this.M_mintLeafProfile;
			   opt.leaves.invProfile  = this.M_mintLeafInvProfile; 
			   widthRatio = 0.3; 
				break;
			case "Herb":
			   opt.leaves.nbProfilePoints=30;
			   opt.leaves.profile	= this.M_herbLeafProfile;
			   opt.leaves.invProfile  = this.M_herbLeafInvProfile; 
			   opt.leaves.heartShape= 0.18*S.random();
			   widthRatio = 0.08; 
				break;
			case "Clover":
			   opt.leaves.nbProfilePoints=30;
			   opt.leaves.profile	= this.M_cloverLeafProfile;
			   opt.leaves.invProfile  = this.M_cloverLeafInvProfile; 
			   opt.leaves.heartShape= 0.18*S.random();
			   widthRatio = 0.4; 
				break;
		}




		
		var O = new ZV2(opt.x,opt.y);
		var P = stemLines.end;
	
		let Samples=[];
		Samples.push({P:P,l:mintHeight});
		if( stemLines.samples)
		{	Samples.push(...stemLines.samples);
		}
		let rotStart = S.random()*60;
				//S.m_leafOrganize = S.gF("leafOrganize",{nb:2,shiftDeg:90});

		let radiusFunc= function(y,min,max){return min+(1-Math.pow(y,2))*(max-min) }
		
		for( let iSam=0; iSam<Samples.length; iSam++)
		{	let sam = Samples[iSam];
			switch( S.m_sizeFunc)
			{
				case "Straight":
					sam.leafSize = iSam==0?leafSize*0.4 : iSam==1? leafSize*0.8 : leafSize;
					break;
				case "Pow":
					sam.leafSize = radiusFunc(sam.l/mintHeight, S.m_size.min,S.m_size.max)*opt.scale;					
					break;
			}

			opt.x=sam.P.x;
			opt.y=sam.P.y;
			opt.leaves.rotationStart = rotStart + S.m_leafOrganize.shiftDeg*iSam;
			opt.leaves.length=sam.leafSize;
 			opt.leaves.width= sam.leafSize*widthRatio;
			this.M_organizeLeaves(this.M_drawMintLeaf, opt,"front",nbLeaves);
		}	
		// draw the stem
		let m,g=S._g.MintStem;

		for( let il=0; il<stemLines.lines.length; il++)
		{	//S._g.MintStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
			this._DL(g ,stemLines.lines[il],true) 

		}
		// fill the stem
		if(S.m_isFillStem && stemLines.contour)
		{
			let Fs,F;
			if( isArr(Fs=g.fills))
			{
				for( let f=0; f<Fs.length; f++)
				{
					if( F=Fs[f])
					{	F.spacing=F.m_spacing.min;
						this._Fl(F,stemLines.contour,F); 
					
					}
				}
			}
		}
		// Fill stem 
		if( m=stemLines.contour)
		{	this.M_applyFills(g,m)
			this._dM(m);
		}	
		/*
		// draw the stem in mask
		if( stemLines.contourPath)
		{	let context = this.m_mask._X();
			context.fill(stemLines.contourPath);
			if( this.m_isShortenJunctions)
			{	context.lineWidth = this.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(stemLines.contourPath);
			}

		}
		*/
//		this.M_organizeLeaves(this.M_drawMintLeaf, opt,"back",nbLeaves);
		for( let iSam=0; iSam<Samples.length; iSam++)
		{	let sam = Samples[iSam];
			opt.x=sam.P.x;
			opt.y=sam.P.y;
			//opt.leaves.rotationStart = rotStart + 90*(iSam%2);
			opt.leaves.rotationStart = rotStart + S.m_leafOrganize.shiftDeg*iSam;
			opt.leaves.length=sam.leafSize;
 			opt.leaves.width= sam.leafSize*widthRatio;
			opt.leaves.group = S._g.MintLeaf;
			this.M_organizeLeaves(this.M_drawMintLeaf, opt,"back",nbLeaves);
		}	


		return spacing;
	}	

	M_putSunflower(opt)
	{
		var S = opt.S;
		S._g.SunHearts.M_applyScale(opt.scale);
		S._g.SunStem.M_applyScale(opt.scale);
		S._g.SunPetals.M_applyScale(opt.scale);
		S._g.SunLeaf.M_applyScale(opt.scale);
		S._g.SunLeafFeat.M_applyScale(opt.scale);
		S._g.SunHeartFeat.M_applyScale(opt.scale);

		var mintHeight = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		var leafSize = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;
		var spacing = (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;
		var segLen = opt.seg;

		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] );

		// generate stem with sampling 
		opt.stemSamples = { segmentLength: S.m_stemSegment.min + (S.m_stemSegment.max-S.m_stemSegment.min)*S.random(), kStart:0.3 };
		opt.fillStem = S.m_isFillStem;
		var stemLines = this.M_getStem(opt,0,direction,mintHeight,S.m_stemWidth);
		if(stemLines.lines.length==0)
			return spacing;
		opt.stemSamples = null;
		direction = stemLines.direction;

		var nbLeaves = 	S.m_leafOrganize.nb;
		let widthRatio = 1.;
		opt.leaves = { open: {min:0.2 , max:0.9}, inclinaison: direction, bend : 60, viewerInclinaison: 10+S.random()*10, centerLine:S.m_isFeatures, group : S._g.SunLeaf, groupFeat:S._g.SunLeafFeat }
		// fill
		opt.leaves.fills= S._g.SunLeaf.fills; 

		switch(S.m_leafShape)
		{
			default:
			case "Mint":
			case "Sunflower":
				opt.leaves.nbProfilePoints=50;
			   opt.leaves.profile	= this.M_mintLeafProfile;
			   opt.leaves.invProfile  = this.M_mintLeafInvProfile; 
			   widthRatio = 0.3; 
			   break;
		}




		
		var C = stemLines.end;

		// Draw sunflower
		let flowerRadius = leafSize*0.5;
		let centerRadius = flowerRadius*0.9;
		let centerRadiusLeaf=centerRadius*0.95;
		var stack = [];
		let MV=new RQMatrix4();
		MV.M_rotate(direction,0,0,1);
		MV.M_rotate(S.m_viewerOrientation,1,0,0);	// rotate in the direction of the viewer

		stack.push(MV.clone());		
		let leafOpts = LeafManager.M_createLeafOptions(/*S.m_leafShape*/"Sunflower");
		leafOpts.ratio*=2;		// OLD Compatibility
		leafOpts.stemRatio = 0.01;
		leafOpts.leafSize = flowerRadius;			
		leafOpts.groups = {
			Leaves				: S._g.SunPetals,
			LeavesFeat			: S._g.SunLeafFeat
		}
		let rot=360/S.m_nbPetals;
		let nbRotations = 2;
		let n=S.m_nbPetals*nbRotations;
		let nHalf = S.m_nbPetals;
		let incl = 35;
		let petals=[];
		let zero=new ZV3(0,0,0);
		let _V2 = true;	// TEMP TEMP TEMP
		for( let ip= 0; ip<n; ip++)
		{
			leafOpts.bendAlpha = _V2? 40+incl*S.random() : 90*S.random();	//TEMP
			MV.M_rotate(rot,0,1,0);
			stack.push(MV.clone());
			MV.M_translate(0,0,centerRadiusLeaf);
			MV.M_rotate(incl,1,0,0);
			petals.push({MV:MV.clone(),opts:_V2?{...leafOpts}:leafOpts,z:MV._mBV(zero).z });

			MV = stack.pop();
			if(_V2)
			{	if(ip>0 && (ip%nHalf)==0)
					incl+=45;

			}
			else if(ip==nHalf)
				incl=60;
		}
		MV = stack.pop();

		// Sort petals by Z, add a z for the heart
		petals.push({isHeart:true,z:MV._mBV(zero).z });
		petals.sort( function(a,b){ return a.z<b.z?1 : -1} ); 


		// Prepare shape for the heart
		let shape = new ZPL();


		// compute petals and heart
		for(let ip=0; ip<petals.length; ip++)
		{
			let petal = petals[ip];
			if( petal.isHeart)
			{
				// Draw flower heart
				let heartShape = new RQCircle(centerRadius);
				let heartPoints = heartShape._cP(50);
				let v= new ZV3();
				for( let i=0; i<heartPoints.mP.length; i++)
				{	let p=heartPoints.mP[i];
					v.x = p.x;
					v.z = p.y;
					let pWorld  = MV._mBV(v);
					shape._aP( this.Pj( pWorld, C) );
				}

				// Create the heart dots 
				let dotsShapes;
				let _2PI = PI*2;
				if( centerRadius>0.5*this.u)
				{
					dotsShapes=[];
					
					// create a shape for the dot
					let rDotIn = Math.max(0.2*this.u,centerRadius/14);
					let rDot = rDotIn+S._g.SunHeartFeat.m_strokeWidth;
					let circ = new RQCircle(0,0,rDotIn,rDotIn*1.5);
					let circPts = circ._cP(20);
					circPts.M_rotate(-direction,new ZV2(0,-rDotIn*1.2))
					
					// spiral
					let r=1*rDot;
					let a=0;
					while(r<centerRadius)
					{	
						while(a<_2PI)
						{	
							let h = cos(r/centerRadius*PI/2);
							let v=new ZV3(r*cos(a), 0.4*centerRadius*h*h,r*sin(a));
							let pWorld  = MV._mBV(v);
							let dotC = this.Pj( pWorld, C)

							// create the dot's shape
							let dotShape = new ZPL();
							for( let i=0; i<circPts.mP.length; i++)
							{	let p=circPts.mP[i];
								dotShape._aP( dotC.M_plus(p) );
							}
							dotsShapes.push({shape:dotShape,z:pWorld.z});
							// avance to next point
							a+=2*rDot/r;
							r+=rDot/r;
						}
						while(a>0) a-=_2PI;

					}
				}	
				// render the dots
				if(dotsShapes!=undefined)
				{
					// Sort by z 
					dotsShapes.sort( function(a,b){ return a.z<b.z?1 : -1} );

					let g = S._g.SunHeartFeat;
					let F,Fs = g.fills;
					if(Fs) F=Fs[0]
			
					
					for(let i=0; i<dotsShapes.length; i++)
					{	let s=dotsShapes[i].shape;
						if(F) this._Fl(F,s,F); 
						this._DL(g,s,true);
						this._dM(s,{protect:0});
					}

				}




			}
			else
				LeafManager.M_drawLeaf_old(C,petal.MV, petal.opts);

		}

		// Fill the heart shape
		let F,Fs = S._g.SunHearts.fills; 
		if( isArr(Fs))
		for( let f=0; f<Fs.length; f++)
		{	if( F=Fs[f])
			{	F.orientation=S.random()*360;
				F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*S.random();
				this._Fl(F,shape,F); 
			}
		}


		// draw the shape
		this._DL(S._g.SunHearts,shape,true);

		// draw in mask 
		var path = new Path2D(shape._gS(false));
		let maskCtx = this.m_mask._X();
		maskCtx.fillStyle = "white";
		maskCtx.fill(path);

			
		// Draw stem and leaves
		let Samples=[];
		Samples.push({P:C,l:mintHeight});
		if( stemLines.samples)
		{	Samples.push(...stemLines.samples);
		}
		let rotStart = S.random()*60;
		
		for( let iSam=0; iSam<Samples.length; iSam++)
		{	
			if(iSam==0) continue;

			let sam = Samples[iSam];
			sam.leafSize = iSam==0?leafSize*0.4 : iSam==1? leafSize*0.8 : leafSize;

			opt.x=sam.P.x;
			opt.y=sam.P.y;
			opt.leaves.rotationStart = rotStart + S.m_leafOrganize.shiftDeg*iSam;
			opt.leaves.length=sam.leafSize;
 			opt.leaves.width= sam.leafSize*widthRatio;
			this.M_organizeLeaves(this.M_drawMintLeaf, opt,"front",nbLeaves);
		}	
		// draw the stem
		for( let il=0; il<stemLines.lines.length; il++)
		{	//S._g.MintStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
			this._DL(S._g.SunStem ,stemLines.lines[il],true) 

		}
		// fill the stem
		if(S.m_isFillStem && stemLines.contour)
		{
			let Fs,F;
			if( isArr(Fs=S._g.SunStem.fills))
			{
				for( let f=0; f<Fs.length; f++)
				{
					if( F=Fs[f])
					{	F.spacing=F.m_spacing.min;
						this._Fl(F,stemLines.contour,F); 
					
					}
				}
			}
		}

		// draw the stem in mask
		this.M_applyFills(S._g.SunStem,stemLines.contour)
		this._dM(stemLines.contour)
		
//		this.M_organizeLeaves(this.M_drawMintLeaf, opt,"back",nbLeaves);
		for( let iSam=0; iSam<Samples.length; iSam++)
		{	
			if(iSam==0) continue;
			let sam = Samples[iSam];
			opt.x=sam.P.x;
			opt.y=sam.P.y;
			//opt.leaves.rotationStart = rotStart + 90*(iSam%2);
			opt.leaves.rotationStart = rotStart + S.m_leafOrganize.shiftDeg*iSam;
			opt.leaves.length=sam.leafSize;
 			opt.leaves.width= sam.leafSize*widthRatio;
			opt.leaves.group = S._g.SunLeaf;
			this.M_organizeLeaves(this.M_drawMintLeaf, opt,"back",nbLeaves);
		}	


		return spacing;
	}	



	// ---------------------------------------------
	//	PATTERN
	// ---------------------------------------------
	M_putPattern(opt)
	{
		var S = opt.S;
		let gridSize=new ZV2(S.m_gridSize.x,S.m_gridSize.y);

		if( false )	// Change grid size
		{	let rnd = 0.5*(1+Noz(opt.x/this.W*3,opt.y/this.H*3));
			let sc = 1+Math.round(2*rnd);
			gridSize.x/=sc; gridSize.y/=sc;
		}
		// compute grid position
		let col = Math.round(opt.x/gridSize.x);
		let row = Math.round(opt.y/gridSize.y);
		// find in list if it exist already 
		for(let i=S.m_list.length-1; i>=0; i--)
		{	let prev=S.m_list[i];
			if(prev.col==col && prev.row==row)
				return undefined;

		}
		S.m_list.push({col:col,row:row});
		let xDecal = 0;
		switch(S.m_decal)
		{	case "0/0": xDecal=0; break;
			case "1/2":	xDecal=(row%2)*gridSize.x/2; break;
			case "1/3":	xDecal=(row%3)*gridSize.x/3; break;
			case "1/4":	xDecal=(row%4)*gridSize.x/4; break;
		}

		// Draw the item
		let O = new ZV2(xDecal+col*gridSize.x, row*gridSize.y-gridSize.y/2-S.m_decalY-(S.m_height.min+(S.m_height.max-S.m_height.min)*S.random()));

		// Create the shape
		let shape;
		switch(S.m_shape)
		{
			default:
			case "circle":
				{
					let circle=new RQCircle(O.x,O.y,gridSize.x/2*1.2);
					shape= circle._cP(50);
				}
				break;
			case "horiz":
				{
					//let rect=new ZRc(this.mwA.x,O.y,this.mwA.w,gridSize.y/5);
					let rect;
					if( S.random()<0.5)
						rect=new ZRc(O.x-gridSize.x/2,O.y,gridSize.x,gridSize.y/5);
					else
						rect=new ZRc(O.x,O.y-gridSize.x*0.5,gridSize.y/5,gridSize.x);
					shape= rect._cP();
				}
				break;
		}	
		// Fill the shape
		let F,Fs = S._g.Main.fills; 
		if( isArr(Fs))
		for( let f=0; f<Fs.length; f++)
		{	if( F=Fs[f])
			{	F.orientation=S.random()*360;
				F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*S.random();
				this._Fl(F,shape,F); 
				//F.m_lines.push( ...this.M_hatchShape( L ,F)); 
			
			}
		}


		// draw the shape
		this._DL(S._g.Main,shape,true);

		// draw in mask 
		var path = new Path2D(shape._gS(false));
		let maskCtx = this.m_mask._X();
		maskCtx.fill(path);

		return undefined;	// 

	}

	// ---------------------------------------------
	//	FERN 
	// ---------------------------------------------
	M_putFern(opt)
	{
		var sz = opt.scale;
		var S = opt.S;

		S._g.FernStem.M_applyScale(opt.scale);
		S._g.FernLeaf.M_applyScale(opt.scale);


		var height = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		let seg = opt.seg;


		var C = new ZV2(opt.x,opt.y);
		//let Samples=[];
		//Samples.push({P:stemLines.end,l:height});
		
		// Make a leaf
		let isDefaultLeaf = (!S.m_leafShape) || S.m_leafShape=='-';

		let rLeaf= S.m_leafSize;
		let nbPoints = 30*(0.5+0.5*sz);
		let aInc = 2*PI/nbPoints;
		let a=-PI;
		let leafShape=[];
		for( let i=0; i<=nbPoints; i++)
		{
			leafShape.push(new ZV2(2*Math.pow(0.5*(1+cos(a)),rLeaf.pow),sin(a)));
			a+=aInc;
		}

		let radiusFunc = function(y,min,max){return min+(1-Math.pow(y,2))*(max-min) }
		let nbRoots = Math.round(S.m_nbRoots.min + (S.m_nbRoots.max-S.m_nbRoots.min)*S.random());
		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ); 
		let modFact=S.m_modulation.noiseFact;


		for( let iR = 0; iR<nbRoots; iR++)
		{
			let dir2 = direction+80*sin(iR*PI*2/nbRoots);

			// generate stem with sampling 
			opt.stemSamples = { segmentLength: S.m_stemSegment.min + (S.m_stemSegment.max-S.m_stemSegment.min)*S.random(),kStart:S.m_kStart };
			if( this.M_isUseVersion(1.5))		// !!
				opt.stemSamples.segmentLength*=opt.scale;
			opt.fillStem = S.m_isFillStem;
			let e =S.m_stemWidth*0.5*0.4; 
			var stemLines = this.M_getStem(opt,0,dir2,height,S.m_stemWidth);
			if(stemLines.lines.length==0)
				break;

			let context = this.m_mask._X();


			let lighting = S.random();
			if( stemLines.samples)
			{	
				// add a sample at the tip
				{	var end = stemLines.end;
					let endDir = stemLines.direction;
					
					var endIDir = new ZV2(cos(endDir*D2R),sin(endDir*D2R));
				 	var endJDir = new ZV2(-endIDir.y,endIDir.x);
					stemLines.samples.push({I:endIDir, J:endJDir, P:end,l:height});
				}
				let side=1;
				for( let is=0; is<stemLines.samples.length; is++)
				{
					let sample = stemLines.samples[is];

					let r = radiusFunc(sample.l/height, rLeaf.min,rLeaf.max)*0.5*opt.scale;
					let modAmp=S.m_modulation.amplitude*r;

					if(isDefaultLeaf)
					{
			
						let L = new ZPL();
						for(let i=0; i<=nbPoints; i++)
						{
							let leaf= leafShape[i];
							if(modAmp!=0)
							{
								let rnd = 0.5*(1+Noz(sample.P.x+leaf.x*modFact,sample.P.y+leaf.y*modFact)); 				
								r-= modAmp*rnd;
							}
							let x = side*(e+leaf.x*r);
							let y = leaf.y*r*rLeaf.k;
							let pProj = new ZV3(sample.I.x*x+sample.J.x*y, sample.I.y*x+sample.J.y*y,0);
							L._aP( this.Pj(pProj,sample.P));
							

						}
						this._DL(S._g.FernLeaf,L, true);

						//assert(ZMT.M_getPointsBarycenter(L.mP).size< 3*rLeaf.max ,"Error Fern Leaf is way too big !");
						// Fill leaf
						let Fs = S._g.FernLeaf.fills; 
						let F;
						if( isArr(Fs))
						{
							for( let f=0; f<Fs.length; f++)
							{
								if( F=Fs[f])
								{	F.orientation=Math.atan2(sample.I.y,sample.I.x)/D2R;
									try{
									F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*lighting;
									this._Fl(F,L,F); 
									}
									catch(e)
									{	console.error(e)
										console.warn(`fill style=${F.m_fillStyle}`)
										debugger;
									}
									//F.m_lines.push( ...this.M_hatchShape( L ,F)); 
								
								}
							}
						}
					
						// draw leaf in mask
						this._dM(L);
						
					} else
					{
						// TODO, in a very different way  ( 3D ... )
						let leafOpts = LeafManager.M_createLeafOptions(S.m_leafShape);
						leafOpts.leafSize = 2*r;
			
			
						leafOpts.groups = {
							Leaves				: S._g.FernLeaf,
							//LeavesFeat			: S._g.FernFeat,				
							Stem				: S._g.FernStem	
						}
						let MV=new RQMatrix4();
						//MV.M_setBase(sample.I,sample.J,sample.I.M_cross(sample.J));
						
						MV.M_rotate(45,0,1,0);
						LeafManager.M_drawLeaf_old(sample.P,MV, leafOpts);

					}
					
					side=-side;

				}
			}

			// draw the stem
			for( let il=0; il<stemLines.lines.length; il++)
			{	this._DL(S._g.FernStem ,stemLines.lines[il],true) 
				//S._g.FernStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
			}
			// draw the stem in mask
			if( stemLines.contourPath)
			{	let context = this.m_mask._X();
				context.fillStyle="white";
				context.fill(stemLines.contourPath);
				if( this.m_isShortenJunctions)
				{	context.lineWidth = this.m_protectionStrokeWidth*2;
					context.strokeStyle = "white";
					context.stroke(stemLines.contourPath);
				}

			}

		}
		return (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;

	}
	// ---------------------------------------------
	//  IVY TREE
	// ---------------------------------------------
	M_putIvyTree(opt)
	{
		var S = opt.S;
		var height = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] );
		var segLeng = 4*this.u;
		var rootWidth = 5*this.u;
		let leafOpts=LeafManager.M_createLeafOptions("Oak");
		leafOpts.leafSizeVar = S.m_leafsize;
		leafOpts.groups = {
			Leaves				: S._g.Leaves,
			LeavesFeat			: S._g.LeavesFeat,				
			Stem				: S._g.LeavesStem	
		}
		let treeOpt = TreeManager.M_createTreeOptions("default",
			{	leafOpts	: leafOpts,
				scale		: opt.scale,
				groups		: {Branches:S._g.Branches}
			
			});
		let tree = new ClassTree(this,treeOpt);
		//if( tree.m_factoryCount == 1)
		{
			tree.M_setBranchLength( height , segLeng); 
			tree.M_setPosition( new ZV3(opt.x,this.H-opt.y,0) );
			tree.M_setDirection(new ZV3(0,1,0));
			tree.M_setRadius( rootWidth/2,0);

			let MV = new RQMatrix4();
			tree.M_run(MV);
			tree.M_draw();
		}	
		return 30*this.u;			// TEMP
	}

	
	// ---------------------------------------------
	// TREE GRASS
	// ---------------------------------------------
	M_putTreeGrass(opt)
	{
		var S = opt.S, sz=opt.scale;

		opt.maxLevel = S.m_maxLevel.min +parseInt( (S.m_maxLevel.max-S.m_maxLevel.min) *S.random());
		var height = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*sz;
		var spacing = (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*sz;

		let Gs=S._g;
		[Gs.Fruits, Gs.Branches, Gs.Leaves].map((g)=>{g.M_applyScale(sz)})
		var O = new ZV2(opt.x,opt.y);
		let MV = new RQMatrix4();

		//let seg = opt.seg??this.printMm(2)/*2*this.u*/;
		let seg=2*this.u;		// This is not good, but we have to leave it that way for now.
		let l=0;
		let e = S.m_e.root*this.u*sz;
		let P = new ZV3(0,0,0);
		if( this.m_isShortenJunctions)
			opt.paths=[];
		

		let ff = opt.fillsFront=[];
		
		let iHeap = this.mHL.length;
		this.M_putTreeGrassBranch(opt,{MV:MV,O:O,P:P,height:height,strokeDecal:S._g.Branches.m_strokeWidth*1.4,level:0,seg:seg,e:e}); 

		let f_;
		while(f_=ff.pop())
		{
			this._Fl(f_.F,f_.path,f_.F); 
			this.mHL.splice( iHeap,0, this.mHL.pop());
		}
		
		
		if( this.m_isShortenJunctions)
		{
			let context = this.m_mask._X();
			context.lineWidth = this.m_protectionStrokeWidth*2;
			context.strokeStyle = "white";
			let path;
			while( path=opt.paths.pop())
			{
				context.stroke(path);
			}
		}


		return spacing;	
	}
	M_putTreeGrassBranch(opt,B)
	{
		let S = opt.S;
		let group = S._g.Branches;
		let variableStroke= false; //B.strokeDecal>=(group.m_strokeWidth*0.2);
		let varStrokFact = 0.4;
		
		let L0 = new ZPL();
		let L1 = new ZPL();
		let L2 = new ZPL();
		let L1b,L2b;
		L1b=new ZPL();
		L2b=new ZPL();		
		let P = B.P.clone();
		let torsion = S.m_torsion.func.apply(this,[opt.x,opt.y,opt.S.m_torsion.config] );
		let torsionInc = torsion/(B.height/B.seg);
		let e = B.e;

		let eEnd = B.e*opt.S.m_e.length;
		let eInc = (eEnd-e)/(B.height/B.seg);
		let Y = new ZV3(0,1,0);		
		let X = new ZV3(1,0,0);
		//let eSmall= group.m_strokeWidth+Math.max(this.m_protectionStrokeWidth,2*group.m_strokeWidth); 
		//let eSmall = opt.S.m_e.min*this.u+group.m_strokeWidth;
		let eSmall = S.m_e.min*this.u;
		let isLineCut = false;
		//console.log("e="+e+" group.m_strokeWith="+group.m_strokeWidth+" protec="+this.m_protectionStrokeWidth+" esmall="+eSmall);
		let J;
		let modFact=S.m_modulation.noiseFact/B.height;
		let modAmp=S.m_modulation.amplitude;
		let modInc=0;
		let P0 = P.clone();
		let Fs = group.fills; 
		let F;
		let fruitSide=1;
		let maskCtx = this.m_mask._X();
		maskCtx.fillStyle = "white";


		for(let l=0; l<=B.height; l+=B.seg)
		{
					
			J = B.MV._mBV(Y);
			let I = B.MV._mBV(X);
			let pLeft = this.Pj( P.M_plus( I._mB(-e/2) ) ,B.O );
			L0._aP( pLeft);										
			if(e>=eSmall)
			{
				L1._aP( pLeft);										
			}
			else
				isLineCut = true;
			L2._aP( this.Pj(P.M_plus( I._mB(e/2) ),B.O ));										
			if(variableStroke)
			{	
				let ePlus = B.strokeDecal + B.strokeDecal*(varStrokFact-1)*l/B.height;
				L1b._aP( this.Pj( P.M_plus( I._mB(-e/2-ePlus) ) ,B.O ));										
				L2b._aP( this.Pj( P.M_plus( I._mB(e/2+ePlus) ) ,B.O ));																	
		
			}



			if(B.level<opt.maxLevel)
			{
				// End point ? 
				if(  (l+B.seg)>=B.height)
				{
					let branchAngle = S.m_branchAngle.min + (S.m_branchAngle.max-S.m_branchAngle.min)*S.random();
					for( let ie=-1; ie<=1; ie+=2)
					{
						let MV = B.MV.clone();
						MV.M_rotate(branchAngle*Math.sign(ie),0,0,1);				

						this.M_putTreeGrassBranch(opt,{MV:MV,O:B.O,P:P,height:B.height*0.7,strokeDecal:B.strokeDecal*varStrokFact,level:B.level+1,seg:B.seg,e:e*S.m_e.branch}); 
					}				
				
				}
				else
				{	
					// new branch on the length ? 
					if( B.level>=S.m_intermediateBranch.level && (l/B.height)>=S.m_intermediateBranch.height)  
					{	let rnd = S.random();
						
						if( rnd<S.m_intermediateBranch.rnd)	 
						{
							let MV = B.MV.clone();
							let branchAngle = S.m_branchAngle.min + (S.m_branchAngle.max-S.m_branchAngle.min)*S.random();

							MV.M_rotate(branchAngle*Math.sign(S.random()-0.5),0,0,1);				
							this.M_putTreeGrassBranch(opt,{MV:MV,O:B.O,P:P,height:B.height*0.7,strokeDecal:B.strokeDecal*varStrokFact,level:Math.max(B.level+1,S.m_intermediateBranch.newLevel),seg:B.seg,e:e*S.m_e.branch}); 
						}
					}
				}
			}
			// Fruits
			if( S.m_isFruits)
			{	
				
				if( B.level>= (opt.maxLevel-S.m_fruitDistrib.level) && (l/B.height)>=S.m_fruitDistrib.height)
				{

					let p1 = this.Pj(P, B.O);
					let P2 = P.clone();
					let rnd = S.m_fruitRnd.func.apply(this,[p1.x,p1.y,S.m_fruitRnd.config] );
					let shiftSide=1;
					let isStem = S.m_fruitStem && S.m_fruitStem.length;
					if(S.random()<rnd && ((!S.fruitCb)||S.fruitCb(S,p1,opt) ))
					{	let MV;
						if(isStem)
						{	shiftSide=0;
							MV = B.MV.clone();
							let branchAngle = S.m_branchAngle.min + (S.m_branchAngle.max-S.m_branchAngle.min)*S.random();

							MV.M_rotate(branchAngle*fruitSide,0,0,1);				
							let J2 = MV._mBV(Y);

							P2.M_add( J2._mB( S.m_fruitStem.length*opt.scale));								
						}
	
						

						let r= 0.5*opt.scale * (opt.S.m_fruitSize.min + (opt.S.m_fruitSize.max-opt.S.m_fruitSize.min)*S.random());	// TODO : parametric var 
						let L = new ZPL();
						let nb =20;
						let a=Noz(P2.x,P2.y)*PI;
						let aInc = PI*2/nb;
						for( let ifr=0; ifr<=nb; ifr++ )
						{
							L._aP( this.Pj(P2.M_plus(r*cos(a)+I.x*shiftSide*fruitSide*r, r*sin(a)+I.y*shiftSide*fruitSide*r,0 ), B.O) );	
							a+=aInc;
						}
						/*if(S.m_fruitShape=="flower")
						{
							let miniCircle= new RQCircle();
						}*/

						if( false )	// COUNTING FRUITs
						{	let c=ZMT.M_getPointsBarycenter(L.mP).g;
							if(this.mwA.iPI(c))
							{
								this.m_fruitCount = (this.m_fruitCount??0)+1;
								
							}
						}


						let grpFruits = opt.S._g.Fruits;
						if(S.m_isFruitsContour)
							this._DL(grpFruits,L,true);
						if( isArr(Fs=grpFruits.fills))
						{
							for( let f=0; f<Fs.length; f++)
							{
								if( F=Fs[f])
								{	F.spacing=F.m_spacing.min;
									F.jointEnds=true;

									this._Fl(F,L,F); 
								
								}
							}
						}
						// draw in mask
						maskCtx.fill(new Path2D(L._gS(false)));
						// draw stem
						if(isStem)
						{
							if( S.m_fruitStem.e)
							{	
								let I2 =MV._mBV(X);
								let e2=S.m_fruitStem.e/2;
								let L2 = new ZPL();
								for( let k=-1; k<=1; k+=2)
								{
									let p1 = this.Pj(P.M_plus(k*e2*I.x,k*e2*I.y,0 ),B.O);
									let p2 = this.Pj(P2.M_plus(k*e2*I.x,k*e2*I.y,0 ),B.O);
									L2._aP( k<1?p1:p2);
									L2._aP( k<1?p2:p1);
									this._DL(group,new ZL(p1,p2),true );
								}
								maskCtx.fill(new Path2D(L2._gS(false)));

							}
							else 
								this._DL(group,new ZL(p1,this.Pj(P2, B.O)),true );

						}
					}
					
				}
				fruitSide = -fruitSide;
			}

			// Leaves 
			if(S.m_isLeaves)
			{
				let p1 = this.Pj(P, B.O);
				var leafSize = rndRange(S.m_leafSize,S.random);// S.leafSize.func.apply(this,[p1.x,p1.y,S.leafSize.config] )*opt.scale;

				let Lopt = LeafManager.M_createLeafOptions(S.m_leafShape);
				/*leafOpts.ratio*=2;		// OLD Compatibility
				leafOpts.stemRatio = 0.01;*/
				Lopt.leafSize = leafSize;
				Lopt.stemRatio = 0.01
				Lopt.groups = {
					Leaves				: S._g.Leaves,
					LeavesFeat			: S._g.LeafFeat
				}
	

				// End point ?  
				if(  B.level==opt.maxLevel &&  (l+B.seg)>=B.height)
				{
					// TODO --> put S.m_leafDistrib.nb leaves here 
					let MV = new RQMatrix4(); // B.MV.clone(); 
					//MV.M_setTranslation(P);	
					// orientation is up, flat
					
					MV.M_rotate(S.random()*360,0,1,0);							// rotation around Y axis
					MV.M_rotate(70,1,0,0);										// make it horizontal
					//MV.M_rotate(/*viewerOrientation*/20,1,0,0);			// rotate in the direction of the viewer

					// call draw leaf 					
					//this.M_drawLeaf( MV,opt);
					LeafManager.M_drawLeaf(p1,MV,Lopt)
				
				
				}
				else if( B.level>= (opt.maxLevel-S.m_leafDistrib.level) && (l/B.height)>=S.m_leafDistrib.height )
				{	
					let rnd = S.random();						
					if( rnd<S.m_leafDistrib.rnd)	 
					{
						let MV = B.MV.clone();
						// TODO -> put 1 leaf here 
					}
				}

			
			
			}
			//S.m_leafShape= S.M_get("leafShape","None");
			//S.m_leafDistrib= S.M_get("leafDistrib",{rnd:0.1,height:0.5,level:0,nb:1});			// left refers to the last level, 1 to the last leve-1, etc



			// update direction
			let inc= -torsionInc;
			if(modAmp!=0)
			{
				let rnd = Noz(P0.x+l*modFact,P0.y);
				inc-=modInc;	// remove previous modulation increment
				modInc = modAmp*rnd;
				inc+=modInc;		// add new increment 				
				
			}
			B.MV.M_rotate(inc,0,0,1);
			e+=eInc;				
			P.M_add( J._mB(B.seg));

		}
		if( B.level==opt.maxLevel && !isLineCut)
		{	L1.M_reverseOrder(); 
			L2.M_append( L1) ;
			L1.mP=[];
			L0=L2;
		}
		else 
		{	L2.M_reverseOrder();
			L0.M_append(L2);
		}
		
		if( !isArr(Fs=group.fills)) Fs=[];
			

		// fill ( front ) 
		for( let f=0; f<Fs.length; f++)
		{	F=Fs[f];
			if(F.m_isFront)
				F.m_isFrontActive = B.O.y<this.H*(1-S.m_fillH);
			if( F.m_isFrontActive)
				opt.fillsFront.push({F:F,path:L0});
		}
		
		if(S.m_isContour)
		{
			let fact=S.m_branchStrkLevelFact||1
			let prevScale=group.strokeScale
			if(group&&fact<1&&B.level>0)
			{	group.M_applyScale( (group.m_isStrokeScale? opt.scale:1)*(fact**B.level),1)
			}
	
			if( L1.M_nb()>0)
				this._DL(group,L1,true);
			this._DL(group,L2,true);
			//group.m_lines.push(...this.M_computeLineMask(L2));
			if( L1b.M_nb()>0)
				this._DL(group,L1b,true);
			if( L2b.M_nb()>0)
				this._DL(group,L2b,true);

				group.strokeScale=prevScale;
		}

	

		// Fill
		for( let f=0; f<Fs.length; f++)
		{
			if( (F=Fs[f]) && !F.m_isFrontActive)
			{	F.orientation=Math.atan2(J.y,J.x)/D2R;
				F.spacing=F.m_spacing.min;	//TEMP
				this._Fl(F,L0,F); 
			
			}
		}

		
		// draw in mask 
		var path = new Path2D(L0._gS(true));
		maskCtx.fill(path);
		
		// protection
		if( this.m_isShortenJunctions)
			opt.paths.push(path);

	
	}
	// ----------------
	// M_createObject3D
	// ----------------
	M_createObject3D(shape,m,opt)
	{
		let obj3D = new Mesh();
		var S = opt.S;
		switch( shape)
		{
			case "Cube":
				obj3D.M_createCube(m.width,m.width,m.width);
				break;
			case "Box":
				obj3D.M_createCube(m.width,m.height,m.width);
				break;
			case "Block":
				obj3D.M_createBlock({width:m.width,depth:m.width,height:m.height,rndFunc:S.random});
				break;
			case "Rock":
				obj3D.M_createRock({width:m.width,depth:m.width,height:m.width,rndFunc:S.random});
				break;
			case "Pile": 
				// TEMP TEMP TEMP
				if( this.m_title == "Lushtemples-Balance")
				{	if(opt.y<(240/695*this.H))
					{	console.log("opt.y="+opt.y+" height="+(height/this.u));
						if(height>=22*this.u)
						{
							height=10*this.u;
						}
					}
				}
				obj3D.M_createPile({width:m.width,depth:m.width,height:m.height,rndFunc:S.random});
				m.centerH=-obj3D.m_floorY/obj3D.m_dimensions.y;
				m.painterSort = true;
				break;
			case "Extrude":
				if(this.m_title.match(/^StillsFromLastNight-5c/) && opt.y>1.1*this.H)
					m.skipDrawing=true;
				m.selectedFaces=obj3D.M_createExtrude({width:m.width,depth:m.width,height:m.height,rndFunc:S.random});
				m.painterSort = true;
				break;
			case "Factory":
				m.selectedFaces=obj3D.M_createPowerPlant({width:m.width,depth:m.width,height:m.height,rndFunc:S.random});
				m.painterSort = true;
				break;
			case "Cross":
				obj3D.M_createExtrude({width:m.width,depth:m.width,height:m.height,rndFunc:S.random,steps:1});
				m.painterSort = true;
				break;
			case "Trunk":
				{
					let segH = S.m_segmentHeight*opt.scale;
					let nbSeg = 1;
					if( segH )
					{	
						nbSeg=Math.round(Math.max(1, m.height/segH));
					} 
					// m_param // ptMin:12,ptMax:12,decal:0.2,carveNb:3,shrink:0.4
					let p=S.m_param, nbPoints= p.ptMin==p.ptMax? p.ptMin : p.ptMin+(p.ptMax-p.ptMin)*S.random()|0 ;
					//console.log(`nbPoints = ${nbPoints} S.m_param=${RQPrintR(p,1)}`);
					let isOldRandom = false; // this.m_title.match(/^StillsFromLastNight1b/);
					if( isOldRandom) console.log("using old random"); 
					obj3D.M_createTrunkObject(m.height,{sz:m.width,nbSeg:nbSeg,centerDecal:S.m_param.decal,shrink:S.m_param.shrink,rndFunc:isOldRandom? Math.random : S.random,polygonNb:nbPoints});
				}
				break;
			case "Column":
				{
					let segH = S.m_segmentHeight*opt.scale;
					let nbSeg = 1;
					if( segH )
					{	
						nbSeg=Math.round(Math.max(1, m.height/segH));
					} 
					let isUseOldRandom = false ; 
					let nbPoints = S.m_param.ptMin==S.m_param.ptMax? S.m_param.ptMin : Math.round(S.m_param.ptMin+(S.m_param.ptMax-S.m_param.ptMin)*S.random());
					obj3D.M_createColumnObject(m.height,{sz:m.width,centerDecal:S.m_param.decal, nbSeg:nbSeg,rndFunc: isUseOldRandom? Math.random : S.random,polygonNb:nbPoints});
					m.painterSort = true;
				}
				break;
			
			
			case "Stair":
			{
				let segH = S.m_segmentHeight*opt.scale;
				// nbStairs
				// stairHeight
				// stairDepth
				// width
				let nbStairs = Math.round(m.height/segH);
				segH = m.height/nbStairs;

				obj3D.M_createStairsObject({nbStairs:nbStairs,stairHeight:segH,stairDepth:segH,width:m.width,torsion:m.torsion});				
				m.torsion = 0;
				m.centerH = 0;
			}
			break;
			default:
				obj3D=null;
			break;
		}
		return obj3D;

	}
	// ---------------------------------------------
	// OBJECT3D
	// ---------------------------------------------
	M_putObject3D(opt)
	{
		var S = opt.S;
	


		let m={
			width : opt.scale * S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] ),
			height: S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale,
			rotation: S.m_rotation.func.apply(this,[opt.x,opt.y,S.m_rotation.config] ),
			torsion: S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ),
			yDecal:undefined,MV:undefined,
			centerH:0.5,
			painterSort:false,
			selectedFaces:null,
			skipDrawing:false
		}
		// obj3D factory
		let obj3D = this.M_createObject3D(S.m_objShape,m,opt);
		if(!obj3D) return;



		if(S.m_segEdges && S.m_segEdges.seg>=1)
		{
			obj3D.M_segmentEdges(S.m_segEdges.seg);
		}
	   	m.yDecal??= obj3D.m_dimensions.y*m.centerH - sin(abs(m.torsion)*D2R)*obj3D.m_dimensions.x;
	   	
	   	var MV = m.MV;
		let C = new ZV2((m.x??opt.x)+(m.noXShift?0:m.width/2),(m.y??opt.y)-m.yDecal);
		if(!MV)
		{	MV=new RQMatrix4();
	   		MV.M_setIdentity();
			MV.M_rotate(m.torsion,0,0,1);
			MV.M_rotate(m.rotation,0,1,0);
		}
		var MRot = MV.clone();

		obj3D.M_resetEdgesDrawFlag();
		obj3D.M_setMV(MRot);
		
		for( let i=0; i<obj3D.m_faces.length; i++)
		{
			let face = obj3D.m_faces[i]; 
			let N = MRot.mRV(face.m_normal );
			face.m_normalTransformed=N;
			face.m_isBackface = N.M_dot(this.m_toEyeVector) <0; 

			// Draw normals
			if(false && !face.m_isBackface)
			{	let P = MV._mBV(ZMT.M_getPointsBarycenter(face.mP).g);
				this.M_drawDebugVector(P,N,C,{color:"green",l:2*this.u,mask:true});
				//this.M_drawDebugText(face.M_getString(),this.Pj(P,C),{color:"green",fontSize:0.4});

			}

			
		}
		// Draw vertex debug info text
		if(false)
		for( let i=0; i<obj3D.mP.length;i++)
		{	let pt = obj3D.mP[i];
			let P = MV._mBV(pt);
			let Pproj = this.Pj(P,C);
			//this.M_drawDebugText("."+obj3D.mP[i].m_index,Pproj,{color:"red",fontSize:1});
			//if(pt.m_peek!==undefined)
			//	this.M_drawDebugText("."+pt.m_peek.toFixed(3),Pproj,{color:"red",fontSize:1});
			if(false && pt.m_normal)
			{	//console.log(pt.m_normal.M_getString());
				this.M_drawDebugVector(P,MV.mRV(pt.m_normal),C,{color:"blue",mask:true,l:2*this.u});

			}
		}

		// Ivy AddOn for object
		// ----------
		let Ivys = [];
		if(S.m_ivy)
		{
			this.M_setOrigin2D(C);
			obj3D.M_triangulate();
			for( let iI=0; iI<S.m_ivy.length; iI++)
			{
				if( S.m_ivy[iI].m_isActive)
				{	let ivy=this.M_putObjectIvy(obj3D,S.m_ivy[iI],{pos:C,ground:-m.yDecal,MV:MV,scale:opt.scale});
					if( ivy)
						Ivys.push(...ivy);						
				}
			}
		}
		// draw the front Ivy
		for( let itree=0; itree<Ivys.length; itree++)
		{
			let tree = Ivys[itree];
			tree.M_draw({layer:"front"});

		}

		if(S.m_edgeAngleLimit)
			obj3D.M_computeAngleLimit(S.m_edgeAngleLimit);
		
		//let projFunc = this.M_getProjectionFunc().bind(this);

		let context;
		if(this.m_mask )
			context = this.m_mask._X();

		if( m.painterSort)
		{	obj3D.M_painterSort(this.m_toEyeVector,C,MV);
		
			// temp = draw the AABB
			if(false)
			for(let i=0; i<obj3D.m_faces.length; i++)
			{	let F = obj3D.m_faces[i];
				this._DL(this._g.Debug, F.m_aabb._cP() ,true);

			}
			// temp intersections
			if(false && obj3D.m_ints)
			for(let i=0; i<obj3D.m_ints.length; i++)
			{	let r = obj3D.m_ints[i];
				this._DL(this._g.Debug, r._cP() ,true);
			}
			
		}
		// Wires
		if(true && m.selectedFaces)
		{
			// selected faces contains the eligible faces of the new object. 

			let nextFaces=[];
			for( let i=0; i<m.selectedFaces.length; i++)
			{	let F=m.selectedFaces[i];
				if(F.m_isBackface)
				{	
					nextFaces.push( {p: MV._mBV(F.M_computeBarycenter()),N:F.m_normalTransformed.clone(),c:C});
				}
				else 
				{	let n;
					if( this.m_prevSelectFaces && (n=this.m_prevSelectFaces.length))
					{
						// find random iStart;
						let iStart = Math.round( S.random()*(n-1));
						
						// parse prev faces until a normal matches
						let pt2=null;
						for( let i2=0; i2<n ; i2++)
						{
							let ptTest = this.m_prevSelectFaces[ (i2+iStart)%n];
							if(ptTest.N.M_dot(F.m_normalTransformed)< -0.3 )
							{	pt2=ptTest;
								break;
							}
						}
						if(pt2)
						{
						
							let pt1= { p:MV._mBV(F.M_computeBarycenter()),c:C};
							
							// Make a line by interpolating
							let u={p:pt2.p.M_minus(pt1.p), c:pt2.c.M_minus(pt1.c)};
							let clen = u.c.M_length();
							let seg=opt.seg
							if( clen>0)
							{	u.c.M_mul(1/clen);
								let L=new ZPL();
								let cl=0;
								let pt={p:pt1.p.clone(),c:pt1.c.clone()};
								let eol=false;
								while(true)
								{	let k=cl/clen;
									pt.p.y-=10*this.u*sin(k*PI);
									let pProj=this.Pj(pt.p,pt.c);

									if(false)
									{
										if( S.random()<0.2)
										{	
											this._DL(S._g.Moss, new ZL( pProj, pProj.M_plus(0,4*this.u*S.random() ) ) ,true);
										}
									}
									L._aP( pProj);	
									if(eol)
										break;								 
									
									cl+=seg;
									if(cl>=clen)
									{	cl=clen;
										eol=true;
									}
									pt.c=pt1.c.M_plus(u.c._mB(cl));
									pt.p= pt1.p.M_plus(u.p._mB(cl/clen));

								}
								if(!m.skipDrawing)
								{	
									// draw a plug 
									let center1=this.Pj(pt1.p,pt1.c)
									let radius=this.u/4*opt.scale;
									let shape=(new RQCircle(center1.x,center1.y,radius,radius))._cP(30);
									//shape.M_translate(0,-h/2);
									this._DL(S._g.EdgesFlat, shape ,true);
									
									// draw wire
									this._DL(S._g.Wires, L ,true);

									// draw plug in mask
									this._dM(shape,{protect:0})
								
						
								}
							}
						}
					}
				}
			}
			if(!m.skipDrawing)
				this.m_prevSelectFaces=nextFaces;			
		}
		
		if(m.skipDrawing)
			return m.width;
		// Draw the object
		for( let i=0; i<obj3D.m_faces.length; i++)
		{
			let face = obj3D.m_faces[i]; 
			let N = face.m_normalTransformed;
			// backface
			if( face.m_isBackface || face.m_isRejected)	continue;

			let L;
			if(S.m_isCutGround)
			 	L = face.M_makePolylineClip( C, MV,{yClip:-m.yDecal});
			else
				L = face.M_makePolyline( C, MV);
			

			let g=S._g.Faces;
			if(g)
			{	g.normal=N;
				g.lightMax=1
				g.S=S;
				g.setup=(_,F,o)=>{
					let n=o.g.normal
					F.lighting= ((1+n.M_dot(_.m_lightSource))*0.5)**2;
					F.spacing=  ZMT.M_map( F.lighting,0,o.g.lightMax,F.m_spacing.min , F.m_spacing.max);
					let X = n.M_cross(_.m_toEyeVector);
					F.orientation =  Math.atan2(X.y,X.x)/D2R;
					F.alternate=true;
					F.normal = n;
					F.orientation=g.S.random()*360;
				}
	
				this.M_applyFills(g,L);
			}
		

			if( true )	// draw edges 
			{	
				let arrayL=[];
				let arrayLFlat=[];
					let edgeLines;
				if(S.m_isCutGround)
					edgeLines = face.M_makePolylineClipWithEdges(C, MV,{yClip:-m.yDecal});
				else 
				 	edgeLines = face.M_makePolylineWithEdges( C, MV);
				if( edgeLines)
				{	for(let iL=0; iL<edgeLines.length; iL++)
					{	let Arr = edgeLines[iL].isFlat? arrayLFlat : arrayL;
						Arr.push(...this.M_computeLineMask(edgeLines[iL]));
					}
				}
				//
				S._g.Edges.M_applyScale(opt.scale);
				S._g.EdgesFlat.M_applyScale(opt.scale);
				
				this._DL(S._g.Edges, arrayL, false);
				this._DL(S._g.EdgesFlat, arrayLFlat, false);
			}
			
			// draw the face in the mask
			face.contourPath=this._dM(L);
			/*if(this.m_mask )
			{	let path = new Path2D(L._gS(false));
				face.contourPath = path;
				context.fillStyle = "white";
				context.fill(path);
			}*/


		}
		// protect outside lines if needed
		if(this.m_mask )
		{	context.strokeStyle = "white";
			let group = S._g.Edges;
			let stroke = group.m_strokeWidth;
			if(group.strokeScale)
				stroke*=group.strokeScale;
			for( let i=0; i<obj3D.m_faces.length; i++)
			{
				let face = obj3D.m_faces[i]; 
				if( face.m_isBackface)
					continue;
				if(face.contourPath)
				{
					context.lineWidth = stroke;
					context.strokeStyle = "white";
					context.stroke(face.contourPath);

				}
			
			}
		}
		// Draw the backtree
		for( let itree=0; itree<Ivys.length; itree++)
		{
			let tree = Ivys[itree];
			tree.M_draw({layer:"back"});

		}


		this.M_setOrigin2D(null);
		if(S.done)S.done.apply(this,[opt]);
		return m.spacing??m.width;
	}

	// M_getObjIvyParams
	M_getObjIvyParams(S,opt)
	{	return {rootw:2.2*this.u,
				level:Math.round(rndRange(S.m_maxLevel,S.random)),
				nb:Math.round(rndRange(S.m_nbTrees,S.random))};
	}

	// M_putObjectIvy
	// S=Ivy
	// returns array of trees
	M_putObjectIvy(obj, S,opt)
	{	
		var out = [];
		var height = S.m_height.func.apply(this,[opt.pos.x,opt.pos.y,S.m_height.config] );
		var segLeng = 1*this.u;
		let a=this.M_getObjIvyParams(S,opt), rootWidth=a.rootw,maxLevel=a.level,nbTrees=a.nb;
		/*var rootWidth = 2.2*this.u;
		var maxLevel = Math.round(S.m_maxLevel.min + (S.m_maxLevel.max-S.m_maxLevel.min)*S.random());
		var nbTrees = Math.round(S.m_nbTrees.min + (S.m_nbTrees.max-S.m_nbTrees.min)*S.random());*/


		let leafOpts=null; 
		S._g.Branches.M_applyScale(opt.scale);
		
		if(S.m_leafShape!="None")
		{	leafOpts = LeafManager.M_createLeafOptions(S.m_leafShape);
			leafOpts.leafSizeVar = S.m_leafsize;

			S._g.Leaves.M_applyScale(opt.scale);
			S._g.LeavesFeat.M_applyScale(opt.scale);
			S._g.LeavesStem.M_applyScale(opt.scale);


			leafOpts.groups = {
				Leaves				: S._g.Leaves,
				LeavesFeat			: S._g.LeavesFeat,				
				Stem				: S._g.LeavesStem	
			}

		}
		let treeOpt = TreeManager.M_createTreeOptions(S.m_treeShape,
		{	leafOpts	: leafOpts,
			scale		: opt.scale,
			maxDepth	: maxLevel,
			randomLeaves: S.randomLeaves,				// TODO : not functional yet ( M_seed not applicable to S)
			randomBranches: S.randomBranches,
			groups		: {Branches:S._g.Branches}
		
		});
		treeOpt.isAllLeavesFront = S.m_allLeavesFront;
		// Find ground lines for this object
		let grounds = obj.M_getGroundLine(opt.MV,opt.ground);

		if( false ) // debug
		{
			for( let ig=0; ig<grounds.length; ig++ )
			{	let gr=grounds[ig];
				let L = new ZPL();
				for( let k=0; k<gr.L.length; k++)
				{	let p = this.Pj(gr.L[k],opt.pos);
					this._DL(S._g.LeavesFeat,new ZL(p,p.M_plus(0,-10*this.u)),true);
					L._aP(p);
				}
				//this._DL(S._g.LeavesFeat,L,true);
			}

		}

		if(grounds.length)
		{
			for(let iTree=0; iTree<nbTrees; iTree++)
			{
				let tree = new ClassTree(this,treeOpt);
				let gr = grounds[ Math.round(this.randomLeaves()*(grounds.length-1))];
				let F = gr.F;
				let l = gr.len * (0.2+0.6*this.randomLeaves());
				let P=gr.L[0].M_plus(gr.L[1].M_minus(gr.L[0])._mB(gr.L[1].dist>0?l/gr.L[1].dist:1) ) ;
				//let p = this.Pj(P,opt.pos);
				//this._DL(S._g.LeavesFeat,new ZL(p,p.M_plus(0,-100*this.u)),true);
				tree.M_setBranchLength( height , segLeng); 
				tree.M_setPosition( P ); //new ZV3(0,opt.ground,0) );
				tree.M_setObject({MV:opt.MV,obj:obj,F:F,back:false});
				tree.M_setDirection(new ZV3(0,1,0));
				tree.M_setRadius( rootWidth/2,0);
				tree.M_run();
				out.push(tree);

			}

		}
		else 
			console.error("Ground.length is NULL ! ");

		this.M_setOrigin2D(null);

		return out;

	}

	 
	 
	// opt.x 
	// opt.y
	// opt.stemSamples ( optional):
	//		.segmentLength
	//		.kStart
	//		.kEnd
	// STEM
	M_getStem(opt,directionStart,directionEnd,stemLength,stemWidth)
	{
		var e= stemWidth*opt.scale;
		var strokeInc = e; //this.m_strokeWidth*1.2;		// TEMP
		/*if( e>=2*this.m_strokeWidth)
			strokeInc=e/(this.m_strokeWidth*1.2);*/
		var strokeInc = this.m_strokeWidth*1.2;
		var segLen = Math.min( opt.seg?? Math.max(stemLength/5,0.5*this.u),stemLength/5);
		var dirChange = -(directionEnd-directionStart) / (stemLength/segLen); 
		var stemLines = [];
		var I = new ZV2();
		var J = new ZV2();
		var direction;
		var SAM = opt.stemSamples;
		let kStartSample=0;
		let kEndSample=1;
		let samples;
		if( SAM)
		{	samples=[];
			kStartSample=SAM.kStart || 0;
			kEndSample= SAM.kEnd??1; if(kEndSample>=0.99) kEndSample = 2;
		}
		let samLen=0;
		let iLine = 0;
		let nbLines = Math.floor(e/strokeInc);
		let iCenterLine = Math.floor(nbLines/2);
		let C = new ZV2(opt.x,opt.y);
		if(stemLength>0.1)
		for( let ie=-e/2; ie<e/2; ie+=strokeInc) 
		{
			let x2 = 0;
			let y2 = 0;			
			direction = -directionStart;
			let line = new ZPL();
			for( var seg=0.; seg<=stemLength; seg+=segLen) 
			{
				I.M_set( cos(direction*D2R),sin(direction*D2R) );
				J.M_set(-I.y,I.x);

				//let pt = new ZV2(x2+I.x*ie,y2-I.y*ie);
				let pWorld = new ZV3(x2+I.x*ie,y2+I.y*ie,0);
				let pt = this.Pj(pWorld,C);
				line._aP( pt);

				// Sampling
				if( SAM && iLine==iCenterLine)
				{

					samLen+=segLen;
					if( samLen>= SAM.segmentLength)
					{
						// generate new sample
						if( (seg/stemLength)>kStartSample && (seg/stemLength)<=kEndSample)
							samples.push( { P:pt.clone(), l:seg,I:I.clone(),J:J.clone() });
						
						// 
						samLen-=SAM.segmentLength;
					
					}
				
				}


				seg+=segLen;
				direction+=dirChange;
				if( seg<=stemLength)
				{
					x2+=J.x*segLen;
					y2+=J.y*segLen;
				}
			}
			stemLines.push(line);
			iLine++;
		}
		 if( stemLines[0] && stemLines[0].M_nb()>=2)
		 {
			 // end point 
			 var end = stemLines[0].M_endPoint(); 
			 let nbLines = stemLines.length;

			 // Make a path with stem for masking
			 let contour = new ZPL();
			 if( true )
			 {
				var l1 = stemLines[0];
				 var l2 = stemLines[nbLines-1]; 
				 contour.M_append(l1); contour.M_appendReverse(l2);
				 				 
			 }
			 // remove lines if not filled  ( should avoid this silly work )  
			 if( (!opt.fillStem) && nbLines>2)
			 {
			 	stemLines=[ stemLines[0],stemLines.pop()];
			 }  
			 // for speeding up rendering, reverse points order for odd lines
			 let sign=-1;
			 for( let i=0; i<stemLines.length; i++)
			 {
			 	sign=-sign;
			 	if( sign<0)
			 		stemLines[i].M_reverseOrder();
			 }
			 
			 let out = { lines: stemLines, end:end, direction:direction}; 
			 if( SAM)
				out.samples= samples;
			out.contour = contour;
			out.contourPath = 	new Path2D(contour._gS(true));
			 return out;

		}
		else {
				console.error("Error no stem lines issued !");
				console.warn(`	M_getStem(opt:${RQPrintR(opt)},directionStart:${directionStart},directionEnd:${directionEnd},stemLength:${stemLength},stemWidth:${stemWidth}) segLen=${segLen}`);
				//exit();
			};


		 // draw the stem lines 
		 //for( let il=0; il<stemLines.length; il++)
		 //{	S._g.Dandelion.m_lines.push(...this.M_computeLineMask(stemLines[il]));
		 //}
		 let out = {lines:[],end:new ZV2(opt.x,opt.y)}; 
		 return out;
	 
	}
  // ---------------------------------------------
  // DAISY
  // ---------------------------------------------
  M_putDaisy(opt)
  {
		var sz = opt.scale;

		var S = opt.S;
		var flowerRadius = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale*0.5;
		var spacing = (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;
		var stemHeight = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		for(let k in S._g) S._g[k].M_applyScale(opt.scale)
		
		var perspectiveReduction = this.m_depthScaleFactor*(1+1*S.random() ); // This is terrible but we have to keep the S.random () for compatibility

		spacing+=flowerRadius;
		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] )/**-Math.sign(opt.x-this.W/2)*/ ; 

		//opt.x+=spacing*0.5;

		var segLen = opt.seg;
		// get lines for a stem
		let widthRatio=0.5;
		if(S.m_hasLeaves)
		{	opt.stemSamples = { segmentLength: S.m_leafOrganize.seg, kStart:S.m_leafOrganize.kStart,kEnd:S.m_leafOrganize.kEnd };
			opt.leaves = { open: {min:0.2 , max:0.9}, inclinaison: -direction, bend : 60, viewerInclinaison: 10+S.random()*10, centerLine:true, group : S._g.DaisyLeaf, groupFeat:S._g.DaisyFeatures }
			// fill
			opt.leaves.fills= S._g.DaisyLeaf.fills; 
			switch(S.m_leafShape)
			{
				default:
				case "Mint":
					opt.leaves.nbProfilePoints=50;
					opt.leaves.profile	= this.M_mintLeafProfile;
					opt.leaves.invProfile  = this.M_mintLeafInvProfile; 
					widthRatio = 0.15; 
					break;
				case "Herb":
					opt.leaves.nbProfilePoints=30;
					opt.leaves.profile	= this.M_herbLeafProfile;
					opt.leaves.invProfile  = this.M_herbLeafInvProfile; 
					opt.leaves.heartShape= 0.18*S.random();
					widthRatio = 0.08; 
					break;
				case "Clover":
					opt.leaves.nbProfilePoints=30;
					opt.leaves.profile	= this.M_cloverLeafProfile;
					opt.leaves.invProfile  = this.M_cloverLeafInvProfile; 
					opt.leaves.heartShape= 0.18*S.random();
					widthRatio = 0.4; 
					break;
			}


		
  		}	
		opt.fillStem = S.m_isFillStem;
		var stemLines = this.M_getStem(opt,0,direction,stemHeight,S.m_stemWidth*opt.scale);
		opt.stemSamples = null;
		if(stemLines.lines.length==0)
			return spacing;
		var end = stemLines.end;
		direction = stemLines.direction;
		
		// Daiy flower center 
		var C = end; // new ZV2( end.x +JDir.x*flowerRadius*0.8, end.y-JDir.y*flowerRadius*0.8);
		 var IDir = new ZV2(cos(direction*D2R),sin(direction*D2R));
		 var JDir = new ZV2(-IDir.y,IDir.x);




		// Draw the flower lines
		var nbPetals = S.m_nbPetals;
		var petalWidth = 1.2*PI*flowerRadius / nbPetals;
		var centerRadius = flowerRadius*S.m_coreRadius;
		var petalLength = flowerRadius-centerRadius; 
		var petalDecal = flowerRadius-petalLength;  
		var a = 0;
		var aIncrement = 2*PI/nbPetals;
		var petals = [];
		var heartL = new ZPL();
		var nbPointsPetal = Math.max( 7,Math.round(30*sz));
		var petalAngleInc = 2*PI/nbPointsPetal;
		
		var stack = [];
		var MV = new RQMatrix4();		// MV is at the center of the flower
		MV.M_rotate(direction,0,0,1);				// rotate in the bend direction of the flower
		MV.M_rotate(S.m_viewerOrientation,1,0,0);			// rotate in the direction of the viewer

		var closeAngleAmout= 40*S.random();
		let bendAmount = -2.5*petalWidth*S.random();
		for( a=0; a<2*PI; a+=aIncrement)		// For each petal 
		{
			let L = new ZPL();
			let aRnd = a + (S.random()-0.5)*PI/15; 
			stack.push(MV.clone());
			
			MV.M_rotate(aRnd/D2R,0,1,0).M_rotate(90-closeAngleAmout,1,0,0);
			
			let Plocal = new ZV3() 
			/*if( this.random() <0.2)
				bendAmount = 5*petalWidth*(this.random()-0.5)*/ 
			for( var ang=-PI*0.5; ang<PI*1.5; ang+=petalAngleInc)
			{	
				let ty =0.5*(1+sin(ang) ); 
				// Plocal is a profile aligned vertically 
				Plocal.M_set( petalWidth*0.5 * cos(ang), petalLength*ty ,0)
				Plocal.y += petalDecal; 
				Plocal.z = bendAmount*(1-cos(ty*PI/2));	// bend the petals
				let Pworld = MV._mBV(Plocal);
				L._aP(this.Pj(Pworld,C) );
				
			
			}
			
			// round for the center 
			Plocal.M_set( 0,petalDecal,0);
			//P.M_set(  IPetal.x*Plocal.x + JPetal.x*Plocal.y, (IPetal.y*Plocal.x + JPetal.y*Plocal.y)*perspectiveReduction);
			//let Pworld = new ZV2( C.x + IDir.x*P.x + JDir.x*P.y,   C.y - ( IDir.y*P.x + JDir.y*P.y)   );
			let Pworld = MV._mBV(Plocal);
			//let Pproj = new ZV2(Pworld.x,-Pworld.y + Pworld.z*this.m_depthScaleFactor);				

			heartL._aP( this.Pj(Pworld,C));

			petals.push({z:Pworld.z, L:L });
			
			MV = stack.pop();
		}
		
		// sort the petals by the z value
		petals.sort( function(a,b){ return a.z<b.z?1 : -1} );

		// Slightly move down the points so that the center of the heart matches the tip of the stem
		let offset = C.M_minus( ZMT.M_getPointsBarycenter(heartL.mP).g );
		heartL.M_translate(offset);
		

	
		// Draw the petals 
		var context = this.m_mask._X();
		let isPassedCenter = false;
		var petalPaths = [];
		let simplified = C.y<this.H*(1-S.m_simplifyThres);
		let Fs,F;
		for(let ip = 0; ip<petals.length; ip++)
		{
			let petal = petals[ip];
			petal.L.M_translate(offset);
			if( (!isPassedCenter) && petal.z<=0)
			{
				isPassedCenter=true;
				// draw the center round
				if( S.m_isDrawHeart)
				{	
					//S._g.DaisyHearts.m_lines.push( ...this.M_computeLineMask( heartL )); 
					this._DL(S._g.DaisyHearts,heartL,true);
				}
				if( isArr(Fs = S._g.DaisyHearts.fills))
				{
					for( let f=0; f<Fs.length; f++)
					{
						if( F=Fs[f])
						{	F.orientation=S.random()*180;
							F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*S.random();
							//F.jointEnds=true;
							//F.m_lines.push( ...this.M_hatchShape( heartL ,F)); 
							this._Fl(F,heartL,F);
						}
					}
				}
				// Draw the center in the mask 
				let path = new Path2D(heartL._gS(false));
				if(context )
				{	
				  context.fillStyle = "white";
				  context.fill(path);

					 if( this.m_isShortenJunctions)
					 {	 context.lineWidth = this.m_protectionStrokeWidth*2;
						 context.strokeStyle = "white";
						 context.stroke(path);
					 }

				}


			}
			// draw the lines
			if(!simplified)
			{	//S._g.DaisyPetals.m_lines.push( ...this.M_computeLineMask( petal.L )) 
				this._DL(S._g.DaisyPetals, petal.L,true);
			}
			// Fill that petal ( only in PNG mode )
			if(this.isPNG())
			{
				if( isArr(Fs = S._g.DaisyPetals.fills))
				{
					for( let f=0; f<Fs.length; f++)
					{
						if( (F=Fs[f]) && F.m_isFill)
							this._Fl(F,petal.L,F);
					}
				}
				
			
			} 
			// draw the mask for this petal 
			let path = new Path2D(petal.L._gS(false));
			if( this.m_isShortenJunctions)
				petalPaths.push(path);
			if(context )
		  	{	
			  context.fillStyle = "white";
			  context.fill(path);
			}

		}
		if(simplified)		// TODO : reorder petals the initial way to improve plotting speed
		{	
			for(let ip = 0; ip<petals.length; ip++)
			{
				let petal = petals[ip];
				// expand points
				let p0 = ZMT.M_getPointsBarycenter(petal.L.mP).g ;

				//let p0 = petal.L.mP[0];
				for (let ipp=0; ipp<petal.L.mP.length; ipp++)
				{	let p = petal.L.mP[ipp];
					let t = p.M_minus(p0);
					t.Nz().M_mul(1.5);
					//console.log("t="+t.M_getString()); 
					p.M_add(t);
				
				}
				//S._g.DaisyPetals.m_lines.push( ...this.M_computeLineMask( petal.L )) 
				this._DL(S._g.DaisyPetals, petal.L,true);

			}
		}
		
		// Draw leaves
		let Samples,rotStart;
		if(S.m_hasLeaves)
		{

			Samples=stemLines.samples;
			rotStart = S.random()*60;
			let radiusFunc= function(y,min,max){return min+(1-Math.pow(y,2))*(max-min) }
			
			for( let iSam=0; iSam<Samples.length; iSam++)
			{	let sam = Samples[iSam];
				sam.leafSize = radiusFunc(sam.l/stemHeight, S.m_size.min,S.m_size.max)*opt.scale;	// TODO !

				opt.x=sam.P.x;
				opt.y=sam.P.y;
				opt.leaves.rotationStart = rotStart + S.m_leafOrganize.shiftDeg*iSam;
				opt.leaves.length=sam.leafSize;
				opt.leaves.width= sam.leafSize*widthRatio;
				this.M_organizeLeaves(this.M_drawMintLeaf, opt,"front",S.m_leafOrganize.nb);
			}	
		}

		// draw the stem lines 
		for( let il=0; il<stemLines.lines.length; il++)
		{	//S._g.DaisyStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
			this._DL(S._g.DaisyStem, stemLines.lines[il],true);
		}
		// draw the stem in mask
		if( stemLines.contourPath)
		{
			context.fill(stemLines.contourPath);
			if( this.m_isShortenJunctions)
			{	context.lineWidth = this.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(stemLines.contourPath);
			}

		}
		
		if(S.m_hasLeaves)
		{

			for( let iSam=0; iSam<Samples.length; iSam++)
			{	let sam = Samples[iSam];
				opt.x=sam.P.x;
				opt.y=sam.P.y;
				opt.leaves.rotationStart = rotStart + S.m_leafOrganize.shiftDeg*iSam;
				opt.leaves.length=sam.leafSize;
				opt.leaves.width= sam.leafSize*widthRatio;
				opt.leaves.group = S._g.DaisyLeaf;
				this.M_organizeLeaves(this.M_drawMintLeaf, opt,"back",S.m_leafOrganize.nb);
			}	
	
		
		}
		// protect the contour of the flower
		 if( this.m_isShortenJunctions)
		 {	 context.lineWidth = this.m_protectionStrokeWidth*2;
			 context.strokeStyle = "white";
			 let path;
			 while( path=petalPaths.pop())
			 	context.stroke(path);
		 }


		
		return spacing;		  				  
  
  }

  M_checkParam(_m,opt){ 
	// S=opt.S _m{flwRad,stemH,dir
 }

  // ---------------------------------------------
  // POPPY
  // ---------------------------------------------
  M_putPoppy(opt)
  {
		let S=opt.S, sz = opt.scale, u=this.u;
		var spacing = (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*sz;	// Terrible ... 
		let _m=
		{ 	flwRad	: S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*sz*0.5,
			stemH	: S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*sz,
			dir		: S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ) 
		}	
		spacing+=_m.flwRad;
		this.M_checkParam(_m,opt)

		let stemHeight = _m.stemH, flowerRadius=_m.flwRad,direction=_m.dir;

		var segLen = opt.seg;
		let v,Gs=S._g
		for(v in Gs) Gs[v].M_applyScale(sz)


		// get lines for a stem
		opt.fillStem = S.m_isFillStem;
		var stemLines = this.M_getStem(opt,0,direction,stemHeight,S.m_stemWidth*sz);
		if(stemLines.lines.length==0)
			return spacing;

		var end = stemLines.end;
		direction = stemLines.direction;
		
		// Poppy flower center 
		var C = end;
		 var IDir = new ZV2(cos(direction*D2R),sin(direction*D2R));
		 var JDir = new ZV2(-IDir.y,IDir.x);




		// Draw the flower lines
		var nbPetals = Math.round(7+S.random()*3);
		var centerRadius = flowerRadius*0.12;
		var petalLength = flowerRadius-centerRadius; 
		var petalWidth = petalLength;
		var petalDecal = flowerRadius-petalLength;  
		var nbLines = Math.max( 8, 2*Math.round(2*PI*flowerRadius / (petalWidth+this.m_strokeWidth+this.m_protectionStrokeWidth)/2));
		var a = 0;
		var petalRepartitionAngle =5*PI; 
		var aIncrement = petalRepartitionAngle/nbPetals;
		var Istem = new ZV2(cos(direction*D2R),-sin(direction*D2R));
		var Jstem = new ZV2(Istem.y,-Istem.x);
		var i=0;
		var petals = [];
		var heartL = new ZPL();
		var nbPointsPetal = Math.max( 7,Math.round(30*sz));
		var petalAngleInc = 2*PI/nbPointsPetal;
		
		var stack = [];
		var MV = new RQMatrix4();		// MV is at the center of the flower
		MV.M_rotate(direction,0,0,1);				// rotate in the bend direction of the flower
		MV.M_rotate(S.m_viewerOrientation,1,0,0);			// rotate in the direction of the viewer

		var openAmout= 10;//40*S.random();
		let bendAmount = -2.5*petalWidth; //*S.random();


		let leafOpt = {segments:200,drawContour: true,bendBeta:45,spaceOrientation: S.m_viewerOrientation, size: petalLength, ratio: petalWidth/petalLength , segments:nbPointsPetal ,heartRad:centerRadius, profile: this.M_poppyPetalProfile, group:S._g.PoppyPetals , centerLine :false };

		let Plocal = new ZV3(); 
		let iPetal;
		for( a=PI*S.random(),iPetal=0; iPetal<nbPetals; iPetal++)		// For each petal 
		{
			let MVpetal = MV.clone();
			
			MVpetal.M_rotate(a/D2R,0,1,0);
			MVpetal.M_translate(0,0,petalDecal);
			MVpetal.M_rotate(0+4*iPetal,1,0,0);
			Plocal.M_set( 0,0,0);
			let Pworld = MVpetal._mBV(Plocal);


			petals.push({z:Pworld.z, MV: MVpetal, opt:{...leafOpt} });
			a+=aIncrement;	
		}
		let aHeartInc =PI*2/20; 
		for( a=0; a<PI*2; a+=aHeartInc)
		{
			// round for the center 
			stack.push(MV.clone());			
			MV.M_rotate(a/D2R,0,1,0).M_rotate(45,1,0,0);
			let Plocal = new ZV3() 
			Plocal.M_set( centerRadius,0,0);
			let Pworld = MV._mBV(Plocal);
			heartL._aP( this.Pj(Pworld,C));
			MV = stack.pop();

		}
		// sort the petals by the z value
		petals.sort( function(a,b){ return a.z<b.z?1 : -1} );

		// Slightly move down the points so that the center of the heart matches the tip of the stem
		let center = ZMT.M_getPointsBarycenter(heartL.mP).g;
		let offset = C.M_minus( center );
		heartL.M_translate(offset);
		

	

	
		// Draw the petals 
		var context = this.m_mask._X();
		let isPassedCenter = false;
		var petalPaths = [];
		let Fs,F;
		center.seg	= opt.seg;
		center.scale= sz;
		for(let ip = 0; ip<petals.length; ip++)
		{
			let petal = petals[ip];
			if( (!isPassedCenter) && petal.z<=0)
			{
				isPassedCenter=true;
				// Draw stamen
				if( S.hasStamen )
				{	
					let MV=new RQMatrix4(),s=S.Stmn,
					O={radi:centerRadius,stamenL:rndRange(s.len,s.rnd)*sz*u,dotRad:rndRange(s.dotRad,s.rnd)*sz*u}
					this.M_drawStamen(S,MV,C,O)
				}

				// draw the center round
				if( S.m_isDrawHeart)
				{	
					this._DL(S._g.PoppyHearts,heartL,true);
				}
				if( isArr(Fs = S._g.PoppyHearts.fills))
				{
					for( let f=0; f<Fs.length; f++)
					{
						if( (F=Fs[f]) && F.m_active)
						{	F.orientation=S.random()*180;
							F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*S.random();
							//F.jointEnds=true;
							//F.m_lines.push( ...this.M_hatchShape( heartL ,F)); 
							this._Fl(F,heartL,F);
						}
					}
				}
				// Draw the center in the mask 
				this._dM(heartL)

			}
			// use draw leaf to draw a petal  
			let path2D = this.M_drawPetal(C.M_plus(offset),petal.MV,petal.opt);
			//console.log("Type = "+typeof path2D+" val = "+path2D);
			if(path2D && typeof path2D=="string")
				petalPaths.push(path2D);



		}

		// draw the stem lines 
		let m,g=S._g.PoppyStem;

		for( let il=0; il<stemLines.lines.length; il++)
		{	this._DL(g, stemLines.lines[il],true);
		}
		// Fill stem 
		if( m=stemLines.contour)
		{	this.M_applyFills(g,m)
			this._dM(m);
		}	
		
		// protect the contour of the flower
		 if( this.m_isShortenJunctions && this._maskingOn)
		 {	 context.lineWidth = this.m_protectionStrokeWidth*2;
			 context.strokeStyle = "white";
			for( let i=0; i<petalPaths.length; i++)
			{
			 	context.stroke(new Path2D(petalPaths[i]));
			}
		 }

		 // Draw a mask under the poppies petals by stacking a paper color background
		 if(this.isPNG() && S._g.PoppyMask.fills && this._renderOn)
		 {
		 	for( let i=0; i<petalPaths.length; i++)
		 	{		let color,F; 	
					if(F=S._g.PoppyMask.fills[0])
						color=this.M_getGroupColor(F);
					else color =this.M_getColor("paper");
					this.mH.push({m:"fill",c:color,path:new Path2D( petalPaths[i]),l:petalPaths[i]});
			}
		}
		
		return spacing;		  				  
  
  }
  M_drawStamen(S,MV,C,opt)
  {	
	let _=this;
	opt??={}
	  let centerRadius=opt.radi??_.printMm(10);
	  let dotRadius =opt.dotRad??_.printMm(0.5);
	  let hasStamen = opt.stamenL??0
	  // MV
	  // C
	  
	  // Create the heart dots 
	  let dotsShapes;
	  let _2PI = PI*2;
	  if( centerRadius>0.5*_.u)	// TODO no u
	  {
		  dotsShapes=[];
		  
		  // create a shape for the dot
		  let rDotIn = Math.max( dotRadius,centerRadius/6),
		  rDot = rDotIn+(S._g.StamenTip.m_strokeWidth??0),
		  circ = new RQCircle(0,0,rDotIn),
		  circPts = circ._cP(20);

		  // spiral
		  let r=1*rDot;
		  let a=0;
		  let bumpDot = 0.4*centerRadius; // normal bump
		  let distanceStamen =opt.stamenL??0
		  let rMul=hasStamen? 1.8 : 1;
		  let kRecentr=0.4;
		  while(r<centerRadius)
		  {	
			  while(a<_2PI)
			  {	
				  let h = cos(r/centerRadius*PI/2);
				  let v=new ZV3(rMul*r*cos(a), distanceStamen+bumpDot*h*h,rMul*r*sin(a));
				  let pWorld  = MV._mBV(v);
				  let dotC = _.Pj( pWorld, C)

				  // create the dot's shape
				  let dotShape = new ZPL();
				  for( let i=0; i<circPts.mP.length; i++)
				  {	let p=circPts.mP[i];
					  dotShape._aP( dotC.M_plus(p) );
				  }
				  let dotOpt = {shape:dotShape,z:pWorld.z};
				  if( hasStamen)
				  {   let startV = new ZV3(kRecentr*r*cos(a), bumpDot*h*h,kRecentr*r*sin(a))
					  let startVWorld =MV._mBV(startV); 
					  dotOpt.stamen={ 
						  start   :  _.Pj(startVWorld,C),
						  end     : dotC

					  }

				  }
				  
				  dotsShapes.push(dotOpt);
				  // avance to next point
				  a+=2*rDot/r;
				  r+=rDot/r;
			  }
			  while(a>0) a-=_2PI;

		  }
	  }	
	  // render the dots
	  let nb
	  if(dotsShapes!=undefined &&(nb=dotsShapes.length))
	  {

		  if(opt.nb)	// limit the nb
		  {	let s=0,k=opt.nb/nb;
			  //console.log(`k= ${k}`);

			  for(let i=0; i<dotsShapes.length;i++)
			  {	if(s>=0)	// keep
				  {	s-=1;
				  }
				  else
				  {	s+=k;
					  dotsShapes.splice(i,1);
					  i--;
				  }

			  }

		  }
		  // Sort by z 
		  dotsShapes.sort( function(a,b){ return a.z<b.z?1 : -1} );

		  let g = S._g.StamenTip;
		  let gStamen = hasStamen? S._g.Stamen : null;
		  if(gStamen&& !gStamen.m_active) gStamen=null;
		  let F,Fs = g.fills;
		  if(Fs) F=Fs[0]

		  
		  for(let i=0; i<dotsShapes.length; i++)
		  {	
			  let s=dotsShapes[i].shape;
			  if(F&&F.m_active) _._Fl(F,s,F); 
			  _._DL(g,s,true);
			  _._dM(s,{protect:0});
		  
			  if( hasStamen && gStamen)
			  {   let stamn = dotsShapes[i].stamen;
				  _._DL( gStamen, new ZL(stamn.start,stamn.end),true);

			  }
		  }

	  }		
	  
  }		
  
	// M_drawPetal ( 3D approach )
	//  C : point where is leaf attached 
	//  opt.spaceOrientation
	//  opt.size 		: length(height) of leaf 
	//  opt.ratio 		: leaf width relative to height
	//  opt.segments	: nb segments for petal
	//  opt.profile		: profile for the petal {x(t),y(t)}
	//  opt.group		: group for leaf rendering
	//  opt.centerLine	: boolean
	//  opt.drawContour : boolean
	// 	opt.heartRad	: heartRadius


	M_poppyPetalProfile(t,opt)
	{
	   /*const thres=0.2;
	   let x = sin(Math.pow(Math.max(t,thres),1.3)*PI)*(t>=thres? 1: t/thres);
	
	   return {x: x, y : t>thres?sin((t-thres)/(1-thres)*PI*0.5 ) :0  };*/	
	  let x = sin(t*PI);
	  let y = sin(t*PI*0.5 ); 
	  let modFact = 2;
	  let rnd = 0.5*(1+Noz(opt.C.x+x*modFact,opt.C.y+y*modFact)); 				
	  let fact = 1+0.2*rnd*y*y*y;
	  
	  return {x: x*fact, y : y*fact };	
	
	}

	M_drawPetal(C,MV,opt)
	{
		let leafProfile = opt.profile;	// TODO
		opt.C = C;
		
		var spaceOrientation = opt.spaceOrientation || 25;
		MV.M_rotate(spaceOrientation,1,0,0);			// rotate in the direction of the viewer

		let sz = opt.size;
		// size : sets the ratio x/y 
		var size = new ZV2( sz*(opt.ratio || 0.75), sz);


		let isVisible = this.mdA.iPI(C); 
		if( !isVisible )
			return;

		// nbPoints : number of points on the leaf profile
		let nbPoints = opt.segments || 30;

	
		let leafWidth 	= size.x*0.5;
		let leafLen 	= size.y; 


	   let Plocal = new ZV3() 
	   let P = new ZV2(); 

		// bend alpha : angle of bend 
	   let bendAlpha = (opt.bendAlpha ||2)*D2R;
	   let bendR  = abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 1;
	   let bendBeta =  -(opt.bendBeta ||5)*D2R; //-90*Math.max(0.3,abs(noiz))*D2R;				// ?
	   let bendRBeta = abs(bendBeta)>0.02 ? leafWidth/bendBeta : 1 
	   var kProfile = 1./(nbPoints-1);
	   let L = new ZPL(); 
	   var p0,p;
	   
	   let cutThres=0.2;
	   for( let i=0; i<2*nbPoints; i++)
	   {	
		   let aProfile = i*kProfile; 
		   p0= leafProfile.apply(this,[aProfile,opt]);
		   p = p0.y>cutThres ? {x:p0.x,y:p0.y-cutThres} : {x:p0.x,y:0} 
		   let kMap = 1-Math.pow(Math.max(0,p0.y-cutThres),3);  
		   let dz = (1-cos( p.y*bendAlpha))*bendR; 
		   let y = bendR*sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 

		   let dzBeta = (1-cos( p.x*bendBeta))*bendRBeta; 
		   let x = bendRBeta*sin(p.x*bendBeta);
			let dAng = x/(opt.heartRad*PI);
			let rad= opt.heartRad+y;
			let pMap = new ZV3(rad*sin(dAng), y,rad*(cos(dAng)-1));
			//Plocal.M_set( x, y,dz+dzBeta)	// ok
			Plocal.M_set( Plocal.x + (pMap.x-Plocal.x)*kMap, Plocal.y + (pMap.y-Plocal.y)*kMap, Plocal.z + (pMap.z-Plocal.z)*kMap);

			// P is the point oriented around the flower 
			let Pworld = MV._mBV(Plocal);			   
			   
			L._aP(  this.Pj(Pworld,C ) );
		   
	   }
	   let O = C; 				
		//O.M_add(C);
		
	   // centerLine
	   let centerL = null;
	   /*
	   if( opt.centerLine && p && p.y>0)
	   {	
	   		centerL = new ZPL();
	   		let segLen = 1*this.u/leafLen;
	   		let lineLen = 0.8*p.y;
	   		let nb  = lineLen/segLen;
	   		let y = 0;
	   		for( let i=0; i<=nb; i++)
	   		{
			    let dz = (1-cos( y*bendAlpha))*bendR; 
				let dy = bendR*sin(y*bendAlpha);

		   		Plocal.M_set( 0, dy,dz)
			    Plocal.y += leafDecal; 
			   let Pworld = MV._mBV(Plocal);			   
			   centerL._aP( this.Pj(Pworld,C));
												
				y+=segLen;
			}  
	   }*/

		
	   // joint lines
	   var pathPoints = L._gS(true);
	   

		// Computing the normal and lighting
		let N = MV.mRV((new ZV3(1,0,0)).M_cross( new ZV3(0,1,0))).Nzd(); 
		let lighting = (1+N.M_dot(this.m_lightSource))*0.5;
		lighting*=lighting;
		let lightMax = 1; 
		

		let drawContour = opt.drawContour; //this.m_drawLeafContour ; //opt.drawContour;

		let fills = opt.group.fills;
		if( isArr(fills) )
		{
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];
				this.leafFillCount = 0+this.leafFillCount+1;
				if( F && lighting<=lightMax)
				{	
					let o = MV.mRV(new ZV3(0,1,0) );
					//let oProj = new ZV2(o.x, -o.y + o.z*this.m_perspectiveFactor);  
					//F.leaves = {...opt};
					F.orientation= this.M_projectedOrientation(o); // Math.atan2(oProj.y,oProj.x)/D2R;
					F.spacing=  ZMT.M_map( lighting,0.01,lightMax,F.m_spacing.min , F.m_spacing.max);
					//console.log("N="+N.M_getString()+" lighting="+lighting+" spacing="+F.spacing);
					//F.jointEnds=true;
					F.group = true;
					//F.m_lines.push( ...this.M_hatchShape( L[0] ,F)); 
					if(F.setup) F.setup.apply(this,{g:opt.group,shape:L})					
					this._Fl(F,L,F);
					if(F.end) F.end.apply(this,{g:opt.group,shape:L})					
				}
			}	
		}
		else 
			drawContour = true;

	   // Draw the contour lines
	   if(drawContour)
		   //this._g.Leaves.m_lines.push(...this.M_computeLineMask(L[0]));
			this._DL(opt.group,L,true);
		if( centerL)
			this._DL(opt.group,centerL,true);
		  // this._g.Leaves.m_lines.push(...this.M_computeLineMask(centerL));
		

		// draw the leaf in the mask
		this._dM(L)
		/*var path = new Path2D(pathPoints);
		if(this.m_mask)
		{	
			var context = this.m_mask._X();			
			context.fillStyle = "white";
			context.fill(path);
		}*/	
		return pathPoints;

	}	
	
	
	

	 /*M_hatchFuncGradient(P1,P2,opts)
	 {
			opts.spacing = ZMT.M_map(P1.y,this.H,this.H*(1-this.m_documentHorizon),this.m_strokeBackground*0.5,this.m_strokeBackground*15);
		 	return new ZL(P1,P2);
	 }*/


	 


	// ---------------------------------------------
	//  M_dandelionLeafProfile
	// ---------------------------------------------

	M_dandelionLeafProfile(t,opt)
	{
		let x= sin(t*PI);
		// wave 
		x-= abs(sin(t*PI*opt.leaves.dandelionSpikes)*x*0.5);
		return {x:x,y:t};	
	}
	// ---------------------------------------------
	//  M_drawDandelionLeaf
	// ---------------------------------------------
	M_drawDandelionLeaf(MV,opt)
	{
	
		opt.leaves.dandelionSpikes = 5;		
	    opt.leaves.nbProfilePoints=50;
	   	opt.leaves.profile	= this.M_dandelionLeafProfile;
	   	opt.leaves.invProfile  = this.M_dandelionLeafInvProfile; 

	    this.M_drawLeaf( MV,opt);
	}


	// ---------------------------------------------
	// herb leaf
	M_herbLeafProfile(t,opt)
	{
		let x = sin(Math.pow(t,0.4)*PI);
		//if(Math.random()<0.1) x*=0.8;		// TEMP TEST TEST
		return {x: x, y : sin(t*PI*0.5 ) };	
	}
	M_herbLeafInvProfile(y,OL)
	{
		let t= Math.asin(y)/( PI*0.5 );
		let x= sin(Math.pow(t,0.4)*PI); 	
		return {x:x,t:t};
	}

 
	

	// ---------------------------------------------
	// clover leaf
	M_cloverLeafProfile(t,opt)
	{
	   // Y² + X² = 1
	   // y = sqrt( 1-X²) 
	   // avec x € [-1;1] ==> x = 2*(t-0.5)
	   //let x =  2*t-1;
	   //x = Math.sqrt(1-x*x)
	   let x = sin(Math.pow(t,0.8)*PI);
	   return {x: x, y : sin(t*PI*(0.5+opt.leaves.heartShape ))  };	
	}
	M_cloverLeafInvProfile(y,OL)
	{
		let t= Math.asin(y)/( PI*(0.5+OL.heartShape) );
		let x= sin(Math.pow(t,0.8)*PI); 	
		return {x:x,t:t};
	}
	M_ashLeafProfile(t,opt)
	{  
	   let n = opt.leaves.ashLeaves; 
	   let i=Math.floor(t*n);
	   let y = i/n;
	   let t1 =(t-y)*n; 
	   let t2 = 2* Math.max(0,(t1-0.1)/0.9);
	   
	   let tt= t2<=1? t2 : 2-t2;
	   let sign = t2<=1? 1 : -1;
	   let ttt=Math.max(0,tt-0.1)/0.9;
	   let x = sign*sin(Math.pow(ttt,0.8)*PI);
	   x-=sign*sin(Math.pow(ttt,1.5)*PI)*0.4;
	   x/=(2*n);
	   if(i==Math.floor(n))
	   {	y+=ttt*0.5;
	   		tt=x;
	   }
	   else
	   {	tt*=opt.leaves.orient[i].sz;
	   		y+=tt*opt.leaves.orient[i].o-x;
	   		//y+=tt*0.3-x;
		}
	   return {x: tt, y : y- (Math.min(t1-0.1,0)/-0.1-1)/n };	
	}


	M_drawCloverLeaf(MV,opt)
	{
	   this.M_drawLeaf( MV,opt);
	}


};
/*if( typeof A === 'undefined')
	A= new GrassAlgorithm();*/ 



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/Mesh.js?v=1681489318

class Face 
{
	constructor(...args)
	{
		this.mP = [];	
		this.mP.push(...args);
		this.m_edges = [];		// reference to the edges of this face
	}
	M_setNormal(x,y,z)
	{
		if(this.m_normal==undefined)
			this.m_normal = new ZV3();
		this.m_normal.M_set(x,y,z);
		return this;
	}
	// Computes this.m_normal
	// returns true if it's been reversed
	// face.O (optionnal) : local center for normal direction computation
	M_computeNormal(unchecked)
	{	let isReverse=false;
		if(this.mP.length>=3)
		{
			let N = this.M_getNormalRaw().Nz();
			// check direction
			if(!unchecked)
			{	let objN = ZMT.M_getPointsBarycenter(this.mP).g;
				if(this.O)
					objN.M_sub(this.O);
				objN.Nz();
				if(objN.M_dot(N)<0)
				{	N.M_mul(-1);
					isReverse=true;
				}
			}
			//console.log( "normal dot="+objN.M_dot(N));
			this.M_setNormal(N);
		}
		return this;
	
	}
	M_computeBarycenter()
	{	if(!this.m_g)
		{	let g = ZMT.M_getPointsBarycenter(this.mP);
			this.m_g = g.g;
		}
		return this.m_g;

	}
	M_computeAABB(andZRange)
	{
		if(!this.m_aabb)
		{
			var r;
			var nb=this.mP.length;
			let z;
			for( let i=0; i<nb;i++)
			{	let p = this.mP[i];
				if( i==0)
				{	r = new ZRc(p.m_projected.x,p.m_projected.y,0,0);
					if(andZRange)
						z=this.m_zRange={min:p.m_dEye,max:p.m_dEye}
	
				}
				else
				{	r.M_extend	(p.m_projected.x,p.m_projected.y,0,0);
					if(andZRange)
					{	if(p.m_dEye<z.min)	z.min = p.m_dEye;
						else if(p.m_dEye>z.max)	z.max = p.m_dEye;
					}

				}	
			}
			this.m_aabb=r;		
		}
		return this.m_aabb;

	}
	M_getNormalRaw()
	{
		let AB = this.mP[1].M_minus(this.mP[0]);
		let AC = this.mP[2].M_minus(this.mP[0]);
		return AB.M_cross(AC);

	}
	M_makeLocalBasis()
	{
		if(this.mP.length>=3)
		{
			let AB = this.mP[1].M_minus(this.mP[0]).Nz();
			let AC = this.mP[2].M_minus(this.mP[0]).Nz();
			let N = AB.M_cross(AC).Nz();
			let J = N.M_cross(AB);
			this.m_localBasis = {O: this.mP[0],I:AB,J:J, K:N};


			//console.log("M_makeLocalBasis normal="+this.m_normal.M_getString()+" N="+this.m_localBasis.K.M_getString());
		}

	}
	M_makeLocalBasisTransformed(MV)
	{
		if( !this.m_localBasis)
			this.M_makeLocalBasis();
		if( !this.m_localBasisTransformed)
		if( MV)
		{	this.m_localBasisTransformed={
			O: MV._mBV(this.m_localBasis.O),
			I: MV.mRV(this.m_localBasis.I),
			J: MV.mRV(this.m_localBasis.J),
			K: MV.mRV(this.m_localBasis.K) };

			//console.log("M_makeLocalBasis normalTransformed="+this.m_normalTransformed.M_getString()+" N="+this.m_localBasisTransformed.K.M_getString());

			// compute points coordinates in the new basis
			this.m_localPoints = [];
			for(let i=0; i<this.mP.length; i++)
			{
				let p0 = MV._mBV(this.mP[i]).M_minus(this.m_localBasisTransformed.O);
				let plocal = new ZV2(this.m_localBasisTransformed.I.M_dot(p0),this.m_localBasisTransformed.J.M_dot(p0));
				this.m_localPoints.push(plocal);
	

			}

			// debug - draw it 
			//A.M_drawDebugBasis(this.m_localBasisTransformed);

		}

	}


	// v is normalized
	// normalTransformed is available
	// basis = O ( x, v, N)
	M_makeBasisWithVector(O,v)
	{
		let X = v.M_cross(this.m_normalTransformed);
		let Y = this.m_normalTransformed.M_cross(X);
		return {O:O,X:X,Y:Y,Z:this.m_normalTransformed};
	}
	
	M_getProjectedSvgPath()
	{
		if(!this.m_svgPath2D)
		{
			var L = new ZPL();
			for(let i=0; i<this.mP.length; i++)
				L._aP( this.mP[i].m_projected);
			let path = L._gS(false);
			this.m_svgPath2D = new Path2D(path);

		}
		return this.m_svgPath2D;
	}
	
	M_interpolatedEyeDist(P)
	{	//https://codeplea.com/triangular-interpolation
		let n=this.mP.length;
		let dEye=0;
		if(n>=3)
		{	
			let P1 = this.mP[0].m_projected;
			let P2 = this.mP[1].m_projected;
			let P3 = this.mP[2].m_projected;

			let denom = (P2.y-P3.y)*(P1.x-P3.x) + (P3.x-P2.x)*(P1.y-P3.y);
			let W1 = ((P2.y-P3.y)*(P.x-P3.x)+(P3.x-P2.x)*(P.y-P3.y))/denom;
			let W2 = ((P3.y-P1.y)*(P.x-P3.x)+(P1.x-P3.x)*(P.y-P3.y))/denom;
			let W3 = 1-W1-W2;

			dEye = this.mP[0].m_dEye*W1+this.mP[1].m_dEye*W2+this.mP[2].m_dEye*W3;
		}
		else
		{	// should not be
			dEye=0;
			for(let i=0;i<n;i++)
				dEye+=this.mP[i].m_dEye;
			if(n) dEye/=n;
		}
		return dEye;
	}
	// M_triangulate
	// creates m_triangle = array of {a,b,c} ( indexes in mP list)
	M_triangulate()
	{
		// Make local basis
		if(!this.m_localBasis)
		{
			this.M_makeLocalBasis();
		}
		let points=[];
		//let flatPoints = [];
		for( let i=0; i<this.mP.length; i++)
		{	
			let p0 = this.mP[i].M_minus(this.m_localBasis.O);
			let plocal = new ZV2(this.m_localBasis.I.M_dot(p0),this.m_localBasis.J.M_dot(p0));
			//flatPoints.push(plocal.x,plocal.y);
			points.push(plocal);
		}
		// Use Delaunator. But we have a problem with not convex shapes  : todo : using Earcut maybe ? 
		// here is a port on three.js : 
		// https://github.com/mrdoob/three.js/blob/master/src/extras/Earcut.js
		
		//let d = new Delaunator(flatPoints);
		
		let d = new RQTriangulate(points)

		let tri = d.triangles;
		let n = tri.length;
		// the triangles		
		this.m_triangles=[];
		for( let i=0; i<n; )
		{	
			let triangle = { a: tri[i++], b: tri[i++] , c: tri[i++] };
			this.m_triangles.push(triangle);
		}
	}
	M_makePolyline( pos, MV)
	{
		let L = new ZPL();
		let el=this.m_edges.length;		
		for( let i=0; i<el; i++)
		{	let isPrev = L.M_nb()>0;
			let e = this.m_edges[i];
			if( e.isSegmented && e.poly)
			{
				for(let j=isPrev?1:0; j<e.poly.M_nb(); j++)
				{
					let pTransformed = MV._mBV(e.poly.M_getPoint(j) );
					L._aP(A.Pj(pTransformed,pos));
					
				}
			
			}	
			else 
			{	//
				let pTransformed;
				if( !isPrev)
					L._aP(A.Pj( MV._mBV(e.A) ,pos)) ;
				L._aP(A.Pj( MV._mBV(e.B) ,pos)) ;
			}
				
		}			
		return L;	
	
	}
	M_makePolylineClip( pos, MV,opts)
	{
		let L = new ZPL();
		let yClip = opts.yClip;
		let pNext =0;
		let el=this.m_edges.length;
		
		for( let i=0; i<=el; i++)
		{	let e = this.m_edges[ i==el?0:i];
			if( e )
			{
				let pA = MV._mBV(e.A);
				let pB = MV._mBV(e.B);
				let valid= true;
				if( pA.y<yClip && pB.y<yClip)
				{
					// do Nothing
					valid=false; 
					pNext = 0;
				}
				else if( pA.y>=yClip && pB.y<yClip)
				{
					pNext = pB.M_plus( pA.M_minus(pB).M_mul(  (yClip-pB.y)/(pA.y-pB.y) ));				
				}
				else if( pA.y<yClip && pB.y>=yClip)
				{
					pA = pA.M_plus( pB.M_minus(pA).M_mul(  (yClip-pA.y)/(pB.y-pA.y) ));				
					pNext=0;
				}
				if( valid)
				{	//let Pproj = new ZV2(pA.x,-pA.y + pA.z*zfact);				
					L._aP(A.Pj(pA,pos) /*Pproj.M_plus(pos)*/);
				}
				if( pNext )
				{
					//let Pproj = new ZV2(pNext.x,-pNext.y + pNext.z*zfact);				
					//L._aP(Pproj.M_plus(pos));
					L._aP(A.Pj(pNext,pos) /*Pproj.M_plus(pos)*/);
					pNext = 0;				
				}
			}
		}
		L.M_closePath();
		return L;	
	
	}
	M_makePolylineClipWithEdges( pos, MV,opts)
	{

		let yClip = opts.yClip;
		let el=this.m_edges.length;
		let out=[];
		let L = null;
		for( let i=0; i<el; i++)
		{	let e = this.m_edges[i];
		
			if(e && !e.friendOrMe().isDrawn )
			{
				e.friendOrMe().isDrawn = true;
				let flat =e.friendOrMe().isFlat; 
				let pA = MV._mBV(e.A);
				let pB = MV._mBV(e.B);
				let valid=true;
				if( pA.y<yClip && pB.y<yClip)
				{
					valid=false;
				}
				else if( pA.y>=yClip && pB.y<yClip)
				{
					pB = pB.M_plus( pA.M_minus(pB).M_mul(  (yClip-pB.y)/(pA.y-pB.y) ));				
				}
				else if( pA.y<yClip && pB.y>=yClip)
				{
					pA = pA.M_plus( pB.M_minus(pA).M_mul(  (yClip-pA.y)/(pB.y-pA.y) ));				
				}
				if( valid)
				{
					let PprojA = A.Pj(pA,pos) //new ZV2(pos.x+pA.x,pos.y -pA.y + pA.z*zfact);				
					let PprojB = A.Pj(pB,pos) //new ZV2(pos.x+pB.x,pos.y -pB.y + pB.z*zfact);				
					if( L==null || flat!=L.isFlat || !L.M_endPoint().M_equals(PprojA))
					{	L = new ZPL();
						L.isFlat = flat;
						out.push(L);
						L._aP(PprojA);
						L._aP(PprojB);
											
					}
					else
					{
						L._aP(PprojB);
					}
					

				
				}

			}
									
		
		}
		return out;	
	
	}
	// Face : create a polyline
	// no clipping to ground
	// allows segmentation
	M_makePolylineWithEdges( pos, MV)
	{
		let out=[];
		let prevE=null;			// previously drawn edge
		let el=this.m_edges.length;
		let segments=[];
		let points = null;
		
		// for each edge
		for( let i=0; i<el; i++)
		{	let e = this.m_edges[ i];
			
			// if edge isn't already draw
			if(e && !e.friendOrMe().isDrawn )
			{
				let flat =e.friendOrMe().isFlat; 
				// if line started,  or different stroke width : create a new line 
				if( points==null || flat!=points.flat /*|| !L.M_endPoint().M_equals(PprojA)*/)
				{ 
					points = {flat:flat, p:[]};
					segments.push(points)					
				}
				e.friendOrMe().isDrawn = true; 
			}
			// this edge is already drawn : cut the line 
			else 
			{ 	
				points=null;
			}			
			// if we have a point 
			if( points)
			{
				let isPrev= points.length?true:false;
				if(e.isSegmented && e.poly)
				{
					for(let j= (isPrev? 1:0); j<e.poly.M_nb(); j++)
					{
						points.p.push(e.poly.M_getPoint(j))
					}
				
				}
				else
				{
					if( !isPrev)
						points.p.push(e.A);
					points.p.push(e.B);
				}
			}
		
		}
		for( let i=0; i<segments.length; i++)
		{	points=segments[i];
			let L = new ZPL();
			L.isFlat = points.flat;
			for( let j=0; j<points.p.length; j++)
			{
				let pTransformed = MV._mBV(points.p[j]);
				L._aP(A.Pj(pTransformed,pos));
			}
			out.push(L);
			
		}
		return out ;	
	
	}

	M_getString()
	{
		let s="";
		s+=" nbPoints = "+this.mP.length+" [";
		for( let i=0; i<this.mP.length; i++)
		{
			s+= " "+this.mP[i].m_index;
		
		}
		s+=" ]";
		return s;
	
	
	
	}
};
class Edge extends ZL
{
	constructor(...args)
	{
		super(...args);

		this.friend  	= null;
	}
	friendOrMe()
	{
		if(this.friend)
			return this.friend;
		return this;
	}
	M_segment(segLen)
	{
		let e =this.friendOrMe();
		if(!e.isSegmented)
		{	e.isSegmented = true;
			let l=0;
			let P = e.A.clone();
			let dist =e.A.M_dist(e.B); 
			e.poly = new ZPL();
			if( dist>segLen)
			{
				let u = e.B.M_minus(e.A)._mB(segLen/dist);
				while(l<dist)
				{	e.poly._aP(P.clone());
					P.M_add(u);
					l+=segLen;
				
				}
			}
			else
				e.poly._aP(P);					

			e.poly._aP(e.B.clone());					
		
		}
		// copy the points to this segment if it's a friend
		if( this.friend && !this.isSegmented)
		{
			this.isSegmented =true;
			// same direction ? 
			if( this.reverse)
			{
				this.poly = new ZPL(/*e.poly.mP*/);	// will make references to points
				let nb = e.poly.M_nb();
				for( let i=0;i<nb;i++)
					this.poly._aP( e.poly.M_getPoint(nb-1-i) );
				//this.poly.M_reverseOrder();			
			}
			else 
			{
				this.poly=e.poly;
			}
		}
	
	} 
	
}
class Mesh
{
	constructor(opts)
	{
		this.M_clear();
	}
	
	M_clear()
	{
		this.mP = [];
		this.m_faces = [];
		this.m_edges = [];
	
	
	}
	M_getString()
	{
		let s ="";
		s+="POINTS : "+this.mP.length+"\n";
		for( let i=0; i<this.mP.length; i++)
			s+=" "+i+" "+this.mP[i].M_getString()+"\n";	

		s+="FACES : "+this.m_faces.length+"\n";
		for( let i=0; i<this.m_faces.length; i++)
			s+=" "+i+" "+this.m_faces[i].M_getString()+"\n";	

	
		return s;
	}
	M_addFace(f)
	{
		this.m_faces.push(f);
	}

	M_computeEdges()
	{	//console.log("M_computeEdges");
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
			if(F.mP)
			{
				let nbPts = F.mP.length;
				for( let i=0; i<nbPts; i++)
				{
					let i2 = (i+1)%nbPts; 
					F.m_edges.push(this.M_addEdge(F.mP[i],F.mP[i2]));
				
				}
			}
		}
	
	}
	M_addEdge(A,B)
	{
		// look up for existing edge
		let E=new Edge(A,B);
		for(let i=this.m_edges.length-1; i>=0; i--)
		{
			let e= this.m_edges[i];
			let k=0; 
			if( e.A.m_index == A.m_index && e.B.m_index==B.m_index)
				k=1;
			else if( e.A.m_index == B.m_index && e.B.m_index==A.m_index)
				k=2;
			if(k)
			{	E.friend = e;
				if( k==2)
					E.reverse=true;
				return E;
			} 
		}
		this.m_edges.push(E);
		return E;
	
	}
	M_segmentEdges(segLen)
	{	
		/*
		for(let i=0; i<this.m_edges.length; i++)
		{
			let e= this.m_edges[i];		
			e.M_segment(segLen);
		}
		*/
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
		
			for(let i=0; i<F.m_edges.length; i++)
			{
				F.m_edges[i].M_segment(segLen);
			}
		}
		
	
	
	}


	M_resetEdgesDrawFlag()
	{
		for(let i=this.m_edges.length-1; i>=0; i--)
		{
			let e= this.m_edges[i];
			if( !e.friend)
			{
				e.isDrawn = false;
				e.isFlat = false;			
				e.fNormals=[];			//faces normals 
			}
		}	
	
	}
	M_findFacesWithEdge(E)
	{	let out=[];
		let e1 = E.friendOrMe();
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
			let el=F.m_edges.length;
			for( let i=0; i<el; i++)
			{	let e = F.m_edges[i].friendOrMe();
				if( e==e1)
				{	out.push(F);
					break;
				}
			}

		}
		return out;

	}
	// faces->m_normalTransformed and faces->m_isBackface must be set
	M_computeAngleLimit(angLimit)
	{	let cosMax = cos(angLimit*D2R);
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
			if( !F.m_isBackface)
			{
				let el=F.m_edges.length;
				for( let i=0; i<el; i++)
				{	let e = F.m_edges[i].friendOrMe();
					e.fNormals.push( F.m_normalTransformed);					
				}
			}		
		}
		for(let i=this.m_edges.length-1; i>=0; i--)
		{
			let e= this.m_edges[i];
			if( !e.friend)
			{
				if( e.fNormals.length>=2)
				{
					let cosAng = e.fNormals[0].M_dot(e.fNormals[1]);
					if(cosAng>cosMax)
						e.isFlat = true; 
					//console.log("nbNormals="+e.fNormals.length+" cosAng="+cosAng+" ang="+ang+" "+(e.isFlat?"flat=true":""));
				}
			}			
		}
	}
	M_getGroundLine(MV,groundY)
	{
		const Y0 = new ZV3(0,1,0);
		let skipBackfaces=true;
		let out=[];
		for(let iF=0; iF<this.m_faces.length; iF++)
		{
			let F=this.m_faces[iF];
			if( !(skipBackfaces&&F.m_isBackface) && ! (F.m_normalTransformed.M_dot(Y0)<-0.5 ))		// skip backfaces and faces looking downwards too much
			{
				let n = F.mP.length;
				let L = null,gr=null;
				let pA=null,pB;
				let A_,B_;
				for( let i=0; i<=n; i++)
				{	pB = F.mP[i%n];
					B_=MV._mBV(pB);
					if( i==0)
					{	pA=pB;
						A_ = MV._mBV(pA);					
					}
					else
					{
						if( (A_.y>=groundY && B_.y<=groundY) || (B_.y>=groundY && A_.y<=groundY)) 
						{
							// segment crosses the ground
							let lenY = abs(A_.y-B_.y);
							let P = B_.M_minus(A_)._mB( lenY>0? abs(groundY-A_.y)/lenY:0.5).M_plus(A_);
							if( !L){L=[]; gr={F:F,L:L,len:0};out.push(gr); }
							if( L.length)
							{	P.dist = L[L.length-1].M_dist(P);
								gr.len+= P.dist;
							}
							L.push(P);

						}
						
					}
					pA=pB;A_=B_;
				}
			}
		}
		//console.log("Returning out="+RQPrintR(out,2));
		return out;
	}
	M_setMV(MV)
	{
		this.MV = MV;
	}

	// M_painterSort
	// sorts faces by barycenter distance ( basic, temporary )
	M_painterSort(eyeVector,pos,MV)
	{
		// Compute projected points
		for(let i=0; i<this.mP.length; i++)
		{	let p=this.mP[i];
			p.m_transformed=MV._mBV(p);
			p.m_projected =A.Pj(p.m_transformed,pos);
		
			// project on eyeVector to get a distance = dist to obj origin in eye direction. Greatest =closer to eye
			p.m_dEye = eyeVector.M_dot(p.m_transformed);	

		}
		// Compute AABBs for faces
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];

			// Compute AABB on projected points
			F.M_computeAABB(true);		// will compute m_aabb and m_zRange

			// Compute z  ( TODO : remove this) 
			let g=F.M_computeBarycenter();
			let pTransf = MV._mBV(g);

			// project on eyeVector to get a distance
			F.dEye = eyeVector.M_dot(pTransf);	
		}
		// sort the MV
		//this.m_ints=[];	// temp
		this.m_faces.sort( function(a,b)
		{ 
			// 1 ) zRange exclusion
			
			if(a.m_zRange.max<=b.m_zRange.min)			// a is far, return 1 so b is sorted first
				return 1;
			if(b.m_zRange.max<=a.m_zRange.min)
				return -1;
			
			// Default 
			let defaultSort = a.dEye<b.dEye?1 : -1;

			// 2 ) backface exclusion - backface is sent to end of list back
			if( a.m_isBackface && b.m_isBackface) return defaultSort;
			if( a.m_isBackface ) return 1;
			if( b.m_isBackface) return -1;
			/*let flg=(a.m_isBackface?1:0)+(b.m_isBackface?2:0);
			if(flg) return flg==1?1: flg==2? -1 : defaultSort;*/
			

			// 3) AABB exclusion
			let int=a.m_aabb.gIersection(b.m_aabb);
			if(int)
			{	int.M_rounding();
			}
			if((!int) || int.w<1 || int.h<1 )
				return defaultSort;

			// 3) Intersections to handle
			//this.m_ints.push(int);	// temp for debug, looks ok.
			
			// todo :
			// find a point that is at the intersection of the two faces in projected space ( efficient way ? )
			// interpolate the dEye at this point
			// sort by dEye

			// 1 create a canvas with intersection AABB
			// draw each shape with color mode, one red, one green
			// get pixels and scan for a yellow color
			// 
			let canvas = document.createElement('canvas');
			let pixelSize=4;
			if( int.w<(4*pixelSize)||int.h<(4*pixelSize))
				pixelSize=1;
			let w,h;
			canvas.width  = w=parseInt(int.w/pixelSize);
			canvas.height = h=parseInt(int.h/pixelSize);

			let ctx = canvas.getContext('2d');
			//ctx.fillStyle="black";
			//ctx.fillRect(0, 0, canvas.width, canvas.height);
			if(pixelSize>1 )
				ctx.scale(1/pixelSize,1/pixelSize);	
			ctx.translate(-int.x, -int.y);	
			ctx.globalCompositeOperation = 'lighter';
			ctx.fillStyle = 'rgba(128,0,0,1)';
			let path=a.M_getProjectedSvgPath();
			ctx.fill(path);
			path=b.M_getProjectedSvgPath();
			ctx.fill(path);

			ctx.globalCompositeOperation = 'source-over';

			// parse the data to find a common point 
			let data=ctx.getImageData(0,0,w,h).data;
			let t=0;
			let pt=null;
			for(let j=0;j<h;j++)
			{	for(let i=0;i<w;i++)
				{	if(data[t]>250)
					{
						pt=new ZV2(int.x+i*pixelSize,int.y+j*pixelSize);
						break;
					}
					t+=4;
				}
				if(pt)
					break;

			}
			// given this point, interpolate the face's points coordinates
			// to get dEye at this point which gives us the result
			if( pt)
			{	// draw the canvas for debug
				//A.M_drawImage(canvas,int,"lighter");

				return a.M_interpolatedEyeDist(pt) <b.M_interpolatedEyeDist(pt)? 1:-1;
			}
			return defaultSort;
		
		}.bind(this));



	}


	// M_testFace
	// test whether the point is inside the given face
	M_testFace(face,P,prevP)
	{	if(!this.MV)
			return false;
		let B;
		if( !face.m_localBasisTransformed)
		{
			//console.log("Making local basis");
			face.M_makeLocalBasisTransformed(this.MV);
			
		}		
		B=face.m_localBasisTransformed;

		// project P and prevP in local basis transformed
		// p will get the coordinates on the face's local basis
		let OP = P.M_minus(B.O);
		let p = new ZV2(  OP.M_dot(B.I),OP.M_dot(B.J) /*,OP.M_dot(B.K)*/ );
		let prevOP = prevP.M_minus(B.O);
		let prevp = new ZV2(  prevOP.M_dot(B.I),prevOP.M_dot(B.J));


		let isIn = false;
		let isPrevIn = false;
		let prevTri = null;
		//let nb=face.pts.length;
		let adjEdge=null;
		let edgeVecUnit=null;
		let edgeOrigin = null;
		let edgeFoundCount =0;
		let edgeIntersect=null;


		// draw P
		//A.M_drawDebugVector(P,new ZV3(0,0,0));
		if( false ) // debug
		{
			// build P back from face equations
			let Ptest = B.O.clone();
			Ptest.M_add(B.I._mB(p.x));
			Ptest.M_add(B.J._mB(p.y));
			A.M_drawDebugVector(Ptest,new ZV3(0,0,0));

		}


		for( let iTri = 0; iTri<face.m_triangles.length; iTri++)
		{
			let tri=face.m_triangles[iTri];
			//console.log("Testing p"+p.M_getString()+" vs ("+face.mP[tri.a].local.M_getString()+" / "+face.mP[tri.b].local.M_getString()+" / "+face.mP[tri.c].local.M_getString());

			if( false)	// Draw triangulation result
			{	let L = new ZPL( [
						A.Pj(this.MV._mBV(face.mP[tri.a])),
						A.Pj(this.MV._mBV(face.mP[tri.b])),
						A.Pj(this.MV._mBV(face.mP[tri.c])) 
					]);
				A._g.Debug.m_strokeColor = "#FF00FF";
				A._DL(A._g.Debug,L,false);
			}

			//let report = p.M_isInTriangle(face.m_localPoints[tri.a],face.m_localPoints[tri.b],face.m_localPoints[tri.c]);  
			let report = {in:RQTriangulate.sM_isInsideTriangle(p,face.m_localPoints[tri.a],face.m_localPoints[tri.b],face.m_localPoints[tri.c])};
			if(!isPrevIn)
			{	//let reportPrev = prevp.M_isInTriangle(face.m_localPoints[tri.a],face.m_localPoints[tri.b],face.m_localPoints[tri.c]);  
				let reportPrev = {in : RQTriangulate.sM_isInsideTriangle(prevp,face.m_localPoints[tri.a],face.m_localPoints[tri.b],face.m_localPoints[tri.c])};  
				if(reportPrev.in)
				{	isPrevIn=true;
					prevTri=tri;
				}
			}
				//console.log("Report : "+RQPrintR(report));
			//let report = p.M_isInTriangle(face.G,face.pts[iF-1],face.pts[iF%nb],true);
			//	{in:isIn, x:x,y:y}
			if(report.in)
			{	isIn=true;
				break;
			}
			

		}
		if( (!isIn) && isPrevIn)
		{
			//console.log("We have a crossing triangle");
			// find the edge that crosses
			/*
			P+k.U , k€[0,1]
			M tq P+k.U  = Q+l.V 
			P.x + k*U.x = Q.x + l*V.x
			P.y + k*U.y = Q.y + l*V.y
			
			k = (Q.x + l*V.x - P.x)/U.x
			P.y + (Q.x + l*V.x - P.x)*U.y/U.x = Q.y + l*V.y
			P.y-Q.y + (Q.x-P.x)*U.y/U.x  = l*(V.y-V.x*U.y/U.x)
			[*U.x] => U.x*(P.y-Q.y) + U.y*(Q.x-P.x) = l * ( V.y*U.x - V.x*U.y)
					U.x*(P.y-Q.y) + U.y*(Q.x-P.x)		(U.x*P.y - U.y*P.x)  - (U.x*Q.y - U.y*Q.x )     U x P - U x Q
			l = 	-----------------------------  =    -------------------------------------        = ---------------
						V.y*U.x - V.x*U.y					   U.x*V.y - V.x*U.y                            U x V
			
			kU = Q-P + (U x P - U x Q)/(U x V) * V
			k U * (U x V) = (Q-P) (U x V) *V (U x P - U x Q ) 
			k [ U.x * (U.x*V.y + U.y*V.x)  ] = ( Q.x - P.x) *  ( U.x *V.y-U.y*V.x   ) * V.x * ( U.x*P.y - U.y*P.x - U.x*Q.y + U.y*Q.x)
			...			
			*/
			let n= face.mP.length;
			let P_ = prevp;
			let U_ = p.M_minus(prevp);
			
			let distToEdge = 1;
			for( let i=0; i<n; i++)
			{
				let Q_=face.m_localPoints[i];
				let V_=face.m_localPoints[(i+1)%n].M_minus(Q_);
				try{
				let UxV = U_.M_cross(V_);
				if( UxV != 0)
				{
					let l = ( U_.M_cross(P_) - U_.M_cross(Q_)) / UxV;
					if( l>=0 && l<=1)
					{
						let M = Q_.M_plus( V_._mB(l));
						let PM = M.M_minus(P_);
						let k = PM.M_length() / U_.M_length();
						if( k>=0 && k<=1)
						{
							// we found an edge ! 
							if(distToEdge> abs(l-0.5))
							{	distToEdge = abs(l-0.5);
								// adjust M to avoid being too close to corners
								if( distToEdge>0.48)
								{	l = 0.5+0.48*Math.sign(l-0.5);
									let M = Q_.M_plus( V_._mB(l));
								}
								
								adjEdge={A:face.mP[i],B:face.mP[(i+1)%n]};
								edgeOrigin = this.MV._mBV( face.mP[i]);
								edgeVecUnit = this.MV._mBV( adjEdge.B).M_minus( edgeOrigin).Nz();
								edgeIntersect = B.O.M_plus( B.I._mB(M.x)).M_plus(B.J._mB(M.y));
								// draw the intersection
								//A.M_drawDebugVector(edgeIntersect,new ZV3(0,0,0));
							}
						}
						
					}
				}
				}
				catch(e)
				{
					console.error(e);
					console.log("U_ = "+U_.M_getString()+" V_="+V_.M_getString());
				}
				
			}
			
		}
		if( isIn)
		{
			//console.log("isIn !");
		}

		// if not inside, find adjacent face
		// HOW ??? 
		// it should be like folding the neighbor faces to be flat aligned with the current face. 
		let Fnew=null;
		if( (!isIn) && adjEdge)
		{
			let E = this.M_addEdge(adjEdge.A,adjEdge.B);
			// find face with that edge
			let Fnews = this.M_findFacesWithEdge(E);
			for(let i=0; i<Fnews.length; i++)
			{
				if( Fnews[i]!=face)
					Fnew=Fnews[i];
			}
		}
		if( Fnew)
		{
			// make a basis for face 			
			return {newF:Fnew, intersect: edgeIntersect,basis:face.M_makeBasisWithVector(edgeOrigin,edgeVecUnit),newBasis:Fnew.M_makeBasisWithVector(edgeOrigin,edgeVecUnit)  };
		}
		return isIn;
	}


	M_createBlock(o)
	{
		if(!o) o={width:50,height:90,depth:50}
		if( o.rndFunc==undefined)
			o.rndFunc = Math.random;


		this.M_createCube(o.width,o.height,o.depth,{noEdge:true});
		
		this.M_breakCorners({pass:2, kMin:0.1, kMax:0.96, rndFunc:o.rndFunc });
	}
	M_createRock(o)
	{
		if(!o) o={width:50,height:90,depth:50}
		if( o.rndFunc==undefined)
			o.rndFunc = Math.random;


		this.M_createCube(o.width,o.height,o.depth,{noEdge:true});
		
		this.M_breakCorners({pass:2, kMin:0.1, kMax:0.96, rndFunc:o.rndFunc });
	}

	M_createPile(o)
	{
		if(!o) o={width:50,height:90,depth:50}
		if( o.rndFunc==undefined)
			o.rndFunc = Math.random;

		let shift=new ZV3(0,0,0);
		let sz = new ZV3(0,0,0);
		let nb = 1+Math.round(o.rndFunc()*5);
		o.height/=nb;
		this.O = new ZV3(0,0,0)
		let cubes=[];
		let dim;
		
		for( let i=0; i<3; i++)
		{
			sz.M_set(o.width,o.height,o.depth);
			sz.x*=1+(o.rndFunc()-0.5)*1.2;
			sz.y*=1+(o.rndFunc()-0.5)*1.6;
			sz.z*=1+(o.rndFunc()-0.5)*0.4;
			if(i==0)
			{	dim=sz.clone();
				this.m_floorY=-dim.y/2;
			}
			else
				dim.y+=sz.y;
			shift.y+=sz.y/2;
			cubes.push({sz:sz.clone(),shift:shift.clone()});
			//this.M_createCube(sz.x,sz.y,sz.z,{noEdge:true,noClear:i>0,shift:shift });
			shift.y += sz.y/2;
		}
		let c;
		let i=0;
		while(c=cubes.pop())
		{
			this.M_createCube(c.sz.x,c.sz.y,c.sz.z,{noEdge:true,noClear:i>0,shift:c.shift,O:c.shift });
			i++;
		}
		this.m_dimensions=dim;
		this.M_breakCorners({pass:1+Math.round(o.rndFunc()*2), kMin:0.1, kMax:0.96, rndFunc:o.rndFunc,useO:true });
	}
	M_translate(u)
	{
		this.mP.map(p=>p.M_add(u))
	}
	// M_computeVertexNormals
	// for each face, add the face normal to its points, with weight equals to the face's surface ()
	// Normalize the normal for each vertex
	M_computeVertexNormals()
	{
		// clean array
		for( let i=0; i<this.mP.length; i++)
		{	this.mP[i].Ns=[];
		}

		// push faces normals at points
		for(let iF=0; iF<this.m_faces.length; iF++)
		{	let F=this.m_faces[iF];
			F.M_computeBarycenter();
			let n=F.mP.length;
			if(n>=3)
			{	let N = F.m_normal; //F.M_getNormalRaw();
				for( let i=0; i<n;i++)
				{	let p = F.mP[i];
					p.Ns.push({N:N,v:F.mP[i].M_minus(F.m_g).Nz()}); 

				}
			}
		}
		for( let i=0; i<this.mP.length; i++)
		{	let p = this.mP[i];
			let n;
			;
			if(p.Ns && (n=p.Ns.length))
			{	let N=new ZV3();
				for(let iN=0; iN<n;iN++)
					N.M_add(p.Ns[iN].N);
				N.Nz();
				p.m_normal=N;
				
				// test with normals to get the peek angle 
				p.m_peek=1;
				let peek;
				for(let iN=0; iN<n;iN++)
				{	if(p.Ns[iN].v)
					{	
						peek=N.M_dot(p.Ns[iN].v);
						if(peek<p.m_peek)
							p.m_peek=peek;
					}

				}

			}
			else { p.m_peek=0;}
		}
	}
	M_breakCorners(opts)
	{
		this.M_computeEdges();
		let k=0.15;
		let kMax = opts.kMax || 0.9;
		let kMin = opts.kMin || 0.1;
		let nbPass = opts.pass || 1;
		let rnd = opts.rndFunc || Math.random();
		let peekThres=0.2; // 0.6
		for( let pass=0; pass<nbPass; pass++)
		{
			// First we compute the vertex normal
			this.M_computeVertexNormals();
			// Now create 2 points on each edge, for points that are breakable
			let newPoints=[];
			for(let i=0; i<this.m_edges.length; i++)
			{
				k = (kMin+(kMax-kMin)*rnd())*0.5;
				let E = this.m_edges[i];
				if( !E.friend)
				{
					// split the edge
					// created 2 new points on this edge, and listed them in each edge's point 
					let oldA=E.A;
					if(E.A.m_peek>peekThres)
					{	let pA = E.A.M_plus( E.B.M_minus(E.A)._mB(k) ); pA.m_index = this.mP.length;
						this.mP.push(pA); 
						if( !E.A.newP) E.A.newP=[]; E.A.newP.push(pA);
						E.oldA=E.A;
						pA.m_normal = E.A.m_normal;
						E.A = pA;

					}

					if( E.B.m_peek>peekThres)
					{	let pB = oldA.M_plus( E.B.M_minus(oldA)._mB(1-k) ); pB.m_index = this.mP.length;
						this.mP.push(pB);
						if( !E.B.newP) E.B.newP=[]; E.B.newP.push(pB);
						E.oldB=E.B;
						pB.m_normal = E.B.m_normal;
						E.B = pB; 
					}
					
					// edge is modified
					// it is now made of the 2 new points
					/*E.oldA=E.A;E.oldB=E.B;	// store ref to old points
					E.A = pA;
					E.B = pB; */
				}
			}		

			// For each face's edge, 
			// copy new points from friend edges, is there are any
			for( let iF=0; iF<this.m_faces.length; iF++)
			{
				let F= this.m_faces[iF];
				F.mP = [];
				let pPrev=null;
				for(let ie=0; ie<F.m_edges.length; ie++)
				{
					let E = F.m_edges[ie];
					if( E.friend)
					{
						E.A = E.reverse?E.friend.B : E.friend.A; 
						E.B = E.reverse?E.friend.A : E.friend.B; 
					}
					// copy O center
					if(F.O && E.oldB && !E.oldB.O ) {E.oldB.O = F.O;}
					
					// add the points to the ring
					if( E.A!=pPrev)
						F.mP.push(E.A);
					if(E.B!=F.mP[0])
						F.mP.push(E.B);
					pPrev= E.B;
				}
				F.m_edges=[];
			}
			// for each point, make a face with all the points that have been registered at this point
			for(let i = this.mP.length -1; i >= 0 ; i--)
			{
				let P = this.mP[i];
				if( P.newP && P.newP.length>=3)
				{	let F = new Face(...P.newP);
					if( P.O)
					{	F.O=P.O;					
					}
					// how to have the right order of points ? 	
					if(opts.useO)
						F.M_computeNormal();
					else 
					{	// TODO : to make better
						F.M_computeNormal(true);
						
						// check points normal
						let ptN=new ZV3();
						for(let ip=0; ip<P.newP.length;ip++)
						{	ptN.M_add(P.newP[ip].m_normal);
						}
						if(F.m_normal.M_dot(ptN)<0)
						{	F.m_normal.M_mul(-1);
							F.mP.reverse();

						}

					}
					this.m_faces.push(F);
										
					this.mP.splice(i,1);
				}
				// remove point

				P.newP = null;

			}

			// redo indexes
			for( let i =0; i<this.mP.length; i++)
			{	this.mP[i].m_index = i;

			}
			// redo edges			
			this.m_edges=[];
			this.M_computeEdges();


		} // pass




	}
	M_createPowerPlant(o)
	{
		o??={width:50,height:90,depth:50}
		o.rndFunc ??= Math.random;

		// list of faces extruded faces
		let out=[];

		let typeRnd=o.rndFunc();

		if( typeRnd <=0.5)
		{
			let nbx=3;
			let nby=2;
			let x=0;
			let y=0;
			for(let i=0; i<nbx;i++)
			{
				y=0;
				for(let j=0; j<nby;j++)
				{	let shift=new ZV3(x,0,y);
					let index0=this.m_faces.length;
					let wFac=0.5+0.5*o.rndFunc();
					this.M_createCube(o.width*wFac,o.height*0.5+o.height*o.rndFunc(),o.depth*wFac,{noEdge:true,noClear:true,shift:shift});
					let newFs=this.M_extrudeFace(this.m_faces[index0+3],o.width/2 );
					
					if(i==0)
						out.push(newFs[0]);
					if(i==(nbx-1))
						out.push(newFs[2]);
					if(j==0)
						out.push(newFs[1]);
					if(j==(nby-1))
						out.push(newFs[3]);

					y+=o.depth*1.1;
				}
				x+=o.width*1.1;

			}
			this.M_breakCorners({pass:1, kMin:0.2, kMax:0.9, rndFunc:o.rndFunc });

		}
	    else if( typeRnd>0.5)
		{
			this.M_createCube(o.width,o.height,o.depth,{noEdge:true});
			this.M_breakCorners({pass:1, kMin:0.2, kMax:0.9, rndFunc:o.rndFunc });
			for( let ip=0; ip<3; ip++)
			{
				let newFs=this.M_extrudeFace(this.m_faces[3],o.width/2 );
				for( let i=0; i<newFs.length; i++)
				{	let k=0;
					if(o.rndFunc()<0.2)
					{	this.M_extrudeFace(newFs[i],o.height*0.2/(ip+1) );
						k++;
					}
					if(o.rndFunc()<0.5)
					{	this.M_extrudeFace(newFs[i],o.height*0.2/(ip+1) );
						k++;
					}
					if( k>0)
						out.push(newFs[i]);
				}
				this.M_extrudeFace(this.m_faces[3],o.width/2 );
			}
		}
		this.M_breakCorners({pass:1, kMin:0.2, kMax:0.8, rndFunc:o.rndFunc });
		this.M_computeEdges();
		return out;
	}
	M_createExtrude(o)
	{	o??={width:50,height:90,depth:50}
		o.rndFunc ??= Math.random;

		// list of faces extruded faces
		let out=[];

		this.M_createCube(o.width,o.height,o.depth,{noEdge:true});
		this.M_breakCorners({pass:1, kMin:0.2, kMax:0.9, rndFunc:o.rndFunc });
		let nbSteps = o.steps??3;
		for( let ip=0; ip<nbSteps; ip++)
		{
			let newFs=this.M_extrudeFace(this.m_faces[3],o.width/2 );
			for( let i=0; i<newFs.length; i++)
			{	let k=0;
				if(o.rndFunc()<0.2)
				{	this.M_extrudeFace(newFs[i],o.height*0.2/(ip+1) );
					k++;
				}
				if(o.rndFunc()<0.5)
				{	this.M_extrudeFace(newFs[i],o.height*0.2/(ip+1) );
					k++;
				}
				if( k>0)
					out.push(newFs[i]);
			}
			this.M_extrudeFace(this.m_faces[3],o.width );
		}
		this.M_breakCorners({pass:1, kMin:0.2, kMax:0.8, rndFunc:o.rndFunc });
		//this.M_computeEdges();
		return out;
	}
	M_copyFace(F)
	{
		let index0=this.mP.length;
		let newF = 
		new Face(	...F.mP.map((p)=>{
				let newp=p.clone();
				newp.m_index=index0++;
				this.mP.push(newp);
				return newp;
			})
		);
		newF.M_computeNormal(true);
		this.m_faces.push(newF);
		return newF
		
	}
	M_extrudeFace(F,d)
	{
		let index0=this.mP.length;
		let out=[];
		for( let i=0; i<F.mP.length; i++)
		{
			let fp = F.mP[i];
			let p = fp.clone();
			p.M_add( F.m_normal._mB(d) );
			p.m_index = index0+i;
			this.mP.push( p);

		}
		// a face on each contour
		let fNb=F.mP.length;
		for( let i=0; i<fNb; i++)
		{
			let newF = 
			new Face(	F.mP[i],
						F.mP[(i+1)%fNb],
						this.mP[index0+(i+1)%fNb],
						this.mP[index0+i]
					);
			newF.M_computeNormal(true/*unchecked directon*/);
			this.m_faces.push(newF);
			out.push(newF);

		}
		// change points in face
		for( let i=0; i<fNb; i++)
		{
			F.mP[i]=this.mP[index0+i];

		}
		return out;
	}

	M_createCube	(sizeX,sizeY,sizeZ,opt)
	{
		if( !opt) opt={};
		let noEdgeCompute = opt.noEdge;
		let noClear = opt.noClear;
		if(!opt.shift) opt.shift=new ZV3(0,0,0);
		this.m_dimensions = new ZV3(sizeX,sizeY,sizeZ);
		//if( 8!=this.mP.length || 6!=this.m_faces.length || 12!=this.m_edges.length)
		{
			if(!noClear)
				this.M_clear();
			// Points
			let i,j,k;
			let index0 = this.mP.length;
			let index=index0;
			for( k=-1; k<=1; k+=2)
			{
				for( j=-1; j<=1; j+=2)
				{
					for( i=-1; i<=1; i+=2)
					{	let p = new ZV3( i*sizeX*0.5+opt.shift.x, j*sizeY*0.5+opt.shift.y, k*sizeZ*0.5+opt.shift.z);
						p.m_index = index++;
						this.mP.push( p);
											
					}			
				
				}
			}
			let corner = (i,j,k)=>this.mP[index0+ (i+1)/2  + 2*(j+1)/2 + 4*(k+1)/2];

			// X
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(-1,-1,1), corner(-1,1,1),corner(-1,1,-1))).M_setNormal(-1,0,0)  );			
			this.m_faces.push( (new Face( corner( 1,-1,-1), corner( 1,1,-1), corner( 1,1,1), corner( 1,-1,1) )).M_setNormal(+1,0,0)  );			

			// Y
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(1,-1,-1), corner(1,-1,1),corner( -1,-1,1)  )).M_setNormal(0,-1,0)  );			
			this.m_faces.push( (new Face( corner(-1,1,-1), corner(-1,1,1), corner(1,1,1),corner( 1,1,-1)  )).M_setNormal(0,+1,0)  );			

			// Z
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(-1,1,-1), corner(1,1,-1),corner( 1,-1,-1)  )).M_setNormal(0,0,-1)  );			
			this.m_faces.push( (new Face( corner(-1,-1,1), corner(1,-1,1), corner(1,1,1),corner( -1,1,1)  )).M_setNormal(0,0,1)  );			

			// assign face ref. center if any was provided
			if( opt.O)
			{
				for(let i=this.m_faces.length-6; i<this.m_faces.length; i++)
				{	this.m_faces[i].O = opt.O;

				}
			}

			if(!noEdgeCompute)
				this.M_computeEdges();
		}
		
	}
	// nbStairs
	// stairHeight
	// stairDepth
	// width
	// torsion
	M_createStairsObject(opt)
	{
		let nb = opt.nbStairs;
		let h = opt.stairHeight;
		let d = opt.stairDepth;
		let depth = nb*d;
		let w=opt.width;
		let Fside = [new Face(),new Face()];				
		let isStraightBack = false;
		this.m_dimensions = new ZV3(w,h*nb,depth);
		
		let y = 0;
		let z = depth/2; 
		let index=0;
		var pEnd1,pEnd2;
		let alpha = opt.torsion / nb;
		for( let iStair=0; iStair<=nb; iStair++)
		{
			var p1,p2,p3,p4;
		
			p1 = new ZV3( w/2,y  ,z);	p1.m_index = index++;
			this.mP.push(p1)
			p4 = new ZV3(-w/2,y  ,z);	p4.m_index = index++;
			this.mP.push(p4);

			if(iStair<nb)
			{
				p2 = new ZV3( w/2,y+h,z);	p2.m_index = index++; 
				p3 = new ZV3(-w/2,y+h,z);	p3.m_index = index++; 
				this.mP.push(p2,p3);
			}

			
			if(iStair<nb)
			{
				let F = new Face();				
				F.mP.push(p1,p2,p3,p4);
				F.M_setNormal(0,0,1);
				//F.M_computeNormal();				
				this.m_faces.push(F);
				Fside[0].mP.push(p1,p2);
				Fside[1].mP.push(p4,p3);
			}
			else
			{
				Fside[0].mP.push(p1);
				Fside[1].mP.push(p4);
				pEnd1=p1;
				pEnd2=p4;	
			}

			// flat step face
			if( iStair>0)
			{
				let F2 = new Face(this.mP[p1.m_index-2],this.mP[p1.m_index],this.mP[p4.m_index],this.mP[p4.m_index-2]).M_setNormal(0,1,0);				
				//F2.M_computeNormal();				
				this.m_faces.push(F2);				
			}
			if( iStair<nb)
			{
				z-=d;
				y+=h;
			}
		}
		let pBack=[];
		let pGround=[];
		for( let i=0; i<2;i++)
		{

			let	p = new ZV3( w/2*(i==0?1:-1), isStraightBack? 0 : y-h  ,z);	p.m_index = index++;
			this.mP.push(p);
			pBack[i]=p;
			Fside[i].mP.push(p);

			if( !isStraightBack)
			{	// create a point on the ground 
				let	p2 = new ZV3( w/2*(i==0?1:-1), 0  ,depth/2-d);	p2.m_index = index++;
				this.mP.push(p2);
				Fside[i].mP.push(p2);
				pGround[i]=p2;
			}

			if( i==0)
				Fside[i].mP.reverse();

			Fside[i].M_setNormal(i==0?1:-1,0,0);				
			this.m_faces.push(Fside[i]);				
		
		}
		// back stair face
		if( true )
		{	let Fback = new Face();
			Fback.mP.push(pBack[0],pBack[1],pEnd2,pEnd1);
			Fback.M_computeNormal();
			this.m_faces.push(Fback);
		}	
		if( !isStraightBack )
		{	let Fback = new Face();
			Fback.mP.push(pGround[0],pGround[1], pBack[1],pBack[0]);
			Fback.M_computeNormal();
			this.m_faces.push(Fback);
		}	
		
		this.M_computeEdges();	
	
	}

	M_createColumnObject(height,opt)
	{
		opt.rndFunc??=Math.random;
		opt.column=true;
		opt.polygonNb ??= 3+Math.round(opt.rndFunc()*9);
		// in column, each face gets 1 carving made of n points
		//opt.columnCarvePts=4;
		this.M_createTrunkObject(height,opt);


	}

	M_createTrunkObject(height,opt)
	{
		opt??={}
		opt.rndFunc ??= Math.random;
		let nbH = opt.nbSeg??  5;		// nbSegmentsHeight
		let r = opt.sz?  opt.sz/2 : height/6;
		let nbPointsCircle = opt.polygonNb?? 12;
		let nbRotationPoints = nbPointsCircle;
		let isColumn = opt.column?true:false;
		let decal = opt.centerDecal===undefined? 0.2 : opt.centerDecal;
		let nbCarvingPoints = 0;
		let carvingShrink = 0.4;
		if( isColumn)
		{	nbCarvingPoints = opt.columnCarvePts==undefined?  3 : opt.columnCarvePts;
			nbPointsCircle = nbPointsCircle*nbCarvingPoints;
		}
		this.m_dimensions = new ZV3(2*r,height,2*r);

		let index = 0;
		let p;
		let y = -height/2; 
		let aInc = 2*PI/nbRotationPoints;
		for( let j=0; j<=nbH; j++)
		{
			let a = 0;
			// center with random decal
			let C = ( decal==0)? new ZV2() : new ZV2( (opt.rndFunc()-0.5)*r*decal,(opt.rndFunc()-0.5)*r*decal);
			for( let i =0; i<nbRotationPoints; i++)
			{
				
				// column carving points
				if(isColumn)
				{	let a2 = a + aInc*(0.5-carvingShrink/2); 
					let a2Inc= aInc*carvingShrink/(nbCarvingPoints-1);
					let wCarving = aInc*carvingShrink*r;
					let rCarving = wCarving/2;
					let aCarv=0;
					let aCarvInc = PI/(nbCarvingPoints-1);
					for(let i2=0; i2<nbCarvingPoints; i2++)
					{
						let r2 = r-rCarving*sin(aCarv);
						p = new ZV3( r2*cos(-a2)+C.x, y, r2*sin(-a2)+C.y);
						p.m_index = index++;
						this.mP.push(p);
						a2+=a2Inc;
						aCarv+=aCarvInc;
					}

				}
				else 
				{	p = new ZV3( r*cos(-a)+C.x, y, r*sin(-a)+C.y);
					p.m_index = index++;
					this.mP.push(p);
				}

				a+=aInc;
			}
			y+= height/nbH;
		}

		// make faces
		let pt = (i,j)=>this.mP[ j*nbPointsCircle +i];
		let F;
		for( let j=0; j<=nbH; j++)
		{
			if( j==0 || j==nbH)
			{
				F = new Face();				
			}
			for( let i =0; i<nbPointsCircle; i++)
			{
				let i2 = (i+1)%nbPointsCircle;
				if( j==0)
					F.mP.push( pt(nbPointsCircle-1-i,j) );
				else if( j==nbH)
					F.mP.push( pt(i,j) );
				if( j>0)
				{
					this.m_faces.push( (new Face( pt(i,j),pt(i,j-1),pt(i2,j-1),pt(i2,j) )).M_computeNormal()  );			
				}
				
			}
			if( j==0 || j==nbH)
			{
				F.M_computeNormal();				
				this.m_faces.push(F);
			}


		}
		this.M_computeEdges();	
	
	}	
	M_triangulate()
	{
		let fN = this.m_faces.length;
		for(let iF=0; iF<fN; iF++)
		{
			let F = this.m_faces[iF];
			F.M_triangulate();
		}
	}
	M_createIsosphere(radius, nbIterations)
	{
		let index = 0;
		let p;
		let a = 0;
		let r = radius; 
		// make pyramide
		for( let i =0; i<3; i++)
		{
			p = new ZV3( r*cos(a), 0, r*sin(a));
			p.m_index = index++;
			this.mP.push( p);
			a+=2*PI/3;
		}	
		// Make top point 
		let s = this.mP[0].M_dist(this.mP[1]);
		let l = s*0.5*Math.tan(PI/3);
		let d= this.mP[1].z;
		let h = Math.sqrt( l*l-d*d);
		
		p = new ZV3( 0, h, 0);
		p.m_index = index++;
		this.mP.push( p);


		// find barycenter 
		let g = new ZV3(0,0,0);
		for( let i=0; i<this.mP.length; i++)
		{
			g.M_add(this.mP[i]);
		
		}
		g.M_mul(1/this.mP.length);
		
		// translate all the points to center 
		for( let i=0; i<this.mP.length; i++)
		{
			this.mP[i].M_sub(g);
		
		}
		// real sph radius = dist points to center 
		r = this.mP[0].M_dist(0,0,0);
		for( let i=0; i<this.mP.length; i++)
		{
			this.mP[i].M_mul(radius/r);
		
		}


		// Make faces 
		let pt = (i)=>this.mP[i];

		this.m_faces.push( (new Face( pt(1),pt(0),pt(3) )).M_computeNormal()  );			
		this.m_faces.push( (new Face( pt(2),pt(1),pt(3) )).M_computeNormal()  );			
		this.m_faces.push( (new Face( pt(0),pt(2),pt(3) )).M_computeNormal()  );			
		this.m_faces.push( (new Face( pt(0),pt(1),pt(2) )).M_setNormal(0,-1,0)  );			


		// We have a pyramid. 
		// Let's iterate  
		for(let iter=0; iter<3; iter++)
		{
			let fN = this.m_faces.length;
			for(let iF=0; iF<fN; iF++)
			{
				let F = this.m_faces[0];
				let nb = F.mP.length;
				let newp = [];
				for( let i=0; i<nb; i++)
				{	let i2 = (i+1)%nb;
					let p = F.mP[i2].M_plus( F.mP[i]);
					p.M_mul(0.5);
					p.Nz();
					p.M_mul(radius);
					this.mP.push(p);
					p.m_index = this.mP.length-1;
					newp.push(p);



				}
				for( let i=0; i<nb; i++)
				{	let i2 = (i+1)%nb;
					// make faces
					this.m_faces.push( (new Face( F.mP[i2],newp[i2], newp[i] )).M_computeNormal()  );			
				}


				//make central face 
				this.m_faces.push( (new Face( newp[0],newp[1], newp[2] )).M_computeNormal()  );			



				
				// remove the face
				this.m_faces.splice(0, 1); 
			
			}
		}
		this.M_computeEdges();

	}

};



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Algorithms/GrassExperiments.js?v=1681489318

class GrassExperiments extends GrassAlgorithm
{
	constructor()
	{
		super("GrassExperiments");
	}
/*
		let Pproj = new ZV2(P.x, -P.y + P.z*this.m_perspectiveFactor);				
		if( typeof Porigin2D==="object")
		{	Pproj.M_add(Porigin2D);
		}
		else if(A.m_origin2D)
			Pproj.M_add(A.m_origin2D);
		else
			Pproj.y+=this.mwA.top();

*/

	PjExp( P, Porigin2D)
	{
		let Pproj = new ZV2(P.x, -P.y + P.z*this.m_perspectiveFactor);				
		if( typeof Porigin2D==="object")
		{	Pproj.M_add(Porigin2D);
		}
		else if(A.m_origin2D)
			Pproj.M_add(A.m_origin2D);
		else
			Pproj.y+=this.mwA.top();

		// TEST
		//let dest = new ZV2(Pproj.x+100*cos(Pproj.y/this.H*PI*20) ,Pproj.y - 50*sin(Pproj.y/this.H*PI*14));
		//let dest = new ZV2(30*Math.round(Pproj.x/30) ,Pproj.y - 50*sin(Pproj.y/this.H*PI*14));
		if( (!A.m_deformersActive) || ( this.m_scatterFunc=="None")
			|| ( this.m_currentY>(this.mwA.top()-this.m_scatterYStart))
		)
			return Pproj;
		else
		{
			let dest;
			switch(this.m_scatterFunc)
			{
				default:
				case "Columns":
					dest = new ZV2(this.m_scatterParams.width*Math.round(Pproj.x/this.m_scatterParams.width) ,Pproj.y);
					break;
				case "Grid":
					dest = new ZV2(this.m_scatterParams.width*Math.round(Pproj.x/this.m_scatterParams.width) ,this.m_scatterParams.height*Math.round(Pproj.y/this.m_scatterParams.height));
					break;
				case "VerticalSine":
					dest = new ZV2(this.m_scatterParams.width*Math.round(Pproj.x/this.m_scatterParams.width)+this.m_scatterParams.width*0.5*sin(PI*Pproj.y/this.m_scatterParams.height) ,Pproj.y);
					break;
				case "Sine":
					dest = new ZV2(Pproj.x+this.m_scatterParams.width*0.5*sin(PI*Pproj.y/this.m_scatterParams.height) ,Pproj.y);
					 
					break;
				case "Circle":
					{
						this.scatC??= new ZV2( this.mwA.x+this.mwA.w*this.m_scatterCenter.x, this.mwA.y+this.mwA.h*(1-this.m_scatterCenter.y));
						let r = Pproj.M_dist(this.scatC);
						let ang= Math.atan2(Pproj.y-this.scatC.y,Pproj.x-this.scatC.x);
						r = this.m_scatterParams.width*Math.round(r/this.m_scatterParams.width);
						dest = new ZV2(this.scatC.x+r*cos(ang),this.scatC.y+r*sin(ang));
					}
					break;
				case "Swirl":
					{
						this.scatC??= new ZV2( this.mwA.x+this.mwA.w*this.m_scatterCenter.x, this.mwA.y+this.mwA.h*(1-this.m_scatterCenter.y));
						let r = Pproj.M_dist(this.scatC);
						let ang= Math.atan2(Pproj.y-this.scatC.y,Pproj.x-this.scatC.x);
						let rx =this.m_scatterParams.height; 
						if( rx>0.1) r = rx*(Math.round(r/rx)+cos( ang/2));
						if(r>0.1) ang+=this.m_scatterParams.width/r;		// hmmmm .. nbof
						dest = new ZV2(this.scatC.x+r*cos(ang),this.scatC.y+r*sin(ang));
					}
					break;
			
			}
			let amount;
			if(this.m_scatter && this.m_scatter.func )
				amount= this.m_scatter.func.apply(this,[Pproj.x,Pproj.y,this.m_scatter.config] );
			else 
				amount = Math.pow(Pproj.y/this.H,1.5);		// bottom up
			
			 
			Pproj.x += (dest.x-Pproj.x)* amount; 
			Pproj.y += (dest.y-Pproj.y)* amount; 
		}
		return Pproj;
	}


	M_getProjectionFunc()
	{
		return this.Pj;
	}

	async M_initVariables()
	{
		ZPA.prototype.Pj = this.PjExp.bind(this)
		
		// call super
		
		await GrassAlgorithm.prototype.M_initVariables.call(this);
		
		
		//_UI=true;	// hmmm.
		this.m_segLength = 0.5*this.u;

		// New implementation
		this.m_isNewImplementation = this.gB("isNewImplementation",false);
		if(this.m_isNewImplementation)
		{	this.m_implantationFunc = this.M_newImplantationFunc.bind(this);

		}

		// my variables
		this._rPV(this,"scatter",1.0,false); 			

		this.m_scatterFunc = this.M_get("scatterFunc","None");
		this.m_scatterParams = this.M_get("scatterParams",{width:2,heigth:4}); for(var a in this.m_scatterParams) this.m_scatterParams[a]*=this.u;
		this.m_scatterCenter = this.gF("scatterCenter",{x:0.5,y:0.5});
		this.m_scatterYStart = this.M_get("scatterYStart",0); this.m_scatterYStart*=this.u;

		this.m_foregrounds = this.M_get("foreground");
		for( let i=0; i<this.m_foregrounds.length; i++)
		{ 	let S = this.m_foregrounds[i];
			if(S.gB("isActive",false))
			{
				switch(S.m_name)
				{
					case "ForegroundRain":
						S.group = this._Sv('GrassExperiments'	, "Rain",true);
						S.m_nb = S.gI("nb",1000);
						S.m_angle = S.gF("angle",{ang:20,span:20});	
						S.m_length = S.gF("length",20);	S.m_length*=this.u;	
						break;
					case "ForegroundVignette":
						S.group = this._Sv('GrassExperiments'	, "Vignette",true);
						S.m_nb = S.gI("nb",1000);
						S.m_angle = S.gF("angle",{ang:20,span:20});	
						S.m_length = S.gF("length",20);	S.m_length*=this.u;	
						break;
				}
			}
		}
		this.m_isMustEraseFirst = false;

	}
	async M_startAlgorithm()
	{
		// trick the background species
		if(this.m_background)
		for(let i=0; i<this.m_background.length; i++)
		{
			if( this.m_background[i].A)
			{  
				// something ...
			}
		}
		// Foregrounds
		if( this.m_foregrounds)
		{
			for(let i=0; i<this.m_foregrounds.length; i++ )
			{	let S=this.m_foregrounds[i];
				if(S.gB("isActive",false))
				{	switch(S.m_name)
					{
						case "ForegroundRain":			
						this.M_drawRain(S);
						break;
						case "ForegroundVignette":			
						this.M_drawVignette(S);
						break;
						case "ForegroundReserve":
						this.M_drawReserve(S,S.M_get("tag"))
						
						break;
					}
				}
			}
		
		}
		
		
		
		// call super
		await GrassAlgorithm.prototype.M_startAlgorithm.call(this);
	
	}
	/*VM_onLineOfGrassBegin(yFrac)
	{
		// random dots in the mask to simulate fog
		if( yFrac>-0.05 && this.m_mask)
		{
			let dash = true;
			let nb=dash?200:2000;
			let context = this.m_mask._X();
			let stroke = 0.1*this.u;
			let len = dash ? 20*this.u : stroke;
			context.strokeStyle="white";
			context.lineWidth = stroke;
			for( let i=0; i<nb ; i++)
			{
				let P=new ZV2( Math.random()*this.W, Math.random()*this.H);
				let P2 = P.M_plus(len,0);
				let L = new ZL(P,P2);
				let path= new Path2D(L._gS());
				context.stroke(path);

			}

		}

	}*/
	M_drawReserve(S,tag)
	{
		let r=S.gF("rect",{x:10,y:10,w:50,h:30});
		console.log(RQPrintR(r,1));
		if(!this.m_svgSize) this.M_getSvgProperties();
		let u=this.W/this.m_svgSize.w
		let rect=new ZRc(r.x*u,r.y*u,r.w*u,r.h*u)
		console.log(rect.M_getString());
		this._dM(rect._cP());
		
	}


	M_drawRain(S)
	{
		
		this.M_seed( parseInt(this.m_seed),"Rain");	
		let nbDrops = S.m_nb;
		let angleRain = S.m_angle.ang;
		let angleAmp = S.m_angle.span;
		let isDrawLines = S.gB("isDrawLines",true);
		let length = S.m_length;
		let u = new ZV2(); 
		let sz = 1;
		let szMin = 0.3;
		let context = this.m_mask._X();
		let maskStrokeW= S.gF("maskStrokeWidth",0.2)*this.u;
		context.strokeStyle = "white";
		let y=1;
		let yMax = 0.95;
		let yMin=0.3;
		let decreaseSz = (sz-szMin)/nbDrops;	
		let t=1;
		let tm = 1/nbDrops;
		let Ls=[];
		for(let i=0; i<nbDrops; i++)
		{
			let angle = (angleRain + angleAmp*(this.randomRain()-0.5))*D2R;
			u.x = -sin(angle)
			u.y =-cos(angle);
			let p1 = new ZV2(this.randomRain()*this.W,this.randomRain()*this.H*y);
			let len = length*sz*(0.8+0.4*this.randomRain());
			let p2 = new ZV2 (p1.x+len*u.x,p1.y+len*u.y); 	
			let L = new ZL(p1,p2);
			L.strk = maskStrokeW*sz;
			Ls.push(L);
			y=yMin+(yMax-yMin)*Math.pow(t,3);
			sz-=decreaseSz;		
			t-=tm;
		}
		for( let i=0;i<Ls.length; i++)
		{
			let L = Ls[i]; 
			if(isDrawLines)
				this._DL(S.group, L, true);
			
			let path = new Path2D(L._gS(false));
			context.lineWidth = L.strk;
			context.stroke(path);
		}
	
	}
	async M_newImplantationFunc()
	{
		
		var y = this.H -this.m_yStart; /*+20*this.u*/;		
		var yMax = this.H*this.m_documentHorizon;
		this.nbRowsOfGrass = 0; 
		var scale = 1;
		var signDir = 1;

		// array to store the species printed
		let Impl = [];

		for( let iCount=0; iCount<100; iCount++)
		{
			this.m_currentY = y = this.H*Math.random();
			this.nbRowsOfGrass ++;
			scale =  ZMT.M_map( y,this.H,(1-this.m_documentHorizon)*this.H,1, this.m_depthScaleFactor);   // 1. -(1.-this.m_depthScaleFactor)*(this.H-y)/this.H;

									
			for( let is=0; is<this.m_species.length; is++)
			{	let S = this.m_species[is];
				if( S.m_isActive)
				{
					let x = Math.random()*this.W;
					Impl.push({x:x,y:y,scale:scale,S:S })
				}
			}


		
		}

		// Sort by Y
		Impl.sort( function(a,b){
			return (a.y>b.y)?-1 :1;
		});


		for( let i=0; i<Impl.length; i++)
		{
			let opt=Impl[i];
			let S=opt.S;
			opt.seg = this.m_segLength;

			if(S.m_isFern)
			{	
				this.M_putFern(opt);			
			}
				/*else if(S.m_isMint)	
			this.M_putMint(opt);*/
			await sleep(1);


		}

		
		// Draw the backgrounds 
		if(this.m_backgrounds)
		{	for(let i=0; i<this.m_backgrounds.length; i++)
			{	this.M_drawBackground( this.m_backgrounds[i]);
			}
		}
		
	}


	M_drawVignette(S)
	{
		
		this.M_seed( parseInt(this.m_seed),"Vignette");	
		let nbDrops = S.m_nb;
		//let angleVariation= S.m_angle.ang;
		let angleAmp = S.gF("angle",10)*D2R;
		let isDrawLines = S.gB("isDrawLines",true);
		let length = S.m_length;
		let u= new ZV2(); 
		let context = this.m_mask._X();

		let vignetteRad = S.gF("rad",2)*this.u;

		let stroke = S.gF("maskStrokeWidth",1)*this.u;
		context.strokeStyle = "white";
		let Ls=[];
		let cornerRadius = Math.hypot(this.W/2,this.H/2);
		let vignetteRadius = vignetteRad;
		// compute some angles
		let r;

		for(let i=0; i<nbDrops; i++)
		{
			let rnd=Math.pow(this.randomVignette(),2);
			r = cornerRadius-rnd*vignetteRadius;
			let ax=0,ay=PI/2;
			if( r>this.W/2)
				ax = Math.acos(this.W/2/r);
			if( r>this.H/2)
				ay = PI/2-Math.acos(this.H/2/r);


			let side = this.randomVignette()>0.5? 1 : -1;

			let a = ax +(ay-ax)*this.randomVignette();
			if(side<0) a=PI-a;
	
			

			let p0 = new ZV2(this.W/2+r*cos(a),this.H/2+r*sin(a));
			let aVar = 2*angleAmp*(this.randomVignette()-0.5);
			u.x=sin(a+aVar); u.y=-cos(a+aVar);
			
			let len = length*(1-0.9*rnd)*(0.8+0.4*this.randomVignette())*0.5;
			let L = new ZL(new ZV2 (p0.x+len*u.x,p0.y+len*u.y),new ZV2 (p0.x-len*u.x,p0.y-len*u.y));
			//let L = new ZL(new ZV2 (this.W/2,this.H/2),new ZV2 (p0.x,p0.y));
			Ls.push(L);
		}
		let paper = A.M_getColor("paper");
		for( let i=0;i<Ls.length; i++)
		{
			let L = Ls[i]; 


			// draw in mask
			let l = L._gS(false);
			let path = new Path2D(l);
			context.lineWidth = stroke;
			context.stroke(path);

			if(isDrawLines)
				//this._DL(S.group, L, false);
				A.mHL.push({m:"stroke",w:stroke,c:"rgba(0,0,0,0.1)",path:path,l:l});


			// draw in paper color in back heap 
			A.mH.push({m:"stroke",w:stroke,c:paper,path:path,l:l});

		}
	
	}
};



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Plants/Tree.js?v=1681489318

class TreeBranchSeg
{
	constructor(P,Pproj,MV,l,segLength,radius)
	{
		this.P = P;				// 3D point of center
		this.Pproj=Pproj;		// 2D projected point
		this.MV = MV;			// Modelview at point
		this.l = l;				// branch length from the root
		this.segLength = segLength;	
		this.radius=radius;		// radius
	}


}


class ClassTreeBranch
{
	
	constructor(tree,parentBranch)
	{
		this.m_tree = tree;
		this.m_parentBranch=parentBranch;
		this.m_isRoots = false;
		this.m_branches = [];
		this.m_leaves = [];
		this.m_segments = [];
		this.m_position = new ZV3();
		this.m_direction = new ZV3(0,1,0);
		this.m_radius = 0;
		this.m_branchLength = 0;
		this.m_lineLength = 0;		// length from the ground
		this.m_nbSegments = 0;
		this.m_isBackbranch=false;
		this.m_endBranchNb = {min:2,max:2}
		this.m_obj = null;
				
	}
	// A() : returns this algorithm
	A()
	{
		return this.m_tree.m_A;	
	}
	T()
	{
		return this.m_tree;
	}
	M_setPosition(P)
	{
		this.m_position.M_set(P);	
	}

	M_setDirection(U)
	{	let obj=this.m_obj;
		let N;
		if(obj && obj.F && (N=obj.F.m_normalTransformed))
		{
			let T = U.M_cross(N);
			T.Nz();
			U = N.M_cross(T);
			obj.N = N;		// defines a basis for tree moves accross the surface of the face. 
			obj.T = T;
			obj.K = N.M_cross(T);
		}
		this.m_direction.M_set(U);
	}
	// M_setObject
	// {MV,obj,F}
	M_setObject(opt)
	{
		this.m_obj = opt? {...opt} : null;
	}
	M_isDraw(opt)
	{
		let layer= (opt&& opt.layer)? opt.layer : "all";
		let isDraw= layer=="all" || (this.m_obj==null || ( this.m_obj.back == (layer=="back"))  );
		return isDraw;
	}
	M_setRadius(r,parentRadius)
	{
		this.m_radius=r;
		this.m_parentRadius = parentRadius;
	
	}
	M_setBranchLength(len,segmentLength)
	{
		this.m_segmentLength = Math.max(segmentLength, A.u);
		this.m_branchLength = len;  
	
	}
	M_getRadiusEnd()
	{ 	if( this.m_radiusEnd != undefined)
			return this.m_radiusEnd;
		else 
			return this.m_radius*this.m_tree.m_branchReductionFactor;	
	}
	M_getEndBranchNb()
	{	if( this.m_endBranchNb != undefined && typeof this.m_endBranchNb === 'number')
			return this.m_endBranchNb;
		else 
		{	let random = this.A()['randomDepth'+this.m_level];

			let isBugFix = this.m_isRoots || this.A().M_isUseVersion(2.2);
			if(isBugFix)
				 return Math.round(this.m_tree.m_endBranchNb.min + (this.m_tree.m_endBranchNb.max-this.m_tree.m_endBranchNb.min)*random());
			else
				return Math.round(this.m_endBranchNb.min + (this.m_endBranchNb.max-this.m_endBranchNb.min)*random());
		}
	}
	
	M_createBranch(lineLength,parentMV,direction)
	{
		let branch = new ClassTreeBranch(this.m_tree,this);
		branch.m_level = this.m_level+1;
		branch.M_setBranchLength(this.m_branchLength*this.m_tree.m_branchLengthLevelFactor, this.m_segmentLength/**this.m_tree.m_branchLengthLevelFactor*/);
		branch.m_lineLength = lineLength;
		branch.m_parentMV = parentMV;
		branch.m_childBranchDirection=direction;
		branch.m_isRoots = this.m_isRoots;
		branch.M_setObject(this.m_obj);
		this.m_branches.push(branch);
		
		this.A().M_log("Nb. branches = "+(this.A().m_branchCount++),"M_createBranch");
		return branch;
	}

	M_run(MV)
	{
		//A.m_deformersActive = false;
		let Algo=this.A();
		let obj=this.m_obj;	
		if(MV===undefined)
		{	
			MV = new RQMatrix4();
			if( obj&&obj.T)
			{	
				MV.M_setBase(obj.T,obj.N.M_cross(obj.T),obj.N);
				//console.log("Created MV ="+MV.M_getString());
			}

		}
		let isEndChildBranch = this.m_parentMV !=undefined; 
		if( this.m_parentMV==undefined) this.m_parentMV = MV.clone();
		let random = Algo['randomDepth'+this.m_level];
		let rndShift;
		if(Algo.m_isRndNoise)
			rndShift = random();
		let isStop = false;
		let yStop;
		if( this.m_tree.m_yStop !=undefined && this.m_tree.m_yStop>10)
		{	isStop = true;
			yStop = A.Pj(this.m_tree.m_position).y-this.m_tree.m_yStop; 		
		}
		
		let count = 0;
		let P = this.m_position.clone();

		let segmentLength = this.m_segmentLength;
		let Ylocal = new ZV3(0,1,0);
		let radiusEnd = this.M_getRadiusEnd();
		let currentRadius = this.m_radius;
		let Pproj;
		let prevP;
		let ang=0;
		let lineLength = 0;
		let lengthReached = false;
		let endOfBranch = false;
		let thisBranchLength = (this.m_customBranchLength==undefined)?  this.m_branchLength :this.m_customBranchLength; 
		let lengthSign = this.m_isRoots?-1:1;
		let isStopped = false;
		while( !endOfBranch )
		{
			if(this.A().m_abort)
				return;
			let isFirstSegment = lineLength==0;
			let kLength = lineLength/thisBranchLength;
			currentRadius = ZMT.M_map(lineLength,0,thisBranchLength,this.m_radius,radiusEnd);	// TODO : first radius of isEndChildBranch == parentBranchLastRadius
			if( isEndChildBranch && this.m_parentRadius)
			{	 
				currentRadius= Math.max( radiusEnd*0.7+ (this.m_parentRadius-radiusEnd*0.7)*Math.exp( -2*kLength,2),currentRadius);			
			}

			// Compute P projection
			Pproj = A.Pj( P);

			// Create the SEGMENT structure
			let segment = new TreeBranchSeg(P.clone(), Pproj, (isFirstSegment && isEndChildBranch)? this.m_parentMV :  MV.clone(), this.m_lineLength+lineLength,0, currentRadius );
			this.m_segments.push( segment );
									
			if( lengthReached )
				endOfBranch = true;
			else if( isStop && (Pproj.y*lengthSign > yStop*lengthSign) )
			{
				endOfBranch = true;
				isStopped = true;
			}
			else 
			{
				count ++;

				// ----------
				// generateBranches
				// inline function for creating a new branch
				let generateBranches=(myRandom,info)=>{

					let isReturnValue = this.m_isRoots || Algo.M_isUseVersion(2.3);
					if(isReturnValue)
					{
					}
					let rnd=myRandom();
					if(rnd<info.rnd && this.m_level<this.m_tree.m_maxRecursionDepth)
					{	
						if( kLength>=info.height && this.m_level>=info.level)
						{
							if( P.y*lengthSign> (Algo.m_groundMargin+Algo.m_yStart)*lengthSign)
							{	
								let branchOpen = this.m_tree.m_branchOpenAngle;
								var branchAngle = branchOpen.min+(branchOpen.max-branchOpen.min)*myRandom();		// TODO : parametrize
								var branchDirection = obj? 0:  myRandom()*360;		// direction around this branch
								if( obj && myRandom()<0.5)	branchAngle*=-1;
								
								// creating a branch
								let branch = this.M_createBranch(this.m_lineLength+lineLength);
								branch.M_setRadius(currentRadius*this.m_tree.m_newBranchRadiusFactor,currentRadius);


								while( branch.m_level <info.newLevel)
								{
									branch.m_level++;
									branch.m_lineLength +=branch.m_branchLength;  
									branch.m_branchLength*=this.m_tree.m_branchLengthLevelFactor;
									branch.m_radius *= this.m_tree.m_newBranchRadiusFactor;							
								}
								
								
								let branchMV = MV.clone();
								if(branchDirection)
									branchMV.M_rotate(branchDirection,0,1,0);			// place the new branch around this branch 
								if( obj)
									branchMV.M_rotate(branchAngle,0,0,1);				// inclinaison of branch
								else
									branchMV.M_rotate(branchAngle,1,0,0);				// inclinaison of branch

								branch.M_setPosition(P.M_plus( branchMV._mBV(new ZV3(0,currentRadius*0.6,0) ) ) );

								branch.M_run(branchMV);
								if(isReturnValue)
								{	return true;
								}
							}
							else if(isReturnValue)
							{	//Algo.M_log("FALSE with P.y = "+P.y+" vs Algo.m_groundMargin="+Algo.m_groundMargin+" Algo.m_yStart="+Algo.m_yStart+" =>"+P.y+"<"+(Algo.m_groundMargin+Algo.m_yStart));
								return false;
							}
						}
						else if(isReturnValue)
						{	//Algo.M_log("FALSE with kLength = "+kLength+" vs info.height="+info.height+" level="+this.m_level+" vs info.level="+info.level);
							return false;
						}

					}
					else if(isReturnValue)
					{	//Algo.M_log("FALSE with rnd = "+rnd+" this.m_level="+this.m_level+" vs maxDepth="+this.m_tree.m_maxRecursionDepth);
						return false;
					}
				}
				// ---------- end generate branch inline function



				if( !generateBranches( random,this.T().m_intermediateBranch))
				{	generateBranches( Algo['randomYoung'], this.T().m_youngBranch);
				}
				
				// Leaves				
				// ----------
				if( this.m_tree.m_isLeaves && this.m_level>=(this.m_tree.m_maxRecursionDepth-1) && Algo.randomLeaves()<this.T().m_leafRndDensity) 
				{
					if( P.y> (this.m_tree.m_groundMargin+Algo.m_yStart))
					{
						let MVLeaf;
						if( obj && obj.F)
						{	MVLeaf = new RQMatrix4();
							let X=MV.mRV(Ylocal).Nz();
							let Z= obj.F.m_normalTransformed.M_cross(X);
							let Y =X.M_cross(Z); 							
							MVLeaf.M_setBase( X,Y,Z);
						}
						else 
						{	var leafDirection = Algo.randomLeaves()*360;		// direction around this branch

							MVLeaf = MV.clone();
							MVLeaf.M_rotate(leafDirection,0,1,0);			// place the new branch around this branch 
							MVLeaf.M_rotate(30,1,0,0); 
						}
						let PLeaf = P.M_plus( MVLeaf._mBV(new ZV3(0,currentRadius,0) ) ) ;
						let PLeafproj = A.Pj( PLeaf);

						this.m_leaves.push([PLeafproj,MVLeaf]);
					}
					else
					{	//Algo.M_log("P.y"+P.y+" this.m_tree.m_groundMargin="+this.m_tree.m_groundMargin+" Algo.m_yStart="+Algo.m_yStart);				

					}
				}
				/*else
				{
					
				}*/
				
				// ----------
				// Avance to next segment
				// 
				let thisSegmentLength = segmentLength;




				
				// GROW THE BRANCH
				// advance segment and change direction 
				let isForceAng = (count<3) && isEndChildBranch && this.m_childBranchDirection!=undefined;  
				if(isForceAng)
				{	
					if( isFirstSegment)
						MV = this.m_parentMV.clone();
					// use this.m_parentMV
					ang = this.m_childBranchDirection/3;
				}
				else
				{
					let rnd1,rnd2;
					if(Algo.m_isRndNoise)
					{	rnd1  = Noz(rndShift +2*lineLength/Algo.W*Algo.m_noiseFactor.x,lineLength/Algo.H*Algo.m_noiseFactor.y);
						rnd2  = 0.5*(1+Noz(1.5*rndShift+lineLength/Algo.W*Algo.m_noiseFactor.x,lineLength/Algo.H*Algo.m_noiseFactor.y));
					}
					else
					{	rnd1 = random();
						rnd2 = random();
					}	
					if(obj)
					{
						ang= this.T().m_rndAngleSpan *2*(rnd2-0.5)*(1.0+this.m_level*0.2);

					}
					else 
					{	MV.M_rotate(rnd1*360,0,1,0);				
						ang= this.T().m_rndAngleSpan * 0.5*rnd2*(1.0+this.m_level*0.2);
					}
				}
				let displ = currentRadius*sin(ang*D2R);
				let spacingMax = segmentLength/4;
				if( displ>(segmentLength-spacingMax))
				{	let decal = displ - (segmentLength-spacingMax);
					thisSegmentLength += decal;
				}
				// Now set last segment's length
				prevP = P.clone();
				if( lineLength>= thisBranchLength)
				{
					lengthReached = true;
					thisSegmentLength = lineLength-thisBranchLength;
					P.M_add(segment.MV.mRV(Ylocal).M_mul(thisSegmentLength));
					// ( do not rotate matrix on last segment )
				}
				else
				{
					// BUG : here segment.MV is corrupted 
					P.M_add(segment.MV.mRV(Ylocal).M_mul(thisSegmentLength));

					if( this.m_tree.m_gravity)
					{
						// compute an orientation
						let Y = MV.mRV(Ylocal);
						let gravityAmount = (1-(0.5+0.5*Y.M_dot(this.m_tree.m_gravity)))*0.3;
						P.M_add(this.m_tree.m_gravity._mB(thisSegmentLength*gravityAmount) );
						// TODO :::: 
					}
					
					//if( !isForceAng)
					if( obj)
						MV.M_rotate(ang,0,0,1);
					else 
						MV.M_rotate(ang,1,0,0);
				
				}

				// ----------
				// we have moved from prevP to P
				// Handle the crawling on an object and face change
				let hasObjControl = false;
				if( obj)
				{	// Test whether we are still on the face
					let test = obj.obj.M_testFace(obj.F,P,prevP);
					
					//  Leaving the current face of the 3D object
					if( test!==true ) 
					{	
						if( typeof test ==='object') // we have a new face ; test = {newF, intersect,basis,newBasis  }
						{	

							// current direction + coordinates in local face
							let dirBranch=MV.mRV(Ylocal);
							let x_= dirBranch.M_dot(test.basis.X);
							let y_= dirBranch.M_dot(test.basis.Y);
	
							// find a coordinate on the edge
							// -> coordinates of Pprev (Q)
							//let OQ = prevP.M_minus(test.basis.O);
							//let Qx_ = OQ.M_dot(test.basis.X);
							//let Qy_ = OQ.M_dot(test.basis.Y);
							//let My_ = abs(Qx_)>0.01? Qy_ -y_/x_*Qx_ : Qy_; 
							
							// -> place P on the edge ( x=0, z=0 )
							//P = test.basis.O.M_plus( test.basis.Y._mB(My_) );
							P = test.intersect;	
								// draw the point we landed on 
								//this.A().M_drawDebugVector(P,new ZV3(0,0,0),null,{color:"green",mask:true});

							// compute new segment length
							thisSegmentLength=prevP.M_dist(P);
							if( thisSegmentLength<0.1)
							{
								thisSegmentLength=0.1;
							}

							//if( !obj.F.m_isBackface)
							//	this.A().M_drawDebugVector(P,dirBranch,null,{color:"blue",mask:true});	// temp DEBUG 
	
							// create new branch direction in the new face
							dirBranch = test.newBasis.X._mB(x_).M_plus(test.newBasis.Y._mB(y_)).Nz();

							// 
							//let dot=dirBranch.M_dot(this.m_direction);	check angle between newDirection and currentDirection : not much interesting
							let isContinueCrawlOnNewFace=true;
							if(this.T().dotProductFacesCrawlStops)
							{
								let dot=obj.F.m_normal.M_dot(test.newF.m_normal);
								if(dot<=this.T().dotProductFacesCrawlStops) // test freeing the tree
								{	console.log("discontinuing crawling with dot="+dot);
									isContinueCrawlOnNewFace=false;
								}
							}

							// Set the flag to it doesn't advance more.
							if(isContinueCrawlOnNewFace)
							{
								hasObjControl = true;

		
								// change face 
								// TODO : would need to create a new branch from there if the newface is a Backface. 
								let layerChanged = (test.newF.m_isBackface != obj.back);
								obj.F = test.newF;
								this.M_setDirection(dirBranch);	
		
								
		
								//if( !test.newF.m_isBackface)
								//	this.A().M_drawDebugVector(P,dirBranch,null,{color:"green",mask:true});	// temp DEBUG 
		
								// make a 3D basis for the new direction
								//let dot = dirBranch.M_dot(obj.T);
								//let X= dot>0.8 /*colinear*/ ? obj.K._mB(-1) : dot<-0.8 ? /*inv colinear*/ obj.K : obj.T;
								let X = dirBranch.M_cross(obj.F.m_normalTransformed).Nz();
								MV.M_setBase(X,dirBranch,obj.F.m_normalTransformed);
		
		
								if(layerChanged)	
								{	
									endOfBranch = true;	// stop the current one
									
									// lineLength,parentMV,direction
									let branch = this.M_createBranch(this.m_lineLength+lineLength,MV.clone(), dirBranch);
									
									// some copy setup
									branch.m_level = this.m_level;
									branch.M_setBranchLength(this.m_branchLength, this.m_segmentLength);
									branch.m_obj.back = obj.F.m_isBackface;
									branch.M_setPosition(P);
									branch.M_setRadius(currentRadius,this.m_radius);
									branch.m_customBranchLength = this.m_branchLength-lineLength;

									// run the new one
									branch.M_run(MV);

								}
							}
							else // discontinuing crawl
							{	obj=this.m_obj=null;

							}
						}
						else
							endOfBranch = true;
	
					}
				}
	



				// finalize the growth
				lineLength  += thisSegmentLength;
				segment.segLength = thisSegmentLength;
			
			
			}

		}
		thisBranchLength = lineLength;
		if( this.m_customBranchLength==undefined)
			this.m_branchLength = lineLength;

		// End branch / leaves
		if( count>0)
		{	
			if(!isStopped)
			{
				let putLeaves = this.m_level==this.m_tree.m_maxRecursionDepth;

				let nb,angleSpan; 
				if( putLeaves)
				{	let e=this.m_tree.m_endBranchNbLeaves;
					nb=e.min + Math.round((e.max-e.min)*Algo.randomLeaves());  
					angleSpan = this.m_tree.m_endBranchLeafAngleSpan;
				}
				else 
				{	nb = this.M_getEndBranchNb(); 
					angleSpan = (0.4+0.8*random())*this.m_tree.m_endBranchAngleSpan;
			
				}
				
				for( var i=0; i<nb;i++)
				{	
					
					if(putLeaves)
					{	if(this.m_tree.m_isLeaves && ( P.y> (this.m_tree.m_groundMargin+Algo.m_yStart)))
						{	

							var newDirection = (nb==1?  (-0.5+Algo.randomLeaves())*angleSpan : (-0.5 + i/(nb-1))*angleSpan ) ;
							let MVLeaf = MV.clone();
							//MVLeaf.M_rotate(leafDirection,0,1,0);			// place the new branch around this branch 
							MVLeaf.M_rotate(newDirection,1,0,0); 
							this.m_leaves.push([Pproj.clone(),MVLeaf]);

						}else
						{
							//
						
						}
					}
					else // send a branch
					{	
						let randomOfBranch = Algo["randomDepth"+(this.m_level+1)];
						let newDirection;
						let branchMV = MV.clone();
						if( this.m_endBranchAngle != undefined && !obj)
						{	newDirection = this.m_endBranchAngle.min + randomOfBranch()*(this.m_endBranchAngle.max-this.m_endBranchAngle.min);
							MV.M_rotate( 360/nb, 0,1,0);
						}
						else
						{	newDirection = (nb==1?  (-0.5+randomOfBranch() )*angleSpan : (-0.5 + i/(nb-1))*angleSpan ) ;
						}
						let branch = this.M_createBranch(this.m_lineLength+lineLength,MV.clone(), newDirection);
						branch.M_setPosition(P);
						
						let factor=this.m_customRadiusFactor;
						if( factor && factor.min )	// means custom
							factor = factor.min + (factor.max-factor.min)*randomOfBranch();
						else
							factor =this.m_tree.m_branchEndRadiusFactor; 
						branch.M_setRadius(radiusEnd*factor,radiusEnd);
						
						branchMV.M_rotate(newDirection,obj?0:1,0,obj?1:0);				// inclinaison of branch
						branch.M_run(branchMV);
					}
				}

			}

			// tells if it's back or front branch
			{
				let Nlocal = new ZV3(0,-1,0);
				let Nw = this.m_segments[0].MV.mRV(Nlocal);
				this.m_isBackbranch = Nw.M_dot(Algo.m_toEyeVector)>0;
			

			}	


			// set splines for V vectors
			if(false)
			if( count>=2)
			{
				count = this.m_segments.length;
				for(let i=0; i<(count-1); i++)
				{	this.m_segments[i].V = this.m_segments[i+1].P.M_minus(this.m_segments[i].P).Nz();				 
				}
				let vEnd = this.m_segments[count-1].V = this.m_segments[count-2].V;

				// make spline
				let v0 = this.m_parentMV._mBV(new ZV3(0,1,0)).Nz();
						
				for(let i=0; i<(count-1); i++)
				{
					let S = this.m_segments[i];
					S.m_VSpline = new CatmullRomSpline( i>0? this.m_segments[i-1].V : v0,  S.V, this.m_segments[i+1].V, i<(count-2)?this.m_segments[i+2].V :vEnd)
					//console.log("Branch level="+this.m_level+" seg="+i+"/"+count+" "+S.m_VSpline.M_getString());
				
				}
			}
		}
		

				
	
	}
	M_drawLeaves(opt)
	{
		let isDraw = this.M_isDraw(opt);

		let Algo = this.A();
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{		this.m_branches[ib].M_drawLeaves(opt);
		}
		// draw this branch's leaves
		if( isDraw)
		{
			let leafOpts =this.m_tree.m_leafOpts; 
			for( let il=0; il<this.m_leaves.length; il++)
			{	
				let leaf= this.m_leaves[il];

				if(leafOpts.leafSizeVar)
					leafOpts.leafSize = leafOpts.leafSizeVar.func.apply(Algo,[leaf[0].x,leaf[0].y,leafOpts.leafSizeVar.config] ); 
				else if(!leafOpts.leafSize)
					leafOpts.leafSize = 5*Algo.u;
				leafOpts.leafSize*=this.m_tree.m_scale;
				leafOpts.M_setGrowth(Algo.randomLeaves());		// always set leafSize before calling Growth
				LeafManager.M_drawLeaf( ...leaf, this.m_tree.m_leafOpts);
			}
			//A.m_deformersActive = false;	

		}

	
	}
	M_draw(opt)
	{
		let isDraw = this.M_isDraw(opt);

		
		// draw front children branches
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(!this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_draw(opt);
		}

		let Algo = this.A();

		// Draw Grass in front 
		if( this.m_isTrunk && isDraw)
		{
			if( Algo.m_grass && Algo.m_grass.m_isActive)
			{
				this.M_drawGrass("front");						// TODO
			}
		
		}

		// draw this branch	
		if(isDraw)
		{	if( this.m_segments.length>=2)
			{
				let L1 = new ZPL();
				let L2 = new ZPL();
				let L = new ZPL();
				let startArc,endArc;
				let nbSegments = this.m_segments.length;
				
				for( let i=0; i<nbSegments; i++)
				{	
					let isStartPoint = i==0;
					let isEndPoint = i==(nbSegments-1);
					let s = this.m_segments[i];
					let O = s.P;
					let Oproj = s.Pproj;
					L._aP( Oproj);	// centerline ( temp )
					let drawBranchSegment = Algo.m_isDrawBranchSegments;
					if( true )	// draw arcs
					{
						let MV = s.MV;
						let angInc = PI*2/50;
						let radius = s.radius;
						let circle1 = new ZPL();
						let circle2 = new ZPL();
						let circle=circle1;
						let isCapVisible = false;
						if( isStartPoint || isEndPoint )
						{
							let Nlocal = new ZV3(0,isStartPoint?-1:1,0);
							let Nw = MV.mRV(Nlocal);
							isCapVisible = Nw.M_dot(Algo.m_toEyeVector)>=0;
						}
						let arc;
						arc = this.M_getSegmentArc(true,s,50);
						
						if( isStartPoint && !isCapVisible )
							startArc = arc;
						else if( isEndPoint && !isCapVisible)
							endArc = arc;
						else 
						{	
							if(drawBranchSegment)
								A._DL(this.T()._g.Branches,arc,true);
								//Algo._g.BranchFill.m_lines.push( ...Algo.M_computeLineMask(arc));
									
							if( isStartPoint)
								startArc =this.M_getSegmentArc(false,s,50); 
							else if( isEndPoint)
								endArc =this.M_getSegmentArc(false,s,50); 
						}
						// Left and right lines
						if( arc )
						{
							L1._aP( arc.M_getPoint(0));									
							L2._aP( arc.M_endPoint());									
						}
					}

				}
				// draw 
				// compute the closed shape

				L1.M_reverseOrder();
				if( this.m_level>=this.T().m_drawBranchContourLevel)
				{
					//Algo._g.Branches.m_lines.push( ...Algo.M_computeLineMask(L2));
					//Algo._g.Branches.m_lines.push( ...Algo.M_computeLineMask(L1));
					let Grp = this.T()._g.Branches; 
					A._DL(Grp,L2,true);
					A._DL(Grp,L1,true);
				}
				if( L2.M_endPoint().M_dist(endArc.M_getPoint(0) ) >  L2.M_endPoint().M_dist(endArc.M_endPoint() ) ) endArc.M_reverseOrder();

				let contour = L2.clone();
				contour.M_append(endArc);
				contour.M_append(L1);
				// Algo._g.Branches.m_lines.push( ...Algo.M_computeLineMask(L2));    // if we want the end arc
				

				
				if( contour.M_endPoint().M_dist(startArc.M_getPoint(0) ) >  contour.M_endPoint().M_dist(startArc.M_endPoint() ) ) startArc.M_reverseOrder();
				contour.M_append(startArc);


				this.M_fill(contour);

				this._dM(contour,L1,L2);

			}
		}		
		// draw back children branches
		for( let ib=0; ib<this.m_branches.length; ib++)
		{	if(this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_draw(opt);
		}
		// Draw Herb+Ground
		if( this.m_isTrunk && isDraw)
		{
			
			if( Algo.m_grass && Algo.m_grass.m_isActive)
			{
				this.M_drawGrass("back");
			}
			
			if( Algo.m_ground && Algo.m_ground.m_isActive)
			{
				this.M_drawGround();
				//if(Algo.m_ground.m_earthPlane=="front")
				this.M_drawEarth("front");			
			
			}
		
		
		}
	
	}
	M_getSegmentArc(frontArc,s,nbCirclePoints)
	{
		let Algo = this.A();
		let MV 		= s.MV;
		let Oproj	= s.Pproj;
		let circle1 = new ZPL();
			
		{
			let vy = MV.mRV(new ZV3(0,1,0));
			let Z = Algo.m_toEyeVector;
			let X = vy.M_cross(Z).Nz();
			Z= X.M_cross(vy);
			let a = 0;
			let aInc =(frontArc? PI : -PI)/nbCirclePoints;
			for( let i=0; i<nbCirclePoints;i++)
			{
				let r = s.radius;
				let co=cos(a)*r;
				let si=sin(a)*r;
				let P = new ZV3( - X.x*co + Z.x*si, -X.y*co + Z.y*si, -X.z*co + Z.z*si); 
				circle1._aP(A.Pj(P,Oproj));
				a+=aInc;
			}
		}	
		
		
		
		return circle1;
	
	}
	_dM(shape,L1,L2)
	{
		let Algo = this.A();
		if( shape && this.T().m_drawBranchMask)
		{
			var path = new Path2D(shape._gS(true));
			let context = Algo.m_mask._X();
			context.fillStyle = "white";
			context.fill(path);
				
		   if( Algo.m_isShortenJunctions)
		   {   context.lineWidth = Algo.m_protectionStrokeWidth*2;
			   context.strokeStyle = "white";
			   context.stroke(new Path2D(L1._gS(false)));
			   context.stroke(new Path2D(L2._gS(false)));
		   }


		}
	}
	M_fill(shape)
	{
		let Algo = this.A();
		let fills = null; 
		let Gp = this.T()._g.Roots;
		if( this.m_isRoots && Gp)
			fills = Gp.fills;
		if( fills==null || !isArr(fills) )
			fills = this.T()._g.Branches.fills;
		if( isArr(fills) )
		{
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];


				if( F)
				{	
					F.branch = this;
				
					// compute the average direction
					let nbSegments = this.m_segments.length;
					let dirMedian = new ZV3();
					let nbDirs = 0;
					for( let i=0; i<nbSegments-1; i++)
					{	
						let dir = this.m_segments[i+1].P.M_minus( this.m_segments[i].P ); 
						dirMedian.M_add(dir);
						nbDirs++;
					}
					dirMedian.M_mul(1/nbDirs).Nz();
					let N = Algo.m_toEyeVector.M_cross(dirMedian).Nz();
					let lighting = (1+N.M_dot(Algo.m_lightSource))*0.5;
					lighting*=lighting;

					F.orientation = Algo.M_projectedOrientation(dirMedian);
					F.spacing=  ZMT.M_map( lighting,0,1,F.m_spacing.min , F.m_spacing.max);
					Algo._Fl(F,shape,F);

				
				}
			}
		}
	
	}


};
class ClassTree extends ClassTreeBranch 
{
	
	// opts
	/* 
	{
		isLeaves				: true,
		isAllLeavesFront		: false,
		leafShape				: "default"
		rndAngleSpan 			: 
		branchRndDensity		:
		maxRecursionDepth		: 
		branchLengthLevelFactor :
		branchEndRadiusFactor	: 
		newBranchRadiusFactor	: 
		branchReductionFactor	: 
		branchOpenAngle			:
		endBranchLeafAngleSpan	: 
		endBranchNbLeaves		: {min : 1 ; max : 3}
		intermediateBranches	: {rnd:0.3, height:0,level:0,newLevel:1} 
		youngBranch				: {rnd:0.1, height:0,level:0,newLevel:2}
		leaves					: {rnd:0.1, height:0,level:0} 
		drawBranchContourLevel	: 0
		rootEndBranchNb			: {min:2,max:2}
		groundMargin			: 0
		groups					: { }
	}
	algorithm. M_defaultLeafProfile

	*/
	constructor(algorithm,opt)
	{
		super(null, null); 
		// versions 
		// 2.0		
		// 2.2			- correction bug number of end branches 
		// 2.3			- correction bug on new branches
		this.m_version 					= 2.3;		
		this.m_factoryCount				=TreeManager.factoryCount++;
		this.m_tree  = this;
		this.m_rootBranch=false;
		this.m_isTrunk = true;
		this.m_A = algorithm;				// algo				
		this.m_rndAngleSpan 			= opt.rndAngleSpan;
		this.m_branchRndDensity			= opt.branchRndDensity;
		this.m_maxRecursionDepth		= opt.maxRecursionDepth;
		this.m_branchLengthLevelFactor	= opt.branchLengthLevelFactor;
		this.m_branchEndRadiusFactor 	= opt.branchEndRadiusFactor;
		this.m_newBranchRadiusFactor 	= opt.newBranchRadiusFactor;
		this.m_branchReductionFactor 	= opt.branchReductionFactor;
		this.m_branchOpenAngle			= opt.branchOpenAngle;
		this.m_endBranchAngleSpan		= opt.endBranchAngleSpan;
		this.m_endBranchLeafAngleSpan	= opt.endBranchLeafAngleSpan;
		this.m_intermediateBranch		= opt.intermediateBranches;
		this.m_youngBranch				= opt.youngBranch;
		this.m_drawBranchContourLevel 	= opt.drawBranchContourLevel;
		this.m_isLeaves					= opt.isLeaves;
		this.m_isAllLeavesFront			= opt.isAllLeavesFront; 
		this.m_endBranchNbLeaves 		= opt.endBranchNbLeaves;
		this.m_leafRndDensity			= opt.leaves.rnd;
		this.m_leafOpts					= opt.leafOpts;
		this._g					= opt.groups;
		this.m_groundMargin				= opt.groundMargin;
		this.m_level					= 0;
		this.m_drawBranchMask			= true;
		this.m_parentMV 				= new RQMatrix4();
		this.m_endBranchNb				= opt.rootEndBranchNb;
		this.m_scale 					= opt.scale;		
	}
	M_setRadius(r,parentRadius)
	{
		this.m_radius=r*this.m_scale;
		this.m_parentRadius=0;
	
	}
	M_setBranchLength(len,segmentLength)
	{
		this.m_segmentLength = Math.max(segmentLength*this.m_scale, A.u);
		this.m_branchLength = len*this.m_scale;  	
	}
	M_makeRoots()
	{
		let R;
		let Algo = this.A();
		let nbRoots = Algo.m_roots.m_nbRoots;

		// reseed
		if( Algo.m_roots.m_seed>-1)
			Algo.M_makeRandomFunctions(Algo.m_roots.m_seed);


		this.m_roots=R=new ClassTreeBranch(this,this);
		
		
		this.m_branchEndRadiusFactor/=2;
		this.m_youngBranch = Algo.m_roots.m_youngBranch;
		this.m_intermediateBranch = Algo.m_roots.m_intermediateBranch;
		this.m_rndAngleSpan = Algo.m_roots.m_rndAngleSpan;
		this.m_yStop = Algo.m_roots.m_yStop;
		//Algo.M_log("Roots : using youngBranch = "+RQPrintR(this.m_youngBranch,1));
		this.m_maxRecursionDepth = Algo.m_roots.m_maxRecursionDepth;
		R.m_level = 0;
		R.m_isRoots = true;
		R.m_parentRadius=this.m_radius;
		R.m_radiusEnd = R.m_radius = this.m_radius;
		R.M_setBranchLength( this.m_branchLength*0.5/*this.m_segmentLength*/,this.m_segmentLength);
		R.m_customBranchLength = this.m_radius/2;
		R.m_customRadiusFactor =  Algo.m_roots.m_rootsRadiusFactor;
		R.m_lineLength = 0;
		R.M_setPosition(this.m_position);
		R.m_endBranchNb = nbRoots;
		R.m_endBranchAngle = Algo.m_roots.m_rootsEndBranchAngle;
		this.m_groundMargin = 0;
		this.m_branchLengthLevelFactor = Algo.m_roots.m_branchLengthLevelFactor;
		
		let MV = this.m_parentMV.clone();
		MV.M_rotate(180,1,0,0);
		this.m_gravity=new ZV3(0,-1,0);
		this.A().m_isLeaves = false;
		let angleSpan = 60;
		
		if( false)
		{	for( let n=0; n<nbRoots; n++)
			{
				var newDirection = angleSpan;
				let branch = R.M_createBranch(0,MV.clone(), newDirection);
				branch.M_setRadius(this.m_radius*0.3,this.m_radius);					
				let branchMV = MV.clone();
				branchMV.M_rotate(360*n/nbRoots,0,1,0);				// distribution
				branchMV.M_rotate(newDirection,0,0,1);				// inclinaison of branch
				branch.M_setPosition(this.m_position); //.M_plus(branchMV.mRV(new ZV3(0,this.m_radius/2,0) )));
				branch.M_run(branchMV);
			}
		}
		else
			R.M_run(MV);

	}
	M_draw(opt)
	{
		let isDraw = this.M_isDraw(opt);

		let frontLeaves = this.m_isAllLeavesFront;

		// draw front leaves
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(frontLeaves || !this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_drawLeaves(opt);
		}
		// draw leaves
		if(isDraw)
		{
			let Algo = this.A();
			for( let il=0; il<this.m_leaves.length; il++)
			{
				this.m_leafOpts.leafSize = Algo.m_leafSize.func.apply(Algo,[C.x,C.y,Algo.m_leafSize.config] ); 
				//Algo.M_drawLeaf( ...this.m_leaves[il], this.m_leafOpts);
				LeafManager.M_drawLeaf( ...this.m_leaves[il], this.m_leafOpts);
			}
		}
		// draw the tree
		super.M_draw(opt);
	
		// draw back leaves
		if(!frontLeaves)
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_drawLeaves(opt);
		}
		
	
	
	}
	M_drawGrass(side)
	{
		
		let Algo = this.m_A;
		Algo.M_log("M_drawGrass");
		let S = Algo.m_grass;
		if( S)
		{
			
			let pProj = A.Pj(this.m_position);
			let scale = 1.;
			let range;
			let yMin = pProj.y - S.m_dimensions.depth/2*Algo.m_perspectiveFactor-S.m_y; 
			let yMid = pProj.y-S.m_y;/*+this.m_radius*Algo.m_perspectiveFactor*/
			let yMax = pProj.y + S.m_dimensions.depth/2*Algo.m_perspectiveFactor-S.m_y; 
			if( side=="front")
				range={init:yMax, min:yMid}
			else if( side=="back")
				range={init:yMid, min : yMin}

			let mid = Algo.mwA.center().x;
			S.A.m_xBounds={min: mid-S.m_dimensions.width*0.5, max: mid+S.m_dimensions.width*0.5}
			if( range!=undefined)
			{
				for ( let y = range.init; y > range.min; )
				{
					scale = ZMT.M_map(y,yMin,yMax,S.m_depthScaleFactor, 1);
					S.A.M_makeLineOfGrass(y,scale);
					y-= 4*Algo.u*scale;
				}
			
			}
		
		
		
		}
	}
	M_drawGround()
	{
		let Algo = this.m_A;
		let S = Algo.m_ground;
		if( S )
		{
			let points = [];
			let ind = [-1,1,1,1,1,-1,-1,-1];
			let C = Algo.mwA.center();
			let perspective =Algo.m_perspectiveFactor/3; 
			let xdecal = perspective*S.m_dimensions.depth/3;
			var earthL ;
			for( let i=0; i<8; i+=2)
			{	let P = new ZV3(C.x+ind[i]*S.m_dimensions.width/2+ind[i+1]*ind[i]*xdecal,this.m_position.y+S.m_y,this.m_position.z+ind[i+1]*S.m_dimensions.depth/2) ;  
				points.push( A.Pj( P));
			}
			let _A = points[0].clone();
			let _B = points[1].clone();
			points.push(points[0].clone());
			if(S.m_noiseContour.amplitude!=0 && S.m_noiseContour.fact !=0)
			{
				let noiseOffset =-this.T().m_position.x; 
			
				let pts2 = [];
				let segLength = 1*Algo.u;
				for( let j=0; j<4; j++)
				{
					let AB = points[j+1].M_minus(points[j]);				
					let l = AB.M_length();
					let nbPoints = l / segLength;
					let s=segLength;
					let y=0;
					AB.M_mul(1/l);					
					for( let i=1; i<=nbPoints; i++) 
					{
						let P = points[j].M_plus(AB.x*s,AB.y*s);
						let rnd = Noz( (P.x-noiseOffset)*S.m_noiseContour.fact/l,P.y*S.m_noiseContour.fact/l);
						P.y+=rnd*S.m_noiseContour.amplitude/2;
						pts2.push(P);
						s+=segLength;
					}
					if( j==0)
						earthL = new ZPL([...pts2]);
				}			
				points=pts2;
			}
			let L = new ZPL(points);
			//Algo.M_log("Ground L="+L.M_getString());
			//L.M_closePath();

			let Fs = this.T()._g.Ground.fills;
			let F;
			if(Fs)
			for( let f=0; f<Fs.length; f++)
			{
				if( F =Fs[f])
				{
					// contour
					if(S.m_isDrawContour)
					{	//F.m_lines.push( ...Algo.M_computeLineMask(L) );			
						A._DL(F,L,true);
					}
					// Hatch 
					F.orientation= 0;	// orientation
					F.spacing=  F.m_spacing.average;
					//Algo.M_log("F.spacing = "+F.spacing);
					//F.jointEnds=true;
					//F.m_lines.push( ...Algo.M_hatchShape( L ,F)); 
					Algo._Fl(F,L,F);
				
				}
				if(S.m_isDrawInMask)
				{
					let pathPoints = L._gS(false);
					var path = new Path2D(pathPoints);
					if(Algo.m_mask)
					{	
						var context = Algo.m_mask._X();			
						context.fillStyle = "white";
						context.fill(path);
					}	
				
				}
			}
			// Earth
			if( S.m_earthHeight >0 )
			{
				earthL._aP(_B.M_plus( 0,S.m_earthHeight) );
				earthL._aP(_A.M_plus( 0,S.m_earthHeight) );
				earthL.M_closePath();
				this.m_earthL = earthL;
				
				
			}
			else
				this.m_earthL = 0;
		}
	
	}
	M_drawEarth(plane)
	{
		let Algo = this.m_A;

		if(this.m_earthL)
		{
			// Test
			//Algo.m_hatchTexture = Algo.m_mask;
			
			let Fs;
			if( plane=="front")
				Fs = this.T()._g.EarthFront.fills;
			else 
				Fs = this.T()._g.Earth.fills;
			let F;
			if( Fs )
			for( let f=0; f<Fs.length; f++)
			{
				if( F =Fs[f])
				{
					if(plane=="front")	// TEMP
						F.spacingFunc = Algo.M_earthSpacingFunc;
					F.spacing=  F.m_spacing.average;
					//F.m_lines.push( ...Algo.M_hatchShape( this.m_earthL ,F)); 
					Algo._Fl(F,this.m_earthL,F);
				}
			}
		}
	
	
	}

};
class TreeManagerClass
{
	constructor()
	{	
		this.factoryCount=0;
	}
	M_createTreeOptions(treeType,opts)
	{
		if(opts===undefined)
			opts={};
		if(opts.groups===undefined)
			opts.groups={Branches:null}				// todo : find the default group
		let isLeaves = opts.leafOpts? true:false;
		let scale = opts.scale||1;
		let maxDepth = opts.maxDepth?opts.maxDepth:5
		let o =
		{
			isLeaves				: isLeaves,
			isAllLeavesFront		: false,
			leaves					: {rnd:0.2, height:0,level:0},
			leafOpts				: opts.leafOpts,
			scale					: scale,
			rndAngleSpan 			: 30,
			branchRndDensity		: 0.1,
			maxRecursionDepth		: maxDepth,
			branchLengthLevelFactor : 0.9,
			branchEndRadiusFactor	: 0.8,
			newBranchRadiusFactor	: 0.6,
			branchReductionFactor	: 0.8,
			branchOpenAngle			: 100,
			endBranchAngleSpan		: 90,
			endBranchLeafAngleSpan	: 100,
			endBranchNbLeaves		: {min : 1 , max : 3},
			intermediateBranches	: {rnd:0.3, height:0,level:0,newLevel: Math.min(maxDepth-1,2)}, 
			youngBranch				: {rnd:0.1, height:0,level:0,newLevel: Math.min(maxDepth-1,2)},
			drawBranchContourLevel	: 0,
			rootEndBranchNb			: {min:2,max:2},
			groundMargin			: 0,
			groups					: opts.groups

		}
		switch( treeType)
		{
			case "Ivy":
				o.isAllLeavesFront = true;
				o.rndAngleSpan = 20; 
				o.branchReductionFactor=0.9;
				o.youngBranch =  {rnd:0.3, height:0,level:0,newLevel:Math.min(maxDepth-1,3)};
				break;
			case "Arbust":
				o.isAllLeavesFront = true;
				o.rndAngleSpan = 5; 
				o.branchOpenAngle=60;
				o.branchReductionFactor=0.9;
				o.youngBranch =  {rnd:0.2, height:0.5,level:0,newLevel:Math.min(maxDepth-1,3)};
				break;
			default : 
				break;
		}
	


		return o;
	}

}
const TreeManager = new TreeManagerClass();



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Plants/Leaf.js?v=1681489318

// Some consts to fasten code
const _hb0=0.57,_hb1=PI*0.5/(1-_hb0)**3;	// herb
		
// LeafManagerClass
class LeafManagerClass extends FactoryManager
{
	constructor()
	{
		super("Leaves")

	
	}
	M_registerLeaves()
	{	let _=this
		_.M_register('default',{profile:_.M_defaultLeafProfile, segments: 20,ratio:0.8})
		_.M_register('Oak',{profile:_.M_oakLeafProfile, invProfile: _.M_mintLeafInvProfile, oakSpikes:12, segments: 60, ratio:.625, centerLine:1})
		_.M_register('Ash',{profile:_.M_ashLeafProfile,organizeFun: _.M_ashOrganize, ashLeaves:4.5,segments:150,ratio:.9,stemRatio:0,centerLine:0})
		_.M_register('Mint',{profile:_.M_mintLeafProfile, segments: 30,ratio:.45})
		_.M_register('Herb',{profile:_.M_herbProfile, segments: 30,ratio:.1})
		_.M_register('Poplar',{profile:_.M_poplarProfile, segments: 30,ratio:.6})
		_.M_register('Ivy',{profile:_.M_ivyLeafProfile, segments: 60,ratio:1,stemRatio:0.5,centerLine:1,growth:.6,setup:(o)=>{let t=o.growth; o.ratio=1*(1.3-0.3*t);o.leafSize*=0.5+0.5*t   } })
		_.M_register('Sunflower',{profile:_.M_elipticLeafProfile/* this.M_falcateLeafProfile*/, segments: 20,ratio:.5,stemRatio:0,centerLine:1})
		EventManager.M_fire("RegisterLeaves",{},A)
	}
	M_createLeafOptions( leafShape)
	{	let _=this
		let shp= _.m_lib.hasOwnProperty(leafShape)?leafShape:"default"
		let leafOpts=_.m_lib[shp];
		leafOpts.shape=leafShape;

		return leafOpts;
	
	}


	// Leaf profiles
	// ------------
	M_mintLeafProfile(t,opt)
	{
	   let x = sin(Math.pow(t,0.7)*PI);
	   x-=sin(t*20*PI)*0.05;
	   return {x: x, y : t};	
	}
	M_defaultLeafProfile(t,opt)
	{
	   let x = sin(Math.pow(t,0.5)*PI);
	   return {x: x, y : t};	
	}
	M_oakLeafProfile(t,opt)
	{
		let x= sin(Math.pow(t,1.4)*PI);
		// wave 
		x-= Math.pow( (1+sin(t*PI*opt.oakSpikes))*0.5,1.9)*x*0.5;
		return {x:x,y:t};	
	}
	M_oakLeafInvProfile(y,opt)
	{
		let t= y;
		let x = sin(Math.pow(t,1.4)*PI);
		x-= Math.pow( (1+sin(t*PI*opt.oakSpikes))*0.5,1.9)*x*0.5;
		return {x:x,t:t};
	}
	M_ivyLeafProfile(t,opt)
	{	const a=0.23;
		let k=10.6; 
		let D= 0.3+(2-0.3)*Math.pow(opt.growth,2);   //1.31;	// 0.72 - 1.73
		let r=0.5*(1+0.2*sin(4.5*Math.pow(t,D)*PI) * (1+0.2*sin(k*t*PI))   );
		let x = sin(t*PI)*r*1.2;
		let y =-a-cos(Math.pow(t,0.36)*PI)*(-a+Math.pow(t,1.1)*0.7*PI)*r;
		return {x: x, y : y};	

	}
	M_falcateLeafProfile(t,opt)
	{
		return {x:sin(t*PI)*2*(1-Math.pow(t,0.2)),y:t};
	}
	M_herbProfile(t,opt)
	{	return {x:cos(Math.max(_hb1*(t-_hb0)**3,-0.99)),y:t};
	}
	M_poplarProfile(t,opt)
	{	const D=0.9,R=0.83
		return {x:R*(1-t**D)*(sin(t*PI))**.5,y:t}
	}
	M_elipticLeafProfile(t,opt)
	{
		return {x:Math.pow(t,0.52)*Math.pow(1-t,0.64),y:t};
	}
	M_ashLeafProfile(t,opt)
	{  
	   let n = opt.ashLeaves
	   ,i=Math.floor(t*n)
	   ,y = i/n
	   ,t1 =(t-y)*n
	   ,t2 = 2* Math.max(0,(t1-0.1)/0.9)
	   
	   ,tt= t2<=1? t2 : 2-t2
	   ,sign = t2<=1? 1 : -1
	   ,ttt=Math.max(0,tt-0.1)/0.9
	   ,x = sign*sin(Math.pow(ttt,0.8)*PI);
	   
	   x-=sign*sin(Math.pow(ttt,1.5)*PI)*0.4;
	   x/=(2*n);
	   if(i==Math.floor(n))
	   {	y+=ttt*0.5;
	   		tt=x;
	   }
	   else
	   		y+=tt*0.3-x; 
	   return {x: tt, y : y- (Math.min(t1-0.1,0)/-0.1-1)/n };	
	}
	// M_drawLeaf
	// Leaf is drawn in the x,y plane
	// bends in the z plane with bendAlpha
	M_drawLeaf(C,MV,opt)
	{	
		if(opt.setup) opt.setup(opt)
		const X0=new ZV3(1,0,0),Y0=new ZV3(0,1,0)

		let _=A
		,wasDeformers = A.m_deformersActive
		//A.m_deformersActive = this.m_isDeformers;	//TODO
		,leafProfile = opt.profile
		,sz = opt.leafSize
		,gs=opt.groups??{}

		// size : sets the ratio x/y 
		,size = new ZV2( sz*opt.ratio, sz)

		// stem length for this leaf
		,stemLength = sz*(opt.stemRatio??0.25)

		,isVisible = A.mdA.iPI(C); 
		if( !isVisible )
			return;

		// nbPoints : number of points on the leaf profile
		let nbPoints = opt.segments??20,
		leafWidth 	= size.x,
		leafLen 	= size.y,
		leafDecal = stemLength,
		Plocal = new ZV3(0,leafDecal,0),
		Pworld=MV._mBV(Plocal),
		O = A.Pj(Pworld,C); // point where leaf starts	( C=point attached to branch)

		
		opt.x=O.x,opt.y=O.y

		// bend alpha : angle of bend 
	   let bendAlpha = (opt.bendAlpha??90)*D2R
	   ,bendR  = abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 1
	   ,noiz = Noz(C.x/A.W*20,4*C.y/A.H)
	   ,bendBeta = -90*Math.max(0.3,abs(noiz))*D2R
	   ,bendRBeta = abs(bendBeta)>0.02 ? leafWidth/bendBeta : 1 
	   ,kProfile = 1./(nbPoints-1)
	   ,L = [new ZPL(),new ZPL()]
	   ,centerLine = new ZPL()
	   ,p,yCenter,zs=[0,0],i,t,dz,x,y,dzBeta,side,sign

		

	   for( i=0; i<nbPoints; i++)
	   {	
		   t = i*kProfile; 
		   p= leafProfile.apply(this,[t,opt]);
		   dz = (1-cos( p.y*bendAlpha))*bendR; 
		   y = bendR*sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 

		   dzBeta = (1-cos( p.x*bendBeta))*bendRBeta; 
		   x = bendRBeta*sin(p.x*bendBeta);

		   for( side=0; side<2; side++)
		   {	
		   		sign = side==0? -1 : 1;
		   		Plocal.M_set( sign*x, y,dz+dzBeta)	// ok
			    Plocal.y += leafDecal; 

			   // P is the point oriented around the flower 
			   Pworld = MV._mBV(Plocal);			   
			   zs[side]+=Pworld.z;
			   L[side]._aP(  A.Pj(Pworld,C ) );
			}
			// center line
			if(yCenter==undefined || y>yCenter)
			{	yCenter=y;
				Plocal.M_set(0,yCenter+leafDecal,dz/*+dzBeta*/)
				Pworld = MV._mBV(Plocal);
				let pProj=A.Pj(Pworld,C );
				pProj.t=t;
				centerLine._aP(pProj);	
			}
		   
	   }
	   
		
	   // Make two shapes with centerLine
	   centerLine.M_reverseOrder();
	   let shapes=[L[0].clone(),L[1].clone()];  
	   for(let i=0;i<2;i++)
	   		shapes[i].M_append(centerLine),shapes[i].sign=(i?1:-1);
	   // reverse depending on side z
	    if(zs[0]<zs[1])	
		{	shapes.reverse();
			L.reverse();
		}

		// Computing the normal and lighting
		let N = MV.mRV(X0.M_cross(Y0)).Nzd(),
		lighting = ((1+N.M_dot(A.m_lightSource))/2)**2,
		lightMax = 1,
		drawContour= 1; //this.m_drawLeafContour ; //opt.drawContour;

		let F0=gs.Leaves,fills=F0.fills;
		// we treat each half separately 
		// This helps masking the distorted parts but causes a jointing problem

		F0.setup??=(_,F,opt)=>{
			let o = MV.mRV(Y0);
			F.orientation= _.M_projectedOrientation(o); // Math.atan2(oProj.y,oProj.x)/D2R;
			F.spacing=  ZMT.M_map( lighting,0.01,lightMax,F.m_spacing.min , F.m_spacing.max);
			F.group = true;

		}

		// Features
		let Lfts=gs.LeavesFeat? opt.getFeats?.call() :0,
		clipOpts = Lfts? _.M_makeClipOBB(shapes)?.clipOpts:0
		// For each side
		for(let i=0;i<2; i++)
		{
			sign=shapes[i].sign
			if(Lfts)
			{	
		
				Lfts.map((L)=>
				{	let Ltrsf=new ZPL()

					Ltrsf.mP=L.mP.map((p)=>{
						dz = (1-cos( p.y*bendAlpha))*bendR; 
						y = bendR*sin(p.y*bendAlpha);
						dzBeta = (1-cos( p.x*bendBeta))*bendRBeta; 
						x = bendRBeta*sin(p.x*bendBeta);
						Plocal.M_set( sign*x, y,dz+dzBeta)
						Plocal.y += leafDecal; 
						Pworld = MV._mBV(Plocal);			   
						return A.Pj(Pworld,C )
					})
					_._DL(gs.LeavesFeat,Ltrsf,1,clipOpts);

				})
			}
			_.M_applyFills(F0,shapes[i]);
			
			if( drawContour)
			{	// but lines are not jointed...
				A._DL(F0,L[i],1);
				if(F0.m_isStrkPrtct) A._DLInMask(L[i],F0.m_strokeWidth/2);
			}
			if( i==0 && opt.centerLine && gs.LeavesFeat)
			{	// limit size of centerLine
				let limit=0.8,nb=centerLine.M_nb(),iRemove=0;
				for(let il=0;il<nb; il++)
				{	if(centerLine.mP[il].t>limit)
						++iRemove;
					else break;
				}
				if(iRemove) centerLine.mP.splice(0,iRemove);
				_._DL(gs.LeavesFeat,centerLine,true);
			}
			if(!opt.noMask)
				_._dM(shapes[i],{protect:0});

		}
	   
		// stem
		if(stemLength>=1 && gs.Stem)
		{	Plocal.M_set(0,0,0);
			Pworld = MV._mBV(Plocal);	 
			let O0 = A.Pj(Pworld,C)
			
			A._DL(gs.Stem,new ZL(O0,O),1);
		}

		A.m_deformersActive = wasDeformers;

	}




	// M_drawLeaf_old
	M_drawLeaf_old(C,MV,opt)
	{	
		let wasDeformers = A.m_deformersActive;
		//A.m_deformersActive = this.m_isDeformers;	//TODO
		let openAmount = 0;							// TEMP
		let leafProfile = opt.profile;
		
		//var spaceOrientation = this.m_leafSpaceOrientation.func.apply(this,[C.x,C.y,this.m_leafSpaceOrientation.config] );
		//var spaceOrientation = 20;
		//MV.M_rotate(spaceOrientation,1,0,0);			// rotate in the direction of the viewer


		// leaf scale
		
		//var sz = this.m_leafSize.func.apply(this,[C.x,C.y,this.m_leafSize.config] );
		var sz = opt.leafSize;

		// size : sets the ratio x/y 
		var size = new ZV2( sz*opt.ratio, sz);

		// stem length for this leaf
		var stemLength = sz*(opt.stemRatio!=undefined?opt.stemRatio:0.25);

		let isVisible = A.mdA.iPI(C); 
		if( isVisible )
		{
		
		}
		else
			return;

		// nbPoints : number of points on the leaf profile
		let nbPoints = opt.segments;

	


		let leafWidth 	= size.x*0.5;
		let leafLen 	= size.y; 



	   let Plocal = new ZV3() 
	   let P = new ZV2(); 

		// bend alpha : angle of bend 
	   let bendAlpha = (opt.bendAlpha??90)*D2R;
	   let bendR  = abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 1;
	   let noiz = Noz(C.x/A.W*20,4*C.y/A.H);
	   let bendBeta = -90*Math.max(0.3,abs(noiz))*D2R;
	   let bendRBeta = abs(bendBeta)>0.02 ? leafWidth/bendBeta : 1 
	   var kProfile = 1./(nbPoints-1);
	   let leafDecal = stemLength;
	   let L = [new ZPL(),new ZPL()]; 
	   var p;
	   for( let i=0; i<nbPoints; i++)
	   {	
		   let t = i*kProfile; 
		   p= leafProfile.apply(this,[t,opt]);
		   let dz = (1-cos( p.y*bendAlpha))*bendR; 
		   let y = bendR*sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 

		   let dzBeta = (1-cos( p.x*bendBeta))*bendRBeta; 
		   let x = bendRBeta*sin(p.x*bendBeta);

		   for( let side=0; side<2; side++)
		   {	
		   		let sign = side==0? -1 : 1;
		   		Plocal.M_set( sign*x, y,dz+dzBeta)	// ok
			    Plocal.y += leafDecal; 

			   // P is the point oriented around the flower 
			   let Pworld = MV._mBV(Plocal);			   
			   
			   L[side]._aP(  A.Pj(Pworld,C ) );
			}	   
		   
	   }
	   // stem junction point
	   Plocal.M_set(0,leafDecal,0);
	   let Pworld = MV._mBV(Plocal);
	   let O = A.Pj(Pworld,C); //new ZV2(Pworld.x,-Pworld.y + Pworld.z*this.m_perspectiveFactor);				
		//O.M_add(C);
		
	   // centerLine
	   let centerLs = null;
	   if( opt.centerLine && p && p.y>0 && opt.groups.LeavesFeat)
	   {	
			let strk = 0;	// opt.groups.LeavesFeat.strokeWidth;	// attempt to array of center lines
			
			centerLs??=[];
			
			let segLen = 1*A.u/leafLen;
			let lineLen = 0.8*p.y;
			let nb  = lineLen/segLen;
			let xMax=strk>0 ? leafWidth/2:0;
			let xStep=strk>0? xMax/(strk*1.5):1;
			for( let x=0; x<=xMax; x+=xStep)
			{	let centerL = new ZPL();
				centerLs.push(centerL);
				let y = 0;
				for( let i=0; i<=nb; i++)
				{
					let dz = (1-cos( y*bendAlpha))*bendR; 
					let dy = bendR*sin(y*bendAlpha);

					Plocal.M_set( x*(0.2+0.8*y), dy,dz)
					Plocal.y += leafDecal; 
					let Pworld = MV._mBV(Plocal);			   
					centerL._aP( A.Pj(Pworld,C));
													
					y+=segLen;
				}  
			}
	   }

		
	   // joint lines
	   let p2;
	   while(p2=L[1].mP.pop())
	   {	L[0]._aP(p2);						
	   }
	   var pathPoints = L[0]._gS(true);


		// Computing the normal and lighting
		let N = MV.mRV((new ZV3(1,0,0)).M_cross( new ZV3(0,1,0))).Nzd(); 
		let lighting = (1+N.M_dot(A.m_lightSource))*0.5;
		lighting*=lighting;
		let lightMax = 1; 
		

		let drawContour = true; //this.m_drawLeafContour ; //opt.drawContour;

		let fills = opt.groups.Leaves.fills;
		if( Array.isArray(fills) )
		{
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];
				if( F && F.m_active && lighting<=lightMax)
				{	
					let o = MV.mRV(new ZV3(0,1,0) );
					//let oProj = new ZV2(o.x, -o.y + o.z*this.m_perspectiveFactor);  
					//F.leaves = {...opt};
					F.orientation= A.M_projectedOrientation(o); // Math.atan2(oProj.y,oProj.x)/D2R;
					F.spacing=  ZMT.M_map( lighting,0.01,lightMax,F.m_spacing.min , F.m_spacing.max);
					//console.log("N="+N.M_getString()+" lighting="+lighting+" spacing="+F.spacing);
					//F.jointEnds=true;
					F.group = true;
					//F.m_lines.push( ...this.M_hatchShape( L[0] ,F)); 
					A._Fl(F,L[0],F);
				}
			}	
		}
		else 
			drawContour = true;

	   // Draw the contour lines
	   if(drawContour)
			A._DL(opt.groups.Leaves,L[0],true);
		if( centerLs)
		{	for( let i=0;i<centerLs.length; i++)
				A._DL(opt.groups.LeavesFeat,centerLs[i],true);
		}

		// draw the leaf in the mask
		var path = new Path2D(pathPoints);
		if(A.m_mask)
		{	
			var context = A.m_mask._X();			
			context.fillStyle = "white";
			context.fill(path);
		}	

		// stem
		if(stemLength>=1 && opt.groups.Stem)
			A._DL(opt.groups.Stem,new ZL(C,O),true);
		

		A.m_deformersActive = wasDeformers;

	}

	// C
	// height
	// width
	// yRotation
	// torsion { start, end}	// degrees
	// opt.sample ( optional)
	//		.seg
	//		.start
	//		.end
	


	M_getStem(opt)
	{
		//console.log(`M_getStem(${RQPrintR(opt,2)})`)
		let log=opt.log;
		let C 		= opt.C ?? new ZV2(0,0);
		let segLen	= opt.seg ?? 10;
		let hasSamp	= opt.samples && opt.samples.seg , sampStart;
		let stemLength = opt.height;
		let nextSamp,sampStop
		//let distort=opt.distort??1; 
		if(hasSamp)
		{	opt.samples.seg??=segLen*2;
			segLen=Math.min(segLen,0.5*opt.samples.seg);
			nextSamp=opt.samples.start??0;
			sampStop = opt.samples.end??stemLength;
		}
		let hasWidth= (opt.width||opt.widthFunc)?true:false,e=0;
		if( hasWidth)
		{	e= opt.widthFunc ?? ( opt.endWidth? ((l)=>opt.width+(opt.endWidth-opt.width)*l/stemLength): ((l)=>opt.width));
		}
		// base rotation around y
		let MV 		= new RQMatrix4();		// imagine it could be an input
		let yRotation = opt.yRotation??0;
		if(yRotation)	MV.M_rotate(yRotation,0,1,0);
		


		// curve sampling 
		var dirChange = (opt.torsion.end-opt.torsion.start) / (stemLength/segLen); 
		let samples=[];

		// start torsion
		MV.M_rotate(opt.torsion.start,0,0,1);
		let uY=new ZV3(0,1,0);
		let P=new ZV3(0,0,0);
		let curve0=new ZPL();
		let curveLeft,curveRight;
		let I,J,K;
		const Y0 = new ZV3(0,1,0);
		const X0 = new ZV3(1,0,0);
		
		if(hasWidth)
		{	curveLeft=new ZPL();
			curveRight=new ZPL();
		}
		let endSample=null;

		for( let l=0; l<=stemLength;  )
		{
			let pProj = A.Pj(P,C),
			isEnd = l==stemLength;
			if(hasWidth||hasSamp||isEnd)
			{	J = MV._mBV(Y0);
				K = X0.M_cross(J).Nz();
				I = J.M_cross(K);
				
			}
			let e_=e(l)/2;
			if(log){ console.log(`e_=${e_}`); }
			if(hasWidth)
			{	let pRight = A.Pj(P.M_plus(e_*I.x,e_*I.y,0),C),
				pLeft = A.Pj(P.M_plus(-e_*I.x,-e_*I.y,0),C);
				curveLeft._aP(pLeft);
				curveRight._aP(pRight);
			}
			curve0._aP( pProj);

			// Generate sample
			if(hasSamp)
			{	if(l>=nextSamp && l<=sampStop)
				{	samples.push( { P:P.clone(), pProj:pProj, r:e_,l:l,kl:l/stemLength, I:I.clone(),J:J.clone(), MV:MV.clone() });
					nextSamp+=opt.samples.seg;
				}
			}

			// avance on the curve
			MV.M_rotate(dirChange,0,0,1);
			let lStep =segLen;
			if( l<stemLength && (l+segLen)>=stemLength)
			{	lStep=stemLength-l;
			}		
			l+=lStep;
			if(l<=stemLength)
			{
				P.M_add( MV.mRV(uY)._mB(lStep));
			}
			else	// end point : generate end sample
			{
				endSample={P:P, pProj:pProj,l:stemLength, I:I,J:J, MV:MV}	
			}
		}
		let out = {lines:[],end:curve0.M_endPoint(),isForwardFacing:sin(yRotation*D2R)>=0};
		if(endSample)
			out.endSample = endSample;
		if(hasWidth)
		{	curveRight.M_reverseOrder();
			if(!opt.endClose)
				out.lines.push(curveLeft,curveRight);
			out.shape=curveLeft.clone();
			out.shape.M_append(curveRight);
			if(opt.endClose)
				out.lines.push(out.shape.clone());
			out.shape.M_closePath();
		}
		else 
		{	out.lines.push(curve0);
		}
		if(samples)
		{	out.samples=samples;

		}
		return out;
	}
	
	// ---------------------------------------------
	// M_drawStem()
	// Draws a stem (result of M_getStem) with optional leaf options
	// opts
	//  	leaf		: leaf options from M_createLeafOptions
	//		groupStem	: group + fills for the stem
	// ---------------------------------------------
	M_drawStem(stem,opts,C)
	{
		if( !stem )
			return;
		let _=A;

		let drawLeaf = (sample)=>{
			
			if(sample.B) _.M_drawDebugBasis(sample.B,sample.pProj,{mask:true,l:10*_.u});
			if(opts.leafSizeFunc) { opts.leaf.leafSize = opts.leafSizeFunc(sample.kl); }
			this.M_drawLeaf(sample.pProj,sample.MV, opts.leaf);
		}

		// Organize the samples for leaves
		let hasLeaves=false;
		if(stem.samples && opts.leaf)
		{
			const X0=new ZV3(1,0,0);
			const Z0=new ZV3(0,0,1);
			const Y1=new ZV3(0,1,0);
			const Z1=new ZV3(0,0,1);
			let angleStart = opts.angleStart??0;
			let angleDecal = opts.angleDecal??100;
			let angle=90+angleStart;
			for(let i=0; i<stem.samples.length; i++)
			{	
				hasLeaves=true;
				let sample  =stem.samples[i];
				sample.MV??=new RQMatrix4();			
				sample.MV.M_rotate(angle,0,1,0);
				
				// decal in the z direction
				sample.MV.M_translate(0,0,sample.r);
				
				// open leaf
				sample.MV.M_rotate( opts.openAmount??45,1,0,0);
				
				angle+=angleDecal;

				// compute z and isFront parameter
				//let P1=sample.MV.mRV(Y1);
				sample.isFront = sample.MV.M_getRotateZ(Y1) >0; 
				//console.log(`P1=${P1.M_getString()} eye=${_.m_toEyeVector.M_getString()} isFront=${sample.isFront}`);
				//sample.z= sample.P.M_plus(P1).z;

				// project on eyeVector to get a distance = dist to obj origin in eye direction. Greatest =closer to eye
				//sample.dEye = _.m_toEyeVector.M_dot(sample.P.M_plus(P1));		// not sure
				sample.sort = sample.l;

				// Basis/Debug
				if(false)
				{	let Y0=new ZV3(0,1,0), Z0=new ZV3(0,0,1);
					let B = { O:new ZV3(),
					I: sample.MV.mRV(X0),
					J: sample.MV.mRV(Y0),
					K: sample.MV.mRV(Z0)};
					sample.B=B;
				}else sample.B=0
	
			}
			//stem.samples.sort((a,b)=>a.z<b.z?1:-1 );
			stem.samples.sort((a,b)=>a.sort<b.sort?1:-1 );
			
		}

		// Draw front leaves
		if(hasLeaves)
		{
			for(let i=0; i<stem.samples.length; i++)
			{	let sample  =stem.samples[i];
				if(sample.isFront)
				{	drawLeaf(sample);
				}
			}
		}

		// draw the stem
		// ---------------
		if( opts.groupStem && stem.lines)
		{
			for( let il=0; il<stem.lines.length; il++)
			{	//this._g.MintStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
				_._DL(opts.groupStem ,stem.lines[il],true) 

			}
			// fill the stem
			if( stem.shape)
			{
				let Fs,F;
				if( Array.isArray(Fs=opts.groupStem.fills))
				{
					for( let f=0; f<Fs.length; f++)
					{
						if( (F=Fs[f]) && F.m_active)
						{	F.spacing=F.m_spacing.min;
							_._Fl(F,stem.shape,F); 
						
						}
					}
				}
			}
		}
		// draw the stem in mask
		if( stem.shape)
		{	_._dM(stem.shape);
		}
		
		// Draw back leaves
		if(hasLeaves)
		{
			for(let i=0; i<stem.samples.length; i++)
			{	let sample  =stem.samples[i];
				if(!sample.isFront)
				{	drawLeaf(sample)

				}
			}
		}
		


	}

};


const LeafManager = new LeafManagerClass();
EventManager.M_on("VariablesSet",function(v){
	LeafManager.M_registerLeaves()
})



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/Backgrounds.js?v=1681489318

class BackgroundMngr extends FactoryManager
{
    constructor()
    {
        super("Backgrounds");
    }
}
const Backgrounds = new BackgroundMngr();


class BgndA extends FactoryInstance
{
    constructor(n){super(n); this.m_isPrinted=false}
    init(_)
    {
        let S=this;
        S.m_kStart=S.gF("kStart",1);
        S.m_tag=S.M_get("tag");
        return S.m_isActive=S.gB("activate",0);        
    }
    
    M_drawOnce(_)
    {   if(this.m_isActive && !this.m_isPrinted)
        {   
            A.m_deformersActive = this.m_isDeformers? A.m_deformer = this.m_distortion?? (_.m_distortions?_.m_distortions[0]:null) : A.m_deformer=null;		
            this.m_isPrinted=1,EventManager.M_fire("bgDraw",{S:this},_),this.M_draw(_);
            return 1
        }
    }
}
// GRADIENT
// -----------

class BgndGradient extends BgndA
{
    constructor(n){super(n)}
    static create(n){ return new BgndGradient(n);}
    M_init(_)
    {   let S=this;
        if(S.init(_))
        {   
            S.m_gradient = new RQColor(S.M_get("css","linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);"))
            S.m_isFM=S.gB("isFull")
        }
    }
    M_draw(_)
    {
        let S=this,o=_._o;
        if(_.m_outputFormat=="PNG" && o)
        {   let ctx = o._X(),i=S.m_isFM,
            wa = i?_.mdA.M_inset(-_.m_externalMargin/_.m_pngUpscale) : _.mwA, 
            gradient= S.m_gradient.M_toContext(ctx,wa),
            lines = wa._cP()._gS(),
            path = new Path2D(lines);
            if(i)_.M_resetClipping(1)
            A.mH.push({m:"fill",c:gradient,path:path,l:lines});
            ctx.fill(path);
            if(i)_.M_clipToWorkArea(1)

        }

    }
};
Backgrounds.M_register("BackgroundGradient",{ factory:BgndGradient.create})


// ART INCLUDE
// -----------
class BgndArt extends BgndA
{
    constructor(n){super(n)}
    static create(n){ return new BgndArt(n);}
    M_init(_)
    {   let S=this;
        if(S.init(_))
            _.M_includeArtwork(S,S._V.artwork);
        
    }
    async M_draw(_)
    {
        let S=this;
        if(S.A)
        {
            S.A.M_initOuputImage();			// will reset the clipping zone of the output canvas
            await S.A.M_startAlgorithm();
        }
    }
};
Backgrounds.M_register("BackgroundArt",{ factory:BgndArt.create})

// TEXTURE / GRAIN
// -----------
class BgndTexture extends BgndA
{
    constructor(n){super(n)}
    static create(n){ return new BgndTexture(n);}
    M_init(_)
    {   let S=this;
        if(S.init(_))
        {   S.ampl=S.gI("ampl",30);
            S.type=S.M_get("type","grain");
            S.hsamp=S.gI("hsamp",100)
            let stack = (S.isFront=S.gB("isFront",false))?_.m_fgFilters : _.m_bgFilters;
            if(!S.isFront)
                stack.push( {f:S.M_drawGrain,ctx:S})
            S.clip=S.M_get("clip",'-');
        }
        
    }
    M_draw(_)
    {   let S=this;
        if(S.m_kStart<1 && S.isFront)
        {
            _.mH.push( {m:'func',f:S.M_drawGrain,ctx:S})
            //S.M_drawGrain(_);
        }
    }
    M_drawGrain(_)
    {   
        let S=this,O=S.m_tex??_._o;
        if(O)
        {   let ctx=O._X();
            //ctx.restore();
            
            if(_.m_isMainAlgorithm && S.ampl>0)
            {	let reclip;
                if(S.clip=='-')
                    _.M_resetClipping(),reclip=1

                S.rnd??=ZMT.newRnd(1,"drawGrain");
                let ang=45;         // TEMP
                let rThres=0.3??0.3;     // rnd threshold (above = random noise)
                let typeCv= S.type=='canvas'? S.hsamp/10|0 :0
                let ca=cos(ang),sa=sin(ang)
                let noiseFunc=(x,y,w,h)=>Noz(x/w*40,y/2+0*x/120)   // default
                //noiseFunc=(x,y,w,h)=>Noz(x/w,y/h)
                // Fast texturing paper background
                let scale = _.m_pngUpscale;
                let shift=S.hsamp, W=O.m_width+2*shift,H=shift,w=W*4,int=S.ampl,k=1, nbH=O.m_height/H
                let a=_.M_getPaperArrayRGBA();
                if(!S.bgID)
                {	let id=S.bgID=new ImageData(W,H);
                    for(let t=0;t<id.data.length;t+=4)
                    {   k=S.rnd();
                        let x=(t%w)/4,y=t/w|0
                        let rnd= k>rThres?2*(k-0.5):noiseFunc(x,y,w,O.m_height)
                        
                        // Canvas
                        if(typeCv){ 
                            x+=5*noiseFunc(0,((y)%typeCv),1/20,0)|0
                            
                            let n=(y+x)/typeCv |0;  // alternate
                            if( (x%typeCv)<=2 && (y%typeCv)<=2)
                            { if((n%2)==0) rnd=((x%typeCv)<=1?1:-1)* 1.5*abs(rnd);
                              else rnd=((y%typeCv)<=1?1:-1)* 1.5*abs(rnd);
                            }
                            else if((y%typeCv)<=1 || (x%typeCv)<=1 ) rnd=1.5*abs(rnd)       // white
                            else if((y%typeCv)==2 || (x%typeCv)==2) rnd=-1.5*abs(rnd); // black
                        }
                        //if(1) if( y<5 && (x%100)<50) rnd = -1; // Show dash

                        // Noise : 40 units fixed on x 
                        // y/2  = 0.5 * height of sample units on y 
                        if(!S.isFront)
                        {
                            for(let n=0;n<3;n++)id.data[t+n]= a[n]+int*rnd;
                            id.data[t+3]=255;
                        }
                        else
                        {   
                            for(let n=0;n<3;n++)id.data[t+n]=rnd>0.7?255:0;
                            if(rnd<0) rnd=-rnd;
                            id.data[t+3]=rnd*S.ampl*2;

                        }
                    }
                    if(S.isFront)
                    {
                        let c = document.createElement('canvas');
                        var ctx2 = c.getContext('2d');
                        c.width = id.width;
                        c.height = id.height;
                        ctx2.putImageData(id, 0, 0);
                        S.bgIDCanvas=c;
                        
                    }
                }
                let margin=_.m_externalMargin/_.m_pngUpscale;
                k=1.302939490309*8E4;
                for(let y=0; y<O.m_height; y+=H)
                {   let x=-shift+(shift*cos(y/O.m_height*k)|0);
                    if(typeCv) x-=x%typeCv
                    if(S.bgIDCanvas)
                        ctx.drawImage(S.bgIDCanvas, -margin+x/_.m_pngUpscale,-margin+y/_.m_pngUpscale, S.bgIDCanvas.width/_.m_pngUpscale,S.bgIDCanvas.height/_.m_pngUpscale);	
                    else
                        ctx.putImageData(S.bgID,x,y);
                }
                if(reclip)
                    _.M_clipToWorkArea(1)

            }
        }

    }
};
Backgrounds.M_register("BackgroundTexture",{ factory:BgndTexture.create})


// IMAGE
// -----------
class BgndImage extends BgndA
{
    constructor(n){super(n)}
    M_init(_)
    {   let S=this;
        if(S.init(_))
        {   let stack = (S.isFront=S.gB("isFront",false))?_.m_fgFilters : _.m_bgFilters;
            stack.push( {ctx:S,f:S.M_drawTexture});
        }
        
    }
    M_draw(_){}
    M_drawTexture(_)
    {
        let tex = _.M_getTexture(this.M_get("texture"));
        let O = _._o;
        if( tex && O)
        {
            let ctx=O._X();
            ctx.drawImage(tex.m_canvas, 0, 0,_.W, _.H);
        }
    }

};
Backgrounds.M_register("BackgroundImage",{ factory:(n)=>new BgndImage(n)})


// SKY / LIB 
// -------------------
class BgndLib extends BgndA
{
    constructor(n){super(n)}
    static create(n){ return new BgndLib(n);}
    M_init(_)
    {   let S=this,u=_.u;
        S.init(_)

        let fc=S.m_bgFunc=S.M_get("bgFunc");
        S.m_strokeColor=S.M_get("strokeColor","rgba(0,0,0,0.5)");   // Not sure here
        S.m_orientation = S.gF("orientation",0);
        S.m_yStart = S.gF("yStart",0.7);
        S.m_spacing = S.gF("spacing",{min:0.3,max:2.5});
        S.m_strokeMask = (S.gF("strokeMask",0)??0)*u;
        S.m_wavelength = S.gF("wavelength",{min:30,max:100});
        S.m_ampl=S.gF("ampl",1)*u;
        S.M_readPlugins(_);        
        S.M_declareGroup(_,fc);
        switch(fc)
        {   case "Sun":
            {   S.M_declareGroup(_,"SunC")
                let sunC=S.m_center??{x:0.6,y:0.6},
                r=S.m_radius??{min:0,max:-1},
                wa=_.mwA,hyp=Math.hypot
                S.sunC =new ZV2(wa.x+wa.w*sunC.x,wa.y+wa.h*(1-sunC.y))
                S.sunR= {max:r.max>r.min? r.max*u :  Math.max( hyp(wa.w*sunC.x,wa.h*sunC.y), hyp((1-sunC.x)*wa.w,sunC.y*wa.h)), min:r.min*u}
            }   
            break;

        }
        S.M_readGroups(_);


    }
    M_readPlugins(_)
    {   let gps = this.gPk("addons",["BackgSun"],true);
        for(let ia=0; ia<gps.length; ia++)
        {	let S = gps[ia]
            if(S.m_name=="BackgSun")
            {   this.m_center = S.gF("center");
                // compute sun center 
                //let wa=_.mwA;
                //let center =new ZV2(wa.x+wa.w*this.m_center.x,wa.y+wa.h*(1-this.m_center.y));

                this.m_radius=S.gF("radius");
                //console.log(`SUN radius = ${RQPrintR(this.m_radius)} `);
                this.m_isMaskSun=S.gB("isMaskSun")
            }
        }    
    }
    
    M_draw(_)
    {   let S=this,u=_.u,kh=1-(S.m_yStart??0),r=new ZRc(0,0,_.W,kh*_.H),wl=S.m_wavelength,fc=S.m_bgFunc, F=S._g[fc]
        S.m_spacing??={min:0.4,max:2.5}
        S.m_ampl??=1*u;
        S.applyDistortion()
        let stepScale=1; 
        let H={
            m_amplitude		:S.m_ampl,
            m_wavelength	:{min:wl.min*u,max:wl.max*u},
            obbMargin		:3*u+_.m_strokeWidth,    
            spacing			: 1*u,
            protect			: 0*u,
            jointEnds		: 0,        // TODO : parameters
            alternate       : 1,
            m_strokeWidth   : _.m_strokeWidth??5,   // TODO
            strokeMask      :S.m_strokeMask??0,

            spacingFunc 	: 	(OBB,x,opt)=>
                {	let k=1-x/OBB.w;
                    return ((S.m_spacing.min*k +S.m_spacing.max*(1-k))*u)/stepScale;	
                
                }
        }
        switch(fc){
            case "Sun":
            {   let o=S.m_orientation??0
                let getCirc=(r)=>{
                    return new RQCircle(S.sunC.x,S.sunC.y,r)._cP(-1,_.printMm(0.5),o);
                }
                if(S.sunR.min)
                {   let L=getCirc(S.sunR.min),F2=S._g["SunC"]
                    if(F2.isSet)
                        _._DL(F2,L);
                    _.M_applyFills(S._g.Sun,L)
                    if(S.m_isMaskSun) _._dM(L)
                    
                } 
                H.hatchFunc=function(OBB, x ,opts){  stepScale = (S.sunR.max-S.sunR.min)/OBB.w;  let sunr= S.sunR.min+(x+OBB.w/2)*stepScale; return getCirc(sunr);}.bind(_);
            }
            break;
            case "Cloud":
                H.hatchFunc=_.M_hatchFuncCloudLines;
                H.m_modulation = {amplitude:S.m_ampl,noiseFact:2};
                H.m_maskFill=true;
                H.m_groundCut=-1;
                H.m_step=0.05*u; // TEMP
                H.m_perturbation = {func:_.M_functionNoise,config:{min:0,max:1,isCustomNoise:true,noiseFact:{x:3,y:5},shift:{x:0,y:0},centricScale:{x:1,y:1}}}
                H.orientation= (S.m_orientation??0)-90;
                 break;
            case "Rain":
            {   S.rnd=ZMT.newRnd(1);
                H.distrFunc=HatchGridDistr.bind(_)
                H.hatchFunc=HatchGrid.bind(_)
                let spcFunc = (x,y,conf)=>u*rndRange(S.m_spacing,()=>y/_.H);
                H.m_spacing = {func:spcFunc,config:{min:0,max:1}}
                H.grid={x:10*u,y:10*u}
                H.m={x:0,y:1-S.gF("ampl",1)}
                console.log(`H.m=${RQPrintR(H.m)}`);
                H.orientation= (S.m_orientation??0);
                H.xMax= H.grid.x-H.m.x;
                
                break;
            }
            default :
                H.hatchFunc=_.M_hatchFuncSine;
                H.orientation= 90+(S.m_orientation??0)
                break;
        }
        _._Fl(F,r._cP(),H);

    }

    
}
Backgrounds.M_register("BackgroundLib",{ factory:BgndLib.create})
// ----- 
// HATCH
// -----
class BgndHatch extends BgndA
{
    constructor(n){super(n)}
    M_init(_)
    {   let S=this;
        S.init(_);

        S.m_z = S.gF("zone",{x:0,y:0,w:1,h:1});
        let sh="shape",cstm=S.gO(sh,'custm'),nm=S.m_shpNm = cstm?cstm:S.M_get(sh)
        S.m_isDeformers=1;
        S.M_readPlugins(_);        
        S.M_declareGroups(_);
        S.M_readGroups(_);

    }
    M_readPlugins(_){}
    M_declareGroups(_)
    {    this.M_declareGroup(_,"Hatch");
    }
    M_isSqRatio()
    {   return ['Circle','Square'].includes(this.m_shpNm);
    }
    M_getZone(_)
    {   
        let S=this,wa=_.mwA
        if(S.M_isSqRatio())
            S.m_z.h=S.m_z.w/_.mwA.h*_.mwA.w;
        return new ZRc(wa.x+S.m_z.x*wa.w, wa.y+wa.h*(1-S.m_z.h-S.m_z.y),S.m_z.w*wa.w,S.m_z.h*wa.h)
    }
    M_draw(_)
    {   let S=this,
        r=S.M_getZone(_),
        L=S.M_toPolyline(_,r,S.m_shpNm),F = S._g.Hatch
        
        S.applyDistortion()
        if(F.isSet)
            _._DL(F,L,true);

        _.M_applyFills(F,L);
        if(S.gB("isMaskZone",0))
        {  let Ls=isArr(L)?L:[L]
            Ls.map((L)=>_._dM(L))
        }
        
    }
    M_toPolyline(_,zone,nm)
    {   switch(nm)
        {   case "Rectangle":
            default:
                return zone._cP();
            case "Ellipse":
            case "Circle":
            {   let c= RQCircle.createWithRect(zone);
                return c._cP(this.gO("shape","sides",-1)|0,_.printMm(2));
            }
        }
    }

    
}
Backgrounds.M_register("BackgroundHatch",{ factory:(n)=>new BgndHatch(n)})



// FUNC
// -----------

class BgndFunc extends BgndA
{
    constructor(n){super(n)}
    static create(n){ return new BgndFunc(n);}
    M_init(_)
    {   let S=this;
        S.init(_)
           
        S.funcName=S.M_get("func");
        
        S.M_declareGroups(_);
        S.M_readGroups(_);

    }  
    M_declareGroups(_)
    {    this.M_declareGroup(_,"group1");
    }

    async M_draw(_)
    {   let S=this
        if(S.funcName)
        {   let fn=S[S.funcName];
            if(fn)
            {   await fn.call(S,_)
            }
        }
    }
};
Backgrounds.M_register("BackgroundFunc",{ factory:BgndFunc.create})




//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/Silhouettes.js?v=1681489318

class Silhouette extends BgndA
{
    constructor(name)
    {
        super(name);
		this.gpNames=["Faces","Contour","Lines","InRound","OutRound"]
    }
    M_init(_)
    {
		let S=this
		// Declare groups
        S.init(_)
		S.gpNames.map(n=>S.M_declareGroup(_,n))
        S.M_readGroups(_);


    }
    M_draw(_)
    {
        let S=this,u=_.u
        let tex = _.M_getTexture(this.M_get("texture"));
        let O = _._o;
        if( tex && O)
        {
            let ctx=O._X();
            if(false)
                ctx.drawImage(tex.m_canvas, 0, 0,_.W, _.H);

            _.m_currSilhouette=S;

            S.random=ZMT.newRnd(2)
            // S.m_image = the image
            // Make a pattern and clip it, get the lines and points, then make a Delaunay with it
            // How ? 
            let innerWA = _.mwA.clone(); innerWA.M_inset(1);
            let shape = _.mdA._cP();
            let gFigLines= S._g[`Lines`];
            let gFigContour=S._g[`Contour`];
            let gFigFaces= S._g[`Faces`];
            let gFigOutRound = S._g[`OutRound`]
            let gFigInRound = S._g[`InRound`]
            
            let isOutMesh=false;
            
            let _1mm=_.printMm(0.3)

            S.FigAABB=new ZRc();

            gFigFaces.setup=(_,F,o)=>{
                F.alternate=false;
                F.orientation=S.random()*360;
            }

            // Setup
            
            // Make a simple hatch pattern ( parallel lines by default )
            // and run it through intersection with the mask to get a set of points around the perimeter of the silhouette
            // We run the algorithm twice with 2 different orientations. We will get intersection points on the top and bottom,
            // then points on the left and right sides of the silhouette. 
            let Ls=[],spacing=[u,u]
            let angles=[5,-80]
            let thres=40
            let isCompressFaces=S.gB("isPackFaces");
            let isFindPinkPoints=true;
            let isAddCenterPoints=true;
            let removeAdjEdges=true;

            let _wa=_.mwA.clone();
            let _ca=_.m_clipArea.clone();
            
            // Run the Hatch lines to sample contour
            _.mwA=_.m_clipArea=_.mdA.clone();
            angles.map((o,i)=>Ls.push(..._.M_hatchShape(shape,{clipImage:tex.m_canvas, spacing:spacing[i],mask:0,orientation:o,thres:thres,thresRed:1})))
            
            _.mwA = _wa;
            _.m_clipArea = _wa;
            
            // Get the points (and optionally make a few more to complexify our set)
            let points=[];
            if(Ls)
            {   
                let pushPoint=(p)=>{
                    if( innerWA.iPI(p))
                        points.push(p);
                }
                for(let i=0; i<Ls.length; i++)
                {   let a=Ls[i].first(), b=Ls[i].last();
                    pushPoint(a);
                    pushPoint(b);

                    // center point
                    if(isAddCenterPoints)
                    {
                        let U=b.M_minus(a);
                        if(U.M_length()>3*u )
                            pushPoint( a.M_plusU(U,0.2))
                    }
                }
            }
            // Find additionnal points in image 
            // the B&W silhouette has little pink spots that we need to locate to add some points of interest in the picture
            // Those additional points will refine the details of the character 
            if( isFindPinkPoints)
            {   let pts=_.M_findPoints(tex);
                pts.map((blob)=>{if(blob.g){_._DL(S._g[`Lines`],(new RQCircle(blob.g.x,blob.g.y,blog.g.r))._cP(-1,_1mm))}})
                              
                points.push(...pts)
            }
            // Make a Delaunay : will compute a triangle mesh out of a set of points
            let flatPoints = [];
            for( let i=0; i<points.length; i++)
            {	
                let p = points[i];
                flatPoints.push(p.x,p.y);
            }
            let d = new Delaunator(flatPoints);
            let tri = d.triangles;
            //
            let n = tri.length;
            
            let edges=[],edgesOut=[],faces=[],barys=[];
            let addEdge = (edge,out)=>{
                    let es=out?edgesOut:edges;
                    for(let i=0; i<es.length; i++)
                    {   let e=es[i];
                        if((e.a==edge.a && e.b==edge.b)||(e.a==edge.b && e.b==edge.a))
                        {   e.in=1;
                            //if(!out) console.log(`found edge ${i}${e.isPink?" - isPink=1":""}`);
                            return e
                        }
                    } 
                    edge.line=new ZL(points[edge.a].clone(), points[edge.b].clone())
                    edge.isPink =points[edge.a].r && points[edge.b].r;
                    edge.in=0;
                    es.push( edge) 
                    return edge;
                }
            let findIndexOfEdge=(face,a,b)=>{
                let nbP = face.M_nb()
                for( let k=0; k<nbP; k++)
                {   let p1=face.M_getPoint(k), p2=face.M_getPoint((k+1)%nbP)
                    if( (p1.index==a && p2.index==b ) || (p1.index==b && p2.index==a ))
                        return k
                }
                return -1;
            }
                
            // For each triangle of the mesh
            for( let i=0; i<n; i+=3)
            {	
                //console.group(`face id=${i/3}`)
                //let shape = new ZPL( [ points[ tri[i] ].clone(), points[ tri[i+1] ].clone(), points[ tri[i+2]].clone() ] );
                
                // Create shape = triangle polyline
                let shape = new ZPL( [ points[ tri[i] ], points[ tri[i+1] ], points[ tri[i+2]] ] );
                
                // Reference each point by its index = [point].index
                for( let j=0; j<3;j++)
                    shape.M_getPoint(j).index=tri[i+j];
                
                // test if barycenter inside mask
                // c.isIn==true => triangle inside of the shape 
                let minC=shape.M_getMinCircle(), c=minC.C;
                c.inclR=minC.r;
                c.isIn = tex.M_getPixelIntensity((c.x/_.W*tex.m_width)|0,(c.y/_.H*tex.m_height)|0) >0.1;
                
                
                // Add each of the 3 edges of the triangle
                // if an edge already exists, it will have .in == 1 , that means it's an adjacent edge
                // Inside triangles and outside triangles are stored on two separate lists, 
                // so the edges on the contour of the shape will NOT have .in=1
                let edges3=[];
                for( let j=0; j<3;j++)
                {
                    // extend aabb
                    let p= shape.M_getPoint(j)
                    if(c.isIn)
                    {   S.FigAABB.M_extend(p.x,p.y,0,0,!edges.length)
                    }

                    // addEdge
                    let E
                    if(c.isIn || isOutMesh)
                    {   E= addEdge( { a:tri[i+j], b:tri[i+(j+1)%3]},!c.isIn)
                        E.face??=shape;
                    }
                    // the point gets a reference to the edge that it makes with next point in list
                    p.edge=E;
                    edges3.push(E);
                }

                // removeAdjEdges
                if(removeAdjEdges && c.isIn)
                    edges3.map(e=>{
                        if(e && e.in && !e.isPink)
                        {   let index = edges.indexOf(e);
                            if(index>=0)
                                edges.splice(index,1);
                        }
                    })


                // FACE COMPRESSION ALGORITHM
                // we find edge adjacency, and for each adjacent edge, we merge shapes
                let otherShape;
                let faceToBranch=shape;
                if(false && isCompressFaces && c.isIn )    
                {   
                    // faceToBranch = the incoming shape that we will branch to the existing shape
                    // we start with faceToBranch = the triangle
                    
                    // For each point ( == edge ) of the triangle
                    for( let j=0; j<3;j++)
                    {   
                        let p=shape.M_getPoint(j), E=edges3[j];// p.edge
                        
                        // is the edge an adjacent edge ? ( E.in and E.face=the face to which it belongs)
                        // E.in means the edge isn't on a border
                        if(E && E.in && E.face && !E.isPink)       
                        {   
                            if(E.face!==faceToBranch ) // connectable edge
                            {       
                                // We are going to branch it to otherShape == the face referenced by that adjacent edge
                                otherShape=E.face;

                                // report the inputs : 
                                if(1)
                                {   let s=`[j=${j}] E=[${E.a},${E.b}] toBranch=[`;
                                    faceToBranch.mP.map((p)=>s+=`${p.index},`)
                                    s+="] otherShape=["
                                    otherShape.mP.map((p)=>s+=`${p.index},`)
                                    s+="]";
                                    console.log(s);
                                }

                                // find the entry point in the other face
                                let k0=findIndexOfEdge(faceToBranch,E.a,E.b),
                                k1=findIndexOfEdge(otherShape,E.a,E.b)
                                
                                if(k0>=0 && k1>=0)
                                {   let isReverse = otherShape.M_getPoint(k1).index !=faceToBranch.M_getPoint(k0).index;
                                    console.log(`k0=${k0} k1=${k1} isReverse?${isReverse?"yes":"no"}`);
                                    if(!isReverse)
                                        console.error("ERROR NOT REVERSED");
                                    let nbP=faceToBranch.M_nb();
                                    let nbO=otherShape.M_nb(); 
                                    // change the Edge at point of insert in other shape 
                                    //otherShape.M_getPoint(k1).edge=faceToBranch.M_getPoint( (k0+isReverse?1:nbP-1)%nbP ).edge;

                                    // Switch face reference in faceToBranch
                                    faceToBranch.mP.map((p)=>{ if(p.edge && p.edge.face===faceToBranch) p.edge.face=otherShape})

                                    // reverse = we insert points ]k0 ; k0-1[ in the + order
                                    // aligned = we insert points ]k0;k0+1[ in the - order 
                                    
                                    let iInsert=k1+1;
                                    
                                    /*for(let k=1; k<nbP-1; k++)
                                    {   let index= isReverse? k0+k+1 : nbP+k0-k
                                        let pInsert = faceToBranch.M_getPoint(index%nbP);
                                        console.log(`inserting point${index%nbP}/${nbP} [${pInsert.index}] at index${iInsert} `)
                                        otherShape.M_insertPoint(pInsert,iInsert++);
                                    }*/
                                    let firstInserted=0
                                    for( let k=0; k<nbP; k++)
                                    {   let pInsert = faceToBranch.M_getPoint( (k0+k)%nbP);
                                        if(![E.a,E.b].includes(pInsert.index))
                                        {   if(!firstInserted) 
                                                otherShape.M_getPoint(iInsert-1).edge = pInsert.edge, firstInserted=1
                                            otherShape.M_insertPoint(pInsert,iInsert++);
                                        }
                                    }

                                    if( 1 ) // report
                                    {   let s="";
                                        otherShape.mP.map((p)=>s+=`${p.index},`)
                                        console.log(`merge shape(${nbP}) with other(${nbO}) : nb points = ${otherShape.M_nb()} [${s}]`);
                                    }
                                    
                                    // remove the face to branch
                                    if(faceToBranch!==shape)
                                    {
                                        let index = faces.indexOf(faceToBranch);
                                        if(index>=0)
                                        {   console.log(`removing face at index ${index}`);
                                            faces.splice( index,1)
                                        }
                                    }
                                    faceToBranch=otherShape;    // for next time

                                }else console.warn(`err k0=${k0} && k1=${k1}`)

                                // remove edge from the list 
                                if(removeAdjEdges)
                                {
                                    let index = edges.indexOf(E);
                                    if(index>=0)
                                    {    console.log(`Removing edge nb ${index}`)
                                        edges.splice(index,1);
                                    }
                                }
                            
                            } else console.warn(`E.face==faceToBranch`);
                        }
                    
                    }
                
                }
                //triEdges.map(E=>E.face=otherShape??shape)
                /*if(otherShape)
                {   console.log(`otherShape with length=${otherShape.M_nb()}`);

                }*/
                (faceToBranch??shape).mP.map((p)=>{ if(p.edge) p.edge.face=faceToBranch??shape})

                if(c.isIn && shape && !otherShape)
                    faces.push(shape)
                // Draw barycenter for debug
                barys.push(c)
                //console.groupEnd();
            }
            

            // Dimensions of gradient ( for later filling the triangles ) 
            S.m_figFloor=S.FigAABB.top();
            S.m_figGradientHeight = S.FigAABB.h*0.45;

            // Sort and draw barys
            {   
                for( let i=0; i<barys.length; i++)
                {   let c=barys[i]
                    
                    // inside the shape: little circles at the barycenter of every triangle
                    if(c.isIn && gFigInRound && gFigInRound.isSet)
                    {
                        let r=0.1*u;
                        _._DL(gFigInRound, (new RQCircle(c.x,c.y,r))._cP(-1,_1mm),1)
                        //this.M_drawPoints(gp,[c])

                    }
                    // outside the shape : we exclude some of the circles depending on various criterias
                    // Exclude points from barys ( pearls )
                    if(S.pointsFilterFunc)
                    {   if(S.pointsFilterFunc.call(_,S,c))
                        {   barys.splice(i--,1);
                        }

                    }
                }



                // First sort circles by position ( top left will be first in the list)
                barys.sort((a,b)=>a.M_length()<b.M_length()?1: -1)
                let isSort=true;

                // Then, organize them so that we jump from one circle to the other by nearest neighboor
                // This is brute force
                let closest=(g)=>{
                    let mn=_.H,imn=-1;
                    for( let i=0; i<barys.length; i++)
                    {   let a=barys[i];
                        let l=a.M_dist(g);
                        if(l>0.1 && l<mn)
                        {   mn=l;
                            imn=i;
                        }
                    }
                    return imn;
                }
                let c,c2,barys2=[];
                if(isSort)
                {   while(c=barys.pop())
                    {   barys2.push(c);
                        let i=closest(c)
                        if(i<0) break;
                        else {
                            barys.push(...barys.splice(i,1));
                        }
                    }
                }
                else barys2=barys;
                // Draw the circles 
                let n=barys2.length,i;
                for(i=0; i<n;i++)
                {    
                    c=barys2[i]
                    if(S.drawOutRound)
                        S.drawOutRound.call(_,S,c)
                }
            }
            // Draw the triangle edges from the Delaunay pass
            for( let i=0; i<edges.length;i++)
            {
                 _._DL(edges[i].in? gFigLines:gFigContour,edges[i].line,true);
                    
            }
            // Draw the mesh that is outside the figure shape 
            // we only draw the edges that lie inside a given rectangle zone 
            if(isOutMesh)
            {
                let box = S.FigAABB.clone();
                box.h*=0.25;
                box.M_inset(-7*u,-12*u)
                for( let i=0; i<edgesOut.length;i++)
                {   let e=edgesOut[i];
                    
                    if(e.in && box.M_isInside(e.line.A.x,e.line.A.y) && box.M_isInside(e.line.B.x,e.line.B.y) )
                        _._DL(gFigLines,e.line,true);
                        
                }
            }
            // Draw the content of faces ( hatched triangles inside the figure shape )
            isCompressFaces ? 
                _.M_applyFills(gFigFaces,faces) : faces.map(f=>_.M_applyFills(gFigFaces,f))
        
            // Draw in mask
            if(this.gB('isMask'))
            {
                var context = _.m_mask._X();
                context.globalCompositeOperation = "lighter";
                _.m_mask.M_drawImage({img:tex.m_canvas});			
                context.globalCompositeOperation = "source-over";

            }
        }
    }
}
Backgrounds.M_register("Silhouette",{ factory:n=>new Silhouette(n)})

/*EventManager.M_on("AConstructor",function(e,name){
    this.OBJs??=new FactoryManager();
    this.OBJs.M_register("ObjSilhouette",{ factory:n=>new ObjSilhouette(n)})
})*/



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/ImageAnalysis.js?v=1681489318

// M_findPoints
ZPA.prototype.M_findPoints=function(tex)
{

    let out=[],_=this;

    if(tex)
    {
        var imgd =tex._X().getImageData(0,0,tex.m_width,tex.m_height);
        var pix = imgd.data,k=0;
        let coord = (i,j)=>new ZV2(i/tex.m_width*_.W,j/tex.m_height*_.H)
        let index = (i,j)=>(i>0 && i<tex.m_width && j>0 && j<tex.m_height)? 4*(i+j*tex.m_width) :-1 
        let dotRadius = 1*this.u;
        let dotRadMin= 0.5/tex.m_width*this.W;
        let blob;
        let spread=(i,j)=>{
            let p=coord(i,j);
            blob.pts.push(p);
            blob.sum.M_add(p);
            let count=blob.pts.length;
            blob.g.M_set(blob.sum.x/count,blob.sum.y/count)
            // clean here
            let k=index(i,j);
            pix[k]=pix[k+1]=pix[k+2]=255;

            // iterate
            ([{i:i+1,j:j},{i:i,j:j+1},{i:i+1,j:j+1}]).map((C)=>{
                k=index(C.i+1,C.j)
                if(k>=0 && RQColor.isPink(pix[k],pix[k+1],pix[k+2]) && coord(C.i,C.j).M_dist(blob.g)<dotRadius )
                    spread(C.i,C.j)
    
            })


        }

        let _1mm=_.printMm(0.3)
        for( let j=0; j<tex.m_height; j++)
        {	for( let i=0; i<tex.m_width; i++)
            {	
                k=index(i,j)
                if(RQColor.isPink(pix[k],pix[k+1],pix[k+2]))
                {   blob={pts:[],sum:new ZV2(),g:new ZV2()}
                    spread(i,j);
                    // find max 
                    let rmax=0;
                    blob.pts.map((p)=>{ let r=p.M_dist(blob.g); if(r>rmax) rmax=r; })
                    if(rmax>=dotRadMin)
                    {
                        blob.g.r=rmax;
                        let isIntersect=false;
                        out.map((bl)=>{ if(bl.M_dist(blob.g)<(bl.r+rmax)) {isIntersect=true} })
                        if(!isIntersect)
                        {     out.push(blob.g)
                        }
                    }
                }
                //k+=4;
            }
        }
        //tex._X().putImageData(imgd,0,0);
    }
    


    return out;
}


//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/LongLine.js?v=1681489318


EventManager.M_on("VariablesSet",function(_v)
{   
    let _=this,LLs = _.m_longLines =[]
    let gps = _.gPk("styles",["LongLine"],true);
    for(let ia=0; ia<gps.length; ia++)
    {	let v= gps[ia],LL={
            _g:[],
            isActive: v.gB("isActive",1),
            isReverse:v.gB("isReverse",0),
            isSlow:v.gB("isSlowRender",0),
            isSort:v.gB("isPathSorting",0),
            isConnect:v.gB("isConnect",0),
            maxL:(v.gF("maxLength",-1)??0)*_.M_get("u"),
            m_range:v.gF("range"),
            _V:v,
            _lines:[]
        }
        if(LL.filterFunc=v.M_get("filter"))
        {   LL.filter=_.M_getFunc(LL.filterFunc)
        }
        // Add line function
        LL.M_addLine=function(L){
            this._lines.push(L)
        }.bind(LL)
        // read the style
        let gpn=LL.m_tag=v.M_get("tag");
        if(gpn)
        {   let Gr=_._Sv("LongLine", gpn);
            LL.m_group=LL._g[gpn]=A.M_getGroupInstance(Gr);
            // to trick the _rS
            v._V["SvgObject"].E=gpn;
        }
        LLs.push(LL)
    }
    // M_getLongLine : returns a LL object for 
    ZPA.prototype.M_getLongline=function(n){
        let _=this, gps=_.m_longLines;
        for(let i=0; i<gps.length; i++)
            if(gps[i].m_tag==n)
            {   return gps[i];
            }
        }

})
// Reading pen style for LLs, must be done in VariablesDone, i.e after init phase of the Algo
EventManager.M_on("VariablesDone",function()
{
    let _=this
    _.m_longLines.map((LL)=>{
        _._rS(LL,LL._V);

        //LL.filter=(L)=>{let d=L.first().M_dist(_.mwA.center())/_.W; return d<0.42 && d>0.22}     // RING
        LL.filter??=(L)=>  Noz ( 2*L.first().x/_.W,L.first().y/_.H)>0.2     // NOISE
    })
})

EventManager.M_on("DrawLines",async function(){
    let _=this
    _.M_resetClipping(1,1)
    await sleep(1); // enabled a pause before computing / drawing the line
    for( let i =0; i<_.m_longLines.length; i++)
    {   let LL = _.m_longLines[i],Ls=LL._lines
        if(Ls.length)
        {   let Ls2= LL.isSort? _.M_pathOptimize(Ls) : Ls;
            let Ls3=[];
            for( let j=0; j<Ls2.length; j++)
            {   if(Ls2[j]&&Ls2[j].first())
                    Ls3.push(...await _.M_addToLongLine(LL,Ls2[j],Ls3))
            }
            // clean group
            LL._lines=[]

            _._DL(LL.m_group,Ls3,0,{heapFront:1}); // TODO : make them appear on front 

        }
    }
    _.M_clipToWorkArea(1)

});
EventManager.M_on("RegisterFillStyles",function(){
    
    let _=this,u=_.u
    _._rL('longline',function(l,v,ls){
        l.samp=v.gO(ls,"samp",0)*u
        l.gpName=v.gO(ls,"name")
        l.maxL=parseFloat(v.gO(ls,"max",-1)??-1);
        if(l.maxL>0) l.maxL*=u
    },  _.lsLongLine)

})

ZPA.prototype.lsLongLine = function(lst,Ls)
{	let out=[],ok=()=>1
    lst.LL??=A.M_getLongline(lst.gpName)
    if(!Ls) debugger;
    for(let j=0;j<Ls.length;j++)
    {   if(lst.LL?.isActive&& (lst.LL.filter?? ok)(Ls[j])   )     // TODO : implement custom filter function 
        {   lst.LL.M_addLine(Ls[j])
        }
        else out.push(Ls[j])
    }

    return out;
    
}
ZPA.prototype.M_addToLongLine=async function(LL,L,_l)
{   // previous lines in _lines
    let n=L.M_nb(),pPrev=0,isIn=0,out=[],hasJunct

    let clip = this.mwA;
    // Check segment intirely inside workarea
    for( let j=0; j<n; j++)
    {   let p=L.M_getPoint(j)
        if( p && clip.iPI(p))
        {   isIn=true;    
            break;
        }
        pPrev=p.clone();
    }
    // if it's in 
    if(isIn)
    {  
        let isFlip=false;
        if(LL.lastPoint)
        {   let d1= LL.lastPoint.M_dist(L.first());
            let d2= LL.lastPoint.M_dist(L.last());
            isFlip=d1>d2;
            if(isFlip)
            {   L.M_reverseOrder();    
            }
            // OK Create the junction
            if( LL.maxL<=0 ||  Math.min(d1,d2)<LL.maxL)
            {   let endPoint = L.first();
                let endNext = n>=3? L.M_getPoint(1): endPoint.clone();

                if(LL.lastPrev && endNext)
                {   let u1 = LL.lastPoint.M_minus(LL.lastPrev).Nz();
                    let u2 = endPoint.M_minus(endNext).Nz();
                    let d = endPoint.M_minus(LL.lastPoint).M_length(); 
                    let k = Math.min(d/2,10*this.u);

                    // add a Bezier Curve ( sampled )
                    // These are the control points

                    let ctrl = [LL.lastPoint.clone(), LL.lastPoint.M_plusU(u1,k),endPoint.M_plusU(u2,k),endPoint.clone()];
                    
                    out.push(this.M_makeBezier(...ctrl))
                    hasJunct=1
                
                }

            }
            //else console.log(`junction discard LL.maxL=${LL.maxL} Math.min(d1,d2)=${Math.min(d1,d2)}`);

        }

        LL.lastPoint=L.last();
        LL.lastPrev = n>=3? L.M_getPoint(n-2) : LL.lastPoint.clone();
    }
    // Push that segment anyway
    out.push(L)
    
    // should draw the line at this point to have some dynamic visuals 
    EventManager.M_asyncFire("LLDraw",{lines:out,LL:LL},this);


    // if connect mode, we connect the points with previous lines
    if(LL.isConnect &&_l && hasJunct)
    {   out[0].M_append(out.pop())
        let prevL=_l[_l.length-1];
        if(prevL)
        {   if(!prevL.m_isPolyLine)
            {   prevL=new ZPL(prevL.A.clone(),prevL.B.clone())
                _l.pop(),_l.push(prevL);
            }
            prevL.M_append(out[0]),out=[]
            
        }
        
    }
    

    return out;

}
// limit line to bounds 
ZPA.prototype.M_makeBezier=function(a0,b0,b1,a1)
{
    let bounds=this.mdA
    if(1)   // method : change bezier control points
    {
        if( !bounds.iPI(b0) || !bounds.iPI(b1) ) 
        {   let clipped=bounds.M_clipLine(new ZPL([a0,b0,b1,a1]))  
            let ncl=clipped.length,pcut;
            if(ncl && (pcut = clipped[0].last()))  b0=pcut.clone()
            if(ncl && (pcut = clipped[ncl-1].M_getPoint(clipped.length-2) )) b1=pcut.clone()            
        }                    

    }



    let L=ZMT.BezierCurve(a0,b0,b1,a1)

    return L
}

ZPA.prototype.M_pathOptimize=function(Ls)
{
    if( (!Ls) || !isArr(Ls) )
    {
        return [];
    }
    let lines = Ls;

    // TODO : all primitives must implement M_getP0(),M_getPend()


    // brute force path optimization
    // 1) sort them from closer to the origin
    lines.sort((a,b)=>{	
        let ap=a.first(), bp=b.first();
        if(ap && bp)
            return ap.M_length()<bp.M_length()?1: -1;
        else 
            console.error("lines sorting, first missing");
        return 1;
    });

    // 2) organize them so that we jump from one end to the other start by nearest neighboor
    // This is brute force
    let closest=(L)=>{
        let mn=this.H+this.W,imn=-1;
        let P1=L.last();
        //console.log("initial g1="+g1.M_getString());
        if(P1)
        {	for( let i=0; i<lines.length; i++)
            {   let a=lines[i];
                let l=a.first().M_dist(P1);
                //console.log(`[${i}] p0=${a.M_getP0().M_getString()} l=${l}`);
                if(l>0.1 && l<mn)
                {   mn=l;
                    imn=i;
                }
            }
        } else {imn=0;}
        //console.log(`Found imn = ${imn}/${barys.length}`);
        return imn;
    }
    let c,out=[];
    while(c=lines.pop())
    {   out.push(c);
        let i=closest(c)
        if(i<0) break;
        else {
            lines.push(...lines.splice(i,1));
        }
    }
    // transfer entire list
    return out;
    
}


//SCRIPT: http://localhost:8888/Patterns//Data/Js/Custom/ArtMatr.js?v=1681489318

var ftFormat
var yLinesStop

EventManager.M_on("VariablesInit",function(v){
    let isLongform=!$G.MATRED
    let _=this,p,LLColor="rgba(255,255,255,0.8)"
   // INIT LongForm
   if(typeof initLongform=="function")
        initLongform(v)

    // Accessing charcoal 
    let setBgFuncPart=(part,id,va)=> setBgProp(part,va,"BackgroundFunc",undefined,id)
    let getCharcoal=(id)=>getBgPart('group1','HatchShape2',undefined,"BackgroundFunc",undefined,id)
    let getCharcoalGrid=()=>getBgPart('group1','HatchGrid',undefined,"BackgroundFunc",undefined,0)
    let setCharcColor=(c)=>{
        if( p = getCharcoal(0))     p.paletteTag._O.color=c
        if( p = getCharcoal(1))     p.paletteTag._O.color=c
        if( p = getCharcoalGrid())  p.paletteTag._O.color=c
    }
    let setLongLineStyleOpt=(opt,val)=>{
        p=v.styles?.E[1]
        if(p)p=p._V?.lineStyle?._O
        if(p)p[opt]=val;
    }
    let setLongLineVar=(name,val)=>{
        p=v.styles?.E[1]
        if(p)p=p._V?.[name]
        if(p)p.E=val;
    }
    
    let ftLove = getRandomFeature("_hiddenFeatureForNow",[
        FT(10,"1",{}),
        FT(10,"2",{})        
    ],0,0)

    // PAPER
    let ftPaper= getRandomFeature("Paper",[
        FT(10, "Black Black"    ,{paper:"Black",color:"rgba(255,255,255,0.7)",charcColor:"rgba(255,255,255,0.2)"}),
        FT(15 ,"Sketchbook"     ,{paper:"YellowWhite",LLmono:"rgba(0,0,0,0.95)",color:"rgba(5,5,0,0.5)",charcColor:"rgba(5,5,0,0.32)",charcColorGreen:"rgba(5,5,0,0.45)",colorGreen:"rgba(5,5,0,0.8)",fatPoppieStrk:1,smudgeColor:"20,20,0,0.05"}),
        FT(15, "White"          ,{paper:"Watercolor",gradient:1,stroke:0.25,LLmono:"rgba(0,0,0,0.95)",color:"rgba(0,0,0,0.5)",charcColor:"rgba(0,0,0,0.32)",charcColorGreen:"rgba(5,5,0,0.45)",colorGreen:"rgba(5,5,0,0.8)",fatPoppieStrk:1,smudgeColor:"0,0,0,0.07"}), 
        FT(15 ,"Grey Green"     ,{paper:"GreyGreen"}),
        FT(6 ,"Pink"           ,{paper:"Pink"}),
    ]        
    ,(ft)=>{
            v.paperColor.E=ft.paper
            if(ft.color)
                v.strokeColor.E=ft.color
            if(ft.stroke)
                v.strokeWidth.E=ft.stroke
            if(ft.LLmono)
                LLColor=ft.LLmono

            if(ft.charcColor)
               setCharcColor(ft.charcColor)
            if(ft.gradient)
                setGradientProperty("activate","true")
            if(ft.fatPoppieStrk)
            {   
                if(p=getSpecyPart("PoppyPetals","SVGGroup2","G2","GrassPoppy","Poppies"))
                {  
                    //console.log(RQPrintR(p.lineStyle,1))
                    let opt=p.lineStyle._O
                    p.lineStyle.E="demult"
                    opt.samp=0.2,opt.ampl=0.4,opt.nk=15
                }

            }
        }
    ,true,_FTRnd2 
    );

    let ftMargins = getRandomFeature("Margins",
    [   FT(10,"3%",{prct:3}),
        FT(10,"6%",{prct:6}),
        FT(10,"10%",{prct:10})
    ]
    ,(ft)=>{

    })
    
    // Species stability
    //_forceFT['Feel']="Controlled"
    getRandomFeature("Movement",
    [   FT(20,"Wild",{}),
        FT(10,"Balanced",{ang:1})

    ]
    ,(ft)=>{
        if(ft.ang)
        {   let spcs=[
                {t:'GrassPoppy'},
                {t:'GrassMint',n:'Mint'},
                {t:'GrassMint',n:'Palm'},
                {t:'TreeGrass',n:'Tree'},
            ]
            spcs.map((S)=>{
                if(p=getSpecy(S.t,S.n))
                {   let t=p.torsion
                    if(t)   { t.E.min=0; t.E.max=0;}
                
                    if(S.n=='Tree')
                    {
                        p.branchModul.E.amplitude=0;   
                        p.branchAngle.E.min=p.branchAngle.E.max=22.5
                    }
                }

            })


        }

    }
    
    )
    
    
    // Fix horizon unfortunately not the right place for item 0
    if(v.documentHorizon.E>=0.7)
    {    v.yFracStop.E=0.9
        if(p=getSpecy('GrassPoppy'))
            p.yRange.E.max=0.5
    }
    const ratio169=16/9;
    const areaRef= (178**2)/ratio169,uRef = 10;
    ftFormat= getRandomFeature("Format",[
      FT(20, "Small square",{w:90,h:90,matr:{w:900,h:900},svg:{w:210,h:210}}),
      FT(20, "Large square",{w:130,h:130,matr:{w:900,h:900},svg:{w:297,h:297}}),
      FT(20, "Portrait",    {w:100,h:177.8,matr:{w:900,h:1600},svg:{w:236.25,h:420}}),
      FT(20, "Landscape",   {w:177.8,h:100,matr:{w:1600,h:900},svg:{w:420,h:236.25}}),
      FT(20, "Wide Landscape", {w:240,h:135,matr:{w:2200,h:1237.5},svg:{w:594,h:334.125}}),
  
    ],(ft)=>{
      W=v.widthMm.E = ft.w;   
      H=v.heightMm.E =ft.h;
      v.u.E = Math.round(uRef*Math.sqrt(areaRef/(W*H)));
      v.pngUpscale.E    = 3;          // PNG ouput resolution multiplier  : TODO
      
      let srch = new URLSearchParams(window.location.search),
      mult=srch.get('scale')
      if(mult) mult=parseFloat(mult)
      { if( mult && mult>=1 && mult<=10)
        {
            v.pngUpscale.E=mult;
        }
      }

      
      v.documentMargin.E= Math.min(W,H)*ftMargins.prct/100

      if(ft.matr)
        v.svgSize.E.w=ft.matr.w
    }
    ,true,_FTRnd2 
    );
    
    // Switch different skies
    //_forceFT.Sky="Sky"
    getRandomFeature("Background pattern",[
        FT(10 ,"Rain"          ,{type:"Rain"}),
        FT(10 ,"Sun"           ,{type:"Sun"}),
        FT(10 ,"Fog"          ,{type:"Sky"}),
        FT(10 ,"Cloud"         ,{type:"Cloud",ampl:10,wavelength:{min:80,max:150}}),

    ]
    ,(ft)=>{
            setSkyProperty("bgFunc",ft.type)
            if(ft.ampl)
                setSkyProperty("ampl",ft.ampl)
            if(ft.wavelength)
            {    setSkyProperty("wavelength",ft.wavelength)
                    setSkyProperty("spacing",{min:3,max:2})
            }

        }
    );


    // Switch different skies
    getRandomFeature("Texture",[
        FT(10 ,"Paper"          ,{type:"grain"}),
        FT(10 ,"Canvas"         ,{type:"canvas"}),
    ]
    ,(ft)=>{
            setTextureProperty("type",ft.type)
        }
    );

    // Monoliths
    let isMonoliths=getRandomFeature("Monoliths",[
        FT(10 ,"Yes."          ,{is:true}),
        FT(10 ,"Nope."         ,{is:false}),
    ]
    ,(ft)=>{
            if(p=getSpecy("GrassObject3D"))
                p.isActive.E=ft.is?"true":"false"

        }
    );

    // Adjust black color
    if(_FTs['Paper']=="Black Black")
    {
        //if( p = getBgProp('addons',"BackgroundFunc",undefined) )
        // Todo : stronger poppies lines
        if(p=getSpecyPart("PoppyPetals","SVGGroup2","G2","GrassPoppy","Poppies"))
        {   
            //console.log(RQPrintR(p,2))
            p.strokeWidth.E=0.2
        }
		// Chalk disappear
		if(p=getSpecyPart("PoppyPetals","HatchShape2","H2","GrassPoppy","Poppies"))
        {   p.activate.E="false"	// doesn't work ? 
			if( opt=p.paletteTag?._O) opt.color="rgba(255,255,255,0.1)"
        }

        // Sky becomes sketchy 
        (['Rain','Sun','Sky']).map(part=>{
           if(p=getBgPart(part,'SVGGroup2',undefined,"BackgroundLib"))
            {   let opt= p.lineStyle._O, nb=opt.chainNb||1                
                opt.chainNb=nb+1
                p[`lineStyle+${nb}`]={E:"dotted",_O:{ampl:1,nk:40,samp:1,swipe:15,blend:"-"} } 

                // Sky color is lighter
				if( opt=p.paletteTag?._O) opt.color="rgba(255,255,255,0.3)"

            }
            });
    }

    // Charcoal pattern
    let patternsDefs=isLongform?
    [   FT(10,"Lines"                   ,{type:1}),
        FT(10,"Checkerboard"            ,{type:2}),
        FT(10,"Rectangles"              ,{type:3}),

    ]
    :
    [   FT(10,"Vertical"                ,{type:1}),
        FT(10,"Checker"                 ,{type:2}),
    ]

    let ftCharcoalPattern=getRandomFeature("Charcoal",patternsDefs
    ,(ft)=>{
            let grid
            if(ft.type==2 || ft.type==3)
            {
                setBgFuncPart("activate",1,"false")
                getCharcoal(0).activate.E="false"
                grid=getCharcoalGrid()
                grid.activate.E="true"
                // write monoliths in bg instead of bg2
                if(isMonoliths)
                {   if(p=getSpecyPart("Faces","PNGFilllTex","Ftex","GrassObject3D"))
                        p.texName.E="bg";        
                }
                // palm must write stronger color
                if(p=getSpecyPart("MintLeaf","PNGFilllTex","Ftex","GrassMint","Palm",1))
                    p.strokeColor.E="black/0.2";        

                // Thicker strokes
                v.strokeWidth.E=0.25

                // Some plant's lines are discarded
                /*if(p=getSpecyPart('Herb',"SVGGroup2","G2","GrassHerb"))
                    p.lineStyle.E="discard";*/
            }
            if(ft.type==3)  // rectangles
            {   grid.lineSpacing.E={min:0.3,max:0.75}
                grid.grid.E={x:2.8,y:20}
                //grid.recurs.E="false"
                grid.inMargin.E={x:0.1,y:0}
                grid.pattern._O.variant=3
            }
        
        }
    );


    let ftLLColor=getRandomFeature("Line color",[
        // GREEN LINE
		FT(30 ,"Green"        ,{color:"rgba(140, 255, 49,0.75)",bright:1,colors:
            {   
				GreyGreen:{ color:"rgba(180, 255, 79,0.9)", shadow:"rgba(20,40,0,0.4)"},
				Watercolor:{ color:"rgba(140, 255, 49,0.95)", shadow:"rgba(0,70,50,0.9)"},
				YellowWhite:{ color:"rgba(140, 255, 49,0.85)", shadow:"rgba(10,10,0,0.3)"},
				Black:{ color:"rgba(230,255,200,0.92)", shadow:"rgba(80,180,0,0.4)"},
				
			}
        }),
		// MONOCHROME LINE
        FT(10 ,"Monochrome"   ,{color:LLColor,colors:
			{
				GreyGreen:{ color:"rgba(255, 255,255,1.0)", shadow:"rgba(0,50,0,0.6)"},
				YellowWhite:{ color:LLColor, shadow:"rgba(0,0,0,0.2)"},
				Black:{ color:"rgba(255,255,255,0.98)", shadow:"rgba(255,255,255,0.2)"},
				Pink:{color:"rgba(255, 255, 255,0.96)",shadow:"rgba(70,0,0,0.25"},

			}
		}),
		// YELLOW LINE
        FT(10 ,"Yellow"       ,{color:"rgba(255,255,100,0.92",bright:1,colors:
            {   GreyGreen:{ color:"rgba(255,255,120,0.99)", shadow:"rgba(60,60,0,0.5)"},
                Watercolor:{ color:"rgba(255,255,0,0.92)", shadow:"rgba(255,245,120,0.3)"},
				YellowWhite:{ color:"rgba(255,255,120,0.92)", shadow:"rgba(255,255,120,0.25)"},
                Black:{ color:"rgba(255,255,200,0.92)", shadow:"rgba(180,150,0,0.6)"},
				Pink:{shadow:"rgba(70,0,0,0.25"},
		}

        }),
    ]
    ,(ft)=>{
        let def= (ft.colors && ft.colors.hasOwnProperty(ftPaper.paper))?ft.colors[ftPaper.paper]:ft
        v.hilight.E = def.color??ft.color
        // Make charcoal darker 
        if(ftPaper?.charcColorGreen && ft.bright)
        {   setCharcColor(ftPaper.charcColorGreen)
        }
        if(ftPaper?.colorGreen && ft.bright)
            v.strokeColor.E=ftPaper?.colorGreen
        
        if(def.shadow)
            setLongLineStyleOpt('shadow',def.shadow)


    });

    // Monoliths window
    if(isMonoliths)
    {   _forceFT['Monoliths']=null;     
        getRandomFeature("Monoliths",[
            FT(20,"Yes",{}),
            FT(10,"With windows",{windows:1}),
        ],(ft)=>{
            if(p=getSpecyPart( 'Faces','HatchCirclePacking',"H circle","GrassObject3D"))
            {   
                p.activate.E=ft.windows?"true":"false";
            }
            
        })

    }
    else _FTRnd()


    // Sometimes put the flowers on Longline
    getRandomFeature("Flowers Longline",[
        FT(80,"no",{}),
        FT(20,"Yes",{yes:1}),
    ],(ft)=>{
        if(ft.yes)
        {   if((p=getSpecyPart("PoppyPetals","SVGGroup2","G2","GrassPoppy","Poppies")))
            {  let l0=p.lineStyle
                // insert a linestyle
                console.log(`TOTO ${RQPrintR(p,1)}`)
                let chainNb=l0._O.chainNb||1
                // shift the chain 
                for( let i=chainNb+1;i>=1;i--)
                {   p[`lineStyle+${i}`]={...p[`lineStyle+${i-1}`]}
                }
                // add a chain elt +set options
                l0._O={name:"LL",max:"-1",blend:"-",chainNb:chainNb+1}
                l0.E="longline"
            }
        }

    },0)    // Not public


    // LL filter function feature
    getRandomFeature("Thread",[
        FT(20,"Flow",{}),
        FT(20,"Ring",{filter:"LLRing"}),
        FT(20,"Round",{filter:"LLRound"}),
        FT(20,"Vertical Flow",{filter:"LLNoiseParam",n:{kx:5,ky:0.5,thres:0.4}}),
        FT(20,"Horizontal Flow",{filter:"LLNoiseParam",n:{kx:0.5,ky:3,thres:0.4}}),
        
    ],(ft)=>{

        if(ft.filter)
            setLongLineVar('filter',ft.filter)
        if(ft.n)
            A.LLNoise=ft.n
    
    });


    // Room for new features 
    let nbExtra=5; _rndX=[]
    for( let i=0; i<nbExtra; i++)
        _rndX[i]=_FTRnd();

    
    
    // Lines stop
    yLinesStop=_forceFT["Ink horizon"]??1
    _FTs["Ink horizon"]=`${(yLinesStop*100)|0}%`;
    // pattern orientation
    {   let r=_FTRnd(),rt=0.5
        if(r<=rt)
        {   if(ftCharcoalPattern.type>=2 )
            {   let grid=getCharcoalGrid()
                grid.orientation.E =rndArray([-45,45,-30,30],()=>r/rt)
            }

        }
    }

    // SMUDGE ( hidden feat)
    getRandomFeature("Smudge",[
        FT(10,"Yes",{is:1}),
        FT(20,"No",{is:0})
    ],(ft)=>{
        if(ft.is && !["Black","Pink"].includes(ftPaper.paper) )
            setBgFuncPart("activate",2,"true")
        if(ftPaper.smudgeColor)
        {    
            if(p=getCharcoal(2))
                p.paletteTag._O.color=`func(alphaCenter,${ftPaper.smudgeColor})`;
        }
    });


    // Monoliths Color
    ZPA.prototype.colorRndBlack=function()
    {   let rnd=this.random(),
        c=(20+200*rnd)|0

        return `rgba(${c},${c},${c},1)`
    }

    // HORIZON
    let skyOrientation=_forceFT['skyOrientation']??0;
    if(!_und(_forceFT.pmHorizon))
    {   let pmHorizon=_forceFT.pmHorizon
        if(pmHorizon==0)
        {  
            
            v.turnOffSpecies.E="true"
            _FTs["Garden"]="Gone"
            /*let i=0;
            // try turn off all species
            v.species.E.map((S)=>{
                console.log(`turning of ${S.m_name}`)
                if(S.isActive)S.isActive.E=_rndX[i%nbExtra]<0.6? "false":"true";
                i++ 
            })*/
            v.documentHorizon.E=0
            v.yStart.E=-1


            // Here we can use some special effects
            // sky rotation ? 
            if(_und(_forceFT['skyOrientation']))
                skyOrientation = (-0.5+_rndX[3])*180;
        }
        else
        {  v.documentHorizon.E=pmHorizon*=0.92

            _FTs["Garden"]=pmHorizon>=0.9?"Fully grown" : (pmHorizon>=0.3?"Halfway grown" : "Short")
        }

        if(skyOrientation)
            setSkyProperty('orientation',skyOrientation)

    }


    console.log(`Features = %c${RQPrintR(_FTs)}`,"font-weight:bold")

    // SVG Splits
    this.svgSplits=[
        {   name:"1-Charcoal",
            groups:["BackgroundFunc/CharcoalChecker","BackgroundFunc/CharcoalVerticalLines","BackgroundFunc/CharcoalHorizontalLines"]
        },
        {   name:"2-Chalk",
            groups:["GrassPoppy/FlowerPetalsChalk"]
        },
        {   name:"3-InkBrush",
            groups:["GrassHerb/GrassOutline","GrassMint/MintStem","GrassMint/MintLeafOutline","TreeGrass/Branches","TreeGrass/Fruits","GrassClover/CloverOutlines","GrassMint/LongLeafOutline","GrassMint/LongLeafStem","GrassPoppy/PoppyStem","GrassPoppy/FlowerOutlines","GrassPoppy/FlowerStem","BackgroundLib/SkyFog"]
        },
        {   name:"4-InkSmallBrush",
            groups:["GrassMint/MintLeafFt","GrassMint/MintLeafPattern","GrassClover/CloverFeatures","GrassMint/LongLeafFeatures","GrassPoppy/FlowerStamen","GrassPoppy/StamenTip","GrassPoppy/FlowerHeartHatches","BackgroundLib/Sun","BackgroundLib/RainPattern","GrassObject3D/MonolithsEdges"]
        },
        {   name:"5-LongLine",
            groups:["LongLine/GreenLongLine"]
        },
    ]
    
    //"TreeGrass/FruitsHatches" removed

    // M_on("LLDraw"
    // = each time a LL is added to the list
    // not optimized, LL should have its own event manager to handle faster event
    EventManager.M_on("LLDraw",async function(opt){

        let LL=opt.LL,g,out=opt.lines
        if((g=LL.m_group) && out.length )
        {   let ctx=this._o._X()
            out.map(o=>{
                path=new Path2D( o._gS(false))
                A.M_drawHeapElt(ctx,{m:"stroke",c:g.m_strokeColor,w:g.m_strokeWidth*2.5,path: path},{})
            })

            if(0==(LL.cntLL=1+(LL.cntLL??0))%5)
            await sleep(1)
            /*requestAnimationFrame(()=>{
                console.log("hello from r.a.f");
            })*/
        }   


    });



    // To make a 1/4 sample ( TEMP )
   if(0)
    ZPA.prototype.M_getClipArea=function(r)
    {   let c=r.clone();
        c.w*=0.7
        //c.y+=c.h/2
        c.h/=2
        console.log(`Clipping : ${c.M_getString()}`);
        
        return c;
    }



})
GrassAlgorithm.prototype.VM_onLineOfGrassBegin=function(yFrac,y,scale)
{
    let _=this
    if(!_.blabla)
    {   _.blabla=1;
        // find specy flower / force drawing of lines
        let p=_.M_getSpecyByName("GrassPoppy"),Fs
        if( p && (Fs=p._g.PoppyPetals))
        {   Fs.fills.map((F)=>{
                if(F.id=="FlowerPetalsChalk")
                {   F.setup=(o)=>{ this._skipLtmp=this._skipLines; this._skipLines=0}
                    F.end=(o)=>{ this._skipLines=this._skipLtmp}
                }
            })   
            

        }

    }
    let yMax = _.H*_.m_documentHorizon;
    let yStartRef = (yLinesStop==0?_.m_yStart:-700)
    let yStop = yStartRef+yLinesStop*(yMax-yStartRef)
    //console.log(`yFrac: ${yFrac} yStart:${_.m_yStart} H-y ${_.H-y} yMax=${yMax}`)
    // test
    if((_.H-y)>=yStop &&!_.skipL)
    {
        _.skipL=1
        _._skipLines=1
    }
}


EventManager.M_on("RegisterFuncs",function(){
    let _=this
    this.M_registerFunc('LLRing',function(L){        
        const wmin=Math.min(_.W,_.H)
        let i,d
        for(let i=L.M_nb()-1; i>=0;i--)
        {   d = L.M_getPoint(i).M_dist(_.mwA.center())/wmin
            if(d>0.28 & d<0.4 )
                return 1
        }
        return 0
    })
    this.M_registerFunc('LLRound',function(L){        
        const wmin=Math.min(_.W,_.H)
        let i,d
        for(let i=L.M_nb()-1; i>=0;i--)
        {   d = L.M_getPoint(i).M_dist(_.mwA.center())/wmin
            if(d<0.3 )
                return 1
        }
        return 0
    })
    // default noise
    this.M_registerFunc('LLNoise',function(L){
        return Noz ( 2*L.first().x/_.W,L.first().y/_.H)>0.2

    })
    // noise 2
    this.M_registerFunc('LLNoiseParam',function(L){
        let i,p,n=_.LLNoise
        for(let i=L.M_nb()-1; i>=0;i--)
        {   p = L.M_getPoint(i)
            if( Noz ( n.kx*p.x/_.W,n.ky*p.y/_.H)>n.thres)
                return 1
        }
        return 0;

    })

})


EventManager.M_on("AlgoDone",function(){
    if(!isFxh) // we don't want to do it twice
        this.M_doLineAnim()
})
ZPA.prototype.M_doLineAnim=function(){
    // release stencil and mask 
    this.M_deleteCanvases()
    

}
EventManager.M_on("bgDraw",function(){
    this._skipLines=0    
})
BgndFunc.prototype.fillPaintLayer=async function(_){
    let S=this, u=_.u
    let tex = _.M_getTexture(S.M_get("texture"))
    if( tex)
        _.M_drawFillHeap(tex,{heap:tex.heap})
    else _.M_resetClipping(1)
    
    _._skipLines=0

    let g= S._g.group1;
    g.m_isBack=1

    if(g.fills)
    {
        let L =_.mwA._cP();
        g.fills.map(async (F)=> {
            if(F.m_active)
            {
                if(tex) F.mask=tex,      
                F.thres=230             
                else 
                {   _.m_mask.M_fill("black")
                    
                }
                
                // TODO : a way to break this down ? Can't because it's done in one chunk 
                _._Fl(F,L,F)
                
            }
        })
    }
    else 
    {   for( let j=0; j<_.H; j+=1*u)
        {
            let L = new ZPL([new ZV2(0,j),new ZV2(_.W,j)]);
            let Ls = _.M_computeLineMask(L,{mask:tex,thres:230,active:1});
            if(Ls && Ls.length)
            {   _._DL(g,Ls,false)
            }
            
            await sleep(1)
        }
    }
    if(!tex)_.M_clipToWorkArea(1)
}

ZPA.prototype.alphaCenter=function(L,r1,g1,b1,a1)
{
    let P=L.first();
    let c = this.mwA.center(), d=Math.hypot((P.x-c.x)/this.W,(P.y-c.y)/this.H)
    let alpha = ZMT.M_clamp( 1-d/0.55,0,1)
    return `rgba(${r1},${g1},${b1},${a1*alpha})`;

}
ZPA.prototype.ColorRainbow = function(L,a)
{
    let _=this;
    _.rainbow??=[ [103,49,144],[9,115,189],[0,173,242],[118,212,67],[253,250,21],[255,141,27],[255,20,26]]
    _.rainRnd??=ZMT.newRnd();
    let c=rndArray(_.rainbow,_.rainRnd)
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`

}



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Graphics/HatchDots.js?v=1681489318

EventManager.M_on("RegisterFillStyles",function(){

    this._rF("HatchDots",function(H,v){
        let _=this
        H.size=v.gF("size",{min:.2,max:1});
        H.distrFunc=HatchDotDistr.bind(_)
        H.hatchFunc=HatchDot.bind(_)
        H.distr=v.M_get("distr","grid")
    })

    
    this._rL('dotted',function(l,v,ls){
            //l.noClip=1
			l.amp=v.gO(ls,"ampl",1);
			l.nk=1*v.gO(ls,"nk",30)
            l.sep=1+1*v.gO(ls,"samp",1)
            l.rnd=ZMT.newRnd(0,"hatchdots")
            l.swipe=v.gO(ls,"swipe",2)??2
            l.s=0
            if(l.maxL>0) l.maxL*=A.u
            l.fnHeap = HatchHeapDotted
        },
        null
    );
    this._rL('varStroke',function(l,v,ls){
        l.amp=v.gO(ls,"ampl",1);
        l.nk=1*v.gO(ls,"nk",30)
        l.samp=v.gO(ls,"samp",0)*this.u;
        l.e0=1*v.gO(ls,"estart",0)
        l.e1=1*v.gO(ls,"eend",0)
        l.stopSvg=1

    },LSVarStroke)

   

	// Horiz, only keeps lines with slope <35 
    this._rL('horiz',function(l,v,ls){
        l.samp=v.gO(ls,"samp",0)*this.u},
        function(lst,Ls)
        {	let out=[],j,i,n1=Ls.length
            for(j=0;j<n1;j++)
            { 	let L=lst.samp?Ls[j].M_sample(lst.samp):Ls[j],l=0,n=L.M_nb(),pPrev,isHoriz,wasHoriz;
                for(i=0;i<n;i++)
                {   let p=L.M_getPoint(i);
                    if(pPrev)
                    {   let slope = p.M_minus(pPrev),
                        ang=Math.atan2(slope.y,abs(slope.x));
                        isHoriz = (abs(ang)/D2R)<35; // TODO param
                        pPrev.penUp=!wasHoriz;
                        if(isHoriz!=wasHoriz)
                        {   wasHoriz=isHoriz;
                        }
        
                    }
            
                    pPrev=p;
                    
                }
                out.push(L);

            }
            return out;
        }.bind(this)
    )
		




    ZPA.prototype.M_getGrindTexture=function(color)
    {
        let x,y,tex=new Texture({width:100,height:100}),cv=tex.m_canvas, context=tex._X()
        ,c=RQColor.sM_rgbaToArray(color)??[0,0,0,1]
        for (x = 0; x < cv.width; x++) {
            for (y = 0; y < cv.height; y++) {
              const n = ZMT.M_map(Math.random(),0.2,0.7,0,1);
              context.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${c[3]*n})`;
              context.fillRect(x, y, 1, 1);
            }
          }
        context.scale(this.m_pngUpscale,this.m_pngUpscale);

        return cv
    }
    
    

})


function HatchHeapDotted(lst,ctx,heap,group,h,opt) // HEAP function, converts a line into dots primitives
{	if(h&&h.l)
    {
        let map=ZMT.M_map,_=this,
        L = h.l,r0=h.w/4,r1=h.w/2*lst.amp, WH=(_.W+_.H)/2/20, shft=r0
        var multipleLines = L.m_isPolyLine;
        let nbLines = 1, currentLine;
        if( multipleLines)
            nbLines = L.M_nb()-1;			
        else currentLine = L;
        let b=opt?.blend??group.blend;

        // test pattern 
        
        let ctex,tname="tex"+h.c,pname="pat"+h.c
        lst[tname]??=_.M_getGrindTexture(h.c)
        lst[pname]??=ctx.createPattern(lst[tname], 'repeat')
        if(lst[pname])
        { ctex=lst[pname]; ctx.imageSmoothingEnabled=0
        }
        let dots=[];
        for( let iLine = 0; iLine<nbLines; iLine++)
        {   if( multipleLines)
                currentLine = L.M_getLine(iLine);
        
            let slope= new ZV2(currentLine.B.x-currentLine.A.x,currentLine.B.y-currentLine.A.y);
            let len = slope.M_length();
            if( len>0)
            {	let P=currentLine.A.clone();
    
                let u= new ZV2( slope.x/len, slope.y/len);	// unit vector along the line
                let step;
                for(let l=lst.s; l<=lst.s+len; l+=step)
                {
                    let noiz=Noz(l*lst.nk/WH,.5)
                    , r = map(noiz,-1,1,r0,r1)
                    ,shftFact=((1+Noz(P.x/_.W*5,P.y/_.W*5))/2)**3*lst.swipe  // TEMP TEST dispersion noise accross image
                    // shftFact = ((1+noiz)/2)**3*10           // TEMP TEST dispersion noise same as points ( interesting)
                    //shftFact = ((1+noiz)/2)**3*10               // Matching distortion : how to ? 
                    shft=r *shftFact // TEMP       
                    dots.push({x:P.x+shft*(lst.rnd()-.5) ,y:P.y+shft*(lst.rnd()-.5),r:r})
                    


                    // step along the line
                    step = r*lst.sep; //this.W/rndRange({min:3000,max:800},lst.rnd);
                    P.x += u.x*step;
                    P.y += u.y*step;
        
                }
                lst.s+=len
            }
        }
        if(dots.length)
        {
                    
            if(_._renderOn)
            {   
                let m={m:"dots",c:ctex??h.c,p:dots}
                if(b)m.blend=b                    
                if(opt?.heapFront) heap.splice(0,0,m); else heap.push(m);
                if(ctx)
                {   ctx.fillStyle=h.c
                    for(let d,i=0; i<dots.length;i++)
                    {   d=dots[i]
                        ctx.beginPath();
                        ctx.arc(d.x, d.y, d.r, 0, PI2, 0)
                        ctx.fill();
                    }
                }

            }


        }

        return 0
    }
    return 1
}

function HatchDotDistr(OBB,x,H)
{   let _=this
    if(!OBB.grid)    // init
    {   // compute size of grid
        H.rnd??=ZMT.newRnd()
        H.sz=rndRange(H.size,H.rnd)*_.u
        H.step=H.sz/12
        
        let g=OBB.grid={ni:Math.ceil(OBB.w/H.sz),nj:Math.ceil(OBB.h/H.sz),on:1}
        g.P=(x,y)=>OBB.o.M_plusU(OBB.I,x-0.5*OBB.w).M_plusU(OBB.J,y-0.5*OBB.h) 

        if(H.distr=="poisson")
        {
            g.dots=ZMT.poissonDisc(new ZRc(OBB.w,OBB.h),H.sz,H.rnd)
            g.imax=g.dots.length;
            if(g.imax<1)g.on=0
        }
        else
        {   g.imax=g.ni*g.nj
        }
    }
    let g=OBB.grid;
    if(g.on)
    {   let p
        if(g.dots)
        {   p=g.dots[x];
        }
        else
        {   let j=(x/g.ni)|0, i=x%g.ni
            p=new ZV2(i*H.sz,j*H.sz)
        }
        //console.log(`i=${i},j=${j}`)
        var L = H.hatchFunc.apply(this, [OBB,p.x,p.y,H] );
        
        x++;
        if(x<g.imax)
            return { x:x, L:L}        
    }

}
function HatchDot(OBB,x0,y0,H)
{   let g=OBB.grid,r=H.sz/2
    let P = g.P(x0+r,y0+r)
    let C=new RQCircle(P.x,P.y,r)
    return C._cP(-1,H.step)
}

function LSVarStroke(lst,Ls)
{
    let out=[]
    ,knx=lst.nk
    ,amp=lst.amp-1
    ,G=lst.group
    ,strk=lst.strokeWidth || (G?G.m_strokeWidth:this.m_strokeWidth)

    if(Ls && !this._skipLines)
    for(let j=0;j<Ls.length;j++)
    { 	let len=Ls[j].M_length(), L=lst.samp?Ls[j].M_sample(lst.samp):Ls[j]
        ,l=0,n=L.M_nb(),ky0,pPrev,Amp,prvAmp,t,isCl=L.M_isClosed()
        ,lenReduc=rndRange({min:1,max:4},Math.random)
        ,kReduc=Math.min(strk*lenReduc*2,len?len/lenReduc:1)
        ,pw=0.8
        
        let L1=new ZPL(), L2=new ZPL()

        

        // l= length of line 
        for(let i=0;i<n;i++)
        {  let p=L.M_getPoint(i);
            if(pPrev){
                let u=pPrev.M_minus(p);
                let d=u.M_length();
                if(d)
                {	l=Math.min(l+d,len)
                    t=u.M_rotate(90).Nz();
                }
            }
            pPrev=p;
            ky0??=knx*(p.y+p.x)/this.H
            
            if(1)Amp=strk*(1+amp*(1+Noz(knx*l/this.W,ky0))/2)
            else    // mode tangent
            {   if(t)
                {   let ang=Math.atan2(t.x,abs(t.y));
                    Amp=strk*(1+2*ang/PI)
                }

            }
            // reduction at tips
            let is0= l/kReduc<1,is1=(len-l)/kReduc<1
            if(is0)
            {   let f=(l/kReduc)**pw
                Amp*=lst.e0*(1-f)+f
            }
            else if(is1)
            {   let f=((len-l)/kReduc)**pw
                Amp*=lst.e1*(1-f)+f
            }

            if(t)
            {   //console.log(`${t.M_getString()} Amp=${Amp} strk=${strk} amp=${amp} l=${l} ky0=${ky0}`)
                L1._aP(p.M_plusU(t,-Amp/2))
                L2._aP(p.M_plusU(t,Amp/2))
            } else L1._aP(p.clone())

            prvAmp=Amp;
            
        }
        // joint lines 
        L1.M_appendReverse(L2)
        L1.M_closePath()
        // draw to fill heap 
        if(this._renderOn)
        {
            if(this.isSVG())
            {   out.push(L1)
            }else
            {
                let lines =L1._gS(0), 
                path = new Path2D(lines),
                color =this.M_getColorFunc(G,L1) ?? this.M_getGroupColor(G),
                h={m:"fill",c:color,path:path,l:L1,test:1},
                ctx=this._o._X()
                this.mHL.push(h)
                ctx.fillStyle=color
                ctx.fill(path);
                
        
            }
        }
    }
    return out;
}


//SCRIPT: http://localhost:8888/Patterns//Data/Js/Utils/Longform.js?v=1681489318

// FEATURES

const FT=(percent,featureValue,opts)=>{return {name:featureValue,odds:percent/100,opts:opts}}
var _forceFT={},_FTs={},_PMs={},_LF,_FTRnd,_FTRnd2,_FTon=1

function getRandomFeature(featureName, FTs,cb,isPblc,rng)
{ 
  if(_FTon)
  {  let i,n=0,r=(rng??_FTRnd)()
    isPblc??=1
    //console.log(`getRandomFeature "${featureName} rnd=${r}"`);
    if(_forceFT.hasOwnProperty(featureName))
    { 
        for(i=0;i<FTs.length;i++)
        {   if(FTs[i].name==_forceFT[featureName]) 
            {   if(isPblc)_FTs[featureName]=FTs[i].name;
                //console.log(` -->forcing ${FTs[i].name}`);
                if(cb) cb(FTs[i].opts);
            return FTs[i].opts;
            }
        };
    
    }
    FTs.map((f)=>{n+=f.odds})
    
    if(n>0)
    { let a=0
        r*=n
        for(let i=0;i<FTs.length;i++)
        { if((r-a)<FTs[i].odds)
        { if(isPblc)_FTs[featureName]=FTs[i].name;
            //console.log(` -->selecting ${FTs[i].name}`);
            if(cb) cb(FTs[i].opts);
            return FTs[i].opts;
        }
        a+=FTs[i].odds;
        }
        
    }
  }
  return {};
}

// 
const fc_="function",
isFxh = typeof fxrand==fc_,
isAB = typeof Random==fc_

// VARIABLES ACCESS
function initLongform(v)
{
    const P=ZPA.prototype,log=console.log
    var hash,bypassSeed,hasPreset
    
    
    // Read longform setup
    _LF=readLongform.bind(A)(v,{useIf:isFxh,preset:_forceFT['preset']})

    // loading preset
    if(_LF)
    {   _FTon = _LF.active
        let s=_LF.found
        if(s)
        {   console.warn(`using preset seed "${s.n}" hash=${s.h} param=${RQPrintR(s.p) }`)
            hash=s.h
            if(s.p)
                _forceFT=s.p
            hasPreset=1
        }
    }

    //A.M_fire 
    // INIT GENERATIVE PLATFORM

    // fxhash
    if( isFxh&&!hasPreset)
    {   let isMinterRnd=_LF?.m_rngType=='minter'
         hash??=fxhash,log("Mode:fx(hash)")
        _FTRnd=isMinterRnd? fxrandminter:fxrand
        _FTRnd2=isMinterRnd?fxrand:fxrandminter
        log("FxHash")
        bypassSeed=1
        //TODO: fxrandminter

    }   
    // artblocks
    else if(isAB && v.seed.E==0)
    {   log("Mode:ArtBlocks")
        v.seed.E=hash=tokenData.hash
        bypassSeed=1
        abrand??=new Random()
        _FTRnd=abrand.random_dec.bind(abrand)
        console.log(RQPrintR(tokenData));
    }
    // patterns
    else
    {   console.log("Mode ZPattern"); 
    
        // MZREMOVENOT§ 
        // if(hash&&hash.substring(0,2)=='oo')
        _FTRnd=getFxRNG(hash)
        bypassSeed=1
        ZMT.newRnd =function (seed,txt){return fxHashSf32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed??0)}

        /*else
        {   hash=parseInt(v.seed.E ||= Math.round(Math.random()*1E5));
            log(`Patterns seed=${hash}`)
            _FTRnd=ZMT.newRnd(hash)
        }*/
        // §MZREMOVENOT
    }

    console.log(`hash=%c${hash}`,"color:green;font-weight:bold;");
    if(Object.keys(_forceFT).length)
    console.log(`forcedFt=%c${JSON.stringify(_forceFT)}`,"color:green");
    //console.log(`_FTRnd=${RQPrintR(_FTRnd)}`)
        
    // Running the randomness a bit
    for(let i=7+_forceFT['Seed variant']??22;i;i--) _FTRnd()

    // Overload the seed and random function
    if(bypassSeed)
    P.M_seed=function(seed,i)
    {   
        if( _und(i) || i==0)
        {   this.m_seed = seed;
            this.random = _FTRnd; 
            for (var i2 = 0; i2 < 15; i2++) this.random()
        }
        else
        {   //console.warn(`M_seed(${seed},${i} )`); 
            this["random"+i]=_FTRnd
        }      
    }

    // V access
    $G.getBgProp=(prop,bgType,name,index)=>{
        let bs=v.background.E,
        count=0
        for(let i=0;i<bs.length;i++)
        {   let b=bs[i]
            //console.log(`(bgType)m_name=${b.m_name} (name)m_title=${b.m_title}`)
            //console.log(RQPrintR(b,1));
           if(b.m_name==bgType && (_und(name) || b.m_title==name))
           {
                if(_und(index) || index==count)
                {    if(b._V.hasOwnProperty(prop))
                        return b._V[prop];
                     return null;
                }
                count++;
           }
        }
        return null;
    }

    $G.setBgProp=(prop,value,bgType,name,index)=>{ 
        let b;
        if( b=getBgProp(prop,bgType,name,index) )
        {  b.E=value;
        }
    }

    $G.setBgOpt=(prop,opt,value,bgType,name)=>{ 
        let b,o;
        if( (b=getBgProp(prop,bgType,name)) && (o=b._O) )
        {   o[opt]=value;
        }
    }
    $G.getSpecy=(type,name)=>{
        let Ss=v.species?.E;
        if(Ss)
        for(let i=0;i<Ss.length;i++)
        { let s=Ss[i]
            //
            if(s.m_name==type && (_und(name) || s.m_title==name))
            { 
                return s._V;
            }
        }
        return null;
    }
    $G.getSpecyPart=(tag,part,partName,specyType,specyName,partIndex)=>{
        let s = getSpecy(specyType,specyName)
        if(s){
            let a=s.addons.E,count=0
            for(let i=0; i<a.length; i++)
            {  let F=a[i];
                //
                if(F.m_name==part && (_und(partName) || F.m_title==partName))
                {   if(F._V.SvgObject.E==tag || _und(tag))
                    {   if(_und(partIndex) || count==partIndex)
                            return F._V;
                        count++
                    }
                }
            }

        }
        return null;
    }
    $G.getBgPart=(tag,part,partName,bgType,name,index)=>{

        let a = getBgProp("addons",bgType,name,index);

        if(a){
            for(let i=0; i<a.E.length; i++)
            {  let F=a.E[i];
                if(F.m_name==part && (_und(partName) || F.m_title==partName))
                {   
                    if(F._V.SvgObject.E==tag || _und(tag))
                        return F._V;

                }
            }
        }

        
    
    }
    $G.setSkyProperty=(p,va)=>setBgProp(p,va,"BackgroundLib");
    $G.setGradientProperty=(p,va)=>setBgProp(p,va,"BackgroundGradient");  
    $G.setTextureProperty=(p,va)=>setBgProp(p,va,"BackgroundTexture");
    $G.setHatchProperty=(p,va)=>setBgProp(p,va,"BackgroundHatch");

    


    // opts 
    // w,h: size with unit 
    // splits : array of {name:"" , groups:[groupNames] }
    P.installSvgExport=function(key,filenm,opts)
    {   document.body.addEventListener('keypress', function(e)
        {   if (e.key == key)
            {
              this.doDownloadSVG(filenm,opts);
            }
        }.bind(this));

    }          

    P.doDownloadSVG=function(fileName,opts)
    {   //let size=svgSize?`,{w:"${svgSize.w}",h:"${svgSize.h}"}`:""
        //lnk=`javascript:mySVG('${fileName}.svg'${size})`
        let a=NewElt("a",{class:"btnSVG",text:"download plotter file"})
        a.onclick=function(){mySVG(fileName,opts)}.bind(this)
        
        a.click(); 
    }

    $G.mySVG=async function(filename,opt)
    {
        if(A)
        {   opt??={}
            if(opt && opt.w && opt.h && A.svg)
            {   A.svg.setAttribute("width",opt.w);
                A.svg.setAttribute("height",opt.h);
            }
            let addUserData=(toSvg)=>{
                // put the data into a svg script
                if(opt.data)
                {   let dataStr=""
                    Object.keys(opt.data).map((k)=>{
                        dataStr+=`const ${k}=\`${opt.data[k]}\`;\n`;
                    })
                    let scrpt=NewEltNs('script',{name:"custom-data",appendTo:toSvg,html:dataStr})    
                }

            }
            await A._DLToSvg(true).then(()=>{
                // sort things
                if(opt.splits)
                {   
                    if(1)   // print groups
                    {
                        let gs=A.svg.querySelectorAll(`g`)
                        for(item of gs)
                        {   let count=item.childElementCount
                            if(count)
                                console.log(`Got g="${item.getAttribute("name")}" (${count})`);
                            else
                            {   //console.log(`removing group "${item.getAttribute("name")}"`);
                                item.remove()
                            }
                        }
                    }
                    
                    for(let i=0; i<opt.splits.length;i++)
                    {   let split=opt.splits[i]
                        let fName2=filename.replace(".svg",split.name+".svg")
                        // create new svg tag
                        var div =NewElt("div");
                        let svg=A.M_makeObjectSVG("svg"+split.name,A.W,A.H);
                        div.appendChild(svg);

                        addUserData(svg)


                        for(let j=0; j<split.groups.length; j++)
                        {   let n=split.groups[j]
                            let gs=A.svg.querySelectorAll(`g[name="${n}"]`)
                            for(item of gs)
							{   console.log("Got g = "+item.getAttribute("name"));
								svg.appendChild(item)
							}
                        }

                        let data=svg.outerHTML,
                        blob = new Blob([`<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n`+data.replace("><",">\r<")+"\r\n"], { type: 'image/svg+xml' });
                        saveAs(blob, fName2);

                    }
                }


                console.log("Let's plot this !");	
                addUserData(A.svg)		
                let data=A.svg.outerHTML,
                blob = new Blob([`<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n`+data.replace("><",">\r<")+"\r\n"], { type: 'image/svg+xml' });
                saveAs(blob, filename);
            });
        }
    }
    if(_UI)
        A.M_installPenAddon("Longform");
}
const fxHashSf32 = (a, b, c, d) => {
    return () => {
    a |= 0; b |= 0; c |= 0; d |= 0
    var t = (a + b | 0) + d | 0
    d = d + 1 | 0
    a = b ^ b >>> 9
    b = c + (c << 3) | 0
    c = c << 21 | c >>> 11
    c = c + t | 0
    return (t >>> 0) / 4294967296
    }
}
function getFxRNG(hash)
{
    let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    hash||= "oo" + Array(49).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('')
    let b58dec = str=>[...str].reduce((p,c)=>p*alphabet.length+alphabet.indexOf(c)|0, 0)
    let fxhashTrunc = hash.slice(2)
    let regex = new RegExp(".{" + ((hash.length/4)|0) + "}", 'g')
    let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
    //let sfc32_ = 
    return fxHashSf32(...hashes)

}

// Reads longform setup
function readLongform(v,opt)
{   
    opt??={}
    let gps = this.gPk("styles",["Longform"],1);
    for(let ia=0; ia<gps.length; ia++)
    {	let S = gps[ia]
        if(S.active = S.gB("activate",1))
        {   let useSeed= opt.useIf?opt.preset: S.M_get("useSeed"); 
            S.m_rngType= S.M_get('rng','hash')
            //console.log(`opt=${RQPrintR(opt)} trying preset :${useSeed} `);
            let sds= S.gPk("savedSeeds",["LFSeed"],1);
            for(let is=0; is<sds.length; is++)
            {   let s=sds[is],nm=s.M_get("name")
                if(useSeed && useSeed==nm)
                {   let p=s.M_get("params"),h=s.M_get("seed")
                    if(p) try{p=JSON.parse(p)}catch(e){console.error("Err JSON can't decode params ")}
                    S.found={n:nm,h:h,p:p}
                }
                // add to select 
                if(_UI)
                {   let e=S.M_getElt("useSeed")
                    if(e&&!$(e).find(`option[value="${nm}"]`).length)
                    {   NewElt("option",{appendTo:e,value:nm,text:nm})                       
                    }
                }

            }
            return S;
        }
    }
    return {active:0}
}



//SCRIPT: http://localhost:8888/Patterns//Data/Js/Algorithms/Trees.js?v=1681489318

class TreeBranchSegment
{
	constructor(P,Pproj,MV,l,segLength,radius)
	{
		this.P = P;				// 3D point of center
		this.Pproj=Pproj;		// 2D projected point
		this.MV = MV;			// Modelview at point
		this.l = l;				// branch length from the root
		this.segLength = segLength;	
		this.radius=radius;		// radius
	}


}


class TreeBranch
{
	
	constructor(tree,parentBranch)
	{
		this.m_tree = tree;
		this.m_parentBranch=parentBranch;
		this.m_isRoots = false;
		this.m_branches = [];
		this.m_leaves = [];
		this.m_segments = [];
		this.m_position = new ZV3();
		this.m_direction = new ZV3(0,1,0);
		this.m_radius = 0;
		this.m_branchLength = 0;
		this.m_lineLength = 0;		// length from the ground
		this.m_nbSegments = 0;
		this.m_isBackbranch=false;
		this.m_endBranchNb = {min:2,max:2}
				
	}
	// A() : returns this algorithm
	A()
	{
		return this.m_tree.m_A;	
	}
	T()
	{
		return this.m_tree;
	}
	M_setPosition(P)
	{
		this.m_position.M_set(P);	
	}

	M_setDirection(x,y,z)
	{
		this.m_direction.M_set(x,y,z);
	
	}
	M_setRadius(r,parentRadius)
	{
		this.m_radius=r;
		this.m_parentRadius = parentRadius;
	
	}
	M_setBranchLength(len,segmentLength)
	{
		this.m_segmentLength = Math.max(segmentLength, A.u);
		this.m_branchLength = len;  
	
	}
	M_getRadiusEnd()
	{ 	if( this.m_radiusEnd != undefined)
			return this.m_radiusEnd;
		else 
			return this.m_radius*this.m_tree.m_branchReductionFactor;	
	}
	M_getEndBranchNb()
	{	if( this.m_endBranchNb != undefined && typeof this.m_endBranchNb === 'number')
			return this.m_endBranchNb;
		else 
		{	let random = this.A()['randomDepth'+this.m_level];

			let isBugFix = this.m_isRoots || this.A().M_isUseVersion(2.2);
			if(isBugFix)
				 return Math.round(this.m_tree.m_endBranchNb.min + (this.m_tree.m_endBranchNb.max-this.m_tree.m_endBranchNb.min)*random());
			else
				return Math.round(this.m_endBranchNb.min + (this.m_endBranchNb.max-this.m_endBranchNb.min)*random());
		}
	}
	
	M_createBranch(lineLength,parentMV,direction)
	{
		let branch = new TreeBranch(this.m_tree,this);
		branch.m_level = this.m_level+1;
		branch.M_setBranchLength(this.m_branchLength*this.m_tree.m_branchLengthLevelFactor, this.m_segmentLength/**this.m_tree.m_branchLengthLevelFactor*/);
		branch.m_lineLength = lineLength;
		branch.m_parentMV = parentMV;
		branch.m_childBranchDirection=direction;
		branch.m_isRoots = this.m_isRoots;
		this.m_branches.push(branch);
		let  _=this.A()
		
		return branch;
	}

	M_run(MV)
	{
		//A.m_deformersActive = false;
		let Algo=this.A();
		let isEndChildBranch = this.m_parentMV !=undefined; 
		if( this.m_parentMV==undefined) this.m_parentMV = MV.clone();
		let random = Algo['randomDepth'+this.m_level];
		let rndShift;
		if(Algo.m_isRndNoise)
			rndShift = random();
		let isStop = false;
		let yStop;
		if( this.m_tree.m_yStop !=undefined && this.m_tree.m_yStop>10)
		{	isStop = true;
			yStop = A.Pj(this.m_tree.m_position).y-this.m_tree.m_yStop; 		
		}
		
		let count = 0;
		let P = this.m_position.clone();
		//this.A().M_log("Branch M_run level="+this.m_level+" P="+P.M_getString());
		let segmentLength = this.m_segmentLength;
		let Ylocal = new ZV3(0,1,0);
		let radiusEnd = this.M_getRadiusEnd();
		let currentRadius = this.m_radius;
		let Pproj;
		let ang=0;
		let lineLength = 0;
		let lengthReached = false;
		let endOfBranch = false;
		let thisBranchLength = (this.m_customBranchLength==undefined)?  this.m_branchLength :this.m_customBranchLength; 
		let lengthSign = this.m_isRoots?-1:1;
		let isStopped = false;
		while( !endOfBranch )
		{
			if(this.A().m_abort)
				return;
			let isFirstSegment = lineLength==0;
			let kLength = lineLength/thisBranchLength;
			currentRadius = ZMT.M_map(lineLength,0,thisBranchLength,this.m_radius,radiusEnd);	// TODO : first radius of isEndChildBranch == parentBranchLastRadius
			if( isEndChildBranch && this.m_parentRadius)
			{	 
				currentRadius= Math.max( radiusEnd*0.7+ (this.m_parentRadius-radiusEnd*0.7)*Math.exp( -2*kLength,2),currentRadius);			
			}
			Pproj = A.Pj( P);

			let segment = new TreeBranchSegment(P.clone(), Pproj, (isFirstSegment && isEndChildBranch)? this.m_parentMV :  MV.clone(), this.m_lineLength+lineLength,0, currentRadius );
			this.m_segments.push( segment );
									
			if( lengthReached )
				endOfBranch = true;
			else if( isStop && (Pproj.y*lengthSign > yStop*lengthSign) )
			{
				//Algo.M_log("stopping : yStop="+yStop+" Pproj.y="+Pproj.y+" this.m_tree.m_position="+this.m_tree.m_position.M_getString()+"/projected="+A.Pj(this.m_tree.m_position).y);
				endOfBranch = true;
				isStopped = true;
			}
			else 
			{
				count ++;

				// New branches ? 
				let generateBranches=(myRandom,info)=>{
					let isReturnValue = this.m_isRoots || Algo.M_isUseVersion(2.3);
					if(isReturnValue)
					{
						//Algo.M_log("Roots - generateBranches info="+RQPrintR(info,1));
					}
					let rnd=myRandom();
					if(rnd<info.rnd && this.m_level<this.m_tree.m_maxRecursionDepth)
					{	
						if( kLength>=info.height && this.m_level>=info.level)
						{
							if( P.y*lengthSign> (Algo.m_groundMargin+Algo.m_yStart)*lengthSign)
							{	
								let branchOpen = this.m_tree.m_branchOpenAngle;
								var branchAngle = branchOpen.min+(branchOpen.max-branchOpen.min)*myRandom();		// TODO : parametrize
								var branchDirection = myRandom()*360;		// direction around this branch
								let branch = this.M_createBranch(this.m_lineLength+lineLength);
								branch.M_setRadius(currentRadius*this.m_tree.m_newBranchRadiusFactor,currentRadius);


								while( branch.m_level <info.newLevel)
								{
									branch.m_level++;
									branch.m_lineLength +=branch.m_branchLength;  
									branch.m_branchLength*=this.m_tree.m_branchLengthLevelFactor;
									branch.m_radius *= this.m_tree.m_newBranchRadiusFactor;							
								}
								
								
								let branchMV = MV.clone();
								branchMV.M_rotate(branchDirection,0,1,0);			// place the new branch around this branch 
								branchMV.M_rotate(branchAngle,1,0,0);				// inclinaison of branch
								branch.M_setPosition(P.M_plus( branchMV._mBV(new ZV3(0,currentRadius*0.6,0) ) ) );
								branch.M_run(branchMV);
								if(isReturnValue)
								{	return true;
								}
							}
							else if(isReturnValue)
							{	//Algo.M_log("FALSE with P.y = "+P.y+" vs Algo.m_groundMargin="+Algo.m_groundMargin+" Algo.m_yStart="+Algo.m_yStart+" =>"+P.y+"<"+(Algo.m_groundMargin+Algo.m_yStart));
								return false;
							}
						}
						else if(isReturnValue)
						{	//Algo.M_log("FALSE with kLength = "+kLength+" vs info.height="+info.height+" level="+this.m_level+" vs info.level="+info.level);
							return false;
						}

					}
					else if(isReturnValue)
					{	//Algo.M_log("FALSE with rnd = "+rnd+" this.m_level="+this.m_level+" vs maxDepth="+this.m_tree.m_maxRecursionDepth);
						return false;
					}
				}
				//let info = this.T().m_intermediateBranch;	// height:0,level:0,newLevel:1});

				if( !generateBranches( random,this.T().m_intermediateBranch))
					generateBranches( Algo['randomYoung'], this.T().m_youngBranch);
				
				// Leaves
				if( this.m_tree.m_isLeaves && this.m_level>=(this.m_tree.m_maxRecursionDepth-1) && Algo.randomLeaves()<Algo.m_leafRndDensity) 
				{
					if( P.y> (Algo.m_groundMargin+Algo.m_yStart))
					{
						var leafDirection = Algo.randomLeaves()*360;		// direction around this branch

						let MVLeaf = MV.clone();
						MVLeaf.M_rotate(leafDirection,0,1,0);			// place the new branch around this branch 
						MVLeaf.M_rotate(30,1,0,0); 
						let PLeaf = P.M_plus( MVLeaf._mBV(new ZV3(0,currentRadius,0) ) ) ;
						//let PLeafproj = new ZV2(PLeaf.x, Algo.mwA.top()-PLeaf.y + PLeaf.z*Algo.m_perspectiveFactor);				
						let PLeafproj = A.Pj( PLeaf);


						this.m_leaves.push([PLeafproj,MVLeaf]);
					}
					//Algo.M_drawLeaf(Pproj.clone(),MVLeaf,this.m_tree.m_leafOpts);
				
				}
				// Avance to next segment
				let thisSegmentLength = segmentLength;


				
				// change direction at next point
				let isForceAng = (count<3) && isEndChildBranch && this.m_childBranchDirection!=undefined;  
				if(isForceAng)
				{	
					if( isFirstSegment)
						MV = this.m_parentMV.clone();
					// use this.m_parentMV
					ang = this.m_childBranchDirection/3;
				}
				else
				{
					let rnd1,rnd2;
					if(Algo.m_isRndNoise)
					{	rnd1  = Noz(rndShift +2*lineLength/Algo.W*Algo.m_noiseFactor.x,lineLength/Algo.H*Algo.m_noiseFactor.y);
						rnd2  = 0.5*(1+Noz(1.5*rndShift+lineLength/Algo.W*Algo.m_noiseFactor.x,lineLength/Algo.H*Algo.m_noiseFactor.y));
					}
					else
					{	rnd1 = random();
						rnd2 = random();
					}	
					MV.M_rotate(rnd1*360,0,1,0);				
					ang= this.T().m_rndAngleSpan * 0.5*rnd2*(1.0+this.m_level*0.2);
				}
				let displ = currentRadius*sin(ang*D2R);
				let spacingMax = segmentLength/4;
				if( displ>(segmentLength-spacingMax))
				{	let decal = displ - (segmentLength-spacingMax);
					thisSegmentLength += decal;
				}
			
				// Now set last segment's length
				if( lineLength>= thisBranchLength)
				{
					lengthReached = true;
					thisSegmentLength = lineLength-thisBranchLength;
					P.M_add(segment.MV.mRV(Ylocal).M_mul(thisSegmentLength));
					// ( do not rotate matrix on last segment )
				}
				else
				{
					P.M_add(segment.MV.mRV(Ylocal).M_mul(thisSegmentLength));
					if( this.m_tree.m_gravity)
					{
						// compute an orientation
						let Y = MV.mRV(Ylocal);
						let gravityAmount = (1-(0.5+0.5*Y.M_dot(this.m_tree.m_gravity)))*0.3;
						P.M_add(this.m_tree.m_gravity._mB(thisSegmentLength*gravityAmount) );
						// TODO :::: 
					}
					
					//if( !isForceAng)
					MV.M_rotate(ang,1,0,0);
				
				}
				lineLength  += thisSegmentLength;
				segment.segLength = thisSegmentLength;
			
			
			}

		}
		thisBranchLength = lineLength;
		if( this.m_customBranchLength==undefined)
			this.m_branchLength = lineLength;

		// End branch / leaves
		if( count>0)
		{	
			if(!isStopped)
			{
				let putLeaves = this.m_level==this.m_tree.m_maxRecursionDepth;

				let nb,angleSpan; 
				if( putLeaves)
				{	let e=this.m_tree.m_endBranchNbLeaves;
					nb=e.min + Math.round((e.max-e.min)*Algo.randomLeaves());  
					angleSpan = this.m_tree.m_endBranchLeafAngleSpan;
				}
				else 
				{	nb = this.M_getEndBranchNb(); 
					angleSpan = (0.4+0.8*random())*Algo.m_endBranchAngleSpan;
			
				}
				
				for( var i=0; i<nb;i++)
				{	
					
					if(putLeaves)
					{	if(this.m_tree.m_isLeaves && ( P.y> (Algo.m_groundMargin+Algo.m_yStart)))
						{	
							var newDirection = (nb==1?  (-0.5+Algo.randomLeaves())*angleSpan : (-0.5 + i/(nb-1))*angleSpan ) ;
							let MVLeaf = MV.clone();
							//MVLeaf.M_rotate(leafDirection,0,1,0);			// place the new branch around this branch 
							MVLeaf.M_rotate(newDirection,1,0,0); 
							
							this.m_leaves.push([Pproj.clone(),MVLeaf]);

							//Algo.M_drawLeaf(Pproj.clone(),MVLeaf, this.m_tree.m_leafOpts);
						}else
						{
							//console.log("Drawing no leaf : m_isLeaves="+(this.m_tree.m_isLeaves?"true":"false")+" P.y="+P.y+" Algo.m_groundMargin="+Algo.m_groundMargin+" Algo.m_yStart="+Algo.m_yStart);
						
						}
					}
					else // send a branch
					{	
						let randomOfBranch = Algo["randomDepth"+(this.m_level+1)];
						let newDirection;
						let branchMV = MV.clone();
						if( this.m_endBranchAngle != undefined)
						{	newDirection = this.m_endBranchAngle.min + randomOfBranch()*(this.m_endBranchAngle.max-this.m_endBranchAngle.min);
							MV.M_rotate( 360/nb, 0,1,0);
						}
						else
							newDirection = (nb==1?  (-0.5+randomOfBranch() )*angleSpan : (-0.5 + i/(nb-1))*angleSpan ) ;
						let branch = this.M_createBranch(this.m_lineLength+lineLength,MV.clone(), newDirection);
						branch.M_setPosition(P);
						
						let factor=this.m_customRadiusFactor;
						if( factor && factor.min )	// means custom
							factor = factor.min + (factor.max-factor.min)*randomOfBranch();
						else
							factor =this.m_tree.m_branchEndRadiusFactor; 
						branch.M_setRadius(radiusEnd*factor,radiusEnd);
						
						branchMV.M_rotate(newDirection,1,0,0);				// inclinaison of branch
						branch.M_run(branchMV);
					}
				}

			}

			// tells if it's back or front branch
			{
				let Nlocal = new ZV3(0,-1,0);
				let Nw = this.m_segments[0].MV.mRV(Nlocal);
				this.m_isBackbranch = Nw.M_dot(Algo.m_toEyeVector)>0;
			

			}	


			// set splines for V vectors
			if(false)
			if( count>=2)
			{
				count = this.m_segments.length;
				for(let i=0; i<(count-1); i++)
				{	this.m_segments[i].V = this.m_segments[i+1].P.M_minus(this.m_segments[i].P).Nz();				 
				}
				let vEnd = this.m_segments[count-1].V = this.m_segments[count-2].V;

				// make spline
				let v0 = this.m_parentMV._mBV(new ZV3(0,1,0)).Nz();
						
				for(let i=0; i<(count-1); i++)
				{
					let S = this.m_segments[i];
					S.m_VSpline = new CatmullRomSpline( i>0? this.m_segments[i-1].V : v0,  S.V, this.m_segments[i+1].V, i<(count-2)?this.m_segments[i+2].V :vEnd)
					//console.log("Branch level="+this.m_level+" seg="+i+"/"+count+" "+S.m_VSpline.M_getString());
				
				}
			}
		}
		

				
	
	}
	M_drawLeaves()
	{
		let Algo = this.A();
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{		this.m_branches[ib].M_drawLeaves();
		}
		// draw this branch's leaves
		for( let il=0; il<this.m_leaves.length; il++)
		{	
			Algo.M_drawLeaf( ...this.m_leaves[il], this.m_tree.m_leafOpts);
		}

		A.m_deformersActive = false;	
	
	}
	async M_draw()
	{
		// draw front children branches
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(!this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_draw();
		}
		let Algo = this.A();
		//await sleep(1);
		// Draw Grass in front 
		if( this.m_isTrunk)
		{
			if( Algo.m_grass && Algo.m_grass.m_isActive)
			{
				this.M_drawGrass("front");
			}
		
		}

		// draw this branch	
		if( this.m_segments.length>=2)
		{
			let L1 = new ZPL();
			let L2 = new ZPL();
			let L = new ZPL();
			let startArc,endArc;
			let nbSegments = this.m_segments.length;
			let uProjStart,uProjEnd;
			for( let i=0; i<nbSegments; i++)
			{	
				let isStartPoint = i==0;
				let isEndPoint = i==(nbSegments-1);
				let s = this.m_segments[i];
				let O = s.P;
				let Oproj = s.Pproj;
				L._aP( Oproj);	// centerline ( temp )
				let drawBranchSegment = Algo.m_isDrawBranchSegments;
				if( true )	// draw arcs
				{
					let MV = s.MV;
					let isCapVisible = false;
					if( isStartPoint || isEndPoint )
					{
						let Nlocal = new ZV3(0,isStartPoint?-1:1,0);
						let Nw = MV.mRV(Nlocal);
						isCapVisible = Nw.M_dot(Algo.m_toEyeVector)>=0;
						let uPrj = Algo.Pj(Nw,new ZV2(0,0)).Nz()._mB(-0.2*Algo.u);
						if(isStartPoint) uProjStart=uPrj;
						else uProjEnd = uPrj;
					}
					let arc;
					arc = this.M_getSegmentArc(true,s,50);
					
					if( isStartPoint && !isCapVisible )
						startArc = arc;
					else if( isEndPoint && !isCapVisible)
						endArc = arc;
					else 
					{	
						if(drawBranchSegment)
							A._DL(Algo._g.BranchFill,arc,true);
							//Algo._g.BranchFill.m_lines.push( ...Algo.M_computeLineMask(arc));
								
						if( isStartPoint)
							startArc =this.M_getSegmentArc(false,s,50); 
						else if( isEndPoint)
							endArc =this.M_getSegmentArc(false,s,50); 
					}
					// Left and right lines
					if( arc )
					{
						L1._aP( arc.M_getPoint(0));									
						L2._aP( arc.M_endPoint());									
					}
				}

			}
			// draw 
			// compute the closed shape

			L1.M_reverseOrder();
			if( this.m_level>=this.T().m_drawBranchContourLevel)
			{
				A._DL(Algo._g.Branches,L2,true);
				A._DL(Algo._g.Branches,L1,true);
				
			}
			if( L2.M_endPoint().M_dist(endArc.M_getPoint(0) ) >  L2.M_endPoint().M_dist(endArc.M_endPoint() ) ) endArc.M_reverseOrder();

			let contour = L2.clone();
			contour.M_append(endArc);
			contour.M_append(L1);
			
			if(false) // if we want the end arc
			{
				A._DL(Algo._g.Branches,endArc,true);

			}
			
			if( contour.M_endPoint().M_dist(startArc.M_getPoint(0) ) >  contour.M_endPoint().M_dist(startArc.M_endPoint() ) ) startArc.M_reverseOrder();

			contour.M_append(startArc);			
			this.M_fill(contour);

			// we need a shorter contour on start/end for the mask, in order to allow junction of branch hatch fill. 
			// so we move the startArc points ( which are references )
			if(true)
			for(let i=0;i<startArc.mP.length; i++)
			{
				startArc.mP[i].M_add(uProjStart);
			}
			if(false)
			for(let i=0;i<endArc.mP.length; i++)
			{
				endArc.mP[i].M_add(uProjEnd);
			}
			this._dM(contour,L1,L2);

		}
				
		// draw back children branches
		for( let ib=0; ib<this.m_branches.length; ib++)
		{	if(this.m_branches[ib].m_isBackbranch) 
				 this.m_branches[ib].M_draw();
		}
		// Draw Herb+Ground
		if( this.m_isTrunk)
		{
			
			if( Algo.m_grass && Algo.m_grass.m_isActive)
			{
				this.M_drawGrass("back");
			}
			
			if( Algo.m_ground && Algo.m_ground.m_isActive)
			{
				this.M_drawGround();
				//if(Algo.m_ground.m_earthPlane=="front")
				this.M_drawEarth("front");			
			
			}
		
		
		}
	
	}
	M_getSegmentArc(frontArc,s,nbCirclePoints)
	{
		let Algo = this.A();
		let MV 		= s.MV;
		let Oproj	= s.Pproj;
		let circle1 = new ZPL();
			
		{
			let vy = MV.mRV(new ZV3(0,1,0));
			let Z = Algo.m_toEyeVector;
			let X = vy.M_cross(Z).Nz();
			Z= X.M_cross(vy);
			let a = 0;
			let aInc =(frontArc? PI : -PI)/nbCirclePoints;
			for( let i=0; i<nbCirclePoints;i++)
			{
				let r = s.radius;
				let co=cos(a)*r;
				let si=sin(a)*r;
				let P = new ZV3( - X.x*co + Z.x*si, -X.y*co + Z.y*si, -X.z*co + Z.z*si); 
				circle1._aP(A.Pj(P,Oproj));
				a+=aInc;
			}
		}	
		
		
		
		return circle1;
	
	}
	_dM(shape,L1,L2)
	{
		let Algo = this.A();
		if( shape && Algo.m_drawBranchMask)
		{
			var path = new Path2D(shape._gS(true));
			let context = Algo.m_mask._X();
			context.fillStyle = "white";
			context.fill(path);
			
		    //the draw in mask shouldn't protect too much on top and bottom of the branch segment. How do we handle this ... 
			/*if( true)	// test
		   {   context.lineWidth = 0.2*2*Algo.u;
			   context.strokeStyle = "black";
			   context.stroke(new Path2D(shape._gS(false)));
		   }*/

		   if( Algo.m_isShortenJunctions)
		   {   context.lineWidth = Algo.m_protectionStrokeWidth*2;
			   context.strokeStyle = "white";
			   context.stroke(new Path2D(L1._gS(false)));
			   context.stroke(new Path2D(L2._gS(false)));
		   }


		}
	}
	M_fill(shape)
	{
		let Algo = this.A();
		let fills = null; 
		if( this.m_isRoots && Algo._g.Roots)
			fills = Algo._g.Roots.fills;
		if( fills==null || !isArr(fills) )
			fills = Algo._g.BranchFill.fills;
		if( isArr(fills) )
		{
			let orientation,lighting,isComputed=false;
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];

				
				if( F)
				{	
					F.branch = this;
				
					// compute the average direction
					if(!isComputed)
					{	isComputed=true;
						let nbSegments = this.m_segments.length;
						let dirMedian = new ZV3();
						let nbDirs = 0;
						for( let i=0; i<nbSegments-1; i++)
						{	
							let dir = this.m_segments[i+1].P.M_minus( this.m_segments[i].P ); 
							dirMedian.M_add(dir);
							nbDirs++;
						}
						dirMedian.M_mul(1/nbDirs).Nz();
						let N = Algo.m_toEyeVector.M_cross(dirMedian).Nz();
						lighting = (1+N.M_dot(Algo.m_lightSource))*0.5;
						lighting*=lighting;
	
						// project dirMedian for orientation 
						//let dirProj = A.Pj(dirMedian,null);	// new ZV2(dirMedian.x, -dirMedian.y + dirMedian.z*Algo.m_perspectiveFactor);				
						orientation = Algo.M_projectedOrientation(dirMedian);
	
					}
					F.orientation = orientation;
					F.spacing=  ZMT.M_map( lighting,0,1,F.m_spacing.min , F.m_spacing.max);
					Algo._Fl(F,shape,F);
				
				}
			}
		}
	
	}


};
var _treeBarkNoise= Noz;
class Tree extends TreeBranch 
{
	constructor(algorithm)
	{
		super(null, null); 
		// versions 
		// 2.0		
		// 2.2			- correction bug number of end branches 
		// 2.3			- correction bug on new branches
		this.m_version 			= 2.3;		

		this.m_tree  = this;
		this.m_rootBranch=false;
		this.m_isTrunk = true;
		this.m_A = algorithm;				// algo				
		this.m_rndAngleSpan 	= algorithm.m_rndAngleSpan;
		this.m_branchRndDensity = algorithm.m_branchRndDensity;
		this.m_maxRecursionDepth= algorithm.m_maxRecursionDepth;
		this.m_branchLengthLevelFactor = algorithm.m_branchLengthLevelFactor;
		this.m_branchEndRadiusFactor = algorithm.m_branchEndRadiusFactor;
		this.m_newBranchRadiusFactor = algorithm.m_newBranchRadiusFactor;
		this.m_branchReductionFactor = algorithm.m_branchReductionFactor;
		this.m_branchOpenAngle		= algorithm.m_branchOpenAngle;
		this.m_endBranchLeafAngleSpan = algorithm.gF("endBranchLeafAngleSpan",90);
		this.m_endBranchNbLeaves 	= algorithm.gI("endBranchNbLeaves",{min:1,max:3});
		this.m_intermediateBranch = algorithm.gF("intermediateBranches",{height:0,level:0,newLevel:1});
		this.m_intermediateBranch.rnd = this.m_branchRndDensity;

		this.m_youngBranch = algorithm.m_youngBranch;
		this.m_drawBranchContourLevel = algorithm.gI("drawBranchContourLevel",0);
		this.m_isLeaves = algorithm.m_isLeaves;
		this.m_isAllLeavesFront = algorithm.gB("isAllLeavesFront",false);
		this.m_level = 0;
		this.m_leafShape		= algorithm.M_get("leafShape","default");
		this.m_parentMV 		= new RQMatrix4();
		this.m_endBranchNb		= algorithm.gI("rootEndBranchNb",{min:2,max:2});
		switch(this.m_leafShape)
		{
			case "Default":
			default:
				this.m_leafOpts = {profile:algorithm.M_defaultLeafProfile, segments: 20,ratio:0.8};
				break;

			case "Oak":
				this.m_leafOpts = {profile:algorithm.M_oakLeafProfile, invProfile: algorithm.M_mintLeafInvProfile, oakSpikes:12, segments: 60, ratio:0.625, centerLine:true};
				break;

			case "Ash":
				this.m_leafOpts = {profile:algorithm.M_ashLeafProfile,organizeFun: algorithm.M_ashOrganize, ashLeaves:4.5,segments:150,ratio:0.9,stemRatio:0,centerLine:false};
				break;		
			case "Mint":
				this.m_leafOpts = {profile:algorithm.M_mintLeafProfile, segments: 30,ratio:0.9};
				break;
			case "Poplar":
				this.m_leafOpts = {profile:algorithm.M_poplarLeafProfile, segments: 40,ratio:1.3};
				break;
		}
		this.m_leafOpts.isMask = algorithm.m_drawLeafMask;
	}
	M_makeRoots()
	{
		let R;
		let Algo = this.A();
		let nbRoots = Algo.m_roots.m_nbRoots;

		// reseed
		if( Algo.m_roots.m_seed>-1)
			Algo.M_makeRandomFunctions(Algo.m_roots.m_seed);


		this.m_roots=R=new TreeBranch(this,this);
		
		
		this.m_branchEndRadiusFactor/=2;
		this.m_youngBranch = Algo.m_roots.m_youngBranch;
		this.m_intermediateBranch = Algo.m_roots.m_intermediateBranch;
		this.m_rndAngleSpan = Algo.m_roots.m_rndAngleSpan;
		this.m_yStop = Algo.m_roots.m_yStop;
		//Algo.M_log("Roots : using youngBranch = "+RQPrintR(this.m_youngBranch,1));
		this.m_maxRecursionDepth = Algo.m_roots.m_maxRecursionDepth;
		R.m_level = 0;
		R.m_isRoots = true;
		R.m_parentRadius=this.m_radius;
		R.m_radiusEnd = R.m_radius = this.m_radius;
		R.M_setBranchLength( this.m_branchLength*0.5/*this.m_segmentLength*/,this.m_segmentLength);
		R.m_customBranchLength = this.m_radius/2;
		R.m_customRadiusFactor =  Algo.m_roots.m_rootsRadiusFactor;
		R.m_lineLength = 0;
		R.M_setPosition(this.m_position);
		R.m_endBranchNb = nbRoots;
		R.m_endBranchAngle = Algo.m_roots.m_rootsEndBranchAngle;
		Algo.m_groundMargin = 0;
		this.m_branchLengthLevelFactor = Algo.m_roots.m_branchLengthLevelFactor;
		
		let MV = this.m_parentMV.clone();
		MV.M_rotate(180,1,0,0);
		this.m_gravity=new ZV3(0,-1,0);
		this.A().m_isLeaves = false;
		let angleSpan = 60;
		
		if( false)
		{	for( let n=0; n<nbRoots; n++)
			{
				var newDirection = angleSpan;
				let branch = R.M_createBranch(0,MV.clone(), newDirection);
				branch.M_setRadius(this.m_radius*0.3,this.m_radius);					
				let branchMV = MV.clone();
				branchMV.M_rotate(360*n/nbRoots,0,1,0);				// distribution
				branchMV.M_rotate(newDirection,0,0,1);				// inclinaison of branch
				branch.M_setPosition(this.m_position); //.M_plus(branchMV.mRV(new ZV3(0,this.m_radius/2,0) )));
				branch.M_run(branchMV);
			}
		}
		else
			R.M_run(MV);

	}
	M_draw()
	{
		let frontLeaves = this.m_isAllLeavesFront;

		// draw front leaves
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(frontLeaves || !this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_drawLeaves();
		}
		// draw leaves
		let Algo = this.A();
		for( let il=0; il<this.m_leaves.length; il++)
		{
			 Algo.M_drawLeaf( ...this.m_leaves[il], this.m_leafOpts);
		}

		// draw the tree
		 super.M_draw();
	
		// draw back leaves
		if(!frontLeaves)
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(this.m_branches[ib].m_isBackbranch) 
				 this.m_branches[ib].M_drawLeaves();
		}
		
	
	
	}
	M_drawGrass(side)
	{
		
		let Algo = this.m_A;
		Algo.M_log("M_drawGrass");
		let S = Algo.m_grass;
		if( S)
		{
			
			let pProj = A.Pj(this.m_position);
			let scale = 1.;
			let range;
			let yMin = pProj.y - S.m_dimensions.depth/2*Algo.m_perspectiveFactor-S.m_y; 
			let yMid = pProj.y-S.m_y;/*+this.m_radius*Algo.m_perspectiveFactor*/
			let yMax = pProj.y + S.m_dimensions.depth/2*Algo.m_perspectiveFactor-S.m_y; 
			if( side=="front")
				range={init:yMax, min:yMid}
			else if( side=="back")
				range={init:yMid, min : yMin}

			let mid = Algo.mwA.center().x;
			S.A.m_xBounds={min: mid-S.m_dimensions.width*0.5, max: mid+S.m_dimensions.width*0.5}
			if( range!=undefined)
			{
				for ( let y = range.init; y > range.min; )
				{
					scale = ZMT.M_map(y,yMin,yMax,S.m_depthScaleFactor, 1);
					S.A.M_makeLineOfGrass(y,scale);
					y-= 4*Algo.u*scale;
				}
			
			}
		
		
		
		}
	}
	M_drawGround()
	{
		let Algo = this.m_A;
		let S = Algo.m_ground;
		if( S )
		{
			let points = [];
			let ind = [-1,1,1,1,1,-1,-1,-1];
			let C = Algo.mwA.center();
			let perspective =Algo.m_perspectiveFactor/3; 
			let xdecal = perspective*S.m_dimensions.depth/3;
			var earthL ;
			for( let i=0; i<8; i+=2)
			{	let P = new ZV3(C.x+ind[i]*S.m_dimensions.width/2+ind[i+1]*ind[i]*xdecal,this.m_position.y+S.m_y,this.m_position.z+ind[i+1]*S.m_dimensions.depth/2) ;  
				points.push( A.Pj( P));
			}
			let _A = points[0].clone();
			let _B = points[1].clone();
			points.push(points[0].clone());
			if(S.m_noiseContour.amplitude!=0 && S.m_noiseContour.fact !=0)
			{
				let noiseOffset =-this.T().m_position.x; 
			
				let pts2 = [];
				let segLength = 1*Algo.u;
				for( let j=0; j<4; j++)
				{
					let AB = points[j+1].M_minus(points[j]);				
					let l = AB.M_length();
					let nbPoints = l / segLength;
					let s=segLength;
					let y=0;
					AB.M_mul(1/l);					
					for( let i=1; i<=nbPoints; i++) 
					{
						let P = points[j].M_plus(AB.x*s,AB.y*s);
						let rnd = Noz( (P.x-noiseOffset)*S.m_noiseContour.fact/l,P.y*S.m_noiseContour.fact/l);
						P.y+=rnd*S.m_noiseContour.amplitude/2;
						pts2.push(P);
						s+=segLength;
					}
					if( j==0)
						earthL = new ZPL([...pts2]);
				}			
				points=pts2;
			}
			let L = new ZPL(points);
			//Algo.M_log("Ground L="+L.M_getString());
			//L.M_closePath();

			let Fs = Algo._g.Ground.fills;
			let F;
			if(Fs)
			for( let f=0; f<Fs.length; f++)
			{
				if( F =Fs[f])
				{
					// contour
					if(S.m_isDrawContour)
					{	//F.m_lines.push( ...Algo.M_computeLineMask(L) );			
						A._DL(F,L,true);
					}
					// Hatch 
					F.orientation= 0;	// orientation
					F.spacing=  F.m_spacing.average;
					//Algo.M_log("F.spacing = "+F.spacing);
					//F.jointEnds=true;
					//F.m_lines.push( ...Algo.M_hatchShape( L ,F)); 
					Algo._Fl(F,L,F);
				
				}
				if(S.m_isDrawInMask)
				{
					let pathPoints = L._gS(false);
					var path = new Path2D(pathPoints);
					if(Algo.m_mask)
					{	
						var context = Algo.m_mask._X();			
						context.fillStyle = "white";
						context.fill(path);
					}	
				
				}
			}
			// Earth
			if( S.m_earthHeight >0 )
			{
				earthL._aP(_B.M_plus( 0,S.m_earthHeight) );
				earthL._aP(_A.M_plus( 0,S.m_earthHeight) );
				earthL.M_closePath();
				this.m_earthL = earthL;
				
				
			}
			else
				this.m_earthL = 0;
		}
	
	}
	M_drawEarth(plane)
	{
		let Algo = this.m_A;

		if(this.m_earthL)
		{
			// Test
			//Algo.m_hatchTexture = Algo.m_mask;
			
			let Fs;
			if( plane=="front")
				Fs = Algo._g.EarthFront.fills;
			else 
				Fs = Algo._g.Earth.fills;
			let F;
			if( Fs )
			for( let f=0; f<Fs.length; f++)
			{
				if( F =Fs[f])
				{
					if(plane=="front")	// TEMP
						F.spacingFunc = Algo.M_earthSpacingFunc;
					F.spacing=  F.m_spacing.average;
					//F.m_lines.push( ...Algo.M_hatchShape( this.m_earthL ,F)); 
					Algo._Fl(F,this.m_earthL,F);
				}
			}
		}
	
	
	}

};

class TreesAlgorithm extends ZPA
{
	constructor()
	{
		super("Trees");
		this.svg=null;
		this.m_lines =[];
		this.m_stemLinesBack=true;
	}

	M_getHatchFunction(name,H, vars)
	{
		console.log("M_getHatchFunction "+name);
		if(H==undefined) H = this;
		if(vars==undefined) vars = H;
		if( name =="TreeBranch")
		{
			H.m_amplitude	= vars.gF("amplitude",0.5); H.m_amplitude*=this.u; 	
			H.m_barkNoiseFactor = vars.gF("barkNoiseFactor",{x:120, y:28});	
			H.m_torsion= vars.gF("barkTorsion",30);
			H.inStencilLineCut = vars.gB("inStencilLineCut",true);
			H.lightingAmplitude = vars.gB("lightingAmplitude",false);
			console.log("amplitude = "+H.m_amplitude);
			console.log("barkNoiseFactor = "+RQPrintR(H.m_barkNoiseFactor));
			//		H.m_wavelength	= vars.gF("wavelength",{min:4,max:20}); H.m_wavelength.min*=this.u; H.m_wavelength.max*=this.u;
			//		H.obbMargin		= H.m_amplitude+this.m_strokeWidth; 
			H.distrFunc = this.M_distFuncTreeBranch;

			return this.M_hatchFuncTreeBranch;
		}
		return super.M_getHatchFunction(name,H,vars);
	}

	M_init(isAutorun)
	{
		this.svg= this.M_makeObjectSVG( "mainSVG",this.W,this.H );
		this.M_createMaskCanvas();
		this.M_createClipCanvas();
		this.M_applyPaperColor();


		// SVG
		var style= this.M_getStyleAsString();
		this.svg.append(	this.M_makeDefaultSvgGroup("0",style) );
		this._Svs();

		this.M_getAnimationParameters();



		
		this.M_initVariables().then( ()=>
		{
			this.M_applySvgGroupsToSelect();

			this.M_applyArtwork();
			if(isAutorun&&!this.m_isAnimation)
					this.M_startAlgorithm();		
					
		});
		this.M_showWorkCanvases();
	
	}
	V_Svs()
	{
		let style=null;
		this._Sv('Trees'		, "Leaves"		, true, style);
		this._Sv('Trees'		, "LeavesFeat"	, true, style);
		this._Sv('Trees'		, "Stem"	, true, style);
		this._Sv('Trees'		, "Branches", true, style);
		this._Sv('Trees'		, "BranchFill", true, style);
		this._Sv('Trees'		, "Ground", true, style);
		this._Sv('Trees'		, "EarthFront", true, style);
		this._Sv('Trees'		, "Earth", true, style);
		this._Sv('',"Debug", true, {m_strokeWidth:1, m_strokeColor:"red",m_paletteTag:"custom"});

	
	}
	M_run()
	{
		// nothing
		console.log("M_run Trees : nothing");
	
	}
	async M_initVariables()
	{	
		this.m_trees = [];
		
		// textures 
		await this.M_createTextures();

		
		this.m_leafCount  = 0;
		this.m_leafVisibleCount = 0;
		this.m_branchCount  = 0;
		this.m_isRndNoise = this.gB("rndMode",false);
		this.m_isUseMask=this.gB("isUseMask");
		this.m_rndAngleSpan= this.gF("rndAngleSpan",10);
		this.m_yStart = this.gF("yStart",0)*this.u;
		this.m_groundMargin = this.gF("groundMargin",0)*this.u;

		this.m_isLeaves = this.gB("isLeaves");
		this.m_rootSpacing = this.gF("rootSpacing",50.)*this.u;
		this.m_rootBranchLength = this.gF("rootBranchLength",50)*this.u;
		this.m_rootSegmentLength = this.gF("rootSegmentLength",2)*this.u;
		this.m_rootThickness = this.gF("rootThickness")*this.u;
		this.m_rootRotation = this.gF("rootRotation",{y:0,z:0});
		this.m_thickLineSpacing = this.gF("thickLineSpacing")*this.u;
		this.m_isDrawBranchSegments = this.gB("isDrawBranchSegments",false);
		this.m_leafNbSegments = this.gI("leafNbSegments",24);
		this.m_branchRndDensity = this.gF("branchRndDensity",0.03);
		this.m_branchLengthLevelFactor=this.gF("branchLengthLevelFactor",0.7);
		this.m_branchEndRadiusFactor = this.gF("branchEndRadiusFactor",0.8);
		this.m_newBranchRadiusFactor = this.gF("newBranchRadiusFactor",0.6);
		this.m_branchReductionFactor = this.gF("branchReductionFactor",0.65);
		this.m_branchOpenAngle = this.gF("branchOpenAngle",{min:10,max:70});
		this.m_youngBranch = this.gF("youngBranches",{rnd:0,height:0.9,level:3,newLevel:4});

		this.m_maxRecursionDepth = this.gI("maxRecursionDepth",4);
		this.m_endBranchAngleSpan = this.gF("endBranchAngleSpan",90);
		this.m_leafRndDensity = this.gF("leafRndDensity",0.2);
		this.m_nbRoots 		= this.gI("nbRoots",0);
		this.m_rootMode 	= this.M_get("rootMode","EqualSpace");
		this.m_rootZoneCenter = this.gF("rootPosition",0.5);	
		this._rPV(this,"leafSize",this.u,false); 
		this._rPV(this,"leafSpaceOrientation",1,false);
		this.m_drawBranchMask  = this.gB("drawBranchMask",false);
		this.m_drawLeafContour = this.gB("drawLeafContour",false);
		this.m_drawLeafMask		=this.gB("drawLeafMask",true);


		// Ground addons
		this.m_ground = this.gPk("addons","TreesAddonGround",false);
		if( this.m_ground)
		{	let S = this.m_ground;
			S.m_isActive = S.gB("isActive",false);
			S.m_isDrawInMask = S.gB("isDrawInMask",true);
			S.m_isDrawContour = S.gB("isDrawContour",false);
			S.m_earthPlane = S.gB("earthPlane",true) ? "front" : "back";
			S.m_y = S.gF("y",0); S.m_y*=this.u;
			S.m_earthHeight = S.gF("earthHeight",0); S.m_earthHeight*=this.u;
			S.m_dimensions = S.gF("dimensions",{width:100,depth:50});	for(let m in S.m_dimensions) S.m_dimensions[m]*=this.u;
			S.m_noiseContour = S.gF("noiseContour",{amplitude:5, fact:5});	S.m_noiseContour.amplitude*=this.u;
		}
		// Roots addons
		this.m_roots = this.gPk("addons","TreesAddonRoots",false);
		if( this.m_roots)
		{	let S = this.m_roots;
			this._Sv('Trees', "Roots", true);
			this.M_applySvgGroupsToSelect();
			S.m_isActive = S.gB("isActive",false);
			S.m_seed = S.gI("seed",-1);
			S.m_yStop = S.gF("yStop",0); S.m_yStop*=this.u;
			S.m_nbRoots  = S.gI("nbRoots",4);
			S.m_rndAngleSpan= S.gF("rndAngleSpan",10);
			S.m_rootsRadiusFactor = S.gF("rootsRadiusFactor",{min:0.5,max:0.7});  
			S.m_rootsEndBranchAngle = S.gF("rootsEndBranchAngle",{min:70,max:90});	
			S.m_intermediateBranch = S.gF("intermediateBranches",{rnd:0.1,height:0,level:0,newLevel:1});
			S.m_youngBranch = S.gF("youngBranches",{rnd:0,height:0.9,level:2,newLevel:3});

			S.m_maxRecursionDepth = S.gI("maxRecursionDepth",4);
			S.m_branchLengthLevelFactor=S.gF("branchLengthLevelFactor",0.8);

		}
		// Background addon
		/*let bg = this.gPk("addons","TreesAddonBackground",false);
		if( bg)
		{
		
			this.m_isBackground = bg.gB("isActive",false);
			var backgrounds = bg.M_get("background");
			this.m_backgrounds=[];
			if( backgrounds.length>0)
			{ 	for( let ibg=0; ibg<backgrounds.length; ibg++)
				{
					let S = backgrounds[ibg];
					this.m_backgrounds.push(S);
					this.M_includeArtwork(S,S._V.artwork);
				}
			}
		}*/
		// Grass addons
		this.m_grass = this.gPk("addons","TreesAddonGrass",false);
		if( this.m_grass)
		{	let S = this.m_grass;
			S.m_isActive = S.gB("isActive",false);
			S.m_y = S.gF("y",0); S.m_y*=this.u;
			S.m_depthScaleFactor = S.gF("depthScaleFactor",1.0);
			S.m_dimensions = S.gF("dimensions",{width:100,depth:50});	for(let m in S.m_dimensions) S.m_dimensions[m]*=this.u;
			//if( S.m_isActive)
			{
				S.A = new GrassAlgorithm();
				S.A.M_seed(this.m_seed);
				this.M_initIncludedAlgorithm(S.A, true);
				S.A.m_herbSpacing = S.gF("herbSpacing",8)*this.u;
				S.A.M_initSpeciesVariables(S);
				S.A.M_initSpeciesRandom();
			}

		}
		// Wind addons
		this.m_wind = this.gPk("addons","TreesAddonWind",false);
		if( this.m_wind)
		{	let S = this.m_wind;
			S.m_isActive = S.gB("isActive",false);
			S.m_direction = S.gF("direction",{x:1,y:1,z:1});	
			S.m_amplitude = S.gF("amplitude",100);	S.m_amplitude*=this.u;
			S.m_rndThres = S.gF("rndThres",0.1);	
		}

		// Regular backgrounds
		/*this.m_backgrounds = this.M_get("background");
		for( let i=0; i<this.m_backgrounds.length; i++)
		{ 	this.M_readBackgroundVars(this.m_backgrounds[i]);
		}*/
		this.m_backgrounds = Backgrounds.M_createFromVars(this,this.M_get("background"));


		// SVGGroup addons 
		var addons = this.gPk("styles",this.M_getLineGroups(),true);
		for(let ia=0; ia<addons.length; ia++)
		{	
			//if( addons ) console.log("Addons "+ia+" : variables = "+RQPrintR(addons[ia]._V,2));

			this._rS(this,addons[ia]);

		}
		// Hatch addons
		addons = this.gPk("styles",this._gH() ,true);
		for(let ia=0; ia<addons.length; ia++)
			this.M_readHatchVariable(this,addons[ia]);

		// default behaviour on leaves fills 
		let G=this._g.Leaves, Fs=G?.fills 
		if(Fs)Fs.map((F)=>{	
				console.log();
				F.setup=(_,o)=>{
					console.log(`setting up ${o.g.m_name}`);
				}

		})
		
		EventManager.M_fire("VariablesDone",{},this);


	}

	async M_startAlgorithm()
	{
		
		window.clearInterval(this.m_timer);
		if(this.m_isAnimation)
		{	let anim=this.m_animation;
			this.M_initAnimationFrame(anim.frameId,anim.frameNb);
		}
		else
		{
			this.M_clearMask();

		}

		if(!this.M_isAbort())
			 this.M_doTreeAlgorithm()
		 /*this.M_doTreeAlgorithm().then(
			function(){console.log("OK Trees Done !");},
			function(error){console.log("Ooops error in the async function");}
		);*/
	
	
	}
	async M_doIncludedAlgorithm()
	{
		this.M_doTreeAlgorithm();
	
	}
	M_makeRandomFunctions(seed)
	{	this.M_seed( seed);
		let leavesSeed = this.random();
		this.M_seed( parseInt(leavesSeed*100),"Leaves");	
		noise.seed(leavesSeed);
		let maxDepth = Math.max( this.m_maxRecursionDepth, this.m_youngBranch.newLevel,this.m_roots!=undefined? this.m_roots.m_youngBranch.newLevel : 0) 
		let i=0;
		
		for( i=0;i<=(maxDepth+1);i++)
		{
			this.M_seed( parseInt(this.random()*100),"Depth"+i);	
		
		}
		let n=i-1;
		for(i;i<30;i++)
		{
			
			this['randomDepth'+i] = this['randomDepth'+n];
		}
		
		this.M_seed(parseInt(this.random()*100),"Young");
	}

	
	async M_doTreeAlgorithm()
	{
		this.M_makeRandomFunctions(this.m_seed);
		
		A.m_deformersActive = false;

		var P = new ZV3();
		this.branchCount = 0;
		this.m_branchShapes = [];
		this.m_stemLines = [];
		// rootMode
		// EqualSpace
		// Random
		// RandomInsideSpace
		
		var nbRoots = Math.floor(this.W/this.m_rootSpacing);
		if( this.m_nbRoots>0 && nbRoots > this.m_nbRoots)
			nbRoots = this.m_nbRoots;
		var WAllRoots;
		
		if( this.m_rootMode == "RandomInsideSpace")
			WAllRoots = this.m_rootSpacing;
		else 
			WAllRoots = (nbRoots-1)*this.m_rootSpacing;
		var isRndRoot = this.m_rootMode=="Random" || this.m_rootMode=="RandomInsideSpace";
		
		if( nbRoots>0)
		{	//var x = (this.W-(nbRoots-1)*this.m_rootSpacing)/2.0;  
			var xLeft =this.W*this.m_rootZoneCenter-WAllRoots/2; 
			var x = xLeft;
			for( var i = 0; i<nbRoots; i++)
			{	
				var segmentLength = 4.0*this.u; 	// mm 
				var segmentNb = this.m_rootBranchLength*( 0.5+0.5*this.random())/segmentLength;

				if(isRndRoot)
				{
					x = xLeft + WAllRoots*this.random();
				}
				P.M_set( x, this.m_yStart, 0);
				var direction = PI/2.;
				this.branchCount ++;
				
				// Create a Tree
				let tree = new Tree(this);
				this.m_trees.push(tree);
				tree.M_setBranchLength( this.m_rootBranchLength*( 0.5+0.5*this.random()) , this.m_rootSegmentLength); 
				tree.M_setPosition( P );
				tree.M_setDirection(0,1,0);
				tree.M_setRadius( this.m_rootThickness/2,0);

				let MV = new RQMatrix4();
				if(this.m_rootRotation)
				{	if( this.m_rootRotation.y)
						MV.M_rotate(this.m_rootRotation.y, 0,1,0);
					if( this.m_rootRotation.z)
						MV.M_rotate(this.m_rootRotation.z, 0,0,1);
				
				}
				tree.M_run(MV);
				tree.M_draw();
				if( this.m_roots && this.m_roots.m_isActive)
				{
					tree.M_makeRoots();				
					
					tree.m_roots.M_draw();
				}
				if( this.m_ground && this.m_ground.m_isActive /*&& this.m_ground.m_earthPlane=="back"*/)
				{
					tree.M_drawEarth("back");			
				
				
				}
				

				
				if(!isRndRoot)
					x+=this.m_rootSpacing;		
			
			}
		}
	
		
		var L;
		while (L = this.m_stemLines.pop() )
		{
			A._DL(this._g.Stem,L,true); 
		}
		let b;
		if(b=this.m_backgrounds)
			for(let i=0; i<b.length; i++)
				b[i].M_drawOnce(this);

		// draw lines to Svg when done
		
		await this._DLToSvg().then(()=>{
			this.M_onAlgorithmDone();
		});

	}

	async M_onAlgorithmDone() 
	{ 	super.M_onAlgorithmDone();
		
		if( this.m_isAnimation)
		{
			var anim = this.m_animation;
			// { frameNb: 30, frameId: 0} 
			// anim frame id
			let s="";
			var f=0+anim.frameId;
			for( let i=0;i<4; i++)
			{	s = s.replace (/^/,Number(f%10).toString());
				f=parseInt(f/10);			
			}
			//downloadSVG($('#ARTWORK').html(),this.m_title+"_"+s+".svg");
			let fileName = this.m_title+"_"+s+".png";
			let isSnap=(anim.frameId%anim.every)==0;
			await makeSnapshot(this,$('#ARTWORK').html(),fileName,isSnap?Math.min(this.W,1920):-1).then(

				function()
				{
		
					
					anim.frameId++;
					if( anim.frameId <anim.frameNb)
					{

						
						// relaunch anim
						if( !this.M_isAbort())
							self.setTimeout(this.M_startAlgorithm.bind(this),10);
					
					}
				}.bind(this),
				function(error)
				{
					
				}
			);
		}
	}
	
	
	
	// M_drawLeaf
	// 3D approch
	M_drawLeaf(C,MV,opt)
	{
		this.m_leafCount = (this.m_leafCount??0)+1;
		
		A.m_deformersActive = this.m_isDeformers;								
		if( this.m_wind && this.m_wind.m_isActive)
		{
			if( Math.random() > this.m_wind.m_rndThres)
			{	let rnd = (0.3+0.7*0.5*(1+Noz(3*C.x/this.W,3*C.y/this.H)))*this.m_wind.m_amplitude;
			 
				C.x+=this.m_wind.m_direction.x*rnd;
				C.y+= -this.m_wind.m_direction.y*rnd -this.m_wind.m_direction.z*rnd*this.m_perspectiveFactor;
			}
		}	

		let openAmount = 0;							// TEMP
		let leafProfile = opt.profile;
		
		
		var spaceOrientation = this.m_leafSpaceOrientation.func.apply(this,[C.x,C.y,this.m_leafSpaceOrientation.config] );
		MV.M_rotate(spaceOrientation,1,0,0);			// rotate in the direction of the viewer

		// leaf scale
		var sz = this.m_leafSize.func.apply(this,[C.x,C.y,this.m_leafSize.config] );

		// size : sets the ratio x/y 
		var size = new ZV2( sz*opt.ratio, sz);

		// stem length for this leaf
		var stemLength = sz*(opt.stemRatio!=undefined?opt.stemRatio:0.25);

		let isVisible = this.mdA.iPI(C); 
		if( isVisible )
		{
			
		
		}
		else
			return;

		// nbPoints : number of points on the leaf profile
		let nbPoints = opt.segments;

	


		let leafWidth 	= size.x*0.5;
		let leafLen 	= size.y; 



	   let Plocal = new ZV3() 
	   let P = new ZV2(); 

		// bend alpha : angle of bend 
	   let bendAlpha = 90*D2R;
	   let bendR  = abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 1;
	   let noiz = Noz(C.x/this.W*20,4*C.y/this.H);
	   let bendBeta = -90*Math.max(0.3,abs(noiz))*D2R;
	   let bendRBeta = abs(bendBeta)>0.02 ? leafWidth/bendBeta : 1 
	   var kProfile = 1./(nbPoints-1);
	   let leafDecal = stemLength;
	   let L = [new ZPL(),new ZPL()]; 
	   var p;
	   for( let i=0; i<nbPoints; i++)
	   {	
		   let aProfile = i*kProfile; 
		   p= leafProfile.apply(this,[aProfile,opt]);
		   let dz = (1-cos( p.y*bendAlpha))*bendR; 
		   let y = bendR*sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 

		   let dzBeta = (1-cos( p.x*bendBeta))*bendRBeta; 
		   let x = bendRBeta*sin(p.x*bendBeta);

		   for( let side=0; side<2; side++)
		   {	
		   		let sign = side==0? -1 : 1;
		   		Plocal.M_set( sign*x, y,dz+dzBeta)	// ok
			    Plocal.y += leafDecal; 

			   // P is the point oriented around the flower 
			   let Pworld = MV._mBV(Plocal);			   
			   
			   L[side]._aP(  A.Pj(Pworld,C ) );
			}	   
		   
	   }
	   // stem junction point
	   Plocal.M_set(0,leafDecal,0);
	   let Pworld = MV._mBV(Plocal);
	   let O = A.Pj(Pworld,C); //new ZV2(Pworld.x,-Pworld.y + Pworld.z*this.m_perspectiveFactor);				
		//O.M_add(C);
		
	   // centerLine
	   let centerL = null;
	   if( opt.centerLine && p && p.y>0)
	   {	
	   		centerL = new ZPL();
	   		let segLen = 1*this.u/leafLen;
	   		let lineLen = 0.8*p.y;
	   		let nb  = lineLen/segLen;
	   		let y = 0;
	   		for( let i=0; i<=nb; i++)
	   		{
			    let dz = (1-cos( y*bendAlpha))*bendR; 
				let dy = bendR*sin(y*bendAlpha);

		   		Plocal.M_set( 0, dy,dz)
			    Plocal.y += leafDecal; 
			   let Pworld = MV._mBV(Plocal);			   
			   centerL._aP( A.Pj(Pworld,C));
												
				y+=segLen;
			}  
	   }

		
	   // joint lines
	   let p2;
	   while(p2=L[1].mP.pop())
	   {	L[0]._aP(p2);						
	   }
	   var pathPoints = L[0]._gS(true);
	   

		// Computing the normal and lighting
		let N = MV.mRV((new ZV3(1,0,0)).M_cross( new ZV3(0,1,0))).Nzd(); 
		let lighting = (1+N.M_dot(this.m_lightSource))*0.5;
		lighting*=lighting;
		let lightMax = 1; 
		

		let drawContour = /*true;*/this.m_drawLeafContour ; //opt.drawContour;

		let fills = this._g.Leaves.fills;

		//this.M_applyFills(this._g.Leaves,L,opt)
		if( isArr(fills) )
		{
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];
				this.leafFillCount = (this.leafFillCount??0)+1;
				if( F && lighting<=lightMax)
				{	
					let o = MV.mRV(new ZV3(0,1,0) );
					//let oProj = new ZV2(o.x, -o.y + o.z*this.m_perspectiveFactor);  
					//F.leaves = {...opt};
					F.orientation= this.M_projectedOrientation(o); // Math.atan2(oProj.y,oProj.x)/D2R;
					F.spacing=  ZMT.M_map( lighting,0.01,lightMax,F.m_spacing.min , F.m_spacing.max);
					//console.log("N="+N.M_getString()+" lighting="+lighting+" spacing="+F.spacing);
					//F.jointEnds=true;
					F.group = true;
					//F.m_lines.push( ...this.M_hatchShape( L[0] ,F)); 
					this._Fl(F,L[0],F);
				}
			}	
		}
		else 
			drawContour = true;

	   // Draw the contour lines
	   if(drawContour)
		   //this._g.Leaves.m_lines.push(...this.M_computeLineMask(L[0]));
			A._DL(this._g.Leaves,L[0],true);
		if( centerL)
			A._DL(this._g.LeavesFeat,centerL,true);
		  // this._g.Leaves.m_lines.push(...this.M_computeLineMask(centerL));
		

		// draw the leaf in the mask
		var path = new Path2D(pathPoints);
		if(this.m_mask && (opt.isMask??1))
		{	
			var context = this.m_mask._X();			
			context.fillStyle = "white";
			context.fill(path);
		}	

		// stem
		if(stemLength>=1)
		{	if(A.m_stemLinesBack)
				this.m_stemLines.push(new ZL(C,O));
			else
				A._DL(A._g.Stem,new ZL(C,O),true); 

		}

		A.m_deformersActive = false;

	}

	// Leaf profiles
	// ------------
	M_mintLeafProfile(t,opt)
	{
	   let x = sin(Math.pow(t,0.7)*PI);
	   x-=sin(t*20*PI)*0.05;
	   return {x: x, y : t};	
	}
	M_poplarLeafProfile(t,opt)
	{
		const D=0.9,R=0.83
		let x=R*(1-t**D)*(sin(t*PI))**.5
		x-=sin(t*20*PI)*0.02;

		return {x:x,y:t}
	}
	M_defaultLeafProfile(t,opt)
	{
	   let x = sin(Math.pow(t,0.5)*PI);
	   return {x: x, y : t};	
	}
	M_oakLeafProfile(t,opt)
	{
		let x= sin(Math.pow(t,1.4)*PI);
		// wave 
		x-= Math.pow( (1+sin(t*PI*opt.oakSpikes))*0.5,1.9)*x*0.5;
		return {x:x,y:t};	
	}
	M_oakLeafInvProfile(y,opt)
	{
		let t= y;
		let x = sin(Math.pow(t,1.4)*PI);
		x-= Math.pow( (1+sin(t*PI*opt.oakSpikes))*0.5,1.9)*x*0.5;
		return {x:x,t:t};
	}
	M_ashLeafProfile(t,opt)
	{  
	   let n = opt.ashLeaves; 
	   let i=Math.floor(t*n);
	   let y = i/n;
	   let t1 =(t-y)*n; 
	   let t2 = 2* Math.max(0,(t1-0.1)/0.9);
	   
	   let tt= t2<=1? t2 : 2-t2;
	   let sign = t2<=1? 1 : -1;
	   let ttt=Math.max(0,tt-0.1)/0.9;
	   let x = sign*sin(Math.pow(ttt,0.8)*PI);
	   x-=sign*sin(Math.pow(ttt,1.5)*PI)*0.4;
	   x/=(2*n);
	   if(i==Math.floor(n))
	   {	//tt-=t1*sign;	   
	   		y+=ttt*0.5;
	   		tt=x;
	   }
	   else
	   		y+=tt*0.3-x; 
	   return {x: tt, y : y- (Math.min(t1-0.1,0)/-0.1-1)/n };	
	}
	M_ashOrganize(opt)
	{
	
	}

	
	

	M_distFuncTreeBranch(OBB,x,opts)
	{
		let B;
		if( B=opts.branch)
		{
			B.xHatchExtend = 0.05;
			B.hatchTopDown = false;
			if(x<B.m_branchLength*(1+2*B.xHatchExtend))
			{
				let x2 = x-B.m_branchLength*B.xHatchExtend;
				if(B.hatchTopDown)
					x2 =B.m_branchLength-x2; 	
				var L = this.M_hatchFuncTreeBranch(OBB,x2,opts);
				x+=opts.spacing;		
				return { x:x, L:L}
			}

		}
		
		return null;

	}

	M_hatchFuncTreeBranch(OBB,x,opts)
	{	const zero = new ZV2(0,0);
		let B;
		if( B=opts.branch)
		{
			// draw previous line into the mask, for protection ( test! ) 
			
			let Copt,PL;
			let kernelSize = opts.inStencilLineCut? Math.max(B.prevAmp,2*opts.spacing) : 0;
			let kernelStart = B.hatchTopDown? 0: -kernelSize;	
			if( (PL=B.prevHatchLine) && kernelSize>=1 && (Copt=OBB.clipOpts) && Copt.data)
			{
				 	let data = Copt.data.id.data; 
					let x0= Copt.data.x;
					let y0 = Copt.data.y;
					let w0 = Copt.data.id.width;
					let h0 = Copt.data.id.height;
					let rowBytes = w0*4;
					 
					for( let ip=0; ip<(PL.mP.length-1); ip++)
					{	let P0 = PL.mP[ip]; 
						let I = PL.mP[ip+1].M_minus( P0);
						let dist= I.M_length();
						if( dist>=1)
						{	I.M_mul(1/dist);
							let J = B.prevVyProj; //new ZV2( -I.y,I.x); 
							for(let i=0;i<dist;i++)
							{	let P = new ZV2( P0.x+kernelStart*J.x,P0.y+kernelStart*J.y);
								for(let k=0; k<kernelSize; k++)
								{	let x=Math.round(P.x-x0);
									let y=Math.round(P.y-y0);
									if( x>=0 && x<w0 && y>=0 && y<h0)
									{ 
										let ind = x*4+ y*rowBytes;
										data[ind]=data[ind+1]=data[ind+2]=255;
									}
									P.M_add(J.x,J.y);
								}
								P0.M_add(I);													
							}
						}
					}
					 
					 /* random dithering in the stencil : interesting !! 
					 for( let i=0; i<1000; i++)	// TEST
					 {		let P = new ZV2(x0+Math.random()*Copt.data.w,y0+Math.random()*Copt.data.h);
							let ind = Math.round(P.x-x0)*4+ Math.round(P.y-y0)*rowBytes;
							data[ind]=data[ind+1]=data[ind+2]=255;
								
					 }*/

			}
		
		
			// find branch segment
			let nbSeg = B.m_segments.length;
			let k = x/B.m_branchLength;	// (B.m_branchLength*(1+2*B.xHatchExtend));
			let iSeg;	// =Math.floor(k*(nbSeg-1));
			let Lseg = 0;
			let kSeg = 0;
			if( k<0)
			{
				iSeg=0;
				kSeg = -x/B.m_segments[0].segLength;
			}
			else if( k>=1)
			{
				iSeg = nbSeg-1;
				kSeg = 1+(x-B.m_branchLength)/B.m_segments[nbSeg-2].segLength;
			}
			for( iSeg=0; iSeg<nbSeg; iSeg++)
			{	let sl =B.m_segments[iSeg].segLength; 
				if( x>=Lseg && x<(Lseg+sl))
				{	if(sl>0) 
						kSeg = (x-Lseg)/sl; 	
					break;
				}
				Lseg+=sl;
			}
			if( iSeg>=0 && iSeg<(nbSeg-1))
			{
				let s1 = B.m_segments[iSeg];
				let s2 =B.m_segments[iSeg+1]; 
				let s3 =B.m_segments[iSeg+2]; 
				//let kSeg = k*nbSeg-iSeg;		// [0;1[
				//console.log("x="+x+" OBB.w="+OBB.w+" iSeg="+iSeg+"/"+nbSeg+" kSeg="+kSeg);
				// find 2D point on the branch
				let vy = s2.P.M_minus(s1.P);
				let C = s1.P.M_plus( vy.x*kSeg, vy.y*kSeg, vy.z*kSeg); 
				let radius = s1.radius + (s2.radius-s1.radius)*kSeg;
				let lineLength = s1.l + (s2.l-s1.l)*kSeg;
				let vy2;;
				if( s3)
				{	vy2 = s3.P.M_minus(s2.P);
					vy.M_add( vy2.M_minus(vy).M_mul( ZMT.polynomialStep(kSeg,2) ));
				}
	

				// make the points
				let spacing;
				
				
				var L = new ZPL();
				let nbPoints = Math.floor(PI*radius/2);
				let amplAng = PI*0.98; 
				let a = +PI*0.01;
				let aInc =amplAng/nbPoints;
				let I0 = new ZV3(1,0,0);
				
				if(false && s1.m_VSpline)			// Spline doesn't add anything ... 
				{	
					vy = s1.m_VSpline.M_getVectorAt(kSeg);
				}
				vy.Nz();
				let vyProj = A.Pj(vy,zero );	//*/ new ZV2(vy.x, -vy.y + vy.z*this.m_perspectiveFactor);

				let projScale = vyProj.M_length()/vy.M_length();				
				vyProj.Nz();
				B.prevVyProj = vyProj; 

				let Z = this.m_toEyeVector;
				let X = vy.M_cross(Z).Nz();
				Z= X.M_cross(vy);
				if( B.Z==undefined)
					B.Z = Z;
				else
				{	B.Z = Z = B.Z.M_plus( Z.M_minus(B.Z).M_mul(0.3) ).Nz();
				
				}

				let isSpacingLighting=false;
				let isAmpLighting = opts.lightingAmplitude?true:false;
				let lighting; 
				if(isSpacingLighting)
				{	let N = Z;
					lighting = (1+N.M_dot(this.m_lightSource))*0.5;
					lighting*=lighting;
					spacing=  ZMT.M_map( lighting,0,1,opts.m_spacing.min , opts.m_spacing.max);
				}
				else
				{	
					spacing = opts.m_spacing.average;			
				
				}
				opts.spacing = spacing/projScale;
				
				// To parametrize
					let lengthFactor = Math.pow(0.5,lineLength/B.T().m_branchLength); 
					let Torsion =opts.m_torsion*lengthFactor;
					let ampl = Math.min(radius/10,2*opts.spacing);	// TEMP   - should be a function of the actual elongation of branch depending on the point on the circle 
					let amplArray = {min:ampl,max:ampl} 
					let amplPos = {min: new ZV3(C.x- X.x*radius , C.y-X.y*radius , C.z-X.z*radius ), max:new ZV3(C.x+ X.x*radius , C.y+X.y*radius , C.z+X.z*radius )  }
					for(let k in amplPos) amplPos[k] = A.Pj(amplPos[k]); //new ZV2(  amplPos[k].x, this.mwA.top()-amplPos[k].y + amplPos[k].z*this.m_perspectiveFactor ); 
					if( B.prevAmplPos)
					{
						for(let k in amplPos)
						{	amplArray[k]= Math.min( amplPos[k].M_dist(B.prevAmplPos[k])*opts.m_amplitude/this.u*lengthFactor, 3*spacing) ;
						}			
					}
					
					let barkNoiseFactor = opts.m_barkNoiseFactor; // {x:120, y:28};
					let barkExp = 0.2;//2.8;
				B.prevAmp = Math.max(amplArray.min,amplArray.max);
				let N = new ZV3();
				let lengthSign = B.m_isRoots?-1:1;
				let noiseShiftY = barkNoiseFactor.shiftY??0;
				for( let i=0; i<nbPoints;i++)
				{

					let rnd = _treeBarkNoise(  (barkNoiseFactor.x*a*radius+lengthSign*lineLength*Torsion)/this.W*this.m_noiseFactor.x,noiseShiftY+ barkNoiseFactor.y*lengthSign*lineLength/this.H*this.m_noiseFactor.y); 
					rnd = ZMT.M_map(rnd,-1,1.0,-1,1);
					let damping = 1.;//Math.exp(sin(a),3);
					ampl = ZMT.M_map(a,0,PI,amplArray.min,amplArray.max);

					let r = radius;
					//r+=decal;	// TEST
					let co=cos(a);
					let si=sin(a);

					if(isAmpLighting)
					{
						N.M_set(-X.x*co + Z.x*si, -X.y*co + Z.y*si, -X.z*co + Z.z*si);
						lighting = (1+N.M_dot(this.m_lightSource))*0.5;
						lighting*=lighting;
						ampl*=ZMT.M_map(lighting,0.5,1,1,0);
					}
					co*=r;
					si*=r;


					let decal = ampl *Math.sign(rnd)* ZMT.polynomialStep(abs(rnd),barkExp)*damping; /*sin( 5*a/radius)**/;

					let P = new ZV3( C.x- X.x*co + Z.x*si, C.y-X.y*co + Z.y*si, C.z-X.z*co + Z.z*si); 
					let	Pproj = A.Pj(P);			
					Pproj.M_add( vyProj._mB(decal));

					L._aP(Pproj);
					a+=aInc;
				}
				B.prevHatchLine = L;
				B.prevAmplPos = amplPos;
				return L;
				
			}

			
		}
		return null;	// ?		
	}
	
	M_earthSpacingFunc(OBB,x,opts)
	{
		// opts.spacingFunc
		if( opts.m_spacing && opts.m_spacing.min)
		{
			let spc= ZMT.M_map(Math.pow(x/OBB.w,3),0,1,opts.m_spacing.min,opts.m_spacing.max);
			if( spc>15)
				spc= OBB.w-x;
			return spc;
		}
		return opts.spacing;	
	
	}

			

};
EventManager.M_on("RegisterFillStyles",function(){

	this._rF("TreeHatchShape",function(H,v){

		let _=this,u=_.u
		H.m_perturbation = _._rPV(v,"perturbation",1,0);			
		H.m_spacing= H.m_lineSpacing = _._rPV(v,"lineSpacing",u,0);
		if(_UI) _.M_showMm(H.m_lineSpacing,"lineSpacing",v,["min","max","average"])
		H.protect = (v.gF("protect")??0)*u;
		H.jointEnds = v.gB("jointEnds",1);
		H.orientation = v.gF("orientation",0);



		H.m_amplitude	= v.gF("amplitude",0.5); H.m_amplitude*=u	
		H.m_barkNoiseFactor = v.gF("barkNoiseFactor",{x:120, y:28})
		H.m_torsion= v.gF("barkTorsion",30)
		H.inStencilLineCut = v.gB("inStencilLineCut",1)
		H.lightingAmplitude = v.gB("lightingAmplitude",0)
		H.expand = 0.2*u;	// TEMP TEST
		H.distrFunc = _.M_distFuncTreeBranch;		
		H.hatchFunc=_.M_hatchFuncTreeBranch;


	})
	
})








