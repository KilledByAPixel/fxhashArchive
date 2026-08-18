class LeafManagerClass
{

	constructor()
	{
	
	
	}

	M_createLeafOptions( leafShape)
	{
		let leafOpts={};
		switch(leafShape)
		{
			case "Default":
			case "default":
			default:
				leafOpts = {profile:this.M_defaultLeafProfile, segments: 20,ratio:0.8};
				break;

			case "Oak":
				leafOpts = {profile:this.M_oakLeafProfile, invProfile: this.M_mintLeafInvProfile, oakSpikes:12, segments: 60, ratio:0.625, centerLine:true};
				break;
			case "Ash":
				leafOpts = {profile:this.M_ashLeafProfile,organizeFun: this.M_ashOrganize, ashLeaves:4.5,segments:150,ratio:0.9,stemRatio:0,centerLine:false};
				break;		
			case "Mint":
				leafOpts = {profile:this.M_mintLeafProfile, segments: 30,ratio:0.45};
				break;
			case "Ivy":
				leafOpts = {profile:this.M_ivyLeafProfile, segments: 60,ratio:1,stemRatio:0.5,centerLine:true,growth:0.6};
				break;
			case "Sunflower":
				leafOpts = {profile:this.M_elipticLeafProfile/* this.M_falcateLeafProfile*/, segments: 20,ratio:0.5,stemRatio:0,centerLine:true};
				break;

		}
		leafOpts.shape=leafShape;
		leafOpts.M_setGrowth= function(t){
			if( this.shape=="Ivy") 
			{	this.growth = t;
				this.ratio=1*(1.3-0.3*t);
				this.leafSize*=0.5+0.5*t;
				
			}
	
		}

		return leafOpts;
	
	}


	// Leaf profiles
	// ------------
	M_mintLeafProfile(t,opt)
	{
	   let x = Math.sin(Math.pow(t,0.7)*Math.PI);
	   x-=Math.sin(t*20*Math.PI)*0.05;
	   return {x: x, y : t};	
	}
	M_defaultLeafProfile(t,opt)
	{
	   let x = Math.sin(Math.pow(t,0.5)*Math.PI);
	   return {x: x, y : t};	
	}
	M_oakLeafProfile(t,opt)
	{
		let x= Math.sin(Math.pow(t,1.4)*Math.PI);
		// wave 
		x-= Math.pow( (1+Math.sin(t*Math.PI*opt.oakSpikes))*0.5,1.9)*x*0.5;
		return {x:x,y:t};	
	}
	M_oakLeafInvProfile(y,opt)
	{
		let t= y;
		let x = Math.sin(Math.pow(t,1.4)*Math.PI);
		x-= Math.pow( (1+Math.sin(t*Math.PI*opt.oakSpikes))*0.5,1.9)*x*0.5;
		return {x:x,t:t};
	}
	M_ivyLeafProfile(t,opt)
	{	const a=0.23;
		let k=10.6; 
		let D= 0.3+(2-0.3)*Math.pow(opt.growth,2);   //1.31;	// 0.72 - 1.73
		let r=0.5*(1+0.2*Math.sin(4.5*Math.pow(t,D)*Math.PI) * (1+0.2*Math.sin(k*t*Math.PI))   );
		let x = Math.sin(t*Math.PI)*r*1.2;
		let y =-a-Math.cos(Math.pow(t,0.36)*Math.PI)*(-a+Math.pow(t,1.1)*0.7*Math.PI)*r;
		return {x: x, y : y};	

	}
	M_falcateLeafProfile(t,opt)
	{
		return {x:Math.sin(t*Math.PI)*2*(1-Math.pow(t,0.2)),y:t};
	}
	M_herbProfile(t,opt)
	{	const C=0.57,C1=Math.PI*0.5/Math.pow(1-C,3);
		return {x:Math.cos(Math.max(C1*Math.pow(t-C,3),-0.99)),y:t};
	}

	M_elipticLeafProfile(t,opt)
	{
		return {x:Math.pow(t,0.52)*Math.pow(1-t,0.64),y:t};
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
	   let x = sign*Math.sin(Math.pow(ttt,0.8)*Math.PI);
	   x-=sign*Math.sin(Math.pow(ttt,1.5)*Math.PI)*0.4;
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
	// M_drawLeaf
	// Leaf is drawn in the x,y plane
	// bends in the z plane with bendAlpha
	M_drawLeaf(C,MV,opt)
	{	
		let _=A;
		let wasDeformers = A.m_deformersActive;
		//A.m_deformersActive = this.m_isDeformers;	//TODO
		let leafProfile = opt.profile;
		
		//var spaceOrientation = this.m_leafSpaceOrientation.func.apply(this,[C.x,C.y,this.m_leafSpaceOrientation.config] );
		//var spaceOrientation = 20;
		//MV.M_rotate(spaceOrientation,1,0,0);			// rotate in the direction of the viewer


		// leaf scale		
		var sz = opt.leafSize;

		// size : sets the ratio x/y 
		var size = new RQVec2( sz*opt.ratio, sz);

		// stem length for this leaf
		var stemLength = sz*(opt.stemRatio!=undefined?opt.stemRatio:0.25);

		let isVisible = A.m_documentArea.M_isPointInside(C); 
		if( !isVisible )
			return;

		// nbPoints : number of points on the leaf profile
		let nbPoints = opt.segments??20;

		let leafWidth 	= size.x;
		let leafLen 	= size.y; 


	   let Plocal = new RQVec3() 
	   let P = new RQVec2(); 

		// bend alpha : angle of bend 
	   let bendAlpha = (opt.bendAlpha??90)*DEGTORAD;
	   let bendR  = Math.abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 1;
	   let noiz = noise.simplex2(C.x/A.W*20,4*C.y/A.H);
	   let bendBeta = -90*Math.max(0.3,Math.abs(noiz))*DEGTORAD;
	   let bendRBeta = Math.abs(bendBeta)>0.02 ? leafWidth/bendBeta : 1 
	   var kProfile = 1./(nbPoints-1);
	   let leafDecal = stemLength;
	   let L = [new RQPolyLine(),new RQPolyLine()]; 
	   let centerLine = new RQPolyLine();
	   var p;
	   let Pworld;
	   let yCenter;
	   let zs=[0,0];
	   for( let i=0; i<nbPoints; i++)
	   {	
		   let t = i*kProfile; 
		   p= leafProfile.apply(this,[t,opt]);
		   let dz = (1-Math.cos( p.y*bendAlpha))*bendR; 
		   let y = bendR*Math.sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 

		   let dzBeta = (1-Math.cos( p.x*bendBeta))*bendRBeta; 
		   let x = bendRBeta*Math.sin(p.x*bendBeta);

		   for( let side=0; side<2; side++)
		   {	
		   		let sign = side==0? -1 : 1;
		   		Plocal.M_set( sign*x, y,dz+dzBeta)	// ok
			    Plocal.y += leafDecal; 

			   // P is the point oriented around the flower 
			   Pworld = MV.M_mutlipliedByVector(Plocal);			   
			   zs[side]+=Pworld.z;
			   L[side].M_addPoint(  A.M_projection(Pworld,C ) );
			}
			// center line
			if(yCenter==undefined || y>yCenter)
			{	yCenter=y;
				Plocal.M_set(0,yCenter+leafDecal,dz/*+dzBeta*/)
				Pworld = MV.M_mutlipliedByVector(Plocal);
				let pProj=A.M_projection(Pworld,C );
				pProj.t=t;
				centerLine.M_addPoint(pProj);	
			}
		   
	   }
	   // stem junction point
	   Plocal.M_set(0,leafDecal,0);
	   Pworld = MV.M_mutlipliedByVector(Plocal);
	   let O = A.M_projection(Pworld,C); //new RQVec2(Pworld.x,-Pworld.y + Pworld.z*this.m_perspectiveFactor);				
		
	   // Make two shapes with centerLine
	   centerLine.M_reverseOrder();
	   let shapes=[L[0].clone(),L[1].clone()];  
	   for(let i=0;i<2;i++)
	   		shapes[i].M_append(centerLine);
	   // reverse depending on side z
	    if(zs[0]<zs[1])	
		{	shapes.reverse();
			L.reverse();
		}

		// Computing the normal and lighting
		let N = MV.M_rotateVector((new RQVec3(1,0,0)).M_cross( new RQVec3(0,1,0))).M_normalized(); 
		let lighting = (1+N.M_dot(A.m_lightSource))*0.5;
		lighting*=lighting;
		let lightMax = 1; 
		

		let drawContour = true; //this.m_drawLeafContour ; //opt.drawContour;

		let fills = opt.groups.Leaves.fills;
		for(let i=0;i<2; i++)
		{

			if( Array.isArray(fills) )
			{
				for(let iF=0; iF<fills.length;iF++)
				{
					let F=fills[iF];
					if( F && F.m_active && lighting<=lightMax)
					{	
						let o = MV.M_rotateVector(new RQVec3(0,1,0) );
						//let oProj = new RQVec2(o.x, -o.y + o.z*this.m_perspectiveFactor);  
						//F.leaves = {...opt};
						F.orientation= A.M_projectedOrientation(o); // Math.atan2(oProj.y,oProj.x)/DEGTORAD;
						F.spacing=  RQMaths.M_map( lighting,0.01,lightMax,F.m_spacing.min , F.m_spacing.max);
						F.group = true;
						A.M_fillShape(F,shapes[i],F);
					}
				}	
			}
			else 
				drawContour = true;
			if( drawContour)
				A.M_drawLines(opt.groups.Leaves,L[i],true);

			if( i==0 && opt.centerLine && opt.groups.LeavesFeat)
			{	// limit size of centerLine
				let limit=0.8,nb=centerLine.M_nb(),iRemove=0;
				for(let il=0;il<nb; il++)
				{	if(centerLine.m_points[il].t>limit)
						++iRemove;
					else break;
				}
				if(iRemove) centerLine.m_points.splice(0,iRemove);
				_.M_drawLines(opt.groups.LeavesFeat,centerLine,true);
			}
			_.M_drawInMask(shapes[i],{protect:0});

		}
	   
		// stem
		if(stemLength>=1 && opt.groups.Stem)
			A.M_drawLines(opt.groups.Stem,new RQLine(C,O),true);
		

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
		var size = new RQVec2( sz*opt.ratio, sz);

		// stem length for this leaf
		var stemLength = sz*(opt.stemRatio!=undefined?opt.stemRatio:0.25);

		let isVisible = A.m_documentArea.M_isPointInside(C); 
		if( isVisible )
		{
		
		}
		else
			return;

		// nbPoints : number of points on the leaf profile
		let nbPoints = opt.segments;

	


		let leafWidth 	= size.x*0.5;
		let leafLen 	= size.y; 



	   let Plocal = new RQVec3() 
	   let P = new RQVec2(); 

		// bend alpha : angle of bend 
	   let bendAlpha = (opt.bendAlpha??90)*DEGTORAD;
	   let bendR  = Math.abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 1;
	   let noiz = noise.simplex2(C.x/A.W*20,4*C.y/A.H);
	   let bendBeta = -90*Math.max(0.3,Math.abs(noiz))*DEGTORAD;
	   let bendRBeta = Math.abs(bendBeta)>0.02 ? leafWidth/bendBeta : 1 
	   var kProfile = 1./(nbPoints-1);
	   let leafDecal = stemLength;
	   let L = [new RQPolyLine(),new RQPolyLine()]; 
	   var p;
	   for( let i=0; i<nbPoints; i++)
	   {	
		   let t = i*kProfile; 
		   p= leafProfile.apply(this,[t,opt]);
		   let dz = (1-Math.cos( p.y*bendAlpha))*bendR; 
		   let y = bendR*Math.sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 

		   let dzBeta = (1-Math.cos( p.x*bendBeta))*bendRBeta; 
		   let x = bendRBeta*Math.sin(p.x*bendBeta);

		   for( let side=0; side<2; side++)
		   {	
		   		let sign = side==0? -1 : 1;
		   		Plocal.M_set( sign*x, y,dz+dzBeta)	// ok
			    Plocal.y += leafDecal; 

			   // P is the point oriented around the flower 
			   let Pworld = MV.M_mutlipliedByVector(Plocal);			   
			   
			   L[side].M_addPoint(  A.M_projection(Pworld,C ) );
			}	   
		   
	   }
	   // stem junction point
	   Plocal.M_set(0,leafDecal,0);
	   let Pworld = MV.M_mutlipliedByVector(Plocal);
	   let O = A.M_projection(Pworld,C); //new RQVec2(Pworld.x,-Pworld.y + Pworld.z*this.m_perspectiveFactor);				
		//O.M_add(C);
		
	   // centerLine
	   let centerLs = null;
	   if( opt.centerLine && p && p.y>0 && opt.groups.LeavesFeat)
	   {	
			let strk = 0;	// opt.groups.LeavesFeat.strokeWidth;	// attempt to array of center lines
			
			centerLs??=[];
			
			let segLen = 1*A.upscale/leafLen;
			let lineLen = 0.8*p.y;
			let nb  = lineLen/segLen;
			let xMax=strk>0 ? leafWidth/2:0;
			let xStep=strk>0? xMax/(strk*1.5):1;
			for( let x=0; x<=xMax; x+=xStep)
			{	let centerL = new RQPolyLine();
				centerLs.push(centerL);
				let y = 0;
				for( let i=0; i<=nb; i++)
				{
					let dz = (1-Math.cos( y*bendAlpha))*bendR; 
					let dy = bendR*Math.sin(y*bendAlpha);

					Plocal.M_set( x*(0.2+0.8*y), dy,dz)
					Plocal.y += leafDecal; 
					let Pworld = MV.M_mutlipliedByVector(Plocal);			   
					centerL.M_addPoint( A.M_projection(Pworld,C));
													
					y+=segLen;
				}  
			}
	   }

		
	   // joint lines
	   let p2;
	   while(p2=L[1].m_points.pop())
	   {	L[0].M_addPoint(p2);						
	   }
	   var pathPoints = L[0].M_getSVGPath(true);


		// Computing the normal and lighting
		let N = MV.M_rotateVector((new RQVec3(1,0,0)).M_cross( new RQVec3(0,1,0))).M_normalized(); 
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
					let o = MV.M_rotateVector(new RQVec3(0,1,0) );
					//let oProj = new RQVec2(o.x, -o.y + o.z*this.m_perspectiveFactor);  
					//F.leaves = {...opt};
					F.orientation= A.M_projectedOrientation(o); // Math.atan2(oProj.y,oProj.x)/DEGTORAD;
					F.spacing=  RQMaths.M_map( lighting,0.01,lightMax,F.m_spacing.min , F.m_spacing.max);
					//console.log("N="+N.M_getString()+" lighting="+lighting+" spacing="+F.spacing);
					//F.jointEnds=true;
					F.group = true;
					//F.m_lines.push( ...this.M_hatchShape( L[0] ,F)); 
					A.M_fillShape(F,L[0],F);
				}
			}	
		}
		else 
			drawContour = true;

	   // Draw the contour lines
	   if(drawContour)
			A.M_drawLines(opt.groups.Leaves,L[0],true);
		if( centerLs)
		{	for( let i=0;i<centerLs.length; i++)
				A.M_drawLines(opt.groups.LeavesFeat,centerLs[i],true);
		}

		// draw the leaf in the mask
		var path = new Path2D(pathPoints);
		if(A.m_mask)
		{	
			var context = A.m_mask.M_getContext();			
			context.fillStyle = "white";
			context.fill(path);
		}	

		// stem
		if(stemLength>=1 && opt.groups.Stem)
			A.M_drawLines(opt.groups.Stem,new RQLine(C,O),true);
		

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
		let C 		= opt.C ?? new RQVec2(0,0);
		let segLen	= opt.seg ?? 10;
		let hasSamp	= opt.samples && opt.samples.seg , sampStart;
		let stemLength = opt.height;
		let nextSamp,sampStop; 
		if(hasSamp)
		{	opt.samples.seg??=segLen*2;
			segLen=Math.min(segLen,0.5*opt.samples.seg);
			nextSamp=opt.samples.start??0;
			sampStop = opt.samples.end??stemLength;
		}
		let hasWidth= (opt.width||opt.widthFunc)?true:false,e=0;
		if( hasWidth)
		{	e= opt.widthFunc ??((l)=>opt.width);
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
		let uY=new RQVec3(0,1,0);
		let P=new RQVec3(0,0,0);
		let curve0=new RQPolyLine();
		let curveLeft,curveRight;
		let I,J,K;
		const Y0 = new RQVec3(0,1,0);
		const X0 = new RQVec3(1,0,0);
		
		if(hasWidth)
		{	curveLeft=new RQPolyLine();
			curveRight=new RQPolyLine();
		}
		let endSample=null;

		for( let l=0; l<=stemLength;  )
		{
			let pProj = A.M_projection(P,C);
			let isEnd = l==stemLength;
			if(hasWidth||hasSamp||isEnd)
			{	J = MV.M_mutlipliedByVector(Y0);
				K = X0.M_cross(J).M_normalize();
				I = J.M_cross(K);
				
			}
			let e_=e(l)/2;
			if(log){ console.log(`e_=${e_}`); }
			if(hasWidth)
			{	
				let pRight = A.M_projection(P.M_plus(e_*I.x,e_*I.y,0),C);
				let pLeft = A.M_projection(P.M_plus(-e_*I.x,-e_*I.y,0),C);
				curveLeft.M_addPoint(pLeft);
				curveRight.M_addPoint(pRight);
			}
			curve0.M_addPoint( pProj);

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
				P.M_add( MV.M_rotateVector(uY).M_multipliedBy(lStep));
			}
			else	// end point : generate end sample
			{
				endSample={P:P, pProj:pProj,l:stemLength, I:I,J:J, MV:MV}	
			}
		}
		let out = {lines:[],end:curve0.M_endPoint(),isForwardFacing:Math.sin(yRotation*DEGTORAD)>=0};
		if(endSample)
			out.endSample = endSample;
		if(hasWidth)
		{	curveRight.M_reverseOrder();
			out.lines.push(curveLeft,curveRight);
			out.shape=curveLeft.clone();
			out.shape.M_append(curveRight);
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
			
			if(sample.B) _.M_drawDebugBasis(sample.B,sample.pProj,{mask:true,l:10*_.upscale});
			if(opts.leafSizeFunc) { opts.leaf.leafSize = opts.leafSizeFunc(sample.kl); }
			this.M_drawLeaf(sample.pProj,sample.MV, opts.leaf);
		}

		// Organize the samples for leaves
		let hasLeaves=false;
		if(stem.samples && opts.leaf)
		{
			const X0=new RQVec3(1,0,0);
			const Z0=new RQVec3(0,0,1);
			const Y1=new RQVec3(0,1,0);
			const Z1=new RQVec3(0,0,1);
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
				//let P1=sample.MV.M_rotateVector(Y1);
				sample.isFront = sample.MV.M_getRotateZ(Y1) >0; 
				//console.log(`P1=${P1.M_getString()} eye=${_.m_toEyeVector.M_getString()} isFront=${sample.isFront}`);
				//sample.z= sample.P.M_plus(P1).z;

				// project on eyeVector to get a distance = dist to obj origin in eye direction. Greatest =closer to eye
				//sample.dEye = _.m_toEyeVector.M_dot(sample.P.M_plus(P1));		// not sure
				sample.sort = sample.l;

				// Basis/Debug
				if(false)
				{	let Y0=new RQVec3(0,1,0), Z0=new RQVec3(0,0,1);
					let B = { O:new RQVec3(),
					I: sample.MV.M_rotateVector(X0),
					J: sample.MV.M_rotateVector(Y0),
					K: sample.MV.M_rotateVector(Z0)};
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
			{	//this.m_groups.MintStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
				_.M_drawLines(opts.groupStem ,stem.lines[il],true) 

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
							_.M_fillShape(F,stem.shape,F); 
						
						}
					}
				}
			}
		}
		// draw the stem in mask
		if( stem.shape)
		{	_.M_drawInMask(stem.shape);
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
