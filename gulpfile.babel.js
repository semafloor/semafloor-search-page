'use strict';

const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const extract = require('gulp-html-extract');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const minifyHTML = require('gulp-minify-html');
const sequence = require('run-sequence');
const uglify = require('gulp-uglify');
const size = require('gulp-size');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const _ = require('lodash');

// const imagemin = require('gulp-imagemin');
// const htmlmin = require('gulp-htmlmin');

let transpiler = 'Babel v5';
const SRC = 'src';
const DIST = 'dist';

gulp.task('default', () => {
  console.log(`You're using Gulp with ${transpiler}!`);
});

gulp.task('babel', () => {
  return gulp.src([
    './*.js',
    '!gulpfile.babel.js'
  ])
    .pipe(size({
      showFiles: true,
      title: 'Babel: '
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(size({
      showFiles: true,
      title: 'Babel: '
    }))
    .pipe(size({
      showFiles: true,
      gzip: true,
      title: 'Babel: '
    }))
    .pipe(gulp.dest(DIST));
});

gulp.task('html', () => {
  return gulp.src([
    './*.html',
    './*icons.html',
    '!./*theme.html',
    '!index.html'
  ])
  .pipe(size({
    showFiles: true,
    title: 'HTML: '
  }))
  .pipe(minifyHTML())
  .pipe(gulp.dest(DIST))
  .pipe(size({
    showFiles: true,
    title: 'HTML: '
  }))
  .pipe(size({
    showFiles: true,
    gzip: true,
    title: 'HTML: '
  }));
});

// *page-theme.html
gulp.task('css', () => {
  return gulp.src([
    './*theme.html',
    '!./*list-theme.html',
    '!./*icons.html'
  ])
    .pipe(size({
      showFiles: true,
      title: 'CSS: '
    }))
    .pipe(extract({
      sel: 'style'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      title: 'CSS: '
    }))
    .pipe(cssnano())
    .pipe(rename('minified.css'))
    .pipe(size({
      showFiles: true,
      title: 'CSS: '
    }))
    .pipe(size({
      showFiles: true,
      gzip: true,
      title: 'CSS: '
    }))
    .pipe(gulp.dest('.tmp'));
});
gulp.task('replace', () => {
  return gulp.src([
    './*theme.html',
    '!./*list-theme.html'
  ])
    .pipe(size({
      showFiles: true,
      title: 'Replace: '
    }))
    .pipe(replace(/<style>[\s\S]*<\/style>/, (s) => {
      let style  = fs.readFileSync('.tmp/minified.css', 'utf8');
      return `<style>${style}</style>`;
    }))
    .pipe(minifyHTML())
    .pipe(size({
      showFiles: true,
      title: 'Replace: '
    }))
    .pipe(size({
      showFiles: true,
      gzip: true,
      title: 'Replace: '
    }))
    .pipe(gulp.dest(DIST));
});

// *list-theme.html
gulp.task('css-list', () => {
  return gulp.src([
    './*theme.html',
    '!./*page-theme.html',
    '!./*icons.html'
  ])
    .pipe(size({
      showFiles: true,
      title: 'CSS: '
    }))
    .pipe(extract({
      sel: 'style'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      title: 'CSS: '
    }))
    .pipe(cssnano())
    .pipe(rename('minified.css'))
    .pipe(size({
      showFiles: true,
      title: 'CSS: '
    }))
    .pipe(size({
      showFiles: true,
      gzip: true,
      title: 'CSS: '
    }))
    .pipe(gulp.dest('.tmp'));
});
gulp.task('replace-list', () => {
  return gulp.src([
    './*theme.html',
    '!./*page-theme.html'
  ])
    .pipe(size({
      showFiles: true,
      title: 'Replace: '
    }))
    .pipe(replace(/<style>[\s\S]*<\/style>/, (s) => {
      let style  = fs.readFileSync('.tmp/minified.css', 'utf8');
      return `<style>${style}</style>`;
    }))
    .pipe(minifyHTML())
    .pipe(size({
      showFiles: true,
      title: 'Replace: '
    }))
    .pipe(size({
      showFiles: true,
      gzip: true,
      title: 'Replace: '
    }))
    .pipe(gulp.dest(DIST));
});

gulp.task('clean', () => del([
  `${DIST}/*`,
  '.tmp/*'
]).then((paths) => {
  console.log(`Files and folders deleted:\n${paths.join('\n')}`);
}));

// copy processed files from DIST.
gulp.task('clean-main', () => del([
  './*html',
  './*.js',
  '!./index.html',
  '!./gulpfile.babel.js'
]).then((paths) => {
  console.log(`Files and folders deleted:\n${paths.join('\n')}`);
}));
gulp.task('copy-dist', () => {
  return gulp.src(`${DIST}/*`)
  .pipe(gulp.dest('./'));
});

// dry and copy to backup files to SRC.
gulp.task('dry-src', () => del(`${SRC}/*`).then((paths) => {
  console.log(`Files and folders deleted:\n${paths.join('\n')}`);
}));
gulp.task('backup', ['dry-src'], () => {
  return gulp.src([
    './*.html',
    './*.js',
    '!./gulpfile.babel.js',
    '!./index.html'
  ])
    .pipe(gulp.dest(SRC));
});


// build everything.
gulp.task('build', () => {
  sequence(
    'clean',
    ['babel', 'html', 'css'],
    'replace',
    'clean-main',
    'copy-dist'
  );
});

// revert everything.
gulp.task('copy-src', () => {
  var _ext = ['js', 'html'];
  var i = 0;

  return gulp.src([
   `${SRC}/*.js`,
   `${SRC}/*.html`
  ], (unknown, files) => {
    if (_.isEmpty(files)) {
      console.log(`No .${_ext[i]} files exist!`);
      i++;
    }else {
      return gulp.src([
        `${SRC}/*.js`,
        `${SRC}/*.html`
      ])
        .pipe(gulp.dest('./'))
    }
  });
});
gulp.task('revert', () => {
  var _ext = ['js', 'html'];
  var i = 0;

  return gulp.src([
   `${SRC}/*.js`,
   `${SRC}/*.html`
  ], (unknown, files) => {
    if (_.isEmpty(files)) {
      console.log(`Error: No .${_ext[i]} files exist!`);
      i++;
    }else {
      sequence(
        'clean-main',
        'copy-src',
        'dry-src'
      );
    }
  });
});
