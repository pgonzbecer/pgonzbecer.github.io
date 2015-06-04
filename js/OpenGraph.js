
// Called when the page is ready and loaded
$(document).ready(function()
{
	if(location.hash!= "")
		updateEntry($(".entry")[0], location.hash.substring(1));
	$("#shfuncs").click(fadeEntries);
	detectMobile();
	$(window).resize(detectMobile);
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

// Changes the header of the page
function changeHeader(str)
{
	$("#header").html(str);
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
			elem.style.visibility=	"hidden";
			elem.style.opacity=	"0";
			$(elem).hide(800);
		}
		else
		{
			elem.style.visibility=	"visible";
			elem.style.opacity=	"1";
			$(elem).show(800);
		}
	});
}

// Detects if the page is being used on a smaller screen
function detectMobile()
{
	bMobile=	($(window).width()<= 512);
	
	if(!bMobile)
	{
		removeFromGraph($("#m-entry")[0]);
		$(".entry").each(function(index, elem)
		{
			elem.style.visibility=	"visible";
			elem.style.display=	"block";
			$(elem).show();
			renderGraph($(".entry")[index]);
		});
		$("#shfuncs").show();
		changeHeader("<em>OpenGraph <sub>&alpha; 0.1</sub></em>");
		$("#m-entry").find("textarea").val("");
		resizeBoard();
		
		return;
	}
	
	$(".entry").each(function(index, elem)
	{
		elem.style.visibility=	"hidden";
		elem.style.display=	"none";
		$(elem).hide();
		removeFromGraph($(".entry")[index]);
	});
	//renderGraph($("#m-entry")[0]); // Comes out null and crashes for some reason
	$("#shfuncs").hide();
	resizeBoardMobile();
	changeHeader("<em>OpenGraph Mobile <sub>&alpha; 0.1</sub></em>");
}

// End of File