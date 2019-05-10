// Currently just using divs, want to switch to webgl later
// This is based on a copy-paste of my JS table from earlier snake game:

document.body.style.cursor = 'default';
let cursorBox = [0,0]; // I know, keeping it simple atm
for (let i = 0; i < 30; i++) {
	let mycol = document.createElement("div");
	mycol.style = "display:flex;";
	for (let j = 0; j < 30; j++) {
		let mydiv = document.createElement("div");
		// right then down the graphical convention
		mydiv.id = j.toString() + "," + i.toString();
		mydiv.style="height:20px;width:20px;background-color:rgb(0,0,0);"	
		mycol.append(mydiv);
	}
	document.getElementById('top').append(mycol);
}



// x and y are logically indexed by 1, starting from bottom left,
// first x across then y up. easy. This means tho some translations
// to an index-by-zero system that is right then down

let graphicalWrite = (x, y, color)  => {

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
	y = 30 - y - 1;

	var red
	var green
	var blue

	if ((typeof color) == "number") {
		red = color;
		green = color;
		blue = color;
	} else {
		if (color.r) {
			red = color.r;
		} else {
			red = 0;
		}
		if (color.b) {
			blue = color.b;
		} else {
			blue = 0;
		}
		if (color.g) {
			green = color.g;
		} else {
			green = 0;
		}
	}

	let color_string = "rgb(" + red + "," + green + "," + blue + ")";


	let mydiv = document.getElementById(x.toString() + "," + y.toString());
	// yes inelegant here we have to write out redundant style. Whatever
	// this will be in webgl later anyway
	mydiv.style="height:20px;width:20px;background-color:" + color_string + ";";
}














