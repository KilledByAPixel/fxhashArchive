class GrassAlgorithm extends PatternAlgorithm
{
	constructor(name)
	{
		if( name==undefined)
			name = "Grass";
		super(name);
		this.svg=null;
		
	}

	// Declares all the groups that a sketch can contain
	VM_declareSvgGroups()
	{
		this.M_log("M_declareSvgGroups GrassAlgorithm");
		this.M_declareSvgGroup('GrassHerb'		, "HerbHatches");
		this.M_declareSvgGroup('GrassHerb'		, "Herb");
		this.M_declareSvgGroup('GrassDandelion'	, "Dandelion");
		this.M_declareSvgGroup('GrassDandelion'	, "DandelionFlower");
		this.M_declareSvgGroup('GrassClover'	, "CloverFill");
		this.M_declareSvgGroup('GrassClover'	, "CloverStem");
		this.M_declareSvgGroup('GrassClover'	, "Clover");

		this.M_declareSvgGroup('GrassDaisy'		, "DaisyHearts");
		this.M_declareSvgGroup('GrassDaisy'		, "DaisyStem");
		this.M_declareSvgGroup('GrassDaisy'		, "DaisyPetals");
		this.M_declareSvgGroup('GrassPoppy'		, "PoppyHearts");
		this.M_declareSvgGroup('GrassPoppy'		, "PoppyStem");
		this.M_declareSvgGroup('GrassPoppy'		, "PoppyPetals");
		this.M_declareSvgGroup('GrassMint'		, "MintLeaf");
		this.M_declareSvgGroup('GrassMint'		, "MintStem");
		this.M_declareSvgGroup('GrassMint'		, "MintFeatures");
		this.M_declareSvgGroup('GrassObject3D'	, "Faces");
		this.M_declareSvgGroup('GrassObject3D'	, "EdgesFlat");
		this.M_declareSvgGroup('GrassObject3D'	, "Edges");
		this.M_declareSvgGroup('TreeGrass'		, "Branches");
		this.M_declareSvgGroup('TreeGrass'		, "Fruits");
		this.M_declareSvgGroup('TreeGrass'		, "Leaves");
		this.M_declareSvgGroup('GrassFern'		, "FernStem");
		this.M_declareSvgGroup('GrassFern'		, "FernLeaf");
		this.M_declareSvgGroup('IvyGrass'		, "Branches");
		this.M_declareSvgGroup('IvyGrass'		, "Leaves");
		this.M_declareSvgGroup('IvyGrass'		, "LeavesFeat");
		this.M_declareSvgGroup('IvyGrass'		, "LeavesStem");
		this.M_declareSvgGroup('GrassObject3D'	, "Branches");
		this.M_declareSvgGroup('GrassObject3D'	, "Leaves");
		this.M_declareSvgGroup('GrassObject3D'	, "LeavesFeat");
		this.M_declareSvgGroup('GrassObject3D'	, "LeavesStem");
		this.M_declareSvgGroup(''				, "Background");
		this.M_declareSvgGroup('',"Debug", true, {m_strokeWidth:1, m_strokeColor:"red",m_paletteTag:"custom"});
		this.M_declareSvgGroup('',"Sky", true, {m_strokeWidth:1, m_strokeColor:"black",m_paletteTag:"custom"});
		
		
	}

	M_init(isAutorun)
	{
		
		this.svg= this.M_makeObjectSVG( "mainSVG",this.W,this.H );
		
		this.M_log("upscale = "+this.upscale);
		this.M_log("seed = "+this.m_seed);


		this.M_createMaskCanvas();
		this.M_createClipCanvas();
		this.m_isUseMask=this.M_getBool("isUseMask");
		this.M_getAnimationParameters();
	
		// SVG
		this.M_getSvgProperties();
		var style= this.M_getStyleAsString();
		//this.svg.append(	this.M_makeDefaultSvgGroup("0",style) );
		this.M_declareSvgGroups();








		this.M_initVariables().then( ()=>
		{
				if(isAutorun && !this.m_isAnimation)
					this.M_startAlgorithm();		
		
		});
		this.M_applyArtwork(this.M_getHTML());
		this.M_applyPaperColor();

		this.M_showWorkCanvases();
		
	}
	async M_initVariables()
	{
		// textures 
		await this.M_createTextures();
	

		this.m_maskUnderneathHerb = true;

		this.m_depthScaleFactor = this.M_getFloat("depthScaleFactor",1.0);
		this.m_yStart = this.M_getFloat("yStart",-20);	this.m_yStart*=this.upscale;
		this.m_yFracStop = this.M_getFloat("yFracStop",1);	

		this.m_herbSpacing = this.M_getFloat("herbSpacing",8)*this.upscale;
		this.m_protectionStrokeWidth = this.M_getFloat("protectionStrokeWidth",0.1)*this.upscale;
		this.m_isShortenJunctions = this.m_protectionStrokeWidth >= 1; 			// Shorter lines at junctions, to avoid overlapping when printing
		this.m_isGlobalFuncDensity = this.M_getBool("isGlobalFuncDensity",false);
		this.m_isGlobalDensityInverted = this.M_getBool("isGlobalDensityInverted",false);
		this.m_isRelief = this.M_getBool("relief",false);
		this.m_reliefParam = this.M_getFloat("reliefParam",{ ampl:27,noiseFact:1.5,noiseShift:0,isScale:0});

		this.m_globalFuncScale = this.M_getFloat("globalFuncScale",1.0);
		this.m_strokeBackground = this.M_getFloat("strokeBackground",0)*this.upscale;
		if( this.m_strokeBackground)
			this.m_maskUnderneathHerb = false;
		this.m_isMustEraseFirst = true;

		// SPECIES values
		this.M_initSpeciesVariables();


		this.m_background = this.M_get("background");
		for( let i=0; i<this.m_background.length; i++)
		{ 	let S = this.m_background[i];
			S.m_isActive = S.M_getBool("activate",false);
			if(S.m_isActive)
			{
				if(S.m_name=="BackgroundArt")
					this.M_includeArtwork(S,S.m_variables.artwork);
				else if(S.m_name=="BackgroundGradient")
				{
					this.M_log("Ok we got gradient");
					S.m_gradient = new RQColor(S.M_get("css","linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);"));
				}	
			}
		}
		
	
	}
	M_initSpeciesVariables(vars)
	{
		if(vars===undefined)
			vars = this;
		this.m_segLength= 2*this.upscale;
		this.m_species = vars.M_get("species");
		for( let is=0; is<this.m_species.length; is++)
		{
			let S = this.m_species[is];
			if( S.m_name=="GrassHerb")
			{
				S.m_isHerb = true;
				this.M_readParametricVariable(S,"width",this.upscale,false); 			
				S.m_ondulation = S.M_getFloat("ondulation",{ang:35,noiseFact:5});


				S.m_LODthreshold = S.M_getFloat("LODthreshold",1.2)*this.upscale;
				S.m_isContour = S.M_getBool("isContour",true);
				S.m_isProtectMaskUnderneath = S.M_getBool("isProtectMaskUnderneath",true);						
			}
			else if( S.m_name=="GrassDandelion")
			{ 
				S.m_isDandelion = true;
				
				S.m_flowerDiameter= S.M_getFloat("flowerDiameter");
				S.m_flowerDiameter.min*=this.upscale; S.m_flowerDiameter.max *=this.upscale;
				S.m_stemWidth= S.M_getFloat("stemWidth")*this.upscale;
				S.m_isHatchLeaves = S.M_getBool("isHatchLeaves",false);

			}
			else if( S.m_name=="GrassClover")
			{	
				S.m_isClover = true;
				this.M_readParametricVariable(S,"height",this.upscale,false); 			
				S.m_stemWidth= S.M_getFloat("stemWidth")*this.upscale;
				S.m_leafShape= S.M_get("leafShape","Clover");
				S.m_nbLeaves = S.M_getInt("nbLeaves",{min:3,max:3});
				S.m_heartShape = S.M_getFloat("heartShape",{min:0,max:0.18});
			}
			else if( S.m_name=="GrassDaisy")
			{	
				S.m_isDaisy = true;
				this.M_readParametricVariable(S,"height",this.upscale,false); 			
				S.m_isDrawHeart = S.M_getBool("isDrawHeart",true);
				S.m_viewerOrientation = S.M_getFloat("viewerOrientation");
				S.m_stemWidth= S.M_getFloat("stemWidth")*this.upscale;
				
			}
			else if( S.m_name=="GrassPoppy")
			{	
				S.m_isPoppy = true;
				this.M_readParametricVariable(S,"height",this.upscale,false); 			
				S.m_isDrawHeart = S.M_getBool("isDrawHeart",true);
				S.m_viewerOrientation = S.M_getFloat("viewerOrientation");
				S.m_stemWidth= S.M_getFloat("stemWidth")*this.upscale;
				
			}
			else if( S.m_name=="GrassMint")
			{	
				S.m_isMint = true;
				this.M_readParametricVariable(S,"height",this.upscale,false); 			
				S.m_viewerOrientation = S.M_getFloat("viewerOrientation");
				S.m_stemWidth= S.M_getFloat("stemWidth")*this.upscale;
				S.m_stemSegment= S.M_getFloat("stemSegment",{min:10,max:10}); S.m_stemSegment.min*=this.upscale;S.m_stemSegment.max*=this.upscale;	
				S.m_leafShape= S.M_get("leafShape","Mint");
				S.m_leafOrganize = S.M_getFloat("leafOrganize",{nb:2,shiftDeg:90}); S.m_leafOrganize.nb=parseInt(S.m_leafOrganize.nb);
				S.m_stemKStart = S.M_getFloat("kStart",0);
				S.m_sizeFunc = S.M_get("sizeFunc","Straight");

			}
			else if( S.m_name=="GrassFern")
			{	
				S.m_isFern = true;
				this.M_readParametricVariable(S,"height",this.upscale,false); 			
				S.m_isDrawHeart = S.M_getBool("isDrawHeart",true);
				S.m_viewerOrientation = S.M_getFloat("viewerOrientation");
				S.m_stemWidth= S.M_getFloat("stemWidth")*this.upscale;
				S.m_stemSegment= S.M_getFloat("stemSegment",{min:10,max:10}); S.m_stemSegment.min*=this.upscale;S.m_stemSegment.max*=this.upscale;	
				S.m_leafSize  = S.M_getFloat("leafSize",{min:4,max:8,k:1,pow:1.5}); S.m_leafSize.min*=this.upscale; S.m_leafSize.max*=this.upscale;
				S.m_nbRoots= S.M_getInt("nbRoots",{min:2,max:5});
				S.m_modulation = S.M_getFloat("modulation",{amplitude:0.3,noiseFact:1});

				
			}
			else if( S.m_name=="TreeGrass")
			{	
				S.m_isTree = true;
				this.M_readParametricVariable(S,"height",this.upscale,false); 			
				S.m_viewerOrientation = S.M_getFloat("viewerOrientation");
				S.m_maxLevel  = S.M_getInt("maxLevel",{min:1,max:4});
				S.m_branchAngle  = S.M_getFloat("branchAngle",{min:20,max:40});
				S.m_e = 		S.M_getFloat("e",{root:2,min:0.2,length:0.8,branch:0.8});
				S.m_modulation = S.M_getFloat("branchModul",{amplitude:0,noiseFact:1});
				S.m_leafShape= S.M_get("leafShape","None");
				S.m_leafDistrib= S.M_get("leafDistrib",{rnd:0.1,height:0.5,level:0,nb:1});			// left refers to the last level, 1 to the last leve-1, etc
				S.m_isLeaves = S.m_leafShape && S.m_leafShape!="None";
				S.m_fillH		= S.M_getFloat("fillH",0);
				S.m_isFruits = S.M_getBool("isFruits",false);
				S.m_fruitSize = S.M_getFloat("fruitSize",{min:2,max:2}); for(let a in S.m_fruitSize) S.m_fruitSize[a]*=this.upscale;
				S.m_fruitStem	= S.M_getFloat("fruitStem",{length:0,e:0.3}); S.m_fruitStem.length*=this.upscale;S.m_fruitStem.e*=this.upscale;
				S.m_fruitDistrib= S.M_get("fruitDistrib",{rnd:0.01,height:0.5,level:0,nb:1});			// left refers to the last level, 1 to the last leve-1, etc
				this.M_readParametricVariable(S,"fruitRnd",1,false);
				S.m_intermediateBranch = S.M_getFloat("intermediateBranches",{rnd:0.1,height:0,level:0,newLevel:1});

			}
			else if( S.m_name=="IvyGrass")
			{	
				S.m_isIvy = true;
				this.M_readParametricVariable(S,"height",this.upscale,false); 			
				this.M_readParametricVariable(S,"leafsize",this.upscale,false); 

			}
			else if( S.m_name=="GrassObject3D")
			{	
				S.m_isObject3D = true;
				S.m_objShape = S.M_get("objShape","Cube");
				//$(`[name=${S.M_getVarName["objShape"]}`).parents('.panel2').first();
			
				S.m_isCutGround = S.M_getBool("isCutGround",true);
				this.M_readParametricVariable(S,"height",this.upscale,false); 			
				this.M_readParametricVariable(S,"rotation",1,false); 			
				S.m_segmentHeight = S.M_getFloat("segmentHeight",100)*this.upscale;
				S.m_edgeAngleLimit = S.M_getFloat("edgeAngleLimit",0);
				S.m_segEdges = S.M_getFloat("segEdges",{seg:0,ampl:0,fact:1}); if(S.m_segEdges){S.m_segEdges.seg*=this.upscale;S.m_segEdges.ampl*=this.upscale; }
				
				this.M_makeBundleInstances(S,S.m_name);

				// Ivy add-on for objects
				let addons = S.M_getVariablePack("addons","IvyObjectAddon",true);
				if( addons.length)
					S.m_ivy=[];
				for(let ia=0; ia<addons.length; ia++)
				{	
					let Ivy = addons[ia];
					S.m_ivy.push(Ivy);
					Ivy.m_isActive = Ivy.M_getBool("isActive",true);
					Ivy.m_isDeformers = Ivy.M_getBool("isDeformers",true);
					Ivy.m_maxLevel = Ivy.M_getInt("maxLevel",{min:2,max:4});
					Ivy.m_nbTrees = Ivy.M_getInt("nbTrees",{min:1,max:1});
					Ivy.m_leafShape= Ivy.M_get("leafShape","None");
					Ivy.m_allLeavesFront = Ivy.M_getBool("allLeavesFront",true);
					Ivy.m_groups = S.m_groups;
					this.M_readParametricVariable(Ivy,"height",this.upscale,false); 			
					this.M_readParametricVariable(Ivy,"leafsize",this.upscale,false); 

					// Create group instances for this species's name  
					
					// SVGGroup addons 
					let addons2 = Ivy.M_getVariablePack("addons","SVGGroup",true);
					for(let ib=0; ib<addons2.length; ib++)
					{	
						this.M_readSvgGroupVariable(Ivy,addons2[ib]);
					}
					// Hatch addons
					addons2 = Ivy.M_getVariablePack("addons",this.M_getHatchFunctionsList(),true);
					for(let ib=0; ib<addons2.length; ib++)
						this.M_readHatchVariable(Ivy,addons2[ib]);


				}

			}
			else if( S.m_name=='GrassIncludeArtwork')
			{
				S.m_isAlgorithm 	= true;
				S.m_isSpecialSpecies = true;
				S.m_maxCalls 	 = 1;
				S.m_isActive 	= S.M_getBool("isActive",true);
				S.m_isDeformers = S.M_getBool("isDeformers",true);
				var art = S.m_variables.artwork;
				let yStart = S.M_get("yStart","default");

				if( art )
				{
					this.M_includeArtwork(S,art);
					if( yStart !="default" )
					{	let f= parseFloat(yStart);
						if(S.A)
						{	S.A.m_yStart = f*this.upscale;
							S.A.m_isDeformers = S.m_isDeformers;
						}
					}
					
				}
				var me=this;
				//S.onAlgorithmList = function(s,err){ me.M_log("Got response from Ajax="+s);};
				//var algorithmName = S.M_get("algorithmName");
				//	RQSiteAdminAjaxCallPlugin("ListAlgorithms","action=getArtworkList&algorithmName="+algorithmName,"onAlgorithmList",S);

			}
			else if( S.m_name=='GrassMask')
			{
				S.m_isSpecialSpecies = true;
				S.m_isMask = true;
				S.m_imagePath = S.M_getPath("image");
				S.m_yStart = S.M_get("yStart",0);	S.m_yStart*=this.upscale;
				S.m_maxCalls 	 = 1;
				S.m_isActive 	= S.M_getBool("isActive",true);

			}
			// Common to species
			// -----------------	
			if( !S.m_isSpecialSpecies)
			{
				

		
				S.m_isActive = S.M_getBool("isActive",true);
				S.m_isDeformers = S.M_getBool("isDeformers",true);
				S.m_yRange = S.M_getFloat("yRange",{min:-0.5,max:1});
		   	    S.m_isFreeUpRange = S.M_getVarOption("yRange","freeup");

				this.M_readParametricVariable(S,"density",0.01,false); 
				this.M_readParametricVariable(S,"size",this.upscale,false); 
				S.m_spacing		= S.M_get("spacing"); S.m_spacing.min *= this.upscale; S.m_spacing.max *= this.upscale;
				this.M_readParametricVariable(S,"torsion",1,false);

				S.m_isFillStem = S.M_getBool("isFillStem",true);

		
				// Create group instances for this species's name  
				if(!S.m_isObject3D)		// ( already done)
					this.M_makeBundleInstances(S,S.m_name);
				
				// SVGGroup addons 
				var addons = S.M_getVariablePack("addons","SVGGroup",true);
				for(let ia=0; ia<addons.length; ia++)
				{	
					this.M_readSvgGroupVariable(S,addons[ia]);

				}
				// Hatch addons
				addons = S.M_getVariablePack("addons",this.M_getHatchFunctionsList(),true);
				for(let ia=0; ia<addons.length; ia++)
					this.M_readHatchVariable(S,addons[ia]);



			}
		}
		
	}

	async M_startAlgorithm()
	{
		if(this.m_isMainAlgorithm && this.m_isMustEraseFirst)
		{	this.M_clearDrawing();		
			//this.M_clearLog();
			this.M_clearMask();
		}
		// reinit the seed
		this.M_seed(this.m_seed);
		noise.seed(this.random());

		if( !this.m_speciesRandomDone)
			this.M_initSpeciesRandom();
		
		await this.M_doGrassAlgorithm().then(
			function(){console.log("OK Done !");},
			function(error){console.log("Ooops error in the async function",error);}
		);
	
	
	}
	M_initSpeciesRandom()
	{
		this.m_speciesRandomDone = true;
		for( let is=0; is<this.m_species.length; is++)
		{
			let S = this.m_species[is];
			S.random=sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, S.M_getInt("seed",this.m_seed ));

			if( S.m_name=="IvyGrass" || (S.m_name=="GrassObject3D" && S.m_ivy))
			{
				if( !this.randomLeaves )
				{
					let leavesSeed = S.random();
					this.M_seed( parseInt(leavesSeed*100),"Leaves");	
					let maxDepth = 10; 
					for( let i=0;i<=(maxDepth+1);i++)
					{
						this.M_seed( parseInt(S.random()*100),"Depth"+i);	
					
					}
					this.M_seed(parseInt(S.random()*100),"Young");
				}					
			}

		}
	
	}

	M_onAlgorithmDone() 
	{ 	super.M_onAlgorithmDone();
		
		if( this.m_isAnimation)
		{
			var anim = this.m_animation;
			// { frameNb: 30, frameId: 0} 
			// anim frame id
			let s="";
			var f=0+anim.frameId;
			for( let i=0;i<4; i++)
			{	s = s.replace (/^/,Number(f%10).toString());
				f=parseInt(f/10);			
			}
			//downloadSVG($('#ARTWORK').html(),this.m_title+"_"+s+".svg");
			let fileName = this.m_title+"_"+s+".png";
			makeSnapshot(this,$('#ARTWORK').html(),fileName,1920).then(

				function()
				{
		
					this.M_log("Animation frame "+anim.frameId+"/"+anim.frameNb);
					anim.frameId++;
					if( anim.frameId <anim.frameNb)
					{
						// update parameters
						this.m_animated[0].t = anim.frameId/anim.frameNb;
						this.m_animated[0].tsin = Math.sin(2*Math.PI*this.m_animated[0].t);

						// clear the mask
						this.M_clearMask();
						this.M_clearLog();
						// clear the groups / PNG
						this.M_clearDrawing();
						this.m_speciesRandomDone = false;

						// reset child algorithms
						for( let is=0; is<this.m_species.length; is++)
						{	let S = this.m_species[is];
							if( S.m_isAlgorithm )
							{	S.m_isPrinted = false;
							}
						}

						
						
						// relaunch anim
						if( !this.M_isAbort())
							self.setTimeout(this.M_startAlgorithm.bind(this),10);
					
					}
				}.bind(this),
				function(error)
				{
					this.M_log("error in makeSnapshot : "+error);		
				}
			);
		}
	}
	
	// ---------------------------------------------
	// M_getNamedFunction   
	// ---------------------------------------------
	M_getNamedFunction(name)
	{
		if(name=="GlobalFunction")
		{	return this.M_globalFunction;	
		}
		else
			return super.M_getNamedFunction(name);

	
	}
	M_globalFunction(x,y,o)
	{	if(o===undefined)
			o={min:0,max:1,isMapRange:false}
		if( o.isAnimated)
		{	let dir = Math.PI*2*(o.rnd+this.m_animated[0].t);
			 let r = this.m_animated[0].tsin *this.W;
			 x+= r*Math.cos(dir) ; y+r*Math.sin(dir);
		}
		var C = new RQVec2(this.W*0.5, this.H*(1-this.m_documentHorizon*0.5));
		var D = Math.min(this.W*0.5,this.H*this.m_documentHorizon*0.5)*this.m_globalFuncScale;
		var h = Math.hypot( x-C.x,y-C.y)/D; 
		h= RQMaths.M_clamp(h,0,1);
		var rnd=h*h;
		if( o.isMapRange)
		{	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max,0,1);		
		}
		return o.min + (o.max-o.min)*rnd;
	}	
	// ---------------------------------------------
	//  M_doGrassAlgorithm
	// ---------------------------------------------
	async M_doGrassAlgorithm()
	{
		var y = this.H -this.m_yStart; /*+20*this.upscale*/;		
		var yMax = this.H*this.m_documentHorizon;
		this.nbRowsOfGrass = 0; 
		var scale = 1;

		var signDir = 1;
		while ( y > this.H-yMax)
		{
			this.m_currentY = y;

			//  run other algorithms
			
			for( let is=0; is<this.m_species.length; is++)
			{	let S = this.m_species[is];
				if( S.m_isAlgorithm && S.m_isActive && S.A && !S.m_isPrinted)
				{	
					let yAlgo = S.A.m_yStart ? S.A.m_yStart : 0; 
				
					if( (this.m_workArea.top()-yAlgo)>y)
					{
						S.m_isPrinted = true;
						console.group("Calling M_startAlgorithm on "+S.A.m_name);
						S.A.m_mask = this.m_mask;
						S.A.m_isUseMask = true;


					  await S.A.M_doIncludedAlgorithm().then(
						 function(){console.log("OK Included art Done !"); console.groupEnd();},
						 function(error){console.log(" M_doIncludedAlgorithm: Ooops error in the async function");console.groupEnd();}
						 );
	
	
					/*self.setTimeout( async function(S){ 
							 );
						 
						}.bind(this,S),0);
					*/
					}
					

					//self.setTimeout(S.A.M_startAlgorithm.bind(S.A),0);
				}
				else if(S.m_isMask && S.m_isActive && !S.m_isPrinted)
				{
					let yAlgo = S.m_yStart ? S.m_yStart : 0; 
				
					if( (this.m_workArea.top()-yAlgo)>y)
					{
						S.m_isPrinted = true;
						this.M_log("Drawing mask at y="+y);
						// TODO : blend mode LIGHTEN 
						await this.M_loadImage( S,"m_image",S.m_imagePath ).then(img=>{

							var context = this.m_mask.M_getContext();
							context.globalCompositeOperation = "lighter";
							this.m_mask.M_drawImage({img:S.m_image});			
							context.globalCompositeOperation = "source-over";							

						}); 

					}				
				}
			}


			this.nbRowsOfGrass ++;
			scale =  RQMaths.M_map( y,this.H,(1-this.m_documentHorizon)*this.H,1, this.m_depthScaleFactor);   // 1. -(1.-this.m_depthScaleFactor)*(this.H-y)/this.H;

			
			/*self.setTimeout(*/ this.M_makeLineOfGrass(y,scale,signDir); // ,0 );
			y-= 4*this.upscale*scale;
			signDir = -signDir;
			
			//if((this.nbRowsOfGrass%5)==1)
				 await sleep(1);

		}
		/* fxhash PATCH Make a sky background*/
		if(this.m_sky)
			this.M_drawSkyBackground(this.m_sky);
		
		
		
		
		if( this.m_strokeBackground)
		{
			if(this.m_background)
			{	for(let i=0; i<this.m_background.length; i++)
				{	let B = this.m_background[i];
					if( B.A)
					{  
						B.A.M_initOuputImage();			// will reset the clipping zone of the output canvas
						await B.A.M_startAlgorithm();


					}
					else if(B.m_gradient)
					{
						if(this.m_outputFormat=="PNG" && this.m_outputImage)
						{
							this.M_log("HERE FOR A GRADIENT");
							let ctx = this.m_outputImage.M_getContext();
							let gradient= B.m_gradient.M_createContextGradient(ctx,new RQVec2(this.W/2,0),new RQVec2(this.W/2,this.H));
							this.M_log("gradient="+gradient);


							let lines = this.m_workArea.M_createPolyline().M_getSVGPath();
							let path = new Path2D(lines);
							A.m_canvasHeap.push({m:"fill",c:gradient,path:path,l:lines});
							ctx.fill(path);
						}
					}
				}
			}
			else this.M_log("(this.m_background is null)");

			/*if( this.m_background && this.m_background.A)
			{  this.m_background.A.M_startAlgorithm();
			}
			else 
			{	var r=new RQRectangle(0,0,this.W,this.H);
				r.M_inset(20*this.upscale); 
				this.m_groups.Background.m_lines = this.M_hatchShape( 	r.M_createPolyline(), {orientation:0, hatchFunc:this.M_hatchFuncGradient, spacing:this.m_strokeBackground});
			}*/			
		
		}



		// draw lines to Svg when done
		this.M_log("M_drawLinesToSvg");
		this.m_abort = false; 		// <-- to get a chance of having the algorithm draw the lines
		this.M_onAlgorithmDone();
		this.M_drawLinesToSvg(false);

		//resolve("Grass algorithm done");

	
	}
	M_drawSkyBackground(opt)
	{
		let kh=1-opt.kh;
		let r=new RQRectangle(0,0,this.W,kh*this.H);
		let F = this.m_groups.Sky;
		let u=this.upscale;
		F.m_strokeColor="rgba(0,0,0,0.5)";
		F.m_strokeWidth=0.1*u;
		let isCloud=opt.t && opt.t=="cloud";
		let Fopt={
			hatchFunc		:isCloud? this.M_hatchFuncCloudLines : this.M_hatchFuncSine,
			m_amplitude		:1*u,
			m_wavelength	:isCloud?{min:4*u,max:100*u}:{min:30*u,max:100*u},
			obbMargin		:3*u+this.m_strokeWidth,

			//gp.m_perturbation = this.M_readParametricVariable(vars,"perturbation",1,false);
			spacing			: 1*u,
			//m_lineSpacing
			protect			: 0*u,
			jointEnds		:true,
			orientation		: opt.orientation==undefined?90:opt.orientation,
			spacingFunc 	: 	(OBB,x,opts)=>
				{	let k=1-x/OBB.w;
					return (0.3*k +2.5*(1-k))*this.upscale;	
				
				}
		

		};
		if(isCloud)
		{
			Fopt.m_modulation = {amplitude:10*u,noiseFact:2};
			Fopt.orientation=-90;
			Fopt.m_maskFill=true;
			Fopt.m_groundCut=-1;
			Fopt.m_perturbation = {func:this.M_functionNoise,config:{min:0,max:1,isCustomNoise:true,noiseFact:{x:3,y:5},shift:{x:0,y:0}}}
		}
		this.M_fillShape(F,r.M_createPolyline(),Fopt);


	}


	// ---------------------------------------------
	VM_onLineOfGrassBegin(yFrac){}
	// ---------------------------------------------
	// M_makeLineOfGrass
	// ---------------------------------------------
	
	async M_makeLineOfGrass(y,scale,signDir)
	{
		if( signDir==undefined)
			signDir = 1;
		let shiftX = this.m_herbSpacing/2*scale; 
		var xMin = this.m_xBounds==undefined ? -shiftX : this.m_xBounds.min; 
		var xMax = this.m_xBounds==undefined ? this.W+shiftX : this.m_xBounds.max; 
		var x=xMin;
		var xStop = xMax;
		let yFrac = (this.H-y)/this.H;
		if( yFrac>=this.m_yFracStop)
		{	this.M_log("Stopped at Yfrac="+yFrac);
			return;
		}
		this.VM_onLineOfGrassBegin(yFrac);
		
		var opt = {
			x:0,
			y:y,
			seg : this.m_segLength,
			scale : scale
		}
		if( signDir<0)
		{
			x=xMax;
			xStop=xMin;
		}
		// repartition
		var isDensityGlobalFunction = this.m_isGlobalFuncDensity;
		var flowers=[];
		
		// x<xMax => x-xMax<0
		// x>xMin => -(x-xMin)<0 
		for( ; signDir*(x-xStop)<0;  )
		{

			if(this.M_isAbort() )
			{	this.M_log("Aborted at Yfrac="+yFrac);
				return;
			}

			var sumDensities = 0; 
			for( let is=0; is<this.m_species.length; is++)
			{	let S = this.m_species[is];
				S.inRange =  S.m_yRange? (S.m_yRange.min<=yFrac && S.m_yRange.max>=yFrac) : true ;
				if(S.m_isActive && (!S.m_isSpecialSpecies) && (S.inRange||!S.m_isFreeUpRange) )
					sumDensities+= (S.m_rndDensity= S.m_density.func.apply(this,[x,y,S.m_density.config] ));
				else 
					S.m_rndDensity = 0;
			}
			if( sumDensities<1)
				sumDensities = 1;


			opt.x=x*1;
			opt.y=y*1;
			if(this.m_isRelief)
			{	let a=this.m_reliefParam;
				opt.y += this.upscale*a.ampl*(a.isScale?scale:1)*noise.simplex2( a.noiseFact*opt.x/this.W+a.noiseShift,opt.y/this.H);		// TODO : heightmap
			}

			// put an herb
			var advanceW = this.m_herbSpacing;//*scale;
			var globFunc =  this.M_globalFunction(x,y);
			if(this.m_isGlobalDensityInverted) globFunc = 1-globFunc;
			if( (!isDensityGlobalFunction) || this.random()>globFunc )
			{	/*let rnd = RQMaths.random()/sumDensities*/;
				//let rnd = this.M_functionNoise(x,y,{ min: 0, max: sumDensities, noiseFactX : 2000, noiseFactY:500});
				let rnd = this.random() * sumDensities;
				let thres=0;
									
				for( let is=0; is<this.m_species.length; is++)
				{	let S = this.m_species[is];
					if( S.m_isActive)
					{	if( rnd< (thres+=S.m_rndDensity))
						{

							opt.S=S;
							if( S.inRange)
							{	A.m_deformersActive = S.m_isDeformers;
								// do something	
								if( S.m_isDandelion )
								{
									flowers.push( {fn:this.M_putDandelion,opts: {...opt} })
									
								}
								else if( S.m_isClover)
								{
									advanceW = this.M_putClover(opt);
								
								}
								else if( S.m_isDaisy)
								{
									advanceW = this.M_putDaisy(opt);
								
								}
								else if( S.m_isPoppy)
								{
									advanceW = this.M_putPoppy(opt);
								
								}
								else if( S.m_isHerb)
								{
									for( let iHerb=0; iHerb<2; iHerb++)
									{	opt.grassStrandId = iHerb;
										advanceW = this.M_putHerb(opt);
									}
								
								}
								else if( S.m_isFern)
								{
									advanceW = this.M_putFern(opt);
									
								}
								else if( S.m_isMint)
								{
									advanceW = this.M_putMint(opt);
								
								}
								else if( S.m_isTree)
								{
									advanceW = this.M_putTreeGrass(opt);
								
								}
								else if( S.m_isIvy)
								{
									advanceW = this.M_putIvyTree(opt);
								
								}
								else if( S.m_isObject3D)
								{
									advanceW = this.M_putObject3D(opt);
								}
							}
							// break 
							break;	
						
						}
					}
				}
				
			}
			// avance x
			x+= signDir*advanceW*0.5*(1+scale);
		}
	
		// Send the flowers after the line of grass
		for( let i=0; i<flowers.length; i++)
		{
			let f = flowers[i]
			f.fn.apply(this,[f.opts]);
		}
		
		this.nbRowsOfGrass--;


	}
	
	// ---------------------------------------------
	//  PutHerb
	// ---------------------------------------------
	M_putHerb(opt)
	{
		var S=opt.S;
		var context = this.m_mask.M_getContext();			
		var sz = opt.scale; 
		S.m_groups.Herb.M_applyScale(opt.scale);

		var grassW = opt.grassW= S.m_width.func.apply(this,[opt.x,opt.y,S.m_width.config] )*opt.scale;
		var spacing = grassW+(S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;

		//opt.x+=spacing*0.5;
		var grassH = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;
		var segmentLength = opt.seg;
		var segLen =  segmentLength;
		var nbSegs = Math.ceil(grassH/segLen);
		segLen = grassH/nbSegs;
		
		let strandShift = (0+opt.grassStrandId)*300;
		var dirChange = S.m_torsion.func.apply(this,[opt.x+strandShift,opt.y,S.m_torsion.config] ); 
		dirChange /= (grassH/segLen); 

		let line = new RQPolyLine();
		let line2 = [];
		var direction = 0.;
		var x2=opt.x;
		var y2=opt.y;
		var e;
		var eMin =  Math.max(grassW/8, this.m_strokeWidth*4); 
		var kH;
		var seg=0;
		var kInflection = 0.6;
		var kDivider = grassH*(1-kInflection); kDivider = 1 / (kDivider*kDivider);
		let isNoiseDirection = S.m_ondulation.ang!=0; 
		
		let noiseDir=0;
		for( let iSeg = 0; iSeg<=nbSegs; iSeg++,seg+=segLen, direction+=dirChange)
		{
			kH = seg/grassH;
			// e= eMin + (grassW-eMin) * Math.cos(-Math.PI/2 + kH*Math.PI);
			let mul  = Math.max(0,(1-(seg-grassH*kInflection)*(seg-grassH*kInflection)*kDivider ));
			e= grassW *mul ;
			
			if( isNoiseDirection)
			{	noiseDir = S.m_ondulation.ang*noise.simplex2( (opt.x+strandShift*mul)/this.W,opt.y+seg/this.H*S.m_ondulation.noiseFact/sz);
			}
			if( iSeg<nbSegs/2)
				e= Math.max(e,eMin);

			let I = new RQVec2(Math.cos((direction+noiseDir)*DEGTORAD),Math.sin((direction+noiseDir)*DEGTORAD));
			let J = new RQVec2( I.y,I.x );
			if( seg>0)
			{
			   x2+=J.x*segLen;
			   y2-=J.y*segLen;
			}
			var p = new RQVec2(x2-I.x*e/2,y2+I.y*e/2);
			line.M_addPoint( p);
			if( iSeg<nbSegs)
				line2.push( new RQVec2(x2+I.x*e/2,y2-I.y*e/2));



		
		}

		// merge lines
		const mergeLines = ()=>{
			let p2;
			while(p2=line2.pop())
			{	line.M_addPoint(p2);						
			}
		}
		let isTooThin = grassW< S.m_LODthreshold ;
		if( !isTooThin)
			mergeLines();
		if( S.m_isContour)
		{	//S.m_groups.Herb.m_lines.push(...this.M_computeLineMask(line));
			this.M_drawLines(S.m_groups.Herb, line,true);
		}
		if( isTooThin)
			mergeLines();
	
		// Hatching herb with H group			
		let Fs = S.m_groups.HerbHatches.fills; 
		let F;
		if( Array.isArray(Fs))
		{
			for(let iF=0; iF<Fs.length; iF++)
			{
				if( F =Fs[iF])
				{	F.orientation=direction / 2+90; //this.random()*180;
					F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*S.random();
					//F.jointEnds = true;
					
					//F.m_lines.push( ...this.M_hatchShape( line ,F));
					this.M_fillShape(F,line,F); 

				}
			}
		}
	
		
		
		// draw the herb in the mask
		var pathPoints = "M ";
		var nbpoints = line.M_nb();
		
		for( let ip=0; ip<nbpoints; ip++)
		{
			let p =line.M_getPoint(ip%nbpoints);
			pathPoints+=(ip==0?"":" L ")+p.x+" "+p.y;				
		}
		// More underneath
		if( nbpoints>2)
		{
			if( this.m_maskUnderneathHerb && S.m_isProtectMaskUnderneath)
			{
				var more = 10*this.upscale;
				var endPoint = line.M_endPoint();
				if( endPoint)
				{
					pathPoints+=" L "+(endPoint.x+more*0.5)+" "+(endPoint.y+more);				
					pathPoints+=" L "+(endPoint.x-more*0.5)+" "+(endPoint.y+more);				
				}
			}
			pathPoints+=" L "+line.M_getPoint(0).x+" "+line.M_getPoint(0).y;				
		}

		let path = new Path2D(pathPoints);
		if(this.m_mask )
		{	
			context.fillStyle = "white";
			context.fill(path);
			if( this.m_isShortenJunctions)
			{	context.lineWidth = this.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(path);
			}
		}
		return spacing;
	}
	
	// ---------------------------------------------
	// DANDELION
	// ---------------------------------------------
	M_putDandelion(opt)
	{
		var sz = opt.scale;

		var S = opt.S;
		var grassH = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;

		opt.grassH = grassH;
		var direction = 0;
		var x2 = opt.x;
		var y2 = opt.y;
		var segLen = opt.seg;
		var dirChange = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ); 
		

		dirChange /= (grassH/segLen); 

		var dandelionRadius = (S.m_flowerDiameter.min + ( S.m_flowerDiameter.max-S.m_flowerDiameter.min )*S.random())* sz*0.5;
		var J = new RQVec2(0,1);
		var I = new RQVec2(1,0);
		
		// Leaves 
		var nbLeaves = 3+Math.round(4*S.random());

		//opt.leafHatchMargin 		= S.m_isHatchLeaves? 3*this.m_strokeWidth:0;

		opt.leaves = { open: {min:0.2 , max:0.5}, inclinaison: direction, bend : 60+50*S.random(), viewerInclinaison: 10, rotationStart: S.random()*180, length: grassH*0.35, width: grassH*0.35*0.18, centerLine:true, group : opt.S.m_groups.Dandelion }

		this.M_organizeLeaves(this.M_drawDandelionLeaf, opt,"front",nbLeaves);

		
		// STEM
		var e= S.m_stemWidth*sz;
		var stemLines = [];
		for( let ie=-e/2; ie<e/2; ie+=this.m_strokeWidth*2) // TEMP 1.2
		{
			x2 = opt.x;
			y2 = opt.y;			
			direction = 0;
			let line = new RQPolyLine();
			for( var seg=0.; seg<=grassH; seg+=segLen) 
			{
				J.M_set(Math.sin(direction*DEGTORAD),Math.cos(direction*DEGTORAD));
				I.M_set( J.y,J.x );

				line.M_addPoint( x2+I.x*ie,y2+I.y*ie);
			
				seg+=segLen;
				
				direction+=dirChange;
				if( seg<=grassH)
				{
					x2+=J.x*segLen;
					y2-=J.y*segLen;
				}
			}
			stemLines.push(line);
		}
		if( stemLines[0].M_nb()>=2)
		{
			// end point 
			var end = stemLines[0].M_endPoint(); 
			// Make a path with stem for masking
			var pathPoints = "M ";
			if( true )
			{
				var l1 = stemLines[0];
				var l2 = stemLines[stemLines.length-1]; 
				var nbpoints = l1.M_nb();		
				for( let ip=0; ip<nbpoints; ip++)
				{
					let p =l1.M_getPoint(ip);
					pathPoints+=(ip==0?"":" L ")+p.x+" "+p.y;				
				}
				nbpoints = l2.M_nb();		
				for( let ip=nbpoints-1; ip>=0; ip--)
				{
					let p =l2.M_getPoint(ip);
					pathPoints+=" L "+p.x+" "+p.y;				
				}
				// loop
				let p = l1.M_getPoint(0);
				pathPoints+=" L "+p.x+" "+p.y;				
				
			}

			// Dandelion flower center 
			var C = new RQVec2( end.x +J.x*dandelionRadius*0.8, end.y-J.y*dandelionRadius*0.8);


			// draw the stem lines 
			for( let il=0; il<stemLines.length; il++)
			{	S.m_groups.Dandelion.m_lines.push(...this.M_computeLineMask(stemLines[il]));
			}


			// Draw the flower lines
			var lineSep = 3*this.m_strokeWidth;
			var nbLines = Math.max( 8, 2*Math.round(2*Math.PI*dandelionRadius / (lineSep+this.m_strokeWidth+this.m_protectionStrokeWidth)/2));
			var a = 0;
			var aIncrement = 2*Math.PI/nbLines;
			var I = new RQVec2();
			var i=0;
			for( a=2*Math.PI; a>0; a-=aIncrement)
			{
				I.M_set(Math.cos(a),Math.sin(a));
				let r= dandelionRadius*(0.7+0.3*S.random());
				let lineLength = r/( (i%2)? 3:5) ;
				let radiusStart = r-lineLength/2;
				let radiusEnd = r+lineLength/2;
				
				S.m_groups.DandelionFlower.m_lines.push( ...this.M_computeLineMask( new RQLine(  new RQVec2(C.x+I.x*radiusStart, C.y+I.y*radiusStart), new RQVec2(C.x+I.x*radiusEnd, C.y+I.y*radiusEnd)  ))) 
				i++;
			}
			
			// draw a circle in the mask 
			var context = this.m_mask.M_getContext();
			context.beginPath();
			context.arc(C.x, C.y, dandelionRadius*0.95, 0, 2 * Math.PI, false);
			context.fillStyle = 'white';
			context.fill();
			
			// draw the stem in the mask
			let path = new Path2D(pathPoints);
			context.fill(path);
			if( this.m_isShortenJunctions)
			{	context.lineWidth = this.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(path);
			}

		}
		// Leaves
		this.M_organizeLeaves(this.M_drawDandelionLeaf, opt,"back",nbLeaves);
					
	
	}
	// ---------------------------------------------
	//  M_organizeLeaves
	// ---------------------------------------------
	M_organizeLeaves(func, opt,frontOrBack, nbLeaves)
	{
		// opt.leaves = { open: {min:0.3 ; max:1}, inclinaison: direction, viewerInclinaison, rotationStart: this.random()*60, length: leafSize, width: leafSize*0.6, centerLine:true, lines : S.m_groups.Clover.m_lines }

		let OL = opt.leaves; 
		
		var angle = OL.rotationStart;
		var incAngle = 360/nbLeaves;

		// arrange the leaves on a circle
		var flags = frontOrBack=="front"? 1 : frontOrBack=="back"? 2 : 3;
		
		var h =OL.length; 

		// 3D version
	   let viewerOrientation = OL.viewerInclinaison;
	   let direction = OL.inclinaison;
	   var stack = [];
	   var MV = new RQMatrix4();						// MV is at the center of the leaves
	   MV.M_rotate(direction,0,0,1);					// rotate in the bend direction of the flower
	   MV.M_rotate(viewerOrientation,1,0,0);			// rotate in the direction of the viewer

	    var openAmount= OL.open.min + opt.S.random()* (OL.open.max-OL.open.min) ;

		let leafDir = new RQVec3(0,0,-1);		// to get the direction of leaves, before we rotate the matrix with openAmout which will project the Y axis onto -Z 
		let Lv=[];
		for( let i=0;i<nbLeaves;i++)
		{
		   stack.push(MV.clone());
		   MV.M_rotate(angle,0,1,0);
		   MV.z = MV.M_getRotateZ(leafDir);
		   let isBack  = MV.z>=0;
		   if( ( (!isBack) && (flags&1)) || ( isBack  && (flags&2))) 
		   {
			   MV.M_rotate(openAmount*90,1,0,0);			    

			   Lv.push(MV)
		   
		   }
		   MV=stack.pop();
		   angle+=incAngle;		
		}
		// sort the MV
		Lv.sort( function(a,b){ return a.z<b.z?1 : -1} );

		// call the leaf 
		for( let i=0; i<Lv.length; i++)
			func.apply( this,[Lv[i],opt]);


	
	}
	


	// ---------------------------------------------
	//  M_drawLeaf
	// opt.leaves : 
	//  - profile
	//	- length
	//	- width 
	//  - nbProfilePoints
	//  - bend
	//  - group : group for lines
	//  - fills : group/fills
	// opt.x, opt.y : C ( ref ) 
	//  
	// ---------------------------------------------
	
	// 3D approach
	// leaf MV is oriented so that leaf profile is on Y,Z axis 
	M_drawLeaf(MV,opt)
	{
			// opt.leaves = { open: {min:0.3 ; max:1}, inclinaison: direction, viewerInclinaison, rotationStart: this.random()*60, length: leafSize, width: leafSize*0.6, centerLine:true, lines : S.m_groups.Clover.m_lines }
		let OL = opt.leaves;
		let leafProfile = OL.profile;
		let leafLen 	= OL.length; 
		let leafWidth 	= OL.width;
		let nbPoints = Math.max(OL.nbProfilePoints,4);

	   let C = new RQVec2(opt.x,opt.y);
	   let Plocal = new RQVec3() 
	   let P = new RQVec2(); 
	   let bendAlpha = OL.bend*DEGTORAD;
	   let bendR  = Math.abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 0;
	   
	   var kProfile = 1./(nbPoints-1);
	   let leafDecal = 0;	// TEMP
	   let L = [new RQPolyLine(),new RQPolyLine()]; 
	   var p;
	   for( let i=0; i<nbPoints; i++)
	   {	
		   let aProfile = i*kProfile; 
		   p= leafProfile.apply(this,[aProfile,opt]);
	      let dz = (1-Math.cos( p.y*bendAlpha))*bendR; 
		   let y = bendR*Math.sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 
		   for( let side=0; side<2; side++)
		   {	
		   		let sign = side==0? -1 : 1;
		   		Plocal.M_set( sign*p.x*leafWidth, y,dz)	// ok
			    Plocal.y += leafDecal; 

			   // P is the point oriented around the flower 
			   let Pworld = MV.M_mutlipliedByVector(Plocal);
			   //let Pproj = new RQVec2(Pworld.x,-Pworld.y + Pworld.z*this.m_perspectiveFactor);				
			   
			   //L[side].M_addPoint(Pproj.M_plus(C.x,C.y));
			  	L[side].M_addPoint(this.M_projection(Pworld,C));
			}	   
		   
	   }
	   // profile
	   // 	   let x =  2*t-1;
	   //      x = Math.sin(Math.pow(t,0.8)*Math.PI);
	   //     y = Math.sin(t*Math.PI*(0.5+opt.leaves.heartShape ));
	   //   y donné ---> t ? 
	   //    arcsin(y) = t* PI * (0.5+heartShape)
	   //    t= arcsin(y)/( t*PI*(0.5+heartShape) )
	   //    et x = Math.sin( Math.pow(t,0.8)*Math.PI )); 
	   
	   
	   // Param : p from profile
	   // 
	   // y = bendR*Math.sin(p.y*bendAlpha);
	   // Plocal.M_set(p.x*leafWidth, y, dz )
	   // 
	   
	   
	   let orientation = L[0].M_endPoint().M_minus( L[0].M_getPoint(0));
	   orientation = Math.atan2(orientation.y,orientation.x)/DEGTORAD;
	   
	   // centerLine
	   let centerL = null;
	   if( OL.centerLine && p && p.y>0)
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
			   //let Pproj = new RQVec2(Pworld.x,-Pworld.y + Pworld.z*this.m_perspectiveFactor);				
			  	
			  	centerL.M_addPoint(this.M_projection(Pworld,C));
			   
			   //centerL.M_addPoint(Pproj.M_plus(C.x,C.y));
												
				y+=segLen;
			}  
	   }
	   
	   
	   // joint lines
	   let p2;
	   while(p2=L[1].m_points.pop())
	   {	L[0].M_addPoint(p2);						
	   }
	   var pathPoints = L[0].M_getSVGPath(true);

		// Filling with hatches
		let N = MV.M_rotateVector((new RQVec3(0,1,0)).M_cross( new RQVec3(1,0,0))).M_normalized(); 

		let lighting = (1+N.M_dot(this.m_lightSource))*0.5;
		lighting*=lighting;
		//this.M_log("N="+N.M_getString()+" light="+this.m_lightSource.M_getString()+" lighting="+lighting);
		let lightMax = 1; 
		

		let Fs=OL.fills;
		if( Array.isArray(Fs))
		for( let iF=0; iF<Fs.length; iF++)
		{
			let F=Fs[iF];
			if( F )
			{	OL.MV = MV;
				OL.C = C;
				F.orientation= orientation;
				F.leaves = OL;
				//F.normal = N;
				F.spacing=  RQMaths.M_map( lighting,0.2,lightMax,F.m_spacing.min , F.m_spacing.max);
				//F.jointEnds=true;
				//this.M_log("Hatching : "+RQPrintR(L[0],1)+" F="+RQPrintR(F,1));

				//F.m_lines.push( ...this.M_hatchShape( L[0] ,F)); 
				this.M_fillShape(F,L[0],F);
			}
		}

	   // Draw the lines
	   //OL.lines.push(...this.M_computeLineMask(L[0]));
	   this.M_drawLines(OL.group,L[0],true);
	   if( centerL ) 
	   {
		  // OL.lines.push(...this.M_computeLineMask( centerL ));	   
		   this.M_drawLines(OL.groupFeat?OL.groupFeat:OL.group,centerL,true);
	   }
	   // Hatch the leaves
	   /*if(opt.leafHatchMargin>0)
		   opt.m_lines.push(...this.M_hatchShape(leafLeft,{orientation:direction,spacing:opt.leafHatchMargin}));
		*/
   
   
	   // draw the leaf in the mask
	   var context = this.m_mask.M_getContext();
	   let path = new Path2D(pathPoints);
	   context.fillStyle = 'white';
	   context.fill(path);
	   if( this.m_isShortenJunctions)
	   {   context.lineWidth = this.m_protectionStrokeWidth*2;
		   context.strokeStyle = "white";
		   context.stroke(path);
	   }

	
	}





	
	
	// ---------------------------------------------
	// CLOVER
	// ---------------------------------------------
	M_putClover(opt)
	{
		var sz = opt.scale;

		var S = opt.S;
		var cloverHeight = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		var leafSize = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;
		var spacing = leafSize+(S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;
		//opt.x += spacing * 0.5;
		var segLen = opt.seg;

		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ) ; 
		var stemLines;
		if(cloverHeight>1)
		{
			opt.fillStem = S.m_isFillStem;
			stemLines = this.M_getStem(opt,0,direction,cloverHeight,S.m_stemWidth*opt.scale);
			direction = stemLines.direction;
		}
		var nbLeaves = S.m_nbLeaves.min+Math.round((S.m_nbLeaves.max-S.m_nbLeaves.min)*S.random());
		opt.leaves = {  inclinaison: direction, viewerInclinaison: 10+S.random()*10, length: leafSize, group : S.m_groups.Clover }
		switch( S.m_leafShape)
		{
			default :
			case "Clover" :
			   opt.leaves.nbProfilePoints=30;
			   opt.leaves.profile	= this.M_cloverLeafProfile;
			   opt.leaves.invProfile  = this.M_cloverLeafInvProfile; 
			   opt.leaves.width = leafSize*0.6;
			   opt.leaves.heartShape= S.m_heartShape.min + (S.m_heartShape.max-S.m_heartShape.min)*S.random();
			   opt.leaves.open =  {min:0.2 , max:0.9};
			   opt.leaves.bend = 60;
			   opt.leaves.centerLine=true;
			   opt.leaves.rotationStart= S.random()*60;
			   break;
			   
			case "Ash":
			  //this.m_leafOpts = {profile:algorithm.M_ashLeafProfile,organizeFun: algorithm.M_ashOrganize, ashLeaves:4.5,segments:150,ratio:0.9,stemRatio:0,centerLine:false};
			   {
				   opt.leaves.nbProfilePoints=150;
				   opt.leaves.profile	= this.M_ashLeafProfile;
				   opt.leaves.width 	= leafSize*0.7;
				   opt.leaves.open 		=  {min:0.0 , max:0.5};
				   opt.leaves.bend 		= -10-S.random()*30;
				   opt.leaves.ashLeaves	=2.5+Math.round(6*S.random() );	// 4.5
				   opt.leaves.orient = [];
				   for( let i=0; i<Math.ceil(opt.leaves.ashLeaves);i++)
				   {	opt.leaves.orient[i]={o:0.1+0.4*S.random(),sz:0.8+0.2*S.random()};
				   }
				   opt.leaves.viewerInclinaison = -20;
				   opt.leaves.rotationStart= 30*S.random();
			   }
			  break;
		}	
		// Lucky clover ? 
		if(false && !this.m_isLuckyClover)
		{	let rnd = S.random();
			if(rnd<0.03)
			{	this.m_isLuckyClover = true;
				this.M_log("lucky clover at "+Math.round(opt.x/this.upscale)+","+Math.round((this.H-opt.y)/this.upscale));
				nbLeaves = 4;
			}
		} 
		// fill
		opt.leaves.fills= S.m_groups.CloverFill.fills; 


		
		var O = new RQVec2(opt.x,opt.y);
		var P = stemLines!=undefined? stemLines.end : O;
		opt.x=P.x;
		opt.y=P.y;
		this.M_organizeLeaves(this.M_drawCloverLeaf, opt,"front",nbLeaves);
		
		// draw the stem
		//let destination = (S.m_isFillStem &&  S.m_groups.CloverFill.fill) ? S.m_groups.CloverFill.fill : S.m_groups.Clover;  
		if(stemLines!=undefined)
		{
			let destination = S.m_groups.CloverStem;  
			for( let il=0; il<stemLines.lines.length; il++)
			{	destination.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
			}

			// draw the stem in mask
			if( stemLines.contourPath)
			{	let context = this.m_mask.M_getContext();
				context.fill(stemLines.contourPath);
				if( this.m_isShortenJunctions)
				{	context.lineWidth = this.m_protectionStrokeWidth*2;
					context.strokeStyle = "white";
					context.stroke(stemLines.contourPath);
				}

			}
		}
		
		this.M_organizeLeaves(this.M_drawCloverLeaf, opt,"back",nbLeaves);


		return spacing;
	}	

	// ---------------------------------------------
	// MINT
	// ---------------------------------------------
	M_drawMintLeaf(MV,opt)
	{

	   this.M_drawLeaf( MV,opt);
	}


	M_mintLeafProfile(t,opt)
	{
	   let x = Math.sin(Math.pow(t,0.7)*Math.PI);
	   x-=Math.sin(t*20*Math.PI)*0.05;
	   return {x: x, y : t};	
	}
	M_mintLeafInvProfile(y,OL)
	{
		let t= y;
		let x = Math.sin(Math.pow(t,0.7)*Math.PI);
		return {x:x,t:t};
	}

	M_putMint(opt)
	{
		var S = opt.S;
		var sz = opt.scale;
		S.m_groups.MintStem.M_applyScale(opt.scale);
		S.m_groups.MintLeaf.M_applyScale(opt.scale);
		S.m_groups.MintFeatures.M_applyScale(opt.scale);

		var mintHeight = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		var leafSize = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;
		var spacing = /*leafSize+*/(S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;
		//opt.x += spacing * 0.5;
		var segLen = opt.seg;

		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] )/**-Math.sign(opt.x-this.W/2)*/ ; 

		// generate stem with sampling 
		opt.stemSamples = { segmentLength: S.m_stemSegment.min + (S.m_stemSegment.max-S.m_stemSegment.min)*S.random(), kStart:S.m_stemKStart };
		opt.fillStem = S.m_isFillStem;
		var stemLines = this.M_getStem(opt,0,direction,mintHeight,S.m_stemWidth);
		opt.stemSamples = null;
		direction = stemLines.direction;

		var nbLeaves = 	S.m_leafOrganize.nb;
		let widthRatio = 1.;
		opt.leaves = { open: {min:0.2 , max:0.9}, inclinaison: direction, bend : 60, viewerInclinaison: 10+S.random()*10, centerLine:true, group : S.m_groups.MintLeaf, groupFeat:S.m_groups.MintFeatures }
		// fill
		opt.leaves.fills= S.m_groups.MintLeaf.fills; 

		switch(S.m_leafShape)
		{
			default:
			case "Mint":
			   opt.leaves.nbProfilePoints=50;
			   opt.leaves.profile	= this.M_mintLeafProfile;
			   opt.leaves.invProfile  = this.M_mintLeafInvProfile; 
			   widthRatio = 0.3; 
				break;
			case "Herb":
			   opt.leaves.nbProfilePoints=30;
			   opt.leaves.profile	= this.M_herbLeafProfile;
			   opt.leaves.invProfile  = this.M_herbLeafInvProfile; 
			   opt.leaves.heartShape= 0.18*S.random();
			   widthRatio = 0.08; 
				break;
			case "Clover":
			   opt.leaves.nbProfilePoints=30;
			   opt.leaves.profile	= this.M_cloverLeafProfile;
			   opt.leaves.invProfile  = this.M_cloverLeafInvProfile; 
			   opt.leaves.heartShape= 0.18*S.random();
			   widthRatio = 0.4; 
				break;
		}




		
		var O = new RQVec2(opt.x,opt.y);
		var P = stemLines.end;
	
		let Samples=[];
		Samples.push({P:P,l:mintHeight});
		if( stemLines.samples)
		{	Samples.push(...stemLines.samples);
		}
		let rotStart = S.random()*60;
				//S.m_leafOrganize = S.M_getFloat("leafOrganize",{nb:2,shiftDeg:90});

		let radiusFunc= function(y,min,max){return min+(1-Math.pow(y,2))*(max-min) }
		
		for( let iSam=0; iSam<Samples.length; iSam++)
		{	let sam = Samples[iSam];
			switch( S.m_sizeFunc)
			{
				case "Straight":
					sam.leafSize = iSam==0?leafSize*0.4 : iSam==1? leafSize*0.8 : leafSize;
					break;
				case "Pow":
					sam.leafSize = radiusFunc(sam.l/mintHeight, S.m_size.min,S.m_size.max)*opt.scale;					
					break;
			}

			opt.x=sam.P.x;
			opt.y=sam.P.y;
			opt.leaves.rotationStart = rotStart + S.m_leafOrganize.shiftDeg*iSam;
			opt.leaves.length=sam.leafSize;
 			opt.leaves.width= sam.leafSize*widthRatio;
			this.M_organizeLeaves(this.M_drawMintLeaf, opt,"front",nbLeaves);
		}	
		// draw the stem
		for( let il=0; il<stemLines.lines.length; il++)
		{	//S.m_groups.MintStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
			this.M_drawLines(S.m_groups.MintStem ,stemLines.lines[il],true) 

		}
		// draw the stem in mask
		if( stemLines.contourPath)
		{	let context = this.m_mask.M_getContext();
			context.fill(stemLines.contourPath);
			if( this.m_isShortenJunctions)
			{	context.lineWidth = this.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(stemLines.contourPath);
			}

		}
		
