const path = require('path')
const Store = require('electron-store')
const openElseWin = require('../main/menu').openElseWin
const { BrowserWindow } = require('electron')
const windowManager = require('electron-window-manager');

const settingStore = new Store({
    name: 'Settings'
})
import { ipcMain } from "electron";
import { newWindow } from '../main/AppWindow'
import { setUserStore, setChatLocalMsgStore, loginStore } from './storage'


const isDev = require("electron-is-dev");
const fixPath = () => {
    var icon
    var contentImage
    var open
    if (isDev) {
        icon = path.join(__dirname, 'a.png')
        contentImage = path.join(__dirname, 'a.png')
        open = path.join(__dirname, 'a.png')
    } else {
        icon = path.join(__dirname, "/static/icon.png");
        contentImage = path.join(__dirname, "/static/icon.png");
        open = path.join(__dirname, "/static/icon.png");
    }

    return {
        icon,
        contentImage,
        open
    }
}

var nodeConsole = require('console');
let { icon, contentImage, open } = fixPath()
var consoles = new nodeConsole.Console(process.stdout, process.stderr);
consoles.log('Hello World!', path.join(__dirname));

export const ipcToNotify = (arg) => {
    return new Promise(resolve => {
        ipcRenderer.send('ipcToNotify', arg)
        resolve()
    });
}

const ipcMainFun = (mainWindow, app, i18n, newSession) => {
    if (newSession) {
        mainWindow.object.webContents.send('OpenNewSession')
    }

    let settingsWindow
    ipcMain.on('synchronous-message', (event, arg) => {
        if (arg === 'center') {
            mainWindow.center()
            console.log("window 居中显示")
                // mainWindowState.manage(mainWindow);
        }
    })


    // 点击菜单设置选项创建新窗口
    ipcMain.on('open-settings-window', () => {
        const settingsWindowConfig = {
                width: 500,
                height: 400,
                webPreferences: {
                    devTools: false,
                    nodeIntegration: true,
                },
                parent: mainWindow
            }
            // 适配好打包路径 => 统一 => package.json => ok
        let settingsFilePath;

        // 生产环境
        // if (!isDev) {
        //   const settingsFileLocation = path.join('file://' + process.cwd(), __dirname, '../settings/settings.html')
        //   settingsFilePath = settingsFileLocation

        // }else{
        //   const settingsFileLocations = path.join('file://' + process.cwd(), '../settings/settings.html')
        //   settingsFilePath = settingsFileLocations
        //   console.log(settingsFileLocations,'settingsFileLocations')
        // }

        const settingsFileLocationz = path.join('file://' + process.cwd(), __dirname, '../settings/settings.html')
        settingsFilePath = settingsFileLocationz



        settingsWindow = new newWindow(settingsWindowConfig)
        settingsWindow.loadURL(settingsFilePath)
        settingsWindow.once('ready-to-show', () => {
            //this.show()
        })
        settingsWindow.removeMenu()
        settingsWindow.on('closed', () => {
            //settingsWindow = null
        })
    })

    // 根据设置动态修改云同步菜单状态
    ipcMain.on('config-is-saved', () => {
        // mac和windows应用菜单位置不一样
        // let qiniuMenu = process.platform === 'darwin' ? menu.items[3] : menu.items[2]
        // const switchItems = (toggle) => {
        //   [1, 2, 3].forEach(number => {
        //     qiniuMenu.submenu.items[number].enabled = toggle
        //   })
        // }
        [
            'accessKey',
            'secretKey',
            'bucket'
        ].some(key => console.log("key", key, settingStore.get(key)))


    })


    // 调整窗口大小
    ipcMain.on('resize', (event, arg) => {
        //mainWindow.resize(arg).restore();
    })

    // 登陆处理逻辑
    ipcMain.on('logined', (event, arg) => {
        console.log('test aaaaa bendada dev')
        windowManager.getCurrent().resize(1300, 750).restore();
        windowManager.getCurrent().object.center()
    })
    ipcMain.on('logout', (event, arg) => {
            windowManager.getCurrent().resize(450, 750).restore();

            windowManager.getCurrent().object.center()
                // windowManager.getCurrent().object.center()

        })
        //
    ipcMain.on("notify", (evt, dataMsgNotDis, data, msgType, title, logoIcon) => {
        const eNotify = require('electron-notify');
        const { msg, logo } = data;

        if (dataMsgNotDis === 1) {
            return
        }
        eNotify.setConfig({
            appIcon: icon,
            displayTime: 10000,
            border: '1px solid #CCC',
            defaultStyleText: {
                color: 'green',
                fontWeight: 'bold'
            },
            defaultStyleContainer: {
                backgroundColor: '#f0f0f0',
                overflow: 'hidden',
                padding: 8,
                border: '1px solid #CCC',
                fontFamily: 'Arial',
                fontSize: 12,
                position: 'relative',
                lineHeight: '15px',
                top: 0
            },
            defaultStyleAppIcon: {
                overflow: 'hidden',
                float: 'right',
                height: 40,
                width: 40,
                marginRight: 15,
            },
            defaultStyleImage: {
                overflow: 'hidden',
                float: 'left',
                height: 40,
                width: 40,
                marginRight: 10,
                borderRadius: '50%',
            },

        });
        eNotify.notify({
            title: title || 'data',
            text: JSON.parse(msg).message || msgType || 'data2',
            //closeLabel: 'Close', // String. Label for cancel button
            //actions: 'show', // String | Array<String>. Action label or list of labels in case of dropdown
            image: logoIcon,
            onClickFunc: function() {
                //console.log(data,'icon:'+logoIcon)
                mainWindow.show();
                mainWindow.object.webContents.send('OpenChat', data);
                //eNotify.closeAll()
            },

        });

    });

    ipcMain.on("changeLang", (evt, lang, info) => {
        // console.log('get_lang', lang, info.id)
        // return 
        if (info && info.id) {
            setUserStore("userCommon", { id: info.id });
            setChatLocalMsgStore("Language", info.id, lang);
        } else {
            setUserStore("userCommon", { id: "unpass_user" });
            setChatLocalMsgStore("Language", "unpass_user", lang);
        }
        // return
        //app.isQuiting = true
        /* app.quit()
        // todo windows 使用
        openElseWin() */
        app.relaunch();
        app.exit(0);
    })
    ipcMain.on("refresh", () => {
        app.isQuiting = true
            /* app.quit()
            // todo windows 使用
            openElseWin() */
        app.relaunch();
        app.exit(0);
    })
    ipcMain.on("reload", () => {
        /* if (mainWindow.isDestroyed()) {
            app.relaunch();
            app.exit(0);
        } else { */
        /* BrowserWindow.getAllWindows().forEach((w) => {
            if (w.id !== mainWindow.id) w.destroy();
        }); */
        mainWindow.reload();

    })
}

export default ipcMainFun