export const isElectron = location.protocol === 'app:' || (process.env.NODE_ENV === 'development' && navigator.userAgent.includes('Electron'))
export const isVSCode = location.protocol === 'vscode-webview:'
// @ts-ignore
export const basePath = isVSCode ? window.baseURI : '/'
// @ts-ignore
export const staticPath = isVSCode ? window.staticURI : '' 