"use strict";

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const criticalCss = require('gulp-critical-css');
const autoPrefixer = require('gulp-autoprefixer');
const cssComb = require('gulp-csscomb');
const cssClean = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cache = require('gulp-cache');
const del = require('del');
const liveReload = require('gulp-livereload');

const path = {
    dev: {
        html: 'development/index.html',
        css: 'development/style.sass',
        js: 'development/scripts/**/*.js',
        vendor: 'development/vendor/**/**/*.*',
        fonts: 'development/fonts/**/*.*'
    },
    prod: {
        html: 'production/',
        css: 'production/styles/',
        js: 'production/scripts/',
        vendor: 'production/vendor/',
        fonts: 'production/fonts/'
    },
    watch: {
        html: 'development/index.html',
        css: 'development/styles/**/*.sass',
        js: 'development/scripts/**/*.js',
        vendor: 'development/vendor/**/**/*.*',
        fonts: 'development/fonts/**/*.*'
    }
};

// LiveReload
function lReload() {
    liveReload.listen();
}

// Clean dir
function clean() {
    return del(['production/**', '!production', '!production/images/**']);
}

// Clear cache
function clear(done) {
    return cache.clearAll(done);
}

// Markup
function markup() {
    return gulp
        .src(path.dev.html)
        .pipe(gulp.dest(path.prod.html))
        .pipe(liveReload());
}

// Styles
function styles() {
    return gulp
        .src(path.dev.css)
        .pipe(sourceMaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(criticalCss())
        .pipe(autoPrefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(cssComb())
        .pipe(rename({dirname: ''}))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(path.prod.css))
        .pipe(liveReload());
}

// Scripts
function scripts() {
    return gulp
        .src(path.dev.js)
        .pipe(sourceMaps.init())
        .pipe(plumber())
        .pipe(rename({dirname: ''}))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(path.prod.js))
        .pipe(liveReload());
}

// Scripts
function vendor() {
    return gulp
        .src(path.dev.vendor)
        .pipe(gulp.dest(path.prod.vendor))
        .pipe(liveReload());
}

// Fonts
function fonts() {
    return gulp
        .src(path.dev.fonts)
        .pipe(gulp.dest(path.prod.fonts))
}

function concatCSS() {
    return gulp
        .src(['production/**/**.css', '!production/styles/style.critical.css'])
        .pipe(cssClean())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(path.prod.css))
}

function concatJS() {
    return gulp
        .src(['production/**/**.js', '!production/vendor/jquery-3.3.1.min.js'])
        .pipe(uglify())
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest(path.prod.js))
}

// Watch files
function watchFiles() {
    gulp.watch(path.watch.html, markup);
    gulp.watch(path.watch.css, styles);
    gulp.watch(path.watch.js, scripts);
    gulp.watch(path.watch.js, vendor);
    gulp.watch(path.watch.fonts, fonts);
}

// Tasks
exports.markup = gulp.series(markup);
exports.styles = gulp.series(styles);
exports.concatCSS = gulp.series(concatCSS);
exports.concatJS = gulp.series(concatJS);
exports.scripts = gulp.series(scripts);
exports.vendor = gulp.series(vendor);
exports.fonts = gulp.series(fonts);
exports.clean = gulp.series(clean);
exports.clear = gulp.series(clear);

// Build
exports.build = gulp.series(clean, gulp.parallel(markup, styles, scripts, vendor, fonts));

// Watch
exports.watch = gulp.parallel(watchFiles, lReload);