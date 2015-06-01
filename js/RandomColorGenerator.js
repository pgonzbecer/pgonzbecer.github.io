// Created by Paul Gonzalez Becerra

function RandomColorGenerator()
{
	// Private Variables
	var	colorCodes=
	[
		"AliceBlue",
		"AntiqueWhite",
		"Aqua",
		"Aquamarine",
		"Azure",
		"Beige",
		"Bisque",
		"Black",
		"BlacnhedAlmond",
		"Blue",
		"BlueViolet",
		"Brown",
		"BurlyWood",
		"CadetBlue",
		"Chartreuse",
		"Chocolate",
		"Coral",
		"CornflowerBlue",
		"Cornsilk",
		"Crimson",
		"Cyan",
		"DarkBlue",
		"DarkCyan",
		"DarkGoldenRod",
		"DarkGray",
		"DarkGreen",
		"DarkKhaki",
		"DarkMagenta",
		"DarkOliveGreen",
		"DarkOrange",
		"DarkOrchid",
		"DarkRed",
		"DarkSalmon",
		"DarkSeaGreen",
		"DarkSlateBlue",
		"DarkSlateGray",
		"DarkTurquoise",
		"DarkViolet",
		"DeepPink",
		"DeepSkyBlue",
		"DimGray",
		"DodgerBlue",
		"FireBrick",
		"FloralWhite",
		"ForestGreen",
		"Fuchsia",
		"Gainsboro",
		"GhostWhite",
		"Gold",
		"GoldenRod",
		"Gray",
		"Green",
		"GreenYellow",
		"HoneyDew",
		"HotPink",
		"IndianRed",
		"Indigo",
		"Ivory",
		"Khaki",
		"Lavender",
		"LavenderBlush",
		"LawnGreen",
		"LemonChiffon",
		"LightBlue",
		"LightCoral",
		"LightCyan",
		"LightGoldenRodYellow",
		"LightGray",
		"LightGreen",
		"LightPink",
		"LightSalmon",
		"LightSeaGreen",
		"LightSkyBlue",
		"LightSlateBlue",
		"LightSlateGray",
		"LightYellow",
		"Lime",
		"LimeGreen",
		"Linen",
		"Magenta",
		"Maroon",
		"MediumAquaMarine",
		"MediumBlue",
		"MediumOrchid",
		"MediumPurple",
		"MediumSeaGreen",
		"MediumSlateBlue",
		"MediumSpringGreen",
		"MediumTurquoise",
		"MediumVioletRed",
		"MidnightBlue",
		"MintCream",
		"MistyRose",
		"Moccasin",
		"NavajoWhite",
		"Navy",
		"OldLace",
		"Olive",
		"OliveDrab",
		"Orange",
		"OrangeRed",
		"Orchid",
		"PaleGoldenRod",
		"PaleGreen",
		"PaleTurquoise",
		"PaleVioletRed",
		"PapayaWhip",
		"PeachPuff",
		"Peru",
		"Pink",
		"Plum",
		"PowderBlue",
		"Purple",
		"RebeccaPurple";
		"Red",
		"RosyBrown",
		"RoyalBlue",
		"SaddleBrown",
		"Salmon",
		"SandyBrown",
		"SeaGreen",
		"SeaShell",
		"Sienna",
		"Silver",
		"SkyBlue",
		"SlateBlue",
		"SlateGray",
		"Snow",
		"SpringGreen",
		"SteelBlue",
		"Tan",
		"Teal",
		"Thistle",
		"Tomato",
		"Turquoise",
		"Violet",
		"Wheat",
		"White",
		"WhiteSmoke",
		"Yellow",
		"YellowGreen"
	];
	
	// --- Private Prototypes ---
	// Gets a random number represented in a single hex character
	var	getRNGHex=	function()
	{
		// Variables
		var	num=	Math.floor(Math.random()*15);
		
		if(num>= 10)
			return getHexedVersion(num);
		else
			return num;
	}
	
	// Transforms the given number into a hex digit
	var	getHexedVersion=	function(num)
	{
		switch(num)
		{
			case 10:	return "a";
			case 11:	return "b";
			case 12:	return "c";
			case 13:	return "d";
			case 14:	return "e";
			case 15:	return "f";
			default:	if(num> 15)	return "d";
		}
		
		return num;
	}
	
	// Transforms the given number into a pair of hex digits
	var	getHexedVersion2=	function(num)
	{
		if(num< 16)
			return "0"+getHexedVersion(num*1);
		
		// Variables
		var	topNum=	0;
		var	botNum=	0;
		
		botNum=	num%16;
		topNum=	num-botNum;
		if(topNum!= 0)
			topNum/=	16;
		
		return getHexedVersion(topNum*1)+""+getHexedVersion(botNum*1);
	}
	
	// Transforms the given hex digit into a number, defaults to 13
	var getNumberVersion=	function(hexdigit)
	{
		switch(hexdigit.toLowerCase())
		{
			case "a":	return new Number(10);
			case "b":	return new Number(11);
			case "c":	return new Number(12);
			case "d":	return new Number(13);
			case "e":	return new Number(14);
			case "f":	return new Number(15);
			default:	if(isNaN(hexdigit))	return new Number(13);
		}
		
		return new Number(hexdigit);
	}
	
	// Gets a number from the given hex, requires 1 digit
	var	getNumberFromHex=	function(hex)
	{
		if(hex.length!= 1)
			throw "Hex code must be 1 digit long";
		
		return getNumberVersion(hex.charAt(0));
	}
	
	// Gets a number from the given hex, requires 2 digits
	var	getNumberFromHex2=	function(hex)
	{
		if(hex.length!= 2)
			throw "Hex code must be 2 digits long";
		
		// Variables
		var	topNum, botNum;
		
		topNum=	getNumberVersion(hex.charAt(0));
		botNum=	getNumberVersion(hex.charAt(1));
		
		topNum*=	16;
		topNum+=	botNum;
		
		return topNum;
	}
	
	// --- Public Prototypes ---
	// Gets a random hex code representing a color
	this.nextColor=	function()
	{
		// Variables
		var	hexcode=	"#";
		
		for(var i= 0; i< 6; i++)
			hexcode+=	getRNGHex();
		
		return hexcode;
	}
	
	// Grabs a random stored web safe color based on its name
	this.nextNamedColor=	function()
	{
		return colorCodes[Math.floor(Math.random()*colorCodes.length)];
	}
	
	// Gets a random hex code representing a color excluding the given hex color
	this.nextColorExcluding=	function(hexcolor)
	{
		// Variables
		var	hexcode=	this.nextColor();
		
		while(this.isSimilarColor(hexcode, hexcolor))
		{
			hexcode=	this.nextColor();
		}
		
		return hexcode;
	}
	
	// Finds if the two colors are anywhere close to each other
	this.isSimilarColor=	function(colorA, colorB)
	{
		if(colorA.charAt(0)!= '#' || colorB.charAt(0)!= '#')
			throw "One of these are not hex color codes";
		
		// Variables
		var redA=	colorA.charAt(1)+""+colorA.charAt(2);
		var greenA=	colorA.charAt(3)+""+colorA.charAt(4);
		var blueA=	colorA.charAt(5)+""+colorA.charAt(6);
		var redB=	colorB.charAt(1)+""+colorB.charAt(2);
		var greenB=	colorB.charAt(3)+""+colorB.charAt(4);
		var blueB=	colorB.charAt(5)+""+colorB.charAt(6);
		var closeness=	0;
		
		redA=	getNumberFromHex2(redA);
		redB=	getNumberFromHex2(redB);
		greenA=	getNumberFromHex2(greenA);
		greenB=	getNumberFromHex2(greenB);
		blueA=	getNumberFromHex2(blueA);
		blueB=	getNumberFromHex2(blueB);
		
		if(redB>= redA-16 && redB<= redA+16)
			closeness++;
		if(greenB>= greenA-16 && greenB<= greenA+16)
			closeness++;
		if(blueB>= blueA-16 && blueB<= blueA+16)
			closeness++;
		
		return (closeness== 3);
	}
	
	// Converts the given rgb representation into a hexadecimal code of the color
	this.getHexFromRgb=	function(rgb)
	{
		if((rgb.charAt(0)+rgb.charAt(1)+rgb.charAt(2)).toLowerCase()!= "rgb")
			throw "Given parameter is not an rgb representation";
		
		// Variables
		var	hexcode=	"#";
		var	splits=	rgb.substring(4, rgb.indexOf(")"));
		
		splits=	splits.split(',', 3);
		
		for(var i= 0; i< splits.length; i++)
		{
			hexcode+=	getHexedVersion2(splits[i]*1);
		}
		
		return hexcode;
	}
}

// End of File