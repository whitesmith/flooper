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
// import webpackDevMiddleware from 'webpack-dev-middleware'
// import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from './webpack.config.babel.js'


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
      baseDir: "./docs",
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
gulp.task("clean", (cb) => del(["./dist/", "./docs/"], cb));




/**
 * =======================================================
 * $ gulp copy-assets
 * =======================================================
 */
gulp.task("copy-assets", () => {
  return gulp.src(["./site/assets/**/*"])
  .pipe(gulp.dest("./dist/assets/"))
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
    return require("./site/jade/config.json");
  }))
  .pipe($.jade({pretty: true}))
  .pipe(gulp.dest("./docs"))
  .pipe(bs.stream());
});



/**
 * =======================================================
 * $ gulp webpack
 * =======================================================
 */
gulp.task("webpack", (cb) => {
  webpack(webpackConfig, (err, stats) => {
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
gulp.task("uglify", () => {
  return gulp.src("./dist/**/*.js")
  .pipe($.uglify({preserveComments: "some"}))
  .pipe(gulp.dest("./dist/"))
  .pipe(bs.stream());
});



/**
 * =======================================================
 * $ gulp sass
 * =======================================================
 */
gulp.task("sass", () => {
  let params = {
    outputStyle: isProduction ? "compressed" : "expanded"
  };

  return gulp.src("./site/stylesheets/**/*.scss")
  .pipe($.plumber())
  .pipe($.sass.sync(params).on("error", $.sass.logError))
  .pipe($.autoprefixer({
    browsers: [
      "last 4 versions",
      "ie 9",
      "iOS 6",
      "Android 4"
    ]
  }))
  .pipe(gulp.dest("./docs/css"))
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
    ["webpack", "sass", "jade"],
    "uglify",
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
      $.watch("./site/jade/**/*", () => {
        gulp.start("jade");
      });

      // WEBPACK HMR did the job with browser sync
      $.watch(["./site/js/**/*", "./lib/**/*"], () => {
        gulp.start("webpack");
      });

      $.watch("./site/stylesheets/**/*", () => {
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