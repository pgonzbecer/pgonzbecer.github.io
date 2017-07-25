// Variables
// These are several tool functions that help me. TODO: Move this to another js file for general use
var	Tools=	(function()	{
	return {
		map:	function(val, oldMin, oldMax, newMin, newMax)	{
			return (((newMax-newMin)/(oldMax-oldMin))*val);
		},
		snap:	function(val, scale)	{
			// Variables
			var	temp=	Math.trunc(val/scale);
			
			return temp*scale;
		},
		getImage:	function(name)	{
			// Variables
			var	i=	document.createElement("img");
			
			i.src=	name;
			
			return i;
		},
		contains:	function(rect, pt)	{
			if(pt[0]< rect[0] || pt[0]> rect[0]+rect[2])
				return false;
			if(pt[1]< rect[1] || pt[1]> rect[1]+rect[3])
				return false;
			return true;
		}
	};
})();

// The input of the game
var Input=	(function()	{
	// Variables
	var	keys=	[];
	var	isInit=	false;
	
	// Initiates the input
	var	init=	function()	{
		if(isInit)
			return;
		isInit=	true;
		
		window.addEventListener("keydown", inpKeyDown);
		window.addEventListener("mousedown", inpKeyDown);
		window.addEventListener("keyup", inpKeyUp);
		window.addEventListener("mouseup", inpKeyUp);
		window.addEventListener("wheel", inpWheel);
	};
	
	var	update=	function(args)	{
		keys["wheel"]=	0;
	};
	
	var	inpWheel=	function(args)	{
		keys["wheel"]=	args.deltaY;
	};
	
	var	inpKeyDown=	function(args)	{
		keys[args.key || ("mb"+args.button)]=	true;
	};
	
	var	inpKeyUp=	function(args)	{
		keys[args.key || ("mb"+args.button)]=	false;
	};
	
	return {
		keys:	keys,
		update:	update,
		init:	init
	};
})();

// The timer of the game to get everything moving
var	Timer=	(function()	{
	// Variables
	var	fps=	60;
	var	mpf=	1000/fps;
	var	prevTime=	null;
	var	currTime=	null;
	var	elapTime=	null;
	var	lagTime=	0.0;
	var	isRunning=	false;
	var	game=	null;
	
	// Functions
	
	var	runLoop=	function()	{
		if(isRunning)	{
			requestAnimationFrame(function()	{
				runLoop.call(game);
			});
			
			currTime=	Date.now();
			elapTime=	currTime-prevTime;
			prevTime=	currTime;
			lagTime+=	elapTime;
			while((lagTime>= mpf) && isRunning)	{
				this.update();
				lagTime-=	mpf;
			}
			this.draw();
			Input.update();
		}
	};
	
	var	start=	function(_game)	{
		Input.init();
		game=	_game;
		prevTime=	Date.now();
		lagTime=	0.0;
		isRunning=	true;
		game.init();
		requestAnimationFrame(function()	{
			runLoop.call(game);
		});
	};
	
	var	deltaT=	function()	{	return (1.0/elapTime);	}

	var	stop=	function()	{	isRunning=	false;	}
	
	return {
		start:	start,
		stop:	stop,
		deltaT:	deltaT
	};
})();