
/*********************

Paul's Assistive Mathematics Library

Created by Paul Gonzalez-Becerra

*********************/

var	PAML=	(function()	{
	// Variables
	var	getSectionedConditionals=	function(str, exprs)	{
		// Variables
		var	scopes=	getScopes(str, '(', ')');
		var	sections=	[];
		
		for(var i= 0; i< scopes.length; i++)	{
			sections.push(str.substring(scopes[i].min+1, scopes[i].max));
		}
		
		return sections;
	};
	var	createTruthTable=	function(tree, exprs)	{
		// Variables
		var	table=	new Table(tree.build(true), exprs, Math.pow(2, exprs.len));
		
		function Table(__str, __exprs, __length)	{
			// Variables
			this.str=	__str;
			this.size=	__length;
			this.data=	[];
			this.headers=	[];
			this.sections=	getSectionedConditionals(__str, __exprs);
			
			// Creates the base truth table
			{
				// Variables
				var	tes=	this.size/2;
				var	bvalue;
				
				for(var a= 0; a< __exprs.len; a++)	{
					this.headers[a]=	__exprs["P_"+a];
					this.data[a]=	[];
					bvalue=	false;
					for(var b= 0; b< this.size; b++)	{
						if(b%tes== 0)
							bvalue=	!bvalue;
						this.data[a][b]=	bvalue;
					}
					tes/=	2;
				}
			}
			// Creates the sectioned truth table
			{
				// Variables
				var	baselength=	this.headers.length;
				var	temp=	this.str;
				
				for(var a= baselength; a< baselength+this.sections.length; a++)	{
					this.headers[a]=	this.sections[a-baselength].replace(/P\_[0-9]+/g, function(arg)	{
						return __exprs[arg];
					}.bind(this)).replace(/\&\&/g, "and").replace(/\|\|/g, "or").replace(/\!/g, "not");
					this.data[a]=	[];
					
					for(var b= 0; b< this.size; b++)	{
						temp=	this.sections[a-baselength].replace(/P\_([0-9]+)/g, function(arg)	{
							return this.data[1*arg.substring(2)][b];
						}.bind(this)).replace(/not/g, "!");
						
						this.data[a][b]=	eval(temp);
					}
				}
			}
			
			this.toHTML=	function()	{
				// Variables
				var	table=	document.createElement("table");
				var	tr, th, td;
				
				for(var a= 0; a< this.headers.length; a++)	{
					tr=	document.createElement("tr");
					th=	document.createElement("th");
					th.innerHTML=	this.headers[a];
					tr.append(th);
					for(var b= 0; b< this.size; b++)	{
						td=	document.createElement("td");
						td.innerHTML=	this.data[a][b];
						if(this.data[a][b]== true)	{
							td.innerHTML=	"T";
							td.classList.add("cc-true");
						}
						else if(this.data[a][b]== false)	{
							td.innerHTML=	"F";
							td.classList.add("cc-false");
						}
						
						tr.append(td);
					}
					table.append(tr);
				}
				
				return table;
			};
		}
		
		return table;
	};
	var	createConditionTree=	function(str)	{
		// Variables
		var	exprs=	getNestedExpressions(str);	console.log(exprs);
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
			this.build=	function(replaces)	{
				// Variables
				var	str=	"";
				
				if(this.left)
					str+=	"("+this.left.build(replaces);
				str+=	" "+(replaces ? (this.value
					.replace("and", "&&")
					.replace("or", "||")
					.replace("not", "!")) : this.value)+" ";
				if(this.right)
					str+=	this.right.build(replaces)+")";
				
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
				if(this.left && this.value!= "not")	{
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
			
			p.value=	p.value.replace(/x\_[0-9]+/g, function(arg)	{
				return exprs["x_"+arg.substring(2)];
			});
			
			if(p.isNull())	{
				// Variables
				var	conditions=	["or", "||", "and", "&&"];
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
						
						p.left=	lnode;
						p.right=	rnode;
						p.value=	conditions[a];
						break;
					}
				}
				
				// Last stop. Check for nots
				if(p.isNull())	{
					if(p.value.toLowerCase().indexOf("not")!= -1)	{
						p.left=	new Node("");
						p.right=	new Node(p.value.replace("not", "").trim());
						p.value=	"not";
					}
					else if(p.value.toLowerCase().indexOf("~")!= -1)	{
						p.left=	new Node("");
						p.right=	new Node(p.value.replace("~", "").trim());
						p.value=	"not";
					}
					else if(p.value.toLowerCase().indexOf("¬")!= -1)	{
						p.left=	new Node("");
						p.right=	new Node(p.value.replace("¬", "").trim());
						p.value=	"not";
					}
					else if(p.value.toLowerCase().indexOf("!")!= -1)	{
						p.left=	new Node("");
						p.right=	new Node(p.value.replace("!", "").trim());
						p.value=	"not";
					}
				}
			}
			if(p.right)
				stack.push(p.right);
			if(p.left)
				stack.push(p.left);
		}
		
		console.log(tree.build(true));
		
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
	var	getNestedExpressions=	function(__str)	{
		// Variables
		var	exprs=	{};
		var	str=	__str;
		var	scope=	getFirstScope(str, '(', ')');
		var	xoff=	0;
		
		console.log(scope);
		
		while(!scope.err)	{
			exprs["x_"+xoff]=	str.substring(scope.min+1, scope.max);
			str=	str.substring(0, scope.min)+"x_"+xoff+str.substring(scope.max+1);
			xoff++;
			scope=	getFirstScope(str, '(', ')');
		}
		
		return {str: str, exprs: exprs};
	};
	var	isPast=	function(scope, temp)	{
		return (temp.max< scope.min);
	};
	var	isWithin=	function(scope, temp)	{
		return (scope.min< temp.min && scope.max> temp.max);
	}
	var	getFirstScope=	function(str, opening, closing)	{
		// Variables
		var	oidx=	-1;
		var	cidx=	-1;
		var	idx=	-1;
		var	pidx=	-1;
		
		while(++idx< str.length)	{
			oidx=	str.indexOf(opening, idx);
			cidx=	str.indexOf(closing, idx);
			
			if(oidx== cidx)
				break;
			else if(oidx*cidx< 0)	{
				idx=	Math.max(oidx, cidx);
				if(idx== cidx)	{
					return	{
						min:	pidx,
						max:	idx,
						err:	false
					};
				}
			}
			else	{
				idx=	Math.min(oidx, cidx);
				if(idx== oidx)	{
					pidx=	idx;
				}
				else	{
					return	{
						min:	pidx,
						max:	idx,
						err:	false
					};
				}
			}
		}
		
		return	{
			min:	-1,
			max:	-1,
			err:	true
		};
	};
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