//		this.M_organizeLeaves(this.M_drawMintLeaf, opt,"back",nbLeaves);
		for( let iSam=0; iSam<Samples.length; iSam++)
		{	let sam = Samples[iSam];
			opt.x=sam.P.x;
			opt.y=sam.P.y;
			//opt.leaves.rotationStart = rotStart + 90*(iSam%2);
			opt.leaves.rotationStart = rotStart + S.m_leafOrganize.shiftDeg*iSam;
			opt.leaves.length=sam.leafSize;
 			opt.leaves.width= sam.leafSize*widthRatio;
			opt.leaves.group = S.m_groups.MintLeaf;
			this.M_organizeLeaves(this.M_drawMintLeaf, opt,"back",nbLeaves);
		}	


		return spacing;
	}	





	// ---------------------------------------------
	//	FERN 
	// ---------------------------------------------
	M_putFern(opt)
	{	if(!this.fernCount)	this.fernCount=0;
		this.fernCount++;
		var sz = opt.scale;
		var S = opt.S;

		S.m_groups.FernStem.M_applyScale(opt.scale);
		S.m_groups.FernLeaf.M_applyScale(opt.scale);


		var height = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		let seg = opt.seg;


		var C = new RQVec2(opt.x,opt.y);
		//let Samples=[];
		//Samples.push({P:stemLines.end,l:height});
		
		// Make a leaf
		let rLeaf= S.m_leafSize;
		let nbPoints = 20*(0.5+0.5*sz);
		let aInc = 2*Math.PI/nbPoints;
		let a=-Math.PI;
		let leafShape=[];
		for( let i=0; i<=nbPoints; i++)
		{
			leafShape.push(new RQVec2(2*Math.pow(0.5*(1+Math.cos(a)),rLeaf.pow),Math.sin(a)));
			a+=aInc;
		}

		let radiusFunc = function(y,min,max){return min+(1-Math.pow(y,2))*(max-min) }
		let nbRoots = Math.round(S.m_nbRoots.min + (S.m_nbRoots.max-S.m_nbRoots.min)*S.random());
		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ); 
		let modFact=S.m_modulation.noiseFact;


		for( let iR = 0; iR<nbRoots; iR++)
		{
			let dir2 = direction+80*Math.sin(iR*Math.PI*2/nbRoots);

			// generate stem with sampling 
			opt.stemSamples = { segmentLength: S.m_stemSegment.min + (S.m_stemSegment.max-S.m_stemSegment.min)*S.random() };
			if( this.M_isUseVersion(1.5))		// !!
				opt.stemSamples.segmentLength*=opt.scale;
			opt.fillStem = S.m_isFillStem;
			let e =S.m_stemWidth*0.5*0.4; 
			var stemLines = this.M_getStem(opt,0,dir2,height,S.m_stemWidth);
			let context = this.m_mask.M_getContext();


			let lighting = S.random();
			if( stemLines.samples)
			{	
				// add a sample at the tip
				{	var end = stemLines.end;
					let endDir = stemLines.direction;
					
					var endIDir = new RQVec2(Math.cos(endDir*DEGTORAD),Math.sin(endDir*DEGTORAD));
				 	var endJDir = new RQVec2(-endIDir.y,endIDir.x);
					stemLines.samples.push({I:endIDir, J:endJDir, P:end,l:height});
				}
				let side=1;
				for( let is=0; is<stemLines.samples.length; is++)
				{
					let sample = stemLines.samples[is];

					let r = radiusFunc(sample.l/height, rLeaf.min,rLeaf.max)*0.5*opt.scale;
					let modAmp=S.m_modulation.amplitude*r;

					let L = new RQPolyLine();
					for(let i=0; i<=nbPoints; i++)
					{
						let leaf= leafShape[i];
						if(modAmp!=0)
						{
							let rnd = 0.5*(1+noise.simplex2(sample.P.x+leaf.x*modFact,sample.P.y+leaf.y*modFact)); 				
							r-= modAmp*rnd;
						}
						let x = side*(e+leaf.x*r);
						let y = leaf.y*r*rLeaf.k;
						let pProj = new RQVec3(sample.I.x*x+sample.J.x*y, sample.I.y*x+sample.J.y*y,0);
						L.M_addPoint( this.M_projection(pProj,sample.P));
						

					}
					this.M_drawLines(S.m_groups.FernLeaf,L, true);

					// Fill leaf
					let Fs = S.m_groups.FernLeaf.fills; 
					let F;
					if( Array.isArray(Fs))
					{
						for( let f=0; f<Fs.length; f++)
						{
							if( F=Fs[f])
							{	F.orientation=Math.atan2(sample.I.y,sample.I.x)/DEGTORAD;
								F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*lighting;
								F.jointEnds=true;
								this.M_fillShape(F,L,F); 
							}
						}
					}

					
					// draw leaf in mask
					var path = new Path2D(L.M_getSVGPath(false));
					context.fillStyle = "white";
					context.fill(path);
					
					side=-side;

				}
			}

			// draw the stem
			for( let il=0; il<stemLines.lines.length; il++)
			{	this.M_drawLines(S.m_groups.FernStem ,stemLines.lines[il],true) 
				//S.m_groups.FernStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
			}
			// draw the stem in mask
			if( stemLines.contourPath)
			{	let context = this.m_mask.M_getContext();
				context.fillStyle="white";
				context.fill(stemLines.contourPath);
				if( this.m_isShortenJunctions)
				{	context.lineWidth = this.m_protectionStrokeWidth*2;
					context.strokeStyle = "white";
					context.stroke(stemLines.contourPath);
				}

			}

		}
		return (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;

	}
	// ---------------------------------------------
	//  IVY TREE
	// ---------------------------------------------
	M_putIvyTree(opt)
	{
		var S = opt.S;
		var height = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] );
		var segLeng = 4*this.upscale;
		var rootWidth = 5*this.upscale;
		let leafOpts=LeafManager.M_createLeafOptions("default");
		leafOpts.leafSizeVar = S.m_leafsize;
		leafOpts.groups = {
			Leaves				: S.m_groups.Leaves,
			LeavesFeat			: S.m_groups.LeavesFeat,				
			Stem				: S.m_groups.LeavesStem	
		}
		let treeOpt = TreeManager.M_createTreeOptions("default",
			{	leafOpts	: leafOpts,
				scale		: opt.scale,
				groups		: {Branches:S.m_groups.Branches}
			
			});
		let tree = new ClassTree(this,treeOpt);
		//if( tree.m_factoryCount == 1)
		{
			tree.M_setBranchLength( height , segLeng); 
			tree.M_setPosition( new RQVec3(opt.x,this.H-opt.y,0) );
			tree.M_setDirection(new RQVec3(0,1,0));
			tree.M_setRadius( rootWidth/2,0);

			let MV = new RQMatrix4();
			tree.M_run(MV);
			tree.M_draw();
		}	
		return 30*this.upscale;			// TEMP
	}

	
	// ---------------------------------------------
	// TREE GRASS
	// ---------------------------------------------
	M_putTreeGrass(opt)
	{
		var sz = opt.scale;
		var S = opt.S;

		opt.maxLevel = S.m_maxLevel.min +parseInt( (S.m_maxLevel.max-S.m_maxLevel.min) *S.random());
		var height = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		var leafSize = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale;
		var spacing = (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;

		var O = new RQVec2(opt.x,opt.y);
		let MV = new RQMatrix4();

		let seg = /*opt.seg||*/2*this.upscale;
		let l=0;
		let e = S.m_e.root*this.upscale*sz;
		let P = new RQVec3(0,0,0);
		if( this.m_isShortenJunctions)
			opt.paths=[];
		

		let ff = opt.fillsFront=[];
		
		let iHeap = this.m_canvasHeapL.length;
		this.M_putTreeGrassBranch(opt,{MV:MV,O:O,P:P,height:height,strokeDecal:S.m_groups.Branches.m_strokeWidth*1.4,level:0,seg:seg,e:e}); 

		let f_;
		while(f_=ff.pop())
		{
			this.M_fillShape(f_.F,f_.path,f_.F); 
			this.m_canvasHeapL.splice( iHeap,0, this.m_canvasHeapL.pop());
		}
		
		
		if( this.m_isShortenJunctions)
		{
			let context = this.m_mask.M_getContext();
			context.lineWidth = this.m_protectionStrokeWidth*2;
			context.strokeStyle = "white";
			let path;
			while( path=opt.paths.pop())
			{
				context.stroke(path);
			}
		}


		return spacing;	
	}
	M_putTreeGrassBranch(opt,B)
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
								if( F=Fs[f])
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
			if( (F=Fs[f]) && !F.m_isFrontActive)
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

	// ---------------------------------------------
	// OBJECT3D
	// ---------------------------------------------
	M_putObject3D(opt)
	{
		var S = opt.S;
		var sz = opt.scale * S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] );
		var height = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;
		var rotation = S.m_rotation.func.apply(this,[opt.x,opt.y,S.m_rotation.config] );
		let torsion = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] ); 



		let obj3D = new Mesh();
		let yDecal = 0;
		let centerH = 0.5;
		switch( S.m_objShape)
		{
			case "Cube":
				obj3D.M_createCube(sz,sz,sz);
				break;
			case "Box":
				obj3D.M_createCube(sz,height,sz);
				break;
			case "Block":
				obj3D.M_createBlock({width:sz,depth:sz,height:height,rndFunc:S.random});
				break;
			case "Rock":
				obj3D.M_createRock({width:sz,depth:sz,height:sz,rndFunc:S.random});
				break;
			case "Trunk":
				{
					let segH = S.m_segmentHeight*opt.scale;
					let nbSeg = 1;
					if( segH )
					{	
						nbSeg=Math.round(Math.max(1, height/segH));
					} 
					//this.M_log("M_createTrunkObject(height:"+height+" sz:"+sz+" nbSeg:"+nbSeg );
					obj3D.M_createTrunkObject(height,{sz:sz,nbSeg:nbSeg,rndFunc:S.random});
				}
				break;
			case "Column":
				{
					let segH = S.m_segmentHeight*opt.scale;
					let nbSeg = 1;
					if( segH )
					{	
						nbSeg=Math.round(Math.max(1, height/segH));
					} 
					obj3D.M_createColumnObject(height,{sz:sz,nbSeg:nbSeg,rndFunc:S.random});
				}
				break;
			case "Stair":
			{
				let segH = S.m_segmentHeight*opt.scale;
				// nbStairs
				// stairHeight
				// stairDepth
				// width
				let nbStairs = Math.round(height/segH);
				segH = height/nbStairs;

				obj3D.M_createStairsObject({nbStairs:nbStairs,stairHeight:segH,stairDepth:segH,width:sz,torsion:torsion});				
				torsion = 0;
				centerH = 0;
			}
				break;
			
		}
		if(S.m_segEdges && S.m_segEdges.seg>=1)
		{
			obj3D.M_segmentEdges(S.m_segEdges.seg);
		}
	   	yDecal = obj3D.m_dimensions.y*centerH - Math.sin(Math.abs(torsion)*DEGTORAD)*obj3D.m_dimensions.x;
	   	
	   	var MV = new RQMatrix4();
	   
		MV.M_setIdentity();
		let C = new RQVec2(opt.x+sz/2,opt.y-yDecal);
		MV.M_rotate(torsion,0,0,1);
		MV.M_rotate(rotation,0,1,0);
		var MRot = MV.clone();

		obj3D.M_resetEdgesDrawFlag();
		obj3D.M_setMV(MRot);
		
		
		
		for( let i=0; i<obj3D.m_faces.length; i++)
		{
			let face = obj3D.m_faces[i]; 
			let N = MRot.M_rotateVector(face.m_normal );
			face.m_normalTransformed=N;
			face.m_isBackface = N.M_dot(this.m_toEyeVector) <0; 
		
			
		}

		// Ivy AddOn for object
		// ----------
		let Ivys = [];
		if(S.m_ivy)
		{
			this.M_setOrigin2D(C);
			obj3D.M_triangulate();
			for( let iI=0; iI<S.m_ivy.length; iI++)
			{
				if( S.m_ivy[iI].m_isActive)
				{	let ivy=this.M_putObjectIvy(obj3D,S.m_ivy[iI],{pos:C,ground:-yDecal,MV:MV,scale:opt.scale});
					if( ivy)
						Ivys.push(...ivy);						
				}
			}
		}
		// draw the front Ivy
		for( let itree=0; itree<Ivys.length; itree++)
		{
			let tree = Ivys[itree];
			tree.M_draw({layer:"front"});

		}




		if(S.m_edgeAngleLimit)
			obj3D.M_computeAngleLimit(S.m_edgeAngleLimit);
		
		let projFunc = this.M_getProjectionFunc().bind(this);

		let context;
		if(this.m_mask )
			context = this.m_mask.M_getContext();

		for( let i=0; i<obj3D.m_faces.length; i++)
		{
			let face = obj3D.m_faces[i]; 
			let N = face.m_normalTransformed;
			if( face.m_isBackface)
				continue;

			let L;
			if(S.m_isCutGround)
			 	L = face.M_makePolylineClip( C, MV,/*this.m_perspectiveFactor*/projFunc,{yClip:-yDecal});
			else
				L = face.M_makePolyline( C, MV,projFunc);
			



			let fills = S.m_groups.Faces.fills;
			if( Array.isArray(fills) )
			{
				for(let iF=0; iF<fills.length;iF++)
				{
					let F=fills[iF];


					if( F)
					{	
						let lighting = (1+N.M_dot(this.m_lightSource))*0.5;
						lighting*=lighting;
						let lightMax = 1; 
						if( F.m_isFill || lighting <=lightMax)
						{
							let arrayL=[];
							F.spacing=  RQMaths.M_map( lighting,0,lightMax,F.m_spacing.min , F.m_spacing.max);
							//F.orientation = this.random()*180;
							//F.orientation = 45*noise.simplex2(C.x/this.W*this.m_noiseFactor.x,C.y/this.H*this.m_noiseFactor.y);
							let X = N.M_cross(this.m_toEyeVector);
							F.orientation =  Math.atan2(X.y,X.x)/DEGTORAD;
							F.alternate=true;
							F.jointEnds=false;
							F.normal = N;

							this.M_fillShape(F,L,F);
							/*arrayL = this.M_hatchShape(L, F );
							//this.M_log("Hatched lines = "+arrayL.length);
							if( Array.isArray(arrayL))
							{	S.m_groups.Faces.m_lines.push(...arrayL );
						
							}*/
						}
		
					}
				}
			}


			if( true )	// draw edges 
			{	
				let arrayL=[];
				let arrayLFlat=[];
					let edgeLines;
				if(S.m_isCutGround)
					edgeLines = face.M_makePolylineClipWithEdges(C, MV,projFunc,{yClip:-yDecal});
				else 
				 	edgeLines = face.M_makePolylineWithEdges( C, MV,projFunc);
				if( edgeLines)
				{	for(let iL=0; iL<edgeLines.length; iL++)
					{	let Arr = edgeLines[iL].isFlat? arrayLFlat : arrayL;
						Arr.push(...this.M_computeLineMask(edgeLines[iL]));
					}
				}
				//this.M_log("Drawing edge lines Fat:"+arrayL.length+" Flat:"+arrayLFlat.length);
				S.m_groups.Edges.M_applyScale(opt.scale);
				S.m_groups.EdgesFlat.M_applyScale(opt.scale);
				
				this.M_drawLines(S.m_groups.Edges, arrayL, false);
				this.M_drawLines(S.m_groups.EdgesFlat, arrayLFlat, false);
			}
			
			// draw the face in the mask
			if(this.m_mask )
			{	let path = new Path2D(L.M_getSVGPath(false));
				face.contourPath = path;
				context.fillStyle = "white";
				context.fill(path);
				/*if( this.m_isShortenJunctions)
				{	context.lineWidth = this.m_protectionStrokeWidth*2;
					context.strokeStyle = "white";
					context.stroke(path);
				}*/
			}


		}
		// protect outside lines if needed
		if(this.m_mask )
		{	context.strokeStyle = "white";
			let group = S.m_groups.Edges;
			let stroke = group.m_strokeWidth;
			if(group.strokeScale)
				stroke*=group.strokeScale;
			for( let i=0; i<obj3D.m_faces.length; i++)
			{
				let face = obj3D.m_faces[i]; 
				if( face.m_isBackface)
					continue;
				if(face.contourPath)
				{
					context.lineWidth = stroke;
					context.strokeStyle = "white";
					context.stroke(face.contourPath);

				}
			
			}
		}
		// Draw the backtree
		for( let itree=0; itree<Ivys.length; itree++)
		{
			let tree = Ivys[itree];
			tree.M_draw({layer:"back"});

		}


		this.M_setOrigin2D(null);

		return sz;
	}

	// M_putObjectIvy
	// S=Ivy
	// returns array of trees
	M_putObjectIvy(obj, S,opt)
	{	
		var out = [];
		var height = S.m_height.func.apply(this,[opt.pos.x,opt.pos.y,S.m_height.config] );
		var segLeng = 1*this.upscale;
		var rootWidth = 2.2*this.upscale;
		var maxLevel = Math.round(S.m_maxLevel.min + (S.m_maxLevel.max-S.m_maxLevel.min)*this.randomLeaves());
		var nbTrees = Math.round(S.m_nbTrees.min + (S.m_nbTrees.max-S.m_nbTrees.min)*this.randomLeaves());


		let leafOpts=null; 
		S.m_groups.Branches.M_applyScale(opt.scale);
		
		if(S.m_leafShape!="None")
		{	leafOpts = LeafManager.M_createLeafOptions(S.m_leafShape);
			leafOpts.leafSizeVar = S.m_leafsize;

			S.m_groups.Leaves.M_applyScale(opt.scale);
			S.m_groups.LeavesFeat.M_applyScale(opt.scale);
			S.m_groups.LeavesStem.M_applyScale(opt.scale);


			leafOpts.groups = {
				Leaves				: S.m_groups.Leaves,
				LeavesFeat			: S.m_groups.LeavesFeat,				
				Stem				: S.m_groups.LeavesStem	
			}

		}
		let treeOpt = TreeManager.M_createTreeOptions("Ivy",
		{	leafOpts	: leafOpts,
			scale		: opt.scale,
			maxDepth	: maxLevel,
			groups		: {Branches:S.m_groups.Branches}
		
		});
		treeOpt.isAllLeavesFront = S.m_allLeavesFront;
		// Find ground lines for this object
		let grounds = obj.M_getGroundLine(opt.MV,opt.ground);

		if( false ) // debug
		{
			for( let ig=0; ig<grounds.length; ig++ )
			{	let gr=grounds[ig];
				let L = new RQPolyLine();
				for( let k=0; k<gr.L.length; k++)
				{	let p = this.M_projection(gr.L[k],opt.pos);
					this.M_drawLines(S.m_groups.LeavesFeat,new RQLine(p,p.M_plus(0,-10*this.upscale)),true);
					L.M_addPoint(p);
				}
				//this.M_drawLines(S.m_groups.LeavesFeat,L,true);
			}

		}

		if(grounds.length)
		{
			for(let iTree=0; iTree<nbTrees; iTree++)
			{
				let tree = new ClassTree(this,treeOpt);
				let gr = grounds[ Math.round(this.randomLeaves()*(grounds.length-1))];
				let F = gr.F;
				let l = gr.len * (0.2+0.6*this.randomLeaves());
				let P=gr.L[0].M_plus(gr.L[1].M_minus(gr.L[0]).M_multipliedBy(gr.L[1].dist>0?l/gr.L[1].dist:1) ) ;
				let p = this.M_projection(P,opt.pos);
				//this.M_drawLines(S.m_groups.LeavesFeat,new RQLine(p,p.M_plus(0,-100*this.upscale)),true);
				tree.M_setBranchLength( height , segLeng); 
				tree.M_setPosition( P ); //new RQVec3(0,opt.ground,0) );
				tree.M_setObject({MV:opt.MV,obj:obj,F:F,back:false});
				tree.M_setDirection(new RQVec3(0,1,0));
				tree.M_setRadius( rootWidth/2,0);
				tree.M_run();
				out.push(tree);

			}

		}
		else 
			console.error("Ground.length is NULL ! ");

		this.M_setOrigin2D(null);

		return out;

	}

	 
	 
	// opt.x 
	// opt.y
	// opt.stemSamples ( optional):
	//		.segmentLength
	//		.kStart
	// STEM
	M_getStem(opt,directionStart,directionEnd,stemLength,stemWidth)
	{
		var e= stemWidth*opt.scale;
		var strokeInc = this.m_strokeWidth*1.2;		// TEMP
		var segLen = opt.seg;
		var dirChange = -(directionEnd-directionStart) / (stemLength/segLen); 
		var stemLines = [];
		var I = new RQVec2();
		var J = new RQVec2();
		var direction;
		var SAM = opt.stemSamples;
		let kStartSample=0;
		let samples;
		if( SAM)
		{	samples=[];
			kStartSample=SAM.kStart || 0;
		}
		let samLen=0;
		let iLine = 0;
		let nbLines = Math.floor(e/strokeInc);
		let iCenterLine = Math.floor(nbLines/2);
		let C = new RQVec2(opt.x,opt.y);
		for( let ie=-e/2; ie<e/2; ie+=strokeInc) 
		{
			let x2 = 0;
			let y2 = 0;			
			direction = -directionStart;
			let line = new RQPolyLine();
			for( var seg=0.; seg<=stemLength; seg+=segLen) 
			{
				I.M_set( Math.cos(direction*DEGTORAD),Math.sin(direction*DEGTORAD) );
				J.M_set(-I.y,I.x);

				//let pt = new RQVec2(x2+I.x*ie,y2-I.y*ie);
				let pWorld = new RQVec3(x2+I.x*ie,y2+I.y*ie,0);
				let pt = this.M_projection(pWorld,C);
				line.M_addPoint( pt);

				// Sampling
				if( SAM && iLine==iCenterLine)
				{

					samLen+=segLen;
					if( samLen>= SAM.segmentLength)
					{
						// generate new sample
						if( (seg/stemLength)>kStartSample)
							samples.push( { P:pt.clone(), l:seg,I:I.clone(),J:J.clone() });
						
						// 
						samLen-=SAM.segmentLength;
					
					}
				
				}


				seg+=segLen;
				direction+=dirChange;
				if( seg<=stemLength)
				{
					x2+=J.x*segLen;
					y2+=J.y*segLen;
				}
			}
			stemLines.push(line);
			iLine++;
		}
		 if( stemLines[0] && stemLines[0].M_nb()>=2)
		 {
			 // end point 
			 var end = stemLines[0].M_endPoint(); 
			 let nbLines = stemLines.length;
			 // Make a path with stem for masking
			 var pathPoints = "M ";
			 if( true )		// this is oldschool ! 
			 {
				 var l1 = stemLines[0];
				 var l2 = stemLines[nbLines-1]; 
				 var nbpoints = l1.M_nb();		
				 for( let ip=0; ip<nbpoints; ip++)
				 {
					 let p =l1.M_getPoint(ip);
					 pathPoints+=(ip==0?"":" L ")+p.x+" "+p.y;				
				 }
				 nbpoints = l2.M_nb();		
				 for( let ip=nbpoints-1; ip>=0; ip--)
				 {
					 let p =l2.M_getPoint(ip);
					 pathPoints+=" L "+p.x+" "+p.y;				
				 }
				 // loop
				 let p = l1.M_getPoint(0);
				 pathPoints+=" L "+p.x+" "+p.y;				
				 
			 }
			 // remove lines if not filled  ( should avoid this silly work )  
			 if( (!opt.fillStem) && nbLines>2)
			 {
			 	stemLines=[ stemLines[0],stemLines.pop()];
			 }  
			 // for speeding up rendering, reverse points order for odd lines
			 let sign=-1;
			 for( let i=0; i<stemLines.length; i++)
			 {
			 	sign=-sign;
			 	if( sign<0)
			 		stemLines[i].M_reverseOrder();
			 }
			 
			 let out = { lines: stemLines, end:end, direction:direction}; 
			 if( SAM)
				out.samples= samples;
			 out.contourPath = 	new Path2D(pathPoints);
			 return out;

		}


		 // draw the stem lines 
		 //for( let il=0; il<stemLines.length; il++)
		 //{	S.m_groups.Dandelion.m_lines.push(...this.M_computeLineMask(stemLines[il]));
		 //}
		 let out = {lines:[],end:new RQVec2(opt.x,opt.y)}; 
		 return out;
	 
	}
  // ---------------------------------------------
  // DAISY
  // ---------------------------------------------
  M_putDaisy(opt)
  {
		var sz = opt.scale;

		var S = opt.S;
		var flowerRadius = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale*0.5;
		var spacing = (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;
		var stemHeight = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;

		var perspectiveReduction = this.m_depthScaleFactor*(1+1*S.random() ); 

		spacing+=flowerRadius;
		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] )/**-Math.sign(opt.x-this.W/2)*/ ; 

		//opt.x+=spacing*0.5;

		var segLen = opt.seg;
		
		// get lines for a stem
		opt.fillStem = S.m_isFillStem;
		var stemLines = this.M_getStem(opt,0,direction,stemHeight,S.m_stemWidth*opt.scale);
		var end = stemLines.end;
		direction = stemLines.direction;
		
		// Daiy flower center 
		var C = end; // new RQVec2( end.x +JDir.x*flowerRadius*0.8, end.y-JDir.y*flowerRadius*0.8);
		 var IDir = new RQVec2(Math.cos(direction*DEGTORAD),Math.sin(direction*DEGTORAD));
		 var JDir = new RQVec2(-IDir.y,IDir.x);




		// Draw the flower lines
		var nbPetals = 20;
		var petalWidth = 1.2*Math.PI*flowerRadius / nbPetals;
		var centerRadius = flowerRadius*0.32;
		var petalLength = flowerRadius-centerRadius; 
		var petalDecal = flowerRadius-petalLength;  
		var nbLines = Math.max( 8, 2*Math.round(2*Math.PI*flowerRadius / (petalWidth+this.m_strokeWidth+this.m_protectionStrokeWidth)/2));
		var a = 0;
		var aIncrement = 2*Math.PI/nbPetals;
		var Istem = new RQVec2(Math.cos(direction*DEGTORAD),-Math.sin(direction*DEGTORAD));
		var Jstem = new RQVec2(Istem.y,-Istem.x);
		var i=0;
		var petals = [];
		var IPetal = new RQVec2();
		var JPetal = new RQVec2();
		var heartL = new RQPolyLine();
		var nbPointsPetal = Math.max( 7,Math.round(30*sz));
		var petalAngleInc = 2*Math.PI/nbPointsPetal;
		
		var stack = [];
		var MV = new RQMatrix4();		// MV is at the center of the flower
		MV.M_rotate(direction,0,0,1);				// rotate in the bend direction of the flower
		MV.M_rotate(S.m_viewerOrientation,1,0,0);			// rotate in the direction of the viewer

		var closeAngleAmout= 40*S.random();
		let bendAmount = -2.5*petalWidth*S.random();
		for( a=0; a<2*Math.PI; a+=aIncrement)		// For each petal 
		{
			let L = new RQPolyLine();
			let aRnd = a + (S.random()-0.5)*Math.PI/15; 
			//IPetal.M_set(Math.cos(aRnd),Math.sin(aRnd));
			// JPetal.M_set(-IPetal.y,IPetal.x);
			stack.push(MV.clone());
			
			MV.M_rotate(aRnd/DEGTORAD,0,1,0).M_rotate(90-closeAngleAmout,1,0,0);
			
			let Plocal = new RQVec3() 
			let P = new RQVec2(); 
			let bendAngle = -25*DEGTORAD*Math.cos(aRnd);
			/*if( this.random() <0.2)
				bendAmount = 5*petalWidth*(this.random()-0.5)*/ 
			for( var ang=-Math.PI*0.5; ang<Math.PI*1.5; ang+=petalAngleInc)
			{	
				let ty =0.5*(1+Math.sin(ang) ); 
				// Plocal is a profile aligned vertically 
				Plocal.M_set( petalWidth*0.5 * Math.cos(ang), petalLength*ty ,0)
				Plocal.y += petalDecal; 
				Plocal.z = bendAmount*(1-Math.cos(ty*Math.PI/2));	// bend the petals
				let Pworld = MV.M_mutlipliedByVector(Plocal);
				//let Pproj = new RQVec2(Pworld.x,-Pworld.y + Pworld.z*this.m_depthScaleFactor);				
				//L.M_addPoint(Pproj.M_plus(C.x,C.y));
				L.M_addPoint(this.M_projection(Pworld,C) );
				
			
			}
			
			// round for the center 
			Plocal.M_set( 0,petalDecal,0);
			//P.M_set(  IPetal.x*Plocal.x + JPetal.x*Plocal.y, (IPetal.y*Plocal.x + JPetal.y*Plocal.y)*perspectiveReduction);
			//let Pworld = new RQVec2( C.x + IDir.x*P.x + JDir.x*P.y,   C.y - ( IDir.y*P.x + JDir.y*P.y)   );
			let Pworld = MV.M_mutlipliedByVector(Plocal);
			//let Pproj = new RQVec2(Pworld.x,-Pworld.y + Pworld.z*this.m_depthScaleFactor);				

			heartL.M_addPoint( this.M_projection(Pworld,C));

			petals.push({z:Pworld.z, L:L });
			
			MV = stack.pop();
		}
		
		// sort the petals by the z value
		petals.sort( function(a,b){ return a.z<b.z?1 : -1} );

		// Slightly move down the points so that the center of the heart matches the tip of the stem
		let offset = C.M_minus( RQMaths.M_getPointsBarycenter(heartL.m_points).g );
		heartL.M_translate(offset);
		

	
		// Draw the petals 
		let isPNG = this.m_outputFormat=="PNG";
		var context = this.m_mask.M_getContext();
		let isPassedCenter = false;
		var petalPaths = [];
		let simplified = C.y<this.H/2;
		let Fs,F;
		for(let ip = 0; ip<petals.length; ip++)
		{
			let petal = petals[ip];
			petal.L.M_translate(offset);
			if( (!isPassedCenter) && petal.z<=0)
			{
				isPassedCenter=true;
				// draw the center round
				if( S.m_isDrawHeart)
				{	
					//S.m_groups.DaisyHearts.m_lines.push( ...this.M_computeLineMask( heartL )); 
					this.M_drawLines(S.m_groups.DaisyHearts,heartL,true);
				}
				if( Array.isArray(Fs = S.m_groups.DaisyHearts.fills))
				{
					for( let f=0; f<Fs.length; f++)
					{
						if( F=Fs[f])
						{	F.orientation=S.random()*180;
							F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*S.random();
							//F.jointEnds=true;
							//F.m_lines.push( ...this.M_hatchShape( heartL ,F)); 
							this.M_fillShape(F,heartL,F);
						}
					}
				}
				// Draw the center in the mask 
				let path = new Path2D(heartL.M_getSVGPath(false));
				if(context )
				{	
				  context.fillStyle = "white";
				  context.fill(path);

					 if( this.m_isShortenJunctions)
					 {	 context.lineWidth = this.m_protectionStrokeWidth*2;
						 context.strokeStyle = "white";
						 context.stroke(path);
					 }

				}


			}
			// draw the lines
			if(!simplified)
			{	//S.m_groups.DaisyPetals.m_lines.push( ...this.M_computeLineMask( petal.L )) 
				this.M_drawLines(S.m_groups.DaisyPetals, petal.L,true);
			}
			// Fill that petal ( only in PNG mode )
			if(isPNG)
			{
				if( Array.isArray(Fs = S.m_groups.DaisyPetals.fills))
				{
					for( let f=0; f<Fs.length; f++)
					{
						if( (F=Fs[f]) && F.m_isFill)
							this.M_fillShape(F,petal.L,F);
					}
				}
				
			
			} 
			// draw the mask for this petal 
			let path = new Path2D(petal.L.M_getSVGPath(false));
			if( this.m_isShortenJunctions)
				petalPaths.push(path);
			if(context )
		  	{	
			  context.fillStyle = "white";
			  context.fill(path);
			}

		}
		if(simplified)		// TODO : reorder petals the initial way to improve plotting speed
		{	
			for(let ip = 0; ip<petals.length; ip++)
			{
				let petal = petals[ip];
				// expand points
				let p0 = RQMaths.M_getPointsBarycenter(petal.L.m_points).g ;

				//let p0 = petal.L.m_points[0];
				for (let ipp=0; ipp<petal.L.m_points.length; ipp++)
				{	let p = petal.L.m_points[ipp];
					let t = p.M_minus(p0);
					t.M_normalize().M_mul(1.5);
					//console.log("t="+t.M_getString()); 
					p.M_add(t);
				
				}
				//S.m_groups.DaisyPetals.m_lines.push( ...this.M_computeLineMask( petal.L )) 
				this.M_drawLines(S.m_groups.DaisyPetals, petal.L,true);

			}
		}

		// draw the stem lines 
		for( let il=0; il<stemLines.lines.length; il++)
		{	//S.m_groups.DaisyStem.m_lines.push(...this.M_computeLineMask(stemLines.lines[il]));
			this.M_drawLines(S.m_groups.DaisyStem, stemLines.lines[il],true);
		}
		// draw the stem in mask
		if( stemLines.contourPath)
		{
			context.fill(stemLines.contourPath);
			if( this.m_isShortenJunctions)
			{	context.lineWidth = this.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(stemLines.contourPath);
			}

		}
		
		
		// protect the contour of the flower
		 if( this.m_isShortenJunctions)
		 {	 context.lineWidth = this.m_protectionStrokeWidth*2;
			 context.strokeStyle = "white";
			 let path;
			 while( path=petalPaths.pop())
			 	context.stroke(path);
		 }


		
		return spacing;		  				  
  
  }
  // ---------------------------------------------
  // POPPY
  // ---------------------------------------------
  M_putPoppy(opt)
  {
		var sz = opt.scale;

		var S = opt.S;
		var flowerRadius = S.m_size.func.apply(this,[opt.x,opt.y,S.m_size.config] )*opt.scale*0.5;
		var spacing = (S.m_spacing.min+(S.m_spacing.max-S.m_spacing.min)*S.random())*opt.scale;
		var stemHeight = S.m_height.func.apply(this,[opt.x,opt.y,S.m_height.config] )*opt.scale;

		var perspectiveReduction = this.m_depthScaleFactor*(1+1*S.random() ); 

		spacing+=flowerRadius;
		var direction = S.m_torsion.func.apply(this,[opt.x,opt.y,S.m_torsion.config] )/**-Math.sign(opt.x-this.W/2)*/ ; 

		var segLen = opt.seg;
		
		// get lines for a stem
		opt.fillStem = S.m_isFillStem;
		var stemLines = this.M_getStem(opt,0,direction,stemHeight,S.m_stemWidth*opt.scale);
		var end = stemLines.end;
		direction = stemLines.direction;
		
		// Poppy flower center 
		var C = end;
		 var IDir = new RQVec2(Math.cos(direction*DEGTORAD),Math.sin(direction*DEGTORAD));
		 var JDir = new RQVec2(-IDir.y,IDir.x);




		// Draw the flower lines
		var nbPetals = Math.round(7+S.random()*3);
		var centerRadius = flowerRadius*0.12;
		var petalLength = flowerRadius-centerRadius; 
		var petalWidth = petalLength;
		var petalDecal = flowerRadius-petalLength;  
		var nbLines = Math.max( 8, 2*Math.round(2*Math.PI*flowerRadius / (petalWidth+this.m_strokeWidth+this.m_protectionStrokeWidth)/2));
		var a = 0;
		var petalRepartitionAngle =5*Math.PI; 
		var aIncrement = petalRepartitionAngle/nbPetals;
		var Istem = new RQVec2(Math.cos(direction*DEGTORAD),-Math.sin(direction*DEGTORAD));
		var Jstem = new RQVec2(Istem.y,-Istem.x);
		var i=0;
		var petals = [];
		var heartL = new RQPolyLine();
		var nbPointsPetal = Math.max( 7,Math.round(30*sz));
		var petalAngleInc = 2*Math.PI/nbPointsPetal;
		
		var stack = [];
		var MV = new RQMatrix4();		// MV is at the center of the flower
		MV.M_rotate(direction,0,0,1);				// rotate in the bend direction of the flower
		MV.M_rotate(S.m_viewerOrientation,1,0,0);			// rotate in the direction of the viewer

		var openAmout= 10;//40*S.random();
		let bendAmount = -2.5*petalWidth; //*S.random();


		let leafOpt = {segments:200,drawContour: true,bendBeta:45,spaceOrientation: S.m_viewerOrientation, size: petalLength, ratio: petalWidth/petalLength , segments:nbPointsPetal ,heartRad:centerRadius, profile: this.M_poppyPetalProfile, group:S.m_groups.PoppyPetals , centerLine :false };

		let Plocal = new RQVec3(); 
		let iPetal;
		for( a=Math.PI*S.random(),iPetal=0; iPetal<nbPetals; iPetal++)		// For each petal 
		{
			let MVpetal = MV.clone();
			
			MVpetal.M_rotate(a/DEGTORAD,0,1,0);
			MVpetal.M_translate(0,0,petalDecal);
			MVpetal.M_rotate(0+4*iPetal,1,0,0);
			Plocal.M_set( 0,0,0);
			let Pworld = MVpetal.M_mutlipliedByVector(Plocal);


			petals.push({z:Pworld.z, MV: MVpetal, opt:{...leafOpt} });
			a+=aIncrement;	
		}
		let aHeartInc =Math.PI*2/20; 
		for( a=0; a<Math.PI*2; a+=aHeartInc)
		{
			// round for the center 
			stack.push(MV.clone());			
			MV.M_rotate(a/DEGTORAD,0,1,0).M_rotate(45,1,0,0);
			let Plocal = new RQVec3() 
			Plocal.M_set( centerRadius,0,0);
			let Pworld = MV.M_mutlipliedByVector(Plocal);
			heartL.M_addPoint( this.M_projection(Pworld,C));
			MV = stack.pop();

		}
		// sort the petals by the z value
		petals.sort( function(a,b){ return a.z<b.z?1 : -1} );

		// Slightly move down the points so that the center of the heart matches the tip of the stem
		let offset = C.M_minus( RQMaths.M_getPointsBarycenter(heartL.m_points).g );
		heartL.M_translate(offset);
		

	

	
		// Draw the petals 
		let isPNG = this.m_outputFormat=="PNG";
		var context = this.m_mask.M_getContext();
		let isPassedCenter = false;
		var petalPaths = [];
		let Fs,F;
		let hasFill=false;
		for(let ip = 0; ip<petals.length; ip++)
		{
			let petal = petals[ip];
			if( (!isPassedCenter) && petal.z<=0)
			{
				isPassedCenter=true;
				// draw the center round
				if( S.m_isDrawHeart)
				{	
					this.M_drawLines(S.m_groups.PoppyHearts,heartL,true);
				}
				if( Array.isArray(Fs = S.m_groups.PoppyHearts.fills))
				{
					for( let f=0; f<Fs.length; f++)
					{
						if( F=Fs[f])
						{	hasFill = true;
							F.orientation=S.random()*180;
							F.spacing=F.m_spacing.min+ +(F.m_spacing.max-F.m_spacing.min)*S.random();
							//F.jointEnds=true;
							//F.m_lines.push( ...this.M_hatchShape( heartL ,F)); 
							this.M_fillShape(F,heartL,F);
						}
					}
				}
				// Draw the center in the mask 
				let path = new Path2D(heartL.M_getSVGPath(false));
				if(context )
				{	
				  context.fillStyle = "white";
				  context.fill(path);

					 if( this.m_isShortenJunctions)
					 {	 context.lineWidth = this.m_protectionStrokeWidth*2;
						 context.strokeStyle = "white";
						 context.stroke(path);
					 }

				}


			}
			// use draw leaf to draw a petal  
			let path2D = this.M_drawPetal(C.M_plus(offset),petal.MV,petal.opt);
			//console.log("Type = "+typeof path2D+" val = "+path2D);
			if(path2D && typeof path2D=="string")
				petalPaths.push(path2D);



		}

		// draw the stem lines 
		for( let il=0; il<stemLines.lines.length; il++)
		{	this.M_drawLines(S.m_groups.PoppyStem, stemLines.lines[il],true);
		}
		// draw the stem in mask
		if( stemLines.contourPath)
		{
			context.fill(stemLines.contourPath);
			if( this.m_isShortenJunctions)
			{	context.lineWidth = this.m_protectionStrokeWidth*2;
				context.strokeStyle = "white";
				context.stroke(stemLines.contourPath);
			}

		}
		
		
		// protect the contour of the flower
		 if( this.m_isShortenJunctions)
		 {	 context.lineWidth = this.m_protectionStrokeWidth*2;
			 context.strokeStyle = "white";
			for( let i=0; i<petalPaths.length; i++)
			{
			 	context.stroke(new Path2D(petalPaths[i]));
			}
		 }

		 // Draw a mask under the poppies petals by stacking a paper color background
		 if(isPNG &&hasFill)
		 {
		 	for( let i=0; i<petalPaths.length; i++)
		 	{
					this.m_canvasHeap.push({m:"fill",c:this.M_getColor("paper"),path:new Path2D( petalPaths[i]),l:petalPaths[i]});
			}
		}
		
		return spacing;		  				  
  
  }
	
	// M_drawPetal ( 3D approach )
	//  C : point where is leaf attached 
	//  opt.spaceOrientation
	//  opt.size 		: length(height) of leaf 
	//  opt.ratio 		: leaf width relative to height
	//  opt.segments	: nb segments for petal
	//  opt.profile		: profile for the petal {x(t),y(t)}
	//  opt.group		: group for leaf rendering
	//  opt.centerLine	: boolean
	//  opt.drawContour : boolean
	// 	opt.heartRad	: heartRadius


	M_poppyPetalProfile(t,opt)
	{
	   /*const thres=0.2;
	   let x = Math.sin(Math.pow(Math.max(t,thres),1.3)*Math.PI)*(t>=thres? 1: t/thres);
	
	   return {x: x, y : t>thres?Math.sin((t-thres)/(1-thres)*Math.PI*0.5 ) :0  };*/	
	  let x = Math.sin(t*Math.PI);
	  let y = Math.sin(t*Math.PI*0.5 ); 
	  let modFact = 2;
	  let rnd = 0.5*(1+noise.simplex2(opt.C.x+x*modFact,opt.C.y+y*modFact)); 				
	  let fact = 1+0.2*rnd*y*y*y;
	  
	  return {x: x*fact, y : y*fact };	
	
	}

	M_drawPetal(C,MV,opt)
	{
		let leafProfile = opt.profile;	// TODO
		opt.C = C;
		
		var spaceOrientation = opt.spaceOrientation || 25;
		MV.M_rotate(spaceOrientation,1,0,0);			// rotate in the direction of the viewer

		let sz = opt.size;
		// size : sets the ratio x/y 
		var size = new RQVec2( sz*(opt.ratio || 0.75), sz);


		let isVisible = this.m_documentArea.M_isPointInside(C); 
		if( !isVisible )
			return;

		// nbPoints : number of points on the leaf profile
		let nbPoints = opt.segments || 30;

	
		let leafWidth 	= size.x*0.5;
		let leafLen 	= size.y; 


	   let Plocal = new RQVec3() 
	   let P = new RQVec2(); 

		// bend alpha : angle of bend 
	   let bendAlpha = (opt.bendAlpha?opt.bendAlpha:2)*DEGTORAD;
	   let bendR  = Math.abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 1;
	   let bendBeta =  -(opt.bendBeta?opt.bendBeta:5)*DEGTORAD; //-90*Math.max(0.3,Math.abs(noiz))*DEGTORAD;				// ?
	   let bendRBeta = Math.abs(bendBeta)>0.02 ? leafWidth/bendBeta : 1 
	   var kProfile = 1./(nbPoints-1);
	   let L = new RQPolyLine(); 
	   var p0,p;
	   
	   let cutThres=0.2;
	   for( let i=0; i<2*nbPoints; i++)
	   {	
		   let aProfile = i*kProfile; 
		   p0= leafProfile.apply(this,[aProfile,opt]);
		   p = p0.y>cutThres ? {x:p0.x,y:p0.y-cutThres} : {x:p0.x,y:0} 
		   let kMap = 1-Math.pow(Math.max(0,p0.y-cutThres),3);  
		   let dz = (1-Math.cos( p.y*bendAlpha))*bendR; 
		   let y = bendR*Math.sin(p.y*bendAlpha);
		   // Plocal is a profile aligned vertically 

		   let dzBeta = (1-Math.cos( p.x*bendBeta))*bendRBeta; 
		   let x = bendRBeta*Math.sin(p.x*bendBeta);
			let dAng = x/(opt.heartRad*Math.PI);
			let rad= opt.heartRad+y;
			let pMap = new RQVec3(rad*Math.sin(dAng), y,rad*(Math.cos(dAng)-1));
			//Plocal.M_set( x, y,dz+dzBeta)	// ok
			Plocal.M_set( Plocal.x + (pMap.x-Plocal.x)*kMap, Plocal.y + (pMap.y-Plocal.y)*kMap, Plocal.z + (pMap.z-Plocal.z)*kMap);

			// P is the point oriented around the flower 
			let Pworld = MV.M_mutlipliedByVector(Plocal);			   
			   
			L.M_addPoint(  this.M_projection(Pworld,C ) );
		   
	   }
	   let O = C; 				
		//O.M_add(C);
		
	   // centerLine
	   let centerL = null;
	   /*
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
			   centerL.M_addPoint( this.M_projection(Pworld,C));
												
				y+=segLen;
			}  
	   }*/

		
	   // joint lines
	   var pathPoints = L.M_getSVGPath(true);
	   

		// Computing the normal and lighting
		let N = MV.M_rotateVector((new RQVec3(1,0,0)).M_cross( new RQVec3(0,1,0))).M_normalized(); 
		let lighting = (1+N.M_dot(this.m_lightSource))*0.5;
		lighting*=lighting;
		let lightMax = 1; 
		

		let drawContour = opt.drawContour; //this.m_drawLeafContour ; //opt.drawContour;

		let fills = opt.group.fills;
		if( Array.isArray(fills) )
		{
			for(let iF=0; iF<fills.length;iF++)
			{
				let F=fills[iF];
				this.leafFillCount = 0+this.leafFillCount+1;
				if( F && lighting<=lightMax)
				{	
					let o = MV.M_rotateVector(new RQVec3(0,1,0) );
					//let oProj = new RQVec2(o.x, -o.y + o.z*this.m_perspectiveFactor);  
					//F.leaves = {...opt};
					F.orientation= this.M_projectedOrientation(o); // Math.atan2(oProj.y,oProj.x)/DEGTORAD;
					F.spacing=  RQMaths.M_map( lighting,0.01,lightMax,F.m_spacing.min , F.m_spacing.max);
					//console.log("N="+N.M_getString()+" lighting="+lighting+" spacing="+F.spacing);
					//F.jointEnds=true;
					F.group = true;
					//F.m_lines.push( ...this.M_hatchShape( L[0] ,F)); 
					this.M_fillShape(F,L,F);
				}
			}	
		}
		else 
			drawContour = true;

	   // Draw the contour lines
	   if(drawContour)
		   //this.m_groups.Leaves.m_lines.push(...this.M_computeLineMask(L[0]));
			this.M_drawLines(opt.group,L,true);
		if( centerL)
			this.M_drawLines(opt.group,centerL,true);
		  // this.m_groups.Leaves.m_lines.push(...this.M_computeLineMask(centerL));
		

		// draw the leaf in the mask
		var path = new Path2D(pathPoints);
		if(this.m_mask)
		{	
			var context = this.m_mask.M_getContext();			
			context.fillStyle = "white";
			context.fill(path);
		}	
		return pathPoints;

	}	
	
	
	

	 M_hatchFuncGradient(P1,P2,opts)
	 {
			opts.spacing = RQMaths.M_map(P1.y,this.H,this.H*(1-this.m_documentHorizon),this.m_strokeBackground*0.5,this.m_strokeBackground*15);
		 	return new RQLine(P1,P2);
	 }


	 


	// ---------------------------------------------
	//  M_dandelionLeafProfile
	// ---------------------------------------------

	M_dandelionLeafProfile(t,opt)
	{
		let x= Math.sin(t*Math.PI);
		// wave 
		x-= Math.abs(Math.sin(t*Math.PI*opt.leaves.dandelionSpikes)*x*0.5);
		return {x:x,y:t};	
	}
	// ---------------------------------------------
	//  M_drawDandelionLeaf
	// ---------------------------------------------
	M_drawDandelionLeaf(MV,opt)
	{
	
		opt.leaves.dandelionSpikes = 5;		
	    opt.leaves.nbProfilePoints=50;
	   	opt.leaves.profile	= this.M_dandelionLeafProfile;
	   	opt.leaves.invProfile  = this.M_dandelionLeafInvProfile; 

	    this.M_drawLeaf( MV,opt);
	}


	// ---------------------------------------------
	// herb leaf
	M_herbLeafProfile(t,opt)
	{
		let x = Math.sin(Math.pow(t,0.4)*Math.PI);
		return {x: x, y : Math.sin(t*Math.PI*0.5 ) };	
	}
	M_herbLeafInvProfile(y,OL)
	{
		let t= Math.asin(y)/( Math.PI*0.5 );
		let x= Math.sin(Math.pow(t,0.4)*Math.PI); 	
		return {x:x,t:t};
	}

 
	

	// ---------------------------------------------
	// clover leaf
	M_cloverLeafProfile(t,opt)
	{
	   // Y² + X² = 1
	   // y = sqrt( 1-X²) 
	   // avec x € [-1;1] ==> x = 2*(t-0.5)
	   //let x =  2*t-1;
	   //x = Math.sqrt(1-x*x)
	   let x = Math.sin(Math.pow(t,0.8)*Math.PI);
	   return {x: x, y : Math.sin(t*Math.PI*(0.5+opt.leaves.heartShape ))  };	
	}
	M_cloverLeafInvProfile(y,OL)
	{
		let t= Math.asin(y)/( Math.PI*(0.5+OL.heartShape) );
		let x= Math.sin(Math.pow(t,0.8)*Math.PI); 	
		return {x:x,t:t};
	}
	M_ashLeafProfile(t,opt)
	{  
	   let n = opt.leaves.ashLeaves; 
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
	   {	tt*=opt.leaves.orient[i].sz;
	   		y+=tt*opt.leaves.orient[i].o-x;
	   		//y+=tt*0.3-x;
		}
	   return {x: tt, y : y- (Math.min(t1-0.1,0)/-0.1-1)/n };	
	}


	M_drawCloverLeaf(MV,opt)
	{
	   this.M_drawLeaf( MV,opt);
	}


};
class GrassExperiments extends GrassAlgorithm
{
	constructor()
	{
		super("GrassExperiments");
	}


