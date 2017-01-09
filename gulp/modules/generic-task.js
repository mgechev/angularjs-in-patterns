module.exports = function (gulp, markdownpdf, path, log, chalk, rename, TITLE) {

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
          log(chalk.red('doc task failed'), err);
        })
        .pipe(rename(function (path) {
          var lang = 'ENG';
          if(path.basename.indexOf('-') >= 0){
            lang = path.basename.replace('README-', '').toUpperCase();
          }
          path.basename = TITLE + ' ('+lang+')';
          path.extname = '.pdf';
        }))
        .pipe(gulp.dest('./build/'));
    });

  }

  return genericTask;

};