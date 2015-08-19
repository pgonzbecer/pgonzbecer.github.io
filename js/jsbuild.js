// Created by Paul Gonzalez Becerra

/*
	appendHead: [HeadAppendObject]
	
	HeadAppendObject	{
		tagName = string,
		#if(tagName is link)
			rel = string,
			type = string,
			href = string
		#endif
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
					node.setAttribute("rel", args.appendHead[i].rel);
					node.setAttribute("type", args.appendHead[i].type);
					node.setAttribute("href", args.appendHead[i].href);
					break;
			}
		}
		document.head.appendChild(node);
	}
	
	
  console.log(args);
  if(!args.target || $(args.target)== null)
    throw exception("No target located")
  
  // Variables
  var target= $(getContent(args.target));
  
  if(args.innerHTML)
  {
    // Variables
    var ih= getContent(args.innerHTML);
    
    target.html(ih);
  }
  
  function getContent(argument)
  {
    if(argument== null)
      throw exception("Argument is null");
    
    return (($.isFunction(argument) ? argument(arguments) : argument))
  }
};

// End of File
