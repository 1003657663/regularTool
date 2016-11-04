
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


let win;

function createWindow() {
    console.log('create Window');
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL('file://'+__dirname+'/app/index.html');

    win.on('closed', () => {
        win = null;
    });
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});