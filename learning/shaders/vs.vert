
// Variables
// Uniform qualified variables are changed at most once per primitive
uniform float	coolestTemp;
uniform float	tempRange;
// Attribute qualified variables are typically changed per vertex
attribute float	vertexTemp;
// Varying qualified variables communicate from the vertex shader to the fragment shader
varying float	temperature;

// --- Methods ---

void main()	{
	// Compute a temperature to be interpolated per fragment in the range [0, 1]
	temperature= (vertexTemp-coolestTemp)/tempRange;
	
	// The vertex position written in the application using glVertex
	// can be read from the built-in variable gl_vertex. Use this value
	// and the current model view transformation matrix to tell the
	// rasterizer where this vertex is
	gl_Position=	gl_ModelViewProjectionMatrix*gl_Vertex;
}