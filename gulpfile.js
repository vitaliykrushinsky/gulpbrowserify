var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	sass = require('gulp-ruby-sass'), //variant 1 author
	compass = require('gulp-compass'), //variant 2
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHtml = require('gulp-minify-html'),
	jsonminify = require('gulp-jsonminify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	concat  = require('gulp-concat');

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development'; // if NODE_ENV doesn't work in terminal command on PC, force change to 'production', before run 'gulp' command

if (env === 'development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

coffeeSources = ['components/coffe/*.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true}).on('error', gutil.log ))
		.pipe(gulp.dest('components/scripts'))

});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

//variant 1
// gulp.task('compass', function() {
// 	gulp.src(sassSources)
// 		.pipe(compass({
// 			comments: true,
// 			sass: 'components/sass',
// 			image: outputDir + 'images',
// 			style: sassStyle
// 		})
// 		.on('error', gutil.log ))
// 		.pipe(gulp.dest(outputDir + 'css'))
//		.pipe(connect.reload())
// });

//variant 2
gulp.task('sass', function() {
   return sass(sassSources, {
     compass: true,
     lineNumbers: true,
     style: sassStyle
   }).on('error', gutil.log)
   .pipe(gulp.dest(outputDir + 'css'))
   .pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['sass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/js/*.json', ['json']);
	gulp.watch('builds/development/images/**/*.*', ['images']);

});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'production', minifyHtml()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
	.pipe(connect.reload())
});

gulp.task('images', function() {
	gulp.src('builds/development/images/**/*.*')
	.pipe(gulpif(env === 'production', imagemin({
		progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant({quality: '65-80', speed: 4})]
	})))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
	.pipe(connect.reload())
});

gulp.task('json', function() {
	gulp.src('builds/development/js/*.json')
	.pipe(gulpif(env === 'production', jsonminify()))
	.pipe(gulpif(env === 'production', gulp.dest('builds/production/js/')))
	.pipe(connect.reload())
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'sass', 'images', 'connect', 'watch']);