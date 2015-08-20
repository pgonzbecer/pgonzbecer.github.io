// Created by Paul Gonzalez Becerra

// Variables
var	ajax;

$(document).ready(function(args)
{
	ajax=	new XMLHttpRequest();
	
	ajax.onreadystatechanged=	onAjaxRequest;
	
	if(location.search)
	{
		// Variables
		var	text=	location.search.substring(1).split("&");
		var	docname, fileLoc;
		var	splits;
		
		for(var i= 0; i< text.length; i++)
		{
			splits=	text[i].split("=");
			
			switch(splits[0].toLowerCase())
			{
				case "docname":	docname=	splits[1];	break;
				case "sl":	fileLoc=	splits[1];	break;
			}
		}
		
		startBuildDocumentation({docname: docname, loc: fileLoc});
	}
});

// Starts building the documentation
function startBuildDocumentation(args)
{
	ajax.open("GET", reformat(args), true);
	ajax.send();
}

// Reformats the arguments to have a file location baring name
function reformat(args)
{
	return ("docs/"+args.docname+"/"+(fileLoc.replace(/\-/g, "/"))+".json");
}

// Builds the documentation with the given json
function buildDocumentation(json)
{
	$(".title").html(json.title);
}

// Called when the ajax has done something
function onAjaxRequest()
{
	if(ajax.readyState== 4 && ajax.status== 200)
		buildDocumentation(JSON.parse(ajax.responseText));
}

// End of File