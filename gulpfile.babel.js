/*
  Forked of: https://github.com/tsuyoshiwada/gulp-babel-boilerplate

  Mojor differences updates:
  1. replace deprecated rimraf per del
  2. added webpack HMR to work with browserSync.
     🙌 http://jsramblings.com/2016/07/16/hot-reloading-gulp-webpack-browsersync.webpackHotMiddleware
*/
import gulp from "gulp"
import gulpLoadPlugins from "gulp-load-plugins"
import del from "del"

import broswerSync from "browser-sync"
import runSequence from "run-sequence"
import minimist from "minimist"
import webpack from "webpack"
import ghpages from "gh-pages";

// import webpackDevMiddleware from 'webpack-dev-middleware'
// import webpackHotMiddleware from 'webpack-hot-middleware'
import {libConfig, siteConfig} from './webpack.config.babel.js'
import pkg from './package.json';
var pkgName = pkg.name.startsWith('@') ? pkg.name.split('/')[1] : pkg.name;

console.log(pkgName);
// CONSTANTS
const paths = pkg.flooper.devPaths;
let $ = gulpLoadPlugins(),
    bs = broswerSync.create();
// Environment variables
let knownOptions = {
  string: "env",
  default: {
    env: process.env.NODE_ENV || "development"
  }
};

let options = minimist(process.argv.slice(2), knownOptions),
    isProduction = options.env === "production";

global.isProduction = isProduction;



/**
 * =======================================================
 * $ gulp bs with HMR
 * =======================================================
 */
//let bundler = webpack(webpackConfig);
gulp.task("bs", (cb) => {
  bs.init({
    notify: false,
    server: {
      baseDir: paths.site.dest,
      // middleware: [
      //   webpackDevMiddleware(bundler, {
      //     publicPath: webpackConfig.output.publicPath,
      //       stats: { colors: true }
      //   }),
      //   webpackHotMiddleware(bundler)
      // ]
    }
  });
  cb();
});



/**
 * =======================================================
 * $ gulp bs:reload
 * =======================================================
 */
gulp.task("bs:reload", (cb) => {
  bs.reload();
  cb();
});



/**
 * =======================================================
 * $ gulp clean
 * =======================================================
 */
gulp.task("clean", (cb) => del([paths.lib.dest, paths.site.dest], cb));




/**
 * =======================================================
 * $ gulp copy-assets
 * =======================================================
 */
gulp.task("copy-assets", () => {
  return gulp.src([`${paths.site.src}/assets/**/*`])
  .pipe(gulp.dest(`${paths.site.dest}/assets/`))
  .pipe(bs.stream());
});



/**
 * =======================================================
 * $ gulp jade
 * =======================================================
 */
gulp.task("jade", () => {
  return gulp.src([
    "./site/jade/**/*.jade",
    "!./site/jade/**/_*.jade"
  ])
  .pipe($.plumber())
  .pipe($.data(() => {
    var config = require(`${paths.site.src}/jade/config.json`);
    var data = {...config, ...pkg } // config file and package.json
    return data
  }))
  .pipe($.jade({pretty: true}))
  .pipe(gulp.dest(paths.site.dest))
  .pipe(bs.stream());
});



/**
 * =======================================================
 * $ gulp webpack
 * =======================================================
 */
gulp.task("webpack:site", (cb) => {
  webpack(siteConfig, (err, stats) => {
    if( err ) throw new $.util.PluginError("webpack", err);
    $.util.log("[webpack]", stats.toString());
    bs.reload();
    cb();
  })
});

gulp.task("webpack:lib", (cb) => {
  webpack(libConfig, (err, stats) => {
    if( err ) throw new $.util.PluginError("webpack", err);
    $.util.log("[webpack]", stats.toString());
    bs.reload();
    cb();
  })
});



/**
 * =======================================================
 * $ gulp uglify
 * =======================================================
 */
