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
- [rawbeep.js](#rawbeepjs)
    - [Contents](#contents)
    - [function beepInit()](#function-beepinit)
    - [function beep(notes, volume)](#function-beepnotes-volume)
    - [function sound(frequency, duration, volume)](#function-soundfrequency-duration-volume)
    - [object beepNote](#object-beepnote)
    - [Note overview](#note-overview)

## function beepInit()

Call beepInit() to initializes rawbeep.
You **need** to initialize rawbeep through a **touch or click** event on mobile platforms to make sound work.
Calling beepInit() is optional on desktop devices because rawbeep initializes when you call beep() for the first time.

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

