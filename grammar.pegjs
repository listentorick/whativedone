{
	var data = {
		primaryTag: null,
		tags: [],
		time: 0,
                originalText: null
	} 
}


start = 
   tag: tagAtom space* expr:listCommands* space*
        { data.primaryTag = tag;
return data }
	
	
command=
 b:(
  timeAtom / 
  word /
  tagAtom /
  space)  {return b;}

listCommands =
    head:command space+ tail:listCommands 
         { return [head].concat(tail) }
     /
    expr:command
         { return [expr] }




tagAtom =
   bang:"#" tag:word    
     {
      if(data.tags.indexOf(tag)==-1) data.tags.push(tag);
      return tag;
     }

timeAtom = 
    plusLabel:"+" timeLabel: validNumber  
    {
     data.time = timeLabel;
     return plusLabel + timeLabel}
 
validchar
    = [0-9a-zA-Z]

space
 =  [ \n\t]+ { return " "}

word = chars:validchar+
        { return chars.join(""); }

validNumber = first: [1-9] rest: [0-9]*
              {return parseInt(first + rest.join(""));}





