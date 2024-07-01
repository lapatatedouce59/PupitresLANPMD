const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('server_info', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping-test'),
    localip: ()=>ipcRenderer.invoke('localip'),
    status: () =>ipcRenderer.invoke('status')
})