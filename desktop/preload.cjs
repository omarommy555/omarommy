const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jarvisDesktop", {
  getSystemInfo: () => ipcRenderer.invoke("jarvis:system-info"),
  openExternal: (url) => ipcRenderer.invoke("jarvis:open-external", url)
});
