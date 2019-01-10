/*doc*
# rawbeep.js

Do you remember the good old times, when you just wrote **BEEP** in your program code and it made the tower speaker beep?
It was simple, on point and super awesome! And I wonder why things got so damn complicated.
There is not much I can do about it, but there is one thing: I can bring the beep back!

	beep();

Nice! As we all know there is no way we could possibly ever be happy with what we have.
We want more. We want... **SOUND**! A frequency in Hertz and a duration in seconds.

	sound(261.626, 0.5);

Here we go, the middle C is playing for a half second. Volume control would be neat. And human readable notes.
I know that I just wanted to make a single JavaScript function that beeps. Not a huge project or something...

	beep(`
		vol=0.5   # Volume 50%
		bpm=130   # 130 beats per minute
		gap=1/40  # Sound gap between played notes

		1/4 E4    # Jin
		1/4 E4    # -gle
		1/2 E4    # bells

		1/4 E4    # Jin
		1/4 E4    # -gle
		1/2 E4    # bells

		1/4 E4    # Jin
		1/4 G4    # -gle
		3/8 C4    # all
		1/8 D4    # the

		1/1 E4    # way

		# "#" (standalone) is a comment
		# 1/4 is a quarter note
		# E4 is the note E from the 4th octave
	`);

Why am I like this?

## Contents
{fastdoc-toc-2}

*//*doc*
## function beepInit()

Call beepInit() to initializes rawbeep.
You **need** to initialize rawbeep through a **touch or click** event on mobile platforms to make sound work.
Calling beepInit() is optional on desktop devices because rawbeep initializes when you call beep() for the first time.
*/

function beepInit() {
	if (!beep.audioCtx) {
		beep.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		beep([[4186.01, 0.005]], 0.01);
	}
}

/*doc*
## function beep([notes, [volume]])

The main function and a tribute to the BEEP statement from former times. Just call "beep()" and it makes a beep sound.

### Arguments

#### notes
Optional. A string with multiple parts of notes, duration and variables. Parts are separated using at least one space.
Notes are written as:

	C D E F G A B/H

The octave number can be added right behind the note:

	C4

Duration can be written as fraction, e.g. a quarter tone:

	1/4

To pause the sound for the given duration you can use a dash:

	-

Inline comments can be made with a standalone # sign. There must be a space before and after the #.

	#

Variables are written with an equals sign (=) without any spaces. Fractions as values are allowed.

	vol=0.5
	bpm=120
	gap=1/40

**vol** is the volume, default is 0.5  
**bpm** is beats per minute based on quarter notes (1/4), default is 240 which makes a full note one second long  
**gap** is the sound gap between two notes, default is 0

#### volume
Optional. A value between 0 and 4, default is 0.5 (50%). Sets the initial value for the volume.
It can be changed using the vol variable on playtime.  
**Warning:** 4 (400%) can be really loud, especially when using headphones

#### type
Optional. Defines the form of the sound oscillator. Possible values for type are:

	sine, square, sawtooth, triangle

### Usage

Just beep

	beep();

Beep the middle C

	beep('C');

The middle C, but not so loud

	beep('C', 0.1);

Some notes

	beep('C D C E');

Sound gaps

	beep('gap=1/40 C C C C');

Octaves

	beep('C2 C3 C4 C5');

Different duration

	beep('1/4 C 1/2 D 1/8 E C');

Jingle bells (first notes)

	beep('vol=0.5 bpm=130 gap=1/40 1/4 E4 E4 1/2 E4 1/4 E4 E4 1/2 E4 1/4 E4 G4 3/8 C4 1/8 D4 1/1 E4');

*/
function beep(notes, volume, type) {
	if (!beep.audioCtx)
		beepInit();
	var audioCtx = beep.audioCtx;

	var bpm = 240;

	notes = beepCompile(notes);
	
	if (!notes)
		notes = [[400, 1]];

	if (!type)
		type = 'square';

	if (!volume)
		volume = 0.5;

	var timeStart = audioCtx.currentTime;
	var timeCurrent = timeStart;

	var gain = audioCtx.createGain();
	gain.connect(audioCtx.destination);
	gain.gain.value = volume/4;

	var oscillator = audioCtx.createOscillator();
	oscillator.type = type;
	oscillator.connect(gain);
	oscillator.start(timeStart);

	for (var i=0; i<notes.length; i++) {
		var key = notes[i][0];
		var value = notes[i][1];

		if (key == 'vol') {
			volume = value;
			continue;
		}
		
		if (key == 'bpm') {
			console.log('X');
			bpm = value;
			continue;
		}
		
		if (key) {
			oscillator.frequency.setValueAtTime(key, timeCurrent);
			gain.gain.setValueAtTime(volume/4, timeCurrent);
		}
		else {
			oscillator.frequency.setValueAtTime(0, timeCurrent);
			gain.gain.setValueAtTime(0, timeCurrent);
		}

		timeCurrent += value * 240/bpm;
	}

	oscillator.stop(timeCurrent);
}

