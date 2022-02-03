import {
    app,
    BrowserWindow,
    BrowserView,
    globalShortcut,
    dialog,
    Menu,
    ipcMain,
    Tray,
    nativeImage,
} from "electron";
const windowManager = require('electron-window-manager');
const electronLocalshortcut = require('electron-localshortcut');

const i18n = require("i18n");
const isDev = require("electron-is-dev");
const menuTemplate = require('./menu')
const path = require('path')
const config = require('../../config/index.js')
import { token, setUserStore, windowHide, getUserStore, getChatLocalMsgStore } from '../tool/storage'
import ipcMainFun from '../tool/ipcMain'
import { newWindow } from './AppWindow'


/* i18n config */
i18n.configure({
        updateFiles: false,
        locales: ['zh', 'en'],
        directory: path.join(__dirname, isDev ? '../../static' : './static', 'locales'),
        defaultLocale: 'zh'
    })
    // 切换语言
    // change Language
let userInfo = getUserStore('userCommon');
let lang;
if (userInfo) {
    const isObject = (obj) => {
        return Object.prototype.toString.call(obj) === "[object Object]";
    }
    const hasKey = (obj, key) => {
        return isObject(obj) ? obj.hasOwnProperty(key) : false
    }
    if (hasKey(userInfo, "id")) {
        let id = userInfo.id || ''
        lang = getChatLocalMsgStore('Language', id + '')
    }
}
i18n.setLocale(lang || 'zh')

if (lang = !'zh') {

}
// const windowStateKeeper = require('electron-window-state');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}


let mainWindowPro
let splash
let MAINURL = `http://localhost:${config.host}`
const winURL = process.env.NODE_ENV === 'development' ?
    MAINURL :
    `file://${__dirname}/index.html`
    // let win;
let tray = null
app.isQuiting = false;
let winC = 0
    // 忽略证书相关错误
    // app.commandLine.appendSwitch("ignore-certificate-errors");

