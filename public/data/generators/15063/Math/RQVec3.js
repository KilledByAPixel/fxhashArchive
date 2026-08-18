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
