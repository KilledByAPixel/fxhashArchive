class TreeBranchSeg
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


class ClassTreeBranch
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
		this.m_obj = null;
				
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

	M_setDirection(U)
	{	let obj=this.m_obj;
		let N;
		if(obj && obj.F && (N=obj.F.m_normalTransformed))
		{
			let T = U.M_cross(N);
			T.M_normalize();
			U = N.M_cross(T);
			obj.N = N;		// defines a basis for tree moves accross the surface of the face. 
			obj.T = T;
			obj.K = N.M_cross(T);
		}
		this.m_direction.M_set(U);
	}
	// M_setObject
	// {MV,obj,F}
	M_setObject(opt)
	{
		this.m_obj = opt? {...opt} : null;
	}
	M_isDraw(opt)
	{
		let layer= (opt&& opt.layer)? opt.layer : "all";
		let isDraw= layer=="all" || (this.m_obj==null || ( this.m_obj.back == (layer=="back"))  );
		return isDraw;
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
		let branch = new ClassTreeBranch(this.m_tree,this);
		branch.m_level = this.m_level+1;
		branch.M_setBranchLength(this.m_branchLength*this.m_tree.m_branchLengthLevelFactor, this.m_segmentLength/**this.m_tree.m_branchLengthLevelFactor*/);
		branch.m_lineLength = lineLength;
		branch.m_parentMV = parentMV;
		branch.m_childBranchDirection=direction;
		branch.m_isRoots = this.m_isRoots;
		branch.M_setObject(this.m_obj);
		this.m_branches.push(branch);
		
		this.A().M_log("Nb. branches = "+(this.A().m_branchCount++),"M_createBranch");
		return branch;
	}

	M_run(MV)
	{
		//A.m_deformersActive = false;
		let Algo=this.A();
		let obj=this.m_obj;	
		if(MV===undefined)
		{	
			MV = new RQMatrix4();
			if( obj&&obj.T)
			{	
				MV.M_setBase(obj.T,obj.N.M_cross(obj.T),obj.N);
				//console.log("Created MV ="+MV.M_getString());
			}

		}
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

		let segmentLength = this.m_segmentLength;
		let Ylocal = new RQVec3(0,1,0);
		let radiusEnd = this.M_getRadiusEnd();
		let currentRadius = this.m_radius;
		let Pproj;
		let prevP;
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

			// Compute P projection
			Pproj = A.M_projection( P);

			// Create the SEGMENT structure
			let segment = new TreeBranchSeg(P.clone(), Pproj, (isFirstSegment && isEndChildBranch)? this.m_parentMV :  MV.clone(), this.m_lineLength+lineLength,0, currentRadius );
			this.m_segments.push( segment );
									
			if( lengthReached )
				endOfBranch = true;
			else if( isStop && (Pproj.y*lengthSign > yStop*lengthSign) )
			{
				endOfBranch = true;
				isStopped = true;
			}
			else 
			{
				count ++;

				// ----------
				// generateBranches
				// inline function for creating a new branch
				let generateBranches=(myRandom,info)=>{

					let isReturnValue = this.m_isRoots || Algo.M_isUseVersion(2.3);
					if(isReturnValue)
					{
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
								var branchDirection = obj? 0:  myRandom()*360;		// direction around this branch
								if( obj && myRandom()<0.5)	branchAngle*=-1;
								
								// creating a branch
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
								if(branchDirection)
									branchMV.M_rotate(branchDirection,0,1,0);			// place the new branch around this branch 
								if( obj)
									branchMV.M_rotate(branchAngle,0,0,1);				// inclinaison of branch
								else
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
				// ---------- end generate branch inline function



				if( !generateBranches( random,this.T().m_intermediateBranch))
				{	generateBranches( Algo['randomYoung'], this.T().m_youngBranch);
				}
				
				// Leaves				
				// ----------
				if( this.m_tree.m_isLeaves && this.m_level>=(this.m_tree.m_maxRecursionDepth-1) && Algo.randomLeaves()<this.T().m_leafRndDensity) 
				{
					if( P.y> (this.m_tree.m_groundMargin+Algo.m_yStart))
					{
						let MVLeaf;
						if( obj && obj.F)
						{	MVLeaf = new RQMatrix4();
							let X=MV.M_rotateVector(Ylocal).M_normalize();
							let Z= obj.F.m_normalTransformed.M_cross(X);
							let Y =X.M_cross(Z); 							
							MVLeaf.M_setBase( X,Y,Z);
						}
						else 
						{	var leafDirection = Algo.randomLeaves()*360;		// direction around this branch

							MVLeaf = MV.clone();
							MVLeaf.M_rotate(leafDirection,0,1,0);			// place the new branch around this branch 
							MVLeaf.M_rotate(30,1,0,0); 
						}
						let PLeaf = P.M_plus( MVLeaf.M_mutlipliedByVector(new RQVec3(0,currentRadius,0) ) ) ;
						let PLeafproj = A.M_projection( PLeaf);

						this.m_leaves.push([PLeafproj,MVLeaf]);
					}
					else
					{	//Algo.M_log("P.y"+P.y+" this.m_tree.m_groundMargin="+this.m_tree.m_groundMargin+" Algo.m_yStart="+Algo.m_yStart);				

					}
				}
				/*else
				{
					A.M_log("No leaf this.m_level="+this.m_level+" this.m_tree.m_maxRecursionDepth-1="+(this.m_tree.m_maxRecursionDepth-1)+" this.T().m_leafRndDensity="+this.T().m_leafRndDensity);
				}*/
				
				// ----------
				// Avance to next segment
				// 
				let thisSegmentLength = segmentLength;




				
				// GROW THE BRANCH
				// advance segment and change direction 
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
					if(obj)
					{
						ang= this.T().m_rndAngleSpan *2*(rnd2-0.5)*(1.0+this.m_level*0.2);

					}
					else 
					{	MV.M_rotate(rnd1*360,0,1,0);				
						ang= this.T().m_rndAngleSpan * 0.5*rnd2*(1.0+this.m_level*0.2);
					}
				}
				let displ = currentRadius*Math.sin(ang*DEGTORAD);
				let spacingMax = segmentLength/4;
				if( displ>(segmentLength-spacingMax))
				{	let decal = displ - (segmentLength-spacingMax);
					thisSegmentLength += decal;
				}
				// Now set last segment's length
				prevP = P.clone();
				if( lineLength>= thisBranchLength)
				{
					lengthReached = true;
					thisSegmentLength = lineLength-thisBranchLength;
					P.M_add(segment.MV.M_rotateVector(Ylocal).M_mul(thisSegmentLength));
					// ( do not rotate matrix on last segment )
				}
				else
				{
					// BUG : here segment.MV is corrupted 
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
					if( obj)
						MV.M_rotate(ang,0,0,1);
					else 
						MV.M_rotate(ang,1,0,0);
				
				}

				// ----------
				// we have moved from prevP to P
				// Handle the crawling on an object and face change
				let hasObjControl = false;
				if( obj)
				{	// Test whether we are still on the face
					let test = obj.obj.M_testFace(obj.F,P,prevP);
					
					//  Leaving the current face of the 3D object
					if( test!==true ) 
					{	
						if( typeof test ==='object') // we have a new face ; test = {newF, intersect,basis,newBasis  }
						{	

							// current direction + coordinates in local face
							let dirBranch=MV.M_rotateVector(Ylocal);
							let x_= dirBranch.M_dot(test.basis.X);
							let y_= dirBranch.M_dot(test.basis.Y);
	
							// find a coordinate on the edge
							// -> coordinates of Pprev (Q)
							//let OQ = prevP.M_minus(test.basis.O);
							//let Qx_ = OQ.M_dot(test.basis.X);
							//let Qy_ = OQ.M_dot(test.basis.Y);
							//let My_ = Math.abs(Qx_)>0.01? Qy_ -y_/x_*Qx_ : Qy_; 
							
							// -> place P on the edge ( x=0, z=0 )
							//P = test.basis.O.M_plus( test.basis.Y.M_multipliedBy(My_) );
							P = test.intersect;	
								// draw the point we landed on 
								//this.A().M_drawDebugVector(P,new RQVec3(0,0,0),null,{color:"green",mask:true});

							// compute new segment length
							thisSegmentLength=prevP.M_dist(P);
							if( thisSegmentLength<0.1)
							{
								thisSegmentLength=0.1;
							}

							//if( !obj.F.m_isBackface)
							//	this.A().M_drawDebugVector(P,dirBranch,null,{color:"blue",mask:true});	// temp DEBUG 
	
							// create new branch direction in the new face
							dirBranch = test.newBasis.X.M_multipliedBy(x_).M_plus(test.newBasis.Y.M_multipliedBy(y_)).M_normalize();

							// 
							//let dot=dirBranch.M_dot(this.m_direction);	check angle between newDirection and currentDirection : not much interesting
							let isContinueCrawlOnNewFace=true;
							if(this.T().dotProductFacesCrawlStops)
							{
								let dot=obj.F.m_normal.M_dot(test.newF.m_normal);
								if(dot<=this.T().dotProductFacesCrawlStops) // test freeing the tree
								{	console.log("discontinuing crawling with dot="+dot);
									isContinueCrawlOnNewFace=false;
								}
							}

							// Set the flag to it doesn't advance more.
							if(isContinueCrawlOnNewFace)
							{
								hasObjControl = true;

		
								// change face 
								// TODO : would need to create a new branch from there if the newface is a Backface. 
								let layerChanged = (test.newF.m_isBackface != obj.back);
								obj.F = test.newF;
								this.M_setDirection(dirBranch);	
		
								
		
								//if( !test.newF.m_isBackface)
								//	this.A().M_drawDebugVector(P,dirBranch,null,{color:"green",mask:true});	// temp DEBUG 
		
								// make a 3D basis for the new direction
								//let dot = dirBranch.M_dot(obj.T);
								//let X= dot>0.8 /*colinear*/ ? obj.K.M_multipliedBy(-1) : dot<-0.8 ? /*inv colinear*/ obj.K : obj.T;
								let X = dirBranch.M_cross(obj.F.m_normalTransformed).M_normalize();
								MV.M_setBase(X,dirBranch,obj.F.m_normalTransformed);
		
		
								if(layerChanged)	
								{	
									endOfBranch = true;	// stop the current one
									
									// lineLength,parentMV,direction
									let branch = this.M_createBranch(this.m_lineLength+lineLength,MV.clone(), dirBranch);
									
									// some copy setup
									branch.m_level = this.m_level;
									branch.M_setBranchLength(this.m_branchLength, this.m_segmentLength);
									branch.m_obj.back = obj.F.m_isBackface;
									branch.M_setPosition(P);
									branch.M_setRadius(currentRadius,this.m_radius);
									branch.m_customBranchLength = this.m_branchLength-lineLength;

									// run the new one
									branch.M_run(MV);

								}
							}
							else // discontinuing crawl
							{	obj=this.m_obj=null;

							}
						}
						else
							endOfBranch = true;
	
					}
				}
	



				// finalize the growth
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
					angleSpan = (0.4+0.8*random())*this.m_tree.m_endBranchAngleSpan;
			
				}
				
				for( var i=0; i<nb;i++)
				{	
					
					if(putLeaves)
					{	if(this.m_tree.m_isLeaves && ( P.y> (this.m_tree.m_groundMargin+Algo.m_yStart)))
						{	

							var newDirection = (nb==1?  (-0.5+Algo.randomLeaves())*angleSpan : (-0.5 + i/(nb-1))*angleSpan ) ;
							let MVLeaf = MV.clone();
							//MVLeaf.M_rotate(leafDirection,0,1,0);			// place the new branch around this branch 
							MVLeaf.M_rotate(newDirection,1,0,0); 
							this.m_leaves.push([Pproj.clone(),MVLeaf]);

						}else
						{
							//A.M_log("Drawing no leaf : m_isLeaves="+(this.m_tree.m_isLeaves?"true":"false")+" P.y="+P.y+" tree.m_groundMargin="+this.m_tree.m_groundMargin+" Algo.m_yStart="+Algo.m_yStart);
						
						}
					}
					else // send a branch
					{	
						let randomOfBranch = Algo["randomDepth"+(this.m_level+1)];
						let newDirection;
						let branchMV = MV.clone();
						if( this.m_endBranchAngle != undefined && !obj)
						{	newDirection = this.m_endBranchAngle.min + randomOfBranch()*(this.m_endBranchAngle.max-this.m_endBranchAngle.min);
							MV.M_rotate( 360/nb, 0,1,0);
						}
						else
						{	newDirection = (nb==1?  (-0.5+randomOfBranch() )*angleSpan : (-0.5 + i/(nb-1))*angleSpan ) ;
						}
						let branch = this.M_createBranch(this.m_lineLength+lineLength,MV.clone(), newDirection);
						branch.M_setPosition(P);
						
						let factor=this.m_customRadiusFactor;
						if( factor && factor.min )	// means custom
							factor = factor.min + (factor.max-factor.min)*randomOfBranch();
						else
							factor =this.m_tree.m_branchEndRadiusFactor; 
						branch.M_setRadius(radiusEnd*factor,radiusEnd);
						
						branchMV.M_rotate(newDirection,obj?0:1,0,obj?1:0);				// inclinaison of branch
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
	M_drawLeaves(opt)
	{
		let isDraw = this.M_isDraw(opt);

		let Algo = this.A();
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{		this.m_branches[ib].M_drawLeaves(opt);
		}
		// draw this branch's leaves
		if( isDraw)
		{
			let leafOpts =this.m_tree.m_leafOpts; 
			for( let il=0; il<this.m_leaves.length; il++)
			{	
				let leaf= this.m_leaves[il];

				if(leafOpts.leafSizeVar)
					leafOpts.leafSize = leafOpts.leafSizeVar.func.apply(Algo,[leaf[0].x,leaf[0].y,leafOpts.leafSizeVar.config] ); 
				else if(!leafOpts.leafSize)
					leafOpts.leafSize = 5*Algo.upscale;
				leafOpts.leafSize*=this.m_tree.m_scale;
				leafOpts.M_setGrowth(Algo.randomLeaves());		// always set leafSize before calling Growth
				LeafManager.M_drawLeaf( ...leaf, this.m_tree.m_leafOpts);
			}
			//A.m_deformersActive = false;	

		}

	
	}
	M_draw(opt)
	{
		let isDraw = this.M_isDraw(opt);

		
		// draw front children branches
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(!this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_draw(opt);
		}

		let Algo = this.A();

		// Draw Grass in front 
		if( this.m_isTrunk && isDraw)
		{
			if( Algo.m_grass && Algo.m_grass.m_isActive)
			{
				this.M_drawGrass("front");						// TODO
			}
		
		}

		// draw this branch	
		if(isDraw)
		{	if( this.m_segments.length>=2)
			{
				let L1 = new RQPolyLine();
				let L2 = new RQPolyLine();
				let L = new RQPolyLine();
				let startArc,endArc;
				let nbSegments = this.m_segments.length;
				
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
						let angInc = Math.PI*2/50;
						let radius = s.radius;
						let circle1 = new RQPolyLine();
						let circle2 = new RQPolyLine();
						let circle=circle1;
						let isCapVisible = false;
						if( isStartPoint || isEndPoint )
						{
							let Nlocal = new RQVec3(0,isStartPoint?-1:1,0);
							let Nw = MV.M_rotateVector(Nlocal);
							isCapVisible = Nw.M_dot(Algo.m_toEyeVector)>=0;
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
								A.M_drawLines(this.T().m_groups.Branches,arc,true);
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

				L1.M_reverseOrder();
				if( this.m_level>=this.T().m_drawBranchContourLevel)
				{
					//Algo.m_groups.Branches.m_lines.push( ...Algo.M_computeLineMask(L2));
					//Algo.m_groups.Branches.m_lines.push( ...Algo.M_computeLineMask(L1));
					let Grp = this.T().m_groups.Branches; 
					A.M_drawLines(Grp,L2,true);
					A.M_drawLines(Grp,L1,true);
				}
				if( L2.M_endPoint().M_dist(endArc.M_getPoint(0) ) >  L2.M_endPoint().M_dist(endArc.M_endPoint() ) ) endArc.M_reverseOrder();

				let contour = L2.clone();
				contour.M_append(endArc);
				contour.M_append(L1);
				// Algo.m_groups.Branches.m_lines.push( ...Algo.M_computeLineMask(L2));    // if we want the end arc
				

				
				if( contour.M_endPoint().M_dist(startArc.M_getPoint(0) ) >  contour.M_endPoint().M_dist(startArc.M_endPoint() ) ) startArc.M_reverseOrder();
				contour.M_append(startArc);


				this.M_fill(contour);

				this.M_drawInMask(contour,L1,L2);

			}
		}		
		// draw back children branches
		for( let ib=0; ib<this.m_branches.length; ib++)
		{	if(this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_draw(opt);
		}
		// Draw Herb+Ground
		if( this.m_isTrunk && isDraw)
		{
			
			if( Algo.m_grass && Algo.m_grass.m_isActive)
			{
				this.M_drawGrass("back");
			}
			
			if( Algo.m_ground && Algo.m_ground.m_isActive)
			{
				this.M_drawGround();
				//if(Algo.m_ground.m_earthPlane=="front")
				this.M_drawEarth("front");			
			
			}
		
		
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
		if( shape && this.T().m_drawBranchMask)
		{
			var path = new Path2D(shape.M_getSVGPath(true));
			let context = Algo.m_mask.M_getContext();
			context.fillStyle = "white";
			context.fill(path);
				
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
		let Gp = this.T().m_groups.Roots;
		if( this.m_isRoots && Gp)
			fills = Gp.fills;
		if( fills==null || !Array.isArray(fills) )
			fills = this.T().m_groups.Branches.fills;
		if( Array.isArray(fills) )
		{
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];


				if( F)
				{	
					F.branch = this;
				
					// compute the average direction
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
					let lighting = (1+N.M_dot(Algo.m_lightSource))*0.5;
					lighting*=lighting;

					F.orientation = Algo.M_projectedOrientation(dirMedian);
					F.spacing=  RQMaths.M_map( lighting,0,1,F.m_spacing.min , F.m_spacing.max);
					Algo.M_fillShape(F,shape,F);

				
				}
			}
		}
	
	}


};
class ClassTree extends ClassTreeBranch 
{
	
	// opts
	/* 
	{
		isLeaves				: true,
		isAllLeavesFront		: false,
		leafShape				: "default"
		rndAngleSpan 			: 
		branchRndDensity		:
		maxRecursionDepth		: 
		branchLengthLevelFactor :
		branchEndRadiusFactor	: 
		newBranchRadiusFactor	: 
		branchReductionFactor	: 
		branchOpenAngle			:
		endBranchLeafAngleSpan	: 
		endBranchNbLeaves		: {min : 1 ; max : 3}
		intermediateBranches	: {rnd:0.3, height:0,level:0,newLevel:1} 
		youngBranch				: {rnd:0.1, height:0,level:0,newLevel:2}
		leaves					: {rnd:0.1, height:0,level:0} 
		drawBranchContourLevel	: 0
		rootEndBranchNb			: {min:2,max:2}
		groundMargin			: 0
		groups					: { }
	}
	algorithm. M_defaultLeafProfile

	*/
	constructor(algorithm,opt)
	{
		super(null, null); 
		// versions 
		// 2.0		
		// 2.2			- correction bug number of end branches 
		// 2.3			- correction bug on new branches
		this.m_version 					= 2.3;		
		this.m_factoryCount				=TreeManager.factoryCount++;
		this.m_tree  = this;
		this.m_rootBranch=false;
		this.m_isTrunk = true;
		this.m_A = algorithm;				// algo				
		this.m_rndAngleSpan 			= opt.rndAngleSpan;
		this.m_branchRndDensity			= opt.branchRndDensity;
		this.m_maxRecursionDepth		= opt.maxRecursionDepth;
		this.m_branchLengthLevelFactor	= opt.branchLengthLevelFactor;
		this.m_branchEndRadiusFactor 	= opt.branchEndRadiusFactor;
		this.m_newBranchRadiusFactor 	= opt.newBranchRadiusFactor;
		this.m_branchReductionFactor 	= opt.branchReductionFactor;
		this.m_branchOpenAngle			= opt.branchOpenAngle;
		this.m_endBranchAngleSpan		= opt.endBranchAngleSpan;
		this.m_endBranchLeafAngleSpan	= opt.endBranchLeafAngleSpan;
		this.m_intermediateBranch		= opt.intermediateBranches;
		this.m_youngBranch				= opt.youngBranch;
		this.m_drawBranchContourLevel 	= opt.drawBranchContourLevel;
		this.m_isLeaves					= opt.isLeaves;
		this.m_isAllLeavesFront			= opt.isAllLeavesFront; 
		this.m_endBranchNbLeaves 		= opt.endBranchNbLeaves;
		this.m_leafRndDensity			= opt.leaves.rnd;
		this.m_leafOpts					= opt.leafOpts;
		this.m_groups					= opt.groups;
		this.m_groundMargin				= opt.groundMargin;
		this.m_level					= 0;
		this.m_drawBranchMask			= true;
		this.m_parentMV 				= new RQMatrix4();
		this.m_endBranchNb				= opt.rootEndBranchNb;
		this.m_scale 					= opt.scale;		
	}
	M_setRadius(r,parentRadius)
	{
		this.m_radius=r*this.m_scale;
		this.m_parentRadius=0;
	
	}
	M_setBranchLength(len,segmentLength)
	{
		this.m_segmentLength = Math.max(segmentLength*this.m_scale, A.upscale);
		this.m_branchLength = len*this.m_scale;  	
	}
	M_makeRoots()
	{
		let R;
		let Algo = this.A();
		let nbRoots = Algo.m_roots.m_nbRoots;

		// reseed
		if( Algo.m_roots.m_seed>-1)
			Algo.M_makeRandomFunctions(Algo.m_roots.m_seed);


		this.m_roots=R=new ClassTreeBranch(this,this);
		
		
		this.m_branchEndRadiusFactor/=2;
		this.m_youngBranch = Algo.m_roots.m_youngBranch;
		this.m_intermediateBranch = Algo.m_roots.m_intermediateBranch;
		this.m_rndAngleSpan = Algo.m_roots.m_rndAngleSpan;
		this.m_yStop = Algo.m_roots.m_yStop;
		//Algo.M_log("Roots : using youngBranch = "+RQPrintR(this.m_youngBranch,1));
		this.m_maxRecursionDepth = Algo.m_roots.m_maxRecursionDepth;
		R.m_level = 0;
		R.m_isRoots = true;
		R.m_parentRadius=this.m_radius;
		R.m_radiusEnd = R.m_radius = this.m_radius;
		R.M_setBranchLength( this.m_branchLength*0.5/*this.m_segmentLength*/,this.m_segmentLength);
		R.m_customBranchLength = this.m_radius/2;
		R.m_customRadiusFactor =  Algo.m_roots.m_rootsRadiusFactor;
		R.m_lineLength = 0;
		R.M_setPosition(this.m_position);
		R.m_endBranchNb = nbRoots;
		R.m_endBranchAngle = Algo.m_roots.m_rootsEndBranchAngle;
		this.m_groundMargin = 0;
		this.m_branchLengthLevelFactor = Algo.m_roots.m_branchLengthLevelFactor;
		
		let MV = this.m_parentMV.clone();
		MV.M_rotate(180,1,0,0);
		this.m_gravity=new RQVec3(0,-1,0);
		this.A().m_isLeaves = false;
		let angleSpan = 60;
		
		if( false)
		{	for( let n=0; n<nbRoots; n++)
			{
				var newDirection = angleSpan;
				let branch = R.M_createBranch(0,MV.clone(), newDirection);
				branch.M_setRadius(this.m_radius*0.3,this.m_radius);					
				let branchMV = MV.clone();
				branchMV.M_rotate(360*n/nbRoots,0,1,0);				// distribution
				branchMV.M_rotate(newDirection,0,0,1);				// inclinaison of branch
				branch.M_setPosition(this.m_position); //.M_plus(branchMV.M_rotateVector(new RQVec3(0,this.m_radius/2,0) )));
				branch.M_run(branchMV);
			}
		}
		else
			R.M_run(MV);

	}
	M_draw(opt)
	{
		let isDraw = this.M_isDraw(opt);

		let frontLeaves = this.m_isAllLeavesFront;

		// draw front leaves
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(frontLeaves || !this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_drawLeaves(opt);
		}
		// draw leaves
		if(isDraw)
		{
			let Algo = this.A();
			for( let il=0; il<this.m_leaves.length; il++)
			{
				this.m_leafOpts.leafSize = Algo.m_leafSize.func.apply(Algo,[C.x,C.y,Algo.m_leafSize.config] ); 
				//Algo.M_drawLeaf( ...this.m_leaves[il], this.m_leafOpts);
				LeafManager.M_drawLeaf( ...this.m_leaves[il], this.m_leafOpts);
			}
		}
		// draw the tree
		super.M_draw(opt);
	
		// draw back leaves
		if(!frontLeaves)
		for( let ib=this.m_branches.length-1; ib>=0; ib--)
		{	if(this.m_branches[ib].m_isBackbranch) 
				this.m_branches[ib].M_drawLeaves(opt);
		}
		
	
	
	}
	M_drawGrass(side)
	{
		
		let Algo = this.m_A;
		Algo.M_log("M_drawGrass");
		let S = Algo.m_grass;
		if( S)
		{
			
			let pProj = A.M_projection(this.m_position);
			let scale = 1.;
			let range;
			let yMin = pProj.y - S.m_dimensions.depth/2*Algo.m_perspectiveFactor-S.m_y; 
			let yMid = pProj.y-S.m_y;/*+this.m_radius*Algo.m_perspectiveFactor*/
			let yMax = pProj.y + S.m_dimensions.depth/2*Algo.m_perspectiveFactor-S.m_y; 
			if( side=="front")
				range={init:yMax, min:yMid}
			else if( side=="back")
				range={init:yMid, min : yMin}

			let mid = Algo.m_workArea.center().x;
			S.A.m_xBounds={min: mid-S.m_dimensions.width*0.5, max: mid+S.m_dimensions.width*0.5}
			if( range!=undefined)
			{
				for ( let y = range.init; y > range.min; )
				{
					scale = RQMaths.M_map(y,yMin,yMax,S.m_depthScaleFactor, 1);
					S.A.M_makeLineOfGrass(y,scale);
					y-= 4*Algo.upscale*scale;
				}
			
			}
		
		
		
		}
	}
	M_drawGround()
	{
		let Algo = this.m_A;
		let S = Algo.m_ground;
		if( S )
		{
			let points = [];
			let ind = [-1,1,1,1,1,-1,-1,-1];
			let C = Algo.m_workArea.center();
			let perspective =Algo.m_perspectiveFactor/3; 
			let xdecal = perspective*S.m_dimensions.depth/3;
			var earthL ;
			for( let i=0; i<8; i+=2)
			{	let P = new RQVec3(C.x+ind[i]*S.m_dimensions.width/2+ind[i+1]*ind[i]*xdecal,this.m_position.y+S.m_y,this.m_position.z+ind[i+1]*S.m_dimensions.depth/2) ;  
				points.push( A.M_projection( P));
			}
			let _A = points[0].clone();
			let _B = points[1].clone();
			points.push(points[0].clone());
			if(S.m_noiseContour.amplitude!=0 && S.m_noiseContour.fact !=0)
			{
				let noiseOffset =-this.T().m_position.x; 
			
				let pts2 = [];
				let segLength = 1*Algo.upscale;
				for( let j=0; j<4; j++)
				{
					let AB = points[j+1].M_minus(points[j]);				
					let l = AB.M_length();
					let nbPoints = l / segLength;
					let s=segLength;
					let y=0;
					AB.M_mul(1/l);					
					for( let i=1; i<=nbPoints; i++) 
					{
						let P = points[j].M_plus(AB.x*s,AB.y*s);
						let rnd = noise.simplex2( (P.x-noiseOffset)*S.m_noiseContour.fact/l,P.y*S.m_noiseContour.fact/l);
						P.y+=rnd*S.m_noiseContour.amplitude/2;
						pts2.push(P);
						s+=segLength;
					}
					if( j==0)
						earthL = new RQPolyLine([...pts2]);
				}			
				points=pts2;
			}
			let L = new RQPolyLine(points);
			//Algo.M_log("Ground L="+L.M_getString());
			//L.M_closePath();

			let Fs = this.T().m_groups.Ground.fills;
			let F;
			if(Fs)
			for( let f=0; f<Fs.length; f++)
			{
				if( F =Fs[f])
				{
					// contour
					if(S.m_isDrawContour)
					{	//F.m_lines.push( ...Algo.M_computeLineMask(L) );			
						A.M_drawLines(F,L,true);
					}
					// Hatch 
					F.orientation= 0;	// orientation
					F.spacing=  F.m_spacing.average;
					//Algo.M_log("F.spacing = "+F.spacing);
					//F.jointEnds=true;
					//F.m_lines.push( ...Algo.M_hatchShape( L ,F)); 
					Algo.M_fillShape(F,L,F);
				
				}
				if(S.m_isDrawInMask)
				{
					let pathPoints = L.M_getSVGPath(false);
					var path = new Path2D(pathPoints);
					if(Algo.m_mask)
					{	
						var context = Algo.m_mask.M_getContext();			
						context.fillStyle = "white";
						context.fill(path);
					}	
				
				}
			}
			// Earth
			if( S.m_earthHeight >0 )
			{
				earthL.M_addPoint(_B.M_plus( 0,S.m_earthHeight) );
				earthL.M_addPoint(_A.M_plus( 0,S.m_earthHeight) );
				earthL.M_closePath();
				this.m_earthL = earthL;
				
				
			}
			else
				this.m_earthL = 0;
		}
	
	}
	M_drawEarth(plane)
	{
		let Algo = this.m_A;

		if(this.m_earthL)
		{
			// Test
			//Algo.m_hatchTexture = Algo.m_mask;
			
			let Fs;
			if( plane=="front")
				Fs = this.T().m_groups.EarthFront.fills;
			else 
				Fs = this.T().m_groups.Earth.fills;
			let F;
			if( Fs )
			for( let f=0; f<Fs.length; f++)
			{
				if( F =Fs[f])
				{
					if(plane=="front")	// TEMP
						F.spacingFunc = Algo.M_earthSpacingFunc;
					F.spacing=  F.m_spacing.average;
					//F.m_lines.push( ...Algo.M_hatchShape( this.m_earthL ,F)); 
					Algo.M_fillShape(F,this.m_earthL,F);
				}
			}
		}
	
	
	}

};
class TreeManagerClass
{
	constructor()
	{	
		this.factoryCount=0;
	}
	M_createTreeOptions(treeType,opts)
	{
		if(opts===undefined)
			opts={};
		if(opts.groups===undefined)
			opts.groups={Branches:null}				// todo : find the default group
		let isLeaves = opts.leafOpts? true:false;
		let scale = opts.scale||1;
		let maxDepth = opts.maxDepth?opts.maxDepth:5
		let o =
		{
			isLeaves				: isLeaves,
			isAllLeavesFront		: false,
			leaves					: {rnd:0.2, height:0,level:0},
			leafOpts				: opts.leafOpts,
			scale					: scale,
			rndAngleSpan 			: 30,
			branchRndDensity		: 0.1,
			maxRecursionDepth		: maxDepth,
			branchLengthLevelFactor : 0.9,
			branchEndRadiusFactor	: 0.8,
			newBranchRadiusFactor	: 0.6,
			branchReductionFactor	: 0.8,
			branchOpenAngle			: 100,
			endBranchAngleSpan		: 90,
			endBranchLeafAngleSpan	: 100,
			endBranchNbLeaves		: {min : 1 , max : 3},
			intermediateBranches	: {rnd:0.3, height:0,level:0,newLevel: Math.min(maxDepth-1,2)}, 
			youngBranch				: {rnd:0.1, height:0,level:0,newLevel: Math.min(maxDepth-1,2)},
			drawBranchContourLevel	: 0,
			rootEndBranchNb			: {min:2,max:2},
			groundMargin			: 0,
			groups					: opts.groups

		}
		switch( treeType)
		{
			case "Ivy":
				o.isAllLeavesFront = true;
				o.rndAngleSpan = 20; 
				o.branchReductionFactor=0.9;
				o.youngBranch =  {rnd:0.3, height:0,level:0,newLevel:Math.min(maxDepth-1,3)};
				break;
			case "Arbust":
				o.isAllLeavesFront = true;
				o.rndAngleSpan = 5; 
				o.branchOpenAngle=60;
				o.branchReductionFactor=0.9;
				o.youngBranch =  {rnd:0.2, height:0.5,level:0,newLevel:Math.min(maxDepth-1,3)};
				break;
			default : 
				break;
		}
	


		return o;
	}

}
const TreeManager = new TreeManagerClass();
