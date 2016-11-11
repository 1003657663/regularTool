const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

let indexWebContents = null;
let win;
let settingWin;
let fileContextWin;

initApp();
initSystemButton();

//----------------------创建全局数据

//----------------------全局数据结束

function initApp() {
    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
        app.quit();
    });

    app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });
}

function createWindow() {
    win = new BrowserWindow({ frame: false, width: 800, height: 600 });
    win.loadURL(`file://${__dirname}/app/index.html`);
    win.on('closed', () => {
        win = null;
        settingWin = null;
    });
    indexWebContents = win.webContents;
}

function initSystemButton() {
    ipc.on('window-all-closed', () => {//窗口关闭
        app.quit();
    });
    ipc.on('window-all-minimize', () => {//窗口最小化
        win.minimize();
    });
    ipc.on('open-setting-window', () => {//打开设置窗口
        if (settingWin == null) {
            settingWin = new BrowserWindow({ frame: false, parent: win, width: 400, height: 400 });
            settingWin.loadURL('file://' + __dirname + '/app/setting.html');
            settingWin.on('closed', () => {
                settingWin = null;
            });
        }
        settingWin.show();
    });
    ipc.on('close-setting-window', () => {
        settingWin.hide();
    });
    ipc.on('save-setting', (event, message) => {
        win.webContents.send('save-setting', message);
    });

    ipc.on('open-file-dialog', (event, arg) => {
        let dialog = electron.dialog;
        var openArg = "";
        var returnID = "";
        if (arg == "test-path") {
            openArg = "openFile";
            returnID = "test-path";
        } else if (arg == "replace-folder") {
            openArg = "openDirectory";
            returnID = "replace-path";
        } else {
            openArg = "multiSelections";
            returnID = "replace-path";
        }
        dialog.showOpenDialog({
            properties: ['openFile', openArg]
        }, files => {
            if (files) {
                event.sender.send('selected-directory', {
                    file: files,
                    id: returnID
                });
            }
        });
    });
    ipc.on('open-file-context-window', (event, context, filePath) => {
        if (fileContextWin == null) {
            fileContextWin = new BrowserWindow({ frame: false, width: 800, height: 600 });
            fileContextWin.loadURL('file://' + __dirname + '/app/fileContext.html');
            fileContextWin.on('closed', () => {
                fileContextWin = null;
            });
            fileContextWin.webContents.on('did-finish-load', () => {
                console.log('ready');
                fileContextWin.webContents.send('show-file-context', context, filePath);
            });
            fileContextWin.on('closed', () => {
                fileContextWin = null;
            });
        }else{
            fileContextWin.webContents.send('show-file-context', context, filePath);
        }
        fileContextWin.show();
    });
    ipc.on('update-file-context', (event, context, filePath) => {
        if (fileContextWin) {
            fileContextWin.webContents.send('show-file-context', context, filePath);
        }
    });
    ipc.on('close-file-window', () => {
        if (fileContextWin) {
            fileContextWin.close();
        }
    });
    ipc.on('minimize-file-window', () => {
        if (fileContextWin) {
            fileContextWin.minimize();
        }
    })
}