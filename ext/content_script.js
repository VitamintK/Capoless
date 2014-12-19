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
	//which I stole from https://github.com/panicsteve/cloud-to-butt
	
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
	var re = /capo(?: on)?\s(\d).*?\b(?: fret)?/ig;

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

	matchedtext = new RegExp(matches[matches.length - 1][0], 'g')

	//v = v.replace(matchedtext, "<span class='highlight'> " + matches[matches.length - 1][0] + " </span>");
	//var highlighted = document.createElement('high'); //<--- surely there has to be an easier way to highlight text???
	//highlighted.innerHTML = "<span class='highlight'> " + matches[matches.length - 1][0] + " </span>";

	//console.log(textNode);
	//console.log(v);
	//console.log(textNode.innerHTML);
	//textNode.nodeValue = v;
	//console.log(textNode.parentNode.innerHTML);
	textNode.parentNode.innerHTML = textNode.parentNode.innerHTML.replace(matchedtext, "<span class='highlight'>" + matches[matches.length - 1][0] + "</span>");
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