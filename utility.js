// returns the largest positive integer key or else 0.
// so cheeseyLength({"20": 5}) counts holes, has length 20.

// ~it would be a good idea to refactor and have tests, to use the
// npm thing too where saving this file auto reloads page~
let cheesyLength = (obj) => {
	let entries = Object.entries(obj);
	let max = 0;
	for (let i = 0; i < entries.length; i++) {
		let keystr = entries[i][0];
		// if negative int, won't overwrite max anyway
		let maybeInt = parseInt(keystr);
		if (maybeInt && (maybeInt > max)) {
			max = maybeInt;
		}
	}
	return max;
}
