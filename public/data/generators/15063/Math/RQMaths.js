
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
class RQMaths
{

	constructor()
	{
	}
	static M_seed(seed,i)
	{
		if( !i)
		{
			RQMaths.seed = seed;
			// https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
			RQMaths.random = sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
			if( RQMaths.random2==undefined)
				RQMaths.random2 = [];
			RQMaths.random2[0]=RQMaths.random;
			for (var i = 0; i < 15; i++) RQMaths.random();
		}
		else
		{
			RQMaths.random2[i]=sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
			
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
	//  M_getPointsBarycenter
	//  returns { size, G} where size is the max diameter of the shape
	static M_getPointsBarycenter(C)
	{
		let dim3 = C[0]&&(C[0].z!=undefined);
		var bary= dim3? new RQVec3(0,0,0) :new RQVec2(0,0); 
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
		var l=0;
		for( var i=0; i<nb;i++)
		{	let lp = dim3? Math.hypot(C[i].x-bary.x,C[i].y-bary.y,C[i].z-bary.z):Math.hypot(C[i].x-bary.x,C[i].y-bary.y);
			if(lp>l) l=lp;
		}
		return {size:l*2.0, g:bary};
	
	}
	static M_getAABB(points)
	{
		var r;
		var nb=points.length;
		for( let i=0; i<nb;i++)
		{	let p = points[i];
			if( i==0)
			{
				r = new RQRectangle(p.x,p.y,0,0);
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
	{	let ang = angleDeg*DEGTORAD;
		let I = new RQVec2(Math.cos(ang), Math.sin(ang));
		let J = new RQVec2(-I.y,I.x);
		var r;
		var nb=points.length;
		let q = new RQVec2();
		for( let i=0; i<nb;i++)
		{	let p = points[i];
			q.M_set(I.x*p.x-J.x*p.y,-I.y*p.x+J.y*p.y); 
			if( i==0)
			{
				r = new RQRectangle(q.x,q.y,0,0);
			}
			else
				r.M_extend	(q.x,q.y,0,0);
				
		}
		let o = r.center(); 
		return {  I:I, J:J, o : new RQVec2( I.x*o.x+J.x*o.y,I.y*o.x+J.y*o.y), w:r.w, h:r.h};		
	
	}
	static M_polylineFromOBB(obb)
	{
		var L = new RQPolyLine();
		let w = obb.w/2;
		let h = obb.h/2;
		L.M_addPoint(obb.o.x-obb.I.x*w -obb.J.x*h,obb.o.y-obb.I.y*w -obb.J.y*h);
		L.M_addPoint(obb.o.x+obb.I.x*w -obb.J.x*h,obb.o.y+obb.I.y*w -obb.J.y*h);
		L.M_addPoint(obb.o.x+obb.I.x*w +obb.J.x*h,obb.o.y+obb.I.y*w +obb.J.y*h);
		L.M_addPoint(obb.o.x-obb.I.x*w +obb.J.x*h,obb.o.y-obb.I.y*w +obb.J.y*h);
		L.M_addPoint(L.M_getPoint(0));
		return L;
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
	static polynomialStep(x,n)
	{ 
		  return  Math.pow(x, n)/(Math.pow(x, n)+Math.pow(1-x,n)) ;
	}
	static relax(value,target, dt, T)
	{
		value += (target-value)*Math.min(1, dt/T);
		return value;
	}



};
RQMaths.M_seed( parseInt(Math.random()*(100)) );
const rndRange=(v,rnd)=>{ if(v){rnd??=Math.random; return v.min+rnd()*(v.max-v.min);}}

const rndArray=(a,rnd)=>{ if(Array.isArray(a)) {rnd??=Math.random; return a[Math.round((a.length-1)*rnd())];} else return a;}
const arrVals=(o)=> Object.keys(o).map(function(k){return o[k]});