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
import {libConfig, siteConfig} from './webpack.config.babel.js'
import packageJson from './package.json';

// CONSTANTS
const paths = packageJson.devPaths;
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
    return require(`${paths.site.src}/jade/config.json`);
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
  return gulp.src(`${paths.lib.dest}/**/*.js`)
  .pipe($.uglify({preserveComments: "some"}))
  .pipe(gulp.dest(paths.lib.dest))
  .pipe(bs.stream());
});

gulp.task("uglify:site", () => {
  if (!isProduction) return
  return gulp.src(`${paths.site.dest}/**/*.js`)
  .pipe($.uglify({preserveComments: "some"}))
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
 * $ gulp sass
 * =======================================================
 */
gulp.task("sass", () => {
  let params = {
    outputStyle: isProduction ? "compressed" : "expanded"
  };

  return gulp.src(`${paths.site.src}/stylesheets/**/*.scss`)
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
    ["sass", "jade", "copy-assets"],
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
      $.watch(`${paths.site.src}/jade/**/*`, () => {
        gulp.start("jade");
      });

      // WEBPACK HMR did the job with browser sync
      $.watch(`${paths.site.src}/js/**/*`, () => {
        gulp.start("webpack:site");
      });

      $.watch(`${paths.lib.src}/**/*`, () => {
        runSequence("webpack:lib", "webpack:site");
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
 * $ Deploy site to gitHubPages
 * [1] add CNAME copy task to have custom domains
 * [2] Not working due https://github.com/shinnn/gulp-gh-pages/issues/116
 *     use `npm run deploy:site` only works on master.
 *     http://ianmcnally.me/blog/2016/2/4/variables-in-npm-scripts
 * =======================================================
 */

gulp.task('deploy:gh-pages', function() {
  return gulp.src('./site/**')
    .pipe($.ghPages({
      remoteUrl: "https://github.com/whitesmith/Flooper.js.git",
      force: true
    }));
});



// pass flag --env production when using
gulp.task("deploy:site", () => {
  runSequence(
    "build",
    "deploy:gh-pages"
  )
})
