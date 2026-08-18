// 
PatternAlgorithm.prototype.M_drawJaggedLine = function(lines,thicknessMult,group,isMask,clipOpts)
{
	if( lines==undefined || !group)
		return;
	let Ls =  isMask? this.M_computeLineMask(lines,clipOpts): (Array.isArray(lines)? lines : [lines]);
	for( let i=0; i<Ls.length; i++)
	{	let pts = this.M_polyLineToJaggedPoints(Ls[i],thicknessMult)
		if( A.buildSvg)
			group.m_lines.push( Ls[i]);

		this.M_drawPoints(group,pts);
	}

}
PatternAlgorithm.prototype.M_polyLineToJaggedPoints = function(input,thicknessMult)
{
	var multipleLines = input.m_isPolyLine;
	let nbLines = 1, currentLine;
	if( multipleLines)
		nbLines = input.M_nb()-1;			
	else currentLine = input;		
	let out=[];
	for( let iLine = 0; iLine<nbLines; iLine++)
	{
		if( multipleLines)
			currentLine = input.M_getLine(iLine);
	
		let slope= new RQVec2(currentLine.B.x-currentLine.A.x,currentLine.B.y-currentLine.A.y);
		let len = slope.M_length();
		if( len>0)
		{	let P=currentLine.A.clone();

			let u= new RQVec2( slope.x/len, slope.y/len);	// unit vector along the line
			let step;
			for(let l=0.0; l<=len; l+=step)
			{
				let thickness = map(noise.simplex2(random(10000),l*1),0,1,this.W/8000*thicknessMult,this.W/4000*thicknessMult);
						
				out.push({x:P.x+random(-0.2,0.2) ,y:P.y+random(-0.2,0.2),r:thickness})
				
				// step along the line
				step = this.W/random(3000,800);
				P.x += u.x*step;
				P.y += u.y*step;
	
			}
		}
	}
	return out;

}


function hatchedRect(x,y,w,h,gap,pattern)
{
	var out=[];
	const jaggedLine = function(x1,y1,x2,y2) {out.push(new RQLine(x1,y1,x2,y2));}
	let subGridSize = gap;
	for(let y1=0;y1<h;y1+=subGridSize)
	{
	  for(let x1=0;x1<w;x1+=subGridSize)
	  {
		switch(pattern)
		{
		  case 0:
			jaggedLine(
			  x+x1,            y+y1,
			  x+x1+subGridSize,y+y1);
			break;
		  case 1:
			jaggedLine(
			  x+x1,            y+y1,
			  x+x1,            y+y1+subGridSize);
			break;
		  case 2:
			jaggedLine(
			  x+x1,            y+y1,
			  x+x1+subGridSize,y+y1+subGridSize);
			break;
		  case 3:
			jaggedLine(
			  x+x1+subGridSize,y+y1,
			  x+x1,            y+y1+subGridSize);
			break;
		  case 4:
			jaggedLine(
			  x+x1,            y+y1,
			  x+x1+subGridSize,y+y1+subGridSize);
			jaggedLine(
			  x+x1+subGridSize,y+y1,
			  x+x1,            y+y1+subGridSize);
			break;
		  case 5:
			jaggedLine(
			  x+x1,            y+y1,
			  x+x1+subGridSize,y+y1);
			jaggedLine(
			  x+x1,            y+y1,
			  x+x1+subGridSize,y+y1+subGridSize);
			jaggedLine(
			  x+x1+subGridSize,y+y1,
			  x+x1,            y+y1+subGridSize);
			break;
		};
	  }
	}
	return out;  
}


// M_jaggedHatchShape
// opts
// {	gap
// 		angle
// 		thicknessMult
// 		group
// }
PatternAlgorithm.prototype.M_jaggedHatchShape = function(shape,opts)
{

	// what we did : 
	// 
	// 1 ) let lines = hatchedRect(x,y, w, h, gap,  pattern);
	// 2 ) for each line, _.M_drawJaggedLine(line,ThicknessMult,group ,true);


	// what we want to do : 
	// call _.M_hatchShape and benefit from its mask clipping / pattern organization algorithm
	// with the output lines, call _.M_drawJaggedLine

	let F =	// this is hatch options with basic setup
	{
		spacing 		: opts.gap,
		protect			: opts.thicknessMult/2,			// if not null, protect will draw a line in the clipping mask on the contour, to prevent the hatches to come too close to the boundaries
		alternate		: true,
		jointEnds		: false,
		orientation		: opts.angle,
		thres 			: opts.thres
	}	
	let Ls = this.M_hatchShape( shape ,F);
	if( Ls)
	{	let pts=[];
		while(line=Ls.pop())
		{
			pts.push(...this.M_polyLineToJaggedPoints(line,opts.thicknessMult))
			if( this.buildSvg)
				opts.group.m_lines.push( line);

		}
		this.M_drawPoints(opts.group,pts);

	}

}



// Some functions mapping
const map = RQMaths.M_map;



// P5 random function
function random(min, max)
{
	var rand= Math.random();

	if (typeof min === 'undefined') {
	  return rand;
	} else if (typeof max === 'undefined') {
	  if (min instanceof Array) {
		return min[Math.floor(rand * min.length)];
	  } else {
		return rand * min;
	  }
	} else {
	  if (min > max) {
		var tmp = min;
		min = max;
		max = tmp;
	  }

	  return rand * (max - min) + min;
	}
}
