/* global require */

'use strict';

var gulp = require('gulp'),
    markdownpdf = require('gulp-markdown-pdf');

gulp.task('default', function () {
  return gulp.src('README.md')
    .pipe(markdownpdf())
    .pipe(gulp.dest('build'));
});