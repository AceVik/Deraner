
// Include gulp
const env           = require('dotenv').config({path: 'deraner/.env'}).parsed;

const gulp          = require('gulp');
const gutil         = require('gulp-util');
const gulpif        = require('gulp-if');
const replace       = require('gulp-replace');

const uglifyjs      = require('gulp-uglify');
const uglifycss     = require('gulp-uglifycss');
const uglifyhtml    = require('gulp-htmlmin');

const concat        = require('gulp-concat');
const merge         = require('merge-stream');

const pug           = require('gulp-pug');
const sass          = require('gulp-sass');
const babel         = require('gulp-babel');
const typescript    = require('gulp-typescript');

const sourcemaps    = require('gulp-sourcemaps');

const { lstatSync,
        readdirSync,
        existsSync,
        readFileSync
}                   = require('fs');
const { join }      = require('path');

const builders = {
    sass        : sass,
    scss        : sass,
    babel       : babel,
    typescript  : typescript,
    ts          : typescript,
    pug         : pug,
    jade        : pug
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

const compile = (tpl, obj, path, destPath) => {
    let assets = obj || null;
    if(assets === null) return;

    const templateRootURI = '/templates/' + tpl.name;
    const assetsTemplateURI = templateRootURI + '/assets';
    const assetsRootURI = '/assets';

    const templateRootPublicPath = templatesDestDir + '/' + tpl.name;
    const assetsTemplatePublicPath = templateRootPublicPath + '/assets';
    const assetsRootPublicPath = 'deraner/public/assets';

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
                    fullSRC.push(path + args.src);
                } else {
                    for(let i = 0; i < args.src.length; i++) {
                        fullSRC.push(path + args.src[i]);
                    }
                }
            } else {
                console.error('Compilation error! Missing src parameter.' + dest + ' could not be created.');
                continue;
            }

            let stream = null;

            let minify = ('minify' in args ? args.minify : env.APP_ENV != 'dev');
            let createSourceMaps = (('sourcemap' in args ? args.sourcemap : true) && env.APP_ENV == 'dev');

            if('builder' in args) {
                if(args.builder in builders) {
                    let ugly = (new Array('scss', 'sass', 'less')).indexOf(args.builder) >= 0 ? uglifycss :
                        ((new Array('babel')).indexOf(args.builder) >= 0 ? uglifyjs : false);

                    if((new Array('pug', 'jade')).indexOf(args.builder) >= 0) {
                        ugly = uglifyhtml;
                        args.options = args.options || {};

                        args.options.pretty = env.APP_ENV == 'dev' ? args.options.pretty || true : false;

                        args.options.data = args.options.data || {};
                        args.options.data.template = args.options.data.template || {};
                        args.options.data.template.name = args.options.data.template.name || tpl.name || null;
                        args.options.data.template.author = args.options.data.template.author || tpl.author || null;
                        args.options.data.template.license = args.options.data.template.license || tpl.license || null;
                        args.options.data.template.version = args.options.data.template.version || tpl.version || null;
                        args.options.data.template.env = args.options.data.template.env || tpl.env || null;

                        args.options.data.env = env;
                    }

                    if(!ugly && minify) {
                        minify = false;
                        console.warn('Compilation warning! Unknown file type.' + dest + ' can not be minified.');
                    }

                    let replaceOptions = {
                        regex: /(#uri:.+?\.(?:js|css|png|jpg|jpeg|gif|svg))/ig,
                        replace: str => {
                            let mt = /#uri:(.+?\.(?:js|css|png|jpg|jpeg|gif|svg))/ig.exec(str);
                            let fl = mt[1];

                            let tmp = /\.(js|css)$/ig.exec(fl);
                            let sub_uri = '/';

                            if(tmp !== null) {
                                sub_uri = '/' + tmp[1] + '/' + fl;
                            } else if(/\.(png|jpg|jpeg|gif|svg)$/ig.test(str)) {
                                sub_uri = '/img/' + fl;
                            }

                            if(existsSync(assetsTemplatePublicPath + sub_uri))
                                return assetsTemplateURI + sub_uri;

                            if(existsSync(assetsRootPublicPath + sub_uri))
                                return assetsRootURI + sub_uri;

                            gutil.log('Warning: Asset not found \'' + fl + '\'. Using template root URI as asset URI.');
                            return templateRootURI + '/' + fl;

                            return pth;
                        }
                    };

                    if('options' in args) {
                        stream = gulp.src(fullSRC)
                                        .pipe(gulpif(createSourceMaps, sourcemaps.init()))
                                        .pipe(builders[args.builder](args.options))
                                        .pipe(replace(replaceOptions.regex, replaceOptions.replace))
                                        .pipe(gulpif(minify, !ugly ? gutil.noop() : ugly().on('error', gutil.log)))
                                        .pipe(gulpif(createSourceMaps, sourcemaps.write()));
                    } else {
                        stream = gulp.src(fullSRC)
                                        .pipe(gulpif(createSourceMaps, sourcemaps.init()))
                                        .pipe(builders[args.builder]())
                                        .pipe(replace(replaceOptions.regex, replaceOptions.replace))
                                        .pipe(gulpif(minify, !ugly ? gutil.noop() : ugly().on('error', gutil.log)))
                                        .pipe(gulpif(createSourceMaps, sourcemaps.write()));
                    }
                } else {
                    console.error('Compilation error! Unknown builder ' + args.builder + '. ' + dest + ' could not be created.');
                    stream = null;
                }
            } else {
                let ugly = ((dst.file !== null && dst.file.lastIndexOf('.css') > 0) || /^(?:.*\/)?css(?:\/.*)?$/.test(dst.path)) ? uglifycss :
                            ((dst.file !== null && dst.file.lastIndexOf('.js') > 0) || /^(?:.*\/)?js(?:\/.*)?$/.test(dst.path) ? uglifyjs :
                            ((dst.file !== null && dst.file.lastIndexOf('.html') > 0) || /^(?:.*\/)?template(?:\/.*)?$/.test(dst.path) ? uglifyhtml : false));

                if(!ugly && minify) {
                    minify = false;
                    console.warn('Compilation warning! Unknown file type.' + dest + ' can not be minified.');
                }

                stream = gulp.src(fullSRC).pipe(gulpif(minify, !ugly ? gutil.noop() : ugly().on('error', gutil.log)));
            }

            if(stream !== null) {
                streams.push(stream);
            }
        }


        if(dst.file !== null) {
            stm = merge(...streams).pipe(concat(dst.file)).pipe(gulp.dest(destPath + dst.path));
        } else {
            stm = merge(...streams).pipe(gulp.dest(destPath + dst.path));
        }

        rets.push(stm);
    }

    return rets;
};

