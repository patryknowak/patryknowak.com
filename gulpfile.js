var gulp    = require('gulp'),
    gutil    = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    minifyHtml = require('gulp-minify-html'),
    notify = require('gulp-notify'),
    minifyCss = require('gulp-minify-css');


var paths = {
    scripts: 'src/js/**/*.js',
    images: 'src/img/**/*',
    sass: 'src/scss/main.scss',
    sassWatch: 'src/scss/**/*',
    jade: 'src/templates/**/*.jade',
    html: 'src/*.html'
};

// var pathsDest = {
//   scripts: 'js/**/*.js',
//   images: 'img/**/*',
//   sass: 'scss/**/*',
//   jade: 'src/templates/**/*.jade'
// };


gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        //.pipe(sourcemaps.init()).on('error', errorHandler)
        //.pipe(uglify()).on('error', errorHandler)
        // .pipe(concat('all.min.js'))
        //.pipe(sourcemaps.write()).on('error', errorHandler)
        .pipe(uglify())
        .pipe(gulp.dest('build/js')).on('error', errorHandler)
        .pipe(connect.reload());
});


gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(imagemin({optimizationLevel: 5})).on('error', errorHandler)
        .pipe(gulp.dest('build/img'))
        .pipe(connect.reload())
});


gulp.task('sass', function() {
    return gulp.src(paths.sass).on('error', errorHandler)
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', errorHandler)
        .pipe(sourcemaps.write())
        .pipe(minifyCss())
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload())
        .pipe(notify("Sass compiled"));
});

gulp.task('html', function() {
    return gulp.src(paths.html).on('error', errorHandler)
        .pipe(minifyHtml())
        .pipe(gulp.dest('build'))
        .pipe(connect.reload())
        .pipe(notify("Html compiled"));
});

// gulp.task('jade', function(){
//  return gulp.src(paths.jade)
//    .pipe(jade())
// })


gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.sassWatch, ['sass']);
    gulp.watch(paths.html, ['html']);
});


gulp.task('connect', function(){
    connect.server({
        root: 'build',
        port: 8000,
        livereload: true
    });
})


gulp.task('default', ['watch', 'scripts', 'sass', 'html', 'images', 'connect']);

// Handle the error
function errorHandler (error) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        message:  "<b>Error:<b> <%= error.message %>,<br><br>File: <%= error.fileName %>, <br><br>Line: <%= error.lineNumber %>",
        sound:    "Beep"
    })(error);

    this.emit('end');
}