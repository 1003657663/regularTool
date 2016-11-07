const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

let indexWebContents = null;
let win;
let settingWin;

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
    win = new BrowserWindow({frame: false, width: 800, height: 600});
    win.loadURL(`file://${__dirname}/app/index.html`);
    win.on('closed', () => {
        win = null;
        settingWin = null;
    });
    indexWebContents = win.webContents;
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
            settingWin = new BrowserWindow({frame: false, parent: win, width: 400, height: 400});
            settingWin.loadURL('file://' + __dirname + '/app/setting.html');
            settingWin.on('closed', ()=> {
                settingWin = null;
            });
        }
        settingWin.show();
    });
    ipc.on('close-setting-window', ()=> {
        settingWin.hide();
    });
    ipc.on('save-setting',(event,message)=>{
        win.webContents.send('save-setting',message);
    });

    ipc.on('open-file-dialog', (event, arg) => {
        let dialog = electron.dialog;
        var openArg = "";
        if(arg == "test-path"){
            openArg = "openFile";
        }else{
            openArg = "multiSelections";
        }
        dialog.showOpenDialog({
            properties: ['openFile', openArg]
        }, files => {
            if (files) {
                event.sender.send('selected-directory', {
                    file: files,
                    id: arg
                });
            }
        });
    });
}