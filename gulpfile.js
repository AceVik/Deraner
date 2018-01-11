// Include gulp
const gulp = require('gulp');

const sass = require('gulp-sass');
const babel = require('gulp-babel');

gulp.task('css', () => {
    return gulp.src('deraner/templates/Ulmenstein/assets/css/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('deraner/public/css'))
    ;
});

gulp.task('js', () => {
    return gulp.src('deraner/templates/Ulmenstein/assets/js/**/*.js')
            .pipe(babel({
                presets: ['env']
            }))
            .pipe(gulp.dest('deraner/public/js'))
    ;
});

gulp.task('default', ['css', 'js']);

/*
// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('deraner/Ulmenstein/assets/css/font-awesome/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('deraner/public/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
*/