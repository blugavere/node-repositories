
'use strict';

const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const excludeGitignore = require('gulp-exclude-gitignore');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const nsp = require('gulp-nsp');
const plumber = require('gulp-plumber');
const coveralls = require('gulp-coveralls');
const del = require('del');
const isparta = require('isparta');
const through = require('through2');
const chalk = require('chalk');
const newer = require('gulp-newer');
const gutil = require('gulp-util');

gulp.task('static', function () {
  return gulp.src(['**/*.js'])
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp({
    package: path.resolve('package.json')
  }, cb);
});

gulp.task('pre-test', function () {
  return gulp.src([
      'lib/**/*.js',
      '!lib/**/*.test.js',
      'packages/*/*.js',
      '!packages/*/*.test.js',
      'packages/*/lib/**/*.js',
      '!packages/*/lib/**/*.test.js',
      '!packages/*/gulpfile.js'
    ])
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], cb => {
  let mochaErr;
  gulp.src([
      'lib/**/*.test.js',
      'packages/**/*.test.js',
      'test/**/*.js'
    ])
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('watch', function () {
  gulp.watch(['lib/**/*.js'], ['test']);
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('babel', ['clean'], function () {
  return gulp.src('lib/**/*.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return del(['dist', 'coverage']);
});

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['static', 'build', 'test', 'coveralls']);

const base = path.join(__dirname, 'packages');
const scripts = './packages/*/lib/**/*.js';

function swapSrcWithLib(srcPath) {
  const parts = srcPath.split(path.sep);
  parts[1] = 'dist';
  return parts.join(path.sep);
}

gulp.task('build', function () {
  return gulp.src(scripts, {
      base: base
    })
    .pipe(plumber({
      errorHandler: function (err) {
        gutil.log(err.stack);
      },
    }))
    .pipe(newer({
      dest: base,
      map: swapSrcWithLib,
    }))
    .pipe(through.obj(function (file, enc, callback) {
      gutil.log('Compiling', '\'' + chalk.cyan(file.relative) + '\'...');
      callback(null, file);
    }))
    .pipe(through.obj(function (file, enc, callback) {
      file.path = path.resolve(file.base, swapSrcWithLib(file.relative));
      callback(null, file);
    }))
    .pipe(gulp.dest(base));
});

// gulp.task('watch', ['build'], function () {
//   watch(scripts, {
//     debounceDelay: 200
//   }, function () {
//     gulp.start('build');
//   });
// });
