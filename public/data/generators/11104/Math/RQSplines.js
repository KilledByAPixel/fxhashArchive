class CatmullRomSpline
{

	constructor(p0,p1,p2,p3)
	{
		this.m_alpha = 0.5;
		this.p0=p0;
		this.p1=p1;
		this.p2=p2;
		this.p3=p3;			

	}
	M_getString()
	{
		return "Spline p0="+this.p0.M_getString()+" p1="+this.p1.M_getString()+" p2="+this.p2.M_getString()+" p3="+this.p3.M_getString();
	}
	M_getVectorAt(t)
	{
		let t0 = 0;
		let t1 = this.M_getT(t0, this.p0, this.p1);
		let t2 = this.M_getT(t1, this.p1, this.p2);
		let t3 = this.M_getT(t2, this.p2, this.p3);

		//console.log("t0="+t0+" t1="+t1+" t2="+t2+" t3="+t3);
		t=t1+(t2-t1)*t;

		let A1 =  this.p0.M_multipliedBy( (t1-t)/(t1-t0) ).M_add( this.p1.M_multipliedBy( (t-t0)/(t1-t0) ));
		let A2 =  this.p1.M_multipliedBy( (t2-t)/(t2-t1) ).M_add( this.p2.M_multipliedBy( (t-t1)/(t2-t1) ));
		let A3 =  this.p2.M_multipliedBy( (t3-t)/(t3-t2) ).M_add( this.p3.M_multipliedBy( (t-t2)/(t3-t2) ));
		//console.log("A1 = "+A1.M_getString());
		//console.log("A2 = "+A2.M_getString());
		//console.log("A3 = "+A3.M_getString());

		let B1 =  A1.M_multipliedBy( (t2-t)/(t2-t0) ).M_add( A2.M_multipliedBy( (t-t0)/(t2-t0) ));
		let B2 =  A2.M_multipliedBy( (t3-t)/(t3-t1) ).M_add( A3.M_multipliedBy( (t-t1)/(t3-t1) ));

		let C  =  B1.M_multipliedBy( (t2-t)/(t2-t1) ).M_add( B2.M_multipliedBy( (t-t1)/(t2-t1) ));

		return C;

		    
	}

	M_getT(t, p0, p1)
	{
	    let a =(p1.x-p0.x)*(p1.x-p0.x) + (p1.y-p0.y)*(p1.y-p0.y);
	    if( p0.z != undefined)
			a+=(p1.z-p0.z)*(p1.z-p0.z)	    	

	    let b = Math.pow(a, this.m_alpha * 0.5);
		if(isNaN(b))
		{   	console.error("is NAN !! "+this.M_getString());
			b=0;
		}
	    return b + t;
	}

}
