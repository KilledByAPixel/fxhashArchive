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
		this.m_position = new RQVec3();
		this.m_direction = new RQVec3(0,1,0);
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
		this.m_segmentLength = Math.max(segmentLength, A.upscale);
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
			yStop = A.M_projection(this.m_tree.m_position).y-this.m_tree.m_yStop; 		
		}
		
		let count = 0;
		let P = this.m_position.clone();
		//this.A().M_log("Branch M_run level="+this.m_level+" P="+P.M_getString());
		let segmentLength = this.m_segmentLength;
		let Ylocal = new RQVec3(0,1,0);
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
			currentRadius = RQMaths.M_map(lineLength,0,thisBranchLength,this.m_radius,radiusEnd);	// TODO : first radius of isEndChildBranch == parentBranchLastRadius
			if( isEndChildBranch && this.m_parentRadius)
			{	 
				currentRadius= Math.max( radiusEnd*0.7+ (this.m_parentRadius-radiusEnd*0.7)*Math.exp( -2*kLength,2),currentRadius);			
			}
			Pproj = A.M_projection( P);

			let segment = new TreeBranchSegment(P.clone(), Pproj, (isFirstSegment && isEndChildBranch)? this.m_parentMV :  MV.clone(), this.m_lineLength+lineLength,0, currentRadius );
			this.m_segments.push( segment );
									
			if( lengthReached )
				endOfBranch = true;
			else if( isStop && (Pproj.y*lengthSign > yStop*lengthSign) )
			{
				//Algo.M_log("stopping : yStop="+yStop+" Pproj.y="+Pproj.y+" this.m_tree.m_position="+this.m_tree.m_position.M_getString()+"/projected="+A.M_projection(this.m_tree.m_position).y);
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
								branch.M_setPosition(P.M_plus( branchMV.M_mutlipliedByVector(new RQVec3(0,currentRadius*0.6,0) ) ) );
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
						let PLeaf = P.M_plus( MVLeaf.M_mutlipliedByVector(new RQVec3(0,currentRadius,0) ) ) ;
						//let PLeafproj = new RQVec2(PLeaf.x, Algo.m_workArea.top()-PLeaf.y + PLeaf.z*Algo.m_perspectiveFactor);				
						let PLeafproj = A.M_projection( PLeaf);


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
					{	rnd1  = noise.simplex2(rndShift +2*lineLength/Algo.W*Algo.m_noiseFactor.x,lineLength/Algo.H*Algo.m_noiseFactor.y);
						rnd2  = 0.5*(1+noise.simplex2(1.5*rndShift+lineLength/Algo.W*Algo.m_noiseFactor.x,lineLength/Algo.H*Algo.m_noiseFactor.y));
					}
					else
					{	rnd1 = random();
						rnd2 = random();
					}	
					MV.M_rotate(rnd1*360,0,1,0);				
					ang= this.T().m_rndAngleSpan * 0.5*rnd2*(1.0+this.m_level*0.2);
				}
				let displ = currentRadius*Math.sin(ang*DEGTORAD);
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
					P.M_add(segment.MV.M_rotateVector(Ylocal).M_mul(thisSegmentLength));
					// ( do not rotate matrix on last segment )
				}
				else
				{
					P.M_add(segment.MV.M_rotateVector(Ylocal).M_mul(thisSegmentLength));
					if( this.m_tree.m_gravity)
					{
						// compute an orientation
						let Y = MV.M_rotateVector(Ylocal);
						let gravityAmount = (1-(0.5+0.5*Y.M_dot(this.m_tree.m_gravity)))*0.3;
						P.M_add(this.m_tree.m_gravity.M_multipliedBy(thisSegmentLength*gravityAmount) );
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
				let Nlocal = new RQVec3(0,-1,0);
				let Nw = this.m_segments[0].MV.M_rotateVector(Nlocal);
				this.m_isBackbranch = Nw.M_dot(Algo.m_toEyeVector)>0;
			

			}	


			// set splines for V vectors
			if(false)
			if( count>=2)
			{
				count = this.m_segments.length;
				for(let i=0; i<(count-1); i++)
				{	this.m_segments[i].V = this.m_segments[i+1].P.M_minus(this.m_segments[i].P).M_normalize();				 
				}
				let vEnd = this.m_segments[count-1].V = this.m_segments[count-2].V;

				// make spline
				let v0 = this.m_parentMV.M_mutlipliedByVector(new RQVec3(0,1,0)).M_normalize();
						
				for(let i=0; i<(count-1); i++)
				{
					let S = this.m_segments[i];
					S.m_VSpline = new CatmullRomSpline( i>0? this.m_segments[i-1].V : v0,  S.V, this.m_segments[i+1].V, i<(count-2)?this.m_segments[i+2].V :vEnd)
					//console.log("Branch level="+this.m_level+" seg="+i+"/"+count+" "+S.m_VSpline.M_getString());
				
				}
			}
		}
		

				
	
	}
	async M_drawLeaves()
	{
		let Algo = this.A();
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{		await this.m_branches[ib].M_drawLeaves();
		}
		// draw this branch's leaves
		for( let il=0; il<this.m_leaves.length; il++)
		{	
			await Algo.M_drawLeaf( ...this.m_leaves[il], this.m_tree.m_leafOpts);
		}

		A.m_deformersActive = false;	
	
	}
	async M_draw()
	{
		// draw front children branches
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(!this.m_branches[ib].m_isBackbranch) 
				await this.m_branches[ib].M_draw();
		}
		let Algo = this.A();


		// draw this branch	
		if( this.m_segments.length>=2)
		{
			let L1 = new RQPolyLine();
			let L2 = new RQPolyLine();
			let L = new RQPolyLine();
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
				L.M_addPoint( Oproj);	// centerline ( temp )
				let drawBranchSegment = Algo.m_isDrawBranchSegments;
				if( true )	// draw arcs
				{
					let MV = s.MV;
					let isCapVisible = false;
					if( isStartPoint || isEndPoint )
					{
						let Nlocal = new RQVec3(0,isStartPoint?-1:1,0);
						let Nw = MV.M_rotateVector(Nlocal);
						isCapVisible = Nw.M_dot(Algo.m_toEyeVector)>=0;
						let uPrj = Algo.M_projection(Nw,new RQVec2(0,0)).M_normalize().M_multipliedBy(-0.2*Algo.upscale);
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
							A.M_drawLines(Algo.m_groups.BranchFill,arc,true);
							//Algo.m_groups.BranchFill.m_lines.push( ...Algo.M_computeLineMask(arc));
								
						if( isStartPoint)
							startArc =this.M_getSegmentArc(false,s,50); 
						else if( isEndPoint)
							endArc =this.M_getSegmentArc(false,s,50); 
					}
					// Left and right lines
					if( arc )
					{
						L1.M_addPoint( arc.M_getPoint(0));									
						L2.M_addPoint( arc.M_endPoint());									
					}
				}

			}
			// draw 
			// compute the closed shape
			if( ((A.m_branchCount=(A.m_branchCount??0)+1)%5)==0 && !isFxpreview) await sleep(1);
			A.M_log(`branch count=${A.m_branchCount}`,"bc");

			L1.M_reverseOrder();
			if( this.m_level>=this.T().m_drawBranchContourLevel)
			{
				A.M_drawLines(Algo.m_groups.Branches,L2,true);
				A.M_drawLines(Algo.m_groups.Branches,L1,true);
			}
			if( L2.M_endPoint().M_dist(endArc.M_getPoint(0) ) >  L2.M_endPoint().M_dist(endArc.M_endPoint() ) ) endArc.M_reverseOrder();

			let contour = L2.clone();
			contour.M_append(endArc);
			contour.M_append(L1);
			
			if(false) // if we want the end arc
			{
				A.M_drawLines(Algo.m_groups.Branches,endArc,true);

			}
			
			if( contour.M_endPoint().M_dist(startArc.M_getPoint(0) ) >  contour.M_endPoint().M_dist(startArc.M_endPoint() ) ) startArc.M_reverseOrder();

			contour.M_append(startArc);			
			this.M_fill(contour);

			// we need a shorter contour on start/end for the mask, in order to allow junction of branch hatch fill. 
			// so we move the startArc points ( which are references )
			if(true)
			for(let i=0;i<startArc.m_points.length; i++)
			{
				startArc.m_points[i].M_add(uProjStart);
			}
			if(false)
			for(let i=0;i<endArc.m_points.length; i++)
			{
				endArc.m_points[i].M_add(uProjEnd);
			}
			this.M_drawInMask(contour,L1,L2);

		}
				
		// draw back children branches
		for( let ib=0; ib<this.m_branches.length; ib++)
		{	if(this.m_branches[ib].m_isBackbranch) 
				 await this.m_branches[ib].M_draw();
		}
	
	}
	M_getSegmentArc(frontArc,s,nbCirclePoints)
	{
		let Algo = this.A();
		let MV 		= s.MV;
		let Oproj	= s.Pproj;
		let circle1 = new RQPolyLine();
			
		{
			let vy = MV.M_rotateVector(new RQVec3(0,1,0));
			let Z = Algo.m_toEyeVector;
			let X = vy.M_cross(Z).M_normalize();
			Z= X.M_cross(vy);
			let a = 0;
			let aInc =(frontArc? Math.PI : -Math.PI)/nbCirclePoints;
			for( let i=0; i<nbCirclePoints;i++)
			{
				let r = s.radius;
				let co=Math.cos(a)*r;
				let si=Math.sin(a)*r;
				let P = new RQVec3( - X.x*co + Z.x*si, -X.y*co + Z.y*si, -X.z*co + Z.z*si); 
				circle1.M_addPoint(A.M_projection(P,Oproj));
				a+=aInc;
			}
		}	
		
		
		
		return circle1;
	
	}
	M_drawInMask(shape,L1,L2)
	{
		let Algo = this.A();
		if( shape && Algo.m_drawBranchMask)
		{
			var path = new Path2D(shape.M_getSVGPath(true));
			let context = Algo.m_mask.M_getContext();
			context.fillStyle = "white";
			context.fill(path);
			
		    //the draw in mask shouldn't protect too much on top and bottom of the branch segment. How do we handle this ... 
			/*if( true)	// test
		   {   context.lineWidth = 0.2*2*Algo.upscale;
			   context.strokeStyle = "black";
			   context.stroke(new Path2D(shape.M_getSVGPath(false)));
		   }*/

		   if( Algo.m_isShortenJunctions)
		   {   context.lineWidth = Algo.m_protectionStrokeWidth*2;
			   context.strokeStyle = "white";
			   context.stroke(new Path2D(L1.M_getSVGPath(false)));
			   context.stroke(new Path2D(L2.M_getSVGPath(false)));
		   }


		}
	}
	M_fill(shape)
	{
		let Algo = this.A();
		let fills = null; 
		if( this.m_isRoots && Algo.m_groups.Roots)
			fills = Algo.m_groups.Roots.fills;
		if( fills==null || !Array.isArray(fills) )
			fills = Algo.m_groups.BranchFill.fills;
		if( Array.isArray(fills) )
		{
			let orientation,lighting,isComputed=false;
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];

				
				if( F && F.m_active)
				{	
					F.branch = this;
				
					// compute the average direction
					if(!isComputed)
					{	isComputed=true;
						let nbSegments = this.m_segments.length;
						let dirMedian = new RQVec3();
						let nbDirs = 0;
						for( let i=0; i<nbSegments-1; i++)
						{	
							let dir = this.m_segments[i+1].P.M_minus( this.m_segments[i].P ); 
							dirMedian.M_add(dir);
							nbDirs++;
						}
						dirMedian.M_mul(1/nbDirs).M_normalize();
						let N = Algo.m_toEyeVector.M_cross(dirMedian).M_normalize();
						lighting = (1+N.M_dot(Algo.m_lightSource))*0.5;
						lighting*=lighting;
	
						// project dirMedian for orientation 
						//let dirProj = A.M_projection(dirMedian,null);	// new RQVec2(dirMedian.x, -dirMedian.y + dirMedian.z*Algo.m_perspectiveFactor);				
						orientation = Algo.M_projectedOrientation(dirMedian);
	
					}
					F.orientation = orientation;
					F.spacing=  RQMaths.M_map( lighting,0,1,F.m_spacing.min , F.m_spacing.max);
					Algo.M_fillShape(F,shape,F);
				
				}
			}
		}
	
	}


};
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
		this.m_endBranchLeafAngleSpan = algorithm.M_getFloat("endBranchLeafAngleSpan",90);
		this.m_endBranchNbLeaves 	= algorithm.M_getInt("endBranchNbLeaves",{min:1,max:3});
		this.m_intermediateBranch = algorithm.M_getFloat("intermediateBranches",{height:0,level:0,newLevel:1});
		this.m_intermediateBranch.rnd = this.m_branchRndDensity;

		this.m_youngBranch = algorithm.m_youngBranch;
		this.m_drawBranchContourLevel = algorithm.M_getInt("drawBranchContourLevel",0);
		this.m_isLeaves = algorithm.m_isLeaves;
		this.m_isAllLeavesFront = algorithm.M_getBool("isAllLeavesFront",false);
		this.m_level = 0;
		this.m_leafShape		= algorithm.M_get("leafShape","default");
		this.m_parentMV 		= new RQMatrix4();
		this.m_endBranchNb		= algorithm.M_getInt("rootEndBranchNb",{min:2,max:2});

		switch(this.m_leafShape)
		{
			case "Default":
			default:
				this.m_leafOpts = {profile:algorithm.M_defaultLeafProfile, segments: 20,ratio:0.8,centerLine:true};
				break;

			case "Oak":
				this.m_leafOpts = {profile:algorithm.M_oakLeafProfile, invProfile: algorithm.M_mintLeafInvProfile, oakSpikes:12, segments: 60, ratio:0.625, centerLine:true};
				break;

			case "Ash":
				this.m_leafOpts = {profile:algorithm.M_ashLeafProfile,organizeFun: algorithm.M_ashOrganize, ashLeaves:4.5,segments:150,ratio:0.9,stemRatio:0.01,centerLine:false};
				break;		
			case "Mint":
				this.m_leafOpts = {profile:algorithm.M_mintLeafProfile, segments: 30,ratio:0.9};
				break;
		}
		
	}
	async M_draw()
	{
		let frontLeaves = this.m_isAllLeavesFront;

		// draw front leaves
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(frontLeaves || !this.m_branches[ib].m_isBackbranch) 
				await this.m_branches[ib].M_drawLeaves();
		}
		// draw leaves
		let Algo = this.A();
		for( let il=0; il<this.m_leaves.length; il++)
		{
			 await Algo.M_drawLeaf( ...this.m_leaves[il], this.m_leafOpts);
		}

		// draw the tree
		 await super.M_draw();
	
		// draw back leaves
		if(!frontLeaves)
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(this.m_branches[ib].m_isBackbranch) 
				 await this.m_branches[ib].M_drawLeaves();
		}
		
	
	
	}

};

