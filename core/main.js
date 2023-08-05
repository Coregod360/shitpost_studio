const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const serveDist = serve({directory: 'dist'});
const ipc = require('electron').ipcMain;
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');


const userDataPath = app.getPath('userData');
let config;
let imagePath;
let videoPath;

// TODO: Maybe needs to be done in a better way
async function getUserConfig(){
	config = fs.readFileSync(path.join(userDataPath, '/config.json'));
	let parsedConfig = JSON.parse(config);
	imagePath = parsedConfig.imageBasePath;
	videoPath = parsedConfig.videoBasePath;
}


ipc.on('get-user-config', (event, arg) => {
	let config = fs.readFileSync(path.join(userDataPath, '/config.json'));
	let parsedConfig = JSON.parse(config);
	imagePath = parsedConfig.imageBasePath;
	videoPath = parsedConfig.videoBasePath;
	console.log(parsedConfig);
	event.reply('user-config', parsedConfig);
})


ipc.on('get-images', (event, arg) => {
	// TODO: made Dir dynamic and based on user settings Also test sub folders
	let files = fs.readdirSync(imagePath);
	event.reply('images', {images : files});
	console.log('Getting images')
})


ipc.on('get-videos', (event, arg) => {
	let files = fs.readdirSync(videoPath);
	event.reply('videos', {videos : files});
	console.log('Getting videos')
})


ipc.on('download-video', (event, arg) => {
	console.log('Downloading video')
})


ipc.on('scan-images', (event, arg) => {
	// TODO: Add python code to scan folder and label images 
	console.log('Scanning images')
	const subprocess = spawn('python', [
		"-u", path.join(__dirname, '..', 'scripts', 'test.py'),
	   "--foo", "some value for foo",
	]);

	subprocess.stdout.on('data', (data) => {
		console.log(`data:${data}`);
	});
	subprocess.stderr.on('data', (data) => {
		console.log(`error:${data}`);
	});
	subprocess.stderr.on('close', () => {
		console.log("Closed");
	});

})


getUserConfig().then(() => {
	app.whenReady().then(
		async () => {
			const window = new BrowserWindow({
				width: 1200,
				height: 800,
				autoHideMenuBar: true,
				webPreferences: {
					webSecurity: false,
					nodeIntegration: true,
					contextIsolation: false,
				}
			})

			await serveDist(window)

			window.loadURL('app://-')
			window.webContents.openDevTools()
		}
	)
})