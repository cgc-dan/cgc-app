const path = require('path')
const {app, shell, BrowserWindow, ipcMain, screen, Menu, MenuItem, Tray, remote, webContents} = require('electron')


	  
const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('')




let loadingScreen;
const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(
    Object.assign({
      /// define width and height for the window
      width: 330,
      height: 450,
	  minWidth: 330,
	  minHeight: 450,
	  maxWidth: 330,
	  maxHeight: 450,
	  resizable: false,
	  movable: true,
	  closable: true,
	  icon: 'assets/images/favicon/wicon.png',
	  alwaysOnTop: true,
      /// remove the window frame, so it will become a frameless window 
      frame: false,
      /// and set the transparency, to remove any window background color
      transparent: true
    })
  );
 // loadingScreen.setResizable(false);
  loadingScreen.loadURL(
    'file://' + __dirname + '/windows/loading/loading.html'
  );
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
};

let mainWindow = null

function initialize () {
  makeSingleInstance()

function createWindow () {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 550,
	  minHeight: 450,
	  icon: 'assets/images/favicon/wicon.png',
	  frame: false,
	  skipTaskbar: false,
      toolbar: false,
	  titleBarStyle: 'hiddenInset',
	  backgroundColor: '#3E4F4F',
	 show: true,
	 minimizable: true,
	 maximizable: true,
      webPreferences: {
		preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true, 
		devTools: false, // Disable Dev Tools 
      }
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, 'assets/images/favicon/wicon.png')
    }
	
	if (process.platform === 'windows') {
      windowOptions.icon = path.join(__dirname, 'assets/images/favicon/wicon.png')
    }
	
	

 mainWindow = new BrowserWindow(windowOptions);
  mainWindow.webContents.on('did-finish-load' , () => {
  /// then close the loading screen window and show the main window
  if (loadingScreen) { 
  loadingScreen.close();
  }
  mainWindow.show();
})
mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
////	mainWindow.loadURL('https://design-xpro.com')


    // Launch fullscreen with DevTools open, usage: npm run debug
//    if (debug) {
//      mainWindow.webContents.openDevTools()
//      mainWindow.maximize()
//      require('devtron').install()
 //   }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }




//

app.on('ready', () => {
  createLoadingScreen();
  /// add a little bit of delay for tutorial purposes, remove when not needed
  setTimeout(() => {
    createWindow();
  }, 4000);
})


//
  app.on('ready', () => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

initialize()

let tray = null
 app.on('ready', () => {
   tray = new Tray('assets/images/favicon/wiconquit.png')
   tray.setToolTip('Close the App')
   const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: '' }
   ]);
tray.setContextMenu(contextMenu)

   tray.on('click', () => {
        app.quit();
   });
  })
  
  


const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://camgirl.cloud')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
