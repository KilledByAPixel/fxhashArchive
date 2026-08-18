
//-----------
// YAZID
//-----------

const shortening = Math.sqrt(2)/2;

class SpeciesYazid extends SpecyDefault
{
    constructor(name)
    {
        super(name);
        this.m_isIso = true;
    }
    // factory function : creates an instance of the class
    static create(name)
    {
        return new SpeciesYazid(name);
    }

    // M_init
    // here you will be able to init your specie and read some parameters that come from the framework
    // (naming convention, function names starting with M_ means they are class methods. Similarly, m_ prefix means class members. But I don't always respect that )     
    M_init(_)
    {
		// Declare groups
		this.M_declareSvgGroup(_,"Lines");
		this.M_declareSvgGroup(_,"Solid");

        this.m_groups.Lines.m_paletteTag="custom";				

        // call default
        SpecyDefault.prototype.M_init.call(this,_);
     
        
    }

    // M_draw 
    // this is where you draw a instance of a "Yazid species“
    // the parameter _ is an instance of the main algorithm, let's say it's our context. 
    
    // Note : the origin of the 2D space is at top/left, so Y axis is looking down 
    M_draw(_,opt)
    {

		let C=new RQVec2(opt.x,opt.y);      // C is a vec2 point on the screen, where the specie is planted
        
        let w=12*_.upscale*opt.scale;                 // _.upscale is a value that translate units in millimeter into units on the canvas.
        let h=60*_.upscale*opt.scale*(0.5+0.5*this.random());                 // here we just define w = 12mm and h=30mm

    
        let rnd = this.random();
        
        let ThicknessMult = 0.15*_.upscale;

        this.m_groups.Lines.m_paletteTag="custom";				
        this.m_groups.Lines.m_strokeColor="black";

        
        // define a basic shape
        let shape = new RQPolyLine();        // RQPolyline is a base class that handles polylines ( basically an array of points )

        // Custom shape with hatch
        if( rnd<0.2)
        {
            // Shape with a skew
            w*=2;
            shape.M_addPoint(C.M_plus(-w/2,0));  // the RQVec2 class allows some basic maths. 
            shape.M_addPoint(C.M_plus(-w/2,-h) );
            shape.M_addPoint(C.M_plus(w/2,-h) );
            shape.M_addPoint(C.M_plus(w/2,0) );
            shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 

            // draw contour
            _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);

            // draw hatches inside
            const shortening = Math.sqrt(2)/2;
            let hatchOpts=
            {   gap             : Math.round(0.5+this.random()*2)*_.upscale,
                angle           : 90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                thicknessMult   : ThicknessMult,
                group           : this.m_groups.Lines
            };

            _.M_jaggedHatchShape(shape,hatchOpts);

            // cross hatch 
            hatchOpts.angle= 90+Math.atan2(1-shortening,shortening)/DEGTORAD,             
            _.M_jaggedHatchShape(shape,hatchOpts);



        }
        // Test circle 
        else if( rnd<0.5)
        {
            shape=(new RQCircle(C.x,C.y-h/3,h/3)).M_createPolyline(100);
            this.m_groups.Lines.m_strokeColor="rgba(0,60,0,0.8)";
            let hatchOpts=
            {   gap             : Math.round(0.5+this.random()*2)*_.upscale,
                angle           : this.random()*45,
                thicknessMult   : ThicknessMult,
                group           : this.m_groups.Lines
            };
            _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
            _.M_jaggedHatchShape(shape,hatchOpts);


        }

