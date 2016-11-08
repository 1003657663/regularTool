/**
 * Created by w1003 on 2016/11/6.
 */
const electron = require('electron');
const FileTools = require('./js/FileTools');

var ipc = electron.ipcRenderer;
var remote = electron.remote;


window.onload = () => {
    initSystemButton();
    initOnEvent();
};

function initSystemButton() {//初始化系统按钮
    var containerElement = document.getElementById("container");
    var closeButton = document.getElementById("close-button");
    closeButton.addEventListener('click', function () {
        ipc.send('close-setting-window');
    });
    var testButton = document.getElementById("test-button");
    var replaceButton = document.getElementById("replace-button");
    var saveButton = document.getElementById("save-button");
    var maskChoose = document.getElementById("folder-file");

    var folderButton = document.getElementById("folder-button");
    var fileButton = document.getElementById("file-button");

    testButton.addEventListener("click", event => {
        ipc.send('open-file-dialog', 'test-path');
    });
    replaceButton.addEventListener("click", event => {
        maskChoose.style.display = "flex";
    });
    saveButton.addEventListener("click", event => {
        getAllValue();
        if (testPath != "" && !FileTools.hasFile(testPath)) {
            alert("测试路径有误");
            return;
        }
        ipc.send('save-setting', {testPath, replacePath, filterName});
        ipc.send('close-setting-window');
    });

    folderButton.addEventListener("click", () => {
        maskChoose.style.display = "none";
        ipc.send('open-file-dialog', 'replace-folder');
    });

    fileButton.addEventListener("click", () => {
        maskChoose.style.display = "none";
        ipc.send('open-file-dialog', 'replace-file');
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
        if (arg.id == "replace-path") {
            let value = input.value;
            if (value != "" && value[value.length - 1] != ",") {
                value = value + ',';
            }
            input.value = value + arg.file;
        } else {
            input.value = arg.file;
        }
    });
}