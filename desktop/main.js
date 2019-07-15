const { app, BrowserWindow } = require("electron")

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {},
  })

  if (process.env.NODE_ENV === "production") {
    win.loadFile("../build/index.html")
  } else {
    win.loadURL(`http://localhost:8080/`)
  }
}

app.on("ready", createWindow)
