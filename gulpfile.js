var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var rename = require("gulp-rename");


/*--- Server ---*/

gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 3001,
            baseDir: "build"
        }
    });


    gulp.watch('build/**/*').on('change', browserSync.reload);

});

/*--- Pug compile ---*/

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
    .pipe(pug({
       pretty: true
    }))
    .pipe(gulp.dest('build'))
  });


  /*--- Styles compile ---*/

  gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('build/css'));
  });


  /*--- Sprites ---*/
  
  gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '..img/sprite.png',
      cssName: 'sprite.scss'
    }));
 
    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
  });


  /*--- Delete ---*/

  gulp.task('clean', function del(cb) {
      return rimraf('build', cb);
  });


  /*--- Copy Fonts ---*/
  gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
      .pipe(gulp.dest('build/fonts'));
  });
  
   /*--- Copy images ---*/
  gulp.task('copy:img', function() {
    return gulp.src('./source/img/**/*.*')
      .pipe(gulp.dest('build/img'));
  });

   /*--- Copy ---*/
   gulp.task('copy', gulp.parallel('copy:fonts', 'copy:img'));


   /*--- Watchers ---*/

   gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
  });
  
  gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
  );
  