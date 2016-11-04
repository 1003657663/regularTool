var readFile = require('./readFile');
var fs = require('fs');

var config = require('./config').config;

var path = config.findPath;//搜索的根目录

readFile.getAllFiles(path, function (err, filePath) {
    //获取到文件路径，下一步处理
    if (err) {
        console.log(err);
        return;
    }
    for(var i=0;i<config.filter;i++){
        if(filePath.indexOf(config.filter[i])!=-1){
            return;
        }
    }
    try {
        var fileContext = fs.readFileSync(filePath, 'utf-8');
        zhushis = [];
        var zhui = 0;
        fileContext = fileContext.replace(/<!--[\s\S]*?-->/mg, function (match, pos) {
            zhushis[zhui] = match;
            zhui++;
            return "$$$$$$$$$$&&&&&&&&&&"
        });
        var reg = config.findReg;
        var regResult = reg.exec(fileContext);
        if (regResult) {

            if (config.isTest) {
                console.log("要替换的文本：" + regResult[0]);
                console.log("替换之后文本：" + regResult[0].replace(config.findReg, config.replaceReg));
            } else {
                fileContext = fileContext.replace(config.findReg, config.replaceReg);
                //注释写回去
                zhui = 0;
                fileContext = fileContext.replace(/\$\$\$\$\$\$\$\$\$\$&&&&&&&&&&/mg, function (match, pos) {
                    return zhushis[zhui++];
                });
                
                //写入
                fs.writeFile(filePath, fileContext, { encoding: 'utf-8', flag: 'w' }, function (err) {
                    if (err) {
                        console.error(filePath + "------" + "写入失败");
                    } else {
                        console.log(filePath + "-------" + "写入成功");
                    }
                });
            }
        } else {
            console.log(filePath+"---------匹配失败");
        }
    } catch (err) {
        console.error(err);
        return;
    }

});