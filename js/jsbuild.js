// Created by Paul Gonzalez Becerra

build=  function(args)
{
  console.log(args);
  if(!args.target || $(args.target)== null)
    throw exception("No target located")
  
  // Variables
  var target= $(getContent(args.target));
  
  if(args.innerHTML)
  {
    // Variables
    var ih= getContent(args.innerHTML);
    
    target.html(ih);
  }
  
  function getContent(argument)
  {
    if(argument== null)
      throw exception("Argument is null");
    
    return (($.isFunction(argument) ? argument(arguments) : argument))
  }
};

// End of File
