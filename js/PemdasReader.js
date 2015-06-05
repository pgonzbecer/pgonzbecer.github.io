

// Class for a pemdas reader
function PemdasReader()
{
	// --- Private Prototypes ---
	
	// Starts the reading process
	var	startReadingProcess=	function(str)
	{
		this.readParenthesis(str);
	};
	
	// Corrects the given parsing job for the parenthesis'
	var	getCorrectedVersionP=	function(p, c, index)
	{
		if(c== ')' && p.c!= '(')
			throw "You did not close with a parenthesis";
		if(c== ']' && p.c!= '[')
			throw "You did not close with a bracket";
		if(c== '}' && p.c!= '{')
			throw "You did not close with a curly bracket";
		
		p.bClosed=	true;
		p.cindex=	index;
		
		return p;
	};
	
	// --- Public Prototypes ---
	
	// Reads the given string and chops it into pieces by parenthesis'
	this.readParenthesis=	function(str)
	{
		// Variables
		var	p=	new Array();
		var	result=	new Array();
		
		for(var i= 0; i< str.length; i++)
		{
			switch(str.charAt(i))
			{
				case '(':
				case '[':
				case '{':
					p.push({c: str.charAt(i), index: i, bClosed: false, cindex: -1});
					break;
				case ')':
				case ']':
				case '}':
					p.push(getCorrectedVersionP(p.pop(), str.charAt(i), i));
					break;
			}
		}
		for(var i= 0; i< p.length; i++)
		{
			result.push(str.substring(p[i].index+1, p[i].cindex));
		}
		
		return result;
	};
	
	// Reads all the exponents and gives them a number if possible
	/*this.readExponents=	function(str)
	{
		if(str.indexOf("^")== -1)
			return str;
		
		// Variables
		var splits=	str.split("+-/");
		var	splots=	new Array();
		var	e=	new Array();
		
		for(var i= 0; i< splits.length; i++)
		{
			if(splits[i].indexOf("^")!= -1)
			{
				splots=	splits[i].split("^", 2);
				
				if(!isNaN(splots[0]) && !isNaN(splots[1]))
					e.push(Math.pow(splots[0], splots[1]));
				else
					e.push(splots[0]+"^"+splots[1]);
			}
		}
		
		return e'
	};*/
}

// End of File