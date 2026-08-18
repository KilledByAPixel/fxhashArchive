//-----------
// BIGFLOWER
//-----------
class SpecyBigFlower extends SpecyDefault
{
    constructor(name)
    {
        super(name);
    }
    // factory ( this is algo )
    static create(name)
    {
        return new SpecyBigFlower(name);
    }

    M_init(_)
    {
        let ups=_.upscale;

		// Declare groups
		this.M_declareSvgGroup(_,"Hearts");
		this.M_declareSvgGroup(_,"HeartFeat");
		this.M_declareSvgGroup(_,"Stem");
		this.M_declareSvgGroup(_,"Petals");
		this.M_declareSvgGroup(_,"Leaf");
		this.M_declareSvgGroup(_,"LeafFeat");
		this.M_declareSvgGroup(_,"Stamen");


		_.M_readParametricVariable(this,"height",ups,false);
		this.m_nbPetals = this.M_getInt("nbPetals",20);
		this.m_isDrawHeart = this.M_getBool("isDrawHeart",true);
		this.m_coreRadius = this.M_getFloat("coreRadius",0.32);
		_.M_readParametricVariable(this,"viewerOrientation",1,false);
		this.m_stemWidth= this.M_getFloat("stemWidth")*ups;
		this.m_stemSegment= this.M_getFloat("stemSegment",{min:10,max:10}); this.m_stemSegment.min*=ups;this.m_stemSegment.max*=ups;	
		_.M_readParametricVariable(this,"yRotation",1,false);
		this.m_leafShape= this.M_get("leafShape","-");
		
		this.m_leafOrganize = this.M_getFloat("leafOrganize",{nb:2,shiftDeg:90,seg:5,kStart:0.2,kEnd:0.6});
		this.m_leafOrganize.nb=parseInt(this.m_leafOrganize.nb);
		this.m_leafOrganize.seg*=ups;



        // call default
        SpecyDefault.prototype.M_init.call(this,_);
     
        
    }
	M_getMaxHeight()
	{
		return rndRange(this.m_size,()=>0.95);
	}
    M_draw(_,opt)
    {
		this.m_groups.Hearts.M_applyScale(opt.scale);
		this.m_groups.Stem.M_applyScale(opt.scale);
		this.m_groups.Petals.M_applyScale(opt.scale);
		this.m_groups.Leaf.M_applyScale(opt.scale);
		this.m_groups.LeafFeat.M_applyScale(opt.scale);
		this.m_groups.HeartFeat.M_applyScale(opt.scale);
		this.m_groups.Stamen.M_applyScale(opt.scale);

        // On the fly randomization of some parameters  
        this.m_nbPetals = Math.ceil(6+Math.pow(this.random(),2)*15);
        let dotRadius = (0.2+0.5*this.random())*_.upscale
        let hasStamen = true;
        let hasLeaves = true;
        let centerRadiusRatio= 0.05+0.1*this.random();

		let C=new RQVec2(opt.x,opt.y);
		var height = this.m_height.func.apply(_,[opt.x,opt.y,this.m_height.config] )*opt.scale;
		var flowerSize = this.m_size.func.apply(_,[opt.x,opt.y,this.m_size.config] )*opt.scale;
		let leafSize = this.m_leafSizeRatio*flowerSize;
		var direction = this.m_torsion.func.apply(_,[opt.x,opt.y,this.m_torsion.config] );
		let viewerOrientation = this.m_viewerOrientation.func.apply(_,[opt.x,opt.y,this.m_viewerOrientation.config] );
		let yRotation= 90+ (this.m_yRotation.func? this.m_yRotation.func.apply(_,[opt.x,opt.y,this.m_yRotation.config] ) : 0);
		// generate stem with sampling 
		let stemOpts =
		{ 	C			: C,
			yRotation 	: yRotation,
			torsion		: {start:0, end: direction },
			height		: height,
			seg 		: opt.seg,
			samples 	: {seg: this.m_stemSegment.min + (this.m_stemSegment.max-this.m_stemSegment.min)*this.random(), start:0.3*height},
			width		: this.m_stemWidth*opt.scale
		}
		var stem = LeafManager.M_getStem(stemOpts);

		//stemOpts.fillStem = this.m_isFillStem;
		if(stem.lines.length==0)
			return;
		
		
		C = stem.end;

		// Draw Flower
		let endPetalRadius = flowerSize*0.5;		// 
		let centerRadius = endPetalRadius*centerRadiusRatio;
		let startRadiusPetal=centerRadius*0.95;

		var stack = [];
		let MV;
		if(stem.endSample)
			MV= stem.endSample.MV;
		else 
		{	MV=new RQMatrix4();
			MV.M_rotate(direction,0,0,1);
			MV.M_rotate(viewerOrientation,1,0,0);
		}
		stack.push(MV.clone());		
		let leafOpts = LeafManager.M_createLeafOptions("Sunflower");

        leafOpts.stemRatio = 0.01;
		leafOpts.leafSize = endPetalRadius-startRadiusPetal; // length of leaves
		let middlePetalRadius = startRadiusPetal+leafOpts.leafSize/2;
		let leafWidth=(2*PI*middlePetalRadius)/this.m_nbPetals;
		leafOpts.ratio = leafWidth/leafOpts.leafSize;

        leafOpts.groups = {
			Leaves				: this.m_groups.Petals,
			LeavesFeat			: this.m_groups.Features
		}
		let rot=360/this.m_nbPetals;
		let n=this.m_nbPetals*2;
		let nHalf =this.m_nbPetals;
		let incl = 15+90*this.random();
		let petals=[];
		let zero=new RQVec3(0,0,0);
		for( let ip= 0; ip<n; ip++)
		{
			leafOpts.bendAlpha = 90*this.random();	//TEMP
			MV.M_rotate(rot,0,1,0);
			stack.push(MV.clone());
			MV.M_translate(0,0,startRadiusPetal);
			MV.M_rotate(incl,1,0,0);
			petals.push({MV:MV.clone(),opts:leafOpts,z:MV.M_mutlipliedByVector(zero).z });

			MV = stack.pop();

			if(ip==nHalf)
				incl=60;
		}
		MV = stack.pop();

		// Sort petals by Z, add a z for the heart
		petals.push({isHeart:true,z:MV.M_mutlipliedByVector(zero).z });
		petals.sort( function(a,b){ return a.z<b.z?1 : -1} ); 


		// Prepare shape for the heart
		let shape = new RQPolyLine();

		// compute petals and heart
		for(let ip=0; ip<petals.length; ip++)
		{
			let petal = petals[ip];
			if( petal.isHeart)
			{
				// Draw flower heart
				let heartShape = new RQCircle(centerRadius);
				let heartPoints = heartShape.M_createPolyline(50);
				let v= new RQVec3();
				for( let i=0; i<heartPoints.m_points.length; i++)
				{	let p=heartPoints.m_points[i];
					v.x = p.x;
					v.z = p.y;
					let pWorld  = MV.M_mutlipliedByVector(v);
					shape.M_addPoint( _.M_projection( pWorld, C) );
				}

				// Create the heart dots 
				let dotsShapes;
				let _2PI = Math.PI*2;
				if( centerRadius>0.5*_.upscale)
				{
					dotsShapes=[];
					
					// create a shape for the dot
					let rDotIn = Math.max( dotRadius,centerRadius/6);
					let rDot = rDotIn+this.m_groups.HeartFeat.m_strokeWidth;
					let circ = new RQCircle(0,0,rDotIn);
					let circPts = circ.M_createPolyline(20);
					//circPts.M_rotate(-direction,new RQVec2(0,-rDotIn*1.2))
					
					// spiral
					let r=1*rDot;
                    let a=0;
                    let bumpDot = 0.4*centerRadius; // normal bump
					let distanceStamen = hasStamen ? 3*centerRadius : 0;
					let rMul=hasStamen? 1.8 : 1;

                    while(r<centerRadius)
					{	
						while(a<_2PI)
						{	
							let h = Math.cos(r/centerRadius*Math.PI/2);
							let v=new RQVec3(rMul*r*Math.cos(a), distanceStamen+bumpDot*h*h,rMul*r*Math.sin(a));
							let pWorld  = MV.M_mutlipliedByVector(v);
							let dotC = _.M_projection( pWorld, C)

							// create the dot's shape
							let dotShape = new RQPolyLine();
							for( let i=0; i<circPts.m_points.length; i++)
							{	let p=circPts.m_points[i];
								dotShape.M_addPoint( dotC.M_plus(p) );
							}
                            let dotOpt = {shape:dotShape,z:pWorld.z};
                            if( hasStamen)
                            {   let startV = new RQVec3(r*Math.cos(a), bumpDot*h*h,r*Math.sin(a))
                                let startVWorld =MV.M_mutlipliedByVector(startV); 
                                dotOpt.stamen={ 
                                    start   :  _.M_projection(startVWorld,C),
                                    end     : dotC

                                }

                            }
                            
                            dotsShapes.push(dotOpt);
							// avance to next point
							a+=2*rDot/r;
							r+=rDot/r;
						}
						while(a>0) a-=_2PI;

					}
				}	
				// render the dots
				if(dotsShapes!=undefined)
				{
					// Sort by z 
					dotsShapes.sort( function(a,b){ return a.z<b.z?1 : -1} );

					let g = this.m_groups.HeartFeat;
                    let gStamen = hasStamen? this.m_groups.Stamen : null;
                    if(gStamen&& !gStamen.m_active) gStamen=null;
					let F,Fs = g.fills;
					if(Fs) F=Fs[0]
			
					
					for(let i=0; i<dotsShapes.length; i++)
					{	let s=dotsShapes[i].shape;
						if(F&&F.m_active) _.M_fillShape(F,s,F); 
						_.M_drawLines(g,s,true);
						_.M_drawInMask(s,{protect:0});
					
                        if( hasStamen && gStamen)
                        {   let stamn = dotsShapes[i].stamen;
                            _.M_drawLines( gStamen, new RQLine(stamn.start,stamn.end),true);

                        }
                    }

				}




			}
			else
				LeafManager.M_drawLeaf(C,petal.MV, petal.opts);

		}

		// Fill the heart shape
		let F,Fs = this.m_groups.Hearts.fills; 
		if( Array.isArray(Fs))
		for( let f=0; f<Fs.length; f++)
		{	if( (F=Fs[f]) && F.m_active)
			{	F.orientation=this.random()*360;
				F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*this.random();
				_.M_fillShape(F,shape,F); 
			}
		}


		// draw the shape
		_.M_drawLines(this.m_groups.Hearts,shape,true);

		// draw in mask 
		var path = new Path2D(shape.M_getSVGPath(false));
		let maskCtx = _.m_mask.M_getContext();
		maskCtx.fillStyle = "white";
		maskCtx.fill(path);

			
		// Draw stem and leaves
		// --------------------
		leafOpts=null;
		let leafSizeFunc;
		if(hasLeaves)
		{
			leafOpts = LeafManager.M_createLeafOptions(this.m_leafShape);
			leafSizeFunc = (k)=>Math.cos(Math.PI*0.8*(k-0.5))*leafSize;
			leafOpts.stemRatio = 0;
			leafOpts.centerLine=true;
			leafOpts.bendAlpha=20+(this.random()*80);	// TEMP
			leafOpts.groups = {
				Leaves				: this.m_groups.Leaf,
				LeavesFeat			: this.m_groups.LeafFeat
			}
		}
		LeafManager.M_drawStem(stem,{leaf:leafOpts,groupStem:this.m_groups.Stem ,openAmount:90,leafSizeFunc:leafSizeFunc},C)
		
    }



};
PlantSpecies.M_register("RootsBigFlower",{ factory:SpecyBigFlower.create})
