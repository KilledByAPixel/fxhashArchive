class YZAlgo extends PatternAlgorithm
{
	constructor(name)
	{
		super(name??"YZAlgo");
		this.m_worldsDefinitions=[];
        this.m_worlds=[];
        this.m_nbWorlds = 0;    // nb of pedestals
        this.m_worldRndOrder=null;
        this.isDebugImprint = false;
        this.m_worldsMixable = true;
        this.m_defaultWorld={
            bgColor:"paper*rgba(240,255,240,0.2)/0.9",
            earthColor:"rgba(0,40,0,0.8)",
            sky: {strokeColor:"rgba(255,255,255,0.8)"},
            plants : {
                strokeColor :"rgba(0,40,0,0.8)",
                fill        :{color:"rgba(255,255,255,0.5)", active:true},
            
                species :{
                    RootsSunflower : {
                        Hearts: { fill:{color:"rgba(0,80,0,0.5)",active:true}}
                    },
                    RootsBigFlower : {
                        Hearts: { fill:{color:"rgba(0,80,0,0.5)",active:true}}
                    },
                    RootsFern:{
                        Branches:{fill:{color:"paper"},active:true}
                    },
                    RootsFlower:{
                        fill:{color:"white"},
                        Hearts:{ fill:{color:"rgba(0,80,0,0.5)",active:true}}

                    }

                }
            },
            blocks: {
                /*strokeColor:"white",
                fill:{active:true,color:"rgba(0,60,0,0.8)"},
                colors_:{
                    Lines1:{strokeColor:"yellow"},
                    Lines2:{strokeColor:"green"},
                    Lines3:{strokeColor:"red"},
                }
                */
                // Testing Mondrian
                strokeColor:"black",
                fill:{active:false,color:"paper*rgba(241,241,241,1.0)"},
                colors: {
                    Lines1 : { strokeColor:"rgba(221,1,0,1.0)",fill:{active:true,color:"paper*rgba(221,1,0,0.5)"}}, // red
                    Lines2 : { strokeColor:"rgba(34,80,149,1.0)"}, // blue 
                    Lines3 : { strokeColor:"rgba(253,184,39,1.0)"}, // yellow
                    Lines4 : { strokeColor:"rgba(241,241,241,1.0)"}, // "white"
                    Lines5 : { strokeColor:"rgba(35,18,11,1.0)"}, // "black"
                }
      

            }
        };
        this.m_sandLines=[];

        let makeRotate=(ang,k)=>{ 
            let co=Math.cos(ang*DEGTORAD);
            let si=Math.sin(ang*DEGTORAD);
            return (x0,y0,x,y)=>{return {x:x0+k*(x*co-y*si),y:y0+k*(x*si+y*co)}}

        }
        this.m_groundPatterns=[
            {   name:"shadow1",
                vertical:{rnd:0.1},
                horiz:{rnd:1,yShift:0.3,length:{dense:0.7, scarce:0.1}}
            },
            {   name:"grid",
                vertical:{rnd:0.5},
                horiz:{rnd:0.5,yShift:0, length:{dense:0.9, scarce:0.3}}
            },
            {   name:"horizLines",
                vertical:{rnd:0},
                horiz:{rnd:1,yShift:0, length:{dense:1, scarce:0.2}}
            },
            {   name:"diagonal",
                diagonal : makeRotate(45,1.414),
                vertical:{rnd:0.3},
                horiz:{rnd:1,yShift:0, length:{dense:0.5, scarce:0.2}}
            },

        ]
        this.M_forceFeatureName=(n,v)=>{}
    }

	// Declares all the groups that a sketch can contain
	VM_declareSvgGroups()
	{
		// Registered pluggins : declare groups should be elsewhere TODO
		//this.M_declareSvgGroup('',"Sky", true, {m_strokeWidth:1, m_strokeColor:"black",m_paletteTag:"custom"});
		this.M_declareSvgGroup('',"Ground", true, {m_strokeWidth:2, m_strokeColor:"black",m_paletteTag:"custom"});
		this.M_declareSvgGroup('',"GroundLines", true, {m_strokeWidth:2, m_strokeColor:"black",m_paletteTag:"custom"});
		this.M_declareSvgGroup('',"SkyPattern", true, {m_strokeWidth:0.25, m_strokeColor:"black",m_paletteTag:"custom"});
		this.M_declareSvgGroup('',"Debug", true, {m_strokeWidth:1, m_strokeColor:"rgba(255,0,0,0.7)",m_paletteTag:"custom"});
		this.M_declareSvgGroup('',"Debug2", true, {m_strokeWidth:1, m_strokeColor:"rgba(255,0,0,0.7)",m_paletteTag:"custom"});

	}

    // --------------------
    // M_choseWorldsIds
    // will precalculate with fxrand function the ids of selected worlds
    // --------------------
    M_choseWorldsIds(rndFunc)
    {   rndFunc??=this.random;
        // register a default world
        if(this.m_worldsDefinitions.length==0)
            this.M_registerWorld("Default",  this.m_defaultWorld );
        
        if( this.m_nbWorlds==0)
        {
            this.m_nbWorlds = Math.max(1,this.M_getInt("nbWorlds",1)??1); 

            // function to shuffle the indexes 
            let rndOrder = [];
            for(let i=0;i<this.m_nbWorlds;i++)
                rndOrder.push({iOrder:i,rnd:rndFunc()});
            rndOrder.sort((a,b)=>a.rnd<b.rnd? -1:1);
            this.m_worldRndOrder=rndOrder;

        }
    }
    // --------------------
    // M_makeWorlds
    // chose the parameters of the various worlds
    // will be called at load time 
    // because features can be impacted
    // --------------------
    M_makeWorlds()
    {
        let debug=false;
        this.m_compoDebug=[];

        // Analysis of the species to know their height 
        this.m_speciesMaxHeight = 0;
        for( let is=0; is<this.m_species.length; is++)
        {
            let S=this.m_species[is];
            if( S.m_isActive && S.M_getMaxHeight)
            {   let maxHeight = S.M_getMaxHeight();
                //console.log(`maxHeight for ${S.m_name} = ${maxHeight}`);
                if(this.m_speciesMaxHeight<maxHeight)
                {   this.m_speciesMaxHeight = maxHeight;

                }
            }
        }

        this.M_choseWorldsIds();

        // Lead distribution
        this.m_blocksDistribution = this.M_get("blocksDistribution","random");


        if( this.m_nbWorlds<1 || (!this.m_worldRndOrder) || this.m_worldRndOrder.length!=this.m_nbWorlds)
        {   console.warn("Error with worlds list");
            return;
        }
        // 
        let globAnalysis={}
        let worldDef;
        // Create worlds
        for( let i=0; i<this.m_nbWorlds; i++)
        {   
            let iShape = i;  // x position

            if(this.m_worldsMixable || (worldDef===undefined))
                worldDef = rndArray(this.m_worldsDefinitions,this.random);
            
            let world = {...worldDef,iShape:iShape};    // Make a copy of a world definition
            world.iOrder = this.m_worldRndOrder[i].iOrder;
            //console.log(`world ${i} iOrder=${world.iOrder}`);
            world.groundPattern = rndArray( this.m_groundPatterns,this.random);
            
            // Choosing world scale
            let worldScale;
            if( this.m_nbWorlds==1)
                worldScale = 1.2+0.9*this.random()
             else 
                worldScale= (world.iOrder==0)? 1.5+0.9*this.random() : 1.0+0.5*this.random();
            
            // set distribution for 1st block
            if(i==0)
            {    world.dist = this.m_blocksDistribution;
            }

            // just gradient if it's there ( before reading gradients )
            if(world.bgGradient && this.activateGradient)
                this.activateGradient(world.bgGradient);

            // Create options for the grid
            let opt =
            {   dimensions:{width:this.W/this.m_nbWorlds,depth:this.W/this.m_nbWorlds},
                center : new RQVec2(),
                MV : new RQMatrix4()
            }
            if(this.random()<0.2)
            {   world.yRotate=0;
            }
            else
            {   world.yRotate=-45+90*this.random()    
                opt.MV.M_rotate(world.yRotate,0,1,0);   // Rotate left right
            }
            world.MV=opt.MV;

            // x Position is given by iShape ( id from left to right )
            opt.center.x = iShape*this.W/this.m_nbWorlds+opt.dimensions.width/2;
            opt.relief  ={amplitude:opt.dimensions.width*0.3*(0.2+0.8*this.random()), fact:0.5+2*this.random()}
            
            // Parameters analysis to make a valid composition
            // use this.m_speciesMaxHeight to evaluate the height of all.

            // get the scale function 
            let scales = {max:worldScale, min:this.m_depthScaleFactor*worldScale}
            let hSpeciesBg = scales.min*this.m_speciesMaxHeight;
            //console.log(`hSpeciesBg=${hSpeciesBg}`);

            // Set a random yCenter, we'll adjust later
            opt.center.y = this.H*(0.6+(this.random()-0.5)*2*0.25); 


            // Create a base grid object, to estimate its amplitude
            let grid = this.M_getGridBaseObject(opt);
            
            // get the max Y at background
            const getFloors=(iz)=>{
                let bounds={};
                for(let ix=0; ix<=grid.nbX; ix++)
                {   
                    let pFloor=grid.extendedFunc(ix,iz);
                    let pProj=grid.projection(pFloor);
                    if( pProj.x>this.m_workArea.x && pProj.x<this.m_workArea.right())
                    {   
                        //if(debug) this.m_compoDebug.push({tag:"point",pt:pProj,color:i==0?"blue":"green"});

                        if(bounds.top===undefined)
                        {   bounds.top=bounds.bottom=pProj.y;
                        }
                        else
                        {   if(bounds.top<pProj.y) bounds.top = pProj.y;
                            if(bounds.bottom>pProj.y) bounds.bottom = pProj.y;
                        }

                    }
                }
                bounds.median = (bounds.top+bounds.bottom)/2;
                return bounds;
            }


            
            let yHorizon = getFloors(grid.nbZ).median;
            let yTopSpecie = yHorizon-hSpeciesBg;
            
            // get yFloor
            let bottomFloor = getFloors(0);
            let yFloor = bottomFloor.median;
            
            // image height == the visible (interesting part) of the image
            let imageHeight = yFloor-yTopSpecie;
            let analysis=null;
            let emergencyShift = true;
            if( this.m_nbWorlds==1)
            {   
                // if the image fits
                if(imageHeight<this.m_workArea.h)
                {   emergencyShift=false;
                    // distribute evenly
                    let available=this.m_workArea.h-imageHeight;
                    let idealFloor=this.m_workArea.top()-available/3;
                    let newFloor = idealFloor+(available/3)*2*(this.random()-0.5);
                    let rectif = newFloor-yFloor;
                    opt.center.y+=rectif;
                    if(debug) this.m_compoDebug.push({tag:"horiz",y:newFloor,color:"pink"});
                    if(debug) this.m_compoDebug.push({tag:"horiz",y:bottomFloor.bottom+rectif,color:"blue"});
                    if(debug) this.m_compoDebug.push({tag:"horiz",y:bottomFloor.top+rectif,color:"blue"});
        
                }
                else
                {   emergencyShift=true;

                }
            
            }
            else    // multiworlds
            {
                let available=this.m_workArea.h-imageHeight;
                let floorSpan = {min:this.m_workArea.top()-available*0.85,max :this.m_workArea.top()-available*0.05}
                let toCenter = opt.center.y-yFloor;
                let span = { min:floorSpan.min+toCenter, max:floorSpan.max+toCenter}
                span.median = (span.min+span.max)/2;

                analysis = {imgHeight:imageHeight,topSpecie:yTopSpecie,bottom:bottomFloor,span:span,opt:opt};

                if(i==0) globAnalysis={...analysis};
                else
                {   if( globAnalysis.topSpecie<yTopSpecie)  globAnalysis.topSpecie=yTopSpecie;
                    if( globAnalysis.bottom>bottomFloor) globAnalysis.bottom=bottomFloor;
                }
                emergencyShift=false;
            }
             
            // Simple height test
            if( emergencyShift && yTopSpecie<this.m_workArea.y)
            {   let dy = this.m_workArea.y-yTopSpecie;
                if((yFloor+dy)>this.m_workArea.top())
                {   // we'd like to center the whole zone vertically 
                    dy = this.H/2-(yTopSpecie+yFloor)/2
                }
                opt.center.y+=dy;

            }
            if(debug)
            {   // get new markers after the shift
                let btmFloor = getFloors(0);

                if(debug) this.m_compoDebug.push({tag:"horiz",y:btmFloor.bottom,color:i==0?"blue":"green"});
                if(debug) this.m_compoDebug.push({tag:"horiz",y:btmFloor.top,color:i==0?"blue":"green"});
            }


            // push it into the worlds list
            this.m_worlds.push({world:world,scale:worldScale,opt:opt,analysis:analysis});
        }
        // multi-worlds arrangement
        if(this.m_nbWorlds>1)
        {   // globAnalysis gives the span of action
            let imageHeight = globAnalysis.bottom - globAnalysis.topSpecie;
            // make a cosine function
            let angShift=Math.PI*this.random();
            let angSpan=2*Math.PI/(this.m_nbWorlds+1)*(0.8+0.4*this.random())*Math.sign(this.random()-0.5);
            for( let i=0; i<this.m_nbWorlds; i++)
            {   let an=this.m_worlds[i].analysis;
                //console.log("an="+RQPrintR(an,2));

                let k = Math.sin(angShift+this.m_worlds[i].world.iShape*angSpan);
                //console.log("New world y= "+(an.span.median+ (an.span.max-an.span.min)*k/2));
                this.m_worlds[i].opt.center.y =an.span.median+ (an.span.max-an.span.min)*k/2;
            }


        }

        // Sort the worlds in different order for display
        this.m_worlds.sort((a,b)=>a.world.iOrder>b.world.iOrder?1:-1);



        // Test undefining the sky pattern
        if(false)
        {
            this.M_forceFeatureName('Sky pattern',"None");
            this.m_variables.hasSkyPattern.m_value="false";
        }
    }

    M_preInit()
    {
        if(!this.preInitDone)
        {
            this.preInitDone=true;
            this.svg= this.M_makeObjectSVG( "mainSVG",this.W,this.H );
		
            this.M_log("seed = "+this.m_seed);
    		this.M_seed(this.m_seed);
		    noise.seed(this.random());
    
    
            this.M_createMaskCanvas();
            this.M_createClipCanvas();
            this.m_isUseMask=this.M_getBool("isUseMask");
            this.M_getAnimationParameters();
        
            // SVG
            this.M_getSvgProperties();
            var style= this.M_getStyleAsString();
            this.svg.append(	this.M_makeDefaultSvgGroup("0",style) );
            this.VM_declareSvgGroups();
    
            // Fixed depth scale
            this.m_depthScaleFactor = 0.6;

            // SPECIES values
    		this.M_initSpeciesVariables();

            // Make worlds
            this.M_makeWorlds();


        }

    }

	M_init(isAutorun)
	{
		
        this.M_preInit();

		this.M_initVariables().then( ()=>
		{
			this.M_applySvgGroupsToSelect();
				if(isAutorun && !this.m_isAnimation)
					this.M_startAlgorithm();		
		
		});
		this.M_applyArtwork();
		this.M_applyPaperColor();

		this.M_showWorkCanvases();
		
	}
	async M_initVariables()
	{
		// textures 
		await this.M_createTextures();

        // Backgrounds
		this.m_backgrounds = this.M_get("background");
		for( let i=0; i<this.m_backgrounds.length; i++)
		{ 	this.M_readBackgroundVars(this.m_backgrounds[i]);
		}

        // Sky pattern
        this.m_hasSkyPattern = this.M_getBool("hasSkyPattern",false);
        this.m_skyPattern = this.M_get("skyPattern","default");
        this.m_skyPatternShape = this.M_get("skyPatternShape","circle");

        // Foregrounds ( TEMP )
        this.m_foregrounds = this.M_get("foreground");
		for( let i=0; i<this.m_foregrounds.length; i++)
		{ 	let S = this.m_foregrounds[i];
			//if(S.M_getBool("isActive",false))
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

	}
	// M_initSpeciesVariables
	// -------------------------
	M_initSpeciesVariables(vars)
	{

		if(vars===undefined)
			vars = this;
		this.m_segLength= 2*this.upscale;


		this.m_species= PlantSpecies.M_createFromVars( this,vars.M_get("species") );
        if(!this.m_speciesRandomDone)
            this.M_initSpeciesRandom();
        // Init
        for( let i=0; i<this.m_species.length; i++)
            this.m_species[i].M_init(this);


	}
    M_initSpeciesRandom()
	{
		this.m_speciesRandomDone = true;
		for( let is=0; is<this.m_species.length; is++)
		{
			let S = this.m_species[is];
			let sSeed = S.M_getInt("seed",this.m_seed );
            if( sSeed==0)
                S.random=this.random;
            else
                S.random=sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162,sSeed);

        }
	}

	// M_startAlgorithm
	// -------------------------
	async M_startAlgorithm()
	{
		if(this.m_isMainAlgorithm && this.m_isMustEraseFirst)
		{	this.M_clearDrawing();		
			//this.M_clearLog();
			this.M_clearMask();
		}
		// reinit the seed
		//this.M_seed(this.m_seed);
		//noise.seed(this.random());
		if( !this.m_speciesRandomDone)
			this.M_initSpeciesRandom();

            

		await this.M_doAlgorithm().then(
			function(){
                this.M_log("Done !");
                // Trigger fxHash preview 
                if(this.fxPreview)
                    this.fxPreview();
        
            }.bind(this),
			function(error){console.error("Ooops error in the async function",error);}
		);
	
	
	
	}

    // -------------------------
    // M_registerWorld
    // -------------------------
    M_registerWorld(name,world)
    {   this.m_worldsDefinitions.push(world);
        world.name=name;
        return world;
    }

    // -------------------------
    //  M_applyWorld
    // -------------------------
    M_applyWorld(world )
    {   if(!world) return;
        let log=false;
        // Store the world into the main algorithm
        this.world=world;
        // world.name is compromised !
        // Function to read settings
        let readColorAndFill=(set,path)=>{
            if(set)
            {   set.path=""; set.path+=path;
                set.strokeColorComputed = set.strokeColor ? this.M_getColor(set.strokeColor):null;
                set.strokeWidthComputed = set.strokeWidth ? set.strokeWidth*this.upscale : null;
                if(log&&set.strokeColorComputed)console.log(`(${path}) got stroke color=${set.strokeColor} => ${set.strokeColorComputed}`)

                if(set.fill)
                {   set.fill.colorComputed = set.fill.color ? this.M_getColor(set.fill.color):null;
                    if(log && set.fill.colorComputed)console.log(`(${path}) got FILL color=${set.fill.color} => ${set.fill.colorComputed}`)
                }
            }
        }
        // Function to apply settings to a group
        let applySettings=(F,sets)=>{
            if(F && Array.isArray(sets))
            {
                // stroke width
                for(let i=0; i<sets.length;i++)
                {   if( sets[i] && sets[i].strokeWidthComputed)
                    {   F.m_strokeWidth =sets[i].strokeWidthComputed;
                        if(log)console.log(`Applying strokeWidth (priority ${i+1}) : ${F.m_strokeWidth}`);
                        break;
                    }
                }
                // stroke color
                for(let i=0; i<sets.length;i++)
                {   if( sets[i] && sets[i].strokeColorComputed)
                    {   F.m_paletteTag="custom"; 
                        F.m_strokeColor =sets[i].strokeColorComputed;
                        if(log)console.log(`Applying strokeColor (priority ${i+1}) : ${F.m_strokeColor}`);
                        break;
                    }
                }
                
                // stroke active
                for(let i=0; i<sets.length;i++)
                {   if(sets[i] && sets[i].strokeActive!=undefined)
                    {
                        F.m_active=sets[i].strokeActive;
                        // TODO :reset to default value if needed
                    }

                }
                // Fill color 
                let Fs=F.fills;
                if( Array.isArray(Fs))
                {   if(log)console.log(`Got array of fills for group ${F.name}`);
                    for( let f=0; f<Fs.length; f++)
                    {   let fillGroup=Fs[f];
                        let hasSetColor=false;
                        for(let i=0; i<sets.length;i++)
                        {   
                            if(sets[i]&&sets[i].fill)
                            {   fillGroup.m_savedColor??={tag:fillGroup.m_paletteTag,color:fillGroup.m_strokeColor,active:fillGroup.m_active}
                                if(sets[i].fill.colorComputed)
                                {   fillGroup.m_paletteTag="custom"; 
                                    fillGroup.m_strokeColor =sets[i].fill.colorComputed;
                                    if(log)console.log(`Applying fill color (priority ${i+1}) ${fillGroup.m_strokeColor} active:${fillGroup.m_active} `);
                                    hasSetColor=true;
                                }
                                if(sets[i].fill.active!==undefined)
                                {   fillGroup.m_active = sets[i].fill.active;
                                    if(log)console.log(`Applying fill active (priority ${i+1}) ${fillGroup.m_active}`);
                                    hasSetColor=true;
                                }
                                break;
                            } 
                        }
                        // restore default
                        if((!hasSetColor)&& fillGroup.m_savedColor)
                        {
                            fillGroup.m_paletteTag=fillGroup.m_savedColor.tag; 
                            fillGroup.m_strokeColor =fillGroup.m_savedColor.color;
                            fillGroup.m_active = fillGroup.m_savedColor.active;
                        }
        
                    }
                }else
                {
                    if(log)console.warn(`no array of fills for group ${F.name} - and F.fill=${F.fill}`);
                }
        
            }
        }

        if(log)console.group(`M_applyWorld(${world.name})`);
        let settings=[world.plants,world.blocks,world.yazid]
        let path;
        for(let i=0; i<settings.length;i++)
        {   let set=settings[i];
            if(set)
            {   
                if(i==1)    // blocks
                {   set.species??={ RootsExamples:set.colors};
                }

                path = ["plants","blocks","yazid"][i];
                if(log)console.log(`Reading set ${path}`);
                readColorAndFill(set,path);
                if( set.species)
                {   for(let specieName in set.species)
                    {   let path2=path+"/"+specieName;
                    
                        let specieSet=set.species[specieName];
                        if(specieSet)
                        {   if(log)console.log(`Reading specieSet ${specieName}`);
                            readColorAndFill(specieSet,path2);

                            for(let groupName in specieSet)
                            {   if( !["strokeColor","strokeColorComputed","strokeWidth","strokeWidthComputed","fill","path"].includes(groupName))
                                {   let path3=path2+"/"+groupName;
                                    
                                    let customSet = specieSet[groupName];
                                    if(typeof customSet==="object")
                                        readColorAndFill(customSet,path3)
                                    else
                                        if(log)console.warn(`Not an object at path "${path3}" : ${customSet}`);
                                }                                            
                            }
                        }
                    }

                }
            }

        }
        if(true)
        {   
            for(let is=0; is<this.m_species.length; is++)
            {
                let S=this.m_species[is];
                if(log)console.group(`specie : ${S.m_name}`);
                let set=S.m_name=="RootsExamples"? world.blocks: S.m_name=="RootsYazid"? world.yazid : world.plants
                

                // all groups
                if(set)
                {   let setSpecie = set.species && set.species[S.m_name]?set.species[S.m_name]:null;
                    if( log)
                    {   if(setSpecie) console.log(`Got a set for specie ${S.m_name}`);
                        else console.log(`Got no set for ${S.m_name}`);
                    }
                    for(let n in S.m_groups)
                    {   let F=S.m_groups[n];
                        if(log)console.group(`group ${n} Nb fill groups=${F.fills? F.fills.length : 0}`);
                        
                        // Fill in a group name if it's missing ( for SVG )
                        if(F.m_svgGroup)
                        {   let s=F.m_svgGroup.getAttribute("name");
                            if((!s)||s.length==0)
                                F.m_svgGroup.setAttribute("name",`${F.bundle}/${F.name}`);
                            if(log)console.log("SvgGoup="+RQPrintR(F.m_svgGroup.getAttribute("name")))
                        }
                        // if(F.fills)
                        //    console.log(`F=${RQPrintR(F)} nb fill groups=${F.fills.length}`);  // example F : bundle:RootsFlower name:Hearts id:Hearts
                        
                        // Group specific set
                        let setGroup = (setSpecie && setSpecie.hasOwnProperty(F.name))?  setSpecie[F.name] : null;
                        if(log)console.log(`Applying settings. Groups are [group:${setGroup},specie:${setSpecie},set:${set}}]`);
                        
                        // Apply the setting with priority given to setGroup then setSpecie, then set 
                        applySettings(F,[setGroup,setSpecie,set])
                        
                        if(log)console.groupEnd();
                    }
                }
                if(log)console.groupEnd();
            }
                
        }
        // Sky 
        if( world.sky && this.m_backgrounds)
        {
            for(let i=0; i<this.m_backgrounds.length; i++)
            {   let B = this.m_backgrounds[i];
                if(B && B.m_name=="BackgroundLib")
                {   let F= B.m_groups.Sky;
                    if(F)
                    {   if(world.sky.strokeColor) 
                        {   F.m_strokeColor = this.M_getColor(world.sky.strokeColor);
                            F.m_paletteTag="custom";
                        }
                    }
                }
            }
    
            //strokeColor

        }
        // Ground color 
        this.m_groups.Ground.m_isFill=true; 
        if(world.earthFill)
        {
            this.m_groups.Ground.m_isActive= world.earthFill.active;
            if(world.earthFill.color)
                this.m_groups.Ground.m_strokeColor = this.M_getColor(world.earthFill.color);
                
        }
        else if(world.bgColor)
        {   this.m_groups.Ground.m_isFill=true;
            this.m_groups.Ground.m_isActive=true;
            this.m_groups.Ground.m_paletteTag="custom"
            this.m_groups.Ground.m_strokeColor = this.M_getColor(world.bgColor);
        }
        else
        {
            this.m_groups.Ground.m_isActive=false;
        }
        if(world.earthColor)
        {
            this.m_groups.GroundLines.m_strokeColor = this.M_getColor(world.earthColor);
        }
            


        // sky pattern
        if(world.skyPattern)
        {    if(world.skyPattern.strokeColor)
                this.m_groups.SkyPattern.m_strokeColor = this.M_getColor(world.skyPattern.strokeColor);
        }

        if(log)console.groupEnd();

    }


	// M_doAlgorithm
	// -------------------------

	async M_doAlgorithm()
	{
		this.M_log("[YZ] M_doAlgorithm");

        if(this.m_compoDebug)
        {
            for( let i=0; i<this.m_compoDebug.length; i++)
            {   let d=this.m_compoDebug[i];
                switch(d.tag)
                {
                    case 'horiz':
                        this.m_groups.Debug.m_strokeColor = d.color;
                        this.m_groups.Debug.m_strokeWidth=this.upscale*0.4;
                        this.M_drawLines(this.m_groups.Debug,new RQLine(new RQVec2(0,d.y),new RQVec2(this.W,d.y) ),false);
                        break;
                    case "point":
                        this.m_groups.Debug.m_strokeColor = d.color;
                        this.m_groups.Debug.m_strokeWidth=this.upscale*0.2;
                        this.M_drawDebugPoints([d.pt],{color:d.color});
                        break;
                }

            }
        }
        
        
        // Composition analysis
        this.m_lowestBgFloor=0;

        // Iterate through worlds
        let nbWorlds = this.m_worlds.length;

        //this.m_worlds : [{world:world,scale:worldScale,opts:opt}];
        for( let i=0; i<nbWorlds; i++)
        {   
            let WD = this.m_worlds[i];
            
            this.M_applyWorld(WD.world);

            let g = this.M_buildGrid(WD.opt);

            if(g.grid.lowestBgFloor > this.m_lowestBgFloor)
                this.m_lowestBgFloor=g.grid.lowestBgFloor;
            
            // Rain effect ( deactivated )
            if( this.m_foregrounds)
            {
                for(let ifg=0; ifg<this.m_foregrounds.length; ifg++ )
                {	let S=this.m_foregrounds[ifg];
                    //if(S.M_getBool("isActive",false))
                    if(false && this.random()<0.1)
                    {	
                        let aabb=g.shape.M_getAABB();
                        aabb.M_extend( aabb.M_getCenter().x,0,1,1); // extend to the ceiling
                        S.boundingBox=aabb;
                        switch(S.m_name)
                        {
                            case "ForegroundRain":			
                            this.M_drawRain(S);
                            break;
                        }
                    }
                }
            
            }

            // Draw Sides
            if( g.grid.sides)
            {   for(let is=0; is<g.grid.sides.length; is++)
                {   let side = g.grid.sides[is];
                    let hatchOpts=
                    {   gap             : Math.round(0.6+this.random()*1.2)*this.upscale,
                        angle           : is==0? 0 : 45,
                        thicknessMult   : this.upscale*0.2*WD.scale,
                        group           : this.m_groups.GroundLines
                    };
                    g.grid.sides[is].hatchOpts =hatchOpts;
                    //if(is==0)
                    {
                        this.M_drawLines(hatchOpts.group,side,true);
                        this.M_jaggedHatchShape(side,hatchOpts);
                        if(is==0 && this.m_groups.Ground.m_isActive)
                            this.M_fillShape(this.m_groups.Ground,side,{});
                        //console.log(`M_draw side ${is} in mask `);
                        if(is==0)
                            this.M_drawInMask(side,{protect:0,intensity:is==0?this.m_clipThreshold: 64});
    
                    }
                }
            }

            // Main distribution algorithm
            await this.M_implentation({ shape:g.shape,yRotate:this.world.yRotate,grid:g.grid,scale:WD.scale});

            // Redraw sides in mask at full intensity for opacity
            if( g.grid.sides)
            {   for(let is=0; is<g.grid.sides.length; is++)
                {   let side = g.grid.sides[is];
                    {
                        //this.M_drawLines(side.hatchOpts.group,side,true);
                        //this.M_jaggedHatchShape(side,side.hatchOpts);
                        //if(is>0)this.M_fillShape(this.m_groups.Ground,side,{liveFill:false});
                        this.M_drawInMask(side);
    
                    }

                }

            }
            // In the end, draw shape in mask to fully mask further lines
            this.M_drawInMask(g.shape);
        } // end each worlds

        // Draw the sky pattern
        if(this.m_hasSkyPattern)
        {   //this.m_hasSkyPattern = this.M_getBool("hasSkyPattern",false);
            //this.m_skyPattern = this.M_get("skyPattern","default");
            let randomFunc=this.random;
            let skyPattern = new SkyPattern(randomFunc,this.m_skyPattern,this.m_groups.SkyPattern);
            let rect = this.m_workArea.clone();
            let isCropCircle = this.M_get("workareaShape")=="Circle";
            {
                let isFrame = this.m_skyPatternShape=="frame"
                if(!isCropCircle)
                {    rect.M_inset(Math.min(20*this.upscale, this.W/(isFrame?10:20)));
                    if(isFrame && this.W>(this.H*1.1) ) // make it square in landscape mode ? 
                    {   rect.w = rect.h+(rect.w-rect.h)*Math.pow(this.random(),2);
                        rect.x = (this.W-rect.w)/2;
                    }
                }
                let circleRadius = Math.min(rect.w/2,rect.h/2);

                if(this.m_lowestBgFloor>rect.y)
                {   rect.h = this.m_lowestBgFloor-rect.y;
                }
                // trying a circle 
                let circle=new RQCircle(rect.center().x,Math.max(rect.center().y,rect.y+circleRadius),circleRadius);
                let shape;
                if( isFrame ) // rect
                    shape=rect.M_createPolyline();
                else 
                {    shape=circle.M_createPolyline(100);
                    shape.m_points.map((p)=>{ if(p.y>this.m_lowestBgFloor) p.y=this.m_lowestBgFloor; });
                }
                skyPattern.M_draw(this,shape);

                // draw the shape in the mask
                this.M_drawInMask(shape);
            }
        }

		// Draw the backgrounds 
		this.m_documentHorizon=0.5;
        if(this.m_backgrounds)
		{	for(let i=0; i<this.m_backgrounds.length; i++)
			{	this.M_drawBackground( this.m_backgrounds[i]);
			}
		}

		this.M_log("M_drawLines");
		this.m_abort = false; 		// <-- to get a chance of having the algorithm draw the lines
		this.M_drawLinesToSvg();

		this.M_onAlgorithmDone();

	}




	// IMPLANTATION
	// Distribution of all species accross the space
	async M_implentation(layout)
	{
		this.M_log(`M_implentation - paper/world=<b>${this.m_paperColor}</b>/<b>${this.world.name}</b> yRotation=${layout.yRotate}`);

        // Create implantation mask, utility object to fast query points inside
        let Imp = this.M_createImplantationMask(layout);
        if(!Imp) return;
        
        if(this.logActive)
            this.M_createControlImg("impl","Impl",Imp.canvas,document.getElementById("logContainer"));


        // array of planted species
        let Impl = [];



        let step=15*this.upscale/layout.scale;
        let map;

        
        // Layout boundaries
        let safeMargin = 5*this.upscale;
        layout.bounds=this.m_workArea.clone();
        layout.bounds.M_inset(0,safeMargin);
        this.m_layout = layout;
        // Create a map + iterator 
        if( layout.grid)
        {   
            this.m_grid=layout.grid;

            // grid nbX:nbX,nbZ:nbZ, pts:[]
            let step = Math.min(10, Math.ceil(layout.grid.nbX/4) )
            map = {     ix:{min: 0, max:layout.grid.nbX, step:step},
                        iz:{min: 0, max:layout.grid.nbZ, step:step},
                        mmtoCoord: layout.grid.nbX/layout.grid.width,
                        projected : layout.grid.projected,
                        pointOnMap : layout.grid.pointOnMap,
                        getZ : layout.grid.getZ,
                        isInside: Imp.M_isPointInside
                    }
            
            //this.M_log(`Iterator capacity = ${Math.ceil(map.ix.max/map.ix.step)*Math.ceil(map.iz.max/map.iz.step)}`);
            //this.M_log(`Grid size = ${this.m_grid.width/this.upscale},  ${this.m_grid.depth/this.upscale}`);
            let area = this.m_grid.width*this.m_grid.depth/(this.upscale*this.upscale);
            //this.M_log(`area=${area}`);
            for(let i=0; i<this.m_species.length; i++)
            {   let S=this.m_species[i];
                if(S.m_name=="RootsHerb")
                {   let zoneArea=  Math.pow(S.m_zoneRadius.max-S.m_zoneRadius.min,2)*Math.PI
                    let capacity = Math.round(area/zoneArea);
                    //this.M_log(`${S.m_name} ${RQPrintR(S.m_nbZones)}, radius=${RQPrintR(S.m_zoneRadius)} area=${zoneArea}) => capacity=${capacity}`);
                    S.m_nbZones.min= Math.max(1,Math.ceil( capacity/10));
                    S.m_nbZones.max= Math.max(3,Math.ceil( capacity/2),S.m_nbZones.min);
                    //this.M_log(`revised capacity = ${RQPrintR(S.m_nbZones)}`);
                }


            }

            layout.map=map;
           
            // Add the ground primitives
            // chip ( the ground )
            // side (side vertical stripes)
            {
                let prevIz=undefined,prevIx;
                for(let iz=map.iz.min; iz<=map.iz.max; iz+=1 /*map.iz.step*/)
                {
                    prevIx=undefined;
                    for(let ix=map.ix.min; ix<=map.ix.max; ix+=1 /*map.ix.step*/)
                    {   if(prevIx!==undefined && prevIz!==undefined)
                        {
                            Impl.push({ix:ix,iz:iz,sz:this.m_grid.getZ(ix-0.5,iz),chip:true }); 

                        }

                        prevIx=ix;
                    }
                    // Side bands
                    if( prevIz!==undefined)
                    {
                        if(Math.abs(layout.yRotate)>0.1)
                        {
                            let ix = layout.yRotate>0?0 : map.ix.max;
                            let z= this.m_grid.getZ(ix,iz);
                            Impl.push({ix:ix,iz:iz,sz:this.m_grid.getZ(ix,iz),side:true });
    
                        }
                    }
                
                    prevIz=iz;
    
                }

            }
            // compute z of grid points
            let minZ,maxZ;
            for(let j=0;j<2;j++)
            {   for(let i=0;i<2;i++)
                {   let z=layout.grid.getZ(i*layout.grid.nbX,j*layout.grid.nbZ);
                    if(minZ===undefined) {minZ=z;maxZ=z;}
                    else { if(z<minZ)minZ=z; if(z>maxZ)maxZ=z;}

                }
            }
            //console.log(`z bounds = ${minZ},${maxZ}`);
            
            // Scale function 
            layout.map.scales = {max:layout.scale, min:this.m_depthScaleFactor*layout.scale}
            layout.map.getScale=(ix,iz)=> RQMaths.M_map( layout.map.getZ(ix,iz), minZ,maxZ,layout.map.scales.min,layout.map.scales.max);

        
        }
        else 
        {   
            // TODO : random shape
            this.m_grid = 0;
            layout.map =map=
            {   ix:{min: Imp.aabb.x, max:Imp.aabb.right(), step:step},
                iz:{min: Imp.aabb.y, max:Imp.aabb.top(), step:step},
                mmtoCoord:1,
                coord : (ix,iz)=>new RQVec2(ix,iz),
                getZ : (ix,iz)=>0,
                getScale: (ix,iz)=>layout.scale
            }
            
        }
        
        // Sort species by random / layout implantation
        let layoutSpecies = [];
        let randomSpecies = [];
        for( let i=0; i<this.m_species.length; i++)
        {
            let S=this.m_species[i];
            if( S.m_implantation=='random' && S.m_isActive)
                randomSpecies.push(S);
            else if( S.m_implantation=='layout' && S.m_isActive)
                layoutSpecies.push(S);
            else
            {   // nothing, it is lost
            }
        }

        // 1 ) Specie's custom layout
        let minScreenY = this.H;
        
        
        for(let i=0; i<layoutSpecies.length; i++)
        {   let S = layoutSpecies[i];
            if(S.M_layout || S.M_bundleLayout)
            {   let layoutFunc = S.M_layout??S.M_bundleLayout;
                let list;
                if(S.M_layout)
                {    list = layoutFunc.call(S,this,layout);

                }
                else if(S.M_bundleLayout)
                {
                    let nbZones = rndRange(S.m_nbZones,this.random);
                    let range = S.m_yRange??{min:0,max:1};
                    let zBounds = { min:map.iz.min*Math.max(0,range.min), max:map.iz.max*Math.min(1,range.max)}
                    list=[];
                    for(let i=0; i<nbZones; i++)
                    {   let ix = map.ix.min+(this.random()*(map.ix.max-map.ix.min))
                        let iz = zBounds.min+(this.random()*(zBounds.max-zBounds.min))
                        layout.ix=ix;
                        layout.iz=iz;
                        let bundle =layoutFunc.call(S,this,layout);
                        if(bundle)
                            list.push(...bundle)
                    }


                }
            
                if( list && list.length)
                {
                    for(let is=0; is<list.length; is++)
                    {   let p=list[is];

                        //console.log("New block : "+RQPrintR(p,1));
                        //if(Imp.M_isPointInside(p.x,p.y))
                        {   //console.log("It's inside :)");
                            p.S=S;
                            p.scale ??= layout.map.getScale(p.ix,p.iz);
                            Impl.push(p);
                            
                            if((p.y-p.totalHeight)<minScreenY)
                                minScreenY =p.y-p.totalHeight;

                            if(p.imprintShape)
                            {   let IS=p.imprintShape;
                                let implShape;
                                switch(IS.type)
                                {
                                    case "circle":
                                    {   implShape = (new RQCircle(p.ix,p.iz,IS.radius)).M_createPolyline(20);
                                        
                                    }
                                    break;
                                    case "rectangle":
                                    {   implShape = new RQRectangle(-IS.width/2,-IS.depth/2,IS.width,IS.depth).M_createPolyline();
                                        if(p.yRotation)
                                            implShape.M_rotate(p.yRotation);
                                        implShape.M_translate(p.ix,p.iz);

                                    }
                                    break;
                                }
                                if(implShape)
                                {
                                    // Compute the closest point 
                                    let currentZ = layout.map.getZ(p.ix,p.iz);
                                    let pClosest, closest = currentZ;
                                    implShape.m_points.map((pt)=>{ let z=layout.map.getZ(pt.x,pt.y); if(z>closest){closest=z; pClosest=pt} } );

                                    // tweek the sz value for sorting
                                    if( pClosest)
                                    {   
                                        // move the z a little bit toward the closest point, for Z sorting accuracy
                                        let amount=0.3;
                                        p.sz=currentZ*(1-amount)+ closest*amount;
                                                                                
                                        //let pClosest2D = layout.grid.projected(pClosest.x,pClosest.y);
                                        //Impl.push({sz:closest, ix:pClosest2D.x, iz:pClosest.y,debug:true, L:new RQLine(pClosest2D,pClosest2D.M_plus(0,-40*this.upscale))});
                                        
                                    }



                                    // use that shape to query the mask for the altitude
                                    let maxAlt=this.m_grid.getMaxAlt([...implShape.m_points,{x:p.ix,y:p.iz}]); 
                                    if( p.refOnMap && maxAlt!=undefined && p.refOnMap.y<maxAlt)
                                    {   
                                        //console.log(`We have changed block altitude from ${p.refOnMap.y} to ${maxAlt}`);
                                        p.refOnMap.y=maxAlt;    
                                    }
                                    Imp.M_mask(implShape );
                                }

                            }
                            else
                            if(p.imprintRadius)
                            {   let implShape = new RQCircle(p.ix,p.iz,p.imprintRadius).M_createPolyline(20);
                                Imp.M_mask(implShape );
                            }
                        }
                    }
    
                    Imp.M_update();
                }

            
            }

        }


        // 2 ) Random layout
        let nbSpecies= randomSpecies.length;
        if(nbSpecies)
        {   let plants=[];
            for(let i=0; i<randomSpecies.length; i++)
            {   let S= randomSpecies[i]
                if(S && S.m_isActive)
                {   let nbZones = Math.ceil( rndRange(S.m_nbZones,this.random));
                    for( let nb=0; nb<nbZones;nb++)
                    {    plants.push({S:S,rnd:this.random()});
                    }
                }

            }
            // randomize plants
            plants.sort((a,b)=>a.rnd<b.rnd?-1:1);

            // For each plant, find a zone in the screen
            for(let ip=0; ip<plants.length; ip++)
            {
                let S=plants[ip].S;
                let iz = rndRange( map.iz,()=>rndRange(S.m_yRange,this.random));
                let ix = rndRange(map.ix,this.random ) 
                let p=map.projected(ix,iz);
                this.m_currentY = p.y;
                let scale = layout.map.getScale(ix,iz)
                if(S.m_isIso)
                {
                    if(Imp.M_isPointInside(p))
                    {   Impl.push({x: p.x,y:p.y,ix:ix,iz:iz,scale:scale,S:S })
                        // draw a shape around the implementation mask
                        Imp.M_mask(new RQCircle(p.x,p.y,step).M_createPolyline(12) ).M_update();
                    }
                }
                else
                {   //let nbDensity = S.m_density.max*100;
                    let nbDensity = rndRange(S.m_zoneDensity,this.random);
                    let r=Math.min(rndRange(S.m_zoneRadius,this.random)*this.upscale * scale * map.mmtoCoord,map.ix.max/6);
                    // let circle=new RQCircle(p.x,p.y,1*this.upscale*scale).M_createPolyline(20);  // in shape mode
                    let circle = new RQCircle(ix,iz,3*this.upscale*map.mmtoCoord).M_createPolyline(20);    // 5 = temp, radius of circle in impl. mask
                    //let prev=p.clone();
                    let prevIx=ix,prevIz=iz;
                    let p2=new RQVec2();
                    for( let i=0; i<nbDensity; i++)
                    {
                        let a=this.random()*Math.PI*2;
                        let r2 = this.random()*r;
                        let ix2 = ix+Math.cos(a)*r2;
                        let iz2 = iz+Math.sin(a)*r2;
                        if( Imp.M_isPointInside(ix2,iz2))
                        {   
                            p2 = map.projected(ix2,iz2 );
                            Impl.push({x: p2.x,y:p2.y,ix:ix2,iz:iz2,scale:layout.map.getScale(ix2,iz2),S:S,imprintRadius:2*this.upscale*map.mmtoCoord})
                            // draw in implementation mask
                            circle.M_translate(ix2-prevIx,iz2-prevIz);
                            Imp.M_mask(circle);
                            prevIx=ix2;
                            prevIz=iz2;
                        }
                        else
                        {  // console.warn(`point outside : (${ix2},${iz2}) [0-${map.ix.max}],[0-${map.iz.max}] scale=${scale}`);
                            // console.log(`ix=${ix} iz=${iz} step=${map.ix.step} r2=${r2}`);
                        }   
                        
                    }
                    Imp.M_update();
                }

            }
            
        }

        // Trying another sort method
        for( let i=0; i<Impl.length; i++)
        {   let imp = Impl[i];
            //let p=this.world.MV.M_mutlipliedByVector(new RQVec3(imp.ix,0,-imp.iz));
            imp.sz??=layout.map.getZ(imp.ix,imp.iz);
        }
        
        

		// Sort by Z
        Impl.sort( function(a,b){
            return (a.sz<b.sz)?1:-1;

        });

        // Once sorted, do the rendering,
        let iForDelay=0;
		for( let i=0; i<Impl.length; i++,iForDelay++)
		{
			let opt=Impl[i];
            if(opt.S)
            {
                let S=opt.S;
                opt.seg = this.m_segLength;

                //this.M_drawDebugVector(new RQVec3(0,0,0),new RQVec3(0,0,0),new RQVec2(opt.x,opt.y),{color:"green",mask:true});

                // draw the sand effect : todo but on plants only. Block shapes do it their own way
                if(false && opt.imprintRadius)
                {
                    let rect =new RQRectangle(opt.x,opt.y,3,5);
                    let nb = Math.round(opt.imprintRadius)*2;
                    for( let k=0; k<nb;k++)
                    {   
                        rect.x = opt.x+2*(Math.random()-0.5)*opt.imprintRadius*1.3;
                        rect.y = opt.y-2*(Math.pow(Math.random(),3)-0.0)*1*this.upscale;
                        
                        // draw with ground color
                        this.M_fillShape(this.m_groups.Ground,rect.M_createPolyline(),{});
                        // draw int mask
                        this.M_drawInMask(rect.M_createPolyline(),0);
                    }
                }   

                // Call species draw function
                if(!( Number.isNaN( opt.y) || Number.isNaN( opt.x)))
                    await S.M_draw(this,opt,layout)

            }
            else if(opt.chip)
            {
                // Little chip of land
                let L = new RQPolyLine();
                L.M_addPoint(layout.grid.projected(opt.ix-1,opt.iz-1))
                L.M_addPoint(layout.grid.projected(opt.ix,opt.iz-1))
                L.M_addPoint(layout.grid.projected(opt.ix,opt.iz))
                L.M_addPoint(layout.grid.projected(opt.ix-1,opt.iz))
                if(this.m_groups.Ground.m_isActive)
                    this.M_fillShape(this.m_groups.Ground, L,{liveFill:false});
                this.M_drawPattern(opt.ix-1,opt.iz-1,this.m_groups.GroundLines);
                this.M_drawInMask(L,{protect:0});
                iForDelay--;
        
            }
            else if(opt.side)
            {
                let L = new RQPolyLine();
                let p1=this.m_grid.projected(opt.ix,opt.iz-1)
                let p2=this.m_grid.projected(opt.ix,opt.iz)
                L.M_addPoint( new RQVec2(p1.x,this.H));
                L.M_addPoint(p1)
                L.M_addPoint(p2)
                L.M_addPoint( new RQVec2(p2.x,this.H));
                let group = this.m_groups.Ground;
                if(group.m_isActive)
                    this.M_fillShape(group,L,{liveFill:false});
                this.M_drawInMask(L,{protect:0,intensity: 64});

            }
            else if( opt.ground && layout.grid)
            {
                // draw ground
                if( opt.iz<=layout.grid.nbZ)
                {   
                    //this.M_drawLines( this.m_groups.Ground,layout.grid.lines[opt.iz],true);
                    if(opt.iz<layout.grid.nbZ)
                        this.M_drawJaggedLine(layout.grid.lines[opt.iz],2/*ThicknessMult*/,this.m_groups.GroundLines ,true,{thres:60});
                    if(opt.iz>0)
                    {
                        let L1 =  layout.grid.lines[opt.iz-1].clone();         
                        let L2 =  layout.grid.lines[opt.iz];         
                        L1.M_appendReverse(L2);
                        this.M_fillShape(this.m_groups.Ground, L1,{liveFill:false});
                    
                        this.M_drawInMask(L1,{protect:0});
                    }
                }
            }
            else if(opt.debug)
            {
                
                this.m_groups.Debug.m_strokeColor="red";
                this.m_groups.Debug.m_strokeWidth=0.3*this.upscale;
                this.M_drawLines(this.m_groups.Debug,opt.L,true);


            }
			if( 0==(iForDelay%20))await sleep(1);


		}		
		
	}
    M_svgSort(a,b)
    {
        if(a.iz==b.iz)
        {   let dir = (a.iz%2)?1:-1;
            return (a.ix<b.ix)? dir : -dir;
        }
        return a.iz<b.iz?1:-1;
    }
    // Drawing ground pattern
    M_drawPattern(ix,iz,group)
    {   
        const rnd = (shift)=>(1+noise.simplex2((shift??0)+3*ix/this.m_grid.nbX, 5*iz/this.m_grid.nbZ))*0.5;
        const isDense = !this.m_layout.map.isInside(ix-0.5,iz+0.5);
        let grid=this.m_grid;
        let maskopt={thres:60,svgSort:{ func:this.M_svgSort,param:{ix:ix,iz:iz} }}
        let side = (ix==0)?1:  (ix==(grid.nbX-1))? 2 : 0;
        let edge= (iz==(grid.nbZ-1))? 2:0;
        let pattern= this.world.groundPattern; 
        const k=1.414;
        let project = pattern.diagonal? (x,z)=>{ let e = pattern.diagonal(ix,iz,x-ix,z-iz); return grid.projected(RQMaths.M_clamp(e.x,0,grid.m_nbX),RQMaths.M_clamp(e.y,0,grid.m_nbZ))} : (x,z)=>grid.projected(RQMaths.M_clamp(x,0,grid.m_nbX),RQMaths.M_clamp(z,0,grid.m_nbZ));


        let isVertical= (side||isDense)? true : (pattern.vertical.rnd==0)? false : (pattern.vertical.rnd==1) ? true : rnd(0,6)<pattern.vertical.rnd;
        let isHorizontal= (edge||isDense)? true : (pattern.horiz.rnd==0)? false : (pattern.horiz.rnd==1) ? true : (rnd(0.3,4)<pattern.horiz.rnd);
        if(isVertical)
        {   let x0=0.5,x1=0.5; 
            if(side) x0=x1= side==1?0:1;
            this.M_drawLines(group,new RQLine(project(ix+x0,iz), project(ix+x1,iz+1)),true,maskopt);
        }
        let halfminw=(isDense? pattern.horiz.length.dense:pattern.horiz.length.scarce)/2;
        if(isHorizontal)
        {   let x0 = (edge==2)? 0 : 0.5-halfminw-((side==1)?(1-halfminw):0.8)*rnd(this.random());
            let x1 = (edge==2)? 1 : 0.5+halfminw+((side==2)?(1-halfminw):0.8)*rnd(); 
            let y0=(edge==2)? 1 : 0.5 + pattern.horiz.yShift*2*(this.random()-0.5); 
            this.M_drawLines(group,new RQLine(project(ix+x0,iz+y0), project(ix+x1,iz+y0)),true,maskopt);
        }
    }
    M_drawSandLines()
    {
        if(this.m_sandLines.length)
        {   let L; 
            let F=this.m_groups.Ground;
            if(F.m_isActive)
            {
                let oldStroke=F.m_strokeWidth;
                F.m_strokeWidth=0.4*this.upscale;
                F.m_isFill=false;
                for( let i=0; i<this.m_sandLines.length; i++)
                {
                    this.M_drawLines(F,this.m_sandLines[i].L,true);

                }
                F.m_strokeWidth=oldStroke;
                F.m_isFill=true;
            }
            // mask
            while(L=this.m_sandLines.pop())
                this.M_drawInMask(L.m,{protect:0});

        }


    }
    M_drawSand(points)
    {
        let p;
        if( Array.isArray(points))
        {
            for(let i=points.length-1; i>=0; i--)
            {   p=points[i];
                let rect =new RQRectangle(0,0,this.upscale*0.6,this.upscale*0.5);
                let nb=5;
                let radius=this.m_grid.stepX*0.3;
                let spanY=3*this.upscale;
                for( let k=0; k<nb;k++)
                {   
                    rect.x = p.x+2*(Math.random()-0.5)*radius*1.3;
                    rect.y = p.y-Math.pow(Math.random(),2)*spanY; 
                    

                    // draw with ground color --> should go
                    this.m_sandLines.push({L:new RQLine(new RQVec2(rect.x+rect.w/2,rect.y-rect.h*0.3), new RQVec2(rect.x+rect.w/2,rect.y+rect.h*0.3)),m:rect.M_createPolyline()});

                    // draw int mask
                    //this.M_drawInMask(rect.M_createPolyline(),{protect:0});
                }

            }
        }
    }

    // M_createImplantationMask
    M_createImplantationMask(layout)
    {
        
        let shape=layout.shape;
        if(!shape)
            return null;

        let gridSize;
        gridSize??=this.upscale;
    
        // 1 - get shape AABB 
        let int = shape.M_getAABB();
        if(!int)return null;

        // 2 - intersect with workarea
        let aabb = int.M_getIntersection(this.m_workArea).M_rounding();

        let w,h;
        // Two modes : screen layout, grid layout
        if( layout.grid)
        {
            // Canvas dimensions
            w=Math.ceil(layout.grid.width/gridSize);
            h=Math.ceil(layout.grid.depth/gridSize);

        }
        else 
        {

            // 3 - canvas dimensions
            if(aabb.w<gridSize || aabb.h<gridSize)
                return null;
            
            w=Math.floor(aabb.w/gridSize);
            h=Math.floor(aabb.h/gridSize);
        
        }
        let Imp=null;
        if( w>1 && h>1)
        {
            let canvas = document.createElement('canvas');
            canvas.width  = w;
            canvas.height = h;

            let ctx = canvas.getContext('2d');


            // Fill the canvas 
            if(layout.grid)
            {
                // In grid mode, canvas will match the grid's proportions,
                // and will be addressed with ix,iz coordinates 
                ctx.fillStyle = 'rgba(255,0,0,1)';
                ctx.fillRect(0, 0, w,h);
                ctx.translate(0,h);
                ctx.scale(w/layout.grid.nbX,-h/layout.grid.nbZ);	    

            }
            else
            {
                // In shape mode, we address the canvas with screen coordinates
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, w,h);
        
                if(gridSize>1 )
                    ctx.scale(1/gridSize,1/gridSize);	
                ctx.translate(-aabb.x, -aabb.y);	

                    // draw the shape in the canvas
                let path = shape.M_getSVGPath(false);
                let path2D = new Path2D(path);

                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = 'rgba(255,0,0,1)';
                ctx.fill(path2D);
    
            }

            // Create base implantation object
            Imp= { 
                data    :ctx.getImageData(0,0,w,h).data,
                canvas  :canvas,
                aabb    :aabb,
                gridSize:gridSize,
                M_update:function()
                {   this.data=ctx.getImageData(0,0,w,h).data;
                }
            }

            // Functions to address the mask
            if(layout.grid)
            {   
                Imp.M_isPointInside = (ix,iz)=> {
                    if( ix>=0 && ix<=layout.grid.nbX && iz>=0 && iz<=layout.grid.nbZ)
                    {
                        let x=Math.round( ix*w/layout.grid.nbX );
                        let y=h-1-Math.round( iz*h/layout.grid.nbZ );
                        let p=Imp.data[x*4+ y*(Imp.canvas.width*4) ];
                        return p>200;
                        
                    }
                    return false;
                };
                Imp.M_mask = function(shp)
                {   
                    let path = shp.M_getSVGPath(false);
                    let path2D = new Path2D(path);
            
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.fillStyle = 'rgba(100,0,0,1)';
                    ctx.fill(path2D);
                    // retrieve pixels
                    return this;
                };

            }
            else
            {
        
                Imp.M_isPointInside = function(pt) {
                    if( this.aabb.M_isPointInside(pt))
                    {
                        let x=Math.round( (pt.x-this.aabb.x)/this.gridSize );
                        let y=Math.round( (pt.y-this.aabb.y)/this.gridSize );
                        let p=this.data[x*4+ y*(this.canvas.width*4) ];
                        return p>200;
                        
                    }
                    return false;
                };
                Imp.M_mask = function(shp)
                {   
                    let path = shp.M_getSVGPath(false);
                    let path2D = new Path2D(path);
            
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.fillStyle = 'rgba(100,0,0,1)';
                    ctx.fill(path2D);
                    // retrieve pixels
                    return this;
                };
            }     

            
        }
        return Imp;

       
    }
    
    // Make a grid object
    M_getGridBaseObject(opt)
    {
        const P = (x,y,z)=>new RQVec3(x,y,z);

        opt??={}
        opt.dimensions  ??={width:_.W*0.8,depth:_.H*1.5};
        opt.center      ??=new RQVec2(this.m_workArea.center().x,this.m_workArea.h*0.7);
        opt.relief      ??={amplitude:30*_.upscale, fact:2}
        opt.yBottom     ??=this.m_workArea.top();
        if(!opt.MV)
        {
            opt.MV = new RQMatrix4();
            opt.MV.M_rotate(-45+90*this.random(),0,1,0);
        }
        let MV=opt.MV;
        let w   = opt.dimensions.width;
        let d   = opt.dimensions.depth;
        let h   = opt.relief.amplitude;
        let C   = opt.center;         // Reference point, controls the placement of the surface

        let stepX   =Math.max(this.upscale*2,50);
        let stepZ   =stepX;
        let nbX     =Math.ceil(w/stepX); stepX = w/nbX;                                              // Steps are positive, beware
        let nbZ     =Math.ceil(d/stepZ); stepZ = d/nbZ;


        let grid={ nbX:nbX,nbY:nbZ,nbZ:nbZ, stepX:stepX,stepZ:stepZ,width:w, depth:d,amplitude:h,
            MV:MV,pts:[],lines:[], C:C,
            corners: { p00:P(-w/2,0,d/2), p10:P(w/2,0,d/2), p11:P(w/2,0,-d/2), p01:P(-w/2,0,-d/2)}

        } 

        let crnr = grid.corners;
        let u0=crnr.p01.M_minus(crnr.p00);   
        let u1=crnr.p11.M_minus(crnr.p10);

        grid.projection=(p)=>p?this.M_projection( MV.M_mutlipliedByVector(p),C):new RQVec2();
        grid.extendedFunc=(iX,iZ)=>{
            let kX=iX/grid.nbX;
            let kZ=iZ/grid.nbZ;
            let p0 = crnr.p00.M_plus(u0.M_multipliedBy(kZ));
            let p1 = crnr.p10.M_plus(u1.M_multipliedBy(kZ));
            let u = p1.M_minus(p0);
            let p = p0.M_plus( u.M_multipliedBy(kX) );
            let decal = noise.simplex2( kX*opt.relief.fact,kZ*opt.relief.fact);
            p.y += 0.5*h*decal;
            return p;
        }

        return grid;
    }


    // M_buildGrid
    // (a height map with noise)
    M_buildGrid(opt)
	{
		let _ = this;
        let out = null;

        let grid = this.M_getGridBaseObject(opt);
        if(grid)
        {
            let w       = grid.width
            let d       = grid.depth;
            let h       = grid.amplitude;
            let C       = grid.C;
            let nbX     = grid.nbX;
            let nbZ     = grid.nbZ;
            let stepX   = grid.stepX;
            let stepZ   = grid.stepZ;
            let MV      = grid.MV;
            let crnr    = grid.corners;
            const P = (x,y,z)=>new RQVec3(x,y,z);
            
            
            // TEST  (skew the block. this is cool !)
            //p11.y+= 50*this.upscale;

            let sides=[null,new RQPolyLine(), null, new RQPolyLine()];
            let u0=crnr.p01.M_minus(crnr.p00);   
            let u1=crnr.p11.M_minus(crnr.p10);
            
            let lowestBgFloor=0;
            
            let index=0;
            for( let j=0; j<=nbZ; j++)
            {   let kZ = j/nbZ;
                let p0 = crnr.p00.M_plus(u0.M_multipliedBy(kZ));         // p0 = left point along the base square
                let p1 = crnr.p10.M_plus(u1.M_multipliedBy(kZ));         // p1 = right point alogn the base square
                let u = p1.M_minus(p0);                             // u = vector pointing right, the width of the base square
                let L = new RQPolyLine();

                for( let i=0; i<=nbX; i++)
                {   let kX = i/nbX;                  
                    
                    let p = p0.M_plus( u.M_multipliedBy(kX) );
                    let decal = noise.simplex2( kX*opt.relief.fact,kZ*opt.relief.fact);
                    p.y += 0.5*h*decal;
                    let pTransformed = grid.projection(p); 
                    if(j==nbZ && pTransformed.y>lowestBgFloor)
                        lowestBgFloor=pTransformed.y
                    grid.pts.push(p);
                    //if(Math.random()<0.1) pTransformed.penUp=true;      // TEST gaps in the lines
                    L.M_addPoint(pTransformed);
                    index++;
                    if(i==0  && j<nbZ)
                        sides[3].M_addPoint(pTransformed);            
                    else if(i==nbX && j>0 && j<nbZ)
                        sides[1].M_addPoint(pTransformed); 
                }
                grid.lines.push(L);
                if( j==0) sides[0]=L.clone();
                else if( j==nbZ) sides[2]=L.clone();
            }
            grid.lowestBgFloor=lowestBgFloor;
            // some functions to navigate the grid
            grid.getZ=(ix,iz)=>MV.M_mutlipliedByVector(new RQVec3(ix,0,-iz)).z;
            grid.toXZ=(p)=>{return {ix:(p.x+w/2)/stepX,iz:(d/2-p.z)/stepZ};}
            grid.pointOnMap =(ixFine,izFine)=>{
                let ix = Math.floor(ixFine);
                let iz = Math.floor(izFine);
                if(ix>=0 && iz>=0 && ix<=grid.nbX && iz<=grid.nbZ)
                { 
                    let ix1=ix<grid.nbX? ix+1:ix;
                    let iz1=iz<grid.nbZ? iz+1:iz;
                    let p00 = grid.pts[ ix+iz*(grid.nbX+1)];
                    let p10 = grid.pts[ ix1+iz*(grid.nbX+1)];
                    let u0=grid.pts[ ix+iz1*(grid.nbX+1)].M_minus(p00);
                    let u1=grid.pts[ ix1+iz1*(grid.nbX+1)].M_minus(p10);
                    let p0 = p00.M_plus( u0.M_multipliedBy(izFine-iz));
                    let p1 = p10.M_plus( u1.M_multipliedBy(izFine-iz));
                    let V = p1.M_minus(p0);
                    return p0.M_plus(V.M_multipliedBy(ixFine-ix));
                }
                else
                {   
                    return grid.extendedFunc(ixFine,izFine);
                }
                
            }
            grid.rotateVector = (v)=>MV.M_rotateVector(v);
            grid.projected =(ix,iz)=>grid.projection( grid.pointOnMap(ix,iz));
            grid.getMaxAlt=function(points) // points in ix,iz context, with (x,y) coords
            {   let y;
                if( Array.isArray(points))
                {   for(let i=0; i<points.length; i++)
                    {   let p = points[i];
                        let pFloor = grid.pointOnMap(p.x,p.z??p.y);
                        if(!pFloor) console.warn(`maxalt : pFloor is null x=${p.x} y=${p.z??p.y}`);
                        if(pFloor && (y==undefined ||pFloor.y>y))
                            y=pFloor.y;

                    }

                }
                return y;    
            }

            // Make side faces
            grid.sides=[];
            let pBottom10= grid.projected(grid.nbX,0)       ; pBottom10.y=opt.yBottom;
            let pBottom00= grid.projected(0,0)              ; pBottom00.y=opt.yBottom;
            let pBottom11= grid.projected(grid.nbX,grid.nbZ); pBottom11.y=opt.yBottom;
            let pBottom01= grid.projected(0,grid.nbZ); pBottom01.y=opt.yBottom;
            //console.log(`pBottom10=${pBottom10.M_getString()} pBottom11=${pBottom11.M_getString()}`);

            let sideFront = sides[0].clone();
            sideFront.M_addPoint(pBottom10);
            sideFront.M_addPoint(pBottom00);
            sideFront.M_closePath();
            grid.sides.push(sideFront);            

            // Put the sides if they are visible 
            if( pBottom11.x>(pBottom10.x+3))
            {
                let sideRight = new RQPolyLine();
                sideRight.M_addPoint(grid.projected(grid.nbX,0));
                sideRight.M_append(sides[1]);
                sideRight.M_addPoint(grid.projected(grid.nbX,grid.nbZ));
                sideRight.M_addPoint(pBottom11);
                sideRight.M_addPoint(pBottom10);
                sideRight.M_closePath();
                grid.sides.push(sideRight);            
                //console.log("Adding Side Right "+sideRight.M_getString());
    
            }
            if( pBottom01.x<(pBottom00.x-3))
            {
                let sideLeft = new RQPolyLine();
                sideLeft.M_addPoint(grid.projected(0,0));
                sideLeft.M_append(sides[3]);
                sideLeft.M_addPoint(grid.projected(0,grid.nbZ));
                sideLeft.M_addPoint(pBottom01);
                sideLeft.M_addPoint(pBottom00);
                sideLeft.M_closePath();
                grid.sides.push(sideLeft);            
                //console.log("Adding Side Left "+sideLeft.M_getString());
    
            }


            // Make surface shape
            let L = sides[0];
            L.M_append(sides[1]);
            L.M_appendReverse(sides[2]);
            L.M_appendReverse(sides[3]);
            out  = {shape:L, grid:grid};


        }
        else

        {
			let points = [];
			let ind = [-1,1,1,1,1,-1,-1,-1];
			let C = _.m_workArea.center();
			let perspective =_.m_perspectiveFactor/3; 
			let xdecal = perspective*opt.dimensions.depth/3;
			for( let i=0; i<8; i+=2)
			{	let P = new RQVec3(C.x+ind[i]*opt.dimensions.width/2+ind[i+1]*ind[i]*xdecal,opt.m_position.y,opt.m_position.z+ind[i+1]*opt.dimensions.depth/2) ;  
				points.push( _.M_projection( P));
			}
			let _A = points[0].clone();
			let _B = points[1].clone();
			points.push(points[0].clone());
			if(opt.relief.amplitude!=0 && opt.relief.fact !=0)
			{

				let noiseOffset =0;     // temp
			
				let pts2 = [];
				let segLength = 1*_.upscale;
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
						let rnd = noise.simplex2( (P.x-noiseOffset)*opt.relief.fact/l,P.y*opt.relief.fact/l);
						P.y+=rnd*opt.relief.amplitude/2;
						pts2.push(P);
						s+=segLength;
					}
				}			
				points=pts2;
			}

            out= new RQPolyLine(points);
		}
        return out;
	}


    // M_drawRain ( TEMP, must move elsewhere )
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
        let B = S.boundingBox ?? this.m_workArea;
		for(let i=0; i<nbDrops; i++)
		{
			let angle = (angleRain + angleAmp*(this.randomRain()-0.5))*DEGTORAD;
			u.x = -Math.sin(angle)
			u.y =-Math.cos(angle);
			let p1 = new RQVec2(B.x+this.randomRain()*B.w,B.y+this.randomRain()*B.h*y);
			let len = length*sz*(0.8+0.4*this.randomRain());
			let p2 = new RQVec2 (p1.x+len*u.x,p1.y+len*u.y); 	
			let L = new RQLine(p1,p2);
			L.strk = 0.8*this.upscale*sz;
			Ls.push(L);
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

    M_groundClip(points,MV,opts,N,backface)
	{
    
        if(!this.m_grid)
            return null;
        //let MV2=MV.clone();
        //MV2.M_rotate(-this.world.yRotate,0,1,0)
        let out=new RQPolyLine();
        let sand=[]
        
        let el=points.length;

        // altitude : gives the Y of the floor at a given point
        let altitude0=opts.refOnMap.y;
        
        let altitude=(pModel)=>{ 
            let p = MV.M_mutlipliedByVector(pModel);
            let xz=this.m_grid.toXZ(p);
            let pFloor = this.m_grid.pointOnMap(xz.ix,xz.iz);
            return pFloor?pFloor.y: altitude0;
        }

        // A first pass will let up know what is the minimum altitude on the grid
        let minAlt=altitude0;
        let maxAlt=altitude0;
        for(let i=0; i<el; i++)
        {   if(points[i].y<=0.3)  // a ground point
            {
                let alt = altitude(points[i]);
                if(alt<minAlt)
                    minAlt=alt;
                if(alt>maxAlt)
                    maxAlt=alt;
            }
        }
    
        //console.log(`Altitudes : min:${minAlt} max:${maxAlt} ref:${altitude0}`);
        if(minAlt<altitude0)
        {   //console.log(`Altitude 0=${altitude0} minAlt=${minAlt}`);
            out.minY = minAlt-altitude0;
    }
    
        // Second pass will "plant" the shape by lowering all the points that are at Y=0 to the lowest altitude
        for(let i=0; i<el; i++)
        {   if(points[i].y<=0.3)    // floor or underneath
            {

                points[i].y -= altitude0-minAlt;
            }
        }

        for( let i=0; i<el; i++)
		{	let e = {A:points[i],B:points[(i==(el-1))?0:i+1]}
			
            let pAgrid = MV.M_mutlipliedByVector(e.A);
            let pBgrid = MV.M_mutlipliedByVector(e.B);

            // navigate in ix,iz
            let uGrid=pBgrid.M_minus(pAgrid);
            let Lgrid=uGrid.M_length(); 
            if(Lgrid>0)
            {   let maxSteps=Math.max(Math.abs(uGrid.z/this.m_grid.stepZ),Math.abs(uGrid.x/this.m_grid.stepX,3));
                let step=Lgrid/maxSteps;
                let nbSteps=Math.round(Lgrid/step);
                uGrid.M_mul(step/Lgrid);  // normalize u
                
                // navigate along the segment
                let Pg = pAgrid.clone();
                let l=0;
                let wasAbove;
                for(let is=0;is<=nbSteps;is++ )
                {   // Get grid coords
                    let pScreen = this.m_grid.projection(Pg);

                    let ixz=this.m_grid.toXZ(Pg);                    // Grid cell (ix,iz) coordinates
                    let PGround = this.m_grid.pointOnMap(ixz.ix,ixz.iz)
                    let pGroundScreen  =this.m_grid.projected(ixz.ix,ixz.iz);



                    //debug
                    let isAbove=true;
                    if(PGround && PGround.y>Pg.y)
                    {   isAbove=false;
                    }    
                    let mapOnFloor=false;
                    if( wasAbove===undefined)   // first point
                    {    if( !(wasAbove=isAbove))
                            mapOnFloor=true;
                    }
                    else 
                    {   if( wasAbove!=isAbove)
                        {
                            //Compute intersection
                        }
                        if(!isAbove)
                            mapOnFloor=true;
                    }
                    if(false && mapOnFloor)    // draw that point
                    {
                        this.m_groups.Debug.m_strokeColor = "blue";
                        this.M_drawPoints(this.m_groups.Debug,[ {x:pScreen.x,y:pScreen.y,r:2}]);
                        
                        this.m_groups.Debug.m_strokeColor = "yellow";
                        this.M_drawPoints(this.m_groups.Debug,[ {x:pGroundScreen.x,y:pGroundScreen.y,r:3}]);
                        let arrowSz=0.5*this.upscale;
                        let signArrow=isAbove?-1:1;
                        this.M_drawLines(this.m_groups.Debug,new RQLine(pGroundScreen,pScreen),true);
                        this.M_drawLines(this.m_groups.Debug,new RQPolyLine([pGroundScreen.M_plus(-arrowSz,signArrow*arrowSz),pGroundScreen,pGroundScreen.M_plus(arrowSz,signArrow*arrowSz)]),true);
                    }

                    if(mapOnFloor)
                    {   pScreen = pGroundScreen;
                    }

                    if(!isAbove)
                    {   if(is>0 && i<nbSteps && this.random()<0.2)
                            pGroundScreen.penUp=true;
                        sand.push(pGroundScreen);
                    }

                    out.M_addPoint(pScreen);        // TEMP, deactivated
                    // augment P;
                    Pg.M_add( uGrid);
                }

            }

            /*let valid= true;
            if( pA.y<yClip && pB.y<yClip)
            {
                // do Nothing
                valid=false; 
                pNext = 0;
            }
            else if( pA.y>=yClip && pB.y<yClip)
            {
                pNext = pB.M_plus( pA.M_minus(pB).M_mul(  (yClip-pB.y)/(pA.y-pB.y) ));				
            }
            else if( pA.y<yClip && pB.y>=yClip)
            {
                pA = pA.M_plus( pB.M_minus(pA).M_mul(  (yClip-pA.y)/(pB.y-pA.y) ));				
                pNext=0;
            }
            if( valid)
            {	out.M_addPoint(this.M_projection(pA,C));

            }
            if( pNext )
            {   out.M_addPoint(this.M_projection(pNext,C));
                pNext = 0;				
            }*/
		}
        // draw the sand effect in the mask
        this.M_drawSand(sand);
		return out;	
	
	}
};
