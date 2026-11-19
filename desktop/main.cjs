const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let mainWindow;
let apiServer;
let envPath;

function prepareSettings() {
  envPath = app.isPackaged
    ? path.join(app.getPath("userData"), "server.env")
    : path.join(__dirname, "..", "server", ".env");
  if (!fs.existsSync(envPath)) {
    fs.mkdirSync(path.dirname(envPath), { recursive: true });
    fs.writeFileSync(envPath, "# JARVIS private AI provider settings\nGROQ_API_KEY=\nGROQ_MODEL=llama-3.3-70b-versatile\nHF_TOKEN=\n", { mode: 0o600 });
  }
  try { fs.chmodSync(envPath, 0o600); } catch {}
}

async function startApi() {
  const entry = path.join(__dirname, "server", "index.js");
  process.env.HOST = "127.0.0.1";
  process.env.JARVIS_ENV_PATH = envPath;
  const api = await import(pathToFileURL(entry).href);
  apiServer = api.server;
  await new Promise((resolve, reject) => {
    if (apiServer.listening) return resolve();
    apiServer.once("listening", resolve);
    apiServer.once("error", reject);
  });
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

ipcMain.handle("jarvis:open-config", async () => {
  prepareSettings();
  return shell.openPath(envPath);
});

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
  appVersion: app.getVersion(),
  architecture: process.arch
}));

app.whenReady().then(async () => {
  prepareSettings();
  try { await startApi(); }
  catch (error) { console.error("JARVIS local API failed to start:", error); }
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on("before-quit", () => {
  if (apiServer?.listening) apiServer.close();
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
