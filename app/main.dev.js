/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';
import MenuBuilder from './menu';


const path = require('path');

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = [
//     'REACT_DEVELOPER_TOOLS',
//     'REDUX_DEVTOOLS'
//   ];

//   return Promise
//     .all(extensions.map(name => installer.default(installer[name], forceDownload)))
//     .catch(console.log);
// };


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    // can't download extensions due to firewall
    // await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 689
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

// Spawn python child process

let pyProc = null;
let pyPort = null;

const selectPort = () => {
  pyPort = 4242;
  return pyPort;
};

// Package code
// const PY_DIST_FOLDER = '../pycalcdist';
// const PY_FOLDER = '../pycalc';
// const PY_MODULE = 'api'; // without .py suffix

// const guessPackaged = () => {
//   const fullPath = path.join(__dirname, PY_DIST_FOLDER);
//   return require('fs').existsSync(fullPath);
// };

// const getScriptPath = () => {
//   if (!guessPackaged()) {
//     return path.join(__dirname, PY_FOLDER, `${PY_MODULE}.py`);
//   }
//   if (process.platform === 'win32') {
//     return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, `${PY_MODULE}.exe`);
//   }
//   return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE);
// };

const pyCalcPath = (resolve('./pycalc/'));

const createPyProc = () => {
  const port = selectPort().toString();
  const script = getScriptPath();
  if (guessPackaged()) {
    pyProc = require('child_process').execFile(script, [port, pyCalcPath]);
  } else {
    pyProc = require('child_process').spawn('python3', [script, port, pyCalcPath]);
  }
};

const exitPyProc = () => {
  pyProc.kill();
  pyProc = null;
  pyPort = null;
};

app.on('ready', createPyProc);
app.on('will-quit', exitPyProc);

// init resource

const Resource = require('./utils/resourceResolver');

const tempDir = `${app.getPath('userData')}/pic_temp`;

const resource = new Resource(tempDir);

resource.init();
app.on('quit', resource.dispose);

const ipcMain = require('electron').ipcMain;

ipcMain.on('synchronous-message', (event, arg) => {
  if (arg === 'get-temp-dir') {
    event.returnValue = tempDir;
  }
});
