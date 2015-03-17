#!/bin/sh

mkdir temp && cp -r ./meta.json ./README.md ./images/* temp
perl -i -0777 -pe 's/(<!--toc-->).*(<!--endtoc-->)/'"$"'$2/s' ./temp/README.md
sed -i.bak 's|https://rawgit.com/mgechev/angularjs-in-patterns/master/images|.|g' ./temp/README.md
rm -rf ./temp/*.bak
mv ./temp/README.md ./temp/index.md
./node_modules/.bin/generate-md --layout minko-book --input ./temp --output ../angularjs-in-patterns-gh-pages
rm -rf temp