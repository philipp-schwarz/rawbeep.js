#!/bin/bash
cd "$(dirname "$0")"

echo "Building rawbeep.js ..."
echo "Make sure 'uglifyjs' and 'fastdoc' are installed and in your \$PATH"

if [ -f dist/rawbeep.js ] ; then
	rm dist/rawbeep.js
	echo "Cleaning: dist/rawbeep.js"
fi

if [ -f dist/rawbeep.min.js ] ; then
	rm dist/rawbeep.min.js
	echo "Cleaning: dist/rawbeep.min.js"
fi

if [ -f README.md ] ; then
	rm README.md
	echo "Cleaning: README.md"
fi

echo "Making: dist/rawbeep.js"
cat src/doc.js src/beep.js src/beepCompile.js src/beepNote.js > dist/rawbeep.js

echo "Making: dist/rawbeep.min.js"
uglifyjs dist/rawbeep.js --compress --output dist/rawbeep.min.js

echo "Making: README.md"
fastdoc src/doc.js src/beep.js src/beepCompile.js src/beepNote.js --output README.md

echo "Done!"
