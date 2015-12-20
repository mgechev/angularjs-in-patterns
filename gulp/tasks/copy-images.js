module.exports = function (gulp) {

  gulp.task('copy:images', function(){
    return gulp.src(['images/*.svg','meta.json']).pipe(gulp.dest('./temp'));
  });

};
