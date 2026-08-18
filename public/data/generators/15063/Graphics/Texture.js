class Texture
{
	constructor(opts)
	{
		this.m_canvas= null;
		this.stateStack=0;
		if( opts.width && opts.height)
		{	this.m_width = opts.width;
			this.m_height = opts.height;
			this.m_canvas = document.createElement('canvas');
			this.m_canvas.width  = this.m_width;
			this.m_canvas.height = this.m_height;
		}
		else if( opts.url)
		{
			// TODO : canvas from image
		
		}
		else if( opts.image)
		{
			this.m_canvas = document.createElement('canvas');
			this.m_canvas.width  = this.m_width= opts.image.width;
			this.m_canvas.height = this.m_height= opts.image.height;
						
		}

	}
	
	M_getContext()
	{
		if( this.m_canvas && this.m_canvas.getContext)
		{	return this.m_canvas.getContext('2d');
		}
		return null;	
	}
	M_fill(color)
	{
		var ctx = this.M_getContext();
		if( ctx)
		{
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, this.m_width, this.m_height);
		}
	
	}
	M_pushState()
	{
		var ctx = this.M_getContext();
		if( ctx)
		{
			ctx.save();
			this.stateStack++;
		}
	}
	M_popState(level)
	{	level??=0;
		var ctx = this.M_getContext();
		if( ctx && this.stateStack>level)
		{	while(this.stateStack>level)
			{	ctx.restore();
				this.stateStack--;
			}
		}
	}
	M_drawImage(opts)
	{
		if( this.m_canvas)
		{	if(opts.url)
			{	
				let o={ texture:this,img:new Image(),opts:opts};
				o.img.onload = function(){
					
					var context = this.texture.M_getContext();
					if( context)
					{	
						let r = this.opts.rect ? this.opts.rect : new RQRectangle(0,0,this.texture.m_width, this.texture.m_height);
						context.drawImage(this.img, r.x,r.y,r.w, r.h);				
					}
					// callback
					if( this.opts.onload)
					{	this.opts.onload.call();
					
					}
				
				}.bind(o);
				o.img.src = opts.url;
			}
			else if( opts.img)
			{
				var context = this.M_getContext();
				if( context)
				{
					let r = opts.rect ? opts.rect : new RQRectangle(0,0,this.m_width, this.m_height);
					context.drawImage(opts.img, r.x,r.y,r.w, r.h);				
				}
			
			}
		}
	}
	
	// returns [0;1]
	M_getPixelIntensity(x,y)
	{
		const _l = 255*255*255;
		var context = this.M_getContext();
		if( context)
		{
			let p = context.getImageData(x,y, 1, 1).data;
			return  p[0]*p[1]*p[2]/_l;
		}
		return 0;
	}
}