	M_projection( P, Porigin2D)
	{
		let Pproj = new RQVec2(P.x, -P.y + P.z*this.m_perspectiveFactor);				
		if( typeof Porigin2D==="object")
		{	Pproj.M_add(Porigin2D);
		}
		else if(A.m_origin2D)
			Pproj.M_add(A.m_origin2D);
		else
			Pproj.y+=this.m_workArea.top();

		// TEST
		//let dest = new RQVec2(Pproj.x+100*Math.cos(Pproj.y/this.H*Math.PI*20) ,Pproj.y - 50*Math.sin(Pproj.y/this.H*Math.PI*14));
		//let dest = new RQVec2(30*Math.round(Pproj.x/30) ,Pproj.y - 50*Math.sin(Pproj.y/this.H*Math.PI*14));
		if( (!this.m_deformersActive) || ( this.m_scatterFunc=="None")
			|| ( this.m_currentY>(this.m_workArea.top()-this.m_scatterYStart))
		)
			return Pproj;
		else
		{
			let dest;
			switch(this.m_scatterFunc)
			{
				default:
				case "Columns":
					dest = new RQVec2(this.m_scatterParams.width*Math.round(Pproj.x/this.m_scatterParams.width) ,Pproj.y);
					break;
				case "Grid":
					dest = new RQVec2(this.m_scatterParams.width*Math.round(Pproj.x/this.m_scatterParams.width) ,this.m_scatterParams.height*Math.round(Pproj.y/this.m_scatterParams.height));
					break;
				case "VerticalSine":
					dest = new RQVec2(this.m_scatterParams.width*Math.round(Pproj.x/this.m_scatterParams.width)+this.m_scatterParams.width*0.5*Math.sin(Math.PI*Pproj.y/this.m_scatterParams.height) ,Pproj.y);
					break;
				case "Sine":
					dest = new RQVec2(Pproj.x+this.m_scatterParams.width*0.5*Math.sin(Math.PI*Pproj.y/this.m_scatterParams.height) ,Pproj.y);
					 
					break;
				case "Circle":
					{
						let c=this.m_workArea.center();
						let r = Pproj.M_dist(c);
						let ang= Math.atan2(Pproj.y-c.y,Pproj.x-c.x);
						r = this.m_scatterParams.width*Math.round(r/this.m_scatterParams.width);
						dest = new RQVec2(c.x+r*Math.cos(ang),c.y+r*Math.sin(ang));
					}
					break;
				case "Swirl":
					{
						let c=this.m_workArea.center();
						let r = Pproj.M_dist(c);
						let ang= Math.atan2(Pproj.y-c.y,Pproj.x-c.x);
						let rx =this.m_scatterParams.height; 
						if( rx>0.1) r = rx*(Math.round(r/rx)+Math.cos( ang/2));
						if(r>0.1) ang+=this.m_scatterParams.width/r;		// hmmmm .. nbof
						dest = new RQVec2(c.x+r*Math.cos(ang),c.y+r*Math.sin(ang));
					}
					break;
			
			}
			let amount;
			if(this.m_scatter && this.m_scatter.func )
				amount= this.m_scatter.func.apply(this,[Pproj.x,Pproj.y,this.m_scatter.config] );
			else 
				amount = Math.pow(Pproj.y/this.H,1.5);		// bottom up
			
			 
			Pproj.x += (dest.x-Pproj.x)* amount; 
			Pproj.y += (dest.y-Pproj.y)* amount; 
		}
		return Pproj;
	}


