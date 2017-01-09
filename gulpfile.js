var GulpDI = require('gulp-di');
var gulp = require('gulp');
var di = GulpDI(require('gulp'), {
  pattern : ['gulp-*', 'gulp.*', 'run-sequence', 'glob'],
  rename : {
    'gulp-markdown-pdf' : 'markdownpdf'
  }
})
.provide({
  TITLE : 'AngularJS in Patterns',
  path : require('path')
})
.modules('./gulp/modules')
.tasks('./gulp/tasks')
.resolve();