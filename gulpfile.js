var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	sass = require('gulp-ruby-sass'), //variant 1 author
	compass = require('gulp-compass'), //variant 2
	concat  = require('gulp-concat');


var coffeeSources = ['components/coffe/*.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true}).on('error', gutil.log ))
		.pipe(gulp.dest('components/scripts'))

});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('scripts.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
});

//variant 1
// gulp.task('compass', function() {
// 	gulp.src(sassSources)
// 		.pipe(compass({
// 			comments: true,
// 			sass: 'components/sass',
// 			images: 'builds/development/images',
// 			style: 'expanded'
// 		})
// 		.on('error', gutil.log ))
// 		.pipe(gulp.dest('builds/development/css'))
// });

//variant 2
gulp.task('sass', function() {
   return sass(sassSources, {
     compass: true,
     lineNumbers: true,
     style: 'expanded'
   }).on('error', gutil.log)
   .pipe(gulp.dest('builds/development/css'))
});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['sass']);
});

gulp.task('default', ['coffee', 'js', 'sass']);