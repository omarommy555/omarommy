const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jarvisDesktop", {
  getSystemInfo: () => ipcRenderer.invoke("jarvis:system-info"),
  openExternal: (url) => ipcRenderer.invoke("jarvis:open-external", url),
  openConfig: () => ipcRenderer.invoke("jarvis:open-config"),
  speak: (text) => ipcRenderer.invoke("jarvis:speak", text),
  stopSpeaking: () => ipcRenderer.invoke("jarvis:stop-speaking")
});
