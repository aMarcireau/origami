const electron = require('electron');
const fs = require('fs');
const path = require('path');

const stateFilename = path.join(__dirname, 'state.json');

const menuTemplate = [
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'},
        ],
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'},
        ],
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
        ],
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() {
                    electron.shell.openExternal('https://github.com/aMarcireau/origami');
                },
            },
        ],
    },
];
if (process.platform === 'darwin') {
    menuTemplate.unshift({
        label: electron.app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'},
        ],
    });
    menuTemplate[1].submenu.push(
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'},
            ],
        }
    );
    menuTemplate[3].submenu = [
        {role: 'close'},
        {role: 'minimize'},
        {role: 'zoom'},
        {type: 'separator'},
        {role: 'front'},
    ];
}
const menu = electron.Menu.buildFromTemplate(menuTemplate);

let mainWindow;

function createWindow() {
    fs.readFile(stateFilename, (error, data) => {
        mainWindow = new electron.BrowserWindow({
            width: 1280,
            height: 720,
            minWidth: 650,
            minHeight: 300,
            show: false,
            webPreferences: {experimentalFeatures: true},
            icon: path.join(__dirname, 'origami.png'),
        });
        mainWindow.on('closed', () => {
            mainWindow = null;
        });

        /// set-title sets the window title.
        ///     filename: string, the filename to display
        ///     edited: bool, true shows an 'Edited' tag
        electron.ipcMain.on('set-title', (event, filename, edited) => {
            mainWindow.setTitle(`${filename ? filename : 'Untitled'}${edited ? ' — Edited' : ''}`);
        });

        /// 'clear-cookies' resets the browser's cookies and sends back 'cookie-cleared'.
        electron.ipcMain.on('clear-cookies', event => {
            mainWindow.webContents.session.clearStorageData(() => {
                event.sender.send('cookies-cleared');
            });
        });

        /// 'save' stores the given data to the state file and sends back 'saved'.
        ///     data: string, content to write to the state file
        ///     title: string, title for the browser window
        electron.ipcMain.on('save', (event, data) => {
            fs.writeFile(stateFilename, data, () => {
                event.sender.send('saved');
            });
        });

        /// 'save-to-file' stores the given data to the given file and sends back 'saved-to-file'.
        ///     filename: string, path to write to, null opens a prompt
        ///     data: string, content to write to the state file
        /// 'saved-to-file' arguments:
        ///     cancelled: bool, true if the save was cancelled
        ///     failed: bool, true if the save failed
        ///     filename: string, the filename used if the save was not cancelled
        electron.ipcMain.on('save-to-file', (event, filename, data) => {
            if (filename == null) {
                electron.dialog.showSaveDialog(
                    mainWindow,
                    {
                        filters: [{name: 'JSON', extensions: ['json']}],
                    },
                    filePaths => {
                        if (filePaths == null) {
                            event.sender.send('saved-to-file', true, false, null);
                        } else {
                            fs.writeFile(filePaths, data, error => {
                                if (error) {
                                    event.sender.send('saved-to-file', false, true, filePaths);
                                } else {
                                    event.sender.send('saved-to-file', false, false, filePaths);
                                }
                            });
                        }
                    }
                );
            } else {
                fs.writeFile(filename, data, error => {
                    if (error) {
                        event.sender.send('saved-to-file', false, true, filename);
                    } else {
                        event.sender.send('saved-to-file', false, false, filename);
                    }
                })
            }
        });

        /// 'save-to-file-then-new' prompts wether save is required, stores the given data and sends back 'saved-to-file-then-new'.
        ///     filename: string, path to write to, null opens a prompt
        ///     data: string, content to write to the state file
        /// 'saved-to-file-then-new' arguments:
        ///     cancelled: bool, true if the save was cancelled
        ///     failed: bool, true if the save failed
        ///     filename: string, the filename used if the save was not cancelled
        electron.ipcMain.on('save-to-file-then-new', (event, filename, data) => {
            electron.dialog.showMessageBox(
                mainWindow,
                {
                    type: 'question',
                    buttons: ['Save', 'Cancel', 'Don\'t Save'],
                    message: 'Do you want to save your changes?',
                },
                response => {
                    if (response === 2) {
                        event.sender.send('saved-to-file-then-new', false, false, null);
                    } else if (response === 1) {
                        event.sender.send('saved-to-file-then-new', true, false, null);
                    } else {
                        if (filename == null) {
                            electron.dialog.showSaveDialog(
                                mainWindow,
                                {
                                    filters: [{name: 'JSON', extensions: ['json']}],
                                },
                                filePaths => {
                                    if (filePaths == null) {
                                        event.sender.send('saved-to-file-then-new', true, false, null);
                                    } else {
                                        fs.writeFile(filePaths, data, error => {
                                            if (error) {
                                                event.sender.send('saved-to-file-then-new', false, true, filePaths);
                                            } else {
                                                event.sender.send('saved-to-file-then-new', false, false, filePaths);
                                            }
                                        });
                                    }
                                }
                            );
                        } else {
                            fs.writeFile(filename, data, error => {
                                if (error) {
                                    event.sender.send('saved-to-file-then-new', false, true, filename);
                                } else {
                                    event.sender.send('saved-to-file-then-new', false, false, filename);
                                }
                            })
                        }

                    }
                }
            );
        });

        /// 'save-to-file-then-open' prompts wether save is required, stores the given data,
        /// prompts for a file to open and sends back its contents with 'saved-to-file-then-opened'.
        ///     filename: string, path to write to, null opens a prompt
        ///     data: string, content to write to the state file
        /// 'saved-to-file-then-opened' arguments:
        ///     cancelledSave: bool, true if the save was cancelled
        ///     cancelledOpen: bool, true if the opening was cancelled
        ///     saveFailed: bool, true if the save failed
        ///     openFailed: bool, true if the opening failed
        ///     saveFilename: string, the filename used if the save was not cancelled
        ///     openFilename: string, the filename used if the opening was not cancelled
        ///     data: buffer, content of the opened file
        electron.ipcMain.on('save-to-file-then-open', (event, filename, data) => {
            const openFileDialog = saveFilename => {
                electron.dialog.showOpenDialog(
                    mainWindow,
                    {
                        filters: [{name: 'JSON', extensions: ['json']}],
                    },
                    filePaths => {
                        if (filePaths == null) {
                            event.sender.send('saved-to-file-then-opened', false, true, false, false, saveFilename, null, null);
                        } else {
                            fs.readFile(filePaths[0], (error, data) => {
                                if (error) {
                                    event.sender.send('saved-to-file-then-opened', false, false, false, true, saveFilename, filePaths[0], null);
                                } else {
                                    event.sender.send('saved-to-file-then-opened', false, false, false, false, saveFilename, filePaths[0], data);
                                }
                            });
                        }
                    }
                );
            };
            electron.dialog.showMessageBox(
                mainWindow,
                {
                    type: 'question',
                    buttons: ['Save', 'Cancel', 'Don\'t Save'],
                    message: 'Do you want to save your changes?',
                },
                response => {
                    if (response === 2) {
                        openFileDialog(null);
                    } else if (response === 1) {
                        event.sender.send('saved-to-file-then-opened', true, false, false, false, null, null, null);
                    } else {
                        if (filename == null) {
                            electron.dialog.showSaveDialog(
                                mainWindow,
                                {
                                    filters: [{name: 'JSON', extensions: ['json']}],
                                },
                                filePaths => {
                                    if (filePaths == null) {
                                        event.sender.send('saved-to-file-then-opened', true, false, false, false, null, null, null);
                                    } else {
                                        fs.writeFile(filePaths, data, error => {
                                            if (error) {
                                                event.sender.send('saved-to-file-then-opened', false, false, true, false, filePaths, null, null);
                                            } else {
                                                openFileDialog(filePaths);
                                            }
                                        });
                                    }
                                }
                            );
                        } else {
                            fs.writeFile(filename, data, error => {
                                if (error) {
                                    event.sender.send('saved-to-file-then-opened', false, false, true, false, filename, null, null);
                                } else {
                                    openFileDialog(filename);
                                }
                            })
                        }
                    }
                }
            );
        });

        /// 'open' prompts for a file to open and sends back its contents with 'opened'.
        /// 'opened' arguments:
        ///     cancelled: bool, true if the opening was cancelled
        ///     failed: bool, true if the opening failed
        ///     filename: string, the filename used if the opening was not cancelled
        ///     data: buffer, content of the opened file
        electron.ipcMain.on('open', event => {
            electron.dialog.showOpenDialog(
                mainWindow,
                {
                    filters: [{name: 'JSON', extensions: ['json']}],
                },
                filePaths => {
                    if (filePaths == null) {
                        event.sender.send('opened', true, false, null, null);
                    } else {
                        fs.readFile(filePaths[0], (error, data) => {
                            if (error) {
                                event.sender.send('opened', false , true, filePaths[0], null);
                            } else {
                                event.sender.send('opened', false, false, filePaths[0], data);
                            }
                        });
                    }
                }
            );
        });

        /// 'import-publications' prompts for a file to open and sends back its contents with 'imported-publications'.
        /// 'imported-publications' arguments:
        ///     cancelled: bool, true if the opening was cancelled
        ///     failed: bool, true if the opening failed
        ///     filename: string, the filename used if the opening was not cancelled
        ///     data: buffer, content of the opened file
        electron.ipcMain.on('import-publications', event => {
            electron.dialog.showOpenDialog(
                mainWindow,
                {
                    filters: [{name: 'JSON', extensions: ['json']}],
                },
                filePaths => {
                    if (filePaths == null) {
                        event.sender.send('imported-publications', true, false, null, null);
                    } else {
                        fs.readFile(filePaths[0], (error, data) => {
                            if (error) {
                                event.sender.send('imported-publications', false , true, filePaths[0], null);
                            } else {
                                event.sender.send('imported-publications', false, false, filePaths[0], data);
                            }
                        });
                    }
                }
            );
        });

        /// 'export-bibtex' stores the given data to the given file and sends back 'exported-bibtex'.
        ///     data: string, content to write to the bibtex file
        /// 'exported-bibtex' arguments:
        ///     failed: bool, true if the save failed
        ///     filename: string, the filename used if the save was not cancelled
        electron.ipcMain.on('export-bibtex', (event, data) => {
            electron.dialog.showSaveDialog(
                mainWindow,
                {
                    filters: [{name: 'BibTex', extensions: ['bib']}],
                },
                filePaths => {
                    if (filePaths == null) {
                        event.sender.send('exported-bibtex', false, null);
                    } else {
                        fs.writeFile(filePaths, data, error => {
                            if (error) {
                                event.sender.send('exported-bibtex', true, filePaths);
                            } else {
                                event.sender.send('exported-bibtex', false, filePaths);
                            }
                        });
                    }
                }
            );
        });

        mainWindow.once('ready-to-show', () => {

            mainWindow.openDevTools(); // @DEBUG

            mainWindow.show();
        });
        mainWindow.webContents.once('dom-ready', () => {
            mainWindow.setTitle('Untitled — Edited');
            if (error) {
                mainWindow.webContents.send('startWithState', null);
            } else {
                mainWindow.webContents.send('startWithState', data);
            }
        })
        mainWindow.loadURL(`file://${__dirname}/index.html`);
    });
}

electron.app.on('ready', () => {
    electron.protocol.registerFileProtocol(
        'font',
        (request, callback) => {
            callback({
                path: path.join(__dirname, 'fonts', request.url.substr(7)),
            });
        },
        error => {
            if (error) {
                console.error(error);
            }
        }
    );
    electron.Menu.setApplicationMenu(menu);
});
electron.app.on('ready', createWindow);
electron.app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        electron.app.quit();
    }
});
electron.app.on('activate', () => {
    if (!mainWindow) {
        createWindow();
    }
});
