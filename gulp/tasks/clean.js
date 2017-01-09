module.exports = function (gulp, rimraf) {

  gulp.task('clean', function() {
    return gulp.src('./temp/', { read: false }).pipe(rimraf());
  });

};