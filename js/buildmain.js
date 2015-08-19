// Created by Paul Gonzalez Becerra

$(document).ready(function(args)
{
	build({
		appendHead:	[
			{
				tagName:	"link",
				rel:	"stylesheet",
				type:	"text/css",
				href:	"css/bootstrap.css"
			},
			{
				tagName:	"link",
				rel:	"stylesheet",
				type:	"text/css",
				href:	"css/main.css"
			},
			{
				tagName:	"script",
				src:	"js/bootstrap.js"
			}
		],
		replace:	[
			{
				target:	".insert-nav",
				node:	getNavigation
			}
		]
	});
});

function getNavigation(args)
{
	return (
		"<nav class='navbar navbar-default navbar-fixed-top'>"+
			"<div class='container-fluid'>"+
					"<div class='navbar-header'>"+
						"<span class='logo-text'>{ pgonzbecer }</span>"+
						"<button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#nbc' aria-expanded='false'>"+
							"<span class='sr-only'>Toggle navigation</span>"+
							"<span class='icon-bar'></span>"+
							"<span class='icon-bar'></span>"+
							"<span class='icon-bar'></span>"+
						"</button>"+
					"</div>"+
					"<div class='collapse navbar-collapse' id='nbc'>"+
						"<ul class='nav navbar-nav'>"+
							"<li><a href='index.html'>Home</a></li>"+
							"<li><a href='projects.html'>Projects</a></li>"+
							"<li><a href='docs.html'>Documentations</a></li>"+
							"<li><a href='contact.html'>Contact</a></li>"+
						"</ul>"+
					"</div>"+
				"</div>"+
		"</nav>"
	);
}

// End of File
