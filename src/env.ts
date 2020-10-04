export const isElectron = location.protocol === 'app:' || (process.env.NODE_ENV === 'development' && navigator.userAgent.includes('Electron'))
export const isVSCode = location.protocol === 'vscode-webview:'
export const isLocalMode = isElectron || isVSCode

export const basePath = isVSCode ? window.baseURI : '/'
export const staticPath = isVSCode ? window.staticURI : ''
