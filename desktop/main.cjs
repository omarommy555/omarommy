const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { spawn } = require("node:child_process");
const path = require("node:path");

let mainWindow;
let apiProcess;

function startApi() {
  const serverDir = path.join(__dirname, "..", "server");
  const entry = path.join(serverDir, "index.js");
  apiProcess = spawn(process.env.JARVIS_NODE_PATH || "node", [entry], {
    cwd: serverDir,
    env: { ...process.env, HOST: "127.0.0.1" },
    stdio: "inherit"
  });
  apiProcess.on("error", (error) => console.error("JARVIS API could not start:", error.message));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1000,
    minHeight: 700,
    title: "JARVIS 2.0",
    backgroundColor: "#050b16",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("jarvis:open-external", async (_event, url) => {
  if (typeof url !== "string") return false;
  let parsed;
  try { parsed = new URL(url); } catch { return false; }
  if (!["https:", "http:"].includes(parsed.protocol)) return false;
  await shell.openExternal(parsed.toString());
  return true;
});

ipcMain.handle("jarvis:system-info", () => ({
  platform: process.platform,
  release: require("node:os").release(),
  appVersion: app.getVersion()
}));

app.whenReady().then(() => {
  startApi();
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on("before-quit", () => {
  if (apiProcess && !apiProcess.killed) apiProcess.kill();
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
