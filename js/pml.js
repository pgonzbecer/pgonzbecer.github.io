
/********	Math	********/

Math.lerp=	function(a, b, t)	{
	return a+t*(b-a);
}

Math.clamp=	function(val, min, max)	{
	if(val< min)	return min;
	if(val> max)	return max;
	return val;
}

Math.dot=	function(a, b)	{
	// Variables
	let	n=	0;
	
	for(let i= 0; i< Math.min(a.length, b.length); i++)	{
		n+=	a[i]*b[i];
	}
	
	return n;
}

Math.map=	function(val, omin, omax, nmin, nmax)	{
	return (
		((val-omin)/(omax-omin))*
		(nmax-nmin)+nmin
	);
}

/********	Vector2	********/

function Vector2(_x, _y)	{
	this.x=	_x;
	this.y=	_y;
	
	// --- Methods ---
	
	this.getHeading=	function()	{
		return Math.atan2(this.y, this.x);
	}
	
	this.getMagnitude=	function()	{
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}
	
	this.limit=	function(scalar)	{
		// Variables
		let	mag=	this.getMagnitude();
		
		this.mul(scalar/mag);
	}
	
	this.clone=	function()	{
		return new Vector2(this.x, this.y);
	}
	
	this.add=	function(vec)	{
		this.x+=	vec.x;
		this.y+=	vec.y;
	}
	
	this.sub=	function(vec)	{
		this.x-=	vec.x;
		this.y-=	vec.y;
	}
	
	this.mul=	function(scalar)	{
		this.x*=	scalar;
		this.y*=	scalar;
	}
	
	this.div=	function(scalar)	{	this.mul(1/scalar);	}
	
	this.dot=	function(vec)	{
		return this.x*vec.x+this.y*vec.y;
	}
}

Vector2.ZERO=	new Vector2(0, 0);
Vector2.fromAngle=	function(angle)	{
	return new Vector2(Math.cos(angle), Math.sin(angle));
}

/********	NoiseGenerator	********/

var	NoiseGenerator=	(function()	{
	// Variables
	let	perm=	[];
	let	reinit=	function()	{
		for(let i= 0; i< 257; i++)	{
			perm[i]=	Math.floor(256*Math.random());
		}
	}
	let	fade=	function(n)	{
		return (n*n*n*(n*(n*6-15)+10));
	}
	let	gradient=	function(hash, x, y, z)	{
		// Does the hash, x version
		if(y== undefined)	{
			return (
				((hash&1)== 0) ? x : -x
			);
		}
		// Does the hash, x, y, version
		else if(z== undefined)	{
			return (
				(((hash&1)== 0) ? x : -x)+
				(((hash&2)== 0) ? y : -y)
			);
		}
		// Does the hash, x, y, z version
		else	{
			// Variables
			let	h=	(hash&15);
			let	u=	((h< 8) ? x : y);
			let	v=	((h< 4) ? y : (
				((h== 12 || h== 14) ? x : z)
			));
			
			return gradient(h, u, v);
		}
	}
	let	noise=	function(x, y, z)	{
		// Does the x version
		if(y== undefined)	{
			// Variables
			let	a=	Math.floor(x)&0xff;
			let	_x=	x-Math.floor(x);
			let	u=	fade(_x);
			
			return Math.lerp(
				gradient(perm[a], _x),
				gradient(perm[a+1], _x-1),
				u
			)*2;
		}
		// Does the x, y version
		else if(z== undefined)	{
			// Variables
			let	a=	Math.floor(x)&0xff;
			let	b=	Math.floor(y)&0xff;
			let	_x=	x-Math.floor(x);
			let	_y=	x-Math.floor(y);
			let	u=	fade(_x);
			let	v=	fade(_y);
			let	_a=	(perm[a]+b)&0xff;
			let	_b=	(perm[a+1]+b)&0xff;
			
			return Math.lerp(
				Math.lerp(
					gradient(perm[_a], _x, _y),
					gradient(perm[_b], _x-1, y),
					u
				),
				Math.lerp(
					gradient(perm[_a+1], x, y-1),
					gradient(perm[_b+1], x-1, y-1),
					u
				),
				v
			);
		}
		// Does the x, y, z version
		else	{
			// Variables
			let	a=	Math.floor(x)&0xff;
			let	b=	Math.floor(y)&0xff;
			let	c=	Math.floor(z)&0xff;
			let	_x=	x-Math.floor(x);
			let	_y=	y-Math.floor(y);
			let	_z=	z-Math.floor(z);
			let	u=	fade(_x);
			let	v=	fade(_y);
			let	w=	fade(_z);
			let	_a=	(perm[a]+b)&0xff;
			let	_b=	(perm[a+1]+b)&0xff;
			let	aa=	(perm[_a]+c)&0xff;
			let	ba=	(perm[_b]+c)&0xff;
			let	ab=	(perm[_a+1]+c)&0xff;
			let	bb=	(perm[_b+1]+c)&0xff;
			
			return Math.lerp(
				Math.lerp(
					Math.lerp(
						gradient(perm[aa], x, y, z),
						gradient(perm[ba], x-1, y, z),
						u
					),
					Math.lerp(
						gradient(perm[ab], x, y-1, z),
						gradient(perm[bb], x-1, y-1, z),
						u
					),
					v
				),
				Math.lerp(
					Math.lerp(
						gradient(perm[aa+1], x, y, z-1),
						gradient(perm[ba+1], x-1, y, z-1),
						u
					),
					Math.lerp(
						gradient(perm[ab+1], x, y-1, z-1),
						gradient(perm[bb+1], x-1, y-1, z-1),
						u
					),
					v
					
				),
				w
			);
		}
	}
	
	reinit();
	
	return {
		reinit:	reinit,
		noise:	noise
	};
})();