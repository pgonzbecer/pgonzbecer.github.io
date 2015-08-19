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
		#endif
	}
	
	ReplacementObject	{
		target = string,
		innerHTML = string,
		node = string
	}
*/

build=	function(args)
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
					if(args.appendHead[i].href)	node.setAttribute("href", getContent(args.appendHead[i].href));
					break;
				case "script":
					node=	document.createElement("script");
					if(args.appendHead[i].src)	node.setAttribute("src", getContent(args.appendHead[i].src));
					if(args.appendHead[i].type)	node.setAttribute("type", getContent(args.appendHead[i].type));
					if(args.appendHead[i].content)	node.innerHTML=	args.appendHead[i].content;
			}
			document.head.appendChild(node);
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
				target.after(args.replace[i].node);
				target.remove();
			}
			if(args.replace[i].innerHTML)	target.html(getContent(args.replace[i].innerHTML, target.html()));
		}
	}
	
	function getContent(argument)
	{
		if(argument== null)
			return argument;
		
		return (($.isFunction(argument) ? argument(arguments) : argument));
	}
};

// End of File
