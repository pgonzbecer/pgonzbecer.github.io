// Created by Paul Gonzalez Becerra

// Variables
var	ajax;

$(document).ready(function(args)
{
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
	console.log(reformat(args));
	try
	{
		ajax=	new XMLHttpRequest();
		ajax.onreadystatechanged=	onAjaxRequest;
		ajax.open("GET", reformat(args).toString(), true);
		ajax.send();
	}catch(e){console.log(e);}
	console.log("IN");
}

// Reformats the arguments to have a file location baring name
function reformat(args)
{
	return ("docs/"+args.docname+"/"+(args.loc.replace(/\-/g, "/"))+".json");
}

// Builds the documentation with the given json
function buildDocumentation(json)
{
	console.log(json);
	$(".title").html(title);
}

// Called when the ajax has done something
function onAjaxRequest()
{
	console.log(ajax.readyState);
	console.log(ajax.status);
	if(ajax.readyState== 4 && ajax.status== 200)
	{
		console.log(ajax.responseText);
		buildDocumentation(responseText);//JSON.parse(ajax.responseText));
	}
}

// End of File