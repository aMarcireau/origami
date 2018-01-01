const electron = require('electron');
const fs = require('fs');
const path = require('path');

const stateFilename = path.join(__dirname, 'state.json');
const colorsFilename = path.join(__dirname, 'colors.json');

let mainWindow;

function createWindow() {
    fs.readFile(stateFilename, (jsonError, json) => {
        fs.readFile(colorsFilename, (colorsError, colors) => {
            let colorsAreValid = true;
            if (colorsError) {
                electron.dialog.showErrorBox('Configuration error', `'${__dirname}/colors.json' could not be open for reading`);
                colorsAreValid = false;
            } else {
                try {
                    const parsedColors = JSON.parse(colors);
                    for (const key of [
                        'background',
                        'content',
                        'secondaryContent',
                        'sideBackground',
                        'sideSeparator',
                        'link',
                        'active',
                        'warning',
                        'error',
                        'valid',
                        'placeholder',
                        'tag0',
                        'tag1',
                        'tag2',
                        'tag3',
                        'tag4',
                    ]) {
                        if (!(key in parsedColors) || !(/^#[a-zA-Z0-9]{6}$/.test(parsedColors[key]))) {
                            electron.dialog.showErrorBox('Configuration error', `'${key}' is not a color in '${__dirname}/colors.json'`);
                            colorsAreValid = false;
                            break;
                        }
                        delete parsedColors[key];
                    }
                    if (colorsAreValid && Object.keys(parsedColors).length > 0) {
                        electron.dialog.showErrorBox('Configuration error', `Unexpected keys ${Object.keys(parsedColors).map(key => `'${key}'`).join(', ')} in '${__dirname}/colors.json'`);
                        colorsAreValid = false;
                    }
                } catch (error) {
                    console.error(error);
                    electron.dialog.showErrorBox('Configuration error', `Parsing '${__dirname}/colors.json' failed`);
                }
            }
            if (!colorsAreValid) {
                process.exit(1);
            }
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
                                    event.sender.send('opened', false, true, filePaths[0], null);
                                } else {
                                    event.sender.send('opened', false, false, filePaths[0], data);
                                }
                            });
                        }
                    }
                );
            });

            /// 'backup' moves an existing save and creates a new one, reporting errors with 'backedup'.
            ///     filename: string, file to backup and replace. If null, the auto-save filename is used.
            ///     data: string, content to write to the state file
            /// 'backedup' arguments:
            ///     moveFailed: bool, true if moving the original file failed
            ///     saveFailed: bool, true if creating the new save failed
            ///     filename: string, the created backup filename
            electron.ipcMain.on('backup', (event, filename, data) => {
                if (!filename) {
                    filename = stateFilename;
                }
                const dateAsString = new Date().toISOString().split('T')[0];
                const pathParts = path.parse(filename);
                let backupFilename = `${pathParts.dir}/${pathParts.name}-backup-${dateAsString}${pathParts.ext}`;
                for (let index = 1; ; ++index) {
                    if (!fs.existsSync(backupFilename)) {
                        break;
                    }
                    backupFilename = `${pathParts.dir}/${pathParts.name}-backup-${dateAsString}-${index}${pathParts.ext}`;
                }
                fs.rename(filename, backupFilename, error => {
                    if (error) {
                        event.sender.send('backedup', true, false, backupFilename);
                    } else {
                        fs.writeFile(filename, data, error => {
                            if (error) {
                                event.sender.send('backedup', false, true, backupFilename);
                            } else {
                                event.sender.send('backedup', false, false, backupFilename);
                            }
                        });
                    }
                });
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

            /// 'import-dois' prompts for a file to open and sends back its contents with 'imported-dois'.
            /// 'imported-dois' arguments:
            ///     cancelled: bool, true if the opening was cancelled
            ///     failed: bool, true if the opening failed
            ///     filename: string, the filename used if the opening was not cancelled
            ///     data: buffer, content of the opened file
            electron.ipcMain.on('import-dois', event => {
                electron.dialog.showOpenDialog(
                    mainWindow,
                    {
                        filters: [{name: 'JSON', extensions: ['json']}],
                    },
                    filePaths => {
                        if (filePaths == null) {
                            event.sender.send('imported-dois', true, false, null, null);
                        } else {
                            fs.readFile(filePaths[0], (error, data) => {
                                if (error) {
                                    event.sender.send('imported-dois', false , true, filePaths[0], null);
                                } else {
                                    event.sender.send('imported-dois', false, false, filePaths[0], data);
                                }
                            });
                        }
                    }
                );
            });

            /// 'import-bibtex' prompts for a file to open and sends back its contents with 'imported-bibtex'.
            /// 'imported-bibtex' arguments:
            ///     cancelled: bool, true if the opening was cancelled
            ///     failed: bool, true if the opening failed
            ///     filename: string, the filename used if the opening was not cancelled
            ///     data: buffer, content of the opened file
            electron.ipcMain.on('import-bibtex', event => {
                electron.dialog.showOpenDialog(
                    mainWindow,
                    {
                        filters: [{name: 'BibTeX', extensions: ['bib']}],
                    },
                    filePaths => {
                        if (filePaths == null) {
                            event.sender.send('imported-bibtex', true, false, null, null);
                        } else {
                            fs.readFile(filePaths[0], (error, data) => {
                                if (error) {
                                    event.sender.send('imported-bibtex', false , true, filePaths[0], null);
                                } else {
                                    event.sender.send('imported-bibtex', false, false, filePaths[0], data);
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
                        filters: [{name: 'BibTeX', extensions: ['bib']}],
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
                mainWindow.show();
            });
            mainWindow.webContents.once('dom-ready', () => {
                mainWindow.setTitle('Untitled');
                mainWindow.webContents.send('startWithState', jsonError ? null : json, electron.app.getVersion(), colors);
            });
            mainWindow.loadURL(`file://${__dirname}/index.html`);
        });
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
    if (process.platform === 'darwin') {
        electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate([
            {
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
            },
            {
                label: 'Edit',
                submenu: [
                    {role: 'cut'},
                    {role: 'copy'},
                    {role: 'paste'},
                    {role: 'delete'},
                    {role: 'selectall'},
                    {type: 'separator'},
                    {
                        label: 'Speech',
                        submenu: [
                            {role: 'startspeaking'},
                            {role: 'stopspeaking'},
                        ],
                    },
                ],
            },
            {
                label: 'View',
                submenu: process.env.ORIGAMI_ENV === 'development' ? [
                    {role: 'toggledevtools'},
                    {role: 'togglefullscreen'},
                ] : [
                    {role: 'togglefullscreen'},
                ],
            },
            {
                role: 'window',
                submenu: [
                    {role: 'close'},
                    {role: 'minimize'},
                    {role: 'zoom'},
                    {type: 'separator'},
                    {role: 'front'},
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
        ]));
    }
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
