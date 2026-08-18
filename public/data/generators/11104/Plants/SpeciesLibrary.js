class PlantSpeciesClass
{

    constructor()
    {
        let L = {}
        this.m_lib=L;
    }
    M_register(name, opts)
    {  // console.log("Registering specy : "+name);
        this.m_lib[name]=opts;

    }


    M_createFromVars(algo,vars)
    {
        //console.log("PlantSpeciesClass - M_createFromVars");
        let species=[];
        
		
		for( let is=0; is<vars.length; is++)
		{
			let Svar = vars[is];
            if( this.m_lib.hasOwnProperty(Svar.m_name))
            {
                let lib=this.m_lib[Svar.m_name];
                let factory = lib.factory?lib.factory:this.M_defaultFactory;
                let specy = factory.call(algo,Svar.m_name);
                if(specy)
                {   specy.m_variables=Svar.m_variables;
					
					/*if(specy.M_init)
                    {   specy.M_init(algo);
                    }*/
                    species.push(specy);
                }
            }
            else
            {    //console.warn("warning - plant specy "+Svar.m_name+" not registered.");
			}
        }
        return species;


    }
    M_defaultFactory(name)
    {   console.log("Default factory : "+name);
        return {};
    }

};


class SpecyDefault extends RQVariables
{

    constructor(name)
    {	super(name);
		this.m_groups={};
    }
	M_declareSvgGroup(_,tag)
	{	//console.log(`[${this.m_name}] new group "${tag}"`);
		let Gr=_.M_declareSvgGroup(this.m_name, tag);
		this.m_groups[tag]=A.M_getGroupInstance(Gr);
		//console.log("this.m_groups="+RQPrintR(this.m_groups,1));
	}
    M_init(_)
    {
		this.m_isActive = this.M_getBool("isActive",true);
        this.m_isDeformers = this.M_getBool("isDeformers",true);
        this.m_yRange = this.M_getFloat("yRange",{min:-0.5,max:1});
        this.m_isFreeUpRange = this.M_getVarOption("yRange","freeup");

		this.m_implantation = this.M_get("implantation","random");

		// zone density
		this.m_nbZones=this.M_getInt("nbZones",{min:1,max:30})
		this.m_zoneRadius=this.M_getFloat("zoneRadius",{min:2,max:10});
		this.m_zoneDensity=this.M_getFloat("zoneDensity",{min:5,max:30})




		_.M_readMinMaxVar(this,"size",_.upscale,false); 
        _.M_readMinMaxVar(this,"torsion",1,false);

        this.m_isFillStem = this.M_getBool("isFillStem",true);


        // Create group instances for this species's name  
        //if(!S.m_isObject3D)		// ( already done)
        _.M_makeBundleInstances(this,this.m_name);
        
        // SVGGroup addons 
        var addons = this.M_getVariablePack("addons","SVGGroup",true);
        for(let ia=0; ia<addons.length; ia++)
        {	
            _.M_readSvgGroupVariable(this,addons[ia]);

        }
        // Hatch addons
        addons = this.M_getVariablePack("addons",_.M_getHatchFunctionsList(),true);
        for(let ia=0; ia<addons.length; ia++)
            _.M_readHatchVariable(this,addons[ia]);

		// create a random function 
		//this.random=sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, this.M_getInt("seed",_.m_seed ));
	
	}

	M_defaultBundleLayout(_,layout)
	{

		let out=[]
		let ix=layout.ix, iz=layout.iz;
		let nbDensity = rndRange(this.m_zoneDensity,this.random);
		let r=rndRange(this.m_zoneRadius,this.random)* _.upscale*layout.map.mmtoCoord;
		for( let i=0; i<nbDensity; i++)
		{
			let a=this.random()*Math.PI*2;
			let r2 = this.random()*r;
			let ix2 = ix+Math.cos(a)*r2;
			let iz2 = iz+Math.sin(a)*r2;
			if( layout.map.isInside(ix2,iz2))
			{
				let p2 = layout.map.projected( ix2,iz2);
				if( p2)
				{	let opt={ix:ix2,iz:iz2,x:p2.x,y:p2.y, imprintRadius:2*_.upscale*layout.map.mmtoCoord}
					out.push(opt);
				}
				else 
				{	//console.log(`ix2,iz2 coord=${ix2},${iz2} FAILED`);
				}
			}
		}
	
		return out;
	}


};


