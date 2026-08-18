class SpeciesBush extends SpecyDefault
{
    constructor(name)
    {
        super(name);
    }
    // factory function : creates an instance of the class
    static create(name)
    {
        return new SpeciesBush(name);
    }

    // M_init
    M_init(_)
    {
        this.M_declareSvgGroup(_ , "Branches");
		this.M_declareSvgGroup(_ , "Fruits");
		this.M_declareSvgGroup(_ , "Leaves");

        let ups = _.upscale;

        _.M_readMinMaxVar(this,"height",ups,false); 			
        this.m_viewerOrientation = this.M_getFloat("viewerOrientation");
        this.m_maxLevel     = this.M_getInt("maxLevel",{min:1,max:4});
        this.m_branchAngle  = this.M_getFloat("branchAngle",{min:20,max:40});
        this.m_e            = this.M_getFloat("e",{root:2,min:0.2,length:0.8,branch:0.8});
        this.m_modulation   = this.M_getFloat("branchModul",{amplitude:0,noiseFact:1});
        this.m_leafShape    = this.M_get("leafShape","None");
        this.m_leafDistrib  = this.M_get("leafDistrib",{rnd:0.1,height:0.5,level:0,nb:1});			// left refers to the last level, 1 to the last leve-1, etc
        this.m_isLeaves     = this.m_leafShape && this.m_leafShape!="None";
        this.m_fillH		= this.M_getFloat("fillH",0);
        this.m_isFruits     = this.M_getBool("isFruits",false);
        this.m_fruitSize    = this.M_getFloat("fruitSize",{min:2,max:2}); for(let a in this.m_fruitSize) this.m_fruitSize[a]*=ups;
        this.m_fruitStem	= this.M_getFloat("fruitStem",{length:0,e:0.3}); this.m_fruitStem.length*=ups;this.m_fruitStem.e*=ups;
        this.m_fruitDistrib = this.M_get("fruitDistrib",{rnd:0.01,height:0.5,level:0,nb:1});			// left refers to the last level, 1 to the last leve-1, etc
        this.m_fruitShape   = this.M_get("fruitShape","round")??"round";
        _.M_readMinMaxVar(this,"fruitRnd",1,false);
        this.m_intermediateBranch = this.M_getFloat("intermediateBranches",{rnd:0.1,height:0,level:0,newLevel:1});


        // call default
        SpecyDefault.prototype.M_init.call(this,_);
     
        
    }

    M_draw(_,opt)
    {

        var sz = opt.scale;
		var S = this;
        opt.S = this;

		opt.maxLevel = S.m_maxLevel.min +parseInt( (S.m_maxLevel.max-S.m_maxLevel.min) *S.random());
		var height = S.m_height.func.apply(_,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		var leafSize = S.m_size.func.apply(_,[opt.x,opt.y,S.m_size.config] )*opt.scale;

		S.m_groups.Fruits.M_applyScale(opt.scale)
		S.m_groups.Branches.M_applyScale(opt.scale)
		var O = new RQVec2(opt.x,opt.y);
		let MV = new RQMatrix4();

		let seg = /*opt.seg||*/2*_.upscale;
		let l=0;
		let e = S.m_e.root*_.upscale*sz;
		let P = new RQVec3(0,0,0);
		if( _.m_isShortenJunctions)
			opt.paths=[];
		

		let ff = opt.fillsFront=[];
		
		let iHeap = _.m_canvasHeapL.length;
		_.M_putTreeGrassBranch(opt,{MV:MV,O:O,P:P,height:height,strokeDecal:S.m_groups.Branches.m_strokeWidth*1.4,level:0,seg:seg,e:e}); 

		let f_;
		while(f_=ff.pop())
		{	if(f_.F.m_active)
				_.M_fillShape(f_.F,f_.path,f_.F); 
			_.m_canvasHeapL.splice( iHeap,0, _.m_canvasHeapL.pop());
		}
		
		
		if( _.m_isShortenJunctions)
		{
			let context = _.m_mask.M_getContext();
			context.lineWidth = _.m_protectionStrokeWidth*2;
			context.strokeStyle = "white";
			let path;
			while( path=opt.paths.pop())
			{
				context.stroke(path);
			}
		}

    }
};


PlantSpecies.M_register("RootsBush",{ factory:SpeciesBush.create});
PatternAlgorithm.prototype.M_putTreeGrassBranch = function(opt,B)
	{
		let S = opt.S;
		let group = S.m_groups.Branches;
		let variableStroke= false; //B.strokeDecal>=(group.m_strokeWidth*0.2);
		let varStrokFact = 0.4;

		let L0 = new RQPolyLine();
		let L1 = new RQPolyLine();
		let L2 = new RQPolyLine();
		let L1b,L2b;
		L1b=new RQPolyLine();
		L2b=new RQPolyLine();		
		let P = B.P.clone();
		let torsion = S.m_torsion.func.apply(this,[opt.x,opt.y,opt.S.m_torsion.config] );
		let torsionInc = torsion/(B.height/B.seg);
		let e = B.e;

		let eEnd = B.e*opt.S.m_e.length;
		let eInc = (eEnd-e)/(B.height/B.seg);
		let Y = new RQVec3(0,1,0);		
		let X = new RQVec3(1,0,0);
		//let eSmall= group.m_strokeWidth+Math.max(this.m_protectionStrokeWidth,2*group.m_strokeWidth); 
		//let eSmall = opt.S.m_e.min*this.upscale+group.m_strokeWidth;
		let eSmall = S.m_e.min*this.upscale;
		let isLineCut = false;
		//console.log("e="+e+" group.m_strokeWith="+group.m_strokeWidth+" protec="+this.m_protectionStrokeWidth+" esmall="+eSmall);
		let J;
		let modFact=S.m_modulation.noiseFact/B.height;
		let modAmp=S.m_modulation.amplitude;
		let modInc=0;
		let P0 = P.clone();
		let Fs = group.fills; 
		let F;
		let fruitSide=1;
		let maskCtx = this.m_mask.M_getContext();
		maskCtx.fillStyle = "white";


		for(let l=0; l<=B.height; l+=B.seg)
		{
					
			J = B.MV.M_mutlipliedByVector(Y);
			let I = B.MV.M_mutlipliedByVector(X);
			let pLeft = this.M_projection( P.M_plus( I.M_multipliedBy(-e/2) ) ,B.O );
			L0.M_addPoint( pLeft);										
			if(e>=eSmall)
			{
				L1.M_addPoint( pLeft);										
			}
			else
				isLineCut = true;
			L2.M_addPoint( this.M_projection(P.M_plus( I.M_multipliedBy(e/2) ),B.O ));										
			if(variableStroke)
			{	
				let ePlus = B.strokeDecal + B.strokeDecal*(varStrokFact-1)*l/B.height;
				L1b.M_addPoint( this.M_projection( P.M_plus( I.M_multipliedBy(-e/2-ePlus) ) ,B.O ));										
				L2b.M_addPoint( this.M_projection( P.M_plus( I.M_multipliedBy(e/2+ePlus) ) ,B.O ));																	
		
			}



			if(B.level<opt.maxLevel)
			{
				// End point ? 
				if(  (l+B.seg)>=B.height)
				{
					let branchAngle = S.m_branchAngle.min + (S.m_branchAngle.max-S.m_branchAngle.min)*S.random();
					for( let ie=-1; ie<=1; ie+=2)
					{
						let MV = B.MV.clone();
						MV.M_rotate(branchAngle*Math.sign(ie),0,0,1);				

						this.M_putTreeGrassBranch(opt,{MV:MV,O:B.O,P:P,height:B.height*0.7,strokeDecal:B.strokeDecal*varStrokFact,level:B.level+1,seg:B.seg,e:e*S.m_e.branch}); 
					}				
				
				}
				else
				{	
					// new branch on the length ? 
					if( B.level>=S.m_intermediateBranch.level && (l/B.height)>=S.m_intermediateBranch.height)  
					{	let rnd = S.random();
						
						if( rnd<S.m_intermediateBranch.rnd)	 
						{
							let MV = B.MV.clone();
							let branchAngle = S.m_branchAngle.min + (S.m_branchAngle.max-S.m_branchAngle.min)*S.random();

							MV.M_rotate(branchAngle*Math.sign(S.random()-0.5),0,0,1);				
							this.M_putTreeGrassBranch(opt,{MV:MV,O:B.O,P:P,height:B.height*0.7,strokeDecal:B.strokeDecal*varStrokFact,level:Math.max(B.level+1,S.m_intermediateBranch.newLevel),seg:B.seg,e:e*S.m_e.branch}); 
						}
					}
				}
			}
			// Fruits
			if( S.m_isFruits)
			{	
				
				if( B.level>= (opt.maxLevel-S.m_fruitDistrib.level) && (l/B.height)>=S.m_fruitDistrib.height)
				{

					let p1 = this.M_projection(P, B.O);
					let P2 = P.clone();
					let rnd = S.m_fruitRnd.func.apply(this,[p1.x,p1.y,S.m_fruitRnd.config] );
					let shiftSide=1;
					let isStem = S.m_fruitStem && S.m_fruitStem.length;
					if(S.random()<rnd)
					{	let MV;
						if(isStem)
						{	shiftSide=0;
							MV = B.MV.clone();
							let branchAngle = S.m_branchAngle.min + (S.m_branchAngle.max-S.m_branchAngle.min)*S.random();

							MV.M_rotate(branchAngle*fruitSide,0,0,1);				
							let J2 = MV.M_mutlipliedByVector(Y);

							P2.M_add( J2.M_multipliedBy( S.m_fruitStem.length*opt.scale));								
						}
	
						

						let r= 0.5*opt.scale * (opt.S.m_fruitSize.min + (opt.S.m_fruitSize.max-opt.S.m_fruitSize.min)*S.random());	// TODO : parametric var 
						let L = new RQPolyLine();
						let nb =20;
						let a=0; let aInc = Math.PI*2/nb;
						for( let ifr=0; ifr<=nb; ifr++ )
						{
							L.M_addPoint( this.M_projection(P2.M_plus(r*Math.cos(a)+I.x*shiftSide*fruitSide*r, r*Math.sin(a)+I.y*shiftSide*fruitSide*r,0 ), B.O) );	
							a+=aInc;
						}

						let grpFruits = opt.S.m_groups.Fruits;
						this.M_drawLines(grpFruits,L,true);
						if( Array.isArray(Fs=grpFruits.fills))
						{
							for( let f=0; f<Fs.length; f++)
							{
								if( (F=Fs[f]) && F.m_active)
								{	F.spacing=F.m_spacing.min;
									F.jointEnds=true;

									this.M_fillShape(F,L,F); 
								
								}
							}
						}
						// draw in mask
						maskCtx.fill(new Path2D(L.M_getSVGPath(false)));
						// draw stem
						if(isStem)
						{
							if( S.m_fruitStem.e)
							{	
								let I2 =MV.M_mutlipliedByVector(X);
								let e2=S.m_fruitStem.e/2;
								let L2 = new RQPolyLine();
								for( let k=-1; k<=1; k+=2)
								{
									let p1 = this.M_projection(P.M_plus(k*e2*I.x,k*e2*I.y,0 ),B.O);
									let p2 = this.M_projection(P2.M_plus(k*e2*I.x,k*e2*I.y,0 ),B.O);
									L2.M_addPoint( k<1?p1:p2);
									L2.M_addPoint( k<1?p2:p1);
									this.M_drawLines(group,new RQLine(p1,p2),true );
								}
								maskCtx.fill(new Path2D(L2.M_getSVGPath(false)));

							}
							else 
								this.M_drawLines(group,new RQLine(p1,this.M_projection(P2, B.O)),true );

						}
					}
					
				}
				fruitSide = -fruitSide;
			}

			// Leaves 
			if(S.m_isLeaves)
			{
				let LOpt={   bend:50,length: 10*this.upscale, width: 10*this.upscale*0.3, nbProfilePoints:50 ,centerLine:false, group : S.m_groups.Leaves,fills:S.m_groups.Leaves.fills }
				opt.leaves = LOpt; 

				switch(S.m_leafShape)
				{
					case 'Mint':
					   LOpt.nbProfilePoints=50;
					   LOpt.profile	= this.M_mintLeafProfile;
					   LOpt.invProfile  = this.M_mintLeafInvProfile; 
						// widthRatio = 0.3; 
						break;				
				}


				// End point ?  
				if(  B.level==opt.maxLevel &&  (l+B.seg)>=B.height)
				{
					// TODO --> put S.m_leafDistrib.nb leaves here 
					let MV = new RQMatrix4(); // B.MV.clone(); 
					MV.M_setTranslation(P);	
					// orientation is up, flat
					
					MV.M_rotate(S.random()*360,0,1,0);							// rotation around Y axis
					MV.M_rotate(70,1,0,0);										// make it horizontal
					//MV.M_rotate(/*viewerOrientation*/20,1,0,0);			// rotate in the direction of the viewer

					// call draw leaf 					
					this.M_drawLeaf( MV,opt);
				
				
				}
				else if( B.level>= (opt.maxLevel-S.m_leafDistrib.level) && (l/B.height)>=S.m_leafDistrib.height )
				{	
					let rnd = S.random();						
					if( rnd<S.m_leafDistrib.rnd)	 
					{
						let MV = B.MV.clone();
						// TODO -> mut 1 leaf here 
					}
				}

			
			
			}
			//S.m_leafShape= S.M_get("leafShape","None");
			//S.m_leafDistrib= S.M_get("leafDistrib",{rnd:0.1,height:0.5,level:0,nb:1});			// left refers to the last level, 1 to the last leve-1, etc



			// update direction
			let inc= -torsionInc;
			if(modAmp!=0)
			{
				let rnd = noise.simplex2(P0.x+l*modFact,P0.y);
				inc-=modInc;	// remove previous modulation increment
				modInc = modAmp*rnd;
				inc+=modInc;		// add new increment 				
				
			}
			B.MV.M_rotate(inc,0,0,1);
			e+=eInc;				
			P.M_add( J.M_multipliedBy(B.seg));

		}
		if( B.level==opt.maxLevel && !isLineCut)
		{	L1.M_reverseOrder(); 
			L2.M_append( L1) ;
			L1.m_points=[];
			L0=L2;
		}
		else 
		{	L2.M_reverseOrder();
			L0.M_append(L2);
		}
		
		if( !Array.isArray(Fs=group.fills)) Fs=[];
			

		// fill ( front ) 
		for( let f=0; f<Fs.length; f++)
		{	F=Fs[f];
			if(F.m_isFront)
				F.m_isFrontActive = B.O.y<this.H*(1-S.m_fillH);
			if( F.m_isFrontActive)
				opt.fillsFront.push({F:F,path:L0});
		}
		
		
		if( L1.M_nb()>0)
			this.M_drawLines(group,L1,true);
		this.M_drawLines(group,L2,true);
		//group.m_lines.push(...this.M_computeLineMask(L2));
		if( L1b.M_nb()>0)
			this.M_drawLines(group,L1b,true);
		if( L2b.M_nb()>0)
			this.M_drawLines(group,L2b,true);


	

		// Fill
		for( let f=0; f<Fs.length; f++)
		{
			if( (F=Fs[f]) && !F.m_isFrontActive && F.m_active)
			{	F.orientation=Math.atan2(J.y,J.x)/DEGTORAD;
				F.spacing=F.m_spacing.min;	//TEMP
				this.M_fillShape(F,L0,F); 
			
			}
		}

		
		// draw in mask 
		var path = new Path2D(L0.M_getSVGPath(true));
		maskCtx.fill(path);
		
		// protection
		if( this.m_isShortenJunctions)
			opt.paths.push(path);

	
	}