function createWindow(mainWindow) {
    winC++
    let menu = Menu.buildFromTemplate(menuTemplate.template(i18n, app))
    Menu.setApplicationMenu(menu)
    mainWindow = windowManager.createNew(i18n.__("NewEra") + winC, i18n.__("NewEra") + winC, winURL, false, {
        width: 450,
        height: 700,
        useContentSize: true,
        resizable: true,
        webPreferences: {
            // webSecurity: false,
            // devTools: false,
            nodeIntegration: true, // 添加这一配置
        },
        menu: null,
        show: true,
        icon: path.join(__static, "/icon.png"),
    });


    mainWindow.create()
    ipcMainFun(mainWindow, app, i18n)
    mainWindow.object.show()
    handleTray(mainWindow)
    mainWindow.registerShortcut('CmdOrCtrl+N', function() {
        let mainWindowF
        createWindow(mainWindowF)

    });
    /* splash = new BrowserWindow({
        width: 450,
        height: 750,
    });
    splash.loadFile(path.join(__static, '/splash.html')) */
    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__static, '/icon.png'));
        // 设置扩展栏菜单
        // Set the extension bar menu
        const dockMenu = Menu.buildFromTemplate([{
            label: 'New Window',
            click() {
                let mainWindowF
                createWindow(mainWindowF)
            }
        }])

        app.dock.setMenu(dockMenu)
    }

    //require("electron-debug")({ showDevTools: true });
    // mainWindow.getNormalBounds()

    // let installed = BrowserWindow.getDevToolsExtensions()
    // console.log(installed);

    mainWindow.content().on('close', (event) => {
        // 回收BrowserWindow对象
        // 窗口缩小到最小才能关闭程序
        /* if (mainWindow.isMinimized() || app.isQuiting) {
            mainWindow = null;
        } else {
            event.preventDefault();
            // mainWindow.minimize();
            app.isQuiting = false

            console.log(tray, 'istray')

            if (loginStore.get("isLogin")) {
                console.log("设置loginStore为false");
                loginStore.set("isLogin", false)
                console.log(loginStore.get("isLogin"), 'islogin??')
            }
            mainWindow.hide();
            mainWindow.setSkipTaskbar(true);
        } */


    });
    // console.log('关闭主窗口')
    mainWindow.content().on('closed', () => {
        console.log('23333close')

        //mainWindow = null;

    })

    // const view = new BrowserView();
    // app.dock.setBadge('.');
    mainWindow.content().on('focus', () => {

        if (windowHide.get('isHide')) {
            windowHide.set("isHide", false)
                //mainWindow.webContents.send('windowHideReceipt');

        }

        //console.log('focus',windowHide.get("isHide"))
    })
    mainWindow.content().on('blur', () => {
        // 弹跳功能 information 只跳一次 critical 直到窗口激活才会停止
        // app.dock.bounce("critical");
        // 更改底部扩展栏图标
        // app.dock.setIcon(path.join(__static, '/appicon.png'));

        // 冒泡信息提示
        // const badgeString = app.dock.getBadge();
        // console.log(badgeString,'badgeString')

        // if (badgeString === '') {
        //   app.dock.setBadge('1');
        //   console.log(badgeString,'2333badgeString')
        // } else {
        //   app.dock.setBadge((parseInt(badgeString) + 1).toString());
        // }

        // let countssss = app.badgeCount;
        //mainWindow.reload();
        windowHide.set("isHide", true)

        //console.log('countssss',windowHide.get("isHide"))
        // // if (badge.count > 0) {
        // //     app.dock.setBadge('12345654');
        // // } else {
        // //     app.dock.setBadge('99000');
        // // }
        // if (app.badgeCount > 0) {
        //     app.dock.setBadge('12345654');
        // } else {
        //     app.dock.setBadge('99000');
        // }
        // if (process.platform === 'darwin') {
        //     app.dock.setBadge('2');
        //     app.setBadgeCount(2);

        // }



    });


    // 生产环境
    // if (!isDev) {
    //   mainWindow.webContents.closeDevTools();
    //   // 快捷键禁用打开控制台
    globalShortcut.register("CommandOrControl+Shift+I", () => {
        let focusWin = BrowserWindow.getFocusedWindow()
        focusWin && focusWin.toggleDevTools()
        console.log("globalShortcut");
    });
    globalShortcut.register("Command+R", () => {
        return false;
    });
    //   globalShortcut.register("CommandOrControl+Option+I", () => {
    //     // let focusWin = BrowserWindow.getFocusedWindow()
    //     // focusWin && focusWin.toggleDevTools()
    //     console.log("tiaoshi2");
    //   });
    // }
    // createLoginWins()

    mainWindow.onReady(true, function(window) {
        console.log('test ggg')


    });



    // 崩溃重启
    // reLive(mainWindow);



}




//...
// 第二个实例打开时执行的程序
const gotTheLock = app.requestSingleInstanceLock();

//app.on("second-instance", (event, commandLine, workingDirectory) => {

//});
if (!gotTheLock) {
    app.quit();
} else {
    app.on("newSession", (event, commandLine, workingDirectory) => {
        let mainWindowF
        createWindow(mainWindowF)
            //createWindowPro();
            // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
            // setTimeout(function() {
            // splash.close();
            //mainWindowPro.show();
            //dialog.showMessageBox(mainWindow, {
            //	title: "second",
            //	message: "second:" + `argv.join("")`,
            //});
            // }, 2000);
            //if (mainWindow) {
            //	if (mainWindow.isMinimized()) mainWindow.restore();
            //	mainWindow.focus();
            //    dialog.showMessageBox(mainWindow, {
            //		title: "second",
            //		message: "second:" + `argv.join("")`,
            //	});
            //}
    });

    // 创建 mainWindow, 加载应用的其余部分, etc...

}
//app.on('ready', () => {


