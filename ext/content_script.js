var capo = 0;
walk(document.body);
window.addEventListener("load", ultimate_trans, false);

//check for "Capo on 2nd", 3rd, 4th, etc.
//check for "capo: 3"
//check for "Standard/Capo on Fourth"
//check for "[Capo at the 4th fret]"

function walk(node) 
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;


	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode) 
{
	matches = [];
	var v = textNode.nodeValue;
	var re = /capo(?: on)?\s(.+?)\b/ig;

	match = re.exec(v);

	while(match != null){
		matches.push(match);
		match = re.exec(v);
	}
	

	if(matches.length != 0){
		transpose(v, matches, textNode)
	}
	//document.getElementById('a.u_b').click();
	//using the array matches (which stores all the possible capos in the text), we can give the user
	//an option to select which capo they would like.  

	
}

function transpose(v, matches, textNode){
	capo = matches[matches.length - 1][1];
	//console.log(matches);

	
	//v = v.replace(/\bThe Cloud\b/g, "My Butt");
	//v = v.replace(/\bThe cloud\b/g, "My butt");
	//v = v.replace(/\bthe Cloud\b/g, "my Butt");
	//v = v.replace(/\bthe cloud\b/g, "my butt");
	
	textNode.nodeValue = v;
}

function ultimate_trans(e){
	document.getElementById("transpose_reset_val").click()
	console.log("reset!")

	function increase_trans(){
		iterations = 0;
		var interval = window.setInterval(function(){
			iterations++;
	    	var transpose_buts = document.getElementsByClassName('u_b');
			if(transpose_buts.length != 0){
				transpose_buts[0].click();
			}
			if(iterations >= capo){
				clearInterval(interval);
			}
		}, 130);
	}

	if(capo > 0){
		window.setTimeout(increase_trans, 130);
	}
}