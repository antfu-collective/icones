import path from 'path'
import { BrowserWindow, Menu, Tray, app, dialog, nativeImage, shell } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import Store from 'electron-store'
import { showNotification } from './utils'

const store = new Store()
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let quitting = false

enum ELECTRON_STORE {
  /** Ask before exiting the app */
  close_behavior = 'close_behavior',
}

enum CLOSE_BEHAVIOR {
  quit,
  /** Minimize to tray */
  tray,
}

app.disableHardwareAcceleration()

const PROJECT_ROOT = path.resolve(__dirname, '../..')

const exitApp = () => {
  quitting = true
  app.quit()
}

const promptUserToExit = async (win: BrowserWindow) => {
  const { response, checkboxChecked } = await dialog.showMessageBox(win, {
    type: 'question',
    message: 'Do you want to quit or minimize to tray?',
    buttons: ['Quit and close', 'Minimize to tray'],
    checkboxLabel: 'Remember my choice',
    cancelId: 2,
  })

  if (checkboxChecked)
    store.set(ELECTRON_STORE.close_behavior, response)

  if (response === CLOSE_BEHAVIOR.tray)
    win.hide()
  else if (response === CLOSE_BEHAVIOR.quit)
    exitApp()
}

const clearStorage = async (win: BrowserWindow) => {
  await win.webContents.session.clearStorageData()
  win.reload()
  showNotification('Clear successfully')
}

const clearSetting = () => {
  store.delete(ELECTRON_STORE.close_behavior)
  showNotification('Reset successfully')
}

const createTray = (win: BrowserWindow) => {
  const iconPath = path.resolve(PROJECT_ROOT, app.isPackaged ? '../icon.png' : 'build/icon.png')
  const icon = nativeImage.createFromPath(iconPath)
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open App', click: () => win.show() },
    { type: 'separator' },
    { label: 'Clear User Data', click: () => clearStorage(win) },
    { label: 'Reset Settings', click: () => clearSetting() },
    { type: 'separator' },
    { label: 'Quit', click: () => exitApp() },
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip(app.name)
  tray.on('click', () => win.show())
}

const createMainWindow = async () => {
  const win = new BrowserWindow({
    title: app.name,
    show: false,
    width: 660,
    height: 500,
    minWidth: 200,
    minHeight: 200,
    titleBarStyle: 'hiddenInset',
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

  win.on('close', async (e) => {
    const closeBehavior = store.get(ELECTRON_STORE.close_behavior) as CLOSE_BEHAVIOR | undefined

    if (!quitting) {
      e.preventDefault()
      if (typeof closeBehavior !== 'number')
        await promptUserToExit(win)
      else if (closeBehavior === CLOSE_BEHAVIOR.tray)
        win.hide()
      else
        exitApp()
    }
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
  createTray(mainWindow)
  mainWindow.focus()
})()
  .catch(console.error)
