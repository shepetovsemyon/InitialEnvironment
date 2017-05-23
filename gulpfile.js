var gulp    = require('gulp')
sass        = require('gulp-sass')//Подключаем Sass пакет
browserSync = require('browser-sync');// Подключаем Browser Sync
concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
uglify      = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
rename      = require('gulp-rename'); // Подключаем библиотеку для переименования файл  ;
del         = require('del'); // Подключаем библиотеку для удаления файлов и папок


gulp.task('browser-sync', function() {// Создаем таск browser-sync
	browserSync({// Выполняем browser Sync
		server : {// Определяем параметры сервера
			baseDir : 'app' // Директория для сервера - app
		},
		notify : false // Отключаем уведомления
	});
});

gulp.task('sass', function() {// Создаем таск Sass
	return gulp.src('app/sass/**/*.sass')// Берем источник
	.pipe(sass())// Преобразуем Sass в CSS посредством gulp-sass
	.pipe(gulp.dest('app/css'))// Выгружаем результата в папку app/css
	.pipe(browserSync.reload({
		stream : true
	})) // Обновляем CSS на странице при изменении
});

gulp.task('scripts', function() {
	return gulp.src(['app/libs/jquery/dist/jquery.min.js', 'app/libs/bootstrap/dist/js/bootstrap.min.js'])// Берем все необходимые библиотеки
	.pipe(concat('libs.min.js'))// Собираем их в кучу в новом файле libs.min.js
	.pipe(uglify())// Сжимаем JS файл
	.pipe(gulp.dest('app/js'));
	// Выгружаем в папку app/js
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('build', ['sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим CSS стили в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('build', ['clean', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

