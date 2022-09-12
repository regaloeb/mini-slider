// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');
var lazypipe = require('lazypipe');
var optimizejs = require('gulp-optimize-js');
var flatmap = require('gulp-flatmap');
var log = require('fancy-log');
var util = require("gulp-util");

// SVGs
var svgmin = require('gulp-svgmin');
var svgo = require('gulp-svgo');

// File paths
const files = { 
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/*',
    jsWorkPath: 'src/js/**/*.js'
}
var paths = {
	input: 'src/',
	output: 'dist/',
	scripts: {
		input: 'src/js/*',
		polyfills: '.polyfill.js',
		output: 'dist/javascripts/'
	},
	styles: {
		input: 'src/scss/**/*.{scss,sass}',
		output: 'dist/css/'
	},
	reload: './dist/'
};
// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist/css')); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
jsTasks = 
    lazypipe()
    //.pipe(concat('all.js'))
    .pipe(uglify)
    .pipe(optimizejs)
    .pipe(dest, 'dist/javascripts/');

var buildScripts = function (done) {
	// Run tasks on script files
	return src([
    files.jsPath
    //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
    ])
		.pipe(flatmap(function(stream, file) {
			// If the file is a directory
			if (file.isDirectory()) {

				// Grab all files and concatenate them
				src(file.path + '/*.js')
					.pipe(concat(file.relative + '.js'))
					.pipe(jsTasks());

				return stream;

			}
      else{
        // Otherwise, process the file
        return stream.pipe(jsTasks());
      }

		}));

};

// Watch for changes
var watchSource = function (done) {
  util.log("================================= watchSource");
	//watch(paths.input, series(exports.default));
	watch(paths.input, series(scssTask, buildScripts));
	done();
};
//just build
var build = function(done){
  util.log("================================= build");
  buildScripts();
  scssTask();
  done();
}
exports.build = build;


// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask, buildScripts), 
   // cacheBustTask,
    watchSource
);
