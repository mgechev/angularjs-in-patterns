module.exports = function (gulp, replace) {

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

};