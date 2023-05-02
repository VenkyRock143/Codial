
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify-es').default;
const rimraf = require('rimraf');

gulp.task('css', async function(done){
    console.log('minifying css...');
    const { default: rev } = await import('gulp-rev');
    gulp.src('assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    // .pipe(gulp.dest('assets.css'));
     return gulp.src('assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('public/assets'));
    done();
});

gulp.task('js', async function(done){
    console.log('minifying js...');

    const { default: rev } = await import('gulp-rev');
    gulp.src('assets/**/*.js')
    .pipe(uglify())
     return gulp.src('assets/**/*.js')
    .pipe(rev())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('public/assets'));
    done();
});


gulp.task('images', async function(done){
    console.log('compressing image...');

    const { default: rev } = await import('gulp-rev');
    const imagemin = await import('gulp-imagemin').then((module) => module.default);
    gulp.src('assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
     return gulp.src('assets/**/*.+(png|jpg|jepg|svg|gif)')
    .pipe(rev())
    .pipe(gulp.dest('public/assets/images'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('public/assets'));
     done();
});



// empty the public/assets directory
gulp.task('clean:assets', function(done){
    rimraf.sync('./public/assets');
    done();
});

gulp.task('build', gulp.parallel('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});


// exports.default = gulp.series('css');
// exports.default = gulp.series('js');


  