// cmd shift B in vscode to launch debug
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs'); //nodes filesystem lib

let mainWindow = null;
const windows = new Set();
// -----------------------------------
// Event Listeners
app.on('ready', () => {
    createWindow();
    //mainWindow = new BrowserWindow({show: false});
    //mainWindow.webContents.openDevTools() in osx, cmd+option+I while program open to toggle debug
    //mainWindow.loadFile('app/index.html');

    //mainWindow.once('ready-to-show', ()=> {
    //    mainWindow.show();
    //});

    //mainWindow.on('closed', () => {
    //    mainWindow = null;
    //});
});

app.on('will-finish-launching', () => {
    app.on('open-file', (event, file) => {
        const win = createWindow();
        win.once('ready-to-show', () => {
            openFile(win, file);
        });
    });
});

// End Event Listeners
// --------------------------------------

// --------------------------------------
// Functions
const createWindow = exports.createWindow = () => {
    let newWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true }
    });
    newWindow.webContents.openDevTools();
    newWindow.loadFile('app/index.html');

    newWindow.once('ready-to-show', () => {
        newWindow.show();
    });

    newWindow.on('closed', () => {
        windows.delete(newWindow);
        newWindow = null;
    });

    windows.add(newWindow); 
    return newWindow;
};


const getFileFromUser = exports.getFileFromUser = (targetWindow) => {

    // triggers OS open file dialog box
    const files = dialog.showOpenDialog( targetWindow, {
        properties: ['openFile']//,
        /*filters: [
            { name: 'Text Files', extensions: ['txt']},
            { name: 'Markdown Files', extensions: ['md', 'markdown']}
        ]*/
    });
    if (files) { openFile(targetWindow, files[0]); }

};

    
const openFile = exports.openFile = (targetWindow, file) => {
    const content = fs.readFileSync(file).toString();
    app.addRecentDocument(file);
    targetWindow.setRepresentedFilename(file);
    targetWindow.webContents.send('file-opened', file, content);
    // send name of file and its contents to renderer process over the file opened channel

}

const saveHtml = exports.saveHtml = (targetWindow, content) => {
    /* Save HTML - 
     * handles opening UI dialogue and writes file
     */
    const file = dialog.showSaveDialog(targetWindow, {
        title: 'Save HTML',
        defaultPath: app.getPath('documents'),
        filters: [
            { name: 'HTML Files', extensions: ['html', 'htm'] }
        ]
    });

    if (!file) return;

    fs.writeFileSync(file, content);
}

const saveMarkdown = exports.saveMarkdown = (targetWindow, file, content) => {
    if (!file) {
        file = dialog.showSaveDialog(targetWindow, {
            title: 'Save Markdown',
            defaultPath: app.getPath('documents'),
            filters: [
                { name: 'Markdown Files', extensions: ['md', 'markdown']}
            ]
        });
    }
    if (!file) return;

    fs.writeFileSync(file, content);
    openFile(targetWindow, file);
}

// End Functions
// ---------------------------------------------