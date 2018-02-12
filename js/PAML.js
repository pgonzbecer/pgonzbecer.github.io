
/*********************

Paul's Assistive Mathematics Library

Created by Paul Gonzalez-Becerra

*********************/

var	PAML=	(function()	{
	// Variables
	var	createTruthTable=	function(str, exprs)	{
		// Variables
		var	len=	exprs.len;
		var	trueLen=	Math.pow(2, len);
		var	modulus;
		var	tempStr=	"";
		var	bx=	false;
		var	truths=	[];
		var	strs=	[];
		
		for(var a= 0; a< len; a++)	{
			truths[a]=	[];
			modulus=	Math.pow(2, len-a-1);
			console.log(modulus);
			for(var b= 0; b< trueLen; b++)	{
				if(b%modulus== 0)
					bx=	!bx;
				truths[a][b]=	bx;
			}
		}
		truths.len=	truths[0].length;
		
		console.log(str);
		for(var a= 0; a< truths[0].length; a++)	{
			tempStr=	str;
			for(var b= 0; b< truths.length; b++)	{
				// Variables
				var	reg=	new RegExp("P\_"+b, 'g');
				
				tempStr=	tempStr.replace(reg, truths[b][a]);
			}
			strs.push(tempStr);
		}
		
		return strs;
	};
	var	createConditionTree=	function(str)	{
		// Variables
		var	exprs=	getNestedExpressions(str);
		var	str=	exprs.str;	exprs=	exprs.exprs;
		var	tree=	new Node(str);
		var	stack=	[];
		var	p=	null;
		
		function Node(__value)	{
			// Variables
			this.left=	null;
			this.right=	null;
			this.value=	__value;
			
			this.isNull=	function()	{	return (this.left== null && this.right== null);	};
			this.build=	function()	{
				// Variables
				var	str=	"";
				
				if(this.left)
					str+=	"("+this.left.build();
				str+=	" "+this.value
					.replace("and", "&&")
					.replace("or", "||")+" ";
				if(this.right)
					str+=	this.right.build()+")";
				
				return str.trim();
			};
			this.clone=	function()	{	return new Object(this);	};
			this.rebuild=	function()	{
				// Variables
				var	_exprs=	{len:0};
				var	num=	this.rebuildFull(0, _exprs);
				
				_exprs.len=	num;
				
				return _exprs;
			};
			this.rebuildFull=	function(num, _exprs)	{
				if(this.left)	{
					num=	this.left.rebuildFull(num, _exprs);
				}
				if(this.isNull())	{
					// Variables
					var	skip=	-1;
					
					for(var i= 0; i< num; i++)	{
						if(_exprs["P_"+i]== this.value)	{
							skip=	i;
							break;
						}
					}
					if(skip== -1)	{
						_exprs["P_"+num]=	this.value;
						this.value=	"P_"+num;
						num++;
					}
					else	{
						this.value=	"P_"+skip;
					}
				}
				if(this.right)	{
					num=	this.right.rebuildFull(num, _exprs);
				}
				return num;
			};
		}
		
		stack.push(tree);
		
		while(stack.length> 0)	{
			p=	stack.pop();
			if(p.isNull())	{
				// Variables
				var	conditions=	["or", "and"];
				var	_condition;
				
				for(var a= 0; a< conditions.length; a++)	{
					_condition=	splitFirst(p.value, conditions[a]);
					if(_condition)	{
						for(var i= 0; i< 2; i++)	{
							// Variables
							var	m=	_condition[i].match(/(x\_[0-9]*)/);
							
							if(m)
								_condition[i]=	_condition[i].replace(m[0], exprs[m[0]]);
						}
						
						// Variables
						var	lnode=	new Node(_condition[0]);
						var	rnode=	new Node(_condition[1]);
						
						console.log(_condition);
						
						p.left=	lnode;
						p.right=	rnode;
						p.value=	conditions[a];
						break;
					}
				}
			}
			if(p.right)
				stack.push(p.right);
			if(p.left)
				stack.push(p.left);
		}
		
		console.log(tree);
		
		
		return tree;
	};
	var	splitFirst=	function(str, delimit)	{
		// Variables
		var	index=	str.indexOf(" "+delimit+" ");
		
		if(index== -1)
			return undefined;
		
		return	[
			str.substring(0, index).trim(),
			str.substring(index+(" "+delimit+" ").length).trim(),
			index
		];
	};
	var	getNestedExpressions=	function(str)	{
		// Variables
		var	exprs=	{};
		var	scopes=	getScopes(str, '(', ')');
		var	xoff=	0;
		var	temp=	{
			a:	0,
			min:	-1,
			max:	0,
			scope:	0,
			counter:	0
		};
		
		console.log(scopes);
		
		// Grab all the scopes
		for(var i= 0; i< scopes.length; i++)	{
			if(scopes[i].min+1== scopes[i].max)
				continue;
			if(temp.min== -1)	{
				temp.a=	scopes[i].max-scopes[i].min;
				temp.scope=	scopes[i].scope;
				exprs["x_"+xoff]=	str.substring(
					scopes[i].min+1,
					scopes[i].max
				);
				console.log(exprs["x_"+xoff]);
				str=	(
					str.substring(0, scopes[i].min)+
					"x_"+xoff+
					str.substring(scopes[i].max+1)
				);
				temp.a-=	("x_"+xoff).length;
			}
			else	{
				if(scopes[i].scope== 1)
					temp.a+=	temp.counter+1;
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
				temp.a-=	temp.counter-1;
				temp.a+=	(scopes[i].max-scopes[i].min);
				exprs["x_"+xoff]=	str.substring(
					scopes[i].min+1-temp.min,
					scopes[i].max-temp.max
				);
				console.log(exprs["x_"+xoff]);
				str=	(
					str.substring(0, scopes[i].min+temp.counter-temp.min)+
					" x_"+xoff+" "+
					str.substring(scopes[i].max+1-temp.max)
				);
				if(temp.scope!= scopes[i].scope)	{
					temp.scope=	scopes[i].scope;
					temp.a=	(scopes[i].max-scopes[i].min);
					temp.counter=	0;
					console.log("!!!!!!!!!!!!!!!!!!!!!!!");
				}
				else if(temp.scope== 1)
					temp.counter++;
				temp.a-=	(" x_"+xoff+" ").length;
				console.log(scopes[i], temp);
			}
			console.log(str);
			xoff++;
			
			temp.min=	scopes[i].min;
			temp.max=	scopes[i].max
		}
		
		return {str:str,exprs:exprs};
	};
	var	isPast=	function(scope, temp)	{
		return (temp.max< scope.min);
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
				if(scopes[i].scope< scopes[i+1].scope)	{
					// Variables
					var	temp=	scopes[i];
					
					scopes[i]=	scopes[i+1];
					scopes[i+1]=	temp;
				}
				else	{
					break;
				}
			}
		}
		
		return scopes;
	};
	
	return	{
		getScopes:	getScopes,
		createTruthTable:	createTruthTable,
		getNestedExpressions:	getNestedExpressions,
		createConditionTree:	createConditionTree
	};
})();