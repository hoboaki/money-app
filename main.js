/**
 * @fileOverview
 * エントリーポイント。
 */

// Modules to control application life and create native browser window
const { app, globalShortcut, BrowserWindow, Menu } = require('electron');
const windowStateKeeper = require('electron-window-state');

// Menu設定
const appDisplayName = 'AdelMoney';
const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: '', // 強制的に上書きされるので空文字列にしておく
          submenu: [
            { role: 'about', label: `${appDisplayName}について` },
            { type: 'separator' },
            { role: 'services', label: 'サービス' },
            { type: 'separator' },
            { role: 'hide', label: `${appDisplayName}を隠す` },
            { role: 'hideothers', label: 'ほかを隠す' },
            { role: 'unhide', label: 'すべてを表示' },
            { type: 'separator' },
            { role: 'quit', label: `${appDisplayName}を終了` },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'ファイル',
    submenu: [isMac ? { role: 'close', label: '閉じる' } : { role: 'quit', label: '終了' }],
  },
  // { role: 'editMenu' }
  {
    label: '編集',
    submenu: [
      { role: 'undo', label: '取り消す' },
      { role: 'redo', label: 'やり直す' },
      { type: 'separator' },
      { role: 'cut', label: 'カット' },
      { role: 'copy', label: 'コピー' },
      { role: 'paste', label: 'ペースト' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle', label: 'ペーストしてスタイルを合わせる' },
            { role: 'delete', label: '削除' },
            { role: 'selectAll', label: 'すべてを選択' },
            { type: 'separator' },
            {
              label: 'スピーチ',
              submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
            },
          ]
        : [{ role: 'delete', label: '削除' }, { type: 'separator' }, { role: 'selectAll', label: 'すべてを選択' }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: '表示',
    submenu: [
      ...(isDev
        ? [{ role: 'reload' }, { role: 'forcereload' }, { role: 'toggledevtools' }, { type: 'separator' }]
        : []),
      { role: 'resetzoom', label: '実際のサイズ' },
      { role: 'zoomout', label: '拡大' },
      { role: 'zoomin', label: '縮小' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'フルスクリーンにする', sublabel: 'フルスクリーンを解除' },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: 'ウィンドウ',
    submenu: [
      { role: 'minimize', label: 'しまう' },
      { role: 'zoom', label: '拡大／縮小' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front', label: 'すべてを手前に移動' },
            { type: 'separator' },
            { role: 'window' },
          ]
        : [{ role: 'close', label: '閉じる' }]),
    ],
  },
  {
    role: 'help',
    // submenu: [
    //   {
    //     label: 'Learn More',
    //     click: async () => {
    //       const { shell } = require('electron');
    //       await shell.openExternal('https://electronjs.org');
    //     },
    //   },
    // ],
  },
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  const state = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 600,
  });
  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 600,
    minHeight: 300,
    titleBarStyle: 'hidden',
    backgroundColor: '#f5f5f6',
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true,
    },
  });
  state.manage(mainWindow);
  //mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadFile('public/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('focus', function() {
    mainWindow.webContents.send('app-message', 'focus');
  });
  mainWindow.on('blur', function() {
    mainWindow.webContents.send('app-message', 'blur');
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  Menu.setApplicationMenu(menu);
  createWindow();
  console.log(menu.items);
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