// Create PlantSpecies singleton
const PlantSpecies = new PlantSpeciesClass();




//-----------
// HERB
//-----------
class SpecyHerb extends SpecyDefault
{
    constructor(name)
    {
        super(name);
    }
    // factory ( this is algo )
    static create(name)
    {
        return new SpecyHerb(name);
    }

    M_init(_)
    {
        let ups=_.upscale;

		// Declare groups
		this.M_declareSvgGroup(_,"Herb");

		_.M_readParametricVariable(this,"width",ups,false);
        this.m_ondulation       = this.M_getFloat("ondulation",{ang:35,noiseFact:5});
        this.m_LODthreshold     = 0.01*ups;
        this.m_isContour        = this.M_getBool("isContour",true);
		this.m_seg				= this.M_getFloat("segmentLength",1)*_.upscale;
		let d=this.m_nbStrands = this.M_getFloat("nbStrands",{min:1,max:3,dist:0}); {if(d){d.min=Math.floor(d.min);d.max=Math.floor(d.max); d.dist*=_.upscale; }}

		//console.log(`m_ondulation=${this.m_ondulation.ang} isContour=${this.m_isContour}`);
		
        // call default
        SpecyDefault.prototype.M_init.call(this,_);
     
        
    }

	M_bundleLayout(_,layout)
	{
        return this.M_defaultBundleLayout(_,layout);

	
	}
	M_getMaxHeight()
	{
		return this.m_size.max;
	}

	M_draw(_,opt)
    {
		this.m_groups.Herb.M_applyScale(opt.scale);

		let C=new RQVec2(opt.x,opt.y);
		var height = this.m_size.func.apply(_,[C.x,C.y,this.m_size.config] )*opt.scale;
		height*=0.8+0.4*this.random();//TEMP
		//var grassW = this.m_width.func.apply(_,[C.x,C.y,this.m_width.config] )/**opt.scale*/;
		var grassW=rndRange(this.m_width,this.random);
		//console.log(`grassW=${grassW}`);
		// adjust grassW depending on height
		if(this.m_size.max!=this.m_size.min)
		{	let diff= this.m_size.max-this.m_size.min;
			let k =  RQMaths.M_clamp((height-this.m_size.min)/diff,0,1);
			grassW*=(0.5+k*0.5);

		}

		let yRotation =  rndRange({min:-30,max:30},this.random);

		let stemOpts =
		{ 	C			: C,
			torsion		: {start:0, end: 50 },
			height		: height,
			seg 		: opt.seg,
			//widthFunc	: (l)=>Math.cos(Math.PI*RQMaths.M_clamp(l-0.7*height)/height,-0.5,0.5)*grassW
			widthFunc	: (l) =>grassW*LeafManager.M_herbProfile(l/height).x,
			//log:true 	// temp
		}
		let nbRoots = Math.round(rndRange(this.m_nbStrands,this.random));
		//var direction = this.m_torsion.func.apply(_,[opt.x,opt.y,S.m_torsion.config] ); 
		//let modFact=this.m_modulation.noiseFact;

		// rnd orientation (TEMP)
		let rndRot = this.random();
		let YRotation0 = rndRot<0.2 ? (rndRot/0.2)*360: (1.5+noise.simplex2(1*opt.x/_.W,2*opt.y/_.H))*180;	// arg
		
		
		// Create a rotation buffer to sort by Z
		let roots=[];
		let shift=[]
		for( let iR = 0; iR<nbRoots; iR++)
		{	let yRotation = YRotation0 + iR*100/nbRoots;
			let ang=this.random()*Math.PI*2;
			let radius=(iR==0)? 0:(0.3+0.8*this.random())*this.m_nbStrands.dist;
			roots.push({z:Math.sin(ang*DEGTORAD),r:yRotation,C:_.M_projection(new RQVec3(Math.cos(ang)*radius,0,Math.sin(ang)*radius),C)})
		}
		roots.sort((a,b)=>a.z<b.z?1:-1 );

		for( let iR = 0; iR<roots.length; iR++)
		{	let yRotation = roots[iR].r;
			let C2=roots[iR].C;
			stemOpts.C=C2;
			stemOpts.yRotation=yRotation;
			stemOpts.torsion.end = this.random()<0.2? 120: this.m_torsion.func.apply(_,[C2.x+20*iR/_.W,C2.y,this.m_torsion.config])*(0.85+0.3*this.random()); 
	
			var stem = LeafManager.M_getStem(stemOpts);

			if(stem.lines.length==0)
				continue;

			LeafManager.M_drawStem(stem,{groupStem:this.m_groups.Herb },C2)
		}
	}

