var cte = require('./constante.js');
var hlp = require('./helper.js');

var cssCte = require('./css.js');
var fontCte = require('./font.js');
var htmlCte = require('./html.js');
var nunjucksCte = require('./nunjucks.js');
var imageCte = require('./image.js');
var jsCte = require('./js.js');
var scssCte = require('./scss.js');

var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

gulp.task('default:success-message', function() {
    gutil.log(hlp.styledString(' \\o/ Successfully build ', ['green', 'bold']));
});

gulp.task('default:start-watch-message', function() {
    gutil.log(hlp.styledString(' (o) Now watching files in ' + cte.basePaths.src + ' ', ['inverse']));
});

gulp.task('default:mode-message', function() {
    if (gutil.env.production) {
        gutil.log(hlp.styledString('  >>> Production mode <<<  ', ['green', 'underline']));
    } else {
        gutil.log(hlp.styledString('  <<< Development mode >>>  ', ['red', 'underline']));
    }
});

gulp.task('build', function(callback) {
    runSequence('default:mode-message', 'clean',
        ['css', 'font', 'html', 'image', 'js', 'jshint', 'scss', 'nunjucks'],
        'default:success-message', callback);
});

gulp.task('watch', ['build', 'server'], function(callback) {
    runSequence('default:start-watch-message', callback);

    //gulp.watch(cte.basePaths.dest + '**/*.*', ['server:reload']).on(['add', 'change', 'unlink'], function(evt) {
    //    hlp.changeEvent(evt);
    //});*/

    gulp.watch(cssCte.watchable, ['css']).on(['add', 'change', 'unlink'], function(evt) {
        hlp.changeEvent(evt);
    });

    gulp.watch(fontCte.watchable, ['font']).on(['add', 'change', 'unlink'], function(evt) {
        hlp.changeEvent(evt);
    });

    gulp.watch(htmlCte.watchable, ['html']).on(['add', 'change', 'unlink'], function(evt) {
        hlp.changeEvent(evt);
    });

    gulp.watch(nunjucksCte.watchable, ['nunjucks']).on(['add', 'change', 'unlink'], function(evt) {
        hlp.changeEvent(evt);
    });

    gulp.watch(imageCte.watchable, ['image']).on(['add', 'change', 'unlink'], function(evt) {
        hlp.changeEvent(evt);
    });

    gulp.watch(jsCte.watchable, ['js']).on(['add', 'change', 'unlink'], function(evt) {
        hlp.changeEvent(evt);
    });

    gulp.watch(scssCte.watchable, ['scss']).on(['add', 'change', 'unlink'], function(evt) {
        hlp.changeEvent(evt);
    });
});

gulp.task('default', ['watch']);
