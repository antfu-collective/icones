export const isVSCode = location.protocol === 'vscode-webview:'
export const isLocalMode = isVSCode

export const basePath = isVSCode ? window.baseURI : '/'
export const staticPath = isVSCode ? window.staticURI : ''
