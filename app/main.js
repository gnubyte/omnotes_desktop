// cmd shift B in vscode to launch debug
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs'); //nodes filesystem lib

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({show: false});
    //mainWindow.webContents.openDevTools() in osx, cmd+option+I while program open to toggle debug
    mainWindow.loadFile('app/index.html');

    mainWindow.once('ready-to-show', ()=> {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});


const getFileFromUser = exports.getFileFromUser = () => {

    // triggers OS open file dialog box
    const files = dialog.showOpenDialog({
        properties: ['openFile']//,
        /*filters: [
            { name: 'Text Files', extensions: ['txt']},
            { name: 'Markdown Files', extensions: ['md', 'markdown']}
        ]*/
    });
    if (files) { openFile(files[0]); }

};

    
const openFile = (file) => {
    const content = fs.readFileSync(file).toString();
    mainWindow.webContents.send('file-opened', file, content);
    // send name of file and its contents to renderer process over the file opened channel
}