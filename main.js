const { app, BrowserWindow } = require('electron')

app.whenReady().then(
	() => {
		const window = new BrowserWindow({
			width: 300,
			height: 200
		})

		window.loadFile('hello.html')
	}
)