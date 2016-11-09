const electron = require('electron');
var ipc = electron.ipcRenderer;

window.onload = () => {
    initSystemButton();
}


/**
 * 初始化系统按钮点击
 */
function initSystemButton() {
    var closeButton = document.getElementById("close-button");
    var minimizeButton = document.getElementById('minimize-button');

    closeButton.addEventListener('click', function () {
        ipc.send('close-file-window');
    });
    minimizeButton.addEventListener('click', function () {
        ipc.send('minimize-file-window');
    });
    

    ipc.on('show-file-context', (event, context, filePath) => {
        var title = document.getElementById("title");
        title.innerText = filePath;
        var container = document.getElementById("container");
        container.innerText = context;
    });
}