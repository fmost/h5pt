var gulp = require('gulp');
//工具
var autoprefixer = require('gulp-autoprefixer');
var include = require('gulp-file-include');
var gulpSequence = require('gulp-sequence');
var clean = require('gulp-clean');
var removeStrict = require('gulp-remove-use-strict');

//转码
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var css_base64 = require('gulp-css-base64');

//压缩优化
var minifyHtml = require('gulp-htmlmin');
var minifyImage = require('gulp-imagemin');
var minifyJs = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');

//版本控制
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var delOriginal = require('gulp-rev-delete-original');
//localhost
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
//路径定义
var srcPath = {
  root: 'src',
  html: ['src/**/*.html', '!src/include/**/*.html'],
  images : 'src/images/**/*.{png,jpg,jpeg,gif,ico,svg}',
  assets: 'src/assets/**/*',
  css: 'src/css/*.scss',
  js: 'src/js/*.js',
  library: 'src/library/*.js'
},
distPath = {
  root: 'dist',
  html: 'dist',
  images: 'dist/images',
  assets : 'dist/assets',
  css: 'dist/css',
  js: 'dist/js',
  library: 'dist/library',
  manifest: 'dist/**/*.json',
};
// 发布路径
publishPath = '../publish/h5'
//插件库处理
gulp.task('library', ()=> {
  return gulp.src(srcPath.library)
  .pipe(gulp.dest(distPath.library));
})

//生产环境
//css处理
gulp.task('css-dist', () => {
  return gulp.src([distPath.manifest, distPath.css + '/*.css'])
  .pipe(revCollector())
  .pipe(rev())
  .pipe(delOriginal())
  .pipe(gulp.dest( distPath.css))
  .pipe(rev.manifest())
  .pipe(gulp.dest( distPath.css))
})
gulp.task('css-compile', () => {
  return gulp.src(srcPath.css)
  .pipe(css_base64({
    maxWeightResource: 8 * 1024,
  }))
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(minifyCss())
  .pipe(gulp.dest(distPath.css))
})
//js处理
gulp.task('js-dist', ()=>{
  return gulp.src(srcPath.js)
  // .pipe(babel({
  //   presets: ['env'],
  // }))
  .pipe(minifyJs())
  //.pipe(removeStrict())
  .pipe(rev())
  .pipe(gulp.dest(distPath.js))
  .pipe(rev.manifest())
  .pipe(gulp.dest(distPath.js))
})
//image 处理
gulp.task('images-dist', ()=>{
  return gulp.src(srcPath.images)
  .pipe(minifyImage())
  .pipe(rev())
  .pipe(gulp.dest(distPath.images))
  .pipe(rev.manifest())
  .pipe(gulp.dest(distPath.images))
})
//html 处理
gulp.task('html-dist', ()=>{
  return gulp.src([distPath.manifest, ...srcPath.html])
  .pipe(include({
  }))
  .pipe(revCollector())
  .pipe(minifyHtml({
    collapseWhitespace: true,
  }))
  .pipe(gulp.dest(distPath.html))
})
//生产环境，不添加版本号
//css处理
gulp.task('css-dist-nohash', () => {
  return gulp.src(srcPath.css)
  .pipe(css_base64({
    maxWeightResource: 8 * 1024,
  }))
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(minifyCss())
  .pipe(gulp.dest(distPath.css))
})
//js处理
gulp.task('js-dist-nohash', ()=>{
  return gulp.src(srcPath.js)
  .pipe(babel({
    presets: ['env'],
  }))
  .pipe(minifyJs())
  //.pipe(removeStrict())
  .pipe(gulp.dest(distPath.js))
})
//image 处理
gulp.task('images-dist-nohash', ()=>{
  return gulp.src(srcPath.images)
  .pipe(minifyImage())
  .pipe(gulp.dest(distPath.images))
})
//image 处理
gulp.task('images-assets-nohash', ()=>{
  return gulp.src(srcPath.assets)
  .pipe(minifyImage())
  .pipe(gulp.dest(distPath.assets))
})
//html 处理
gulp.task('html-dist-nohash', ()=>{
  return gulp.src(srcPath.html)
  .pipe(include({
  }))
  .pipe(minifyHtml({
    collapseWhitespace: true,
  }))
  .pipe(gulp.dest(distPath.html))
})

//开发环境
//css处理
gulp.task('css-dev', () => {
  return gulp.src(srcPath.css)
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(gulp.dest(distPath.css))
  .pipe(reload({stream: true}))
})
//js处理
gulp.task('js-dev', ()=>{
  return gulp.src(srcPath.js)
  .pipe(gulp.dest(distPath.js))
  .pipe(reload({stream: true}))
})
//library 处理
gulp.task('library-dev', ()=>{
  return gulp.src(srcPath.library)
  .pipe(gulp.dest(distPath.library))
  .pipe(reload({stream: true}))
})

//image 处理
gulp.task('images-dev', ()=>{
  return gulp.src(srcPath.images)
  .pipe(gulp.dest(distPath.images))
  .pipe(reload({stream: true}))

})
//html 处理
gulp.task('html-dev', ()=>{
  return gulp.src(srcPath.html)
  .pipe(include({
  }))
  .pipe(gulp.dest(distPath.html))
  .pipe(reload({stream: true}))
})
// 移动微信jssdk所需文件
gulp.task('move-jssdk-text', ()=>{
  return gulp.src('src/*.txt')
  .pipe(gulp.dest('dist'))
})
//清除dist目录
gulp.task('clean', ()=>{
  return gulp.src('dist/*')
  .pipe(clean({read: false}))
})
//清除manifest
gulp.task('clean-manifest', ()=>{
  return gulp.src('dist/**/*manifest.json')
  .pipe(clean({read: false}))
})
// 清除发布目录
gulp.task('clean-publish', ()=>{
  return gulp.src(publishPath)
  .pipe(clean({read: false}))
})

// 移动文件到发布目录
gulp.task('moveto-publish', () => {
  return gulp.src('dist/**/*')
  .pipe(gulp.dest(publishPath))
})

//静态服务器
gulp.task('browserSync', ()=>{
  browserSync.init({
    server: {
      baseDir: './dist',
      //proxy: 'ip地址',
    }
  })
})
gulp.task('check-dist', ()=>{
  browserSync.init({
    server: {
      baseDir: './dist',
      //proxy: 'ip地址',
    }
  })
})
// build
gulp.task('build', gulpSequence('clean', ['images-dist', 'js-dist', 'library'], 'css-compile', 'css-dist', 'html-dist', 'clean-manifest', 'move-jssdk-text', 'moveto-publish'));
//build-nohash
gulp.task('build-noversion', gulpSequence('clean', ['library','images-assets-nohash', 'css-dist-nohash', 'images-dist-nohash', 'js-dist-nohash', 'html-dist-nohash'],'move-jssdk-text', 'moveto-publish'));
// dev
gulp.task('dev', (cb)=>{
  // gulpSequence('clean', ['library', 'css-dev', 'js-dev', 'html-dev'], 'browserSync')(cb);
  gulpSequence( ['library', 'css-dev', 'js-dev', 'html-dev'], 'browserSync')(cb);
  gulp.watch('src/**/*.scss', ['css-dev']);
  gulp.watch('src/**/*.html', ['html-dev']);
  gulp.watch(srcPath.js, ['js-dev']);
  gulp.watch(srcPath.library, ['library-dev']);
  gulp.watch(srcPath.images, ['images-dev']);
})
