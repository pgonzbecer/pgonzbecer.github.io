// Created by Paul Gonzalez Becerra

// Variables
var	currPhaseMain;
var	listboxSelections=	new Array();
var	content;
var	vtext;
var	villianTalk1=	[
	"[ Villian's Intro Speech ]",
	"Huh? Wh-who are you?",
	"[ Villian's Origins Speech ]",
	"[ 'Player''s Reaction ]",
	"[ Villian's Motive ]",
	"[ Villian's Outro Speech ]"
]; // Come up with a concept for the villian

// Called when the page is ready and loaded
$(document).ready(function()
{
	currPhaseMain=	{name: "base", target: $(".main-nav").find(".currSel")[0]};
	content=	$("#content");
	$(".main-nav").on("click", "li", onMainNavClick);
	gotoBase();
	$(".listbox").each(function(index, elem){initListBoxes(index, elem);});
	villianTalk(villianTalk1);
});

// Gives the main villian a chance to talk to you
function villianTalk(text)
{
	if(text.length== 0)
		return;
	vtext=	{ctext: 0, index: 0, text: "", interval: null};
	$("#content").append("<div id='textholder'></div><span class='btn btn-default' id='nextText'>Continue</span>");
	$("body").addClass("locked-down");
	$("#nextText").click(function()
	{
		clearInterval(vtext.interval);
		vtext.index=	0;
		if(vtext.text.length< text[vtext.ctext].length)
		{
			vtext.text=	text[vtext.ctext];
			$("#textholder").text(vtext.text);
			
			return;
		}
		if(vtext.ctext+1< text.length)
		{
			if(vtext.ctext+2=== text.length)
				$("#nextText").text("Leave");
			vtext.text=	"";
			vtext.ctext++;
			vtext.interval=	setInterval(textInterval, 48, text);
		}
		else
		{
			gotoPhase();
			$("body").removeClass("locked-down");
		}
	});
	vtext.interval=	setInterval(textInterval, 48, text);
}

// Gets an interval function for the writing text
function textInterval(text)
{
	if(vtext.index>= text[vtext.ctext].length)
	{
		clearInterval(vtext.interval);
		vtext.index=	0;
	}
	else
	{
		vtext.text+=	text[vtext.ctext].substring(vtext.index++, vtext.index);
		$("#textholder").text(vtext.text);
	}
}

// Initates the list boxes
function initListBoxes(index, elem)
{
	elem.value=	index;
	listboxSelections.push({listbox: elem, currSelection: null});
	$(elem).on("click", "li", function(e)
	{
		for(var i= 0; i< listboxSelections.length; i++)
		{
			if(listboxSelections[i].listbox.value== ($(e.target).parents(".listbox")[0]).value)
			{
				if(listboxSelections[i].currSelection!= null)
					listboxSelections[i].currSelection.removeClass("currSel");
				listboxSelections[i].currSelection=	$(e.target);
				listboxSelections[i].currSelection.addClass("currSel");
			}
		}
	});
}

// Locks down the main navigation bar
function lockMainNav()
{
	$(".main-nav").find("li").each(function(index, elem)
	{
		if(elem!= currPhaseMain.target)
			$(elem).addClass("locked-down");
	});
}

// Unlocks the main navigation bar
function unlockMainNav()
{
	$(".main-nav").find("li").each(function(index, elem)
	{
		if(elem!= currPhaseMain.target)
			$(elem).removeClass("locked-down");
	});
}

// Controls the main navigation of the jcst page
function onMainNavClick(e)
{
	// Variables
	var	clickedOn=	$(e.target).text().toLowerCase();
	
	if(currPhaseMain.name== clickedOn)
		return;
	if($(e.target).hasClass("locked-down"))
		return;
	
	$(currPhaseMain.target).removeClass("currSel");
	currPhaseMain=	{name: clickedOn, target: e.target};
	$(currPhaseMain.target).addClass("currSel");
	
	gotoPhase();
}

// Gets all the users characters
function getCharacters()
{
	return ("<li>Sain [ Lv. 1 ]</li>"+
		"<li>Cyruss [ Lv. 1 ]</li>"+
		"<li>Parker [ Lv. 1 ]</li>"+
		"<li>Leandra [ Lv. 1 ]</li>"
	);
}

// Goes to the current phase
function gotoPhase()
{
	switch(currPhaseMain.name)
	{
		case "base":	gotoBase();	break;
		case "shop":	gotoShop();	break;
		case "pub":	gotoPub();	break;
		case "battle":	gotoBattle();	break;
	}
}

// Makes the page go to the base stuffs
function gotoBase()
{
	content.html
	(
		"<h3>Character Select:</h3>"+
		"<ul class='listbox listbox-character-select'>"+
			getCharacters()+
		"</ul>"
	);
	$(".listbox").each(function(index, elem){initListBoxes(index, elem);});
}

// Makes the page go to the shop
function gotoShop()
{
	content.html("");
}

// Makes the page go to the pub
function gotoPub()
{
	content.html("");
}

//  Makes the page go to battle
function gotoBattle()
{
	content.html("");
}

// End of File