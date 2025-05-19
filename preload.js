const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  downloadUrl: (url, mp3Only) => ipcRenderer.send('download-url', url, mp3Only),
  quitApp: () => ipcRenderer.send('quit-app'),
  onDownloadLog: (callback) => ipcRenderer.on('download-log', (event, data) => callback(data)),
  onDownloadComplete: (callback) => ipcRenderer.on('download-complete', (event, code) => callback(code)),
  onUpdateLog: (callback) => ipcRenderer.on('update-log', (event, data) => callback(data)),
  onUpdateComplete: (callback) => ipcRenderer.on('update-complete', (event, code) => callback(code)),
})

