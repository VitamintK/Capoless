var capo = 0;
var nodesWithCapo = [];
walk(document.body);
for(var i = 0; i<nodesWithCapo.length; i++){
	highlightCapo(nodesWithCapo[i]);
}
//window.addEventListener("load", ultimate_trans, false);

//check for "Capo on 2nd", 3rd, 4th, etc.
//check for "capo: 3"
//check for "Standard/Capo on Fourth"
//check for "[Capo at the 4th fret]"
//check for "Capo at the 11th fret"
//TODO: for pages with multiple songs (such as albums [http://tabs.ultimate-guitar.com/t/taylor_swift/1989_album_crd.htm]),
//transpose each chord based on the most recent capo found.  For example,
//Capo 5
//C A B
//Capo 3
//D E D
//should use the capo value of 5 to transpose the CAB, and the capo value of 3 to transpose DED.
//
//Also, add an option to click a highlighted text "Capo on 5th fret" to turn transposing on and off.
//maybe also add parser for "tune down half-step" etc., and transpose those as well.


function highlightCapo(nodeAndText){
	textNode = nodeAndText[0];
	matchedtext = nodeAndText[1];
	matchedmatchedtext = nodeAndText[2];
	textNode.parentNode.innerHTML = textNode.parentNode.innerHTML.replace(matchedtext, "<mark>" + matchedmatchedtext + "</mark>");
}

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
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;
	}
}

function handleText(textNode) 
{
	matches = [];
	var v = textNode.nodeValue;
	var re = /capo(?: on| at|:)?(?: the)?\s(\d).*?\b(?: fret)?/ig;
	//what words appear between "capo (on)?" and "\d"?  It seems to be only "the".  If another case is found, update with ".*"

	match = re.exec(v);

	while(match != null){
		matches.push(match);
		match = re.exec(v);
	}
	

	if(matches.length != 0){
		getcapo(v, matches, textNode)
	}

	if(capo != 0){ 
		//THIS ASSUMES THAT A PAGE WILL NEVER MENTION CAPO _AFTER_ THE CHORDS.
		//IF THIS TURNS OUT TO BE AN IMPORTANT ENOUGH INCORRECT ASSUMPTION,
		//THEN DO A SECOND WALK THROUGH THE TEXT NODES AFTER CAPO IS FOUND,
		//INSTEAD OF IN THE SAME WALK AS FINDING CAPO.
		transpose(v, matches, textNode);
	}


	//document.getElementById('a.u_b').click();
	//using the array matches (which stores all the possible capos in the text), we can give the user
	//an option to select which capo they would like.  

	
}


function transpose(v, matches, textNode){
	chords = ["c", "c#", "d", "eb", "e", "f", "f#", "g", "ab", "a", "bb", "b"]
	function transposechord(match, letter, offset, string){
		uppercase = (letter == letter.toUpperCase());
		letter = letter.replace('♭', 'b').toLowerCase();
		//console.log(letter);
		//console.log(chords.indexOf(letter)+ capo);
		if(uppercase){
			newletter = chords[(chords.indexOf(letter) + capo) % 12];
			newletter = newletter[0].toUpperCase() + newletter.slice(1) + match.slice(letter.length);
			return newletter;
		} else{
			return chords[(chords.indexOf(letter) + capo) % 12] + match.slice(letter.length);
		}

	}
	//chordmatches = [];
	var chordre = /\b([abcdefg][#b♭]?)\s?(?:m|aug|dom|\d|sus|add|\b)/ig;
	//chord = chordre.exec(v);
	//console.log(chord);
	v = v.replace(chordre, transposechord)
	//console.log(v);
	textNode.nodeValue = v;
}

function getcapo(v, matches, textNode){
	capo = parseInt(matches[matches.length - 1][1]);
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
	


	//textNode.parentNode.innerHTML = textNode.parentNode.innerHTML.replace(matchedtext, "<mark>" + matches[matches.length - 1][0] + "</mark>");
	nodesWithCapo.push([textNode, matchedtext, matches[matches.length - 1][0]]);



	//GENERAL CODE STARTS HERE - AKA NOT ULTIMATE-GUITAR

	//use regex to match all instances of case-insensitive /b[ABCDEFG][#b♭]? (double-flats and sharps? not a concern for now)
	//possible situations: EbMaj7, Eb Maj add 9, Eb5.  Any situations in which something prepends the note without word boundary?

	//notes are: C, C#, D, Eb, E, F, F#, G, Ab, A, Bb, B.  preserve case (minor/major)
	//decide between C# and Db, and F# and Gb?  If F, Eb, Ab, or Bb are present, then call it Db. If E, A, B are present, call it C#.  Otherwise...
	// Db I guess.
	//notes[(notes.index(orignote) + caponum) mod 12]
	//
	

	//while(chord != null){
	//	chordmatches.push(chord);
		//do stuff with chord
	//	v.replace(chordre, transposechord)
		//
		//chord = re.exec(v);
	//}

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