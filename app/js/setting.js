/**
 * Created by w1003 on 2016/11/6.
 */
const electron = require('electron');
const FileTools = require('./js/FileTools');

var ipc = electron.ipcRenderer;
var remote = electron.remote;


window.onload = ()=> {
    initSystemButton();
    initOnEvent();
};

function initSystemButton() {//初始化系统按钮
    var containerElement = document.getElementById("container");
    closeButton.addEventListener('click', function () {
        ipc.send('close-setting-window');
    });
    containerElement.addEventListener("click", event => {
        var targetElement = event.target;
        if (targetElement.tagName == "BUTTON" && targetElement.id != "save-button") {
            ipc.send('open-file-dialog',targetElement.parentElement.children[0].id);
        } else if (targetElement.id == "save-button") {
            //保存
            getAllValue();
            ipc.send('save-setting',{testPath,replacePath,filterName});
        }
    });
}

function getAllValue() {
    testPath = document.getElementById("test-path").value;
    replacePath = document.getElementById("replace-path").value;
    filterName = document.getElementById("filter-path").value;
    return {testPath, replacePath, filterName};
}
function initOnEvent() {
    ipc.on('selected-directory', (event, arg) => {
        var input = document.getElementById(arg.id);
        input.value = arg.file;
    });
}