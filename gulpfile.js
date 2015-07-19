var gulp          = require('gulp');
var markdownpdf   = require('gulp-markdown-pdf');
var path          = require('path');
var replace       = require('gulp-replace');
var package       = require('./package.json');
var rename        = require('gulp-rename');
var rimraf        = require('gulp-rimraf');
var runSequence   = require('run-sequence');
var glob          = require('glob');

var TITLE = 'AngularJS in Patterns';

function genericTask(lang){

  gulp.task('generate:pdf:' + lang, function() {

    var files = ['./temp/*.md'];
    if (lang === 'eng'){
      files = './temp/README.md';
    }
    else if(lang !== 'all'){
      files = ['./temp/*-'+lang+'.md'];
    }

    return gulp.src(files)
        .pipe(markdownpdf({
          cwd: path.resolve('./temp/'),
          layout: 'github'
        }))
        .on('error', function(err){
            gutil.log(gutil.colors.red('doc task failed'), err);
        })
        .pipe(rename(function (path) {
          var lang = 'ENG';
          if(path.basename.indexOf('-') >= 0){
            lang = path.basename.replace('README-', '').toUpperCase();
          }
          path.basename = TITLE + ' ('+lang+')';
          path.extname = '.pdf'
        }))
        .pipe(gulp.dest('./build/'));
  });

}

// build custom tasks for i18n

glob.sync('./temp/README-*.md').map(function(file){

  return file.replace('README-', '');

}).concat(['all', 'eng']).forEach(function(lang){

  genericTask(lang);
  gulp.task('doc:pdf:'+lang, function(cb){
    runSequence('clean', ['copy:images', 'copy:md'], 'generate:pdf:'+lang, cb);
  });

});

gulp.task('default', function(cb){
  runSequence('clean', ['copy:images', 'copy:md'], 'doc:pdf:all', cb);
});

gulp.task('copy:md', function(){
  return gulp.src(['README.md', 'i18n/README-*.md'])

      // @todo I have no idea where should the TOC go?!
      // for now, let's keep the TOC content and remove these markers
      .pipe(replace('<!--toc-->', ''))
      .pipe(replace('<!--endtoc-->', ''))

      // preapre the image paths for the renderer
      .pipe(replace(/https:\/\/rawgit.com\/mgechev\/angularjs-in-patterns\/master\/images/g, '.'))
      .pipe(gulp.dest('./temp/'));
});

gulp.task('copy:images', function(){
  return gulp.src(['images/*.svg','meta.json']).pipe(gulp.dest('./temp'));
});

gulp.task('clean', function() {
  return gulp.src('./temp/', { read: false }).pipe(rimraf());
});