	M_getProjectionFunc()
	{
		return this.M_projection;
	}

	async M_initVariables()
	{
		// call super
		await GrassAlgorithm.prototype.M_initVariables.call(this);
		this.m_segLength = 0.5*this.upscale;
		// my variables
		this.M_readParametricVariable(this,"scatter",1.0,false); 			

		this.m_scatterFunc = this.M_get("scatterFunc","None");
		this.m_scatterParams = this.M_get("scatterParams",{width:2,heigth:4}); for(var a in this.m_scatterParams) this.m_scatterParams[a]*=this.upscale;
		this.m_scatterYStart = this.M_get("scatterYStart",0); this.m_scatterYStart*=this.upscale;

		this.m_foregrounds = this.M_get("foreground");
		for( let i=0; i<this.m_foregrounds.length; i++)
		{ 	let S = this.m_foregrounds[i];
			if(S.M_getBool("isActive",false))
			{
				switch(S.m_name)
				{
					case "ForegroundRain":
						S.group = this.M_declareSvgGroup('GrassExperiments'	, "Rain",true);
						S.m_nb = S.M_getInt("nb",1000);
						S.m_angle = S.M_getFloat("angle",{ang:20,span:20});	
						S.m_length = S.M_getFloat("length",20);	S.m_length*=this.upscale;	
						break;
				}
			}
		}
		this.m_isMustEraseFirst = false;

	}
	async M_startAlgorithm()
	{
		// trick the background species
		if(this.m_background)
		for(let i=0; i<this.m_background.length; i++)
		{
			if( this.m_background[i].A)
			{  
				// something ...
			}
		}
		// Foregrounds
		if( this.m_foregrounds)
		{
			for(let i=0; i<this.m_foregrounds.length; i++ )
			{	let S=this.m_foregrounds[i];
				if(S.M_getBool("isActive",false))
				{	switch(S.m_name)
					{
						case "ForegroundRain":			
						this.M_drawRain(S);
						break;
					}
				}
			}
		
		}
		
		
		
		// call super
		await GrassAlgorithm.prototype.M_startAlgorithm.call(this);
	
	}
	VM_onLineOfGrassBegin(yFrac)
	{
		if( false )
		// random dots in the mask to simulate fog
		if( yFrac>-0.05 && this.m_mask)
		{
			let dash = true;
			let nb=dash?200:2000;
			let context = this.m_mask.M_getContext();
			let stroke = 0.1*this.upscale;
			let len = dash ? 20*this.upscale : stroke;
			context.strokeStyle="white";
			context.lineWidth = stroke;
			for( let i=0; i<nb ; i++)
			{
				let P=new RQVec2( Math.random()*this.W, Math.random()*this.H);
				let P2 = P.M_plus(len,0);
				let L = new RQLine(P,P2);
				let path= new Path2D(L.M_getSVGPath());
				context.stroke(path);

			}

		}

	}

