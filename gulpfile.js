/* global require */

'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', shell.task([
  'mkdir temp && cp -r ./README.md ./images/* temp',
  './node_modules/.bin/generate-md --layout minko-book --input ./temp --output ../angularjs-in-patterns-gh-pages',
  'rm -rf temp'
]));