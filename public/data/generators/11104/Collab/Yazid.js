
//-----------
// YAZID
//-----------

const shortening = Math.sqrt(2)/2;

class SpeciesYazid extends SpecyDefault
{
    constructor(name)
    {
        super(name);
        //this.m_isIso = true;
    }
    // factory function : creates an instance of the class
    static create(name)
    {
        return new SpeciesYazid(name);
    }

    // M_init
    M_init(_)
    {
		// Declare groups
		this.M_declareSvgGroup(_,"Shapes");
		this.M_declareSvgGroup(_,"Custom");

        
        // NOTE TO YAZID
        // If you want to control the layout just like in Examples.js
        // you'll have to set the m_implantation variable to "layout"
        // this.m_implantation=='layout'
        // and write a M_layout method.
        

        // call default
        SpecyDefault.prototype.M_init.call(this,_);
     
        
    }
    M_layout(_,layout)
    {
        return [];
    }


    // M_draw 
    // this is where you draw a instance of a "Yazid species“
    // the parameter _ is an instance of the main algorithm, let's say it's our context. 
    
    // Note : the origin of the 2D space is at top/left, so Y axis is looking down 
    M_draw(_,opt)
    {

		let C=new RQVec2(opt.x,opt.y);      // C is a vec2 point on the screen, where the specie is planted
        
        let w=Math.min(12*_.upscale, _.W/10 )*opt.scale;
        let h=w*(1.0+1.0*this.random());                 

    
        let rnd = this.random();
        
        let ThicknessMult = 0.15*_.upscale;

        // Use the "Shapes" group both for contour lines / shape color filling 
        // Use the "Custom" group to set hatches colors depending on your needs
        // REMEMBER : the _.world variable contains the exact objects that you have defined in index.js in M_defineWorlds
        // so you are perfectly allowed to send parameters in the _.world object
        this.m_groups.Custom.m_paletteTag="custom";				
        let colors = ['#127740','#225095','#FDB827','#dd0100','#f697a8','#6d5223'] //'#23120b','#F1F1F1'
        this.m_groups.Custom.m_strokeColor = rndArray(colors,this.random);
        
        
        // define a basic shape
        let shape = new RQPolyLine();        // RQPolyline is a base class that handles polylines ( basically an array of points )

        // Hatch opts
        let hatchOpts=
        {   gap             : Math.round(0.5+this.random()*2)*_.upscale,
            angle           : 45,                             // 0 = vertical 90 = horizontal
            thicknessMult   : ThicknessMult,
            group           : this.m_groups.Custom
        };

        // Custom shape with hatch
        if( rnd<0.2)
        {
            // Rectangle shape
            shape.M_addPoint(C.M_plus(-w/2,0));  // the RQVec2 class allows some basic maths. 
            shape.M_addPoint(C.M_plus(-w/2,-h) );
            shape.M_addPoint(C.M_plus(0,-h-w/2) );
            shape.M_addPoint(C.M_plus(w/2,-h) );
            shape.M_addPoint(C.M_plus(w/2,0) );
            shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 

            // draw contour
            _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Shapes ,true);

            // draw hatches inside

            _.M_jaggedHatchShape(shape,hatchOpts);
            hatchOpts.angle= -45/DEGTORAD,             
            _.M_jaggedHatchShape(shape,hatchOpts);



        }
        // Test circle 
        else if( rnd<0.5)
        {
            shape=(new RQCircle(C.x,C.y-h/3,h/3)).M_createPolyline(100);
            hatchOpts.angle = this.random()*45;
            _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Custom ,true);
            _.M_jaggedHatchShape(shape,hatchOpts);


        }

        // Basic shape with no filling
        else if( rnd<0.7)
        {   ThicknessMult*=2;
            shape.M_addPoint(C.M_plus(-w/2,0));  // the RQVec2 class allows some basic maths. 
            shape.M_addPoint(C.M_plus(-w/2,-h) );
            shape.M_addPoint(C.M_plus(w/2,-h) );
            shape.M_addPoint(C.M_plus(w/2,0) );
            shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 



            // Draw line contour
            // I've made this M_drawJaggedLine method that is replicating your original function and pushes the resulting variable-size dots into the drawing pipeline.
            // it takes a RQPolyline as input
            // the 3d param is what is called a "group" in my framework ( not a good name now that I think of it), but basically it contains information about stroke color, strokewidth. When I do plotter works, a group becomes a layer in the SVG file and allows me to select a different pen for all the lines it contains. 
            // the 4th param decides whether you want to run your polyline through the masking algorithm before converting it into jagged dots. 
            // 
            _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Shapes ,true);
        }

        // hatchedRect tests / patterns 
        else
        {

            shape=(new RQRectangle(C.x,C.y-h,w*2,h)).M_createPolyline();
            let line;
            let pattern = 1+Math.round(this.random()*4);
            let gap = Math.round(1+this.random()*2)*_.upscale;
            let lines = hatchedRect(C.x,C.y-h, w*2, h, gap,  pattern);
            if( lines)
            { 
                while(line=lines.pop())
                {
                    //this.m_groups.Lines.m_strokeColor = this.random()<0.5?"red":"green";    
                    _.M_drawJaggedLine(line,ThicknessMult,this.m_groups.Custom ,true);
                }
            }
        }

        // Fill face
        let F=this.m_groups.Shapes.fill;
        if(F && F.m_active)
            _.M_fillShape(F,shape,{});



        // Draw in mask 
        // By drawing your shape in white color in the mask, it will participates in the masking algorithm. 
        // it means that all the lines that will be issued afterwards will appear "behind" that shape. 
        _.M_drawInMask(shape);
        

    }

    


};



PlantSpecies.M_register("RootsYazid",{ factory:SpeciesYazid.create});