const beautify = require("gulp-beautify");
const htmlbeautify = require("gulp-html-beautify");
const gulpif = require("gulp-if");
const { filterJsFile, filterHtmlFile } = require("./tool");

module.exports = ctx => {
  // 通过流转换输出文件
  // Js beautify
  ctx.registerTransformStream(
    gulpif(
      filterJsFile,
      beautify({
        indent_size: 4,
        preserve_newlines: false,
        css: {
          indent_size: 4
        }
      })
    )
  );
  // Html beautify
  ctx.registerTransformStream(
    gulpif(
      filterHtmlFile,
      htmlbeautify({
        indent_size: 4,
        preserve_newlines: false,
        end_with_newline: true
      })
    )
  );
};
