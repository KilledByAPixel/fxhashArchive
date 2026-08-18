
class RQLine
{

	constructor(A,B,C,D)
	{
		if( A==undefined)
		{
			this.A = new RQVec2(0,0);	
			this.B = new RQVec2(0,0);	
		}
		else if(D!=undefined)
		{
			this.A = new RQVec2(A,B);	
			this.B = new RQVec2(C,D);	

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
	M_removePoint(i)
	{	this.m_points.splice(i,1);

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
	M_rotate(angleDeg)
	{
		for(var i=this.m_points.length-1; i>=0; i--)
		{ 	this.m_points[i].M_rotate(angleDeg);
		
		}
	}
	M_rotate(rotDeg,O)
	{	O??=new RQVec2(0,0);
		let a=rotDeg*DEGTORAD;
		let co=Math.cos(a);
		let si=Math.sin(a);
		for(var i=this.m_points.length-1; i>=0; i--)
		{ 	let p=this.m_points[i];
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
				this.M_addPoint(A.clone());
			}
		}
	}
	M_append(L)
	{	if( L && Array.isArray(L.m_points))
			this.m_points.push(...L.m_points);
	}
	M_appendReverse(L)
	{	if( L && Array.isArray(L.m_points))
		{
			let n=L.m_points.length;
			for(let i=n-1; i>=0;i--)
				this.m_points.push(L.m_points[i]);
		}
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
				pathPoints+=(ip==0?"":" L ")+p.x+" "+p.y;				
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
		let n=this.m_points.length;
		let r;
		for(let i=0; i<n;i++)
		{
			let p=this.m_points[i];
			if(i==0)
				r=new RQRectangle(p.x,p.y,0,0);
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
					if(RQTriangulate.sM_isInsideTriangle(P,A,this.m_points[i],this.m_points[i2]))
					//if( P.M_isInTriangle(A,this.m_points[i],this.m_points[i2]))
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

