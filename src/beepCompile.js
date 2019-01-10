/*!doc

#function beepCompile(string)

Converts a string of notes to an array of frequencies.
If you pass another argument than a string it will be returned unchanged.

## Arguments

### string
A string with multiple parts of notes, duration and variables. See beep() for note syntax.

## Usage

See beep() for note syntax. If you plan to play a note sequence periodicaly and performance matters to you,
you can precompile your note string when your app loads and pass it to beep when you want to play it.

	// onLoad
	var niceJingle = beepCompile('C D C E');

	// onClick
	beep(niceJingle);

*/
function beepCompile(s) {

	// Return value unchanged if it is not a string
	// This is useful if the string is already processed and passed to this function a second time
	if (typeof s != "string")
		return s;

	// Remove comments starting with "#"
	s = s.replace(/[ ]#[ ].*/g, '');

	// Remove extra whitespaces
	s = s.replace(/\s+/g, ' ');
	s = s.trim();

	// Lowercase
	s = s.toLowerCase();

	// Note variables
	var noteList = [];
	var duration = 1;
	var gap = 0;

	// Process all note strings
	s = s.split(' ');
	for (var i=0; i<s.length; i++) {
		var cur = s[i];

		// Note declaration
		if (cur.match(/^[cdefgabh-][#b]?[0-9]?$/)) {

			// Sound pause
			if (cur == '-') {
				noteList.push([0, duration]);
				continue;
			}

			// Add octave if missing
			if (!cur.match(/[0-9]/))
				cur += '4';

			// Add current note with sound gap
			if (gap && gap < duration) {
				noteList.push([cur, duration-gap]);
				noteList.push([0, gap]);
			}

			// Add note without sound gap
			else {
				noteList.push([cur, duration]);
			}
		}

		// Time declaration
		else if (cur.match(/^[0-9]+(\.[0-9]+)?(\/[0-9]+(\.[0-9]+)?)?$/)) {

			// Allow fractions written as "1/4"
			cur = cur.split('/');
			if (cur.length == 1)
				duration = cur[0] * 1; // Do not remove *1
			else
				duration = cur[0] / cur[1];

		}

		// Variable declaration
		else if (cur.match(/^(gap|vol|bpm)=[0-9]+(\.[0-9]+)?(\/[0-9]+(\.[0-9]+)?)?$/)) {

			// Read variable name
			cur = cur.split('=')
			var name = cur[0]
			var value = 0;

			// Allow value written as fractions "1/4"
			cur = cur[1].split('/');
			if (cur.length == 1)
				value = cur[0] * 1; // Do not remove *1
			else
				value = cur[0] / cur[1];

			// Set corresponding variable
			if (name == 'gap') {
				gap = value;
			}
			else if (name == 'vol' || name == 'bpm') {
				noteList.push([name, value]);
			}
		}
	}

	// Replace note name with frequency
	for (var i=0; i<noteList.length; i++) {
		var cur = noteList[i];
		if (beepNote[cur[0]])
			cur[0] = beepNote[cur[0]];
		else if (cur[0] == '-')
			cur[0] = 0;
		//else
		//	cur[0] = 0;
	}

	console.log(noteList);
	// Return notes as array
	return noteList;
}