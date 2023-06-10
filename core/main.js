const { app, BrowserWindow } = require('electron')
const serve = require('electron-serve')
const serveDist = serve({directory: 'dist'})


app.whenReady().then(
	async () => {
		const window = new BrowserWindow({
			width: 530,
			height: 290,
			autoHideMenuBar: true
		})

		await serveDist(window)

		window.loadURL('app://-')
	}
)