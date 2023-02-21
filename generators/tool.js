const fs = require("fs");
const path = require("path");
// 递归创建目录 异步方法

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  }

  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
}

const getFileExtName = file => {
  const fileDatas = JSON.parse(JSON.stringify(file));
  return path.extname(fileDatas.history[0] || "");
};

// Beautify 优化文件
const filterJsFile = function(file) {
  return getFileExtName(file) === ".js" || getFileExtName(file) === ".json";
};

const filterHtmlFile = function(file) {
  return getFileExtName(file) === ".html";
};

module.exports = {
  mkdirsSync,
  filterJsFile,
  filterHtmlFile
};
