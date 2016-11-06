const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

let win;
let settingWin;

initApp();
initSystemButton();

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
    win = new BrowserWindow({frame: false, width: 800, height: 600});
    win.loadURL('file://' + __dirname + '/app/index.html');
    win.on('closed', () => {
        win = null;
        settingWin = null;
    });
}

function initSystemButton() {
    ipc.on('window-all-closed', ()=> {//窗口关闭
        app.quit();
    });
    ipc.on('window-all-minimize', ()=> {//窗口最小化
        win.minimize();
    });
    ipc.on('open-setting-window', ()=> {//打开设置窗口
        if (settingWin == null) {
            settingWin = new BrowserWindow({frame:false,parent: win, width: 300, height: 400});
            settingWin.loadURL('file://' + __dirname + '/app/setting.html');
            settingWin.on('closed', ()=> {
                settingWin = null;
            });
        }
        settingWin.show();
    });
    ipc.on('close-setting-window',()=>{
        settingWin.hide();
    })
}