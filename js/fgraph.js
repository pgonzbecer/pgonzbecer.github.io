
// Variables
let	FGraph=	(function()	{
	// Variables
	let	createGraph=	function(cvs)	{
		// Variables
		let	graph=	new Graph(cvs);
		
		return graph;
	};
	
	// --- Functions ---
	
	function Graph(__cvs)	{
		// Variables
		this.xRange=	new Vector2(-10, 10);
		this.yRange=	new Vector2(-10, 10);
		this.partition=	250;
		const	ctx=	__cvs.getContext("2d");
		let	funcs=	[];
		
		// --- Methods ---
		
		// Adds the function to the graph, returns the function object
		this.addFunction=	function(func)	{
			funcs.push(new Function(func));
			funcs[funcs.length-1].graph=	this;
			
			return funcs[funcs.length-1];
		};
		
		// Renders the graph
		this.render=	function()	{
			// Variables
			let	xp=	(this.xRange.y-this.xRange.x)/this.partition;
			let	yp=	(this.yRange.y-this.yRange.x)/this.partition;
			let	a=	0;
			
			ctx.fillStyle=	"#fefefe";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.fillStyle=	"#efefef";
			for(let i= 0; i< this.partition; i++)	{
				a=	xp*i+this.xRange.x;
				a=	map(
					Math.floor(a),
					this.xRange.x, this.xRange.y,
					0, 1
				);
				renderLineY(a);
				a=	yp*i+this.yRange.x;
				a=	map(
					Math.floor(a),
					this.yRange.x, this.yRange.y,
					0, 1
				);
				renderLineX(a);
			}
			ctx.fillStyle=	"#101820";
			if(this.xRange.x< 0 && this.xRange.y> 0)	{
				renderLineY(
					map(0, this.xRange.x, this.xRange.y, 0, 1),
					2
				);
			}
			if(this.yRange.x< 0 && this.yRange.y> 0)	{
				renderLineX(
					map(0, this.yRange.x, this.yRange.y, 0, 1),
					2
				);
			}
			for(let i= 0; i< funcs.length; i++)	{
				funcs[i].render(ctx);
			}
		};
		
		// Renders a line on the x-axis
		let	renderLineX=	function(y, lineWidth)	{
			if(!lineWidth)	lineWidth=	1;
			ctx.fillRect(0, ctx.canvas.height-ctx.canvas.height*y-lineWidth*0.5, ctx.canvas.width, lineWidth);
		};
		
		// Renders a line on the y-axis
		let	renderLineY=	function(x, lineWidth)	{
			if(!lineWidth)	lineWidth=	1;
			ctx.fillRect(ctx.canvas.width*x-lineWidth*0.5, 0, lineWidth, ctx.canvas.height);
		};
		
		// Called when the mouse has moved over the graph
		let	onMouseMove=	function(args)	{
			for(let i= 0; i< funcs.length; i++)	{
				funcs[i].onMouseMove(args);
			}
		};
		
		let	onMouseDown=	function(args)	{
			for(let i= 0; i< funcs.length; i++)	{
				funcs[i].onMouseDown(args);
			}
		};
		
		let	onMouseUp=	function(args)	{
			for(let i= 0; i< funcs.length; i++)	{
				funcs[i].onMouseUp(args);
			}
		};
		
		__cvs.addEventListener("mousemove", onMouseMove);
		__cvs.addEventListener("mousedown", onMouseDown);
		__cvs.addEventListener("mouseup", onMouseUp);
	}
	
	return {
		createGraph:	createGraph
	};
})();
	
function map(val, omin, omax, nmin, nmax)	{
	return (
		((val-omin)/(omax-omin))*
		(nmax-nmin)+nmin
	);
}

function Pin(__x, __func, __graph)	{
	// Variables
	this.func=	__func;
	this.x=	__x;
	this.size=	4;
	this.graph=	__graph;
	this.color=	"#ff0000";
	let	events=	{
		mouseDown:	false,
		isHovering:	false
	};
	
	// --- Methods ---
	
	this.render=	function(ctx)	{
		// Variables
		let	a=	map(this.x, this.graph.xRange.x, this.graph.xRange.y, 0, ctx.canvas.width);
		let	b=	ctx.canvas.height-map(this.func.func(this.x), this.graph.yRange.x, this.graph.yRange.y, 0, ctx.canvas.height);
		
		ctx.fillStyle=	this.color;
		ctx.beginPath();
		ctx.ellipse(a, b, this.size, this.size, 0, 0, 2*Math.PI, false);
		ctx.fill();
	}
	
	this.onMouseMove=	function(args)	{
		if(events.mouseDown)	{
			// Variables
			let	a=	args.clientX-args.target.offsetLeft;
			
			this.x=	map(a, 0, args.target.width, this.graph.xRange.x, this.graph.xRange.y);
			console.log(a);
			this.graph.render();
		}
		else	{
			// Variables
			let	a=	args.clientX-args.target.offsetLeft;
			let	b=	args.clientY-args.target.offsetTop;
			let	c=	Math.round(map(this.x, this.graph.xRange.x, this.graph.xRange.y, 0, args.target.width));
			let	d=	Math.round(args.target.height-map(this.func.func(this.x), this.graph.yRange.x, this.graph.yRange.y, 0, args.target.height));
			let	v=	new Vector2(c-a, d-b);
			
			if(v.getMagnitude()<= this.size+Math.min(1, this.size*0.1))	{
				events.isHovering=	true;
			}
		}
	};
	
	this.onMouseDown=	function(args)	{
		if(events.isHovering)	{
			events.mouseDown=	true;
		}
	};
	
	this.onMouseUp=	function(args)	{
		events.mouseDown=	false;
	};
}

