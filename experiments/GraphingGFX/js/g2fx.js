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
		
	}
};

// End of File
