var gulp = require('gulp');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSS: 'src/**/*.css',
  srcJS: 'src/**/*.js',

  tmp: 'tmp',
  tmpIndex: 'tmp/index.html',
  tmpCSS: 'tmp/**/*.css',
  tmpJS: 'tmp/**/*.js',

  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js'
};

/* HTML task to copy all HTML files from the src directory to the tmp directory where you’ll be running the web server. */
gulp.task('html', function() {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

/* CSS task similar to HTML task */
gulp.task('css', function() {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

/* JS task similar to HTML task */
gulp.task('js', function() {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

/* Copy task - combine all the above HTML, CSS, JS tasks into one single task */
gulp.task('copy', ['html', 'css', 'js']);


/* Inject files into the index.html */
gulp.task('inject', ['copy'], function() {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpJS);
  return gulp.src(paths.tmpIndex)
    .pipe(inject( css, { relative: true } ))
    .pipe(inject( js, { relative: true } ))
    .pipe(gulp.dest(paths.tmp));
});

/* Serve the development web server */
gulp.task('serve', ['inject'], function() {
  return gulp.src(paths.tmp)
    .pipe(webserver({
      port: 3000,
      livereload: true
    }));
});

/* Watch for changes */
gulp.task('watch', ['serve'], function() {
  gulp.watch(paths.src, ['inject']);
});

/* Default gulp will in turn run all of the tasks you have already built */
gulp.task('default', ['watch']);


/* Building the dist - pack up your files to make them ready for production */
gulp.task('html:dist', function() {
  return gulp.src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function() {
  return gulp.src(paths.srcCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js:dist', function() {
  return gulp.src(paths.srcJS)
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], function() {
  var css = gulp.src(paths.distCSS);
  var js = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject( css, { relative: true }) )
    .pipe(inject( js, { relative: true }) )
    .pipe(gulp.dest(paths.dist));
})

gulp.task('build', ['inject:dist']);

/* Cleaning up - It’s not considered good practice to send off the tmp and dist folders to GitHub or whatever version control you may be using. */
gulp.task('clean', function() {
  del(['paths.tmp', 'paths.dist']);
});

/* Another good practice would be to add the tmp and dist folders to your .gitignore */