import { app, BrowserWindow } from 'electron';

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 650,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    })
    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.VITE_DEV_SERVER_URL) {
        console.log('vite dev server url:', process.env.VITE_DEV_SERVER_URL)
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        win.webContents.openDevTools({mode:'right'})
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    });
});