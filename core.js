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

// lip stuff, right now just implementing only single depth
let LIP_START = null;
let LIP_ICON = true;


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

	// XXX only covering two indices deep
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


let writeDest = (source, dest) => {
	let basic_items = dest.split('.');

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

	if (items.length == 1) {
		GS[items[0]] = source;
	} else if (items.length == 2) {
		if (GS[items[0]] == undefined) {
			GS[items[0]] = {};
		}
		GS[items[0]][items[1]] = source;
	} else if (items.length == 3) {
		if (GS[items[0]] == undefined) {
			GS[items[0]] = {};
		}
		if (GS[items[0]][items[1]] == undefined) {
			GS[items[0]][items[1]] = {};
		}
		GS[items[0]][items[1]][items[2]] = source;
	} else {
		// XXX
		throw 'Invalid, dest chain too deep'
	}
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





let coreLoop = (sauceLines) => {
	while (true) {
		if (SIP >= sauceLines.length || SIP < 0) {
			throw "Error SIP out of bounds. Is there a missing `stop` or `back`?";
			break;

		}
		let out = performDataFunction(sauceLines[SIP]);
		if (out == "break") {
			break;
		}
	}
}

// lang-lang injection from browser console
let ll = (injected_src) => {
	let injected_lines = injected_src.split('\n');
	injected_lines.push("stop"); // automatically stop at end
	SIP = 0;
	coreLoop(injected_lines);
}


let eventHandler = (event) => {

    let tag = ROUTER_MAP[event];
    if (!tag) {
    	throw 'Event ' + event + ' has no handling route!';
    	return;
    }

    let lineNum = ROUTER_TAG_MAP[tag];
    if (!lineNum) {
    	throw 'Tag ' + tag + ' is not defined at any line.';
    }


    SIP = lineNum;
    coreLoop(sauceLines);


}


// a funny name about a big function that does a lot
// the big loop with the big switch
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
	// We now use this mechanic 
	if (!ICON || !LIP_ICON) {
		if (OP == "fi") {
			ICON = true;
		} else if (OP == "pil") {
			LIP_ICON = true;
		}
		SIP++;
		return;
	}

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

		case "if": {
			// first support case where the argument is just a boolean
			if (getNthWord(line, 2) == undefined) {
				let arg = getMeaning(getNthWord(line, 1));
				checkBool(arg, OP);
				ICON = arg;
				break;
			}

			// otherwise we're handling special if syntax
			let arg1 = getNthWord(line, 1);
			let bob = getNthWord(line, 2); // bin op bool
			let arg2 = getNthWord(line, 3);


			let arg1m = getMeaning(arg1);
			let arg2m = getMeaning(arg2);

			if (bob == "==") {
				ICON = (arg1m == arg2m);
			} else if (bob == "!=") {
				ICON = (arg1m != arg2m);
			} else if (bob == "<") {
				ICON = (arg1m < arg2m);
			} else if (bob == ">") {
				ICON = (arg1m > arg2m);
			} else if (bob == "&&") {
				ICON = (arg1 && arg2);
			} else if (bob == "||") {
				ICON = (arg1 || arg2);
			}
			} else {
				throw "Unrecognized if operator: " + bob;
			}

			break;
		}

		case "fi": {
			ICON = true;
			break;
		}

		// cute name for our conditional loop
		// XXX hacked to only handle single depth case at the moment
		case "lip": {
			LIP_START = SIP;

			let arg = getMeaning(getNthWord(line, 1));
			checkBool(arg, OP);
			if (!arg) {
				LIP_ICON = false;
			}

			break
		}

		case "pil": {
			// like with "pool", one of two cases
			if (LIP_ICON) {
				SIP = LIP_START;
				SKIP_SIP_INC = true;
			} else {
				// who cares if we leave LIP_START state
				LIP_ICON = true;
				// and we just keep going
			}

			break
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
				loop_idxes.pop();
				loop_fail_spots.pop();
				LD--;
			} else {
				let whereToLoopBackTo = loop_start_incs[LD];
				loop_idxes[LD]++;
				SIP = whereToLoopBackTo

				SKIP_SIP_INC = true;
			}

			break;
		}

		// can we maybe hack with not using break and just falling down?

		case "cp": {
			let source = getMeaning(getNthWord(line, 1));
			if (source == undefined) {
				throw "cp: " + getNthWord(line, 1) + " results in no source meaning";
			}
			let dest = getNthWord(line, 2);
			writeDest(source, dest);

			break;
		}

		case "mov": {

			let source = getMeaning(getNthWord(line, 1));
			let raw_source = getNthWord(line, 1);

			let fail_string = "Use cp on literals, mov is equivalent exchange: ";
			// if it is in int format, job is easy
			let n = parseInt(raw_source);
			if (!isNaN(n)) {
				throw fail_string + raw_source;
			}

			// also easy for basic booleans
			if (raw_source == "true") {
				throw fail_string + raw_source;
			}
			if (raw_source == "false") {
				return fail_string + raw_source;
			}



			if (source == undefined) {
				throw "mov: " + getNthWord(line, 1) + " results in no source meaning";
			}


			let dest = getNthWord(line, 2);
			writeDest(source, dest);


			// Next, move semantics. Kill the source item. Only one pointer standing!



			// Handle special /.../ expansions


			let raw_source_split = raw_source.split('.');

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

			// XXX move semantics only deleting 3 deep from source

			if (source_items.length == 1) {
				delete GS[source_items[0]];
			} else if (source_items.length == 2) {
				delete GS[source_items[0]][source_items[1]];
			} else {
				delete GS[source_items[0]][source_items[1]][source_items[2]];
			}

			break;


		}

		case "inc": {
			let arg1 = getNthWord(line, 1);
			let meaning = getMeaning(arg1);
			checkInt(meaning, OP);

			writeDest(meaning + 1, arg1);
			break;
		}

		case "==": {
			let arg1 = getMeaning(getNthWord(line, 1));
			let arg2 = getMeaning(getNthWord(line, 2));
			let dest_name = getNthWord(line, 3);
			writeDest(arg1 == arg2, dest_name);
		}

		case "&&": {
			let arg1 = getMeaning(getNthWord(line, 1));
			let arg2 = getMeaning(getNthWord(line, 2));
			checkBool(arg1, OP) && checkBool(arg2, OP);

			let dest_name = getNthWord(line, 3);
			writeDest(arg1 && arg2, dest_name);	
			
			break;		
		}

		case "||": {
			let arg1 = getMeaning(getNthWord(line, 1));
			let arg2 = getMeaning(getNthWord(line, 2));
			checkBool(arg1, OP) && checkBool(arg2, OP);

			let dest_name = getNthWord(line, 3);
			writeDest(arg1 || arg2, dest_name);	
			
			break;		
		}

		case "add": {

			let arg1 = getMeaning(getNthWord(line, 1));
			let arg2 = getMeaning(getNthWord(line, 2));
			checkInt(arg1, OP) && checkInt(arg2, OP);

			let dest_name = getNthWord(line, 3);
			writeDest(arg1 + arg2, dest_name);

			break;

		}

		case "sub": {

			let arg1 = getMeaning(getNthWord(line, 1));
			let arg2 = getMeaning(getNthWord(line, 2));
			checkInt(arg1, OP) && checkInt(arg2, OP);

			let dest_name = getNthWord(line, 3);

			// subtract arg1 FROM arg2 semantics!
			writeDest(arg2 - arg1, dest_name)

			break;

		}

		case "rngi": {

			let arg1 = getMeaning(getNthWord(line, 1));
			let dest_name = getNthWord(line, 2);
			// + 1 for index by 1
			writeDest(Math.floor(Math.random()*arg1) + 1, dest_name);


			break;
		}

		case "sleep": {
			SIP++;
			setTimeout(function() {
				coreLoop(sauceLines);
			}, PAUSE_TIME);
			return "break";
		}

		// XXX wrong stop, must fix
		case "stop": {
			// do NOT SIP++, and return, so it's just this
			// instruction over and over
			setTimeout(function() {
				coreLoop(sauceLines);
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
			console.log(getMeaning(getNthWord(line, 1)));
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
			throw "Unsupported op: " + line;
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






coreLoop(sauceLines);
