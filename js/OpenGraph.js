
// Called when the page is ready and loaded
$(document).ready(function()
{
	if(location.hash!= "")
		updateEntry($(".entry")[0], location.hash.substring(1));
	$("#shfuncs").click(fadeEntries);
	$(window).resize(detectMobile);
	detectMobile();
});

// Writes into the given entry with the given string
function updateEntry(entry, str)
{
	// Variables
	var	fractions=	str.split("/");
	
	if(fractions.length> 0)
		str=	"\\frac{"+fractions[0]+"}{"+fractions[1]+"}";
	str=	str.replace("(", "\\left(");
	str=	str.replace(")", "\\right)");
	$(entry).find(".mathquill-editable").mathquill("write", str);
	renderGraph(entry);
}

function dbg(str)
{
	$("#dbg").html(str);
}

// Fades away the entries from visibility
function fadeEntries()
{
	$(".entry").each(function(index, elem)
	{
		if(elem.style.visibility== "")
			elem.style.visibility=	"visible";
		
		if(elem.style.visibility== "visible")
		{
			$(elem).fadeOut(800, function(){elem.style.visibility= "hidden";});
		}
		else
		{
			$(elem).fadeIn(800, function(){elem.style.visibility= "visible";});
		}
	});
}

function detectMobile()
{
	if($(window).width()<= 512)
		dbg("DERP");
}

// End of File