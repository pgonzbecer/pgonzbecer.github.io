// Created by Paul Gonzalez Becerra

/*
	appendHead: [HeadAppendObject],
	replace: [ReplacementObject]
	
	HeadAppendObject	{
		tagName = string,
		#if(tagName is link)
			rel = string,
			type = string,
			href = string
		#elseif(tagName is script)
			src = string
			type = string
			content = function
		#elseif(tagName is title)
			text = string
		#endif
	}
	
	ReplacementObject	{
		target = string,
		innerHTML = string,
		node = string
	}
*/

// Variables
var WebBuilder=	(new function()
{
	// Variables
	var	localSite=	"";
	var	remoteSite=	"";
	
	// Sets the origins of the local hard drive location of the site and/or the remote online location of the site, required to be set before building
	this.setOrigin=	function(args)
	{
		if(args.local)	localSite=	getContent(args.local);
		if(args.remote)	remoteSite=	getContent(args.remote);
	};
	
	// Builds the website with the given arguments
	this.build=	function(args)
	{
		if(args.appendHead)
		{
			// Variables
			var	node;
			
			for(var i= 0; i< args.appendHead.length; i++)
			{
				switch(args.appendHead[i].tagName)
				{
					case "link":
						node=	document.createElement("link");
						if(args.appendHead[i].rel)	node.setAttribute("rel", getContent(args.appendHead[i].rel));
						if(args.appendHead[i].type)	node.setAttribute("type", getContent(args.appendHead[i].type));
						if(args.appendHead[i].href)	node.setAttribute("href", this.fromOriginPath(getContent(args.appendHead[i].href)));
						break;
					case "script":
						node=	document.createElement("script");
						if(args.appendHead[i].src)	node.setAttribute("src", this.fromOriginPath(getContent(args.appendHead[i].src)));
						if(args.appendHead[i].type)	node.setAttribute("type", getContent(args.appendHead[i].type));
						if(args.appendHead[i].content)	node.innerHTML=	args.appendHead[i].content;
						break;
					case "title":
						if($("title")[0]!= null && args.appendHead[i].text)	$("title").remove();
						if(args.appendHead[i].text)
						{
							node=	document.createElement("title");
							node.innerHTML=	args.appendHead[i].text;
						}
						break;
				}
				if(node)
					document.head.appendChild(node);
				node=	null;
			}
		}
		
		if(args.replace)
		{
			// Variables
			var	target;
			
			for(var i= 0; i< args.replace.length; i++)
			{
				target=	$(args.replace[i].target);
				if(!target[0])
					continue;
				if(args.replace[i].node)
				{
					target.after(getContent(args.replace[i].node));
					target.remove();
				}
				if(args.replace[i].innerHTML)	target.html(getContent(args.replace[i].innerHTML));
			}
		}
	};
	
	// Gets if the given argument is a function or something else, if it is a function, call the function.
	function getContent(argument)
	{
		if(argument== null)
			return argument;
		
		return (($.isFunction(argument) ? argument(WebBuilder) : argument));
	}
	
	// Returns the path you gave, given that it is a local path, relative to the origin of the site, for both local or online
	this.fromOriginPath=	function(path)
	{
		if(location.protocol== "file:")
		{
			if(localSite== "")
				return path;
		}
		else
		{
			if(remoteSite== "")
				return path;
		}
		
		// Variables
		var	subs=	0;
		var	origin=	(
			(location.protocol== "file:") ?
				location.pathname.replace(localSite, "") :
				location.pathname.replace(remoteSite, "")
		);
		
		for(var i= 0; i< origin.length; i++)
		{
			if(origin[i]=== "/")
				subs++;
		}
		origin=	""
		for(var i= 0; i< subs; i++)
			origin+=	"../";
		
		return origin+path;
	}
});

// End of File
