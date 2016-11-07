/**
 * Created by chao on 2016/3/19.
 */
const electron = require('electron');
var ipc = electron.ipcRenderer;
var Handle = require('./js/Handle');
var FileTools = require('./js/FileTools');
var setting = null;
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
            fileAimText = FileTools.readFile(setting.testPath, (err, data) => {
                if (err) {
                    alert(err);
                    return;
                } else {
                    fileAimText = data;
                }
            });
            //输入文字部分消失---wait
        }
    });
}
/**
 * 初始化系统按钮点击
 */
function initSystemButton() {
    var closeButton = document.getElementById("close-button");
    var minimizeButton = document.getElementById('minimize-button');

    closeButton.addEventListener('click', function () {
        ipc.send('window-all-closed');
    });
    minimizeButton.addEventListener('click', function () {
        ipc.send('window-all-minimize');
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

    var aimText = "", regText = "";

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