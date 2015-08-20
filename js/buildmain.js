// Created by Paul Gonzalez Becerra

$(document).ready(function(args)
{
	WebBuilder.setOrigin({
		local:	"/C:/Users/Chams2.0/Documents/GitHub/pgonzbecer.github.io/",
		remote:	"http://www.pgonzbecer.com/"
	});
	WebBuilder.build({
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
				tagName:	"link",
				rel:	"icon",
				type:	"image/x-icon",
				href:	"images/favicon.ico"
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
			},
			{
				target:	".footer",
				innerHTML:	"Paul Gonzalez-Becerra &copy; 2015."
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
						"<li><a href='"+args.fromOriginPath("index.html")+"'>Home</a></li>"+
						"<li><a href='"+args.fromOriginPath("projects.html")+"'>Projects</a></li>"+
						"<li><a href='"+args.fromOriginPath("documentation.html")+"'>Documentations</a></li>"+
						"<li><a href='"+args.fromOriginPath("contact.html")+"'>Contact</a></li>"+
					"</ul>"+
				"</div>"+
			"</div>"+
		"</nav>"
	);
}

// End of File