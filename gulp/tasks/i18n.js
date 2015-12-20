module.exports = function (gulp, glob, genericTask, runSequence) {

  // build custom tasks for i18n

  glob.sync('./temp/README-*.md').map(function(file){
    return file.replace(/.*README\-|\.md$/g, '');
  }).concat(['all', 'eng']).forEach(function(lang){
    genericTask(lang);
    gulp.task('doc:pdf:'+lang, function(cb){
      runSequence('clean', ['copy:images', 'copy:md'], 'generate:pdf:'+lang, cb);
    });
  });
};