'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
const proxy = require('./src/environments/proxy-config.json');
const env = require('./src/environments/environment.json');
const electron = require('electron');
const path = require('path');
const url = require('url');

const urls = Object.keys(proxy);
const filter = {
    urls: ["file://*"]
}

let win = null;

function createWindow() {
    var electronScreen = electron.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;

    const tray = new electron.Tray(path.join(__dirname, '/src/favicon.ico'));
    tray.setToolTip('FlyTrainer');
    tray.on('click', function () {
        win.show()
    });
    const menu = electron.Menu.buildFromTemplate([
        {
            label: 'Quit',
            click() { electron.app.quit(); }
        }
    ]);
    tray.setContextMenu(menu);

    // Create the browser window.
    win = new electron.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        icon: path.join(__dirname, '/src/favicon.ico'),
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/dist/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    electron.session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
        if (details.resourceType === 'xhr') {
            for (let path of urls) {
                const index = details.url.indexOf(path);
                if (index !== -1) {
                    return callback({ redirectURL: proxy[path].target + details.url.substring(index) });
                }
            }
            return callback({ redirectURL: env.endpoint + details.url.replace(/file:\/\/\/(.:|)/, '') });
        }
        callback(details);
    })

    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    win.webContents.on('new-window', function(event, url){
        event.preventDefault();
        electron.shell.openExternal(url);
    });
    console.log(win.webContents.session.getUserAgent());
    return win;
}
try {
    electron.app.allowRendererProcessReuse = true;
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron.app.on('ready', function () { return setTimeout(createWindow, 400); });
    // Quit when all windows are closed.
    electron.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron.app.quit();
        }
    });
    electron.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}