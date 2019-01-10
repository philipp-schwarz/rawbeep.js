/*doc*
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