/*doc*
## function sound(frequency, [duration, [volume]])

The sound function is a tribute to the SOUND statement from former times. The arguments are compatible to QBasic.
However, volume did not exist back then in QBasic.

### Arguments

#### frequency
The tone frequency in Hertz.

#### duration
Optional. Tone duration in seconds.

#### volume
Optional. Volume of the tone.
*/

function sound(frequency, duration, volume) {
	if (!duration)
		duration = 1;
	beep([[frequency, duration]], volume);
}
/*!doc

##function beepCompile(string)

Converts a string of notes to an array of frequencies.
If you pass another argument than a string it will be returned unchanged.

### Arguments

#### string
A string with multiple parts of notes, duration and variables. See beep() for note syntax.

### Usage

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
}/*doc*

## object beepNote

The beepNote list holds all note frequencies for the keyboard keys from 1 (A0) to 88 (C8). See Note section for usage.

### Note

Notes are written as lower case letters. B and H are the same.

	c d e f g a b/h

Rawbeep expects notes as a combination of the note letter and a number for the octave. The middle C is written as "c4".

	beepNote['c4'] // Middle C, 261.626 Hz

### Half tone steps

Between the note and the octave there can be a "b" or "#" to indicate a half tone step.

	beepNote['d#4'] // 311.127 Hz
	beepNote['eb4'] // 311.127 Hz

### Keyboard keys

If you prefer the keycode from a keyboard layout, you can use numbers from 1 to 88 instead of the note with a "k" as prefix.

	beepNote['k40'] // Middle C, 261.626 Hz

## Note overview

Piano keys, notes and frequencies

| Key | Note      | Frequency (Hz) |
| --- | --------- | -------        |
| k88 | c8        | 4186.01        |
| k87 | b7        | 3951.07        |
| k86 | a#7 / bb7 | 3729.31        |
| k85 | a7        | 3520           |
| k84 | g#7 / ab7 | 3322.44        |
| k83 | g7        | 3135.96        |
| k82 | f#7 / gb7 | 2959.96        |
| k81 | f7        | 2793.83        |
| k80 | e7        | 2637.02        |
| k79 | d#7 / eb7 | 2489.02        |
| k78 | d7        | 2349.32        |
| k77 | c#7 / db7 | 2217.46        |
| k76 | c7        | 2093           |
| k75 | b6        | 1975.53        |
| k74 | a#6 / bb6 | 1864.66        |
| k73 | a6        | 1760           |
| k72 | g#6 / ab6 | 1661.22        |
| k71 | g6        | 1567.98        |
| k70 | f#6 / gb6 | 1479.98        |
| k69 | f6        | 1396.91        |
| k68 | e6        | 1318.51        |
| k67 | d#6 / eb6 | 1244.51        |
| k66 | d6        | 1174.66        |
| k65 | c#6 / db6 | 1108.73        |
| k64 | c6        | 1046.5         |
| k63 | b5        | 987.767        |
| k62 | a#5 / bb5 | 932.328        |
| k61 | a5        | 880            |
| k60 | g#5 / ab5 | 830.609        |
| k59 | g5        | 783.991        |
| k58 | f#5 / gb5 | 739.989        |
| k57 | f5        | 698.456        |
| k56 | e5        | 659.255        |
| k55 | d#5 / eb5 | 622.254        |
| k54 | d5        | 587.33         |
| k53 | c#5 / db5 | 554.365        |
| k52 | c5        | 523.251        |
| k51 | b4        | 493.883        |
| k50 | a#4 / bb4 | 466.164        |
| k49 | a4        | 440            |
| k48 | g#4 / ab4 | 415.305        |
| k47 | g4        | 391.995        |
| k46 | f#4 / gb4 | 369.994        |
| k45 | f4        | 349.228        |
| k44 | e4        | 329.628        |
| k43 | d#4 / eb4 | 311.127        |
| k42 | d4        | 293.665        |
| k41 | c#4 / db4 | 277.183        |
| k40 | c4        | 261.626        |
| k39 | b3        | 246.942        |
| k38 | a#3 / bb3 | 233.082        |
| k37 | a3        | 220            |
| k36 | g#3 / ab3 | 207.652        |
| k35 | g3        | 195.998        |
| k34 | f#3 / gb3 | 184.997        |
| k33 | f3        | 174.614        |
| k32 | e3        | 164.814        |
| k31 | d#3 / eb3 | 155.563        |
| k30 | d3        | 146.832        |
| k29 | c#3 / db3 | 138.591        |
| k28 | c3        | 130.813        |
| k27 | b2        | 123.471        |
| k26 | a#2 / bb2 | 116.541        |
| k25 | a2        | 110            |
| k24 | g#2 / ab2 | 103.826        |
| k23 | g2        | 97.9989        |
| k22 | f#2 / gb2 | 92.4986        |
| k21 | f2        | 87.3071        |
| k20 | e2        | 82.4069        |
| k19 | d#2 / eb2 | 77.7817        |
| k18 | d2        | 73.4162        |
| k17 | c#2 / db2 | 69.2957        |
| k16 | c2        | 65.4064        |
| k15 | b1        | 61.7354        |
| k14 | a#1 / bb1 | 58.2705        |
| k13 | a1        | 55             |
| k12 | g#1 / ab1 | 51.9131        |
| k11 | g1        | 48.9994        |
| k10 | f#1 / gb1 | 46.2493        |
| k9  | f1        | 43.6535        |
| k8  | e1        | 41.2034        |
| k7  | d#1 / eb1 | 38.8909        |
| k6  | d1        | 36.7081        |
| k5  | c#1 / db1 | 34.6478        |
| k4  | c1        | 32.7032        |
| k3  | b0        | 30.8677        |
| k2  | a#0 / bb0 | 29.1352        |
| k1  | a0        | 27.5           |

*/
var beepNote = {};

