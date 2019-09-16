const gulp = require('gulp');
const {
    src,
    dest,
    task,
    series,
    watch,
    parallel
} = require("gulp");
const clean = require('gulp-clean');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const gulpif = require('gulp-if');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const rm = require('gulp-rm');

//const env = process.env.NODE_ENV;

//*** path ***
let SRC_PATH = './src';
let DIST_PATH = './dist';
let STYLE_LIBS = [
   'node_modules/normalize.css/normalize.css'
 ];
let JS_LIBS = [
   'node_modules/jquery/dist/jquery.js'
 ];

var path = {
    scss: {
        src: SRC_PATH + '/scss/**/*.scss',
        entry: SRC_PATH + '/scss/styles.scss',
        dist: DIST_PATH + '/css'
    },

    js: {
        src: SRC_PATH + '/js/*.js',
        dist: DIST_PATH + '/js'
    },

    html: {
        src: SRC_PATH + '/*.html'
    },

    sprite: {
        src: SRC_PATH + '/img/icons/*.png',
        srcSVG: SRC_PATH + '/img/icons/*.svg',
        dist: DIST_PATH + '/img'
    }
}

task('clean', () => {
    return src(`${DIST_PATH}/**/*`, {
            read: false
        })
        .pipe(rm())
});

task('copy:html', () => {
    return src(path.html.src)
        .pipe(dest(DIST_PATH))
        .pipe(reload({
            stream: true
        }));
});

task('styles', () => {
    return src([`${STYLE_LIBS}`, path.scss.entry])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(px2rem({
            dpr: 1, // base device pixel ratio (default: 2)
            rem: 16, // root element (html) font-size (default: 16)
            one: false // whether convert 1px to rem (default: false)
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(path.scss.dist))
        .pipe(reload({
            stream: true
        }));
});

task('stylesBuild', () => {
    return src([`${STYLE_LIBS}`, path.scss.entry])
        .pipe(concat('main.min.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(px2rem({
            dpr: 1, // base device pixel ratio (default: 2)
            rem: 16, // root element (html) font-size (default: 16)
            one: false // whether convert 1px to rem (default: false)
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gcmq())
        .pipe(cleanCSS())
        .pipe(dest(path.scss.dist));
});

task('scripts', () => {
    return src([`${JS_LIBS}`, path.js.src])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js', {
            newLine: ';'
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(path.js.dist))
        .pipe(reload({
            stream: true
        }));
});

task('scriptsBuild', () => {
    return src([`${JS_LIBS}`, path.js.src])
        .pipe(concat('main.min.js', {
            newLine: ';'
        }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest(path.js.dist));
});

task('spriteSVG', () => {
    return src(path.sprite.srcSVG)
        .pipe(svgo({
            plugins: [
                {
                    removeAttrs: {
                        attrs: '(fill|stroke|style|width|height|data.*)'
                    }
       }
     ]
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest(path.sprite.dist));
});

task('img', () => {
    return src(['src/img/**/*.*', '!src/img/icons/*.*'])
        .pipe(imagemin([
    imagemin.gifsicle({
                interlaced: true
            }),
    imagemin.jpegtran({
                progressive: true
            }),
    imagemin.optipng({
                optimizationLevel: 5
            }),
    imagemin.svgo({
                plugins: [
                    {
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
        ]
            })
]))
        .pipe(dest('dist/img'));
});

task('fonts', () => {
    return src('src/fonts/**/*')
        .pipe(dest('dist/fonts'));
});

task('video', () => {
    return src('src/video/**/*')
        .pipe(dest('dist/video'));
});

task('watch', () => {
    browserSync.init({
        server: {
            baseDir: DIST_PATH
        },
        open: false
    });
    watch(path.scss.src, series('styles'));
    watch(path.html.src, series('copy:html'));
    watch(path.js.src, series('scripts'));

});

task('default',
    series(
        'clean',
        parallel('copy:html', 'styles', 'scripts', 'img', 'fonts', 'video'),
        'watch'
    )
);

task('build',
    series(
        'clean',
        parallel('copy:html', 'stylesBuild', 'scriptsBuild', 'img', 'fonts', 'video'))
);
