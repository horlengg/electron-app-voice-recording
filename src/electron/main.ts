import { app, BrowserWindow } from 'electron'
import { isDev } from './util.js';
import path from 'path';

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({});
    if(isDev()){
        mainWindow.loadURL('http://localhost:3000');
    }else{
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-vue/index.html'));
    }
});