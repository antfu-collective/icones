import path from 'node:path'
import { app, BrowserWindow, shell } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

let mainWindow: BrowserWindow | null = null

app.disableHardwareAcceleration()

const PROJECT_ROOT = path.resolve(__dirname, '../..')

async function createMainWindow() {
  const win = new BrowserWindow({
    title: app.name,
    show: false,
    width: 660,
    height: 500,
    minWidth: 200,
    minHeight: 200,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (app.isPackaged) {
    win.loadFile(path.join(PROJECT_ROOT, 'dist/index.html'))
    win.removeMenu()
  }
  else {
    win.loadURL('http://localhost:3333/')
    win.webContents.openDevTools()
    await installExtension(VUEJS_DEVTOOLS)
  }

  win.on('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    mainWindow = null
  })

  const handleRedirect = (e: Event, url: string) => {
    if (url !== win.webContents.getURL()) {
      e.preventDefault()
      shell.openExternal(url)
    }
  }

  // @ts-expect-error - no types
  win.webContents.on('will-navigate', handleRedirect)

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  return win
}

if (!app.requestSingleInstanceLock())
  app.quit()

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', async () => {
  if (!mainWindow)
    mainWindow = await createMainWindow()
})

; (async () => {
  await app.whenReady()

  mainWindow = await createMainWindow()
  mainWindow.focus()
})()
  .catch(console.error)