const compileAssets = () => {
    gulp.src('deraner/assets/css/font-awesome/*.scss')
        .pipe(sass())
        .pipe(concat('font-awesome5.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('deraner/public/assets/css'));

    gulp.src('deraner/assets/webfonts/*')
        .pipe(gulp.dest('deraner/public/assets/webfonts'));

    let min = (env.APP_ENV != 'dev' ? '.min' : '');

    // ##################### Vue.js #####################
    gulp.src('node_modules/vue/dist/vue' + min + '.js')
        .pipe(concat('vue.js'))
        .pipe(gulp.dest('deraner/public/assets/js'));

    // ##################### jQuery #####################
    gulp.src('node_modules/jquery/dist/jquery' + min + '.js')
        .pipe(concat('jquery.js'))
        .pipe(gulp.dest('deraner/public/assets/js'));

    gulp.src('node_modules/jquery/dist/jquery.slim' + min + '.js')
        .pipe(concat('jquery.slim.js'))
        .pipe(gulp.dest('deraner/public/assets/js'));

    // ##################### Popper #####################
    gulp.src('node_modules/popper.js/dist/popper' + min + '.js')
        .pipe(concat('popper.js'))
        .pipe(gulp.dest('deraner/public/assets/js'));

    gulp.src('node_modules/popper.js/dist/popper-utils' + min + '.js')
        .pipe(concat('popper-utils.js'))
        .pipe(gulp.dest('deraner/public/assets/js'));

    // ################### Bootstrap ####################
    gulp.src('node_modules/bootstrap/dist/css/bootstrap' + min + '.css')
        .pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('deraner/public/assets/css'));

    gulp.src('node_modules/bootstrap/dist/css/bootstrap-grid' + min + '.css')
        .pipe(concat('bootstrap-grid.css'))
        .pipe(gulp.dest('deraner/public/assets/css'));

    gulp.src('node_modules/bootstrap/dist/css/bootstrap-reboot' + min + '.css')
        .pipe(concat('bootstrap-reboot.css'))
        .pipe(gulp.dest('deraner/public/assets/css'));

    gulp.src('node_modules/bootstrap/dist/js/bootstrap' + min + '.js')
        .pipe(concat('bootstrap.js'))
        .pipe(gulp.dest('deraner/public/assets/js'));

    gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle' + min + '.js')
        .pipe(concat('bootstrap.bundle.js'))
        .pipe(gulp.dest('deraner/public/assets/js'));

    /*
    gulp.src([
        'deraner/assets/js/Deraner/*.js',
        'deraner/assets/js/Deraner/Deraner.js'
    ])  .pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.init()))
        .pipe(concat('deraner.js'))
        .pipe(babel({
            "presets" : ["env"]
        }))
        .pipe(gulpif(env.APP_ENV != 'dev', uglifyjs()))
        .pipe(gulpif(env.APP_ENV == 'dev', sourcemaps.write()))
        .pipe(gulp.dest('deraner/public/assets/js'));
        */


    gulp.src('deraner/assets/img/*')
        .pipe(gulp.dest('deraner/public/assets/img'));
};

const compileTemplates = () => {
    forEachTemplate((tpl, path, dpath) => {
        gutil.log('Compiling template \'' + tpl.name + '\' ...');

        //Important! Assets first.
        compile(tpl, tpl.assets, path + '/assets/', dpath + '/assets/');
        compile(tpl, tpl.templates, path + '/', dpath + '/');
    });
};

gulp.task('assets', () => {
    compileAssets();
});

gulp.task('templates', () => {
    compileTemplates();
});

gulp.task('all', () => {
    compileAssets();
    compileTemplates();
});

gulp.task('default', ['all']);
