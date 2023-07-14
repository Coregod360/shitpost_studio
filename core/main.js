const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const serveDist = serve({directory: 'dist'});
const ipc = require('electron').ipcMain;

const path = require('path');
const fs = require('fs');

ipc.on('get-images', (event, arg) => {
	// Doesn't work and needs to be dynamicly determined from the user settings anyway
	let dir = path.join('home', 'kensix', 'Pictures', 'Shitposting', 'anime');
	let files = fs.readdirSync("/home/kensix/Pictures/Shitposting/anime/");
	event.reply('images', {files : files, dir : '/home/kensix/Pictures/Shitposting/anime/'});
})

app.whenReady().then(
	async () => {
		const window = new BrowserWindow({
			width: 800,
			height: 600,
			autoHideMenuBar: true,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
			}
		})

		await serveDist(window)

		window.loadURL('app://-')
		window.webContents.openDevTools()
	}
)