// Main note list
beepNote['c8'] = 4186.01;
beepNote['b7'] = 3951.07;
beepNote['a#7'] = 3729.31;
beepNote['a7'] = 3520;
beepNote['g#7'] = 3322.44;
beepNote['g7'] = 3135.96;
beepNote['f#7'] = 2959.96;
beepNote['f7'] = 2793.83;
beepNote['e7'] = 2637.02;
beepNote['d#7'] = 2489.02;
beepNote['d7'] = 2349.32;
beepNote['c#7'] = 2217.46;
beepNote['c7'] = 2093;
beepNote['b6'] = 1975.53;
beepNote['a#6'] = 1864.66;
beepNote['a6'] = 1760;
beepNote['g#6'] = 1661.22;
beepNote['g6'] = 1567.98;
beepNote['f#6'] = 1479.98;
beepNote['f6'] = 1396.91;
beepNote['e6'] = 1318.51;
beepNote['d#6'] = 1244.51;
beepNote['d6'] = 1174.66;
beepNote['c#6'] = 1108.73;
beepNote['c6'] = 1046.5;
beepNote['b5'] = 987.767;
beepNote['a#5'] = 932.328;
beepNote['a5'] = 880;
beepNote['g#5'] = 830.609;
beepNote['g5'] = 783.991;
beepNote['f#5'] = 739.989;
beepNote['f5'] = 698.456;
beepNote['e5'] = 659.255;
beepNote['d#5'] = 622.254;
beepNote['d5'] = 587.33;
beepNote['c#5'] = 554.365;
beepNote['c5'] = 523.251;
beepNote['b4'] = 493.883;
beepNote['a#4'] = 466.164;
beepNote['a4'] = 440;
beepNote['g#4'] = 415.305;
beepNote['g4'] = 391.995;
beepNote['f#4'] = 369.994;
beepNote['f4'] = 349.228;
beepNote['e4'] = 329.628;
beepNote['d#4'] = 311.127;
beepNote['d4'] = 293.665;
beepNote['c#4'] = 277.183;
beepNote['c4'] = 261.626;
beepNote['b3'] = 246.942;
beepNote['a#3'] = 233.082;
beepNote['a3'] = 220;
beepNote['g#3'] = 207.652;
beepNote['g3'] = 195.998;
beepNote['f#3'] = 184.997;
beepNote['f3'] = 174.614;
beepNote['e3'] = 164.814;
beepNote['d#3'] = 155.563;
beepNote['d3'] = 146.832;
beepNote['c#3'] = 138.591;
beepNote['c3'] = 130.813;
beepNote['b2'] = 123.471;
beepNote['a#2'] = 116.541;
beepNote['a2'] = 110;
beepNote['g#2'] = 103.826;
beepNote['g2'] = 97.9989;
beepNote['f#2'] = 92.4986;
beepNote['f2'] = 87.3071;
beepNote['e2'] = 82.4069;
beepNote['d#2'] = 77.7817;
beepNote['d2'] = 73.4162;
beepNote['c#2'] = 69.2957;
beepNote['c2'] = 65.4064;
beepNote['b1'] = 61.7354;
beepNote['a#1'] = 58.2705;
beepNote['a1'] = 55;
beepNote['g#1'] = 51.9131;
beepNote['g1'] = 48.9994;
beepNote['f#1'] = 46.2493;
beepNote['f1'] = 43.6535;
beepNote['e1'] = 41.2034;
beepNote['d#1'] = 38.8909;
beepNote['d1'] = 36.7081;
beepNote['c#1'] = 34.6478;
beepNote['c1'] = 32.7032;
beepNote['b0'] = 30.8677;
beepNote['a#0'] = 29.1352;
beepNote['a0'] = 27.5;

