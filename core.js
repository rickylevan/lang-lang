'use strict';

console.log('~~~core.js script says hiiiii~~~');

// sauce defined in sauce.js
let sauceLines = sauce.split('\n');


// let's add in router tags. This will mean a pre-sweep over the sauce for
// these tags, which is a break--having that pre-sweep. But without it, 
// we'd have to run the handler code *before* the route is even set up, which
// isn't what we want.

// this maps tag strings to line numbers
let ROUTER_TAG_MAP = {};


// this maps unique event id strings to tag strings
let ROUTER_MAP = {};


// this general approach might not work later if we want to interpolate 
// "function calls" in between, then the numbering will get messed up. But
// this is something simple to explore to get routing off the ground
let buildRTM = () => {
	for (let i = 0; i < sauceLines.length; i++) {
		let line = sauceLines[i];
	

		let words = line.split(' ');
		let colonIdx = words.indexOf('::');

		//console.log('line is:', line);
		//console.log('colon idx is:', colonIdx);

		// if '::' not found, there's no router tag to add
		if (colonIdx < 0) {
			continue;
		}

		// kinda hacky we're just going to assume now playing nice, :: at end

		// saving line number of where we find a given router tag. 
		// (calling them router tags for now cuz rn only router will be using them)
		ROUTER_TAG_MAP[words[colonIdx+1]] = i;
	}	

}

buildRTM();



// SOURCE INSTRUCTION POINTER, i.e. which line are we on rn?
let SIP = 0;

let SKIP_SIP_INC = false;

let RETURN_SIP_STACK = [];


let GS = {};



// And now it begins...

let LD = -1; // LOOP-DEPTH. in first loop becomes 0 to point to *first* entry
let loop_idxes = [];
let loop_fail_spots = []; // run lengths
let loop_start_incs = []; // +1 of the loop starts, where to loop back to

// whether or not the if check is on, i.e. are we applying it?
let ICON = true;


let getMeaning = (blah) => {

	// if it is in int format, job is easy
	let n = parseInt(blah);
	if (!isNaN(n)) {
		return n;
	}

	// also easy for basic booleans
	if (blah == "true") {
		return true;
	}
	if (blah == "false") {
		return false;
	}

	// loop indices also have special meaning
	if (blah == "%1") {
		return loop_idxes[LD];
	}
	if (blah == "%2") {
		return loop_idxes[LD-1];
	}



	let items = blah.split('.');
	let x = {};
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		// we also declare in this case at end of tree search
		if (item == "*len*") {
			return cheesyLength(x);
		}

		// tricky here, let's see if this works... interpret out the /.../
		// XXX doubt this would work in general case
		if (item[0] == '/' && item[item.length-1] == '/') {
			item = getMeaning(item.slice(1, item.length-1));
		}

		if (i == 0) {
			x = GS[item];
		} else {
			x = x[item];
		}
	}

	return x;


}



// indexed from 0
let getNthWord = (line, n) => {
	line = line.trimLeft();
	let words = line.split(' ');
	return words[n];
}

let getFirstWord = (line) => {
	return getNthWord(line, 0);
}





let coreLoop = () => {
	while (true) {
		if (SIP >= sauceLines.length || SIP < 0) {
			throw "Error SIP out of bounds. Is there a missing `stop` or `back`?";
			break;

		}
		//console.log('LINE:', sauceLines[SIP]);
		let out = performDataFunction(sauceLines[SIP]);
		//console.log('STATE NOW:', JSON.stringify(GS));
		if (out == "break") {
			break;
		}
	}
}


let eventHandler = (event) => {

    // should be garbage now: let event = e.key;
    let tag = ROUTER_MAP[event];
    if (!tag) {
    	console.log('Event ', event, ' has no handling route!');
    	return;
    }

    let lineNum = ROUTER_TAG_MAP[tag];
    if (!lineNum) {
    	console.log('Tag ', tag, ' is not defined at any line.');
    }


    SIP = lineNum;
    coreLoop();


}


