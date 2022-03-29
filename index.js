const index = require('electron');
const app = index.app;
const BrowserWindow = index.BrowserWindow;
const server = require('./src/index'); //The Express server
console.log('ser'+server)
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        // width: 800,
        // height: 600,
        show: false, //Not showing the window until the content loads
        webPreferences: {
            nodeIntegration: true,
            // devTools: false
        },
        title: "React Express Electron App"
    });

    mainWindow.loadURL('http://localhost:3001/');

    // mainWindow.setResizable(false);

    mainWindow.maximize();
    mainWindow.show(); //Showing the window

    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
