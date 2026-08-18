
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
/*function sfc32(a, b, c, d) {
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
}*/
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
			RQMaths.random = fxrand; //sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
			if( RQMaths.random2==undefined)
				RQMaths.random2 = [];
			RQMaths.random2[0]=RQMaths.random;
			for (var i = 0; i < 15; i++) RQMaths.random();
		}
		else
		{
			RQMaths.random2[i]=fxrand; //sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
			
		}

	}
	
	static M_clamp(x,a,b)
	{
		if( a>b) {var t=a;a=b;b=t;}
		if(x<a) return a;
		if( x>b) return b;
		return x;
	}
	static M_map(x, srca, srcb, dsta, dstb)
	{
		
		return dsta + (this.M_clamp(x,srca,srcb)-srca)*(dstb-dsta)/(srcb-srca);
	
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
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}
class RQVec2
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
			//console.log("typeof RQVec2 _x : "+typeof _X);
			this.x = 0.0;
			this.y = 0.0;
		}
	
	}
	clone()
	{
		return new RQVec2(this.x,this.y);
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
	}
	M_plus(a,b)
	{
		if( typeof a==='number')
			return new RQVec2(this.x+a,this.y+b);
		else 
			return new RQVec2(this.x+a.x,this.y+a.y);
	
	}
	M_minus(a,b)
	{
		if( typeof a==='number')
			return new RQVec2(this.x-a,this.y-b);
		else 
			return new RQVec2(this.x-a.x,this.y-a.y);
	
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
	M_multipliedBy(k)
	{
		return new RQVec2( this.x*k, this.y*k);
	}

	M_dist(a,b)
	{
		if( a instanceof RQVec2)
			return Math.hypot( a.x-this.x, a.y-this.y);
		return 	Math.hypot(a-this.x,b-this.y)
	
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
		if( a instanceof RQVec2)
			return this.x*a.x + this.y*a.y;
		else
			return this.x*a + this.y*b;
	}

	M_normalize()
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

	M_isInTriangle(A,B,C,isReport)
	{

		// M = A + x AB + y AC
		// AM = xAB +yAC
		// AMx -y.ACx = x.ABx	(1)
		// AMy -y.ACy = x.ABy	(2)
		let AM=new RQVec2();
		let AB=new RQVec2();
		let AC=new RQVec2();
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
class RQVec3
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
			//console.log("typeof RQVec2 _x : "+typeof _X);
			this.x = 0.0;
			this.y = 0.0;
			this.z = 0.0;
		}
	
	}
	clone()
	{
		return new RQVec3(this.x,this.y,this.z);
	}
	M_mul(k)
	{
		this.x*=k;
		this.y*=k;
		this.z*=k;
		return this;
	}
	M_multipliedBy(k)
	{
		return new RQVec3( this.x*k, this.y*k,this.z*k);
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
			return new RQVec3(this.x+a,this.y+b,this.z+c);
		else 
			return new RQVec3(this.x+a.x,this.y+a.y,this.z+a.z);
	
	}
	M_minus(a,b,c)
	{
		if( typeof a==='number')
			return new RQVec3(this.x-a,this.y-b,this.z-c);
		else 
			return new RQVec3(this.x-a.x,this.y-a.y,this.z-a.z);
	
	}
	M_dist(a,b,c)
	{
		if( a instanceof RQVec3)
			return Math.hypot( a.x-this.x, a.y-this.y,a.z-this.z);
		return 	Math.hypot(a-this.x,b-this.y,c-this.z)
	
	}
	M_length()
	{
		return Math.hypot(this.x,this.y,this.z);
	}
	M_normalize()
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
		if( a instanceof RQVec3)
			return this.x*a.x + this.y*a.y + this.z*a.z;
		else
			return this.x*a + this.y*b + this.z*c;
	}
	M_cross	(a,b,c) 
	{
		if( a instanceof RQVec3)
			return new RQVec3( this.y*a.z - this.z*a.y, this.z*a.x-this.x*a.z, this.x*a.y-this.y*a.x);
		else
			return new RQVec3( this.y*c - this.z*b, this.z*a-this.x*c, this.x*b-this.y*a);
	}

	M_normalized()
	{
		var n = this.clone();
		n.M_normalize();
		return n;
	}
	M_getString()
	{ 	return "("+this.x.toFixed(FLOATPRECISION)+","+this.y.toFixed(FLOATPRECISION)+","+this.z.toFixed(FLOATPRECISION)+")";
	}



};
class RQRectangle
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
		return new RQRectangle( this.x,this.y,this.w,this.h);
	
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
		return new RQVec2(this.x,this.y);
	}
	bottomRight()
	{
		return new RQVec2(this.x+this.w,this.y);
	}
	topRight()
	{
		return new RQVec2(this.x+this.w,this.y+this.h);
	}
	topLeft()
	{
		return new RQVec2(this.x,this.y+this.h);
	}
	center()
	{
		return new RQVec2( this.x+this.w*0.5, this.y+this.h*0.5);
	}


	M_inset	( w, h)
	{	
		if( h==undefined) h=w;
		this.x+=w;
		this.y+=h;
		this.w-=w+w;
		this.h-=h+h;

	}

	M_isInside( x, y, margin)
	{	if(margin==undefined) margin=0;
		if( x>=(this.x-margin) && y>= (this.y-margin) && x<(this.x+this.w+margin) && y<(this.y+this.h+margin))
			return true;
		return false;
	}
	M_isPointInside( P)
	{	if( P.x>=this.x && P.y>= this.y && P.x<(this.x+this.w) && P.y<(this.y+this.h))
			return true;
		return false;
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
		
	}
	M_rounding()
	{
		let x2=Math.floor(this.x+this.w);
		let y2=Math.floor(this.y+this.h);
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.w = x2-this.x;
		this.h = y2-this.y;
	
	}


	M_getRatio	()  
	{
		if( this.h>0.)
			return this.w/this.h;
		return -1.;
	}

	M_getCenter()
	{
		return new RQVec2( this.x+this.w/2, this.y+this.h/2);
	}
	M_createPolyline()
	{
		var L = new RQPolyLine();
		L.M_addPoint(this.x,this.y);
		L.M_addPoint(this.x+this.w,this.y);
		L.M_addPoint(this.x+this.w,this.y+this.h);
		L.M_addPoint(this.x,this.y+this.h);
		L.M_addPoint(this.x,this.y);
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


}
class RQCircle extends RQRectangle
{
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
	M_toSVG(isStyle)
	{
		if(isStyle===undefined) isStyle=true;
		let s;
		let p = this.center();
		s = `<ellipse cx="${p.x.toFixed(FLOATPRECISION)}" cy="${p.y.toFixed(FLOATPRECISION)}" rx="${(this.w/2).toFixed(FLOATPRECISION)}" ry="${(this.h/2).toFixed(FLOATPRECISION)}" />\n`;
		return s;	
	}
	M_isPointInside( P)
	{	return this.M_isInside(P.x,P.y,0);
	}
	M_isInside( x, y, margin)
	{	if(margin==undefined) margin=0;
		
		return Math.hypot( x-(this.x+this.w*0.5), (y-(this.y+this.h*0.5))*this.w/this.h)<(this.w*0.5+margin);
	}


}

