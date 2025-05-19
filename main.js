const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
require("electron-reload")(__dirname);
const { exec } = require('child_process');
const os = require('os');

function createWindow () {
  const win = new BrowserWindow({
    width: 550,
    height: 550,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
  win.setMenu(null); // Disable default menu
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.on('download-url', (event, url, mp3Only) => {
  if (!url) return;
  const args = ['--no-warnings'];
  if (mp3Only) {
    args.push('--extract-audio', '--audio-format', 'mp3');
  }

  const outputPath = path.join(os.homedir(), 'Downloads', '%(title)s.%(ext)s');
  args.push('-o', `"${outputPath}"`);
  args.push(url);

  const command = `yt-dlp ${args.join(' ')}`;

  const child = exec(command);

  child.stdout.on('data', data => {
    event.sender.send('download-log', data.toString());
  });

  child.stderr.on('data', data => {
    event.sender.send('download-log', data.toString());
  });

  child.on('close', code => {
    event.sender.send('download-complete', code);
  });
});

// Quit the app from UI
ipcMain.on('quit-app', () => {
  app.quit();
});
