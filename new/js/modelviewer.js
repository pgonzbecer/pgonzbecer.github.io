// Created by Paul Gonzalez Becerra

// Variables
var	modelViewer=	{
	bCanvasCreated:	false,
	bMeshCreated:	false,
	graphics:	null,
	scene:	null,
	camera:	null,
	mesh:	null,
	renderCallback:	null,
	load:	function(strload)	{
		//alert(strload);
		if(!this.bCanvasCreated)	{
			this.graphics=	new THREE.WebGLRenderer();
			this.scene=	new THREE.Scene();
			this.camera=	new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.01, 1000);
			this.bCanvasCreated=	true;
		}
	},
	render:	function()	{
		if(!this.bCanvasCreated)
			return;
		requestAnimationFrame(this.render);
		if(this.renderCallback!= null)
			this.renderCallback();
		this.graphics.render(this.scene, this.camera);
	},
	rotateScene:	function(dir)	{
		if(!this.bCanvasCreated)
			return;
		if(!this.bMeshCreated)
			return;
		
		switch(dir)	{
			case "up":	this.mesh.rotation.y-=	0.1;	break;
			case "right":	this.mesh.rotation.x+=	0.1;	break;
			case "down":	this.mesh.rotation.y+=	0.1;	break;
			case "left":	this.mesh.rotation.x-=	0.1;	break;
		}
	},
	rotateCamera:	function(dir)	{
		if(!this.bCanvasCreated)
			return;
		
		switch(dir)	{
			case "up":	this.camera.rotation.y-=	0.1;	break;
			case "right":	this.camera.rotation.x+=	0.1;	break;
			case "down":	this.camera.rotation.y+=	0.1;	break;
			case "left":	this.camera.rotation.x-=	0.1;	break;
		}
	},
	moveCamera:	function(dir)	{
		if(!this.bCanvasCreated)
			return;
		
		switch(dir)	{
			case "forward":	this.camera.position.z+=	0.1;	break;
			case "backward":	this.camera.position.z-=	0.1;	break;
			case "up":	this.camera.position.y-=	0.1;	break;
			case "right":	this.camera.position.x+=	0.1;	break;
			case "down":	this.camera.position.y+=	0.1;	break;
			case "left":	this.camera.position.x-=	0.1;	break;
		}
	}
};

// End of File