class RQLine
{

	constructor(A,B)
	{
		if( A==undefined)
		{
			this.A = new RQVec2(0,0);	
			this.B = new RQVec2(0,0);	
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
		return new RQLine( this.A.clone(), this.B.clone() );
	
	}
	M_endPoint()
	{
		return this.B;
	}
	M_getPoint(i)
	{
		return (i==0)? this.A : i==1? (this.B) : null;
	
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
	
	M_getSVGPath(isClose)
	{
		var pathPoints = "M "+this.A.x+" "+this.A.y+" L "+this.B.x+" "+this.B.y;
		
		return pathPoints;
	}


}
class RQPolyLine extends RQLine
{
	constructor(points)
	{
		super('poly');
		if( points != undefined && Array.isArray( points ) )
			this.m_points = points;
		else 
			this.m_points = [];
		this.m_isPolyLine = true;	
	
	}
	clone()
	{
		var L = new RQPolyLine();
		for(let i=0; i<this.m_points.length; i++)
			L.M_addPoint( this.m_points[i].clone());
		return L;
	}
	M_addPoint(A,B)
	{
		if( typeof A==='number')
			this.m_points.push( new RQVec2(A,B) );
		else
			this.m_points.push(A);
	
	
	}
	M_insertPoint(P,index) 
	{	if( index==undefined)
			index=0;
		this.m_points.splice(index, 0, P);
	}
	M_nb()
	{
		return this.m_points.length;
	}
	M_getPoint(i)
	{
		return this.m_points[i];
	
	}
	M_endPoint()
	{
		var n =this.M_nb();
		if(n>=2)
			return this.m_points[n-1];
	}
	M_getLine(i)
	{
		return new RQLine( this.m_points[i],this.m_points[i+1]);
	
	}
	M_length()
	{
		var length=0;
		var A,B;
		for(var i=this.m_points.length-1; i>=0; i--)
		{ 	A=this.m_points[i];
			if( B!=undefined)
				length += A.M_dist(B);
			B=A;
		}
		//console.log("polyline length : "+length);
		return length;
	}
	M_reverseOrder()
	{
		this.m_points.reverse();
	}

	M_translate(a,b)
	{
		if( typeof a==='object')
		{
			b=a.y;
			a=a.x;
		}
		for(var i=this.m_points.length-1; i>=0; i--)
		{ 	this.m_points[i].M_add(a,b);
		
		}
	}
	M_closePath()
	{
		var A=this.M_getPoint(0);
		var B = this.M_endPoint();
		if( A!=undefined && B!=undefined)
		{	if( !A.M_equals(B))
			{
				this.M_addPoint(A.clone());
			}
		}
	}
	M_append(L)
	{	if( L && Array.isArray(L.m_points))
			this.m_points.push(...L.m_points);
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
			s+=this.m_points[i].x.toFixed(FLOATPRECISION)+","+this.m_points[i].y.toFixed(FLOATPRECISION);			
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
			s+=this.m_points[i].x.toFixed(FLOATPRECISION)+","+this.m_points[i].y.toFixed(FLOATPRECISION);			
		}
		elt.setAttribute("points" ,s);
		return elt;
	}
	M_getSVGPath(isClose)
	{
		var nbpoints = this.M_nb();		
		if( nbpoints>=2)
		{
			var pathPoints = "M ";
			for( let ip=0; ip<nbpoints; ip++)
			{
				let p =this.M_getPoint(ip);
				pathPoints+=`${ip==0?"":" L "}${p.x.toFixed(FLOATPRECISION)} ${p.y.toFixed(FLOATPRECISION)}`
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


	M_isPointInside(P,y)
	{
		if( y!=undefined)
		{	let x = P;
			P = new RQVec2();
			P.M_set(x,y)
		}
		//if( m_aabb.M_isPointInside(x,y,mp_container->m_worldMargin) )
		{

			// test for polygon 
			let nbPoints = this.m_points.length;
			if (nbPoints>=2)
			{

				let A = RQMaths.M_getPointsBarycenter(this.m_points).g;

				for (let i=0; i<nbPoints; i++)
				{	let i2 = (i+1)%nbPoints;
					if( P.M_isInTriangle(A,this.m_points[i],this.m_points[i2]))
							return true;
					
				}

			}

			
		}
		return false;


	}


	M_getString()
	{
		let s = "";
		let nbpoints = this.m_points.length;		

		for( let ip=0; ip<nbpoints; ip++)
		{	
			let p =this.m_points[ip];
			s+= (ip>0? " ":"")+p.M_getString();
		}
		return s;		
	
	
	}

}
class Face 
{
	constructor(...args)
	{
		this.m_points = [];	
		this.m_points.push(...args);
		this.m_edges = [];		// reference to the edges of this face
	}
	M_setNormal(x,y,z)
	{
		if(this.m_normal==undefined)
			this.m_normal = new RQVec3();
		this.m_normal.M_set(x,y,z);
		return this;
	}
	M_computeNormal()
	{
		if(this.m_points.length>=3)
		{
			let AB = this.m_points[1].M_minus(this.m_points[0]);
			let AC = this.m_points[2].M_minus(this.m_points[0]);
			let N = AB.M_cross(AC);
			N.M_normalize();
			// check direction
			let objN = RQMaths.M_getPointsBarycenter(this.m_points).g.M_normalize();
			if(objN.M_dot(N)<0)
				N.M_mul(-1);
			//console.log( "normal dot="+objN.M_dot(N));
			this.M_setNormal(N);
		}
		return this;
	
	}
	M_makeLocalBasis()
	{
		if(this.m_points.length>=3)
		{
			let AB = this.m_points[1].M_minus(this.m_points[0]).M_normalize();
			let AC = this.m_points[2].M_minus(this.m_points[0]).M_normalize();
			let N = AB.M_cross(AC).M_normalize();
			let J = N.M_cross(AB);
			this.m_localBasis = {O: this.m_points[0],I:AB,J:J, K:N};


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
			O: MV.M_mutlipliedByVector(this.m_localBasis.O),
			I: MV.M_rotateVector(this.m_localBasis.I),
			J: MV.M_rotateVector(this.m_localBasis.J),
			K: MV.M_rotateVector(this.m_localBasis.K) };

			//console.log("M_makeLocalBasis normalTransformed="+this.m_normalTransformed.M_getString()+" N="+this.m_localBasisTransformed.K.M_getString());

			// compute points coordinates in the new basis
			this.m_localPoints = [];
			for(let i=0; i<this.m_points.length; i++)
			{
				let p0 = MV.M_mutlipliedByVector(this.m_points[i]).M_minus(this.m_localBasisTransformed.O);
				let plocal = new RQVec2(this.m_localBasisTransformed.I.M_dot(p0),this.m_localBasisTransformed.J.M_dot(p0));
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
	// M_triangulate
	// creates m_triangle = array of {a,b,c} ( indexes in m_points list)
	M_triangulate()
	{
		// Make local basis
		if(!this.m_localBasis)
		{
			this.M_makeLocalBasis();
		}
		let points=[];
		//let flatPoints = [];
		for( let i=0; i<this.m_points.length; i++)
		{	
			let p0 = this.m_points[i].M_minus(this.m_localBasis.O);
			let plocal = new RQVec2(this.m_localBasis.I.M_dot(p0),this.m_localBasis.J.M_dot(p0));
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
	M_makePolyline( pos, MV,projFunc)
	{
		let L = new RQPolyLine();
		let el=this.m_edges.length;		
		for( let i=0; i<el; i++)
		{	let isPrev = L.M_nb()>0;
			let e = this.m_edges[i];
			if( e.isSegmented && e.poly)
			{
				for(let j=isPrev?1:0; j<e.poly.M_nb(); j++)
				{
					let pTransformed = MV.M_mutlipliedByVector(e.poly.M_getPoint(j) );
					L.M_addPoint(projFunc(pTransformed,pos));
					
				}
			
			}	
			else 
			{	//A.M_log("NO segment ! e.isSegmented="+(e.isSegmented)+" e.poly="+e.poly);
				let pTransformed;
				if( !isPrev)
					L.M_addPoint(projFunc( MV.M_mutlipliedByVector(e.A) ,pos)) ;
				L.M_addPoint(projFunc( MV.M_mutlipliedByVector(e.B) ,pos)) ;
			}
				
		}			
		return L;	
	
	}
	M_makePolylineClip( pos, MV,projFunc,opts)
	{
		let L = new RQPolyLine();
		let yClip = opts.yClip;
		let pNext =0;
		let el=this.m_edges.length;
		
		for( let i=0; i<=el; i++)
		{	let e = this.m_edges[ i==el?0:i];
			if( e )
			{
				let pA = MV.M_mutlipliedByVector(e.A);
				let pB = MV.M_mutlipliedByVector(e.B);
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
				{	//let Pproj = new RQVec2(pA.x,-pA.y + pA.z*zfact);				
					L.M_addPoint(projFunc(pA,pos) /*Pproj.M_plus(pos)*/);
				}
				if( pNext )
				{
					//let Pproj = new RQVec2(pNext.x,-pNext.y + pNext.z*zfact);				
					//L.M_addPoint(Pproj.M_plus(pos));
					L.M_addPoint(projFunc(pNext,pos) /*Pproj.M_plus(pos)*/);
					pNext = 0;				
				}
			}
		}
		L.M_closePath();
		return L;	
	
	}
	M_makePolylineClipWithEdges( pos, MV,projFunc,opts)
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
				let pA = MV.M_mutlipliedByVector(e.A);
				let pB = MV.M_mutlipliedByVector(e.B);
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
					let PprojA = projFunc(pA,pos) //new RQVec2(pos.x+pA.x,pos.y -pA.y + pA.z*zfact);				
					let PprojB = projFunc(pB,pos) //new RQVec2(pos.x+pB.x,pos.y -pB.y + pB.z*zfact);				
					if( L==null || flat!=L.isFlat || !L.M_endPoint().M_equals(PprojA))
					{	L = new RQPolyLine();
						L.isFlat = flat;
						out.push(L);
						L.M_addPoint(PprojA);
						L.M_addPoint(PprojB);
											
					}
					else
					{
						L.M_addPoint(PprojB);
					}
					

				
				}

			}
									
		
		}
		return out;	
	
	}
	// Face : create a polyline
	// no clipping to ground
	// allows segmentation
	M_makePolylineWithEdges( pos, MV,projFunc)
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
			let L = new RQPolyLine();
			L.isFlat = points.flat;
			for( let j=0; j<points.p.length; j++)
			{
				let pTransformed = MV.M_mutlipliedByVector(points.p[j]);
				L.M_addPoint(projFunc(pTransformed,pos));
			}
			out.push(L);
			
		}
		return out ;	
	
	}

	M_getString()
	{
		let s="";
		s+=" nbPoints = "+this.m_points.length+" [";
		for( let i=0; i<this.m_points.length; i++)
		{
			s+= " "+this.m_points[i].m_index;
		
		}
		s+=" ]";
		return s;
	
	
	
	}
};
class Edge extends RQLine
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
			e.poly = new RQPolyLine();
			if( dist>segLen)
			{
				let u = e.B.M_minus(e.A).M_multipliedBy(segLen/dist);
				while(l<dist)
				{	e.poly.M_addPoint(P.clone());
					P.M_add(u);
					l+=segLen;
				
				}
			}
			else
				e.poly.M_addPoint(P);					

			e.poly.M_addPoint(e.B.clone());					
		
		}
		// copy the points to this segment if it's a friend
		if( this.friend && !this.isSegmented)
		{
			this.isSegmented =true;
			// same direction ? 
			if( this.reverse)
			{
				this.poly = new RQPolyLine(/*e.poly.m_points*/);	// will make references to points
				let nb = e.poly.M_nb();
				for( let i=0;i<nb;i++)
					this.poly.M_addPoint( e.poly.M_getPoint(nb-1-i) );
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
		this.m_points = [];
		this.m_faces = [];
		this.m_edges = [];
	
	
	}
	M_getString()
	{
		let s ="";
		s+="POINTS : "+this.m_points.length+"\n";
		for( let i=0; i<this.m_points.length; i++)
			s+=" "+i+" "+this.m_points[i].M_getString()+"\n";	

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
	{
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
			let nbPts = F.m_points.length;
			for( let i=0; i<nbPts; i++)
			{
				let i2 = (i+1)%nbPts; 
				F.m_edges.push(this.M_addEdge(F.m_points[i],F.m_points[i2]));
			
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
	{
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
					let ang=Math.acos(cosAng)/DEGTORAD;
					if(ang<angLimit)
						e.isFlat = true; 
					//console.log("nbNormals="+e.fNormals.length+" cosAng="+cosAng+" ang="+ang+" "+(e.isFlat?"flat=true":""));
				}
			}			
		}
	}
	M_getGroundLine(MV,groundY)
	{
		const Y0 = new RQVec3(0,1,0);
		let skipBackfaces=true;
		let out=[];
		for(let iF=0; iF<this.m_faces.length; iF++)
		{
			let F=this.m_faces[iF];
			if( !(skipBackfaces&&F.m_isBackface) && ! (F.m_normalTransformed.M_dot(Y0)<-0.5 ))		// skip backfaces and faces looking downwards too much
			{
				let n = F.m_points.length;
				let L = null,gr=null;
				let pA=null,pB;
				let A_,B_;
				for( let i=0; i<=n; i++)
				{	pB = F.m_points[i%n];
					B_=MV.M_mutlipliedByVector(pB);
					if( i==0)
					{	pA=pB;
						A_ = MV.M_mutlipliedByVector(pA);					
					}
					else
					{
						if( (A_.y>=groundY && B_.y<=groundY) || (B_.y>=groundY && A_.y<=groundY)) 
						{
							// segment crosses the ground
							let lenY = Math.abs(A_.y-B_.y);
							let P = B_.M_minus(A_).M_multipliedBy( lenY>0? Math.abs(groundY-A_.y)/lenY:0.5).M_plus(A_);
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
		/*if( !face.m_localBasisTransformed)
		{	face.M_makeLocalBasis(this.MV);
			B=face.m_localBasisTransformed;

			face.pts=[];	// transformed points
			for(let i=0; i<face.m_points.length; i++)
			{	let p = this.MV.M_mutlipliedByVector(face.m_points[i]);
				let OP = p.M_minus(B.O);				
				face.pts.push(new RQVec2(OP.M_dot(B.I),OP.M_dot(B.J)) );
			}
			face.G = RQMaths.M_getPointsBarycenter(face.pts).g;
		}*/
		B=face.m_localBasisTransformed;

		//console.log("Basis = "+B.O.M_getString()+" "+B.I.M_getString()+" "+B.J.M_getString()+" "+B.K.M_getString());


/*
			// points local + transformed
			// compare the points
			for( let i=0; i<this.m_points.length; i++)
			{	
				let p = this.m_points[i];
				if( p.local)
				{
						// compute the projection of each point and its transformed, local coordinates
					let OPtr = MV.M_mutlipliedByVector(p).M_minus(this.m_localBasisTransformed.O);
					let localTr = new RQVec2( OPtr.M_dot(this.m_localBasisTransformed.I),OPtr.M_dot(this.m_localBasisTransformed.J) );

					console.log(`P[${i}] local=${p.local.M_getString()} localtre=${localTr.M_getString()}`);

				}
			}

*/


		// project P and prevP in local basis transformed
		// p will get the coordinates on the face's local basis
		let OP = P.M_minus(B.O);
		let p = new RQVec2(  OP.M_dot(B.I),OP.M_dot(B.J) /*,OP.M_dot(B.K)*/ );
		let prevOP = prevP.M_minus(B.O);
		let prevp = new RQVec2(  prevOP.M_dot(B.I),prevOP.M_dot(B.J));


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
		//A.M_drawDebugVector(P,new RQVec3(0,0,0));
		if( false ) // debug
		{
			// build P back from face equations
			let Ptest = B.O.clone();
			Ptest.M_add(B.I.M_multipliedBy(p.x));
			Ptest.M_add(B.J.M_multipliedBy(p.y));
			A.M_drawDebugVector(Ptest,new RQVec3(0,0,0));

		}


		for( let iTri = 0; iTri<face.m_triangles.length; iTri++)
		{
			let tri=face.m_triangles[iTri];
			//console.log("Testing p"+p.M_getString()+" vs ("+face.m_points[tri.a].local.M_getString()+" / "+face.m_points[tri.b].local.M_getString()+" / "+face.m_points[tri.c].local.M_getString());

			if( false)	// Draw triangulation result
			{	let L = new RQPolyLine( [
						A.M_projection(this.MV.M_mutlipliedByVector(face.m_points[tri.a])),
						A.M_projection(this.MV.M_mutlipliedByVector(face.m_points[tri.b])),
						A.M_projection(this.MV.M_mutlipliedByVector(face.m_points[tri.c])) 
					]);
				A.m_groups.Debug.m_strokeColor = "#FF00FF";
				A.M_drawLines(A.m_groups.Debug,L,false);
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
			else
			{

				/*if(report.x>0 && report.y>0)	// likely the external segment we are looking for
				{	
					if( edgeFoundCount++)
					{	//console.error("WE ALREADY HAVE AN adjacent EDGE : "+edgeFoundCount);

					}
					edgeFoundCount++;
					adjEdge={A:face.m_points[iF-1],B:face.m_points[iF%nb]};
					edgeOrigin = this.MV.M_mutlipliedByVector( face.m_points[iF-1]);
					edgeVecUnit = this.MV.M_mutlipliedByVector( face.m_points[iF%nb]).M_minus( edgeOrigin).M_normalize();
				}*/
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
			let n= face.m_points.length;
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
						let M = Q_.M_plus( V_.M_multipliedBy(l));
						let PM = M.M_minus(P_);
						let k = PM.M_length() / U_.M_length();
						if( k>=0 && k<=1)
						{
							// we found an edge ! 
							if(distToEdge> Math.abs(l-0.5))
							{	distToEdge = Math.abs(l-0.5);
								// adjust M to avoid being too close to corners
								if( distToEdge>0.48)
								{	l = 0.5+0.48*Math.sign(l-0.5);
									let M = Q_.M_plus( V_.M_multipliedBy(l));
								}
								
								adjEdge={A:face.m_points[i],B:face.m_points[(i+1)%n]};
								edgeOrigin = this.MV.M_mutlipliedByVector( face.m_points[i]);
								edgeVecUnit = this.MV.M_mutlipliedByVector( adjEdge.B).M_minus( edgeOrigin).M_normalize();
								edgeIntersect = B.O.M_plus( B.I.M_multipliedBy(M.x)).M_plus(B.J.M_multipliedBy(M.y));
								// draw the intersection
								//A.M_drawDebugVector(edgeIntersect,new RQVec3(0,0,0));
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


		this.M_createCube(o.width,o.height,o.depth,true);
		
		this.M_breakCorners({pass:2, kMin:0.1, kMax:0.96, rndFunc:o.rndFunc });
	}
	M_createRock(o)
	{
		if(!o) o={width:50,height:90,depth:50}
		if( o.rndFunc==undefined)
			o.rndFunc = Math.random;


		this.M_createCube(o.width,o.height,o.depth,true);
		
		this.M_breakCorners({pass:2, kMin:0.1, kMax:0.96, rndFunc:o.rndFunc });
	}



	M_breakCorners(opts)
	{
		this.M_computeEdges();
		let k=0.15;
		let kMax = opts.kMax || 0.9;
		let kMin = opts.kMin || 0.1;
		let nbPass = opts.pass || 1;
		let rnd = opts.rndFunc || Math.random();
		
		for( let pass=0; pass<nbPass; pass++)
		{
			for(let i=0; i<this.m_edges.length; i++)
			{
				k = (kMin+(kMax-kMin)*rnd())*0.5;
				let E = this.m_edges[i];
				// split the edge
				let pA = E.A.M_plus( E.B.M_minus(E.A).M_multipliedBy(k) ); pA.m_index = this.m_points.length;
				this.m_points.push(pA);

				if( !E.A.newP) E.A.newP=[]; E.A.newP.push(pA);

				let pB = E.A.M_plus( E.B.M_minus(E.A).M_multipliedBy(1-k) ); pB.m_index = this.m_points.length;
				this.m_points.push(pB);

				if( !E.B.newP) E.B.newP=[]; E.B.newP.push(pB);

				// edge is modified
				E.A = pA;
				E.B = pB; 
			}		

			for( let iF=0; iF<this.m_faces.length; iF++)
			{
				let F= this.m_faces[iF];
				F.m_points = [];
				let pPrev=null;
				for(let ie=0; ie<F.m_edges.length; ie++)
				{
					let E = F.m_edges[ie];
					if( E.friend)
					{
						E.A = E.reverse?E.friend.B : E.friend.A; 
						E.B = E.reverse?E.friend.A : E.friend.B; 
					}
					if( E.A!=pPrev)
						F.m_points.push(E.A);
					if(E.B!=F.m_points[0])
						F.m_points.push(E.B);
					pPrev= E.B;
				}
				F.m_edges=[];
			}
			// for each points, make a face 
			//for( let i=0; i<this.m_points.length; i++)
			for(let i = this.m_points.length -1; i >= 0 ; i--)
			{
				let P = this.m_points[i];
				if( P.newP)
				{	let F = new Face(...P.newP);
					
					F.M_computeNormal();
					/*if( F.m_normal.M_dot( P)<0 )
					{	F.m_points.reverse();
						F.m_normal.M_mul(-1);
					}*/
					this.m_faces.push(F);
					this.m_points.splice(i,1);
				}
				// remove point

				P.newP = null;

			}
			
			this.m_edges=[];
			this.M_computeEdges();

			// redo indexes
			for( let i =0; i<this.m_points.length; i++)
			{	this.m_points[i].m_index = i;

			}

		} // pass




	}

	M_createCube	(sizeX,sizeY,sizeZ,noEdgeCompute)
	{
		this.m_dimensions = new RQVec3(sizeX,sizeY,sizeZ);
		if( 8!=this.m_points.length || 6!=this.m_faces.length || 12!=this.m_edges.length)
		{
			this.M_clear();
			// Points
			let i,j,k;
			let index=0;
			for( k=-1; k<=1; k+=2)
			{
				for( j=-1; j<=1; j+=2)
				{
					for( i=-1; i<=1; i+=2)
					{	let p = new RQVec3( i*sizeX*0.5, j*sizeY*0.5, k*sizeZ*0.5);
						p.m_index = index++;
						this.m_points.push( p);
											
					}			
				
				}
			}
			let corner = (i,j,k)=>this.m_points[ (i+1)/2  + 2*(j+1)/2 + 4*(k+1)/2];

			// X
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(-1,-1,1), corner(-1,1,1),corner(-1,1,-1))).M_setNormal(-1,0,0)  );			
			this.m_faces.push( (new Face( corner( 1,-1,-1), corner( 1,1,-1), corner( 1,1,1), corner( 1,-1,1) )).M_setNormal(+1,0,0)  );			

			// Y
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(-1,-1,1), corner(1,-1,1),corner( 1,-1,-1)  )).M_setNormal(0,-1,0)  );			
			this.m_faces.push( (new Face( corner(-1,1,-1), corner(-1,1,1), corner(1,1,1),corner( 1,1,-1)  )).M_setNormal(0,+1,0)  );			

			// Z
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(-1,1,-1), corner(1,1,-1),corner( 1,-1,-1)  )).M_setNormal(0,0,-1)  );			
			this.m_faces.push( (new Face( corner(-1,-1,1), corner(-1,1,1), corner(1,1,1),corner( 1,-1,1)  )).M_setNormal(0,0,1)  );			

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
		this.m_dimensions = new RQVec3(w,h*nb,depth);
		
		let y = 0;
		let z = depth/2; 
		let index=0;
		var pEnd1,pEnd2;
		let alpha = opt.torsion / nb;
		for( let iStair=0; iStair<=nb; iStair++)
		{
			var p1,p2,p3,p4;
		
			p1 = new RQVec3( w/2,y  ,z);	p1.m_index = index++;
			this.m_points.push(p1)
			p4 = new RQVec3(-w/2,y  ,z);	p4.m_index = index++;
			this.m_points.push(p4);

			if(iStair<nb)
			{
				p2 = new RQVec3( w/2,y+h,z);	p2.m_index = index++; 
				p3 = new RQVec3(-w/2,y+h,z);	p3.m_index = index++; 
				this.m_points.push(p2,p3);
			}

			
			if(iStair<nb)
			{
				let F = new Face();				
				F.m_points.push(p1,p2,p3,p4);
				F.M_setNormal(0,0,1);
				//F.M_computeNormal();				
				this.m_faces.push(F);
				Fside[0].m_points.push(p1,p2);
				Fside[1].m_points.push(p4,p3);
			}
			else
			{
				Fside[0].m_points.push(p1);
				Fside[1].m_points.push(p4);
				pEnd1=p1;
				pEnd2=p4;	
			}

			// flat step face
			if( iStair>0)
			{
				let F2 = new Face(this.m_points[p1.m_index-2],this.m_points[p1.m_index],this.m_points[p4.m_index],this.m_points[p4.m_index-2]).M_setNormal(0,1,0);				
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

			let	p = new RQVec3( w/2*(i==0?1:-1), isStraightBack? 0 : y-h  ,z);	p.m_index = index++;
			this.m_points.push(p);
			pBack[i]=p;
			Fside[i].m_points.push(p);

			if( !isStraightBack)
			{	// create a point on the ground 
				let	p2 = new RQVec3( w/2*(i==0?1:-1), 0  ,depth/2-d);	p2.m_index = index++;
				this.m_points.push(p2);
				Fside[i].m_points.push(p2);
				pGround[i]=p2;
			}

			if( i==0)
				Fside[i].m_points.reverse();

			Fside[i].M_setNormal(i==0?1:-1,0,0);				
			this.m_faces.push(Fside[i]);				
		
		}
		// back stair face
		if( true )
		{	let Fback = new Face();
			Fback.m_points.push(pBack[0],pBack[1],pEnd2,pEnd1);
			Fback.M_computeNormal();
			this.m_faces.push(Fback);
		}	
		if( !isStraightBack )
		{	let Fback = new Face();
			Fback.m_points.push(pGround[0],pGround[1], pBack[1],pBack[0]);
			Fback.M_computeNormal();
			this.m_faces.push(Fback);
		}	
		
		this.M_computeEdges();	
	
	}

	M_createColumnObject(height,opt)
	{
		if( opt.rndFunc==undefined)
			opt.rndFunc = Math.random;
		opt.column=true;
		opt.polygonNb = 3+Math.round(opt.rndFunc()*9);
		// in column, each face gets 1 carving made of n points
		opt.columnCarvePts=4;
		this.M_createTrunkObject(height,opt);


	}

	M_createTrunkObject(height,opt)
	{
		if(opt==undefined)
			opt={};
		if( opt.rndFunc==undefined)
			opt.rndFunc = Math.random;
		let nbH = opt.nbSeg?  opt.nbSeg : 5;		// nbSegmentsHeight
		let r = opt.sz?  opt.sz/2 : height/6;
		let nbPointsCircle = opt.polygonNb || 12;
		let nbRotationPoints = nbPointsCircle;
		let isColumn = opt.column?true:false;
		let nbCarvingPoints = 0;
		let carvingShrink = 0.4;
		if( isColumn)
		{	nbCarvingPoints = opt.columnCarvePts || 3;
			nbPointsCircle = nbPointsCircle*nbCarvingPoints;
		}
		this.m_dimensions = new RQVec3(2*r,height,2*r);

		let index = 0;
		let p;
		let y = -height/2; 
		let aInc = 2*Math.PI/nbRotationPoints;
		for( let j=0; j<=nbH; j++)
		{
			let a = 0;
			// center with random decal
			let C = new RQVec2( (opt.rndFunc()-0.5)*r/8,(opt.rndFunc()-0.5)*r/8);
			for( let i =0; i<nbRotationPoints; i++)
			{
				
				// column carving points
				if(isColumn)
				{	let a2 = a + aInc*(0.5-carvingShrink/2); 
					let a2Inc= aInc*carvingShrink/(nbCarvingPoints-1);
					let wCarving = aInc*carvingShrink*r;
					let rCarving = wCarving/2;
					let aCarv=0;
					let aCarvInc = Math.PI/(nbCarvingPoints-1);
					for(let i2=0; i2<nbCarvingPoints; i2++)
					{
						let r2 = r-rCarving*Math.sin(aCarv);
						p = new RQVec3( r2*Math.cos(-a2)+C.x, y, r2*Math.sin(-a2)+C.y);
						p.m_index = index++;
						this.m_points.push(p);
						a2+=a2Inc;
						aCarv+=aCarvInc;
					}

				}
				else 
				{	p = new RQVec3( r*Math.cos(-a)+C.x, y, r*Math.sin(-a)+C.y);
					p.m_index = index++;
					this.m_points.push(p);
				}

				a+=aInc;
			}
			y+= height/nbH;
		}

		// make faces
		let pt = (i,j)=>this.m_points[ j*nbPointsCircle +i];
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
					F.m_points.push( pt(nbPointsCircle-1-i,j) );
				else if( j==nbH)
					F.m_points.push( pt(i,j) );
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
			p = new RQVec3( r*Math.cos(a), 0, r*Math.sin(a));
			p.m_index = index++;
			this.m_points.push( p);
			a+=2*Math.PI/3;
		}	
		// Make top point 
		let s = this.m_points[0].M_dist(this.m_points[1]);
		let l = s*0.5*Math.tan(Math.PI/3);
		let d= this.m_points[1].z;
		let h = Math.sqrt( l*l-d*d);
		
		p = new RQVec3( 0, h, 0);
		p.m_index = index++;
		this.m_points.push( p);


		// find barycenter 
		let g = new RQVec3(0,0,0);
		for( let i=0; i<this.m_points.length; i++)
		{
			g.M_add(this.m_points[i]);
		
		}
		g.M_mul(1/this.m_points.length);
		
		// translate all the points to center 
		for( let i=0; i<this.m_points.length; i++)
		{
			this.m_points[i].M_sub(g);
		
		}
		// real sph radius = dist points to center 
		r = this.m_points[0].M_dist(0,0,0);
		for( let i=0; i<this.m_points.length; i++)
		{
			this.m_points[i].M_mul(radius/r);
		
		}


		// Make faces 
		let pt = (i)=>this.m_points[i];

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
				let nb = F.m_points.length;
				let newp = [];
				for( let i=0; i<nb; i++)
				{	let i2 = (i+1)%nb;
					let p = F.m_points[i2].M_plus( F.m_points[i]);
					p.M_mul(0.5);
					p.M_normalize();
					p.M_mul(radius);
					this.m_points.push(p);
					p.m_index = this.m_points.length-1;
					newp.push(p);



				}
				for( let i=0; i<nb; i++)
				{	let i2 = (i+1)%nb;
					// make faces
					this.m_faces.push( (new Face( F.m_points[i2],newp[i2], newp[i] )).M_computeNormal()  );			
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

// getClass
// to create an object with a classname passed as a string
var _cls_ = {}; // serves as a cache, speed up later lookups
function getClass(name){
  if (!_cls_[name]) {
    // cache is not ready, fill it up
    if (name.match(/^[a-zA-Z0-9_]+$/))
    {
      // proceed only if the name is a single word string
        try
        {
          _cls_[name] = eval(name);
        }
        catch(e)
        {   //console.error(e);
           _cls_[name]=null;
        }
    } else {
      // arbitrary code is detected 
      throw new Error("getClass "+name+"??");
    }
  }
  return _cls_[name];
}
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
	
	
	}
	M_copyFrom(M)
	{
		for(let i=0; i<16; i++)
		{
			this.m_a[i] = M.m_a[i];
		}
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
	M_setRotationMatrix( angleDeg, x, y, z)
	{
		var radians, c, s, c1, length;
		var u = [];	//3
		var i, j;
		
		radians = (angleDeg * Math.PI) / 180.0;
		
		c = Math.cos(radians);
		s = Math.sin(radians);
		
		c1 = 1.0 - Math.cos(radians);
		
		length = Math.hypot(x,y,z);
		
		u[0] = x / length;
		u[1] = y / length;
		u[2] = z / length;
		
		for (i = 0; i < 16; i++) {
			this.m_a[i] = 0.0;
		}
		
		this.m_a[15] = 1.0;
		
		for (i = 0; i < 3; i++) {
			this.m_a[i * 4 + (i + 1) % 3] = u[(i + 2) % 3] * s;
			this.m_a[i * 4 + (i + 2) % 3] = -u[(i + 1) % 3] * s;
		}
		
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				this.m_a[i * 4 + j] += c1 * u[i] * u[j] + (i == j ? c : 0.0);
			}
		}
	}
	// M_rotate
	// Applies a rotation
	M_rotate(angleDeg, x, y, z)
	{
		let rotateMatrix = new RQMatrix4();
		rotateMatrix.M_setRotationMatrix(angleDeg, x, y, z);
			
		// matrix * scale_matrix
		let M = this.M_multipliedByMatrix(rotateMatrix);
		this.M_copyFrom(M);
		return this;
	}
	// M_multipliedByMatrix
	M_multipliedByMatrix(mat)
	{
		var result = new RQMatrix4();
		result.m_a[ 0] =mat.m_a[ 0]*this.m_a[0] +mat.m_a[1]*this.m_a[4] +mat.m_a[2]*this.m_a[ 8] +mat.m_a[3]*this.m_a[12];
		result.m_a[ 1] =mat.m_a[ 0]*this.m_a[1] +mat.m_a[1]*this.m_a[5] +mat.m_a[2]*this.m_a[ 9] +mat.m_a[3]*this.m_a[13];
		result.m_a[ 2] =mat.m_a[ 0]*this.m_a[2] +mat.m_a[1]*this.m_a[6] +mat.m_a[2]*this.m_a[10] +mat.m_a[3]*this.m_a[14];
		result.m_a[ 3] =mat.m_a[ 0]*this.m_a[3] +mat.m_a[1]*this.m_a[7] +mat.m_a[2]*this.m_a[11] +mat.m_a[3]*this.m_a[15];
	
		result.m_a[ 4] =mat.m_a[ 4]*this.m_a[0] +mat.m_a[ 5]*this.m_a[4] +mat.m_a[6]*this.m_a[ 8] +mat.m_a[7]*this.m_a[12];
		result.m_a[ 5] =mat.m_a[ 4]*this.m_a[1] +mat.m_a[ 5]*this.m_a[5] +mat.m_a[6]*this.m_a[ 9] +mat.m_a[7]*this.m_a[13];
		result.m_a[ 6] =mat.m_a[ 4]*this.m_a[2] +mat.m_a[ 5]*this.m_a[6] +mat.m_a[6]*this.m_a[10] +mat.m_a[7]*this.m_a[14];
		result.m_a[ 7] =mat.m_a[ 4]*this.m_a[3] +mat.m_a[ 5]*this.m_a[7] +mat.m_a[6]*this.m_a[11] +mat.m_a[7]*this.m_a[15];
	
		result.m_a[ 8] =mat.m_a[ 8]*this.m_a[0] +mat.m_a[ 9]*this.m_a[4] +mat.m_a[10]*this.m_a[ 8] +mat.m_a[11]*this.m_a[12];
		result.m_a[ 9] =mat.m_a[ 8]*this.m_a[1] +mat.m_a[ 9]*this.m_a[5] +mat.m_a[10]*this.m_a[ 9] +mat.m_a[11]*this.m_a[13];
		result.m_a[10] =mat.m_a[ 8]*this.m_a[2] +mat.m_a[ 9]*this.m_a[6] +mat.m_a[10]*this.m_a[10] +mat.m_a[11]*this.m_a[14];
		result.m_a[11] =mat.m_a[ 8]*this.m_a[3] +mat.m_a[ 9]*this.m_a[7] +mat.m_a[10]*this.m_a[11] +mat.m_a[11]*this.m_a[15];
	
		result.m_a[12] =mat.m_a[12]*this.m_a[0] +mat.m_a[13]*this.m_a[4] +mat.m_a[14]*this.m_a[ 8] +mat.m_a[15]*this.m_a[12];
		result.m_a[13] =mat.m_a[12]*this.m_a[1] +mat.m_a[13]*this.m_a[5] +mat.m_a[14]*this.m_a[ 9] +mat.m_a[15]*this.m_a[13];
		result.m_a[14] =mat.m_a[12]*this.m_a[2] +mat.m_a[13]*this.m_a[6] +mat.m_a[14]*this.m_a[10] +mat.m_a[15]*this.m_a[14];
		result.m_a[15] =mat.m_a[12]*this.m_a[3] +mat.m_a[13]*this.m_a[7] +mat.m_a[14]*this.m_a[11] +mat.m_a[15]*this.m_a[15];		
		return result;
	}	
	
	// returns: RQVec3 with additional w
	M_mutlipliedByVector(v)
	{
		if( v.w==undefined)
			v.w= 1;
		var result = new RQVec3();
		result.x = this.m_a[0]*v.x + this.m_a[4]*v.y + this.m_a[8 ]*v.z + this.m_a[12]*v.w;
		result.y = this.m_a[1]*v.x + this.m_a[5]*v.y + this.m_a[9 ]*v.z + this.m_a[13]*v.w;
		result.z = this.m_a[2]*v.x + this.m_a[6]*v.y + this.m_a[10]*v.z + this.m_a[14]*v.w;
		result.w = this.m_a[3]*v.x + this.m_a[7]*v.y + this.m_a[11]*v.z + this.m_a[15]*v.w;
		return result;
	}
	
	// M_rotateVector
	// applies the rotation only to a RQVec3
	// returns a rotated RQVec3
	M_rotateVector(v)
	{
		let result = new RQVec3();
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
		return new RQVec3(this.m_a[12],this.m_a[13],this.m_a[14]);

	}
	M_setTranslation(x,y,z) 
	{
		if( typeof x==='object')
		{
			z=x.z;
			y=x.y;
			x=x.x;
		}
		this.m_a[12]=x;
		this.m_a[13]=y;
		this.m_a[14]=z;

	}



	// M_translate
	M_translate( x,y,z)
	{
		if( typeof x==='object')
		{
			z=x.z;
			y=x.y;
			x=x.x;
		}

		// matrix * translate_matrix
		this.m_a[12] += (this.m_a[0] * x + this.m_a[4] * y + this.m_a[8]  * z);
		this.m_a[13] += (this.m_a[1] * x + this.m_a[5] * y + this.m_a[9]  * z);
		this.m_a[14] += (this.m_a[2] * x + this.m_a[6] * y + this.m_a[10] * z);
		this.m_a[15] += (this.m_a[3] * x + this.m_a[7] * y + this.m_a[11] * z);
		return this;
	}
	//  M_scale
	M_scale(x,y,z)
	{
		if( y==undefined || z==undefined)
		{	y=z=x; 
		}
		this.m_a[0]  *= x;
		this.m_a[1]  *= x;
		this.m_a[2]  *= x;
		this.m_a[3]  *= x;
		
		this.m_a[4]  *= y;
		this.m_a[5]  *= y;
		this.m_a[6]  *= y;
		this.m_a[7]  *= y;
		
		this.m_a[8]  *= z;
		this.m_a[9]  *= z;
		this.m_a[10] *= z;
		this.m_a[11] *= z;
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
