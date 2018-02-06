// Variables
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
	var	keys=	[];
	var	isInit=	false;
	
	// Functions
	
	var	initInput=	function()	{
		if(isInit)	return;
		isInit=	true;
		window.addEventListener("keydown", inpKeyDown);
		window.addEventListener("mousedown", inpKeyDown);
		window.addEventListener("keyup", inpKeyUp);
		window.addEventListener("mouseup", inpKeyUp);
	};
	
	var	inpKeyDown=	function(args)	{
		//console.log(args);
		keys[args.key || ("mb"+args.button)]=	true;
	};
	
	var	inpKeyUp=	function(args)	{
		//console.log(args);
		keys[args.key || ("mb"+args.button)]=	false;
	};
	
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
				if(this.update)
					this.update();
				lagTime-=	mpf;
			}
			if(this.draw)
				this.draw();
		}
	};
	
	var	start=	function(_game)	{
		initInput();
		game=	_game;
		prevTime=	Date.now();
		lagTime=	0.0;
		isRunning=	true;
		if(game.init)
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
		deltaT:	deltaT,
		keys:	keys
	};
})();