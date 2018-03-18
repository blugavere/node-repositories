'use strict';

const path = require('path');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nsp = require('gulp-nsp');
const plumber = require('gulp-plumber');
const del = require('del');

gulp.task('nsp', cb => {
  nsp({
    package: path.resolve('package.json')
  }, cb);
});

gulp.task('test', cb => {
  let mochaErr;
  gulp.src([
      'lib/**/*.test.ts',
      'test/**/*.ts'
    ])
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'dot',
      require: [
        'ts-node/register',
        'source-map-support/register'
      ]
    }))
    .on('error', err => {
      mochaErr = err;
    })
    .on('end', () => {
      cb(mochaErr);
    });
});

gulp.task('watch', () => {
  gulp.watch(['lib/**/*.ts'], ['test']);
});

gulp.task('babel', ['clean'], () => gulp.src('lib/**/*.ts')
  .pipe(gulp.dest('dist')));

gulp.task('clean', () => del(['dist', 'coverage', '.nyc_output']));

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['test']);
