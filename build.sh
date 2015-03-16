#!/bin/sh

mkdir temp && cp -r ./meta.json ./README.md ./images/* temp
perl -i -0777 -pe 's/(<!--toc-->).*(<!--endtoc-->)/'"$"'$2/s' ./temp/README.md
mv ./temp/README.md ./temp/index.md
./node_modules/.bin/generate-md --layout minko-book --input ./temp --output ../angularjs-in-patterns-gh-pages
rm -rf temp