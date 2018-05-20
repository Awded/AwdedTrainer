const electron = require("electron");
const ipcMain = electron.ipcMain;
// Module to control application life.
const app = electron.app;
const Menu = electron.Menu;

const BrowserWindow = electron.BrowserWindow;
const nativeImage = electron.nativeImage;

const path = require("path");
const url = require("url");
const fs = require("fs");

let mainWindow;

const icon = nativeImage.createFromPath(path.join(__dirname, "icon.png"));
const audioPath = path.join(__dirname, "/audio/");
const debug = process.argv[2] == "debug";

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "AudioTrainer",
    titleBarStyle: "hidden",
    icon: icon
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "src/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.on("closed", quit);

  if (debug) {
    mainWindow.openDevTools({ detach: true });
  }
}

function quit() {
  app.quit();
}

app.on("ready", function() {
  createWindow();
});

app.on("window-all-closed", quit);

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
