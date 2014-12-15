walk(document.body);
window.addEventListener("load", ultimate_trans, false);


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
	console.log(matches);

	
	v = v.replace(/\bThe Cloud\b/g, "My Butt");
	v = v.replace(/\bThe cloud\b/g, "My butt");
	v = v.replace(/\bthe Cloud\b/g, "my Butt");
	v = v.replace(/\bthe cloud\b/g, "my butt");
	
	textNode.nodeValue = v;
}

function ultimate_trans(e){
	document.getElementById("transpose_reset_val").click()


	var transpose_buts = document.getElementsByClassName('u_b');
	if(transpose_buts.length != 0){
		transpose_buts[0].click();
		console.log("did it!")
	}
	console.log(transpose_buts.length)
}