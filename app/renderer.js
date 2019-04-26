const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const marked = require('marked');

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
///////////////////
// ------ Functions
const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked(markdown, { sanitize: true});
};

//////////////////
// ---- event listeners
markdownView.addEventListener('keyup', (event) => {
    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
});

openFileButton.addEventListener('click', () => {
    mainProcess.getFileFromUser(currentWindow);
});

newFileButton.addEventListener('click', () => {
    mainProcess.createWindow();
})

ipcRenderer.on('file-opened', (event, file, content) => {
    //listen from mainprocess on channel file-opened for contents and filename
    //takes two args: channel and a callback function w/ the action to take when renderer process rcvs msg on the channel
    markdownView.value = content;
    renderMarkdownToHtml(content);
})
//////////////////