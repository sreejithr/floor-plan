import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import pump from 'pump';
import webserver from 'gulp-webserver';
import sourcemaps from 'gulp-sourcemaps';
import jshint from 'gulp-jshint';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify-es';
import babel from 'gulp-babel';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import babelify from 'babelify';

gulp.task('default', ['jshint', 'build-js', 'build-sass']);

gulp.task('jshint', () => {
  return gulp.src('source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-sass', () => {
  return gulp.src('source/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/css/'));
});

gulp.task('build-js', () => {
  return gulp.src('source/js/**/*.js')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('bundle.js'))
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/assets/js/'));
});

gulp.task('serve', () => {
  gulp.src('public')
    .pipe(webserver({
      livereload: true,
      open: true,
    }));
});

gulp.task('error', function (cb) {
  pump([
    gulp.src('source/js/**/*.js'),
    uglify(),
    gulp.dest('public/assets/js/')
  ], cb);
});

gulp.task('watch', () => {
  gulp.watch('source/js/**/*.js', ['jshint', 'build-js']);
  gulp.watch('source/sass/**/*.scss', ['build-sass']);
});
