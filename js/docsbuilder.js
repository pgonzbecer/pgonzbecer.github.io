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
	var str;
	var	colordif;
	
	idoc.html("");
	idoc.append("<span class='index-title'>"+json.title+"</span>");
	idoc.append("<p class='index-desc well'>"+json.desc+"</p>");
	
	for(var h= 0; h< json.tables.length; h++)
	{
		colordif=	true;
		str=	"<div>";
		str+=	"<span class='title'>"+json.tables[h].title+"</span>";
		str+=	"<div class='row'>";
		
		switch(json.tables[h].type.toLowerCase())
		{
			case "namespace":
				str+=	"<div class='col-xs-1 col-header'></div>";
				str+=	"<div class='col-xs-5 col-header' style='text-align: right;'>Namespaces</div>";
				str+=	"<div class='col-xs-6 col-header'>Description</div>";
				str+=	"</div>"; // Closes row
				for(var k= 0; k< json.tables[h].content.length; k++)
				{
					str+=	"<div class='row color-"+((colordif) ? "light" : "dark")+"'>";
					colordif=	!colordif;
					str+=	"<div class='col-xs-1'></div>";
					str+=	"<div class='col-xs-5 namespace-link'><a href='?docname="+format(json.tables[h].content[k].href)+"'>"+
						json.tables[h].content[k].text+"</a></div>";
					str+=	"<div class='col-xs-6'>"+json.tables[h].content[k].desc+"</div>";
					str+=	"</div>";
				}
				break;
			case "classes":
				str+=	"<div class='col-xs-1 col-header'></div>";
				str+=	"<div class='col-xs-5 col-header'></div>";
				str+=	"<div class='col-xs-6 col-header'></div>";
				str+=	"</div>"; // Closes row
				for(var k= 0; k< json.tables[h].content.length; k++)
				{
					str+=	"<div class='row color-"+((colordif) ? "light" : "dark")+"'>";
					colordif=	!colordif;
					str+=	"<div class='col-xs-1'>";
					if(json.tables[h].content[k].remarks!= "")
						str+=	"<a href='"+json.tables[h].content[k].remarksAnchor+"<span class='glyphicon glyphicon-list-alt'></span></a>";
					str+=	"</div>";
					str+=	"<div class='col-xs-5 class-link'><a href='?docname="+format(json.tables[h].content[k].href)+"'>"+
						json.tables[h].content[k].text+"</a></div>";
					str+=	"<div class='col-xs-6'>"+json.tables[h].content[k].desc+"</div>";
				}
				break;
		}
	}
	idoc.append(str);
	idoc.show(360);
}

// Formates the given hyperlink reference
function format(href)
{
	return (href.replace(/\./g, "-"));
}

// Called when the ajax has done something
function onAjaxRequest()
{
	if(ajax.readyState== 4 && ajax.status== 200)
	{
		$("#home-page").hide();
		buildDocumentation(JSON.parse(ajax.responseText));
	}
}

// End of File