//})
app.on('ready', function() {
    let mainWindowF
    createWindow(mainWindowF)
});

app.on('before-quit', () => {
    console.log('2333强制退出前！！！')
    app.isQuiting = true
})
app.on('quit', () => {
    console.log('2333强制退出了2333！！！')
        /* if (loginStore.get("isLogin")) {
            loginStore.set("isLogin", false)

            console.log(loginStore.get("isLogin"), 'islogin??')
        } */
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        console.log('强制退出！！！')
        app.quit()
    }
})

// 当应用被激活时发出。 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。
app.on('activate', () => {
    app.isQuiting = false
        /* if (!mainWindow || mainWindow === null) {
            //createWindow()

        } else {
            // mainWindow.object.show()
        } */

})


// 崩溃重启
function reLive(mainWindowS) {
    // const mainWindowS = BrowserWindow.fromId(global.mainId);
    mainWindowS.webContents.on('crashed', () => {
        const options = {
            type: 'error',
            title: '进程崩溃了',
            message: '这个进程已经崩溃.',
            buttons: ['重载', '退出'],
        };
        recordCrash().then(() => {
            dialog.showMessageBox(options, (index) => {
                if (index === 0) reloadWindow(mainWindowS);
                else app.quit();
            });
        }).catch((e) => {
            console.log('err', e);
        });
    })

    function recordCrash() {
        return new Promise(resolve => {
            // 崩溃日志请求成功.... 
            resolve();
        })
    }

    function reloadWindow(mainWin) {

        if (mainWin.isDestroyed()) {
            app.relaunch();
            app.exit(0);
        } else {
            BrowserWindow.getAllWindows().forEach((w) => {
                if (w.id !== mainWin.id) w.destroy();
            });
            console.log('testhjhjdshjds')
            mainWin.reload();
        }
    }
}


function handleTray(mainWindow) {
    console.log('设置托盘')
    let timer = null
    let count = 0
        // if (process.platform === 'darwin') {
        //   tray = new Tray(nativeImage.createEmpty());
        //   // tray.setImage();
        //   const imgages = nativeImage.createFromPath(path.resolve(__dirname, '../../build/icons/icon.ico'))
        //   imgages.setTemplateImage(true)
        //   // imgages.isMacTemplateImage(true)
        //   tray = new Tray(imgages)
        // }else{
        //   tray = new Tray(`${__static}/icon.ico`)
        // }

    const MenuTray = Menu.buildFromTemplate([{
            label: i18n.__('openSC'),
            click: () => {
                console.log(mainWindow, 'test')
                if (mainWindow && mainWindow.object) {
                    mainWindow.object.show();
                } else {
                    windowManager.get('NewEra1').object.show()
                }
            }
        },
        {
            label: i18n.__('exitProgram'),
            click: () => {
                app.isQuiting = true
                app.quit()
            }
        },
        // {
        //   label: 'for radio',
        //   click: () => {
        //     console.log(234567654567)
        //     // shell.openExternal('https://frequencecountry.mirandais.fr')
        //   }
        // },
        // {
        //   label: 'for facebook',
        //   click: () => {
        //     console.log(234567654567)
        //     // shell.openExternal('https://www.facebook.com/Frequence-Country-862322540540302/')
        //   }
        // },
        // {
        //   label: 'ping',
        //   click: () => {
        //     mainWindow.webContents.send('ping')
        //   }
        // }
    ])

    //mainWindow.setSkipTaskbar(true)

    let unread
    let read

    if (isDev) {
        unread = path.join(__dirname, '../../static/icons/icons.png')
        read = path.join(__dirname, '../../static/icons/icons.png')
    } else {
        unread = path.join(__dirname, '/static/icons/icons.png')
        read = path.join(__dirname, '/static/icons/icons.png')
    }

    let imgRead = nativeImage.createFromPath(read)
    let imgUnread = nativeImage.createFromPath(unread)

    // let tray = new Tray(imgages)

    // let tray = new Tray(imgRead)
    // tray.setImage(imgUnread)
    // tray.destroy()

    tray = new Tray(imgRead)

    // tray.setImage(imgUnread)

    tray.setToolTip('tipszzzz')
    tray.setContextMenu(MenuTray)

    // // 双击 托盘图标 打开窗口
    // tray.on('double-click',function(){
    //     mainWindow.show()
    // })

}


