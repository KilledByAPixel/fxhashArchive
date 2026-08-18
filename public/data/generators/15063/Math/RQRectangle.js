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
	M_isIntersect(r)
	{
		return (r.w<=0 || r.h<=0 || r.right()<=this.x ||  r.top()<=this.y || r.x>=this.right() || r.y>=this.top()) ?false:true;

	}
	M_getIntersection(r)
	{
		if( !this.M_isIntersect(r))
			return null;
		
		let out=new RQRectangle();
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
	M_isPointInside( P)
	{	return this.M_isInside(P.x,P.y,0);
	}
	M_isInside( x, y, margin)
	{	if(margin==undefined) margin=0;
		
		return Math.hypot( x-(this.x+this.w*0.5), (y-(this.y+this.h*0.5))*this.w/this.h)<(this.w*0.5+margin);
	}
	M_createPolyline(nb)
	{
		var L = new RQPolyLine();
		let aStep = Math.PI*2/nb;
		let a=0;
		let C=this.M_getCenter();
		for( let i=0; i<=nb; i++)
		{
			L.M_addPoint(C.x+ this.w/2*Math.cos(a),C.y+ this.h/2*Math.sin(a));
			a+=aStep;
		}

		return L;
	}
	M_getSVGPath()
	{	let r=this.M_getRadius();
		let c=this.center();
		return `M ${c.x} ${c.y} m ${-r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 ${-(r * 2)},0`;

	}


}
