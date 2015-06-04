

// Variables
var	board;
var	resizeTimer;
var	bMobile;

// Called when the page is ready and loaded
$(document).ready(function()
{
	board= JXG.JSXGraph.initBoard('myBox',
	{
		boundingbox: [-10, 12, 10, -10],
		axis: { ticks: { drawLabels: true }, firstArrow: true, strokeColor:'black' },
		grid: { strokeWidth: 0.75 },
		showCopyright: false,
		showNavigation: false,
		keepaspectratio: true, //square graph coming in
		zoom:
		{
			wheel: true,
			needshift: false
		},
		pan:
		{
			enabled: true,   // Allow panning
			needTwoFingers: true, // panningis done with two fingers on touch devices
			needshift: false, // mouse panning needs pressing of the shift key
		}
	});
	resizeBoard();

	// Called when the resetHomeZoom button has been clicked
	$("#resetHomeZoom").click(function()
	{
		board.zoom100();
		board.setBoundingBox([-10, 12, 10, -10], true); // Sets it to -10 35 10 -10 for some reason
	});

	// Called when the zoom type / toggle zoom type button has been clicked
	$("#toggleZoomType").click(function()
	{
		// Variables
		var	zt=	$("#zoomType").text().trim().toLowerCase();
		
		switch(zt)
		{
			case "xy":
				$("#zoomType").html("&nbsp;x");
				board.attr.zoom.factorx=	1.25;
				board.attr.zoom.factory=	1.0;
				break;
			case "x":
				$("#zoomType").html("&nbsp;y");
				board.attr.zoom.factorx=	1.25;
				board.attr.zoom.factory=	1.0;
				break;
			case "y":
				$("#zoomType").html("xy");
				board.attr.zoom.factorx=	1.25;
				board.attr.zoom.factory=	1.25;
				break;
		}
	});
});


// Resizes the graphing board
function resizeBoard()
{
	var bb= board.getBoundingBox();
	
	board.resizeContainer($(window).width(), $(window).height());
	board.setBoundingBox(bb);
	$("#m-entry").css("display", "none");
}

// Resizes the graphing board for mobile viewage
function resizeBoardMobile()
{
	var	bb=	board.getBoundingBox();
	var	mentry=	$("#m-entry");
	
	board.resizeContainer($(window).width(), $(window).height()*0.75);
	board.setBoundingBox(bb);
	mentry.css("display", "block"
	).css("top", $(window).height()*0.75
	).css("width", $(window).width()
	).css("height", $(window).height()*0.25);
	/*$("#m-entry").css(
	{
		display:	block,
		position:	absolute,
		top:	$(window).height()*0.75,
		width:	$(window).width(),
		height:	$(window).height()
	});*/
}

// Called when the window has been resized
$(window).resize(function()
{
	if(!bMobile)
	{
		clearTimeout(resizeTimer);
		resizeTimer=	setTimeout(function()
		{
			resizeBoard();
		}, 200);
	}
	else
	{
		resizeBoardMobile();
	}
});

// End of File