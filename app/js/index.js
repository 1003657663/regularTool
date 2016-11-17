/**
 * Created by chao on 2016/3/19.
 */
const electron = require('electron');
var ipc = electron.ipcRenderer;
var Handle = require('./js/Handle');
var FileTools = require('./js/FileTools');
var replace = require('./js/replace');
var setting = {
    testPath: null,
    replacePath: null,
    filterName: null
};
var fileAimText = null;
console.log(Handle);


window.onload = () => {
    initSystem();
    initSystemButton();//初始化系统按钮点击事件
    initOtherButton();
    initToggle();//初始化toggle切换
    initRegTest();//初始化
};

function initSystem() {//初始化index渲染系统
    ipc.on('save-setting', (event, message) => {
        setting = message;
        //如果测试部分不是空，那么输入文字部分消失，自动从文件读取数据
        if (setting.testPath != "") {
            //获取字符串
            getTestFileContext();
        }else{
            //如果测试部分是空的，那么关闭文件窗口，输入文字部分出现
            ipc.send('close-file-window');
            document.getElementById("aim-text").style.display = "block";
        }
    });
}
/**
 * 获取测试文件的内容并更新到窗口
 */
function getTestFileContext(isUpdate) {
    fileAimText = FileTools.readFile(setting.testPath, (err, data) => {
        if (err) {
            alert(err);
        } else {
            fileAimText = data;
            document.getElementById("aim-text").style.display = "none";
            //把获取的文件内容发送给新窗口
            if (isUpdate) {
                ipc.send('update-file-context', fileAimText, setting.testPath);
            } else {
                ipc.send('open-file-context-window', fileAimText, setting.testPath);
            }
        }
    });

}
/**
 * 初始化系统按钮点击
 */
function initSystemButton() {
    var closeButton = document.getElementById("close-button");
    var minimizeButton = document.getElementById('minimize-button');
    var clearLogButton = document.getElementById("clear-log");

    closeButton.addEventListener('click', function () {
        ipc.send('window-all-closed');
    });
    minimizeButton.addEventListener('click', function () {
        ipc.send('window-all-minimize');
    });
    clearLogButton.addEventListener("click",function(){
        var replace = document.getElementById("replace-result");
        replace.innerHTML = "";
    });

}

/**
 * 初始化其他按钮
 */
function initOtherButton() {
    var settingButton = document.getElementById("setting-button");
    settingButton.addEventListener("click", event => {
        ipc.send('open-setting-window');
    });
    var startButton = document.getElementById("start-replace");
    var replaceTextElement = document.getElementById("replace-text");
    var testElement = document.getElementById("reg-text")
    startButton.addEventListener("click", event => {
        setting.replaceText = replaceTextElement.value;
        setting.findReg = getReg(testElement.value);
        setting.filterNames = setting.filterName.split(',').filter((item) => { return (item != ""); });


        if (setting.replacePath) {
            var replacePaths = setting.replacePath.split(',').filter((item) => { return (item != ""); });
        } else {
            alert("替换文件的路径为空，请选择替换文件");
            return;
        }
        for (var i = 0; i < replacePaths.length; i++) {
            replace(replacePaths[i], setting, replaceCallBack);
        }
    });
    // testElement.addEventListener("focus",()=>{
    //     if(setting.testPath){
    //         ipc.send('open-file-context-window', fileAimText, setting.testPath);
    //     }
    // });

}

/**
 * 把regText装换成reg
 */
function getReg(text) {
    if (text[0] != "/") {
        return new RegExp(text,'mg');
    } else {
        var reg = /\/(.*)\/(.*)/;
        var mR = reg.exec(text);
        if (mR) {
            if (mR[2]) {
                return new RegExp(mR[1], mR[2]);
            } else {
                return new RegExp(mR[1], 'mg');
            }
        } else {
            return false;
        }
    }
}
/**
 * 替换callback
 */
function replaceCallBack(err, file) {
    var replace = document.getElementById("replace-result")
    if (err) {
        if (err.message == "update test file") {
            getTestFileContext(true);
            return;
        }
        var span = document.createElement("span");
        span.innerText = `${file}--------${err.message}\r\n`;
        span.style.color = 'red';
        span.style.fontSize = "14px";
        replace.appendChild(span);
    } else {
        var span = document.createElement("span");
        span.innerText = `${file}\r\n`;
        replace.appendChild(span);
    }
    replace.scrollTop = replace.scrollHeight;
}

/**
 * 初始化toggle按钮
 */
function initToggle() {
    var toggleTest = document.getElementById("toggle-test");
    var toggleReplace = document.getElementById("toggle-replace");
    var ul = document.querySelector("#toggle-main>ul");
    toggleTest.addEventListener("click", event => {
        ul.style.left = '0px';
        toggleTest.classList.add("active");
        toggleReplace.classList.remove("active");
    });
    toggleReplace.addEventListener("click", event => {
        ul.style.left = '-100%';
        toggleReplace.classList.add("active");
        toggleTest.classList.remove("active");
    });
}

function initRegTest() {
    var aimTextElement = document.getElementById("aim-text");
    var regTextElement = document.getElementById("reg-text");

    aimTextElement.addEventListener("keyup", () => {
        var {aimText, regText} = getAimText();
        var result = Handle.testReg(aimText, regText);
        showResult(result);
    });
    regTextElement.addEventListener("keyup", () => {
        var {aimText, regText} = getAimText();
        var result = Handle.testReg(aimText, regText);
        showResult(result);
    });

    function getAimText() {
        var regText = regTextElement.value;
        if (setting.testPath) {
            if (fileAimText) {
                var aimText = fileAimText;
                return { aimText, regText };
            }
        } else {
            var aimText = aimTextElement.value;
            return { aimText, regText };
        }
    }
}

function showResult(result) {
    var matchResult = document.getElementById("match-result");
    var dF = document.createDocumentFragment();
    matchResult.innerHTML = "";

    if (Array.isArray(result)) {
        for (var i = 0; i < result.length; i++) {
            var div = getResultDiv(i, result[i]);
            dF.appendChild(div);
        }
        matchResult.appendChild(dF);
    } else {
        if (result == Handle.Error.RegError) {

        } else if (result == Handle.Error.NoMatchError) {
            matchResult.innerHTML = "匹配不到";
        }
    }

    function getResultDiv(order, context) {
        var div = document.createElement("div");
        div.className = "list-group match-result-one";
        div.id = "match-result";

        var span = document.createElement("span");
        var h6 = document.createElement("h6");
        h6.innerText = order;
        span.appendChild(h6);
        div.appendChild(span);
        var pre = document.createElement("pre");
        pre.innerText = context;
        div.appendChild(pre);
        return div;
    }
}