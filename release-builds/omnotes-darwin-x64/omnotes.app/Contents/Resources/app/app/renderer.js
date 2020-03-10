const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const marked = require('marked');
const path = require('path');

// ----- Variables
const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');
const currentWindow = remote.getCurrentWindow();
let filePath = null;
let originalContent = '';

///////////////////
// ------ Functions
const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked(markdown, { sanitize: true});
};

const saveNoteToOM = (markdown) => {
    /* takes markdown and passes it to the OM server.
     * If the content is different than the last dif
     * we have on server, save it
     * */

}

const updateUserInterface = (isEdited) => {
    let title = 'OM Notes';
    if (filePath) { title = `${path.basename(filePath) } - ${title}`;}
    if (isEdited) { title = `${title} (Edited)`}
    currentWindow.setTitle(title);
    currentWindow.setDocumentEdited(isEdited);

    saveMarkdownButton.disabled = !isEdited
}

//////////////////
// ---- event listeners
markdownView.addEventListener('keyup', (event) => {
    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
    updateUserInterface(currentContent !== originalContent);
});

openFileButton.addEventListener('click', () => {
    mainProcess.getFileFromUser(currentWindow);
});

newFileButton.addEventListener('click', () => {
    mainProcess.createWindow();
})

saveHtmlButton.addEventListener('click', () => {
    mainProcess.saveHtml(currentWindow, htmlView.innerHTML);
})

saveMarkdownButton.addEventListener('click', () => {
    mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value);
})

revertButton.addEventListener('click', () => {
    markdownView.value = originalContent;
    renderMarkdownToHtml(originalContent);
})

ipcRenderer.on('file-opened', (event, file, content) => {
    //listen from mainprocess on channel file-opened for contents and filename
    //takes two args: channel and a callback function w/ the action to take when renderer process rcvs msg on the channel
    filePath = file;
    originalContent = content;

    markdownView.value = content;
    renderMarkdownToHtml(content);
    updateUserInterface();
})


//////////////////