    M_draw_old(_,opt)
    {
		var context = _.m_mask.M_getContext();			
		var sz = opt.scale; 
		this.m_groups.Herb.M_applyScale(opt.scale);

		var grassW = opt.grassW= this.m_width.func.apply(_,[opt.x,opt.y,this.m_width.config] )*opt.scale;

		var grassH = this.m_size.func.apply(_,[opt.x,opt.y,this.m_size.config] )*opt.scale;
		var segmentLength = Math.max(this.m_seg??opt.seg,1);
		var segLen =  segmentLength;
		var nbSegs = Math.ceil(grassH/segLen);
		segLen = grassH/nbSegs;
		
		let nbStrands = this.m_nbStrands.min + Math.round((this.m_nbStrands.max-this.m_nbStrands.min)*this.random());
		for(let iStrand=0; iStrand<nbStrands; iStrand++)
		{
		let strandShift = iStrand*300;
		var dirChange = this.m_torsion.func.apply(_,[opt.x+strandShift,opt.y,this.m_torsion.config] ); 
		dirChange /= (grassH/segLen); 



		let line = new RQPolyLine();
		let line2 = [];
		var direction = 0.;
		
		let C=new RQVec2(opt.x,opt.y);
		var x2=0;
		var y2=0;
		var e;
		var eMin =  Math.max(grassW/8, this.m_groups.Herb.m_strokeWidth*4); 
		var kH;
		var seg=0;
		var kInflection = 0.6;
		var kDivider = grassH*(1-kInflection); kDivider = 1 / (kDivider*kDivider);
		let isNoiseDirection = this.m_ondulation.ang!=0; 
		let noiseDir=0;
		for( let iSeg = 0; iSeg<=nbSegs; iSeg++,seg+=segLen, direction+=dirChange)
		{
			kH = seg/grassH;
			// e= eMin + (grassW-eMin) * Math.cos(-Math.PI/2 + kH*Math.PI);
			let mul  = Math.max(0,(1-(seg-grassH*kInflection)*(seg-grassH*kInflection)*kDivider ));
			e= grassW *mul ;
			
			if( isNoiseDirection)
			{	noiseDir = this.m_ondulation.ang*noise.simplex2( (opt.x+strandShift*mul)/_.W,opt.y+seg/_.H*this.m_ondulation.noiseFact/sz);
			}
			if( iSeg<nbSegs/2)
				e= Math.max(e,eMin);

			let I = new RQVec2(Math.cos((direction+noiseDir)*DEGTORAD),Math.sin((direction+noiseDir)*DEGTORAD));
			let J = new RQVec2( I.y,I.x );
			if( seg>0)
			{
			   x2+=J.x*segLen;
			   y2+=J.y*segLen;
			}
			var p = new RQVec3(x2-I.x*e/2,y2-I.y*e/2,0);
			line.M_addPoint( _.M_projection(p,C));
			if( iSeg<nbSegs)
				line2.push( _.M_projection(new RQVec3(x2+I.x*e/2,y2+I.y*e/2,0),C));

		
		}

		// merge lines
		const mergeLines = ()=>{
			let p2;
			while(p2=line2.pop())
			{	line.M_addPoint(p2);						
			}
		}
		let isTooThin = grassW< this.m_LODthreshold ;
		if( !isTooThin)
			mergeLines();
		if( this.m_isContour)
		{	
			_.M_drawLines(this.m_groups.Herb, line,true);
		}
		if( isTooThin)
			mergeLines();
	
		// Hatching herb with H group			
		let Fs = this.m_groups.Herb.fills; 
		let F;
		if( Array.isArray(Fs))
		{
			for(let iF=0; iF<Fs.length; iF++)
			{
				if( (F =Fs[iF]) && F.m_active)
				{	F.orientation=direction / 2+90; //this.random()*180;
					F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*this.random();
					_.M_fillShape(F,line,F); 

				}
			}
		}
	
		
		
		// draw the herb in the mask
		let path = new Path2D(line.M_getSVGPath(true));
		{	
			context.fillStyle = "white";
			context.fill(path);
			if( _.m_isShortenJunctions)
			{	context.lineWidth = _.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(path);
			}
		}
	} // end strands loop


    }
};
PlantSpecies.M_register("RootsHerb",{ factory:SpecyHerb.create})