// a funny name about a big function that does a lot
let performDataFunction = (line) => {

	// handle whitespace flab && comment lines
	if (line.length == 0) {
		SIP++;
		return;

	}
	if (line[0] == '/' && line[1] == '/') {
		SIP++;
		return;
	}



	let OP = getFirstWord(line)


	// with no icon, we skip over code, unless we find a FI which
	// tells us to switch back
	if (!ICON) {
		if (OP == "fi") {
			ICON = true;
		}
		SIP++;
		return;
	}

	let moveSemanticsOn = false;

	switch(OP) {

		case "call": {
			SKIP_SIP_INC = true;
			RETURN_SIP_STACK.push(SIP+1); // we return to inc of call site
			let fn_name = getNthWord(line, 1);
			let line_num = ROUTER_TAG_MAP[fn_name];
			if (!line_num) {
				throw "call to " + fn_name + " failed, undefined."
			} else {
				SIP = line_num;
			}

			break;
		}

		case "back": {
			SKIP_SIP_INC = true;
			let ret = RETURN_SIP_STACK.pop();
			SIP = ret;
			break;

		}

		case "fi": {
			ICON = true;
			break;
		}

		case "loop": {
			let start = getMeaning(getNthWord(line, 1));
			let nruns = getMeaning(getNthWord(line, 2));

			LD++;
			loop_idxes[LD] = start;
			// so if we loop start 2 for 5 runs, we go thru
			// 2,3,4,5,6 and then 7 is the spot of failure
			loop_fail_spots[LD] = start + nruns;

			loop_start_incs[LD] = SIP + 1;

			break;
		}


		case "if": {
			// simple assumptions now for the win
			let arg1 = getNthWord(line, 1);
			let bob = getNthWord(line, 2); // bin op bool
			let arg2 = getNthWord(line, 3);


			let arg1int = getMeaning(arg1);
			let arg2int = getMeaning(arg2);

			if (bob == "==") {
				ICON = (arg1int == arg2int);
			} else if (bob == "!=") {
				ICON = (arg1int != arg2int);
			} else if (bob == "<") {
				ICON = (arg1int < arg2int);
			} else if (bob == ">") {
				ICON = (arg1int > arg2int);
			}

			break;
		}

		case "pool": {
			// one of TWO things can happen here:
			// 1) we continue and pop loop context
			// or
			// 2) we teleport to inc of loop start and inc counter

			let curIdx = loop_idxes[LD];
			let failSpot = loop_fail_spots[LD];

			// if we are now to move forward, loop time over
			if (curIdx >= failSpot-1) { // the -1 kind of a hack, loop counting
				// XXX above hack might cause failure in trivial loop cases
				//console.log("NOW:", curIdx, failSpot);
				loop_idxes.pop();
				loop_fail_spots.pop();
				LD--;
			} else {
				let whereToLoopBackTo = loop_start_incs[LD];
				loop_idxes[LD]++;
				SIP = whereToLoopBackTo

				// yes, why ++ the loop start when we are already
				// doing a SIP++ anyway? I judge it's too slick and
				// pointlessly confusing.

				SKIP_SIP_INC = true;
			}

			break;
		}

		// can we maybe hack with not using break and just falling down?

		case "mov": {
			moveSemanticsOn = true;

			// hehehe no break, woooo
		}

		// XXX Hacks still cheating
		case "cp": {

			let raw_source = getNthWord(line, 1);
			let source = getMeaning(getNthWord(line, 1));

			let raw_source_split = raw_source.split('.');

			// kill source on global scope, to give us move semantics
			// the source is frozen now, we already know it. Here's a
			// closure to call in when we're ready.
			let killSourceOnGS = () => {

				if (!moveSemanticsOn) {
					return;
				}

				let source_items = [];
				for (var i = 0; i < raw_source_split.length; i++) {
					let rsi = raw_source_split[i];
					if (rsi[0] == '/' && rsi[rsi.length-1] == '/') {
						let unslash = rsi.slice(1, rsi.length-1);
						source_items.push(getMeaning(unslash));
					} else {
						source_items.push(rsi);
					}
				}

				// let's hack this out case by case before loop

				if (source_items.length == 1) {
					delete GS[source_items[0]];
				} else if (source_items.length == 2) {
					delete GS[source_items[0]][source_items[1]];
				} else {
					delete GS[source_items[0]][source_items[1]][source_items[2]];
				}


			}


			let dest = getNthWord(line, 2);

			// hmm, what if I just directly expand out items now
			let basic_items = dest.split('.');

			//console.log('basic items:', basic_items);

			let items = [];

			for (let i = 0; i < basic_items.length; i++) {
				let bi = basic_items[i];
				if (bi[0] == '/' && bi[bi.length-1] == '/') {
					let unslash = bi.slice(1, bi.length-1);
					items.push(getMeaning(unslash));
				} else {
					// for a non /.../, only get int meaning if
					// there is just one dest item
					if (basic_items.length == 1) {
						items.push(bi);
					} else {
						items.push(bi);
					}
				}
			}

			//console.log('dest items:', items);



			if (items.length == 1) {
				GS[items[0]] = source;
				killSourceOnGS();
				break;
			}


			// XXX just rapid hacking, haven't verified if this is right
			if (items.length == 2) {
				if (GS[items[0]] == undefined) {
					GS[items[0]] = {};
				}
				GS[items[0]][items[1]] = source;
				killSourceOnGS();
				break;
			}

			if (items.length == 3) {
				if (GS[items[0]] == undefined) {
					GS[items[0]] = {};
				}
				if (GS[items[0]][items[1]] == undefined) {
					GS[items[0]][items[1]] = {};
				}
				GS[items[0]][items[1]][items[2]] = source;
				killSourceOnGS();
				break;
			}

			break;


		}

		case "add": {

			// hey this nth word as 1 works well cuz the op is 0, score
			let arg1 = getMeaning(getNthWord(line, 1));
			let arg2 = getMeaning(getNthWord(line, 2));
			let dest_name = getNthWord(line, 3);

			GS[dest_name] = arg1 + arg2;

			break;

		}

		case "sub": {

			let arg1 = getMeaning(getNthWord(line, 1));
			let arg2 = getMeaning(getNthWord(line, 2));
			let dest_name = getNthWord(line, 3);

			// subtract arg1 FROM arg2 semantics!
			let dest = arg2 - arg1;
			GS[dest_name] = dest;

			break;

		}

		case "rngi": {

			let arg1 = getMeaning(getNthWord(line, 1));
			let dest_name = getNthWord(line, 2);
			// + 1 for index by 1
			GS[dest_name] = Math.floor(Math.random()*arg1) + 1;


			break;
		}

		case "sleep": {
			SIP++;
			setTimeout(function() {
				coreLoop();
			}, PAUSE_TIME);
			return "break";
		}

		// XXX horrible shitty stop, must fix
		case "stop": {
			// do NOT SIP++, and return, so it's just this
			// instruction over and over
			setTimeout(function() {
				coreLoop();
			}, 1000000); // lol
			return "break";
		}

		case "black": {
			for (let i = 0; i < 30; i++) {
				for (let j = 0; j < 30; j++) {
					graphicalWrite(i+1, j+1, 0); // write black
				}
			}

			break;
		}

		case "route": {
			let event = getNthWord(line, 1);
			let handlerTag = getNthWord(line, 2);

			ROUTER_MAP[event] = handlerTag;

			// this special route establishes things happening in time
			if (event == "~blink~") {
				setInterval(() => {
					eventHandler("~blink~");
				}, PAUSE_TIME); // hardwired 1/5 sec now
			}


			break;
		}

		case "log": {

			console.log(getNthWord(line, 1));

			break;
		}

		case "draw": {

			let shade = getMeaning(getNthWord(line, 1));
			let x = getMeaning(getNthWord(line, 2));
			let y = getMeaning(getNthWord(line, 3));

			graphicalWrite(x, y, shade);


			break;
		}




		default: {
			console.log("Unsupported op:", line);
		}


	}			

	if (!SKIP_SIP_INC) {
		SIP++;
	}
	SKIP_SIP_INC = false;

}
		





document.addEventListener('keydown', (e) => {
	eventHandler(e.key)
});






coreLoop();
