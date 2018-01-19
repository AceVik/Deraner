
// Include gulp
const env = require('dotenv').config({path: 'deraner/.env'}).parsed;

const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpif = require('gulp-if');

const minify = require('gulp-uglify');
const concat = require('gulp-concat');
const merge = require('merge-stream');

const pug = require('gulp-pug');
const gulpPugBeautify = require('gulp-pug-beautify');

const sass = require('gulp-sass');
const babel = require('gulp-babel');

const sourcemaps = require('gulp-sourcemaps');

const { lstatSync, readdirSync, existsSync, readFileSync } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
    readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const templatesSrcDir = 'deraner/templates';
const templatesDestDir = 'deraner/public/templates';
const templatesSettingsFile = 'template.json';

let templates = null;
const forEachTemplate = callable => {
    if(templates === null) {
        templates = new Array();
        let dirs = getDirectories(templatesSrcDir);
        for(let i = 0; i < dirs.length; i++) {
            let path = dirs[i];
            let tplPath = path + '/' + templatesSettingsFile;
            if(existsSync(tplPath)) {
                let tpl = JSON.parse(readFileSync(tplPath, 'utf8'));
                let dpath = templatesDestDir + '/' + tpl.name;
                callable(tpl, path, dpath);
                templates.push({
                    path : path,
                    tpl : tpl,
                    dpath : dpath
                });
            }
        }
    } else {
        for(let i = 0; i < templates.length; i++) {
            var t = templates[i];
            callable(t.tpl, t.path, t.dpath);
        }
    }
};

const builders = {
    sass    : sass,
    scss    : sass,
    babel   : babel,
    pug     : pug,
    jade    : pug
};

const parseDestData = dest => {
    let idx = dest.indexOf(':');

    let dir = dest;
    let file = null;

    if(idx >= 0) {
        dir = dest.substr(0, idx);
        file = dest.substr(idx + 1);
    }

    return {
        path : dir,
        file : file
    };
};

const compileAssets = (tpl, path, dpath) => {
    let assets = tpl.assets || null;
    if(assets === null) return;

    let rets = new Array();

    for(let dest in assets) {
        let streams = new Array();
        let pipe = assets[dest];

        let dst = parseDestData(dest);

        for(let i = 0; i < pipe.length; i++) {
            let args = pipe[i];

            let fullSRC = new Array();

            if('src' in args) {
                if(typeof args.src == 'string') {
                    fullSRC.push(path + '/assets/' + args.src);
                } else {
                    for(let i = 0; i < args.src.length; i++) {
                        fullSRC.push(path + '/assets/' + args.src[i]);
                    }
                }
            } else {
                console.error('Compilation error! Missing src parameter.' + dest + ' could not be created.')
                continue;
            }

            let stream = null;

            if('builder' in args) {
                if(args.builder in builders) {
                    if('options' in args) {
                        stream = gulp.src(fullSRC).pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.init())).pipe(builders[args.builder](args.options));
                    } else {
                        stream = gulp.src(fullSRC).pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.init())).pipe(builders[args.builder]());
                    }
                } else {
                    console.error('Compilation error! Unknown builder ' + args.builder + '. ' + dest + ' could not be created.');
                    stream = null;
                }
            } else {
                stream = gulp.src(fullSRC);
            }

            if(stream !== null) {
                streams.push(stream);
            }
        }


        if(dst.file !== null) {
            stm = merge(...streams).pipe(concat(dst.file)).pipe(gulp.dest(dpath + '/assets/' + dst.path)).pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.write()));
        } else {
            stm = merge(...streams).pipe(gulp.dest(dpath + '/assets/' + dst.path)).pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.write()));
        }

        rets.push(stm);
    }

    return rets;
};

const compileTemplates = (tpl, path, dpath) => {
    let templates = tpl.templates || null;
    if(templates === null) return;

    let rets = new Array();

    for(let dest in templates) {
        let streams = new Array();
        let pipe = templates[dest];

        let dst = parseDestData(dest);

        for(let i = 0; i < pipe.length; i++) {
            let args = pipe[i];

            let fullSRC = new Array();

            if('src' in args) {
                if(typeof args.src == 'string') {
                    fullSRC.push(path + '/' + args.src);
                } else {
                    for(let i = 0; i < args.src.length; i++) {
                        fullSRC.push(path + '/' + args.src[i]);
                    }
                }
            } else {
                console.error('Compilation error! Missing src parameter.' + dest + ' could not be created.')
                continue;
            }

            let stream = null;

            if('builder' in args) {
                if(args.builder in builders) {
                    if('options' in args) {
                        stream = gulp.src(fullSRC).pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.init())).pipe(builders[args.builder](args.options));
                    } else {
                        stream = gulp.src(fullSRC).pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.init())).pipe(builders[args.builder]());
                    }
                } else {
                    console.error('Compilation error! Unknown builder ' + args.builder + '. ' + dest + ' could not be created.');
                    stream = null;
                }
            } else {
                stream = gulp.src(fullSRC);
            }

            if(stream !== null) {
                streams.push(stream);
            }
        }

        let stm = null;

        if(dst.file !== null) {
            stm = merge(...streams).pipe(concat(dst.file)).pipe(gulp.dest(dpath + '/' + dst.path)).pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.write()));
        } else {
            stm = merge(...streams).pipe(gulp.dest(dpath + '/' + dst.path)).pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.write()));
        }

        rets.push(stm);
    }

    return rets;
};

gulp.task('assets', () => {
    return gulp.src('node_modules/vue/dist/vue.min.js')
               .pipe(gulp.dest('deraner/public/assets/js'));
});

gulp.task('templates', () => {
    forEachTemplate((tpl, path, dpath) => {
        gutil.log('Compiling template \'' + tpl.name + '\' ...');
        compileTemplates(tpl, path, dpath);
        compileAssets(tpl, path, dpath);
    });
});

gulp.task('default', ['templates', 'assets']);