let createLoginWins = () => {

    Menu.setApplicationMenu(null) // 关闭子窗口菜单栏
    const modalPath = process.env.NODE_ENV === 'development' ?
        `${MAINURL}/#/login` :
        `file://${__dirname}/index.html#login`
        // 使用hash对子页面跳转，这是vue的路由思想
        // loginWindow = new BrowserWindow({
        //   width: 600,
        //   height: 400,
        //   webPreferences: {
        //     webSecurity: false
        //   },
        //   parent: mainWindow // mainWindow是主窗口
        // })
    loginWindow = new newWindow({
        width: 470,
        height: 800,
        webPreferences: {
            devTools: false,
            nodeIntegration: true,
        },
        parent: mainWindow,
        devTools: false,
    })
    loginWindow.setResizable(false)
    loginWindow.loadURL(modalPath)

    loginWindow.on('closed', () => {
        console.log('test')
            // 登录窗口的处理 关闭登陆窗口需要设置mainWindow = null
        mainWindow = null
        loginWindow = null
    })

}

function handleTrayPro() {
    console.log("设置托盘");
    let timer = null;
    let count = 0;
    // if (process.platform === 'darwin') {
    //   tray = new Tray(nativeImage.createEmpty());
    //   // tray.setImage();
    //   const imgages = nativeImage.createFromPath(path.resolve(__dirname, '../../build/icons/icon.ico'))
    //   imgages.setTemplateImage(true)
    //   // imgages.isMacTemplateImage(true)
    //   tray = new Tray(imgages)
    // }else{
    //   tray = new Tray(`${__static}/icon.ico`)
    // }

    const MenuTray = Menu.buildFromTemplate([{
            label: i18n.__("openSC"),
            click: () => {
                mainWindowPro.show();
            },
        },
        {
            label: i18n.__("exitProgram"),
            click: () => {
                app.isQuiting = true;
                app.quit();
            },
        },
        // {
        //   label: 'for radio',
        //   click: () => {
        //     console.log(234567654567)
        //     // shell.openExternal('https://frequencecountry.mirandais.fr')
        //   }
        // },
        // {
        //   label: 'for facebook',
        //   click: () => {
        //     console.log(234567654567)
        //     // shell.openExternal('https://www.facebook.com/Frequence-Country-862322540540302/')
        //   }
        // },
        // {
        //   label: 'ping',
        //   click: () => {
        //     mainWindowPro.webContents.send('ping')
        //   }
        // }
    ]);

    mainWindowPro.setSkipTaskbar(true);

    let unread;
    let read;

    if (isDev) {
        unread = path.join(__dirname, "../../static/icons/icons.png");
        read = path.join(__dirname, "../../static/icons/icons.png");
    } else {
        unread = path.join(__dirname, "/static/icons/icons.png");
        read = path.join(__dirname, "/static/icons/icons.png");
    }

    let imgRead = nativeImage.createFromPath(read);
    let imgUnread = nativeImage.createFromPath(unread);

    // let tray = new Tray(imgages)

    // let tray = new Tray(imgRead)
    // tray.setImage(imgUnread)
    // tray.destroy()

    tray = new Tray(imgRead);

    // tray.setImage(imgUnread)

    tray.setToolTip("tipszzzz");
    tray.setContextMenu(MenuTray);

    // // 双击 托盘图标 打开窗口
    // tray.on('double-click',function(){
    //     mainWindowPro.show()
    // })
}