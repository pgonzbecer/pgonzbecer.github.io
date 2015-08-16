

// Variables
var	board;
var	resizeTimer;
var	bMobile;
var	movement=	new function(){};

movement.x=	null;
movement.y=	null;
movement.down=	false;

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
			needshift: false // mouse panning needs pressing of the shift key
		}
	});
	resizeBoard();
	
	board.on("down", onMobileDown);
	board.on("up", function(){movement.down= false;});
	board.on("move", onMobileMovement);

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
	
	board.resizeContainer($(window).width(), $(window).height()*0.75);
	board.setBoundingBox(bb);
	$("#m-entry").css("display", "block"
	).css("top", $(window).height()*0.75
	).css("width", $(window).width()
	).css("height", $(window).height()*0.25);
}

// Called when the window has been resized
$(window).resize(function()
{
	bMobile=	(navigator.appVersion.toLowerCase().indexOf("android"))!= -1; // Looks for only android
	
	if(!bMobile)
	{
		resizeBoard();/* Don't know why you need a timer
		clearTimeout(resizeTimer);
		resizeTimer=	setTimeout(function()
		{
			resizeBoard();
		}, 200);*/
	}
	else
	{
		resizeBoardMobile();
	}
});

// Gets the mouse coordinates
function getMouseCoords(e, i)
{
	// Variables
	var	cPos=	board.getCoordsTopLeftCorner(e, i);
	var	abPos=	JXG.getPosition(e, i);
	var	dx=	abPos[0]-cPos[0];
	var	dy=	abPos[0]-cPos[0];
	
	return [dx, dy];//new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
}

// Called whenever there is a touch detected
function onMobileDown(e)
{
	if(!bMobile)
		return;
	
	// Variables
	var	mPos=	getMouseCoords(e, 0);
	
	movement.x=	mPos[0];
	movement.y=	mPos[1];
	movement.down=	true;
}

// Called whenever there is a touched movement detected
function onMobileMovement(e)
{
	if(!bMobile)
		return;
	if(!movement.down)
		return;
	
	// Variables
	var	mPos=	getMouseCoords(e, 0);
	
	board.moveOrigin(mPos[0]-movement.x, mPos[1]-movement.y);
	$("#header").text(movement.x-mPos[0]);
}

// End of File