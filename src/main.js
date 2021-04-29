import { fork } from "child_process";
import installExtension, {
	REDUX_DEVTOOLS,
	REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
const {
	app,
	BrowserWindow,
	nativeTheme,
	ipcMain,
	shell,
	autoUpdater,
	dialog,
} = require("electron");
const path = require("path");
const log = require("electron-log");
Object.assign(console, log.functions);

const isDevelopment = process.env.NODE_ENV === "development";

if (!isDevelopment) {
	const server = "https://keywordcrawler.leonardstruck.com";
	const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

	autoUpdater.setFeedURL(feed);

	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 10000);

	autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
		const dialogOpts = {
			type: "info",
			buttons: ["Restart", "Later"],
			title: "Application Update",
			message: process.platform === "win32" ? releaseNotes : releaseName,
			detail:
				"A new version has been downloaded. Restart the application to apply the updates.",
		};

		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) autoUpdater.quitAndInstall();
		});
	});

	autoUpdater.on("error", (message) => {
		console.error("There was a problem updating the application");
		console.error(message);
	});
}

process.env.APIFY_LOCAL_STORAGE_DIR = path.join(
	app.getPath("userData"),
	"apify_storage"
);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

let mainWindow;

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 700,
		show: false,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false,
		},
	});
	isDevelopment && installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]);

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	// Open the DevTools.
	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.show();
		isDevelopment && mainWindow.webContents.openDevTools();
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//get Theme

ipcMain.on("openUrl", (event, args) => {
	shell.openExternal(args);
});
ipcMain.handle("getDarkTheme", async (event) => {
	const result = nativeTheme.shouldUseDarkColors;
	return result;
});

ipcMain.handle("startCrawler", async (event, ...args) => {
	try {
		const crawler = fork(path.resolve(__dirname, "crawler/crawler.js"));
		crawler.send({ ...args });
		crawler.on("message", (msg) => {
			switch (msg.type) {
				case "currentCrawl":
					mainWindow.webContents.send("currentCrawl", msg.payload);
					break;
				case "keywordOccurance":
					mainWindow.webContents.send("keywordOccurance", msg.payload);
					break;
				default:
					console.log("message from crawler", msg);
					break;
			}
		});
		ipcMain.handleOnce("stopCrawler", () => {
			crawler.kill();
			return { status: "stopped" };
		});
		crawler.on("exit", () => {
			ipcMain.removeHandler("stopCrawler");
			mainWindow.webContents.send("crawlerDone");
		});
		return { status: "started" };
	} catch (err) {
		return { status: "error", err };
	}
});