gulp.task("uglify:lib", () => {
  if (!isProduction) return
  return gulp.src([`${paths.lib.dest}/${pkgName}.js`])
  .pipe($.uglify())
  .pipe($.rename({suffix: ".min"}))
  .pipe($.size({title: $.util.colors.bgRed('[SIZE] library: ')}))
  .pipe(gulp.dest(paths.lib.dest))
  .pipe(bs.stream());
});

gulp.task("uglify:site", () => {
  if (!isProduction) return
  return gulp.src(`${paths.site.dest}/**/*.js`)
  .pipe($.uglify())
  .pipe(gulp.dest(paths.site.dest))
  .pipe(bs.stream());
});

gulp.task("uglify", (cb) => {
  runSequence(
    "uglify:lib",
    "uglify:site",
    cb
  )
});


/**
 * =======================================================
 * $ gulp size
 * write size to package.json
 * =======================================================
 */
var libSize,libSizeGzip;

gulp.task("size:lib", function(){
  if (!isProduction) return
  let s = $.size();
  return gulp.src(`${paths.lib.dest}/${pkgName}.min.js`)
    .pipe(s)
    .on('end', function(){
      libSize = s.prettySize;
    })
});

gulp.task("size:lib:gzip", function(){
  if (!isProduction) return
  let s = $.size({gzip: true});
  return gulp.src(`${paths.lib.dest}/${pkgName}.min.js`)
    .pipe(s)
    .on('end', function(){
      libSizeGzip = s.prettySize;
    })
});

gulp.task("write-size-to-pkg", function(){
  return gulp.src('./package.json')
    .pipe($.jsonEditor({
      flooper: {
        size: {
          minified: libSize,
          gzip: libSizeGzip
        }
      }
    })).pipe(gulp.dest('./'))
})

gulp.task("size", (cb) => {
  runSequence(
    "size:lib",
    "size:lib:gzip",
    "write-size-to-pkg",
    cb
  )
})
/**
 * =======================================================
 * $ gulp sass
 * =======================================================
 */
gulp.task("sass", () => {
  return gulp.src(`${paths.site.src}/stylesheets/**/*.scss`)
  .pipe($.plumber())
  .pipe($.sass({
    includePaths: ['node_modules'],
    outputStyle: isProduction ? "compressed" : "expanded"
  }).on("error", $.sass.logError))
  .pipe($.autoprefixer({
    browsers: [
      "last 3 versions",
      "ie 10",
      "iOS 8",
      "Android 4"
    ]
  }))
  .pipe(gulp.dest(`${paths.site.dest}/css`))
  .pipe(bs.stream());
});



/**
 * =======================================================
 * $ gulp build
 * =======================================================
 */
gulp.task("build", (cb) => {
  runSequence(
    "clean",
    "webpack:lib",
    "webpack:site",
    "uglify",
    "size",
    ["sass", "jade", "copy-assets"],
    cb
  );
});



/**
 * =======================================================
 * $ gulp watch
 * =======================================================
 */
gulp.task("watch", (cb) => {
  runSequence(
    "build",
    "bs",
    () => {
      $.watch(`${paths.site.src}/jade/**/*`, () => {
        gulp.start("jade");
      });

      // WEBPACK HMR did the job with browser sync
      $.watch(`${paths.site.src}/js/**/*`, () => {
        gulp.start("webpack:site");
      });

      $.watch(`${paths.lib.src}/**/*`, () => {
        runSequence("webpack:site", "webpack:lib");
      });


      $.watch(`${paths.site.src}/stylesheets/**/*`, () => {
        gulp.start("sass");
      });

      cb();
    }
  );
});



/**
 * =======================================================
 * $ gulp (start watch)
 * =======================================================
 */
gulp.task("default", () => {
  gulp.start("watch");
});


/**
 * =======================================================
 * $ gulp deploy --env production
 * =======================================================
 */

gulp.task("deploy", ["build"], function(cb) {
  ghpages.publish(paths.site.dest, {
    message: `Update ${pkg.version} [timestamp]`
  }, cb);
});
