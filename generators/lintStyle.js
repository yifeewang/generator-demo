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
        brace_style: "none,preserve-inline",
        max_preserve_newlines: 2,
        unindent_chained_methods: false,
        break_chained_methods: true,
        indent_size: 4,
        preserve_newlines: false,
        end_with_newline: true,
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
