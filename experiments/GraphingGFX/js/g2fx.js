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
	if(options== null)
		options=	{};
	
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
		this.ptA.x=	options.ptA.x;
		this.ptA.y=	options.ptA.y;
	}
	if(options.ax)
		this.ptA.x=	options.ax;
	if(options.ay)
		this.ptA.y=	option.ay;
	if(options.ptB)
	{
		this.ptB.x=	options.ptB.x;
		this.ptB.y=	options.ptB.y;
	}
	if(options.bx)
		this.ptB.x=	options.bx;
	if(options.by)
		this.ptB.y=	options.by;
}

// End of File