	M_drawRain(S)
	{
		this.M_log("Drawing rain ...");
		this.M_seed( parseInt(this.m_seed),"Rain");	
		let nbDrops = S.m_nb;
		let angleRain = S.m_angle.ang;
		let angleAmp = S.m_angle.span;
		let isDrawLines = S.M_getBool("isDrawLines",true);
		let length = S.m_length;
		let u = new RQVec2(); 
		let sz = 1;
		let szMin = 0.3;
		let context = this.m_mask.M_getContext();
		context.lineWidth = S.M_getFloat("maskStrokeWidth",1)*this.upscale;
		context.strokeStyle = "white";
		let y=1;
		let yMax = 0.95;
		let yMin=0.3;
		let decreaseSz = (sz-szMin)/nbDrops;	
		let t=1;
		let tm = 1/nbDrops;
		let Ls=[];
		for(let i=0; i<nbDrops; i++)
		{
			let angle = (angleRain + angleAmp*(this.randomRain()-0.5))*DEGTORAD;
			u.x = -Math.sin(angle)
			u.y =-Math.cos(angle);
			let p1 = new RQVec2(this.randomRain()*this.W,this.randomRain()*this.H*y);
			let len = length*sz*(0.8+0.4*this.randomRain());
			let p2 = new RQVec2 (p1.x+len*u.x,p1.y+len*u.y); 	
			let L = new RQLine(p1,p2);
			L.strk = 0.8*this.upscale*sz;
			y=yMin+(yMax-yMin)*Math.pow(t,3);
			sz-=decreaseSz;		
			t-=tm;
		}
		for( let i=0;i<Ls.length; i++)
		{
			let L = Ls[i]; 
			if(isDrawLines)
				this.M_drawLines(S.group, L, true);
			
			let path = new Path2D(L.M_getSVGPath(false));
			context.lineWidth = L.strk;
			context.stroke(path);
		}
	
	}

};
