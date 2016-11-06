/**
 * Created by w1003 on 2016/11/6.
 */
var ipc = require('electron').ipcRenderer;

window.onload = ()=> {
    initSystemButton();
};

function initSystemButton() {
    var closeButton = document.getElementById("close-button");
    var saveButton = document.getElementById("save-button");
    closeButton.addEventListener('click', function () {
        ipc.send('close-setting-window', 'ping');
    });
    saveButton.addEventListener("click", ()=> {

    })
}