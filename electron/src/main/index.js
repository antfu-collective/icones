import { join } from 'path'
import { BrowserWindow, app, shell } from 'electron'

let mainWindow

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

  if (app.isPackaged)
    win.loadFile(join(__dirname, '../../dist/index.html'))
  else
    win.loadURL('http://localhost:3333/')

  win.on('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    mainWindow = undefined
  })

  win.removeMenu()

  const handleRedirect = (e, url) => {
    if (url !== win.webContents.getURL()) {
      e.preventDefault()
      shell.openExternal(url)
    }
  }

  win.webContents.on('will-navigate', handleRedirect)
  win.webContents.on('new-window', handleRedirect)

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
