// Created by Paul Gonzalez Becerra

// Variables
var	ajax;

$(document).ready(function(args)
{
	ajax=	new XMLHttpRequest();
	ajax.onreadystatechange=	onAjaxRequest;
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
			}
		}
		
		startBuildDocumentation({docname: docname});
	}
});

// Starts building the documentation
function startBuildDocumentation(args)
{
	try
	{
		ajax.open("GET", unformat(args), true);
		ajax.send();
	}catch(e){console.log(e);}
}

// Reformats the arguments to have a file location baring name
function unformat(args)
{
	return ("docs/"+(args.docname.replace(/\-/g, "/"))+".json");
}

// Builds the documentation with the given json
function buildDocumentation(json)
{
	// Variables
	var	idoc=	$(".doc-interface");
	var	table;
	var	temp, temp2;
	
	console.log(json);
	idoc.html("");
	idoc.append("<span class='index-title'>"+json.title+"</span>");
	idoc.append("<span class='index-desc well'>"+json.desc+"</span>");
	
	for(var h= 0; h< json.tables.length; h++)
	{
		table=	document.createElement("div");
		temp=	document.createElement("span"); // Creates the title
		temp.setAttribute("class", "title");
		temp.innerHTML=	json.tables[h].title;
		table.appendChild(temp);
		temp=	document.createElement("div"); // Creates the row
		temp.setAttribute("class", "row");
		
		switch(json.tables[h].type.toLowerCase())
		{
			case "namespace":
				temp2=	document.createElement("div"); // Creates the column headers
				temp2.setAttribute("class", "col-md-1");
				temp.appendChild(temp2);
				temp2=	document.createElement("div");
				temp2.setAttribute("class", "col-md-11");
				temp2.innerHTML=	"Namespaces";
				temp.appendChild(temp2);
				for(var k= 0; k< json.tables[h].content.length; k++)
				{
					
				}
				break;
		}
		
		table.appendChild(temp);
	}
	idoc.append(table);
}

// Called when the ajax has done something
function onAjaxRequest()
{
	if(ajax.readyState== 4 && ajax.status== 200)
	{
		buildDocumentation(JSON.parse(ajax.responseText));
	}
}

// End of File