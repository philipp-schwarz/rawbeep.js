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
*/