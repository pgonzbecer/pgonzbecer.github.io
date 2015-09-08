// Created by Paul Gonzalez Becerra

// Variables
var	g2fx=	{};

g2fx.create=  function(type, id, options)
{
	// Variables
	var	elem=	document.getElementById(id);
	
	switch(type.toLowerCase())
	{
		case "graph":	return new Graph(elem, options);
		default:	throw exception("Type [ "+type+" ] is unknown");
	}
	
	function Graph(tElem, options)
	{
		this.render=	function(obj)
		{
			console.log(obj);
		};
	}
};

function Point2(options)
{
	// Variables
	this.x=	((options.x) ? options.x : 0);
	this.y=	((options.y) ? options.y : 0);
}

function Segment(options)
{
	// Variables
	this.ptA=	new Point2();
	this.ptB=	new Point2();
	
	if(options.ptA)
	{
		ptA.x=	options.ptA.x;
		ptA.y=	options.ptA.y;
	}
	if(options.ax)
		ptA.x=	options.ax;
	if(options.ay)
		ptA.y=	option.ay;
	if(options.ptB)
	{
		ptB.x=	options.ptB.x;
		ptB.y=	options.ptB.y;
	}
	if(options.bx)
		ptB.x=	options.bx;
	if(options.by)
		ptB.y=	options.by;
}

// End of File
