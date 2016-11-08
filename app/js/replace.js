var FileTools = require('./FileTools');
var fs = require('fs');

var setting = require('./config').config;

var path = setting.findPath;//搜索的根目录

module.exports = function (path,setting, callBack) {

    FileTools.getAllFiles(path, function (err, filePath) {
        //获取到文件路径，下一步处理
        if (err) {
            callBack(err, filePath);
            return;
        }
        for (var i = 0; i < setting.filterNames.length; i++) {
            if (filePath.indexOf(setting.filterNames[i]) != -1) {
                return;
            }
        }
        FileTools.readFile(filePath, function (err, fileContext) {
            zhushis = [];
            var zhui = 0;
            fileContext = fileContext.replace(/<!--[\s\S]*?-->/mg, function (match, pos) {
                zhushis[zhui] = match;
                zhui++;
                return "$$$$$$$$$$&&&&&&&&&&"
            });
            var reg = setting.findReg;
            var regResult = reg.exec(fileContext);
            if (regResult) {

                if (setting.isTest) {
                    callBack(undefined,"要替换的文本：" + regResult[0]);
                    callBack(undefined,"替换之后文本：" + regResult[0].replace(setting.findReg, setting.replaceText));
                } else {
                    fileContext = fileContext.replace(setting.findReg, setting.replaceText);
                    //注释写回去
                    zhui = 0;
                    fileContext = fileContext.replace(/\$\$\$\$\$\$\$\$\$\$&&&&&&&&&&/mg, function (match, pos) {
                        return zhushis[zhui++];
                    });

                    //写入
                    fs.writeFile(filePath, fileContext, {encoding: 'utf-8', flag: 'w'}, function (err) {
                        if (err) {
                            callBack(undefined,`${filePath}------写入失败`);
                        } else {
                            callBack(undefined,`${filePath}-------写入成功`);
                        }
                    });
                }
            } else {
                callBack(new Error(`匹配失败`),filePath);
            }
        });

    });
};