function Function(__func)	{
	// Variables
	this.func=	__func;
	this.color=	"#6ab4e6";
	this.lineWidth=	3;
	this.pins=	[];
	this.graph=	undefined;
	
	// --- Methods ---
	
	this.addPin=	function(x)	{
		if(!x)
			x=	((this.graph.xRange.y-this.graph.xRange.x)/2)+this.graph.xRange.x;
		this.pins.push(new Pin(x, this, this.graph));
		
		return this.pins[this.pins.length-1];
	};
	
	this.changeFunction=	function(_func)	{
		this.func=	_func;
	};
	
	// Renders the function onto the graph
	this.render=	function(ctx)	{
		// Variables
		let	a=	this.graph.xRange.x;
		let	b=	this.graph.xRange.y;
		let	xp=	(b-a)/this.graph.partition;
		let	c, d;
		
		ctx.strokeStyle=	this.color;
		ctx.lineWidth=	this.lineWidth;
		ctx.beginPath();
		for(let i= 0; i<= this.graph.partition; i++)	{
			if(i== 0)	{
				ctx.moveTo(
					0,
					ctx.canvas.height-map(
						this.func(a),
						this.graph.yRange.x,
						this.graph.yRange.y,
						0,
						ctx.canvas.height
					)
				);
				continue;
			}
			c=	xp*i+a;
			d=	this.func(c);
			ctx.lineTo(
				map(
					c,
					this.graph.xRange.x,
					this.graph.xRange.y,
					0,
					ctx.canvas.width
				),
				ctx.canvas.height-map(
					d,
					this.graph.yRange.x,
					this.graph.yRange.y,
					0,
					ctx.canvas.height
				)
			);
		}
		ctx.stroke();
		for(let i= 0; i< this.pins.length; i++)	{
			this.pins[i].render(ctx);
		}
	};
	
	this.onMouseMove=	function(args)	{
		for(let i= 0; i< this.pins.length; i++)	{
			this.pins[i].onMouseMove(args);
		}
	};
	
	this.onMouseDown=	function(args)	{
		for(let i= 0; i< this.pins.length; i++)	{
			this.pins[i].onMouseDown(args);
		}
	};
	
	this.onMouseUp=	function(args)	{
		for(let i= 0; i< this.pins.length; i++)	{
			this.pins[i].onMouseUp(args);
		}
	};
}


function Vector2(__x, __y)	{
	this.x=	__x;
	this.y=	__y;
	
	// --- Methods ---
	
	this.getHeading=	function()	{
		return Math.atan2(this.y, this.x);
	}
	
	this.getMagnitude=	function()	{
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}
	
	this.limit=	function(scalar)	{
		// Variables
		let	mag=	this.getMagnitude();
		
		this.mul(scalar/mag);
	}
	
	this.clone=	function()	{
		return new Vector2(this.x, this.y);
	}
	
	this.add=	function(vec)	{
		this.x+=	vec.x;
		this.y+=	vec.y;
	}
	
	this.sub=	function(vec)	{
		this.x-=	vec.x;
		this.y-=	vec.y;
	}
	
	this.mul=	function(scalar)	{
		this.x*=	scalar;
		this.y*=	scalar;
	}
	
	this.div=	function(scalar)	{	this.mul(1/scalar);	}
	
	this.dot=	function(vec)	{
		return this.x*vec.x+this.y*vec.y;
	}
}
Vector2.ZERO=	new Vector2(0, 0);
Vector2.fromAngle=	function(angle)	{
	return new Vector2(Math.cos(angle), Math.sin(angle));
}

function Color(__r, __g, __b)	{
	// Variables
	let	r=	null;
	let	g=	null;
	let	b=	null;
	
	// Using a hex
	if(__r && !__g && !__b)	{
		r=	__r.substring(1);
		if(r.length== 3)	{
			g=	Number.parseInt(r[1]+r[1], 16);
			b=	Number.parseInt(r[2]+r[2], 16);
			r=	Number.parseInt(r[0]+r[0], 16);
		}
		else	{
			g=	Number.parseInt(r[2]+r[3], 16);
			b=	Number.parseInt(r[4]+r[5], 16);
			r=	Number.parseInt(r[0]+r[1], 16);
		}
	}
	else if(__r && __g && __b)	{
		r=	__r;
		g=	__g;
		b=	__b;
	}
	else	{
		throw "Not a color";
	}
	
	// --- Methods ---
	
	function format(str)	{
		if(str.length== 1)	return "0"+str;
		return str;
	}
	
	// Gets the color in hex form
	this.toHex=	function()	{
		return ("#"+format(r.toString(16))+format(g.toString(16))+format(b.toString(16)));
	}
	
	// Gets the color in string form (hex)
	this.toString=	function()	{
		return this.toHex();
	}
}