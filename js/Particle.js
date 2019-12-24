var	OVERALL_COLOR=	"#101820";

function Particle(_width, _height)	{
	this.pixelSize = 4;
	this.width=	_width;
	this.height=	_height;
	this.pos=	new Vector2(
		Math.random()*this.width,
		Math.random()*this.height
	);
	this.prev=	this.pos.clone();
	this.vel=	Vector2.ZERO.clone();
	this.acc=	Vector2.ZERO.clone();
	this.maxSpeed=	12.85;
	this.rngColor=	function()	{
		// Variables
		let	r=	Math.floor(256*Math.random()).toString(16);
		let	g=	Math.floor(256*Math.random()).toString(16);
		let	b=	Math.floor(256*Math.random()).toString(16);
		
		return "#"+format(r)+format(g)+format(b);
	};
	this.color=	(OVERALL_COLOR) || this.rngColor();
	
	// --- Methods ---
	
	this.reset=	function()	{
		this.pos=	new Vector2(
			Math.random()*this.width,
			Math.random()*this.height
		);
		this.prev=	this.pos.clone();
		this.vel=	Vector2.ZERO.clone();
		this.acc=	Vector2.ZERO.clone();
	};
	
	this.update=	function()	{
		this.prev=	this.pos.clone();
		this.vel.mul(0.8);
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mul(0);
	};
	
	this.render=	function(context)	{
		context.strokeStyle=	this.color || "#101820";
		//context.fillStyle=	"#101820";
		context.globalAlpha=	0.48;
		context.lineWidth = this.pixelSize;
		
		context.beginPath();
			context.moveTo(this.prev.x, this.prev.y);
			context.lineTo(this.pos.x, this.prev.y);
		context.stroke();
		
		//context.fillRect(this.pos.x, this.pos.y, 1, 1);
		context.globalAlpha=	1;
	};
	
	this.swapColors=	function(c)	{
		this.color=	c;
		/*while(getGrayscale()< 128)	{
			this.color=	"#"+(
				this.color.substring(5, 7)+
				this.color.substring(1, 3)+
				this.color.substring(3, 5)
			);
		}*/
	};
	
	this.rngPos = function(a, b) { return a + (b - a) * Math.random(); };
	
	this.detectEdges=	function()	{
		if(this.pos.x < 0 || this.pos.x> this.width)	{
			this.pos.x=	this.rngPos(this.x, this.width);
			resetPrev.call(this);
		}
		if(this.pos.y < 0 || this.pos.y> this.height)	{
			this.pos.y=	this.rngPos(this.y, this.height);
			resetPrev.call(this);
		}
	};
	
	this.follow=	function(flows, scale, columns)	{
		// Variables
		let	x=	Math.floor(this.pos.x/scale);
		let	y=	Math.floor(this.pos.y/scale);
		let	index;
		let	force;
		
		x%=	this.width;
		y%=	this.height;
		
		index=	x+columns*y;
		index%=	flows.length;
		force=	flows[index];
		this.applyForce(force);
	};
	
	this.applyForce=	function(force)	{
		this.acc.add(force);
	};
	
	/*function getGrayscale()	{
		return (this.color
	}*/
	
	function resetPrev()	{
		this.prev.x=	this.pos.x;
		this.prev.y=	this.pos.y;
	}
	
	function format(comp)	{
		if(comp.length== 1)
			return "0"+comp;
		return comp;
	}
}