class TreesAlgorithm extends PatternAlgorithm
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
		//console.log("M_getHatchFunction "+name);
		if(H==undefined) H = this;
		if(vars==undefined) vars = H;
		if( name =="TreeBranch")
		{
			H.m_amplitude	= vars.M_getFloat("amplitude",0.5); H.m_amplitude*=this.upscale; 	
			H.m_barkNoiseFactor = vars.M_getFloat("barkNoiseFactor",{x:120, y:28});	
			H.m_torsion= vars.M_getFloat("barkTorsion",30);
			H.inStencilLineCut = vars.M_getBool("inStencilLineCut",true);
			H.lightingAmplitude = vars.M_getBool("lightingAmplitude",false);
			console.log("amplitude = "+H.m_amplitude);
			console.log("barkNoiseFactor = "+RQPrintR(H.m_barkNoiseFactor));
			//		H.m_wavelength	= vars.M_getFloat("wavelength",{min:4,max:20}); H.m_wavelength.min*=this.upscale; H.m_wavelength.max*=this.upscale;
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
		this.M_getSvgProperties();
		var style= this.M_getStyleAsString();
		this.svg.append(	this.M_makeDefaultSvgGroup("0",style) );
		this.M_declareSvgGroups();

		


		this.M_log("seed = "+this.m_seed);
		this.M_initVariables().then( ()=>
		{
			this.M_applyArtwork();
			this.M_startAlgorithm();
		
		});
		this.M_showWorkCanvases();
	
	}
	VM_declareSvgGroups()
	{
		let style=null;
		this.M_declareSvgGroup('Trees'		, "Leaves"		, true, style);
		this.M_declareSvgGroup('Trees'		, "LeavesFeat"	, true, style);
		this.M_declareSvgGroup('Trees'		, "Stem"	, true, style);
		this.M_declareSvgGroup('Trees'		, "Branches", true, style);
		this.M_declareSvgGroup('Trees'		, "BranchFill", true, style);
		this.M_declareSvgGroup('Trees'		, "Sky", true, style);

	
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
		this.m_isRndNoise = this.M_getBool("rndMode",false);
		this.m_isUseMask=this.M_getBool("isUseMask");
		this.m_rndAngleSpan= this.M_getFloat("rndAngleSpan",10);
		this.m_yStart = this.M_getFloat("yStart",0)*this.upscale;
		this.m_groundMargin = this.M_getFloat("groundMargin",0)*this.upscale;
		this.M_getClipParameters();

		this.m_isLeaves = this.M_getBool("isLeaves");
		this.m_rootSpacing = this.M_getFloat("rootSpacing",50.)*this.upscale;
		this.m_rootBranchLength = this.M_getFloat("rootBranchLength",50)*this.upscale;
		this.m_rootSegmentLength = this.M_getFloat("rootSegmentLength",2)*this.upscale;
		this.m_rootThickness = this.M_getFloat("rootThickness")*this.upscale;
		this.m_rootRotation = this.M_getFloat("rootRotation",{y:0,z:0});
		this.m_thickLineSpacing = this.M_getFloat("thickLineSpacing")*this.upscale;
		this.m_isDrawBranchSegments = this.M_getBool("isDrawBranchSegments",false);
		this.m_leafNbSegments = this.M_getInt("leafNbSegments",24);
		this.m_branchRndDensity = this.M_getFloat("branchRndDensity",0.03);
		this.m_branchLengthLevelFactor=this.M_getFloat("branchLengthLevelFactor",0.7);
		this.m_branchEndRadiusFactor = this.M_getFloat("branchEndRadiusFactor",0.8);
		this.m_newBranchRadiusFactor = this.M_getFloat("newBranchRadiusFactor",0.6);
		this.m_branchReductionFactor = this.M_getFloat("branchReductionFactor",0.65);
		this.m_branchOpenAngle = this.M_getFloat("branchOpenAngle",{min:10,max:70});
		this.m_youngBranch = this.M_getFloat("youngBranches",{rnd:0,height:0.9,level:3,newLevel:4});

		this.m_maxRecursionDepth = this.M_getInt("maxRecursionDepth",4);
		this.m_endBranchAngleSpan = this.M_getFloat("endBranchAngleSpan",90);
		this.m_leafRndDensity = this.M_getFloat("leafRndDensity",0.2);
		this.m_nbRoots 		= this.M_getInt("nbRoots",0);
		this.m_rootMode 	= this.M_get("rootMode","EqualSpace");
		this.m_rootZoneCenter = this.M_getFloat("rootPosition",0.5);	
		this.M_readParametricVariable(this,"leafSize",this.upscale,false); 
		this.M_readParametricVariable(this,"leafSpaceOrientation",1,false);
		this.m_drawBranchMask  = this.M_getBool("drawBranchMask",false);
		this.m_drawLeafContour = this.M_getBool("drawLeafContour",false);
		


		// Wind addons
		this.m_wind = this.M_getVariablePack("addons","TreesAddonWind",false);
		if( this.m_wind)
		{	let S = this.m_wind;
			S.m_isActive = S.M_getBool("isActive",false);
			S.m_direction = S.M_getFloat("direction",{x:1,y:1,z:1});	
			S.m_amplitude = S.M_getFloat("amplitude",100);	S.m_amplitude*=this.upscale;
			S.m_rndThres = S.M_getFloat("rndThres",0.1);	
		}

		// Regular backgrounds
		this.m_backgrounds = this.M_get("background");
		for( let i=0; i<this.m_backgrounds.length; i++)
		{ 	this.M_readBackgroundVars(this.m_backgrounds[i]);
		}


		// SVGGroup addons 
		var addons = this.M_getVariablePack("styles","SVGGroup",true);
		for(let ia=0; ia<addons.length; ia++)
		{	
			//if( addons ) console.log("Addons "+ia+" : variables = "+RQPrintR(addons[ia].m_variables,2));

			this.M_readSvgGroupVariable(this,addons[ia]);

		}
		// Hatch addons
		addons = this.M_getVariablePack("styles",this.M_getHatchFunctionsList() ,true);
		for(let ia=0; ia<addons.length; ia++)
			this.M_readHatchVariable(this,addons[ia]);


		// Apply color settings	( fxhash)
		if(this.M_applyPaletteVariant)
			this.M_applyPaletteVariant( this.m_paletteVariants[0])

	}

	async M_startAlgorithm()
	{
		this.M_log("Trees : M_startAlgorithm");
		window.clearInterval(this.m_timer);
		 
		 //this.M_doTreeAlgorithm()
		 await this.M_doTreeAlgorithm().then(
			function(){
				console.log("OK Trees Done !");
				if(this.fxPreview)
					this.fxPreview();
		
			},
			function(error){console.log("Ooops error in the async function");}
		);
	
	
	}
	M_makeRandomFunctions(seed)
	{	this.M_seed( seed);
		let leavesSeed = this.random();
		this.M_seed( parseInt(leavesSeed*100),"Leaves");	
		noise.seed(leavesSeed);
		let maxDepth = Math.max( this.m_maxRecursionDepth, this.m_youngBranch.newLevel,this.m_roots!=undefined? this.m_roots.m_youngBranch.newLevel : 0) 
		let i=0;
		this.M_log("Making seed up to randomDepth"+(maxDepth+1));
		for( i=0;i<=(maxDepth+1);i++)
		{
			this.M_seed( parseInt(this.random()*1000),"Depth"+i);	
		
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
		await sleep(1);
	
		A.m_deformersActive = false;

		var P = new RQVec3();
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
				 var segmentLength = 4.0*this.upscale; 	// mm 
				 var segmentNb = this.m_rootBranchLength*( 0.5+0.5*this.random())/segmentLength;

				if(isRndRoot)
				{
					x = xLeft + WAllRoots*this.random();
				}
				P.M_set( x, this.m_yStart, 0);
				var direction = Math.PI/2.;
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
				await tree.M_draw();
				if(!isRndRoot)
					x+=this.m_rootSpacing;		
			
			}
		}
	
		this.M_log("Rendering stems ("+this.m_stemLines.length+")","renderStems");
		var L;
		while (L = this.m_stemLines.pop() )
		{
			A.M_drawLines(this.m_groups.Stem,L,true); 
			//this.m_groups.Stem.m_lines.push( ...this.M_computeLineMask(L));
		}
	
		if(this.m_backgrounds)
		{	for(let i=0; i<this.m_backgrounds.length; i++)
			{	this.M_log(`Drawing background ${i} ${this.m_backgrounds[i].m_name}`);
				this.M_drawBackground( this.m_backgrounds[i]);
			}
		}

		// draw lines to Svg when done
		this.M_log("M_drawLinesToSvg");
		await this.M_drawLinesToSvg();
		await this.M_onAlgorithmDone();


		
	}
	
	
	
	// M_drawLeaf
	// 3D approch
	async M_drawLeaf(C,MV,opt)
	{
		if(opt.organizeFun)
			opt.organizeFun.apply(this,[C,MV,opt]);
		if( ((this.m_leafCount=(this.m_leafCount??0)+1)%10)==0 && !isFxpreview) await sleep(1);

		this.M_log(`Nb. leaves = ${this.m_leafCount}`,"LeafCount"); 
		A.m_deformersActive = this.m_isDeformers;								
		if( this.m_wind && this.m_wind.m_isActive)
		{
			if( this.randomLeaves() > this.m_wind.m_rndThres)
			{	let rnd = (0.3+0.7*0.5*(1+noise.simplex2(3*C.x/this.W,3*C.y/this.H)))*this.m_wind.m_amplitude;
			 
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
		var size = new RQVec2( sz*opt.ratio, sz);

		// stem length for this leaf
		var stemLength = sz*(opt.stemRatio!=undefined?opt.stemRatio:0.25);

		let isVisible = this.m_documentArea.M_isPointInside(C); 
		if( isVisible )
		{
			this.M_log("Nb. visible leaves = "+(this.m_leafVisibleCount++),"LeafVisCount"); 
		
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
	   let bendAlpha = 90*DEGTORAD;
	   let bendR  = Math.abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 1;
	   let noiz = noise.simplex2(C.x/this.W*20,4*C.y/this.H);
	   let bendBeta = -90*Math.max(0.3,Math.abs(noiz))*DEGTORAD;
	   let bendRBeta = Math.abs(bendBeta)>0.02 ? leafWidth/bendBeta : 1 
	   var kProfile = 1./(nbPoints-1);
	   let leafDecal = stemLength;
	   let L = [new RQPolyLine(),new RQPolyLine()]; 
	   var p;
	   for( let i=0; i<nbPoints; i++)
	   {	
		   let aProfile = i*kProfile; 
		   p= leafProfile.apply(this,[aProfile,opt]);
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
	   let centerL = null;
	   if( opt.centerLine && p && p.y>0)
	   {	
	   		centerL = new RQPolyLine();
	   		let segLen = 1*this.upscale/leafLen;
	   		let lineLen = 0.8*p.y;
	   		let nb  = lineLen/segLen;
	   		let y = 0;
	   		for( let i=0; i<=nb; i++)
	   		{
			    let dz = (1-Math.cos( y*bendAlpha))*bendR; 
				let dy = bendR*Math.sin(y*bendAlpha);

		   		Plocal.M_set( 0, dy,dz)
			    Plocal.y += leafDecal; 
			   let Pworld = MV.M_mutlipliedByVector(Plocal);			   
			   centerL.M_addPoint( A.M_projection(Pworld,C));
												
				y+=segLen;
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
		let lighting = (1+N.M_dot(this.m_lightSource))*0.5;
		lighting*=lighting;
		let lightMax = 1; 
		

		let drawContour = true; //this.m_drawLeafContour ; //opt.drawContour;

		let fills = this.m_groups.Leaves.fills;
		if( Array.isArray(fills) )
		{
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];
				this.leafFillCount = (this.leafFillCount??0)+1;
				if( F &&F.m_active && lighting<=lightMax)
				{	
					this.M_log(`Filling leaf ${this.leafFillCount} ${iF}`,`LeafFill${iF}`); 
					let o = MV.M_rotateVector(new RQVec3(0,1,0) );
					//let oProj = new RQVec2(o.x, -o.y + o.z*this.m_perspectiveFactor);  
					//F.leaves = {...opt};
					F.orientation= this.M_projectedOrientation(o); // Math.atan2(oProj.y,oProj.x)/DEGTORAD;
					F.spacing=  RQMaths.M_map( lighting,0.01,lightMax,F.m_spacing.min , F.m_spacing.max);
					//console.log("N="+N.M_getString()+" lighting="+lighting+" spacing="+F.spacing);
					//F.jointEnds=true;
					F.group = true;
					//F.m_lines.push( ...this.M_hatchShape( L[0] ,F)); 
					this.M_fillShape(F,L[0],F);
				}
			}	
		}
		else 
			drawContour = true;

	   // Draw the contour lines
	   if(drawContour)
		   //this.m_groups.Leaves.m_lines.push(...this.M_computeLineMask(L[0]));
			A.M_drawLines(this.m_groups.Leaves,L[0],true);
		if( centerL)
			A.M_drawLines(this.m_groups.LeavesFeat,centerL,true);
		  // this.m_groups.Leaves.m_lines.push(...this.M_computeLineMask(centerL));
		

		// draw the leaf in the mask
		var path = new Path2D(pathPoints);
		if(this.m_mask)
		{	
			var context = this.m_mask.M_getContext();			
			context.fillStyle = "white";
			context.fill(path);
		}	

		// stem
		if(stemLength>=1)
		{	if(A.m_stemLinesBack)
				this.m_stemLines.push(new RQLine(C,O));
			else
				A.M_drawLines(A.m_groups.Stem,new RQLine(C,O),true); 

		}

		A.m_deformersActive = false;

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
	   {	y+=ttt*0.5;
	   		tt=x;
	   }
	   else
	   		y+=tt*0.3-x; 
	   let y2= y- (Math.min(t1-0.1,0)/-0.1-1)/n;
	   return {x: tt*Math.cos(y2*1.4-0.5), y :y2 };	
	}
	M_ashOrganize(C,MV,opt)
	{
		opt.ashLeaves = 2.5+Math.round(this.randomLeaves()*4);
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
	{	const zero = new RQVec2(0,0);
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
					 
					for( let ip=0; ip<(PL.m_points.length-1); ip++)
					{	let P0 = PL.m_points[ip]; 
						let I = PL.m_points[ip+1].M_minus( P0);
						let dist= I.M_length();
						if( dist>=1)
						{	I.M_mul(1/dist);
							let J = B.prevVyProj; //new RQVec2( -I.y,I.x); 
							for(let i=0;i<dist;i++)
							{	let P = new RQVec2( P0.x+kernelStart*J.x,P0.y+kernelStart*J.y);
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
					vy.M_add( vy2.M_minus(vy).M_mul( RQMaths.polynomialStep(kSeg,2) ));
				}
	

				// make the points
				let spacing;
				
				
				var L = new RQPolyLine();
				let nbPoints = Math.floor(Math.PI*radius/2);
				let amplAng = Math.PI*0.98; 
				let a = +Math.PI*0.01;
				let aInc =amplAng/nbPoints;
				let I0 = new RQVec3(1,0,0);
				
				if(false && s1.m_VSpline)			// Spline doesn't add anything ... 
				{	
					vy = s1.m_VSpline.M_getVectorAt(kSeg);
				}
				vy.M_normalize();
				let vyProj = A.M_projection(vy,zero );	//*/ new RQVec2(vy.x, -vy.y + vy.z*this.m_perspectiveFactor);

				let projScale = vyProj.M_length()/vy.M_length();				
				vyProj.M_normalize();
				B.prevVyProj = vyProj; 

				let Z = this.m_toEyeVector;
				let X = vy.M_cross(Z).M_normalize();
				Z= X.M_cross(vy);
				if( B.Z==undefined)
					B.Z = Z;
				else
				{	B.Z = Z = B.Z.M_plus( Z.M_minus(B.Z).M_mul(0.3) ).M_normalize();
				
				}

				let isSpacingLighting=false;
				let isAmpLighting = opts.lightingAmplitude?true:false;
				let lighting; 
				if(isSpacingLighting)
				{	let N = Z;
					lighting = (1+N.M_dot(this.m_lightSource))*0.5;
					lighting*=lighting;
					spacing=  RQMaths.M_map( lighting,0,1,opts.m_spacing.min , opts.m_spacing.max);
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
					let amplPos = {min: new RQVec3(C.x- X.x*radius , C.y-X.y*radius , C.z-X.z*radius ), max:new RQVec3(C.x+ X.x*radius , C.y+X.y*radius , C.z+X.z*radius )  }
					for(let k in amplPos) amplPos[k] = A.M_projection(amplPos[k]); //new RQVec2(  amplPos[k].x, this.m_workArea.top()-amplPos[k].y + amplPos[k].z*this.m_perspectiveFactor ); 
					if( B.prevAmplPos)
					{
						for(let k in amplPos)
						{	amplArray[k]= Math.min( amplPos[k].M_dist(B.prevAmplPos[k])*opts.m_amplitude/this.upscale*lengthFactor, 3*spacing) ;
						}			
					}
					
					let barkNoiseFactor = opts.m_barkNoiseFactor; // {x:120, y:28};
					let barkExp = 0.2;//2.8;
				B.prevAmp = Math.max(amplArray.min,amplArray.max);
				let N = new RQVec3();
				let lengthSign = B.m_isRoots?-1:1;
	
				for( let i=0; i<nbPoints;i++)
				{

					let rnd = noise.simplex2(  (barkNoiseFactor.x*a*radius+lengthSign*lineLength*Torsion)/this.W*this.m_noiseFactor.x,barkNoiseFactor.y*lengthSign*lineLength/this.H*this.m_noiseFactor.y); 
					rnd = RQMaths.M_map(rnd,-1,1.0,-1,1);
					let damping = 1.;//Math.exp(Math.sin(a),3);
					ampl = RQMaths.M_map(a,0,Math.PI,amplArray.min,amplArray.max);

					let r = radius;
					//r+=decal;	// TEST
					let co=Math.cos(a);
					let si=Math.sin(a);

					if(isAmpLighting)
					{
						N.M_set(-X.x*co + Z.x*si, -X.y*co + Z.y*si, -X.z*co + Z.z*si);
						lighting = (1+N.M_dot(this.m_lightSource))*0.5;
						lighting*=lighting;
						ampl*=RQMaths.M_map(lighting,0.5,1,1,0);
					}
					co*=r;
					si*=r;


					let decal = ampl *Math.sign(rnd)* RQMaths.polynomialStep(Math.abs(rnd),barkExp)*damping; /*Math.sin( 5*a/radius)**/;

					let P = new RQVec3( C.x- X.x*co + Z.x*si, C.y-X.y*co + Z.y*si, C.z-X.z*co + Z.z*si); 
					let	Pproj = A.M_projection(P);			
					Pproj.M_add( vyProj.M_multipliedBy(decal));

					L.M_addPoint(Pproj);
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
			let spc= RQMaths.M_map(Math.pow(x/OBB.w,3),0,1,opts.m_spacing.min,opts.m_spacing.max);
			if( spc>15)
				spc= OBB.w-x;
			return spc;
		}
		return opts.spacing;	
	
	}

			

};