// Alternate notation using b instead of # after the note
beepNote['bb7'] = 3729.31;
beepNote['ab7'] = 3322.44;
beepNote['gb7'] = 2959.96;
beepNote['eb7'] = 2489.02;
beepNote['db7'] = 2217.46;
beepNote['bb6'] = 1864.66;
beepNote['ab6'] = 1661.22;
beepNote['gb6'] = 1479.98;
beepNote['eb6'] = 1244.51;
beepNote['db6'] = 1108.73;
beepNote['bb5'] = 932.328;
beepNote['ab5'] = 830.609;
beepNote['gb5'] = 739.989;
beepNote['eb5'] = 622.254;
beepNote['db5'] = 554.365;
beepNote['bb4'] = 466.164;
beepNote['ab4'] = 415.305;
beepNote['gb4'] = 369.994;
beepNote['eb4'] = 311.127;
beepNote['db4'] = 277.183;
beepNote['bb3'] = 233.082;
beepNote['ab3'] = 207.652;
beepNote['gb3'] = 184.997;
beepNote['eb3'] = 155.563;
beepNote['db3'] = 138.591;
beepNote['bb2'] = 116.541;
beepNote['ab2'] = 103.826;
beepNote['gb2'] = 92.4986;
beepNote['eb2'] = 77.7817;
beepNote['db2'] = 69.2957;
beepNote['bb1'] = 58.2705;
beepNote['ab1'] = 51.9131;
beepNote['gb1'] = 46.2493;
beepNote['eb1'] = 38.8909;
beepNote['db1'] = 34.6478;
beepNote['bb0'] = 29.1352;

