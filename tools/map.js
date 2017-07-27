var	map=	(function()	{
	// Variables
	var	cvs=	null;
	var	ctx=	null;
	var	width=	0;
	var	height=	0;
	var	pixelRatio=	1;
	// The mouse coordinates, gets updated each time the mouse moves
	var	mouse=	[0, 0];
	// The rate of change for the mouse on both x and y. (dx, dy)
	var	deltaMouse=	[0, 0];
	// Used to make the button presses a single press
	var	holds=	[false];
	// Nicely scales the map
	var	scale=	32;
	// The offest that the map has, to be able to move in all directions
	var	offset=	[0, 0];
	// The speed at which the player scrolls about
	var	speed=	8;
	
	// These are all the images that are accessible
	var	imgs=	[];
	// All the assets that are accessible
	var	assets=	[];
	// Highlights whatever the current asset is
	var	currAsset=	0;
	
	// All the objects put on the map
	var	objs=	[];
	
	// All the ui objects
	var	ui=	[];
	
	// The type of brush
	/*
		0	is per pixel
		1	is per 2 pixels
		2	is per 4 pixels
		3	is per 8 pixels
		4	is for flood
	*/
	var	brushType=	0;
	
	// Used to not interfere with the actual tool
	var	isUsingUI=	false;
	
	// Gets the size of the brush
	var	getBrushSize=	function()	{
		switch(brushType)	{
			case 0:
			case 4:	return 1;
			case 1:	return 2;
			case 2:	return 3;
			case 3:	return 4;
		}
		
		return 1;
	};
	
	// This is the core of the game
	var	game=	{
		draw:	function()	{
			// Variables
			var	m=	Math.trunc(Tools.map(mouse[0], 0, width, 0, 9));
			
			ctx.fillStyle=	"#101820";
			ctx.fillRect(0, 0, width, height);
			
			for(var i= 0; i< objs.length; i++)
				objs[i].draw();
			
			var	mx=	Tools.snap(mouse[0], scale)/scale-Math.trunc(getBrushSize()/2);
			var	my=	Tools.snap(mouse[1], scale)/scale-Math.trunc(getBrushSize()/2);
			
			ctx.fillStyle=	"#ffe300";
			ctx.fillRect(
				mx*scale,//Tools.snap(mouse[0], scale)-Math.trunc(getBrushSize()/2)*scale,
				my*scale,//Tools.snap(mouse[1], scale)-Math.trunc(getBrushSize()/2)*scale,
				scale*getBrushSize(),
				scale*getBrushSize()
			);
			
			for(var i= 0; i< ui.length; i++)
				ui[i].draw();
		},
		init:	function()	{
			initImages();
			initAssets();
			initUI();
		},
		update:	function()	{
			// LMB
			if(!isUsingUI && Input.keys["mb0"])	{
				this.placeObject();
			}
			// MMB
			if(Input.keys["mb1"])	{
				offset[0]+=	deltaMouse[0]*(scale/16);
				offset[1]+=	deltaMouse[1]*(scale/16);
			}
			// Movements
			if(Input.keys["w"] || Input.keys["ArrowUp"])	{	offset[1]+=	scale*0.4;	}
			if(Input.keys["a"] || Input.keys["ArrowLeft"])	{	offset[0]+=	scale*0.4;	}
			if(Input.keys["s"] || Input.keys["ArrowDown"])	{	offset[1]-=	scale*0.4;	}
			if(Input.keys["d"] || Input.keys["ArrowRight"])	{	offset[0]-=	scale*0.4;	}
			if(!isUsingUI && Input.keys["wheel"]< 0)	{
				scale*=	1.05;
				offset[0]-=	1;
				offset[1]-=	1;
			}
			if(!isUsingUI && Input.keys["wheel"]> 0)	{
				scale*=	0.95;
				offset[0]+=	1;
				offset[1]+=	1;
			}
			// RMB
			if(Input.keys["mb2"])	{
				for(var i= 0; i< objs.length; i++)	{
					// Variables
					var	x=	Tools.snap(mouse[0], scale)/scale-Tools.snap(offset[0], scale)/scale;
					var	y=	Tools.snap(mouse[1], scale)/scale-Tools.snap(offset[1], scale)/scale;
					
					if(objs[i].pos[0]== x && objs[i].pos[1]== y)	{
						delete objs[i];
						objs.splice(i, 1);
						break;
					}
				}
			}
			
			isUsingUI=	false;
			
			for(var i= 0; i< ui.length; i++)
				ui[i].update();
			
			// Resets the delta
			deltaMouse[0]=	0;
			deltaMouse[1]=	0;
		},
		getRandomColor:	function()	{
			// Variables
			var	color=	"#";
			
			for(var i= 0; i< 6; i++)	{
				color+=	(Math.trunc(Math.random()*3+6));
			}
			
			return color;
		},
		placeObject:	function()	{
			// Variables
			var	x=	Tools.snap(mouse[0], scale)/scale-Tools.snap(offset[0], scale)/scale;
			var	y=	Tools.snap(mouse[1], scale)/scale-Tools.snap(offset[1], scale)/scale;
			var	s=	getBrushSize();
			var	r;
			
			x-=	Math.trunc(s/2);
			y-=	Math.trunc(s/2);
			r=	this.isInRange([x, y, s, s]);
			
			if(r.length> 0)	{
				for(var i= r.length-1; i>= 0; i--)	{
					objs.slice(i, 1);
				}
			}
			
			for(var a= x; a< x+s; a++)	{
				for(var b= y; b< y+s; b++)	{
					objs.push(assets[currAsset].clone(a, b));
				}
			}
			/*
			objs.push({
				pos:	[x, y],
				color:	this.getRandomColor(),
				draw:	function()	{
					ctx.fillStyle=	this.color;
					ctx.fillRect(
						this.pos[0]*scale+Tools.snap(offset[0], scale),
						this.pos[1]*scale+Tools.snap(offset[1], scale),
						scale,
						scale
					);
				}
			});
			*/
		},
		isInRange:	function(rect)	{
			// Variables
			var	range=	[];
			
			for(var i= 0; i< objs.length; i++)	{
				if(objs[i].pos[0]>= rect[0] && objs[i].pos[0]<= rect[0]+rect[2])	{
					if(objs[i].pos[1]>= rect[1] && objs[i].pos[1]<= rect[1]+rect[3])	{
						range.push(i);
					}
				}
			}
			
			return range;
		}
	};
	
	// Resizes the map
	var	resize=	function(args)	{
		// Variables
		var	w=	window.innerWidth-64;
		var	h=	window.innerHeight-32;
		var	r=	pixelRatio;
		
		cvs.width=	w*r;
		cvs.height=	h*r;
		cvs.style.width=	w+"px";
		cvs.style.height=	h+"px";
		ctx.setTransform(r, 0, 0, r, 0, 0);
		
		width=	w;
		height=	h;
	};
	
	// Initiates the pixel ratio, used to make it look nice
	var	initPixelRatio=	function()	{
		// Variables
		var	dpr=	window.devicePixelRatio || 1;
		var	bsr=	(
			ctx.webkitBackingStorePixelRatio ||
			ctx.mozBackingStorePixelRatio ||
			ctx.oBackingStorePixelRatio ||
			ctx.backingStorePixelRatio || 1
		);
		
		pixelRatio=	(dpr/bsr);
	};
	
	// Event to call when the mouse is moving to calculate the input
	var	mousemove=	function(args)	{
		deltaMouse=	[args.clientX-32-mouse[0], args.clientY-16-mouse[1]];
		mouse[0]=	args.clientX-32;
		mouse[1]=	args.clientY-16;
	};
	
	// Initiates all the default stuff that I normally perform
	var	initDefault=	function()	{
		initPixelRatio();
		window.addEventListener("resize", resize);
		window.addEventListener("mousemove", mousemove);
		resize();
	};
	
	// Initiates all the assets of the game
	var	initAssets=	function()	{
		assets=	[
			new Asset(false, imgs["grass"], { tile: 1 }),
			/*
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			new Asset(true, game.getRandomColor(), "#ff0000", 0, 0),
			*/
		];
	};
	
	// Initiates all the images of the game
	var	initImages=	function()	{
		imgs=	{
			grass:	Tools.getImage("imgs/grass.jpg")
			//Tools.getImage("imgs/default")
		};
	};
	
	// Initiates all the ui of the game
	var	initUI=	function()	{
		ui=	[
			new UI(
				function()	{
					ctx.fillStyle=	"ghostwhite";
					ctx.fillRect(width-128, 8, 120, 32);
					ctx.fillStyle=	"midnightblue";
					ctx.font=	"28px monospace";
					ctx.fillText("Tiles", width-128+ctx.measureText("Tiles").width/4, 32);
				},
				function()	{
					if(Tools.contains([width-128, 8, 120, 32], mouse))	{
						isUsingUI=	true;
						if(!this.properties.held && Input.keys["mb0"])	{
							this.properties.held=	true;
							this.properties.isOpen=	!this.properties.isOpen;
						}
						else if(this.properties.held && !Input.keys["mb0"])
							this.properties.held=	false;
					}
				},
				{
					id:	"Opens and closes the object window",
					held:	false,
					isOpen:	false
				}
			),
			new UI(
				function()	{
					ctx.fillStyle=	"ghostwhite";
					ctx.fillRect(8, height-40, 120, 32);
					ctx.fillStyle=	"midnightblue";
					ctx.font=	"28px monospace";
					ctx.fillText("Save", 8+ctx.measureText("Save").width/2, height-16);
				},
				function()	{
					if(Tools.contains([8, height-40, 120, 32], mouse))	{
						isUsingUI=	true;
						if(objs.length== 0)
							return;
						if(!this.properties.held && Input.keys["mb0"])	{
							this.properties.held=	true;
							saveToImage();
						}
						else if(this.properties.held && !Input.keys["mb0"])
							this.properties.held=	false;
					}
				},
				{
					id:	"Saves the map",
					held:	false
				}
			),
			new UI(
				function()	{
					if(!ui[0].properties.isOpen)
						return;
					ctx.fillStyle=	"pink";
					ctx.fillRect(width-128, 40, 120, height-48);
					for(var i= 0; i< assets.length; i++)	{
						if((i-this.properties.top)< 0)
							continue;
						if(40+Math.trunc((i-this.properties.top)/2)*60>= height-48)	{
							break;
						}
						assets[i].draw(
							width-(((i-this.properties.top)%2== 0) ? 128 : 68),
							40+Math.trunc((i-this.properties.top)/2)*60,
							60,
							60
						);
						if(i== currAsset)	{
							ctx.fillStyle=	"ghostwhite";
							ctx.beginPath();
							ctx.arc(
								width-(((i-this.properties.top)%2== 0) ? 128 : 68)+30,
								40+Math.trunc((i-this.properties.top)/2)*60+30,
								12,
								0,
								2*Math.PI
							);
							ctx.fill();
							ctx.fillStyle=	"cornflowerblue";
							ctx.beginPath();
							ctx.arc(
								width-(((i-this.properties.top)%2== 0) ? 128 : 68)+30,
								40+Math.trunc((i-this.properties.top)/2)*60+30,
								10,
								0,
								2*Math.PI
							);
							ctx.fill();
						}
					}
				},
				function()	{
					if(!ui[0].properties.isOpen)
						return;
					if(Tools.contains([width-128, 40, 120, height-48], mouse))	{
						isUsingUI=	true;
					}
					else
						return;
					if(Input.keys["wheel"]> 0)	{
						if(this.properties.tick< this.properties.tickMax)	{
							this.properties.tick++;
						}
						else	{
							this.properties.tick=	0;
							this.properties.top=	Math.min(this.properties.top+2, assets.length-2+assets.length%2);
						}
					}
					if(Input.keys["wheel"]< 0)	{
						if(this.properties.tick< this.properties.tickMax)	{
							this.properties.tick++;
						}
						else	{
							this.properties.tick=	0;
							this.properties.top=	Math.max(this.properties.top-2, 0);
						}
					}
					for(var i= 0; i< assets.length; i++)	{
						if(Tools.contains([width-(((i-this.properties.top)%2== 0) ? 128 : 68), 40+Math.trunc((i-this.properties.top)/2)*60, 60, 60], mouse))	{
							if(!this.properties.held && Input.keys["mb0"])	{
								this.properties.held=	true;
								currAsset=	i;
							}
							else if(this.properties.held && !Input.keys["mb0"])
								this.properties.held=	false;
						}
					}
				},
				{
					id:	"Contains all the assets",
					tick:	0,
					tickMax:	2,
					held:	false,
					top:	0
				}
			),
			new UI(
				function()	{
					ctx.fillStyle=	"ghostwhite";
					ctx.beginPath();
					ctx.arc(width-150, 24, 16, 0, 2*Math.PI);
					ctx.fill();
					ctx.fillStyle=	"#ffce00";
					ctx.beginPath();
					ctx.arc(width-150, 24, 2*getBrushSize(), 0, 2*Math.PI);
					ctx.fill();
				},
				function()	{
					if(Tools.contains([width-150-16, 24-16, 32, 32], mouse))	{
						isUsingUI=	true;
						if(!this.held && Input.keys["mb0"])	{
							this.held=	true;
							brushType=	(brushType+1)%4;
						}
						else if(this.held && !Input.keys["mb0"])
							this.held=	false;
					}
				},
				{
					id:	"The brush sizes",
					held:	false
				}
			)
		]
	};
	
	// Saves the entire thing into a single image
	var	saveToImage=	function()	{
		// Variables
		var	_min=	[Number.MAX_VALUE, Number.MAX_VALUE];
		var	_max=	[Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
		var	_width=	0;
		var	_height=	0;
		var	_cvs=	null;
		var	_ctx=	null;
		var	data=	null;
		var	pixels=	[];
		var	dpr=	window.devicePixelRatio || 1;
		var	bsr;
		var	_pixelRatio;
		
		for(var i= 0; i< objs.length; i++)	{
			_min[0]=	Math.min(objs[i].pos[0], _min[0]);
			_min[1]=	Math.min(objs[i].pos[1], _min[1]);
			_max[0]=	Math.max(objs[i].pos[0], _max[0]);
			_max[1]=	Math.max(objs[i].pos[1], _max[1]);
		}
		
		_width=	_max[0]-_min[0]+1;
		_height=	_max[1]-_min[1]+1;
		
		_cvs=	document.createElement("canvas");
		_ctx=	_cvs.getContext("2d");
		
		bsr=	(
			_ctx.webkitBackingStorePixelRatio ||
			_ctx.mozBackingStorePixelRatio ||
			_ctx.oBackingStorePixelRatio ||
			_ctx.backingStorePixelRatio || 1
		);
		_pixelRatio=	(dpr/bsr);
		
		_cvs.width=	_width;//*_pixelRatio;
		_cvs.height=	_height;//*_pixelRatio;
		_cvs.style.width=	_width+"px";
		_cvs.style.height=	_height+"px";
		//_ctx.setTransform(_pixelRatio, 0, 0, _pixelRatio, 0, 0);
		_ctx.imageSmoothingEnabled=	false;
		
		for(var a= 0; a< _height; a++)	{
			pixels[a]=	[];
			for(var b= 0; b< _width; b++)	{
				pixels[a][b]=	[0, 0, 0, 255];
				for(var c= 0; c< objs.length; c++)	{
					if(objs[c].pos[0]== b+_min[0] && objs[c].pos[1]== a+_min[1])	{
						pixels[a][b]=	toColorArray(objs[c].colorCode);
						break;
					}
				}
			}
		}
		_ctx.putImageData(createData(convertArray(pixels), _width, _height), 0, 0);
		data=	document.createElement("a");
		data.href=	_cvs.toDataURL("image/png");
		data.download=	"map.png";
		data.click();
	};
	
	// Creates a image data from the array of color components
	var	createData=	function(arr, w, h)	{
		// Variables
		var	data=	new ImageData(w, h);
		
		for(var i= 0; i< arr.length; i++)	{
			data.data[i]=	arr[i];
		}
		
		return data;
	};
	
	// Converts the array into a 1d array
	var	convertArray=	function(arr)	{
		// Variables
		var	a=	arr.join().split(',');
		
		for(var i= 0; i< a.length; i++)
			a[i]=	parseInt(a[i]);
		
		return a;
	};
	
	// Gets a color array from the given color
	var	toColorArray=	function(colorCode)	{
		// Variables
		var	r=	colorCode.tile || 0;
		var	g=	0;
		var	b=	0;
		var	a=	255;
		
		return [r, g, b, a];
	};
	
	// Initiates and runs the game
	var	run=	function()	{
		cvs=	document.getElementById("cvs");
		ctx=	cvs.getContext("2d");
		
		initDefault();
		window.addEventListener("contextmenu", function(args)	{
			args.preventDefault();
		});
		
		Timer.start(game);
	};
	
	function Asset(isColored, img, colorCode, x, y)	{
		this.isColored=	isColored;
		this.img=	img;
		this.colorCode=	colorCode;
		this.pos=	[x || 0, y || 0];
		
		this.clone=	function(_x, _y)	{
			return new Asset(this.isColored, this.img, this.colorCode, _x, _y);
		};
		
		this.draw=	function(x, y, w, h)	{
			if(this.isColored)	{
				ctx.fillStyle=	this.img;
				ctx.fillRect(
					x || this.pos[0]*scale+Tools.snap(offset[0], scale),
					y || this.pos[1]*scale+Tools.snap(offset[1], scale),
					w || scale,
					h || scale
				);
			}
			else	{
				ctx.drawImage(
					this.img,
					x || this.pos[0]*scale+Tools.snap(offset[0], scale),
					y || this.pos[1]*scale+Tools.snap(offset[1], scale),
					w || scale,
					h || scale
				);
			}
		};
	}
	
	function UI(drawFunc, updateFunc, properties)	{
		this.draw=	drawFunc || function(){};
		this.update=	updateFunc || function(){};
		this.properties=	properties;
	}
	
	return {
		run:	run
	};
})();