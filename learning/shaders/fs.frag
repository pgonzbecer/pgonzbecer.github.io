
// Variables
// Uniform qualified variables are changed at most once per primitive by the application
uniform vec3	coolestColor;
uniform vec3	hottestColor;
// Temperature contains the now interpolated per-fragment value of temperature set by the
// vertex shader
varying float	temperature;

void main()	{
	// Variables
	// Gets a color between coolest and hottest colors, using the mix built-in funciton
	vec3	color=	mix(coolestColor, hottestColor, temperature);
	
	// Set's this fragment's color
	gl_FragColor=	vec4(color, 1.0);
}