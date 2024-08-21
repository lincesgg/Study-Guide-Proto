import {app, BrowserWindow, ipcMain} from "electron";
import createStaticServer from "./src/controller/createStaticServer.js";
import path from "node:path";
import fs from "node:fs/promises"
import fsSync from "node:fs"

const contentDataFilePath = "./contentData.json"

const createWindow = (URL) => {
    const newWindow = new BrowserWindow({
        width: 800,
        height: 450,
        webPreferences: {
            preload: path.join(import.meta.dirname, "preload.cjs")
        }
    })
    newWindow.webContents.openDevTools()
    newWindow.loadURL(URL)
}

const reactServer = createStaticServer(path.join(import.meta.dirname, "/dist"))
const onServerOpenPromise = new Promise((res) => {
    reactServer.listen(0, "localhost", () => {
        res()
    })
})

ipcMain.handle("saveContents", (event, strigfiedContentsJSON) => {
    console.log("aaaax")
    return fs.writeFile(contentDataFilePath, strigfiedContentsJSON)
})

ipcMain.handle("getSavedContent", async (event) => {
    return fsSync.readFileSync(contentDataFilePath, {encoding:"utf-8"})
})

app.on("ready", async () => {
    // await onServerOpenPromise;
    // const reactServerPort = reactServer.address().port

    // createWindow(`http://localhost:${reactServerPort}`)
    createWindow(`http://localhost:3001`)

    app.on("activate", () => {
        if (app.getAllWindows().length == 0)
            createWindow()
    })

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin")  
            app.quit()
    })
})
