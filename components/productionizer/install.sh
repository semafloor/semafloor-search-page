#!/bin/bash

cp -i bower_components/productionizer/gulpfile.babel.js ./ && npm install --save-dev babel-core babel-preset-es2015 del gulp gulp-autoprefixer gulp-babel gulp-cssnano gulp-html-extract gulp-htmlmin gulp-imagemin gulp-minify-html gulp-rename gulp-replace gulp-size gulp-uglify loadsh run-sequence
