
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
		var	table=	new Table(tree, exprs, Math.pow(2, exprs.len));
		
		return table;
	};
	var	changeIfThen=	function(__str)	{
		// Variables
		var	str=	"";
		var	idx=	0;
		var	continues=	false;
		var	changes=	[
			{str:	" if and only if ", change:	_changeIFF},
			{str:	" only if ", change:	_changeONLYIF},
			{str:	" implies ", change:	_changeIFTHEN},
			{str:	" is sufficient for ", change:	_changeIFTHEN},
			{str:	" is necessary for ", change:	_changeONLYIF},
			{str:	" is necessary and sufficient for ", change:	_changeIFF},
			{str:	" is sufficient and necessary for ", change:	_changeIFF},
			{str:	" => ", change:	_changeIFTHEN},
			{str:	" <= ", change:	_changeONLYIF},
			{str:	" <=> ", change:	_changeIFF},
			{str:	"iff", change:	_changeIFF}
		]
		
		function _changeIFTHEN(p, q)	{
			return "(not ("+p+") or "+q+")";
		}
		function _changeONLYIF(p, q)	{
			return "("+p+" or not ("+q+"))";
		}
		function _changeIFF(p, q)	{
			return "("+_changeIFTHEN(p, q)+" and "+_changeONLYIF(p, q)+")";
		}
		
		while(idx!= -1)	{
			str=	__str.toLowerCase();
			continues=	false;
			for(var i= 0; i< changes.length; i++)	{
				idx=	str.indexOf(changes[i].str);
				if(idx!= -1)	{
					// Variables
					var	midx=	idx+(changes[i].str.length);
					var	fidx=	getFirstScopeIndex(str, idx, ')', '(');
					var	lidx=	getClosestScopeIndex(str, midx, '(', ')');
					var	p=	__str.substring(fidx+1, idx);
					var	q=	__str.substring(midx, lidx);
					
					__str=	(
						__str.substring(0, fidx)+
						changes[i].change(p, q)+
						__str.substring(lidx+1)
					);
					continues=	true;
					break;
				}
			}
			if(continues)
				continue;
			idx=	str.indexOf("if ");
			if(idx!= -1 && str.indexOf(" then ", idx)!= -1)	{
				// Variables
				var	tidx=	str.indexOf(" then ", idx);
				var	lidx=	getClosestScopeIndex(str, tidx, '(', ')');
				var	p=	__str.substring(idx+("if ".length), tidx);
				var	q=	__str.substring(tidx+(" then ".length), lidx);
				
				__str=	(
					__str.substring(0, idx-1)+
					_changeIFTHEN(p, q)+
					__str.substring(lidx+1)
				);
			}
			else	{
				idx=	-1;
			}
		}
		
		return __str;
	};
	var	createConditionTree=	function(__str)	{
		// Variables
		var	exprs=	getNestedExpressions(changeIfThen(__str));
		var	str=	exprs.str;	exprs=	exprs.exprs;
		var	tree=	constructConditionTree(new Node(str), exprs);
		
		return tree;
	};
	var	constructConditionTree=	function(tree, exprs)	{
		let	p=	null;
		var	demorgans=	false;
		let	stack=	[];
		
		stack.push(tree);
		
		while(stack.length> 0)	{
			p=	stack.pop();
			demorgans=	false;
			var	m=	p.value.match(/P\_[0-9]+/);
			if(m && m== p.value.replace("not ", "").trim())	{
				p.value=	p.value.replace(/P\_[0-9]+/g, function(arg)	{
					if(p.value.indexOf("not "+arg)!= -1)	{
						demorgans=	true;
						//return "("+exprs["P_"+arg.substring(2)]+")";
					}
					return exprs["P_"+arg.substring(2)];
				});
			}
			
			if(p.isNull())	{
				if(!demorgans)	{
					// Variables
					var	conditions=	["or", "||", "and", "&&"];
					var	_condition;
					
					for(var a= 0; a< conditions.length; a++)	{
						_condition=	splitFirst(p.value, conditions[a]);
						if(_condition)	{
							for(var i= 0; i< 2; i++)	{
								// Variables
								var	m=	_condition[i].match(/(P\_[0-9]+)/);
								
								if(m== _condition[i])
									_condition[i]=	exprs[m[0]];
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
				}
				if(p.value.toLowerCase().indexOf("not ")!= -1)	{
					// Variables
					var	i=	p.value.toLowerCase().indexOf("not ");
					if(i== 0 || (i> 0 && p.value[i-1]== " "))	{
						p.left=	new Node("");
						p.right=	new Node(p.value.replace("not ", "").trim());
						p.value=	"not";
					}
				}
				else if(p.value.toLowerCase().indexOf("~")!= -1)	{
					p.left=	new Node("");
					p.right=	new Node(p.value.replace("~", "").trim());
					p.value=	"not";
				}
				else if(p.value.toLowerCase().indexOf("\u00ac")!= -1)	{
					p.left=	new Node("");
					p.right=	new Node(p.value.replace("\u00ac", "").trim());
					p.value=	"not";
				}
				else if(p.value.toLowerCase().indexOf("! ")!= -1)	{
					// Variables
					var	i=	p.value.toLowerCase().indexOf("! ");
					if(i== 0 || (i> 0 && p.value[i-1]== " "))	{
						p.left=	new Node("");
						p.right=	new Node(p.value.replace("! ", "").trim());
						p.value=	"not";
					}
				}
			}
			if(p.right)
				stack.push(p.right);
			if(p.left)
				stack.push(p.left);
		}
		
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
		var	done=	false;
		
		while(!scope.err)	{
			exprs["P_"+xoff]=	str.substring(scope.min+1, scope.max);
			str=	str.substring(0, scope.min)+"P_"+xoff+str.substring(scope.max+1);
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
	var	getFirstScopeIndex=	function(str, index, closing, opening)	{
		// Variables
		var	scope=	0;
		
		while(index>= 0)	{
			if(str[index]== closing)
				scope++;
			else if(str[index]== opening)	{
				if(scope== 0)	{
					return index;
				}
				scope--;
			}
			index--;
		}
		
		return -1;
	};
	var	getClosestScopeIndex=	function(str, index, opening, closing)	{
		// Variables
		var	scope=	0;
		
		while(index< str.length)	{
			if(str[index]== opening)
				scope++;
			else if(str[index]== closing)	{
				if(scope== 0)
					return index;
				scope--;
			}
			index++;
		}
		
		return str.length+1;
	};
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
	
	function Node(__value)	{
		// Variables
		this.left=	null;
		this.right=	null;
		this.value=	__value;
		
		this.isNull=	function()	{	return (this.left== null && this.right== null);	};
		this.build=	function(replaces, check)	{
			// Variables
			var	str=	"";
			
			if(check)	{
				if(this.left && this.right)	{
					if(this.value== "and")	{
						// Variables
						var	checks=	0;
						// Checking for Left's P => Q
						if(this.left.left && this.left.right && this.left.value== "or")	{
							checks++;
							if(this.left.left.value== "not" && this.left.right.value!= "not")
								checks++;
						}
						// Checking for Right's P <= Q
						if(this.right.left && this.right.right && this.right.value== "or")	{
							checks++;
							if(this.right.left.value!= "not" && this.right.right.value== "not")
								checks++;
						}
						if(checks== 4)	{
							return (
								"("+this.left.left.right.build(replaces, check)+
								" <=> "+this.left.right.build(replaces, check)+")"
							);
						}
					}
					if(this.value== "or")	{
						// Checking for P => Q
						if(this.left.value== "not" && this.right.value!= "not")	{
							return (
								"("+this.left.right.build(replaces, check)+
								" => "+this.right.build(replaces, check)+")"
							);
						}
						// Checking for P <= Q
						if(this.left.value!= "not" && this.right.value== "not")	{
							return (
								"("+this.left.build(replaces, check)+
								" <= "+this.right.right.build(replaces, check)+")"
							);
						}
					}
				}
			}
			
			if(this.left)
				str+=	"("+this.left.build(replaces, check);
			str+=	" ";
			if(replaces)	{
				str+=	(this.value
					.replace("and", "&&")
					.replace("or", "||")
					.replace("not", "!")
				);
			}
			else	{
				str+=	(this.value
					.replace("not", "\u00ac")
				);
			}
			str+=	" ";
			if(this.right)
				str+=	this.right.build(replaces, check)+")";
			
			return str.trim();
		};
		this.trimParenthesis=	function(val)	{
			// Variables
			var	lp=	0;
			var	rp=	0;
			
			val=	val.trim();
			
			for(var i= 0; i< val.length; i++)	{
				if(val[i]== "(")
					lp++;
				else
					break;
			}
			for(var i= val.length-1; i>= 0; i--)	{
				if(val[i]== ")")
					rp++;
				else
					break;
			}
			lp=	Math.min(lp, rp);
			
			return val.substring(lp, val.length-lp);
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
	
	function Table(__tree, __exprs, __length)	{
		// Variables
		this.str=	__tree.build(true, false);
		this.size=	__length;
		this.data=	[];
		this.headers=	[];
		this.fullHeaders=	[];
		this.duplicates=	[];
		this.sections=	getSectionedConditionals(this.str, __exprs);
		
		// Creates the base truth table
		{
			// Variables
			var	tes=	this.size/2;
			var	bvalue;
			
			for(var a= 0; a< __exprs.len; a++)	{
				this.headers[a]=	__exprs["P_"+a];
				this.fullHeaders[a]=	this.headers[a];
				this.data[a]=	[];
				this.duplicates[a]=	false;
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
			var	p, q, t, s;
			
			for(var a= baselength; a< baselength+this.sections.length; a++)	{
				this.headers[a]=	this.sections[a-baselength].replace(/P\_[0-9]+/g, function(arg)	{
					return __exprs[arg];
				}.bind(this)).replace(/\&\&/g, "and").replace(/\|\|/g, "or").replace(/\!/g, "not");
				this.data[a]=	[];
				this.fullHeaders[a]=	this.headers[a];
				this.duplicates[a]=	false;
				
				p=	createConditionTree(this.headers[a]);
				q=	p.rebuild();
				t=	p.build(true, true);
				s=	getSectionedConditionals(t, q);
				
				for(var b= 0; b< s.length; b++)	{
					t=	s[b].replace(/P\_[0-9]+/g, function(arg)	{
						return q[arg];
					}).replace(/\&\&/g, "and").replace(/\|\|/g, "or").replace(/\!/g, "\u00ac");
				}
				
				this.headers[a]=	t;
				
				for(var b= 0; b< a; b++)	{
					if(this.headers[a]== this.headers[b])	{
						this.duplicates[a]=	true;
						break;
					}
				}
				
				
				for(var b= 0; b< this.size; b++)	{
					temp=	this.sections[a-baselength].replace(/P\_([0-9]+)/g, function(arg)	{
						return this.data[1*arg.substring(2)][b];
					}.bind(this)).replace(/not/g, "!");
					
					this.data[a][b]=	eval(temp);
				}
			}
		}
		
		this.toHTML=	function()	{
			console.log(this.str);
			// Variables
			var	table=	document.createElement("table");
			var	tr, th, td;
			var	table2=	document.createElement("table");
			var	tr2, th2, td2;
			
			table.id=	"table-1";
			table2.id=	"table-2";
			
			for(var a= 0; a< this.headers.length; a++)	{
				tr=	document.createElement("tr");
				th=	document.createElement("th");
				
				tr2=	document.createElement("tr");
				th2=	document.createElement("th");
				
				
				if(this.duplicates[a])	{
					tr.classList.add("duplicate");
					tr2.classList.add("duplicate");
				}
				th.innerHTML=	this.headers[a];
				tr.append(th);
				
				th2.innerHTML=	this.fullHeaders[a];
				tr2.append(th2);
				
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
					
					td2=	document.createElement("td");
					td2.innerHTML=	this.data[a][b];
					if(this.data[a][b]== true)	{
						td2.innerHTML=	"T";
						td2.classList.add("cc-true");
					}
					else if(this.data[a][b]== false)	{
						td2.innerHTML=	"F";
						td2.classList.add("cc-false");
					}
					
					tr2.append(td2);
				}
				table.append(tr);
				table2.append(tr2);
			}
			
			var	d=	document.createElement("div");
			
			d.append(table);
			d.append(table2);
			table=	d;
			
			return table;
		};
	}
	
	return	{
		getScopes:	getScopes,
		createTruthTable:	createTruthTable,
		getNestedExpressions:	getNestedExpressions,
		createConditionTree:	createConditionTree
	};
})();