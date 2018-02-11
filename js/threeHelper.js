// Variables
let	TTK=	(function()	{
	// Variables
	// Field Members
	let	scene=	null;
	let	camera=	null;
	let	renderer=	null;
	// Functions
	let	init=	function()	{
		scene=	new THREE.Scene();
		camera=	new THREE.PerspectiveCamera(
			90,
			innerWidth/innerHeight,
			0.1,
			100000
		);
		renderer=	new THREE.WebGLRenderer();
	};
	let	startAnimation=	function(updater)	{
		function __anim()	{
			requestAnimationFrame(__anim);
			renderer.render(scene, camera);
			if(updater)	{
				if(updater.draw)
					updater.draw();
				if(updater.update)
					updater.update();
			}
		}
		__anim();
	};
	let	createMesh=	function(vertices, indices, materialProperties)	{
		// Variables
		let	geometry=	new THREE.Geometry();
		let	material=	new THREE.MeshDepthMaterial(materialProperties);
		
		geometry.vertices=	vertices;
		
		for(let i= 0; i< indices.length; i++)	{
			geometry.faces.push(new THREE.Face3(
				indices[i++],
				indices[i++],
				indices[i]
			));
		}
		
		return new THREE.Mesh(geometry, material);
	};
	
	let	createMeshOutline=	function(mesh, materialProperties)	{
		return new THREE.LineSegments(
			new THREE.EdgesGeometry(mesh.geometry),
			new THREE.LineBasicMaterial(materialProperties)
		);
	};
	
	return	{
		get scene()	{	return scene;	},
		get camera()	{	return camera;	},
		get renderer()	{	return renderer;	},
		init:	init,
		startAnimation:	startAnimation,
		createMesh:	createMesh,
		createMeshOutline:	createMeshOutline
	};
})();