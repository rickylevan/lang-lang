// LET'S DEFINE THE BASIC SYNTAX HIGHLIGHTING
// the problem should decompose for lang-lang into something line-by-line
// Yes, the string is a list of characters, we want instead a list of colored
// characters, redundancy of repeating red, red, red---who cares?!

// in JS, say mystr[4] is a length-one string, that's fine for us. So we are
// going to be returning a list of <length-one string, color enum> pairs.

// Let's consider creating color objects mapped to strings. A multicolored
// string, to deal with later, ... orr, you know maybe later we won't have any
// contiguous (nowhitespace) string that would vary in syntax highlighting.
// So let's forget that for now. 
let color_liner = (line) => {

	// output is the list of simple character color pairs
	let output = [];

	let og_length = line.length;
	let trimLine = line.trimLeft();

	let whiteSpaceDiff = og_length - trimLine.length;


	// write out preceding whitespace at the beginning
	for (var i = 0; i < whiteSpaceDiff; i++) {
		output.push({s: " ", c: Colors.WHITE});
	}





	let words = trimLine.split(' ');

	// we'll build on this then deconstruct it in the output
	let bubbles = [];



	op = words[0];



	switch (op) {
		// loop is always 3 words, loop start span
		case "loop": {
			bubbles.push({s: "loop", c: Colors.SILVER});
			let start = words[1];
			let span = words[2];

			if (!isNaN(parseInt(start))) {
				// we parsed an int, so a constant
				bubbles.push({s: start, c: Colors.WHITE});
			} else {
				// otherwise we have a variable
				bubbles.push({s: start, c: Colors.RED});
			}

			if (!isNaN(parseInt(span))) {
				// we parsed an int, so a constant
				bubbles.push({s: span, c: Colors.WHITE});
			} else {
				// otherwise we have a variable
				bubbles.push({s: span, c: Colors.RED});
			}

			break;

		}

		// hardwiring syntax for <if arg1 comp arg2>
		case "if": {
			bubbles.push({s: "if", c: Colors.BLUE});
			let arg1 = words[1];
			let comp = words[2];
			let arg2 = words[3];

			if (!isNaN(parseInt(arg1))) {
				// we parsed an int, so a constant
				bubbles.push({s: arg1, c: Colors.WHITE});
			} else {
				// otherwise we have a variable
				bubbles.push({s: arg1, c: Colors.RED});
			}

			bubbles.push({s: comp, c: Colors.GOLD});

			if (!isNaN(parseInt(arg2))) {
				// we parsed an int, so a constant
				bubbles.push({s: arg2, c: Colors.WHITE});
			} else {
				// otherwise we have a variable
				bubbles.push({s: arg2, c: Colors.RED});
			}


			break;

		}

		case "pool": {
			bubbles.push({s: "pool", c: Colors.SILVER});
			break;
		}

		case "fi": {
			bubbles.push({s: "fi", c: Colors.BLUE});
			break;
		}


		default: {
			// all the other operations
			bubbles.push({s: op, c: Colors.GOLD});
			words.shift();
			for (let i = 0; i < words.length; i++) {
				bubbles.push({s: words[i], c: Colors.WHITE});
			}
		}
	}


	for (let i = 0; i < bubbles.length; i++) {
		for (let j = 0; j < bubbles[i].s.length; j++) {
			output.push({s: bubbles[i].s[j], c: bubbles[i].c});
		}
		// now we have a space, a WHITE space
		output.push({s: " ", c: Colors.WHITE})
	}

	// last space was unnecessary
	output.pop();

	return output;


}


// HERE is some stuff that might be useful when you go back to
// syntax highlighting again:



// Now let's try writing colored letters to the screen
//let test = document.getElementById("15:5");
//test.style = "height:20px;width:20px;color:rgb(255,255,255);background-color:rgb(150,50,50);text-align:center;vertical-align:middle;line-height:20px;";


//writeEditorColorChar(4, 20, 'A', Colors.RED);


// now let's try writing out the whole first line
//let firstLoop = sauceLines[3];
//let colorChars = color_liner(firstLoop);


//writeEditorColorChar(1, 1, colorChars[0].s, colorChars[0].c);

//writeEditorColorChar(4, 4, 'O', Colors.SILVER);


// THIS CODE MATTERS, but let's remove the sauce for now, taking up space 
// as distraction
/*for (let i = 0; i < sauceLines.length; i++) {
	let colorChars = color_liner(sauceLines[i]);
	for (let j = 0; j < colorChars.length; j++) {
		writeEditorColorChar(j+1, i+1, colorChars[j].s, colorChars[j].c);
	}
}*/




// a copy now to get a grid for writing text in, just getting the rendering up
// cursorBox = [0,0]; // I know, keeping it simple atm
/*for (let i = 0; i < 30; i++) {
	let mycol = document.createElement("div");
	mycol.style = "display:flex;";
	for (let j = 0; j < 30; j++) {
		let mydiv = document.createElement("div");
		// right then down the graphical convention
		mydiv.id = j.toString() + ":" + i.toString();
		mydiv.style="height:20px;width:15px;background-color:rgb(20,20,20);text-align:center;vertical-align:middle;line-height:20px;"
		//mydiv.innerHTML = "X";	
		mycol.append(mydiv);
	}
	document.getElementById('top').append(mycol);
}*/


let writeEditorColorChar = (x, y, char, color) => {

	// it is GOOD to just copy, paste this right now!!!

	// XXX for now let's just be graceful if out of range
	if (x < 1 || x > 30) {
		return;
	}
	if (y < 1 || y > 30) {
		return;
	}

	// adjust for index convention
	x--;
	y--;

	// 30 magic
	// XXX kill reverse skydiving y = 30 - y - 1;

	let mydiv = document.getElementById(x.toString() + ":" + y.toString());



	let cstring = "";
	switch (color) {
		case Colors.WHITE: {
			cstring = "rgb(255,255,255)";
			break;
		}
		case Colors.RED: {
			cstring = "rgb(180, 0, 0)";
			break;
		}

		case Colors.SILVER: {
			cstring = "rgb(200,200,200)";
			break;
		}

		case Colors.BLUE: {
			cstring = "rgb(65, 105, 225)";
			break;
		}

		case Colors.GOLD: {
			cstring = "rgb(218,165,32)";
			break;
		}

		default: {
			cstring = "rgb(255,255,255)";
		}

	}



	mydiv.style = `height:20px;width:15px;color:${cstring};background-color:rgb(20,20,20);text-align:center;vertical-align:middle;line-height:20px;font-family:Arial;`;
	mydiv.innerHTML = char;


}











