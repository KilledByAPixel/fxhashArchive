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
	M_rotated(angDeg)
	{	
		// P = this.x*I + this.y*J
		// I  cos(a)
		//    sin(a)
		// J  -sin(a)
		//     cos(a)
		// P' x*cos(a) + y*-sin(a)
		//    x*sin(a) + y*cos(a)
		let co=Math.cos(angDeg*DEGTORAD);
		let si=Math.sin(angDeg*DEGTORAD);
		return new RQVec2( this.x*co-this.y*si, this.x*si+this.y*co);
	}
	M_rotate(angDeg)
	{
		let co=Math.cos(angDeg*DEGTORAD);
		let si=Math.sin(angDeg*DEGTORAD);
		this.M_set( this.x*co-this.y*si, this.x*si+this.y*co);
		return this;
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
