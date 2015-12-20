module.exports = function (gulp, runSequence) {
  gulp.task('default', function(cb){
    runSequence('clean', ['copy:images', 'copy:md'], 'doc:pdf:all', cb);
  });
};