// Alternate notation using H instead of B as note
beepNote['h7'] = 3951.07;
beepNote['h6'] = 1975.53;
beepNote['h5'] = 987.767;
beepNote['h4'] = 493.883;
beepNote['h3'] = 246.942;
beepNote['h2'] = 123.471;
beepNote['h1'] = 61.7354;
beepNote['h0'] = 30.8677;
beepNote['hb7'] = 3729.31;
beepNote['hb6'] = 1864.66;
beepNote['hb5'] = 932.328;
beepNote['hb4'] = 466.164;
beepNote['hb3'] = 233.082;
beepNote['hb2'] = 116.541;
beepNote['hb1'] = 58.2705;
beepNote['hb0'] = 29.1352;

// Notes by piano key numbers
beepNote['k88'] = 4186.01;
beepNote['k87'] = 3951.07;
beepNote['k86'] = 3729.31;
beepNote['k85'] = 3520;
beepNote['k84'] = 3322.44;
beepNote['k83'] = 3135.96;
beepNote['k82'] = 2959.96;
beepNote['k81'] = 2793.83;
beepNote['k80'] = 2637.02;
beepNote['k79'] = 2489.02;
beepNote['k78'] = 2349.32;
beepNote['k77'] = 2217.46;
beepNote['k76'] = 2093;
beepNote['k75'] = 1975.53;
beepNote['k74'] = 1864.66;
beepNote['k73'] = 1760;
beepNote['k72'] = 1661.22;
beepNote['k71'] = 1567.98;
beepNote['k70'] = 1479.98;
beepNote['k69'] = 1396.91;
beepNote['k68'] = 1318.51;
beepNote['k67'] = 1244.51;
beepNote['k66'] = 1174.66;
beepNote['k65'] = 1108.73;
beepNote['k64'] = 1046.5;
beepNote['k63'] = 987.767;
beepNote['k62'] = 932.328;
beepNote['k61'] = 880;
beepNote['k60'] = 830.609;
beepNote['k59'] = 783.991;
beepNote['k58'] = 739.989;
beepNote['k57'] = 698.456;
beepNote['k56'] = 659.255;
beepNote['k55'] = 622.254;
beepNote['k54'] = 587.33;
beepNote['k53'] = 554.365;
beepNote['k52'] = 523.251;
beepNote['k51'] = 493.883;
beepNote['k50'] = 466.164;
beepNote['k49'] = 440;
beepNote['k48'] = 415.305;
beepNote['k47'] = 391.995;
beepNote['k46'] = 369.994;
beepNote['k45'] = 349.228;
beepNote['k44'] = 329.628;
beepNote['k43'] = 311.127;
beepNote['k42'] = 293.665;
beepNote['k41'] = 277.183;
beepNote['k40'] = 261.626;
beepNote['k39'] = 246.942;
beepNote['k38'] = 233.082;
beepNote['k37'] = 220;
beepNote['k36'] = 207.652;
beepNote['k35'] = 195.998;
beepNote['k34'] = 184.997;
beepNote['k33'] = 174.614;
beepNote['k32'] = 164.814;
beepNote['k31'] = 155.563;
beepNote['k30'] = 146.832;
beepNote['k29'] = 138.591;
beepNote['k28'] = 130.813;
beepNote['k27'] = 123.471;
beepNote['k26'] = 116.541;
beepNote['k25'] = 110;
beepNote['k24'] = 103.826;
beepNote['k23'] = 97.9989;
beepNote['k22'] = 92.4986;
beepNote['k21'] = 87.3071;
beepNote['k20'] = 82.4069;
beepNote['k19'] = 77.7817;
beepNote['k18'] = 73.4162;
beepNote['k17'] = 69.2957;
beepNote['k16'] = 65.4064;
beepNote['k15'] = 61.7354;
beepNote['k14'] = 58.2705;
beepNote['k13'] = 55;
beepNote['k12'] = 51.9131;
beepNote['k11'] = 48.9994;
beepNote['k10'] = 46.2493;
beepNote['k9'] = 43.6535;
beepNote['k8'] = 41.2034;
beepNote['k7'] = 38.8909;
beepNote['k6'] = 36.7081;
beepNote['k5'] = 34.6478;
beepNote['k4'] = 32.7032;
beepNote['k3'] = 30.8677;
beepNote['k2'] = 29.1352;
beepNote['k1'] = 27.5;
