
function FlowField(_canvas, _showFlowField)	{
	this.canvas=	_canvas;
	this.showFlowField=	_showFlowField || false;
	this.context=	_canvas.getContext("2d");
	this.width=	this.canvas.width;
	this.height=	this.canvas.height;
	this.scale=	10;
	this.columns=	Math.floor(this.width/this.scale);
	this.rows=	Math.floor(this.height/this.scale);
	this.increment=	0.000025;
	this.incSearch=	40000;
	
	let	flows=	[]
	let	particles=	[];
	let	zOff=	-1;
	
	for(let i= 0; i< 400; i++)	{
		particles[i]=	new Particle(this.width, this.height);
	}
	
	this.context.fillStyle=	"#fff";
	this.context.fillRect(0, 0, this.width, this.height);
	
	function format(str)	{
		if(str.length== 1)
			return "0"+str;
		return str;
	}
	
	// --- Methods ---
	
	this.setParticleRNGColor=	function()	{
		for(let i= 0; i< particles.length; i++)	{
			particles[i].color=	particles[i].rngColor();
		}
	};
	
	this.setParticleColor=	function(c)	{
		for(let i= 0; i< particles.length; i++)	{
			particles[i].color=	c;
		}
	};
	
	this.reset=	function()	{
		NoiseGenerator.reinit();
		delete	flows;
		flows=	[];
		zOff=	0;
		console.log(this.increment);
		this.context.fillStyle=	"#fff";
		this.context.fillRect(0, 0, this.width, this.height);
		for(let i= 0; i< particles.length; i++)	{
			particles[i].reset();
		}
	}
	
	this.update=	function(showFlow, _context)	{
		// Variables
		let	xOff=	0;
		let	context=	_context || this.context;
		
		if(this.showFlowField=== true || showFlow=== true || showFlow=== 2)	{
			context.fillStyle=	"#fff";
			context.fillRect(0, 0, this.width, this.height);
		}
		for(let a= 0; a< this.columns; a++)	{
			// Variables
			let	yOff=	0;
			
			for(let b= 0; b< this.rows; b++)	{
				// Variables
				let	index=	a+b*this.columns;
				let	angle=	NoiseGenerator.noise(
					xOff,
					yOff,
					zOff
				);
				let	vec=	Vector2.fromAngle(angle*Math.PI*2);
				
				flows[index]=	vec;
				if(this.showFlowField=== true || showFlow=== true)	{
					// Variables
					let	heading=	vec.getHeading();
					
					context.lineWidth = 1;
					context.translate(
						a*this.scale,
						b*this.scale
					);
					context.rotate(heading);
					
					context.strokeStyle=	"#000";
					
					context.beginPath();
						context.moveTo(0, 0);
						context.lineTo(this.scale, 0);
					context.stroke();
					
					context.resetTransform();
				}
				else if(showFlow=== 2)	{
					// Variables
					let	cf=	Math.floor(Math.map(angle, -1, 1, 0, 1)*0xff);
					
					cf=	"#"+(
						format(cf.toString(16))+
						format(cf.toString(16))+
						format(cf.toString(16))
					);
					
					context.fillStyle=	cf;
					context.fillRect(a*this.scale, b*this.scale, this.scale, this.scale);
				}
				
				yOff+=	1/this.rows;
			}
			xOff+=	1/this.columns;
			zOff+=	this.increment;
			if(zOff< -(this.incSearch*Math.abs(this.increment)) || zOff> (this.incSearch*Math.abs(this.increment)))	{
				this.increment*=	-1;
			}
		}
		
		if(this.showFlowField=== false || !showFlow)	{
			for(let i= 0; i< particles.length; i++)	{
				particles[i].detectEdges();
				particles[i].follow(flows, this.scale, this.columns);
				particles[i].update();
				particles[i].render(context);
			}
		}
	}
}
