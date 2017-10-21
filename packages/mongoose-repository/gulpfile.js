
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

gulp.task('static', () => gulp.src('**/*.js')
  .pipe(excludeGitignore())
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('nsp', cb => {
  nsp({
    package: path.resolve('package.json')
  }, cb);
});

gulp.task('pre-test', () => gulp.src([
  'lib/**/*.js',
  '!lib/**/*.test.js'
])
  .pipe(excludeGitignore())
  .pipe(istanbul({
    includeUntested: true,
    instrumenter: isparta.Instrumenter
  }))
  .pipe(istanbul.hookRequire()));

gulp.task('test', ['pre-test'], cb => {
  let mochaErr;
  gulp.src([
    'lib/**/*.test.js',
    'test/**/*.js'
  ])
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', err => {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', () => {
      cb(mochaErr);
    });
});

gulp.task('watch', () => {
  gulp.watch(['lib/**/*.js'], ['test']);
});

gulp.task('coveralls', ['test'], () => {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('babel', ['clean'], () => gulp.src('lib/**/*.js')
  .pipe(gulp.dest('dist')));

gulp.task('clean', () => del(['dist', 'coverage']));

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['static', 'test', 'coveralls']);
