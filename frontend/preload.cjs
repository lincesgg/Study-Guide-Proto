const {ipcRenderer, contextBridge} = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
    saveContent: (contents) => ipcRenderer.invoke("saveContents", contents),
    getSavedContent: () => ipcRenderer.invoke("getSavedContent")
})