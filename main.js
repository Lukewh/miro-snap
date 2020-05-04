const { app, BrowserWindow, session } = require("electron");

let mainWindow;

const loadPlaceholder = () => {
  mainWindow.loadURL(`file://${__dirname}/index.html`).then(() => {
    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
      console.log(webContents, permission, callback, details);
    });
  }).catch((e) => { console.error(e); });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    icon: `${__dirname}/miro.png`,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    }
  });

  mainWindow.removeMenu();

  loadPlaceholder();
  
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createWindow);

app.on("activate", () => mainWindow === null && createWindow());

app.on(
  "window-all-closed",
  () => process.platform !== "darwin" && app.quit()
);
