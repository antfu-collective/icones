export const isElectron = location.protocol === 'app:' || (process.env.NODE_ENV === 'development' && navigator.userAgent.includes('Electron'))