        // Basic shape with no filling
        else if( rnd<0.7)
        {   ThicknessMult*=2;
            shape.M_addPoint(C.M_plus(-w/2,0));  // the RQVec2 class allows some basic maths. 
            shape.M_addPoint(C.M_plus(-w/3,-h) );
            shape.M_addPoint(C.M_plus(w/3,-h) );
            shape.M_addPoint(C.M_plus(w/2,0) );
            shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 



            // Draw line contour
            // I've made this M_drawJaggedLine method that is replicating your original function and pushes the resulting variable-size dots into the drawing pipeline.
            // it takes a RQPolyline as input
            // the 3d param is what is called a "group" in my framework ( not a good name now that I think of it), but basically it contains information about stroke color, strokewidth. When I do plotter works, a group becomes a layer in the SVG file and allows me to select a different pen for all the lines it contains. 
            // the 4th param decides whether you want to run your polyline through the masking algorithm before converting it into jagged dots. 
            // 
            _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
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
                    _.M_drawJaggedLine(line,ThicknessMult,this.m_groups.Lines ,true);
                }
            }
        }

        // Draw in mask 
        // By drawing your shape in white color in the mask, it will participates in the masking algorithm. 
        // it means that all the lines that will be issued afterwards will appear "behind" that shape. 
        _.M_drawInMask(shape);
        

       /* let tileWidth = w
        let tileHeight = w/2
        let blockW = (0.5+(this.random()*1))
        // let blockH
        
        let availableTypes = [0,1,2,3,4,5,6]
        let stackableTypes = [0,6]
        let colors = ['#127740','#225095','#FDB827','#dd0100','#f697a8','#6d5223'] //'#23120b','#F1F1F1'

        let blocks = []
        let levels = 1+Math.round(this.random()*2)
        for(let i=0;i<levels;i++){
            let blockProps = {
                blockH:     (0.5+(this.random()*1.5)),
                blockType:  availableTypes[Math.round(this.random()*availableTypes.length-1)],
                blockW:     blockW + -0.25 + (this.random()*1.25),
                color:      colors[Math.round(this.random()*colors.length-1)]
            }
            blocks.push(blockProps)
        }

        for(let i=levels-1;i>=0;i--){
            let blockProps = blocks[i]

            if(i>0){
                if(!stackableTypes.includes(blocks[i-1].blockType)){
                    continue;
                }
            }

            let startHeight = blocks.slice(0,i).reduce((accumulator, a) => accumulator + (a.blockH*tileHeight), 0)
            
            let shapesAndHatches = this.M_getBlock(_,C,blockProps.blockType,startHeight,tileWidth,tileHeight,blockProps.blockW,blockProps.blockH,ThicknessMult)
            let shapes = shapesAndHatches.shapes
            let hatches = shapesAndHatches.hatches
            

            for(let i=0;i<shapes.length;i++){
                let shape = shapes[i]
                let hatchOpts = hatches[i]
                // let path = new Path2D(shape.M_getSVGPath(true));
                // let context = _.m_mask.M_getContext();
                // context.fillStyle = "white";
                // context.fill(path);

                // draw contour
                
                this.m_groups.Lines.m_strokeColor = blockProps.color;
                _.M_jaggedHatchShape(shape,hatchOpts);
                // cross hatch 
                hatchOpts.angle= 90+Math.atan2(1-shortening,shortening)/DEGTORAD,             
                _.M_jaggedHatchShape(shape,hatchOpts);

                this.m_groups.Lines.m_strokeColor = '#23120b';
                _.M_drawJaggedLine(shape,ThicknessMult*1.5,this.m_groups.Lines ,true);
                


                // Fill shape background ( avoids transparency, or minimize transparency )
                let F = this.m_groups.Solid;
                _.M_fillShape(F,shape,F);

                // Draw in mask 
                // By drawing your shape in white color in the mask, it will participates in the masking algorithm. 
                // it means that all the lines that will be issued afterwards will appear "behind" that shape. 
                _.M_drawInMask(shape);
            }
        }*/
    }

    // Isometric Toy Blocks
    M_getBlock(_,C,blockType,startHeight,tileWidth,tileHeight,blockW,blockH,ThicknessMult){
        let shapes = []
        let hatches = []
        let shape
        let hatchOpts

        let x = 0//(-0.001+(this.random()*1.001))*tileWidth
        let y = -(blockH*tileHeight)-(blockW*tileHeight/2)-startHeight

        switch(blockType){
            case 0:
                // right
                shape = new RQPolyLine()
                shape.M_addPoint(C.M_plus(x,y+blockW*tileHeight));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));

                shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts =
                {   gap             : Math.round(0.5)*_.upscale,
                    angle           : 90+90/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // left
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x,y+blockW*tileHeight));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(1.25)*_.upscale,
                    angle           : 90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // top
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x,y));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockW*tileHeight)));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+((blockW*tileHeight/2))));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(2)*_.upscale,
                    angle           : 90+0/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)
            break;
            case 1:
                // top
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/4,y));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/4,y+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(0.5)*_.upscale,
                    angle           : 90+90/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // right
                shape = new RQPolyLine()
                shape.M_addPoint(C.M_plus(x+blockW*tileWidth/4,y+blockW*tileHeight/2));
                shape.M_addPoint(C.M_plus(x+blockW*tileWidth/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));

                shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(2)*_.upscale,
                    angle           : 90+0/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)
            break;
            case 2:
                // top
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/4,y));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/4,y+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(2)*_.upscale,
                    angle           : 90+0/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // left
                shape = new RQPolyLine()
                shape.M_addPoint(C.M_plus(x-blockW*tileWidth/4,y+blockW*tileHeight/2));
                shape.M_addPoint(C.M_plus(x-blockW*tileWidth/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));

                shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(0.5)*_.upscale,
                    angle           : 90+90/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)
            break;
            case 3:
                // right
                shape = new RQPolyLine()
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight/2+blockW*tileHeight)));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));

                shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts =
                {   gap             : Math.round(0.5)*_.upscale,
                    angle           : 90+90/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // left
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x,y+blockH*tileHeight/2+blockW*tileHeight));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+blockH*tileHeight/2+blockW*tileHeight/2));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(1.25)*_.upscale,
                    angle           : 90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // top
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x,y));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight/2)+(blockW*tileHeight)));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockH*tileHeight/2)+(blockW*tileHeight/2)));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(2)*_.upscale,
                    angle           : 90+0/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)
            break;
            case 4:
                // right
                shape = new RQPolyLine()
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight/2+blockW*tileHeight)));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+blockH*tileHeight/2+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));

                shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts =
                {   gap             : Math.round(0.5)*_.upscale,
                    angle           : 90+90/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // left
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x,y+blockH*tileHeight/2+blockW*tileHeight));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(1.25)*_.upscale,
                    angle           : 90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // top
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x,y));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+blockH*tileHeight/2+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight/2+blockW*tileHeight)));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockW*tileHeight/2)));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(2)*_.upscale,
                    angle           : 90+0/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)
            break;
            case 5:
                // right
                shape = new RQPolyLine()
                shape.M_addPoint(C.M_plus(x,y));
                shape.M_addPoint(C.M_plus(x+(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));

                shape.M_closePath();                 // M_closePath just copies the first point at the end of the list. 
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts =
                {   gap             : Math.round(2)*_.upscale,
                    angle           : 90+0/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // left
                shape = new RQPolyLine();
                shape.M_addPoint(C.M_plus(x,y));
                shape.M_addPoint(C.M_plus(x-(blockW*tileWidth)/2,y+(blockH*tileHeight)+(blockW*tileHeight/2)));
                shape.M_addPoint(C.M_plus(x,y+(blockH*tileHeight)+(blockW*tileHeight)));
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(1.25)*_.upscale,
                    angle           : 90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)
            break;
            case 6:
                let PI = 3.14159265358979323846
      
                // top                
                shape = new RQPolyLine();
                for(let i=-PI;i<PI;i+=PI/30){
                    let a=blockW/4*tileWidth
                    let b=a/2
                    let r=(a*b)/Math.sqrt((Math.pow(a,2)*Math.pow(Math.sin(i),2))+(Math.pow(b,2)*Math.pow(Math.cos(i),2)))
                    let x1=x+r*Math.cos(i)
                    let y1=y+(blockW*tileHeight/2)+r*Math.sin(i)
                    shape.M_addPoint(C.M_plus(x1,y1));
                }
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(2)*_.upscale,
                    angle           : 90+0/DEGTORAD,//90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)

                // side
                shape = new RQPolyLine();
                for(let i=0;i<PI;i+=PI/60){
                    let a=blockW/4*tileWidth
                    let b=a/2
                    let r=(a*b)/Math.sqrt((Math.pow(a,2)*Math.pow(Math.sin(i),2))+(Math.pow(b,2)*Math.pow(Math.cos(i),2)))
                    let x1=x+r*Math.cos(i)
                    let y1=y+(blockW*tileHeight/2)+r*Math.sin(i)
                    shape.M_addPoint(C.M_plus(x1,y1));
                }
                for(let i=PI;i>0;i-=PI/60){
                    let a=blockW/4*tileWidth
                    let b=a/2
                    let r=(a*b)/Math.sqrt((Math.pow(a,2)*Math.pow(Math.sin(i),2))+(Math.pow(b,2)*Math.pow(Math.cos(i),2)))
                    let x1=x+r*Math.cos(i)
                    let y1=y+blockH*tileHeight+(blockW*tileHeight/2)+r*Math.sin(i)
                    shape.M_addPoint(C.M_plus(x1,y1));
                }
                shape.M_closePath();
                // _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines ,true);
                shapes.push(shape)
                hatchOpts=
                {   gap             : Math.round(1.25)*_.upscale,
                    angle           : 90-Math.atan2(1+shortening,shortening)/DEGTORAD,                             // 0 = vertical 90 = horizontal
                    thicknessMult   : ThicknessMult,
                    group           : this.m_groups.Lines
                };
                hatches.push(hatchOpts)
            break;
        }

        return {shapes:shapes,hatches:hatches}
    }


};



PlantSpecies.M_register("RootsYazid",{ factory:SpeciesYazid.create});