//-----------
// SUNFLOWER
//-----------
class SpecySunflower extends SpecyDefault
{
    constructor(name)
    {
        super(name);
    }
    // factory ( this is algo )
    static create(name)
    {
        return new SpecySunflower(name);
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


		_.M_readParametricVariable(this,"height",ups,false);
		this.m_nbPetals = this.M_getInt("nbPetals",20);
		this.m_isDrawHeart = this.M_getBool("isDrawHeart",true);
		this.m_coreRadius = this.M_getFloat("coreRadius",0.32);
		_.M_readParametricVariable(this,"viewerOrientation",1,false);
		this.m_stemWidth= this.M_getFloat("stemWidth")*ups;
		this.m_stemSegment= this.M_getFloat("stemSegment",{min:10,max:10}); this.m_stemSegment.min*=ups;this.m_stemSegment.max*=ups;	
		_.M_readParametricVariable(this,"yRotation",1,false);
		
		this.m_leafOrganize = this.M_getFloat("leafOrganize",{nb:2,shiftDeg:90,seg:5,kStart:0.2,kEnd:0.6});
		this.m_leafOrganize.nb=parseInt(this.m_leafOrganize.nb);
		this.m_leafOrganize.seg*=ups;



        // call default
        SpecyDefault.prototype.M_init.call(this,_);
     
        
    }
	M_getMaxHeight()
	{
		return rndRange(this.m_size,()=>0.9);
	}
    M_draw(_,opt)
    {
		this.m_groups.Hearts.M_applyScale(opt.scale);
		this.m_groups.Stem.M_applyScale(opt.scale);
		this.m_groups.Petals.M_applyScale(opt.scale);
		this.m_groups.Leaf.M_applyScale(opt.scale);
		this.m_groups.LeafFeat.M_applyScale(opt.scale);
		this.m_groups.HeartFeat.M_applyScale(opt.scale);


		let C=new RQVec2(opt.x,opt.y);
		var height = this.m_height.func.apply(_,[opt.x,opt.y,this.m_height.config] )*opt.scale;
		var leafSize = this.m_size.func.apply(_,[opt.x,opt.y,this.m_size.config] )*opt.scale;

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

		// Draw sunflower
		let flowerRadius = leafSize*0.5;
		let centerRadius = flowerRadius*0.9;
		let centerRadiusLeaf=centerRadius*0.95;
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
		leafOpts.leafSize = flowerRadius;			
		leafOpts.groups = {
			Leaves				: this.m_groups.Petals,
			LeavesFeat			: this.m_groups.Features
		}
		let rot=360/this.m_nbPetals;
		let n=this.m_nbPetals*2;
		let nHalf =this.m_nbPetals;
		let incl = 35;
		let petals=[];
		let zero=new RQVec3(0,0,0);
		for( let ip= 0; ip<n; ip++)
		{
			leafOpts.bendAlpha = 90*this.random();	//TEMP
			MV.M_rotate(rot,0,1,0);
			stack.push(MV.clone());
			MV.M_translate(0,0,centerRadiusLeaf);
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
					let rDotIn = Math.max(0.2*_.upscale,centerRadius/14);
					let rDot = rDotIn+this.m_groups.HeartFeat.m_strokeWidth;
					let circ = new RQCircle(0,0,rDotIn,rDotIn*1.5);
					let circPts = circ.M_createPolyline(20);
					circPts.M_rotate(-direction,new RQVec2(0,-rDotIn*1.2))
					
					// spiral
					let r=1*rDot;
					let a=0;
					while(r<centerRadius)
					{	
						while(a<_2PI)
						{	
							let h = Math.cos(r/centerRadius*Math.PI/2);
							let v=new RQVec3(r*Math.cos(a), 0.4*centerRadius*h*h,r*Math.sin(a));
							let pWorld  = MV.M_mutlipliedByVector(v);
							let dotC = _.M_projection( pWorld, C)

							// create the dot's shape
							let dotShape = new RQPolyLine();
							for( let i=0; i<circPts.m_points.length; i++)
							{	let p=circPts.m_points[i];
								dotShape.M_addPoint( dotC.M_plus(p) );
							}
							dotsShapes.push({shape:dotShape,z:pWorld.z});
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
					let F,Fs = g.fills;
					if(Fs) F=Fs[0]
			
					
					for(let i=0; i<dotsShapes.length; i++)
					{	let s=dotsShapes[i].shape;
						if(F&&F.m_active) _.M_fillShape(F,s,F); 
						_.M_drawLines(g,s,true);
						_.M_drawInMask(s,{protect:0});
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
		leafOpts = LeafManager.M_createLeafOptions("Mint");
		let leafSizeFunc = (k)=>Math.cos((k-0.5))*leafSize;
		leafOpts.stemRatio = 0;
		leafOpts.centerLine=true;
		leafOpts.bendAlpha=20+(this.random()*80);	// TEMP
		leafOpts.groups = {
			Leaves				: this.m_groups.Leaf,
			LeavesFeat			: this.m_groups.LeafFeat
		}
		LeafManager.M_drawStem(stem,{leaf:leafOpts,groupStem:this.m_groups.Stem ,openAmount:90,leafSizeFunc:leafSizeFunc},C)
		
		

    }



};
PlantSpecies.M_register("RootsSunflower",{ factory:SpecySunflower.create})


//-----------
// FERN
//-----------
class SpecieFern extends SpecyDefault
{
    constructor(name)
    {
        super(name);
    }
    // factory
    static create(name)
    {
        return new SpecieFern(name);
    }

    M_init(_)
    {
		// Declare groups
		this.M_declareSvgGroup(_,"Leaf");
		this.M_declareSvgGroup(_,"Stem");

		_.M_readParametricVariable(this,"height",_.upscale,false);

		this.m_isDrawHeart = this.M_getBool("isDrawHeart",true);
		this.m_viewerOrientation = this.M_getFloat("viewerOrientation");
		this.m_stemWidth= this.M_getFloat("stemWidth")*_.upscale;
		this.m_stemSegment= this.M_getFloat("stemSegment",{min:10,max:10}); this.m_stemSegment.min*=_.upscale;this.m_stemSegment.max*=_.upscale;	
		this.m_kStart = this.M_getFloat("kStart",0);
		this.m_leafSize  = this.M_getFloat("leafSize",{min:4,max:8,k:1,pow:1.5}); this.m_leafSize.min*=_.upscale; this.m_leafSize.max*=_.upscale;
		let d=this.m_nbRoots = this.M_getFloat("nbRoots",{min:2,max:5,dist:10}); {if(d){d.min=Math.floor(d.min);d.max=Math.floor(d.max); d.dist*=_.upscale; }}

		this.m_modulation = this.M_getFloat("modulation",{amplitude:0.3,noiseFact:1});
		this.m_leafShape= this.M_get("leafShape","-");

        // call default
        SpecyDefault.prototype.M_init.call(this,_);

	}
	M_bundleLayout(_,layout)
	{
        return this.M_defaultBundleLayout(_,layout);	
	}
	M_getMaxHeight()
	{
		return this.m_height.max;
	}

	M_draw(_,opt)
    {
		var sz = opt.scale;
		let S=this;
		this.m_groups.Stem.M_applyScale(opt.scale);
		this.m_groups.Leaf.M_applyScale(opt.scale);




		var C = new RQVec2(opt.x,opt.y);
		
		// Make a leaf
		let isDefaultLeaf = (!S.m_leafShape) || S.m_leafShape=='-';

		let rLeaf= S.m_leafSize;
		let nbPoints = 30*(0.5+0.5*sz);
		let aInc = 2*Math.PI/nbPoints;
		let a=-Math.PI;
		let leafShape=[];
		for( let i=0; i<=nbPoints; i++)
		{
			leafShape.push(new RQVec2(2*Math.pow(0.5*(1+Math.cos(a)),rLeaf.pow),Math.sin(a)));
			a+=aInc;
		}

		let radiusFunc = function(y,min,max){return min+(1-Math.pow(y,2))*(max-min) }
		let nbRoots = Math.round(rndRange(S.m_nbRoots,S.random));
		//var direction = this.m_torsion.func.apply(_,[opt.x,opt.y,S.m_torsion.config] ); 
		let modFact=S.m_modulation.noiseFact;

		let YRotation0 = this.random()*360;
		// Create a rotation buffer to sort by Z
		let roots=[];
		for( let iR = 0; iR<nbRoots; iR++)
		{	let yRotation = YRotation0 + iR*360/nbRoots;
			let ang=this.random()*Math.PI*2;
			let radius=iR==0? 0:(0.2+0.8*this.random())*this.m_nbRoots.dist;
			roots.push({z:Math.sin(ang*DEGTORAD),r:yRotation,C:_.M_projection(new RQVec3(Math.cos(ang)*radius,0,Math.sin(ang)*radius),C)})
		}
		roots.sort((a,b)=>a.z<b.z?1:-1 );

		for( let iR = 0; iR<roots.length; iR++)
		{	let yRotation = roots[iR].r;
			let C2=roots[iR].C;
			//let height = this.m_height.func.apply(_,[opt.x,opt.y,S.m_height.config] )*opt.scale;
			let height = this.m_height.min+(this.m_height.max-this.m_height.min)*this.random()*opt.scale;
			
			// generate stem with sampling 
			let segmentLength = S.m_stemSegment.min + (S.m_stemSegment.max-S.m_stemSegment.min)*S.random();
			segmentLength*=opt.scale;
			let e =S.m_stemWidth*0.5*0.4; 
			//var stemLines = LeafManager.M_getStem(opt,0,dir2,height,S.m_stemWidth);
			let stemOpts =
				{ 	C			: C2,
					yRotation 	: yRotation,
					torsion		: {start:5, end: this.m_torsion.min+(this.m_torsion.max-this.m_torsion.min)*this.random() },
					height		: height,
					seg 		: opt.seg,
					samples 	: {seg: segmentLength, start:this.m_kStart*height},
					width		: S.m_stemWidth*opt.scale
				}
			var stemLines = LeafManager.M_getStem(stemOpts);
			if(stemLines.lines.length==0)
				break;

			let context = _.m_mask.M_getContext();

			const C0=new RQVec2(0,0);
			let lighting = S.random();
			if( stemLines.samples)
			{	
				// add a sample at the tip
				/*{	var end = stemLines.end;
					let endDir = stemLines.direction;
					
					var endIDir = new RQVec2(Math.cos(endDir*DEGTORAD),Math.sin(endDir*DEGTORAD));
				 	var endJDir = new RQVec2(-endIDir.y,endIDir.x);
					stemLines.samples.push({I:endIDir, J:endJDir, P:end,l:height});
				}*/
				let side=1;
				if(stemLines.isForwardFacing)
					stemLines.samples.reverse();
				for( let is=0; is<stemLines.samples.length; is++)
				{
					let sample = stemLines.samples[is];

					let r = radiusFunc(sample.l/height, rLeaf.min,rLeaf.max)*0.5*opt.scale;
					let modAmp=S.m_modulation.amplitude*r;

					if(isDefaultLeaf)
					{
						let C3 = _.M_projection(sample.P,C2);
						let L = new RQPolyLine();
						let pLocal=new RQVec3();
						for(let i=0; i<=nbPoints; i++)
						{	let r1=r;
							let leaf= leafShape[i];
							if(modAmp!=0)
							{	let ang=Math.PI*2*i/nbPoints;
								let rnd = 0.5*(1+noise.simplex2(C3.x+Math.cos(ang)*modFact,C3.y+Math.sin(ang)*modFact)); 
								r1-= modAmp*rnd;
							}
							let x = side*(e+leaf.x*r1);
							let y = leaf.y*r1*rLeaf.k;
							if( sample.I)
							{	
								
								pLocal.M_set( sample.I.x*x+sample.J.x*y, sample.I.y*x+sample.J.y*y,0);
								L.M_addPoint( _.M_projection(pLocal,C3));
							}
						}
							

						
						_.M_drawLines(S.m_groups.Leaf,L, true);

						// Fill leaf
						let Fs = S.m_groups.Leaf.fills; 
						let F;
						if( Array.isArray(Fs))
						{
							for( let f=0; f<Fs.length; f++)
							{
								if( (F=Fs[f]) && F.m_active)
								{	F.orientation=  this.random()*180; /*TEMP*/ //Math.atan2(sample.I.y,sample.I.x)/DEGTORAD;
									F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*lighting;
									_.M_fillShape(F,L,F); 
								
								}
							}
						}
					
						// draw leaf in mask
						_.M_drawInMask(L);
					} else
					{
						// TODO, in a very different way  ( 3D ... )
						let leafOpts = LeafManager.M_createLeafOptions(S.m_leafShape);
						leafOpts.leafSize = 2*r;
			
			
						leafOpts.groups = {
							Leaves				: S.m_groups.Leaf,
							Stem				: S.m_groups.Stem	
						}
						let MV=new RQMatrix4();
						//MV.M_setBase(sample.I,sample.J,sample.I.M_cross(sample.J));
						
						MV.M_rotate(45,0,1,0);
						LeafManager.M_drawLeaf(sample.P,MV, leafOpts);

					}
					
					side=-side;

				}
			}

			// draw the stem
			for( let il=0; il<stemLines.lines.length; il++)
			{	_.M_drawLines(S.m_groups.Stem ,stemLines.lines[il],true) 
			}
			// draw the stem in mask
			if( stemLines.shape)
			{	// draw in mask
				_.M_drawInMask(stemLines.shape);
				
				// TODO fill shape
			}
			//C.M_add(2*4*(this.random()-0.5)*S.m_stemWidth*opt.scale,2*4*(this.random()-0.5)*S.m_stemWidth*opt.scale*_.m_perspectiveFactor);
			
		}	
	
	
	}
};
PlantSpecies.M_register("RootsFern",{ factory:SpecieFern.create});


//-----------
// GENERIC FLOwER
//-----------
class SpecieFlower extends SpecyDefault
{
    constructor(name)
    {
        super(name);
    }
    // factory ( this is algo )
    static create(name)
    {
        return new SpecieFlower(name);
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


		_.M_readParametricVariable(this,"height",ups,false);
		this.m_nbPetals = Math.max(this.M_getInt("nbPetals",10),3);
		this.m_isDrawHeart = this.M_getBool("isDrawHeart",true);
		this.m_coreRadius = this.M_getFloat("coreRadius",0.32);
		_.M_readParametricVariable(this,"viewerOrientation",1,false);
		this.m_stemWidth= this.M_getFloat("stemWidth")*ups;
		this.m_stemSegment= this.M_getFloat("stemSegment",{min:10,max:10}); this.m_stemSegment.min*=ups;this.m_stemSegment.max*=ups;	
		_.M_readParametricVariable(this,"yRotation",1,false);
		
		this.m_leafOrganize = this.M_getFloat("leafOrganize",{nb:2,shiftDeg:90,seg:5,kStart:0.2,kEnd:0.6});
		this.m_leafOrganize.nb=parseInt(this.m_leafOrganize.nb);
		this.m_leafOrganize.seg*=ups;
		this.m_leafShape = this.M_get("leafShape","None");
		this.m_leafSizeRatio = this.M_getFloat("leafSizeRatio",0.5);


        // call default
        SpecyDefault.prototype.M_init.call(this,_);
     
        
    }

    M_draw(_,opt)
    {
		this.m_groups.Hearts.M_applyScale(opt.scale);
		this.m_groups.Stem.M_applyScale(opt.scale);
		this.m_groups.Petals.M_applyScale(opt.scale);
		this.m_groups.Leaf.M_applyScale(opt.scale);
		this.m_groups.LeafFeat.M_applyScale(opt.scale);
		this.m_groups.HeartFeat.M_applyScale(opt.scale);


		let C=new RQVec2(opt.x,opt.y);
		var height = this.m_height.func.apply(_,[opt.x,opt.y,this.m_height.config] )*opt.scale;
		var flowerSize = this.m_size.func.apply(_,[opt.x,opt.y,this.m_size.config] )*opt.scale;
		let leafSize = this.m_leafSizeRatio*flowerSize;
		var hasLeaves = this.m_leafShape && this.m_leafShape!="None"
		var direction = this.m_torsion.func.apply(_,[opt.x,opt.y,this.m_torsion.config] );
		//let viewerOrientation = this.m_viewerOrientation.func.apply(_,[opt.x,opt.y,this.m_viewerOrientation.config] );
		let yRotation= 90+ (this.m_yRotation.func? this.m_yRotation.func.apply(_,[opt.x,opt.y,this.m_yRotation.config] ) : 0);
		// generate stem with sampling 
		let stemOpts =
		{ 	C			: C,
			yRotation 	: yRotation,
			torsion		: {start:0, end: direction },
			height		: height,
			seg 		: opt.seg,
			samples 	: hasLeaves?{seg: this.m_stemSegment.min + (this.m_stemSegment.max-this.m_stemSegment.min)*this.random(), start:0.3*height}:null,
			width		: this.m_stemWidth*opt.scale
		}
		var stem = LeafManager.M_getStem(stemOpts);

		//stemOpts.fillStem = this.m_isFillStem;
		if(stem.lines.length==0)
			return;
		
		
		C = stem.end;

		// Draw flower
		let endPetalRadius = flowerSize*0.5;		// 
		let centerRadius = endPetalRadius*0.3;		// TODO
		let startRadiusPetal=centerRadius*0.95;
		let nbPetalRows = 1;
		var stack = [];
		let MV;
		if(stem.endSample)
			MV= stem.endSample.MV;
		else 
		{	MV=new RQMatrix4();
			MV.M_rotate(direction,0,0,1);
			MV.M_rotate(30,1,0,0);
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
		let n=this.m_nbPetals*nbPetalRows;
		let nHalf =this.m_nbPetals;
		let incl = 35;
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

PlantSpecies.M_register("RootsFlower",{ factory:SpecieFlower.create});




