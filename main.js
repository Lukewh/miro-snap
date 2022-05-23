const { app, BrowserWindow, session, shell } = require("electron");

let mainWindow;

const loadPlaceholder = () => {
  mainWindow
    .loadURL(`file://${__dirname}/index.html`)
    .then(() => {
      mainWindow.webContents.session.setPermissionRequestHandler(
        (webContents, permission, callback, details) => {
          console.log(webContents, permission, callback, details);
        }
      );
    })
    .catch((e) => {
      console.error(e);
    });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    icon: `${__dirname}/miro.png`,
    logo: `${__dirname}/miro.png`,
    show: false,
    backgroundColor: "rgb(255, 208, 47)",
  });

  mainWindow.removeMenu();

  mainWindow.loadURL("https://miro.com/app", {
    httpReferrer: {
      url: "https://miro.com/",
      policy: "same-origin",
    },
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
  });
  //loadPlaceholder();

  // mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "deny" };
    });
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createWindow);

app.on("activate", () => mainWindow === null && createWindow());

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
