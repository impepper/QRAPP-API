#!/bin/bash
titanium build -f -p android -s 3.1.1.GA -d ~/mcms-qr-reader --skip-js-minify -T dist-playstore -O $1 -L fuihan -K ~/Android.keystore -P hala0204
