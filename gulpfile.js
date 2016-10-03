var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    pug = require('gulp-pug'),
    data = require('gulp-data'),
    less = require('gulp-less'),
    autoprefixer = require('autoprefixer'),
    path = require('path'),
    concat = require('gulp-concat'),
    imgmin = require('gulp-imagemin'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    fs = require('fs'),
    uglify = require('gulp-uglify');


gulp.task('serve', ['pug', 'less', 'imgmin', 'normalize', 'jquery', 'js', 'fonts'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    // gulp.watch("js/*.js", ['js-watch']);
    gulp.watch("src/view/**/*.pug", ['pug']);
    gulp.watch("src/styles/**/*.less", ['less']);
    gulp.watch("src/img/*.*", ['imgmin']);
    gulp.watch("src/js/**/*.js", ['js']);
});

gulp.task('pug', function () {

    gulp.src('./src/view/*.pug')
        .pipe(data(function (file) {
            return JSON.parse(
                fs.readFileSync('./src/assets/json/pug.json')
            );
        }))
        .pipe(pug())
        .pipe(gulp.dest('./app'))
        .pipe(browserSync.stream());
});

gulp.task('less', function () {
    var processors = [
        autoprefixer({browsers: ['last 2 version']}),
        cssnano({
            zindex: false
        })
    ];

    return gulp.src('./src/styles/**/*.less')
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {

    return gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.stream());
});

gulp.task('imgmin', function () {
    return gulp.src('./src/img/*.*')
        .pipe(imgmin())
        .pipe(gulp.dest('./app/img'))
        .pipe(browserSync.stream());
});

gulp.task('normalize', function () {
    gulp.src('./node_modules/normalize.css/normalize.css')
        .pipe(gulp.dest('./app/assets/css/'))
});

gulp.task('jquery', function () {
    gulp.src('./node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./app/assets/jquery/'))
});

gulp.task('fonts', function () {
    gulp.src('./src/assets/fonts/*.*')
        .pipe(gulp.dest('./app/assets/fonts/'))
});

gulp.task('default', ['serve']);