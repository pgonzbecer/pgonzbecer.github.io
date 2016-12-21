// Variables
var	txtname;
var pkname;
var	curr;

function getURL(id)	{
	return "http://www.serebii.net/pokedex-sm/"+format(id)+".shtml";
}

function format(id)	{
	id*=	1;
	if(id< 10)	return "00"+id;
	if(id< 100)	return "0"+id;
	
	return ""+id;
}

function jsonparse()	{
	console.log("ASDA");
}

function grabInfo(id)	{
	// Variables
	var	url=	getURL(id);
        var     page=   new XMLHttpRequest();
        /*
	var	page=	$.ajax({
            type:   "GET",
            url:	url,
            contentType:    "application/json",
            headers:    {
                    "Access-Control-Allow-Origin": "AS"
            },
            error:  function(err)   {
                console.log("ERR");
            }
	});*/
        page.open("GET", url, true);
        page.withCredentials=   true;
        page.setRequestHeader("Content-Type", "application/json");
        page.onreadystatechange=    function(args)  {
            console.log(args);
        };
        console.log(page.send());
	
	curr=	id;
}

window.addEventListener("load", function()	{
	pkname=	$("#pkname");
	txtname=	$("#txtname");
	
	txtname.on("keypress", function(args)	{
		if(args.keyCode< 48 || args.keyCode> 57)	{
			args.preventDefault();
			return;
		}
	});
	txtname.on("keyup", function(args)	{
		if(args.keyCode< 48 || args.keyCode> 57)
			return;
		
		window.grabInfo(1*txtname.val());
	});
});