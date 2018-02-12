
/*********************

Paul's Assistive Mathematics Library

Created by Paul Gonzalez-Becerra

*********************/

var	PAML=	(function()	{
	// Variables
	var	createConditionTree=	function(str)	{
		// Variables
		var	exprs=	getNestedExpressions(str);
		var	str=	exprs.str;	exprs=	exprs.exprs;
		var	tree=	[];
		
		
		
		return tree;
	};
	var	getNestedExpressions=	function(str)	{
		// Variables
		var	exprs=	{};
		var	scopes=	getScopes(str, '(', ')');
		var	xoff=	0;
		var	temp=	{
			a:	0,
			min:	-1,
			max:	0
		};
		
		// Grab all the scopes
		for(var i= 0; i< scopes.length; i++)	{
			if(scopes[i].min+1== scopes[i].max)
				continue;
			if(temp.min== -1)	{
				temp.a=	scopes[i].max-scopes[i].min;
				exprs["x_"+xoff]=	str.substring(
					scopes[i].min+1,
					scopes[i].max
				);
				str=	(
					str.substring(0, scopes[i].min)+
					"x_"+xoff+
					str.substring(scopes[i].max+1)
				);
				temp.a-=	("x_"+xoff).length;
			}
			else	{
				if(isPast(scopes[i], temp))	{
					temp.min=	temp.a;
					temp.max=	temp.a;
				}
				else if(isWithin(scopes[i], temp))	{
					temp.min=	0;
					temp.max=	temp.a;
				}
				else	{
					temp.min=	0;
					temp.max=	0;
				}
				exprs["x_"+xoff]=	str.substring(
					scopes[i].min+1-temp.min,
					scopes[i].max-1-temp.max
				);
				temp.a=	scopes[i].max-scopes[i].min;
				str=	(
					str.substring(0, scopes[i].min-temp.min)+
					"x_"+xoff+
					str.substring(scopes[i].max-temp.max)
				);
				temp.a-=	("x_"+xoff).length;
			}
			
			xoff++;
			
			temp.min=	scopes[i].min;
			temp.max=	scopes[i].max
		}
		
		return {str:str,exprs:exprs};
	};
	var	isPast=	function(scope, temp)	{
		return (scope.max< temp.min);
	};
	var	isWithin=	function(scope, temp)	{
		return (scope.min< temp.min && scope.max> temp.max);
	}
	var	getScopes=	function(str, opening, closing)	{
		// Variables
		var	oidx=	-1;
		var	cidx=	-1;
		var	idx=	-1;
		var	scopes=	[];
		var	stack=	[];
		var	scope=	0;
		
		while(++idx< str.length)	{
			oidx=	str.indexOf(opening, idx);
			cidx=	str.indexOf(closing, idx);
			
			if(oidx== cidx)	{
				break;
			}
			else if(oidx*cidx< 0)	{
				idx=	Math.max(oidx, cidx);
				// If the index is a closure thing
				if(idx== cidx)	{
					pushToScopes();
				}
			}
			else	{
				idx=	Math.min(oidx, cidx);
				if(idx== oidx)	{
					stack.push(idx);
					scope++;
				}
				else	{
					pushToScopes();
				}
			}
		}
		
		function pushToScopes()	{
			scopes.push({
				min:	stack.pop(),
				max:	cidx,
				scope:	scope--
			});
			for(var i= scopes.length-2; i>= 0; i--)	{
				if(scopes[i].scope< scopes[scopes.length-1].scope)	{
					scopes.splice(i, 0, scopes.pop());
					break;
				}
			}
		}
		
		return scopes;
	};
	
	return	{
		getScopes:	getScopes,
		getNestedExpressions:	getNestedExpressions,
		createConditionTree:	createConditionTree
	};
})();