// Created by Paul Gonzalez Becerra

window.addEventListener("load", function()	{
	// Variables
	var	ctabs=	document.getElementById("content-tabs").getElementsByClassName("tab");
	
	for(var i= 0; i< ctabs.length; i++)
	{
		ctabs[i].onclick=	onClickTab;
	}
	
	function onClickTab(){
		// Variables
		var	ct=	document.getElementsByClassName("tabcontent");
		var	index=	-1;
		var	dsclasses=	document.getElementById("content-tabs").getElementsByClassName("tab");
		
		for(var i= 0; i< dsclasses.length; i++)
			dsclasses[i].setAttribute("class", "tab");
		
		this.setAttribute("class", "tab selected-tab");
		
		for(var i= 0; i< ct.length; i++)
		{
			if(ct[i].getAttribute("name")== this.getAttribute("name"))
				index=	i;
			ct[i].setAttribute("class", "tabcontent");
		}
		ct[index].setAttribute("class", "tabcontent visible");
	}
});

// End of File